import i18next from 'i18next';
import onChange from 'on-change';
import render from './render';
import parser from './parser';
import { getContent, addNewPosts, validateUrl } from './util';
import resources from './locales/index';

const { en, ru } = resources;
i18next.init({
  lng: 'en',
  debug: true,
  resources: {
    en,
    ru,
  },
});

export default () => {
  const state = {
    state: 'filling',
    feeds: [],
    posts: [],
    links: [],
    errors: '',
    modal: {
      state: 'hidden',
      id: 0,
    },
  };

  const watchedState = onChange(state, (path, value) => render(watchedState, path, value));

  const postList = document.querySelector('#posts');
  postList.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      watchedState.posts[e.target.id].state = 'viewed';
    }
    if (e.target.tagName === 'BUTTON') {
      watchedState.posts[e.target.id].state = 'viewed';
      state.modal.id = e.target.id;
      watchedState.modal.state = 'show';
      state.modal.state = 'hidden';
    }
  });

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.state = 'sending';
    const input = document.querySelector('input');
    const url = input.value;

    if (validateUrl(url, state.links) === true) {
      getContent(url)
        .then((data) => {
          const [feed, posts] = parser(data.contents);
          state.feeds = [feed, ...state.feeds];
          state.posts = [...posts, ...state.posts];
          state.links.push(url);
          watchedState.state = 'finished';
          form.reset();
          input.focus();
        })
        .catch((error) => {
          state.errors = error;
          watchedState.state = 'failed';
          /*
          if (error.message === 'Network Error' && !error.response) {
            state.errors = 'Network error';
            watchedState.state = 'failed';
          } else {
            state.errors = i18next.t('validateErrors.notRss');
            watchedState.state = 'failed';
          }
          */
        })
        .finally(function updating() {
          setTimeout(() => {
            const promises = state.links.map((link) => {
              const result = addNewPosts(link, state.posts).then((newPosts) => {
                state.posts = [...newPosts, ...state.posts];
              });
              return result;
            });
            Promise.all(promises).then(() => {
              watchedState.state = 'updating';
              state.state = 'filling';
              updating();
            });
          }, 5000);
        });
    } else {
      state.errors = validateUrl(url, state.links);
      watchedState.state = 'failed';
    }
  });
};

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

  const form = document.querySelector('#formButton');
  form.addEventListener('click', (e) => {
    e.preventDefault();
    watchedState.state = 'sending';
    const input = document.querySelector('input');
    const url = input.value;

    validateUrl(url, state.links)
      .then(() => {
        getContent(url)
          .then((data) => {
            const [feed, posts] = parser(data.contents);
            state.feeds = [feed, ...state.feeds];
            state.posts = [...posts, ...state.posts];
            state.links.push(url);
            watchedState.state = 'finished';
            // form.reset();
            // input.focus();
          })
          .catch(() => {
            state.errors = i18next.t('validateErrors.notRss') + url;
            watchedState.state = 'failed';
          })
          .finally(function updating() {
            const promises = state.links.map((link) => {
              const result = addNewPosts(link, state.posts).then((newPosts) => {
                state.posts = [...newPosts, ...state.posts];
              });
              return result;
            });
            Promise.all(promises).then(() => {
              setTimeout(() => {
                watchedState.state = 'updating';
                state.state = 'filling';
                updating();
              }, 5000);
            });
          });
      })
      .catch((err) => {
        state.errors = err.message;
        watchedState.state = 'failed';
      });
  });
};

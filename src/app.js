import i18next from 'i18next';
import onChange from 'on-change';
import render from './render';
import parser from './parser';
import { getContent, getNewPosts, validateUrl } from './util';

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

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
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
            form.reset();
            input.focus();
          })
          .catch(() => {
            state.errors = i18next.t('validateErrors.notRss');
            watchedState.state = 'failed';
          })
          .finally(function updating() {
            const hrefs = document.querySelector('main').querySelectorAll('a');
            hrefs.forEach((href) => {
              href.addEventListener('click', (el) => {
                watchedState.posts[el.target.id].state = 'viewed';
              });
            });
            const buttons = document.querySelector('main').querySelectorAll('button');
            buttons.forEach((button) => {
              button.addEventListener('click', (el) => {
                watchedState.posts[el.target.id].state = 'viewed';
                state.modal.id = el.target.id;
                watchedState.modal.state = 'show';
                state.modal.state = 'hidden';
              });
            });

            const promises = state.links.map((link) => {
              const result = getNewPosts(link, state.posts).then((newPosts) => {
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

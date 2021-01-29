import i18next from 'i18next';
import * as yup from 'yup';
import _ from 'lodash';
import initView from './view';
import parser from './parser';
import { getContent, addNewPosts, validateUrl } from './util';
import resources from './locales/index';

export default () => {
  const { en, ru } = resources;
  i18next.init({
    lng: 'en',
    debug: true,
    resources: {
      en,
      ru,
    },
  });

  yup.setLocale({
    mixed: {
      required: i18next.t('errors.required'),
      notOneOf: i18next.t('errors.duplicate'),
    },
    string: {
      url: i18next.t('errors.url'),
    },
  });

  const state = {
    form: {
      state: 'filling',
      errors: null,
    },
    feeds: [],
    posts: [],
    uiState: {
      posts: [],
    },
    links: [],
    modal: {
      state: 'hidden',
      id: null,
    },
  };

  const watched = initView(state);

  const postList = document.querySelector('#posts');
  postList.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      watched.uiState.posts.find((post) => post.id === e.target.id).visibality = 'viewed';
    }
    if (e.target.tagName === 'BUTTON') {
      watched.uiState.posts.find((post) => post.id === e.target.id).visibality = 'viewed';
      state.modal.id = e.target.id;
      watched.modal.state = 'show';
      state.modal.state = 'hidden';
    }
  });

  const input = document.querySelector('input');
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watched.form.state = 'sending';
    const url = input.value;

    const { status, error } = validateUrl(url, state.links);
    if (!status) {
      state.form.errors = error;
      watched.form.state = 'failed';
    } else {
      getContent(url)
        .then((data) => {
          const { feed, posts } = parser(data.contents);
          state.feeds.unshift(feed);
          posts.forEach((post) => {
            const id = _.uniqueId();
            state.posts.unshift({ ...post, id });
            state.uiState.posts.unshift({ id, visibality: 'hidden' });
          });
          state.links.push(url);
          watched.form.state = 'finished';
        })
        .catch((err) => {
          // Refactoring check
          if (err.message === 'Network error') {
            state.form.errors = i18next.t('errors.network');
            watched.form.state = 'failed';
          } else {
            state.form.errors = i18next.t('errors.notRss');
            watched.form.state = 'failed';
          }
        })
        .finally(function updating() {
          setTimeout(() => {
            const promises = state.links.map((link) => {
              const result = addNewPosts(link, state.posts).then((newPosts) => {
                newPosts.forEach((post) => {
                  const id = _.uniqueId();
                  console.log(id);
                  state.posts.unshift({ ...post, id });
                  state.uiState.posts.unshift({ id, visibality: 'hidden' });
                });
              });
              return result;
            });
            Promise.all(promises).then(() => {
              watched.form.state = 'updating';
              state.form.state = 'filling';
              updating();
            });
          }, 5000);
        });
    }
  });
};

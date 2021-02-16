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
    updatingStatus: 'waiting',
    feeds: [],
    posts: [],
    uiState: {
      posts: [],
    },
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

    const declaredLinks = state.feeds.map(({ link }) => link);
    const validationError = validateUrl(url, declaredLinks);
    if (validationError) {
      state.form.errors = validationError;
      watched.form.state = 'failed';
    } else {
      getContent(url)
        .then((data) => {
          const { feed, posts } = parser(data.contents);
          state.feeds.unshift({ ...feed, link: url });
          const postsWithId = posts.map((post) => {
            const id = _.uniqueId();
            state.uiState.posts.unshift({ id, visibality: 'hidden' });
            return { ...post, id };
          });
          state.posts.unshift(...postsWithId);
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
            const promises = state.feeds.map(({ link }) => {
              const result = addNewPosts(link, state.posts).then((newPosts) => {
                newPosts.forEach((post) => {
                  const id = _.uniqueId();
                  state.posts.unshift({ ...post, id });
                  state.uiState.posts.unshift({ id, visibality: 'hidden' });
                });
              });
              return result;
            });
            Promise.all(promises).then(() => {
              watched.updatingStatus = 'updating';
              state.updatingStatus = 'waiting';
              updating();
            });
          }, 5000);
        });
    }
  });
};

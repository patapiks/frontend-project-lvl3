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
    lng: 'ru',
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
      id: null,
    },
  };

  const watched = initView(state);

  const postList = document.querySelector('#posts');
  postList.addEventListener('click', (e) => {
    watched.uiState = { posts: [...watched.uiState.posts, e.target.id] };
    watched.modal = { id: e.target.id };
  });

  const input = document.querySelector('input');
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watched.form = { state: 'sending' };
    const url = input.value;

    const declaredLinks = state.feeds.map(({ link }) => link);
    const validationError = validateUrl(url, declaredLinks);
    if (validationError) {
      watched.form = {
        errors: validationError,
        state: 'failed',
      };
    } else {
      getContent(url)
        .then((data) => {
          const { feed, posts } = parser(data.contents);
          watched.feeds.unshift({ ...feed, link: url });
          const postsWithId = posts.map((post) => {
            const id = _.uniqueId();
            return { ...post, id };
          });
          watched.posts.unshift(...postsWithId);
          watched.form = { state: 'finished' };
        })
        .catch((err) => {
          // Refactoring check
          if (err.message === 'Network error') {
            watched.form = {
              errors: i18next.t('errors.network'),
              state: 'failed',
            };
          } else {
            watched.form = {
              errors: i18next.t('errors.notRss'),
              state: 'failed',
            };
          }
        })
        .finally(function updating() {
          watched.updatingStatus = 'started';
          setTimeout(() => {
            const promises = state.feeds.map(({ link }) => {
              const result = addNewPosts(link, state.posts).then((newPosts) => {
                newPosts.forEach((post) => {
                  const id = _.uniqueId();
                  watched.posts.unshift({ ...post, id });
                });
              });
              return result;
            });
            Promise.all(promises)
              .then(() => {
                watched.updatingStatus = 'updated';
                updating();
              })
              .catch(() => {
                watched.updatingStatus = 'failed';
              });
          }, 5000);
        });
    }
  });
};

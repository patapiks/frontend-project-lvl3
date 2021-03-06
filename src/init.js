import i18next from 'i18next';
import { setLocale } from 'yup';
import _ from 'lodash';
import initView from './view';
import parser from './parser';
import { getContent, addNewPosts, validateUrl } from './util';
import resources from './locales/index';

export default () => {
  const { en, ru } = resources;
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      en,
      ru,
    },
  });

  setLocale({
    mixed: {
      required: i18nextInstance.t('errors.required'),
      notOneOf: i18nextInstance.t('errors.duplicate'),
    },
    string: {
      url: i18nextInstance.t('errors.url'),
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

  const watched = initView(state, i18nextInstance);

  const postList = document.querySelector('#posts');
  postList.addEventListener('click', (e) => {
    const newUiStates = state.uiState.posts.filter(
      // eslint-disable-next-line comma-dangle
      ({ id }) => id !== e.target.id
    );
    watched.uiState = {
      posts: [...newUiStates, { id: e.target.id, visibality: 'viewed' }],
    };
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
            watched.uiState = {
              posts: [...state.uiState.posts, { id, visivality: 'unviewed' }],
            };
            return { ...post, id };
          });
          watched.posts.unshift(...postsWithId);
          watched.form = { state: 'finished' };
        })
        .catch((err) => {
          console.log(err);
          // Refactoring check
          if (err.message === 'Network error') {
            watched.form = {
              errors: i18nextInstance.t('errors.network'),
              state: 'failed',
            };
          } else {
            watched.form = {
              errors: i18nextInstance.t('errors.notRss'),
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

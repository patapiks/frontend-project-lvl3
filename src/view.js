import onChange from 'on-change';
import { renderPosts, renderModal } from './util';
import renderForm from './renderForm';

export default (state) => {
  const elements = {
    feedback: document.querySelector('#feedback'),
    button: document.querySelector('#formButton'),
    modalBody: document.querySelector('.modal-body'),
    modalTitle: document.querySelector('.modal-title'),
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    feeds: document.querySelector('#feeds'),
    postList: document.querySelector('#posts'),
    fullArticle: document.querySelector('.full-article'),
    headingFeeds: document.querySelector('#headingFeeds'),
    headingPosts: document.querySelector('#headingPosts'),
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form':
        renderForm(value, elements, state);
        break;
      case 'updatingStatus':
        if (value === 'updated') {
          elements.postList.innerHTML = renderPosts(state.posts, state.uiState);
        }
        break;
      case 'uiState':
        elements.postList.innerHTML = renderPosts(state.posts, state.uiState);
        break;
      case 'modal':
        renderModal(state, elements);
        break;
      case 'feeds':
      case 'posts':
        break;
      default:
        throw new Error(`Unexpected case path: "${path}"!`);
    }
  });

  return watchedState;
};

import i18next from 'i18next';
import { getFeeds, getPosts } from './util';

export default (watchedState, path, value) => {
  // Refactoring switchCase
  if (path === 'state' && value === 'failed') {
    const div = document.querySelector('#feedback');
    const input = document.querySelector('input');
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    div.classList.remove('valid-feedback', 'text-success');
    div.classList.add('invalid-feedback', 'text-danger');
    div.textContent = watchedState.errors;
    const button = document.querySelector('button');
    button.removeAttribute('disabled');
  }
  if (path === 'state' && value === 'finished') {
    const div = document.querySelector('#feedback');
    const input = document.querySelector('input');
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    div.classList.remove('invalid-feedback', 'text-danger');
    div.classList.add('valid-feedback', 'text-success');
    div.textContent = i18next.t('success');
    const button = document.querySelector('button');
    button.removeAttribute('disabled');

    document.querySelector('#headingFeeds').textContent = i18next.t('heading.feeds');
    document.querySelector('#feeds').innerHTML = getFeeds(watchedState.feeds);
    document.querySelector('#headingPosts').textContent = i18next.t('heading.posts');
    document.querySelector('#posts').innerHTML = getPosts(watchedState.posts);
  }
  if (path === 'state' && value === 'updating') {
    const updatingUl = document.querySelector('#posts');
    updatingUl.innerHTML = getPosts(watchedState.posts);
  }
  if (path === 'state' && value === 'sending') {
    const button = document.querySelector('button');
    button.setAttribute('disabled', 'disabled');
  }
  if (path === 'modal.state' && value === 'show') {
    const modalTitle = document.querySelector('.modal-title');
    const modalBody = document.querySelector('.modal-body');
    const fullArticle = document.querySelector('.full-article');
    modalTitle.textContent = watchedState.posts[watchedState.modal.id].title;
    modalBody.textContent = watchedState.posts[watchedState.modal.id].description;
    fullArticle.href = watchedState.posts[watchedState.modal.id].link;
  }
  if (path.includes('posts')) {
    const updatingUl = document.querySelector('#posts');
    updatingUl.innerHTML = getPosts(watchedState.posts);
  }
};

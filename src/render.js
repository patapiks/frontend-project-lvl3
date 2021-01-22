import i18next from 'i18next';
import { addFeeds, addPosts } from './util';

export default (watchedState, path, value) => {
  const feedback = document.querySelector('#feedback');
  const input = document.querySelector('input');
  const button = document.querySelector('#formButton');
  const postList = document.querySelector('#posts');

  // Maybe switch?
  if (path === 'state' && value === 'failed') {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    feedback.classList.remove('valid-feedback', 'text-success');
    feedback.classList.add('invalid-feedback', 'text-danger');
    feedback.textContent = watchedState.errors;
    button.removeAttribute('disabled');
  }
  if (path === 'state' && value === 'finished') {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    feedback.classList.remove('invalid-feedback', 'text-danger');
    feedback.classList.add('valid-feedback', 'text-success');
    feedback.textContent = i18next.t('success');
    button.removeAttribute('disabled');

    document.querySelector('#headingFeeds').textContent = i18next.t('heading.feeds');
    document.querySelector('#feeds').innerHTML = addFeeds(watchedState.feeds);
    document.querySelector('#headingPosts').textContent = i18next.t('heading.posts');
    postList.innerHTML = addPosts(watchedState.posts);
  }
  if (path === 'state' && value === 'updating') {
    postList.innerHTML = addPosts(watchedState.posts);
  }
  if (path === 'state' && value === 'sending') {
    button.setAttribute('disabled', 'disabled');
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    feedback.classList.remove('invalid-feedback', 'text-danger');
    feedback.classList.add('valid-feedback', 'text-success');
    // feedback.textContent = i18next.t('loading');
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
    postList.innerHTML = addPosts(watchedState.posts);
  }
};

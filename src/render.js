import { getFeeds, getPosts } from './util';

export default (watchedState, path, value) => {
  if (path === 'url') {
    const point = document.querySelector('#main');
    point.innerHTML = `
    <h1 class="mt-5">Feeds</h1>
    <div>
    <ul class="list-group">${getFeeds(watchedState.feeds)}</ul>
    </div>
    <h1 class="mt-5">Posts</h1>
    <div>
    <ul class="list-group">${getPosts(watchedState.posts)}</ul>
    </div>`;
  }
  if (path === 'errors') {
    const div = document.querySelector('#feedback');
    const input = document.querySelector('input');
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    div.classList.remove('valid-feedback', 'text-success');
    div.classList.add('invalid-feedback', 'text-danger');
    div.textContent = watchedState.errors;
  }
  if (path === 'state' && value === 'loaded') {
    const div = document.querySelector('#feedback');
    const input = document.querySelector('input');
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    div.classList.remove('invalid-feedback', 'text-danger');
    div.classList.add('valid-feedback', 'text-success');
    div.textContent = 'Rss has been loaded';
  }
};

import i18next from 'i18next';
import * as yup from 'yup';
import _ from 'lodash';
import axios from 'axios';
import parser from './parser';

export const validateUrl = (url, links) => {
  const schema = yup.string().url().required().notOneOf(links);
  try {
    schema.validateSync(url);
    return { status: true };
  } catch (error) {
    return { status: false, error: error.message };
  }
};

export const renderFeeds = (feeds) => {
  const result = feeds
    .map(({ title, description }) => {
      const feed = `<li class="list-group-item"><h3>${title}</h3><p>${description}</p></li>`;
      return feed;
    })
    .join('');
  return result;
};

export const renderPosts = (posts, uiState) => {
  const result = posts
    .map(({ link, title, id }) => {
      // Delete class font-weight, after hexlet test
      const currentUi = uiState.posts.find((post) => post.id === id);
      const textClass = currentUi.visibality === 'viewed' ? 'fw-normal font-weight-normal' : 'fw-bold font-weight-bold';
      const post = `
    <li class="list-group-item d-flex justify-content-between align-items-start">
    <a id="${id}" target="_blank" href="${link}" class="${textClass}">${title}</a>
    <button id="${id}" class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
    ${i18next.t('button.preview')}</button>
    </li>`;
      return post;
    })
    .join('');
  return result;
};

export const getContent = (url) => {
  const corsLink = 'https://hexlet-allorigins.herokuapp.com/get?';
  const options = 'disableCache=true';
  return axios
    .get(`${corsLink}${options}&url=${encodeURIComponent(url)}`)
    .then((response) => response.data)
    .catch(() => {
      throw new Error(i18next.t('errors.network'));
    });
};

export const addNewPosts = (url, posts) => {
  const newPosts = getContent(url).then((data) => {
    const { posts: checkPosts } = parser(data.contents);
    return _.differenceBy(checkPosts, posts, (post) => post.link);
  });
  return newPosts;
};

export const renderModal = (state, elements) => {
  const { modalTitle, modalBody, fullArticle } = elements;
  const currentPost = state.posts.find((post) => post.id === state.modal.id);
  modalTitle.textContent = currentPost.title;
  modalBody.textContent = currentPost.description;
  fullArticle.href = currentPost.link;
};

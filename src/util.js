import i18next from 'i18next';
import * as yup from 'yup';
import _ from 'lodash';
import axios from 'axios';
import parser from './parser';

export const validateUrl = (url, links) => {
  yup.setLocale({
    mixed: {
      required: i18next.t('validateErrors.required'),
      notOneOf: i18next.t('validateErrors.duplicate'),
    },
    string: {
      url: i18next.t('validateErrors.url'),
    },
  });

  const schema = yup.string().url().required().notOneOf(links);

  try {
    schema.validateSync(url);
    return true;
  } catch (e) {
    return e.message;
  }
};

export const addFeeds = (feeds) => {
  const result = feeds.map(({ title, description }) => {
    const feed = `<li class="list-group-item"><h3>${title}</h3><p>${description}</p></li>`;
    return feed;
  });
  return result.join('');
};

export const addPosts = (posts) => {
  const result = posts.map(({ link, title, state }, index) => {
    const post = `<li class="list-group-item d-flex justify-content-between align-items-start">
    <a id="${index}" target="_blank" href="${link}" 
    class="${state === 'viewed' ? 'fw-normal font-weight-normal' : 'fw-bold font-weight-bold'}">
    ${title}</a>
    <button id="${index}" class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
    ${i18next.t('button.preview')}</button>
    </li>`;
    return post;
  });
  return result.join('');
};

export const getContent = (url) => {
  const link = 'https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=';
  return axios
    .get(`${link}${encodeURIComponent(url)}`)
    .then((response) => response.data)
    .catch(() => {
      throw new Error('Network');
    });
};

export const addNewPosts = (url, posts) => {
  const newPosts = getContent(url).then((data) => {
    const [, checkPosts] = parser(data.contents);
    const currentPostsLinks = posts.map(({ link }) => link);
    const checkPostsLinks = checkPosts.map(({ link }) => link);
    const newPostsLinks = _.difference(checkPostsLinks, currentPostsLinks);

    return checkPosts.filter(({ link }) => newPostsLinks.includes(link));
  });
  return newPosts;
};

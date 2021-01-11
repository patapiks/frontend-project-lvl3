import onChange from 'on-change';
import * as yup from 'yup';
import render from './render';
import parser from './parser';

const schema = yup.object().shape({
  link: yup.string().url(),
});

export default () => {
  const state = {
    state: '',
    url: '',
    feeds: [],
    posts: [],
    links: [],
    errors: '',
  };

  const watchedState = onChange(state, (path, value) => render(watchedState, path, value));

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.querySelector('input');
    const link = input.value;

    schema.isValid({ link }).then((valid) => {
      if (valid === true && !watchedState.links.includes(link)) {
        fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(link)}`)
          .then((response) => {
            if (response.ok) return response.json();
            throw new Error('Network response was not ok.');
          })
          .then((data) => {
            const [feed, posts] = parser(data);
            watchedState.feeds.push(feed);
            watchedState.posts.push(posts);
            watchedState.url = link;
            watchedState.links.push(link);
            watchedState.state = 'loaded';
            form.reset();
            document.querySelector('input').focus();
          })
          .catch(() => {
            watchedState.errors = "This source doesn't contain valid rss";
          });
      } else watchedState.state = 'invalid';
    });
  });
};

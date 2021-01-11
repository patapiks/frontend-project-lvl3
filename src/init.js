import onChange from 'on-change';
import * as yup from 'yup';

const schema = yup.object().shape({
  website: yup.string().url(),
});

export default () => 2;

const pars = (document) => {
  const getTextContent = (source, name) => source.querySelector(name).textContent;

  const channel = document.querySelector('channel');
  const result = {
    title: getTextContent(channel, 'title'),
    description: getTextContent(channel, 'description'),
    feeds: [],
  };

  const items = document.querySelectorAll('item');
  items.forEach((item) => {
    const feed = {
      title: getTextContent(item, 'title'),
      guid: getTextContent(item, 'guid'),
      // link: item.querySelector('link'),
      description: getTextContent(item, 'description'),
      pubdate: getTextContent(item, 'pubdate'),
    };
    result.feeds.push(feed);
  });
  return result;
  // console.log(result);
};

const getContents = (url) => {
  const result = fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then((data) => {
      const parser = new DOMParser();
      const content = parser.parseFromString(data.contents, 'text/html');
      return pars(content);
    });
  return result;
};

export const app = () => {
  const state = {
    state: 'empty',
    url: null,
    feeds: [],
  };

  const watchdeState = onChange(state, (path, value) => {
    if (path === 'url') {
      schema.isValid({ website: value }).then((valid) => {
        if (valid === true) {
          document.querySelector('input').classList.remove('is-invalid');
          document.querySelector('input').classList.add('is-valid');
          getContents(value).then((data) => watchdeState.feeds.push(data));
        } else {
          document.querySelector('input').classList.add('is-invalid');
        }
      });
    }

    // REFACTORING
    if (path === 'feeds') {
      const pizdec = state.feeds[0].feeds.map((feed) => {
        const x = `<div class="col-7 border">${feed.title}</div>`;
        return x;
      });
      document.querySelector('#main').innerHTML = pizdec.join('');
      console.log(pizdec.join(''));
    }
  });

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.querySelector('input');
    const data = input.value;
    watchdeState.state = 'processing';
    watchdeState.url = data;
  });
};

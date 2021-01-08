import onChange from 'on-change';
import * as yup from 'yup';

const schema = yup.object().shape({
  website: yup.string().url(),
});

export default () => 2;

const getProxy = (url) => {
  fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then((data) => console.log(data.contents));
};

export const app = () => {
  const state = {
    state: 'empty',
    value: null,
  };

  const watchdeState = onChange(state, (path, value) => {
    if (path === 'value') {
      schema.isValid({ website: value }).then((valid) => {
        if (valid === true) {
          document.querySelector('input').classList.remove('is-invalid');
          document.querySelector('input').classList.add('is-valid');
          getProxy(value);
        } else {
          document.querySelector('input').classList.add('is-invalid');
        }
      });
    }
  });

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.querySelector('input');
    const data = input.value;
    watchdeState.state = 'processing';
    watchdeState.value = data;
  });
};

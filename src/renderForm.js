import i18next from 'i18next';
import { renderFeeds, renderPosts } from './util';

export default (value, elements, state) => {
  const {
    form,
    feeds,
    input,
    feedback,
    button,
    postList,
    headingFeeds,
    headingPosts,
  } = elements;

  switch (value.state) {
    case 'sending':
      input.setAttribute('readonly', 'readonly');
      button.setAttribute('disabled', 'disabled');
      break;
    case 'failed':
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      feedback.classList.remove('valid-feedback', 'text-success');
      feedback.classList.add('invalid-feedback', 'text-danger');
      feedback.textContent = state.form.errors;
      button.removeAttribute('disabled');
      input.removeAttribute('readonly');
      break;
    case 'finished':
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      feedback.classList.remove('invalid-feedback', 'text-danger');
      feedback.classList.add('valid-feedback', 'text-success');
      feedback.textContent = i18next.t('success');
      button.removeAttribute('disabled');
      input.removeAttribute('readonly');

      headingFeeds.textContent = i18next.t('heading.feeds');
      feeds.innerHTML = renderFeeds(state.feeds);
      headingPosts.textContent = i18next.t('heading.posts');
      postList.innerHTML = renderPosts(state.posts, state.uiState);

      form.reset();
      input.focus();
      break;
    default:
      throw new Error(`Unexpected case value: "${value}"!`);
  }
};

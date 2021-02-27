import { renderFeeds, renderPosts } from './util';

export default (value, elements, state, i18next) => {
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
  const { posts, uiState } = state;

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
      postList.innerHTML = renderPosts(posts, uiState, i18next);

      form.reset();
      input.focus();
      break;
    default:
      throw new Error(`Unexpected case value: "${value}"!`);
  }
};

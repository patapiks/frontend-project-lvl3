const getFeeds = (feeds) => {
  const result = feeds.map(({ title, description }) => {
    const feed = `<li class="list-group-item"><h3>${title}</h3><p>${description}</p></li>`;
    return feed;
  });
  return result.join('');
};

const getPosts = (posts) => {
  const result = posts.map((arr) => {
    const post = arr
      .map(({ link, title }) => {
        const postTag = `<li class="list-group-item d-flex justify-content-between align-items-start">
        <a href="${link}" class="font-weight-bold" >${title}</a>
        <button class="btn btn-primary" type="button">Preview</button>
        </li>`;
        return postTag;
      })
      .join('');
    return post;
  });
  return result;
};

export { getFeeds, getPosts };

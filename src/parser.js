const getTextContent = (source) => {
  const title = source.querySelector('title').textContent;
  const description = source.querySelector('description').textContent;
  const guid = source.querySelector('guid').textContent;
  const pubdate = source.querySelector('pubdate').textContent;
  const link = source.querySelector('link').nextSibling.textContent.split('\n')[0];
  return {
    title,
    description,
    guid,
    pubdate,
    link,
  };
};

export default (data) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(data.contents, 'text/html');

  const channel = document.querySelector('channel');
  const channelContent = getTextContent(channel);
  const posts = [];

  const items = document.querySelectorAll('item');
  items.forEach((item) => {
    const postContent = getTextContent(item);
    posts.push(postContent);
  });

  const feed = [channelContent, posts];
  return feed;
};

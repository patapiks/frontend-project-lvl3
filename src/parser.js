// CleanCdata out?
const cleanCdata = (value) => {
  const regex = new RegExp(/<!.*\[CDATA\[.*/g);
  return regex.test(value) ? value.replace(/<!.*\[CDATA\[/g, '').replace(/]].*>/g, '') : value;
};

const getTextContent = (source) => {
  const title = cleanCdata(source.querySelector('title').textContent);
  const description = cleanCdata(source.querySelector('description').innerHTML);
  const link = source.querySelector('link').nextSibling.textContent.split('\n')[0];
  const state = 'not viewed';
  return {
    title,
    description,
    link,
    state,
  };
};

export default (data) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(data, 'text/html');

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

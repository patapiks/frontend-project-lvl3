import i18next from 'i18next';
import runApp from './app';
import resources from './locales/index';

require('bootstrap/dist/css/bootstrap.css');
require('bootstrap/js/dist/modal');

const { en, ru } = resources;
i18next
  .init({
    lng: 'en',
    debug: true,
    resources: {
      en,
      ru,
    },
  })
  .then(() => runApp());

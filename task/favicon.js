const { src, dest } = require('gulp');

// Плагины
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const favicons = require('gulp-favicons');
const filter = require('gulp-filter');

// Конфигурация
const app = require('../config/app.js');
const path = require('../config/path.js');

// Favicon
const favicon = () =>
  src(path.favicon.src)
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => {
          return {
            title: 'Favicon',
            message: error.message,
          };
        }),
      })
    )
    .pipe(dest(path.favicon.dest))
    .pipe(favicons(app.favicons))
    .pipe(dest(path.favicon.dest))
    .pipe(filter(['favicon.ico', 'apple-touch-icon.png', 'manifest.json']))
    .pipe(dest(path.root));

module.exports = favicon;

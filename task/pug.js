const { src, dest } = require('gulp');

// Плагины
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const pugs = require('gulp-pug');
const webpHtml = require('gulp-webp-html');

// Конфигурация
const app = require('../config/app.js');
const path = require('../config/path.js');

// Обработка PUG
const pug = () =>
  src(path.pug.src)
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => {
          return {
            title: 'Pug',
            message: error.message,
          };
        }),
      })
    )
    .pipe(pugs(app.pug))
    .pipe(webpHtml())
    .pipe(dest(path.pug.dest));

module.exports = pug;

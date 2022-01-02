const { src, dest } = require('gulp');

// Плагины
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');

// Конфигурация
const app = require('../config/app.js');
const path = require('../config/path.js');

// Обработка JavaScript
const js = () =>
  src(path.js.src, { sourcemaps: app.isDev })
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => {
          return {
            title: 'JavaScript',
            message: error.message,
          };
        }),
      })
    )
    .pipe(babel())
    .pipe(webpack(app.webpack))
    .pipe(dest(path.js.dest, { sourcemaps: app.isDev }));

module.exports = js;

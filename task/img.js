const { src, dest } = require('gulp');

// Плагины
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const webp = require('gulp-webp');
const gulpif = require('gulp-if');

// Конфигурация
const app = require('../config/app.js');
const path = require('../config/path.js');

// Обработка Image
const img = () =>
  src(path.img.src)
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => {
          return {
            title: 'Image',
            message: error.message,
          };
        }),
      })
    )
    .pipe(newer(path.img.dest))
    .pipe(webp())
    .pipe(dest(path.img.dest))
    .pipe(src(path.img.src))
    .pipe(newer(path.img.dest))
    .pipe(gulpif(app.isProd, imagemin(app.imagemin)))
    .pipe(dest(path.img.dest));

module.exports = img;

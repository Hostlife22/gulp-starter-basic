const { src, dest } = require('gulp');

// Плагины
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const svgSprite = require('gulp-svg-sprite');

// Конфигурация
const app = require('../config/app.js');
const path = require('../config/path.js');

// Обработка SVG
const svgSprive = () =>
  src(path.svgicons.src)
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => {
          return {
            title: 'SVG',
            message: error.message,
          };
        }),
      })
    )
    .pipe(svgSprite(app.svgSprite))
    .pipe(dest(path.svgicons.dest));

module.exports = svgSprive;

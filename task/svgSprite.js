const { src, dest } = require("gulp");

//Конфигурация
const path = require("../config/path.js");
const app = require("../config/app.js");

//Плагины
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const svgSprite = require("gulp-svg-sprite");

// Обработка SVG
const svgSprive = () => {
  return src(path.svgicons.src)
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: "SVG",
          message: error.message,
        })),
      })
    )
    .pipe(svgSprite(app.svgSprite))
    .pipe(dest(path.svgicons.dest));
};

module.exports = svgSprive;

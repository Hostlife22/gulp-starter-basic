const { watch, series, parallel } = require("gulp");
const browserSync = require("browser-sync").create();

//Конфигурация
const path = require("./config/path.js");
const app = require("./config/app.js");

//Задачи
const clear = require("./task/clear.js");
const pug = require("./task/pug.js");
const scss = require("./task/scss.js");
const js = require("./task/js.js");
const img = require("./task/img.js");
const favicon = require("./task/favicon.js");
const svgSprive = require("./task/svgSprite.js");
const { font, fontsStyle } = require("./task/font.js");

//Статический сервер
const server = () => {
  browserSync.init({
    server: {
      baseDir: path.root,
    },
  });
};

//Задача
const fonts = series(font, fontsStyle);
const sprite = svgSprive;

//Отслеживание изменений
const watcher = () => {
  watch(path.pug.watch, pug).on("all", browserSync.reload);
  watch(path.scss.watch, scss).on("all", browserSync.reload);
  watch(path.js.watch, js).on("all", browserSync.reload);
  watch(path.img.watch, img).on("all", browserSync.reload);
  watch(path.font.watch, fonts).on("all", browserSync.reload);
  watch(path.favicon.watch, favicon).on("all", browserSync.reload);
};

const build = series(clear, fonts, parallel(pug, scss, js, img, favicon));
const dev = series(build, parallel(server, watcher));

//Публичные задачи
exports.pug = pug;
exports.scss = scss;
exports.js = js;
exports.img = img;
exports.fonts = fonts;
exports.favicon = favicon;
exports.sprite = sprite;

//Сборка
exports.default = app.isProd ? build : dev;

const { src, dest } = require('gulp');
const fs = require('fs');

// Плагины
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const newer = require('gulp-newer');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');

// Конфигурация
const app = require('../config/app.js');
const path = require('../config/path.js');

// Обработка Font
const font = () =>
  src(path.font.src)
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => {
          return {
            title: 'Font',
            message: error.message,
          };
        }),
      })
    )
    .pipe(newer(path.font.dest))
    .pipe(fonter(app.fonter))
    .pipe(dest(path.font.dest))
    .pipe(ttf2woff2())
    .pipe(dest(path.font.dest));

// Подключение Font
const fontsStyle = () => {
  const fontsFile = `${path.folder}/sass/font/fonts.scss`;

  fs.readdir(path.font.dest, (err, fontsFiles) => {
    if (fs.existsSync(fontsFile)) {
      console.log(
        'Файл scss/fonts.scss уже существует. Для обнонвления файла нужно удалить его'
      );
      return;
    }

    fs.writeFile(fontsFile, '', cb);

    let newFileOnly;

    for (let i = 0; i < fontsFiles.length; i++) {
      const fontFileName = fontsFiles[i].split('.')[0];

      if (newFileOnly !== fontFileName) {
        const weight = [
          { fontWeight: ['thin', 100] },
          { fontWeight: ['extralight', 200] },
          { fontWeight: ['light', 300] },
          { fontWeight: ['regular', 400] },
          { fontWeight: ['medium', 500] },
          { fontWeight: ['semibold', 600] },
          { fontWeight: ['bold', 700] },
          { fontWeight: ['extrabold', 800] },
          { fontWeight: ['heavy', 800] },
          { fontWeight: ['black', 900] },
        ];

        const isFontWeigth = weight.find(({ fontWeight }) =>
          fontFileName.toLowerCase().includes(fontWeight[0])
        );

        const fontName = weight
          .map(({ fontWeight }) => fontWeight[0])
          .concat('italic')
          .map((el) => {
            const index = fontFileName.toLowerCase().indexOf(el);
            return index === -1
              ? fontFileName.toLowerCase()
              : fontFileName.toLowerCase().slice(0, index);
          })
          .reduce((a, c) => (c.length < a.length ? c : a))
          .replace(/[^\w\s]/g, '');

        const fontWeight =
          isFontWeigth === undefined ? 400 : isFontWeigth.fontWeight[1];
        const fontStyle = fontFileName.toLowerCase().includes('italic')
          ? 'italic'
          : 'normal';

        fs.appendFile(
          fontsFile,
          `@font-face {\n\tfont-family: "${
            fontName.charAt(0).toUpperCase() + fontName.slice(1)
          }";\n\tfont-display: swap;\n\tsrc: url("../font/${fontFileName}.woff2") format("woff2"), url("../font/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: ${fontStyle};\n}\r\n`,
          cb
        );

        newFileOnly = fontFileName;
      }
    }
  });

  return src(path.scss.src);
  function cb() {}
};

module.exports = { font, fontsStyle };

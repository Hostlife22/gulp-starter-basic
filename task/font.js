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
const fontStyle = (pathFolder) => {
  const fontsFile = `${pathFolder}`;

  fs.readdir(path.font.dest, (err, fontsFiles) => {
    if (fs.existsSync(fontsFile)) {
      console.log(
        `Файл ${pathFolder} уже существует. Для обнонвления файла нужно удалить его`
      );
      return;
    }

    fs.writeFile(fontsFile, '', cb);

    let newFileOnly;

    for (let i = 0; i < fontsFiles.length; i++) {
      const fontFileName = fontsFiles[i].split('.')[0];
      const nameFontStyle = fontFileName.toLowerCase();

      if (newFileOnly !== fontFileName) {
        const fontWeightArray = [
          { thin: 100 },
          { extralight: 200 },
          { light: 300 },
          { regular: 400 },
          { medium: 500 },
          { semibold: 600 },
          { bold: 700 },
          { extrabold: 800 },
          { heavy: 800 },
          { black: 900 },
        ];

        const isFontWeigth = fontWeightArray.find((obj) =>
          nameFontStyle.includes(Object.keys(obj)[0])
        );

        const fontName = fontWeightArray
          .map((obj) => Object.keys(obj)[0])
          .concat('italic')
          .map((el) => {
            const index = nameFontStyle.indexOf(el);
            return index === -1 ? nameFontStyle : nameFontStyle.slice(0, index);
          })
          .reduce((acc, word) => (word.length < acc.length ? word : acc))
          .replace(/[^\w\s]/g, '');

        const fontWeight =
          isFontWeigth === undefined ? 400 : Object.values(isFontWeigth)[0];

        const fontStyles = nameFontStyle.includes('italic')
          ? 'italic'
          : 'normal';

        fs.appendFile(
          fontsFile,
          `@font-face {\n\tfont-family: "${
            fontName.charAt(0).toUpperCase() + fontName.slice(1)
          }";\n\tfont-display: swap;\n\tsrc: url("../font/${fontFileName}.woff2") format("woff2"), url("../font/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: ${fontStyles};\n}\r\n`,
          cb
        );

        newFileOnly = fontFileName;
      }
    }
  });

  return src(path.scss.src);
  function cb() {}
};

module.exports = { font, fontStyle };

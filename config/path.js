const pathSrc = './src';
const pathDest = './public';

module.exports = {
  folder: pathSrc,
  root: pathDest,

  html: {
    src: pathSrc + '/html/*.html',
    watch: pathSrc + '/html/**/*.html',
    dest: pathDest,
  },

  pug: {
    src: pathSrc + '/pug/*.pug',
    watch: pathSrc + '/pug/**/*.pug',
    dest: pathDest,
  },

  css: {
    src: pathSrc + '/css/*.css',
    watch: pathSrc + '/css/**/*.css',
    dest: pathDest + '/css',
    includingFonts: pathSrc + '/css/font/fonts.css',
  },

  scss: {
    src: pathSrc + '/sass/*.{sass,scss}',
    watch: pathSrc + '/sass/**/*.{sass,scss}',
    dest: pathDest + '/css',
    includingFonts: pathSrc + '/sass/font/fonts.scss',
  },

  js: {
    src: pathSrc + '/js/*.js',
    watch: pathSrc + '/js/**/*.js',
    dest: pathDest + '/js',
  },

  img: {
    src: pathSrc + '/img/**/*.{png,jpg,jpeg,gif,svg}',
    watch: pathSrc + '/img/**/*.{png,jpg,jpeg,gif,svg}',
    dest: pathDest + '/img/',
  },

  font: {
    src: pathSrc + '/font/**/*.{eot,ttf,otf,otc,ttc,woff,woff2,svg}',
    watch: pathSrc + '/font/**/*.{eot,ttf,otf,otc,ttc,woff,woff2,svg}',
    dest: pathDest + '/font/',
  },
  favicon: {
    src: pathSrc + '/img/favicon/favicon.svg',
    watch: pathSrc + '/img/favicon/favicon.svg',
    dest: pathDest + '/img/favicon/',
  },
  svgicons: {
    src: pathSrc + '/img/svgicons/**/*.svg',
    watch: pathSrc + '/img/svgicons/**/*.svg',
    dest: pathDest + '/img/svgicons/',
  },
};

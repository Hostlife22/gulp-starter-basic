const isProd = process.argv.includes("--production");
const isDev = !isProd;

module.exports = {
  isProd: isProd,
  isDev: isDev,

  htmlmin: {
    collapseWhitespace: isProd,
  },

  pug: {
    pretty: isDev,
    data: {
      news: require("../data/news.json"),
    },
  },

  webpack: {
    mode: isProd ? "production" : "development",
  },

  imagemin: {
    verbose: true,
  },

  fonter: {
    formats: ["ttf", "woff", "eot", "svg"],
  },

  favicons: {
    icons: {
      favicons: true,
      appleIcon: true,
      android: true,
      windows: false,
      yandex: false,
      coast: false,
      firefox: false,
      appleStartup: false,
    },
    path: "img/favicon/",
  },

  svgSprite: {
    mode: {
      stack: {
        sprite: "../icons/icons.svg",
        //Создовать страницу с перечем иконок
        example: true,
      },
    },
  },
};

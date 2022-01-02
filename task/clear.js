const del = require('del');

// Конфигурация
const path = require('../config/path.js');

// Удаление директории
const clear = () => del(path.root);

module.exports = clear;

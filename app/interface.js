'use strict';

const HTTP = require('./interface/http');

// Конфиг всех модулей
let config = {};

// Класс отвечающий за функциональность всех интерфейсов
class Interfaces {
  static start(conf){
    config = conf;
    HTTP.start(config.http);
  }
  static list(){

  }
  static stop(){

  }
}

module.exports = Interfaces;

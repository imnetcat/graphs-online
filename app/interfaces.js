'use strict';

const CLI = require('./interfaces/cli');
const HTTP = require('./interfaces/http');

// Конфиг всех модулей
let config = {};

// Класс отвечающий за функциональность всех интерфейсов
class Interfaces {
  static start(conf){
    config = conf;
    CLI.start(config.cli);
    HTTP.start(config.http);
  }
  static list(){

  }
  static stop(){

  }
}

module.exports = Interfaces;

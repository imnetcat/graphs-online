'use strict';

const Core = require('./app/core');
const Interfaces = require('./app/interface');

// конфиг
let config = {};

// Класс обьеденяющий работу всех интерфейсов и модулей в единое целое
class App {
  // Создание\пересоздание конфига
  static configure(){
    config = Core.config.create('./app/config.json');
    return this;
  }
  // запуск\перезапуск интерфейсов
  static interfacesUp(){
    Interfaces.start(config.interfaces);
    return this;
  }
  // старт приложения
  static start(){
    App.configure()
       .interfacesUp();
    return this;
  }
}

module.exports = App;

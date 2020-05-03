'use strict';

const Core = require('./app/core');
const Interfaces = require('./app/interfaces');
const Modules = require('./app/modules');

// конфиг
let config = {};

// Класс обьеденяющий работу всех интерфейсов и модулей в единое целое
class App {
  // Создание\пересоздание конфига
  static configure(){
    config = Core.config.create('./app/config.json');
    return this;
  }
  // установка\переустановка модулей
  static installMods(){
    Modules.search()
           .load()
           .install();
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
       .installMods()
       .interfacesUp();
    return this;
  }
}

module.exports = App;

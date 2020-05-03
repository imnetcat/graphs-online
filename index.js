'use strict';

// Точка входа в приложение

const Core = require('./app/core');
const App = require('./app');

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    Core.log.error(err);
  })
  .on('exit', () => {
    Core.log.info('Shutdown\n\n\n');
  });

App.start();

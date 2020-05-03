'use strict';

const fs = require('fs');
const color = require('ansi-256-colors');

const ROOT = 'logs';

class Logging {
  static error(text) {
    this.Log('error', text, [2, 0, 0]);
  }

  static info(text) {
    this.Log('info', text, [0, 3, 0]);
  }

  static warn(text) {
    this.Log('warn', text, [5, 3, 0]);
  }

  static Log(label, text, colr) {
    colr = colr || [5, 5, 5];

    const date = new Date()
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '');

    // Create dir for logs if not exist
    if (!fs.existsSync(ROOT)) fs.mkdirSync('./' + ROOT);

    const path = ROOT + '/' + date.split(' ')[0] + '.txt';
    const time = date.split(' ')[1];

      let log = `[${time}][${label}]  ${text}\n`;

    if (!fs.existsSync(path)) {
      fs.closeSync(fs.openSync(path, 'w')); // Create an empty file
    }

    fs.appendFileSync(path, log);

    log = `${color.fg.getRgb(0,0,5)}[${time}]${color.fg.getRgb(1,0,5)}[${label}]  ${color.fg.getRgb(colr[0],colr[1],colr[2])}${text}${color.reset}`;

    console.log(log);
  }
};

module.exports = Logging;

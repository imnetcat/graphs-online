const fs = require('fs');

class Config {
  static create(confFile){
    if (!fs.existsSync(confFile)) {
      return null;
    }
    const file = fs.readFileSync(confFile);
    return JSON.parse(file);
  }
}

module.exports = Config;

'use strict';

const CODES = {
  0x000001: {
    msg: "unknown error: all fuck up"
  }
}

const errorCodeToStr = (code) => {
  return '0x' + '0'.repeat(6 - code.toString().length) + code.toString();
}

class CustomError {
  constructor(code){
    const err = {};
    err.stack = (new Error()).stack;
    err.code = code;
    err.msg = CODES[code].msg;
    return err;
  }
  static toString(err){
    let text = '';
    if(err.code){
      text += `(${errorCodeToStr(err.code)}) `;
    }
    if(err.msg){
      text += `${err.msg} `;
    }
    if(err.message && !err.stack){
      text += `${err.message} `;
    }
    if(err.dest){
      text += `${err.dest} `;
    }
    if(err.stack){
      text += `${err.stack} `;
    }
    return text;
  }
};

module.exports = CustomError;

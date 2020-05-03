'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');

const Core = require('../core');

let ROOT = "";
let HTTP_PORT = 0;

let server = {};
let config = {};

const serveFile = (name) => {
  const MIME_TYPES = {
    html: 'text/html; charset=UTF-8',
    js: 'application/javascript; charset=UTF-8',
    css: 'text/css',
    png: 'image/png',
    ico: 'image/x-icon',
    svg: 'image/svg+xml'
  };
  if (name === '/') {
    name = '/index.html';
  }
  const fileExt = path.extname(name).substring(1);
  const mimeType = MIME_TYPES[fileExt] || MIME_TYPES.html;
  const filePath = path.join(ROOT, name);
  const stream = fs.createReadStream(filePath);
  return { stream, mimeType };
}

const ROUTING = {

}

const serveApi = (url, data) => {
  const fn = ROUTING[url];
  if(!fn){
    return null;
  }
  console.dir({ url, version, fn, data });
  return fn(data);
}

class HTTP {
  static start(conf){
    Core.log.info('HTTP-server startup');
    config = conf;
    ROOT = config.root;
    HTTP_PORT = config.port;
    server = http.createServer((req, res) => {
      const { url, method } = req;
        if (method === 'post' || method === 'POST'){
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
          const data = Buffer.concat(chunks).toString();
          const result = serveApi(url, data);
          res.end(JSON.stringify(result));
        });
      } else if (method === 'get' || method === 'GET') {
          const { stream, mimeType } = serveFile(url);
        if (stream) {
          res.writeHead(200, { 'Content-Type': mimeType });
          stream.pipe(res);
        } else {
          res.end(404);
        }
      } else {
        res.end();
      }
    });
    server.listen(HTTP_PORT);
    Core.log.info('HTTP-server started on localhost:' + HTTP_PORT);
    return this;
  }

  static use(mod){
    this.modules[mod.name] = mod;
    return this;
  }
};

module.exports = HTTP;

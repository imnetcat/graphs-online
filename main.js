'use string';

// просто эхо-сервер файликов на nodejs & експресе
// потом перепишу красиво:/

const express = require('express');
const fs = require('fs');

app = express();

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // for parsing application/json
 
const options = {
    root: './',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
};
  
app.route('/')
    .get((request, response) => {
        response.sendFile('index.html', options);
    });
app.route('/index.html')
    .get((request, response) => {
        response.sendFile('index.html', options);
    });

app.route('/index.css')
    .get((request, response) => {
        response.sendFile('index.css', options);
    });
 
app.route('/matrix.js')
    .get((request, response) => {
        response.sendFile('natrix.js', options);
    });
app.route('/refresh.png')
    .get((request, response) => {
        response.sendFile('refresh.png', options);
    });
app.route('/graph.js')
    .get((request, response) => {
        response.sendFile('graph.js', options);
    });
app.route('/canvas.js')
    .get((request, response) => {
        response.sendFile('canvas.js', options);
    });
app.route('/interface.js')
    .get((request, response) => {
        response.sendFile('interface.js', options);
    });

app.listen(process.env.PORT || 3000);

'use strict';

var path = require('path');

var config = require('./webpack.config.js');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var WEBPACK_DEV_PATH = path.join(__dirname, 'build/');
var WEBPACK_DEV_FILE = 'bundle.js';

var compiler, server;

Object.assign(config, {
    output: {
        path: WEBPACK_DEV_PATH,
        publicPath: '/build/',
        pathinfo: true,
        filename: WEBPACK_DEV_FILE
    },
    debug: true,
    devtool: 'inline-source-map'
});

compiler = webpack(config);

server = new WebpackDevServer(compiler, {
    publicPath: '/build/',
    quiet: false,
    noInfo: true,
    stats: {
        colors: true
    }
});

server.listen(8080, '0.0.0.0');

//banner
console.log(' _         _           _ _ _             _');
console.log('| |_ _   _(_)  ___  __| (_| |_ ___  _ __| |');
console.log('| __| | | | | / _ \\/ _` | | __/ _ \\| \'__| |');
console.log('| |_| |_| | ||  __| (_| | | || (_) | |  |_|');
console.log(' \\__|\\__,_|_(_\\___|\\__,_|_|\\__\\___/|_|  (_)');
console.log('\ntui.editor development server..');
console.log('running at http://localhost:8080/demo/demo-dev.html');

/* eslint max-len: 0, no-process-env: 0, strict: 0 */
'use strict';

const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const IS_PRODUCTION = process.argv.indexOf('-p') >= 0;
const ENTRY_MAIN = './src/js/index.js';
const ENTRY_VIEWONLY = './src/js/indexViewOnly.js';
const DIST_PATH = path.join(__dirname, 'dist');
const DIST_FILE = `[name]${IS_PRODUCTION ? '.min' : ''}.js`;
const BANNER = [
    pkg.name,
    `@version ${pkg.version}`,
    `@author ${pkg.author}`,
    `@license ${pkg.license}`
].join('\n');

const config = {
    cache: false,
    entry: {
        'tui-editor': ENTRY_MAIN,
        'tui-editor-viewonly': ENTRY_VIEWONLY
    },
    output: {
        path: DIST_PATH,
        publicPath: 'dist/',
        pathinfo: false,
        filename: DIST_FILE
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /node_modules|lib|dist/,
                loader: 'eslint'
            }
        ],
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules|lib|dist/,
                loader: 'babel'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', ['css-loader'])
            }
        ]
    },
    eslint: {
        configFile: './.eslintrc',
        failOnWarning: false,
        failOnError: false
    },
    plugins: [
        new webpack.BannerPlugin(BANNER),
        new ExtractTextPlugin(`[name]${IS_PRODUCTION ? '.min' : ''}.css`)
    ],
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        progress: true,
        cache: true,
        contentBase: __dirname,
        noInfo: true,
        inline: true,
        devtool: '#inline-source-map',
        stats: {
            colors: true
        }
    }
};

module.exports = config;

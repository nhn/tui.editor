/* eslint max-len: 0, no-process-env: 0, strict: 0 */

const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');

const IS_DEV_SERVER = process.argv[1].indexOf('webpack-dev-server') >= 0;
const IS_HMR = process.argv.indexOf('--hot') >= 0 || process.argv.indexOf('--hotOnly') >= 0;
const IS_PRODUCTION = process.argv.indexOf('-p') >= 0;
const ENTRY_MAIN = './src/js/index.js';
const ENTRY_VIEWONLY = './src/js/indexViewOnly.js';
const DIST_DIR_NAME = 'dist';
const DIST_PATH = path.join(__dirname, DIST_DIR_NAME);
const DIST_FILE = `[name]${IS_PRODUCTION ? '.min' : ''}.js`;
const BANNER = [
    pkg.name,
    `@version ${pkg.version}`,
    `@author ${pkg.author}`,
    `@license ${pkg.license}`
].join('\n');
const PUBLIC_PATH = `http://localhost:8080/${DIST_DIR_NAME}/`;

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
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules|lib|dist/,
                loader: 'eslint-loader',
                enforce: 'pre',
                options: {
                    configFile: './.eslintrc',
                    failOnWarning: false,
                    failOnError: false
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules|lib|dist/,
                loader: 'babel-loader',
                options: {
                    babelrc: true
                }
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: BANNER,
            raw: false,
            entryOnly: true
        }),
        new CopyWebpackPlugin([
            {from: 'src/css/tui-editor.css'},
            {from: 'src/css/tui-editor-contents.css'}
        ]),
        new Visualizer({filename: '../report/webpack/statistics.html'})
    ]
};
if (IS_DEV_SERVER) {
    config.entry = {
        'tui-editor': [ENTRY_MAIN, 'webpack-dev-server/client?http://localhost:8080'],
        'tui-editor-viewonly': [ENTRY_VIEWONLY, 'webpack-dev-server/client?http://localhost:8080']
    };
    config.output.publicPath = PUBLIC_PATH;
    config.devServer = {
        host: '0.0.0.0',
        disableHostCheck: true,
        port: 8080,
        publicPath: PUBLIC_PATH,
        noInfo: true,
        inline: true,
        stats: {
            colors: true
        }
    };
    config.devtool = 'inline-source-map';

    if (IS_HMR) {
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }
}

module.exports = config;

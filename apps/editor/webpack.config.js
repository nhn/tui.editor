/* eslint max-len: 0, no-process-env: 0, strict: 0 */

const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');

const ENTRY_MAIN = './src/js/index.js';
const ENTRY_VIEWONLY = './src/js/indexViewOnly.js';
const ENTRY_MAIN_ALL = './src/js/indexAll.js';
const ENTRY_VIEWONLY_ALL = './src/js/indexViewOnlyAll.js';
const ENTRY_EXT_CHART = './src/js/extensions/chart/chart.js';
const ENTRY_EXT_UML = './src/js/extensions/uml.js';
const ENTRY_EXT_COLOR_SYNTAX = './src/js/extensions/colorSyntax.js';
const ENTRY_EXT_SCROLL_FOLLOW = './src/js/extensions/scrollFollow/scrollFollow.js';
const ENTRY_EXT_TASK_COUNTER = './src/js/extensions/taskCounter.js';
const ENTRY_EXT_MARK = './src/js/extensions/mark/mark.js';
const ENTRY_EXT_TABLE = './src/js/extensions/table/table.js';

const isDevServer = process.argv[1].indexOf('webpack-dev-server') >= 0;
const isHMR = process.argv.indexOf('--hot') >= 0 || process.argv.indexOf('--hotOnly') >= 0;
const isProduction = process.argv.indexOf('-p') >= 0;
const isBuildAll = process.env.BUILD_ALL === 'true';

const DIST_DIR_NAME = 'dist';
const DIST_PATH = path.join(__dirname, DIST_DIR_NAME);
const DIST_FILE = `tui-editor-[name]${isBuildAll ? '-all' : ''}${isProduction ? '.min' : ''}.js`;
const VISUALIZER_FILE_PATH = `../report/webpack/statistics${isBuildAll ? '-all' : ''}.${pkg.version}.html`;
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
        'Editor': ENTRY_MAIN,
        'ViewOnly': ENTRY_VIEWONLY,
        'extChart': ENTRY_EXT_CHART,
        'extUML': ENTRY_EXT_UML,
        'extColorSyntax': ENTRY_EXT_COLOR_SYNTAX,
        'extScrollFollow': ENTRY_EXT_SCROLL_FOLLOW,
        'extTaskCounter': ENTRY_EXT_TASK_COUNTER,
        'extMark': ENTRY_EXT_MARK,
        'extTable': ENTRY_EXT_TABLE
    },
    output: {
        path: DIST_PATH,
        publicPath: 'dist/',
        pathinfo: false,
        filename: DIST_FILE,
        library: ['tui', 'editor', '[name]'],
        libraryTarget: 'umd'
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
        new Visualizer({filename: VISUALIZER_FILE_PATH})
    ],
    externals: [function(context, request, callback) {
        const dir = path.relative(__dirname, context);
        if (dir.includes('extensions')) {
            if (request.match(/editor$/)) {
                callback(null, {
                    commonjs: 'tui-editor',
                    commonjs2: 'tui-editor',
                    amd: 'tui-editor',
                    root: ['tui', 'editor', 'Editor']
                });
            } else if (request.match(/viewOnly$/)) {
                callback(null, {
                    commonjs: 'tui-editor/tui-editor-viewonly',
                    commonjs2: 'tui-editor/tui-editor-viewonly',
                    amd: 'tui-editor/tui-editor-viewonly',
                    root: ['tui', 'editor', 'ViewOnly']
                });
            } else {
                callback();
            }
        } else {
            callback();
        }
    }]
};

if (isDevServer) {
    config.entry = {
        'Editor': [ENTRY_MAIN, 'webpack-dev-server/client?http://localhost:8080'],
        'ViewOnly': [ENTRY_VIEWONLY, 'webpack-dev-server/client?http://localhost:8080'],
        'extChart': [ENTRY_EXT_CHART, 'webpack-dev-server/client?http://localhost:8080'],
        'extUML': [ENTRY_EXT_UML, 'webpack-dev-server/client?http://localhost:8080'],
        'extColorSyntax': [ENTRY_EXT_COLOR_SYNTAX, 'webpack-dev-server/client?http://localhost:8080'],
        'extScrollFollow': [ENTRY_EXT_SCROLL_FOLLOW, 'webpack-dev-server/client?http://localhost:8080'],
        'extTaskCounter': [ENTRY_EXT_TASK_COUNTER, 'webpack-dev-server/client?http://localhost:8080'],
        'extMark': [ENTRY_EXT_MARK, 'webpack-dev-server/client?http://localhost:8080'],
        'extTable': [ENTRY_EXT_TABLE, 'webpack-dev-server/client?http://localhost:8080']
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

    if (isHMR) {
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }
}

if (isBuildAll) {
    config.entry = {
        'Editor': ENTRY_MAIN_ALL,
        'ViewOnly': ENTRY_VIEWONLY_ALL
    };
}

module.exports = config;

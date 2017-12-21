/*
 * @fileoverview configs file for bundling
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

/* eslint max-len: 0, no-process-env: 0, strict: 0 */

const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');

const NAME_SPACE = ['tui', 'Editor'];
const ENTRY_MAIN = './src/js/index.js';
const ENTRY_VIEWER = './src/js/indexViewer.js';
const ENTRY_MAIN_ALL = './src/js/indexAll.js';
const ENTRY_VIEWER_ALL = './src/js/indexViewerAll.js';
const ENTRY_EXT_CHART = './src/js/extensions/chart/chart.js';
const ENTRY_EXT_UML = './src/js/extensions/uml.js';
const ENTRY_EXT_COLOR_SYNTAX = './src/js/extensions/colorSyntax.js';
const ENTRY_EXT_SCROLL_SYNC = './src/js/extensions/scrollSync/scrollSync.js';
const ENTRY_EXT_TASK_COUNTER = './src/js/extensions/taskCounter.js';
const ENTRY_EXT_MARK = './src/js/extensions/mark/mark.js';
const ENTRY_EXT_TABLE = './src/js/extensions/table/table.js';

const isDevServer = process.argv[1].indexOf('webpack-dev-server') >= 0;
const isBuildAll = process.env.BUILD_ALL === 'true';
const isBuildExts = process.env.BUILD_EXT === 'true';
const isProduction = process.argv.indexOf('-p') >= 0;
const isHMR = process.argv.indexOf('--hot') >= 0 || process.argv.indexOf('--hotOnly') >= 0;

const DIST_DIR_NAME = 'dist';
const DIST_PATH = path.join(__dirname, DIST_DIR_NAME);
const DIST_FILE = `tui-editor-[name]${isProduction ? '.min' : ''}.js`;
const VISUALIZER_FILE_PATH = `../report/webpack/statistics.${pkg.version}.html`;
const BANNER = [
  pkg.name,
  `@version ${pkg.version}`,
  `@author ${pkg.author}`,
  `@license ${pkg.license}`
].join('\n');
const PUBLIC_PATH = `http://localhost:8080/${DIST_DIR_NAME}/`;

const defaultConfig = {
  cache: false,
  output: {
    path: DIST_PATH,
    publicPath: 'dist/',
    pathinfo: false,
    filename: DIST_FILE
  },
  module: {
    rules: [{
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
    }]
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
  externals: [{
    'tui-color-picker': {
      commonjs: 'tui-color-picker',
      commonjs2: 'tui-color-picker',
      amd: 'tui-color-picker',
      root: ['tui', 'colorPicker']
    },
    'jquery': {
      commonjs: 'jquery',
      commonjs2: 'jquery',
      amd: 'jquery',
      root: ['$']
    },
    'tui-code-snippet': {
      commonjs: 'tui-code-snippet',
      commonjs2: 'tui-code-snippet',
      amd: 'tui-code-snippet',
      root: ['tui', 'util']
    },
    'plantuml-encoder': {
      commonjs: 'plantuml-encoder',
      commonjs2: 'plantuml-encoder',
      amd: 'plantuml-encoder',
      root: ['plantumlEncoder']
    },
    'highlight.js': {
      commonjs: 'highlight.js',
      commonjs2: 'highlight.js',
      amd: 'highlight.js',
      root: ['hljs']
    },
    'markdown-it': {
      commonjs: 'markdown-it',
      commonjs2: 'markdown-it',
      amd: 'markdown-it',
      root: ['markdownit']
    },
    'squire-rte': {
      commonjs: 'squire-rte',
      commonjs2: 'squire-rte',
      amd: 'squire-rte',
      root: ['Squire']
    },
    'codemirror': {
      commonjs: 'codemirror',
      commonjs2: 'codemirror',
      amd: 'codemirror',
      root: ['CodeMirror']
    },
    'toMark': {
      commonjs: 'toMark',
      commonjs2: 'toMark',
      amd: 'toMark',
      root: ['toMark']
    }
  }]
};

if (isDevServer) {
  defaultConfig.entry = {
    'Editor-all': [ENTRY_MAIN_ALL, 'webpack-dev-server/client?http://localhost:8080'],
    'Viewer-all': [ENTRY_VIEWER_ALL, 'webpack-dev-server/client?http://localhost:8080']
  };
  defaultConfig.output.publicPath = PUBLIC_PATH;
  defaultConfig.output.library = NAME_SPACE;
  defaultConfig.output.libraryTarget = 'umd';
  defaultConfig.devServer = {
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
  defaultConfig.devtool = 'inline-source-map';

  if (isHMR) {
    defaultConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  }
} else if (isBuildAll) {
  defaultConfig.entry = {
    'Editor-all': ENTRY_MAIN_ALL,
    'Viewer-all': ENTRY_VIEWER_ALL
  };
  defaultConfig.output.library = NAME_SPACE;
  defaultConfig.output.libraryTarget = 'umd';
} else if (isBuildExts) {
  defaultConfig.entry = {
    'extChart': ENTRY_EXT_CHART,
    'extUML': ENTRY_EXT_UML,
    'extColorSyntax': ENTRY_EXT_COLOR_SYNTAX,
    'extScrollSync': ENTRY_EXT_SCROLL_SYNC,
    'extTaskCounter': ENTRY_EXT_TASK_COUNTER,
    'extMark': ENTRY_EXT_MARK,
    'extTable': ENTRY_EXT_TABLE
  };
  defaultConfig.output.libraryTarget = 'umd';
  defaultConfig.externals.push(function(context, request, callback) {
    const dir = path.relative(__dirname, context);
    if (dir.includes('extensions')) {
      if (request.match(/editor$/)) {
        callback(null, {
          commonjs: 'tui-editor',
          commonjs2: 'tui-editor',
          amd: 'tui-editor',
          root: ['tui', 'Editor']
        });
      } else if (request.match(/viewer$/)) {
        callback(null, {
          commonjs: 'tui-editor/dist/tui-editor-Viewer',
          commonjs2: 'tui-editor/dist/tui-editor-Viewer',
          amd: 'tui-editor/dist/tui-editor-Viewer',
          root: ['tui', 'Editor']
        });
      } else {
        callback();
      }
    } else {
      callback();
    }
  });
} else {
  defaultConfig.entry = {
    'Editor': ENTRY_MAIN,
    'Viewer': ENTRY_VIEWER
  };
  defaultConfig.output.library = NAME_SPACE;
  defaultConfig.output.libraryTarget = 'umd';
}

module.exports = defaultConfig;

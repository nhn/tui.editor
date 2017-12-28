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
const CleanCSS = require('clean-css');

const ENTRY_MAIN = './src/js/index.js';
const ENTRY_VIEWER = './src/js/indexViewer.js';
const ENTRY_MAIN_ALL = './src/js/indexAll.js';
const ENTRY_VIEWER_ALL = './src/js/indexViewerAll.js';
const ENTRY_EXT_CHART = './src/js/extensions/chart/chart.js';
const ENTRY_EXT_UML = './src/js/extensions/uml.js';
const ENTRY_EXT_COLOR_SYNTAX = './src/js/extensions/colorSyntax.js';
const ENTRY_EXT_SCROLL_SYNC = './src/js/extensions/scrollSync/scrollSync.js';
const ENTRY_EXT_TABLE = './src/js/extensions/table/table.js';
const ENTRY_EDITOR_CSS = './src/css/tui-editor.css';
const ENTRY_CONTENT_CSS = './src/css/tui-editor-contents.css';

const isDevServer = process.argv[1].indexOf('webpack-dev-server') >= 0;
const isProduction = process.argv.indexOf('-p') >= 0;
const isHMR = process.argv.indexOf('--hot') >= 0 || process.argv.indexOf('--hotOnly') >= 0;

const NAME_SPACE = ['tui', 'Editor'];
const DIST_DIR_NAME = 'dist';
const DIST_PATH = path.join(__dirname, DIST_DIR_NAME);
const DIST_JS_NAME = `tui-editor-[name]${isProduction ? '.min' : ''}.js`;
const VISUALIZER_FILE_PATH = `../report/webpack/statistics.${pkg.version}.html`;
const PUBLIC_PATH = `http://localhost:8080/${DIST_DIR_NAME}/`;
const BANNER = [
  pkg.name,
  `@version ${pkg.version}`,
  `@author ${pkg.author}`,
  `@license ${pkg.license}`
].join('\n');

const defaultConfigs = Array(isDevServer ? 1 : 4).fill(0).map(() => {
  return {
    cache: false,
    output: {
      path: DIST_PATH,
      publicPath: 'dist/',
      pathinfo: false,
      filename: DIST_JS_NAME
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
      'tui-chart': {
        commonjs: 'tui-chart',
        commonjs2: 'tui-chart',
        amd: 'tui-chart',
        root: ['tui', 'chart']
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
});

defaultConfigs[0].plugins.push(new CopyWebpackPlugin([{
  from: ENTRY_EDITOR_CSS,
  transform: content => isProduction ? new CleanCSS({compatibility: '*'}).minify(content).styles : content,
  to: `tui-editor${isProduction ? '.min' : ''}.css`
}, {
  from: ENTRY_CONTENT_CSS,
  transform: content => isProduction ? new CleanCSS({compatibility: '*'}).minify(content).styles : content,
  to: `tui-editor-contents${isProduction ? '.min' : ''}.css`
}]));

if (isDevServer) {
  defaultConfigs[0].entry = {
    'Editor-all': ENTRY_MAIN_ALL
  };
  defaultConfigs[0].output.publicPath = PUBLIC_PATH;
  defaultConfigs[0].output.library = NAME_SPACE;
  defaultConfigs[0].output.libraryTarget = 'umd';
  defaultConfigs[0].plugins.push(new webpack.IgnorePlugin(/viewer$/, /extensions/));
  defaultConfigs[0].devServer = {
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
  defaultConfigs[0].devtool = 'inline-source-map';

  if (isHMR) {
    defaultConfigs[0].plugins.push(new webpack.HotModuleReplacementPlugin());
  }
} else {
  // BuildAll
  defaultConfigs[0].entry = {
    'Editor-all': ENTRY_MAIN_ALL
  };
  defaultConfigs[0].output.library = NAME_SPACE;
  defaultConfigs[0].output.libraryTarget = 'umd';
  defaultConfigs[0].plugins.push(new webpack.IgnorePlugin(/viewer$/, /extensions/));

  // BuildAll Viewer
  defaultConfigs[1].entry = {
    'Viewer-all': ENTRY_VIEWER_ALL
  };
  defaultConfigs[1].output.library = NAME_SPACE;
  defaultConfigs[1].output.libraryTarget = 'umd';
  defaultConfigs[1].plugins.push(new webpack.IgnorePlugin(/editor$/, /extensions/));

  // BuildExt
  defaultConfigs[2].entry = {
    'extChart': ENTRY_EXT_CHART,
    'extUML': ENTRY_EXT_UML,
    'extColorSyntax': ENTRY_EXT_COLOR_SYNTAX,
    'extScrollSync': ENTRY_EXT_SCROLL_SYNC,
    'extTable': ENTRY_EXT_TABLE
  };
  defaultConfigs[2].output.libraryTarget = 'umd';
  defaultConfigs[2].externals.push(function(context, request, callback) {
    const dir = path.relative(__dirname, context);
    if (dir.includes('extensions')) {
      if (request.match(/editor$/)) {
        callback(null, {
          commonjs: 'tui-editor',
          commonjs2: 'tui-editor',
          amd: 'tui-editor',
          root: NAME_SPACE
        });
      } else if (request.match(/viewer$/)) {
        callback(null, {
          commonjs: 'tui-editor/dist/tui-editor-Viewer',
          commonjs2: 'tui-editor/dist/tui-editor-Viewer',
          amd: 'tui-editor/dist/tui-editor-Viewer',
          root: NAME_SPACE
        });
      } else {
        callback();
      }
    } else {
      callback();
    }
  });

  // BuildNormal
  defaultConfigs[3].entry = {
    'Editor': ENTRY_MAIN,
    'Viewer': ENTRY_VIEWER
  };
  defaultConfigs[3].output.library = NAME_SPACE;
  defaultConfigs[3].output.libraryTarget = 'umd';
}

module.exports = defaultConfigs;

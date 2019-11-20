/**
 * @fileoverview configs file for bundling
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');

const CleanCSS = require('clean-css');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

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
const ENTRY_IMAGE_DIR = './src/image';

const isProduction = process.argv.indexOf('--mode=production') >= 0;
const isMinified = process.argv.indexOf('--minify') >= 0;

const defaultConfigs = Array(isProduction ? 5 : 1).fill(0).map(() => {
  return {
    mode: isProduction ? 'production' : 'development',
    cache: false,
    output: {
      library: ['tui', 'Editor'],
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/dist',
      filename: `tui-editor-[name]${isMinified ? '.min' : ''}.js`
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /node_modules|dist/,
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
        exclude: /node_modules|dist/,
        loader: 'babel-loader?cacheDirectory',
        options: {
          babelrc: true
        }
      }]
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: [
          pkg.name,
          `@version ${pkg.version}`,
          `@author ${pkg.author}`,
          `@license ${pkg.license}`
        ].join('\n'),
        raw: false,
        entryOnly: true
      })
    ],
    externals: [{
      'tui-code-snippet': {
        commonjs: 'tui-code-snippet',
        commonjs2: 'tui-code-snippet',
        amd: 'tui-code-snippet',
        root: ['tui', 'util']
      },
      'tui-color-picker': {
        commonjs: 'tui-color-picker',
        commonjs2: 'tui-color-picker',
        amd: 'tui-color-picker',
        root: ['tui', 'colorPicker']
      },
      'tui-chart/dist/tui-chart-polyfill': {
        commonjs: 'tui-chart',
        commonjs2: 'tui-chart',
        amd: 'tui-chart',
        root: ['tui', 'chart']
      },
      'jquery': {
        commonjs: 'jquery',
        commonjs2: 'jquery',
        amd: 'jquery',
        root: ['$']
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
      'to-mark': {
        commonjs: 'to-mark',
        commonjs2: 'to-mark',
        amd: 'to-mark',
        root: ['toMark']
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
      }
    }],
    optimization: {
      minimize: false
    },
    performance: {
      hints: false
    }
  };
});

function addMinifyPlugin(config) {
  config.optimization = {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        extractComments: false
      })
    ]
  };
}

function addAnalyzerPlugin(config, type) {
  config.plugins.push(new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: `../report/webpack/stats-${pkg.version}-${type}.html`
  }));
}

function addCopyingAssetsPlugin(config) {
  config.plugins.push(new CopyWebpackPlugin([{ // style
    from: ENTRY_EDITOR_CSS,
    transform: content => isMinified ? new CleanCSS({compatibility: '*'}).minify(content).styles : content,
    to: `tui-editor${isMinified ? '.min' : ''}.css`
  }, {
    from: ENTRY_CONTENT_CSS,
    transform: content => isMinified ? new CleanCSS({compatibility: '*'}).minify(content).styles : content,
    to: `tui-editor-contents${isMinified ? '.min' : ''}.css`
  }]));

  config.plugins.push(new CopyWebpackPlugin([ENTRY_IMAGE_DIR])); // image
}

function setDevelopConfig(config) {
  config.entry = {
    'Editor': ENTRY_MAIN
  };
  
  config.devtool = 'inline-source-map';
  config.devServer = {
    inline: true,
    host: '0.0.0.0',
    port: 8080,
    disableHostCheck: true
  };

  config.plugins.push(new webpack.IgnorePlugin(/viewer$/, /extensions/));
}

function setProductionConfig(config) {
  config.entry = {
    'Editor': ENTRY_MAIN,
    'Viewer': ENTRY_VIEWER
  };

  if (isMinified) {
    addMinifyPlugin(config);
    addAnalyzerPlugin(config, 'normal');
  }
}

function setProductionConfigForEditorAll(config) {
  config.entry = {
    'Editor-all': ENTRY_MAIN_ALL
  };

  config.plugins.push(new webpack.IgnorePlugin(/viewer$/, /extensions/));

  if (isMinified) {
    addMinifyPlugin(config);
    addAnalyzerPlugin(config, 'all');
  }
}

function setProductionConfigForViewerAll(config) {
  config.entry = {
    'Viewer-all': ENTRY_VIEWER_ALL
  };

  config.plugins.push(new webpack.IgnorePlugin(/editor$/, /extensions/));
  
  if (isMinified) {
    addMinifyPlugin(config);
    addAnalyzerPlugin(config, 'viewer-all');
  }
}

function setProductionConfigForExtensions(config) {
  config.entry = {
    'extChart': ENTRY_EXT_CHART,
    'extUML': ENTRY_EXT_UML,
    'extColorSyntax': ENTRY_EXT_COLOR_SYNTAX,
    'extScrollSync': ENTRY_EXT_SCROLL_SYNC,
    'extTable': ENTRY_EXT_TABLE
  };

  config.externals.push(function(context, request, callback) {
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

  delete config.output.library;

  if (isMinified) {
    addMinifyPlugin(config);
    addAnalyzerPlugin(config, 'exts');
  }
}

function setProductionConfigForFull(config) {
  config.entry = {
    'Editor-full': ENTRY_MAIN_ALL,
    'Viewer-full': ENTRY_VIEWER_ALL
  };

  config.externals = [];

  if (isMinified) {
    addMinifyPlugin(config);
    addAnalyzerPlugin(config, 'full');
  }
}

addCopyingAssetsPlugin(defaultConfigs[0]);

if (isProduction) {
  setProductionConfig(defaultConfigs[0]);
  setProductionConfigForEditorAll(defaultConfigs[1]);
  setProductionConfigForViewerAll(defaultConfigs[2]);
  setProductionConfigForExtensions(defaultConfigs[3]);
  setProductionConfigForFull(defaultConfigs[4]);
} else {
  setDevelopConfig(defaultConfigs[0]);
}

module.exports = defaultConfigs;

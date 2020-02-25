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
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const ENTRY_MAIN = './src/js/index.js';
const ENTRY_VIEWER = './src/js/indexViewer.js';

const ENTRY_EDITOR_CSS = './src/css/tui-editor.css';
const ENTRY_CONTENT_CSS = './src/css/tui-editor-contents.css';
const ENTRY_IMAGE_DIR = './src/image';

const isDevelopAll = process.argv.indexOf('--all') >= 0;
const isProduction = process.argv.indexOf('--mode=production') >= 0;
const isMinified = process.argv.indexOf('--minify') >= 0;

const defaultConfigs = Array(isProduction ? 2 : 1)
  .fill(0)
  .map(() => {
    return {
      mode: isProduction ? 'production' : 'development',
      cache: false,
      output: {
        library: ['tui', 'Editor'],
        libraryTarget: 'umd',
        libraryExport: 'default',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist',
        filename: `tui-[name]${isMinified ? '.min' : ''}.js`
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules|dist|build/,
            loader: 'eslint-loader',
            enforce: 'pre',
            options: {
              configFile: './.eslintrc.js',
              failOnWarning: false,
              failOnError: false
            }
          },
          {
            test: /\.js$/,
            exclude: /node_modules|dist|build/,
            loader: 'babel-loader?cacheDirectory',
            options: {
              envName: isProduction ? 'production' : 'development',
              rootMode: 'upward'
            }
          }
        ]
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
      externals: [
        {
          'tui-code-snippet': {
            commonjs: 'tui-code-snippet',
            commonjs2: 'tui-code-snippet',
            amd: 'tui-code-snippet',
            root: ['tui', 'util']
          },
          jquery: {
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
          codemirror: {
            commonjs: 'codemirror',
            commonjs2: 'codemirror',
            amd: 'codemirror',
            root: ['CodeMirror']
          }
        }
      ],
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
  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: `../report/webpack/stats-${pkg.version}-${type}.html`
    })
  );
}

function addCopyingAssetsPlugin(config) {
  config.plugins.push(
    new CopyWebpackPlugin([
      {
        // style
        from: ENTRY_EDITOR_CSS,
        transform: content =>
          isMinified ? new CleanCSS({ compatibility: '*' }).minify(content).styles : content,
        to: `tui-editor${isMinified ? '.min' : ''}.css`
      },
      {
        from: ENTRY_CONTENT_CSS,
        transform: content =>
          isMinified ? new CleanCSS({ compatibility: '*' }).minify(content).styles : content,
        to: `tui-editor-contents${isMinified ? '.min' : ''}.css`
      }
    ])
  );

  config.plugins.push(new CopyWebpackPlugin([ENTRY_IMAGE_DIR])); // image
}

function setDevelopConfig(config) {
  if (isDevelopAll) {
    config.entry = { editor: ENTRY_MAIN };
  } else {
    config.entry = { 'editor-all': ENTRY_MAIN };
    config.externals = [];
  }

  config.devtool = 'inline-source-map';
  config.devServer = {
    inline: true,
    host: '0.0.0.0',
    port: 8080,
    disableHostCheck: true
  };
}

function setProductionConfig(config) {
  config.entry = {
    editor: ENTRY_MAIN,
    'editor-viewer': ENTRY_VIEWER
  };

  if (isMinified) {
    addMinifyPlugin(config);
    addAnalyzerPlugin(config, 'normal');
  }
}

function setProductionConfigForAll(config) {
  config.entry = {
    'editor-all': ENTRY_MAIN,
    'editor-viewer-all': ENTRY_VIEWER
  };

  config.externals = [];

  if (isMinified) {
    addMinifyPlugin(config);
    addAnalyzerPlugin(config, 'all');
  }
}

addCopyingAssetsPlugin(defaultConfigs[0]);

if (isProduction) {
  setProductionConfig(defaultConfigs[0]);
  setProductionConfigForAll(defaultConfigs[1]);
} else {
  setDevelopConfig(defaultConfigs[0]);
}

module.exports = defaultConfigs;

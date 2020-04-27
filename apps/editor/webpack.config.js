/**
 * @fileoverview configs file for bundling
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const FileManagerPlugin = require('filemanager-webpack-plugin');

const ENTRY_EDITOR = './src/js/index.js';
const ENTRY_VIEWER = './src/js/indexViewer.js';

const isDevelopAll = process.argv.indexOf('--all') >= 0;
const isDevelopViewer = process.argv.indexOf('--viewer') >= 0;
const isProduction = process.argv.indexOf('--mode=production') >= 0;
const minify = process.argv.indexOf('--minify') >= 0;

const defaultConfigs = Array(isProduction ? 2 : 1)
  .fill(0)
  .map(() => {
    return {
      mode: isProduction ? 'production' : 'development',
      cache: false,
      output: {
        library: ['toastui', 'Editor'],
        libraryTarget: 'umd',
        libraryExport: 'default',
        path: path.resolve(__dirname, minify ? 'dist/cdn' : 'dist'),
        filename: `toastui-[name]${minify ? '.min' : ''}.js`
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
          },
          {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader']
          },
          {
            test: /\.png$/i,
            use: 'url-loader'
          }
        ]
      },
      plugins: [
        new MiniCssExtractPlugin({
          moduleFilename: ({ name }) =>
            `toastui-${name.replace('-all', '')}${minify ? '.min' : ''}.css`
        }),
        new webpack.BannerPlugin({
          banner: [
            pkg.name,
            `@version ${pkg.version} | ${new Date().toDateString()}`,
            `@author ${pkg.author}`,
            `@license ${pkg.license}`
          ].join('\n'),
          raw: false,
          entryOnly: true
        })
      ],
      externals: [
        {
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

function addFileManagerPlugin(config) {
  // When an entry option's value is set to a CSS file,
  // empty JavaScript files are created. (e.g. toastui-editor-only.js)
  // These files are unnecessary, so use the FileManager plugin to delete them.
  const options = minify
    ? [
        {
          delete: [
            './dist/cdn/toastui-editor-only.min.js',
            './dist/cdn/toastui-editor-old.min.js',
            './dist/cdn/toastui-editor-viewer-old.min.js'
          ]
        }
      ]
    : [
        {
          delete: [
            './dist/toastui-editor-only.js',
            './dist/toastui-editor-old.js',
            './dist/toastui-editor-viewer-old.js'
          ]
        },
        { copy: [{ source: './dist/*.{js,css}', destination: './dist/cdn' }] }
      ];

  config.plugins.push(new FileManagerPlugin({ onEnd: options }));
}

function addMinifyPlugin(config) {
  config.optimization = {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        extractComments: false
      }),
      new OptimizeCSSAssetsPlugin()
    ]
  };
}

function addAnalyzerPlugin(config, type) {
  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: `../../report/webpack/stats-${pkg.version}-${type}.html`
    })
  );
}

function setDevelopConfig(config) {
  if (isDevelopAll) {
    // check in examples
    config.entry = { 'editor-all': ENTRY_EDITOR };
    config.output.publicPath = 'dist/cdn';
    config.externals = [];
  } else if (isDevelopViewer) {
    // check in examples
    config.entry = { 'editor-viewer': ENTRY_VIEWER };
    config.output.publicPath = 'dist/cdn';
  } else {
    // check in demo
    config.module.rules = config.module.rules.slice(1);
    config.entry = { editor: ENTRY_EDITOR };
    config.output.publicPath = 'dist/';
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
    editor: ENTRY_EDITOR,
    'editor-viewer': ENTRY_VIEWER,
    'editor-only': './src/js/indexEditorOnlyStyle.js',
    // legacy styles
    'editor-old': './src/js/indexOldStyle.js',
    'editor-viewer-old': './src/css/old/contents.css'
  };

  addFileManagerPlugin(config);

  if (minify) {
    addMinifyPlugin(config);
    addAnalyzerPlugin(config, 'normal');
  }
}

function setProductionConfigForAll(config) {
  config.entry = { 'editor-all': ENTRY_EDITOR };
  config.output.path = path.resolve(__dirname, 'dist/cdn');
  config.externals = [];

  if (minify) {
    addMinifyPlugin(config);
    addAnalyzerPlugin(config, 'all');
  }
}

if (isProduction) {
  setProductionConfig(defaultConfigs[0]);
  setProductionConfigForAll(defaultConfigs[1]);
} else {
  setDevelopConfig(defaultConfigs[0]);
}

module.exports = defaultConfigs;

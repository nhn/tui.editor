/**
 * @fileoverview Configs for jQuery wrapper bundle file
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');

const TerserPlugin = require('terser-webpack-plugin');

function getOutputConfig(isCDN, isMinified) {
  const filename = 'toastui-jquery-[name]';

  if (isCDN) {
    return {
      library: ['tui', 'Editor'],
      libraryExport: 'default',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist/cdn'),
      filename: `${filename}${isMinified ? '.min' : ''}.js`
    };
  }

  return {
    libraryExport: 'default',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist'),
    filename: `${filename}.js`
  };
}

function getExternalsConfig(isProduction, isCDN) {
  if (isProduction) {
    if (isCDN) {
      return [
        {
          jquery: {
            commonjs: 'jquery',
            commonjs2: 'jquery',
            amd: 'jquery',
            root: ['$']
          }
        }
      ];
    } else {
      return ['jquery', 'tui-editor', 'tui-editor/dist/tui-editor-viewer'];
    }
  }

  return [];
}

function getOptimizationConfig(isProduction, isMinified) {
  let minimizer = [];

  if (isProduction && isMinified) {
    minimizer.push(
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        extractComments: false
      })
    );
  }

  return { minimizer };
}

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isMinified = !!argv.minify;
  const isCDN = !!argv.cdn;

  return {
    mode: isProduction ? 'production' : 'development',
    entry: {
      editor: './src/js/editor.js',
      'editor-viewer': './src/js/viewer.js'
    },
    output: getOutputConfig(isCDN, isMinified),
    externals: getExternalsConfig(isProduction, isCDN),
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          enforce: 'pre',
          options: {
            failOnError: isProduction
          }
        },
        {
          test: /\.js$/,
          exclude: /node_modules|dist/,
          loader: 'babel-loader?cacheDirectory',
          options: {
            rootMode: 'upward'
          }
        }
      ]
    },
    plugins: [
      new webpack.BannerPlugin(
        [
          'TOAST UI Editor : jQuery Wrapper',
          `@version ${pkg.version}`,
          `@author ${pkg.author}`,
          `@license ${pkg.license}`
        ].join('\n')
      )
    ],
    optimization: getOptimizationConfig(isProduction, isMinified),
    devServer: {
      historyApiFallback: false,
      progress: true,
      host: '0.0.0.0',
      disableHostCheck: true
    }
  };
};

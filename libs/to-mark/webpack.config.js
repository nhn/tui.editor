/**
 * @fileoverview Configs for plugin's bundle file
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
const path = require('path');
const webpack = require('webpack');
const { version } = require('./package.json');

const TerserPlugin = require('terser-webpack-plugin');

function getOptimizationConfig(isProduction, minify) {
  const minimizer = [];

  if (isProduction && minify) {
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

module.exports = (_, { mode, minify }) => {
  const isProduction = mode === 'production';
  const config = {
    mode: isProduction ? 'production' : 'development',
    entry: './src/index.js',
    output: {
      library: ['toMark'],
      libraryExport: 'default',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist'),
      filename: `to-mark${minify ? '.min' : ''}.js`
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules|dist/,
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
    optimization: getOptimizationConfig(isProduction, minify)
  };

  if (isProduction) {
    config.plugins = [
      new webpack.BannerPlugin(
        ['to-mark', `@version ${version} | ${new Date().toDateString()}`].join('\n')
      )
    ];
  } else {
    config.devServer = {
      inline: true,
      host: '0.0.0.0'
    };
    config.devtool = 'inline-source-map';
  }

  return config;
};

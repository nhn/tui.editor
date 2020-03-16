/**
 * @fileoverview Configs for jQuery wrapper bundle file
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
const path = require('path');
const webpack = require('webpack');
const { version, author, license } = require('./package.json');

const TerserPlugin = require('terser-webpack-plugin');

function getOutputConfig(isProduction, isCDN, minify) {
  const filename = 'toastui-jquery-[name]';

  if (!isProduction || isCDN) {
    const config = {
      library: ['toastui', 'Editor'],
      libraryExport: 'default',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist/cdn'),
      filename: `${filename}${minify ? '.min' : ''}.js`
    };

    if (!isProduction) {
      config.publicPath = 'dist/cdn';
    }

    return config;
  }

  return {
    libraryExport: 'default',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist'),
    filename: `${filename}.js`
  };
}

function getExternalsConfig(isProduction, isCDN) {
  const isDev = !isProduction;
  const isProdCdn = isProduction && isCDN;
  const isProdNpm = isProduction && !isCDN;

  if (isDev || isProdCdn) {
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
  }

  if (isProdNpm) {
    return ['jquery', '@toast-ui/editor', '@toast-ui/editor/dist/toastui-editor-viewer'];
  }

  return [];
}

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

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const minify = !!argv.minify;
  const isCDN = !!argv.cdn;
  const config = {
    mode: isProduction ? 'production' : 'development',
    entry: {
      editor: './src/js/editor.js',
      'editor-viewer': './src/js/viewer.js'
    },
    output: getOutputConfig(isProduction, isCDN, minify),
    externals: getExternalsConfig(isProduction, isCDN),
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
        [
          'TOAST UI Editor : jQuery Wrapper',
          `@version ${version} | ${new Date().toDateString()}`,
          `@author ${author}`,
          `@license ${license}`
        ].join('\n')
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

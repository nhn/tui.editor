/**
 * @fileoverview Configs for plugin's bundle file
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');

const TerserPlugin = require('terser-webpack-plugin');

function getEntryConfig(isAll) {
  if (isAll) {
    return './src/js/indexAll.js';
  }

  return './src/js/index.js';
}

function getOutputConfig(isProduction, isCDN, isAll, minify) {
  let filename = `toastui-${pkg.name.replace(/@toast-ui\//, '')}`;

  if (!isProduction || isCDN) {
    const config = {
      library: ['toastui', 'Editor', 'plugin', 'codeSyntaxHighlight'],
      libraryExport: 'default',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist/cdn'),
      filename: `${filename}${isAll ? '-all' : ''}${minify ? '.min' : ''}.js`
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

function getExternalsConfig(isProduction, isCDN, isAll) {
  if (isProduction && !isAll) {
    if (isCDN) {
      return [
        {
          'highlight.js/lib/highlight': {
            commonjs: 'highlight.js',
            commonjs2: 'highlight.js',
            amd: 'highlight.js',
            root: ['hljs']
          }
        }
      ];
    } else {
      return ['highlight.js/lib/highlight'];
    }
  }

  return [];
}

function getOptimizationConfig(isProduction, minify) {
  let minimizer = [];

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
  const isAll = !!argv.all;

  return {
    mode: isProduction ? 'production' : 'development',
    entry: getEntryConfig(isAll),
    output: getOutputConfig(isProduction, isCDN, isAll, minify),
    externals: getExternalsConfig(isProduction, isCDN, isAll),
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
    plugins: [
      new webpack.BannerPlugin(
        [
          'TOAST UI Editor : Code Syntax Highlight Plugin',
          `@version ${pkg.version}`,
          `@author ${pkg.author}`,
          `@license ${pkg.license}`
        ].join('\n')
      )
    ],
    optimization: getOptimizationConfig(isProduction, minify),
    devServer: {
      inline: true,
      host: '0.0.0.0',
      port: 8081,
      disableHostCheck: true
    },
    devtool: 'inline-source-map'
  };
};

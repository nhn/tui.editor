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

function getOutputConfig(isCDN, isMinified, isAll) {
  let filename = `toastui-${pkg.name.replace(/@toast-ui\//, '')}`;

  if (isCDN) {
    return {
      library: ['tui', 'Editor', 'plugin', 'codeSyntaxHighlight'],
      libraryExport: 'default',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist/cdn'),
      filename: `${filename}${isAll ? '-all' : ''}${isMinified ? '.min' : ''}.js`
    };
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
  const isAll = !!argv.all;

  return {
    mode: isProduction ? 'production' : 'development',
    entry: getEntryConfig(isAll),
    output: getOutputConfig(isCDN, isMinified, isAll),
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
    optimization: getOptimizationConfig(isProduction, isMinified),
    devServer: {
      historyApiFallback: false,
      progress: true,
      host: '0.0.0.0',
      disableHostCheck: true
    }
  };
};

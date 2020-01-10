/**
 * @fileoverview configs for plugin's bundle file
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');

const TerserPlugin = require('terser-webpack-plugin');

function getOutputConfig(isCDN, isMinified) {
  if (isCDN) {
    return {
      library: ['tui', 'Editor', 'plugin', 'uml'],
      libraryExport: 'default',
      libraryTarget: 'window',
      path: path.resolve(__dirname, 'dist/cdn'),
      filename: `toastui-editor-plugin-uml${isMinified ? '.min' : ''}.js`
    };
  }

  return {
    libraryExport: 'default',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist'),
    filename: 'plugin.js'
  };
}

function getExternalsConfig(isProduction, isCDN) {
  if (isProduction && !isCDN) {
    return [
      {
        'plantuml-encoder': {
          commonjs: 'plantuml-encoder',
          commonjs2: 'plantuml-encoder',
          amd: 'plantuml-encoder',
          root: ['plantumlEncoder']
        }
      }
    ];
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
    entry: './src/js/index.js',
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
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
    },
    plugins: [
      new webpack.BannerPlugin(
        [
          'TOAST UI Editor : UML Plugin',
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

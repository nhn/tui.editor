/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @fileoverview Configs for plugin's bundle file
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
const path = require('path');
const webpack = require('webpack');
const { name, version, author, license } = require('./package.json');

const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

function getOutputConfig(isProduction, isCDN, minify) {
  const filename = `toastui-${name.replace(/@toast-ui\//, '')}`;
  const defaultConfig = {
    environment: {
      arrowFunction: false,
      const: false,
    },
  };

  if (!isProduction || isCDN) {
    const config = {
      ...defaultConfig,
      library: {
        name: ['toastui', 'Editor', 'plugin', 'uml'],
        export: 'default',
        type: 'umd',
      },
      path: path.resolve(__dirname, 'dist/cdn'),
      filename: `${filename}${minify ? '.min' : ''}.js`,
    };

    if (!isProduction) {
      config.publicPath = '/dist/cdn';
    }

    return config;
  }

  return {
    ...defaultConfig,
    library: {
      export: 'default',
      type: 'commonjs2',
    },
    path: path.resolve(__dirname, 'dist'),
    filename: `${filename}.js`,
  };
}

function getExternalsConfig(isProduction, isCDN) {
  if (isProduction && !isCDN) {
    return ['plantuml-encoder'];
  }

  return [];
}

function getOptimizationConfig(isProduction, minify) {
  const minimizer = [];

  if (isProduction && minify) {
    minimizer.push(
      new TerserPlugin({
        parallel: true,
        extractComments: false,
      })
    );
  }

  return { minimizer };
}

module.exports = (env) => {
  const isProduction = env.WEBPACK_BUILD;
  const { minify = false, cdn = false } = env;
  const config = {
    mode: isProduction ? 'production' : 'development',
    entry: './src/js/index.js',
    output: getOutputConfig(isProduction, cdn, minify),
    externals: getExternalsConfig(isProduction, cdn),
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules|dist/,
          loader: 'babel-loader?cacheDirectory',
          options: {
            rootMode: 'upward',
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    optimization: getOptimizationConfig(isProduction, minify),
  };

  if (isProduction) {
    config.plugins = [
      new webpack.BannerPlugin(
        [
          'TOAST UI Editor : UML Plugin',
          `@version ${version} | ${new Date().toDateString()}`,
          `@author ${author}`,
          `@license ${license}`,
        ].join('\n')
      ),
      new ESLintPlugin({
        extensions: ['js', 'ts'],
        exclude: ['node_modules', 'dist'],
        failOnError: isProduction,
      }),
    ];
  } else {
    config.devServer = {
      inline: true,
      host: '0.0.0.0',
      port: 8081,
    };
    config.devtool = 'inline-source-map';
  }

  return config;
};

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const entry = require('webpack-glob-entry');
const pkg = require('../package.json');

const TerserPlugin = require('terser-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

function getOptimizationConfig(minify) {
  const minimizer = [];

  if (minify) {
    minimizer.push(
      new TerserPlugin({
        parallel: true,
        extractComments: false,
      })
    );
  }

  return { minimizer };
}

function getEntries() {
  const entries = entry('./src/i18n/*.ts');

  delete entries['en-us'];
  delete entries.i18n;

  return entries;
}

module.exports = (env) => {
  const { minify = false } = env;

  return {
    mode: 'production',
    entry: getEntries(),
    output: {
      library: {
        type: 'umd',
      },
      path: path.resolve(__dirname, minify ? '../dist/cdn/i18n' : '../dist/i18n'),
      filename: `[name]${minify ? '.min' : ''}.js`,
    },
    externals: [
      {
        '../editorCore': {
          commonjs: '@toast-ui/editor',
          commonjs2: '@toast-ui/editor',
          amd: '@toast-ui/editor',
          root: ['toastui', 'Editor'],
        },
      },
    ],
    module: {
      rules: [
        {
          test: /\.ts$|\.js$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new webpack.BannerPlugin(
        [
          'TOAST UI Editor : i18n',
          `@version ${pkg.version}`,
          `@author ${pkg.author}`,
          `@license ${pkg.license}`,
        ].join('\n')
      ),
      new FileManagerPlugin({
        events: {
          onEnd: {
            copy: [{ source: './dist/i18n/*.js', destination: './dist/cdn/i18n' }],
          },
        },
      }),
      new ESLintPlugin({
        extensions: ['js', 'ts'],
        exclude: ['node_modules', 'dist'],
        failOnError: true,
      }),
    ],
    optimization: getOptimizationConfig(minify),
  };
};

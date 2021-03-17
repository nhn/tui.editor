/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');
const { version, author, license } = require('./package.json');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'toastui-vue-editor.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'toastui',
      type: 'umd',
    },
  },
  externals: {
    '@toast-ui/editor': {
      commonjs: '@toast-ui/editor',
      commonjs2: '@toast-ui/editor',
      amd: '@toast-ui/editor',
      root: ['toastui', 'Editor'],
    },
    '@toast-ui/editor/dist/toastui-editor-viewer': {
      commonjs: '@toast-ui/editor/dist/toastui-editor-viewer',
      commonjs2: '@toast-ui/editor/dist/toastui-editor-viewer',
      amd: '@toast-ui/editor/dist/toastui-editor-viewer',
      root: ['toastui', 'Editor'],
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.BannerPlugin({
      banner: [
        'TOAST UI Editor : Vue Wrapper',
        `@version ${version} | ${new Date().toDateString()}`,
        `@author ${author}`,
        `@license ${license}`,
      ].join('\n'),
    }),
  ],
};

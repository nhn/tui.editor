const path = require('path');
const webpack = require('webpack');
const { version, author, license } = require('./package.json');

const config = {
  entry: './src/index.js',
  output: {
    filename: 'toastui-react-editor.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2'
  },
  externals: {
    '@toast-ui/editor': {
      commonjs: '@toast-ui/editor',
      commonjs2: '@toast-ui/editor'
    },
    '@toast-ui/editor/dist/toastui-editor-viewer': {
      commonjs: '@toast-ui/editor/dist/toastui-editor-viewer',
      commonjs2: '@toast-ui/editor/dist/toastui-editor-viewer'
    },
    react: {
      commonjs: 'react',
      commonjs2: 'react'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src')],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: [
        'TOAST UI Editor : React Wrapper',
        `@version ${version} | ${new Date().toDateString()}`,
        `@author ${author}`,
        `@license ${license}`
      ].join('\n')
    })
  ]
};

module.exports = () => config;

const path = require('path');

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
    '@toast-ui/editor/dist/tui-editor-viewer': {
      commonjs: '@toast-ui/editor/dist/tui-editor-viewer',
      commonjs2: '@toast-ui/editor/dist/tui-editor-viewer'
    },
    react: {
      commonjs: 'react',
      commonjs2: 'react'
    },
    jquery: {
      commonjs: 'jquery',
      commonjs2: 'jquery'
    },
    'highlight.js': {
      commonjs: 'highlight.js',
      commonjs2: 'highlight.js'
    },
    'markdown-it': {
      commonjs: 'markdown-it',
      commonjs2: 'markdown-it'
    },
    'to-mark': {
      commonjs: 'to-mark',
      commonjs2: 'to-mark'
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
  }
};

module.exports = () => config;

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const commonConfig = {
  entry: path.resolve(__dirname, './src/index.ts'),
  module: {
    rules: [
      {
        test: /\.ts$/,
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
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    environment: {
      arrowFunction: false,
      const: false,
    },
    filename: 'toastmark.js',
    library: {
      type: 'commonjs',
    },
    publicPath: '/dist',
    path: path.resolve(__dirname, 'dist'),
  },
};

module.exports = (env, { mode = 'development' }) => {
  if (mode === 'production') {
    return commonConfig;
  }

  return merge(commonConfig, {
    entry: path.resolve(__dirname, './src/__sample__/index.ts'),
    mode,
    devtool: 'inline-source-map',
    output: {
      library: {
        type: 'umd',
      },
      publicPath: '/',
      path: path.resolve(__dirname, '/'),
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
      }),
    ],
    devServer: {
      open: true,
      inline: true,
      host: '0.0.0.0',
      port: 8000,
      disableHostCheck: true,
    },
  });
};

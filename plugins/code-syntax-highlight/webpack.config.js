/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @fileoverview Configs for plugin's bundle file
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
const path = require('path');
const webpack = require('webpack');
const { name, version, author, license } = require('./package.json');

const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const filename = `toastui-${name.replace(/@toast-ui\//, '')}`;

function getEntryConfig(isAll) {
  if (isAll) {
    return './src/indexAll.ts';
  }

  return './src/index.ts';
}

function getOutputConfig(isProduction, isCDN, isAll, minify) {
  if (!isProduction || isCDN) {
    const config = {
      library: ['toastui', 'Editor', 'plugin', 'codeSyntaxHighlight'],
      libraryExport: 'default',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist/cdn'),
      filename: `${filename}${isAll ? '-all' : ''}${minify ? '.min' : ''}.js`,
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
    filename: `${filename}.js`,
  };
}

function getExternalsConfig(isProduction) {
  return isProduction ? ['prosemirror-state', 'prosemirror-view'] : [];
}

function getOptimizationConfig(isProduction, minify) {
  const minimizer = [];

  if (isProduction && minify) {
    minimizer.push(
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        extractComments: false,
      })
    );
  }

  return { minimizer };
}

module.exports = (_, argv) => {
  const isProduction = argv.mode === 'production';
  const minify = !!argv.minify;
  const isCDN = !!argv.cdn;
  const isAll = !!argv.all;
  const config = {
    mode: isProduction ? 'production' : 'development',
    entry: getEntryConfig(isAll),
    output: getOutputConfig(isProduction, isCDN, isAll, minify),
    externals: getExternalsConfig(isProduction),
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules|dist/,
          loader: 'eslint-loader',
          enforce: 'pre',
          options: {
            failOnError: isProduction,
          },
        },
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
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@': path.resolve('src'),
        '@t': path.resolve('types'),
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: () => `${filename}${minify ? '.min' : ''}.css`,
      }),
    ],
    optimization: getOptimizationConfig(isProduction, minify),
  };

  if (isProduction) {
    config.plugins.push(
      new webpack.BannerPlugin(
        [
          'TOAST UI Editor : Code Syntax Highlight Plugin',
          `@version ${version} | ${new Date().toDateString()}`,
          `@author ${author}`,
          `@license ${license}`,
        ].join('\n')
      )
    );
  } else {
    config.devServer = {
      inline: true,
      host: '0.0.0.0',
    };
    config.devtool = 'inline-source-map';
  }

  return config;
};

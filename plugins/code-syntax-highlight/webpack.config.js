/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const { name, version, author, license } = require('./package.json');

const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const filename = `toastui-${name.replace(/@toast-ui\//, '')}`;

const ENTRY = './src/index.ts';
const ENTRY_ALL_LANG = './src/indexAll.ts';

function getOutputConfig(isProduction, isCDN, isAll, minify) {
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
        name: ['toastui', 'Editor', 'plugin', 'codeSyntaxHighlight'],
        export: 'default',
        type: 'umd',
      },
      path: path.resolve(__dirname, 'dist/cdn'),
      filename: `${filename}${isAll ? '-all' : ''}${minify ? '.min' : ''}.js`,
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
    filename: `${filename}${isAll ? '-all' : ''}.js`,
  };
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
    minimizer.push(new CssMinimizerPlugin());
  }

  return { minimizer };
}

module.exports = (env) => {
  const isProduction = env.WEBPACK_BUILD;
  const { minify = false, cdn = false, all = false } = env;
  const config = {
    mode: isProduction ? 'production' : 'development',
    entry: all ? ENTRY_ALL_LANG : ENTRY,
    output: getOutputConfig(isProduction, cdn, all, minify),
    externals: ['prosemirror-state', 'prosemirror-view'],
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
      new ESLintPlugin({
        extensions: ['js', 'ts'],
        exclude: ['node_modules', 'dist'],
        failOnError: isProduction,
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
      // https://github.com/webpack/webpack-dev-server/issues/2484
      injectClient: false,
      inline: true,
      host: '0.0.0.0',
      port: 8081,
    };
    config.devtool = 'inline-source-map';
  }

  return config;
};

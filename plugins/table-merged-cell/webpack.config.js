/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const { name, version, author, license } = require('./package.json');

const TerserPlugin = require('terser-webpack-plugin');

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
        name: ['toastui', 'Editor', 'plugin', 'tableMergedCell'],
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
    libraryExport: 'default',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist'),
    filename: `${filename}.js`,
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
    optimization: getOptimizationConfig(isProduction, minify),
  };

  if (isProduction) {
    config.plugins = [
      new webpack.BannerPlugin(
        [
          'TOAST UI Editor : Table Merged Cell Plugin',
          `@version ${version} | ${new Date().toDateString()}`,
          `@author ${author}`,
          `@license ${license}`,
        ].join('\n')
      ),
    ];
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

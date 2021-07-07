/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const { name, version, author, license } = require('./package.json');

const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

function getOutputConfig(isProduction, isCDN, minify) {
  const filename = `toastui-${name.replace(/@toast-ui\//, '')}`;
  const defaultConfig = {
    library: {
      name: ['toastui', 'Editor', 'plugin', 'chart'],
      export: 'default',
      type: 'umd',
    },
    environment: {
      arrowFunction: false,
      const: false,
    },
  };

  if (!isProduction || isCDN) {
    const config = {
      ...defaultConfig,
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
    path: path.resolve(__dirname, 'dist'),
    filename: `${filename}.js`,
  };
}

function getExternalsConfig() {
  return [
    {
      '@toast-ui/chart': {
        commonjs: '@toast-ui/chart',
        commonjs2: '@toast-ui/chart',
        amd: '@toast-ui/chart',
        root: ['toastui', 'Chart'],
      },
    },
  ];
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
    entry: './src/index.ts',
    output: getOutputConfig(isProduction, cdn, minify),
    externals: getExternalsConfig(isProduction, cdn),
    resolve: {
      fallback: {
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        os: require.resolve('os-browserify'),
      },
      extensions: ['.ts', '.js'],
    },
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
        },
      ],
    },
    plugins: [
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
          'TOAST UI Editor : Chart Plugin',
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

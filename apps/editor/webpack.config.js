/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @fileoverview configs file for bundling
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const ENTRY_EDITOR = './src/index.ts';
const ENTRY_VIEWER = './src/indexViewer.ts';

const isProduction = process.argv.indexOf('--mode=production') >= 0;
let minify;

function addFileManagerPlugin(config) {
  // When an entry option's value is set to a CSS file,
  // empty JavaScript files are created. (e.g. toastui-editor-only.js)
  // These files are unnecessary, so use the FileManager plugin to delete them.
  const options = minify
    ? [
        {
          delete: [
            './dist/cdn/toastui-editor-only.min.js',
            './dist/cdn/toastui-editor-old.min.js',
            './dist/cdn/toastui-editor-viewer-old.min.js',
          ],
        },
      ]
    : [
        {
          delete: [
            './dist/toastui-editor-only.js',
            './dist/toastui-editor-old.js',
            './dist/toastui-editor-viewer-old.js',
          ],
        },
        { copy: [{ source: './dist/*.{js,css}', destination: './dist/cdn' }] },
      ];

  config.plugins.push(new FileManagerPlugin({ onEnd: options }));
}

function addMinifyPlugin(config) {
  config.optimization = {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        extractComments: false,
      }),
      new OptimizeCSSAssetsPlugin(),
    ],
  };
}

function addAnalyzerPlugin(config, type) {
  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: `../../report/webpack/stats-${pkg.version}-${type}.html`,
    })
  );
}

function setDevelopConfig(config) {
  // check in examples
  config.entry = { 'editor-all': ENTRY_EDITOR };
  config.output.publicPath = '/dist/cdn';
  config.externals = [];
  config.devtool = 'inline-source-map';
  config.devServer = {
    inline: true,
    host: '0.0.0.0',
    port: 8080,
    disableHostCheck: true,
  };
}

function setProductionConfig(config) {
  config.entry = {
    editor: ENTRY_EDITOR,
    'editor-viewer': ENTRY_VIEWER,
  };

  // addFileManagerPlugin(config);

  if (minify) {
    addMinifyPlugin(config);
    addAnalyzerPlugin(config, 'normal');
  }
}

function setProductionConfigForAll(config) {
  config.entry = { 'editor-all': ENTRY_EDITOR };
  config.output.path = path.resolve(__dirname, 'dist/cdn');
  config.externals = [];

  if (minify) {
    addMinifyPlugin(config);
    addAnalyzerPlugin(config, 'all');
  }
}

module.exports = (env) => {
  minify = !!env.minify;

  const configs = Array(isProduction ? 2 : 1)
    .fill(0)
    .map(() => {
      return {
        mode: isProduction ? 'production' : 'development',
        cache: false,
        output: {
          environment: {
            arrowFunction: false,
            const: false,
          },
          library: {
            name: ['toastui', 'Editor'],
            type: 'umd',
            export: 'default',
          },
          path: path.resolve(__dirname, minify ? 'dist/cdn' : 'dist'),
          filename: `toastui-[name]${minify ? '.min' : ''}.js`,
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
              exclude: /node_modules/,
            },
            {
              test: /\.css$/,
              use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
              test: /\.png$/i,
              use: 'url-loader',
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
            moduleFilename: ({ name }) =>
              `toastui-${name.replace('-all', '')}${minify ? '.min' : ''}.css`,
          }),
          new webpack.BannerPlugin({
            banner: [
              pkg.name,
              `@version ${pkg.version} | ${new Date().toDateString()}`,
              `@author ${pkg.author}`,
              `@license ${pkg.license}`,
            ].join('\n'),
            raw: false,
            entryOnly: true,
          }),
          // new ESLintPlugin({
          //   extensions: ['js', 'ts'],
          //   exclude: ['node_modules', 'dist'],
          //   failOnError: false
          // })
        ],
        optimization: {
          minimize: false,
        },
        performance: {
          hints: false,
        },
      };
    });


  if (isProduction) {
    setProductionConfig(configs[0]);
    setProductionConfigForAll(configs[1]);
  } else {
    setDevelopConfig(configs[0]);
  }

  return configs;
};

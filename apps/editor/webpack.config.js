/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const ENTRY_EDITOR = './src/index.ts';
const ENTRY_ONLY_STYLE = './src/indexEditorOnlyStyle.ts';
const ENTRY_VIEWER = './src/indexViewer.ts';

let isProduction;
let minify;

function addFileManagerPlugin(config) {
  // When an entry option's value is set to a CSS file,
  // empty JavaScript files are created. (e.g. toastui-editor-only.js)
  // These files are unnecessary, so use the FileManager plugin to delete them.
  const options = minify
    ? {
        delete: ['./dist/cdn/toastui-editor-only.min.js'],
      }
    : {
        delete: ['./dist/toastui-editor-only.js'],
        copy: [{ source: './dist/*.{js,css}', destination: './dist/cdn' }],
      };

  config.plugins.push(new FileManagerPlugin({ events: { onEnd: options } }));
}

function addCopyPluginForThemeCss(config) {
  const options = minify
    ? {
        patterns: [{ from: './src/css/theme/*.css', to: './theme/toastui-editor-[name].min.css' }],
      }
    : {
        patterns: [{ from: './src/css/theme/*.css', to: './theme/toastui-editor-[name].css' }],
      };

  config.plugins.push(new CopyPlugin(options));
}

function addMinifyPlugin(config) {
  config.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
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

  config.plugins.pop();
  config.externals = [];

  config.devtool = 'inline-source-map';
  config.devServer = {
    // https://github.com/webpack/webpack-dev-server/issues/2484
    injectClient: false,
    inline: true,
    host: '0.0.0.0',
    port: 8080,
    disableHostCheck: true,
  };
}

function setProductionConfig(config) {
  config.entry = {
    editor: ENTRY_EDITOR,
    'editor-only': ENTRY_ONLY_STYLE,
    'editor-viewer': ENTRY_VIEWER,
  };

  addFileManagerPlugin(config);
  addCopyPluginForThemeCss(config);

  if (minify) {
    addMinifyPlugin(config);
    addAnalyzerPlugin(config, 'normal');
  }
}

function setProductionConfigForAll(config) {
  config.entry = { 'editor-all': ENTRY_EDITOR };
  config.output.path = path.resolve(__dirname, 'dist/cdn');
  config.externals = [];

  addCopyPluginForThemeCss(config);

  if (minify) {
    addMinifyPlugin(config);
    addAnalyzerPlugin(config, 'all');
  }
}

module.exports = (env) => {
  minify = !!env.minify;
  isProduction = env.WEBPACK_BUILD;

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
              type: 'asset/inline',
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
            filename: ({ chunk }) =>
              `toastui-${chunk.name.replace('-all', '')}${minify ? '.min' : ''}.css`,
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
          new ESLintPlugin({
            extensions: ['js', 'ts'],
            exclude: ['node_modules', 'dist'],
            failOnError: isProduction,
          }),
        ],
        externals: [
          {
            'prosemirror-commands': {
              commonjs: 'prosemirror-commands',
              commonjs2: 'prosemirror-commands',
              amd: 'prosemirror-commands',
            },
            'prosemirror-history': {
              commonjs: 'prosemirror-history',
              commonjs2: 'prosemirror-history',
              amd: 'prosemirror-history',
            },
            'prosemirror-inputrules': {
              commonjs: 'prosemirror-inputrules',
              commonjs2: 'prosemirror-inputrules',
              amd: 'prosemirror-inputrules',
            },
            'prosemirror-keymap': {
              commonjs: 'prosemirror-keymap',
              commonjs2: 'prosemirror-keymap',
              amd: 'prosemirror-keymap',
            },
            'prosemirror-model': {
              commonjs: 'prosemirror-model',
              commonjs2: 'prosemirror-model',
              amd: 'prosemirror-model',
            },
            'prosemirror-state': {
              commonjs: 'prosemirror-state',
              commonjs2: 'prosemirror-state',
              amd: 'prosemirror-state',
            },
            'prosemirror-view': {
              commonjs: 'prosemirror-view',
              commonjs2: 'prosemirror-view',
              amd: 'prosemirror-view',
            },
            'prosemirror-transform': {
              commonjs: 'prosemirror-transform',
              commonjs2: 'prosemirror-transform',
              amd: 'prosemirror-transform',
            },
          },
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

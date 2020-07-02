/**
 * Config file for testing
 * @author NHN. FE Development Lab <dl_javascript@nhn.com>
 */
const path = require('path');

const webdriverConfig = {
  hostname: 'fe.nhnent.com',
  port: 4444,
  remoteHost: true
};

/**
 * Set config by environment
 * @param {object} defaultConfig - default config
 * @param {string} server - server type ('ne' or local)
 */
function setConfig(defaultConfig, server) {
  if (server === 'ne') {
    defaultConfig.customLaunchers = {
      IE10: {
        base: 'WebDriver',
        config: webdriverConfig,
        browserName: 'internet explorer',
        version: '10'
      },
      IE11: {
        base: 'WebDriver',
        config: webdriverConfig,
        browserName: 'internet explorer',
        version: '11',
        platformName: 'windows'
      },
      Edge: {
        base: 'WebDriver',
        config: webdriverConfig,
        browserName: 'MicrosoftEdge'
      },
      'Chrome-WebDriver': {
        base: 'WebDriver',
        config: webdriverConfig,
        browserName: 'chrome'
      },
      'Firefox-WebDriver': {
        base: 'WebDriver',
        config: webdriverConfig,
        browserName: 'firefox'
      },
      'Safari-WebDriver': {
        base: 'WebDriver',
        config: webdriverConfig,
        browserName: 'safari'
      }
    };
    defaultConfig.browsers = [
      'IE10',
      'IE11',
      'Edge',
      'Chrome-WebDriver',
      'Firefox-WebDriver'
      // 'Safari-WebDriver' // active only when safari test is needed
    ];
    defaultConfig.coverageIstanbulReporter = {
      fixWebpackSourcePaths: true,
      dir: 'report/coverage/',
      reports: ['html', 'cobertura'],
      'report-config': {
        html: {
          subdir: 'report-html/'
        },
        cobertura: {
          subdir: 'report-cobertura/',
          file: 'cobertura.txt'
        }
      }
    };
  } else {
    defaultConfig.browsers = ['ChromeHeadless'];
  }
}

module.exports = function(config) {
  const defaultConfig = {
    basePath: './',
    frameworks: ['jasmine-ajax', 'jasmine'],
    files: ['test/index.js'],
    preprocessors: {
      'test/index.js': ['webpack', 'sourcemap']
    },
    reporters: ['dots', 'coverage-istanbul'],
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.js$/,
            loader: 'babel-loader?cacheDirectory',
            exclude: /node_modules|dist/,
            options: {
              rootMode: 'upward'
            }
          },
          {
            test: /\.js$/,
            use: {
              loader: 'istanbul-instrumenter-loader',
              options: { esModules: true }
            },
            exclude: /node_modules|\.spec\.js$/,
            enforce: 'post'
          }
        ]
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src/js')
        }
      }
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    singleRun: true
  };

  /* eslint-disable */
  setConfig(defaultConfig, process.env.KARMA_SERVER);
  config.set(defaultConfig);
};

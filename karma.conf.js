/*
* @fileoverview configs file for testing
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/

/* eslint max-len: 0, no-process-env: 0, object-shorthand: 0, camelcase: 0 */

const path = require('path');
const pkg = require('./package.json');
const nhnentWebDriver = {
  hostname: 'fe.nhnent.com',
  port: 4444,
  remoteHost: true
};
const localhostWebDriver = {
  hostname: 'localhost',
  port: 4444,
  remoteHost: true
};
const configurator = {};
// 'nhnent'|'saucelabs'|'localhost'|'noserver'
const SERVER = process.env.SERVER || 'noserver';
// 'Chrome'|'Safari'|'IE10'|'IE11'|'Edge'|'Firefox'
const BROWSER = process.env.BROWSER;
// 'true'|'false'
const SINGLE_RUN = process.env.SINGLE_RUN === 'true';

/**
 * make customLauncher format object
 * @param {string} base - 'SauceLabs' || 'WebDriver'
 * @param {string} browserName - browser name
 * @param {string} version - browser version
 * @returns {object} - custom launcher format object
 */
function nhnentLauncher(base, browserName, version) {
  return {
    base,
    browserName,
    version,
    config: nhnentWebDriver
  };
}

/**
 * make customLauncher format object
 * @param {string} base - 'SauceLabs' || 'WebDriver'
 * @param {string} browserName - browser name
 * @param {string} platform - os
 * @param {string} version - browser version
 * @returns {object} - custom launcher format object
 */
function saucelabsLauncher(base, browserName, platform, version) {
  return {
    base,
    browserName,
    platform,
    version
  };
}

configurator.nhnent = function(defaultConfig) {
  const customLaunchers = defaultConfig.customLaunchers = {};
  if (BROWSER === 'IE10' || !BROWSER) {
    customLaunchers.IE10 = nhnentLauncher('WebDriver', 'internet explorer', '10');
  }
  if (BROWSER === 'IE11' || !BROWSER) {
    customLaunchers.IE11 = nhnentLauncher('WebDriver', 'internet explorer', '11');
  }
  if (BROWSER === 'Edge' || !BROWSER) {
    customLaunchers.Edge = nhnentLauncher('WebDriver', 'MicrosoftEdge');
  }
  if (BROWSER === 'Chrome' || !BROWSER) {
    customLaunchers['Chrome-WebDriver'] = nhnentLauncher('WebDriver', 'chrome');
  }
  if (BROWSER === 'Firefox' || !BROWSER) {
    customLaunchers['Firefox-WebDriver'] = nhnentLauncher('WebDriver', 'firefox');
  }
  if (BROWSER === 'Safari' || !BROWSER) {
    customLaunchers['Safari-WebDriver'] = nhnentLauncher('WebDriver', 'safari');
  }
  defaultConfig.concurrency = 1;
  defaultConfig.browsers = Object.keys(defaultConfig.customLaunchers);
};

configurator.saucelabs = function(defaultConfig) {
  defaultConfig.sauceLabs = {
    testName: `${pkg.name} ::: ${pkg.version} ::: ${new Date().toLocaleDateString('en-US')}`,
    username: process.env.SAUCE_USERNAME,
    accessKey: process.env.SAUCE_ACCESS_KEY,
    startConnect: true,
    tags: [pkg.name, pkg.version],
    build: pkg.version,
    passed: true,
    recordVideo: true,
    recordScreenshots: true,
    recordLogs: true,
    webdriverRemoteQuietExceptions: true
  };
  const customLaunchers = defaultConfig.customLaunchers = {};
  if (BROWSER === 'Chrome' || !BROWSER) {
    customLaunchers.sl_chrome = saucelabsLauncher('SauceLabs', 'chrome', 'Windows 10', '59.0');
  }
  if (BROWSER === 'Firefox' || !BROWSER) {
    customLaunchers.sl_firefox = saucelabsLauncher('SauceLabs', 'firefox', 'macOS 10.12', '54.0');
  }
  if (BROWSER === 'IE10' || !BROWSER) {
    customLaunchers.sl_ie_10 = saucelabsLauncher('SauceLabs', 'internet explorer', 'Windows 8', '10.0');
  }
  if (BROWSER === 'IE11' || !BROWSER) {
    customLaunchers.sl_ie_11 = saucelabsLauncher('SauceLabs', 'internet explorer', 'Windows 8.1', '11.0');
  }
  if (BROWSER === 'Edge' || !BROWSER) {
    customLaunchers.sl_edge_14 = saucelabsLauncher('SauceLabs', 'MicrosoftEdge', 'Windows 10', '15.15063');
  }
  if (BROWSER === 'Safari' || !BROWSER) {
    customLaunchers.sl_safari = saucelabsLauncher('SauceLabs', 'safari', 'macOS 10.13', '11.0');
  }
  defaultConfig.reporters.push('saucelabs');
  defaultConfig.browsers = Object.keys(defaultConfig.customLaunchers);
  defaultConfig.browserNoActivityTimeout = 120000;
  defaultConfig.concurrency = 1;

  // safari & edge browsers can't run TC on localhost. the hostname below should be added to your system too
  // 127.0.0.1    tui.dev
  // https://support.saucelabs.com/hc/en-us/articles/115010079868-Issues-with-Safari-and-Karma-Test-Runner
  defaultConfig.hostname = 'tui.dev';
};

configurator.localhost = function(defaultConfig) {
  defaultConfig.customLaunchers = {};
  defaultConfig.customLaunchers.Chrome = {
    base: 'WebDriver',
    config: localhostWebDriver,
    browserName: 'Chrome'
  };
  defaultConfig.browsers = [
    BROWSER || 'Chrome'
  ];
  defaultConfig.singleRun = SINGLE_RUN || false;
};

configurator.noserver = function(defaultConfig) {
  defaultConfig.browsers = [
    BROWSER || 'ChromeHeadless'
  ];
  defaultConfig.singleRun = SINGLE_RUN || false;
};

module.exports = function(config) {
  const defaultConfig = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine-ajax', 'jasmine-jquery', 'jasmine'],

    // list of files / patterns to load in the browser
    // chart is not npm package and it needs global code snippet.
    // remove chart and code snippet from here once chart is on npm
    files: [
      'node_modules/codemirror/lib/codemirror.css',
      'src/css/tui-editor.css',
      'test/fixtures/*.*',
      'test/test.bundle.js'
    ],

    // list of files to exclude
    exclude: [],

    reporters: ['progress', 'junit', 'coverage', 'remap-coverage'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor

    preprocessors: {
      'src/js/**/*.js': ['webpack', 'sourcemap', 'coverage'],
      'test/test.bundle.js': ['webpack', 'sourcemap']
    },

    webpack: {
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules|lib|dist/,
            loader: 'babel-loader?cacheDirectory',
            options: {
              babelrc: true
            }
          },
          {
            enforce: 'post',
            include: path.resolve('src/'),
            test: /\.js$/,
            loader: 'istanbul-instrumenter-loader'
          }
        ]
      }
    },

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      noInfo: true,
      stats: {
        colors: true
      }
    },

    coverageReporter: {
      reporters: [{
        type: 'in-memory'
      }]
    },

    remapCoverageReporter: {
      html: 'report/coverage/html',
      cobertura: 'report/coverage/cobertura.xml'
    },

    junitReporter: {
      outputFile: 'report/junit-result.xml',
      outputDir: 'report',
      suite: ''
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
    // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    autoWatchBatchDelay: 100,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: SINGLE_RUN || true
  };

  configurator[SERVER](defaultConfig);
  config.set(defaultConfig);
};

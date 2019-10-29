/* eslint max-len: 0, no-process-env: 0, object-shorthand: 0, camelcase: 0 */
'use strict';

var pkg = require('./package.json');
var webdriverConfig = {
    hostname: 'fe.nhnent.com',
    port: 4444,
    remoteHost: true
};

/**
 * manipulate config by server
 * @param {Object} defaultConfig - base configuration
 * @param {('ne'|'sl'|null|undefined)} server - ne: team selenium grid, sl: saucelabs, null or undefined: local machine
 * @param {('Chrome'|'Safari'|'IE10'|'IE11'|'Edge'|'Firefox'|null|undefined)} browser - specify browser to run
 */
function setConfig(defaultConfig, server, browser) {
    if (server === 'ne') {
        defaultConfig.customLaunchers = {};
        if (browser === 'IE9' || !browser) {
            defaultConfig.customLaunchers.IE9 = {
                base: 'WebDriver',
                config: webdriverConfig,
                browserName: 'internet explorer',
                version: '9'
            };
        }
        if (browser === 'IE10' || !browser) {
            defaultConfig.customLaunchers.IE10 = {
                base: 'WebDriver',
                config: webdriverConfig,
                browserName: 'internet explorer',
                version: '10'
            };
        }
        if (browser === 'IE11' || !browser) {
            defaultConfig.customLaunchers.IE11 = {
                base: 'WebDriver',
                config: webdriverConfig,
                browserName: 'internet explorer',
                version: '11'
            };
        }
        if (browser === 'Edge' || !browser) {
            defaultConfig.customLaunchers.Edge = {
                base: 'WebDriver',
                config: webdriverConfig,
                browserName: 'MicrosoftEdge'
            };
        }
        if (browser === 'Chrome' || !browser) {
            defaultConfig.customLaunchers['Chrome-WebDriver'] = {
                base: 'WebDriver',
                config: webdriverConfig,
                browserName: 'chrome'
            };
        }
        if (browser === 'Firefox' || !browser) {
            defaultConfig.customLaunchers['Firefox-WebDriver'] = {
                base: 'WebDriver',
                config: webdriverConfig,
                browserName: 'firefox'
            };
        }
        if (browser === 'Safari' || !browser) {
            defaultConfig.customLaunchers['Safari-WebDriver'] = {
                base: 'WebDriver',
                config: webdriverConfig,
                browserName: 'safari'
            };
        }
        defaultConfig.concurrency = 1;
        defaultConfig.browsers = Object.keys(defaultConfig.customLaunchers);
    } else if (server === 'sl') {
        defaultConfig.sauceLabs = {
            testName: pkg.name + ' ::: ' + pkg.version + ':::' + new Date().toLocaleDateString('en-US'),
            username: process.env.SAUCE_USERNAME,
            accessKey: process.env.SAUCE_ACCESS_KEY,
            startConnect: false,
            tags: [pkg.name, pkg.version],
            build: pkg.version,
            passed: true,
            recordVideo: true,
            recordScreenshots: true,
            recordLogs: true,
            webdriverRemoteQuietExceptions: true
        };
        defaultConfig.customLaunchers = {};
        if (browser === 'Chrome' || !browser) {
            defaultConfig.customLaunchers.sl_chrome = {
                base: 'SauceLabs',
                browserName: 'chrome',
                platform: 'Windows 10',
                version: '59.0'
            };
        }
        if (browser === 'Firefox' || !browser) {
            defaultConfig.customLaunchers.sl_firefox = {
                base: 'SauceLabs',
                browserName: 'firefox',
                platform: 'macOS 10.12',
                version: '54.0'
            };
        }
        if (browser === 'IE9' || !browser) {
            defaultConfig.customLaunchers.sl_ie_11 = {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                platform: 'Windows 7',
                version: '9.0'
            };
        }
        if (browser === 'IE10' || !browser) {
            defaultConfig.customLaunchers.sl_ie_10 = {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                platform: 'Windows 8',
                version: '10.0'
            };
        }
        if (browser === 'IE11' || !browser) {
            defaultConfig.customLaunchers.sl_ie_11 = {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                platform: 'Windows 8.1',
                version: '11.0'
            };
        }
        if (browser === 'Edge' || !browser) {
            defaultConfig.customLaunchers.sl_edge_14 = {
                base: 'SauceLabs',
                browserName: 'MicrosoftEdge',
                platform: 'Windows 10',
                version: '15.15063'
            };
        }
        if (browser === 'Safari' || !browser) {
            defaultConfig.customLaunchers.sl_safari = {
                base: 'SauceLabs',
                browserName: 'safari',
                platform: 'macOS 10.12',
                version: '10.0'
            };
        }
        defaultConfig.reporters.push('saucelabs');
        defaultConfig.browsers = Object.keys(defaultConfig.customLaunchers);
        defaultConfig.browserNoActivityTimeout = 120000;
        defaultConfig.concurrency = 5;

        // safari & edge browsers can't run TC on localhost. the hostname below should be added to your system too
        // 127.0.0.1    tui.dev
        // https://support.saucelabs.com/hc/en-us/articles/115010079868-Issues-with-Safari-and-Karma-Test-Runner
        defaultConfig.hostname = 'tui.dev';
    } else {
        browser = browser || 'ChromeHeadless';
        defaultConfig.browsers = [
            browser
        ];
        defaultConfig.singleRun = false;
    }
}

module.exports = function(config) {
    var defaultConfig = {

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine-ajax', 'jasmine-jquery', 'jasmine'],

        files: [
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
                rules: [{
                    test: /\.js/,
                    exclude: /\.(spec|bundle)\.js/,
                    loader: 'istanbul-instrumenter-loader',
                    enforce: 'post'
                }]
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

        // optionally, configure the reporter
        coverageReporter: {
            dir: 'report/coverage/',
            reporters: [
                {
                    type: 'html',
                    subdir: function(browser) {
                        return 'report-html/' + browser;
                    }
                },
                {
                    type: 'cobertura',
                    subdir: function(browser) {
                        return 'report-cobertura/' + browser;
                    },
                    file: 'cobertura.txt'
                }
            ]
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
        singleRun: true
    };

    setConfig(defaultConfig, process.env.SERVER, process.env.BROWSER);
    config.set(defaultConfig);
};


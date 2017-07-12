'use strict';

var pkg = require('./package.json');

module.exports = function(config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine-ajax', 'jasmine-jquery', 'jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'test/test.bundle.js'
        ],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/test.bundle.js': ['webpack', 'sourcemap']
        },
        webpack: {
            module: {
                postLoaders: [{
                    test: /\.js/,
                    exclude: /\.(spec|bundle)\.js/,
                    loader: 'istanbul-instrumenter'
                }]
            }
        },

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            noInfo: true
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
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,
        autoWatchBatchDelay: 500,

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [
            'dots',
            'coverage',
            'junit',
            'saucelabs'
        ],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        concurrency: 5,

        browserNoActivityTimeout: 120000,

        // safari & edge browsers can't run TC on localhost. the hostname below should be added to your system too
        // 127.0.0.1    tui.dev
        // https://support.saucelabs.com/hc/en-us/articles/115010079868-Issues-with-Safari-and-Karma-Test-Runner
        hostname: 'tui.dev',

        sauceLabs: {
            testName: pkg.name + ' ::: ' + pkg.version + ' ::: ' + new Date().toLocaleDateString('en-US'),
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
        },

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            'sl_ie_9',
            'sl_ie_10',
            'sl_ie_11',
            'sl_edge_15',
            'sl_safari',
            'sl_chrome',
            'sl_firefox'
        ],

        customLaunchers: {
            'sl_chrome': {
                base: 'SauceLabs',
                browserName: 'chrome',
                platform: 'Windows 10',
                version: '59.0'
            },
            'sl_firefox': {
                base: 'SauceLabs',
                browserName: 'firefox',
                platform: 'macOS 10.12',
                version: '54.0'
            },
            'sl_ie_9': {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                platform: 'Windows 7',
                version: '9.0'
            },
            'sl_ie_10': {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                platform: 'Windows 8',
                version: '10.0'
            },
            'sl_ie_11': {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                platform: 'Windows 8.1',
                version: '11.0'
            },
            'sl_edge_15': {
                base: 'SauceLabs',
                browserName: 'MicrosoftEdge',
                platform: 'Windows 10',
                version: '15.15063'
            },
            'sl_safari': {
                base: 'SauceLabs',
                browserName: 'safari',
                platform: 'macOS 10.12',
                version: '10.0'
            }
        }
    });
};


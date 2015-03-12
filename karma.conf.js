var istanbul = require('browserify-istanbul');

module.exports = function(config) {
    'use strict';

    var webdriverConfig = {
        hostname: 'fe.nhnent.com',
        port: 4444,
        remoteHost: true
    };

    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['browserify', 'jasmine-ajax', 'jasmine-jquery', 'jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'lib/jquery/dist/jquery.js',
            'lib/codesnippet/code-snippet.js',
            'lib/marked/marked.min.js',
            'src/js/**/*.js',
            //{pattern: 'test/fixtures/*', included: false},
            'test/**/*.spec.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/js/**/*.js': ['browserify'],
            'test/**/*.spec.js': ['browserify']
        },

        browserify: {
            debug: true,
            transform: [istanbul({
                ignore: ['**/test/**', '**/tmpl/**'],
                defaultIgnore: true
            })]
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [
            'dots',
            'coverage',
            'junit'
        ],

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
            suite: ''
        },


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        autoWatchBatchDelay: 500,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            'IE9',
            'IE10',
            'IE11',
            'Chrome-WebDriver',
            'Firefox-WebDriver'
        ],

        customLaunchers: {
            'IE9': {
                base: 'WebDriver',
                config: webdriverConfig,
                browserName: 'IE9'
            },
            'IE10': {
                base: 'WebDriver',
                config: webdriverConfig,
                browserName: 'IE10'
            },
            'IE11': {
                base: 'WebDriver',
                config: webdriverConfig,
                browserName: 'IE11'
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
            }
        },
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};

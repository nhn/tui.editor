'use strict';

var webpackConfig = require('./webpack.config');
var reportCoverage = process.env.NODE_ENV === 'coverage';

module.exports = function(config) {
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
        frameworks: ['jasmine-ajax', 'jasmine-jquery', 'jasmine'],

        plugins: [
            //common
            'karma-jasmine',
            'karma-jasmine-ajax',
            'karma-jasmine-jquery',
            'karma-sourcemap-loader',
            'karma-webpack',
            'karma-coverage',

            //this config only
            'karma-webdriver-launcher',
            'karma-junit-reporter'
        ],

        // list of files / patterns to load in the browser
        files: [
            'lib/jquery/dist/jquery.js',
            'lib/tui-code-snippet/code-snippet.js',
            'lib/tui-component-colorpicker/dist/colorpicker.js',
            'lib/toMark/dist/toMark.js',
            'lib/highlightjs/highlight.pack.js',
            'lib/markdown-it/dist/markdown-it.min.js',
            'lib/codemirror/lib/codemirror.js',
            'lib/codemirror/lib/codemirror.css',
            'lib/codemirror/addon/mode/overlay.js',
            'lib/codemirror/mode/markdown/markdown.js',
            'lib/codemirror/mode/gfm/gfm.js',
            'lib/squire-rte/build/squire-raw.js',
            'test/fixtures/*.*',
            'test/test.bundle.js'
        ],

        // list of files to exclude
        exclude: [],

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: reportCoverage ? ['dots', 'coverage', 'junit'] : ['dots'],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/test.bundle.js': ['webpack', 'sourcemap']
        },

        webpack: {
            devtool: 'inline-source-map',
            module: webpackConfig.module
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

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // 동시 실행 browser 수를 두개로 제한
        // parallel 하게 실행하면 chrome과 IE10이 동시에 실행될 경우 chrome에서 포커스를 잃게되어 테스트가 깨지게 됨
        concurrency: 2,
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            'IE10',
            'IE11',
            'Chrome-WebDriver',
            'Firefox-WebDriver'
        ],

        customLaunchers: {
            'IE10': {
                base: 'WebDriver',
                config: webdriverConfig,
                browserName: 'internet explorer',
                version: 10
            },
            'IE11': {
                base: 'WebDriver',
                config: webdriverConfig,
                browserName: 'internet explorer',
                version: 11
            },
            'Edge': {
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
            }
        }
    });
};

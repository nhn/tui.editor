'use strict';

var webpackConfig = require('./webpack.config');
var reportCoverage = process.env.NODE_ENV === 'coverage';

module.exports = function(config) {
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
            'karma-chrome-launcher',
            'karma-narrow-reporter'
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

        reporters: reportCoverage ? ['narrow', 'coverage'] : ['narrow'],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor

        preprocessors: {
            'src/js/**/*.js': ['webpack', 'sourcemap'],
            'test/test.bundle.js': ['webpack', 'sourcemap']
        },

        webpack: {
            devtool: 'inline-source-map',
            module: webpackConfig.module
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
            dir: 'report/coverage/',
            reporters: [
                {
                    type: 'html',
                    subdir: function(browser) {
                        return 'report-html/' + browser;
                    }
                }
            ]
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
        singleRun: false,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            'Chrome'
        ]
    });
};


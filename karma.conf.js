module.exports = function(config) {
    'use strict';

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

            //this config only
            'karma-chrome-launcher',
            'karma-phantomjs-launcher',
            'karma-narrow-reporter'
        ],

        // list of files / patterns to load in the browser
        files: [
            'node_modules/phantomjs-polyfill/bind-polyfill.js',
            'lib/jquery/dist/jquery.js',
            'lib/tui-code-snippet/code-snippet.js',
            'lib/tui-component-colorpicker/dist/colorpicker.js',
            'lib/toMark/dist/toMark.js',
            'lib/highlightjs/highlight.pack.js',
            'lib/marked/marked.min.js',
            'lib/codemirror/lib/codemirror.js',
            'lib/codemirror/lib/codemirror.css',
            'lib/codemirror/addon/mode/overlay.js',
            'lib/codemirror/mode/markdown/markdown.js',
            'lib/codemirror/mode/gfm/gfm.js',
            'lib/Squire/build/squire-raw.js',
            'test/test.bundle.js'
        ],


        // list of files to exclude
        exclude: [],

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [
            'narrow'
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor

        preprocessors: {
            'test/test.bundle.js': ['webpack', 'sourcemap']
        },

        webpack: {
            devtool: 'inline-source-map'
        },

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            noInfo: true,
            stats: {
                colors: true
            }
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

        autoWatchBatchDelay: 100,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [
            //'Chrome',
            'PhantomJS_custom'
        ],
        customLaunchers: {
            'PhantomJS_custom': {
                base: 'PhantomJS',
                options: {
                    windowName: 'my-window',
                    settings: {
                        webSecurityEnabled: false
                    }
                },
                flags: ['--load-images=true'],
                debug: true
            }
        }
    });
};


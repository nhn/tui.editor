/* eslint max-len: 0, no-process-env: 0, object-shorthand: 0, camelcase: 0 */

const pkg = require('./package.json');
const webdriverConfig = {
    hostname: 'fe.nhnent.com',
    port: 4444,
    remoteHost: true
};
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/**
 * manipulate config by server
 * @param {Object} defaultConfig - base configuration
 * @param {('ne'|'sl'|null|undefined)} server - ne: team selenium grid, sl: saucelabs, null or undefined: local machine
 */
function setConfig(defaultConfig, server) {
    if (server === 'ne') {
        defaultConfig.customLaunchers = {
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
        };
        defaultConfig.concurrency = 1;
        defaultConfig.reporters = ['narrow', 'junit', 'coverage'];
        defaultConfig.browsers = Object.keys(defaultConfig.customLaunchers);
    } else if (server === 'sl') {
        defaultConfig.sauceLabs = {
            testName: `${pkg.name} ::: ${pkg.version} ::: ${new Date()}`,
            username: process.env.SAUCE_USERNAME,
            accessKey: process.env.SAUCE_ACCESS_KEY,
            startConnect: true,
            tags: [pkg.name, pkg.version]
        };
        defaultConfig.customLaunchers = {
            sl_chrome: {
                base: 'SauceLabs',
                browserName: 'chrome',
                platform: 'Linux',
                version: '48'
            },
            // sl_safari: {
            //     base: 'SauceLabs',
            //     browserName: 'safari',
            //     platform: 'OS X 10.11',
            //     version: '10'
            // },
            sl_firefox: {
                base: 'SauceLabs',
                browserName: 'firefox',
                platform: 'OS X 10.11',
                version: '49'
            },
            sl_ie_10: {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                platform: 'Windows 8',
                version: '10'
            },
            sl_ie_11: {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                platform: 'Windows 8.1',
                version: '11'
            }
        };
        defaultConfig.reporters.push('saucelabs');
        defaultConfig.browsers = Object.keys(defaultConfig.customLaunchers);
        defaultConfig.browserNoActivityTimeout = 30000;
    } else {
        defaultConfig.browsers = [
            'Chrome'
        ];
        defaultConfig.singleRun = false;
    }
}

module.exports = function(config) {
    const defaultConfig = {

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine-ajax', 'jasmine-jquery', 'jasmine'],

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

        reporters: ['progress', 'junit', 'coverage'],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor

        preprocessors: {
            'src/js/**/*.js': ['webpack', 'sourcemap'],
            'test/test.bundle.js': ['webpack', 'sourcemap']
        },

        webpack: {
            devtool: 'inline-source-map',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules|lib|dist/,
                        loader: 'babel-loader',
                        options: {
                            babelrc: true
                        }
                    },
                    {
                        test: /\.css$/,
                        loader: ExtractTextPlugin.extract({
                            fallback: 'style-loader',
                            use: 'css-loader'
                        })
                    }
                ]
            },
            plugins: [
                new ExtractTextPlugin(`[name].css`)
            ]
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
                        return `report-html/${browser}`;
                    }
                },
                {
                    type: 'cobertura',
                    subdir: function(browser) {
                        return `report-cobertura/${browser}`;
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

    setConfig(defaultConfig, process.env.KARMA_SERVER);
    config.set(defaultConfig);
};

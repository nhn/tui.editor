/* eslint max-len: 0, no-process-env: 0, object-shorthand: 0, camelcase: 0 */

const path = require('path');
const pkg = require('./package.json');
const webdriverConfig = {
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
        if (browser === 'IE10' || !browser) {
            defaultConfig.customLaunchers.IE10 = {
                base: 'WebDriver',
                config: webdriverConfig,
                browserName: 'internet explorer',
                version: 10
            };
        }
        if (browser === 'IE11' || !browser) {
            defaultConfig.customLaunchers.IE11 = {
                base: 'WebDriver',
                config: webdriverConfig,
                browserName: 'internet explorer',
                version: 11
            };
        }
        if (browser === 'Edge') {
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
        defaultConfig.concurrency = 5;
        defaultConfig.reporters = ['narrow', 'junit', 'coverage'];
        defaultConfig.browsers = Object.keys(defaultConfig.customLaunchers);
    } else if (server === 'sl') {
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
        defaultConfig.customLaunchers = {};
        if (browser === 'Chrome' || !browser) {
            defaultConfig.customLaunchers.sl_chrome = {
                base: 'SauceLabs',
                browserName: 'chrome',
                platform: 'Linux',
                version: '48'
            };
        }
        if (browser === 'Firefox' || !browser) {
            defaultConfig.customLaunchers.sl_firefox = {
                base: 'SauceLabs',
                browserName: 'firefox',
                platform: 'OS X 10.11',
                version: '49'
            };
        }
        if (browser === 'IE10' || !browser) {
            defaultConfig.customLaunchers.sl_ie_10 = {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                platform: 'Windows 8',
                version: '10'
            };
        }
        if (browser === 'IE11' || !browser) {
            defaultConfig.customLaunchers.sl_ie_11 = {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                platform: 'Windows 8.1',
                version: '11'
            };
        }
        if (browser === 'Edge') {
            defaultConfig.customLaunchers.sl_edge_14 = {
                base: 'SauceLabs',
                browserName: 'MicrosoftEdge',
                platform: 'Windows 10',
                version: '14'
            };
        }
        if (browser === 'Safari') {
            defaultConfig.customLaunchers.sl_safari = {
                base: 'SauceLabs',
                browserName: 'safari',
                platform: 'OS X 10.11',
                version: '10'
            };
        }
        defaultConfig.reporters.push('saucelabs');
        defaultConfig.browsers = Object.keys(defaultConfig.customLaunchers);
        defaultConfig.browserNoActivityTimeout = 30000;
    } else {
        browser = browser || 'Chrome';
        defaultConfig.browsers = [
            browser
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
            'lib/tui-code-snippet/dist/code-snippet.js',
            'lib/tui-component-colorpicker/dist/colorpicker.js',
            'lib/plantuml-encoder/dist/plantuml-encoder.js',
            'lib/toMark/dist/toMark.js',
            'lib/highlightjs/highlight.pack.js',
            'lib/markdown-it/dist/markdown-it.min.js',
            'lib/codemirror/lib/codemirror.js',
            'lib/codemirror/lib/codemirror.css',
            'lib/codemirror/addon/mode/overlay.js',
            'lib/codemirror/mode/markdown/markdown.js',
            'lib/codemirror/mode/gfm/gfm.js',
            'lib/squire-rte/build/squire-raw.js',
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
                        loader: 'babel-loader',
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
            text: null,
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
        singleRun: true
    };

    setConfig(defaultConfig, process.env.SERVER, process.env.BROWSER);
    config.set(defaultConfig);
};

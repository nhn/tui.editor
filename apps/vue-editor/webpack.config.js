const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'toastui-vue-editor.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'toastui',
        libraryTarget: 'umd'
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm.js'
        }
    },
    externals: {
        'tui-editor': {
            commonjs: 'tui-editor',
            commonjs2: 'tui-editor',
            amd: 'tui-editor',
            root: ['tui', 'Editor']
        },
        'tui-editor/dist/tui-editor-Viewer': {
            commonjs: 'tui-editor/dist/tui-editor-Viewer',
            commonjs2: 'tui-editor/dist/tui-editor-Viewer',
            amd: 'tui-editor/dist/tui-editor-Viewer',
            root: ['tui', 'Editor']
        },
        'jquery': {
            commonjs: 'jquery',
            commonjs2: 'jquery',
            amd: 'jquery',
            root: ['$']
        },
        'tui-code-snippet': {
            commonjs: 'tui-code-snippet',
            commonjs2: 'tui-code-snippet',
            amd: 'tui-code-snippet',
            root: ['tui', 'util']
        },
        'highlight.js': {
            commonjs: 'highlight.js',
            commonjs2: 'highlight.js',
            amd: 'highlight.js',
            root: ['hljs']
        },
        'markdown-it': {
            commonjs: 'markdown-it',
            commonjs2: 'markdown-it',
            amd: 'markdown-it',
            root: ['markdownit']
        },
        'to-mark': {
            commonjs: 'to-mark',
            commonjs2: 'to-mark',
            amd: 'to-mark',
            root: ['toMark']
        }
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.(js|vue)$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, 'src')],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ]
};

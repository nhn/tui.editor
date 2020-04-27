# TOAST UI Editor : Code Syntax Highlight Plugin

> This is a plugin of [TOAST UI Editor](https://github.com/nhn/tui.editor/tree/master/apps/editor) to highlight code syntax.

[![npm version](https://img.shields.io/npm/v/@toast-ui/editor-plugin-code-syntax-highlight.svg)](https://www.npmjs.com/package/@toast-ui/editor-plugin-code-syntax-highlight)

![code-syntax-highlight](https://user-images.githubusercontent.com/18183560/76829633-f4215700-6866-11ea-9a78-a116a97577a7.png)

## 🚩 Table of Contents

- [Bundle File Structure](#-bundle-file-structure)
- [Usage npm](#-usage-npm)
- [Usage CDN](#-usage-cdn)

## 📁 Bundle File Structure

### Serve with npm

### Files Distributed on npm

```
- node_modules/
  - @toast-ui/
    - editor-plugin-code-syntax-highlight/
      - dist/
        - toastui-editor-plugin-code-syntax-highlight.js
```

### Files Distributed on CDN

```
- uicdn.toast.com/
  - editor-plugin-code-syntax-highlight/
    - latest/
      - toastui-editor-plugin-code-syntax-highlight.js
      - toastui-editor-plugin-code-syntax-highlight.min.js
      - toastui-editor-plugin-code-syntax-highlight-all.js
      - toastui-editor-plugin-code-syntax-highlight-all.min.js
```

## 📦 Usage npm

To use the plugin, [`@toast-ui/editor`](https://github.com/nhn/tui.editor/tree/master/apps/editor) must be installed.

> Ref. [Getting Started](https://github.com/nhn/tui.editor/blob/master/apps/editor/docs/getting-started.md)

### Install

```sh
$ npm install @toast-ui/editor-plugin-code-syntax-highlight
```

### Import Plugin

Along with the plugin, the plugin's dependency style must be imported. 
The `code-syntax-highlight` plugin has [`highlight.js`](https://highlightjs.org/) as a dependency, and you need to add a CSS file of `highlight.js`.

#### ES Modules

```js
import 'highlight.js/styles/github.css';

import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
```

#### CommonJS

```js
require('highlight.js/styles/github.css');

const codeSyntaxHighlight = require('@toast-ui/editor-plugin-code-syntax-highlight');
```

### Create Instance

When you set up a plugin function, you must set it with an option. The option has `hljs`, and you need to import [`highlight.js`](https://www.npmjs.com/package/highlightjs) before creating an instance and set it to the value of that option.

The main bundle file of `highlight.js` contains all the language pack it supports. Importing this file from your app and bundling it can be very heavy. So it also provides the bundle file(`highlight.js/lib/highlight`) to import only the languages ​​you need in `highlight.js`. Import the required language files and call the API to register and use the languages.

#### Basic

##### Import All Languages

```js
// ...

import Editor from '@toast-ui/editor';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';

import hljs from 'highlight.js';

const editor = new Editor({
  // ...
  plugins: [[codeSyntaxHighlight, { hljs }]]
});
```

##### Import Only Languages ​​You Need

You need to import the language files you want to use in the code block and register them in the `highlight.js` object. A list of available language files can be found [here](https://github.com/highlightjs/highlight.js/tree/master/src/languages).

```js
// ...

import Editor from '@toast-ui/editor';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';

// Step 1. Import highlight.js
import hljs from 'highlight.js/lib/highlight';

// Step 2. Import language files of highlight.js that you need
import javascript from 'highlight.js/lib/languages/javascript';
import clojure from 'highlight.js/lib/languages/clojure';

// Step 3. Register languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('clojure', clojure);

const editor = new Editor({
  // ...
  plugins: [[codeSyntaxHighlight, { hljs }]]
});
```

#### With Viewer

As with creating an editor instance, you need to import `highlight.js` and pass it to the `hljs` option.

```js
// ...

import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';

// Import highlgiht.js
// ...

const viewer = new Viewer({
  // ...
  plugins: [[codeSyntaxHighlight, { hljs }]]
});
```

or

```js
// ...

import Editor from '@toast-ui/editor';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';

// Import highlgiht.js
// ...

const viewer = Editor.factory({
  // ...
  viewer: true,
  plugins: [[codeSyntaxHighlight, { hljs }]]
});
```

## 🗂 Usage CDN

### Include Files

To use the plugin, the CDN files(CSS, Script) of `@toast-ui/editor` must be included.

### Create Instance

#### Basic

First, include the editor file. And include the plugin file as needed. If you want to include all language files provided by `highlight.js`, see the first title(_Include All Languages_). If you want to register and use only the languages ​​you need, see the second title(_Include Only Languages ​​You Need_).

##### Include All Languages

By including the **all** version of the plugin, all languages ​​of `highlight.js` are available in the code block.

```html
...
<head>
  ...
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/styles/github.min.css" />
  ...
</head>
<body>
  ...
  <!-- Editor -->
  <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>
  <!-- Editor's Plugin -->
  <script src="https://uicdn.toast.com/editor-plugin-code-syntax-highlight/latest/toastui-editor-plugin-code-syntax-highlight-all.min.js"></script>
  ...
</body>
...
```

```js
const { Editor } = toastui;
const { codeSyntaxHighlight } = Editor.plugin;

const instance = new Editor({
  // ...
  plugins: [codeSyntaxHighlight]
});
```

##### Include Only Languages ​​You Need

If you include the **normal** version of the plugin, only the languages ​​you need are available. At this time, you should also include the language files of `highlight.js`, and if you only include it, the languages ​​available to the plugin are registered.

> Note : The CDN provided by `highlight.js` contains only 34 language files. If you want to add other language files, you can use [cdnjs](https://cdnjs.com/libraries/highlight.js/) to add each language file or upload a file containing only the language you need on [this page](https://highlightjs.org/download/).

```html
...
<head>
  ...
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/styles/github.min.css" />
  ...
</head>
<body>
  ...
  <!-- Editor -->
  <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>
  <!-- highlight.js Languages -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.18.1/highlight.min.js"></script>
  <!-- Editor's Plugin -->
  <script src="https://uicdn.toast.com/editor-plugin-code-syntax-highlight/latest/toastui-editor-plugin-code-syntax-highlight.min.js"></script>
  ...
</body>
...
```

#### With Viewer

The way to include the plugin and the language files of `highlight.js` is the same as above.

##### Use Option of Editor

```js
const { Editor } = tosatui;
const { codeSyntaxHighlight } = Editor.plugin;

const editor = Editor.factory({
  // ...
  plugins: [codeSyntaxHighlight],
  viewer: true
});
```

##### Use Viewer

Include the Viewer file instead of the Editor.

```html
...
<body>
  ...
  <script src="https://uicdn.toast.com/editor/latest/toastui-editor-viewer.min.js"></script>
  ...
</body>
...
```

```js
const Viewer = toastui.Editor;
const { codeSyntaxHighlight } = Viewer.plugin;

const viewer = new Viewer({
  // ...
  plugins: [codeSyntaxHighlight]
});
```

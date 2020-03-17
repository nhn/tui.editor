# TOAST UI Editor : Code Syntax Highlight Plugin

> This is a plugin of [TOAST UI Editor](https://github.com/nhn/tui.editor/apps/editor) to highlight code syntax.

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
    - editor-plugin-color-syntax-highlight/
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

To use the plugin, `@toast-ui/editor` must be installed.

> Ref. [Getting Started](https://github.com/nhn/tui.editor/blob/master/apps/editor/docs/getting-started.md)

### Install

```sh
$ npm install @toast-ui/editor-plugin-code-syntax-highlight
```

### Import Plugin

#### ES Modules

```js
import codeSyntaxHightlight from '@toast-ui/editor-plugin-code-syntax-highlight';
```

or

#### CommonJS

```js
const codeSyntaxHightlight = require('@toast-ui/editor-plugin-code-syntax-highlight');
```

### Create Instance

When you set up a plugin function, you must set it with an option. The option has `hljs`, and you need to import [`highlight.js`](https://www.npmjs.com/package/highlightjs) before creating an instance and set it to the value of that option.

The main bundle file of `highlight.js` contains all the language pack it supports. Importing this file from your app and bundling it can be very heavy. So it also provides the bundle file(`highlight.js/lib/highlight`) to import only the languages ​​you need in `highlight.js`. Import the required language files and call the API to register and use the languages.

#### Basic

##### Import All Languages

```js
import Editor from '@toast-ui/editor';
import codeSyntaxHightlight from '@toast-ui/editor-plugin-code-syntax-highlight';

import hljs from 'highlight.js';

const instance = new Editor({
  // ...
  plugins: [[codeSyntaxHightlight, { hljs }]]
});
```

##### Import Only Languages ​​You Need

You need to import the language files you want to use in the code block and register them in the `hightlight.js` object. A list of available language files can be found [here](https://github.com/highlightjs/highlight.js/tree/master/src/languages).

```js
import Editor from '@toast-ui/editor';
import codeSyntaxHightlight from '@toast-ui/editor-plugin-code-syntax-highlight';

// Step 1. Import highlight.js
import hljs from 'highlight.js/lib/highlight';

// Step 2. Import language files of highlight.js that you need
import javascript from 'highlight.js/lib/languages/javascript';
import clojure from 'highlight.js/lib/languages/clojure';

// Step 3. Register languages
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('clojure', clojure);

const instance = new Editor({
  // ...
  plugins: [[codeSyntaxHightlight, { hljs }]]
});
```

#### With Viewer

As with creating an editor instance, you need to import `highlight.js` and pass it to the `hljs` option.

```js
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import codeSyntaxHightlight from '@toast-ui/editor-plugin-code-syntax-highlight';

// Import highlgiht.js
// ...

const instance = new Viewer({
  // ...
  plugins: [[codeSyntaxHightlight, { hljs }]]
});
```

or

```js
import Editor from '@toast-ui/editor';
import codeSyntaxHightlight from '@toast-ui/editor-plugin-code-syntax-highlight';

// Import highlgiht.js
// ...

const instance = Editor.factory({
  // ...
  plugins: [[codeSyntaxHightlight, { hljs }]]
});
```

## 🗂 Usage CDN

### Include Files

To use the plugin, the CDN files(CSS, Script) of `@toast-ui/editor` must be included.

### Create Instance

#### Basic

First, include the editor file. And include the plugin file as needed.
If you want to include all language files provided by `highlight.js`, see the first title(`Import All Languages`). If you want to register and use only the languages ​​you need, see the second title(`Import Only Languages ​​You Need`).

##### Import All Languages

By including the **all** version of the plugin, all languages ​​of `highlight.js` are available in the code block.

```html
<!-- Editor -->
<script src="https://uicdn.toast.com/editor/latest/toastui-editor.min.js"></script>
<!-- Editor's Plugin -->
<script src="https://uicdn.toast.com/editor-plugin-code-syntax-highlight/latest/toastui-editor-plugin-code-syntax-highlight-all.min.js"></script>
```

```js
const { Editor } = toastui;
const { codeSyntaxHightlight } = Editor.plugin;

const instance = new Editor({
  // ...
  plugins: [codeSyntaxHightlight]
});
```

##### Import Only Languages ​​You Need

If you include the **normal** version of the plugin, only the languages ​​you need are available. At this time, you should also include the language files of `hightlight.js`, and if you only include it, the languages ​​available to the plugin are registered.

> Note : The CDN provided by `highlight.js` contains only 34 language files. If you want to add other language files, you can use [cdnjs](https://cdnjs.com/libraries/highlight.js/) to add each language file or upload a file containing only the language you need on [this page](https://highlightjs.org/download/).

```html
<!-- Editor -->
<script src="https://uicdn.toast.com/editor/latest/toastui-editor.min.js"></script>
<!-- highlight.js Languages -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.18.1/highlight.min.js"></script>
<!-- Editor's Plugin -->
<script src="https://uicdn.toast.com/editor-plugin-code-syntax-highlight/latest/toastui-editor-plugin-code-syntax-highlight.min.js"></script>
```

#### With Viewer

The way to include the plugin and the language files of `highlight.js` is the same as above.

##### Use Option of Editor

```js
const { Editor } = tosatui;
const { codeSyntaxHightlight } = Editor.plugin;

const instance = Editor.factory({
  // ...
  plugins: [codeSyntaxHightlight]
});
```

##### Use Viewer

Include the viewer file instead of the editor.

```html
<!-- Editor -->
<script src="https://uicdn.toast.com/editor/latest/toastui-editor-viewer.min.js"></script>
...
```

```js
const Viewer = toastui.Editor;
const { codeSyntaxHightlight } = Viewer.plugin;

const instance = new Viewer({
  // ...
  plugins: [codeSyntaxHightlight]
});
```

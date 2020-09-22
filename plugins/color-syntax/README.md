# TOAST UI Editor : Color Syntax Plugin

> This is a plugin of [TOAST UI Editor](https://github.com/nhn/tui.editor/tree/master/apps/editor) to color editing text.

[![npm version](https://img.shields.io/npm/v/@toast-ui/editor-plugin-color-syntax.svg)](https://www.npmjs.com/package/@toast-ui/editor-plugin-color-syntax)

![color-syntax](https://user-images.githubusercontent.com/18183560/76829634-f4b9ed80-6866-11ea-8fae-04572aa2f9c7.png)

## 🚩 Table of Contents

- [Bundle File Structure](#-bundle-file-structure)
- [Usage npm](#-usage-npm)
- [Usage CDN](#-usage-cdn)

## 📁 Bundle File Structure

### Files Distributed on npm

```
- node_modules/
  - @toast-ui/
    - editor-plugin-color-syntax/
      - dist/
        - toastui-editor-plugin-color-syntax.js
```

### Files Distributed on CDN

The bundle files include all dependencies of this plugin.

```
- uicdn.toast.com/
  - editor-plugin-color-syntax/
    - latest/
      - toastui-editor-plugin-color-syntax.js
      - toastui-editor-plugin-color-syntax.min.js
```

## 📦 Usage npm

To use the plugin, [`@toast-ui/editor`](https://github.com/nhn/tui.editor/tree/master/apps/editor) must be installed.

> Ref. [Getting Started](https://github.com/nhn/tui.editor/blob/master/apps/editor/docs/getting-started.md)

### Install

```sh
$ npm install @toast-ui/editor-plugin-color-syntax
```

### Import Plugin

Along with the plugin, the plugin's dependency style must be imported. The `color-syntax` plugin has [TOAST UI Color Picker](https://github.com/nhn/tui.color-picker) as a dependency, and you need to add a CSS file of TOAST UI Color Picker.

#### ES Modules

```js
import 'tui-color-picker/dist/tui-color-picker.css';

import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
```

#### CommonJS

```js
require('tui-color-picker/dist/tui-color-picker.css');

const colorSyntax = require('@toast-ui/editor-plugin-color-syntax');
```

### Create Instance

#### Basic

```js
// ...
import 'tui-color-picker/dist/tui-color-picker.css';

import Editor from '@toast-ui/editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

const editor = new Editor({
  // ...
  plugins: [colorSyntax]
});
```

## 🗂 Usage CDN

To use the plugin, the CDN files(CSS, Script) of `@toast-ui/editor` must be included.

### Include Files

```html
...
<head>
  ...
  <link
    rel="stylesheet"
    href="https://uicdn.toast.com/tui-color-picker/latest/tui-color-picker.min.css"
  />
  ...
</head>
<body>
  ...
  <!-- Editor -->
  <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>
  <!-- Editor's Plugin -->
  <script src="https://uicdn.toast.com/editor-plugin-color-syntax/latest/toastui-editor-plugin-color-syntax.min.js"></script>
  ...
</body>
...
```

### Create Instance

#### Basic

```js
const { Editor } = toastui;
const { colorSyntax } = Editor.plugin;

const editor = new Editor({
  // ...
  plugins: [colorSyntax]
});
```

### [Optional] Use Plugin with Options

The `color-syntax` plugin can set options when used. Just add the plugin function and options related to the plugin to the array(`[pluginFn, pluginOptions]`) and push them to the `plugins` option of the editor.

The following options are available in the `color-syntax` plugin.
The `useCustomSyntax` option is `false` by default, applying color syntax using the `span` tag. (e.g. `<span style="color:#ff00ff">foo</span>`) If enabled, it will use custom syntax instead of the `span` tag. (e.g. `{color:# ff00ff}test{color}`)

| Name              | Type             | Default Value | Description                      |
| ----------------- | ---------------- | ------------- | -------------------------------- |
| `preset`          | `Array.<string>` |               | Preset for color palette         |
| `useCustomSyntax` | `boolean`        | `false`       | Whether use custom syntax or not |

```js
// ...
import 'tui-color-picker/dist/tui-color-picker.css';

import Editor from '@toast-ui/editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

const colorSyntaxOptions = {
  preset: ['#181818', '#292929', '#393939'],
  useCustomSyntax: true
};

const editor = new Editor({
  // ...
  plugins: [[colorSyntax, colorSyntaxOptions]]
});
```

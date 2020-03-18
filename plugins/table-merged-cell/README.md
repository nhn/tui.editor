# TOAST UI Editor : Table Merged Cell Plugin

> This is a plugin of [TOAST UI Editor](https://github.com/nhn/tui.editor/tree/master/apps/editor) to merge table columns.

[![npm version](https://img.shields.io/npm/v/@toast-ui/editor-plugin-table-merged-cell.svg)](https://www.npmjs.com/package/@toast-ui/editor-plugin-table-merged-cell)

![table-merged-cell](https://user-images.githubusercontent.com/18183560/76829635-f5528400-6866-11ea-99e6-1f70596f34de.png)

## 🚩 Table of Contents

- [Bundle File Structure](#-bundle-file-structure)
- [Usage npm](#-usage-npm)
- [Usage CDN](#-usage-cdn)

## 📁 Bundle File Structure

### Files Distributed on npm

```
- node_modules/
  - @toast-ui/
    - editor-plugin-table-merged-cell/
      - dist/
        - toastui-editor-plugin-table-merged-cell.js
```

### Files Distributed on CDN

The bundle files include all dependencies of this plugin.

```
- uicdn.toast.com/
  - editor-plugin-table-merged-cell/
    - latest/
      - toastui-editor-plugin-table-merged-cell.js
      - toastui-editor-plugin-table-merged-cell.min.js
```

## 📦 Usage npm

To use the plugin, [`@toast-ui/editor`](https://github.com/nhn/tui.editor/tree/master/apps/editor) must be installed.

> Ref. [Getting Started](https://github.com/nhn/tui.editor/blob/master/apps/editor/docs/getting-started.md)

### Install

```sh
$ npm install @toast-ui/editor-plugin-table-merged-cell
```

### Import Plugin

#### ES Modules

```js
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
```

#### CommonJS

```js
const tableMergedCell = require('@toast-ui/editor-plugin-table-merged-cell');
```

### Create Instance

#### Basic

```js
import Editor from '@toast-ui/editor';
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';

const editor = new Editor({
  // ...
  plugins: [tableMergedCell]
});
```

#### With Viewer

```js
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';

const viewer = new Viewer({
  // ...
  plugins: [tableMergedCell]
});
```

or

```js
import Editor from '@toast-ui/editor';
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';

const viewer = Editor.factory({
  // ...
  plugins: [tableMergedCell],
  viewer: true
});
```

## 🗂 Usage CDN

To use the plugin, the CDN files(CSS, Script) of `@toast-ui/editor` must be included.

### Include Files

```html
...
<body>
  ...
  <!-- Editor -->
  <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>
  <!-- Editor's Plugin -->
  <script src="https://uicdn.toast.com/editor-plugin-table-merged-cell/latest/toastui-editor-plugin-table-merged-cell.min.js"></script>
  ...
</body>
...
```

### Create Instance

#### Basic

```js
const { Editor } = toastui;
const { tableMergedCell } = Editor.plugin;

const editor = new Editor({
  // ...
  plugins: [tableMergedCell]
});
```

#### With Viewer

```js
const Viewer = toastui.Editor;
const { tableMergedCell } = Viewer.plugin;

const viewer = new Viewer({
  // ...
  plugins: [tableMergedCell]
});
```

or

```js
const { Editor } = toastui;
const { tableMergedCell } = Editor.plugin;

const viewer = Editor.factory({
  // ...
  plugins: [tableMergedCell],
  viewer: true
});
```

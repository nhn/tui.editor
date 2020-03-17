# TOAST UI Editor : Table Merged Cell Plugin

> This is a plugin of [TOAST UI Editor](https://github.com/nhn/tui.editor/apps/editor) to merge table columns.

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

The bundle files under the `cdn` folder include all dependencies.

```
- uicdn.toast.com/
  - editor-plugin-table-merged-cell/
    - latest/
      - toastui-editor-plugin-table-merged-cell.js
      - toastui-editor-plugin-table-merged-cell.min.js
```

## 📦 Usage npm

To use the plugin, `@toast-ui/editor` must be installed.

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

const instance = new Editor({
  // ...
  plugins: [tableMergedCell]
});
```

#### With Viewer

```js
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';

const instance = new Viewer({
  // ...
  plugins: [tableMergedCell]
});
```

or

```js
import Editor from '@toast-ui/editor';
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';

const instance = Editor.factory({
  // ...
  plugins: [tableMergedCell]
});
```

## 🗂 Usage CDN

To use the plugin, the CDN files(CSS, Script) of `@toast-ui/editor` must be included.

### Include Files

```html
<script src="https://uicdn.toast.com/editor-plugin-table-merged-cell/latest/toastui-editor-plugin-table-merged-cell.min.js"></script>
```

### Create Instance

#### Basic

```js
const { Editor } = toastui;
const { tableMergedCell } = Editor.plugin;

const instance = new Editor({
  // ...
  plugins: [tableMergedCell]
});
```

#### With Viewer

```js
const Viewer = toastui.Editor;
const { tableMergedCell } = Viewer.plugin;

const instance = new Viewer({
  // ...
  plugins: [tableMergedCell]
});
```

or

```js
const { Editor } = toastui;
const { tableMergedCell } = Editor.plugin;

const instance = Editor.factory({
  // ...
  plugins: [tableMergedCell]
});
```

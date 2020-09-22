# TOAST UI Editor : Chart Plugin

> This is a plugin of [TOAST UI Editor](https://github.com/nhn/tui.editor/tree/master/apps/editor) to render chart.

[![npm version](https://img.shields.io/npm/v/@toast-ui/editor-plugin-chart.svg)](https://www.npmjs.com/package/@toast-ui/editor-plugin-chart)

![chart](https://user-images.githubusercontent.com/18183560/76829631-f2f02a00-6866-11ea-8bb0-c3c923d70399.png)

## 🚩 Table of Contents

- [Bundle File Structure](#-bundle-file-structure)
- [Usage npm](#-usage-npm)
- [Usage CDN](#-usage-cdn)

## 📁 Bundle File Structure

### Files Distributed on npm

```
- node_modules/
  - @toast-ui/
    - editor-plugin-chart/
      - dist/
        - toastui-editor-plugin-chart.js
```

### Files Distributed on CDN

The bundle files include all dependencies of this plugin.

```
- uicdn.toast.com/
  - editor-plugin-chart/
    - latest/
      - toastui-editor-plugin-chart.js
      - toastui-editor-plugin-chart.min.js
```

## 📦 Usage npm

To use the plugin, [`@toast-ui/editor`](https://github.com/nhn/tui.editor/tree/master/apps/editor) must be installed.

> Ref. [Getting Started](https://github.com/nhn/tui.editor/blob/master/apps/editor/docs/getting-started.md)

### Install

```sh
$ npm install @toast-ui/editor-plugin-chart
```

### Import Plugin

Along with the plugin, the plugin's dependency style must be imported. The `chart` plugin has [TOAST UI Chart](https://github.com/nhn/tui.chart) as a dependency, and you need to add a CSS file of TOAST UI Chart.

#### ES Modules

```js
import 'tui-chart/dist/tui-chart.css';

import chart from '@toast-ui/editor-plugin-chart';
```

#### CommonJS

```js
require('tui-chart/dist/tui-chart.css');

const chart = require('@toast-ui/editor-plugin-chart');
```

### Create Instance

#### Basic

```js
// ...
import 'tui-chart/dist/tui-chart.css';

import Editor from '@toast-ui/editor';
import chart from '@toast-ui/editor-plugin-chart';

const editor = new Editor({
  // ...
  plugins: [chart]
});
```

#### With Viewer

```js
// ...
import 'tui-chart/dist/tui-chart.css';

import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import chart from '@toast-ui/editor-plugin-chart';

const viewer = new Viewer({
  // ...
  plugins: [chart]
});
```

or

```js
// ...
import 'tui-chart/dist/tui-chart.css';

import Editor from '@toast-ui/editor';
import chart from '@toast-ui/editor-plugin-chart';

const viewer = Editor.factory({
  // ...
  plugins: [chart],
  viewer: true
});
```

## 🗂 Usage CDN

To use the plugin, the CDN files(CSS, Script) of `@toast-ui/editor` must be included.

### Include Files

```html
...
<head>
  ...
  <link rel="stylesheet" href="https://uicdn.toast.com/tui.chart/latest/tui-chart.min.css" />
  ...
</head>
<body>
  ...
  <!-- Editor -->
  <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>
  <!-- Editor's Plugin -->
  <script src="https://uicdn.toast.com/editor-plugin-chart/latest/toastui-editor-plugin-chart.min.js"></script>
  ...
</body>
```

### Create Instance

#### Basic

```js
const { Editor } = toastui;
const { chart } = Editor.plugin;

const editor = new Editor({
  // ...
  plugins: [chart]
});
```

#### With Viewer

```js
const Viewer = toastui.Editor;
const { chart } = Viewer.plugin;

const viewer = new Viewer({
  // ...
  plugins: [chart]
});
```

or

```js
const { Editor } = toastui;
const { chart } = Editor.plugin;

const viewer = Editor.factory({
  // ...
  plugins: [chart],
  viewer: true
});
```

### [Optional] Use Plugin with Options

The `chart` plugin can set options when used. Just add the plugin function and options related to the plugin to the array(`[pluginFn, pluginOptions]`) and push them to the `plugins` option of the editor.

The following options are available in the `chart` plugin.
These options are used to set the dimensions of the chart drawn in the editor.

| Name        | Type             | Default Value | Description          |
| ----------- | ---------------- | ------------- | -------------------- |
| `width`     | `number\|string` | `'auto'`      | Default width value  |
| `height`    | `number\|string` | `'auto'`      | Default height value |
| `minWidth`  | `number`         | `0`           | Minimum width value  |
| `minHeight` | `number`         | `0`           | Minimum height value |
| `maxWidth`  | `number`         | `Infinity`    | Maximum width value  |
| `maxHeight` | `number`         | `Infinity`    | Maximum height value |

```js
// ...
import 'tui-chart/dist/tui-chart.css';

import Editor from '@toast-ui/editor';
import chart from '@toast-ui/editor-plugin-chart';

const chartOptions = {
  minWidth: 100,
  maxWidth: 600,
  minHeight: 100,
  maxHeight: 300
};

const editor = new Editor({
  // ...
  plugins: [[chart, chartOptions]]
});
```

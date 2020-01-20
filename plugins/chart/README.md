# TOAST UI Editor : Chart Plugin

## Files Structure

### Build

> Note : The bundle files under the `cdn` folder include all dependencies.

```
- dist/
  - toastui-editor-plugin-chart.js
  - cdn/
    - toastui-editor-plugin-chart.js
    - toastui-editor-plugin-chart.min
```

### Serve with npm

```
- node_modules/
  - @toast-ui/
    - editor-plugin-chart/
      - dist/
        - toastui-editor-plugin-chart.js
```

### Serve with CDN

```
- uicdn.toast.com/
  - tui-editor/
    - latest/
      - toastui-editor-plugin-chart.js
      - toastui-editor-plugin-chart.min.js
```

## Use npm

> Note : To use the plugin, `tui-editor` must be installed.

### Install

```sh
$ npm install @toast-ui/editor-plugin-chart
```

### Import Plugin

> Note : Along with the plugin, the plugin's dependency style must be imported.

#### ES Modules

```js
import 'tui-chart/dist/tui-chart.css';

import chartPlugin from '@toast-ui/editor-plugin-chart';
```

or

#### CommonJS

```js
require('tui-chart/dist/tui-chart.css');

const chartPlugin = require('@toast-ui/editor-plugin-chart');
```

### Create Instance

#### Basic

```js
// ...

import Editor from 'tui-editor';
import chartPlugin from '@toast-ui/editor-plugin-chart';

const instance = new Editor({
  // ...
  plugins: [chartPlugin]
});
```

#### With Viewer

```js
// ...

import Viewer from 'tui-editor/viewer';
import chartPlugin from '@toast-ui/editor-plugin-chart';

const instance = new Viewer({
  // ...
  plugins: [chartPlugin]
});
```

or

```js
// ...

import Editor from 'tui-editor';
import chartPlugin from '@toast-ui/editor-plugin-chart';

const instance = Editor.factory({
  // ...
  plugins: [chartPlugin]
});
```

## Use CDN

> Note : To use the plugin, `tui-editor`'s CDN files(css, scripts) must be included.

### Include Files

```html
<!-- CSS -->
<link rel="stylesheet" href="https://uicdn.toast.com/tui.chart/latest/tui-chart.min.css" />
<!-- Scripts -->
<script src="https://uicdn.toast.com/tui-editor/latest/toastui-editor-plugin-chart.min.js"></script>
```

### Create Instance

#### Basic

```js
const Editor = tui.Editor;
const instance = new Editor({
  // ...
  plugins: [Editor.plugin.chart]
});
```

#### With Viewer

```js
const Viewer = tui.Editor;
const instance = new Viewer({
  // ...
  plugins: [Editor.plugin.chart]
});
```

or

```js
const Editor = tui.Editor;
const instance = Editor.factory({
  // ...
  plugins: [Editor.plugin.chart]
});
```

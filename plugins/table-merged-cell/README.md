# TOAST UI Editor : Table Merged Cell Plugin

## Files Structure

### Build

> Note : The bundle files under the `cdn` folder include all dependencies.

```
- tui.editor/plugins/table-merged-cell/
  - dist/
    - toastui-editor-plugin-table-merged-cell.js
    - cdn/
      - toastui-editor-plugin-table-merged-cell.js
      - toastui-editor-plugin-table-merged-cell.min
```

### Serve with npm

```
- node_modules/
  - @toast-ui/
    - editor-plugin-table-merged-cell/
      - dist/
        - toastui-editor-plugin-table-merged-cell.js
```

### Serve with CDN

```
- uicdn.toast.com/
  - editor-plugin-table-merged-cell/
    - latest/
      - toastui-editor-plugin-table-merged-cell.js
      - toastui-editor-plugin-table-merged-cell.min.js
```

## Use npm

> Note : To use the plugin, `@toast-ui/editor` must be installed.

### Install

```sh
$ npm install @toast-ui/editor-plugin-table-merged-cell
```

### Import Plugin

#### ES Modules

```js
import tableMergedCellPlugin from '@toast-ui/editor-plugin-table-merged-cell';
```

or

#### CommonJS

```js
const tableMergedCellPlugin = require('@toast-ui/editor-plugin-table-merged-cell');
```

### Create Instance

#### Basic

```js
import Editor from '@toast-ui/editor';
import tableMergedCellPlugin from '@toast-ui/editor-plugin-table-merged-cell';

const instance = new Editor({
  // ...
  plugins: [tableMergedCellPlugin]
});
```

#### With Viewer

```js
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import tableMergedCellPlugin from '@toast-ui/editor-plugin-table-merged-cell';

const instance = new Viewer({
  // ...
  plugins: [tableMergedCellPlugin]
});
```

or

```js
import Editor from '@toast-ui/editor';
import tableMergedCellPlugin from '@toast-ui/editor-plugin-table-merged-cell';

const instance = Editor.factory({
  // ...
  plugins: [tableMergedCellPlugin]
});
```

## Use CDN

> Note : To use the plugin, the CDN files(CSS, Script) of `@toast-ui/editor` must be included.

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

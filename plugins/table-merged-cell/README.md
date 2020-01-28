# TOAST UI Editor : Table Merged Cell Plugin

## Files Structure

### Build

> Note : The bundle files under the `cdn` folder include all dependencies.

```
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

> Note : To use the plugin, `tui-editor` must be installed.

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
import Editor from 'tui-editor';
import tableMergedCellPlugin from '@toast-ui/editor-plugin-table-merged-cell';

const instance = new Editor({
  // ...
  plugins: [tableMergedCellPlugin]
});
```

#### With Viewer

```js
import Viewer from 'tui-editor/viewer';
import tableMergedCellPlugin from '@toast-ui/editor-plugin-table-merged-cell';

const instance = new Viewer({
  // ...
  plugins: [tableMergedCellPlugin]
});
```

or

```js
import Editor from 'tui-editor';
import tableMergedCellPlugin from '@toast-ui/editor-plugin-table-merged-cell';

const instance = Editor.factory({
  // ...
  plugins: [tableMergedCellPlugin]
});
```

## Use CDN

> Note : To use the plugin, `tui-editor`'s CDN files(css, scripts) must be included.

### Include Files

```html
<!-- Scripts -->
<script src="https://uicdn.toast.com/editor-plugin-table-merged-cell/latest/toastui-editor-plugin-table-merged-cell.min.js"></script>
```

### Create Instance

#### Basic

```js
const Editor = tui.Editor;
const {
  plugin: { tableMergedCell }
} = Editor;

const instance = new Editor({
  // ...
  plugins: [tableMergedCell]
});
```

#### With Viewer

```js
const Viewer = tui.Editor;
const {
  plugin: { tableMergedCell }
} = Viewer;

const instance = new Viewer({
  // ...
  plugins: [tableMergedCell]
});
```

or

```js
const Editor = tui.Editor;
const {
  plugin: { tableMergedCell }
} = Editor;

const instance = Editor.factory({
  // ...
  plugins: [tableMergedCell]
});
```

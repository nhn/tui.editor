# TOAST UI Editor : UML Plugin

## Files Structure

### Build

> Note : The bundle files under the `cdn` folder include all dependencies.

```
- dist/
  - plugin.js
  - cdn/
    - toastui-editor-plugin-uml.js
    - toastui-editor-plugin-uml.min
```

### Serve with npm

```
- node_modules/
  - @toast-ui/
    - editor-plugin-uml/
      - dist/
        - plugin.js
```

### Serve with CDN

```
- uicdn.toast.com/
  - tui-editor/
    - latest/
      - toastui-editor-plugin-uml.js
      - toastui-editor-plugin-uml.min.js
```

## Use npm

> Note : To use the plugin, `tui-editor` must be installed.

### Install

```sh
$ npm install @toast-ui/editor-plugin-uml
```

### Import Plugin

#### ES Modules

```js
import umlPlugin from '@toast-ui/editor-plugin-uml';
```

or

#### CommonJS

```js
const umlPlugin = require('@toast-ui/editor-plugin-uml');
```

### Create Instance

#### Basic

```js
import Editor from 'tui-editor';
import umlPlugin from '@toast-ui/editor-plugin-uml';

const instance = new Editor({
  // ...
  plugins: [umlPlugin]
});
```

#### With Viewer

```js
import Viewer from 'tui-editor/viewer';
import umlPlugin from '@toast-ui/editor-plugin-uml';

const instance = new Viewer({
  // ...
  plugins: [umlPlugin]
});
```

or

```js
import Editor from 'tui-editor';
import umlPlugin from '@toast-ui/editor-plugin-uml';

const instance = Editor.factory({
  // ...
  plugins: [umlPlugin]
});
```

## Use CDN

> Note : To use the plugin, `tui-editor`'s CDN files(css, scripts) must be included.

### Include Files

```html
<!-- Scripts -->
<script src="https://uicdn.toast.com/tui-editor/latest/toastui-editor-plugin-uml.min.js"></script>
```

### Create Instance

#### Basic

```js
const Editor = tui.Editor;
const instance = new Editor({
  // ...
  plugins: [Editor.plugin.uml]
});
```

#### With Viewer

```js
const Viewer = tui.Editor;
const instance = new Viewer({
  // ...
  plugins: [Editor.plugin.uml]
});
```

or

```js
const Editor = tui.Editor;
const instance = Editor.factory({
  // ...
  plugins: [Editor.plugin.uml]
});
```

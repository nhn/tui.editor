# TOAST UI Editor : UML Plugin

## Files Structure

### Build

> Note : The bundle files under the `cdn` folder include all dependencies.

```
- tui.editor/plugins/uml/
  - dist/
    - toastui-editor-plugin-uml.js
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
        - toastui-editor-plugin-uml.js
```

### Serve with CDN

```
- uicdn.toast.com/
  - editor-plugin-uml/
    - latest/
      - toastui-editor-plugin-uml.js
      - toastui-editor-plugin-uml.min.js
```

## Use npm

> Note : To use the plugin, `@toast-ui/editor` must be installed.

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
import Editor from '@toast-ui/editor';
import umlPlugin from '@toast-ui/editor-plugin-uml';

const instance = new Editor({
  // ...
  plugins: [umlPlugin]
});
```

#### With Viewer

```js
import Viewer from '@toast-ui/editor/dist/toustui-editor-viewer';
import umlPlugin from '@toast-ui/editor-plugin-uml';

const instance = new Viewer({
  // ...
  plugins: [umlPlugin]
});
```

or

```js
import Editor from '@toast-ui/editor';
import umlPlugin from '@toast-ui/editor-plugin-uml';

const instance = Editor.factory({
  // ...
  plugins: [umlPlugin]
});
```

## Use CDN

> Note : To use the plugin, the CDN files(CSS, Script) of `@toast-ui/editor` must be included.

### Include Files

```html
<script src="https://uicdn.toast.com/editor-plugin-uml/latest/toastui-editor-plugin-uml.min.js"></script>
```

### Create Instance

#### Basic

```js
const Editor = toastui.Editor;
const {
  plugin: { uml }
} = Editor;

const instance = new Editor({
  // ...
  plugins: [uml]
});
```

#### With Viewer

```js
const Viewer = toastui.Editor;
const {
  plugin: { uml }
} = Viewer;

const instance = new Viewer({
  // ...
  plugins: [uml]
});
```

or

```js
const Editor = toastui.Editor;
const {
  plugin: { uml }
} = Editor;

const instance = Editor.factory({
  // ...
  plugins: [uml]
});
```

## [Optional] Use Plugin with Options

The `uml` plugin can set options when used. Just add the plugin function and options related to the plugin to the array(`[pluginFn, pluginOptions]`) and push them to the `plugins` option of the editor.

The following option is available in the `uml` plugin.

| Name          | Type     | Default Value                             | Description               |
| ------------- | -------- | ----------------------------------------- | ------------------------- |
| `rendererURL` | `string` | `'http://www.plantuml.com/plantuml/png/'` | URL of plant uml renderer |

```js
// ...

import Editor from '@toast-ui/editor';
import umlPlugin from '@toast-ui/editor-plugin-uml';

const options = {
  rendererURL: // ...
};

const instance = new Editor({
  // ...
  plugins: [[colorSyntaxPlugin, options]]
});
```

# TOAST UI Editor : Color Syntax Plugin

## Files Structure

### Build

> Note : The bundle files under the `cdn` folder include all dependencies.

```
- tui.editor/plugins/color-syntax/
  - dist/
    - toastui-editor-plugin-color-syntax.js
    - cdn/
      - toastui-editor-plugin-color-syntax.js
      - toastui-editor-plugin-color-syntax.min
```

### Serve with npm

```
- node_modules/
  - @toast-ui/
    - editor-plugin-color-syntax/
      - dist/
        - toastui-editor-plugin-color-syntax.js
```

### Serve with CDN

```
- uicdn.toast.com/
  - editor-plugin-color-syntax/
    - latest/
      - toastui-editor-plugin-color-syntax.js
      - toastui-editor-plugin-color-syntax.min.js
```

## Use npm

> Note : To use the plugin, `@toast-ui/editor` must be installed.

### Install

```sh
$ npm install @toast-ui/editor-plugin-color-syntax
```

### Import Plugin

> Note : Along with the plugin, the plugin's dependency style must be imported.

#### ES Modules

```js
import 'tui-color-picker/dist/tui-color-picker.css';

import colorSyntaxPlugin from '@toast-ui/editor-plugin-color-syntax';
```

or

#### CommonJS

```js
require('tui-color-picker/dist/tui-color-picker.css');

const colorSyntaxPlugin = require('@toast-ui/editor-plugin-color-syntax');
```

### Create Instance

#### Basic

```js
// ...

import Editor from '@toast-ui/editor';
import colorSyntaxPlugin from '@toast-ui/editor-plugin-color-syntax';

const instance = new Editor({
  // ...
  plugins: [colorSyntaxPlugin]
});
```

## Use CDN

> Note : To use the plugin, the CDN files(CSS, Script) of `@toast-ui/editor` must be included.

### Include Files

```html
<!-- CSS -->
<link
  rel="stylesheet"
  href="https://uicdn.toast.com/tui-color-picker/latest/tui-color-picker.min.css"
/>
<!-- Script -->
<script src="https://uicdn.toast.com/editor-plugin-color-syntax/latest/toastui-editor-plugin-color-syntax.min.js"></script>
```

### Create Instance

#### Basic

```js
const Editor = toastui.Editor;
const {
  plugin: { colorSyntax }
} = Editor;

const instance = new Editor({
  // ...
  plugins: [colorSyntax]
});
```

## [Optional] Use Plugin with Options

The `color-syntax` plugin can set options when used. Just add the plugin function and options related to the plugin to the array(`[pluginFn, pluginOptions]`) and push them to the `plugins` option of the editor.

The following options are available in the `color-syntax` plugin.
The `useCustomSyntax` option is `false` by default, applying color syntax using the `span` tag. (e.g. `<span style="color:#ff00ff">foo</span>`) If enabled, it will use custom syntax instead of the `span` tag. (e.g. `{color:# ff00ff}test{color}`)

| Name              | Type             | Default Value | Description                      |
| ----------------- | ---------------- | ------------- | -------------------------------- |
| `preset`          | `Array.<string>` |               | Preset for color palette         |
| `useCustomSyntax` | `boolean`        | `false`       | Whether use custom syntax or not |

```js
// ...

import Editor from '@toast-ui/editor';
import colorSyntaxPlugin from '@toast-ui/editor-plugin-color-syntax';

const options = {
  preset: ['#181818', '#292929', '#393939'],
  useCustomSyntax: true
};

const instance = new Editor({
  // ...
  plugins: [[colorSyntaxPlugin, options]]
});
```

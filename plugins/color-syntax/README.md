# TOAST UI Editor : Color Syntax Plugin

## Files Structure

### Build

> Note : The bundle files under the `cdn` folder include all dependencies.

```
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
  - tui-editor/
    - latest/
      - toastui-editor-plugin-color-syntax.js
      - toastui-editor-plugin-color-syntax.min.js
```

## Use npm

> Note : To use the plugin, `tui-editor` must be installed.

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

import Editor from 'tui-editor';
import colorSyntaxPlugin from '@toast-ui/editor-plugin-color-syntax';

const instance = new Editor({
  // ...
  plugins: [colorSyntaxPlugin]
});
```

## Use CDN

> Note : To use the plugin, `tui-editor`'s CDN files(css, scripts) must be included.

### Include Files

```html
<!-- CSS -->
<link
  rel="stylesheet"
  href="https://uicdn.toast.com/tui-color-picker/latest/tui-color-picker.min.css"
/>
<!-- Scripts -->
<script src="https://uicdn.toast.com/tui-editor/latest/toastui-editor-plugin-color-syntax.min.js"></script>
```

### Create Instance

#### Basic

```js
const Editor = tui.Editor;
const instance = new Editor({
  // ...
  plugins: [Editor.plugin.colorSyntax]
});
```

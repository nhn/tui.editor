# TOAST UI Editor : UML Plugin

## Files Structure

### Build

> Note: The bundle files under the `cdn` folder include all dependencies.

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

### Install

```sh
$ npm install @toast-ui/editor-plugin-uml
```

### Import Plugin

#### Basic

```js
import Editor from 'tui-editor';
import { umlPlugin } from '@toast-ui/editor-plugin-uml';

const instance = new Editor({
  // ...
  plugins: [umlPlugin]
});
```

#### With Viewer

```js
import Viewer from 'tui-editor/viewer';
import { umlPlugin } from '@toast-ui/editor-plugin-uml';

const instance = new Viewer({
  // ...
  plugins: [umlPlugin]
});
```

or

```js
import Editor from 'tui-editor';
import { umlPlugin } from '@toast-ui/editor-plugin-uml';

const instance = Editor.factory({
  // ...
  plugins: [umlPlugin]
});
```

## Use CDN

### Include Files

```html
<!-- Scripts -->
<script src="https://uicdn.toast.com/tui-editor/latest/toastui-editor-plugin-uml.min.js"></script>
```

### Create Instance

```js
const Editor = tui.Editor;
const instance = new Editor({
  // ...
  plugins: [Editor.plugin.uml]
});
```

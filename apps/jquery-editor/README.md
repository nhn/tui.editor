# TOAST UI Editor : jQuery Wrapper

## Files Structure

### Build

> Note : The bundle files under the `cdn` folder include TOAST UI Editor(`@toast-ui/editor`).

```
- tui.editor/apps/jquery/
  - dist/
    - toastui-jquery-editor.js
    - toastui-jquery-editor-viewer.js
    - cdn/
      - toastui-jquery-editor.js
      - toastui-jquery-editor.min.js
      - toastui-jquery-editor-viewer.js
      - toastui-jquery-editor-viewer.min.js
```

### Serve with npm

```
- node_modules/
  - @toast-ui/
    - jquery-editor/
      - dist/
        - toastui-jquery-editor.js
        - toastui-jquery-editor-viewer.js
```

### Serve with CDN

```
- uicdn.toast.com/
  - editor/
    - latest/
      - toastui-jquery-editor.js
      - toastui-jquery-editor.min.js
      - toastui-jquery-editor-viewer.js
      - toastui-jquery-editor-viewer.min.js
```

## Use npm

> Note : To use the wrapper, `jQuery` must be installed.

### Install

```sh
$ npm install @toast-ui/jquery-editor
```

### Import Wrapper

#### ES Modules

```js
import '@toast-ui/jquery-editor';
```

or

#### CommonJS

```js
require('@toast-ui/jquery-editor');
```

### Create Instance

#### Basic

```js
import $ from 'jquery';
import '@toast-ui/jquery-editor';

$('#editor').tuiEditor({
  // ...
});
```

#### With Viewer

```js
import $ from 'jquery';
import '@toast-ui/jquery-editor/dist/toastui-jquery-editor-viewer';

$('#viewer').tuiEditor({
  // ...
});
```

or

```js
import $ from 'jquery';
import '@toast-ui/jquery-editor';

$('#editor').tuiEditor({
  // ...
  viewer: true
});
```

## Use CDN

> Note : To use the plugin, the `jQuery`'s CDN file must be included.

### Include Files

```html
<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
<script src="https://uicdn.toast.com/editor/latest/toastui-jquery-editor.min.js"></script>
```

### Create Instance

Before creating the instance, add the element that will create the editor.

```html
<div id="editor"></div>
```

#### Basic

```js
$(document).ready(() => {
  $('#editor').tuiEditor({
    // ...
  });
});
```

The `viewer` option allows you to use it as a viewer.

```js
$(document).ready(() => {
  $('#viewer').tuiEditor({
    // ...
    viewer: true
  });
});
```

#### With Viewer

If you want to use only the viewer, include the following file:

```html
<script src="https://uicdn.toast.com/editor/latest/toastui-jquery-editor-viewer.min.js"></script>
```

```js
$(document).ready(() => {
  $('#viewer').tuiEditor({
    // ...
  });
});
```
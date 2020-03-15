# TOAST UI Editor for jQuery

> This is a [jQuery](https://jquery.com/) component wrapping [TOAST UI Editor](https://github.com/nhn/tui.editor/apps/editor).

[![npm version](https://img.shields.io/npm/v/@toast-ui/jquery-editor.svg)](https://www.npmjs.com/package/@toast-ui/jquery-editor)

## 🚩 Table of Contents

- [Bundle File Structure](#-bundle-file-structure)
- [Using npm](#-using-npm)
- [Using CDN](#-using-cdn)

## 📁 Bundle File Structure

### Files distributed on npm

```
- node_modules/
  - @toast-ui/
    - jquery-editor/
      - dist/
        - toastui-jquery-editor.js
        - toastui-jquery-editor-viewer.js
```

### Files distributed on CDN

The bundle files provided by CDN include TOAST UI Editor([`@toast-ui/editor`](https://github.com/nhn/tui.editor/apps/editor)).

```
- uicdn.toast.com/
  - editor/
    - latest/
      - toastui-jquery-editor.js
      - toastui-jquery-editor.min.js
      - toastui-jquery-editor-viewer.js
      - toastui-jquery-editor-viewer.min.js
```

## 📦 Using npm

When you install the wrapper, jQuery is installed.

### Install

```sh
$ npm install @toast-ui/jquery-editor
```

### Importing the Wrapper

#### ES Modules

```js
import '@toast-ui/jquery-editor';
```

or

#### CommonJS

```js
require('@toast-ui/jquery-editor');
```

### Creating an Instance

Before creating the instance, add the element that will create the editor. And you must import jQuery before the wrapper.

```html
<body>
  <div id="editor"></div>
  ...
</body>
```

#### Using the Editor

```js
import $ from 'jquery';
import '@toast-ui/jquery-editor';

$('#editor').toastuiEditor({
  // ...
});
```

The `viewer` option allows you to use it as a viewer.

```js
$('#viewer').toastuiEditor({
  // ...
  viewer: true
});
```

#### Using the Viewer

If you want to use only the viewer, import the bundle file corresponding to the viewer.

```js
import $ from 'jquery';
import '@toast-ui/jquery-editor/dist/toastui-jquery-editor-viewer';

$('#viewer').toastuiEditor({
  // ...
});
```

## 🗂 Using CDN

To use the wrapper, the jQuery's CDN file must be included.

### Including Files

```html
<body>
  ...
  <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
  <script src="https://uicdn.toast.com/editor/latest/toastui-jquery-editor.min.js"></script>
</body>
```

### Creating an Instance

Before creating the instance, add the element that will create the editor.

```html
<body>
  <div id="editor"></div>
  ...
</body>
```

#### Using the Editor

```js
$('#editor').toastuiEditor({
  // ...
});
```

The `viewer` option allows you to use it as a viewer.

```js
$('#viewer').toastuiEditor({
  // ...
  viewer: true
});
```

#### Using the Viewer

If you want to use only the viewer, include the following file:

```html
<script src="https://uicdn.toast.com/editor/latest/toastui-jquery-editor-viewer.min.js"></script>
```

```js
$('#viewer').toastuiEditor({
  // ...
});
```

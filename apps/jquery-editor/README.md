# TOAST UI Editor for jQuery

> This is a [jQuery](https://jquery.com/) component wrapping [TOAST UI Editor](https://github.com/nhn/tui.editor/tree/master/apps/editor).

[![npm version](https://img.shields.io/npm/v/@toast-ui/jquery-editor.svg)](https://www.npmjs.com/package/@toast-ui/jquery-editor)

## 🚩 Table of Contents

- [Collect Statistics on the Use of Open Source](#collect-statistics-on-the-use-of-open-source)
- [Bundle File Structure](#-bundle-file-structure)
- [Usage npm](#-usage-npm)
- [Usage CDN](#-usage-cdn)

## Collect Statistics on the Use of Open Source

jQuery Wrapper of TOAST UI Editor applies Google Analytics (GA) to collect statistics on the use of open source, in order to identify how widely TOAST UI Editor is used throughout the world. It also serves as important index to determine the future course of projects. location.hostname (e.g. ui.toast.com) is to be collected and the sole purpose is nothing but to measure statistics on the usage. To disable GA, use the following `usageStatistics` options when declare jquery Wrapper compoent.

```js
const options = {
  ...
  usageStatistics: false
}

const editor = $('#editor').toastuiEditor(options);
```

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

The bundle files provided by CDN include TOAST UI Editor([`@toast-ui/editor`](https://github.com/nhn/tui.editor/tree/master/apps/editor)).

```
- uicdn.toast.com/
  - editor/
    - latest/
      - toastui-jquery-editor.js
      - toastui-jquery-editor.min.js
      - toastui-jquery-editor-viewer.js
      - toastui-jquery-editor-viewer.min.js
```

## 📦 Usage npm

### Install

```sh
$ npm install --save @toast-ui/jquery-editor
```

### Import

You can use TOAST UI Editor for jQuery as a ECMAScript module or a CommonJS module. As this module does not contain CSS files, you should import `toastui-editor.css` from `@toast-ui/editor` and `codemirror.css` from `CodeMirror` in the script.

- ES Modules

```js
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';

import '@toast-ui/jquery-editor';
```

- CommonJS

```js
require('codemirror/lib/codemirror.css');
require('@toast-ui/editor/dist/toastui-editor.css');

require('@toast-ui/jquery-editor');
```

### Creating Component

Before creating the instance, add the element that will create the editor. And you must import jQuery before the wrapper.

```html
<body>
  <div id="editor"></div>
  ...
</body>
```

#### Using the Editor

It can be used by using the `toastuiEditor` function. If the first parameter type is an object, you can create an instance of the Editor using this object as an option. And if the parameter type is string, you can call API function. The options and method APIs are the same as [those of the editor](https://nhn.github.io/tui.editor/latest/ToastUIEditor).

```js
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';

import $ from 'jquery';
import '@toast-ui/jquery-editor';

$('#editor').toastuiEditor({
  height: '500px',
  initialEditType: 'markdown',
  previewStyle: 'vertical'
});

const content = $('#editor').toastuiEditor('getHtml');

console.log(content);
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
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';

import $ from 'jquery';
import '@toast-ui/jquery-editor/dist/toastui-jquery-editor-viewer';

$('#viewer').toastuiEditor({
  height: '500px',
  initialValue: '# hello'
});
```

## 🗂 Usage CDN

To use the wrapper, the jQuery's CDN file must be included.

### Including Files

```html
<body>
  ...
  <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
  <script src="https://uicdn.toast.com/editor/latest/toastui-jquery-editor.min.js"></script>
</body>
```

### Creating Component

Before creating the instance, add the element that will create the editor.

```html
<body>
  <div id="editor"></div>
  ...
</body>
```

#### Using Editor

```js
$('#editor').toastuiEditor({
  height: '500px',
  initialEditType: 'markdown',
  previewStyle: 'vertical'
});
```

The `viewer` option allows you to use it as a viewer.

```js
$('#viewer').toastuiEditor({
  // ...
  viewer: true
});
```

#### Using Viewer

If you want to use only the viewer, include the following file:

```html
<script src="https://uicdn.toast.com/editor/latest/toastui-jquery-editor-viewer.min.js"></script>
```

```js
$('#viewer').toastuiEditor({
  height: '500px',
  initialValue: '# hello'
});
```

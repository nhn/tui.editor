# ![TOAST UI Editor](https://uicdn.toast.com/toastui/img/tui-editor-bi.png)

[![npm](https://img.shields.io/npm/v/@toast-ui/editor.svg)](https://www.npmjs.com/package/@toast-ui/editor)

## 🚩 Table of Contents

- [Collect statistics on the use of open source](#Collect-statistics-on-the-use-of-open-source)
- [Documents](#-documents)
- [Install](#-install)
- [Usage](#-usage)

## Collect statistics on the use of open source

TOAST UI Editor applies Google Analytics (GA) to collect statistics on the use of open source, in order to identify how widely TOAST UI Editor is used throughout the world. It also serves as important index to determine the future course of projects. `location.hostname` (e.g. > "ui.toast.com") is to be collected and the sole purpose is nothing but to measure statistics on the usage.

To disable GA, use the following `usageStatistics` option when creating the instance.

```js
const options = {
  // ...
  usageStatistics: false
};

const instance = new Editor(options);
```

## 📙 Documents

- [Getting Started]()
- v2.0 Migration Guide
  - [English]()
  - [한국어]()
- [APIs](https://nhn.github.io/tui.editor/latest/)

You can also see the older versions of API page on the [releases page](https://github.com/nhn/tui.editor/releases).

## 💾 Install

TOAST UI products can be used by using the package manager or downloading the source directly. However, we highly recommend using the package manager.

### Via Package Manager

TOAST UI products are registered in two package managers, [npm](https://www.npmjs.com/). You can conveniently install it using the commands provided by the package manager. When using npm, be sure to use it in the environment [Node.js](https://nodejs.org/en/) is installed.

#### npm

```sh
$ npm install --save @toast-ui/editor # Latest Version
$ npm install --save @toast-ui/editor@<version> # Specific Version
```

When installed and used with npm, the list of files that can be imported is as follows:

```
- node_modules/
   ├─ @toast-ui/editor/
   │     ├─ dist/
   │     │    ├─ toastui-editor.js
   │     │    ├─ toastui-editor-viewer.js
   │     │    ├─ toastui-editor-editor.css
   │     │    └─ toastui-editor-viewer.css
```

### Via Contents Delivery Network (CDN)

TOAST UI products are available over the CDN powered by [TOAST Cloud](https://www.toast.com).

You can use the CDN as below.

```html
<head>
  ...
  <!-- Editor's Dependecy Style -->
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/codemirror.css"
  />
  <!-- Editor's Style -->
  <link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor.css" />
</head>
<body>
  ...
  <script src="https://uicdn.toast.com/editor/latest/toastui-editor.js"></script>
</body>
```

If you want to use a specific version, use the tag name instead of `latest` in the url's path.

The CDN directory has the following structure:

```
- uicdn.toast.com/
   ├─ editor/
   │     ├─ latest/
   │     │    ├─ toastui-editor-all.js
   │     │    ├─ toastui-editor-all.min.js
   │     │    ├─ toastui-editor-viewer.js
   │     │    ├─ toastui-editor-viewer.min.js
   │     │    ├─ toastui-editor-editor.css
   │     │    └─ toastui-editor-viewer.css
   │     ├─ 2.0.0/
   │     │    └─ ...
```

### Download Source Files

- [Download all sources for each version](https://github.com/nhn/tui.editor/releases)

## 🔨 Usage

### Basic : Using the Editor

#### HTML

Add the container element where TOAST UI Editor will be created.

```html
<div id="editor"></div>
```

#### JavaScript

TOAST UI Editor can be used by creating an instance with the constructor function. To get the constructor function, you should import the module using one of the following ways depending on your environment.

```javascript
import Editor from '@toast-ui/editor'; /* ES6 Modules */
```

```javascript
const Editor = require('@toast-ui/editor'); /* CommonJS */
```

Then import styles of TOAST UI Editor and [CodeMirror](https://codemirror.net/) dependency.

```javascript
import 'codemirror/lib/codemirror.css'; // Editor's Dependency Style
import '@toast-ui/editor/dist/toastui-editor.css'; // Editor's Style
```

Finally you can create an instance with options and call various API after creating an instance.

```javascript
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';

import Editor from '@toast-ui/editor';

const instance = new Editor({
  el: document.querySelector('#editor'),
  height: '500px',
  initialEditType: 'markdown',
  previewStyle: 'vertical'
});

instance.getMarkdown();
```

#### Default Options

- `height`: Height in string or auto ex) `300px` | `auto`
- `initialEditType`: Initial type to show `markdown` | `wysiwyg`
- `initialValue`: Initial value. Set Markdown string
- `previewType`: Preview style of Markdown mode `tab` | `vertical`
- `usageStatistics`: Let us know the _hostname_. We want to learn from you how you are using the Editor. You are free to disable it. `true` | `false`

Find out more options [here](https://nhn.github.io/tui.editor/latest/ToastUIEditor)

### Using the Viewer

TOAST UI Editor provides the **Viewer** in case you want to show _Markdown_ content without loading the Editor. The Viewer is much **lighter** than the Editor.

```javascript
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';

const instance = new Viewer({
  el: document.querySelector('#viewer'),
  height: '500px',
  initialValue: '# content to be rendered'
});

instance.getHtml();
```

Be careful not to load both the Editor and the Viewer at the same time because the Editor already contains the Viewer function, you can initialize editor [`Editor.factory()`](https://nhn.github.io/tui.editor/latest/ToastUIEditor#factory) and set the `viewer` option to value `true` in order to make the editor a viewer.

```javascript
import Editor from '@toast-ui/editor';

const instance = Editor.factory({
  el: document.querySelector('#viewerSection'),
  viewer: true,
  height: '500px',
  initialValue: '# content to be rendered'
});

instance.getHtml();
```

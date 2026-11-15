# ![TOAST UI Editor](https://uicdn.toast.com/toastui/img/tui-editor-bi.png)

> **⚠️ This project is no longer maintained.**
>
> TOAST UI Editor is deprecated, and this repository is archived. No new features or bug fixes will be released.

[![npm](https://img.shields.io/npm/v/@toast-ui/editor.svg)](https://www.npmjs.com/package/@toast-ui/editor)

## 🚩 Table of Contents

- [Collect Statistics on the Use of Open Source](#Collect-statistics-on-the-use-of-open-source)
- [Documents](#-documents)
- [Install](#-install)
- [Usage](#-usage)
- [Tutorials](#-tutorials)

## Collect Statistics on the Use of Open Source

TOAST UI products apply Google Analytics (GA) to collect statistics on the use of open source, in order to identify how widely TOAST UI Editor is used throughout the world. It also serves as important index to determine the future course of projects. `location.hostname` (e.g. ui.toast.com) is to be collected and the sole purpose is nothing but to measure statistics on the usage.

To disable GA, use the following `usageStatistics` option when creating the instance.

```js
const options = {
  // ...
  usageStatistics: false
};

const editor = new Editor(options);
```

## 📙 Documents

- [Getting Started](https://github.com/nhn/tui.editor/blob/master/docs/en/getting-started.md)
- [APIs](https://nhn.github.io/tui.editor/latest/)
- v3.0 Migration Guide
  - [English](https://github.com/nhn/tui.editor/blob/master/docs/v3.0-migration-guide.md)
  - [한국어](https://github.com/nhn/tui.editor/blob/master/docs/v3.0-migration-guide-ko.md)

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

### Via Contents Delivery Network (CDN)

TOAST UI products are available over the CDN powered by [NHN Cloud](https://www.toast.com).

You can use the CDN as below.

```html
...
<body>
  ...
  <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>
</body>
...
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
   │     │    ├─ toastui-editor.css
   │     │    ├─ toastui-editor.min.css
   │     │    ├─ toastui-editor-viewer.css
   │     │    ├─ toastui-editor-viewer.min.css
   │     │    ├─ toastui-editor-only.css
   │     │    ├─ toastui-editor-only.min.css
   │     │    └─ theme/
   │     │         ├─ toastui-editor-dark.css
   │     │         └─ toastui-editor-dark.min.css
   │     │    └─ i18n/
   │     │         └─ ...
   │     ├─ 2.0.0/
   │     │    └─ ...
```

## 🔨 Usage

First, you need to add the container element where TOAST UI Editor (henceforth referred to as 'Editor') will be created.

```html
...
<body>
  <div id="editor"></div>
</body>
...
```

The editor can be used by creating an instance with the constructor function. To get the constructor function, you should import the module using one of the following ways depending on your environment.

### Using Module Format in Node Environment

- ES6 Modules

```javascript
import Editor from '@toast-ui/editor';
```

- CommonJS

```javascript
const Editor = require('@toast-ui/editor');
```

### Using Namespace in Browser Environment

```javascript
const Editor = toastui.Editor;
```

Then, you need to add the CSS files needed for the Editor. Import CSS files in node environment, and add it to html file when using CDN.

### Using in Node Environment

```javascript
import '@toast-ui/editor/dist/toastui-editor.css'; // Editor's Style
```

### Using in Browser Environment by CDN

```html
...
<head>
  ...
  <!-- Editor's Style -->
  <link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor.min.css" />
</head>
...
```

Finally you can create an instance with options and call various API after creating an instance.

```javascript
const editor = new Editor({
  el: document.querySelector('#editor'),
  height: '500px',
  initialEditType: 'markdown',
  previewStyle: 'vertical'
});

editor.getMarkdown();
```

### Default Options

- `height`: Height in string or auto ex) `300px` | `auto`
- `initialEditType`: Initial type to show `markdown` | `wysiwyg`
- `initialValue`: Initial value. Set Markdown string
- `previewStyle`: Preview style of Markdown mode `tab` | `vertical`
- `usageStatistics`: Let us know the _hostname_. We want to learn from you how you are using the Editor. You are free to disable it. `true` | `false`

Find out more options [here](https://nhn.github.io/tui.editor/latest/ToastUIEditor).

## 🦄 Tutorials

- [Viewer](https://github.com/nhn/tui.editor/blob/master/docs/en/viewer.md)
- [Plugins](https://github.com/nhn/tui.editor/blob/master/docs/en/plugin.md)
- [Internationalization (i18n)](https://github.com/nhn/tui.editor/blob/master/docs/en/i18n.md)

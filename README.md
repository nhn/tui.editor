# ![logo](https://cloud.githubusercontent.com/assets/389021/16107646/9729e556-33d8-11e6-933f-5b09fa3a53bb.png)
> GFM  Markdown Wysiwyg Editor - Productive and Extensible

[![github version](https://img.shields.io/github/release/nhnent/tui.editor.svg)](https://github.com/nhnent/tui.editor/releases/latest) [![npm version](https://img.shields.io/npm/v/tui-editor.svg)](https://www.npmjs.com/package/tui-editor) [![bower version](https://img.shields.io/bower/v/tui-editor.svg)](https://github.com/nhnent/tui.editor/releases/latest) [![license](https://img.shields.io/github/license/nhnent/tui.editor.svg)](https://github.com/nhnent/tui.editor/blob/production/LICENSE) [![PRs welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg)](https://github.com/nhnent/tui.editor/pulls) [![code with hearth by NHN ent.](https://img.shields.io/badge/%3C%2F%3E%20with%20%E2%99%A5%20by-NHN%20Ent.-brightgreen.svg)](https://github.com/nhnent)

<p align="center"><a href="https://nhnent.github.io/tui.editor/"><img src="https://user-images.githubusercontent.com/1215767/34356204-4c03be8a-ea7f-11e7-9aa9-0d84f9e912ec.gif" /></a></p>

## 🚩 Table of Contents
- [Standard and Extensible](#-standard-and-extensible)
    - [CommonMark + GFM Specifications](#commonmark--gfm-specifications)
    - [Powerful Extensions](#powerful-extensions)
- [Features](#-features)
    - [Productive Markdown mode](#productive-markdown-mode)
    - [Easy Wysiwig mode](#easy-wysiwig-mode)
    - [And more](#and-more)
- [Install](#-install)
    - [using npm](#using-npm)
    - [using bower](#using-bower)
    - [Download](#download)
- [Usage](#-usage)
    - [Editor](#editor)
        - [HTML](#html)
        - [javascript](#javascript)
        - [options](#options)
    - [Viewer](#viewer)
- [Docs](#-docs)
- [Examples](#-examples)
- [Browser Support](#-browser-support)
- [License](#-license)

## <img src="https://user-images.githubusercontent.com/1215767/34336735-e7c9c4b0-e99c-11e7-853b-2449b51f0bab.png" height="18px" /> Standard and Extensible
![standard and extensible image](https://user-images.githubusercontent.com/1215767/34353629-95b58da0-ea6c-11e7-859b-df5e990dd157.png)

### CommonMark + GFM Specifications

Today *CommonMark* is the de-facto *Markdown* standard. *GFM (GitHub Flavored Markdown)* is another popular specification based on *CommonMark* - maintained by *GitHub*, which is known as the biggest *Markdown* user.
**ToastUI Editor** respects both [*CommonMark*](http://commonmark.org/) and [*GFM*](https://github.github.com/gfm/) specifications. Write documents with ease using productive tools provided by **ToastUI Editor**. You can open this document wherever the specifications are supported.

### Powerful Extensions
*CommonMark* and *GFM* are great, but we often face requirements beyond the specifications. The **ToastUI Editor** comes with powerful **Extensions** in compliance with the *Markdown* syntax, while also providing APIs so you can develop your own extensions.

Here are some of the extensions you can start with:

* **Color picker**: [ColorPicker](https://github.com/nhnent/tui.color-picker) provides an easy way to color text with a GUI tool box
* **Chart code block**: A Code block marked as a 'chart' will render [charts](https://github.com/nhnent/tui.chart)
* **UML code block**: A Code block marked as an 'uml' will render [UML diagrams](http://plantuml.com/screenshot)
* **Table merge**: You can merge columns and rows in tables

 To learn more about **Extensions** check the [Extension Docs](https://github.com/nhnent/tui.editor/wiki/Extensions)

## 🎨 Features
**ToastUI Editor** provides **Markdown mode** and **Wysiwyg mode**.

Some may like the productivity of *Markdown*, while others may be looking for a way to make it easier to edit. The **ToastUI Editor** can be the coordinator of both. It offers **Markdown mode** and **Wysiwyg mode**, which can be switched at any time during writing content. Both work together conveniently in one document.

### Productive Markdown mode
![markdown image](https://user-images.githubusercontent.com/1215767/34354737-b98a0736-ea73-11e7-8375-d4c83b8894d8.png)
* **Live Preview**: Edit Markdown while keeping eye on the rendered HTML. Your edits will be applied immediately
* **Scrolling Sync**: Synchronous scrolling between Markdown and Preview. You don't need to scroll those separately
* **Auto indent**: The cursor will always be where you want to be
* **Syntax highlight**: You can check broken Markdown syntax immediately

### Easy Wysiwig mode
![wysiwyg image](https://user-images.githubusercontent.com/1215767/34354831-5f04c7e6-ea74-11e7-9664-97f71c4fee6e.png)
* **Copy and paste**: Paste anything from browser, screenshot, excel, powerpoint etc
* **Codeblock editor**: Highlight 170+ languages with full size code editor
* **Table**: Hate the Markdown table? You can do everything with a mouse

### And more
* **i18n**: English, Dutch, Korean, Japanese, Chinese + language you extend.
* **Viewer**: Renders Markdown content with extensions


## 💾 Install

### using npm
```sh
npm install --save tui-editor
```

### using bower
```sh
bower install --save tui-editor
```

### download
* [Download bundle files from `dist` directory](https://github.com/nhnent/tui.editor/tree/production/dist)
* [Download all sources for each version from release](https://github.com/nhnent/tui.editor/releases)

## 🔨 Usage
Below codes are for *npm*. If you are using *bower* please see [Getting started with bower](https://github.com/nhnent/tui.editor/wiki/Getting-started-with-bower).

### Editor

#### HTML
Place a `<div></div>` where you want ToastUI Editor rendered.
```html
<body>
...
<div id="editSection"></div>
...
</body>
```

#### javascript
Initialize Editor class with given element to make an Editor.
```javascript
var Editor = require('tui-editor');
...
var editor = new Editor({
    el: document.querySelector('#editSection'),
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    height: '300px'
});
```

or you can use jquery plugin.
```javascript
$('#editSection').tuiEditor({
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    height: '300px'
});
```

#### options
* **height**: Height in string or auto ex) `300px` | `auto`
* **initialValue**: Initial value. Set Markdown string
* **initialEditType**: Initial type to show `markdown` | `wysiwyg`
* **previewType**: Preview style of Markdown mode `tab` | `vertical`

Find out more options [here](https://nhnent.github.io/tui.editor/api/latest/ToastUIEditor.html#ToastUIEditor)

### Viewer
**ToastUI Editor** provides a **Viewer** in case you want to show *Markdown* content without loading the editor. The **Viewer** has much **lighter** than the editor.

```javascript
var Viewer = require('tui-editor/dist/tui-editor-Viewer');
...
var editor = new Viewer({
    el: document.querySelector('#viewerSection'),
    height: '500px',
    initialValue: '# content to be rendered'
});
...
```

Be careful not to load both the editor and the viewer. Since the editor already includes the viewer function, you can initialize editor by calling [Editor.factory()](https://nhnent.github.io/tui.editor/api/latest/ToastUIEditor.html#.factory) with `viewer` option `true` value to make the editor a viewer. You can also call [getHTML()](https://nhnent.github.io/tui.editor/api/latest/ToastUIEditor.html#getHtml) to get rendered *HTML* string.

```javascript
var Editor = require('tui-editor');
...
var editor = Editor.factory({
    el: document.querySelector('#viewerSection'),
    viewer: true,
    height: '500px',
    initialValue: '# content to be rendered'
});
...
```

**ToastUI Editor** respects *CommonMark* and *GFM*. So any *Markdown* renderer including [markdownit](https://github.com/markdown-it/markdown-it) can handle the content it made. You can use any of those renderer without **Viewer** if you want.


## 📙 Docs
* [Getting Started](https://github.com/nhnent/tui.editor/wiki/Getting-Started)
* [APIs](https://nhnent.github.io/tui.editor/api/latest/)
* [Getting started with bower](https://github.com/nhnent/tui.editor/wiki/Getting-started-with-bower)

## 🐾 Examples
* [editor basic](https://nhnent.github.io/tui.editor/api/latest/tutorial-example01-basic.html)
* [viewer basic](https://nhnent.github.io/tui.editor/api/latest/tutorial-example02-viewer-basic.html)
* [jQuery plugin](https://nhnent.github.io/tui.editor/api/latest/tutorial-example03-jquery.html)
* [uml plugin](https://nhnent.github.io/tui.editor/api/latest/tutorial-example08-uml.html)
* [chart plugin](https://nhnent.github.io/tui.editor/api/latest/tutorial-example11-chart.html)
* [more examples in demo directory](https://nhnent.github.io/tui.editor/api/latest/tutorial-example00-demo.html)

## 🌏 Browser Support
|<img src="https://user-images.githubusercontent.com/1215767/34348590-250b3ca2-ea4f-11e7-9efb-da953359321f.png" alt="IE / Edge" width="16px" height="16px" /> Internet Explorer | <img src="https://user-images.githubusercontent.com/1215767/34348380-93e77ae8-ea4d-11e7-8696-9a989ddbbbf5.png" alt="IE / Edge" width="16px" height="16px" /> Edge | <img src="https://user-images.githubusercontent.com/1215767/34348383-9e7ed492-ea4d-11e7-910c-03b39d52f496.png" alt="Firefox" width="16px" height="16px" /> Firefox | <img src="https://user-images.githubusercontent.com/1215767/34348387-a2e64588-ea4d-11e7-8267-a43365103afe.png" alt="Chrome" width="16px" height="16px" /> Chrome | <img src="https://user-images.githubusercontent.com/1215767/34348394-a981f892-ea4d-11e7-9156-d128d58386b9.png" alt="Safari" width="16px" height="16px" /> Safari |
| :---------: | :---------: | :---------: | :---------: | :---------: |
| 10+ | Yes | Yes | Yes | Yes |

## 📜 License
This software is licensed under the [MIT](https://github.com/nhnent/tui.editor/blob/production/LICENSE) © [NHN Ent.](https://github.com/nhnent)

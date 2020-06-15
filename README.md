# ![TOAST UI Editor](https://uicdn.toast.com/toastui/img/tui-editor-bi.png)

> GFM  Markdown and WYSIWYG Editor - Productive and Extensible

[![github release version](https://img.shields.io/github/v/release/nhn/tui.editor.svg?include_prereleases)](https://github.com/nhn/tui.editor/releases/latest) [![npm version](https://img.shields.io/npm/v/@toast-ui/editor.svg)](https://www.npmjs.com/package/@toast-ui/editor) [![license](https://img.shields.io/github/license/nhn/tui.editor.svg)](https://github.com/nhn/tui.editor/blob/master/LICENSE) [![PRs welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg)](https://github.com/nhn/tui.editor/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) [![code with hearth by NHN](https://img.shields.io/badge/%3C%2F%3E%20with%20%E2%99%A5%20by-NHN-ff1414.svg)](https://github.com/nhn)

<img src="https://user-images.githubusercontent.com/18183560/84614193-59392700-af00-11ea-9a55-4a90a6ab5fe8.gif" />


## 🚩 Table of Contents

- [Packages](#-packages)
- [Why TOAST UI Editor?](#-why-toast-ui-editor)
- [Features](#-features)
- [Examples](#-examples)
- [Browser Support](#-browser-support)
- [Pull Request Steps](#-pull-request-steps)
- [Contributing](#-contributing)
- [TOAST UI Family](#-toast-ui-family)
- [Used By](#-used-by)
- [License](#-license)


## 📦 Packages

### TOAST UI Editor

| Name | Description |
| --- | --- |
| [`@toast-ui/editor`](https://github.com/nhn/tui.editor/tree/master/apps/editor) | Plain JavaScript component |

### TOAST UI Editor's Wrappers

| Name | Description |
| --- | --- |
| [`@toast-ui/jquery-editor`](https://github.com/nhn/tui.editor/tree/master/apps/jquery-editor) | [jQuery](https://jquery.com/) wrapper component |
| [`@toast-ui/react-editor`](https://github.com/nhn/tui.editor/tree/master/apps/react-editor) | [React](https://reactjs.org/) wrapper component |
| [`@toast-ui/vue-editor`](https://github.com/nhn/tui.editor/tree/master/apps/vue-editor) | [Vue](https://vuejs.org/) wrapper component |

### TOAST UI Editor's Plugins

| Name | Description |
| --- | --- |
| [`@toast-ui/editor-plugin-chart`](https://github.com/nhn/tui.editor/tree/master/plugins/chart) | Plugin to render chart |
| [`@toast-ui/editor-plugin-code-syntax-highlight`](https://github.com/nhn/tui.editor/tree/master/plugins/code-syntax-highlight) | Plugin to highlight code syntax |
| [`@toast-ui/editor-plugin-color-syntax`](https://github.com/nhn/tui.editor/tree/master/plugins/color-syntax) | Plugin to color editing text |
| [`@toast-ui/editor-plugin-table-merged-cell`](https://github.com/nhn/tui.editor/tree/master/plugins/table-merged-cell) | Plugin to merge table columns |
| [`@toast-ui/editor-plugin-uml`](https://github.com/nhn/tui.editor/tree/master/plugins/uml) | Plugin to render UML |


## 🤖 Why TOAST UI Editor?

TOAST UI Editor provides **Markdown mode** and **WYSIWYG mode**. Depending on the type of use you want like production of *Markdown* or maybe to just edit the *Markdown*. The TOAST UI Editor can be helpful for both the usage. It offers **Markdown mode** and **WYSIWYG mode**, which can be switched any point in time.

### Productive Markdown Mode

![markdown](https://user-images.githubusercontent.com/18183560/84381972-d3c62600-ac24-11ea-99e2-9640b0a2bfe8.png)

**CommonMark + GFM Specifications**

Today *CommonMark* is the de-facto *Markdown* standard. *GFM (GitHub Flavored Markdown)* is another popular specification based on *CommonMark* - maintained by *GitHub*, which is the *Markdown* mostly used. TOAST UI Editor follows both [*CommonMark*](http://commonmark.org/) and [*GFM*](https://github.github.com/gfm/) specifications. Write documents with ease using productive tools provided by TOAST UI Editor and you can easily open the produced document wherever the specifications are supported.

* **Live Preview** : Edit Markdown while keeping an eye on the rendered HTML. Your edits will be applied immediately.
* **Scroll Sync** : Synchronous scrolling between Markdown and Preview. You don't need to scroll through each one separately.
* **Auto Indent** : The cursor will always be where you want it to be.
* **Syntax Highlight** : You can check broken Markdown syntax immediately.

### Easy WYSIWYG Mode

![wysiwyg](https://user-images.githubusercontent.com/18183560/84381978-d88ada00-ac24-11ea-8655-3208cb46a8ae.png)

* **Table** : Through the context menu of the table, you can add or delete columns or rows of the table, and you can also arrange text in cells.
* **Code Block Editor** : The code block area can be edited through the layer popup editor.

### Usability Common UI

![UI](https://user-images.githubusercontent.com/18183560/84381975-d6c11680-ac24-11ea-9816-9cf2aecbdf06.gif)

* **Toolbar** : Through the toolbar, you can style or add elements to the document you are editing.
* **Copy and Paste** : Paste anything from browser, screenshot, excel, powerpoint, etc.

### Use of Various Extended Functions - Plugins

![plugin](https://user-images.githubusercontent.com/18183560/84381966-cf9a0880-ac24-11ea-9bb4-1e8a8ca186de.png)

CommonMark and GFM are great, but we often need more abstraction. The TOAST UI Editor comes with powerful **Plugins** in compliance with the Markdown syntax.

**Five basic plugins** are provided as follows, and can be downloaded and used with npm.

* [**`chart`**](https://github.com/nhn/tui.editor/tree/master/plugins/chart) : A code block marked as a 'chart' will render [TOAST UI Chart](https://github.com/nhn/tui.chart).
* [**`code-syntax-highlight`**](https://github.com/nhn/tui.editor/tree/master/plugins/code-syntax-highlight) : Highlight the code block area corresponding to the language provided by [highlight.js](https://highlightjs.org/).
* [**`color-syntax`**](https://github.com/nhn/tui.editor/tree/master/plugins/color-syntax) : 
Using [TOAST UI ColorPicker](https://github.com/nhn/tui.color-picker), you can change the color of the editing text with the GUI.
* [**`table-merged-cell`**](https://github.com/nhn/tui.editor/tree/master/plugins/table-merged-cell) : 
You can merge columns of the table header and body area.
* [**`uml`**](https://github.com/nhn/tui.editor/tree/master/plugins/uml) : A code block marked as an 'uml' will render [UML diagrams](http://plantuml.com/screenshot).

## 🎨 Features

* [**Viewer**](https://github.com/nhn/tui.editor/tree/master/apps/editor/docs/viewer.md) : Supports a mode to display only markdown data without an editing area.
* [**Internationalization (i18n)**](https://github.com/nhn/tui.editor/tree/master/apps/editor/docs/i18n.md) : Supports English, Dutch, Korean, Japanese, Chinese, Spanish, German, Russian, French, Ukrainian, Turkish, Finnish, Czech, Arabic, Polish, Galician, Swedish, Italian, Norwegian + language and you can extend.

## 🐾 Examples

* [Basic](https://nhn.github.io/tui.editor/latest/tutorial-example01-editor-basic)
* [Viewer](https://nhn.github.io/tui.editor/latest/tutorial-example04-viewer)
* [Using All Plugins](https://nhn.github.io/tui.editor/latest/tutorial-example15-editor-with-all-plugins)
* [Creating the User's Plugin](https://nhn.github.io/tui.editor/latest/tutorial-example17-creating-plugin)
* [Customizing the Toobar Buttons](https://nhn.github.io/tui.editor/latest/tutorial-example19-customizing-toolbar-buttons)
* [Internationalization (i18n)](https://nhn.github.io/tui.editor/latest/tutorial-example20-i18n)

Here are more [examples](https://nhn.github.io/tui.editor/latest/tutorial-example01-editor-basic) and play with TOAST UI Editor!


## 🌏 Browser Support

| <img src="https://user-images.githubusercontent.com/1215767/34348387-a2e64588-ea4d-11e7-8267-a43365103afe.png" alt="Chrome" width="16px" height="16px" /> Chrome | <img src="https://user-images.githubusercontent.com/1215767/34348590-250b3ca2-ea4f-11e7-9efb-da953359321f.png" alt="IE" width="16px" height="16px" /> Internet Explorer | <img src="https://user-images.githubusercontent.com/1215767/34348380-93e77ae8-ea4d-11e7-8696-9a989ddbbbf5.png" alt="Edge" width="16px" height="16px" /> Edge | <img src="https://user-images.githubusercontent.com/1215767/34348394-a981f892-ea4d-11e7-9156-d128d58386b9.png" alt="Safari" width="16px" height="16px" /> Safari | <img src="https://user-images.githubusercontent.com/1215767/34348383-9e7ed492-ea4d-11e7-910c-03b39d52f496.png" alt="Firefox" width="16px" height="16px" /> Firefox |
| :---------: | :---------: | :---------: | :---------: | :---------: |
| Yes | 10+ | Yes | Yes | Yes |


## 🔧 Pull Request Steps

TOAST UI products are open source, so you can create a pull request(PR) after you fix issues. Run npm scripts and develop yourself with the following process.

### Setup

Fork `master` branch into your personal repository. Clone it to local computer. Install node modules. Before starting development, you should check to haveany errors.

```sh
$ git clone https://github.com/{your-personal-repo}/tui.editor.git
$ npm install
$ cd apps/editor
$ npm install
$ npm run test
```

### Develop

You can see your code is reflected as soon as you saving the codes by running a server. Don't miss adding test cases and then make green rights.

#### Run webpack-dev-server

``` sh
$ npm run serve
```

#### Run karma

``` sh
$ npm run test
```

### Pull Request

Before creating a PR, test and check for any errors. If there are no errors, then commit and push.

For more information, please refer to the Contributing section.

## 💬 Contributing

* [Code of Conduct](https://github.com/nhn/tui.editor/blob/master/CODE_OF_CONDUCT.md)
* [Contributing Guideline](https://github.com/nhn/tui.editor/blob/master/CONTRIBUTING.md)
* [Commit Convention](https://github.com/nhn/tui.editor/blob/master/docs/COMMIT_MESSAGE_CONVENTION.md)
* [Issue Guidelines](https://github.com/nhn/tui.editor/tree/master/.github/ISSUE_TEMPLATE)


## 🍞 TOAST UI Family

- [TOAST UI Calendar](https://github.com/nhn/tui.calendar)
- [TOAST UI Chart](https://github.com/nhn/tui.chart)
- [TOAST UI Grid](https://github.com/nhn/tui.grid)
- [TOAST UI Image Editor](https://github.com/nhn/tui.image-editor)
- [TOAST UI Components](https://github.com/nhn)


## 🚀 Used By

* [TOAST Dooray! - Collaboration Service (Project, Messenger, Mail, Calendar, Drive, Wiki, Contacts)](https://dooray.com)
* [UNOTES - Visual Studio Code Extension](https://marketplace.visualstudio.com/items?itemName=ryanmcalister.Unotes)


## 📜 License

This software is licensed under the [MIT](https://github.com/nhn/tui.editor/blob/master/LICENSE) © [NHN](https://github.com/nhn).

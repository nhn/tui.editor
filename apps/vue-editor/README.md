# Vue wrapper for TOAST UI Editor

> This is Vue component wrapping [TOAST UI Editor](https://github.nhnent.com/fe/tui.editor).

[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)
[![github version](https://img.shields.io/github/release/nhnent/toast-ui.vue-editor.svg)](https://github.com/nhnent/toast-ui.vue-editor/releases/latest) 
[![npm version](https://img.shields.io/npm/v/toast-ui.vue-editor.svg)](https://www.npmjs.com/package/vue-tui-editor) 
[![license](https://img.shields.io/github/license/nhnent/toast-ui.vue-editor.svg)](https://github.com/nhnent/toast-ui.vue-editor/blob/master/LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg)](https://github.com/nhnent/toast-ui.vue-editor/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
[![code with hearth by NHN ent.](https://img.shields.io/badge/%3C%2F%3E%20with%20%E2%99%A5%20by-NHN%20Ent.-brightgreen.svg)](https://github.com/nhnent)

## 🚩 Table of Contents
* [Install](#-install)
    * [Using npm](#using-npm)
    * [Via Contents Delivery Network (CDN)](#via-contents-delivery-network-cdn)
* [Usage](#-usage)
    * [Load](#load)
    * [Implement](#implement)
    * [Using v-model](#using-v-model)
    * [Props](#props)
    * [Event](#event)
    * [Method](#method)
* [Pull Request Steps](#-pull-request-steps)
    * [Setup](#setup)
    * [Develop](#develop)
    * [Pull Request Steps](#pull-request)
* [Documents](#-documents)
* [Contributing](#-contributing)
* [License](#-license)



## 💾 Install

### Using npm

```sh
npm install --save @toast-ui/vue-editor
```

### Via Contents Delivery Network (CDN)

TOAST UI products are available over the CDN powered by [TOAST Cloud](https://www.toast.com).

You can use the CDN as below.

```html
<script src="https://uicdn.toast.com/toast-ui.vue-editor/latest/vue-editor.js"></script>
```

## 🔨 Usage

If you want to more details, see [Tutorials](https://github.com/nhnent/toast-ui.vue-editor/blob/master/docs/getting-started.md) 👀

### Load

* Using module

    If you use some kind of bundle loader like `webpack` of `rollup`, you can add the import like this:
    ```js
    // es modules
    import { Editor } from '@toast-ui/vue-editor'
    // commonjs require
    var ToustUI = require('@toast-ui/vue-editor'); // you can use toastui.Editor
    ```

* Using `<script>`
  
    If you just add javascript file to your html, you use CDN or `vue-editor.js` downloaded. Insert `<script>` in your html like this:

    ```html
    <script src="path/to/vue-editor.js"></script>
    ```

* Using only Vue wrapper component

    `vue-eidtor.js` has all of the tui.editor. If you only need vue wrapper component, you can use `@toast-ui/vue-editor/src/index.js` like this:

    ```js
    import { Editor } from '@toast-ui/vue-editor/src/index'
    ```

### Implement

First implement `<tui-editor>` in the template.

```html
<template>
    <tui-editor/>
</template>
```

And then add `Editor` to the `components` in your component or Vue instance like this:
```js
import { Editor } from '@toast-ui/vue-editor'

export default {
  components: {
    'tui-editor': Editor
  }
}
```
or
```js
import { Editor } from '@toast-ui/vue-editor'
new Vue({
    el: '#app',
    components: {
        'tui-editor': Editor
    }
});
```

### Using v-model

If you use v-model, you have to declare a `data` for binding.

In the example below, `editorText` is binding to the text of the editor.

```html
<template>
    <tui-editor v-model="editorText"/>
</template>
<script>
import { Editor } from '@toast-ui/vue-editor'

export default {
  components: {
    'tui-editor': Editor
  },
  data() {
      return {
          editorText: ''
      }
  }
}
</script>
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| value | String | '' | This prop can change content of the editor. **If you using `v-model`, don't use it**. |
| options | Object | following `defaultOptions` | Options of tui.editor. This is for initailize tui.editor. |
| height | String | '300px' | This prop can control the height of the editor. |
| previewStyle | String | 'tab' | This prop can change preview style of the editor. (`tab` or `vertical`) |
| mode | String | 'markdown' | This prop can change mode of the editor. (`markdown`or `wysiwyg`) |
| html | String | - | If you want change content of the editor using html format, use this prop. |
| visible | Boolean | true | This prop can control visible of the eiditor. |

```js
const defaultOptions = {
    minHeight: '200px',
    language: 'en_US',
    useCommandShortcut: true,
    useDefaultHTMLSanitizer: true,
    usageStatistics: true,
    hideModeSwitch: false,
    toolbarItems: [
        'heading',
        'bold',
        'italic',
        'strike',
        'divider',
        'hr',
        'quote',
        'divider',
        'ul',
        'ol',
        'task',
        'indent',
        'outdent',
        'divider',
        'table',
        'image',
        'link',
        'divider',
        'code',
        'codeblock'
    ]
};
```

### Event

* load : It would be emitted when editor fully load
* change : It would be emitted when content changed
* stateChange : It would be emitted when format change by cursor position
* focus : It would be emitted when editor get focus
* blur : It would be emitted when editor loose focus

### Method

If you want to more manipulate the Editor, you can use `invoke` method to call the method of tui.editor. For more information of method, see [method of tui.editor](http://nhnent.github.io/tui.editor/api/latest/ToastUIEditor.html).

First, you need to assign `ref` attribute of `<tui-editor/>` and then you can use `invoke` method through `this.$refs` like this:

```html
<template>
    <tui-editor ref="tuiEditor"/>
</template>
<script>
import { Editor } from '@toast-ui/vue-editor'

export default {
    components: {
        'tui-editor': Editor
    },
    methods: {
        scroll() {
            this.$refs.tuiEditor.invoke('scrollTop', 10);
        },
        moveTop() {
            this.$refs.tuiEditor.invoke('moveCursorToStart');
        },
        getHtml() {
            let html = this.$refs.tuiEditor.invoke('getHtml');
        }
    }
};
</script>
```

## 🔧 Pull Request Steps

TOAST UI products are open source, so you can create a pull request(PR) after you fix issues.
Run npm scripts and develop yourself with the following process.

### Setup

Fork `develop` branch into your personal repository.
Clone it to local computer. Install node modules.
Before starting development, you should check to haveany errors.

``` sh
$ git clone https://github.com/{your-personal-repo}/[[repo name]].git
$ cd [[repo name]]
$ npm install
```

### Develop

Let's start development!

### Pull Request

Before PR, check to test lastly and then check any errors.
If it has no error, commit and then push it!

For more information on PR's step, please see links of Contributing section.

## 📙 Documents
* [Getting Started](https://github.com/nhnent/toast-ui.vue-editor/blob/production/docs/getting-started.md)

## 💬 Contributing
* [Code of Conduct](https://github.com/nhnent/toast-ui.vue-editor/blob/master/CODE_OF_CONDUCT.md)
* [Contributing guideline](https://github.com/nhnent/toast-ui.vue-editor/blob/master/CONTRIBUTING.md)
* [Commit convention](https://github.com/nhnent/toast-ui.vue-editor/blob/master/docs/COMMIT_MESSAGE_CONVENTION.md)

## 📜 License
This software is licensed under the [MIT](https://github.com/nhnent/toast-ui.vue-editor/blob/master/LICENSE) © [NHN Ent.](https://github.com/nhnent)

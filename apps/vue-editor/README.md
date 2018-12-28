# TOAST UI Editor for Vue

> This is Vue component wrapping [TOAST UI Editor](https://github.com/nhnent/tui.editor).

[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)
[![github version](https://img.shields.io/github/release/nhnent/toast-ui.vue-editor.svg)](https://github.com/nhnent/toast-ui.vue-editor/releases/latest) 
[![npm version](https://img.shields.io/npm/v/@toast-ui/vue-editor.svg)](https://www.npmjs.com/package/@toast-ui/vue-editor)
[![license](https://img.shields.io/github/license/nhnent/toast-ui.vue-editor.svg)](https://github.com/nhnent/toast-ui.vue-editor/blob/master/LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg)](https://github.com/nhnent/toast-ui.vue-editor/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
[![code with hearth by NHN Entertainment](https://img.shields.io/badge/%3C%2F%3E%20with%20%E2%99%A5%20by-NHN%20Entertainment-ff1414.svg)](https://github.com/nhnent)

## 🚩 Table of Contents
* [Collect statistics on the use of open source](#collect-statistics-on-the-use-of-open-source)
* [Install](#-install)
    * [Using npm](#using-npm)
* [Editor Usage](#-editor-usage)
    * [Load](#load)
    * [Implement](#implement)
    * [Using v-model](#using-v-model)
    * [Props](#props)
    * [Event](#event)
    * [Method](#method)
* [Viewer Usage](#-viewer-usage)
    * [Load](#load-1)
    * [Implement](#implement-1)
    * [Props](#props-1)
    * [Event](#event-1)
* [Pull Request Steps](#-pull-request-steps)
* [Documents](#-documents)
* [Contributing](#-contributing)
* [License](#-license)

## Collect statistics on the use of open source

Vue Wrapper of TOAST UI Editor applies Google Analytics (GA) to collect statistics on the use of open source, in order to identify how widely TOAST UI Editor is used throughout the world. It also serves as important index to determine the future course of projects. location.hostname (e.g. > “ui.toast.com") is to be collected and the sole purpose is nothing but to measure statistics on the usage. To disable GA, use the following `usageStatistics` options when declare Vue Wrapper compoent.

```js
var options = {
    ...
    usageStatistics: false
}
```

Or, include include `tui-code-snippet.js` (**v1.4.0** or **later**) and then immediately write the options as follows:

```js
tui.usageStatistics = false;
```

## 💾 Install

### Using npm

```sh
npm install --save @toast-ui/vue-editor
```

## 📝 Editor Usage

### Load

You can use Toast UI Editor for Vue as moudule format or namespace. Also you can use Single File Component (SFC of Vue). When using module format and SFC, you should load `tui-editor.css`, `tui-editor-contents.css` and `codemirror.css` in the script. 

* Using Ecmascript module

    ```js
    import 'tui-editor/dist/tui-editor.css';
    import 'tui-editor/dist/tui-editor-contents.css';
    import 'codemirror/lib/codemirror.css';
    import { Editor } from '@toast-ui/vue-editor'
    ```

* Using Commonjs module

    ```js
    require('tui-editor/dist/tui-editor.css');
    require('tui-editor/dist/tui-editor-contents.css');
    require('codemirror/lib/codemirror.css');
    var toastui = require('@toast-ui/vue-editor');
    var Editor = toastui.Editor;
    ```

* Using Single File Component

    ```js
    import 'tui-editor/dist/tui-editor.css';
    import 'tui-editor/dist/tui-editor-contents.css';
    import 'codemirror/lib/codemirror.css';
    import Editor from '@toast-ui/vue-editor/src/Editor.vue'
    ```

* Using namespace

    ```js
    var Editor = toastui.Editor;
    ```

### Implement

First implement `<editor/>` in the template.

```html
<template>
    <editor/>
</template>
```

And then add `Editor` to the `components` in your component or Vue instance like this:
```js
import { Editor } from '@toast-ui/vue-editor'

export default {
  components: {
    'editor': Editor
  }
}
```
or
```js
import { Editor } from '@toast-ui/vue-editor'
new Vue({
    el: '#app',
    components: {
        'editor': Editor
    }
});
```

### Using v-model

If you use v-model, you have to declare a `data` for binding. (❗️ When using the editor in `wysiwyg` mode, `v-model` can cause performance degradation.)

In the example below, `editorText` is binding to the text of the editor.

```html
<template>
    <editor v-model="editorText"/>
</template>
<script>
import { Editor } from '@toast-ui/vue-editor'

export default {
  components: {
    'editor': Editor
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
| html | String | - | If you want to change content of the editor using html format, use this prop. |
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
Example :

``` html
<template>
    <editor
    :value="editorText"
    :options="editorOptions"
    :html="editorHtml"
    :visible="editorVisible"
    previewStyle="vertical"
    height="500px"
    mode="wysiwyg"
    />
</template>
<script>
import { Editor } from '@toast-ui/vue-editor'

export default {
    components: {
        'editor': Editor
    },
    data() {
        return {
            editorText: 'This is initialValue.',
            editorOptions: {
                hideModeSwitch: true
            },
            editorHtml: '',
            editorVisible: true
        };
    },
};
</script>
```

### Event

* load : It would be emitted when editor fully load
* change : It would be emitted when content changed
* stateChange : It would be emitted when format change by cursor position
* focus : It would be emitted when editor get focus
* blur : It would be emitted when editor loose focus

Example :

```html
<template>
    <editor
    @load="onEditorLoad"
    @focus="onEditorFocus"
    @blur="onEditorBlur"
    @change="onEditorChange"
    @stateChange="onEditorStateChange"
    />
</template>
<script>
import { Editor } from '@toast-ui/vue-editor'

export default {
    components: {
        'editor': Editor
    },
    methods: {
        onEditorLoad() {
            // implement your code
        },
        onEditorFocus() {
            // implement your code
        },
        onEditorBlur() {
            // implement your code
        },
        onEditorChange() {
            // implement your code
        },
        onEditorStateChange() {
            // implement your code
        },
    }
};
</script>
```

### Method

If you want to more manipulate the Editor, you can use `invoke` method to call the method of tui.editor. For more information of method, see [method of tui.editor](http://nhnent.github.io/tui.editor/api/latest/ToastUIEditor.html).

First, you need to assign `ref` attribute of `<editor/>` and then you can use `invoke` method through `this.$refs` like this:

```html
<template>
    <editor ref="tuiEditor"/>
</template>
<script>
import { Editor } from '@toast-ui/vue-editor'

export default {
    components: {
        'editor': Editor
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

## 📃 Viewer Usage

### Load

* Using Ecmascript module

    ```js
    import 'tui-editor/dist/tui-editor-contents.css';
    import 'highlight.js/styles/github.css';
    import { Viewer } from '@toast-ui/vue-editor'
    ```

* Using Commonjs module

    ```js
    require('tui-editor/dist/tui-editor-contents.css');
    require('highlight.js/styles/github.css'); 
    var toastui = require('@toast-ui/vue-editor');
    var Viewer = toastui.Viewer;
    ```

* Using Single File Component

    ```js
    import 'tui-editor/dist/tui-editor-contents.css';
    import 'highlight.js/styles/github.css';
    import Viewer from '@toast-ui/vue-editor/src/Viewer.vue'
    ```

* Using namespace

    ```js
    var Viewer = toastui.Viewer;
    ```

### Implement

First implement `<viewer/>` in the template.

```html
<template>
    <viewer/>
</template>
```

And then add `Viewer` to the `components` in your component or Vue instance like this:
```js
import { Viewer } from '@toast-ui/vue-editor'

export default {
  components: {
    'viewer': Viewer
  }
}
```
or
```js
import { Viewer } from '@toast-ui/vue-editor'
new Vue({
    el: '#app',
    components: {
        'viewer': Viewer
    }
});
```

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| value | String | '' | This prop can change content of the viewer. |
| height | String | '300px' | This prop can control the height of the editor. |

Example :

``` html
<template>
    <viewer
    :value="viewerText"
    height="500px"
    />
</template>
<script>
import { Viewer } from '@toast-ui/vue-editor'

export default {
    components: {
        'viewer': Viewer
    },
    data() {
        return {
            viewerText: '# This is Viewer.\n Hello World.',
        };
    },
};
</script>
```

### Event

* load : It would be emitted when editor fully load
* change : It would be emitted when content changed
* stateChange : It would be emitted when format change by cursor position
* focus : It would be emitted when editor get focus
* blur : It would be emitted when editor loose focus

Example :

```html
<template>
    <viewer
    @load="onEditorLoad"
    @focus="onEditorFocus"
    @blur="onEditorBlur"
    @change="onEditorChange"
    @stateChange="onEditorStateChange"
    />
</template>

<script>
import { Viewer } from '@toast-ui/vue-editor'

export default {
    components: {
        'viewer': Viewer
    },
    methods: {
        onEditorLoad() {
            // implement your code
        },
        onEditorFocus() {
            // implement your code
        },
        onEditorBlur() {
            // implement your code
        },
        onEditorChange() {
            // implement your code
        },
        onEditorStateChange() {
            // implement your code
        },
    }
};
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

## 💬 Contributing
* [Code of Conduct](https://github.com/nhnent/toast-ui.vue-editor/blob/master/CODE_OF_CONDUCT.md)
* [Contributing guideline](https://github.com/nhnent/toast-ui.vue-editor/blob/master/CONTRIBUTING.md)
* [Commit convention](https://github.com/nhnent/toast-ui.vue-editor/blob/master/docs/COMMIT_MESSAGE_CONVENTION.md)

## 📜 License
This software is licensed under the [MIT](https://github.com/nhnent/toast-ui.vue-editor/blob/master/LICENSE) © [NHN Ent.](https://github.com/nhnent)

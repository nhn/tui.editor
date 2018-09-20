# Getting Started

## 🚩 Table of Contents
* [Install](#-install)
    * [Using npm](#using-npm)
    * [Via Contents Delivery Network (CDN)](#via-contents-delivery-network-cdn)
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

## 📝 Editor Usage

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
    <tui-editor
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
        'tui-editor': Editor
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
    <tui-editor
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
        'tui-editor': Editor
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

## 📃 Viewer Usage

### Load

* Using module

    ```js
    // es modules
    import { EditorViewer } from '@toast-ui/vue-editor'
    // commonjs require
    var ToustUI = require('@toast-ui/vue-editor'); // you can use toastui.EditorViewer
    ```

* Using `<script>`

    ```html
    <script src="path/to/vue-editor.js"></script>
    ```

* Use just Vue wrapper component

    ```js
    import { EditorViewer } from '@toast-ui/vue-editor/src/index'
    ```

### Implement

First implement `<tui-viewer>` in the template.

```html
<template>
    <tui-viewer/>
</template>
```

And then add `EditorViewer` to the `components` in your component or Vue instance like this:
```js
import { EditorViewer } from '@toast-ui/vue-editor'

export default {
  components: {
    'tui-viewer': EditorViewer
  }
}
```
or
```js
import { EditorViewer } from '@toast-ui/vue-editor'
new Vue({
    el: '#app',
    components: {
        'tui-viewer': EditorViewer
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
    <tui-viewer
    :value="viewerText"
    height="500px"
    />
</template>
<script>
import { Editor } from '@toast-ui/vue-editor'

export default {
    components: {
        'tui-viewer': EditorViewer
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
    <tui-viewer
    @load="onEditorLoad"
    @focus="onEditorFocus"
    @blur="onEditorBlur"
    @change="onEditorChange"
    @stateChange="onEditorStateChange"
    />
</template>

<script>
import { EditorViewer } from '@toast-ui/vue-editor'

export default {
    components: {
        'tui-viewer': EditorViewer
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

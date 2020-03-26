# TOAST UI Editor for Vue

> This is [Vue](https://vuejs.org/) component wrapping [TOAST UI Editor](https://github.com/nhn/tui.editor/tree/master/apps/editor).

[![npm version](https://img.shields.io/npm/v/@toast-ui/vue-editor.svg)](https://www.npmjs.com/package/@toast-ui/vue-editor)

## 🚩 Table of Contents

- [Collect Statistics on the Use of Open Source](#collect-statistics-on-the-use-of-open-source)
- [Install](#-install)
- [Editor Usage](#-editor-usage)
- [Viewer Usage](#-viewer-usage)

## Collect Statistics on the Use of Open Source

Vue Wrapper of TOAST UI Editor applies Google Analytics (GA) to collect statistics on the use of open source, in order to identify how widely TOAST UI Editor is used throughout the world. It also serves as important index to determine the future course of projects. location.hostname (e.g. ui.toast.com) is to be collected and the sole purpose is nothing but to measure statistics on the usage. To disable GA, use the following `usageStatistics` options when declare Vue Wrapper compoent.

```js
const options = {
  ...
  usageStatistics: false
}
```

## 💾 Install

### Using npm

```sh
npm install --save @toast-ui/vue-editor
```

## 📝 Editor Usage

### Import

You can use Toast UI Editor for Vue as a ECMAScript module or a CommonJS module. As this module does not contain CSS files, you should import `toastui-editor.css` from `@toast-ui/editor` and `codemirror.css` from `CodeMirror` in the script.

- ES Modules

```js
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/vue-editor';
```

- CommonJS

```js
require('codemirror/lib/codemirror.css');
require('@toast-ui/editor/dist/toastui-editor.css');

const { Editor } = require('@toast-ui/vue-editor');
```

### Creating Component

First implement `<editor/>` in the template.

```html
<template>
  <editor />
</template>
```

And then add `Editor` to the `components` in your component or Vue instance like this:

```js
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/vue-editor';

export default {
  components: {
    editor: Editor
  }
};
```

or

```js
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/vue-editor';

new Vue({
  el: '#app',
  components: {
    editor: Editor
  }
});
```

### Props

| Name            | Type   | Default                    | Description                                               |
| --------------- | ------ | -------------------------- | --------------------------------------------------------- |
| initialValue    | String | ''                         | Editor's initial value       .                             |
| initialEditType | String | 'markdown'                 | Initial editor type (markdown, wysiwyg).                   |
| options         | Object | following `defaultOptions` | Options of tui.editor. This is for initailize tui.editor. |
| height          | String | '300px'                    | This prop can control the height of the editor.           |
| previewStyle          | String | 'vertical'           | Markdown editor's preview style (tab, vertical).           |

```js
const defaultOptions = {
  minHeight: '200px',
  language: 'en-US',
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

```html
<template>
  <editor
    :initialValue="editorText"
    :options="editorOptions"
    height="500px"
    initialEditType="wysiwyg"
    previewStyle="vertical"
  />
</template>
<script>
  import 'codemirror/lib/codemirror.css';
  import '@toast-ui/editor/dist/toastui-editor.css';

  import { Editor } from '@toast-ui/vue-editor';

  export default {
    components: {
      editor: Editor
    },
    data() {
      return {
        editorText: 'This is initialValue.',
        editorOptions: {
          hideModeSwitch: true
        }
      };
    }
  };
</script>
```

### Instance Methods

If you want to more manipulate the Editor, you can use `invoke` method to call the method of toastui.editor. For more information of method, see [instance methods of TOAST UI Editor](https://nhn.github.io/tui.editor/latest/ToastUIEditor#addHook).

First, you need to assign `ref` attribute of `<editor/>` and then you can use `invoke` method through `this.$refs` like this:

```html
<template>
  <editor ref="toastuiEditor" />
</template>
<script>
  import 'codemirror/lib/codemirror.css';
  import '@toast-ui/editor/dist/toastui-editor.css';

  import { Editor } from '@toast-ui/vue-editor';

  export default {
    components: {
      editor: Editor
    },
    methods: {
      scroll() {
        this.$refs.toastuiEditor.invoke('scrollTop', 10);
      },
      moveTop() {
        this.$refs.toastuiEditor.invoke('moveCursorToStart');
      },
      getHtml() {
        let html = this.$refs.toastuiEditor.invoke('getHtml');
      }
    }
  };
</script>
```

### Events

- load : It would be emitted when editor fully load
- change : It would be emitted when content changed
- stateChange : It would be emitted when format change by cursor position
- focus : It would be emitted when editor get focus
- blur : It would be emitted when editor loose focus

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
  import { Editor } from '@toast-ui/vue-editor';

  export default {
    components: {
      editor: Editor
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
      }
    }
  };
</script>
```

## 📃 Viewer Usage

### Import

- ES Modules

```js
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

import { Viewer } from '@toast-ui/vue-editor';
```

- CommonJS

```js
require('@toast-ui/editor/dist/toastui-editor-viewer.css');

const { Viewer } = require('@toast-ui/vue-editor');
```

### Creating Component

First implement `<viewer />` in the template.

```html
<template>
  <viewer />
</template>
```

And then add `Viewer` to the `components` in your component or Vue instance like this:

```js
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

import { Viewer } from '@toast-ui/vue-editor';

export default {
  components: {
    viewer: Viewer
  }
};
```

or

```js
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

import { Viewer } from '@toast-ui/vue-editor';

new Vue({
  el: '#app',
  components: {
    viewer: Viewer
  }
});
```

### Props

| Name         | Type   | Default | Description                                     |
| ------------ | ------ | ------- | ----------------------------------------------- |
| initialValue | String | ''      | Viewer's initial value                          |
| height       | String | '300px' | This prop can control the height of the viewer. |

```html
<template>
  <viewer :initialValue="viewerText" height="500px" />
</template>
<script>
  import '@toast-ui/editor/dist/toastui-editor-viewer.css';

  import { Viewer } from '@toast-ui/vue-editor';

  export default {
    components: {
      viewer: Viewer
    },
    data() {
      return {
        viewerText: '# This is Viewer.\n Hello World.'
      };
    }
  };
</script>
```

### Events

- load : It would be emitted when editor fully load
- change : It would be emitted when content changed
- stateChange : It would be emitted when format change by cursor position
- focus : It would be emitted when editor get focus
- blur : It would be emitted when editor loose focus

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
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

import { Viewer } from '@toast-ui/vue-editor';

export default {
    components: {
        viewer: Viewer
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

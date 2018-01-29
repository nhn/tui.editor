# Getting Started

## Install
```sh
npm install --save tui-editor
```

## Editor
### HTML
Place a `<div></div>` where you want TOAST UI Editor to render.
```html
<body>
...
<div id="editSection"></div>
...
</body>
```

### javascript
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

### options
* **height**: Height in string or auto ex) `300px` | `auto`
* **initialValue**: Initial value. Set Markdown string
* **initialEditType**: Initial type to show `markdown` | `wysiwyg`
* **previewType**: Preview style of Markdown mode `tab` | `vertical`

Find out more options [here](https://nhnent.github.io/tui.editor/api/latest/ToastUIEditor.html#ToastUIEditor)

## Viewer
**TOAST UI Editor** provides a **Viewer** in case you want to show *Markdown* content without loading the editor. The **Viewer** is much **lighter** than the editor.

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
Be careful not to load both the editor and the viewer at the same time because the editor already contains the viewer function, you can initialize editor [Editor.factory()]()(https://nhnent.github.io/tui.editor/api/latest/ToastUIEditor.html#.factory) and set the `viewer` option to value `true` in order to make the editor a viewer. You can also call [getHTML()]()(https://nhnent.github.io/tui.editor/api/latest/ToastUIEditor.html#getHtml) to render the HTML.

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

**TOAST UI Editor** respects *CommonMark* and *GFM*. So any *Markdown* renderer including [markdownit](https://github.com/markdown-it/markdown-it) can handle the content made using TOAST UI Editor. You can also use any of these renderer in place of TOAST UI Editor **Viewer**.

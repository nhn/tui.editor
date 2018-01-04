# Getting started with bower

## Install
```sh
bower install --save tui-editor
```

## Editor
### Dependencies
TOAST UI Editor requires jquery, codemirror, squire-rte, markdownit, toMark, highlightjs and tui-code-snippet as dependencies to work.
```html
<head>
...
<script src="../bower_components/jquery/dist/jquery.js"></script>
<script src='../bower_components/markdown-it/dist/markdown-it.js'></script>
<script src="../bower_components/toMark/dist/toMark.js"></script>
<script src="../bower_components/tui-code-snippet/dist/tui-code-snippet.js"></script>
<script src="../bower_components/codemirror/lib/codemirror.js"></script>
<script src="../bower_components/highlightjs/highlight.pack.js"></script>
<script src="../bower_components/squire-rte/build/squire-raw.js"></script>
<script src="../bower_components/tui-editor/dist/tui-editor-Editor.js"></script>
<link rel="stylesheet" href="../bower_components/codemirror/lib/codemirror.css">
<link rel="stylesheet" href="../bower_components/highlightjs/styles/github.css">
<link rel="stylesheet" href="../bower_components/tui-editor/dist/tui-editor.css">
<link rel="stylesheet" href="../bower_components/tui-editor/dist/tui-editor-contents.css">
...
</head>
```

### HTML
Place a `<div></div>` where you want TOAST UI Editor rendered.
```html
<body>
...
<div id="editSection"></div>
...
</body>
```

### javascript
Initialize editor with options you want. Find out more options in [here](https://nhnent.github.io/tui.editor/api/latest/ToastUIEditor.html#ToastUIEditor)
```javascript
  var editor = new tui.Editor({
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
* **height**: editor's height. px in string or auto ex) `300px` | `auto`
* **initialValue**: editor's initial value.
* **initialEditType**: initial editor type `markdown` | `wysiwyg`
* **previewType**: markdown editor's preview style `tab` | `vertical`

Find out more options [here](https://nhnent.github.io/tui.editor/api/latest/ToastUIEditor.html#ToastUIEditor)

## Viewer
TOAST UI Editor provides a viewer in case you want to show *markdown* content without loading the editor. The viewer has much lighter than the editor.

```javascript
var editor = new tui.Editor({
    el: document.querySelector('#viewerSection'),
    height: '500px',
    initialValue: '# content to be rendered'
});
...
```

Be careful not to load both the editor and the viewer. Since the editor already includes the viewer function, you can initialize editor calling [Editor.factory()]() with `viewer` option `true` value to make the editor a viewer. You can also call [getHTML()]() to get rendered HTML.

```javascript
var editor = tui.Editor.factory({
    el: document.querySelector('#viewerSection'),
    viewer: true,
    height: '500px',
    initialValue: '# content to be rendered'
});
...
```

TOAST UI Editor respects *CommonMark* and *GFM*. So any *markdown* renderer including [markdownit](https://github.com/markdown-it/markdown-it) can handle the content TOAST UI Editor made. You can use any of those renderer beside TOAST UI Editor Viewer if you want.

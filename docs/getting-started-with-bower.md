# Getting started with bower

## Install
```sh
bower install --save tui-editor
```

## Editor
### Dependencies
TOAST UI Editor requires jquery, codemirror, squire-rte, markdownit, toMark, highlightjs and tui-code-snippet.
So these dependencies are included beforehand.
```html
<head>
...
<script src="../bower_components/jquery/dist/jquery.js"></script>
<script src='../bower_components/markdown-it/dist/markdown-it.js'></script>
<script src="../bower_components/to-mark/dist/to-mark.js"></script>
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
Place a `<div></div>` where you want TOAST UI Editor to render.
```html
<body>
...
<div id="editSection"></div>
...
</body>
```

### javascript
Initialize editor with required options. Find out more options [here](https://nhnent.github.io/tui.editor/api/latest/ToastUIEditor.html#ToastUIEditor)
```javascript
  var editor = new tui.Editor({
    el: document.querySelector('#editSection'),
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    height: '300px'
  });
```
or you can directly use jquery plugin.
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
TOAST UI Editor provides a viewer in case you want to show the content of the *markdown* without loading the editor. The viewer is much lighter than the editor.

```javascript
var editor = new tui.Editor({
    el: document.querySelector('#viewerSection'),
    height: '500px',
    initialValue: '# content to be rendered'
});
...
```

Be careful not to load both the editor and the viewer at the same time because the editor already contains the viewer function, you can initialize editor [Editor.factory()]()(https://nhnent.github.io/tui.editor/api/latest/ToastUIEditor.html#.factory) and set the `viewer` option to value `true` in order to make the editor a viewer. You can also call [getHTML()]()(https://nhnent.github.io/tui.editor/api/latest/ToastUIEditor.html#getHtml) to render the HTML.


```javascript
var editor = tui.Editor.factory({
    el: document.querySelector('#viewerSection'),
    viewer: true,
    height: '500px',
    initialValue: '# content to be rendered'
});
...
```

**TOAST UI Editor** respects *CommonMark* and *GFM*. So any *Markdown* renderer including [markdownit](https://github.com/markdown-it/markdown-it) can handle the content made using TOAST UI Editor. You can also use any of these renderer in place of TOAST UI Editor **Viewer**.

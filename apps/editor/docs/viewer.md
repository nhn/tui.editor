# 👀 Viewer

## What Is Viewer?

TOAST UI Editor (henceforth referred to as 'Editor') provides the **viewer** in case you want to show _Markdown_ content without loading the Editor. The Viewer is much **lighter** than the Editor.

## Creating Viewer

The method of creating the Viewer is similar to that of the Editor.

> Ref. [Getting Started](https://github.com/nhn/tui.editor/blob/master/apps/editor/docs/getting-started.md)

### Adding Wrapper Element

You need to add the container element where the Viewer will be created.

```html
...
<body>
  <div id="viewer"></div>
</body>
...
```

### Importing Viewer's Constructor Function

The Viewer can be used by creating an instance with the constructor function. To get the constructor function, you should import the module using one of the following ways depending on your environment.

#### Using Module Format in Node Environment

- ES6 Modules

```javascript
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
```

- CommonJS

```javascript
const Viewer = require('@toast-ui/dist/toastui-editor-viewer');
```

#### Using Namespace in Browser Environment

```javascript
const Viewer = toastui.Editor;
```

Note that the CDN file of the Viewer should use the following:

```html
...
<body>
  ...
  <script src="https://uicdn.toast.com/editor/latest/toastui-editor-viewer.js"></script>
</body>
...
```

### Adding CSS Files

You need to add the CSS files needed for the Viewer. Import CSS files in node environment, and add it to html file when using CDN.

#### Using in Node Environment

- ES6 Modules

```javascript
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
```

- CommonJS

```javascript
require('@toast-ui/editor/dist/toastui-editor-viewer.css');
```

#### Using in Browser Environment by CDN

```html
...
<head>
  ...
  <link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor-viewer.min.css" />
</head>
...
```

### Creating Instance

You can create an instance with options and call various API after creating an instance.

```js
const viewer = new Viewer({
  el: document.querySelector('#viewer'),
  height: '600px',
  initialValue: '# hello'
});

viewer.getHtml();
```

![viewer-01](https://user-images.githubusercontent.com/18183560/76773017-268a7000-67e5-11ea-8546-077a7f841791.png)

The basic options available are:

- `height`: Height in string or auto ex) `300px` | `auto`
- `initialValue`: Initial value. Set Markdown string

Find out more options [here](https://nhn.github.io/tui.editor/latest/ToastUIEditorViewer).

## Another Way to Create Viewer

Be careful not to load both an editor and a viewer at the same time because an editor already contains a viewer function, you can initialize with `Editor.factory()` of an editor and set the `viewer` option to value `true` in order to make the a viewer. You can also call `getHtml()` to render the HTML.

```js
import Editor from '@toast-ui/editor';

const viewer = Editor.factory({
  el: document.querySelector('#viewer'),
  viewer: true,
  height: '500px',
  initialValue: '# hello'
});

viewer.getHtml();
```

## Example

You can see the example [here](https://nhn.github.io/tui.editor/latest/tutorial-example04-viewer).

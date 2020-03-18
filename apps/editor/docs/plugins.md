# 🧩 Plugins

## What Is Plugin?

TOAST UI Editor (henceforth referred to as 'Editor') provides a plugin. Plugin is an extension that can be added as needed. There are a total of 5 plugins provided by the Editor.

| Plugin Name                                                                                            | Package Name                                                                                                                   | Description                     |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| [`chart`](https://github.com/nhn/tui.editor/tree/master/plugins/chart)                                 | [`@toast-ui/editor-plugin-chart`](https://www.npmjs.com/package/@toast-ui/editor-plugin-chart)                                 | Plugin to render chart          |
| [`code-syntax-highlight`](https://github.com/nhn/tui.editor/tree/master/plugins/code-syntax-highlight) | [`@toast-ui/editor-plugin-code-syntax-highlight`](https://www.npmjs.com/package/@toast-ui/editor-plugin-code-syntax-highlight) | Plugin to highlight code syntax |
| [`plugin-color-syntax`](https://github.com/nhn/tui.editor/tree/master/plugins/color-syntax)            | [`@toast-ui/editor-plugin-color-syntax`](https://www.npmjs.com/package/@toast-ui/editor-plugin-color-syntax)                   | Plugin to color editing text    |
| [`table-merged-cell`](https://github.com/nhn/tui.editor/tree/master/plugins/table-merged-cell)         | [`@toast-ui/editor-plugin-table-merged-cell`](https://www.npmjs.com/package/@toast-ui/editor-plugin-table-merged-cell)         | Plugin to merge table columns   |
| [`uml`](https://github.com/nhn/tui.editor/tree/master/plugins/uml)                                     | [`@toast-ui/editor-plugin-uml`](https://www.npmjs.com/package/@toast-ui/editor-plugin-uml)                                     | Plugin to render UML            |

## How to Use Plugin

To use the plugin, you must first have [TOAST UI Editor](https://github.com/nhn/tui.editor/tree/master/apps/editor) installed.

> Ref. [Getting Started](https://github.com/nhn/tui.editor/blob/master/apps/editor/docs/getting-started.md)

### Install

Each plugin can be installed and used with npm, or it can be used as provided CDN files.

### Via Package Manager (npm)

You can install each plugin using the command, and add the name of the plugin you want to install to `${pluginName}` below. For example, if you install the `chart` plugin, install it as`npm install @toast-ui/editor-plugin-chart`.

```sh
$ npm install --save @toast-ui/editor-plugin-${pluginName} # Latest Version
$ npm install --save @toast-ui/editor-plugin-${pluginName}@<version> # Specific Version
```

When installed and used with npm, the list of files that can be imported is as follows:

```
- node_modules/
   ├─ @toast-ui/editor-plugin-${pluginName}
   │     ├─ dist/
   │     │    ├─ toastui-editor-plugin-${pluginName}.js
   │     │    ├─ ...
```

### Via Contents Delivery Network (CDN)

Each plugin is available over the CDN powered by [TOAST Cloud](https://www.toast.com). You can use the CDN as below.

```html
...
<body>
  ...
  <script src="https://uicdn.toast.com/editor/latest/toastui-editor-plugin-${pluginName}.min.js"></script>
</body>
...
```

If you want to use a specific version, use the tag name instead of `latest` in the url's path.

The CDN directory has the following structure:

```
- uicdn.toast.com/
   ├─ editor-plugin-${pluginName}/
   │     ├─ latest/
   │     │    ├─ toastui-editor-plugin-${pluginName}.js
   │     │    └─ ...
   │     ├─ 1.0.0/
   │     │    └─ ...
```

> Note: Each plugin's CDN file contains all dependencies depending on the situation, or provides different types of bundled files. For more information, please check the each plugin repository.

### Importing Plugin

To activate the plugin, you need to import the plugin. You should import the module using one of the following ways depending on your environment.

#### Using Module Format in Node Environment

- ES6 Modules

```javascript
import pluginFn from '@toast-ui/editor-plugin-${pluginName}';
```

- CommonJS

```javascript
const pluginFn = require('@toast-ui/editor-plugin-${pluginName}');
```

After importing the plugin, use the plugin function exported from the plugin. For example, the `chart` plugin imports as follows:

```javascript
import chart from '@toast-ui/editor-plugin-chart';
```

#### Using Namespace in Browser Environment

```javascript
const pluginFn = toastui.Editor.plugin[${pluginName}];
```

When importing the plugin into the namespace, use the plugin's namespace registered under `toastui.Editor.plugin`. For example, the `chart` plugin imports as follows:

```javascript
const { chart } = toastui.Editor.plugin;
```

### Using the Plugin in Editor

To use a plugin imported from the Editor, use an editor's `plugins` option. You can add each plugin function you imported to this option. The type of `plugins` option is `Array.<function>`.

```javascript
const editor = new Editor({
  // ...
  plugins: [plugin]
});
```

For example, if you add the `chart` and `uml` plugin, you can do something like this:

#### Using Module Format in Node Environment

```javascript
import Editor from '@toast-ui/editor';
import chart from '@toast-ui/editor-plugin-chart';
import uml from '@toast-ui/editor-plugin-uml';

const editor = new Editor({
  // ...
  plugins: [chart, uml]
});
```

#### Using Namespace in Browser Environment

```javascript
const { Editor } = toastui;
const { chart, uml } = Editor.plugin;

const editor = new Editor({
  // ...
  plugins: [chart, uml]
});
```

If you need an option to use in a plugin function, you can add an array value of the `plugins` option as a tuple.

```js
const pluginOptions = {
  // ...
};

const editor = new Editor({
  // ...
  plugins: [[plugin, pluginOptions]]
});
```

## Creating the User Plugin

In addition to the plugins provided by default, users can create and use plugin functions themselves.
The method is very easy.

First, define a user plugin function.

```js
function customPlugin() {
  // ...
}
```

As with other plugins, add custom plugin functions defined through an editor's `plugins` option.

```js
const editor = new Editor({
  // ...
  plugins: [customPlugin]
});
```

The following is an example of creating the plugin that plays a YouTube video using the code block in the Editor. The `youtubePlugin` function is the user's plugin.

````javascript
// Step 1: Define the user plugin function
function youtubePlugin() {
  Editor.codeBlockManager.setReplacer('youtube', youtubeId => {
    // Indentify multiple code blocks
    const wrapperId = `yt${Math.random()
      .toString(36)
      .substr(2, 10)}`;

    // Avoid sanitizing iframe tag
    setTimeout(renderYoutube.bind(null, wrapperId, youtubeId), 0);

    return `<div id="${wrapperId}"></div>`;
  });
}

function renderYoutube(wrapperId, youtubeId) {
  const el = document.querySelector(`#${wrapperId}`);

  el.innerHTML = `<iframe width="420" height="315" src="https://www.youtube.com/embed/${youtubeId}"></iframe>`;
}

const content = ['```youtube', 'XyenY12fzAk', '```'].join('\n');

const editor = new Editor({
  el: document.querySelector('#editor'),
  previewStyle: 'vertical',
  height: '500px',
  initialValue: content,
  // Step 2: Set the defined plugin function as an option value
  plugins: [youtubePlugin]
});
````

## Example

You can see examples of the plugin usage in the link below.

- [Using all plugins in the Editor](https://nhn.github.io/tui.editor/latest/tutorial-example15-editor-with-all-plugins)
- [Using all plugins in the Viewer](https://nhn.github.io/tui.editor/latest/tutorial-example16-viewer-with-all-plugins)
- [Creating the user's plugin](https://nhn.github.io/tui.editor/latest/tutorial-example17-creating-plugin)

```

```

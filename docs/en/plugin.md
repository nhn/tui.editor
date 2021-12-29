# 🧩 Plugins

## What Is Plugin?

TOAST UI Editor (henceforth referred to as 'Editor') provides a plugin. Plugin is an extension that can be added as needed. There are a total of 5 plugins provided by the Editor.

| Plugin Name | Package Name | Description |
| --- | --- | --- |
| [`chart`](https://github.com/nhn/tui.editor/tree/master/plugins/chart) | [`@toast-ui/editor-plugin-chart`](https://www.npmjs.com/package/@toast-ui/editor-plugin-chart) | Plugin to render chart |
| [`code-syntax-highlight`](https://github.com/nhn/tui.editor/tree/master/plugins/code-syntax-highlight) | [`@toast-ui/editor-plugin-code-syntax-highlight`](https://www.npmjs.com/package/@toast-ui/editor-plugin-code-syntax-highlight) | Plugin to highlight code syntax |
| [`color-syntax`](https://github.com/nhn/tui.editor/tree/master/plugins/color-syntax) | [`@toast-ui/editor-plugin-color-syntax`](https://www.npmjs.com/package/@toast-ui/editor-plugin-color-syntax) | Plugin to color editing text |
| [`table-merged-cell`](https://github.com/nhn/tui.editor/tree/master/plugins/table-merged-cell) | [`@toast-ui/editor-plugin-table-merged-cell`](https://www.npmjs.com/package/@toast-ui/editor-plugin-table-merged-cell) | Plugin to merge table cells |
| [`uml`](https://github.com/nhn/tui.editor/tree/master/plugins/uml) | [`@toast-ui/editor-plugin-uml`](https://www.npmjs.com/package/@toast-ui/editor-plugin-uml) | Plugin to render UML |

## How to Use Plugin

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

Installed plugins can be imported as shown below depending on the environment.

- ES Module

```js
import pluginFn from '@toast-ui/editor-plugin-${pluginName}';
```

- CommonJS

```js
const pluginFn = require('@toast-ui/editor-plugin-${pluginName}');
```

For example, `chart` plugin can be imported as follows:

```js
import chart from '@toast-ui/editor-plugin-chart';
```
### Via Contents Delivery Network (CDN)

Each plugin is available over the CDN powered by [NHN Cloud](https://www.toast.com). 

```html
...
<body>
  ...
  <script src="https://uicdn.toast.com/editor-plugin-${pluginName}/latest/toastui-editor-plugin-${pluginName}.min.js"></script>
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
   │     ├─ 3.0.0/
   │     │    └─ ...
```

> Note: Each plugin's CDN file contains all dependencies depending on the situation, or provides different types of bundled files. For more information, please check the each plugin repository.

When importing the plugin into the namespace, use the plugin's namespace registered under `toastui.Editor.plugin`.

```js
const pluginFn = toastui.Editor.plugin[${pluginName}];
```

For example, the `chart` plugin imports as follows:

```js
const { chart } = toastui.Editor.plugin;
```

### Using the Plugin in Editor

To use a plugin imported from the Editor, use an editor's `plugins` option. You can add each plugin function you imported to this option. The type of `plugins` option is `Array.<function>`.

```js
const editor = new Editor({
  // ...
  plugins: [plugin]
});
```

For example, if you add the `chart` and `uml` plugin, you can do something like this:

- ES Module

```js
import Editor from '@toast-ui/editor';
import chart from '@toast-ui/editor-plugin-chart';
import uml from '@toast-ui/editor-plugin-uml';

const editor = new Editor({
  // ...
  plugins: [chart, uml]
});
```

- CDN

```js
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

It defines the plugin function as shown below to return objects having specified properties.


```ts
interface PluginInfo {
  toHTMLRenderers?: HTMLConvertorMap;
  toMarkdownRenderers?: ToMdConvertorMap;
  markdownPlugins?: PluginProp[];
  wysiwygPlugins?: PluginProp[];
  wysiwygNodeViews?: NodeViewPropMap;
  markdownCommands?: PluginCommandMap;
  wysiwygCommands?: PluginCommandMap;
  toolbarItems?: PluginToolbarItem[];
}

const pluginResult: PluginInfo = {
  // ...
}

function customPlugin() {
  // ...
  return pluginResult;
}
```

Like other plugins, it can be used by adding plugin functions defined through the `plugins` option.

```js
const editor = new Editor({
  // ...
  plugins: [customPlugin]
});
```

### Plugin Return Object

Let's find out the properties of the objects returned by the plugin. There are a total of 8 properties, as shown below, and user can define only the desired properties for customization.


```ts
interface PluginInfo {
  toHTMLRenderers?: HTMLConvertorMap;
  toMarkdownRenderers?: ToMdConvertorMap;
  markdownCommands?: PluginCommandMap;
  wysiwygCommands?: PluginCommandMap;
  toolbarItems?: PluginToolbarItem[];
  markdownPlugins?: PluginProp[];
  wysiwygPlugins?: PluginProp[];
  wysiwygNodeViews?: NodeViewPropMap;
}
```

#### toHTMLRenderers

`toHTMLRenderers` object can change the rendering results of elements when rendered in the Markdown Preview or when converted from Markdown Editor to WYSIWYG Editor. It is same as the [customHTMLRenderer](https://github.com/nhn/tui.editor/blob/master/docs/en/custom-html-renderer.md) option in the editor.

**toMarkdownRenderers**

`toMarkdownRenderers` object can override markdown text that is converted from WYSIWYG editor to Markdown editor. The function defined in `toMarkdownRenderers` object has 2 parameters: `nodeInfo` and `context`.

* `nodeInfo`: WYSIWYG node information when converting from WYSIWYG editor to Markdown editor.
  * `node`: The information about the target node.
  * `parent`: The parent node information of the target node.
  * `index`: The index as child.
* `context`: The information needed for converting except `nodeInfo`.
  * `entering`: This can be seen whether it is a first visit to that node or if it is a visit after traversing all of the child nodes.
  * `origin`: The function that executes the operation of an original converting function.

The function defined in `toMarkdownRenderers` returns the token information needed to convert the result to markdown text.

```ts
interface ToMdConvertorReturnValues {
  delim?: string | string[];
  rawHTML?: string | string[] | null;
  text?: string;
  attrs?: Attrs;
}
```

* `delim`: Defines symbols to be used in markdown text. It is used when it can be converted to multiple symbols, such as `*` and `-` on a list of markdown bullet list.
* `rawHTML`: This text is required when converting a node to an HTML node (HTML text) in Markdown.
* `text`: Text to be shown in Markdown.
* `attrs`: Properties to use when converting a node to markdown text. For example, whether the task list is checked or not, or the url of the image node.

**Example**
```ts
return {
  toHTMLRenderers: {
    // ...
    tableCell(node: MergedTableCellMdNode, { entering, origin }) {
      const result = origin!();

      // ...
      
      return result;
    },
  },
  toMarkdownRenderers: {
    // ...
    tableHead(nodeInfo) {
      const row = (nodeInfo.node as ProsemirrorNode).firstChild;

      let delim = '';

      if (row) {
        row.forEach(({ textContent, attrs }) => {
          const headDelim = createTableHeadDelim(textContent, attrs.align);

          delim += `| ${headDelim} `;

          // ...
        });
      }
      return { delim };
    },
  },
};
```

The code above is an example of a merge table cell plugin. The return result of `tableCell` node defined in `toHTMLRenderers` is used for converting to Markdown Preview and WYSIWYG Editor, while result of `tableHead` nodes defined in `toMarkdownRenderers` are used for converting to Markdown Editor.

![image](https://user-images.githubusercontent.com/37766175/121026660-4c80a380-c7e1-11eb-9d36-65425b6944da.gif)

#### markdownCommands, wysiwygCommands

Plugin allows adding of markdown and WYSIWYG commands using `markdownCommands` and `wysiwygCommands` options.

Each command function has 3 parameters: `payload`, `state`, and `dispatch`, which can be used to control the internal operation of the editor based on [Prosemirror](https://prosemirror.net/).

* `payload`: This is a `payload` that is needed to execute commands.
* `state`: An instance indicating the editor's internal state, which is the same as [prosemirror-state](https://prosemirror.net/docs/ref/#state).
* `dispatch`: If you want to change the contents of an editor through command execution, you have to run the `dispatch` function. It is same as [dispatch](https://prosemirror.net/docs/ref/#view.EditorView.dispatch) function of Prosemirror.

If a change occurs in the editor's content by executing a command function, it must return `true`. In the opposite case, `false` must be returned.

```js
return {
  markdownCommands: {
    myCommand: (payload, state, dispatch) => {
      // ...
      return true;
    },
  },
  wysiwygCommands: {
    myCommand: (payload, state, dispatch) => {
      // ...
      return true;
    },
  },
};
```

If you define and return a command function in a plugin, as shown in the example code above, that command can be used in the editor.

#### toolbarItems

You can also register an editor's toolbar item from the plugin.

```js
return {
  // ...
  toolbarItems: [
    {
      groupIndex: 0,
      itemIndex: 3,
      item: toolbarItem,
    },
  ],
};
```

Like the code above, you can set which items to add to the `toolbarItems` array. Each option object has 3 properties: `groupIndex`, `itemIndex`, and item`.

* `groupIndex`: Toolbar group index to add toolbar item.
* `itemIndex`: Toolbar item index in group.
* `item`: Toolbar Item. It is the same form as the object used in [toolbar customization](https://github.com/nhn/tui.editor/blob/master/docs/en/toolbar.md).

If the `toolbarItems` option is set, as in the example code, the toolbar item will be added as the fourth index of the first toolbar group.

#### markdownPlugins, wysiwygPlugins

The editor use Prosemirror internally. Prosemirror provides its own plugin system. These Prosemirror plugins can also be defined in order to control out editor's internal state. In most cases, these options are not necessary, but are often necessary. For example, code syntax highlighting plugin are used to highlight code displayed in the WYSIWYGs editor `codeBlock`.

```js
return {
  wysiwygPlugins: [() => codeSyntaxHighlighting(context, prism)],
};
```

The method of using this option object is the same as the plugin definition method in Prosemirror, so see [here] (https://prosemirror.net/docs/ref/#state.Plugin).

#### wysiwygNodeViews

Markdown Editor's contents is plain text, but WYSIWYG Editor's content consists of specific nodes. These nodes can be customized to add attribute or class using the `customHTMLRenderer` option. However, there is a limit to `customHTMLRenderer` option if you want to control something by adding event handker or having more complex interactions. In this case, the plugin's `wysiwygNodeViews` option allows customization of nodes that are rendered in the WYSIWYG Editor.
This option will also be unnecessary in most cases. Like the `wysiwygPlugins` property, the `wysiwygNodeViews` property is also used in code syntax highlighting plugin.

```js
return {
  wysiwygNodeViews: {
    codeBlock: createCodeSyntaxHighlightView(registerdlanguages),
  },
};
```

The method of using this option object is the same as the `nodeView` definition method in Prosemirror, so see [here] (https://prosemirror.net/docs/ref/#view.NodeView).

### 'context' parameter of plugin function
Plugin functions can use some information with `context` parameters to define the various properties described above. The `context` parameter contains the following properties.

* `eventEmitter`: It is the same as `eventEmitter` in an editor. It is used to communicate with the editor.
* `usageStatistics`: It decides whether to collect the plugin as GA for `@toast-ui/editor`.
* `i18n`: It is an instance for adding i18n.
* `pmState`: Some modules of [prosmirror-state] (https://prosemirror.net/docs/ref/#state).
* `pmView`: Some modules of [prosemirror-view](https://prosemirror.net/docs/ref/#view).
* `pmModel`: Some modules of [prosemirror-model](https://prosemirror.net/docs/ref/#model).

## Example

Examples can be found [here](https://nhn.github.io/tui.editor/latest/tutorial-example13-creating-plugin) and in the [plugin package](https://github.com/nhn/tui.editor/tree/master/plugins).

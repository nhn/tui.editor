# 📱 Widget Node

When you type a specific key in the editor, you can display a suggestion popup, or a link node as a specific widget node. The TOAST UI Editor (henceforth referred to as 'Editor') provides options and APIs for this feature.

## Popup Widget

When editing content in the editor, you may want to show the suggestion popup at the current cursor position. At this time, the `addWidget` API can be used to float the DOM node that is desired on the editor. This node does not affect other contents being edited, and is **temporarily added**. In other words, if you enter text or change focus, it disappears. The API signature is as follows.

```ts
addWidget(node: Node, style: WidgetStyle, pos?: EditorPos)
```

| Parameter | Type | Description |
| --- | --- | --- |
| `node` | Node | DOM node to be added as widget | 
| `style` | 'top' \| 'bottom' | Determines whether to add widget above or below the specified position. | 
| `pos` | EditorPos | Set where the widget will be added. This is optional value, if not set, adds widget to the current cursor position. | 

```js
const popup = document.createElement('ul');
// ...

editor.addWidget(popup, 'top');
```

When the above code is executed, a `popup` node is added as shown below.

![image](https://user-images.githubusercontent.com/37766175/120617182-d6a0d300-c494-11eb-8fb9-58926c60e8b7.png)

If you want to show the widget when typing the specific key, `keyup` event is useful.

```js
editor.on('keyup', (editorType, ev) => {
  if (ev.key === '@') {
    const popup = document.createElement('ul');
    // ...
  
    editor.addWidget(popup, 'top');
  }
})
```

### Inline Widget Node

We looked at how to temporarily add popup widget node depending on specific case. Then what can you do if you want to add a mention node by clicking on a specific item in the popup widget?
Because Markdown Editor is a text-based editor, such mention node cannot be added. In addition, WYSIWYG editor does not support the mention node internally as well, so it cannot be added.
The editor provides a `widgetRules` option for users who want to add *inline widget node* such as mention node. If the text conforms to the rules set for the `widgetRules` option, the node is rendered as an inline widget node in the editor. **Inline widget node is inserted into the editor as content unlike popup widget, affecting the position of other nodes**.

```js
const reWidgetRule = /\[(@\S+)\]\((\S+)\)/;

const editor = new Editor({
  el: document.querySelector('#editor'),
  widgetRules: [
    {
      rule: reWidgetRule,
      toDOM(text) {
        const rule = reWidgetRule;
        const matched = text.match(rule);
        const span = document.createElement('span');
  
        span.innerHTML = `<a class="widget-anchor" href="${matched[2]}">${matched[1]}</a>`;
        return span;
      },
    },
  ],
});
```

As shown in the example code, `widgetRules` has each rule in an array format, and each rule consists of `rule` and `toDOM` properties.

* `rule`: The value should be the regular expression, and the text that matches this regular expression is replaced with a widget node and rendered.
* `toDOM`: Defines the DOM node of the widget node to be rendered.

When text matches to the rules of `widgetRules` is entered, it is replaced by an inline widget node as shown in the image below.

![image](https://user-images.githubusercontent.com/37766175/120621226-a6f3ca00-c498-11eb-9355-0275fd3bdbdb.gif)

### `insertText()`, `replaceSelection()` API

You can replace it with an inline widget node by typing text that matches the widget rules directly, but most of the time you want to insert an inline widget node, such as a mention node, by clicking on a specific item in a popup widget.

In such cases, `inserText()` and `replaceSelection()` APIs can be used to insert an inline widget node when an item in a popup widget is clicked.

```js
ul.addEventListener('mousedown', (ev) => {
  const text = ev.target.textContent.replace(/\s/g, '').replace(/😎/g, '');
  const [start, end] = editor.getSelection();

  editor.replaceSelection(`[@${text}](${text})`, [start[0], start[1] - 1], end);
});
```

In the example code, the position calculated based on the current cursor position through `getSelection()` API was passed to `replaceSelection()` API because `@` character should be replaced with widget node. As a result, you can see the `@` character replaced by an inline widget node when you click an item in the popup widget as shown in the image below.

![image](https://user-images.githubusercontent.com/37766175/120624280-81b48b00-c49b-11eb-9896-432120c27389.gif)

# Custom Markdown Renderer

The TOAST UI Editor (henceforth referred to as 'Editor') provides a way to customize the final Markdown contents. 

This is useful for converting initial WYSIWYG content into markdown. They WYSIWYG gets converted into the internal AST, which then uses this markdown rendering to produce the final markdown string.

## Basic Usage

The Editor accepts the `customMarkdownRenderer` option, which is a key-value object. The keys of the object are types of node of the AST, and the values are convertor functions to be used for converting a node to string that will be used in the final markdown. 

The following code is a basic example of using `customMarkdownRenderer` option.

```js
const editor = new Editor({
  el: container,
  initialEditType: 'wysiwyg',
  customMarkdownRenderer: {
    TEXT_NODE(node) {
      return `${node.nodeValue}!`;
    }
  }
});
```

If we set the following wysiwyg content,

```html
Hello World
```

The final markdown content will be

```markdown
Hello World!
```

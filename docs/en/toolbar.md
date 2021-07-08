# 🛠 Toolbar

Typically, the editor can use shortcuts or toolbar to enter specific text or nodes. In particular, in WYSIWYG editors, where no specific textual syntax exists, the role of the toolbar is important because most of the operation are done through the toolbar. The TOAST UI Editor (henceforth referred to as 'Editor') also provides a toolbar as the default UI, as well as options and APIs for customization.

## Toolbar Option
The editor provides a total of 16 toolbar items, including bold, italic, and strike. Unless otherwise specified, the default toolbar option is shown below.

```js
const options = {
  // ...
  toolbarItems: [
    ['heading', 'bold', 'italic', 'strike'],
    ['hr', 'quote'],
    ['ul', 'ol', 'task', 'indent', 'outdent'],
    ['table', 'image', 'link'],
    ['code', 'codeblock'],
    ['scrollSync'],
  ],
}
```

As you can see in the example code, the toolbar option in the editor is defined in 2D array format. First, each toolbar group is defined as an array, and the toolbar items within the group are designated as items of the array. Each item is rendered in a group in the order in which it is defined, and the toolbar group is rendered separated by the `|` symbol.

![image](https://user-images.githubusercontent.com/37766175/120914229-a137f780-c6d7-11eb-8112-b14a48f8374f.png)

If you want to change the configuration of the default toolbar, you can change it by setting the `toolbarItems` option.

```js
const editor = new Editor({
  el: document.querySelector('#editor'),
  toolbarItems: [
    ['heading', 'bold'],
    ['ul', 'ol', 'task'],
    ['code', 'codeblock'],
  ],
});
```

The above example code is executed as shown below.

![image](https://user-images.githubusercontent.com/37766175/120914344-a47fb300-c6d8-11eb-85cd-857047e8e220.png)

## Toolbar Button Customizing
The example seen above is actually just a combination of the basic toolbar items. Then what should user do if they  want to create and add a toolbar button? In this case, two main types of options can be customized.

### Button Element Customizing
First, there is a way to customize the toolbar button UI provided by the editor. This method is that overriding only the icon, tooltip, or popup operation of the button embedded in the editor. This option consists of the following interfaces:

| Name | Type | Description |
| --- | --- | --- |
| `name` | string | A unique name for the toolbar item and must be specified as required. | 
| `tooltip` | string | Optional value, which defines the tooltip text to show when mouse is over on the toolbar item. | 
| `text` | string | Optional value, define if the toolbar button element has text to show. | 
| `className` | string | Optional value, defines the class to be applied to the toolbar item. | 
| `style` | Object | Optional value, defines the style to be applied to the toolbar item. | 
| `command` | string | Optional value, defines the command you want to execute when you click the toolbar button. It has an exclusive relationship with `popup` option. | 
| `popup` | PopupOptions | Optional value, defines if you want to show the popup when you click the toolbar button. This is an exclusive relationship with the `command` option.. | 

```js
const editor = new Editor({
  el: document.querySelector('#editor'),
  toolbarItems: [
    [{
      name: 'myItem',
      tooltip: 'myItem',
      command: 'bold',
      text: '@',
      className: 'toastui-editor-toolbar-icons',
      style: { backgroundImage: 'none', color: 'red' }
    }]
  ],
  // ...
});
```

The toolbar item is rendered with `className` and `style` options. The item has `@` text node and executes `bold` commands when clicked.

![image](https://user-images.githubusercontent.com/37766175/120915118-ea3e7a80-c6dc-11eb-86cc-5229ed36c4e8.gif)

### popup Option
When you click the button, you might want to show the popup. In this case, you can use the `popup` option that you saw above. The interface of the `popup` option is shown below.

| Name | Type | Description |
| --- | --- | --- |
| `body` | HTMLElement | Defines the popup DOM node to be rendered. | 
| `className` | string | Optional value, defines the class to be applied to the popup. | 
| `style` | Object | Optional value, defines the style to be applied to the popup. | 

The popup node is automatically diplayed on the screen when clicked on the toolbar, and disappears automatically when clicked on another area.

Let's take a look at the color picker plugin code of the editor.

```js
const container = document.createElement('div');
// ...
const button = createApplyButton(i18n.get('OK'));

button.addEventListener('click', () => {
  // ...
  eventEmitter.emit('command', 'color', { selectedColor });
  eventEmitter.emit('closePopup');
});

container.appendChild(button);

const colorPickerToolber = {
  name: 'color',
  tooltip: 'Text color',
  className: 'some class',
  popup: {
    className: 'some class',
    body: container,
    style: { width: 'auto' },
  },
};
```

In the example code, the popup element is in a variable `container`. This element has a button element, and when clicked, it executes the `color` command and closes the itself. The popup that user defined can be communicated with editor using `eventEmitter`. In order to execute the command, you can trigger `command` event, and if you want to close the popup, you can trigger `closePopup` event.

The defined color picker toolbar item works well with popup as shown below.

![image](https://user-images.githubusercontent.com/37766175/120915630-b6b11f80-c6df-11eb-8094-b264ca9312a1.gif)


## Toolbar Item Customizing
If you want to create a toolbar item without using the default button UI as described above, you need to configure the `el` option as shown below.

```js
const myCustomEl = document.createElement('span');

myCustomEl.textContent = '😎';
myCustomEl.style = 'cursor: pointer; background: red;'
myCustomEl.addEventListener('click', () => {
  editor.exec('bold');
});

const editor = new Editor({
  el: document.querySelector('#editor'),
  toolbarItems: [
    [{
      name: 'myItem',
      tooltip: 'myItem',
      el: myCustomEl,
    }]
  ],
  // ...
});
```

The element to be rendered must be specified as an `el` option. In this case, style, event handler, and class must be set, as the option is to create a complete DOM element.

If you run the example code above, it will work as follows.

![iamge](https://user-images.githubusercontent.com/37766175/120915883-3e4b5e00-c6e1-11eb-8f44-95e6d31f41e7.gif)

## Change Toolbar Item State
In the editor, you can activate which node is based on the current cursor's position by changing the style of the toolbar element. For example, if the cursor is located on a `strong` node that displays bold text, an element of the `bold` toolbar item is activated as follows.

![image](https://user-images.githubusercontent.com/37766175/124843166-49d5c180-dfcc-11eb-9633-ae1e61d612ea.gif)


If you want to change the state of a customized toolbar element like the example above, you need to configure the `state` option.

```js
const editor = new Editor({
  el: document.querySelector('#editor'),
  toolbarItems: [
    [{
      name: 'myItem',
      tooltip: 'myItem',
      command: 'bold',
      text: '@',
      className: 'toastui-editor-toolbar-icons',
      style: { backgroundImage: 'none', color: 'red' },
      // If it is located on the `strong` node, the `active` CSS class is added to this toolbar element.
      state: 'strong',
    }]
  ],
  // ...
});
```

If the toolbar button is activated according to `state`, the `active` CSS class will be added and you can specify the style that you want using this class.

### `state` list
The state of the toolbar element can only be changed by using the state value below.
* `heading`: Heading
* `strong`: Bold
* `emph`: Italic
* `strike`: Strike
* `thematicBreak`: Horizontal Line
* `blockQuote`: Quotes
* `bulletList`: Bullet List
* `orderedList`: Ordered List
* `taskList`: Task List
* `table`: Table
* `code`: Inline Code
* `codeBlock`: Code Block

### `onUpdated()` option
If a toolbar element is created with the `el` option without using the default button UI, the state can be changed by configuring the `onUpdated` option. Because there is a limit to directly manipulating toolbar elements that are customized, it is going to provide the `onUpdated` callback options.

```js
const myCustomEl = document.createElement('span');

myCustomEl.textContent = '😎';
myCustomEl.style = 'cursor: pointer; background: red;'
myCustomEl.addEventListener('click', () => {
  editor.exec('bold');
});

const editor = new Editor({
  el: document.querySelector('#editor'),
  toolbarItems: [
    [{
      name: 'myItem',
      tooltip: 'myItem',
      el: myCustomEl,
      state: 'strong',
      onUpdated({ active, disabled }) {
        if (active) {
          myCustomEl.style.background = 'green';
        } else {
          myCustomEl.style.background = '';
        }
      }
    }]
  ],
  // ...
});
```

The `onUpdated()` function passes the object that represent `active` and `disabled` state as parameter. This parameter allows you to add styling to an element or define the desired operation.

## Example

You can see the example [here](https://nhn.github.io/tui.editor/latest/tutorial-example15-customizing-toolbar-buttons)
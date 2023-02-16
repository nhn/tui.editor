# TOAST UI Editor for React

> This is a [React](https://reactjs.org/) component wrapping [TOAST UI Editor](https://github.com/nhn/tui.editor/tree/master/apps/editor).

[![npm version](https://img.shields.io/npm/v/@toast-ui/react-editor.svg)](https://www.npmjs.com/package/@toast-ui/react-editor)

## 🚩 Table of Contents

- [Collect Statistics on the Use of Open Source](#collect-statistics-on-the-use-of-open-source)
- [Install](#-install)
- [Usage](#-usage)

## Collect Statistics on the Use of Open Source

React Wrapper of TOAST UI Editor applies Google Analytics (GA) to collect statistics on the use of open source, in order to identify how widely TOAST UI Editor is used throughout the world. It also serves as important index to determine the future course of projects. location.hostname (e.g. ui.toast.com) is to be collected and the sole purpose is nothing but to measure statistics on the usage. To disable GA, use the `usageStatistics` props like the example below.

```js
<Editor
  ...
  usageStatistics={false}
/>
```

## 💾 Install

### Using npm

```sh
npm install --save @toast-ui/react-editor
```

## 📝 Usage

### Import

You can use TOAST UI Editor for React as a ECMAScript module or a CommonJS module. As this module does not contain CSS files, you should import `toastui-editor.css` from `@toast-ui/editor` in the script.

- ES Modules

```js
import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/react-editor';
```

- CommonJS

```js
require('@toast-ui/editor/dist/toastui-editor.css');

const { Editor } = require('@toast-ui/react-editor');
```

### Props

[All the options of the TOAST UI Editor](https://nhn.github.io/tui.editor/latest/ToastUIEditor) are supported in the form of props.

```js
import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/react-editor';

const MyComponent = () => (
  <Editor
    initialValue="hello react editor world!"
    previewStyle="vertical"
    height="600px"
    initialEditType="markdown"
    useCommandShortcut={true}
  />
);
```

### Instance Methods

For using [instance methods of TOAST UI Editor](https://nhn.github.io/tui.editor/latest/ToastUIEditor#addHook), first thing to do is creating Refs of wrapper component using [`createRef()`](https://reactjs.org/docs/refs-and-the-dom.html#creating-refs). But the wrapper component does not provide a way to call instance methods of TOAST UI Editor directly. Instead, you can call `getInstance()` method of the wrapper component to get the instance, and call the methods on it.

```js
import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/react-editor';

class MyComponent extends React.Component {
  editorRef = React.createRef();

  handleClick = () => {
    this.editorRef.current.getInstance().exec('bold');
  };

  render() {
    return (
      <>
        <Editor
          previewStyle="vertical"
          height="400px"
          initialEditType="markdown"
          initialValue="hello"
          ref={this.editorRef}
        />
        <button onClick={this.handleClick}>make bold</button>
      </>
    );
  }
}
```

#### Getting the Root Element

An instance of the wrapper component also provides a handy method for getting the root element. If you want to manipulate the root element directly, you can call `getRootElement` to get the element.

```js
import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/react-editor';

class MyComponent extends React.Component {
  editorRef = React.createRef();

  handleClickButton = () => {
    this.editorRef.current.getRootElement().classList.add('my-editor-root');
  };

  render() {
    return (
      <>
        <Editor
          previewStyle="vertical"
          height="400px"
          initialEditType="markdown"
          initialValue="hello"
          ref={this.editorRef}
        />
        <button onClick={this.handleClickButton}>Click!</button>
      </>
    );
  }
}
```

### Events

[All the events of TOAST UI Editor](https://nhn.github.io/tui.editor/latest/ToastUIEditor#focus) are supported in the form of `on[EventName]` props. The first letter of each event name should be capitalized. For example, for using `focus` event you can use `onFocus` prop like the example below.

```js
import '@toast-ui/editor/dist/toastui-editor.css';

import { Editor } from '@toast-ui/react-editor';

class MyComponent extends React.Component {
  handleFocus = () => {
    console.log('focus!!');
  };

  render() {
    return (
      <Editor
        previewStyle="vertical"
        height="400px"
        initialEditType="markdown"
        initialValue="hello"
        ref={this.editorRef}
        onFocus={this.handleFocus}
      />
    );
  }
}
```

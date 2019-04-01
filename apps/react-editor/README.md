# TOAST UI Editor for React

> This is a React component wrapping [TOAST UI Editor](https://github.com/nhnent/tui.editor).

[![github version](https://img.shields.io/github/release/nhnent/toast-ui.react-editor.svg)](https://github.com/nhnent/toast-ui.react-editor/releases/latest)
[![npm version](https://img.shields.io/npm/v/@toast-ui/react-editor.svg)](https://www.npmjs.com/package/@toast-ui/react-editor)
[![license](https://img.shields.io/github/license/nhnent/toast-ui.react-editor.svg)](https://github.com/nhnent/toast-ui.react-editor/blob/master/LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg)](https://github.com/nhnent/toast-ui.react-editor/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
[![code with hearth by NHN](https://img.shields.io/badge/%3C%2F%3E%20with%20%E2%99%A5%20by-NHN-ff1414.svg)](https://github.com/nhnent)

## 🚩 Table of Contents
* [Collect statistics on the use of open source](#collect-statistics-on-the-use-of-open-source)
* [Install](#-install)
    * [Using npm](#using-npm)
* [Usage](#-usage)
    * [Import](#import)
    * [Props](#props)
    * [Instance Methods](#instance-methods)
    * [Getting the root element](#getting-the-root-element)
    * [Events](#events)
* [Pull Request Steps](#-pull-request-steps)
* [Documents](#-documents)
* [Contributing](#-contributing)
* [License](#-license)

## Collect statistics on the use of open source

React Wrapper of TOAST UI Editor applies Google Analytics (GA) to collect statistics on the use of open source, in order to identify how widely TOAST UI Editor is used throughout the world. It also serves as important index to determine the future course of projects. location.hostname (e.g. > “ui.toast.com") is to be collected and the sole purpose is nothing but to measure statistics on the usage. To disable GA, use the `usageStatistics` props like the example below.

```js
<Editor 
  ...
  usageStatistics={false} 
/>
```

Or, import `tui-code-snippet.js` (**v1.4.0** or **later**) and then immediately write the options as follows:
```js
tui.usageStatistics = false;
```

## 💾 Install

### Using npm

```sh
npm install --save @toast-ui/react-editor
```

## 🔡 Usage

### Import

You can use Toast UI Editor for React as a ECMAScript module or a CommonJS module. As this module does not contain CSS files, you should import `tui-editor.css`, `tui-editor-contents.css` from `tui-editor` and `codemirror.css` from `codemirror.css` in the script. 

* Using ECMAScript module

```js
import 'codemirror/lib/codemirror.css';
import 'tui-editor/dist/tui-editor.min.css';
import 'tui-editor/dist/tui-editor-contents.min.css';
import Editor from '@toast-ui/react-editor'
```

* Using CommonJS module

```js
require('codemirror/lib/codemirror.css');
require('tui-editor/dist/tui-editor.min.css');
require('tui-editor/dist/tui-editor-contents.min.css');
const Editor = require('@toast-ui/react-editor');
```

### Props

[All the options of the TOAST UI Editor](https://nhnent.github.io/tui.editor/api/latest/ToastUIEditor.html#ToastUIEditor) are supported in the form of props.

```js
const MyComponent = () => (
  <Editor
    initialValue="hello react editor world!"
    previewStyle="vertical"
    height="600px"
    initialEditType="markdown"
    useCommandShortcut={true}
    exts={[
      {
        name: 'chart',
        minWidth: 100,
        maxWidth: 600,
        minHeight: 100,
        maxHeight: 300
      },
      'scrollSync',
      'colorSyntax',
      'uml',
      'mark',
      'table'
    ]}
  />
);
```

### Instance Methods

For using [instance methods of TOAST UI Editor](https://nhnent.github.io/tui.editor/api/latest/ToastUIEditor.html#.defineExtension), first thing to do is creating Refs of wrapper component using [`createRef()`](https://reactjs.org/docs/refs-and-the-dom.html#creating-refs). But the wrapper component does not provide a way to call instance methods of TOAST UI Editor directly. Instead, you can call `getInstance()` method of the wrapper component to get the instance, and call the methods on it.

```js
class MyComponent extends React.Component {
  editorRef = React.createRef();

  handleClick = () => {
    this.editorRef.current.getInstance().exec('Bold');
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

### Getting the root element

An instance of the wrapper component also provides a handy method for getting the root element. If you want to manipulate the root element directly, you can call `getRootElement` to get the element.

```js
class MyComponent extends React.Component {
  editorRef = React.createRef();
  
  handleClickButton = () => {
    this.editorRef.current.getRootElement().classList.add('my-editor-root');
  }

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
[All the events of TOAST UI Editor](https://nhnent.github.io/tui.editor/api/latest/ToastUIEditor.html#focus) are supported in the form of `on[EventName]` props. The first letter of each event name should be capitalized. For example, for using `focus` event you can use `onFocus` prop like the example below.

```js
class MyComponent extends React.Component {
  handleFoucs = () => {
    console.log('focus!!');
  }

  render() {
    return (
      <Editor 
        data={data} 
        previewStyle="vertical"
        height="400px"
        initialEditType="markdown"
        initialValue="hello"
        ref={this.editorRef}
        onFocus={this.handleFoucs}
      />
    );
  }
}
```

## 🔧 Pull Request Steps

TOAST UI products are open source, so you can create a pull request(PR) after you fix issues.
Run npm scripts and develop yourself with the following process.

### Setup

Fork `master` branch into your personal repository.
Clone it to local computer. Install node modules.
Before starting development, you should check to have any errors.

``` sh
$ git clone https://github.com/{your-personal-repo}/[[repo name]].git
$ cd [[repo name]]
$ npm install
```

### Develop

Let's start development!

### Pull Request

Before PR, check to test lastly and then check any errors.
If it has no error, commit and then push it!

For more information on PR's step, please see links of Contributing section.

## 💬 Contributing
* [Code of Conduct](https://github.com/nhnent/toast-ui.react-editor/blob/master/CODE_OF_CONDUCT.md)
* [Contributing guideline](https://github.com/nhnent/toast-ui.react-editor/blob/master/CONTRIBUTING.md)
* [Commit convention](https://github.com/nhnent/toast-ui.react-editor/blob/master/docs/COMMIT_MESSAGE_CONVENTION.md)

## 📜 License
This software is licensed under the [MIT](./LICENSE) © [NHN.](https://github.com/nhnent)

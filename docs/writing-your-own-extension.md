# Writing your own extension
Check out the [example](https://nhn.github.io/tui.editor/api/latest/tutorial-example11-writing-extension.html).

## Prepare
### Bower
Let's start by setting up a bower and install *tui-editor* as development dependency. Of course, you can also set the webpack, babel, etc. according to your needs.

```sh
bower init
bower install -D tui-editor
```

### Editor Dependencies
Create a `index.html` in a project root directory. Then include dependencies like below to load *tui-editor*.

```html
<html>
<head>
    <script src="./bower_components/jquery/dist/jquery.js" ></script>
    <script src="./bower_components/tui-code-snippet/dist/tui-code-snippet.js" ></script>
    <script src="./bower_components/codemirror/lib/codemirror.js" ></script>
    <script src="./bower_components/highlightjs/highlight.pack.js" ></script>
    <script src="./bower_components/markdown-it/dist/markdown-it.js" ></script>
    <script src="./bower_components/to-mark/dist/to-mark.js" ></script>
    <script src="./bower_components/squire-rte/build/squire-raw.js" ></script>
    <script src="./bower_components/tui-editor/dist/tui-editor-Editor.js" ></script>
    <link rel="stylesheet" href="./bower_components/codemirror/lib/codemirror.css" />
    <link rel="stylesheet" href="./bower_components/highlightjs/styles/github.css" />
    <link rel="stylesheet" href="./bower_components/tui-editor/dist/tui-editor.css" />
    <link rel="stylesheet" href="./bower_components/tui-editor/dist/tui-editor-contents.css" />
</head>
<body>
...
</body>
</html>
```
### Initialize Editor
Now create a `div` for the editor in `body`, initialize it.

```html
...
<body>
    <div id="editor" ></div>
    <script>
        var editor = new tui.Editor({
            el: document.querySelector('#editor'),
            initialEditType: 'markdown',
            previewStyle: 'vertical',
            height: '300px'
        });
    </script>
</body>
...
```

Run the local server like [http-server](https://www.npmjs.com/package/http-server) to see if the code you've written so far works well. You should see the editor runs like below.

![image](https://user-images.githubusercontent.com/1215767/34656355-fa410616-f45b-11e7-93e1-f3551d74a472.png)

## Define Extension
Create `tui-editor-extYoutube.js` in project root and fill the code below. `defineExtension` static function takes **extension name** and **extension init function** as a callback function. The function will be executed when editor instances initialized.

```js
tui.Editor.defineExtension('youtube', function() {
    console.log('youtube extension initialized');
});
```

## Enable Extension
Include `tui-editor-extYoutube.js` in `index.html`. To enable the extension, pass the name of the extension 'youtube' to the exts option as a string.

```html
<body>
    <div id="editor" ></div>
    <script src="./tui-editor-extYoutube.js"></script>
    <script>
        var editor = new tui.Editor({
            el: document.querySelector('#editor'),
            initialEditType: 'markdown',
            previewStyle: 'vertical',
            height: '300px',
            exts: ['youtube']
        });
    </script>
</body>
```

Refresh the browser and open the developer console to see if the code you've written so far works well. You should see 'youtube extension initialized' text on the developer console.

## codeBlockManager
`CodeBlockManager` can transform *code block* in markdown while [markdown-it](https://github.com/markdown-it/markdown-it) transform markdown to HTML.
Call `setReplace` with the *language* and a *callback* function to define what/how the language codeblock is converted.
Beware, **tui-editor** shares one **markdown-it** instance. So It will affect all editor instances.

```js
var Editor = tui.Editor;
Editor.defineExtension('youtube', function() {
    Editor.codeBlockManager.setReplacer('youtube', function (code) {
        return 'play youtube id: ' + code;
    });
});
```

Refresh the brwoser and this time add code block ` ```youtube ` with some text in markdown editor. Do you see the text on the *preview* transformed?

## youtube player
We're almost done. Now implement real code to render youtube.
Embeding Youtube can be done by adding `iframe`. But **tui-editor** will eliminate `iframe` due to security reason. So We're going to pass a `div` and add `iframe` in next tick.

```js
var Editor = tui.Editor;
Editor.defineExtension('youtube', function() {
    Editor.codeBlockManager.setReplacer('youtube', function(youtubeId) {
        var wrapperId = 'yt' + Math.random().toString(36).substr(2, 10);
        setTimeout(renderYoutube.bind(null, wrapperId, youtubeId), 0);

        return '<div id="' + wrapperId + '"></div>';
    });
});

function renderYoutube(wrapperId, youtubeId) {
    var el = document.querySelector('#' + wrapperId);
    el.innerHTML = '<iframe width="420" height="315" src="https://www.youtube.com/embed/' + youtubeId + '"></iframe>';
}
```

Reload the browser and write below in *markdown view*.
````markdown
```youtube
XGSy3_Czz8k
```
````

![image](https://user-images.githubusercontent.com/1215767/34656368-3abf29c0-f45c-11e7-8909-a8157bb25bd3.png)

YEY! It works! By the way, this code is only for demonstraition to show you how extensions work. This code has vulnerabilities. You should at least sanitize user inputs.

## UMD
This is final. We accessed through namespace `tui.Editor`. To provide ability to work with tools like webapck, wrap it with *umd*. And then you can publish to npm, bower.

```js
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['tui-editor'], factory);
  } else if (typeof exports === 'object') {
    factory(require('tui-editor'));
  } else {
    factory(root['tui']['Editor']);
  }
})(this, function(Editor) {
  Editor.defineExtension('youtube', function() {
    Editor.codeBlockManager.setReplacer('youtube', function(youtubeId) {
      var wrapperId = 'yt' + Math.random().toString(36).substr(2, 10);
      setTimeout(renderYoutube.bind(null, wrapperId, youtubeId), 0);

      return '<div id="' + wrapperId + '"></div>';
    });
  });

  function renderYoutube(wrapperId, youtubeId) {
    var el = document.querySelector('#' + wrapperId);
    el.innerHTML = '<iframe width="420" height="315" src="https://www.youtube.com/embed/' + youtubeId + '"></iframe>';
  }
});
```

Send us your extension link, we are happy to link your extension repository. 😄

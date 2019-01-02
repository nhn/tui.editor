# Using Extensions

## 1) Loading Scripts

### Using bundler
If you are using webpack or rollup. Use require or import without assigning the returned value to the variables. eg:
```js
require('tui-editor/dist/tui-editor-extChart');
```
or with es6 syntax
```js
import 'tui-editor/dist/tui-editor-extChart';
```
The bundlers with tree-shaking enabled will eliminate the extensions if you assign a variable which won't be used.

### Using bower or direct download
Add script tag right after editor script.
```html
<script src="./bower_components/tui-editor/dist/tui-editor-Editor.js"></script>
<script src="./bower_components/tui-editor/dist/tui-editor-extChart.js"></script>
```
## 2) Enable Extension
Once you have loaded extensions via bundler or script tag, you should let editor know to enable the extensions.
Give `exts` option an string array. Each of the string should be a valid extension name.
```js
var editor = new Editor({
    el: document.querySelector('#editSection'),
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    height: '300px',
    exts: ['chart', 'uml']
});
```

## For UML
You can draw many kind of UML Diagram using [plantUML](http://plantuml.com/).

![image](https://user-images.githubusercontent.com/1215767/34478730-e1e3a648-efe5-11e7-9b54-685d8bd20e67.png)

Load script `'tui-editor/dist/tui-editor-extUML.js'` and enable uml extension by `exts: ['uml']` option.

see example [here](https://nhnent.github.io/tui.editor/api/latest/tutorial-example08-uml.html)

## For Chart
You can draw chart from TSV, CSV data format using [tui-chart](nhnent.github.io/tui.chart/latest)

![image](https://user-images.githubusercontent.com/1215767/34478882-bb25bc48-efe6-11e7-83fd-2da47107133d.png)

Load script `'tui-editor/dist/tui-editor-extChart.js'` and enable the extension by `exts: ['chart']` option.
The code block format looks like this.

![image](https://user-images.githubusercontent.com/1215767/34479026-a0823ed8-efe7-11e7-9eb0-0d95664f8bae.png)

* data & option block are separated by one or more blank lines
* data block come first, TSV, CSV or White-Space Separated Values
* option block follows, each option is [tui-chart](nhnent.github.io/tui.chart/latest) option in dot notation.

see the [example](https://nhnent.github.io/tui.editor/api/latest/tutorial-example11-chart.html)

## For Table
You can draw merged table cells.

![image](https://user-images.githubusercontent.com/1215767/34479209-b0391fbc-efe8-11e7-8c65-a58280723ebf.png)

Load script `'tui-editor/dist/tui-editor-extTable.js'` and enable the extension by `exts: ['table']` option.

![image](https://user-images.githubusercontent.com/1215767/34479230-d264ca32-efe8-11e7-9ed1-392a863b127e.png)

see the [example](https://nhnent.github.io/tui.editor/api/latest/tutorial-example07-table.html)

## For Color Syntax
You can color text by toolbox easy.

![image](https://user-images.githubusercontent.com/1215767/34479321-5ef8b526-efe9-11e7-984f-0102e363f79d.png)

Load script `'tui-editor/dist/tui-editor-extColorSyntax.js'` and enable the extension by `exts: ['colorSyntax']` option.

Once you enable this extension. You can see a button appearing on the toolbar.

![image](https://user-images.githubusercontent.com/1215767/34479308-4ca815ec-efe9-11e7-8c6d-2d2b395667bc.png)

see the [example](https://nhnent.github.io/tui.editor/api/latest/tutorial-example06-colorsyntax.html)

## For Scroll Sync
Sync markdown editor & preview scroll. You can toggle *sync mode* by click on blue `scroll on` button on toolbar.

![image](https://user-images.githubusercontent.com/1215767/34479392-d37c671c-efe9-11e7-841f-b3900a2ef7f5.png)

Load script `'tui-editor/dist/tui-editor-extScrollSync.js'` and enable the extension by `exts: ['scrollSync']` option.

see the [example](https://nhnent.github.io/tui.editor/api/latest/tutorial-example05-scrollsync.html)

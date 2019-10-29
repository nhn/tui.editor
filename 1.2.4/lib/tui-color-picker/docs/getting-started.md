## Load

Download `tui-color-picker`, `tui-code-snippet` manually and include sources in page.

```html
<link href="tui-color-picker.css" />
<script src="tui-code-snippet.js"></script>
<script src="tui-color-picker.js"></script>
```

## HTML
```html
<div id="tui-color-picker-conatiner"></div>
```
```js
var colorpicker = tui.colorpicker.create({
    container: document.getElementById('tui-color-picker-conatiner'),
    color: '#f9f9f9',
    preset: ['#181818', '#292929', '#393939']
});
```

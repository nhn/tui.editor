## Chart export menu Feature
* This section introduces about chart export menu.

***

### Browser compatibility of Client-Side download
Chart export menu is using client-side download, which mean download from own web browser client.

Due to deferences between browsers, some browsers not support download methods that we use.
And export menu is appears depends on whether browser support or not.
Even if `chartExportMenu.visible` is `true`.

Please confirm supporting browser list below.

||Internet Explorer 8|Internet Explorer 9|Internet Explorer 10| Internet Explorer 11| Edge | Chrome | Firefox | Safari|
|---|---|---|---|---|---|---|---|---|
|Support|X|X|O|O|O|O|O|X|

### Data structure compatibility for chart data export (xls, csv)
And basically chart export menu appear on tabular data structure.

Coordinate data, tree data structure not supported.

### Option

#### Visible option
Using `chartExportMenu.visible` option to set visibility.

##### Example

``` javascript
var options = {
    chartExportMenu: {
        visible: true  // default is true.
    }
};
```

### Browser compatibility for chart image export (png, jpeg)
Basically, Image download support browser is Chrome, firefox, Edge.
Because of browser's canvas bitmap image security constraint, IE(Internet Explorer) 10~11 couldn't download image the same way modern browsers does.

But, Enable image download feature is potentially available in IE 10~11.
Just load [canvg](https://github.com/canvg/canvg)bundle on page. That's all.

And export menu list items(xls, csv, png, jpeg) are appear depends on whether browser support or not.

||Internet Explorer 8|Internet Explorer 9|Internet Explorer 10| Internet Explorer 11| Edge | Chrome | Firefox | Safari|
|---|---|---|---|---|---|---|---|---|
|Support|X|X|X (+canvg: O)|X (+canvg: O)|O|O|O|X|

***

### Specify the name of the file to be exported.
Using `chartExportMenu.filename` option, you can specify the name of the file to be exported.

##### Example

```javascript
//...
var options = {
    chartExportMenu: {
        filename: 'custom_file_name'  // setting filename
    }
};
```

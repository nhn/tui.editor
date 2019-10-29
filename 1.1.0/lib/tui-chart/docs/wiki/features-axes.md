## Axes Feature
* This section introduces about feature of axes.

***

### Setting about each title of axes

Using title options(yAxis.title, xAxis.title), you can set about each title of axes.

### Example

``` javascript
//...
var options = {
    xAxis: {
        title: 'X Axis Title'
    },
    yAxis: {
        title: 'Y Axis Title'
    }
};
tui.chart.barChart(container, data, options);
```
***

### Title positioning

If you want moving title position, you can use object type `xAxis.title`(`yAxis.title`) option.
In this case, title text is using `xAxis.title.text` option.
`xAxis.title.offsetX`, `xAxis.title.offsetY` options are using for moving a title to four direction like top, bottom, left and right.

##### Example

``` javascript
var options = {
    xAxis: {
        title: {
            text: 'X Axis Title',
            offsetX: 50,
            offsetY: 10
        }
    },
    yAxis: {
        title: {
            text: 'Y Axis Title',
            offsetX: -30,
            offsetY: 20
        }
    }
};
```

***

### Setting min, max
 
#### Setting min, max at X axis

Using `xAxis.min`, `xAxis.max` options, you can set about minimum or maximum value of X axis.
These options are available in bar and heatmap charts.

##### Example

``` javascript
//...
var options = {
    xAxis: {
        min: 0,
        max: 1000
    }
};
tui.chart.barChart(container, data, options);
```

#### Setting min, max at Y axis

Using `yAxis.min`, `yAxis.max` options, you can set about minimum or maximum value of Y axis.
These options are available in column, line, area, heatmap and combo charts.

##### Example

``` javascript
//...
var options = {
    yAxis: {
        min: 0,
        max: 1000
    }
};
tui.chart.columnChart(container, data, options);
```

***

### How to display the axis label sparsely in the X axis?

Using `xAxis.labelInterval` option, you can display the axis label sparsely.<br>
This option is available in column, line, area and combo charts.

##### Example

``` javascript
//...
var options = {
    xAxis: {
        labelInterval: 2
    }
};
tui.chart.columnChart(container, data, options);
```

***

### How to not rotated label of x axis?

Label of x axis is rotated, when a width for label is wider than the width of the rendering area.<br>
If you do not want rotating label of x axis, you can use `xAxis.rotateLabel` option.

##### Example

``` javascript
//...
var options = {
    xAxis: {
        rotateLabel: false
    }
};
tui.chart.columnChart(container, data, options);
```

![rotateLabel option](https://cloud.githubusercontent.com/assets/2888775/15560313/649adae6-2325-11e6-89d9-fcae657277b2.png)

***

### How to not rotated title of y axis?

Title of y axis is rotated, when rendering.<br>
If you do not want rotating title of y axis, you can use `yAxis.rotateTitle` option.

##### Example

``` javascript
//...
var options = {
    yAxis: {
        rotateTitle: false
    }
};
tui.chart.columnChart(container, data, options);
```

![rotateTitle option](https://cloud.githubusercontent.com/assets/2888775/15560163/ea8343d4-2323-11e6-9f30-1611bd50686a.png)

***

### How to formatting label to date format
If you want formatting label to date format, you can use `type='datetime'` and `dateFormat` options.

```javascript
var rawData = {
    categories: ['01/01/2016', '02/01/2016',...],
    //..
};

var options = {
    xAxis: {
        type: 'datetime',
        dateFormat: 'YYYY.MM'
    }
}
```

##### formatting guide

|Represent type|format string|
|---|---|
|years| YY / YYYY / yy / yyyy|
|months(n)|M / MM|
|months(str)|MMM / MMMM|
|days|D / DD / d / dd|
|hours|H / HH / h / hh|
|minutes|m / mm|
|meridiem(AM,PM)|A / a|

a. before using format option
![image](https://github.nhnent.com/storage/user/429/files/b23a5250-6b68-11e6-9e9f-0a24fe7eb99a)

b. `dateFormat='MMM'`
![image](https://github.nhnent.com/storage/user/429/files/ce25b20c-6b68-11e6-8b5f-2074654e11fd)

c. `dateFormat='YYYY.MM`
![image](https://github.nhnent.com/storage/user/429/files/038af6be-6b96-11e6-83d2-c85ce94f2177)

* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example03-01-line-chart-basic.html)_
***

### How to define distance between the axis and the label?
If you want spread to gap the axis and label, you can use labelMargin options.

##### Example
```javascript
//...
var options = {
    xAxis: {
        labelMargin: 30
    }
};
tui.chart.columnChart(container, data, options);
```

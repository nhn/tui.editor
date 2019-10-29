## Table of supported options

For more information about options, refer to the [API documentation](https://nhn.github.io/tui.chart/latest).

* [`chart` options](#chart-options)
* [`xAxis` options](#xaxis-options)
* [`yAxis` options](#yaxis-options)
* [`series` options for all charts](#series-options-for-all-charts)
* [`series` options for bar type charts](#series-options-for-bar-type-charts)
* [`series` options for line type charts](#series-options-for-line-type-charts)
* [`series` options for pie type charts](#series-options-for-pie-type-charts)
* [`series` options for treemap chart](#series-options-for-treemap-chart)
* [`tooltip` options](#tooltip-options)
* [`legend` options](#legend-options)
* [`plot` options](#plot-options)
* [`circleLegend` options](#circlelegend-options)
***

### `chart` options

```javascript
var options = {
    chart: {
        width: 600, // width of chart
        height: 400, // height of chart
        title: 'Title', // title of chart
        format: '1,000' // formatting value
    }
};
```
|Chart Type|width|height|title|format|
|---|:---:|:---:|:---:|:---:|
|Bar|O|O|O|O|
|Column|O|O|O|O|
|Line|O|O|O|O|
|Area|O|O|O|O|
|Bubble|O|O|O|O|
|Scatter|O|O|O|O|
|Pie|O|O|O|O|
|Column&Line Combo|O|O|O|O|
|Pie&Donut Combo|O|O|O|O|
|Line&Area Combo|O|O|O|O|
|Map|O|O|O|O|
|Heatmap|O|O|O|O|
|Treemap|O|O|O|O|

***

### `xAxis` options

```javascript
var options = {
    xAxis: {
        title: 'X Axis Title', // title of xAxis
        min: 0, // minimal tick value
        max: 100, // maximum tick value,
        labelInterval: 2, // interval for representing label
        labelMargin: 10, // margin between xAxis and text
        tickInterval: 'auto', // automatically adjusting count of tick
        rotateLabel: false, // whether rotate label or not,
        type: 'datetime', // axis type
        dateFormat: 'YYYY.MM' // format string for formatting datetime type label
    }
};
```

|Chart Type|title|min|max|labelInterval|labelMargin|tickInterval|rotateLabel|type|dateFormat|  
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|Bar|O|O|O|X|O|X|O|X|X|
|Column|O|X|X|O|O|X|O|O|O|
|Line|O|X|X|O|O|O|O|O|O|
|Area|O|X|X|O|O|O|O|O|O|
|Bubble|O|O|O|O|O|X|O|X|X|
|Scatter|O|O|O|O|O|X|O|X|X|
|Column&Line Combo|O|X|X|O|O|X|O|O|O|
|Line&Area Combo|O|X|X|O|O|O|O|O|O|
|Heatmap|O|X|X|O|O|X|O|O|O|


***

### `yAxis` options

```javascript
var options = {
    yAxis: {
        title: 'Y Axis Title', // title of yAxis
        align: 'center', // yAxis align
        min: 0, // minimal tick value
        max: 100, // maximum tick value
        rotateTitle: false // whether rotate title or not,
        type: 'datetime', // axis type
        dateFormat: 'YYYY.MM', // format string for formatting datetime type label
        labelMargin: 10 // margin between yAxis and label
    }
};
```

|Chart Type|title|align|min|max|rotateTitle|type|dateFormat|labelMargin|
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|Bar|O|X|X|X|O|O|O|O|
|Column|O|O|O|O|O|X|X|O|
|Line|O|X|O|O|O|X|X|O|
|Area|O|X|O|O|O|X|X|O|
|Bubble|O|X|O|O|O|X|X|O|
|Scatter|O|X|O|O|O|X|X|O|
|Column&Line Combo|O|X|O|O|O|X|X|O|
|Line&Area Combo|O|X|O|O|O|X|X|O|
|Heatmap|O|X|X|X|O|O|O|O|
***

### `series` options for all charts

```javascript
var options = {
    series: {
        showLabel: true, // whether show label or not
        allowSelect: true // whether allow select or not
    }
};
```

|Chart Type|showLabel|allowSelect|
|---|:---:|:---:|
|Bar|O|O|
|Column|O|O|
|Line|O|O|
|Area|O|O|
|Bubble|O|O|
|Scatter|O|O|
|Pie|O|O|
|Column&Line Combo|O|O|
|Pie&Donut Combo|O|O|
|Line&Area Combo|O|O|
|Map|O|X|
|Heatmap|O|X|
|Treemap|O|X|

***

### `series` options for bar type charts

```javascript
var options = {
    series: {
        stackType: 'normal', // stack type ('normal' or 'percent')
        diverging: true, // whether diverging chart or not
        barWidth: 20 // bar width
    }
};
```

|Chart Type|stackType|diverging|barWidth|
|---|:---:|:---:|:---:|
|Bar|O|O|O|
|Column|O|O|O|
|Column&Line Combo|O|X|O|

***

### `series` options for line type charts

```javascript
var options = {
    series: {
        showDot: true, // whether show dot or not
        spline: true, // whether spline chart or not
        zoomable: true, // whether can zoom by mouse drag or not
        shifting: true // whether moving to left or not, when dynamically adding data
    }
};
```

|Chart Type|showDot|spline|zoomable|shifting|
|---|:---:|:---:|:---:|:---:|
|Line|O|O|O|O|
|Area|O|O|O|O|
|Column&Line Combo|O|O|X|X|
|Line&Area Combo|O|O|O|O|

***

### `series` options for pie type charts

```javascript
var options = {
    series: {
        radiusRange: ['50%', '90%'], // range of radius
        startAngle: 0, // start angle
        endAngle: 90 // end angle
    }
};
```

|Chart Type|radiusRange|startAngle|endAngle|
|---|:---:|:---:|:---:|
|Pie|O|O|O||
|Pie&Donut Combo|O|O|O|

***

### `series` options for treemap chart

```javascript
var options = {
    series: {
        useLeafLabel: true, // whether use label of leaf node or not
        useColorValue: true // whether use colorValue or not
    }
};
```

|Chart Type|useLeafLabel|useColorValue|
|---|:---:|:---:|
|Treemap|O|O|

***

### `tooltip` options

```javascript
var options = {
    tooltip: {
        grouped: true, // whether group tooltip or not
        align: 'top', // tooltip align
        offsetX: 10, // for moving a tooltip to left or right
        offsetY: -20, // for moving a tooltip to top or bottom
        position: {left: 10, top: -20} // (deprecated) moving position
    }
};
```

|Chart Type|grouped|align|offsetX|offsetY|(deprecated)position|
|---|:---:|:---:|:---:|:---:|:---:|
|Bar|O|O|O|O|O|
|Column|O|O|O|O|O|
|Line|O|O|O|O|O|
|Area|O|O|O|O|O|
|Bubble|X|O|O|O|O|
|Scatter|X|O|O|O|O|
|Pie|X|O|O|O|O|
|Column&Line Combo|O|O|O|O|O|
|Pie&Donut Combo|X|O|O|O|O|
|Line&Area Combo|O|O|O|O|O|
|Map|X|O|O|O|O|
|Heatmap|X|O|O|O|O|
|Treemap|X|X|O|O|O|

***

### `legend` options

```javascript
var options = {
    legend: {
        align: 'top', // legend align
        visible: true, // whether visible or not
        showCheckbox: true, // whether show checkbox or not
        maxWidth: 100 // maximum width of legend label, it will be abbreviated if longer
    }
};
```

|Chart Type|align|visible|showCheckbox|maxWidth|
|---|:---:|:---:|:---:|:---:|
|Bar|O|O|O|O|
|Column|O|O|O|O|
|Line|O|O|O|O|
|Area|O|O|O|O|
|Bubble|O|O|O|O|
|Scatter|O|O|O|O|
|Pie|O|O|O|O|
|Column&Line Combo|O|O|O|O|
|Pie&Donut Combo|O|O|O|O|
|Line&Area Combo|O|O|O|O|
|Line&Scatter Combo|O|O|O|O|
|Map|O|X|X|X|
|Heatmap|O|X|X|X|
|Treemap|O|X|X|X|
|Radial|O|O|O|O|
|Boxplot|O|O|O|O|

***

### `plot` options

```javascript
var options = {
    plot: {
        hideLine: true, // whether hide line or not
        bands: [
            {
                range: ['cate1', 'cate3'], // band range
                color: 'yellow', // band color
                opacity: 0.5 // band opacity
            }
        ],
        lines: [
            {
                value: 'cate5', // matching value
                color: 'red', // line color
                opacity: 0.8 // line opacity
            }
        ]
    }
};
```

|Chart Type|plot.hideLine|plot.bands|plot.lines|
|---|:---:|:---:|:---:|
|Bar|O|X|X|
|Column|O|X|X|
|Line|O|O|O|
|Area|O|O|O|
|Bubble|O|X|X|
|Scatter|O|X|X|
|Column&Line Combo|O|X|X|
|Pie&Donut Combo|X|X|X|
|Line&Area Combo|O|O|O|

***

### `circleLegend` options

```javascript
var options = {
    circleLegend: {
        visible: true // whether visible or not
    }
};
```

|Chart Type|circleLegend.visible|
|---|:---:|
|Bar|X|
|Column|X|
|Line|X|
|Area|X|
|Bubble|O|
|Scatter|X|
|Column&Line Combo|X|
|Pie&Donut Combo|X|
|Line&Area Combo|X|


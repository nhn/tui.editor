## Line &  Area Combo chart
* This section describes how to create line &  area combo chart with options.
* You can refer to the [Getting started](getting-started.md) for base installation of Toast UI Chart.

***

### Data type

The data type of the line & area combo chart is one level deeper than the depth of [basic data type](chart-types-line,area.md#basic-data-type).
Features of this data type, you will need to enter the data for each chart type.

```javascript
var rawData = {
    categories: ['cate1', 'cate2', 'cate3'],
    series: {
        area: [
            {
                name: 'Legend1',
                data: [[4, 6], [6, 8], [8, 10]
            }
        ],
        line: [
            {
                name: 'Legend2',
                data: [5, 7, 9]
            }
        ]
    }
};
```

***

### Creating a basic chart

Line & Area Combo chart can use the features and options like line and area chat.

* [Zoom by mouse drag(`zoomable` option)](chart-types-line,area.md#zoom-by-mouse-drag)
* [Automatically adjusting count of tick(```tickInterval='auto'``` option)](chart-types-line,area.md#automatically-adjusting-count-of-tick)
* [Dynamically adding data](chart-types-line,area.md#dynamically-adding-data)

##### Example

```javascript
var rawData = {
    categories: ['2014.01', '2014.02', '2014.03', ...],
    series: {
        area: [
            {
                name: 'Effective Load',
                data: [150, 130, 100, ...]
            }
        ],
        line: [
            {
                name: 'Power Usage',
                data: [72, 80, 110, ...]
            }
        ]
    }
};
var options = {
    xAxis: {
        tickInterval: 'auto' // automatically adjusting count of tick
    },
    series: {
        zoomable: true // zoom by mouse drag
    }
}
var chart = tui.chart.comboChart(container, rawData, options);
// dynamically adding data
chart.addData('newCate', {line:[10], area:[9]});
```
![Line & Area Combo Chart](https://cloud.githubusercontent.com/assets/2888775/17206153/5f5c1324-54e9-11e6-8786-c5981d64c2e6.gif)

* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example08-03-combo-chart-line-and-area.html)_

***

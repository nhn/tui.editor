## Heatmap chart
* This section describes how to create heatmap chart with options.
* You can refer to the [Getting started](getting-started.md) for base installation of Toast UI Chart.

***

### Data type
Heatmap chart use the heatmap data type.

#### Heatmap data type

```javascript
var rawData = {
    categories: {
        x: ['cate1', 'cate2', 'cate3'],
        y: ['cate10', 'cate20', 'cate30']
    },
    series: [
        [100, 40, 30],
        [20, 10, 60],
        [50, 40, 30]
    ]
};
```

***

### Creating a basic chart
A heatmap chart is a graphical representation of data where the individual values contained in a matrix are represented as colors.

##### Example

```javascript
tui.chart.heatmapChart(container, rawData);
```

![Heatmap chart](https://user-images.githubusercontent.com/35218826/36883668-5668e0d4-1e1f-11e8-865e-20bef4598801.png)

* _[Sample](https://nhn.github.io/tui.chart/latest/tutorial-example10-01-heatmap-chart-basic.html)_

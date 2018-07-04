## Scatter chart
* This section describes how to create scatter chart with options.
* You can refer to the [Getting started](getting-started.md) for base installation of Toast UI Chart.

***

### Data type
Scatter chart use the coordinate data type.

#### Coordinate data type
Coordinate data type for scatter chart has `x` and `y` values.

```javascript
var rawData = {
    series: [
        {
            name: 'male',
            data: [
                {x: 174, y: 65.6},
                {x: 175.3, y: 71.8},
                {x: 193.5, y: 80.7},
                {x: 186.5, y: 72.6},
                {x: 187.2, y: 78.8},
                {x: 181.5, y: 74.8},
                {x: 184, y: 86.4}
            ]
        },
        {
            name: 'female',
            data: [
                {x: 161.2, y: 51.6},
                {x: 167.5, y: 59},
                {x: 159.5, y: 49.2},
                {x: 157, y: 63},
                {x: 155.8, y: 53.6},
                {x: 170, y: 59},
                {x: 159.1, y: 47.6}
            ]
        }
    ]
};
```


***

### Creating a basic chart
A scatter chart is a type of chart that displays values for typically two variables for a set of data.

##### Example

```javascript
tui.chart.scatterChart(container, rawData);
```

![Scatter chart](https://cloud.githubusercontent.com/assets/2888775/15538905/123328d2-22ba-11e6-842f-4daa362bf4ac.png)

* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example06-01-scatter-chart-basic.html)_

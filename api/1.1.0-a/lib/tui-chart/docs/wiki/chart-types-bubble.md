## Bubble chart
* This section describes how to create bubble chart with options.
* You can refer to the [Getting started](getting-started.md) for base installation of Toast UI Chart.

***

### Data type
Bubble chart use the coordinate data type.

#### Coordinate data type
Coordinate data type has `x` and `y` values, and it optionally has `r` or `label` values.


```javascript
var rawData = {
    series: [
        {
            name: 'Legend1',
            data: [{
                x: 10,
                y: 30,
                r: 25,
                label: 'Label1'
            }, {
                x: 20,
                y: 20,
                r: 10,
                label: 'Label2'
            }]
        },
        {
            name: 'Legend2',
            data: [{
                x: 5,
                y: 60,
                r: 30,
                label: 'Label3'
            }, {
                x: 50,
                y: 10,
                r: 20,
                label: 'Label4'
            }]
        }
    ]
};
```


***

### Creating a basic chart
A bubble chart displays three dimensions of data.

##### Example

```javascript
tui.chart.bubbleChart(container, rawData);
```

![Bubble chart](https://cloud.githubusercontent.com/assets/2888775/14973926/81e3feba-1129-11e6-86da-430110b240b5.png)

* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example05-01-bubble-chart-basic.html)_

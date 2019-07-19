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

![Bubble chart](https://user-images.githubusercontent.com/35218826/36881706-dc51af6c-1e12-11e8-974d-aa1922fa5882.png)


* _[Sample](https://nhn.github.io/tui.chart/latest/tutorial-example05-01-bubble-chart-basic.html)_

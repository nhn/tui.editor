## Line & Scatter Combo chart
* This section describes how to create line & scatter combo chart with options.
* You can refer to the [Getting started](getting-started.md) for base installation of Toast UI Chart.

***

### Data type

The data type of the line & scatter combo chart is one level deeper than the depth of [basic data type](chart-types-bar,column.md#basic-data-type).
Features of this data type, you will need to enter the data for each chart type.


```javascript
var rawData = {
    categories: ['cate1', 'cate2', 'cate3'],
    series: {
        Scatter: [
            {
                name: 'Legend1',
                data: [
                    {
                        x: 10,
                        y: 20
                    }, 
                    {
                        x: 25,
                        y: 10
                    }, 
                    {
                        x: 40,
                        y: 30
                    }
                ]
            }
        ],
        line: [
            {
                name: 'Legend2',
                data: [
                    {
                        x: 5,
                        y: 10
                    },
                    {
                        x: 15, 
                        y: 20
                    },
                    {
                        x: 40,
                        y: 60
                    }
                ]
            }
        ]
    }
};
```

***

### Creating a basic chart

##### Example

```javascript
var rawData = {
    //...
    series: {
        scatter: [
                {
                    name: 'Efficiency',
                    data: [
                        {x: 10, y: 20},
                        {x: 14, y: 30},
                        ...
                        {x: 90, y: 85}
                    ]
                }
            ],
        line: line: [
                {
                    name: 'Expenses',
                    data: [
                        {x: 15, y: 15},
                        {x: 30, y: 23},
                        ...
                        {x: 90, y: 82}
                    ]
                }
            ]
    }
};
//...
tui.chart.comboChart(container, rawData);
```
![image](https://cloud.githubusercontent.com/assets/7088720/20824269/9af12e9c-b89e-11e6-9e8b-1a617eebba86.png)

* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example08-04-combo-chart-line-and-scatter.html)_

***


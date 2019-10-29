## Pie & Donut Combo chart
* This section describes how to create pie & donut combo chart with options.
* You can refer to the [Getting started](getting-started.md) for base installation of Toast UI Chart.

***

### Data type

The data type of the pie & donut combo chart is one level deeper than the depth of [data type of pie chart](chart-types-pie.md#data-type).<br>
Features of this data type, you will need to enter the data for each chart type.

```javascript
var rawData = {
    categories: ['cate1', 'cate2', 'cate3'],
    seriesAlias: {
        pie1: 'pie'
        donut1: 'pie'
    },
    series: {
        pie1: [
            {
                name: 'Legend1',
                data: 20
            },
            {
                name: 'Legend2',
                data: 40
            },
            {
                name: 'Legend3',
                data: 60
            },
            {
                name: 'Legend4',
                data: 80
            }
        ],
        donut1: [
            {
                name: 'Legend5',
                data: 10
            },
            {
                name: 'Legend6',
                data: 80
            },
            {
                name: 'Legend7',
                data: 30
            },
            {
                name: 'Legend8',
                data: 50
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
    seriesAlias: {
        pie1: 'pie'
        donut1: 'pie'
    },
    series: {
        pie1: [
            {
                name: 'Chrome',
                data: 40
            },
            //...
        ],
        donut1: [
            {
                name: 'Chrome 1',
                data: 30
            },
            {
                name: 'Chrome 2',
                data: 10
            },
            //...
        ]
    }
};
tui.chart.comboChart(container, rawData);
```
![Pie & Donut Combo Chart](https://cloud.githubusercontent.com/assets/2888775/15540328/a7c51ac0-22c1-11e6-8727-224089a3f762.png)

* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example08-02-combo-chart-pie-and-donut.html)_

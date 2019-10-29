## Pie chart
* This section describes how to create pie chart with options.
* You can refer to the [Getting started](getting-started.md) for base installation of Toast UI Chart.

***

### Data type
The data type of the pie chart is simpler than the [basic data type](chart-types-bar,column.md#basic-data-type).

```javascript
var rawData = {
    series: [
        {
            name: 'Legend1',
            data: 20
        },
        {
            name: 'Legend2',
            data: 50
        },
        {
            name: 'Legend3',
            data: 60
        },
        {
            name: 'Legend4',
            data: 80
        },
        {
            name: 'Legend5',
            data: 10
        },
        {
            name: 'Legend6',
            data: 30
        }
    ]
};
```

### Creating a basic chart

##### Example

```javascript
var rawData = {
    categories: ['Browser'],
    series: [
        {
            name: 'Chrome',
            data: 46.02
        },
        //...
    ]
};
tui.chart.pieChart(container, rawData);
```
![Pie Chart](https://cloud.githubusercontent.com/assets/2888775/13131333/2390345e-d62e-11e5-892b-03fb7a8cf5f2.png)

* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example07-01-pie-chart-basic.html)_

***

### Displaying a legend label to each center of a piece in the pie graph

If you set `true` to `series.showLegend` option and set 'center' to `series.labelAlign` option, you can display a legend label to each center of a piece of the pie graph.

##### Example

```javascript
//...
var options = {
    series: {
        showLegend: true,
        labelAlign: 'center'
    },
    legend: {
        visible: false
    }
};
tui.chart.pieChart(container, rawData, options);
```
![Center Legend Pie Chart](https://cloud.githubusercontent.com/assets/2888775/13131315/03314216-d62e-11e5-90f2-4e37ac2ec11c.png)

* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example07-02-pie-chart-center-legend.html)_

***

### Displaying a legend label to outer of pie graph
If you set 'outer' to `series.labelAlign` option, you can display a legend label to outer of pie graph.

##### Example

```javascript
//...
var options = {
    series: {
        showLegend: true,
        labelAlign: 'outer'
    },
    legend: {
        visible: false
    }
};
tui.chart.pieChart(container, rawData, options);
```
![Outer Legend Pie Chart](https://cloud.githubusercontent.com/assets/2888775/13131343/387cb7f2-d62e-11e5-8791-a71ab0bed651.png)

* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example07-03-pie-chart-outer-legend.html)_

***

### Creating a donut chart

If you use `radiusRange` option, you can creating a donut chart.<br>
`radiusRange` option is an array type having a percentage value.

##### Example

```javascript
//...
var options = {
    series: {
        radiusRange: ['70%', '100%']
    }
};
tui.chart.pieChart(container, rawData, options);
```

![Donut Chart](https://cloud.githubusercontent.com/assets/2888775/15539508/e81745fc-22bd-11e6-9631-21e7a834ecb4.png)

* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example07-04-pie-chart-donut.html)_

***

### Changing size of radius

Also, if you set only first element at `radiusRange` option, you can change size of radius for pie graph.<br>


##### Example

```javascript
//...
var options = {
    series: {
        radiusRange: ['50%']
    }
};
tui.chart.pieChart(container, rawData, options);
```

![radiusRatio option](https://cloud.githubusercontent.com/assets/2888775/15539764/4246cb46-22bf-11e6-8c25-1ed9bff44bca.png)

***

### Semi circle pie chart

If you use `startAngle`, `endAngle` options with `radiusRange` option, you can make semi circle chart.

##### Example

```javascript
var rawData = {
    categories: ['Browser'],
    series: [
        {
            name: 'Chrome',
            data: 46.02
        },
        //...
    ]
};
var options = {
    series: {
        startAngle: -90,
        endAngle: 90,
        radiusRange: ['60%', '100%']
    }
}
tui.chart.pieChart(container, rawData, options);
```

![Semi Circle Donut Chart](https://cloud.githubusercontent.com/assets/2888775/15539472/b105dd62-22bd-11e6-8598-97d446035f60.png)

* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example07-05-pie-chart-semi-circle-donut.html)_

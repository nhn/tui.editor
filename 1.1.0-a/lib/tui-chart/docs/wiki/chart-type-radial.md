## Radial chart
* This section describes how to create radial chart with options.
* You can refer to the [Getting started](getting-started.md) for base installation of Toast UI Chart.

***

### Data type
Radial chart use the basic data type.

#### Basic data type

Basic data type is default type for Toast UI Chart.

```javascript
var rawData = {
    categories: ['June', 'July', 'Aug', 'Sep', 'Oct', 'Nov'],
    series: [
        {
            name: 'Budget',
            data: [5000, 3000, 6000, 3000, 6000, 4000]
        },
        {
            name: 'Income',
            data: [8000, 1000, 7000, 2000, 5000, 3000]
        }
    ]
};
```

***

### Creating a basic chart

##### Example

```javascript

tui.chart.radialChart(container, data);

```

***

### Creating radial chart with area or line series

You can create a radial chart with area series by default or setting the `series.showArea` option `true`.
<br>
If you set `series.showArea` to `false`, rendering series type will be line.

##### Example

```javascript
//...
var options = {
      //...
    series: {
        showArea: true // defalut
        // showArea: false
    }
};

tui.chart.radialChart(container, rawData, options);
```
![radialChart with area or line series](https://cloud.githubusercontent.com/assets/7088720/21558376/3dfe5f36-ce7c-11e6-812a-0698138a489d.gif)


* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example13-01-radial-chart-basic.html)_


### Creating radial chart without series dot

You can create radial chart without series dots by defalut or setting the `series.showDot` option `true`.<br>
If you set `series.showDot` option to `false`, series dots are didn't appear your chart.

##### Example

```javascript
//...
var options = {
      //...
    series: {
        showDot: true // defalut
        // showDot: false
    }
};
tui.chart.radialChart(container, rawData, options);
```

![radialChart with or without series dot](https://cloud.githubusercontent.com/assets/7088720/21558314/332c69e6-ce7b-11e6-9d1f-030dde5c4723.gif)




* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example13-01-radial-chart-basic.html)_

***

### Creating radial chart with spider web or circle plot

You can create radial chart without series dots by defalut or setting the `series.showDot` option `true`.<br>
If you set `series.showDot` option to `false`, series dots are didn't appear your chart.

##### Example

```javascript
//...
var options = {
      //...
    plot: {
        type: 'spiderweb' // defalut
        // type: 'circle'
    }
};
tui.chart.radialChart(container, rawData, options);
```

![radialChart with spiderweb or circle plot](https://cloud.githubusercontent.com/assets/7088720/21558342/b9a06914-ce7b-11e6-8fb1-b21d042df1a1.gif)



* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example13-01-radial-chart-basic.html)_

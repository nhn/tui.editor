## Line chart and area chart
* This section describes how to create line chart and area chart with options.
* You can refer to the [Getting started](getting-started.md) for base installation of Toast UI Chart.

***

### Data type
Line chart and area chart use the basic data type.

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

#### Range data type

Range data type is used to represent the range of data.
This type is available in the area chart.
If you follow this example, you can use range data.

```javascript
var rawData = {
    categories: ['Jan', 'Feb', 'Mar','Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    series: [
        {
            name: 'Seoul',
            data:  [[-8.3, 0.3], [-5.8, 3.1], [-0.6, 9.1], [5.8, 16.9], [11.5, 22.6], [16.6, 26.6], [21.2, 28.8], [21.8, 30.0], [15.8, 25.6], [8.3, 19.6], [1.4, 11.1], [-5.2, 3.2]]
        },
        //...
    ]
};
```

#### Coordinate data type
If you want represent Line and Area chart using non-contiguous data, you can use coordinate data type.

```javascript
var rawData = {
    series: [
        // x, y object type
        {
            name: 'SiteA',
            data: [
                {x: new Date('08/22/2016 10:00:00'), y: 202},
                {x: '08/22/2016 10:05:00', y: 212},
                {x: '08/22/2016 10:10:00', y: 222},
                //...
            ]
        },
        // Array type
        {
            name: 'SiteB',
            data: [
                ['08/22/2016 10:00:00', 312],
                ['08/22/2016 10:10:00', 320],
                ['08/22/2016 10:20:00', 295],
                //...
            ]
        }
    ]
};
```

***

### Creating a basic chart

##### Example

```javascript
// line chart
tui.chart.lineChart(container, data);

// area chart
tui.chart.areaChart(container, data);
```

***

### Creating a spline chart

You can create a spline chart by setting the `series.spline` option.

##### Example

```javascript
//...
var options = {
      //...
    series: {
        spline: true
    }
};
tui.chart.lineChart(container, rawData, options);
```
![Spline Line Chart](https://user-images.githubusercontent.com/35218826/36793813-b9b5a1c0-1ce1-11e8-920b-f73602077433.png)

* _[Sample](https://nhn.github.io/tui.chart/latest/tutorial-example03-02-line-chart-spline.html)_

***

### Creating a stacked area chart

You can create a stacked chart by setting the `series.stackType` option.<br>
The stacked chart has two types, 'normal' and 'percent'.

##### Example

```javascript
//...
var options = {
      //...
    series: {
        stackType: 'normal'
    }
};
tui.chart.areaChart(container, rawData, options);
```
![Stacked Area Chart](https://user-images.githubusercontent.com/35218826/36793845-dce7e31a-1ce1-11e8-9b25-d69c3c7717e5.png)


* _[Sample](https://nhn.github.io/tui.chart/latest/tutorial-example04-02-area-chart-normal-stack.html)_

***

### Creating a range area chart

You can create range area chart by using range data type.

```javascript
//...
var rawData = {
    categories: ['Jan', 'Feb', 'Mar','Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    series: [
        {
            name: 'Seoul',
            data: [[-8.3, 0.3], [-5.8, 3.1], [-0.6, 9.1], [5.8, 16.9], [11.5, 22.6], [16.6, 26.6], [21.2, 28.8], [21.8, 30.0], [15.8, 25.6], [8.3, 19.6], [1.4, 11.1], [-5.2, 3.2]]
        }
    ]
};
tui.chart.areaChart(container, rawData);
```

![Range area chart](https://user-images.githubusercontent.com/35218826/36793913-1ec6a2c6-1ce2-11e8-91f9-d95320563c3b.png)

* _[Sample](https://nhn.github.io/tui.chart/latest/tutorial-example04-03-area-chart-range-data.html)_

***

### Creating a coordinate data type line chart

You can create line chart by using coordinate data type.

```javascript
var rawData = {
    series: [
        {
            name: 'SiteA',
            data: [
                ['08/22/2016 10:00:00', 202],
                ['08/22/2016 10:05:00', 212],
                ['08/22/2016 10:10:00', 222],
                //...
            ]
        },
        {
            name: 'SiteB',
            data: [
                ['08/22/2016 10:00:00', 312],
                ['08/22/2016 10:10:00', 320],
                ['08/22/2016 10:20:00', 295],
                //...
            ]
        }
    ]
};
```
![coordinate data type line chart](https://github.nhnent.com/storage/user/429/files/95bfd7e6-6b66-11e6-96a6-fe642b96b39a)

* _[Sample](https://nhn.github.io/tui.chart/latest/tutorial-example03-03-line-chart-coordinate-data.html)_

***

### Zoom by mouse drag

If you use `zoomable` option, you can zoom by mouse drag. (Coordinate type data zoom is not supported. Use default data type.)

```javascript
var options = {
    series: {
        zoomable: true;
    }
}
tui.chart.areaChart(container, rawData, options);
```

![zoomable](https://user-images.githubusercontent.com/35218826/36794307-55e872ba-1ce3-11e8-9ac0-600cd97c9aba.gif)

* _[Sample](https://nhn.github.io/tui.chart/latest/tutorial-example04-04-area-chart-auto-tick-zoomable.html)_

***

### Automatically adjusting count of tick


If you use a lot of data, you will be difficult to read the label of x-axis.
In this case, you can adjusting count of tick by using ```tickInterval=auto``` option.

```javascript
var options = {
    xAxis: {
        tickInterval: 'auto';
    }
}
tui.chart.areaChart(container, rawData, options);
```

![tickInterval=auto](https://user-images.githubusercontent.com/35218826/36879342-97e402aa-1e06-11e8-9aa6-2bd59347b8fa.png)

***

### Dynamically adding data

You can use the `addData` API to add data, it is reflected on the graph in real time.

```javascript
var rawData = {
    categories: ['18:50:10', '18:50:11', '18:50:12']
    series: [
        {
            name: 'SiteA',
            data: [110, 120, 130]
        },
        {
            name: 'SiteB',
            data: [140, 150, 160]
        }
    ]
};
var chart = tui.chart.lineChart(container, data, options);

chart.on('load', function() {
    chart.addData('18:50:13', [170, 180]);
    // ['18:50:10', '18:50:11', '18:50:12'] ==> ['18:50:10', '18:50:11', '18:50:12', '18:50:13']
    // [110, 120, 130] ==> [110, 120, 130, 170]
    // [140, 150, 160] ==> [140, 150, 160, 180]

    setTimout(function() {
        chart.addData('18:50:14', [190, 200]);
        // ['18:50:10', '18:50:11', '18:50:12', '18:50:13'] ==> ['18:50:10', '18:50:11', '18:50:12', '18:50:13', '18:50:14']
        // [110, 120, 130, 170] ==> [110, 120, 130, 170, 190]
        // [140, 150, 160, 180] ==> [140, 150, 160, 180, 200]
    }, 1000);

    //...
});
```

![dynamic data](https://user-images.githubusercontent.com/35218826/36879815-e4b9d3d2-1e08-11e8-8eaf-728d9ca7d63b.gif)


And if you use `shifting` option, your graph is will be moving to left.

```javascript
var rawData = {
    categories: ['18:50:10', '18:50:11', '18:50:12']
    series: [
        {
            name: 'SiteA',
            data: [110, 120, 130]
        },
        {
            name: 'SiteB',
            data: [140, 150, 160]
        }
    ]
};
var options = {
    series: {
        shifting: true
    }
}
var chart = tui.chart.lineChart(container, data, options);

chart.on('load', function() {
    chart.addData('18:50:13', [170, 180]);
    // ['18:50:10', '18:50:11', '18:50:12'] ==> ['18:50:11', '18:50:12', '18:50:13']
    // [110, 120, 130] ==> [120, 130, 170]
    // [140, 150, 160] ==> [150, 160, 180]

    setTimout(function() {
        chart.addData('18:50:14', [190, 200]);
        // ['18:50:11', '18:50:12', '18:50:13'] ==> ['18:50:12', '18:50:13', '18:50:14']
        // [120, 130, 170] ==> [130, 170, 190]
        // [150, 160, 180] ==> [160, 180, 200]
    }, 1000);

    //...
});

```
![shifting](https://user-images.githubusercontent.com/35218826/36879927-65094f04-1e09-11e8-8dfb-0c50b64e743a.gif)

* _[Sample](https://nhn.github.io/tui.chart/latest/tutorial-example12-01-dynamic-chart-append-and-shift-data-dynamically.html)_

### Set an opacity of series area

You could specify the opacify of filled area, by `areaOpacity` option.
The value of option should be a number from 0 to 1.
If this property is not set, the default value, 0.5 will be set.

```javascript
var options = {
    series: {
        // ...
        areaOpacity: 0.3
    }
};
```
![areaOpacity-v2.10.0](https://user-images.githubusercontent.com/35218826/36881637-75fff1d8-1e12-11e8-8ff2-a140093b8a9c.gif)

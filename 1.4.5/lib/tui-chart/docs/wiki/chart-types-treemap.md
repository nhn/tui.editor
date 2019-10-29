## Treemap chart
* This section describes how to create treemap chart with options.
* You can refer to the [Getting started](getting-started.md) for base installation of Toast UI Chart.

***

### Data type
Treemap chart use the tree data with a hierarchy.

#### Treemap data type

```javascript
var rawData = {
    series: [
        {
            label: 'Documents',
            children: [
                {
                    label: 'docs',
                    children: [
                        {
                            label: 'pages',
                            value: 1.3
                        },
                        {
                            label: 'keynote',
                            value: 2.5
                        }
                    ]
                },
                {
                    label: 'photos',
                    value: 5.5
                }
            ]
        }, {
            label: 'Desktop',
            value: 4.5
        }
    ]
};
```

***

### Creating a basic chart
A treemap chart is graphical representation of hierarchical data by using rectangles.

##### Example

```javascript
tui.chart.treemapChart(container, rawData);
```

![Treemap chart](https://user-images.githubusercontent.com/35218826/36883869-6b00ae0e-1e20-11e8-9d21-16836702ef3e.png)

* _[Sample](https://nhn.github.io/tui.chart/latest/tutorial-example11-01-treemap-chart-basic.html)_

***

### Using `zoomable` option
If you want represent information of child node in data tree to screen, you can use `zoomable` option.
```javascript
var options = {
    series: {
        zoomable: true // default value is true
    }
}
tui.chart.treemapChart(container, rawData, options);
```

![Treemap chart](https://user-images.githubusercontent.com/35218826/36883860-6022bee6-1e20-11e8-8956-8e697ee6516c.gif)

* _[Sample](https://nhn.github.io/tui.chart/latest/tutorial-example11-01-treemap-chart-basic.html)_

### Using `useLeafLabel` option
If you use `useLeafLabel` option, you can represent label of leaf node in data tree.

```javascript
var rawData = {
    series: [
        {
            label: 'Documents',
            children: [
                {
                    label: 'docs',
                    children: [
                        {
                            label: 'pages',
                            value: 1.3
                        },
                        //...
                    ]
                },
                {
                    label: 'photos',
                    value: 5.5
                },
                //...
            ]
        },
        //...
    ]
};
var options = {
    series: {
        zoomable: false,
        useLeafLabel: true // if zoomable option is false, default value is true
    }
}
tui.chart.treemapChart(container, rawData, options);
```

![Treemap chart](https://user-images.githubusercontent.com/35218826/36884442-6ea4214a-1e24-11e8-87de-6dae99eed747.png)

* _[Sample](https://nhn.github.io/tui.chart/latest/tutorial-example11-01-treemap-chart-basic.html)_

***

### Using `colorValue` property and `useColorValue` option

`value` data is representing to size, but `colorValue` data is representing to color.<br>
If you apply `colorValue` property, you can use `useColorValue` option.

```javascript
var rawData = {
    series: [
        {
            label: 'Asia',
            children: [
                {
                    label: 'South Korea',
                    value: 99909,
                    colorValue: 499.81
                },
                {
                    label: 'Japan',
                    value: 364485,
                    colorValue: 335.61
                },
                //...
            ]
        }
    ]
};
var options = {
    series: {
        useColorValue: true
        zoomable: false, // if useColorValue option is true, default value is false
        useLeafLabel: true  // if zoomable option is false, default value is true
    }
}
tui.chart.treemapChart(container, rawData, options);
```

![Treemap chart](https://user-images.githubusercontent.com/35218826/36884484-c013b57c-1e24-11e8-9c65-5710b2859f33.png)

* _[Sample](https://nhn.github.io/tui.chart/latest/tutorial-example11-02-treemap-chart-useColorValue-option.html)_

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

![Treemap chart](https://cloud.githubusercontent.com/assets/2888775/17206633/ad225e54-54eb-11e6-961f-62b08cd68087.png)

* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example11-01-treemap-chart-basic.html)_

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

![Treemap chart](https://cloud.githubusercontent.com/assets/2888775/17205785/69c4eb12-54e7-11e6-8247-f9036da3eea8.gif)

* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example11-01-treemap-chart-basic.html)_

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

![Treemap chart](https://cloud.githubusercontent.com/assets/2888775/17205784/69c2bb62-54e7-11e6-8dbb-50fa094d21ea.gif)

* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example11-01-treemap-chart-basic.html)_

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

![Treemap chart](https://cloud.githubusercontent.com/assets/2888775/17205783/69bdd070-54e7-11e6-8c53-18fdc337381e.gif)

* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example11-02-treemap-chart-useColorValue-option.html)_

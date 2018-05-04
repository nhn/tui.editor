## Plot Feature
* This section introduces about feature of plot.

***

### Hiding line of plot area

Using `plot.hideLine` option, you can hide line of plot area.

##### Example

```javascript
//...
var options = {
    plot: {
        hideLine: true
    }
};
tui.chart.barChart(container, data, options);
```
***

### How to setting plot line and band.

#### Using options
If you want represent event or check time on graph, you can use `plot.bands`, `plot.lines` options.

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
var options = {
    //...
    plot: {
        bands: [
            {
                range: ['08/22/2016 10:40:00', '08/22/2016 11:00:00'],
                color: 'gray',
                opacity: 0.5
            }
        ],
        lines: [
            {
                value: '08/22/2016 10:10:00',
                color: 'red'
            }
        ]
    }
};
```

![image](https://github.nhnent.com/storage/user/429/files/50e96390-6b6a-11e6-8499-019975f8ada3)

* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example03-03-line-chart-coordinate-data.html)_

#### Using options - Assign the same color and opacity to multiple ranges
Put range informations into an array.
Set value of `range` option to this array
```javascript
var options.plot = {
  bands: [
    {
      range: [
        ['08/22/2016 10:10:00', '08/22/2016 10:20:00'],
        ['08/22/2016 10:15:00', '08/22/2016 10:25:00'],
      ],
      color: 'gray',
      opacity: 0.5
    }
  ]
};
```

#### Using API
Using `chart.addPlotBand`, `chart.addPlotLine` APIs, you can dynamically adding bands and lines.

```javascript
var chart = tui.util.lineChart(container, rawData, options);

chart.addPlotBand({
    "range": ["01/01/2016", "03/01/2016"],
    "color": "yellow"
});

chart.addPlotLine({
    "value": "05/01/2016",
    "color": "green"
});
```

![image](https://github.nhnent.com/storage/user/429/files/86eb0430-6b6a-11e6-9295-0358be2f37a1)

### Merge overlapping areas in the same plotBand
When the background color is transparent, the overlapping areas are sequentially displayed.(Yellow Band)  
If you want to display the areas as if it is one area, enable `mergeOverlappingRanges` option.
```javascript
var options.plot = {
  lines: [{
    value: 'May',
    color: 'red'
  }, {
    value: 'Aug',
    color: 'green'
  }],
  bands: [{
    range: [['Apr', 'June'], ['May', 'July']],
    color: 'yellow',
    opacity: 0.4
  }, {
    range: [['Sep', 'Nov'], ['Oct', 'Dec']],
    color: 'brown',
    opacity: 0.4,
    mergeOverlappingRanges: true /* enable */
  }, {
    range: ['Jan', 'Mar'],
    color: 'lightBlue',
    opacity: 0.4
  }]
};
```

![image](https://github.nhnent.com/storage/user/429/files/86eb0430-6b6a-11e6-9295-0358be2f37a1)
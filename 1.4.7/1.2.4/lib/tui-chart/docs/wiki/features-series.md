## Series Feature
* This section introduces about feature of series.

***

### Showing label on series area

Using `series.showLabel` option, you can show label in the series area.

##### Example

```javascript
//...
var options = {
      //...
    series: {
        showLabel: true
    }
};
tui.chart.barChart(container, data, options);
```

![Chart label](https://cloud.githubusercontent.com/assets/2888775/12045566/9480963e-aee9-11e5-9fa8-8ae565bd43a8.png)

* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example01-02-bar-chart-negative-data.html)_

***

### Changing width of series bar

Using `series.barWidth` option, you can resize width of the series bar.<br>
If the optional width wider than the width of a calculated, drawn by the calculated width.

##### Example

```javascript
//...
var options = {
    //...
    series: {
        barWidth: 20
    }
};
tui.chart.barChart(container, data, options);

```

***

### Showing dot on series area

Using `series.showDot` option, you can show dot in the series area.<br>
This option is available in the line, area charts.


##### Example

```javascript
//...
var options = {
      //...
    series: {
        showDot: true
    }
};
tui.chart.lineChart(container, data, options);
```

![Line Chart](https://cloud.githubusercontent.com/assets/2888775/12045582/bf4638e2-aee9-11e5-9e62-d5e66b842165.png)

* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example03-01-line-chart-basic.html)_

***

### Allow select of series

Using `series.allowSelect` option, you can allow select of series.<br>
The color of the selected series will be changed.

##### Example

```javascript
//...
var options = {
      //...
    series: {
        allowSelect: true
    }
};
tui.chart.pieChart(container, data, options);

```

***

### Use color by point in bar type chart

Using `series.colorByPoint` option, you can set series color by each category.<br>
This option is available in the bar, column and boxplot chart.


##### Example

```javascript
//...
var options = {
      //...
    series: {
        colorByPoint: true // default = false
    }
};
tui.chart.lineChart(container, data, options);
```

![Line Chart](https://cloud.githubusercontent.com/assets/2888775/12045582/bf4638e2-aee9-11e5-9e62-d5e66b842165.png)

* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example03-01-line-chart-basic.html)_

***

### Getting selection information of series

If you attach `selectSeries` custom event, you can get series information when selected series.
And attach `uselectSeries` custom event, you can get series information when deselected series.

##### Example

```javascript
var chart = tui.chart.barChart(data);

chart.on('selectSeries', function(info) {
  console.log(info); // {chartType: String, legend: String, legendIndex: Number, index: number}
});

chart.on('unselectSeries', function(info) {
  console.log(info); // {chartType: String, legend: String, legendIndex: Number, index: number}
});
```

***

### Show the label on a particular scale

If you are attaching the `.showSeriesLabel` custom event and using the `.hideSeriesLabel` mtehod, you can set showing label on particular magnification.


##### Example

```javascript
var chart = tui.chart.mapChart(container, data, options);

chart.on('zoom', function(magnification) {
    if (manification > 2) {
        chart.showSeriesLabel();
    } else {
        chart.hideSeriesLabel();
    }
});
```

***


### Show particular series at initial chart rendering

If you want hide particular series at initial chart rendering, add `visible` property to series datum.
<br>
Chart rendering done and hided series legend checkbox clicked, in that time checked series are all included to series component.

##### Example
``` javascript
var rawData = {
    categories: ["June, 2015", "July, 2015", "August, 2015"],
    series: [
        {
            name: "Budget",
            data: [5000, 3000, 5000]
        },
        {
            name: "Income",
            data: [8000, 1000, 7000],
            visible: false // This series is not rendered
                           // and legend check box has unchecked state.
        },
        {
            name: "Expenses",
            data: [4000, 4000, 6000]
        },
        {
            name: "Debt",
            data: [6000, 3000, 3000]
        }
    ]
}
        
```

![2016-12-30 11 56 59](https://cloud.githubusercontent.com/assets/7088720/21559011/23b936ea-ce87-11e6-832f-9a0d60985d3a.png)


***

### Empty data in non coordinate type data

Empty data supported in non coordinate type data.
<br>
You can use `null` in series data to express empty data.

##### Example

```javascript
{
    categories: ['01/01/2016', '02/01/2016', '03/01/2016', '04/01/2015', '05/01/2016', '06/01/2016'],
    series: [
        {
            name: 'Seoul',
            data: [-3.5, -1.1, 4.0, 11.3, 17.5, 21.5]
        },
        {
            name: 'Seattle',
            data: [3.8, 5.6, 7.0, 9.1, 12.4, 15.3]

        },
        {
            name: 'Sydney',
            data: [22.1, null, 20.9, 18.3, 15.2, 12.8]
        },
        {
            name: 'Moskva',
            data: [null, -9.1, -4.1, 4.4, 12.2, 16.3]
        },
        {
            name: 'Jungfrau',
            data: [-13.2, -13.7, -13.1, null, -6.1, -3.2]
        }
    ]
}
        
```
![2016-12-30 12 07 33](https://cloud.githubusercontent.com/assets/7088720/21559071/953cd906-ce88-11e6-89d4-0fba34f82a84.png)

## Chart Feature
* This section introduces about common feature of the chart.

***

### Setting dimension of the chart
Using `chart.width`, `chart.height` options, you can setting dimension of the chart.

##### Example

``` javascript
var options = {
    chart: {
        width: 500,
        height: 400
    }
};
```

***

### Setting title of the chart
Using `chart.title` option, you can set the title of the chart.<br>
The title of the chart is placed at a top of the chart.

##### Example

``` javascript
var options = {
    chart: {
        title: 'Chart Title'
    }
};
```

***

### Title positioning
If you want moving title position, you can use object type `chart.title` option.
In this case, title text is using `chart.title.text` option.
`chart.title.offsetX`, `chart.title.offsetY` options are using for moving a title to four direction like top, bottom, left and right.

##### Example

``` javascript
var options = {
    chart: {
        title: {
            text: 'Usage share of web browsers',
            offsetY: 50
        }
    }
};
```


***

### Formatting for values
Using `chart.format` option, you can format for rendering values.

#### Simple formatting
If you set option to string like '1,000', '0011', '0.000', you can format like examples.

##### Example

```javascript
// raw data
var rawData = {
    series: [
        {
            data: 9000
        }
    ]
};

// formatting to comma
var options = {
    chart: {
        format: '1,000'
    }
};
// 9,000


// formatting to zero fill
var options = {
    chart: {
        format: '01000'
    }
};
// 09000

// formatting to decimal point
var options = {
    chart: {
        format: '0.00'
    }
};
// 9000.00


```

#### Custom formatting
If you set option to function, you can custom formatting for rendering value.

##### Example

```javascript
// raw data
var rawData = {
    series: [
        {
            data: 9000
        }
    ]
};

// custom formatting
// areaType is kind of rendered area like 'series', 'yAxis', 'xAxis', 'circleLegend', 'legend'
// valueType is kind of value like 'value', 'x', 'y', 'r'. (default: value)
// legendName is the representative name of the value
//   (legendName is included if areaType is tooltip, series, or makingSeriesLabel.)
var options = {
    chart: {
        format: function(value, chartType, areaType, valuetype, legendName) {
            if (areaType === 'series') { // formatting at series area
                formattedValue = tui.chart.renderUtil.formatToComma(value);
            } else {
                formattedValue = value;
            }

            return value;
        }
    }
}

```

***

### Resizing chart

Using `.resize` method, you can resize chart.

##### Example

```javascript
//...
var chart = tui.chart.barChart(data);

chart.resize({
    width: 700,
    height: 800
});
```

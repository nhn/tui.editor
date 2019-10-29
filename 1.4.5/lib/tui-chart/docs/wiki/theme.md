## Theme
With the Theme, you can change the design elements of the chart.<br>
All themes will be set based on the default theme.

***

### How to use theme

#### Register theme
Using `tui.chart.registerTheme`, you can register themes.<br>

##### Example

```javascript
var theme = {
    chart: {
        fontFamily: 'Verdana',
        background: {
            color: 'yellow',
            opacity: 1
        }
    }
};
tui.chart.registerTheme('newTheme', theme);
```

#### Using the theme

##### Example

```javascript
//...
var options = {
    theme: 'newTheme'
};
tui.chart.barChart(container, data, options);
```

***

### Setting entire theme

##### Example

```javascript
var theme = {
    chart: {
        fontFamily: 'Verdana',
        background: {
            color: 'yellow',
            opacity: 0.5
        }
    }
};
tui.chart.registerTheme('newTheme', theme);
```

***

### Setting theme of chart title

You can set font-size, font-type, font-weight, color and background.

##### Example

```javascript
var theme = {
    title: {
        fontSize: 20,
        fontFamily: 'Verdana',
        fontWeight: 'bold',
        color: 'blue',
        background: 'yellow'
    }
};
tui.chart.registerTheme('newTheme', theme);
```

***

### Setting theme of axis area

#### Setting theme of axis title

You can set font-size, font-family, font-weight and color.

##### Example
```javascript
var theme = {
    xAxis: {
        title: {
            fontSize: 14,
            fontFamily: 'Verdana',
            fontWeight: 'bold',
            color: 'blue'
        }
    }
};
tui.chart.registerTheme('newTheme', theme);
```

#### Setting theme of axis label

You can set font-size, font-family, font-weight and color.

##### Example
```javascript
var theme = {
    xAxis: {
        label: {
            fontSize: 14,
            fontFamily: 'Verdana',
            fontWeight: 'bold',
            color: 'blue'
        }
    }
};
tui.chart.registerTheme('newTheme', theme);
```

#### Setting tick color of axis

Using `.tickColor` property, you can set tick color of axis.

##### Example
```javascript
var theme = {
    xAxis: {
        tickColor: 'red'
    },
    yAxis: {
        tickColor: 'blue'
    }
};
tui.chart.registerTheme('newTheme', theme);
```

***

### Setting theme of plot area

Plot theme setting is not valid in pie and map charts.

#### Setting line color of plot area

Using `plot.lineColor` property, you can set line color of plot area.

##### Example
```javascript
var theme = {
    plot: {
        lineColor: 'skyblue'
    }
};
tui.chart.registerTheme('newTheme', theme);
```

#### Setting backgorund of plot area

Using `plot.background` property, you can set background color of plot area.

##### Example
```javascript
var theme = {
    plot: {
        background: '#efefef'
    }
};
tui.chart.registerTheme('newTheme', theme);
```

***

### Setting theme of series area, except map and heatmap charts

You can set series colors, border color, selection color.

#### Setting colors of series

Using `series.colors` property, you can set colors of series.

##### Example
```javascript
var theme = {
    series: {
        colors: ['red', 'orange', 'yellow', 'green', 'blue']
    }
};
tui.chart.registerTheme('newTheme', theme);
```

#### Setting border color of series.

Using `series.borderColor` property, you can set border color of series.<br>
This property is available in the column , line, area, combo chart.

##### Example

```javascript
var theme = {
    series: {
        borderColor: 'brown'
    }
};
tui.chart.registerTheme('newTheme', theme);
```

#### Setting selection color of series.

Using `series.selectionColor` property, you can set selection color of series.<br>
This property is available when using `series.allowSelect` option.

##### Example

```javascript
var theme = {
    series: {
        selectionColor: 'brown'
    }
};
tui.chart.registerTheme('newTheme', theme);
```

***

### Setting theme of series area at map, heatmap and treemap charts

You can set start color, end color, mouseover color.

#### Setting start color, end color of series.

Using `series.startColor` property, you can set start color of series.
And using `series.endColor` property, you can set end color of series.

##### Example

```javascript
var theme = {
    series: {
        startColor: '#efefef',
        endColor: 'blue'
    }
};
tui.chart.registerTheme('newTheme', theme);
```

#### Setting mouseover color of series.

Using `series.overColor` property, you can set mouseover color of series.

##### Example

```javascript
var theme = {
    series: {
        overColor: 'lightgreen'
    }
};
tui.chart.registerTheme('newTheme', theme);
```

*** 

#### Setting dot color of line type chart series.

Using `series.dot` property, you can set dot color, stroke, radius and hovered dot styles of line type chart series.

(line type chart series: line, area, radial)

##### Example

```javascript
var theme = {
    series: {
        dot: {
            fillColor: null, // default = null ("color = null" means inherit series color)
            fillOpacity: 1,  // default = 1
            radius: 3, // default = 2
            strokeColor: '#888',
            strokeOpacity: 1, // default = 1
            strokeWidth: 2,        // default = 0
            hover: {
              fillColor: '#aa2',
              fillOpacity: 1, // default = 1
              radius: 10, // default = 4
              strokeColor: '#fff',
              strokeOpacity: 1, // default = 0.8
              strokeWidth: 2 // default = 3
            }
        }
    }
};
tui.chart.registerTheme('newTheme', theme);
```


***
### Setting theme of series for combo chart

If you want setting theme of `series` for combo chart, you can set series type key like `column`, `line` as a child of the `series` property.
And it's contents like theme of `series` in single chart case.

##### Example
```javascript
var theme = {
    series: {
        column: {
            colors: ['red', 'orange', 'yellow', 'green', 'blue']
        },
        line: {
            colors: ['gray', 'black']
        }
    }
};
tui.chart.registerTheme('newTheme', theme);
```
***

### Setting theme of legend area

#### Setting label theme of legend area

You can set font-size, font-family, font-weight and color.

##### Example
```javascript
var theme = {
 legend: {
     label: {
         fontSize: 14,
         fontFamily: 'Verdana',
         fontWeight: 'bold',
         color: 'blue'
     }
 }
};
tui.chart.registerTheme('newTheme', theme);
```

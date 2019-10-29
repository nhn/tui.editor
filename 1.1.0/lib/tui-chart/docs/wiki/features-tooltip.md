## Tooltip Feature
* This section introduces about feature of tooltip.

***

### Tooltip align

Using `tooltip.align` option, you can set base position.<br>

##### Example

```javascript
//...
var options = {
    tooltip: {
        align: 'center top'
    }
};
tui.chart.barChart(container, data, options);
```

***

### Tooltip positioning

Using `tooltip.offsetX`, `tooltip.offsetY` option, you can moving a tooltip to four direction like top, bottom, left and right.
Deprecated `tooltip.position` option.

##### Example

```javascript
//...
var options = {
    tooltip: {
        // Recommended
        offsetX: 10,
        offsetY: -10

        // Deprecated
        position: {
            left: 10,
            top: -10
        }
    }
};
tui.chart.barChart(container, data, options);
```

***

### Using group tooltip

Using `tooltip.grouped` option, you can use group tooltip.

##### Example

```javascript
//...
var options = {
    tooltip: {
        grouped: true
    }
};
tui.chart.lineChart(container, data, options);
```

![Group Tooltip](https://cloud.githubusercontent.com/assets/2888775/12045583/bf466e48-aee9-11e5-9c76-00c3a2a6d687.png)

* _[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example04-02-area-chart-normal-stack.html)_

***

### Setting template of tooltip

Using `tooltip.template` option, you can change template of tooltip.<br>
This option can be set to function, and must returns HTML string.

#### Setting template of basic tooltip

The basic tooltip template receives category and item(```{value: String, legend: String}```) information.

##### Example

```javascript
//...
var options = {
    tooltip: {
        template: function(category, item, categoryTimestamp) {
            var head = '<div>' + category + '</div>',
                body = '<div>' + item.value + ':' + item.legend + '</div>';
            return head + body;
        }
    }
};
tui.chart.lineChart(container, data, options);
```

#### Setting template of group tooltip

The group tooltip template receives category and items(```Array.<{value: String, legend: String}>```) information.

##### Example

```javascript
//...
var options = {
    tooltip: {
        grouped: true,
        template: function(category, items, categoryTimestamp) {
            var head = '<div>' + category + '</div>',
                body = tui.util.map(items, function(item) {
                    return '<div>' + item.value + ':' + item.legend + '</div>'
                }),join('');
            return head + body;
        }
    }
};
tui.chart.lineChart(container, data, options);
```

#### Customizing a category dateFormat by tooltip.template
If category's type is datetime, `tooltip.template` function sends timestamp as a 3rd parameter.
By using it, category could be formatted different to Axes's date format.

##### Example

```javascript
//...
var options = {
    tooltip: {
        template: function(category, item, timestamp) {
            var date = new Date(timestamp);
            var head = '<div>' + date.getYear() + '-' + date.getMonth() + '</div>',
                body = '<div>' + item.value + ':' + item.legend + '</div>';
            return head + body;
        }
    }
};
tui.chart.lineChart(container, data, options);
```

***

### Dynamically change position of tooltip

Using some user event(`.beforeShowTooltip`, `.afterShowTooltip`) and some method(`.setTooltipOffset`, `.resetTooltipOffset`), you can dynamically change position of tooltip.

##### Example

```javascript
//...
var chart = tui.chart.barChart(data);

chart.on('beforeShowTooltip', function(info) {
    if (info.legendIndex === 0) {
        // Recommended
        chart.setTooltipOffset({
            x: 20,
            y: -10
        });

        // Deprecated
        chart.setTooltipPosition({
            left: 20,
            top: -10
        });
    }
});

chart.on('afterShowTooltip', function(info) {
    // Recommended
    chart.resetTooltipOffset();

    // Deprecated
    chart.resetTooltipPosition();
});

```

***
### Control the position of tooltips in multiple charts

Tooltips among multipe charts could be synchronized by few steps

1. Set a public event handler which invokes before showing tooltip.
2. In this handler, call Chart's `showTooltip` API. This will show a tooltip pointing to the same series item.
3. Set a public event handler whick invokes before hiding tooltip
4. In this handler, call Chart's `hideTooltip` API. This will hide a tooltip displaying on screen.

However, `showTooltip`, `hideTooltip` not works on every chart type.
It works on **Bar**, **Column**, **Line**, **Area**, **BoxPlot** Chart.

Here is the example code:
```javascript
chart1 = tui.chart.lineChart(container1, data, options);
chart2 = tui.chart.lineChart(container2, data, options);
chart3 = tui.chart.lineChart(container3, data, options);

chart1.on('afterShowTooltip', function(params) { /* 1 */
    chart2.showTooltip(params); /* 2 */
    chart3.showTooltip(params);
});
chart2.on('afterShowTooltip', function(params) {
    chart1.showTooltip(params);
    chart3.showTooltip(params);
});
chart3.on('afterShowTooltip', function(params) {
    chart1.showTooltip(params);
    chart2.showTooltip(params);
});
chart1.on('beforeHideTooltip', function(params) { /* 3 */
    chart2.hideTooltip(); /* 4 */
    chart3.hideTooltip();
});
chart2.on('beforeHideTooltip', function(params) {
    chart1.hideTooltip();
    chart3.hideTooltip();
});
chart3.on('beforeHideTooltip', function(params) {
    chart1.hideTooltip();
    chart2.hideTooltip();
});
```

## Legend Feature
* This section introduces about feature of legend.

***

### Changing legend align

Using `legend.align` option, you can change align of legend.<br>
Kind of align option values are 'top', 'bottom', 'left' and 'right'.<br>

##### Example

```javascript
//...
var options = {
    legend: {
        align: 'top'
    }
};
tui.chart.barChart(container, data, options);
```

***

### Hiding legend

Using `legend.visible` option, you can hide legend.

##### Example

```javascript
//...
var options = {
    legend: {
        visible: false
    }
};
tui.chart.barChart(container, data, options);
```

***

### Hiding checkbox of legend
Using `legend.showCheckbox` option, you can hide checkbox of legend.<br>
Default value for this option is `true` and will be hidden when you set up `false`.

##### Example

```javascript
//...
var options = {
    legend: {
        showCheckbox: false
    }
};
tui.chart.barChart(container, data, options);
```

***

### Getting information of legend when selecting legend
If you attach `selectLegend` event handler, you can getting information of legend when selecting legend.

##### Example

```javascript
//...
var chart = tui.chart.barChart(data);

chart.on('selectLegend', function(info) {
  console.log(info);
});
```
***

### Limit the maximum length of the legend name shown in the graph.
Using `legend.maxWidth` option, you can omit the legend name beyond the length.

##### Example

```javascript
//...
var options = {
    legend: {
        maxWidth: 70
    }
};
tui.chart.barChart(container, data, options);
```

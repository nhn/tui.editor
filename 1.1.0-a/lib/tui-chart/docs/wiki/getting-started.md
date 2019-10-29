# Getting started

## Download

You should download Toast UI Chart files and associated libraries.
This is dependent on tui.code-snippet, tui.component-effects and Raphael.js.

#### Install with Bower
Using Bower, you can download them easily. The downloaded file will be saved in "bower_components" directory.
If you want to know more about the Bower, please refer to the [http://bower.io/](http://bower.io/).
```
bower install tui-chart
```

## Include files
Now, let's include the downloaded files.

```html
<!-- include application-chart.min.css -->
<link rel="stylesheet" type="text/css" href="bower_components/tui-chart/dist/chart.min.css" />
<!-- include libraries -->
<script src="bower_components/tui-code-snippet/code-snippet.min.js"></script>
<script src="bower_components/raphael/raphael.min.js"></script>
<!-- include chart.min.js -->
<script src="bower_components/tui-chart/dist/chart.min.js"></script>
<!-- include map data (only map chart) -->
<script src="bower_components/tui-chart/dist/maps/world.js"></script>
```

## Create Chart

If you included files, now you can create a chart.
The following example is creating a bar chart.

```javascript
var container = document.getElementById('container-id'),
    data = {
        categories: ['cate1', 'cate2', 'cate3'],
        series: [
            {
                name: 'Legend1',
                data: [20, 30, 50]
            },
            {
                name: 'Legend2',
                data: [40, 40, 60]
            },
            {
                name: 'Legend3',
                data: [60, 50, 10]
            },
            {
                name: 'Legend4',
                data: [80, 10, 70]
            }
        ]
    },
    options = {
        chart: {
            width: 500,
            height: 400,
            title: 'Chart Title'
        },
        yAxis: {
            title: 'Y Axis Title'
        },
        xAxis: {
            title: 'X Axis Title'
        }
    };

tui.chart.barChart(container, data, options);
```


## Map chart
* This section describes how to create a map chart and register map data.
* You can refer to the [Getting started](getting-started.md) for base installation of Toast UI Chart.

***

### How to include map data

Map chart should include the map data, unlike other charts.<br>
Map data provided by default are stored in a 'dist/maps' folder.<br>
You should include map data(ex: ```dist/maps/world.js```) after include libraries and `chart.min.js`.

> If you want register custom map, refer to the bottom.


```html
<!-- include libraries -->
<script src="bower_components/tui-code-snippet/code-snippet.min.js"></script>
<script src="bower_components/tui-component-effects/effects.min.js"></script>
<script src="bower_components/raphael/raphael-min.js"></script>
<!-- include chart.min.js -->
<script src="bower_components/tui-chart/dist/chart.min.js"></script>
<!-- include map data (only map chart) -->
<script src="bower_components/tui-chart/dist/maps/world.js"></script>
```

***

### Data type

Data type of map chart has been affected in map data.

```javascript
var rawData = {
    series: [
        {
            code: 'KR',
            data: 80,
            name: 'South Korea'
        },
        {
            code: 'JP',
            data: 70,
            labelCoordinate: {
                x: 0.6,
                y: 0.7
            }
        },
        //...
    ]
};
```
##### properties
* code: This is key for match with map data.
* name: This is label property, and overrides the attributes of map data.
* labelCoordinate: This is the coordinate property of the label, and overrides the attributes of map data.

***

### Code table for map data

|Map Name|File Name|Code Table Link|Sample Link|
|---|---|---|:---:|
|world|world.js|[Code table of World map](code-table-of-world-map.md)|[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example09-01-map-chart-world-map.html)|
|south-korea|south-korea.js|[Code table of South Korea map](code-table-of-south-korea-map.md)|[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example09-02-map-chart-south-korea-map.html)|
|usa|usa.js|[Code table of USA map](code-table-of-usa-map.md)|[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example09-03-map-chart-usa-map.html)|
|china|china.js|[Code table of China map](code-table-of-china-map.md)|[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example09-04-map-chart-china-map.html)|
|japan|japan.js|[Code table of Japan map](code-table-of-japan-map.md)|[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example09-05-map-chart-japan-map.html)|
|singapore|singapore.js|[Code table of Singapore map](code-table-of-singapore-map.md)|[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example09-06-map-chart-singapore-map.html)|
|thailand|thailand.js|[Code table of Thailand map](code-table-of-thailand-map.md)|[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example09-07-map-chart-thailand-map.html)|
|taiwan|taiwan.js|[Code table of Taiwan map](code-table-of-taiwan-map.md)|[Sample](https://nhnent.github.io/tui.chart/latest/tutorial-example09-08-map-chart-taiwan-map.html)|


***

### Creating a basic chart

##### Example

```javascript
//...
var rawData = {
    series: [
        {
            code: 'KR',
            data: 80,
            name: 'South Korea'
        },
        //...
    ]
};
var options = {
    //...
    map: 'world'
};
tui.chart.mapChart(container, rawData, options);
```

![Map Chart](https://cloud.githubusercontent.com/assets/2888775/12806980/6abdd4b6-cb4e-11e5-8214-bf77df4069d4.png)

***

### Custom map registration and use

#### Custom map registration

You can register custom map by using the `tui.chart.registerMap`

##### Example

```javascript
var mapData = [
    {
        code: 'MAP_CODE',
        name: 'map name',
        path: 'M835.13,346.53L837.55,350.71...', // svg path
        labelCoordinate: {
            x: 0.6,
            y: 0.7
        }
    },
    //...
];
tui.chart.registerMap('customMap', mapData);
```
##### properties
* code: This is key for match with map data.
* name: This is label property, and overrides the attributes of map data.
* path: This is svg path for drawing map.
* labelCoordinate: This is the coordinate property of the label, and overrides the attributes of map data.

#### Using the custom map

You can use the custom map by setting the `map` option.

##### Example

```javascript
var rawData = {
    series: [
        {
            code: 'MAP_CODE',
            data: 100
        },
        //...
   ]
};
var options = {
    //...
    map: 'customMap'
}
tui.chart.mapChart(container, rawData, options);
```

## ![Toast UI Chart](https://cloud.githubusercontent.com/assets/7088720/21300155/e52f31ae-c5e4-11e6-8d6a-d660a48d0d50.png)
ToastUI Chart supports an easy way to draw various and essential charts on your web service.  

## Features

#### Bar Chart
: represents a series of data in the form of a horizontal bar.

![bar chart](https://cloud.githubusercontent.com/assets/2888775/17967950/33635188-6b05-11e6-87ab-cf67929ddb9f.png)

#### Column Chart
: represents a series of data in the form of a vertical bar.

![column chart](https://cloud.githubusercontent.com/assets/2888775/17967954/336be0c8-6b05-11e6-91ef-55b6b003d256.png)

#### Line Chart
: represents a series of data by line segments.

![line chart](https://cloud.githubusercontent.com/assets/2888775/17968200/70490420-6b06-11e6-8a8e-659f5476cda5.png)

#### Area Chart
: represents graphically quantitative data. It is based on the line chart.

![area chart](https://cloud.githubusercontent.com/assets/2888775/17967949/33611576-6b05-11e6-83b4-830ac2102347.png)

#### Bubble Chart
: represents three dimensions of data like x, y position and circle's radius.

![bubble chart](https://cloud.githubusercontent.com/assets/2888775/17967952/336925d6-6b05-11e6-89e5-94698a955352.png)

#### Scatter Chart
: represents tendency or distribution, using two dimensional data like x, y position.

![scatter chart](https://cloud.githubusercontent.com/assets/2888775/17967960/33970370-6b05-11e6-8af1-d590d547ff4c.png)

#### Pie Chart
: represents a circular graph, which has divided sectors have to do with numeric proportion of data size to whole data quantity.

![pie chart](https://cloud.githubusercontent.com/assets/2888775/17967958/3390131c-6b05-11e6-83e1-8cadb7bd58fc.png)

#### Combo Chart (Combination Chart)
: represents combined features of two kinds of charts.

![combo chart](https://cloud.githubusercontent.com/assets/7088720/21537341/bfe0fe0e-cdd3-11e6-95da-83e662a2c646.png)

#### Map Chart
: represents relationships in data by indicating data by color range on a geographical map.

![map chart](https://cloud.githubusercontent.com/assets/2888775/17967956/3389ef0a-6b05-11e6-8bb4-d4a0db8fecf8.png)

#### Heatmap Chart
: represents relationships in data by color range.

![heatmap chart](https://cloud.githubusercontent.com/assets/2888775/17967951/3369065a-6b05-11e6-946a-b25faf213c5d.png)

#### Treemap Chart
: represents hierarchical data by using rectangles and color range.

![treemap chart](https://cloud.githubusercontent.com/assets/2888775/17967959/3392b338-6b05-11e6-88af-b870c9c4c13a.png)

#### Radial Chart
: represents quantitative data with closed poly lines.

![radial chart](https://cloud.githubusercontent.com/assets/7088720/21537366/29c89534-cdd4-11e6-83be-513f9a699368.png)

#### Boxplot Chart
: represents visually displaying groups of numerical data quartiles. Typically used in descriptive statistics.

![boxplot chart](https://cloud.githubusercontent.com/assets/7088720/23646857/2a787816-0356-11e7-96ab-de17fa63c60b.png)

## Documentation
* **API** : [https://nhnent.github.io/tui.chart/latest/](https://nhnent.github.io/tui.chart/latest/)
* **Tutorial** : [https://github.com/nhnent/tui.chart/wiki/tutorial/](https://github.com/nhnent/tui.chart/wiki/tutorial/)
* **Getting started** : [https://github.com/nhnent/tui.chart/wiki/getting-started/](https://github.com/nhnent/tui.chart/wiki/getting-started/)
* **Example** : [https://nhnent.github.io/tui.chart/latest/tutorial-example01-01-bar-chart-basic.html](https://nhnent.github.io/tui.chart/latest/tutorial-example01-01-bar-chart-basic.html)

## Dependency
* [tui-code-snippet](https://github.com/nhnent/tui.code-snippet) >=1.2.5
* [Raphaël](https://github.com/nhnent/raphael) 2.2.0b

## Map Data Attribution
* [https://www.amcharts.com/svg-maps/](https://www.amcharts.com/svg-maps/)

## Test Environment
### PC
* IE8~11
* Edge
* Chrome
* Firefox
* Safari

## Usage
### Use `npm`

Install the latest version using `npm` command:

```
$ npm install tui-chart --save
```

or want to install the each version:

```
$ npm install tui-chart@<version> --save
```

To access as module format in your code:

```javascript
var chart = require('tui-chart');
var barChart = chart.barChart(...);
```

### Use `bower`
Install the latest version using `bower` command:

```
$ bower install tui-chart
```

or want to install the each version:

```
$ bower install tui-chart#<tag>
```

To access as namespace format in your code:

```javascript
var barChart = new tui.chart.barChart(...);
```

## Download/Install
* [Download bundle files from `dist` folder](https://github.com/nhnent/tui.chart/tree/production/dist)
* [Download all sources for each version](https://github.com/nhnent/tui.chart/releases)

## Release History
* [https://github.com/nhnent/tui.chart/releases](https://github.com/nhnent/tui.chart/releases)

## License
[MIT License](https://github.com/nhnent/tui.chart/blob/production/LICENSE).


## Import chart data from existing table element
* This section introduces about import chart data from table element feature.

***

### 1. Preperation
If you want to import chart data from existing table element, you should get table element's reference or table should be attatched to HTML document and it has id property to find.

#### Example
```javascript
// ...
var tableElement = document.getElementById('chart-data-table');
// ...
```
#### OR
```html
<html>
    <head>
        ...
    </head>
    <body>
        <table id='table-for-bar-chart-data'>
            ...
        </table>
    </body>
</html>
```
### 2. Table
Imported chart data from table following [basic data type](chart-types-bar,column.md#basic-data-type).
<br> 
Table rows are parsed to series and columns are parsed to categories.
<br>
(Table's [0, 0] cell is ignored.)

#### Example

<table id='data-table'>
    <thead>
    <tr>
        <th>PowerUsage (%)</th>
        <th>cooling</th>
        <th>heating</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>Spring</td>
        <td>34</td>
        <td>66</td>
    </tr>
    <tr>
        <td>Summer</td>
        <td>92</td>
        <td>8</td>
    </tr>
    <tr>
        <td>Fall</td>
        <td>26</td>
        <td>74</td>
    </tr>
    <tr>
        <td>December</td>
        <td>5</td>
        <td>95</td>
    </tr>
    </tbody>
</table>

```html
<table id='data-table'>
    <thead>
    <tr>
        <th>PowerUsage (%)</th>
        <th>cooling</th>
        <th>heating</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>Spring</td>
        <td>34</td>
        <td>66</td>
    </tr>
    <tr>
        <td>Summer</td>
        <td>92</td>
        <td>8</td>
    </tr>
    <tr>
        <td>Fall</td>
        <td>26</td>
        <td>74</td>
    </tr>
    <tr>
        <td>December</td>
        <td>5</td>
        <td>95</td>
    </tr>
    </tbody>
</table>
```

### 3. Chart data parameter structure
Basically, chart data parameter has `categories` and `series` property.
<br>
Like this.
<br>
```javascript
var data = {
    categories: ['Jan', 'Feb', 'Mar','Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    series: [
        {
            name: 'Seoul',
            data: [[-8.3, 0.3], [-5.8, 3.1], [-0.6, 9.1], [5.8, 16.9], [11.5, 22.6], [16.6, 26.6], [21.2, 28.8], [21.8, 30.0], [15.8, 25.6], [8.3, 19.6], [1.4, 11.1], [-5.2, 3.2]]
        }
    ]
};
```
In this case, you need to import chart data from table. There is no need to define `categories` and `series` property to create chart. Only `table` property required.
<br>
And here is table data importing example of `data` object.

##### Example

```javascript
// ...
var table = document.getElementById('data-table-id');

var data = {
    table: {
        elementId: 'data-table-id' // table element's id
        // or
        // element: table 
    }
};

tui.chart.barChart(container, data);
```
### Result

- Bar chart

![2016-12-30 2 51 24](https://cloud.githubusercontent.com/assets/7088720/21560253/7826ddf0-ce9f-11e6-81f5-a69ec693eb35.png)


- Line chart

![2016-12-30 2 49 41](https://cloud.githubusercontent.com/assets/7088720/21560242/41070566-ce9f-11e6-8fe1-5b7c5f828b40.png)



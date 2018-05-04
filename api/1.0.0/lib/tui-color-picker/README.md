# ColorPicker
Component that used to select and adjust color values

## Documentation
* **API** : [https://nhnent.github.io/tui.color-picker/latest](https://nhnent.github.io/tui.color-picker/latest)
* **Tutorial** : [https://github.com/nhnent/tui.color-picker/wiki](https://github.com/nhnent/tui.color-picker/wiki)
* **Example** :
[https://nhnent.github.io/tui.color-picker/latest/tutorial-example01-basic.html](https://nhnent.github.io/tui.color-picker/latest/tutorial-example01-basic.html)

## Dependency
* [tui-code-snippet](https://github.com/nhnent/tui.code-snippet) >=1.2.5

## Tested Browsers
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
$ npm install tui-color-picker --save
```

or want to install the each version:

```
$ npm install tui-color-picker@<version> --save
```

To access as module format in your code:

```javascript
var colorPicker = require('tui-color-picker');
var instance = colorPicker.create({
    container: document.getElementById('color-picker')
});
```

### Use `bower`
Install the latest version using `bower` command:

```
$ bower install tui-color-picker
```

or want to install the each version:

```
$ bower install tui-color-picker#<tag>
```

To access as namespace format in your code:

```javascript
var instance = tui.colorPicker.create({
    container: document.getElementById('color-picker')
});
```
### Download
* [Download bundle files from `dist` folder](https://github.com/nhnent/tui.color-pditor/tree/production/dist)
* [Download all sources for each version](https://github.com/nhnent/tui.color-picker/releases)

## License
[MIT LICENSE](https://github.com/nhnent/tui.color-picker/raw/master/LICENSE)

# TOAST UI Component : Color Picker
> Component that selects a specific color and gets a color code.

[![GitHub release](https://img.shields.io/github/release/nhnent/tui.color-picker.svg)](https://github.com/nhnent/tui.color-picker/releases/latest)
[![npm](https://img.shields.io/npm/v/tui-color-picker.svg)](https://www.npmjs.com/package/tui-color-picker)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg)](https://github.com/nhnent/tui.project-name/labels/help%20wanted)
[![code with hearth by NHN Entertainment](https://img.shields.io/badge/%3C%2F%3E%20with%20%E2%99%A5%20by-NHN%20Entertainment-ff1414.svg)](https://github.com/nhnent)


## 🚩 Table of Contents
* [Collect statistics on the use of open source](#collect-statistics-on-the-use-of-open-source)
* [Browser Support](#-browser-support)
* [Features](#-features)
* [Examples](#-examples)
* [Install](#-install)
    * [Via Package Manager](#via-package-manager)
    * [Via Contents Delivery Network (CDN)](#via-contents-delivery-network-cdn)
    * [Download Source Files](#download-source-files)
* [Usage](#-usage)
    * [HTML](#html)
    * [JavaScript](#javascript)
* [Pull Request Steps](#-pull-request-steps)
    * [Setup](#setup)
    * [Develop](#develop)
    * [Pull Request Steps](#pull-request)
* [Documents](#-documents)
* [Contributing](#-contributing)
* [Dependency](#-dependency)
* [License](#-license)


## Collect statistics on the use of open source

TOAST UI ColorPicker applies Google Analytics (GA) to collect statistics on the use of open source, in order to identify how widely TOAST UI ColorPicker is used throughout the world. It also serves as important index to determine the future course of projects. location.hostname (e.g. > “ui.toast.com") is to be collected and the sole purpose is nothing but to measure statistics on the usage. To disable GA, use the following `usageStatistics` options when creating the instance.

```js
var options = {
    ...
    usageStatistics: false
}
var instance = tui.colorPicker.create(options);
```

Or, include `tui-code-snippet.js` (**v1.5.0** or **later**) and then immediately write the options as follows:

```js
tui.usageStatistics = false;
```


## 🌏 Browser Support
| <img src="https://user-images.githubusercontent.com/1215767/34348387-a2e64588-ea4d-11e7-8267-a43365103afe.png" alt="Chrome" width="16px" height="16px" /> Chrome | <img src="https://user-images.githubusercontent.com/1215767/34348590-250b3ca2-ea4f-11e7-9efb-da953359321f.png" alt="IE" width="16px" height="16px" /> Internet Explorer | <img src="https://user-images.githubusercontent.com/1215767/34348380-93e77ae8-ea4d-11e7-8696-9a989ddbbbf5.png" alt="Edge" width="16px" height="16px" /> Edge | <img src="https://user-images.githubusercontent.com/1215767/34348394-a981f892-ea4d-11e7-9156-d128d58386b9.png" alt="Safari" width="16px" height="16px" /> Safari | <img src="https://user-images.githubusercontent.com/1215767/34348383-9e7ed492-ea4d-11e7-910c-03b39d52f496.png" alt="Firefox" width="16px" height="16px" /> Firefox |
| :---------: | :---------: | :---------: | :---------: | :---------: |
| Yes | 8+ | Yes | Yes | Yes |


## 🎨 Features
* Supports color palette.
* Supports 16 basic color set.
* Supports custom events.


## 🐾 Examples
* [Basic](https://nhnent.github.io/tui.color-picker/latest/tutorial-example01-basic) : Example using default options.


## 💾 Install

TOAST UI products can be used by using the package manager or downloading the source directly.
However, we highly recommend using the package manager.

### Via Package Manager

TOAST UI products are registered in two package managers, [npm](https://www.npmjs.com/) and [bower](https://bower.io/).
You can conveniently install it using the commands provided by each package manager.
When using npm, be sure to use it in the environment [Node.js](https://nodejs.org/ko/) is installed.

#### npm

``` sh
$ npm install --save tui-color-picker # Latest version
$ npm install --save tui-color-picker@<version> # Specific version
```

#### bower

``` sh
$ bower install tui-color-picker # Latest version
$ bower install tui-color-picker#<tag> # Specific version
```

### Via Contents Delivery Network (CDN)
TOAST UI products are available over the CDN powered by [TOAST Cloud](https://www.toast.com).

You can use the CDN as below.

```html
<script src="https://uicdn.toast.com/tui-color-picker/latest/tui-color-picker.js"></script>
<link rel="stylesheet" type="text/css" href="https://uicdn.toast.com/tui-color-picker/latest/tui-color-picker.css">
```

If you want to use a specific version, use the tag name instead of `latest` in the url's path.

The CDN directory has the following structure.

```
tui-color-picker/
├─ latest/
│  ├─ tui-color-picker.js
│  ├─ tui-color-picker.min.js
│  └─ tui-color-picker.css
├─ v2.1.0/
│  ├─ ...
```

### Download Source Files
* [Download bundle files](https://github.com/nhnent/tui.color-picker/tree/production/dist)
* [Download all sources for each version](https://github.com/nhnent/tui.color-picker/releases)


## 🔨 Usage

### HTML

Add the container element to create the component as an option.

``` html
<div id="tui-color-picker-conatiner"></div>
```

### JavaScript

This component does not use the instance created through the constructor function.
First, you should import the module using one of the following ways depending on your environment.

#### Using namespace in browser environment
``` javascript
var colorPicker = tui.colorPicker;
```

#### Using module format in node environment
``` javascript
var colorPicker = require('tui-color-picker'); /* CommonJS */
```

``` javascript
import colorPicker from 'tui-color-picker'; /* ES6 */
```


Then you should call the `create` method with [options](https://nhnent.github.io/tui.color-picker/latest/ColorPicker) to get instance.
After creating an instance, you can call various APIs.

``` javascript
var container = document.getElementById('tui-color-picker-conatiner');
var instance = colorPicker.create({
    container: container,
    ...
});

instance.getColor();
```

For more information about the API, please see [here](https://nhnent.github.io/tui.color-picker/latest/ColorPicker).


## 🔧 Pull Request Steps

TOAST UI products are open source, so you can create a pull request(PR) after you fix issues.
Run npm scripts and develop yourself with the following process.

### Setup

Fork `develop` branch into your personal repository.
Clone it to local computer. Install node modules.
Before starting development, you should check to haveany errors.

``` sh
$ git clone https://github.com/{your-personal-repo}/tui.color-picker.git
$ cd tui.color-picker
$ npm install
$ npm run test
```

### Develop

Let's start development!
You can see your code is reflected as soon as you saving the codes by running a server.
Don't miss adding test cases and then make green rights.

#### Run webpack-dev-server

``` sh
$ npm run serve
$ npm run serve:ie8 # Run on Internet Explorer 8
```

#### Run karma test

``` sh
$ npm run test
```

### Pull Request

Before PR, check to test lastly and then check any errors.
If it has no error, commit and then push it!

For more information on PR's step, please see links of Contributing section.


## 📙 Documents
* [Getting Started](https://github.com/nhnent/tui.color-picker/blob/production/docs/getting-started.md)
* [Tutorials](https://github.com/nhnent/tui.color-picker/tree/production/docs)
* [APIs](https://nhnent.github.io/tui.color-picker/latest)

You can also see the older versions of API page on the [releases page](https://github.com/nhnent/tui.color-picker/releases).


## 💬 Contributing
* [Code of Conduct](https://github.com/nhnent/tui.color-picker/blob/production/CODE_OF_CONDUCT.md)
* [Contributing guideline](https://github.com/nhnent/tui.color-picker/blob/production/CONTRIBUTING.md)
* [Issue guideline](https://github.com/nhnent/tui.color-picker/blob/production/docs/ISSUE_TEMPLATE.md)
* [Commit convention](https://github.com/nhnent/tui.color-picker/blob/production/docs/COMMIT_MESSAGE_CONVENTION.md)


## 🔩 Dependency
* [tui-code-snippet](https://github.com/nhnent/tui.code-snippet) >=1.5.0


## 📜 License

This software is licensed under the [MIT](https://github.com/nhnent/tui.color-picker/blob/production/LICENSE) © [NHN Entertainment](https://github.com/nhnent).

/**
 * Toast UI Colorpicker
 * @version 1.0.1
 */
!function e(t,o,n){function i(s,l){if(!o[s]){if(!t[s]){var a="function"==typeof require&&require;if(!l&&a)return a(s,!0);if(r)return r(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var u=o[s]={exports:{}};t[s][0].call(u.exports,function(e){var o=t[s][1][e];return i(o?o:e)},u,u.exports,e,t,o,n)}return o[s].exports}for(var r="function"==typeof require&&require,s=0;s<n.length;s++)i(n[s]);return i}({1:[function(e,t,o){"use strict";tui.util.defineNamespace("tui.component.colorpicker",{domutil:e("./src/js/core/domutil"),domevent:e("./src/js/core/domevent"),Collection:e("./src/js/core/collection"),View:e("./src/js/core/view"),Drag:e("./src/js/core/drag"),create:e("./src/js/factory"),Palette:e("./src/js/palette"),Slider:e("./src/js/slider"),colorutil:e("./src/js/colorutil"),svgvml:e("./src/js/svgvml")})},{"./src/js/colorutil":2,"./src/js/core/collection":3,"./src/js/core/domevent":4,"./src/js/core/domutil":5,"./src/js/core/drag":6,"./src/js/core/view":7,"./src/js/factory":8,"./src/js/palette":10,"./src/js/slider":11,"./src/js/svgvml":12}],2:[function(e,t,o){"use strict";var n=/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i,i={leadingZero:function(e,t){var o="",n=0;if((e+"").length>t)return e+"";for(;t-1>n;n+=1)o+="0";return(o+e).slice(-1*t)},isValidRGB:function(e){return n.test(e)},hexToRGB:function(e){var t,o,n;return i.isValidRGB(e)?(e=e.substring(1),t=parseInt(e.substr(0,2),16),o=parseInt(e.substr(2,2),16),n=parseInt(e.substr(4,2),16),[t,o,n]):!1},rgbToHEX:function(e,t,o){var n="#"+i.leadingZero(e.toString(16),2)+i.leadingZero(t.toString(16),2)+i.leadingZero(o.toString(16),2);return i.isValidRGB(n)?n:!1},rgbToHSV:function(e,t,o){var n,i,r,s,l,a;if(e/=255,t/=255,o/=255,n=Math.max(e,t,o),i=Math.min(e,t,o),l=n,a=n-i,s=0===n?0:a/n,n===i)r=0;else{switch(n){case e:r=(t-o)/a+(o>t?6:0);break;case t:r=(o-e)/a+2;break;case o:r=(e-t)/a+4}r/=6}return[Math.round(360*r),Math.round(100*s),Math.round(100*l)]},hsvToRGB:function(e,t,o){var n,i,r,s,l,a,c,u;if(e=Math.max(0,Math.min(360,e)),t=Math.max(0,Math.min(100,t)),o=Math.max(0,Math.min(100,o)),t/=100,o/=100,0===t)return n=i=r=o,[Math.round(255*n),Math.round(255*i),Math.round(255*r)];switch(e/=60,s=Math.floor(e),l=e-s,a=o*(1-t),c=o*(1-t*l),u=o*(1-t*(1-l)),s){case 0:n=o,i=u,r=a;break;case 1:n=c,i=o,r=a;break;case 2:n=a,i=o,r=u;break;case 3:n=a,i=c,r=o;break;case 4:n=u,i=a,r=o;break;default:n=o,i=a,r=c}return[Math.round(255*n),Math.round(255*i),Math.round(255*r)]}};t.exports=i},{}],3:[function(e,t,o){(function(e){"use strict";function o(e){this.items={},this.length=0,s(e)&&(this.getItemID=e)}var n=e.tui.util,i=n.forEachOwnProperties,r=n.forEachArray,s=n.isFunction,l=n.isObject,a=Array.prototype.slice;o.and=function(e){var t;return e=a.call(arguments),t=e.length,function(o){for(var n=0;t>n;n+=1)if(!e[n].call(null,o))return!1;return!0}},o.or=function(e){var t;return e=a.call(arguments),t=e.length,function(o){for(var n=1,i=e[0].call(null,o);t>n;n+=1)i=i||e[n].call(null,o);return i}},o.merge=function(e){var t=a.call(arguments),i={},s=new o(t[0].getItemID),l=n.extend;return r(t,function(e){l(i,e.items)}),s.items=i,s.length=n.keys(s.items).length,s},o.prototype.getItemID=function(e){return e._id+""},o.prototype.add=function(e){var t,o;return arguments.length>1?void r(a.call(arguments),function(e){this.add(e)},this):(t=this.getItemID(e),o=this.items,o[t]||(this.length+=1),void(o[t]=e))},o.prototype.remove=function(e){var t,o,i=[];return this.length?arguments.length>1?i=n.map(a.call(arguments),function(e){return this.remove(e)},this):(t=this.items,l(e)&&(e=this.getItemID(e)),t[e]?(this.length-=1,o=t[e],delete t[e],o):i):i},o.prototype.clear=function(){this.items={},this.length=0},o.prototype.has=function(e){var t,o;return this.length?(t=s(e),o=!1,t?this.each(function(t){return e(t)===!0?(o=!0,!1):void 0}):(e=l(e)?this.getItemID(e):e,o=n.isExisty(this.items[e])),o):!1},o.prototype.doWhenHas=function(e,t,o){var i=this.items[e];n.isExisty(i)&&t.call(o||this,i)},o.prototype.find=function(e){var t=new o;return this.hasOwnProperty("getItemID")&&(t.getItemID=this.getItemID),this.each(function(o){e(o)===!0&&t.add(o)}),t},o.prototype.groupBy=function(e,t){var i,r,s={},l=n.isFunction,a=l(e),c=this.getItemID;if(n.isArray(e)){if(n.forEachArray(e,function(e){s[e+""]=new o(c)}),!t)return s;e=t,a=!0}return this.each(function(t){a?r=e(t):(r=t[e],l(r)&&(r=r.apply(t))),i=s[r],i||(i=s[r]=new o(c)),i.add(t)}),s},o.prototype.single=function(){var e;return this.each(function(t){return e=t,!1},this),e},o.prototype.sort=function(e){var t=[];return this.each(function(e){t.push(e)}),s(e)&&(t=t.sort(e)),t},o.prototype.each=function(e,t){i(this.items,e,t||this)},o.prototype.toArray=function(){return this.length?n.map(this.items,function(e){return e}):[]},t.exports=o}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],4:[function(e,t,o){(function(e){"use strict";var o=e.tui.util,n=o.browser,i="_evt",r={START:["touchstart","mousedown"],END:{mousedown:"mouseup",touchstart:"touchend",pointerdown:"touchend",MSPointerDown:"touchend"},MOVE:{mousedown:"mousemove",touchstart:"touchmove",pointerdown:"touchmove",MSPointerDown:"touchmove"}},s={on:function(e,t,n,i){return o.isString(t)?void o.forEach(t.split(" "),function(t){s._on(e,t,n,i)}):void o.forEachOwnProperties(t,function(t,o){s._on(e,o,t,n)})},_on:function(e,t,n,r){var l,a,c;l=t+o.stamp(n)+(r?"_"+o.stamp(r):""),e[i]&&e[i][l]||(a=function(t){n.call(r||e,t||window.event)},c=a,"addEventListener"in e?"mouseenter"===t||"mouseleave"===t?(a=function(t){t=t||window.event,s._checkMouse(e,t)&&c(t)},e.addEventListener("mouseenter"===t?"mouseover":"mouseout",a,!1)):("mousewheel"===t&&e.addEventListener("DOMMouseScroll",a,!1),e.addEventListener(t,a,!1)):"attachEvent"in e&&e.attachEvent("on"+t,a),e[i]=e[i]||{},e[i][l]=a)},off:function(e,t,n,i){return o.isString(t)?void o.forEach(t.split(" "),function(t){s._off(e,t,n,i)}):void o.forEachOwnProperties(t,function(t,o){s._off(e,o,t,n)})},_off:function(e,t,n,r){var s=t+o.stamp(n)+(r?"_"+o.stamp(r):""),l=e[i]&&e[i][s];if(l){if("removeEventListener"in e)"mouseenter"===t||"mouseleave"===t?e.removeEventListener("mouseenter"===t?"mouseover":"mouseout",l,!1):("mousewheel"===t&&e.removeEventListener("DOMMouseScroll",l,!1),e.removeEventListener(t,l,!1));else if("detachEvent"in e)try{e.detachEvent("on"+t,l)}catch(a){}if(delete e[i][s],!o.keys(e[i]).length)return o.browser.msie&&o.browser.version<9?void(e[i]=null):void delete e[i]}},once:function(e,t,n,i){function r(){n.apply(i||e,arguments),l._off(e,t,r,i)}var l=this;return o.isObject(t)?void o.forEachOwnProperties(t,function(t,o){s.once(e,o,t,n)}):void s.on(e,t,r,i)},stopPropagation:function(e){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0},preventDefault:function(e){e.preventDefault?e.preventDefault():e.returnValue=!1},stop:function(e){s.preventDefault(e),s.stopPropagation(e)},disableScrollPropagation:function(e){s.on(e,"mousewheel MozMousePixelScroll",s.stopPropagation)},disableClickPropagation:function(e){s.on(e,r.START.join(" ")+" click dblclick",s.stopPropagation)},getMousePosition:function(e,t){var o;return t?(o=t.getBoundingClientRect(),[e.clientX-o.left-t.clientLeft,e.clientY-o.top-t.clientTop]):[e.clientX,e.clientY]},getWheelDelta:function(e){var t=0;return e.wheelDelta&&(t=e.wheelDelta/120),e.detail&&(t=-e.detail/3),t},_checkMouse:function(e,t){var o=t.relatedTarget;if(!o)return!0;try{for(;o&&o!==e;)o=o.parentNode}catch(n){return!1}return o!==e},trigger:function(e,t,n){var i=/(mouse|click)/;o.isUndefined(n)&&i.exec(t)&&(n=s.mouseEvent(t)),e.dispatchEvent?e.dispatchEvent(n):e.fireEvent&&e.fireEvent("on"+t,n)},mouseEvent:function(e,t){var i,r;return r=o.extend({bubbles:!0,cancelable:"mousemove"!==e,view:window,wheelDelta:0,detail:0,screenX:0,screenY:0,clientX:0,clientY:0,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,button:0,relatedTarget:void 0},t),n.msie&&n.version<9&&delete r.wheelDelta,"function"==typeof document.createEvent?(i=document.createEvent("MouseEvents"),i.initMouseEvent(e,r.bubbles,r.cancelable,r.view,r.detail,r.screenX,r.screenY,r.clientX,r.clientY,r.ctrlKey,r.altKey,r.shiftKey,r.metaKey,r.button,document.body.parentNode)):document.createEventObject&&(i=document.createEventObject(),o.forEach(r,function(e,t){i[t]=e},this),i.button={0:1,1:4,2:2}[i.button]||i.button),i},getMouseButton:function(e){var t,o="0,1,3,5,7",n="2,6",i="4";return document.implementation.hasFeature("MouseEvents","2.0")?e.button:(t=e.button+"",~o.indexOf(t)?0:~n.indexOf(t)?2:~i.indexOf(t)?1:void 0)}};t.exports=s}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],5:[function(e,t,o){(function(o){"use strict";function n(e){return e.replace(/^\s\s*/,"").replace(/\s\s*$/,"")}var i,r=e("./domevent"),s=e("./collection"),l=o.tui.util,a="_pos",c=/^auto$|^$|%/;i={appendHTMLElement:function(e,t,o){var n;return o=o||"",n=document.createElement(e),n.className=o,t?t.appendChild(n):document.body.appendChild(n),n},remove:function(e){e&&e.parentNode&&e.parentNode.removeChild(e)},get:function(e){return document.getElementById(e)},_matcher:function(e,t){var o=/^\./,n=/^#/;return o.test(t)?i.hasClass(e,t.replace(".","")):n.test(t)?e.id===t.replace("#",""):e.nodeName.toLowerCase()===t.toLowerCase()},find:function(e,t,o){function n(e,t){for(var l,u=e.childNodes,d=0,f=u.length;f>d;d+=1)if(l=u[d],"#text"!==l.nodeName)if(i._matcher(l,t)){if((c&&o(l)||!c)&&r.push(l),a){s=!0;break}}else if(l.childNodes.length>0&&(n(l,t),s))break}var r=[],s=!1,a=l.isUndefined(o)||o===!1,c=l.isFunction(o);return l.isString(t)&&(t=i.get(t)),t=t||window.document.body,n(t,e),a?r[0]||null:r},closest:function(e,t){var o=e.parentNode;if(i._matcher(e,t))return e;for(;o&&o!==window.document.body;){if(i._matcher(o,t))return o;o=o.parentNode}},text:function(e){var t="",o=0,n=e.nodeType;if(n){if(1===n||9===n||11===n){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)t+=i.text(e)}else if(3===n||4===n)return e.nodeValue}else for(;e[o];o+=1)t+=i.text(e[o]);return t},setData:function(e,t,o){return"dataset"in e?void(e.dataset[t]=o):void e.setAttribute("data-"+t,o)},getData:function(e,t){return"dataset"in e?e.dataset[t]:e.getAttribute("data-"+t)},hasClass:function(e,t){var o;return l.isUndefined(e.classList)?(o=i.getClass(e),o.length>0&&new RegExp("(^|\\s)"+t+"(\\s|$)").test(o)):e.classList.contains(t)},addClass:function(e,t){var o;l.isUndefined(e.classList)?i.hasClass(e,t)||(o=i.getClass(e),i.setClass(e,(o?o+" ":"")+t)):l.forEachArray(t.split(" "),function(t){e.classList.add(t)})},setClass:function(e,t){l.isUndefined(e.className.baseVal)?e.className=t:e.className.baseVal=t},removeClass:function(e,t){var o="";l.isUndefined(e.classList)?(o=(" "+i.getClass(e)+" ").replace(" "+t+" "," "),i.setClass(e,n(o))):e.classList.remove(t)},getClass:function(e){return e&&e.className?l.isUndefined(e.className.baseVal)?e.className:e.className.baseVal:""},getStyle:function(e,t){var o,n=e.style[t]||e.currentStyle&&e.currentStyle[t];return n&&"auto"!==n||!document.defaultView||(o=document.defaultView.getComputedStyle(e,null),n=o?o[t]:null),"auto"===n?null:n},getComputedStyle:function(e){var t=document.defaultView;return t&&t.getComputedStyle?document.defaultView.getComputedStyle(e):{getPropertyValue:function(t){var o=/(\-([a-z]){1})/g;return"float"===t&&(t="styleFloat"),o.test(t)&&(t=t.replace(o,function(){return arguments[2].toUpperCase()})),e.currentStyle[t]?e.currentStyle[t]:null}}},setPosition:function(e,t,o){t=l.isUndefined(t)?0:t,o=l.isUndefined(o)?0:o,e[a]=[t,o],e.style.left=t+"px",e.style.top=o+"px"},getPosition:function(e,t){var o,n,i;return t&&(e[a]=null),e[a]?e[a]:(o=0,n=0,(c.test(e.style.left)||c.test(e.style.top))&&"getBoundingClientRect"in e?(i=e.getBoundingClientRect(),o=i.left,n=i.top):(o=parseFloat(e.style.left||0),n=parseFloat(e.style.top||0)),[o,n])},getSize:function(e){var t,o=i.getStyle(e,"width"),n=i.getStyle(e,"height");return(c.test(o)||c.test(n))&&"getBoundingClientRect"in e?(t=e.getBoundingClientRect(),o=t.width,n=t.height):(o=parseFloat(o||0),n=parseFloat(n||0)),[o,n]},testProp:function(e){for(var t=document.documentElement.style,o=0,n=e.length;n>o;o+=1)if(e[o]in t)return e[o];return!1},getFormData:function(e){var t=new s(function(){return this.length}),o=function(e){return!e.disabled},n={};return t.add.apply(t,i.find("input",e,o).concat(i.find("select",e,o)).concat(i.find("textarea",e,o))),t=t.groupBy(function(e){return e&&e.getAttribute("name")||"_other"}),l.forEach(t,function(e,t){"_other"!==t&&e.each(function(o){var r=o.nodeName.toLowerCase(),s=o.type,a=[];"radio"===s?a=[e.find(function(e){return e.checked}).toArray().pop()]:"checkbox"===s?a=e.find(function(e){return e.checked}).toArray():"select"===r?e.find(function(e){return!!e.childNodes.length}).each(function(e){a=a.concat(i.find("option",e,function(e){return e.selected}))}):a=e.find(function(e){return""!==e.value}).toArray(),a=l.map(a,function(e){return e.value}),a.length?1===a.length&&(a=a[0]):a="",n[t]=a})}),n}};var u=i.testProp(["userSelect","WebkitUserSelect","OUserSelect","MozUserSelect","msUserSelect"]),d="onselectstart"in document,f="";i.disableTextSelection=function(){return d?function(){r.on(window,"selectstart",r.preventDefault)}:function(){var e=document.documentElement.style;f=e[u],e[u]="none"}}(),i.enableTextSelection=function(){return d?function(){r.off(window,"selectstart",r.preventDefault)}:function(){document.documentElement.style[u]=f}}(),i.disableImageDrag=function(){r.on(window,"dragstart",r.preventDefault)},i.enableImageDrag=function(){r.off(window,"dragstart",r.preventDefault)},t.exports=i}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./collection":3,"./domevent":4}],6:[function(e,t,o){(function(o){"use strict";function n(e,t){s.on(t,"mousedown",this._onMouseDown,this),this.options=i.extend({distance:10},e),this.container=t,this._isMoved=!1,this._distance=0,this._dragStartFired=!1,this._dragStartEventData=null}var i=o.tui.util,r=e("./domutil"),s=e("./domevent");n.prototype.destroy=function(){s.off(this.container,"mousedown",this._onMouseDown,this),this.options=this.container=this._isMoved=this._distance=this._dragStartFired=this._dragStartEventData=null},n.prototype._toggleDragEvent=function(e){var t,n,i=this.container;e?(t="on",n="disable"):(t="off",n="enable"),r[n+"TextSelection"](i),r[n+"ImageDrag"](i),s[t](o.document,{mousemove:this._onMouseMove,mouseup:this._onMouseUp},this)},n.prototype._getEventData=function(e){return{target:e.target||e.srcElement,originEvent:e}},n.prototype._onMouseDown=function(e){0===s.getMouseButton(e)&&(this._distance=0,this._dragStartFired=!1,this._dragStartEventData=this._getEventData(e),this._toggleDragEvent(!0))},n.prototype._onMouseMove=function(e){var t=this.options.distance;return s.preventDefault(e),this._isMoved=!0,this._distance<t?void(this._distance+=1):this._dragStartFired||(this._dragStartFired=!0,this.invoke("dragStart",this._dragStartEventData))?void this.fire("drag",this._getEventData(e)):void this._toggleDragEvent(!1)},n.prototype._onMouseUp=function(e){return this._toggleDragEvent(!1),this._isMoved?(this._isMoved=!1,void this.fire("dragEnd",this._getEventData(e))):void this.fire("click",this._getEventData(e))},i.CustomEvents.mixin(n),t.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./domevent":4,"./domutil":5}],7:[function(e,t,o){(function(o){"use strict";function n(e,t){var o=i.stamp(this);e=e||{},i.isUndefined(t)&&(t=r.appendHTMLElement("div")),r.addClass(t,"tui-view-"+o),this.id=o,this.container=t,this.childs=new s(function(e){return i.stamp(e)}),this.parent=null}var i=o.tui.util,r=e("./domutil"),s=e("./collection");n.prototype.addChild=function(e,t){t&&t.call(e,this),e.parent=this,this.childs.add(e)},n.prototype.removeChild=function(e,t){var o=i.isNumber(e)?this.childs.items[e]:e;e=i.stamp(o),t&&t.call(o,this),this.childs.remove(e)},n.prototype.render=function(){this.childs.each(function(e){e.render()})},n.prototype.recursive=function(e,t){i.isFunction(e)&&(t||e(this),this.childs.each(function(t){t.recursive(e)}))},n.prototype.resize=function(){for(var e=Array.prototype.slice.call(arguments),t=this.parent;t;)i.isFunction(t._onResize)&&t._onResize.apply(t,e),t=t.parent},n.prototype._beforeDestroy=function(){},n.prototype._destroy=function(){this._beforeDestroy(),this.childs.clear(),this.container.innerHTML="",this.id=this.parent=this.childs=this.container=null},n.prototype.destroy=function(e){this.childs.each(function(e){e.destroy(!0),e._destroy()}),e||this._destroy()},n.prototype.getViewBound=function(){var e=this.container,t=r.getPosition(e),o=r.getSize(e);return{x:t[0],y:t[1],width:o[0],height:o[1]}},t.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./collection":3,"./domutil":5}],8:[function(e,t,o){(function(o){"use strict";function n(e){alert(e)}function i(e){var t;return this instanceof i?(e=this.options=r.extend({container:null,color:"#f8f8f8",preset:["#181818","#282828","#383838","#585858","#b8b8b8","#d8d8d8","#e8e8e8","#f8f8f8","#ab4642","#dc9656","#f7ca88","#a1b56c","#86c1b9","#7cafc2","#ba8baf","#a16946"],cssPrefix:"tui-colorpicker-",detailTxt:"Detail"},e),e.container?(t=this.layout=new l(e,e.container),this.palette=new a(e,t.container),this.palette.on({_selectColor:this._onSelectColorInPalette,_toggleSlider:this._onToggleSlider},this),this.slider=new c(e,t.container),this.slider.on("_selectColor",this._onSelectColorInSlider,this),t.addChild(this.palette),t.addChild(this.slider),void this.render(e.color)):void n("Colorpicker(): need container option.")):new i(e)}var r=o.tui.util,s=e("./colorutil"),l=e("./layout"),a=e("./palette"),c=e("./slider");i.prototype._onSelectColorInPalette=function(e){var t=e.color,o=this.options;return s.isValidRGB(t)?void(o.color!==t&&(o.color=t,this.render(t),this.fire("selectColor",{color:t,origin:"palette"}))):void this.render()},i.prototype._onToggleSlider=function(){this.slider.toggle(!this.slider.isVisible())},i.prototype._onSelectColorInSlider=function(e){var t=e.color,o=this.options;o.color!==t&&(o.color=t,this.palette.render(t),this.fire("selectColor",{color:t,origin:"slider"}))},i.prototype.setColor=function(e){s.isValidRGB(e)||n("Colorpicker#setColor(): need valid hex string color value"),this.options.color=e,this.render(e)},i.prototype.getColor=function(){return this.options.color},i.prototype.toggle=function(e){this.layout.container.style.display=e?"block":"none"},i.prototype.render=function(e){this.layout.render(e||this.options.color)},i.prototype.destroy=function(){this.layout.destroy(),this.options.container.innerHTML="",this.layout=this.slider=this.palette=this.options=null},r.CustomEvents.mixin(i),t.exports=i}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./colorutil":2,"./layout":9,"./palette":10,"./slider":11}],9:[function(e,t,o){(function(o){"use strict";function n(e,t){this.options=i.extend({cssPrefix:"tui-colorpicker-"},e),t=r.appendHTMLElement("div",t,this.options.cssPrefix+"container"),s.call(this,e,t),this.render()}var i=o.tui.util,r=e("./core/domutil"),s=e("./core/view");i.inherit(n,s),n.prototype.render=function(e){this.recursive(function(t){t.render(e)},!0)},t.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./core/domutil":5,"./core/view":7}],10:[function(e,t,o){(function(o){"use strict";function n(e,t){this.options=i.extend({cssPrefix:"tui-colorpicker-",preset:["#181818","#282828","#383838","#585858","#B8B8B8","#D8D8D8","#E8E8E8","#F8F8F8","#AB4642","#DC9656","#F7CA88","#A1B56C","#86C1B9","#7CAFC2","#BA8BAF","#A16946"],detailTxt:"Detail"},e),t=r.appendHTMLElement("div",t,this.options.cssPrefix+"palette-container"),l.call(this,e,t)}var i=o.tui.util,r=e("./core/domutil"),s=e("./core/domevent"),l=e("./core/view"),a=e("../template/palette");i.inherit(n,l),n.prototype._onClick=function(e){var t=this.options,o=e.srcElement||e.target,n={};return r.hasClass(o,t.cssPrefix+"palette-button")?(n.color=o.value,void this.fire("_selectColor",n)):void(r.hasClass(o,t.cssPrefix+"palette-toggle-slider")&&this.fire("_toggleSlider"))},n.prototype._onChange=function(e){var t=this.options,o=e.srcElement||e.target,n={};return r.hasClass(o,t.cssPrefix+"palette-hex")?(n.color=o.value,void this.fire("_selectColor",n)):void 0},n.prototype._beforeDestroy=function(){this._toggleEvent(!1)},n.prototype._toggleEvent=function(e){var t,o=this.options,n=this.container,i=s[e?"on":"off"];i(n,"click",this._onClick,this),t=r.find("."+o.cssPrefix+"palette-hex",n),t&&i(t,"change",this._onChange,this)},n.prototype.render=function(e){var t=this.options,o="";this._toggleEvent(!1),o=a.layout.replace("{{colorList}}",i.map(t.preset,function(o){var n=a.item.replace(/{{color}}/g,o);return n=n.replace("{{selected}}",o===e?" "+t.cssPrefix+"selected":"")}).join("")),o=o.replace(/{{cssPrefix}}/g,t.cssPrefix).replace("{{detailTxt}}",t.detailTxt).replace(/{{color}}/g,e),this.container.innerHTML=o,this._toggleEvent(!0)},i.CustomEvents.mixin(n),t.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../template/palette":13,"./core/domevent":4,"./core/domutil":5,"./core/view":7}],11:[function(e,t,o){(function(o){"use strict";function n(e,t){t=r.appendHTMLElement("div",t,e.cssPrefix+"slider-container"),t.style.display="none",c.call(this,e,t),this.options=i.extend({color:"#f8f8f8",cssPrefix:"tui-colorpicker-"},e),this._dragDataCache={},this.sliderHandleElement=null,this.huebarHandleElement=null,this.baseColorElement=null,this.drag=new u({distance:0},t),this.drag.on({dragStart:this._onDragStart,drag:this._onDrag,dragEnd:this._onDragEnd,click:this._onClick},this)}var i=o.tui.util,r=e("./core/domutil"),s=e("./core/domevent"),l=e("./svgvml"),a=e("./colorutil"),c=e("./core/view"),u=e("./core/drag"),d=e("../template/slider"),f=[-7,112],p=[-3,115],h=359.99;i.inherit(n,c),n.prototype._beforeDestroy=function(){this.drag.off(),this.drag=this.options=this._dragDataCache=this.sliderHandleElement=this.huebarHandleElement=this.baseColorElement=null},n.prototype.toggle=function(e){this.container.style.display=e?"block":"none"},n.prototype.isVisible=function(){return"block"===this.container.style.display},n.prototype.render=function(e){var t,o,n=this,i=n.container,s=n.options,l=d.layout;l=l.replace(/{{slider}}/,d.slider),l=l.replace(/{{huebar}}/,d.huebar),l=l.replace(/{{cssPrefix}}/g,s.cssPrefix),n.container.innerHTML=l,n.sliderHandleElement=r.find("."+s.cssPrefix+"slider-handle",i),n.huebarHandleElement=r.find("."+s.cssPrefix+"huebar-handle",i),n.baseColorElement=r.find("."+s.cssPrefix+"slider-basecolor",i),t=a.hexToRGB(e),o=a.rgbToHSV.apply(null,t),this.moveHue(o[0],!0),this.moveSaturationAndValue(o[1],o[2],!0)},n.prototype._moveColorSliderHandle=function(e,t,o){var n,i=this.sliderHandleElement;t=Math.max(f[0],t),t=Math.min(f[1],t),e=Math.max(f[0],e),e=Math.min(f[1],e),l.setTranslateXY(i,e,t),n=t>50?"white":"black",l.setStrokeColor(i,n),o||this.fire("_selectColor",{color:a.rgbToHEX.apply(null,this.getRGB())})},n.prototype.moveSaturationAndValue=function(e,t,o){var n,i,r,s;e=e||0,t=t||0,n=Math.abs(f[0]),i=f[1],r=e*i/100-n,s=i-t*i/100-n,this._moveColorSliderHandle(r,s,o)},n.prototype._moveColorSliderByPosition=function(e,t){var o=f[0];this._moveColorSliderHandle(e+o,t+o)},n.prototype.getSaturationAndValue=function(){var e,t,o=Math.abs(f[0]),n=o+f[1],i=l.getTranslateXY(this.sliderHandleElement);return e=(i[1]+o)/n*100,t=100-(i[0]+o)/n*100,[e,t]},n.prototype._moveHueHandle=function(e,t){var o,n,i=this.huebarHandleElement,r=this.baseColorElement;e=Math.max(p[0],e),e=Math.min(p[1],e),l.setTranslateY(i,e),o=a.hsvToRGB(this.getHue(),100,100),n=a.rgbToHEX.apply(null,o),l.setGradientColorStop(r,n),t||this.fire("_selectColor",{color:a.rgbToHEX.apply(null,this.getRGB())})},n.prototype.moveHue=function(e,t){var o,n,i=0;o=Math.abs(p[0]),n=o+p[1],e=e||0,i=n*e/h-o,this._moveHueHandle(i,t)},n.prototype._moveHueByPosition=function(e){var t=p[0];this._moveHueHandle(e+t)},n.prototype.getHue=function(){var e,t,o=this.huebarHandleElement,n=l.getTranslateXY(o);return e=Math.abs(p[0]),t=e+p[1],(n[0]+e)*h/t},n.prototype.getHSV=function(){var e=this.getSaturationAndValue(),t=this.getHue();return[t].concat(e)},n.prototype.getRGB=function(){return a.hsvToRGB.apply(null,this.getHSV())},n.prototype._prepareColorSliderForMouseEvent=function(e){var t,o=this.options,n=r.closest(e.target,"."+o.cssPrefix+"slider-part");return t=this._dragDataCache={isColorSlider:r.hasClass(n,o.cssPrefix+"slider-left"),parentElement:n}},n.prototype._onClick=function(e){var t=this._prepareColorSliderForMouseEvent(e),o=s.getMousePosition(e.originEvent,t.parentElement);t.isColorSlider?this._moveColorSliderByPosition(o[0],o[1]):this._moveHueByPosition(o[1]),this._dragDataCache=null},n.prototype._onDragStart=function(e){this._prepareColorSliderForMouseEvent(e)},n.prototype._onDrag=function(e){var t=this._dragDataCache,o=s.getMousePosition(e.originEvent,t.parentElement);t.isColorSlider?this._moveColorSliderByPosition(o[0],o[1]):this._moveHueByPosition(o[1])},n.prototype._onDragEnd=function(){this._dragDataCache=null},i.CustomEvents.mixin(n),t.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../template/slider":14,"./colorutil":2,"./core/domevent":4,"./core/domutil":5,"./core/drag":6,"./core/view":7,"./svgvml":12}],12:[function(e,t,o){(function(e){"use strict";var o=e.tui.util,n=/[\.\-0-9]+/g,i=-6,r={isOldBrowser:function(){var e=r._isOldBrowser;return o.isExisty(e)||(r._isOldBrowser=e=o.browser.msie&&o.browser.version<9),e},getTranslateXY:function(e){var t;return r.isOldBrowser()?(t=e.style,[parseFloat(t.top),parseFloat(t.left)]):(t=e.getAttribute("transform"))?(t=t.match(n),[parseFloat(t[1]),parseFloat(t[0])]):[0,0]},setTranslateXY:function(e,t,o){r.isOldBrowser()?(e.style.left=t+"px",e.style.top=o+"px"):e.setAttribute("transform","translate("+t+","+o+")")},setTranslateY:function(e,t){r.isOldBrowser()?e.style.top=t+"px":e.setAttribute("transform","translate("+i+","+t+")")},setStrokeColor:function(e,t){r.isOldBrowser()?e.strokecolor=t:e.setAttribute("stroke",t)},setGradientColorStop:function(e,t){r.isOldBrowser()?e.color=t:e.setAttribute("stop-color",t)}};t.exports=r}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],13:[function(e,t,o){"use strict";var n=['<ul class="{{cssPrefix}}clearfix">{{colorList}}</ul>','<div class="{{cssPrefix}}clearfix" style="overflow:hidden">','<input type="button" class="{{cssPrefix}}palette-toggle-slider" value="{{detailTxt}}" />','<input type="text" class="{{cssPrefix}}palette-hex" value="{{color}}" maxlength="7" />','<span class="{{cssPrefix}}palette-preview" style="background-color:{{color}};color:{{color}}">{{color}}</span>',"</div>"].join("\n"),i='<li><input class="{{cssPrefix}}palette-button{{selected}}" type="button" style="background-color:{{color}};color:{{color}}" title="{{color}}" value="{{color}}" /></li>';t.exports={layout:n,item:i}},{}],14:[function(e,t,o){(function(e){"use strict";var o=e.tui.util,n=['<div class="{{cssPrefix}}slider-left {{cssPrefix}}slider-part">{{slider}}</div>','<div class="{{cssPrefix}}slider-right {{cssPrefix}}slider-part">{{huebar}}</div>'].join("\n"),i=['<svg class="{{cssPrefix}}svg {{cssPrefix}}svg-slider">',"<defs>",'<linearGradient id="{{cssPrefix}}svg-fill-color" x1="0%" y1="0%" x2="100%" y2="0%">','<stop offset="0%" stop-color="rgb(255,255,255)" />','<stop class="{{cssPrefix}}slider-basecolor" offset="100%" stop-color="rgb(255,0,0)" />',"</linearGradient>",'<linearGradient id="{{cssPrefix}}svn-fill-black" x1="0%" y1="0%" x2="0%" y2="100%">','<stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:0" />','<stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:1" />',"</linearGradient>","</defs>",'<rect width="100%" height="100%" fill="url(#{{cssPrefix}}svg-fill-color)"></rect>','<rect width="100%" height="100%" fill="url(#{{cssPrefix}}svn-fill-black)"></rect>','<path transform="translate(0,0)" class="{{cssPrefix}}slider-handle" d="M0 7.5 L15 7.5 M7.5 15 L7.5 0 M2 7 a5.5 5.5 0 1 1 0 1 Z" stroke="black" stroke-width="0.75" fill="none" />',"</svg>"].join("\n"),r=['<div class="{{cssPrefix}}vml-slider">','<v:rect strokecolor="none" class="{{cssPrefix}}vml {{cssPrefix}}vml-slider-bg">','<v:fill class="{{cssPrefix}}vml {{cssPrefix}}slider-basecolor" type="gradient" method="none" color="#ff0000" color2="#fff" angle="90" />',"</v:rect>",'<v:rect strokecolor="#ccc" class="{{cssPrefix}}vml {{cssPrefix}}vml-slider-bg">','<v:fill type="gradient" method="none" color="black" color2="white" o:opacity2="0%" class="{{cssPrefix}}vml" />',"</v:rect>",'<v:shape class="{{cssPrefix}}vml {{cssPrefix}}slider-handle" coordsize="1 1" style="width:1px;height:1px;"path="m 0,7 l 14,7 m 7,14 l 7,0 ar 12,12 2,2 z" filled="false" stroked="true" />',"</div>"].join("\n"),s=['<svg class="{{cssPrefix}}svg {{cssPrefix}}svg-huebar">',"<defs>",'<linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">','<stop offset="0%" stop-color="rgb(255,0,0)" />','<stop offset="16.666%" stop-color="rgb(255,255,0)" />','<stop offset="33.333%" stop-color="rgb(0,255,0)" />','<stop offset="50%" stop-color="rgb(0,255,255)" />','<stop offset="66.666%" stop-color="rgb(0,0,255)" />','<stop offset="83.333%" stop-color="rgb(255,0,255)" />','<stop offset="100%" stop-color="rgb(255,0,0)" />',"</linearGradient>","</defs>",'<rect width="18px" height="100%" fill="url(#g)"></rect>','<path transform="translate(-6,-3)" class="{{cssPrefix}}huebar-handle" d="M0 0 L4 4 L0 8 L0 0 Z" fill="black" stroke="none" />',"</svg>"].join("\n"),l=['<div class="{{cssPrefix}}vml-huebar">','<v:rect strokecolor="#ccc" class="{{cssPrefix}}vml {{cssPrefix}}vml-huebar-bg">','<v:fill type="gradient" method="none" colors="0% rgb(255,0,0), 16.666% rgb(255,255,0), 33.333% rgb(0,255,0), 50% rgb(0,255,255), 66.666% rgb(0,0,255), 83.333% rgb(255,0,255), 100% rgb(255,0,0)" angle="180" class="{{cssPrefix}}vml" />',"</v:rect>",'<v:shape class="{{cssPrefix}}vml {{cssPrefix}}huebar-handle" coordsize="1 1" style="width:1px;height:1px;position:absolute;z-index:1;right:22px;top:-3px;"path="m 0,0 l 4,4 l 0,8 l 0,0 z" filled="true" fillcolor="black" stroked="false" />',"</div>"].join("\n"),a=o.browser.msie&&o.browser.version<9;a&&e.document.namespaces.add("v","urn:schemas-microsoft-com:vml"),t.exports={layout:n,slider:a?r:i,huebar:a?l:s}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1]);
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
'use strict';

/*eslint-disable */
var listRE = /^(\s*)(>[> ]*|[*+-]\s(?:\[(?:x|\s)\]\s)?|(\d+)([.)]\s(?:\[(?:x|\s)\]\s)?))(\s*)/,
    emptyListRE = /^(\s*)(>[> ]*|[*+-]\s(?:\[(?:x|\s)\]\s)?|(\d+)([.)]\s(?:\[(?:x|\s)\]\s)?))(\s*)$/,
    unorderedListRE = /[*+-]\s/;

CodeMirror.commands.subListIndentTab = function (cm) {
    if (cm.getOption("disableInput")) return CodeMirror.Pass;
    var ranges = cm.listSelections();
    for (var i = 0; i < ranges.length; i++) {
        var pos = ranges[i].head;
        var line = cm.getLine(pos.line);
        var cursorBeforeTextInline = line.substr(0, pos.ch);
        
        if (emptyListRE.test(cursorBeforeTextInline)) {
            cm.replaceRange("\t" + line, {
                line: pos.line, ch: 0
            }, {
                line: pos.line, ch: line.length
            });
        } else {
            if (cm.somethingSelected()) cm.indentSelection("add");
            else cm.execCommand("insertTab");
        }
    }
};

CodeMirror.commands.newlineAndIndentContinueMarkdownList = function(cm) {
    if (cm.getOption("disableInput")) return CodeMirror.Pass;
    var ranges = cm.listSelections(), replacements = [];
    for (var i = 0; i < ranges.length; i++) {
        var pos = ranges[i].head;
        var eolState = cm.getStateAfter(pos.line);
        var inList = eolState.list !== false;
        var inQuote = eolState.quote !== 0;

        var line = cm.getLine(pos.line), match = listRE.exec(line);
        if (!ranges[i].empty() || (!inList && !inQuote) || !match) {
            cm.execCommand("newlineAndIndent");
            return;
        }
        if (emptyListRE.test(line)) {
            cm.replaceRange("", {
                line: pos.line, ch: 0
            }, {
                line: pos.line, ch: pos.ch + 1
            });
            replacements[i] = "\n";
        } else {
            var indent = match[1], after = match[5], bullet;
            if (indent.length === pos.ch) {
                bullet = "";
            } else if (unorderedListRE.test(match[2]) || match[2].indexOf(">") >= 0) {
                bullet = match[2];
            } else {
                bullet = (parseInt(match[3], 10) + 1) + match[4];
            }
            replacements[i] = "\n" + indent + bullet + after;
        }
    }

    cm.replaceSelections(replacements);
};
/*eslint-enable */

},{}],2:[function(require,module,exports){
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

'use strict';

/*eslint-disable */
var urlRE = /^((?:(?:aaas?|about|acap|adiumxtra|af[ps]|aim|apt|attachment|aw|beshare|bitcoin|bolo|callto|cap|chrome(?:-extension)?|cid|coap|com-eventbrite-attendee|content|crid|cvs|data|dav|dict|dlna-(?:playcontainer|playsingle)|dns|doi|dtn|dvb|ed2k|facetime|feed|file|finger|fish|ftp|geo|gg|git|gizmoproject|go|gopher|gtalk|h323|hcp|https?|iax|icap|icon|im|imap|info|ipn|ipp|irc[6s]?|iris(?:\.beep|\.lwz|\.xpc|\.xpcs)?|itms|jar|javascript|jms|keyparc|lastfm|ldaps?|magnet|mailto|maps|market|message|mid|mms|ms-help|msnim|msrps?|mtqp|mumble|mupdate|mvn|news|nfs|nih?|nntp|notes|oid|opaquelocktoken|palm|paparazzi|platform|pop|pres|proxy|psyc|query|res(?:ource)?|rmi|rsync|rtmp|rtsp|secondlife|service|session|sftp|sgn|shttp|sieve|sips?|skype|sm[bs]|snmp|soap\.beeps?|soldat|spotify|ssh|steam|svn|tag|teamspeak|tel(?:net)?|tftp|things|thismessage|tip|tn3270|tv|udp|unreal|urn|ut2004|vemmi|ventrilo|view-source|webcal|wss?|wtai|wyciwyg|xcon(?:-userid)?|xfire|xmlrpc\.beeps?|xmpp|xri|ymsgr|z39\.50[rs]?):(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]|\([^\s()<>]*\))+(?:\([^\s()<>]*\)|[^\s`*!()\[\]{};:'".,<>?«»“”‘’]))/i

CodeMirror.defineMode("gfm", function(config, modeConfig) {
  var codeDepth = 0;
  function blankLine(state) {
    state.code = false;
    return null;
  }
  var gfmOverlay = {
    startState: function() {
      return {
        code: false,
        codeBlock: false,
        ateSpace: false
      };
    },
    copyState: function(s) {
      return {
        code: s.code,
        codeBlock: s.codeBlock,
        ateSpace: s.ateSpace
      };
    },
    token: function(stream, state) {
      state.combineTokens = null;

      // Hack to prevent formatting override inside code blocks (block and inline)
      if (state.codeBlock) {
        if (stream.match(/^```+/)) {
          state.codeBlock = false;
          return null;
        }
        stream.skipToEnd();
        return null;
      }
      if (stream.sol()) {
        state.code = false;
      }
      if (stream.sol() && stream.match(/^```+/)) {
        stream.skipToEnd();
        state.codeBlock = true;
        return null;
      }
      // If this block is changed, it may need to be updated in Markdown mode
      if (stream.peek() === '`') {
        stream.next();
        var before = stream.pos;
        stream.eatWhile('`');
        var difference = 1 + stream.pos - before;
        if (!state.code) {
          codeDepth = difference;
          state.code = true;
        } else {
          if (difference === codeDepth) { // Must be exact
            state.code = false;
          }
        }
        return null;
      } else if (state.code) {
        stream.next();
        return null;
      }
      // Check if space. If so, links can be formatted later on
      if (stream.eatSpace()) {
        state.ateSpace = true;
        return null;
      }
      if (stream.sol() || state.ateSpace) {
        state.ateSpace = false;
        /*
        //we dont need this
        if (modeConfig.gitHubSpice !== false) {
          if(stream.match(/^(?:[a-zA-Z0-9\-_]+\/)?(?:[a-zA-Z0-9\-_]+@)?(?:[a-f0-9]{7,40}\b)/)) {
            // User/Project@SHA
            // User@SHA
            // SHA
            state.combineTokens = true;
            return "link";
          } else if (stream.match(/^(?:[a-zA-Z0-9\-_]+\/)?(?:[a-zA-Z0-9\-_]+)?#[0-9]+\b/)) {
            // User/Project#Num
            // User#Num
            // #Num
            state.combineTokens = true;
            return "link";
          }
        }
      }
      if (stream.match(urlRE) &&
          stream.string.slice(stream.start - 2, stream.start) != "](" &&
          (stream.start == 0 || /\W/.test(stream.string.charAt(stream.start - 1)))) {
        // URLs
        // Taken from http://daringfireball.net/2010/07/improved_regex_for_matching_urls
        // And then (issue #1160) simplified to make it not crash the Chrome Regexp engine
        // And then limited url schemes to the CommonMark list, so foo:bar isn't matched as a URL
        state.combineTokens = true;
        return "link";
        */
      }
      stream.next();
      return null;
    },
    blankLine: blankLine
  };

  var markdownConfig = {
    underscoresBreakWords: false,
    taskLists: true,
    fencedCodeBlocks: '```',
    strikethrough: true
  };
  for (var attr in modeConfig) {
    markdownConfig[attr] = modeConfig[attr];
  }
  markdownConfig.name = "markdown";
  return CodeMirror.overlayMode(CodeMirror.getMode(config, markdownConfig), gfmOverlay);

}, "markdown");

  CodeMirror.defineMIME("text/x-gfm", "gfm");/*eslint-enable */

},{}],3:[function(require,module,exports){
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

/*eslint-disable */
"use strict";

CodeMirror.defineMode("markdown", function(cmCfg, modeCfg) {

  var htmlFound = CodeMirror.modes.hasOwnProperty("xml");
  var htmlMode = CodeMirror.getMode(cmCfg, htmlFound ? {name: "xml", htmlMode: true} : "text/plain");

  function getMode(name) {
    if (CodeMirror.findModeByName) {
      var found = CodeMirror.findModeByName(name);
      if (found) name = found.mime || found.mimes[0];
    }
    var mode = CodeMirror.getMode(cmCfg, name);
    return mode.name == "null" ? null : mode;
  }

  // Should characters that affect highlighting be highlighted separate?
  // Does not include characters that will be output (such as `1.` and `-` for lists)
  if (modeCfg.highlightFormatting === undefined)
    modeCfg.highlightFormatting = false;

  // Maximum number of nested blockquotes. Set to 0 for infinite nesting.
  // Excess `>` will emit `error` token.
  if (modeCfg.maxBlockquoteDepth === undefined)
    modeCfg.maxBlockquoteDepth = 0;

  // Should underscores in words open/close em/strong?
  if (modeCfg.underscoresBreakWords === undefined)
    modeCfg.underscoresBreakWords = true;

  // Use `fencedCodeBlocks` to configure fenced code blocks. false to
  // disable, string to specify a precise regexp that the fence should
  // match, and true to allow three or more backticks or tildes (as
  // per CommonMark).

  // Turn on task lists? ("- [ ] " and "- [x] ")
  if (modeCfg.taskLists === undefined) modeCfg.taskLists = false;

  // Turn on strikethrough syntax
  if (modeCfg.strikethrough === undefined)
    modeCfg.strikethrough = false;

  var codeDepth = 0;

  var header   = 'header'
  ,   code     = 'comment'
  ,   quote    = 'quote'
  ,   list1    = 'variable-2'
  ,   list2    = 'variable-3'
  ,   list3    = 'keyword'
  ,   hr       = 'hr'
  ,   image    = 'tag'
  ,   formatting = 'formatting'
  ,   linkinline = 'link'
  ,   linkemail = 'link'
  ,   linktext = 'link'
  ,   linkhref = 'string'
  ,   em       = 'em'
  ,   strong   = 'strong'
  ,   strikethrough = 'strikethrough';

  var hrRE = /^([*\-_])(?:\s*\1){2,}\s*$/
  ,   ulRE = /^[*\-+]\s+/
  ,   olRE = /^[0-9]+([.)])\s+/
  ,   taskListRE = /^\[(x| )\](?=\s)/ // Must follow ulRE or olRE
  ,   atxHeaderRE = modeCfg.allowAtxHeaderWithoutSpace ? /^(#+)/ : /^(#+)(?: |$)/
  ,   setextHeaderRE = /^ *(?:\={1,}|-{1,})\s*$/
  ,   textRE = /^[^#!\[\]*_\\<>` "'(~]+/
  ,   fencedCodeRE = new RegExp("^(" + (modeCfg.fencedCodeBlocks === true ? "~~~+|```+" : modeCfg.fencedCodeBlocks) +
                                ")[ \\t]*([\\w+#]*)");

  function switchInline(stream, state, f) {
    state.f = state.inline = f;
    return f(stream, state);
  }

  function switchBlock(stream, state, f) {
    state.f = state.block = f;
    return f(stream, state);
  }

  function lineIsEmpty(line) {
    return !line || !/\S/.test(line.string)
  }

  // Blocks

  function blankLine(state) {
    // Reset linkTitle state
    state.linkTitle = false;
    // Reset EM state
    state.em = false;
    // Reset STRONG state
    state.strong = false;
    // Reset strikethrough state
    state.strikethrough = false;
    // Reset state.quote
    state.quote = 0;
    // Reset state.indentedCode
    state.indentedCode = false;
    if (!htmlFound && state.f == htmlBlock) {
      state.f = inlineNormal;
      state.block = blockNormal;
    }
    // Reset state.trailingSpace
    state.trailingSpace = 0;
    state.trailingSpaceNewLine = false;
    // Mark this line as blank
    state.prevLine = state.thisLine
    state.thisLine = null
    return null;
  }

  function blockNormal(stream, state) {

    var sol = stream.sol();

    var prevLineIsList = state.list !== false,
        prevLineIsIndentedCode = state.indentedCode;

    state.indentedCode = false;

    if (prevLineIsList) {
      if (state.indentationDiff >= 0) { // Continued list
        if (state.indentationDiff < 4) { // Only adjust indentation if *not* a code block
          state.indentation -= state.indentationDiff;
        }
        state.list = null;
      } 
      if (state.indentation > 0) {
        state.list = null;
        state.listDepth = Math.floor(state.indentation / 4) + 1;
      } else { // No longer a list
        state.list = false;
        state.listDepth = 0;
      }
    }

    var match = null;
    if (state.indentationDiff >= 4) {
      stream.skipToEnd();
      if (prevLineIsIndentedCode || lineIsEmpty(state.prevLine)) {
        state.indentation -= 4;
        state.indentedCode = true;
        return code;
      } else {
        return null;
      }
    } else if (stream.eatSpace()) {
      return null;
    } else if ((match = stream.match(atxHeaderRE)) && match[1].length <= 6) {
      state.header = match[1].length;
      if (modeCfg.highlightFormatting) state.formatting = "header";
      state.f = state.inline;
      return getType(state);
    } else if (!lineIsEmpty(state.prevLine) && !state.quote && !prevLineIsList &&
               !prevLineIsIndentedCode && (match = stream.match(setextHeaderRE))) {
      state.header = match[0].charAt(0) == '=' ? 1 : 2;
      if (modeCfg.highlightFormatting) state.formatting = "header";
      state.f = state.inline;
      return getType(state);
    } else if (stream.eat('>')) {
      state.quote = sol ? 1 : state.quote + 1;
      if (modeCfg.highlightFormatting) state.formatting = "quote";
      stream.eatSpace();
      return getType(state);
    } else if (stream.peek() === '[') {
      return switchInline(stream, state, footnoteLink);
    } else if (stream.match(hrRE, true)) {
      state.hr = true;
      return hr;
    } else if ((lineIsEmpty(state.prevLine) || prevLineIsList) && (stream.match(ulRE, false) || stream.match(olRE, false))) {
      var listType = null;
      if (stream.match(ulRE, true)) {
        listType = 'ul';
      } else {
        stream.match(olRE, true);
        listType = 'ol';
      }
      state.indentation = stream.column() + stream.current().length;
      state.list = true;
      state.listDepth++;
      if (modeCfg.taskLists && stream.match(taskListRE, false)) {
        state.taskList = true;
      }
      state.f = state.inline;
      if (modeCfg.highlightFormatting) state.formatting = ["list", "list-" + listType];
      return getType(state);
    } else if (modeCfg.fencedCodeBlocks && (match = stream.match(fencedCodeRE, true))) {
      state.fencedChars = match[1]
      // try switching mode
      state.localMode = getMode(match[2]);
      if (state.localMode) state.localState = state.localMode.startState();
      state.f = state.block = local;
      if (modeCfg.highlightFormatting) state.formatting = "code-block";
      state.code = true;
      return getType(state);
    }

    return switchInline(stream, state, state.inline);
  }

  function htmlBlock(stream, state) {
    var style = htmlMode.token(stream, state.htmlState);
    if ((htmlFound && state.htmlState.tagStart === null &&
         (!state.htmlState.context && state.htmlState.tokenize.isInText)) ||
        (state.md_inside && stream.current().indexOf(">") > -1)) {
      state.f = inlineNormal;
      state.block = blockNormal;
      state.htmlState = null;
    }
    return style;
  }

  function local(stream, state) {
    if (stream.sol() && state.fencedChars && stream.match(state.fencedChars, false)) {
      state.localMode = state.localState = null;
      state.f = state.block = leavingLocal;
      return null;
    } else if (state.localMode) {
      return state.localMode.token(stream, state.localState);
    } else {
      stream.skipToEnd();
      return code;
    }
  }

  function leavingLocal(stream, state) {
    stream.match(state.fencedChars);
    state.block = blockNormal;
    state.f = inlineNormal;
    state.fencedChars = null;
    if (modeCfg.highlightFormatting) state.formatting = "code-block";
    state.code = true;
    var returnType = getType(state);
    state.code = false;
    return returnType;
  }

  // Inline
  function getType(state) {
    var styles = [];

    if (state.formatting) {
      styles.push(formatting);

      if (typeof state.formatting === "string") state.formatting = [state.formatting];

      for (var i = 0; i < state.formatting.length; i++) {
        styles.push(formatting + "-" + state.formatting[i]);

        if (state.formatting[i] === "header") {
          styles.push(formatting + "-" + state.formatting[i] + "-" + state.header);
        }

        // Add `formatting-quote` and `formatting-quote-#` for blockquotes
        // Add `error` instead if the maximum blockquote nesting depth is passed
        if (state.formatting[i] === "quote") {
          if (!modeCfg.maxBlockquoteDepth || modeCfg.maxBlockquoteDepth >= state.quote) {
            styles.push(formatting + "-" + state.formatting[i] + "-" + state.quote);
          } else {
            styles.push("error");
          }
        }
      }
    }

    if (state.taskOpen) {
      styles.push("meta");
      return styles.length ? styles.join(' ') : null;
    }
    if (state.taskClosed) {
      styles.push("property");
      return styles.length ? styles.join(' ') : null;
    }

    if (state.linkHref) {
      styles.push(linkhref, "url");
    } else { // Only apply inline styles to non-url text
      if (state.strong) { styles.push(strong); }
      if (state.em) { styles.push(em); }
      if (state.strikethrough) { styles.push(strikethrough); }

      if (state.linkText) { styles.push(linktext); }

      if (state.code) { styles.push(code); }
    }

    if (state.header) { styles.push(header); styles.push(header + "-" + state.header); }

    if (state.quote) {
      styles.push(quote);

      // Add `quote-#` where the maximum for `#` is modeCfg.maxBlockquoteDepth
      if (!modeCfg.maxBlockquoteDepth || modeCfg.maxBlockquoteDepth >= state.quote) {
        styles.push(quote + "-" + state.quote);
      } else {
        styles.push(quote + "-" + modeCfg.maxBlockquoteDepth);
      }
    }

    if (state.list !== false) {
      var listMod = (state.listDepth - 1) % 3;
      if (!listMod) {
        styles.push(list1);
      } else if (listMod === 1) {
        styles.push(list2);
      } else {
        styles.push(list3);
      }
    }

    if (state.trailingSpaceNewLine) {
      styles.push("trailing-space-new-line");
    } else if (state.trailingSpace) {
      styles.push("trailing-space-" + (state.trailingSpace % 2 ? "a" : "b"));
    }

    return styles.length ? styles.join(' ') : null;
  }

  function handleText(stream, state) {
    if (stream.match(textRE, true)) {
      return getType(state);
    }
    return undefined;
  }

  function inlineNormal(stream, state) {
    var style = state.text(stream, state);
    if (typeof style !== 'undefined')
      return style;

    if (state.list) { // List marker (*, +, -, 1., etc)
      state.list = null;
      return getType(state);
    }

    if (state.taskList) {
      var taskOpen = stream.match(taskListRE, true)[1] !== "x";
      if (taskOpen) state.taskOpen = true;
      else state.taskClosed = true;
      if (modeCfg.highlightFormatting) state.formatting = "task";
      state.taskList = false;
      return getType(state);
    }

    state.taskOpen = false;
    state.taskClosed = false;

    if (state.header && stream.match(/^#+$/, true)) {
      if (modeCfg.highlightFormatting) state.formatting = "header";
      return getType(state);
    }

    // Get sol() value now, before character is consumed
    var sol = stream.sol();

    var ch = stream.next();

    if (ch === '\\') {
      stream.next();
      if (modeCfg.highlightFormatting) {
        var type = getType(state);
        return type ? type + " formatting-escape" : "formatting-escape";
      }
    }

    // Matches link titles present on next line
    if (state.linkTitle) {
      state.linkTitle = false;
      var matchCh = ch;
      if (ch === '(') {
        matchCh = ')';
      }
      matchCh = (matchCh+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
      var regex = '^\\s*(?:[^' + matchCh + '\\\\]+|\\\\\\\\|\\\\.)' + matchCh;
      if (stream.match(new RegExp(regex), true)) {
        return linkhref;
      }
    }

    // If this block is changed, it may need to be updated in GFM mode
    if (ch === '`') {
      var previousFormatting = state.formatting;
      if (modeCfg.highlightFormatting) state.formatting = "code";
      var t = getType(state);
      var before = stream.pos;
      stream.eatWhile('`');
      var difference = 1 + stream.pos - before;
      if (!state.code) {
        codeDepth = difference;
        state.code = true;
        return getType(state);
      } else {
        if (difference === codeDepth) { // Must be exact
          state.code = false;
          return t;
        }
        state.formatting = previousFormatting;
        return getType(state);
      }
    } else if (state.code) {
      return getType(state);
    }

    if (ch === '!' && stream.match(/\[[^\]]*\] ?(?:\(|\[)/, false)) {
      stream.match(/\[[^\]]*\]/);
      //현재 이미지의 link를 hash값으로 사용하고 있어 데이터 문자열의 길이로 인해 highlight안되는 현상 발생, iamge의 경우 하이라이팅 하지 않음
      //state.inline = state.f = linkHref;
      return image;
    }

    if (ch === '[' && stream.match(/.*\](\(.*\)| ?\[.*\])/, false)) {
      state.linkText = true;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      return getType(state);
    }

    if (ch === ']' && state.linkText && stream.match(/\(.*\)| ?\[.*\]/, false)) {
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var type = getType(state);
      state.linkText = false;
      state.inline = state.f = linkHref;
      return type;
    }

    if (ch === '<' && stream.match(/^(https?|ftps?):\/\/(?:[^\\>]|\\.)+>/, false)) {
      state.f = state.inline = linkInline;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var type = getType(state);
      if (type){
        type += " ";
      } else {
        type = "";
      }
      return type + linkinline;
    }

    if (ch === '<' && stream.match(/^[^> \\]+@(?:[^\\>]|\\.)+>/, false)) {
      state.f = state.inline = linkInline;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var type = getType(state);
      if (type){
        type += " ";
      } else {
        type = "";
      }
      return type + linkemail;
    }
/*
// modified
// we dont need html Block it ruin markdown blocks
    if (ch === '<' && stream.match(/^(!--|\w)/, false)) {
      var end = stream.string.indexOf(">", stream.pos);
      if (end != -1) {
        var atts = stream.string.substring(stream.start, end);
        if (/markdown\s*=\s*('|"){0,1}1('|"){0,1}/.test(atts)) state.md_inside = true;
      }
      stream.backUp(1);
      state.htmlState = CodeMirror.startState(htmlMode);
      return switchBlock(stream, state, htmlBlock);
    }
*/

    if (ch === '<' && stream.match(/^\/\w*?>/)) {
      state.md_inside = false;
      return "tag";
    }

    var ignoreUnderscore = false;
    if (!modeCfg.underscoresBreakWords) {
      if (ch === '_' && stream.peek() !== '_' && stream.match(/(\w)/, false)) {
        var prevPos = stream.pos - 2;
        if (prevPos >= 0) {
          var prevCh = stream.string.charAt(prevPos);
          if (prevCh !== '_' && prevCh.match(/(\w)/, false)) {
            ignoreUnderscore = true;
          }
        }
      }
    }
    if (ch === '*' || (ch === '_' && !ignoreUnderscore)) {
      if (sol && stream.peek() === ' ') {
        // Do nothing, surrounded by newline and space
      } else if (state.strong === ch && stream.eat(ch)) { // Remove STRONG
        if (modeCfg.highlightFormatting) state.formatting = "strong";
        var t = getType(state);
        state.strong = false;
        return t;
      } else if (!state.strong && stream.eat(ch)) { // Add STRONG
        state.strong = ch;
        if (modeCfg.highlightFormatting) state.formatting = "strong";
        return getType(state);
      } else if (state.em === ch) { // Remove EM
        if (modeCfg.highlightFormatting) state.formatting = "em";
        var t = getType(state);
        state.em = false;
        return t;
      } else if (!state.em) { // Add EM
        state.em = ch;
        if (modeCfg.highlightFormatting) state.formatting = "em";
        return getType(state);
      }
    } else if (ch === ' ') {
      if (stream.eat('*') || stream.eat('_')) { // Probably surrounded by spaces
        if (stream.peek() === ' ') { // Surrounded by spaces, ignore
          return getType(state);
        } else { // Not surrounded by spaces, back up pointer
          stream.backUp(1);
        }
      }
    }

    if (modeCfg.strikethrough) {
      if (ch === '~' && stream.eatWhile(ch)) {
        if (state.strikethrough) {// Remove strikethrough
          if (modeCfg.highlightFormatting) state.formatting = "strikethrough";
          var t = getType(state);
          state.strikethrough = false;
          return t;
        } else if (stream.match(/^[^\s]/, false)) {// Add strikethrough
          state.strikethrough = true;
          if (modeCfg.highlightFormatting) state.formatting = "strikethrough";
          return getType(state);
        }
      } else if (ch === ' ') {
        if (stream.match(/^~~/, true)) { // Probably surrounded by space
          if (stream.peek() === ' ') { // Surrounded by spaces, ignore
            return getType(state);
          } else { // Not surrounded by spaces, back up pointer
            stream.backUp(2);
          }
        }
      }
    }

    if (ch === ' ') {
      if (stream.match(/ +$/, false)) {
        state.trailingSpace++;
      } else if (state.trailingSpace) {
        state.trailingSpaceNewLine = true;
      }
    }

    return getType(state);
  }

  function linkInline(stream, state) {
    var ch = stream.next();

    if (ch === ">") {
      state.f = state.inline = inlineNormal;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var type = getType(state);
      if (type){
        type += " ";
      } else {
        type = "";
      }
      return type + linkinline;
    }

    stream.match(/^[^>]+/, true);

    return linkinline;
  }

  function linkHref(stream, state) {
    // Check if space, and return NULL if so (to avoid marking the space)
    if(stream.eatSpace()){
      return null;
    }
    var ch = stream.next();
    if (ch === '(' || ch === '[') {
      state.f = state.inline = getLinkHrefInside(ch === "(" ? ")" : "]");
      if (modeCfg.highlightFormatting) state.formatting = "link-string";
      state.linkHref = true;
      return getType(state);
    }
    return 'error';
  }

  function getLinkHrefInside(endChar) {
    return function(stream, state) {
      var ch = stream.next();

      if (ch === endChar) {
        state.f = state.inline = inlineNormal;
        if (modeCfg.highlightFormatting) state.formatting = "link-string";
        var returnState = getType(state);
        state.linkHref = false;
        return returnState;
      }

      if (stream.match(inlineRE(endChar), true)) {
        stream.backUp(1);
      }

      state.linkHref = true;
      return getType(state);
    };
  }

  function footnoteLink(stream, state) {
    if (stream.match(/^[^\]]*\]:/, false)) {
      state.f = footnoteLinkInside;
      stream.next(); // Consume [
      if (modeCfg.highlightFormatting) state.formatting = "link";
      state.linkText = true;
      return getType(state);
    }
    return switchInline(stream, state, inlineNormal);
  }

  function footnoteLinkInside(stream, state) {
    if (stream.match(/^\]:/, true)) {
      state.f = state.inline = footnoteUrl;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var returnType = getType(state);
      state.linkText = false;
      return returnType;
    }

    stream.match(/^[^\]]+/, true);

    return linktext;
  }

  function footnoteUrl(stream, state) {
    // Check if space, and return NULL if so (to avoid marking the space)
    if(stream.eatSpace()){
      return null;
    }
    // Match URL
    stream.match(/^[^\s]+/, true);
    // Check for link title
    if (stream.peek() === undefined) { // End of line, set flag to check next line
      state.linkTitle = true;
    } else { // More content on line, check if link title
      stream.match(/^(?:\s+(?:"(?:[^"\\]|\\\\|\\.)+"|'(?:[^'\\]|\\\\|\\.)+'|\((?:[^)\\]|\\\\|\\.)+\)))?/, true);
    }
    state.f = state.inline = inlineNormal;
    return linkhref + " url";
  }

  var savedInlineRE = [];
  function inlineRE(endChar) {
    if (!savedInlineRE[endChar]) {
      // Escape endChar for RegExp (taken from http://stackoverflow.com/a/494122/526741)
      endChar = (endChar+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
      // Match any non-endChar, escaped character, as well as the closing
      // endChar.
      savedInlineRE[endChar] = new RegExp('^(?:[^\\\\]|\\\\.)*?(' + endChar + ')');
    }
    return savedInlineRE[endChar];
  }

  var mode = {
    startState: function() {
      return {
        f: blockNormal,

        prevLine: null,
        thisLine: null,

        block: blockNormal,
        htmlState: null,
        indentation: 0,

        inline: inlineNormal,
        text: handleText,

        formatting: false,
        linkText: false,
        linkHref: false,
        linkTitle: false,
        em: false,
        strong: false,
        header: 0,
        hr: false,
        taskList: false,
        list: false,
        listDepth: 0,
        quote: 0,
        trailingSpace: 0,
        trailingSpaceNewLine: false,
        strikethrough: false,
        fencedChars: null
      };
    },

    copyState: function(s) {
      return {
        f: s.f,

        prevLine: s.prevLine,
        thisLine: s.this,

        block: s.block,
        htmlState: s.htmlState && CodeMirror.copyState(htmlMode, s.htmlState),
        indentation: s.indentation,

        localMode: s.localMode,
        localState: s.localMode ? CodeMirror.copyState(s.localMode, s.localState) : null,

        inline: s.inline,
        text: s.text,
        formatting: false,
        linkTitle: s.linkTitle,
        code: s.code,
        em: s.em,
        strong: s.strong,
        strikethrough: s.strikethrough,
        header: s.header,
        hr: s.hr,
        taskList: s.taskList,
        list: s.list,
        listDepth: s.listDepth,
        quote: s.quote,
        indentedCode: s.indentedCode,
        trailingSpace: s.trailingSpace,
        trailingSpaceNewLine: s.trailingSpaceNewLine,
        md_inside: s.md_inside,
        fencedChars: s.fencedChars
      };
    },

    token: function(stream, state) {

      // Reset state.formatting
      state.formatting = false;

      if (stream != state.thisLine) {
        var forceBlankLine = state.header || state.hr;

        // Reset state.header and state.hr
        state.header = 0;
        state.hr = false;

        if (stream.match(/^\s*$/, true) || forceBlankLine) {
          blankLine(state);
          if (!forceBlankLine) return null
          state.prevLine = null
        }

        state.prevLine = state.thisLine
        state.thisLine = stream

        // Reset state.taskList
        state.taskList = false;

        // Reset state.trailingSpace
        state.trailingSpace = 0;
        state.trailingSpaceNewLine = false;

        state.f = state.block;
        var indentation = stream.match(/^\s*/, true)[0].replace(/\t/g, '    ').length;
        var difference = Math.floor((indentation - state.indentation) / 4) * 4;
        if (difference > 4) difference = 4;
        var adjustedIndentation = state.indentation + difference;
        state.indentationDiff = adjustedIndentation - state.indentation;
        state.indentation = adjustedIndentation;
        if (indentation > 0) return null;
      }
      return state.f(stream, state);
    },

    innerMode: function(state) {
      if (state.block == htmlBlock) return {state: state.htmlState, mode: htmlMode};
      if (state.localState) return {state: state.localState, mode: state.localMode};
      return {state: state, mode: mode};
    },

    blankLine: blankLine,

    getType: getType,

    fold: "markdown"
  };
  return mode;
}, "xml");

CodeMirror.defineMIME("text/x-markdown", "markdown");
/*eslint-enable */

},{}],4:[function(require,module,exports){
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// Utility function that allows modes to be combined. The mode given
// as the base argument takes care of most of the normal mode
// functionality, but a second (typically simple) mode is used, which
// can override the style of text. Both modes get to parse all of the
// text, but when both assign a non-null style to a piece of code, the
// overlay wins, unless the combine argument was true and not overridden,
// or state.overlay.combineTokens was true, in which case the styles are
// combined.
'use strict';

/*eslint-disable */
CodeMirror.overlayMode = function(base, overlay, combine) {
  return {
    startState: function() {
      return {
        base: CodeMirror.startState(base),
        overlay: CodeMirror.startState(overlay),
        basePos: 0, baseCur: null,
        overlayPos: 0, overlayCur: null,
        streamSeen: null
      };
    },
    copyState: function(state) {
      return {
        base: CodeMirror.copyState(base, state.base),
        overlay: CodeMirror.copyState(overlay, state.overlay),
        basePos: state.basePos, baseCur: null,
        overlayPos: state.overlayPos, overlayCur: null
      };
    },

    token: function(stream, state) {
      if (stream != state.streamSeen ||
          Math.min(state.basePos, state.overlayPos) < stream.start) {
        state.streamSeen = stream;
        state.basePos = state.overlayPos = stream.start;
      }

      if (stream.start == state.basePos) {
        state.baseCur = base.token(stream, state.base);
        state.basePos = stream.pos;
      }
      if (stream.start == state.overlayPos) {
        stream.pos = stream.start;
        state.overlayCur = overlay.token(stream, state.overlay);
        state.overlayPos = stream.pos;
      }
      stream.pos = Math.min(state.basePos, state.overlayPos);

      // state.overlay.combineTokens always takes precedence over combine,
      // unless set to null
      if (state.overlayCur == null) return state.baseCur;
      else if (state.baseCur != null &&
               state.overlay.combineTokens ||
               combine && state.overlay.combineTokens == null)
        return state.baseCur + " " + state.overlayCur;
      else return state.overlayCur;
    },

    indent: base.indent && function(state, textAfter) {
      return base.indent(state.base, textAfter);
    },
    electricChars: base.electricChars,

    innerMode: function(state) { return {state: state.base, mode: base}; },

    blankLine: function(state) {
      if (base.blankLine) base.blankLine(state.base);
      if (overlay.blankLine) overlay.blankLine(state.overlay);
    }
  };
};
/*eslint-enable */

},{}],5:[function(require,module,exports){
/**
 * @fileoverview Implements Command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = tui.util;

/**
 * Command
 * It implements command to editors
 * @exports Command
 * @constructor
 * @class
 * @param {string} name Command name
 * @param {number} type Command type (Command.TYPE)
 */
function Command(name, type) {
    this.name = name;
    this.type = type;
}

/**
 * getName
 * returns Name of command
 * @return {string} Command Name
 */
Command.prototype.getName = function() {
    return this.name;
};

/**
 * getType
 * returns Type of command
 * @return {number} Command Type
 */
Command.prototype.getType = function() {
    return this.type;
};

/**
 * isMDType
 * returns whether Command Type is Markdown or not
 * @return {boolean} result
 */
Command.prototype.isMDType = function() {
    return this.type === Command.TYPE.MD;
};

/**
 * isWWType
 * returns whether Command Type is Wysiwyg or not
 * @return {boolean} result
 */
Command.prototype.isWWType = function() {
    return this.type === Command.TYPE.WW;
};

/**
 * isGlobalType
 * returns whether Command Type is Global or not
 * @return {boolean} result
 */
Command.prototype.isGlobalType = function() {
    return this.type === Command.TYPE.GB;
};

/**
 * setKeyMap
 * Set keymap value for each os
 * @param {string} win window Key
 * @param {string} mac mac osx key
 */
Command.prototype.setKeyMap = function(win, mac) {
    this.keyMap = [win, mac];
};

Command.factory = function(typeStr, props) {
    var command, type;

    if (typeStr === 'markdown') {
        type = Command.TYPE.MD;
    } else if (typeStr === 'wysiwyg') {
        type = Command.TYPE.WW;
    } else if (typeStr === 'global') {
        type = Command.TYPE.GB;
    }

    command = new Command(props.name, type);

    util.extend(command, props);

    return command;
};

/**
 * Command Type Constant
 */
Command.TYPE = {
    MD: 0,
    WW: 1,
    GB: 2
};

module.exports = Command;

},{}],6:[function(require,module,exports){
/**
 * @fileoverview Implements CommandManager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = tui.util;

var Command = require('./command');

/**
 * CommandManager
 * @exports CommandManager
 * @constructor
 * @class
 * @param {NEditor} base ned인스턴스
 */
function CommandManager(base) {
    this._command = new util.Map();
    this._mdCommand = new util.Map();
    this._wwCommand = new util.Map();
    this.base = base;

    this._initEvent();
}

/**
 * addCommand
 * 커맨드를 추가한다.
 * @param {Command} command 커맨드객체
 * @return {Command} 커맨드
 */
CommandManager.prototype.addCommand = function(command) {
    var name,
        commandBase;

    if (arguments.length === 2) {
        command = CommandManager.command(arguments[0], arguments[1]);
    }

    name = command.getName();

    if (command.isMDType()) {
        commandBase = this._mdCommand;
    } else if (command.isWWType()) {
        commandBase = this._wwCommand;
    } else if (command.isGlobalType()) {
        commandBase = this._command;
    }

    commandBase.set(name, command);

    return command;
};


/**
 * _initEvent
 * Bind event handler to eventManager
 */
CommandManager.prototype._initEvent = function() {
    var self = this;

    this.base.eventManager.listen('command', function() {
        self.exec.apply(self, arguments);
    });
};

/**
 * 커맨드를 실행한다
 * @param {String} name 커맨드명
 * @returns {*} 커맨드를 수행한후 리턴값
 */
CommandManager.prototype.exec = function(name) {
    var commandToRun,
        context = this.base,
        args = util.toArray(arguments);

    args.shift();

    commandToRun = this._command.get(name);

    if (!commandToRun) {
        if (this.base.isMarkdownMode()) {
            commandToRun = this._mdCommand.get(name);
            context = this.base.mdEditor;
        } else {
            commandToRun = this._wwCommand.get(name);
            context = this.base.wwEditor;
        }
    }

    if (commandToRun) {
        args.unshift(context);
        return commandToRun.exec.apply(commandToRun, args);
    }
};

CommandManager.command = function(type, props) {
    var command;

    command = Command.factory(type, props.name);

    util.extend(command, props);

    return command;
};


module.exports = CommandManager;

},{"./command":5}],7:[function(require,module,exports){
/**
 * @fileoverview Convertor have responsible to convert markdown and html
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var markedCustomRenderer = require('./markedCustomRenderer');

var marked = window.marked,
    toMark = window.toMark,
    hljs = window.hljs;

/**
 * Convertor
 * @exports Convertor
 * @extends {}
 * @constructor
 * @class
 */

function Convertor(em) {
    this.eventManager = em;
}

/**
 * _markdownToHtmlWithCodeHighlight
 * Convert markdown to html with Codehighlight
 * @param {string} markdown markdown text
 * @return {string} html text
 */
Convertor.prototype._markdownToHtmlWithCodeHighlight = function(markdown) {
    return marked(markdown, {
        renderer: markedCustomRenderer,
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        highlight: function(code, type) {
            return hljs.getLanguage(type) ? hljs.highlight(type, code).value : code;
        }
    });
};

/**
 * _markdownToHtml
 * Convert markdown to html
 * @param {string} markdown markdown text
 * @return {string} html text
 */
Convertor.prototype._markdownToHtml = function(markdown) {
    return marked(markdown, {
        renderer: markedCustomRenderer,
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false
    });
};

/**
 * toHTMLWithCodeHightlight
 * Convert markdown to html with Codehighlight
 * emit convertorAfterMarkdownToHtmlConverted
 * @param {string} markdown markdown text
 * @return {string} html text
 */
Convertor.prototype.toHTMLWithCodeHightlight = function(markdown) {
    var html = this._markdownToHtmlWithCodeHighlight(markdown);
    html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);
    return this._sanitizeScript(html);
};

/**
 * toHTML
 * Convert markdown to html
 * emit convertorAfterMarkdownToHtmlConverted
 * @param {string} markdown markdown text
 * @return {string} html text
 */
Convertor.prototype.toHTML = function(markdown) {
    var html =  this._markdownToHtml(markdown);
    html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);
    return this._sanitizeScript(html);
};

/**
 * toMarkdown
 * Convert html to markdown
 * emit convertorAfterHtmlToMarkdownConverted
 * @param {string} html html text
 * @return {string} markdown text
 */
Convertor.prototype.toMarkdown = function(html) {
    var markdown = toMark(html);
    markdown = this.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', markdown);
    return markdown;
};

Convertor.prototype._sanitizeScript = function(html) {
    html = html.replace(/\<script.*?\>/g, '&lt;script&gt;');
    html = html.replace(/\<\/script\>/g, '&lt;/script&gt;');

    return html;
};

Convertor.factory = function(eventManager) {
    return new Convertor(eventManager);
};

module.exports = Convertor;

},{"./markedCustomRenderer":34}],8:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

/**
 * isTextNode
 * Check if node is text node
 * @param {Node} node node to check
 * @return {boolean} result
 */
var isTextNode = function(node) {
    return node && node.nodeType === Node.TEXT_NODE;
};

/**
 * isElemNode
 * Check if node is element node
 * @param {Node} node node to check
 * @return {boolean} result
 */
var isElemNode = function(node) {
    return node && node.nodeType === Node.ELEMENT_NODE;
};

/**
 * getChildNodeAt
 * Get child node in given parent and index
 * @param {HTMLElement} elem parent element
 * @param {number} index node index
 * @return {Node} child
 */
var getChildNodeAt = function(elem, index) {
    if (elem.childNodes.length && index >= 0) {
        return elem.childNodes[index];
    }
};

/**
 * getNodeName
 * Get node name of node
 * @param {Node} node node
 * @return {string} node name
 */
var getNodeName = function(node) {
    if (isElemNode(node)) {
        return node.tagName;
    } else if (isTextNode(node)) {
        return 'TEXT';
    }
};

/**
 * getTextLength
 * Get node offset length of node(for Range API)
 * @param {Node} node node
 * @return {number} length
 */
var getTextLength = function(node) {
    var len;

    if (isElemNode(node)) {
       len = node.textContent.length;
    } else if (isTextNode(node)) {
       len = node.nodeValue.length;
    }

    return len;
};

/**
 * getOffsetLength
 * Get node offset length of node(for Range API)
 * @param {Node} node node
 * @return {number} length
 */
var getOffsetLength = function(node) {
    var len;

    if (isElemNode(node)) {
       len = node.childNodes.length;
    } else if (isTextNode(node)) {
       len = node.nodeValue.length;
    }

    return len;
};

var getNodeOffsetOfParent = function(node) {
    var i, t,
        childNodesOfParent = node.parentNode.childNodes;

    for (i = 0, t = childNodesOfParent.length; i < t; i+=1) {
        if (childNodesOfParent[i] === node) {
            return i;
        }
    }
};


var _getNodeWithDirectionUntil = function(direction, node, untilNodeName) {
    var directionKey = direction + 'Sibling',
        nodeName, foundedNode;


    while (node && !node[directionKey]) {
        nodeName = getNodeName(node.parentNode);

        if ((nodeName === untilNodeName)
            || nodeName === 'BODY'
        ) {
            break;
        }

        node = node.parentNode;
    }

    if (node[directionKey]) {
        foundedNode = node[directionKey];
    }

    return foundedNode;
};

var getPrevOffsetNodeUntil = function(node, index, untilNodeName) {
    var prevNode;

    if (index > 0) {
        if (isTextNode(node)) {
            prevNode = node;
        } else {
            prevNode = node.childNodes[index - 1];
        }
    } else {
        prevNode = _getNodeWithDirectionUntil('previous', node, untilNodeName);
    }

    return prevNode;
};

module.exports = {
    getChildNodeAt: getChildNodeAt,
    getNodeName: getNodeName,
    isTextNode: isTextNode,
    isElemNode: isElemNode,
    getTextLength: getTextLength,
    getOffsetLength: getOffsetLength,
    getPrevOffsetNodeUntil: getPrevOffsetNodeUntil,
    getNodeOffsetOfParent: getNodeOffsetOfParent
};

},{}],9:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var MarkdownEditor = require('./markdownEditor'),
    Preview = require('./preview'),
    WysiwygEditor = require('./wysiwygEditor'),
    Layout = require('./layout'),
    EventManager = require('./eventManager'),
    CommandManager = require('./commandManager'),
    extManager = require('./extManager'),
    ImportManager = require('./importManager'),
    Convertor = require('./convertor'),
    DefaultUI = require('./ui/defaultUI.js');

//markdown commands
var mdBold = require('./markdownCommands/bold'),
    mdItalic = require('./markdownCommands/italic'),
    mdBlockquote = require('./markdownCommands/blockquote'),
    mdHeading = require('./markdownCommands/heading'),
    mdHR = require('./markdownCommands/hr'),
    mdAddLink = require('./markdownCommands/addLink'),
    mdAddImage = require('./markdownCommands/addImage'),
    mdUL = require('./markdownCommands/ul'),
    mdOL = require('./markdownCommands/ol'),
    mdTable = require('./markdownCommands/table'),
    mdTask = require('./markdownCommands/task');

//wysiwyg Commands
var wwBold = require('./wysiwygCommands/bold'),
    wwItalic = require('./wysiwygCommands/italic'),
    wwBlockquote = require('./wysiwygCommands/blockquote'),
    wwAddImage = require('./wysiwygCommands/addImage'),
    wwAddLink = require('./wysiwygCommands/addLink'),
    wwHR = require('./wysiwygCommands/hr'),
    wwHeading = require('./wysiwygCommands/heading'),
    wwUL = require('./wysiwygCommands/ul'),
    wwOL = require('./wysiwygCommands/ol'),
    wwTable = require('./wysiwygCommands/table'),
    wwIncreaseTask = require('./wysiwygCommands/increaseTask'),
    wwTask = require('./wysiwygCommands/task');

var util = tui.util;

var __nedInstance = [];

//default extensions
require('./extensions/taskCounter');
require('./extensions/textPalette');
require('./extensions/scrollFollow');
require('./extensions/colorSyntax');

/**
 * ToastUI Editor
 * @exports ToastUIEditor
 * @constructor
 * @class
 * @param {object} options 옵션
 * @param {number} options.height 에디터 height 픽셀
 * @param {string} options.initialValue 초기 입력 테스트
 * @param {string} options.previewStyle 프리뷰가 출력되는 방식을 정한다(tab, vertical)
 * @param {string} options.initialEditType 시작시 표시될 에디터 타입(markdown, wysiwyg)
 * @param {string} options.contentCSSStyles List of CSS style file path for HTML content.
 * @param {object} options.events eventlist
 * @param {function} options.events.load it would be emitted when editor fully load
 * @param {function} options.events.change it would be emitted when content changed
 * @param {function} options.events.stateChange it would be emitted when format change by cursor position
 * @param {function} options.events.focus it would be emitted when editor get focus
 * @param {function} options.events.blur it would be emitted when editor loose focus
 * @param {object} options.hooks 외부 연결 훅 목록
 * @param {function} options.hooks.previewBeforeHook 프리뷰 되기 직전 실행되는 훅, 프리뷰에 그려질 DOM객체들이 인자로 전달된다.
 * @param {function} options.hooks.addImageBlobHook hook for image upload.
 */
function ToastUIEditor(options) {
    var self = this;

    this.options = $.extend({
        'previewStyle': 'tab',
        'initialEditType': 'markdown',
        'height': 300
    }, options);

    this.eventManager = new EventManager();

    this.importManager = new ImportManager(this.eventManager);

    this.commandManager = new CommandManager(this);
    this.convertor = new Convertor(this.eventManager);

    this.layout = new Layout(options, this.eventManager);

    this.setUI(this.options.UI || new DefaultUI(this));

    this.mdEditor = new MarkdownEditor(this.layout.getMdEditorContainerEl(), this.eventManager);
    this.preview = new Preview(this.layout.getPreviewEl(), this.eventManager, this.convertor);
    this.wwEditor = new WysiwygEditor(this.layout.getWwEditorContainerEl(), this.options.contentCSSStyles, this.eventManager);

    if (this.options.hooks) {
        util.forEach(this.options.hooks, function(fn, key) {
            self.addHook(key, fn);
        });
    }

    if (this.options.events) {
        util.forEach(this.options.events, function(fn, key) {
            self.on(key, fn);
        });
    }


    this.changePreviewStyle(this.options.previewStyle);

    this.mdEditor.init();

    this.wwEditor.init(function() {
        extManager.applyExtension(self, self.options.exts);

        self._initDefaultCommands();

        self.changeMode(self.options.initialEditType);

        self.contentHeight(self.options.height);

        self.setValue(self.options.initialValue);

        self.eventManager.emit('load', self);
    });

    __nedInstance.push(this);
}

ToastUIEditor.prototype._initDefaultCommands = function() {
    this.commandManager.addCommand(mdBold);
    this.commandManager.addCommand(mdItalic);
    this.commandManager.addCommand(mdBlockquote);
    this.commandManager.addCommand(mdHeading);
    this.commandManager.addCommand(mdHR);
    this.commandManager.addCommand(mdAddLink);
    this.commandManager.addCommand(mdAddImage);
    this.commandManager.addCommand(mdUL);
    this.commandManager.addCommand(mdOL);
    this.commandManager.addCommand(mdTable);
    this.commandManager.addCommand(mdTask);

    this.commandManager.addCommand(wwBold);
    this.commandManager.addCommand(wwItalic);
    this.commandManager.addCommand(wwBlockquote);
    this.commandManager.addCommand(wwUL);
    this.commandManager.addCommand(wwOL);
    this.commandManager.addCommand(wwAddImage);
    this.commandManager.addCommand(wwAddLink);
    this.commandManager.addCommand(wwHR);
    this.commandManager.addCommand(wwHeading);
    this.commandManager.addCommand(wwIncreaseTask);
    this.commandManager.addCommand(wwTask);
    this.commandManager.addCommand(wwTable);
};

/**
 * 프리뷰가 보여지는 방식을 변경한다
 * @param {string} style 스타일 이름 tab, vertical
 */
ToastUIEditor.prototype.changePreviewStyle = function(style) {
    this.layout.changePreviewStyle(style);
    this.mdPreviewStyle = style;
    this.eventManager.emit('changePreviewStyle', style);
};

ToastUIEditor.prototype.exec = function() {
    this.commandManager.exec.apply(this.commandManager, arguments);
};

ToastUIEditor.prototype.addCommand = function(type, props) {
    if (!props) {
        this.commandManager.addCommand(type);
    } else {
        this.commandManager.addCommand(CommandManager.command(type, props));
    }
};

ToastUIEditor.prototype.on = function(type, handler) {
    this.eventManager.listen(type, handler);
};

ToastUIEditor.prototype.off = function(type) {
    this.eventManager.removeEventHandler(type);
};

ToastUIEditor.prototype.addHook = function(type, handler) {
    this.eventManager.removeEventHandler(type);
    this.eventManager.listen(type, handler);
};

ToastUIEditor.prototype.removeHook = function(type) {
    this.eventManager.removeEventHandler(type);
};

ToastUIEditor.prototype.getCodeMirror = function() {
    return this.mdEditor.getEditor();
};

ToastUIEditor.prototype.getSquire = function() {
    return this.wwEditor.getEditor();
};

ToastUIEditor.prototype.focus = function() {
   this.getCurrentModeEditor().focus();
};

ToastUIEditor.prototype.setValue = function(markdown) {
    markdown = markdown || '';

    if (this.isMarkdownMode()) {
        this.mdEditor.setValue(markdown);
    } else {
        this.wwEditor.setValue(this.convertor.toHTML(markdown));
    }
};

ToastUIEditor.prototype.getValue = function() {
    var markdown;

    if (this.isMarkdownMode()) {
        markdown = this.mdEditor.getValue();
    } else {
        markdown = this.convertor.toMarkdown(this.wwEditor.getValue());
    }

    return markdown;
};

ToastUIEditor.prototype.addWidget = function(selection, node, style, offset) {
    this.getCurrentModeEditor().addWidget(selection, node, style, offset);
};

ToastUIEditor.prototype.contentHeight  = function(height) {
    if (height) {
        this._contentHeight = height;
        this.mdEditor.setHeight(height);
        this.preview.setHeight(height);
        this.wwEditor.setHeight(height);
    }

    return this._contentHeight;
};

ToastUIEditor.prototype.getCurrentModeEditor = function() {
    var editor;

    if (this.isMarkdownMode()) {
        editor = this.mdEditor;
    } else {
        editor = this.wwEditor;
    }

    return editor;
};

ToastUIEditor.prototype.isMarkdownMode = function() {
    return this.currentMode === 'markdown';
};

ToastUIEditor.prototype.isWysiwygMode = function() {
    return this.currentMode === 'wysiwyg';
};

ToastUIEditor.prototype.getCurrentPreviewStyle = function() {
    return this.mdPreviewStyle;
};

ToastUIEditor.prototype.changeMode = function(mode) {
    if (this.currentMode === mode) {
        return;
    }

    this.currentMode = mode;

    if (this.isWysiwygMode()) {
        this.wwEditor.setValue(this.convertor.toHTML(this.mdEditor.getValue()));
        this.layout.switchToWYSIWYG();
        this.eventManager.emit('changeModeToWysiwyg');
    } else {
        this.mdEditor.setValue(this.convertor.toMarkdown(this.wwEditor.getValue()));
        this.layout.switchToMarkdown();
        this.getCodeMirror().refresh();
        this.eventManager.emit('changeModeToMarkdown');
    }

    this.eventManager.emit('changeMode', mode);
};

ToastUIEditor.prototype.remove = function() {
    this.wwEditor.remove();
    this.mdEditor.remove();
    this.layout.remove();

    if (this.getUI()) {
        this.getUI().remove();
    }
};

ToastUIEditor.prototype.hide = function() {
    this.eventManager.emit('hide', this);
};

ToastUIEditor.prototype.show = function() {
    this.eventManager.emit('show', this);
    this.getCodeMirror().refresh();
};

ToastUIEditor.prototype.setUI = function(UI) {
    this._ui = UI;
};

ToastUIEditor.prototype.getUI = function() {
    return this._ui;
};

ToastUIEditor.prototype.reset = function() {
    this.wwEditor.reset();
    this.mdEditor.reset();
};

ToastUIEditor.getInstances = function() {
    return __nedInstance;
};

ToastUIEditor.defineExtension = function(name, ext) {
    extManager.defineExtension(name, ext);
};

module.exports = ToastUIEditor;

},{"./commandManager":6,"./convertor":7,"./eventManager":10,"./extManager":11,"./extensions/colorSyntax":12,"./extensions/scrollFollow":13,"./extensions/taskCounter":16,"./extensions/textPalette":17,"./importManager":18,"./layout":20,"./markdownCommands/addImage":22,"./markdownCommands/addLink":23,"./markdownCommands/blockquote":24,"./markdownCommands/bold":25,"./markdownCommands/heading":26,"./markdownCommands/hr":27,"./markdownCommands/italic":28,"./markdownCommands/ol":29,"./markdownCommands/table":30,"./markdownCommands/task":31,"./markdownCommands/ul":32,"./markdownEditor":33,"./preview":35,"./ui/defaultUI.js":38,"./wysiwygCommands/addImage":51,"./wysiwygCommands/addLink":52,"./wysiwygCommands/blockquote":53,"./wysiwygCommands/bold":54,"./wysiwygCommands/heading":55,"./wysiwygCommands/hr":56,"./wysiwygCommands/increaseTask":57,"./wysiwygCommands/italic":58,"./wysiwygCommands/ol":59,"./wysiwygCommands/table":60,"./wysiwygCommands/task":61,"./wysiwygCommands/ul":62,"./wysiwygEditor":63}],10:[function(require,module,exports){
/**
 * @fileoverview Implements EventManager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = tui.util;

var eventList = [
    'previewBeforeHook',
    'previewRenderAfter',
    'addImageBlobHook',
    'contentChangedFromWysiwyg',
    'changeFromWysiwyg',
    'contentChangedFromMarkdown',
    'changeFromMarkdown',
    'change',
    'changeModeToWysiwyg',
    'changeModeToMarkdown',
    'changeMode',
    'changePreviewStyle',
    'openPopupAddLink',
    'openPopupAddImage',
    'openPopupAddTable',
    'closeAllPopup',
    'command',
    'htmlUpdate',
    'markdownUpdate',
    'renderedHtmlUpdated',
    'convertorAfterMarkdownToHtmlConverted',
    'convertorAfterHtmlToMarkdownConverted',
    'stateChange',
    'load',
    'focus',
    'blur',
    'paste',
    'copy',
    'drop',
    'show',
    'hide'
];

/**
 * EventManager
 * @exports EventManager
 * @extends {}
 * @constructor
 * @class
 */
function EventManager() {
    this.events = new util.Map();
    this.TYPE = new util.Enum(eventList);
}

EventManager.prototype.listen = function(typeStr, handler) {
    var eventHandlers,
        typeInfo = this._getTypeInfo(typeStr);

    if (!this._hasEventType(typeInfo.type)) {
        throw new Error('There is no event type ' + typeInfo.type);
    }

    eventHandlers = this.events.get(typeInfo.type) || [];

    if (typeInfo.namespace) {
        handler.namespace = typeInfo.namespace;
    }

    eventHandlers.push(handler);

    this.events.set(typeInfo.type, eventHandlers);
};

EventManager.prototype.emit = function() {
    var args = util.toArray(arguments),
        typeStr = args.shift(),
        typeInfo = this._getTypeInfo(typeStr),
        eventHandlers = this.events.get(typeInfo.type),
        result,
        results;

    if (eventHandlers) {
        results = [];

        util.forEach(eventHandlers, function(handler) {
            result = handler.apply(null, args);

            if (!util.isUndefined(result)) {
                results.push(result);
            }
       });
    }

    if (results && results.length) {
        return results;
    }
};

EventManager.prototype.emitReduce = function() {
    var args = util.toArray(arguments),
        type = args.shift(),
        eventHandlers = this.events.get(type);

    if (eventHandlers) {
        util.forEach(eventHandlers, function(handler) {
            var result = handler.apply(null, args);

            if (!util.isFalsy(result)) {
                args[0] = result;
            }
       });
    }

    return args[0];
};

EventManager.prototype._getTypeInfo = function(typeStr) {
    var splited = typeStr.split('.');

    return {
        type: splited[0],
        namespace: splited[1]
    };
};

EventManager.prototype._hasEventType = function(type) {
    return !util.isUndefined(this.TYPE[type.split('.')[0]]);
};

EventManager.prototype.addEventType = function(type) {
    if (this._hasEventType(type)) {
        throw new Error('There is already have event type ' + type);
    }

    this.TYPE.set(type);
};

EventManager.prototype.removeEventHandler = function(type) {
    var self = this,
        typeInfo = this._getTypeInfo(type),
        type = typeInfo.type,
        namespace = typeInfo.namespace;

    if (type && !namespace) {
        this.events.delete(type);
    } else if (!type && namespace) {
        this.events.forEach(function(eventHandlers, eventType) {
            self._removeEventHandlerWithTypeInfo(eventType, namespace);
        });
    } else if (type && namespace) {
        self._removeEventHandlerWithTypeInfo(type, namespace);
    }
};

EventManager.prototype._removeEventHandlerWithTypeInfo = function(type, namespace) {
    var handlersToSurvive = [],
        eventHandlers;

    eventHandlers = this.events.get(type);

    util.forEach(eventHandlers, function(handler) {
        if (handler.namespace !== namespace) {
            handlersToSurvive.push(handler);
        }
    });

    //
    this.events.set(type, handlersToSurvive);
};

module.exports = EventManager;

},{}],11:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = tui.util;

/**
 * ExtManager
 * @exports ExtManager
 * @extends {}
 * @constructor
 * @class
 */
function ExtManager() {
    this.exts = new util.Map();
}

ExtManager.prototype.defineExtension = function(name, ext) {
    this.exts.set(name, ext);
};

ExtManager.prototype.applyExtension = function(context, extNames) {
    var self = this;

    if (extNames) {
        extNames.forEach(function(extName) {
            if (self.exts.has(extName)) {
                self.exts.get(extName)(context);
            }
        });
    }
};

module.exports = new ExtManager();

},{}],12:[function(require,module,exports){
/**
 * @fileoverview Implements Color syntax Extension
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var extManager = require('../extManager');

var colorSyntaxRx = /{color:(.+?)}(.*?){color}/g,
    colorHtmlRx = /<span (?:class="colour" )?style="color:(.+?)"(?: class="colour")?>(.*?)/g,
    colorHtmlCompleteRx = /<span (?:class="colour" )?style="color:(.+?)"(?: class="colour")?>(.*?)<\/span>/g,
    decimalColorRx = /rgb\((\d+)[, ]+(\d+)[, ]+(\d+)\)/g;

var RESET_COLOR = '#181818';

extManager.defineExtension('colorSyntax', function(editor) {
    var useCustomSyntax = false;

    if (editor.options.colorSyntax) {
        useCustomSyntax = !!editor.options.colorSyntax.useCustomSyntax;
    }

    editor.eventManager.listen('convertorAfterMarkdownToHtmlConverted', function(html) {
        var replacement;

        if (!useCustomSyntax) {
            replacement = html;
        } else {
            replacement = html.replace(colorSyntaxRx, function(matched, p1, p2) {
                return makeHTMLColorSyntax(p2, p1);
            });
        }

        return replacement;
    });

    editor.eventManager.listen('convertorAfterHtmlToMarkdownConverted', function(markdown) {
        var findRx = useCustomSyntax ? colorHtmlCompleteRx : colorHtmlRx;

        return markdown.replace(findRx, function(founded, color, text) {
            var replacement;

            if (color.match(decimalColorRx)) {
                color = changeDecColorToHex(color);
            }

            if (!useCustomSyntax) {
                replacement = founded.replace(/ ?class="colour" ?/g, ' ').replace(decimalColorRx, color);
            } else {
                replacement = makeCustomColorSyntax(text, color);
            }

            return replacement;
        });
    });

    editor.addCommand('markdown', {
        name: 'color',
        exec: function(mde, color) {
            var cm = mde.getEditor();

            if (!useCustomSyntax) {
                cm.replaceSelection(makeHTMLColorSyntax(cm.getSelection(), color));
            } else {
                cm.replaceSelection(makeCustomColorSyntax(cm.getSelection(), color));
            }

            mde.focus();
        }
    });

    editor.addCommand('wysiwyg', {
        name: 'color',
        exec: function(wwe, color) {
            if (color === RESET_COLOR) {
               wwe.getEditor().changeFormat(null, {
                   class: 'colour',
                   tag: 'span'
               });
            } else {
                wwe.getEditor().setTextColour(color);
            }
            wwe.focus();
        }
    });

    if (editor.getUI().name === 'default') {
        initUI(editor);
    }
});

function initUI(editor) {
    var $colorPickerContainer, colorPicker, popup, $buttonBar, selectedColor;

    editor.eventManager.addEventType('colorButtonClicked');

    editor.getUI().toolbar.addButton({
        className: 'color',
        event: 'colorButtonClicked',
        text: '\u03FE'
    });

    $colorPickerContainer =  $('<div />');

    $buttonBar = $('<div><button type="button" class="applyButton">입력</button></div>');
    $buttonBar.css('margin-top', 10);

    colorPicker = tui.component.colorpicker.create({
        container: $colorPickerContainer[0]
    });

    $colorPickerContainer.append($buttonBar);

    popup = editor.getUI().createPopup({
        title: false,
        content: $colorPickerContainer,
        $target: editor.getUI().$el,
        css: {
            'width': 178,
            'position': 'absolute',
            'top': $('button.color').offset().top + $('button.color').height() + 5,
            'left': $('button.color').offset().left
        }
    });

    editor.eventManager.listen('focus', function() {
        popup.hide();
    });

    editor.eventManager.listen('colorButtonClicked', function() {
        if (popup.isShow()) {
            popup.hide();
        } else {
            popup.show();
        }
    });

    editor.eventManager.listen('closeAllPopup', function() {
        popup.hide();
    });

    colorPicker.on('selectColor', function(e) {
        selectedColor = e.color;

        if (e.origin === 'palette') {
            editor.exec('color', selectedColor);
            popup.hide();
        }
    });

    popup.$el.find('.applyButton').on('click', function() {
        editor.exec('color', selectedColor);
    });
}

function makeCustomColorSyntax(text, color) {
    return '{color:' + color + '}' + text + '{color}';
}

function makeHTMLColorSyntax(text, color) {
    return '<span style="color:' + color + '">' + text + '</span>';
}

function changeDecColorToHex(color) {
    return color.replace(decimalColorRx, function(colorValue, r, g, b) {
        r = parseInt(r, 10);
        g = parseInt(g, 10);
        b = parseInt(b, 10);

        return '#' + get2DigitNumberString(r.toString(16)) + get2DigitNumberString(g.toString(16)) + get2DigitNumberString(b.toString(16));
    });
}

function get2DigitNumberString(numberStr) {
    return numberStr === '0' ? '00' : numberStr;
}

},{"../extManager":11}],13:[function(require,module,exports){
/**
 * @fileoverview Implements Scroll Follow Extension
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var extManager = require('../extManager'),
    ScrollSync = require('./scrollFollow.scrollSync'),
    SectionManager = require('./scrollFollow.sectionManager');

extManager.defineExtension('scrollFollow', function(editor) {
    var cm = editor.getCodeMirror(),
        scrollable = false,
        active = true,
        sectionManager, scrollSync;

    sectionManager = new SectionManager(cm, editor.preview);
    scrollSync = new ScrollSync(sectionManager, cm, editor.preview.$el);

    //Commands
    editor.addCommand('markdown', {
        name: 'scrollFollowDisable',
        exec: function() {
            active = false;
        }
    });

    editor.addCommand('markdown', {
        name: 'scrollFollowEnable',
        exec: function() {
            active = true;
        }
    });

    //Events
    cm.on('change', function() {
        scrollable = false;
        sectionManager.makeSectionList();
    });

    editor.on('previewRenderAfter', function() {
        sectionManager.sectionMatch();
        scrollSync.syncToPreview();
        scrollable = true;
    });

    cm.on('scroll', function() {
        if (!active || !scrollable) {
            return;
        }

        scrollSync.syncToPreview();
    });

    //UI
    if (editor.getUI().name === 'default') {
        editor.getUI().toolbar.addButton([{
            classname: 'te-scrollfollow-enable',
            command: 'scrollFollowDisable',
            text: '\u0191',
            style: 'background-color: #f5f5f7'
        }, {
            className: 'te-scrollfollow-disable',
            command: 'scrollFollowEnable',
            text: '\u0191',
            style: 'background-color: #ddd'
        }]);
    }
});

},{"../extManager":11,"./scrollFollow.scrollSync":14,"./scrollFollow.sectionManager":15}],14:[function(require,module,exports){
/**
 * @fileoverview Implements Scroll Follow Extension ScrollSync Module
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var SCROLL_TOP_PADDING = 20;

/**
 * ScrollSync
 * manage scroll sync between markdown editor and preview
 * @exports ScrollSync
 * @constructor
 * @class
 * @param {SectionManager} sectionManager sectionManager
 * @param {CodeMirror} cm codemirror
 * @param {jQuery} $previewContainerEl preview container
 */
function ScrollSync(sectionManager, cm, $previewContainerEl) {
    this.sectionManager = sectionManager;
    this.cm = cm;
    this.$previewContainerEl = $previewContainerEl;
    this.$contents = this.$previewContainerEl.find('.tui-editor-contents');

    /**
     * current timeout id needs animation
     * @type {number}
     */
    this._currentTimeoutId = null;
}

/**
 * _getEditorSectionHeight
 * get section height of editor
 * @param {object} section section be caculated height
 * @return {number} height
 */
ScrollSync.prototype._getEditorSectionHeight = function(section) {
    return this.cm.heightAtLine(section.end, 'local') - this.cm.heightAtLine(section.start > 0 ? section.start - 1 : 0, 'local');
};

/**
 * _getLineHeightGapInSection
 * get height gap between passed line in passed section
 * @param {object} section section be caculated
 * @param {number} line line number
 * @return {number} gap
 */
ScrollSync.prototype._getEditorLineHeightGapInSection = function(section, line) {
    var gap = this.cm.heightAtLine(line, 'local') - this.cm.heightAtLine(section.start > 0 ? section.start - 1 : 0, 'local');
    return Math.max(gap, 0);
};

/**
 * _getSectionScrollRatio
 * get ratio of height between scrollTop line and scrollTop section
 * @param {object} section section be caculated
 * @param {number} line line number
 * @return {number} ratio
 */
ScrollSync.prototype._getEditorSectionScrollRatio = function(section, line) {
    var ratio,
        isOneLine = (section.end === section.start);

    if (isOneLine) {
        ratio = 0;
    } else {
        ratio = this._getEditorLineHeightGapInSection(section, line) / this._getEditorSectionHeight(section);
    }
    return ratio;
};

/**
 * _getScrollFactorsOfEditor
 * get Scroll Information of editor for preivew scroll sync
 * @return {object} scroll factors
 */
ScrollSync.prototype._getScrollFactorsOfEditor = function() {
    var topLine, topSection, ratio, isEditorBottom, factors,
        cm = this.cm,
        scrollInfo = cm.getScrollInfo();

    isEditorBottom = (scrollInfo.height - scrollInfo.top) <= scrollInfo.clientHeight;

    if (isEditorBottom) {
        factors = {
            isEditorBottom : isEditorBottom
        };
    } else {
        topLine = cm.coordsChar({
            left: scrollInfo.left,
            top: scrollInfo.top
        }, 'local').line;

        topSection = this.sectionManager.sectionByLine(topLine);

        ratio = this._getEditorSectionScrollRatio(topSection, topLine);

        factors = {
            section: topSection,
            sectionRatio: ratio
        };
    }

    return factors;
};

/**
 * _getScrollTopForPreview
 * get ScrolTop value for preview
 * @return {number|undefined} scrollTop value, when something wrong then return undefined
 */
ScrollSync.prototype._getScrollTopForPreview = function() {
    var scrollTop, scrollFactors, section, ratio;

    scrollFactors = this._getScrollFactorsOfEditor();
    section = scrollFactors.section,
    ratio = scrollFactors.sectionRatio;

    if (scrollFactors.isEditorBottom) {
        scrollTop = this.$contents.height();
    } else if (section.$previewSectionEl) {
        scrollTop = section.$previewSectionEl[0].offsetTop + (section.$previewSectionEl.height() * ratio) - SCROLL_TOP_PADDING;
    }

    scrollTop = scrollTop && Math.max(scrollTop, 0);

    return scrollTop;
};


/**
 * syncToPreview
 * sync preview with markdown scroll
 */
ScrollSync.prototype.syncToPreview = function() {
    var self = this,
        targetScrollTop = this._getScrollTopForPreview();

    this._animateRun(this.$previewContainerEl.scrollTop(), targetScrollTop, function(deltaScrollTop) {
        self.$previewContainerEl.scrollTop(deltaScrollTop);
    });
};

/**
 * _animateRun
 * animate with passed Callback
 * @param {number} originValue original value
 * @param {number} targetValue target value
 * @param {function} stepCB callback function
 */
ScrollSync.prototype._animateRun = function(originValue, targetValue, stepCB) {
    var valueDiff = targetValue - originValue,
        startTime = Date.now(),
        self = this;

    //if already doing animation
    if (this._currentTimeoutId) {
        clearTimeout(this._currentTimeoutId);
    }

    function step() {
        var deltaValue,
            stepTime = Date.now(),
            progress = (stepTime - startTime) / 200; //200 is animation time

        if (progress < 1) {
            deltaValue = originValue + valueDiff * Math.cos((1 - progress) * Math.PI / 2);
            stepCB(Math.ceil(deltaValue));
            self._currentTimeoutId = setTimeout(step, 1);
        } else {
            stepCB(targetValue);
            self._currentTimeoutId = null;
        }
    }

    step();
};

module.exports = ScrollSync;

},{}],15:[function(require,module,exports){
/**
 * @fileoverview Implements Scroll Follow Extension SectionManager Module
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var setextHeaderRx = /^ *(?:\={1,}|-{1,})\s*$/;

/*
 * SectionManager
 * manage logical markdown content sections
 * @exports SectionManager
 * @constructor
 * @class
 * @param {CodeMirror} cm codemirror
 * @param {Preview} preview preview
 */
function SectionManager(cm, preview) {
    this.cm = cm;
    this.preview = preview;
    this.$previewContent = preview.$el.find('.tui-editor-contents');

    /**
     *  section list
     * @type {object[]}
     */
    this._sectionList = null;

    /**
     * current working section needs making section list
     * @type {object}
     */
    this._currentSection = null;
}

/**
 * _addNewSection
 * add new section
 * @param {number} start initial start line number
 * @param {number} end initial end line number
 */
SectionManager.prototype._addNewSection = function(start, end) {
    var newSection = this._makeSectionData(start, end);
    this._sectionList.push(newSection);
    this._currentSection = newSection;
};

/**
 * getSectionList
 * return section list
 * @return {object[]} section object list
 */
SectionManager.prototype.getSectionList = function() {
    return this._sectionList;
};

/**
 * _makeSectionData
 * make default section object
 * @param {number} start initial start line number
 * @param {number} end initial end line number
 * @return {object} section object
 */
SectionManager.prototype._makeSectionData = function(start, end) {
    return {
        start: start,
        end: end,
        $previewSectionEl: null
    };
};

/**
 * _updateCurrentSectionEnd
 * update current section's end line number
 * @param {number} end end value to update
 */
SectionManager.prototype._updateCurrentSectionEnd = function(end) {
    this._currentSection.end = end;
};

/**
 * _eachLineState
 * iterate codemiror lines, callback function parameter pass line type and line number
 * @param {function} iteratee callback function
 */
SectionManager.prototype._eachLineState = function(iteratee) {
    var isSection, state, i, lineLength,
        isTrimming = true,
        trimCapture = '';

    lineLength = this.cm.getDoc().lineCount();

    for (i = 0; i < lineLength; i+=1) {
        state = this.cm.getStateAfter(i);
        isSection = false;

        //atx header
        if (this.cm.getLine(i)
            && state.base.header
            && !state.base.quote
            && !state.base.list
            && !state.base.taskList
        ) {
            isSection = true;
        //setext header
        } else if (this.cm.getLine(i+1) && this.cm.getLine(i+1).match(setextHeaderRx)) {
            isSection = true;
        }

        //빈공간으로 시작되다다가 헤더를 만난경우 섹션은 두개가 생성되는데
        //프리뷰에서는 빈공간이 트리밍되어 섹션 한개 밖에 생성되지 않아 매칭이 되지 않는 문제 해결
        if (isTrimming) {
            trimCapture += this.cm.getLine(i).trim();

            if (trimCapture) {
                isTrimming = false;
            } else {
                continue;
            }
        }

        iteratee(isSection, i);
    }
};

/**
 * makeSectionList
 * make section list
 */
SectionManager.prototype.makeSectionList = function() {
    var self = this;

    this._sectionList = [];

    this._eachLineState(function(isSection, lineNumber) {
        if (isSection || !self._sectionList.length) {
            self._addNewSection(lineNumber, lineNumber);
        } else {
            self._updateCurrentSectionEnd(lineNumber);
        }
    });
};


/**
 * sectionMatch
 * make preview sections then match section list with preview section element
 */
SectionManager.prototype.sectionMatch = function() {
    var sections;

    if (this._sectionList) {
        sections = this._getPreviewSections();
        this._matchPreviewSectionsWithSectionlist(sections);
    }
};

/**
 * _matchPreviewSectionsWithSectionlist
 * match section list with preview section element
 * @param {HTMLNode[]} sections section nodes
 */
SectionManager.prototype._matchPreviewSectionsWithSectionlist = function(sections) {
    var self = this;

    sections.forEach(function(childs, index) {
        var $sectionDiv;

        if (self._sectionList[index]) {
            $sectionDiv = $('<div class="content-id-'+ index + '"></div>');
            self._sectionList[index].$previewSectionEl = $(childs).wrapAll($sectionDiv).parent();
        }
    });
};

/**
 * _getPreviewSections
 * get preview html section group to make section
 * @return {array[]} element node array
 */
SectionManager.prototype._getPreviewSections = function() {
    var lastSection = 0,
        sections = [];

    sections[0] = [];

    this.$previewContent.contents().filter(function() {
        return this.nodeType === Node.ELEMENT_NODE;
    }).each(function(index, el) {
        if (el.tagName.match(/H1|H2|H3|H4|H5|H6/)) {
            if (sections[lastSection].length) {
                sections.push([]);
                lastSection += 1;
            }
        }

        sections[lastSection].push(el);
    });

    return sections;
};

/**
 * _sectionByLine
 * get section by markdown line
 * @param {number} line markdown editor line number
 * @return {object} section
 */
SectionManager.prototype.sectionByLine = function(line) {
    var sectionIndex,
        sectionList = this._sectionList,
        sectionLength = sectionList.length;

    for (sectionIndex = 0; sectionIndex < sectionLength; sectionIndex+=1) {
        if (line <= sectionList[sectionIndex].end) {
            break;
        }
    }

    if (sectionIndex === sectionLength) {
        sectionIndex = sectionLength - 1;
    }

    return sectionList[sectionIndex];
};

module.exports = SectionManager;

},{}],16:[function(require,module,exports){
'use strict';

var extManager = require('../extManager');

var FIND_TASK_RX = /^\s*\* \[[xX ]\] [^\n]*/mg;
var FIND_CHECKED_TASK_RX = /^\s*\* \[[xX]\] [^\n]*/mg;

extManager.defineExtension('taskCounter', function(editor) {
    editor.getTaskCount = function() {
        var found, count;

        if (editor.isMarkdownMode()) {
            found = editor.mdEditor.getValue().match(FIND_TASK_RX);
            count = found ? found.length : 0;
        } else {
            count = editor.wwEditor.get$Body().find('input').length;
        }

        return count;
    };

    editor.getCheckedTaskCount = function() {
        var found, count;

        if (editor.isMarkdownMode()) {
            found = editor.mdEditor.getValue().match(FIND_CHECKED_TASK_RX);
            count = found ? found.length : 0;
        } else {
            count = editor.wwEditor.get$Body().find('input:checked').length;
        }

        return count;
    };
});

},{"../extManager":11}],17:[function(require,module,exports){
'use strict';

var extManager = require('../extManager');

extManager.defineExtension('textPalette', function(editor) {
    var $layer = $('<div style="z-index:9999"><input type="text" style="background:white" /></div>');
    var triggers = editor.options.textPalette.triggers,
        querySender = editor.options.textPalette.querySender;

    $(editor.options.el).append($layer);

    $layer.find('input').on('keyup', function(e) {
        var query = $layer.find('input').val();

        if (e.which === 13) {
            e.stopPropagation();
            //editor.getCurrentModeEditor().replaceSelection(query);
            editor.getCurrentModeEditor().replaceRelativeOffset(query, -1, 1);
            editor.focus();
            hideUI($layer);
        } else {
            querySender(query, function(list) {
                updateUI($layer, list);
            });
        }
    });

    editor.eventManager.listen('change', function(ev) {
        if (triggers.indexOf(ev.textContent[ev.caretOffset - 1]) !== -1) {
            editor.addWidget(ev.selection, $layer[0], 'over');
            showUI($layer);
        }
    });
});

function showUI($layer) {
    $layer.show();
    $layer.find('input').focus();
}

function hideUI($layer) {
    $layer.hide();
    $layer.find('input').val('');
}

function updateUI($layer, list) {
    void 0;
}

},{"../extManager":11}],18:[function(require,module,exports){
/**
 * @fileoverview Implement Module for managing import external data such as image
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = tui.util;

/**
 * ImportManager
 * @exports ImportManager
 * @constructor
 * @class
 * @param {EventManager} eventManager eventManager
 */
function ImportManager(eventManager) {
    this.eventManager = eventManager;

    this._initDropEvent();
    this._initPasteEvent();
    this._initDefaultImageImporter();
}

ImportManager.prototype._initDropEvent = function() {
    var self = this;

    this.eventManager.listen('drop', function(ev) {
        var items = ev.data.dataTransfer && ev.data.dataTransfer.files;
        self._processEachItems(items);
    });
};

ImportManager.prototype._initPasteEvent = function() {
    var self = this;

    this.eventManager.listen('paste', function(ev) {
        var items = ev.data.clipboardData && ev.data.clipboardData.items;
        self._processEachItems(items);
    });
};

ImportManager.prototype._initDefaultImageImporter = function() {
    this.eventManager.listen('addImageBlobHook', function(blob, callback) {
        var reader = new FileReader();

        reader.onload = function(event) {
            callback(event.target.result);
        };

        reader.readAsDataURL(blob);
    });
};

ImportManager.prototype._emitAddImageBlobHook = function(item) {
    var self = this,
        blob = item.name ? item : item.getAsFile(); //Blob or File

    this.eventManager.emit('addImageBlobHook', blob, function(url) {
        self.eventManager.emit('command', 'AddImage', {imageUrl: url, altText: blob.name || 'image'});
    });
};

ImportManager.prototype._processEachItems = function(items) {
    var self = this;

    if (items) {
        util.forEachArray(items, function(item) {
            if (item.type.indexOf('image') !== -1) {
                self._emitAddImageBlobHook(item);
                return false;
            }
        });
    }
};

module.exports = ImportManager;

},{}],19:[function(require,module,exports){
/**
 * @fileoverview entry point
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var ToastUIEditor;

//codemirror modes&addons
require('./codemirror/overlay');
require('./codemirror/markdown');
require('./codemirror/gfm');
require('./codemirror/continuelist');

ToastUIEditor = require('./editor');

//for jquery
$.fn.tuiEditor = function() {
    var args = $.makeArray(arguments),
        options,
        instance,
        el;

    el = this[0];

    if (el) {
        options = args[0] || {};

        instance = $.data(el, 'tuiEditor');

        if (instance) {
            if (typeof options === 'string') {
                return instance[options].apply(instance, args.slice(1));
            }
        } else {
            options.el = el;
            instance = new ToastUIEditor(options);
            $.data(el, 'tuiEditor', instance);
        }
    }

    return this;
};

window.tui = window.tui || {};
window.tui.Editor = ToastUIEditor;

},{"./codemirror/continuelist":1,"./codemirror/gfm":2,"./codemirror/markdown":3,"./codemirror/overlay":4,"./editor":9}],20:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var containerTmpl = [
    '<div class="tui-editor">',
        '<div class="te-md-container">',
            '<div class="te-editor" />',
            '<div class="te-md-splitter" />',
            '<div class="te-preview" />',
        '</div>',
        '<div class="te-ww-container">',
            '<div class="te-editor" />',
        '</div>',
    '</div>'
].join('');

/**
 * Layout
 * @exports Layout
 * @extends {}
 * @constructor
 * @class
 * @param {object} options 옵션
 * @param {EventManager} eventManager 이벤트 매니저
 */
function Layout(options, eventManager) {
    this.$el = $(options.el);
    this.height = options.height;
    this.type = options.initialEditType;
    this.eventManager = eventManager;

    this.init();
    this._initEvent();
}

Layout.prototype.init = function() {
    this._renderLayout();

    this._initMarkdownAndPreviewSection();
    this._initWysiwygSection();
};

Layout.prototype._initEvent = function() {
    this.eventManager.listen('hide', this.hide.bind(this));
    this.eventManager.listen('show', this.show.bind(this));
};

Layout.prototype._renderLayout = function() {
    this.$containerEl = $(containerTmpl).appendTo(this.$el);
};

Layout.prototype.switchToWYSIWYG = function() {
    this.$containerEl.removeClass('te-md-mode');
    this.$containerEl.addClass('te-ww-mode');
};

Layout.prototype.switchToMarkdown = function() {
    this.$containerEl.removeClass('te-ww-mode');
    this.$containerEl.addClass('te-md-mode');
};

Layout.prototype._initMarkdownAndPreviewSection = function() {
    this.$mdEditorContainerEl = this.$containerEl.find('.te-md-container .te-editor');
    this.$previewEl = this.$containerEl.find('.te-md-container .te-preview');
};

Layout.prototype._initWysiwygSection = function() {
    this.$wwEditorContainerEl = this.$containerEl.find('.te-ww-container .te-editor');
};

Layout.prototype._verticalSplitStyle = function() {
    this.$containerEl.find('.te-md-container').removeClass('te-preview-style-tab');
    this.$containerEl.find('.te-md-container').addClass('te-preview-style-vertical');
};

Layout.prototype._tabStyle = function() {
    this.$containerEl.find('.te-md-container').removeClass('te-preview-style-vertical');
    this.$containerEl.find('.te-md-container').addClass('te-preview-style-tab');
};

Layout.prototype.changePreviewStyle = function(style) {
    if (style === 'tab') {
        this._tabStyle();
    } else if (style === 'vertical') {
        this._verticalSplitStyle();
    }
};

Layout.prototype.hide = function() {
    this.$el.find('.tui-editor').addClass('te-hide');
};

Layout.prototype.show = function() {
    this.$el.find('.tui-editor').removeClass('te-hide');
};

Layout.prototype.remove = function() {
    this.$el.find('.tui-editor').remove();
};

Layout.prototype.getEditorEl = function() {
    return this.$containerEl;
};

Layout.prototype.getPreviewEl = function() {
    return this.$previewEl;
};

Layout.prototype.getMdEditorContainerEl = function() {
    return this.$mdEditorContainerEl;
};

Layout.prototype.getWwEditorContainerEl = function() {
    return this.$wwEditorContainerEl;
};

module.exports = Layout;

},{}],21:[function(require,module,exports){
/**
 * @fileoverview Implements LazyRunner
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = tui.util;

/**
 * LazyRunner
 * @exports LazyRunner
 * @augments
 * @constructor
 * @class
 */
function LazyRunner() {
    this.globalTOID = null;
    this.lazyRunFunctions = {};
}

LazyRunner.prototype.run = function(fn, params, context, delay) {
    var TOID;

    if (util.isString(fn)) {
        TOID = this._runRegisteredRun(fn, params, context, delay);
    } else {
        TOID = this._runSingleRun(fn, params, context, delay, this.globalTOID);
        this.globalTOID = TOID;
    }

    return TOID;
};

LazyRunner.prototype.registerLazyRunFunction = function(name, fn, delay, context) {
    context = context || this;

    this.lazyRunFunctions[name] = {
        fn: fn,
        delay: delay,
        context: context,
        TOID: null
    };
};

LazyRunner.prototype._runSingleRun = function(fn, params, context, delay, TOID) {
    this._clearTOIDIfNeed(TOID);

    TOID = setTimeout(function() {
        fn.call(context, params);
    }, delay);

    return TOID;
};

LazyRunner.prototype._runRegisteredRun = function(lazyRunName, params, context, delay) {
    var TOID, fn;

    fn = this.lazyRunFunctions[lazyRunName].fn;
    TOID = this.lazyRunFunctions[lazyRunName].TOID;
    delay = delay || this.lazyRunFunctions[lazyRunName].delay;
    context = context || this.lazyRunFunctions[lazyRunName].context;

    TOID = this._runSingleRun(fn, params, context, delay, TOID);

    this.lazyRunFunctions[lazyRunName].TOID = TOID;

    return TOID;
};

LazyRunner.prototype._clearTOIDIfNeed = function(TOID) {
    if (TOID) {
        clearTimeout(TOID);
    }
};

module.exports = LazyRunner;

},{}],22:[function(require,module,exports){
/**
 * @fileoverview Implments AddImage markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * AddImage
 * Add Image markdown syntax to markdown Editor
 * @exports AddImage
 * @augments Command
 */
var AddImage = CommandManager.command('markdown',
/** @lends AddImage */
{
    name: 'AddImage',
    /**
     * Command Handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     * @param {object} data data for image
     */
    exec: function(mde, data) {
        var replaceText, range, from, to,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: range.from.ch
        };

        to = {
            line: range.to.line,
            ch: range.to.ch
        };

        replaceText = '![' + data.altText + '](' + data.imageUrl + ')';

        doc.replaceRange(replaceText, from, to, '+addImage');

        cm.focus();
    }
});

module.exports = AddImage;

},{"../commandManager":6}],23:[function(require,module,exports){
/**
 * @fileoverview Implements Addlink markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * AddLink
 * Add link markdown syntax to markdown editor
 * @exports AddLink
 * @augments Command
 */
var AddLink = CommandManager.command('markdown',/** @lends AddLink */{
    name: 'AddLink',
    /**
     *  커맨드 핸들러
     *  @param {MarkdownEditor} mde MarkdownEditor instance
     *  @param {object} data data for image
     */
    exec: function(mde, data) {
        var replaceText, range, from, to,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: range.from.ch
        };

        to = {
            line: range.to.line,
            ch: range.to.ch
        };

        replaceText = '[' + data.linkText + '](' + data.url + ')';

        doc.replaceRange(replaceText, from, to);

        cm.focus();
    }
});

module.exports = AddLink;

},{"../commandManager":6}],24:[function(require,module,exports){
/**
 * @fileoverview Implements Blockquote markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Blockquote
 * Add blockquote markdown syntax to markdown editor
 * @exports Blockquote
 * @augments Command
 */
var Blockquote = CommandManager.command('markdown',/** @lends Blockquote */{
    name: 'Blockquote',
    keyMap: ['Ctrl-Q', 'Ctrl-Q'],
    /**
     *  커맨드 핸들러
     *  @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec: function(mde) {
        var textToModify, range, from, to, textLinesToModify, lineLength, i,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        //range 을 가공함
        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: 0
        };

        to = {
            line: range.to.line,
            ch: doc.getLineHandle(range.to.line).text.length
        };

        //영역의 텍스트를 가저오고
        textToModify = doc.getRange(from, to);

        //텍스트 컨텐트를 변경 한다
        textLinesToModify = textToModify.split('\n');
        lineLength = textLinesToModify.length;

        for (i = 0; i < lineLength; i += 1) {
            textLinesToModify[i] = '>' + textLinesToModify[i];
        }

        //해당 에디터의 내용을 변경한다
        doc.replaceRange(textLinesToModify.join('\n'), from, to);

        range.to.ch += 1;

        doc.setCursor(range.to);

        cm.focus();
    }
});

module.exports = Blockquote;

},{"../commandManager":6}],25:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var boldRegex = /^[\*_]{2,}[^\*_]*[\*_]{2,}$/;

/**
 * Bold
 * Add bold markdown syntax to markdown editor
 * @exports Bold
 * @augments Command
 */
var Bold = CommandManager.command('markdown',/** @lends Bold */{
    name: 'Bold',
    keyMap: ['Ctrl-B', 'Ctrl-B'],
    /**
     * Command Handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec: function(mde) {
        var cursor, selection, tmpSelection, isRemoved, result, isEmpty,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        cursor = doc.getCursor();
        selection = doc.getSelection();
        isEmpty = !selection;

        // if selection is empty, expend selection to detect a syntax
        if (isEmpty && cursor.ch > 1) {
            tmpSelection = this.expendSelection(doc, cursor);
            selection = tmpSelection || selection;
        }

        isRemoved = this.isNeedRemove(selection);
        result = isRemoved ? this.remove(selection) : this.append(selection);

        doc.replaceSelection(result, 'around');

        if (isEmpty && !isRemoved) {
            this.setCursorToCenter(doc, cursor);
        }

        cm.focus();
    },
    /**
     * 이미 Bold가 적용이 되어있는지 확인
     * @param {string} text 셀렉션텍스트
     * @return {boolean} 볼드 적용 여부
     */
    isNeedRemove: function(text) {
        return boldRegex.test(text);
    },
    /**
     * Bold를 적용한다
     * @param {string} text 셀렉션텍스트
     * @return {string} 볼드가 적용된 텍스트
     */
    append: function(text) {
        return '**' + text + '**';
    },
    /**
     * Bold를 제거한다
     * @param {string} text 셀렉션텍스트
     * @return {string} 볼드가 제거된 텍스트
     */
    remove: function(text) {
        return text.substr(2, text.length - 4);
    },
    /**
     * 셀렉션영역을 확장한다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트 객체
     * @param {object} cursor 코드미러 커서 객체
     * @return {string} 셀렉션의 텍스트
     */
    expendSelection: function(doc, cursor) {
        var tmpSelection = doc.getSelection();

        doc.setSelection({line: cursor.line, ch: cursor.ch - 2}, {line: cursor.line, ch: cursor.ch + 2});

        if (tmpSelection === '****' || tmpSelection === '____') {
            return tmpSelection;
        }

        doc.setSelection(cursor);
    },
    /**
     * 커서를 센터로 이동시킨다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트 객체
     * @param {object} cursor 코드미러 커서 객체
     */
    setCursorToCenter: function(doc, cursor) {
        doc.setCursor(cursor.line, cursor.ch + 2);
    }
});

module.exports = Bold;

},{"../commandManager":6}],26:[function(require,module,exports){
/**
 * @fileoverview Implements Heading markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Heading
 * Add heading markdown syntax to markdown editor
 * @exports Heading
 * @augments Command
 */
var Heading = CommandManager.command('markdown',/** @lends Heading */{
    name: 'Heading',
    keyMap: ['Ctrl-H', 'Ctrl-H'],
    /**
     * Command Handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec: function(mde) {
        var textToModify, range, from, to, textLinesToModify, lineLength, i, lengthOfCurrentLineBefore,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        // 선택된 영역을 가공함
        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: 0
        };

        to = {
            line: range.to.line,
            ch: doc.getLineHandle(range.to.line).text.length
        };

        lengthOfCurrentLineBefore = doc.getLine(to.line).length;

        //영역의 텍스트를 가저오고
        textToModify = doc.getRange(from, to);

        //원하는 대로 가공한다
        textLinesToModify = textToModify.split('\n');
        lineLength = textLinesToModify.length;

        for (i = 0; i < lineLength; i += 1) {
            textLinesToModify[i] = getHeadingMarkdown(textLinesToModify[i]);
        }

        //해당 에디터의 내용을 변경한다
        doc.replaceRange(textLinesToModify.join('\n'), from, to);

        range.to.ch += doc.getLine(to.line).length - lengthOfCurrentLineBefore;
        doc.setCursor(range.to);

        cm.focus();
    }
});

var FIND_HEADING_RX = /^#+\s/g;

function getHeadingMarkdown(text) {
    var foundedHeading = text.match(FIND_HEADING_RX),
        heading;

    if (foundedHeading) {
        heading = '#' + foundedHeading[0];

        if (heading.match(/#/g).length === 7) {
            heading = '# ';
        }

        text = text.split(foundedHeading[0])[1];
    } else {
        heading = '# ';
    }

    return heading + text;
}

module.exports = Heading;

},{"../commandManager":6}],27:[function(require,module,exports){
/**
 * @fileoverview HR markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * HR
 * Add HR markdown syntax to markdown editor
 * @exports HR
 * @augments Command
 */
var HR = CommandManager.command('markdown',/** @lends HR */{
    name: 'HR',
    /**
     * Command handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec: function(mde) {
        var range, from, to,
            cm = mde.getEditor(),
            replaceText = '',
            doc = cm.getDoc();

        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: range.from.ch
        };

        to = {
            line: range.to.line,
            ch: range.to.ch
        };

        if (range.collapsed) {
            replaceText = doc.getLine(from.line);
            from.ch = 0;
            to.ch = doc.getLineHandle(range.to.line).text.length;
        }

        if (doc.getLine(from.line).length) {
            replaceText += '\n\n* * *\n\n';
        } else {
            replaceText += '\n* * *\n';
        }

        doc.replaceRange(replaceText, from, to);

        cm.focus();
    }
});

module.exports = HR;

},{"../commandManager":6}],28:[function(require,module,exports){
/**
 * @fileoverview Implements Italic markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var boldItalicRegex = /^[\*_]{3,}[^\*_]*[\*_]{3,}$/;
var italicRegex = /^[\*_][^\*_]*[\*_]$/;

/**
 * Italic
 * Add italic markdown syntax to markdown editor
 * @exports Italic
 * @augments Command
 */
var Italic = CommandManager.command('markdown',/** @lends Italic */{
    name: 'Italic',
    keyMap: ['Ctrl-I', 'Ctrl-I'],
    /**
     * Command handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec: function(mde) {
        var cursor, selection, tmpSelection, isRemoved, result, isEmpty, isWithBold,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        cursor = doc.getCursor();
        selection = doc.getSelection();
        isEmpty = !selection;
        isWithBold = false;

        // if selection is empty, expend selection to detect a syntax
        if (isEmpty) {
            if (cursor.ch > 2) {
                tmpSelection = this.expendWithBoldSelection(doc, cursor);

                if (tmpSelection) {
                    isWithBold = 'with';
                }
            }

            if (isWithBold !== 'with' && cursor.ch > 1) {
                isWithBold = this.expendOnlyBoldSelection(doc, cursor);
            }

            if (!isWithBold && cursor.ch > 0) {
                this.expendSelection(doc, cursor);
                selection = tmpSelection || selection;
            }
        }

        isRemoved = this.isNeedRemove(selection);
        result = isRemoved ? this.remove(selection) : this.append(selection);

        doc.replaceSelection(result, 'around');

        if (isEmpty) {
            this.setCursorToCenter(doc, cursor, isRemoved);
        }

        cm.focus();
    },
    /**
     * isNeedRemove
     * 이미 텍스트에 이탤릭이나 볼드가 적용되어 있는지 판단한다
     * @param {string} text 텍스트
     * @return {boolean} 적용 여부
     */
    isNeedRemove: function(text) {
        return italicRegex.test(text) || boldItalicRegex.test(text);
    },
    /**
     * append
     * 텍스트에 이탤릭을 적용한다
     * @param {string} text 적용할 텍스트
     * @return {string} 이탤릭이 적용된 텍스트
     */
    append: function(text) {
        return '_' + text + '_';
    },
    /**
     * remove
     * 텍스트에서 이탤릭을 제거한다
     * @param {string} text 제거할 텍스트
     * @return {string} 제거된 텍스트
     */
    remove: function(text) {
        return text.substr(1, text.length - 2);
    },
    /**
     * expendWithBoldSelection
     * 볼드와 함께 적용된 셀렉션 영역을 확장한다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
     * @param {object} cursor 커서객체
     * @return {string} 확장된 영역의 텍스트
     */
    expendWithBoldSelection: function(doc, cursor) {
        var tmpSelection = doc.getSelection();

        doc.setSelection({line: cursor.line, ch: cursor.ch - 3}, {line: cursor.line, ch: cursor.ch + 3});

        if (tmpSelection === '******' || tmpSelection === '______') {
            return tmpSelection;
        }

        doc.setSelection(cursor);
    },
    /**
     * expendOnlyBoldSelection
     * 볼드만 적용된 셀렉션 영역을 확장한다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
     * @param {object} cursor 커서객체
     * @return {string} 확장된 영역의 텍스트
     */
    expendOnlyBoldSelection: function(doc, cursor) {
        var tmpSelection = doc.getSelection();

        doc.setSelection({line: cursor.line, ch: cursor.ch - 2}, {line: cursor.line, ch: cursor.ch + 2});

        if (tmpSelection === '****' || tmpSelection === '____') {
            doc.setSelection(cursor);
            return 'only';
        }

        return false;
    },
    /**
     * expendSelection
     * 이탤릭이 적용된 셀렉션 영역을 확장한다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
     * @param {object} cursor 커서객체
     * @return {string} 확장된 영역의 텍스트
     */
    expendSelection: function(doc, cursor) {
        var tmpSelection = doc.getSelection();

        doc.setSelection({line: cursor.line, ch: cursor.ch - 1}, {line: cursor.line, ch: cursor.ch + 1});

        if (tmpSelection === '**' || tmpSelection === '__') {
            return tmpSelection;
        }

        doc.setSelection(cursor);
    },
    /**
     * setCursorToCenter
     * 커서를 중앙으로 이동시킨다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
     * @param {object} cursor 커서객체
     * @param {boolean} isRemoved 변경사항이 지우는 변경이었는지 여부
     */
    setCursorToCenter: function(doc, cursor, isRemoved) {
        var pos = isRemoved ? -1 : 1;
        doc.setCursor(cursor.line, cursor.ch + pos);
    }
});

module.exports = Italic;

},{"../commandManager":6}],29:[function(require,module,exports){
/**
 * @fileoverview Implements OL markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * OL
 * Add ordered list markdown syntax to markdown editor
 * @exports OL
 * @augments Command
 */
var OL = CommandManager.command('markdown',/** @lends OL */{
    name: 'OL',
    /**
     * Command handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec: function(mde) {
        var replaceText, range, from, to,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: range.from.ch
        };

        to = {
            line: range.to.line,
            ch: range.to.ch
        };

        replaceText = '1. ';

        doc.replaceRange(replaceText, from, to);

        cm.focus();
    }
});

module.exports = OL;

},{"../commandManager":6}],30:[function(require,module,exports){
/**
 * @fileoverview Implements Table markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Table
 * Add table markdown syntax to markdown editor
 * @exports Table
 * @augments Command
 */
var Table = CommandManager.command('markdown',/** @lends Table */{
    name: 'Table',
    /**
     * Command handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     * @param {number} col column count
     * @param {number} row row count
     */
    exec: function(mde, col, row) {
        var cm = mde.getEditor(),
            doc = cm.getDoc(),
            table = '\n';

        if (cm.getCursor().ch > 0) {
            table += '\n';
        }

        table += makeHeader(col);
        table += makeBody(col, row - 1);

        doc.replaceSelection(table);

        cm.setCursor(cm.getCursor().line - (row + 1), 2); //+1 means header border line

        mde.focus();
    }
});

/*
 * makeHeader
 * make table header markdown string
 * @param {number} col column count
 * @return {string} markdown string
 */
function makeHeader(col) {
    var header = '|',
        border = '|';

    while (col) {
        header += '    |';
        border +=' -- |';

        col -= 1;
    }

    return header + '\n' + border + '\n';
}

/**
 * makeBody
 * make table body markdown string
 * @param {number} col column count
 * @param {number} row row count
 * @return {string} html string
 */
function makeBody(col, row) {
    var body = '',
        irow, icol;

    for (irow = 0; irow < row; irow += 1) {
        body += '|';

        for (icol = 0; icol < col; icol += 1) {
            body += '    |';
        }

        body += '\n';
    }

    return body;
}
module.exports = Table;

},{"../commandManager":6}],31:[function(require,module,exports){
/**
 * @fileoverview Implements Task markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Task
 * @exports Task
 * @augments Command
 */

var Task = CommandManager.command('markdown',/** @lends Task */{
    name: 'Task',
    /**
     * Command handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec: function(mde) {
        var replaceText, range, from, to,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: range.from.ch
        };

        to = {
            line: range.to.line,
            ch: range.to.ch
        };

        replaceText = '* [ ] ';

        doc.replaceRange(replaceText, from, to);

        cm.focus();
    }
});

module.exports = Task;

},{"../commandManager":6}],32:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * UL
 * Add unordered list markdown syntax to markdown editor
 * @exports UL
 * @augments Command
 */
var UL = CommandManager.command('markdown',/** @lends UL */{
    name: 'UL',
    /**
     * Command handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec: function(mde) {
        var replaceText, range, from, to,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: range.from.ch
        };

        to = {
            line: range.to.line,
            ch: range.to.ch
        };

        replaceText = '* ';

        doc.replaceRange(replaceText, from, to);

        cm.focus();
    }
});

module.exports = UL;

},{"../commandManager":6}],33:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CodeMirror = window.CodeMirror;

/**
 * MarkdownEditor
 * @exports MarkdownEditor
 * @extends {}
 * @constructor
 * @class
 * @param {jQuery} $el 에디터가 들어갈 엘리먼트
 * @param {EventManager} eventManager 이벤트 매니저
 * @param {commandManager} commandManager 커맨드 매니저
 */
function MarkdownEditor($el, eventManager) {
    this.eventManager = eventManager;
    this.$editorContainerEl = $el;

    this._latestState = {
        bold: false,
        italic: false
    };
}

MarkdownEditor.prototype.init = function(initialValue) {
    var cmTextarea = $('<textarea />');

    if (initialValue) {
        cmTextarea.text(initialValue);
        this._emitMarkdownEditorContentChangedEvent(initialValue);
    }

    this.$editorContainerEl.append(cmTextarea);

    this.cm = CodeMirror.fromTextArea(cmTextarea[0], {
        lineWrapping: true,
        mode: 'gfm',
        theme: 'default',
        dragDrop: true,
        allowDropFileTypes: ['image'],
        extraKeys: {
            'Enter': 'newlineAndIndentContinueMarkdownList',
            'Tab': 'subListIndentTab',
            'Shift-Tab': 'indentLess'
        },
        indentUnit: 4
    });

    this._initEvent();
};

MarkdownEditor.prototype._initEvent = function() {
    var self = this;

    this.cm.on('change', function(cm, cmEvent) {
        self._emitMarkdownEditorContentChangedEvent();
        self._emitMarkdownEditorChangeEvent(cmEvent);
    });

    this.cm.on('focus', function() {
        self.eventManager.emit('focus', {
            source: 'markdown'
        });
    });

    this.cm.on('blur', function() {
        self.eventManager.emit('blur', {
            source: 'markdown'
        });
    });

    this.cm.getWrapperElement().addEventListener('paste', function(clipboardEvent) {
        self.eventManager.emit('paste', {
            source: 'markdown',
            data: clipboardEvent
        });
    });

    this.cm.on('drop', function(cm, eventData) {
        eventData.preventDefault();

        self.eventManager.emit('drop', {
            source: 'markdown',
            data: eventData
        });
    });

    this.cm.on('cursorActivity', function() {
        var token, state;

        token = self.cm.getTokenAt(self.cm.getCursor());

        state =  {
            bold: !!token.state.base.strong,
            italic: !!token.state.base.em
        };

        if (self._latestState.bold !== state.bold || self._latestState.italic !== state.italic) {
            self.eventManager.emit('stateChange', state);
            self._latestState = state;
        }
    });
};

/**
 * getCurrentRange
 * returns current selection's range
 * @param {CodeMirror} cm codemirror instance
 * @return {object} selection range
 */
MarkdownEditor.prototype.getCurrentRange = function() {
    var from = this.cm.getCursor('from'),
        to = this.cm.getCursor('to');

    return {
        from: from,
        to: to,
        collapsed: from === to
    };
};

MarkdownEditor.prototype.focus = function() {
    this.cm.focus();
};

MarkdownEditor.prototype.remove = function() {
    this.cm.toTextArea();
};

MarkdownEditor.prototype.setValue = function(markdown) {
    this.getEditor().setValue(markdown);
    this._emitMarkdownEditorContentChangedEvent();
    this.getEditor().refresh();
};

MarkdownEditor.prototype.getValue = function() {
    return this.cm.getValue('\n');
};

MarkdownEditor.prototype.getEditor = function() {
    return this.cm;
};

MarkdownEditor.prototype.reset = function() {
    this.setValue('');
};

MarkdownEditor.prototype._emitMarkdownEditorContentChangedEvent = function() {
    this.eventManager.emit('contentChangedFromMarkdown', this);
};

MarkdownEditor.prototype._cloneCMEventObject = function(e) {
    return {
        from: {
            line: e.from.line,
            ch: e.from.ch
        },
        to: {
            line: e.to.line,
            ch: e.to.ch
        }
    };
};

MarkdownEditor.prototype._emitMarkdownEditorChangeEvent = function(e) {
    var eventObj, cursor;

    if (e.origin !== 'setValue') {
        cursor = this.getEditor().getCursor();

        eventObj = {
            source: 'markdown',
            selection: cursor,
            textContent: this.cm.getDoc().getLine(cursor.line) || '',
            caretOffset: cursor.ch
        };

        this.eventManager.emit('changeFromMarkdown', eventObj);
        this.eventManager.emit('change', eventObj);
    }
};

MarkdownEditor.prototype.getCaretPosition = function() {
    return this.cm.cursorCoords();
};

MarkdownEditor.prototype.addWidget = function(selection, node, style, offset) {
    if (offset) {
        selection.ch += offset;
    }

    this.cm.addWidget(selection, node, true, style);
};

MarkdownEditor.prototype.replaceSelection = function(content, selection) {
    if (selection) {
        this.cm.setSelection(selection.from, selection.to);
    }

    this.cm.replaceSelection(content);
    this.focus();
};

MarkdownEditor.prototype.replaceRelativeOffset = function(content, offset, overwriteLength) {
    var cursor = this.cm.getCursor(),
        selection = {
            from: {
                line: cursor.line,
                ch: cursor.ch + offset
            },
            to: {
                line: cursor.line,
                ch: (cursor.ch + offset) + overwriteLength
            }
        };

    this.replaceSelection(content, selection);
};

MarkdownEditor.prototype.setHeight = function(height) {
    this.$editorContainerEl.height(height);

    if (height === 'auto') {
        this.$editorContainerEl.find('.CodeMirror').height('auto');
    }
};

module.exports = MarkdownEditor;

},{}],34:[function(require,module,exports){
/**
 * @fileoverview Implements markedCustomRenderer
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent
 */

'use strict';

/**
 * markedCustomRenderer
 * @exports markedCustomRenderer
 * @augments marked.Renderer
 */
var markedCustomRenderer = new window.marked.Renderer();

var regexTaskList = /^((?:<p>|))\[(?:x| )\] /;

markedCustomRenderer.listitem = function(text) {
    var cap,
    checked,
    className = '',
        output = '';

    cap = regexTaskList.exec(text);

    if (cap) {
        text = text.substring(cap[0].length);
        className = ' class="task-list-item"';
        checked = cap[0] === '[x] ' ? ' checked' : '';
        output += cap[1] + '<input type="checkbox" class="task-list-item-checkbox"' + checked + '> ';
    }

    return '<li' + className + '>' + output + text + '</li>\n';
};

markedCustomRenderer.code = function(code, lang, escaped) {
    var out;
    if (this.options.highlight) {
        out = this.options.highlight(code, lang);
        if (out !== null && out !== code) {
            escaped = true;
            code = out;
        }
    }

    if (!lang) {
        return '<pre><code>'
        + (escaped ? code : escape(code, true))
        + '\n</code></pre>';
    }

    return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '" data-language="' + escape(lang, true) + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};


//escape code from marekd
function escape(html, encode) {
    return html
        .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

module.exports = markedCustomRenderer;

},{}],35:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var LazyRunner = require('./lazyRunner');

/**
 * Preview
 * @exports Preview
 * @extends {}
 * @constructor
 * @class
 * @param {jQuery} $el 프리뷰가 들어갈 엘리먼트
 * @param {EventManager} eventManager 이벤트 매니저
 * @param {Converter} converter 컨버터
 **/
function Preview($el, eventManager, converter) {
    this.eventManager = eventManager;
    this.converter = converter;
    this.$el = $el;

    this._initContentSection();

    this.lazyRunner = new LazyRunner();

    this.lazyRunner.registerLazyRunFunction(
        'refresh',
        this.refresh,
        800,
        this
    );

    this._initEvent();
}

Preview.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('contentChangedFromMarkdown', function(markdownEditor) {
        self.lazyRunner.run('refresh', markdownEditor.getValue());
    });
};

Preview.prototype._initContentSection = function() {
    this.$previewContent = $('<div class="tui-editor-contents" />');
    this.$el.append(this.$previewContent);
};

Preview.prototype.refresh = function(markdown) {
    this.render(this.converter.toHTMLWithCodeHightlight(markdown));
};

Preview.prototype.render = function(html) {
    var processedDataByHook,
        finalHtml = html;

    processedDataByHook = this.eventManager.emit('previewBeforeHook', html);

    if (processedDataByHook) {
        finalHtml = processedDataByHook[0];
    }

    this.$previewContent.empty();
    this.$previewContent.html(finalHtml);

    this.eventManager.emit('previewRenderAfter', this);
};

Preview.prototype.setHeight = function(height) {
    this.$el.height(height);
};

module.exports = Preview;

},{"./lazyRunner":21}],36:[function(require,module,exports){
/**
 * @fileoverview Implements %filltext:name=Name%
 * @author
 */

'use strict';

var domUtils = require('./domUtils');

var Squire = window.Squire,
    util = tui.util;

var FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD)\b/;
/**
 * SquireExt
 * @exports SquireExt
 * @augments Squire
 * @constructor
 * @class
 */
function SquireExt() {
    Squire.apply(this, arguments);
}

SquireExt.prototype = util.extend(
    {},
    Squire.prototype
);

SquireExt.prototype.get$Body = function() {
    this.$body = this.$body || $(this.getDocument().body);
    return this.$body;
};

SquireExt.prototype.changeBlockFormat = function(srcCondition, targetTagName) {
    var self = this;

    this.modifyBlocks(function(frag) {
        var current, newFrag, newBlock, nextBlock, tagName, lastNodeOfNextBlock;

        //HR은 Block으로 치지 않아서 frag에나타나지 않는다
        //디폴트 블럭을 만들어준다.
        if (frag.childNodes.length) {
            current = frag.childNodes[0];
        } else {
            current = self.createDefaultBlock();
            frag.appendChild(current);
        }

        if (srcCondition) {
            //find last depth
            while (current.firstChild) {
                current = current.firstChild;
            }

            //find tag
            while (current !== frag) {
                tagName = current.tagName;

                if (util.isFunction(srcCondition) ? srcCondition(tagName) : (tagName === srcCondition)) {
                    nextBlock = current.childNodes[0];

                    //there is no next blocktag
                    if (!domUtils.isElemNode(nextBlock) || current.childNodes.length > 1) {
                        nextBlock = self.createDefaultBlock();

                        util.forEachArray(util.toArray(current.childNodes), function(node) {
                            nextBlock.appendChild(node);
                        });

                        lastNodeOfNextBlock = nextBlock.lastChild;

                        //remove unneccesary br
                        if (lastNodeOfNextBlock && domUtils.getNodeName(lastNodeOfNextBlock) === 'BR') {
                            nextBlock.removeChild(lastNodeOfNextBlock);
                        }
                    }

                    if (targetTagName) {
                        newBlock = self.createElement(targetTagName, [nextBlock]);
                    } else {
                        newBlock = nextBlock;
                    }

                    newFrag = self.getDocument().createDocumentFragment();
                    newFrag.appendChild(newBlock);

                    frag = newFrag;

                    break;
                }

                current = current.parentNode;
            }
        }

        //if source condition node is not founded, we wrap current div node with node named targetTagName
        if (
            (!newFrag || !srcCondition)
            && targetTagName
            && domUtils.getNodeName(frag.childNodes[0]) === 'DIV'
        ) {
            frag = self.createElement(targetTagName, [frag.childNodes[0]]);
        }

        return frag;
    });
};

SquireExt.prototype.changeBlockFormatTo = function(targetTagName) {
    this.changeBlockFormat(function(tagName) {
        return FIND_BLOCK_TAGNAME_RX.test(tagName);
    }, targetTagName);
};

//from http://jsfiddle.net/9ThVr/24/
SquireExt.prototype.getCaretPosition = function() {
    var range, sel, rect, range2, rect2,
        offsetx = 0,
        offsety = 0;

    var $node = this.getDocument().body,
        nodeLeft = $node.offsetLeft,
        nodeTop = $node.offsetTop;

    var pos = {left: 0, top: 0};

    sel = this.getSelection();
    range = sel.cloneRange();

    range.setStart(range.startContainer, range.startOffset - 1);
    rect = range.getBoundingClientRect();

    if (range.endOffset === 0 || range.toString() === '') {
        // first char of line
        if (range.startContainer === $node) {
            // empty div
            if (range.endOffset === 0) {
                pos.top = '0';
                pos.left = '0';
            } else {
                // firefox need this
                range2 = range.cloneRange();
                range2.setStart(range2.startContainer, 0);
                rect2 = range2.getBoundingClientRect();
                pos.left = rect2.left + offsetx - nodeLeft;
                pos.top = rect2.top + rect2.height + offsety - nodeTop;
            }
        } else {
            pos.top = range.startContainer.offsetTop;
            pos.left = range.startContainer.offsetLeft;
        }
    } else {
        pos.left = rect.left + rect.width + offsetx - nodeLeft;
        pos.top = rect.top + offsety - nodeTop;
    }
    return pos;
};

SquireExt.prototype.replaceSelection = function(content, selection) {
    if (selection) {
        this.setSelection(selection);
    }

    this._ignoreChange = true;
    this.insertPlainText(content);
};

SquireExt.prototype.replaceRelativeOffset = function(content, offset, overwriteLength) {
    var selection;

    selection = this.getSelection().cloneRange();

    this._replaceRelativeOffsetOfSelection(content, offset, overwriteLength, selection);
};

SquireExt.prototype._replaceRelativeOffsetOfSelection = function(content, offset, overwriteLength, selection) {
    var endSelectionInfo;

    selection.setStart(selection.endContainer, selection.endOffset + offset);
    endSelectionInfo = this.getSelectionInfoByOffset(selection.endContainer, selection.endOffset + (offset + overwriteLength));
    selection.setEnd(endSelectionInfo.element, endSelectionInfo.offset);

    this.replaceSelection(content, selection);
};

SquireExt.prototype.getSelectionInfoByOffset = function(anchorElement, offset) {
    var traceElement, traceElementLength, traceOffset, stepLength, latestAvailableElement;

    traceElement = anchorElement;
    traceOffset = offset;
    stepLength = 0;

    while (traceElement) {
        traceElementLength = domUtils.getTextLength(traceElement);
        stepLength += traceElementLength;

        if (offset <= stepLength) {
            break;
        }

        traceOffset -= traceElementLength;

        if (domUtils.getTextLength(traceElement) > 0) {
            latestAvailableElement = traceElement;
        }

        traceElement = traceElement.nextSibling;
    }

    if (!traceElement) {
        traceElement = latestAvailableElement;
        traceOffset =  domUtils.getTextLength(traceElement);
    }

    return {
        element: traceElement,
        offset: traceOffset
    };
};

SquireExt.prototype.getSelectionPosition = function(selection, style, offset) {
    var pos, range, endSelectionInfo,
        marker = this.createElement('INPUT');

    range = selection.cloneRange();

    range.setStart(range.startContainer, range.startOffset);
    endSelectionInfo = this.getSelectionInfoByOffset(selection.endContainer, selection.endOffset + (offset || 0));
    range.setEnd(endSelectionInfo.element, endSelectionInfo.offset);

    //to prevent squire input event fire
    this._ignoreChange = true;
    this.insertElement(marker, range);
    pos = $(marker).offset();

    if (style !== 'over') {
        pos.top += $(marker).outerHeight();
    }

    marker.parentNode.removeChild(marker);

    this.setSelection(selection);

    pos.top -= this.get$Body().scrollTop();

    return pos;
};

module.exports = SquireExt;

},{"./domUtils":8}],37:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */
'use strict';

var UIController = require('./uicontroller');

var util = tui.util;

/**
 * Button
 * initialize button
 * @exports Button
 * @augments UIController
 * @constructor
 * @class
 * @param {object} options 옵션
 * @param {string} options.className 만들어진 RootElement에 추가할 클래스
 * @param {string} options.command 클릭되면 실행될 커맨드명
 * @param {string} options.text 버튼안에 들어갈 텍스트
 * @param {string} options.style 추가적으로 적용될 CSS스타일
 */
function Button(options) {
    UIController.call(this, {
        tagName: 'button',
        className: options.className
    });

    this._setOptions(options);

    this.render();

    this.attachEvents({
        'click': '_onClick'
    });
}

Button.prototype = util.extend(
    {},
    UIController.prototype
);

Button.prototype._setOptions = function(options) {
    this.command = options.command;
    this.event = options.event;
    this.text = options.text;
    this.style = options.style;
};

/**
 * Button의 모습을 그린다
 */
Button.prototype.render = function() {
    this.$el.text(this.text);
    this.$el.attr('type', 'button');

    if (this.style) {
        this.$el.attr('style', this.style);
    }
};

/**
 * _onClick
 * Click event handler
 */
Button.prototype._onClick = function() {
    if (this.command) {
        this.trigger('command', this.command);
    } else {
        this.trigger('event', this.event);
    }

    this.trigger('clicked');
};

module.exports = Button;

},{"./uicontroller":48}],38:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Toolbar = require('./toolbar'),
    Tab = require('./tab'),
    Layerpopup = require('./layerpopup'),
    ModeSwitch = require('./modeSwitch'),
    PopupAddLink = require('./popupAddLink'),
    PopupAddImage = require('./popupAddImage'),
    PopupAddTable = require('./popupAddTable');

var containerTmpl = [
    '<div class="tui-editor-defaultUI">',
        '<div class="te-toolbar-section" />',
        '<div class="te-mode-switch-section" />',
        '<div class="te-markdown-tab-section" />',
        '<div class="te-editor-section"  />',
    '</div>'
].join('');

/**
 * DefaultUI
 * @exports DefaultUI
 * @extends {}
 * @constructor
 * @class
 * @param {ToastUIEditor} editor editor
 */
function DefaultUI(editor) {
    this.name = 'default';

    this.$el = $(editor.options.el);
    this.type = editor.options.initialEditType;
    this.editor = editor;

    this.init();
    this._initEvent();
}

DefaultUI.prototype.init = function() {
    this._renderLayout();

    this._initEditorSection();

    this._initToolbar();
    this._initModeSwitch();

    this._initPopupAddLink();
    this._initPopupAddImage();
    this._initPopupAddTable();

    this._initMarkdownTab();
};

DefaultUI.prototype._initEditorSection = function() {
    this.$el.find('.te-editor-section').append(this.editor.layout.getEditorEl());
};

DefaultUI.prototype._initEvent = function() {
    var self = this;

    this.editor.eventManager.listen('hide', this.hide.bind(this));
    this.editor.eventManager.listen('show', this.show.bind(this));
    this.editor.eventManager.listen('changeMode', function() {
        self.markdownTabControl();
    });

    this.editor.eventManager.listen('changePreviewStyle', function() {
        self.markdownTabControl();
    });
};

DefaultUI.prototype._renderLayout = function() {
    this.$containerEl = $(containerTmpl).appendTo(this.$el);
};

DefaultUI.prototype._initToolbar = function() {
    this.toolbar = new Toolbar(this.editor.eventManager);
    this.$containerEl.find('.te-toolbar-section').append(this.toolbar.$el);
};

DefaultUI.prototype._initModeSwitch = function() {
    var self = this;

    this.modeSwitch = new ModeSwitch(this.type === 'markdown' ? ModeSwitch.TYPE.MARKDOWN : ModeSwitch.TYPE.WYSIWYG);
    this.$containerEl.find('.te-mode-switch-section').append(this.modeSwitch.$el);

    this.modeSwitch.on('modeSwitched', function(ev, info) {
        self.editor.changeMode(info.text);
    });
};

DefaultUI.prototype.markdownTabControl = function() {
    if (this.editor.isMarkdownMode() && this.editor.getCurrentPreviewStyle() === 'tab') {
        this.$containerEl.find('.te-markdown-tab-section').show();
        this.markdownTab.activate('Editor');
    } else {
        this.$containerEl.find('.te-markdown-tab-section').hide();
    }
};

DefaultUI.prototype._initMarkdownTab = function() {
    this.markdownTab = new Tab({
        items: ['Editor', 'Preview'],
        sections: [this.editor.layout.getMdEditorContainerEl(), this.editor.layout.getPreviewEl()]
    });

    this.$containerEl.find('.te-markdown-tab-section').append(this.markdownTab.$el);
};

DefaultUI.prototype._initPopupAddLink = function() {
    this.popupAddLink = new PopupAddLink({
        $target: this.$el,
        eventManager: this.editor.eventManager
    });
};

DefaultUI.prototype._initPopupAddImage = function() {
    this.popupAddImage = new PopupAddImage({
        $target: this.$el,
        eventManager: this.editor.eventManager
    });
};

DefaultUI.prototype._initPopupAddTable = function() {
    this.popupAddTable = new PopupAddTable({
        $target: this.$el,
        eventManager: this.editor.eventManager,
        css: {
            'position': 'absolute',
            'top': $('button.te-table').offset().top + $('button.te-table').height() + 5,
            'left': $('button.te-table').offset().left
        }
    });
};

DefaultUI.prototype.hide = function() {
    this.$el.find('.tui-editor-defaultUI').addClass('hide');
};

DefaultUI.prototype.show = function() {
    this.$el.find('.tui-editor-defaultUI').removeClass('hide');
};

DefaultUI.prototype.remove = function() {
    this.$el.find('.tui-editor-defaultUI').remove();
};

DefaultUI.prototype.createPopup = function(options) {
    return Layerpopup.factory(options);
};

module.exports = DefaultUI;

},{"./layerpopup":39,"./modeSwitch":40,"./popupAddImage":41,"./popupAddLink":42,"./popupAddTable":43,"./tab":44,"./toolbar":47}],39:[function(require,module,exports){
/**
 * @fileoverview Implements LayerPopup
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var UIController = require('./uicontroller');

var util = tui.util,
    _id = 0,
    CLASS_PREFIX = 'tui-popup-',
    LAYOUT_TEMPLATE = [
        '<div class="' + CLASS_PREFIX + 'header">',
        '<span class="' + CLASS_PREFIX + 'title"></span>',
        '<button class="' + CLASS_PREFIX + 'close-button">x</button>',
        '</div>',
        '<div class="' + CLASS_PREFIX + 'body"></div>'
    ].join('');

/**
 * LayerPopup
 * @exports LayerPopup
 * @augments UIController
 * @constructor
 * @class
 * @param {object} options 옵션
 * @param {string[]} options.openerCssQuery Css Query list to bind clickevent that open popup
 * @param {string[]} options.closerCssQuery Css Query list to bind clickevent that close popup
 * @param {jQuery} options.$el popup root element
 * @param {jQuery|string} options.content popup content that html string or jQuery element
 * @param {string} options.textContent popup text content
 * @param {string} options.title popup title
 * @param {jQuery} options.$target element to append popup
 */
function LayerPopup(options) {
    options = util.extend({}, options);

    UIController.call(this, {
        tagName: 'div',
        className: CLASS_PREFIX + 'wrapper',
        rootElement: options.$el
    });

    options = util.extend({}, options);

    this._setId();
    this._initTarget(options);
    this._initExternalPopupHtmlIfNeed(options);
    this._initCloserOpener(options);
    this._initContent(options);
    this._initTitle(options);
    this._initClassName(options);
    this._initCssStyles(options);
}

LayerPopup.prototype = util.extend(
    {},
    UIController.prototype
);

LayerPopup.prototype._initTarget = function(options) {
    this.$target = options.$target || $('body');
};

LayerPopup.prototype._initExternalPopupHtmlIfNeed = function(options) {
    if (options.$el) {
        this.$el = options.$el;
        this._isExternalHtmlUse = true;
    }
};

LayerPopup.prototype._initCloserOpener = function(options) {
    this.openerCssQuery = options.openerCssQuery;
    this.closerCssQuery = options.closerCssQuery;
};

LayerPopup.prototype._initContent = function(options) {
    if (options.content) {
        this.$content = $(options.content);
    } else if (options.textContent) {
        this.$content = options.textContent;
    }
};

LayerPopup.prototype._initTitle = function(options) {
    this.title = options.title;
};

LayerPopup.prototype._initClassName = function(options) {
    if (options.className) {
        this.className = options.className;
    }
};

LayerPopup.prototype.render = function() {
    this._renderLayout();
    this._renderTitle();
    this._renderContent();

    this._attachPopupEvent();
};

LayerPopup.prototype._renderLayout = function() {
    if (!this._isExternalHtmlUse) {
        this.$el.html(LAYOUT_TEMPLATE);
        this.$el.addClass(this.className);
        this.hide();
        this.$target.append(this.$el);
        this.$body = this.$el.find(this._getFullClassName('body'));

        if (this.title === false) {
           this.$el.find(this._getFullClassName('header')).remove();
        }
    } else {
        this.hide();

        if (this.$target) {
            this.$target.append(this.$el);
        }
    }
};

LayerPopup.prototype._renderContent = function() {
    if (!this._isExternalHtmlUse) {
        this.setContent(this.$content);
    }
};

LayerPopup.prototype._renderTitle = function() {
    if (!this._isExternalHtmlUse && this.title !== false) {
        this.setTitle(this.title);
    }
};

LayerPopup.prototype._getFullClassName = function(lastName) {
    return '.' + CLASS_PREFIX + lastName;
};

LayerPopup.prototype._attachOpenerCloserEvent = function() {
    var self = this;

    if (this.openerCssQuery) {
        $(this.openerCssQuery).on('click.' + this._getId(), function() {
            self.show();
        });
    }

    if (this.closerCssQuery) {
        $(this.closerCssQuery).on('click.' + this._getId(), function() {
            self.hide();
        });
    }
};

LayerPopup.prototype._detachOpenerCloserEvent = function() {
    if (this.openerCssQuery) {
        $(this.openerCssQuery).off('.' + this._getId());
    }

    if (this.closerCssQuery) {
        $(this.closerCssQuery).off('.' + this._getId());
    }
};

LayerPopup.prototype._attachPopupControlEvent = function() {
    var self = this;

    this.on('click ' + this._getFullClassName('close-button'), function() {
        self.hide();
    });
};

LayerPopup.prototype._detachPopupEvent = function() {
    this.off();
    this._detachOpenerCloserEvent();
};

LayerPopup.prototype._attachPopupEvent = function() {
    this._attachPopupControlEvent();
    this._attachOpenerCloserEvent();
};

LayerPopup.prototype._setId = function() {
    this._id = _id;
    _id += 1;
};

LayerPopup.prototype._getId = function() {
    return this._id;
};

LayerPopup.prototype.setContent = function($content) {
    this.$body.empty();
    this.$body.append($content);
};

LayerPopup.prototype.setTitle = function(title) {
    var $title = this.$el.find(this._getFullClassName('title'));

    $title.empty();
    $title.append(title);
};

LayerPopup.prototype.hide = function() {
    this.$el.css('display', 'none');
    this._isShow = false;
    this.trigger('hidden', this);
};

LayerPopup.prototype.show = function() {
    this.$el.css('display', 'block');
    this._isShow = true;
    this.trigger('shown', this);
};

LayerPopup.prototype.isShow = function() {
    return this._isShow;
};

LayerPopup.prototype.remove = function() {
    this.trigger('remove', this);
    this._detachPopupEvent();

    this.$el.empty();
    this.$el.remove();
};

LayerPopup.prototype.css = function() {
    this.$el.css.apply(this.$el, arguments);
};

LayerPopup.prototype._initCssStyles = function(options) {
    if (options.css) {
        this.css(options.css);
    }
};

LayerPopup.factory = function(options) {
    var popup = new LayerPopup(options);
    popup.render();
    return popup;
};

LayerPopup.CLASS_PREFIX = CLASS_PREFIX;

module.exports = LayerPopup;

},{"./uicontroller":48}],40:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var UIController = require('./uicontroller');

var util = tui.util;

var nextTypeString = ['WYSIWYG', 'Markdown'],
    TYPE = {
        'MARKDOWN': 0,
        'WYSIWYG': 1
    };

/**
 * ModeSwitch
 * UI Control for switch between Markdown and WYSIWYG
 * @exports ModeSwitch
 * @augments UIController
 * @constructor
 * @class
 * @param {number} initialType initial type of editor
 */
function ModeSwitch(initialType) {
    UIController.call(this, {
        tagName: 'div',
        className: 'te-mode-switch'
    });

    this.type = util.isExisty(initialType) ? initialType : TYPE.MARKDOWN;
    this._render();
}

ModeSwitch.prototype = util.extend(
    {},
    UIController.prototype
);

ModeSwitch.prototype._render = function() {
    this.$button = $('<button class="te-switch-button" type="button" />');
    this._setButtonTitle();
    this.$el.append(this.$button);

    this.attachEvents({
        'click button': '_buttonClicked'
    });
};

ModeSwitch.prototype._setButtonTitle = function() {
    this.$button.text('to' + this._getNextTypeString());
};

ModeSwitch.prototype._buttonClicked = function() {
    this._switchType();
};

ModeSwitch.prototype._switchType = function() {
    var typeToSwitch = this._getNextTypeString();

    this._toggleType();
    this._setButtonTitle();

    this.trigger('modeSwitched', {
        type: this.type,
        text: typeToSwitch.toLowerCase()
    });
};

ModeSwitch.prototype._getNextTypeString = function() {
    return nextTypeString[this.type];
};

ModeSwitch.prototype._toggleType = function() {
    this.type = this.type === TYPE.MARKDOWN ? TYPE.WYSIWYG : TYPE.MARKDOWN;
};

ModeSwitch.TYPE = TYPE;

module.exports = ModeSwitch;

},{"./uicontroller":48}],41:[function(require,module,exports){
/**
 * @fileoverview Implements PopupAddImage
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var LayerPopup = require('./layerpopup'),
    Tab = require('./tab');

var util = tui.util;

var POPUP_CONTENT = [
    '<div class="te-tab-section"></div>',
    '<div class="te-url-type">',
        '<label for="">Image URL</label>',
        '<input type="text" class="te-image-url-input" />',
    '</div>',
    '<form enctype="multipart/form-data" class="te-file-type">',
        '<label for="">Image File</label>',
        '<input type="file" class="te-image-file-input" accept="image/*" />',
    '</form>',
    '<label for="url">Alt Text</label>',
    '<input type="text" class="te-alt-text-input" />',
    '<div class="te-button-section">',
        '<button type="button" class="te-ok-button">OK</button>',
        '<button type="button" class="te-close-button">Cancel</button>',
    '</div>'
].join('');

/**
 * PopupAddImage
 * It implements a Image Add Popup
 * @exports PopupAddImage
 * @augments LayerPopup
 * @constructor
 * @class
 * @param {object} options options
 */
function PopupAddImage(options) {
    options = util.extend({
        title: 'Add Image',
        className: 'te-popup-add-image tui-editor-popup',
        content: POPUP_CONTENT
    }, options);

    LayerPopup.call(this, options);

    this.eventManager = options.eventManager;

    this.render();

    this._bindContentEvent();
    this._linkWithEventManager();
    this._initApplyImageBindContext();
}

PopupAddImage.prototype = util.extend(
    {},
    LayerPopup.prototype
);

PopupAddImage.prototype._bindContentEvent = function() {
    var self = this;

    this.on('click .te-ok-button', function() {
        self.trigger('okButtonClicked', this);
        self.hide();
    });

    this.on('click .te-close-button', function() {
        self.trigger('closeButtonClicked', this);
        self.hide();
    });

    this.on('shown', function() {
        self.$el.find('.te-image-url-input').focus();
    });

    this.on('hidden', function() {
        self.resetInputs();
    });

    this.tab.on('itemClick', function() {
        self.resetInputs();
    });

    this.on('change .te-image-file-input', function() {
        var filename = self.$el.find('.te-image-file-input').val().split('\\').pop();
        self.$el.find('.te-alt-text-input').val(filename);
    });
};

PopupAddImage.prototype._linkWithEventManager = function() {
    var self = this;

    this.eventManager.listen('focus', function() {
        self.hide();
    });

    this.eventManager.listen('openPopupAddImage', function() {
        self.eventManager.emit('closeAllPopup');
        self.show();
    });

    this.eventManager.listen('closeAllPopup', function() {
        self.hide();
    });

    this.on('okButtonClicked', function() {
        if (self._isUrlType()) {
            self.applyImage();
        } else {
            self._preAltValue = self.$el.find('.te-alt-text-input').val();
            self.eventManager.emit('addImageBlobHook', self.$el.find('.te-image-file-input')[0].files[0], self.applyImage);
        }
    });
};

PopupAddImage.prototype._initApplyImageBindContext = function() {
    var self = this;

    this.applyImage = function(url) {
        var info;

        if (url) {
            info = self._getImageInfoWithGivenUrl(url);
        } else {
            info = self._getImageInfo();
        }

        self.eventManager.emit('command', 'AddImage', info);
        self.hide();
    };
};

PopupAddImage.prototype._isUrlType = function() {
    return !!this.$el.find('.te-image-url-input').val();
};

/**
 * _renderContent
 * @override
 */
PopupAddImage.prototype._renderContent = function() {
    var $popup = this.$el;

    LayerPopup.prototype._renderContent.call(this);

    this.tab = new Tab({
        initName: 'File',
        items: ['File', 'URL'],
        sections: [$popup.find('.te-file-type'), $popup.find('.te-url-type')]
    });

    this.$body.find('.te-tab-section').append(this.tab.$el);
};

PopupAddImage.prototype._getImageInfoWithGivenUrl = function(imageUrl) {
    var altText = this._preAltValue;
    this._preAltValue = '';
    return this._makeImageInfo(imageUrl, altText);
};

PopupAddImage.prototype._getImageInfo = function() {
    var imageUrl = this.$el.find('.te-image-url-input').val(),
    altText = this.$el.find('.te-alt-text-input').val();

    return this._makeImageInfo(imageUrl, altText);
};

PopupAddImage.prototype._makeImageInfo = function(url, alt) {
    return {
        imageUrl: url,
        altText: alt
    };
};

PopupAddImage.prototype._getImageFileForm = function() {
    return this.$el.find('form');
};

PopupAddImage.prototype.resetInputs = function() {
    this.$el.find('input').val('');
};

module.exports = PopupAddImage;

},{"./layerpopup":39,"./tab":44}],42:[function(require,module,exports){
/**
 * @fileoverview Implements PopupAddLink
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var LayerPopup = require('./layerpopup');

var util = tui.util;

var POPUP_CONTENT = [
    '<label for="linkText">Link Text</label>',
    '<input type="text" class="te-link-text-input" />',
    '<label for="url">URL</label>',
    '<input type="text" class="te-url-input" />',
    '<div class="te-button-section">',
        '<button type="button" class="te-ok-button">OK</button>',
        '<button type="button" class="te-close-button">Cancel</button>',
    '</div>'
].join('');

/**
 * PopupAddLink
 * It implements a link Add Popup
 * @exports PopupAddLink
 * @augments LayerPopup
 * @constructor
 * @class
 * @param {object} options options
 */
function PopupAddLink(options) {
    options = util.extend({
        title: 'Add Link',
        className: 'te-popup-add-link tui-editor-popup',
        content: POPUP_CONTENT
    }, options);

    LayerPopup.call(this, options);

    this.render();
    this._bindContentEvent();
    this._linkWithEventManager(options.eventManager);
}

PopupAddLink.prototype = util.extend(
    {},
    LayerPopup.prototype
);

PopupAddLink.prototype._bindContentEvent = function() {
    var self = this;

    this.on('click .te-ok-button', function() {
        self.trigger('okButtonClicked', this);
        self.hide();
    });

    this.on('click .te-close-button', function() {
        self.trigger('closeButtonClicked', this);
        self.hide();
    });

    this.on('shown', function() {
        self.$el.find('.te-link-text-input').focus();
    });

    this.on('hidden', function() {
        self.resetInputs();
    });
};

PopupAddLink.prototype._linkWithEventManager = function(eventManager) {
    var self = this;

    eventManager.listen('focus', function() {
        self.hide();
    });

    eventManager.listen('openPopupAddLink', function() {
        eventManager.emit('closeAllPopup');
        self.show();
    });

    eventManager.listen('closeAllPopup', function() {
        self.hide();
    });

    this.on('okButtonClicked', function() {
        eventManager.emit('command', 'AddLink', self.getValue());
    });
};

PopupAddLink.prototype.getValue = function() {
    return {
        linkText: this.$el.find('.te-link-text-input').val(),
        url: this.$el.find('.te-url-input').val()
    };
};

PopupAddLink.prototype.resetInputs = function() {
    this.$el.find('input').val('');
};

module.exports = PopupAddLink;

},{"./layerpopup":39}],43:[function(require,module,exports){
/**
 * @fileoverview Implements PopupAddTable
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var LayerPopup = require('./layerpopup');

var util = tui.util;

var POPUP_CONTENT = [
    '<div class="te-table-selection">',
        '<div class="te-table-header"></div>',
        '<div class="te-table-body"></div>',
        '<div class="te-selection-area"></div>',
    '</div>',
    '<p class="te-description"></p>'
].join('');

var CELL_WIDTH = 25,
    CELL_HEIGHT = 17,
    MIN_ROW_INDEX = 7,
    MAX_ROW_INDEX = 14,
    MIN_COL_INDEX = 5,
    MAX_COL_INDEX = 9,
    MIN_ROW_SELECTION_INDEX = 1,
    MIN_COL_SELECTION_INDEX = 1,
    HEADER_ROW_COUNT = 1,
    LAST_BORDER = 1;

/**
 * PopupAddTable
 * It implements Popup to add a table
 * @exports PopupAddTable
 * @augments LayerPopup
 * @constructor
 * @class
 * @param {object} options options
 */
function PopupAddTable(options) {
    options = util.extend({
        title: false,
        className: 'te-popup-add-table',
        content: POPUP_CONTENT
    }, options);

    LayerPopup.call(this, options);

    this._selectedBound = {};
    this._tableBound = {};
    this.eventManager = options.eventManager;

    this.render();
    this._cacheElements();
    this._bindContentEvent();
    this._linkWithEventManager();

    this._setTableSizeByBound(MIN_COL_INDEX, MIN_ROW_INDEX);
}

PopupAddTable.prototype = util.extend(
    {},
    LayerPopup.prototype
);

/**
 * _cacheElements
 * Cache elements for use
 */
PopupAddTable.prototype._cacheElements = function() {
    this.$header = this.$el.find('.te-table-header');
    this.$body = this.$el.find('.te-table-body');
    this.$selection = this.$el.find('.te-selection-area');
    this.$desc = this.$el.find('.te-description');
};

/**
 * _bindContentEvent
 * Bind element events
 */
PopupAddTable.prototype._bindContentEvent = function() {
    var self = this;

    this.on('mousemove .te-table-selection', function(ev) {
        var x = ev.pageX - self._selectionOffset.left,
            y = ev.pageY - self._selectionOffset.top,
            bound;

        bound = self._getSelectionBoundByOffset(x, y);

        self._resizeTableBySelectionIfNeed(bound.col, bound.row);

        self._setSelectionAreaByBound(bound.col, bound.row);
        self._setDisplayText(bound.col, bound.row);
        self._setSelectedBound(bound.col, bound.row);
    });

    this.on('click .te-table-selection', function() {
        var tableSize = self._getSelectedTableSize();
        self.eventManager.emit('command', 'Table', tableSize.col, tableSize.row);
    });
};

/**
 * _linkWithEventManager
 * Bind event manager event
 */
PopupAddTable.prototype._linkWithEventManager = function() {
    var self = this;

    this.eventManager.listen('focus', function() {
        self.hide();
    });

    this.eventManager.listen('openPopupAddTable', function() {
        self.eventManager.emit('closeAllPopup');
        self.show();
        self._selectionOffset = self.$el.find('.te-table-selection').offset();
    });

    this.eventManager.listen('closeAllPopup', function() {
        self.hide();
    });
};

/**
 * _resizeTableBySelectionIfNeed
 * Resize table if need
 * @param {number} col column index
 * @param {number} row row index
 */
PopupAddTable.prototype._resizeTableBySelectionIfNeed = function(col, row)  {
    var resizedBound = this._getResizedTableBound(col, row);

    if (resizedBound) {
        this._setTableSizeByBound(resizedBound.col, resizedBound.row);
    }
};

/**
 * _getResizedTableBound
 * Get resized table bound if Need
 * @param {number} col column index
 * @param {number} row row index
 * @return {object} bound
 */
PopupAddTable.prototype._getResizedTableBound  = function(col, row)  {
    var resizedCol, resizedRow, resizedBound;

    if (col >= MIN_COL_INDEX && col < MAX_COL_INDEX) {
        resizedCol = col + 1;
    } else if (col < MIN_COL_INDEX) {
        resizedCol = MIN_COL_INDEX;
    }

    if (row >= MIN_ROW_INDEX && row < MAX_ROW_INDEX) {
        resizedRow = row + 1;
    } else if (row < MIN_ROW_INDEX) {
        resizedRow = MIN_ROW_INDEX;
    }

    if (this._isNeedResizeTable(resizedCol, resizedRow)) {
        resizedBound = {
            row: resizedRow || this._tableBound.row,
            col: resizedCol || this._tableBound.col
        };
    }

    return resizedBound;
};

/**
 * _isNeedResizeTable
 * check if need resize table
 * @param {number} col column index
 * @param {number} row row index
 * @return {boolean} result
 */
PopupAddTable.prototype._isNeedResizeTable = function(col, row) {
    return (col && col !== this._tableBound.col)
        || (row && row !== this._tableBound.row);
};

/**
 * _getBoundByOffset
 * Get bound by offset
 * @param {number} x offset
 * @param {number} y offset
 * @return {object} bound
 */
PopupAddTable.prototype._getBoundByOffset = function(x, y) {
    var rowBound = parseInt(y / CELL_HEIGHT, 10),
        colBound = parseInt(x / CELL_WIDTH, 10);

    return {
        row: rowBound,
        col: colBound
    };
};

/**
 * _getOffsetByBound
 * Get offset by bound
 * @param {number} col column index
 * @param {number} row row index
 * @return {object} offset
 */
PopupAddTable.prototype._getOffsetByBound = function(col, row) {
    var x = (col * CELL_WIDTH) + CELL_WIDTH,
        y = (row * CELL_HEIGHT) + CELL_HEIGHT;

    return {
        x: x,
        y: y
    };
};

/**
 * _setTableSizeByBound
 * Set table size with bound
 * @param {number} col column index
 * @param {number} row row index
 */
PopupAddTable.prototype._setTableSizeByBound = function(col, row) {
    var boundOffset = this._getOffsetByBound(col, row - HEADER_ROW_COUNT);
    this._setTableSize(boundOffset.x, boundOffset.y);
    this._tableBound.row = row;
    this._tableBound.col = col;
};

/**
 * _getSelectionBoundByOffset
 * Get selection bound that process with range by offset
 * @param {number} x offset
 * @param {number} y offset
 * @return {object} bound
 */
PopupAddTable.prototype._getSelectionBoundByOffset = function(x, y) {
    var bound = this._getBoundByOffset(x, y);

    if (bound.row < MIN_ROW_SELECTION_INDEX) {
        bound.row = MIN_ROW_SELECTION_INDEX;
    } else if (bound.row > this._tableBound.row) {
        bound.row = this._tableBound.row;
    }

    if (bound.col < MIN_COL_SELECTION_INDEX) {
        bound.col = MIN_COL_SELECTION_INDEX;
    } else if (bound.col > this._tableBound.col) {
        bound.col = this._tableBound.col;
    }

    return bound;
};

/**
 * _setSelectionAreaByBound
 * Set selection area with bound
 * @param {number} col column index
 * @param {number} row row index
 */
PopupAddTable.prototype._setSelectionAreaByBound = function(col, row) {
    var boundOffset,

    boundOffset = this._getOffsetByBound(col, row);
    this._setSelectionArea(boundOffset.x, boundOffset.y);
};


/**
 * _setSelectedBound
 * Set selected bound
 * @param {number} col column index
 * @param {number} row row index
 */
PopupAddTable.prototype._setSelectedBound = function(col, row) {
   this._selectedBound.col = col;
   this._selectedBound.row = row;
};

/**
 * _getSelectedTableSize
 * Get selected table size
 * @return {object} bound
 */
PopupAddTable.prototype._getSelectedTableSize = function() {
    return {
        row: this._selectedBound.row + 1,
        col: this._selectedBound.col + 1
    };
};

/**
 * _setDisplayText
 * Set selected table size text for display
 * @param {number} col column index
 * @param {number} row row index
 */
PopupAddTable.prototype._setDisplayText = function(col, row) {
    this.$desc.html((col + 1) + ' x ' + (row + 1));
};

/**
 * _setTableSize
 * Set table element size
 * @param {number} x offset
 * @param {number} y offset
 */
PopupAddTable.prototype._setTableSize = function(x, y) {
    x += LAST_BORDER;
    y += LAST_BORDER;

    this.$header.css({
        height: CELL_HEIGHT,
        width: x
    });

    this.$body.css({
        height: y,
        width: x
    });

    this.$el.css({
        width: x + 30
    });
};

/**
 * _setSelectionArea
 * Set selection element size
 * @param {number} x offset
 * @param {number} y offset
 */
PopupAddTable.prototype._setSelectionArea = function(x, y) {
    x += LAST_BORDER;
    y += LAST_BORDER;

    this.$selection.css({
        height: y,
        width: x
    });
};

PopupAddTable.CELL_WIDTH = CELL_WIDTH;
PopupAddTable.CELL_HEIGHT = CELL_HEIGHT;
PopupAddTable.MIN_ROW_SELECTION_INDEX = MIN_ROW_SELECTION_INDEX;
PopupAddTable.MIN_COL_SELECTION_INDEX = MIN_COL_SELECTION_INDEX;

module.exports = PopupAddTable;

},{"./layerpopup":39}],44:[function(require,module,exports){
/**
 * @fileoverview tab버튼 UI를 그리는 객체가 정의되어 있다
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var UIController = require('./uicontroller'),
    templater = require('./templater');

var util = tui.util;

var buttonTmpl = '<button type="button" data-index="${index}">${name}</button>';

/**
 * Tab
 * @exports Tab
 * @augments UIController
 * @constructor
 * @class
 * @param {object} options options
 * @param {string[]} options.items Button names to be created
 * @param {DOMElement[]} options.sections Dom elements for tab
 * @param {function} options.onItemClick when button is clicked pass button name to function
 * @example
 * var tab = new Tab({
 *     items: ['Editor', 'Preview'],
 *     sections: [this.$mdEditorContainerEl, this.$previewEl]
 * });
 */
function Tab(options) {
    UIController.call(this, {
        tagName: 'div',
        className: 'te-tab'
    });

    options = util.extend({}, options);

    this.items = options.items;
    this.sections = options.sections;

    this._$activeButton = null;

    this.render();
    this._initItemClickEvent(options.onItemClick);

    this._applyInitName(options.initName);
}

Tab.prototype = util.extend(
    {},
    UIController.prototype
);

/**
 * render
 * render UI
 */
Tab.prototype.render = function() {
    var buttonHtml;

    buttonHtml = templater(buttonTmpl, this._getButtonData());

    this.$el.html(buttonHtml);

    this.attachEvents({
        'click button': '_onButtonClick'
    });
};

/**
 * _applyInitName
 * Apply initial section by button item name
 * @param {string} initName Button name to activate
 */
Tab.prototype._applyInitName = function(initName) {
    if (initName) {
        this.activate(initName);
    }
};

/**
 * _getButtonData
 * Make button data by this.items
 * @return {object[]} Button data
 */
Tab.prototype._getButtonData = function() {
    var buttonData = [],
    i,
    len;

    for (i = 0, len = this.items.length; i < len; i += 1) {
        buttonData.push({
            name: this.items[i],
            index: i
        });
    }

    return buttonData;
};

/**
 * _onButtonClick
 * Button click handler
 * @param {event} ev Event object
 */
Tab.prototype._onButtonClick = function(ev) {
    var $button = $(ev.target);
    this._activateTabByButton($button);
};

/**
 * _deactivate
 * Deactive active section and button
 */
Tab.prototype._deactivate = function() {
    if (this._$activeButton) {
        this._$activeButton.removeClass('te-tab-active');

        if (this.sections) {
            this.sections[this._$activeButton.attr('data-index')].removeClass('te-tab-active');
        }
    }
};

/**
 * _activateButton
 * Activate button
 * @param {jQuery} $button button to activate
 */
Tab.prototype._activateButton = function($button) {
    this._$activeButton = $button;
    this._$activeButton.addClass('te-tab-active');
};

/**
 * _activateSection
 * Activate Section
 * @param {number} index Section index to activate
 */
Tab.prototype._activateSection = function(index) {
    if (this.sections) {
        this.sections[index].addClass('te-tab-active');
    }
};

/**
 * activate
 * Activate Section & Button
 * @param {string} name button name to activate
 */
Tab.prototype.activate = function(name) {
    var $button = this.$el.find('button:contains("' + name + '")');
    this._activateTabByButton($button);
};

/**
 * _activateTabByButton
 * Activate tab section by button
 * @param {jQuery} $button button to activate
 */
Tab.prototype._activateTabByButton = function($button) {
    if (this._isActivatedButton($button)) {
        return;
    }

    this._deactivate();

    this._activateButton($button);
    this._activateSection($button.attr('data-index'));

    this.trigger('itemClick', $button.text());
};

/**
 * _isActivatedButton
 * Check passed button is activated
 * @param {jQuery} $button Button to check
 * @return {boolean} result
 */
Tab.prototype._isActivatedButton = function($button) {
    return this._$activeButton && this._$activeButton.text() === $button.text();
};

/**
 * _initItemClickEvent
 * Initialize itemClick event handler
 * @param {function} handler Function to invoke when button is clicked
 */
Tab.prototype._initItemClickEvent = function(handler) {
    if (handler) {
        this.on('itemClick', handler);
    }
};

module.exports = Tab;

},{"./templater":45,"./uicontroller":48}],45:[function(require,module,exports){
/**
 * @fileoverview Implements templater function
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = tui.util;

/**
 * 템플릿데이터에 객체의 데이터를 삽입해 스트링을 리턴한다.
 * 매핑데이터를 배열로 전달하면 갯수만큼 템플릿을 반복생성한다.
 * @param {string} template 템플릿 텍스트
 * @param {object|object[]} mapper 템플릿과 합성될 데이터
 * @return {array} rendered text
 */
function templater(template, mapper) {
    var totalReplaced = [],
        replaced;

    if (!util.isArray(mapper)) {
        mapper = [mapper];
    }

    util.forEach(mapper, function(mapdata) {
        replaced = template.replace(/\${([\w]+)}/g, function(matchedString, name) {
            return util.isExisty(mapdata, name) ? mapdata[name].toString() : '';
        });

        totalReplaced.push(replaced);
    });

    return totalReplaced;
}

module.exports = templater;


},{}],46:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */
'use strict';

var Button = require('./button');

var util = tui.util;

/**
 * ToggleButton
 * initialize toggle button
 * @exports ToggleButton
 * @augments Button
 * @constructor
 * @class
 * @param {object[]} options 옵션
 * @param {string} options.className 만들어진 RootElement에 추가할 클래스
 * @param {string} options.command 클릭되면 실행될 커맨드명
 * @param {string} options.text 버튼안에 들어갈 텍스트
 * @param {string} options.style 추가적으로 적용될 CSS스타일
 */
function ToggleButton(options) {
    this.options = options;
    this.current = this.options[0];

    Button.call(this, this.current);

    this._initEvent();
}

ToggleButton.prototype = util.extend(
    {},
    Button.prototype
);

ToggleButton.prototype._initEvent = function() {
    var self = this;

    this.on('clicked', function() {
        self._toggle();
    });
};

ToggleButton.prototype._toggle = function() {
    if (this.current === this.options[0]) {
        this.current = this.options[1];
    } else {
        this.current = this.options[0];
    }

    this._setOptions(this.current);
    this.render();
};

module.exports = ToggleButton;

},{"./button":37}],47:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var UIController = require('./uicontroller'),
    Button = require('./button'),
    ToggleButton = require('./toggleButton');

var util = tui.util;

/**
 * Toolbar
 * @exports Toolbar
 * @augments UIController
 * @constructor
 * @class
 * @param {EventManager} eventManager 이벤트 매니저
 */
function Toolbar(eventManager) {
    UIController.call(this, {
        tagName: 'div',
        className: 'tui-editor-defaultUI-toolbar'
    });

    this.buttons = [];

    this.eventManager = eventManager;

    this.render();
    this._initButton();
}

Toolbar.prototype = util.extend(
    {},
    UIController.prototype
);

/**
 * render
 * Render toolbar
 */
Toolbar.prototype.render = function() {
    this.$buttonContainer = this.$el;
};

/**
 * 버튼을 추가한다
 * @param {Button} button 버튼
 */
Toolbar.prototype.addButton = function(button) {
    var ev = this.eventManager;

    if (!button.render) {
        if (!util.isArray(button)) {
            button = new Button(button);
        } else {
            button = new ToggleButton(button);
        }
    }

    button.on('command', function emitCommandEvent($, commandName) {
        ev.emit('command', commandName);
    });

    button.on('event', function emitEventByCommand($, eventName) {
        ev.emit(eventName);
    });

    this.buttons.push(button);
    this.$buttonContainer.append(button.$el);
};

/**
 * 필요한 버튼들을 추가한다.
 */
Toolbar.prototype._initButton = function() {
    this.addButton(new Button({
        className: 'te-bold',
        command: 'Bold',
        text: 'B'
    }));

    this.addButton(new Button({
        className: 'te-italic',
        command: 'Italic',
        text: 'I'
    }));

    this.addButton(new Button({
        className: 'te-quote',
        command: 'Blockquote',
        text: 'Q'
    }));

    this.addButton(new Button({
        className: 'te-heading',
        command: 'Heading',
        text: 'HH'
    }));

    this.addButton(new Button({
        className: 'te-hrline',
        command: 'HR',
        text: '\u035F'
    }));

    this.addButton(new Button({
        className: 'te-link',
        event: 'openPopupAddLink',
        text: 'A'
    }));

    this.addButton(new Button({
        className: 'te-image',
        event: 'openPopupAddImage',
        text: 'IMG'
    }));

    this.addButton(new Button({
        className: 'te-ul',
        command: 'UL',
        text: 'UL'
    }));

    this.addButton(new Button({
        className: 'te-ol',
        command: 'OL',
        text: 'OL'
    }));

    this.addButton(new Button({
        className: 'te-task',
        command: 'Task',
        text: '\u2611'
    }));

    this.addButton(new Button({
        className: 'te-table',
        event: 'openPopupAddTable',
        text: 'TABLE'
    }));
};

module.exports = Toolbar;

},{"./button":37,"./toggleButton":46,"./uicontroller":48}],48:[function(require,module,exports){
/**
 * @fileoverview HTML UI를 관리하는 컨트롤러
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = tui.util,
    _id = 0;
/**
 * UIController 클래스
 * @exports UIController
 * @constructor
 * @class
 * @param {Object} options 옵션
 * @param {jQuery} options.rootElement 이니셜라이즈할때 el에 들어갈 루트 엘리먼트를 셋팅할수있다.
 */
function UIController(options) {
    options = util.extend({
        tagName: 'div'
    }, options || {});

    this.tagName = options.tagName;
    this.className = options.className;

    /**
     * rootElement
     * @type {jQuery}
     */
    this.$el = null;

    this._initID();

    this.setRootElement(options.rootElement);
}


/**********
 * method
 **********/

/**
 * UIC에 custom event을 걸거나 jQuery를 이용해 dom에 이벤트를 건다.
 * @param {string} aType 이벤트명과 셀렉터 스트링
 * @param {function} aFn 이벤트 핸들러
 */
UIController.prototype.on = function(aType, aFn) {
    var self = this;

    if (util.isObject(aType)) {
        util.forEach(aType, function(fn, type) {
            self._addEvent(type, fn);
        });
    } else {
        this._addEvent(aType, aFn);
    }
};

/**
 * 이벤트를 바인드한다.
 * DOM이벤트가 전달되면 jQuery이벤트 처리기를 이용하고
 * DOM이벤트가 아니면 CustomEvent를 이용한다.
 * @param {string} type 이벤트명과 셀렉터 스트링
 * @param {function} fn 이벤트 핸들러
 * @private
 */
UIController.prototype._addEvent = function(type, fn) {
    var parsedType = this._parseEventType(type),
        event = parsedType[0],
        selector = parsedType[1];

    if (selector) {
        this.$el.on(event, selector, fn);
    } else {
        this.$el.on(event, fn);
    }
};

/**
 * 이벤트를 지운다.
 * DOM이벤트가 전달되면 jQuery이벤트 처리기를 이용하고
 * DOM이벤트가 아니면 CustomEvent를 이용한다.
 * @param {string} type 이벤트명과 셀렉터 스트링
 * @param {function} fn 이벤트 핸들러
 */
UIController.prototype.off = function(type, fn) {
    var parsedType,
        event,
        selector;

    if (type) {
        parsedType = this._parseEventType(type);
        event = parsedType[0];
        selector = parsedType[1];

        if (selector) {
            this.$el.off(event, selector, fn);
        } else {
            this.$el.off(event, fn);
        }
    } else {
        this.$el.off();
    }
};

/**
 * 이벤트 바안딩 텍스트를 전달받아 이벤트 명과 셀렉터로 분리해준다.
 * 'click td' => ['click', 'td]
 * @param {string} type 이벤트쿼리 스트링
 * @returns {array} Event, Selector
 */
UIController.prototype._parseEventType = function(type) {
    var splitType = type.split(' '),
        event = splitType.shift(),
        selector = splitType.join(' ');

    return [event, selector];
};

/**
 * 파라메터로 넘어오는 이벤트 리스트 혹은 this.events를 토대로 dom 이벤트를 한꺼번에 바인드한다.
 * @param {object} events 이벤트 목록
 */
UIController.prototype.attachEvents = function(events) {
    var self = this,
        handler,
        eventlist = events || this.events;

    if (eventlist) {
        util.forEach(eventlist, function(handlerName, type) {
            if (self[handlerName]) {
                type = self.getEventNameWithNamespace(type);
                handler = util.bind(self[handlerName], self);
                self.on(type, handler);
            } else {
                throw new Error('UIController#attachEvents: ' + handlerName + '란 메서드가 없습니다.');
            }
        });
    }
};

/**
 * attachEvents로 걸린 이벤트핸들러를 한꺼번에 해제한다.
 */
UIController.prototype.detachEvents = function() {
    this.$el.off('.uicEvent' + this.id);
};

/**
 * UIC의 rootElement인 this.$el을 설정한다 인자가 없으면 생성한다.
 * @param {jQuery} $el 설정할 엘리먼트
 */
UIController.prototype.setRootElement = function($el) {
    var className = this.className,
        tagName = this.tagName;

    if (!$el) {
        className = className || ('uic' + this.id);
        tagName = tagName;
        $el = $('<' + tagName + ' class="' + className + '"/>');
    }
    this.$el = $el;
};

/**
 * 커스텀 이벤트를 발생시킨다.
 */
UIController.prototype.trigger = function() {
    this.$el.trigger.apply(this.$el, arguments);
};

/**
 * id를 생성한다.
 * @private
 */
UIController.prototype._initID = function() {
    this.id = _id;
    _id += 1;
};

/**
 * 이벤트종류에 네임스페이스를 더한다.
 * "click" -> "click.uicEvent23"
 * @param {string} event 이벤트 핸들러, 셀릭터 스트링
 * @returns {string} 네임스페이스가 포함된 이벤트스트링
 */
UIController.prototype.getEventNameWithNamespace = function(event) {
    var eventSplited = event.split(' ');
    eventSplited[0] += ('.uicEvent' + this.id);
    return eventSplited.join(' ');
};

/**
 * uic안에 서브uic를 삽입한다.
 * 두번째 인자로 셀렉터를 넘기면 this.$el이 아닌 셀렉터에 해당하는 엘리먼트를 찾아서 그엘리먼트에 서브 UIC의 엘리먼트를 붙인다.
 * @param {UIController} uic UIController instance
 * @param {string} [targetSEL] 셀렉터
 */
UIController.prototype.addUIC = function(uic, targetSEL) {
    if (targetSEL) {
        this.$el.find(targetSEL).append(uic.$el);
    } else {
        this.$el.append(uic.$el);
    }
};

/**
 * 엘리먼트의 이벤트를 해제 후 제거한다.
 */
UIController.prototype.remove = function() {
    this.detachEvents();
    this.$el.remove();
};

/**
 * 소멸자
 */
UIController.prototype.destroy = function() {
    this.remove();
    this.detachEvents();

    util.forEachOwnProperties(this, function(value, key) {
        this[key] = null;
    }, this);
};

/**
 * UIController를 확장해 새 생성자를 만든다.
 * @param {Object} props properties to extend
 * @returns {UIController} 생성자
 */
UIController.extend = function(props) {
    var newUIC = util.defineClass(this, props);
    newUIC.extend = UIController.extend;
    return newUIC;
};

module.exports = UIController;

},{}],49:[function(require,module,exports){
/**
 * @fileoverview Implements wysiwyg editor clipboard manager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils');

var util = tui.util;

/**
 * WwClipboardManager
 * @exports WwClipboardManager
 * @constructor
 * @class
 * @param {WysiwygEditor} wwe WysiwygEditor instance
 */
function WwClipboardManager(wwe) {
    this.wwe = wwe;

    if (util.browser.msie) {
        this.$hiddenArea = $('<div style="position:absolute;top:0;left:-9999px;height:1px;width:1px;overflow:hidden;" />');
        this.wwe.$editorContainerEl.append(this.$hiddenArea);
    }
}

/**
 * init
 * initialize
 */
WwClipboardManager.prototype.init = function() {
    this._initSquireEvent();
};

/**
 * _initSquireEvent
 * initialize squire events
 */
WwClipboardManager.prototype._initSquireEvent = function() {
    var self = this;

    if (util.browser.msie) {
        this.wwe.getEditor().addEventListener('keydown', function(event) {
            var range;

            //Ctrl + C
            if (event.ctrlKey && event.keyCode === 67) {
                range = self.wwe.getEditor().getSelection().cloneRange();
                range = self._extendRange(range);

                self.copyWithTextarea(range);
            //Ctrl + X
            } else if (event.ctrlKey && event.keyCode === 88) {
                range = self.wwe.getEditor().getSelection().cloneRange();
                range = self._extendRange(range);

                self.copyWithTextarea(range);

                range = self.wwe.insertSelectionMarker(range);
                range.deleteContents();

                setTimeout(function() {
                    self.wwe.restoreSelectionMarker();
                    self.wwe.getEditor()._ensureBottomLine();
                });
            }
        });

        this.wwe.getEditor().addEventListener('willPaste', function(pasteData) {
            pasteData.fragment = self._processFragment(pasteData.fragment);
        });
    } else {
        this.wwe.getEditor().addEventListener('copy', function(clipboardEvent) {
            var range;

            clipboardEvent.preventDefault();

            range = self.wwe.getEditor().getSelection().cloneRange();
            range = self._extendRange(range);

            self.makeClipboardData(range, clipboardEvent);
        });

        this.wwe.getEditor().addEventListener('cut', function(clipboardEvent) {
            var range;

            clipboardEvent.preventDefault();

            range = self.wwe.getEditor().getSelection().cloneRange();
            range = self._extendRange(range);

            self.makeClipboardData(range, clipboardEvent);

            range = self.wwe.insertSelectionMarker(range);
            range.deleteContents();
            self.wwe.restoreSelectionMarker();
            self.wwe.getEditor()._ensureBottomLine();

            self.wwe.postProcessForChange();
        });
    }

    this.wwe.getEditor().addEventListener('paste', function() {
        self.wwe.postProcessForChange();
    });
};

/**
 * _processFragment
 * process fragment if it was from textarea
 * @param {DocumentFragment} fragment frament to process
 * @return {DocumentFragment} new fragment
 */
WwClipboardManager.prototype._processFragment = function(fragment) {
    var parsedChilds, processedFragment, i, t;

    if (this._latestTextareaContent === fragment.textContent) {
        parsedChilds = $.parseHTML(fragment.textContent);

        processedFragment = document.createDocumentFragment();

        for (i = 0, t = parsedChilds.length; i < t; i+=1) {
            processedFragment.appendChild(parsedChilds[i]);
        }
    }

    return  processedFragment || fragment;
};

/**
 * _getContentFromRange
 * get processed contents of range
 * @param {Range} range range of selection
 * @return {string} processed contents
 */
WwClipboardManager.prototype._getContentFromRange = function(range) {
    var resultContents,
        self = this,
        cloneContents = range.cloneContents();

    if (this._isOneTextNodeFullySelected(range)) {
        this._eachCurrentPath(function(pathStep) {
            resultContents = self._makeNodeAndAppend(pathStep, resultContents || cloneContents);
        });
    } else if (this._isOrphanListItem(range)) {
        resultContents = this._makeNodeAndAppend(range.commonAncestorContainer.tagName, cloneContents);
    } else if (this._isStartWithPartialTextNode(range)) {
        resultContents = this._makeFirstChildToTextNodeIfNeed(cloneContents);
    }

    //wrap all result content with div to get HTML data
    resultContents = this._makeNodeAndAppend('div', resultContents || cloneContents);

    return resultContents.html();
};

/**
 * _makeNodeAndAppend
 * make node and append childs
 * @param {string} tagName tagName to make
 * @param {Node} content nodes to append
 * @return {Node} node
 */
WwClipboardManager.prototype._makeNodeAndAppend = function(tagName, content) {
    var node = $('<' + tagName + '/>');
    node.append(content);

    return node;
};

/**
 * _eachCurrentPath
 * iterate path depths
 * @param {function} iteratee callback
 */
WwClipboardManager.prototype._eachCurrentPath = function(iteratee) {
   var paths =  this.wwe.getEditor().getPath().split('>'),
       i;

   for (i = paths.length - 1; i > -1 && !paths[i].match(/^body/i); i-=1) {
       iteratee(paths[i]);
   }
};

/**
 * _makeFirstChildToTextNodeIfNeed
 * Make firstchild of fragment into textnode
 * @param {DocumentFragment} frag fragment
 * @return {DocumentFragment} result fragment
 */
WwClipboardManager.prototype._makeFirstChildToTextNodeIfNeed = function(frag) {
    var newFirstChild;

    if (domUtils.isElemNode(frag.firstChild) && frag.firstChild.tagName === 'DIV') {
        newFirstChild = this.wwe.getEditor().getDocument().createTextNode(frag.firstChild.textContent);
        $(frag).find('*').first().remove();
        $(frag).prepend(newFirstChild);
    }

    return frag;
};

/**
 * copyWithTextarea
 * copy clipboard using textarea for IEs
 * @param {Range} range range of selection
 */
WwClipboardManager.prototype.copyWithTextarea = function(range) {
    var self = this,
        textarea = $('<textarea />');

    this.$hiddenArea.append(textarea);

    this._latestTextareaContent = this._getContentFromRange(range);
    textarea.val(this._latestTextareaContent);

    textarea.select();

    setTimeout(function() {
        //카피가 끝나면 텍스트 에리어 제거
        textarea.remove();
        //여기서 셀렉션도 복구
        //파폭에선 focus를 다시이동 해줘야함
        self.wwe.getEditor().focus();
        self.wwe.getEditor().setSelection(range);
    }, 0);
};

/**
 * makeClipboardData
 * make clipboard data with range
 * @param {Range} range range of selection
 * @param {ClipboardEvent} clipboardEvent current clipboardEvent
 */
WwClipboardManager.prototype.makeClipboardData = function(range, clipboardEvent) {
    var htmlText = this._getContentFromRange(range);
    clipboardEvent.clipboardData.setData('text/plain', htmlText);
};


/**
 * _extendRange
 * extend range if need
 * @param {Range} range to extend
 * @return {Range} range
 */
WwClipboardManager.prototype._extendRange = function(range) {
    var newBound;

    //같지 않은경우를 체크해야한다 같은경우 레인지 확장할때 commonAncestorContainer를 넘어가버림
    //이경우에 스타트와 엔드가 같은 텍스트노드인경우는 텍스트노드만 지우는게 맞다.
    if (range.startContainer !== range.endContainer) {
        if (range.startOffset === 0) {
            newBound = range.startContainer;

            //레인지 확장
            while (newBound.parentNode !== range.commonAncestorContainer
                    && !newBound.previousSibling
                  ) {
                newBound = newBound.parentNode;
            }

            //range단위를 한단계 확장 deleteContents는 start, end에 걸린 컨테이너 자체는 안지운다.
            range.setStart(newBound.parentNode, domUtils.getNodeOffsetOfParent(newBound));
        }

        if (range.endOffset === range.endContainer.length) {
            newBound = range.endContainer;

            //레인지 확장
            while (newBound.parentNode !== range.commonAncestorContainer
                    && (!newBound.nextSibling || (newBound.nextSibling.tagName === 'BR' && newBound.parentNode.lastChild === newBound.nextSibling))
                  ) {
                newBound = newBound.parentNode;
            }

            //range단위를 부모래밸로 한단계 확장 deleteContents는 start, end에 걸린 컨테이너 자체는 안지운다.
            range.setEnd(newBound.parentNode, domUtils.getNodeOffsetOfParent(newBound) + 1);
        }
    }

    // commonAncestor를 선택
    if (this._isWholeCommonAncestorContainerSelected(range)) {
        newBound = range.commonAncestorContainer;
        range.setStart(newBound.parentNode, domUtils.getNodeOffsetOfParent(newBound));
        range.setEnd(newBound.parentNode, domUtils.getNodeOffsetOfParent(newBound) + 1);
    }

    return range;
};

/**
 * _isWholeCommonAncestorContainerSelected
 * check if selection has whole commonAncestorContainter
 * 선택된 영역이 commonAncestorContainer의 모든 컨텐츠인치 체크
 * @param {Range} range range of selection
 * @return {boolean} result
 */
WwClipboardManager.prototype._isWholeCommonAncestorContainerSelected = function(range) {
    return range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        && range.commonAncestorContainer.tagName !== 'BODY'
        && range.startOffset === 0
        && range.endOffset === range.commonAncestorContainer.childNodes.length
        && range.commonAncestorContainer === range.startContainer
        && range.commonAncestorContainer === range.endContainer;
};

/**
 * _isOneTextNodeFullySelected
 * check if one text node fully selected with range
 * @param {Range} range range of selection
 * @return {boolean} result
 */
WwClipboardManager.prototype._isOneTextNodeFullySelected = function(range) {
    return (range.commonAncestorContainer.nodeType === Node.TEXT_NODE
        && range.startContainer === range.endContainer
        && range.startContainer === range.commonAncestorContainer
        && range.startOffset === 0
        && range.endOffset === range.commonAncestorContainer.nodeValue.length);
};

/**
 * _isStartWithPartialTextNode
 * check if start is partial textnode
 * @param {Range} range range of selection
 * @return {boolean} result
 */
WwClipboardManager.prototype._isStartWithPartialTextNode = function(range) {
    return (range.startContainer.nodeType === Node.TEXT_NODE
        && range.startOffset > 0);
};

/**
 * _isOrphanListItem
 * check if range have orphan list
 * @param {Range} range range of selection
 * @return {boolean} result
 */
WwClipboardManager.prototype._isOrphanListItem = function(range) {
    return (range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        && (range.commonAncestorContainer.tagName === 'UL' || range.commonAncestorContainer.tagName === 'OL'));
};

module.exports = WwClipboardManager;

},{"./domUtils":8}],50:[function(require,module,exports){
/**
 * @fileoverview Implements selection marker for wysiwyg
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var MARKER_CSS_CLASS = 'tui-editor-selection-marker';

/**
 * WwSelectionMarker
 * @exports WwSelectionMarker
 * @augments
 * @constructor
 * @class
 */
function WwSelectionMarker() {
    this._markerNode = null;
}

WwSelectionMarker.prototype.insertMarker = function(range, sq) {
    this._markerNode = this._makeMarker(sq);

    range.insertNode(this._markerNode);
    range.setStartAfter(this._markerNode);

    return range;
};

WwSelectionMarker.prototype._makeMarker = function(sq) {
    return sq.createElement('INPUT', {type:'hidden', class: MARKER_CSS_CLASS});
};

WwSelectionMarker.prototype.restore = function(sq) {
    var newRange = sq.getSelection().cloneRange();

    newRange.setStartAfter(this._markerNode);
    newRange.collapse(true);

    sq.setSelection(newRange);

    $(this._markerNode).remove();

    return newRange;
};

module.exports = WwSelectionMarker;

},{}],51:[function(require,module,exports){
/**
 * @fileoverview Implements AddImage wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * AddImage
 * Add Image markdown syntax to wysiwyg Editor
 * @exports AddImage
 * @augments Command
 * @augments WysiwygCommand
 */
var AddImage = CommandManager.command('wysiwyg',/** @lends AddImage */{
    name: 'AddImage',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     *  @param {object} data data for image
     */
    exec: function(wwe, data) {
        var sq = wwe.getEditor();

        sq.insertImage(data.imageUrl);
        sq.focus();
    }
});


module.exports = AddImage;

},{"../commandManager":6}],52:[function(require,module,exports){
/**
 * @fileoverview Implements AddLink wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * AddLink
 * Add link markdown syntax to wysiwyg Editor
 * @exports AddLink
 * @augments Command
 * @augments WysiwygCommand
 */
var AddLink = CommandManager.command('wysiwyg',/** @lends AddLink */{
    name: 'AddLink',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     *  @param {object} data data for image
     */
    exec: function(wwe, data) {
        var sq = wwe.getEditor();

        sq.removeAllFormatting();
        sq.makeLink(data.url);
        sq.focus();
    }
});


module.exports = AddLink;

},{"../commandManager":6}],53:[function(require,module,exports){
/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Blockquote
 * Add Blockquote to selected wysiwyg editor content
 * @exports Blockquote
 * @augments Command
 * @augments WysiwygCommand
 */
var Blockquote = CommandManager.command('wysiwyg',/** @lends Blockquote */{
    name: 'Blockquote',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor();

        wwe.unwrapBlockTag();
        sq.increaseQuoteLevel();
        sq.focus();
    }
});

module.exports = Blockquote;

},{"../commandManager":6}],54:[function(require,module,exports){
/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Bold
 * Add bold to selected wysiwyg editor content
 * @exports Bold
 * @augments Command
 * @augments WysiwygCommand
 */
var Bold = CommandManager.command('wysiwyg',/** @lends Bold */{
    name: 'Bold',
    keyMap: ['Ctrl-B', 'Ctrl-B'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor();

        sq.removeItalic();

        if (sq.hasFormat('b') || sq.hasFormat('strong')) {
            sq.changeFormat(null, {tag:'b'});
        } else if (!sq.hasFormat('a')) {
            sq.bold();
        }

        sq.focus();
    }
});

module.exports = Bold;

},{"../commandManager":6}],55:[function(require,module,exports){
/**
 * @fileoverview Implements Heading wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Heading
 * Add horizontal line markdown syntax to wysiwyg Editor
 * @exports Heading
 * @augments Command
 * @augments WysiwygCommand
 */
var Heading = CommandManager.command('wysiwyg',/** @lends Heading */{
    name: 'Heading',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor(),
            foundedHeading = wwe.hasFormatWithRx(/h[\d]/i),
            depth = 1,
            beforeDepth;

        if (foundedHeading) {
            beforeDepth = parseInt(foundedHeading[0].replace(/h/i, ''), 10);
        }

        if (beforeDepth && beforeDepth < 6) {
            depth = beforeDepth + 1;
        }

        wwe.changeBlockFormatTo('H' + depth);

        sq.focus();
    }
});

module.exports = Heading;

},{"../commandManager":6}],56:[function(require,module,exports){
/**
 * @fileoverview Implements HR wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * HR
 * Add horizontal line markdown syntax to wysiwyg Editor
 * @exports HR
 * @augments Command
 * @augments WysiwygCommand
 */
var HR = CommandManager.command('wysiwyg',/** @lends HR */{
    name: 'HR',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor();

        sq.modifyBlocks(function(frag) {
            /*
            var block = sq.createElement('DIV');
            var newFrag = sq._doc.createDocumentFragment();

            newFrag.appendChild(frag);
            newFrag.appendChild(block);

            block.appendChild(sq.createElement('BR'));
            block.appendChild(sq.createElement('HR'));
*/
            frag.appendChild(sq.createElement('HR'));

            return frag;
        });

        sq.focus();
    }
});


module.exports = HR;

},{"../commandManager":6}],57:[function(require,module,exports){
/**
 * @fileoverview Implements inceaseTask wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var inlineNodeNames = /^(?:#text|A(?:BBR|CRONYM)?|B(?:R|D[IO])?|C(?:ITE|ODE)|D(?:ATA|EL|FN)|EM|FONT|HR|I(?:MG|NPUT|NS)?|KBD|Q|R(?:P|T|UBY)|S(?:AMP|MALL|PAN|TR(?:IKE|ONG)|U[BP])?|U|VAR|WBR)$/;
/**
 * IncreaseTask
 * increase task depth to wysiwyg Editor
 * @exports IncreaseTask
 * @augments Command
 * @augments WysiwygCommand
 */
var IncreaseTask = CommandManager.command('wysiwyg',/** @lends HR */{
    name: 'IncreaseTask',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var parent, node, range;

        range = wwe.getEditor().getSelection();
        node = range.startContainer;

        if (range.collapsed && range.startContainer.textContent.replace(/^[\s]+/g, '') === '') {
            while (parent = node.parentNode) {
                // If we find a UL or OL (so are in a list, node must be an LI)
                if (parent.nodeName === 'UL' || parent.nodeName === 'OL') {
                    // AND the LI is not the first in the list
                    if (node.previousSibling) {
                        // Then increase the list level
                        wwe.getEditor().modifyBlocks(increaseTaskLevel);
/*
                        if (node.parentElement.parentElement.firstChild.tagName === 'DIV'
                            && node.parentElement.parentElement.firstChild.textContent === '') {
                                debugger;
                                $(node.parentElement.parentElement.firstChild).remove();
                        }*/
                    }

                    break;
                }
                node = parent;
            }
        }
    }
});

function isContainer(node) {
    var type = node.nodeType;
    return (type === Node.ELEMENT_NODE || type === Node.DOCUMENT_FRAGMENT_NODE) &&
        !isInline(node) && !isBlock(node);
}

function isInline(node) {
    return inlineNodeNames.test(node.nodeName);
}

function isBlock(node) {
    var type = node.nodeType;
    return (type === Node.ELEMENT_NODE || type === Node.DOCUMENT_FRAGMENT_NODE) &&
        !isInline(node) && every(node.childNodes, isInline);
}

function every(nodeList, fn) {
    var l = nodeList.length - 1;

    while (l >= 0) {
        if (!fn(nodeList[l])) {
            return false;
        }

        l -= 1;
    }

    return true;
}

function replaceWith(node, node2) {
    var parent = node.parentNode;
    if (parent) {
        parent.replaceChild(node2, node);
    }
}

function increaseTaskLevel(frag) {
    var i, l, item, type, newParent,
        items = frag.querySelectorAll('LI'),
        listItemAttrs = {class: 'task-list-item'};

    for (i = 0, l = items.length; i < l; i += 1) {
        item = items[i];
        if (!isContainer(item.firstChild)) {
            // type => 'UL' or 'OL'
            type = item.parentNode.nodeName;
            newParent = item.previousSibling;

            if (!newParent || !(newParent = newParent.lastChild) ||
                newParent.nodeName !== type) {
                replaceWith(
                    item,
                    this.createElement('LI', listItemAttrs, [
                        newParent = this.createElement(type)
                    ])
                );
            }
            newParent.appendChild(item);
        }
    }

    return frag;
}

module.exports = IncreaseTask;

},{"../commandManager":6}],58:[function(require,module,exports){
/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Italic
 * Add Italic to selected wysiwyg editor content
 * @exports Italic
 * @augments Command
 * @augments WysiwygCommand
 */
var Italic = CommandManager.command('wysiwyg',/** @lends Italic */{
    name: 'Italic',
    keyMap: ['Ctrl-I', 'Ctrl-I'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor();

        sq.removeBold();

        if (sq.hasFormat('i') || sq.hasFormat('em')) {
            sq.changeFormat(null, {tag:'i'});
        } else if (!sq.hasFormat('a')) {
            sq.italic();
        }

        sq.focus();
    }
});

module.exports = Italic;

},{"../commandManager":6}],59:[function(require,module,exports){
/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * OL
 * Add OL to selected wysiwyg editor content
 * @exports OL
 * @augments Command
 * @augments WysiwygCommand
 */
var OL = CommandManager.command('wysiwyg',/** @lends OL */{
    name: 'OL',
    keyMap: ['Ctrl-O', 'Ctrl-O'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor();

        wwe.unwrapBlockTag();
        sq.makeOrderedList();
        sq.focus();
    }
});

module.exports = OL;

},{"../commandManager":6}],60:[function(require,module,exports){
/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Table
 * Add table to selected wysiwyg editor content
 * @exports Table
 * @augments Command
 * @augments WysiwygCommand
 */
var Table = CommandManager.command('wysiwyg',/** @lends Table */{
    name: 'Table',
    /**
     * Command Handler
     * @param {WysiwygEditor} wwe WYsiwygEditor instance
     * @param {number} col column count
     * @param {number} row row count
     */
    exec: function(wwe, col, row) {
        var sq = wwe.getEditor(),
            table;

        table = '<table>';
        table += makeHeader(col);
        table += makeBody(col, row - 1);
        table += '</table>';

        sq.insertHTML(table);

        sq.focus();
    }
});

/**
 * makeHeader
 * make table header html string
 * @param {number} col column count
 * @return {string} html string
 */
function makeHeader(col) {
    var header = '<thead><tr>';

    while (col) {
        header += '<th></th>';
        col -= 1;
    }

    header += '</tr></thead>';

    return header;
}

/**
 * makeBody
 * make table body html string
 * @param {number} col column count
 * @param {number} row row count
 * @return {string} html string
 */
function makeBody(col, row) {
    var body = '<tbody>',
        irow, icol;

    for (irow = 0; irow < row; irow += 1) {
        body += '<tr>';

        for (icol = 0; icol < col; icol += 1) {
            body += '<td></td>';
        }

        body += '</tr>';
    }

    body += '</tbody>';

    return body;
}

module.exports = Table;

},{"../commandManager":6}],61:[function(require,module,exports){
/**
 * @fileoverview Implements Task WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Task
 * Add Task to selected wysiwyg editor content
 * @exports Task
 * @augments Command
 * @augments WysiwygCommand
 */
var Task = CommandManager.command('wysiwyg',/** @lends Task */{
    name: 'Task',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var selection, $selected, $li, hasInput,
            sq = wwe.getEditor();

        if (!sq.hasFormat('li')) {
            wwe.unwrapBlockTag();
            sq.makeUnorderedList();
        }

        selection = sq.getSelection().cloneRange();
        $selected = $(selection.startContainer);
        $li = $selected.closest('li');

        hasInput = $li.children('input').length || $li.children('div').eq(0).children('input').length;

        if (!hasInput) {
            selection = wwe.insertSelectionMarker(selection);

            selection.setStart(selection.startContainer, 0);
            selection.collapse(true);

            sq.insertElement(sq.createElement('INPUT', {
                type: 'checkbox'
            }), selection);

            selection.setStart(selection.startContainer, 1);

            //we need some space for safari
            sq.insertElement(sq.getDocument().createTextNode(' '), selection);

            $li.addClass('task-list-item');

            wwe.restoreSelectionMarker();
        }

        sq.focus();
    }
});

module.exports = Task;

},{"../commandManager":6}],62:[function(require,module,exports){
/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * UL
 * Add UL to selected wysiwyg editor content
 * @exports UL
 * @augments Command
 * @augments WysiwygCommand
 */
var UL = CommandManager.command('wysiwyg',/** @lends UL */{
    name: 'UL',
    keyMap: ['Ctrl-U', 'Ctrl-U'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor();

        wwe.unwrapBlockTag();
        sq.makeUnorderedList();
        sq.focus();
    }
});

module.exports = UL;

},{"../commandManager":6}],63:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var domUtils = require('./domUtils'),
    WwClipboardManager = require('./wwClipboardManager'),
    WwSelectionMarker = require('./wwSelectionMarker'),
    SquireExt = require('./squireExt');

var util = tui.util;

var FIND_HEADING_RX = /h[\d]/i,
    FIND_EMPTY_LINE = /<(.+)>(<br>|<br \/>|<BR>|<BR \/>)<\/\1>/g,
    FIND_UNNECESSARY_BR = /(?:<br>|<br \/>|<BR>|<BR \/>)<\/(.+?)>/g,
    FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD)\b/,
    FIND_TASK_SPACES_RX = /^\s+/g;

var EDITOR_CONTENT_CSS_CLASSNAME = 'tui-editor-contents';

/**
 * WysiwygEditor
 * @exports WysiwygEditor
 * @constructor
 * @class
 * @param {jQuery} $el 에디터가 들어갈 엘리먼트
 * @param {string[]} contentStyles List of CSS style file path for HTML content
 * @param {EventManager} eventManager 이벤트 매니저
 */
function WysiwygEditor($el, contentStyles, eventManager) {
    this.eventManager = eventManager;
    this.$editorContainerEl = $el;
    this.contentStyles = contentStyles;

    this._height = 0;

    this._clipboardManager = new WwClipboardManager(this);
    this._selectionMarker = new WwSelectionMarker();

    this._initEvent();
}

WysiwygEditor.prototype.init = function(callback) {
    var self = this;

    this.$iframe = $('<iframe height="100%" />');

    this.$iframe.load(function() {
        self._initSquire();

        //쿽스모드 방지 코드(makeSureStandardMode)로 인해
        //load 이벤트가 발생되는 브라우저들이있다(IE)
        //에디터의 동작을 맞추기해 완료콜백을 프레임지연해서 모든 과정이 완료되도록 동작을 일치 시켜준다.
        setTimeout(function() {
            if (callback) {
                callback();
                callback = null;
            }
        }, 0);
    });

    this.$editorContainerEl.css('position', 'relative');
    this.$editorContainerEl.append(this.$iframe);
};

WysiwygEditor.prototype._initSquire = function() {
    var self = this,
        doc = self.$iframe[0].contentDocument;

    self._makeSureStandardMode(doc);

    if (self.editor && self._isIframeReady()) {
        return;
    }

    self._initStyleSheet(doc);
    self._initEditorContainerStyles(doc);

    self.editor = new SquireExt(doc, {
        blockTag: 'DIV'
    });

    self._initSquireEvent();
    self._clipboardManager.init();

    $(doc).on('click', function() {
        self.focus();
    });
};

WysiwygEditor.prototype._isIframeReady = function() {
    var iframeWindow = this.$iframe[0].contentWindow;
    return (iframeWindow !== null && $(iframeWindow.document.body).hasClass(EDITOR_CONTENT_CSS_CLASSNAME));
};

WysiwygEditor.prototype._makeSureStandardMode = function(doc) {
    //if Not in quirks mode
    if (doc.compatMode !== 'CSS1Compat') {
        //독타입 삽입후 IE는 load 콜백이 다시 호출되는데 같은 프레임에서 재귀호출처럼 실행됨
        doc.open();
        doc.write('<!DOCTYPE html><title></title>');
        doc.close();
        //load콜백이 끝나면 첫번째 진행이 다시 진행됨(initSquire의 나머지부분이 이어서 재귀호출처럼 실행됨)
    }
};

WysiwygEditor.prototype._initStyleSheet = function(doc) {
    var styleLink;

    util.forEach(this.contentStyles, function(stylePath) {
        styleLink = doc.createElement('link');
        styleLink.rel = 'stylesheet';
        styleLink.href = stylePath;

        doc.querySelector('head').appendChild(styleLink);
    });
};

WysiwygEditor.prototype._initEditorContainerStyles = function(doc) {
    var bodyStyle, body;

    doc.querySelector('html').style.height = '100%';

    body = doc.querySelector('body');
    body.className = EDITOR_CONTENT_CSS_CLASSNAME;

    bodyStyle = body.style;
    bodyStyle.height = '100%';
    bodyStyle.padding = '0 5px';
};

WysiwygEditor.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('changeModeToWysiwyg', function() {
        self._autoResizeHeightIfNeed();
    });
};

WysiwygEditor.prototype._initSquireEvent = function() {
    var self = this;

    this.getEditor().addEventListener('paste', function(clipboardEvent) {
        self.eventManager.emit('paste', {
            source: 'wysiwyg',
            data: clipboardEvent
        });
    });

    this.getEditor().getDocument().addEventListener('dragover', function(e) {
        e.preventDefault();
        return false;
    });

    this.getEditor().getDocument().addEventListener('drop', function(eventData) {
        eventData.preventDefault();

        self.eventManager.emit('drop', {
            source: 'wysiwyg',
            data: eventData
        });

        return false;
    });

    this.getEditor().addEventListener('input', function() {
        var sel = self.editor.getSelection(),
            eventObj;

        eventObj = {
            source: 'wysiwyg',
            selection: sel,
            textContent: sel.endContainer.textContent,
            caretOffset: sel.endOffset
        };

        self.eventManager.emit('changeFromWysiwyg', eventObj);
        self.eventManager.emit('change', eventObj);
        self.eventManager.emit('contentChangedFromWysiwyg', self);

        self._autoResizeHeightIfNeed();
    });

    this.getEditor().addEventListener('keydown', function(event) {
        self._keyEventHandler(event);
    });

    //firefox has problem about keydown event while composition korean
    //파폭에서는 한글입력할때뿐아니라 한글입력도중에 엔터키와같은 특수키 입력시 keydown이벤트가 발생하지 않는다
    if (util.browser.firefox) {
        this.getEditor().addEventListener('keypress', function(event) {
            if (event.keyCode) {
                self._keyEventHandler(event);
            }
        });
    }

    this.getEditor().addEventListener('focus', function() {
        self.eventManager.emit('focus', {
            source: 'wysiwyg'
        });
    });

    this.getEditor().addEventListener('blur', function() {
        self.eventManager.emit('blur', {
            source: 'wysiwyg'
        });
    });

    this.getEditor().addEventListener('pathChange', function(data) {
        var state =  {
            bold: /(>B$)|(>B>)|(>STRONG$)|(>STRONG>)/.test(data.path),
            italic: /(>I$)|(>I>)|(>EM$)|(>EM>)/.test(data.path)
        };

        self.eventManager.emit('stateChange', state);
    });
};

WysiwygEditor.prototype._keyEventHandler = function(event) {
    var self = this,
        range = this.getEditor().getSelection().cloneRange();
/*
    console.log(event);
    console.log('-------->', event.keyCode, event.keyIdentifier);
    console.log('startContainer', range.startContainer);
    console.log('startOffset', range.startOffset);
    console.log('startContainer.parentNode', range.startContainer.parentNode);
    console.log('startContainer.previousSibling', range.startContainer.previousSibling);
    console.log('startContainer.nextSibling', range.startContainer.nextSibling);
    if (range.startContainer.nodeType === Node.ELEMENT_NODE) {
        console.log('currentPosition', range.startContainer.childNodes[range.startOffset]);
    } else {
        console.log('currentPosition', range.startContainer.nodeValue[range.startOffset]);
    }
    if (range.startOffset > 0) console.log('prev Position', range.startContainer.childNodes[range.startOffset - 1] || range.startContainer.nodeValue[range.startOffset - 1]);
    console.log('path', this.editor.getPath());
*/
    //enter
    if (event.keyCode === 13) {
        if (this._isInTaskList(range)) {
            //we need remove empty task then Squire control list
            //빈 태스크의 경우 input과 태스크상태를 지우고 리스트만 남기고 스콰이어가 리스트를 컨트롤한다
            this._unformatTaskIfNeedOnEnter(range);

            setTimeout(function() {
                if (self._isInTaskList()) {
                    self.eventManager.emit('command', 'Task');
                }
            }, 0);
        } else if (this.hasFormatWithRx(FIND_HEADING_RX)) {
            //squire의 처리 중간이나 마지막에 개입할 방법이 없어 지연 처리
            setTimeout(function() {
                self._unwrapHeading();
            }, 0);
        } else if (this._isInHr(range) || this._isNearHr(range)) {
            this._removeHrIfNeed(range, event);
        } else if (this._isInOrphanText(range)) {
            this._wrapDefaultBlockTo(range);
        } else if (this._isAfterTable(range)) {
            event.preventDefault();
            range.setStart(range.startContainer, range.startOffset - 1);
            this.breakToNewDefaultBlock(range);
        } else if (this._isBeforeTable(range)) {
            event.preventDefault();
            this.breakToNewDefaultBlock(range, 'before');
        } else if (this._isInTable(range)) {
            this._appendBrIfTdOrThNotHaveAsLastChild(range);
        }
    //backspace
    } else if (event.keyCode === 8) {
        if (range.collapsed) {
            if (this._isInTaskList(range)) {
                this._unformatTaskIfNeedOnBackspace(range);
            } else if (this.hasFormatWithRx(FIND_HEADING_RX) && range.startOffset === 0) {
                this._unwrapHeading();
            } else if (this._isInTable(range)) {
                this._tableHandlerOnBackspace(range, event);
            } else if (this._isAfterTable(range)) {
                event.preventDefault();
                //테이블 전체선택후 backspace시 다른 에디터처럼 아무작업도 하지 않는다
                //we dont do anything table on backspace when cursor is after table
            } else {
                this._removeHrIfNeed(range, event);
            }
        }
    //tab
    } else if (event.keyCode === 9) {
        if (this._isInTaskList(range)) {
            event.preventDefault();
            self.eventManager.emit('command', 'IncreaseTask');
        }
    }
};

WysiwygEditor.prototype._isBeforeTable = function(range) {
    return domUtils.getNodeName(domUtils.getChildNodeAt(range.startContainer, range.startOffset)) === 'TABLE';
};

WysiwygEditor.prototype._isAfterTable = function(range) {
    var prevElem = domUtils.getPrevOffsetNodeUntil(range.startContainer, range.startOffset);
    return domUtils.getNodeName(prevElem) === 'TABLE' && domUtils.getNodeName(range.commonAncestorContainer) === 'BODY';
};

WysiwygEditor.prototype._tableHandlerOnBackspace = function(range, event) {
    var prevNode = domUtils.getPrevOffsetNodeUntil(range.startContainer, range.startOffset, 'TR'),
        prevNodeName = domUtils.getNodeName(prevNode);

    if (!prevNode || prevNodeName === 'BR' || prevNodeName === 'TD' || prevNodeName === 'TH') {
        event.preventDefault();

        if (prevNodeName === 'BR' && prevNode.parentNode.childNodes.length !== 1) {
            $(prevNode).remove();
        }
    }
};

WysiwygEditor.prototype._appendBrIfTdOrThNotHaveAsLastChild = function(range) {
    var paths, tdOrTh, startContainerNodeName;

    startContainerNodeName = domUtils.getNodeName(range.startContainer);

    if (startContainerNodeName === 'TD' || startContainerNodeName === 'TH') {
        tdOrTh = range.startContainer;
    } else {
        paths = $(range.startContainer).parentsUntil('tr');
        tdOrTh = paths[paths.length - 1];
    }

    if (domUtils.getNodeName(tdOrTh.lastChild) !== 'BR') {
        $(tdOrTh).append('<br>');
    }
};

WysiwygEditor.prototype._autoResizeHeightIfNeed = function() {
    if (this._height === 'auto') {
        this._heightToFitContents();
    }
};

WysiwygEditor.prototype._heightToFitContents = function() {
    this.$editorContainerEl.height(this.get$Body()[0].scrollHeight);
};

WysiwygEditor.prototype._isInOrphanText = function(selection) {
    return selection.startContainer.nodeType === Node.TEXT_NODE && selection.startContainer.parentNode.tagName  === 'BODY';
};

WysiwygEditor.prototype._wrapDefaultBlockTo = function(selection) {
    var block, textElem, cursorOffset, insertTargetNode;

    this.saveSelection(selection);
    this._joinSplitedTextNodes();
    this.restoreSavedSelection();

    selection = this.getEditor().getSelection().cloneRange();

    textElem = selection.startContainer;
    cursorOffset = selection.startOffset;

    //이때 selection의 정보들이 body기준으로 변경된다(텍스트 노드가 사라져서)
    //after code below, selection selection is arselectiond by body
    block = this.getEditor().createDefaultBlock([selection.startContainer]);

    //selection for insert block
    insertTargetNode = domUtils.getChildNodeAt(selection.startContainer, selection.startOffset);
    if (insertTargetNode) {
        selection.setStartBefore(insertTargetNode);
    } else {
        //컨테이너의 차일드가 이노드 한개뿐일경우
        selection.selectNodeContents(selection.startContainer);
    }

    selection.collapse(true);

    selection.insertNode(block);

    //revert selection to original node
    selection.setStart(textElem, cursorOffset);
    selection.collapse(true);

    this.getEditor().setSelection(selection);
};

WysiwygEditor.prototype._joinSplitedTextNodes = function() {
    var findTextNodeFilter, textNodes, prevNode,
        lastGroup,
        nodesToRemove = [];

    findTextNodeFilter = function() {
        return this.nodeType === 3;
    };

    textNodes = this.get$Body().contents().filter(findTextNodeFilter);

    textNodes.each(function(i, node) {
        if (prevNode === node.previousSibling) {
            lastGroup.nodeValue += node.nodeValue;
            nodesToRemove.push(node);
        } else {
            lastGroup = node;
        }

        prevNode = node;
    });

    $(nodesToRemove).remove();
};

WysiwygEditor.prototype._wrapDefaultBlockToOrphanTexts = function() {
    var findTextNodeFilter, textNodes,

    findTextNodeFilter = function() {
        return this.nodeType === 3;
    };

    textNodes = this.get$Body().contents().filter(findTextNodeFilter);

    textNodes.each(function(i, node) {
        $(node).wrap('<div />');
    });
};

//특수키가 아닌 텍스트가 입력되는 키입력인지 체크
WysiwygEditor.prototype._isValueKeyCode = function(keyCode) {
    var isNumberOrAlphabet = (keyCode >= 48 && keyCode <= 90),
        isNumberPad = (keyCode >= 96 && keyCode <= 111),
        isMarks =  (keyCode >= 186 && keyCode <= 222),
        isKorean = keyCode === 229;

    return (isNumberOrAlphabet || isNumberPad || isMarks || isKorean);
};

WysiwygEditor.prototype.saveSelection = function(selection) {
    var sq = this.getEditor();

    if (!selection) {
        selection = sq.getSelection().cloneRange();
    }

    this.getEditor()._saveRangeToBookmark(selection);
};

WysiwygEditor.prototype.restoreSavedSelection = function() {
    var sq = this.getEditor();
    sq.setSelection(sq._getRangeAndRemoveBookmark());
};

WysiwygEditor.prototype.reset = function() {
    if (!this._isIframeReady()) {
        this.remove();
        this._initSquire();
    }

    this.setValue('');
};

WysiwygEditor.prototype.changeBlockFormatTo = function(targetTagName) {
    this.getEditor().changeBlockFormatTo(targetTagName);
    this._removeTaskInputInWrongPlace();
};

WysiwygEditor.prototype.makeEmptyBlockCurrentSelection = function() {
    var self = this;

    this.getEditor().modifyBlocks(function(frag) {
        if (!frag.textContent) {
            frag = self.getEditor().createDefaultBlock();
        }
        return frag;
    });
};

WysiwygEditor.prototype.focus = function() {
    this.editor.focus();
};

WysiwygEditor.prototype.remove = function() {
    this.editor.removeEventListener('focus');
    this.editor.removeEventListener('blur');
    this.editor.removeEventListener('keydown');
    this.editor.removeEventListener('keypress');
    this.editor.removeEventListener('paste');
    this.editor = null;
    this.$body = null;
};

WysiwygEditor.prototype.setHeight = function(height) {
    this._height = height;

    if (height === 'auto') {
        this.get$Body().css('overflow', 'hidden');
        this._heightToFitContents();
    } else {
        this.get$Body().css('overflow', 'visible');
    }

    this.$editorContainerEl.height(height);
};

WysiwygEditor.prototype.setValue = function(html) {
    this.editor.setHTML(html);
    this._ensurePtagContentWrappedWithDiv();
    this._unwrapPtags();
    this._ensureSpaceNextToTaskInput();
    this._unwrapDivOnHr();
    this._removeTaskListClass();

    this.eventManager.emit('contentChangedFromWysiwyg', this);
};

//this because we need new line inside ptag, and additional empty line added
//p태그 안에서의 개행을 위해서는 내부에 div로 감쌀필요가 있다.
WysiwygEditor.prototype._ensurePtagContentWrappedWithDiv = function() {
    this.get$Body().find('p').each(function(index, node) {
        if ($(node).find('div').length <= 0) {
            $(node).wrapInner('<div />');
        }

        if ($(node).next().is('p')) {
            $(node).append('<div><br></div>');
        }
    });
};

//we use divs for paragraph so we dont need any p tags
WysiwygEditor.prototype._unwrapPtags = function() {
    this.get$Body().find('div').each(function(index, node) {
        if ($(node).parent().is('p')) {
            $(node).unwrap();
        }
    });
};

//we use divs for paragraph so we dont need any p tags
WysiwygEditor.prototype._unwrapDivOnHr = function() {
    this.get$Body().find('hr').each(function(index, node) {
        if ($(node).parent().is('div')) {
            $(node).parent().find('br').remove();
            $(node).unwrap();
        }
    });
};

WysiwygEditor.prototype._ensureSpaceNextToTaskInput = function() {
    var findTextNodeFilter, firstTextNode, $wrapper;

    findTextNodeFilter = function() {
        return this.nodeType === 3;
    };


    this.get$Body().find('.task-list-item').each(function(i, node) {
        $wrapper = $(node).find('div');

        if (!$wrapper.length) {
            $wrapper = $(node);
        }

        firstTextNode = $wrapper.contents().filter(findTextNodeFilter)[0];

        if (firstTextNode && !(firstTextNode.nodeValue.match(FIND_TASK_SPACES_RX))) {
            firstTextNode.nodeValue = ' ' + firstTextNode.nodeValue;
        }
    });
};

WysiwygEditor.prototype._removeTaskListClass = function() {
    //because task-list class is block merge normal list and task list
    this.get$Body().find('.task-list').each(function(index, node) {
        $(node).removeClass('task-list');
    });
};

WysiwygEditor.prototype.getValue = function() {
    var html;

    this._prepareGetHTML();

    html = this.editor.getHTML();

    //we need remove task input space for safari
    html = html.replace(/<input type="checkbox">(\s|&nbsp;)/g, '<input type="checkbox">');

    //empty line replace to br
    html = html.replace(FIND_EMPTY_LINE, function(match, tag) {
        //we maintain empty list
        return tag === 'li' ? match : '<br />';
    });

    //remove unnecessary brs
    html = html.replace(FIND_UNNECESSARY_BR, '</$1>');

    //remove contenteditable block, in this case div
    html = html.replace(/<div>/g, '');
    html = html.replace(/<\/div>/g, '<br />');

    //remove last br in td or th
    html = html.replace(/\<br \/\>(\<\/td\>|\<\/th\>)/g, '$1');

    return html;
};

WysiwygEditor.prototype._prepareGetHTML = function() {
    this.editor._ignoreChange = true;

    //for ensure to fire change event
    this.get$Body().attr('lastGetValue', Date.now());

    this._addCheckedAttrToCheckedInput();
    this._joinSplitedTextNodes();
    this._wrapDefaultBlockToOrphanTexts();
};

WysiwygEditor.prototype._addCheckedAttrToCheckedInput = function() {
    var doc = this.getEditor().getDocument();

    //save input checked state to tag
    $(doc.body).find('input').each(function(index, input) {
        if (input.checked) {
            $(input).attr('checked', 'checked');
        } else {
            $(input).removeAttr('checked');
        }
    });
};

WysiwygEditor.prototype.getEditor = function() {
    return this.editor;
};

WysiwygEditor.prototype.replaceSelection = function(content, selection) {
    return this.getEditor().replaceSelection(content, selection);
};

WysiwygEditor.prototype.replaceRelativeOffset = function(content, offset, overwriteLength) {
    return this.getEditor().replaceRelativeOffset(content, offset, overwriteLength);
};

WysiwygEditor.prototype.addWidget = function(selection, node, style, offset) {
    var pos = this.getEditor().getSelectionPosition(selection, style, offset);

    if (node.parentNode !== this.$editorContainerEl[0]) {
        this.$editorContainerEl.append(node);
    }

    $(node).css({
        position: 'absolute',
        top: pos.top,
        left: pos.left
    });
};

WysiwygEditor.prototype.get$Body = function() {
    return this.getEditor().get$Body();
};

WysiwygEditor.prototype.hasFormatWithRx = function(rx) {
    return this.getEditor().getPath().match(rx);
};

WysiwygEditor.prototype._unformatTaskIfNeedOnBackspace = function(selection) {
    var startContainer, startOffset,
        prevEl, needRemove;

    startContainer = selection.startContainer;
    startOffset = selection.startOffset;

    //스타트 컨테이너가 엘리먼트인경우 엘리먼트 offset을 기준으로 다음 지워질것이 input인지 판단한다
    //유저가 임의로 Task빈칸에 수정을 가했을경우
    if (domUtils.isElemNode(startContainer)) {
        //태스크리스트의 제일 첫 오프셋인경우(인풋박스 바로 위)
        if (startOffset === 0) {
            prevEl = domUtils.getChildNodeAt(startContainer, startOffset);
        //inputbox 바로 오른편에서 지워지는경우
        } else {
            prevEl = domUtils.getChildNodeAt(startContainer, startOffset - 1);
        }

        needRemove = (domUtils.getNodeName(prevEl) === 'INPUT');
    //텍스트 노드인경우
    } else if (domUtils.isTextNode(startContainer)) {
        //previousSibling이 있다면 그건 div바로 아래의 텍스트 노드임 아닌경우가생기면 버그
        //있고 그게 input이라면 offset체크
        if (startContainer.previousSibling) {
            prevEl = startContainer.previousSibling;
        //previsousSibling이 없는 경우, 인라인태그로 감싸져있는경우다
        } else {
            prevEl = startContainer.parentNode.previousSibling;
        }

        //inputbox 이후의 텍스트노드에서 빈칸한개가 지워지는경우 같이 지운다
        //(input과 빈칸한개는 같이 지워지는게 옳다고판단)
        if (prevEl.tagName === 'INPUT' && startOffset === 1 && FIND_TASK_SPACES_RX.test(startContainer.nodeValue)) {
            startContainer.nodeValue = startContainer.nodeValue.replace(FIND_TASK_SPACES_RX, '');
            needRemove = true;
        }
    }

    if (needRemove) {
        this.saveSelection(selection);

        $(prevEl).closest('li').removeClass('task-list-item');
        $(prevEl).remove();

        this.restoreSavedSelection();
    }
};

WysiwygEditor.prototype._unformatTaskIfNeedOnEnter = function(selection) {
    var $selected, $li, $inputs,
        isEmptyTask;

    $selected = $(selection.startContainer);
    $li = $selected.closest('li');
    $inputs = $li.find('input:checkbox');
    isEmptyTask = ($li.text().replace(FIND_TASK_SPACES_RX, '') === '');

    if ($li.length && $inputs.length && isEmptyTask) {
        this.saveSelection(selection);

        $inputs.remove();
        $li.removeClass('task-list-item');
        $li.text('');

        this.restoreSavedSelection();
    }
};

WysiwygEditor.prototype.breakToNewDefaultBlock = function(selection, where) {
    var div, pathToBody, appendBefore, currentNode;

    currentNode = domUtils.getChildNodeAt(selection.startContainer, selection.startOffset) || selection.startContainer;

    pathToBody = $(currentNode).parentsUntil('body');

    if (pathToBody.length) {
        appendBefore = pathToBody[pathToBody.length - 1];
    } else {
        appendBefore = currentNode;
    }

    div = this.editor.createDefaultBlock();

    if (where === 'before') {
        $(appendBefore).before(div);
    } else {
        $(appendBefore).after(div);
    }

    selection.setStart(div, 0);
    selection.collapse(true);
    this.editor.setSelection(selection);
};

WysiwygEditor.prototype._isInHr = function(selection) {
    return domUtils.getNodeName(selection.startContainer.childNodes[selection.startOffset]) === 'HR';
};

WysiwygEditor.prototype._isNearHr = function(selection) {
    var prevNode = domUtils.getChildNodeAt(selection.startContainer, selection.startOffset - 1);
    return domUtils.getNodeName(prevNode) === 'HR';
};

WysiwygEditor.prototype._removeHrIfNeed = function(selection, event) {
    var hrSuspect, cursorTarget;

    if (this._isInHr(selection)) {
        hrSuspect = domUtils.getChildNodeAt(selection.startContainer, selection.startOffset);
    } else if (selection.startOffset === 0) {
        hrSuspect = selection.startContainer.previousSibling || selection.startContainer.parentNode.previousSibling;

        if (domUtils.getNodeName(hrSuspect) !== 'HR') {
            hrSuspect = null;
        }
    } else if (this._isNearHr(selection)) {
        hrSuspect = domUtils.getChildNodeAt(selection.startContainer, selection.startOffset - 1);
    }

    if (hrSuspect) {
        event.preventDefault();

        cursorTarget = hrSuspect.nextSibling;
        $(hrSuspect).remove();

        selection.setStartBefore(cursorTarget);
        selection.collapse(true);
        this.getEditor().setSelection(selection);
    }
};

WysiwygEditor.prototype._removeTaskInputInWrongPlace = function() {
    var self = this;

    this.get$Body()
        .find('input:checkbox')
        .each(function(index, node) {
            var isInsideTask, isCorrectPlace, parent;

            isInsideTask = ($(node).parents('li').length > 1 || $(node).parents('li').hasClass('task-list-item'));
            isCorrectPlace = !node.previousSibling;

            if (!isInsideTask || !isCorrectPlace) {
                parent = $(node).parent();
                $(node).remove();
                self.replaceContentText(parent, FIND_TASK_SPACES_RX, '');
            }
        });
};

WysiwygEditor.prototype._unformatIncompleteTask = function() {
    this.get$Body().find('.task-list-item').each(function(index, task) {
        if ((!domUtils.isElemNode(task.firstChild) || task.firstChild.tagName !== 'INPUT')
            && (!domUtils.isElemNode(task.firstChild.firstChild) || task.firstChild.firstChild.tagName !== 'INPUT')
        ) {
            $(task).removeClass('task-list-item');
        }
    });
};

WysiwygEditor.prototype.replaceContentText = function(container, from, to) {
    var before;

    this._addCheckedAttrToCheckedInput();
    before = $(container).html();
    $(container).html(before.replace(from, to));
};

WysiwygEditor.prototype._isInTaskList = function(range) {
    var li;

    if (!range) {
        range = this.getEditor().getSelection().cloneRange();
    }

    if (range.startContainer.nodeType === Node.ELEMENT_NODE
        && range.startContainer.tagName === 'LI') {
            li = range.startContainer;
    } else {
        li = $(range.startContainer).parents('li')[0];
    }

    return $(li).hasClass('task-list-item');
};

WysiwygEditor.prototype._unwrapHeading = function() {
    this.unwrapBlockTag(function(node) {
        return FIND_HEADING_RX.test(node);
    });
};

WysiwygEditor.prototype.unwrapBlockTag = function(condition) {
    if (!condition) {
        condition = function(tagName) {
            return FIND_BLOCK_TAGNAME_RX.test(tagName);
        };
    }

    this.getEditor().changeBlockFormat(condition);
    this._removeTaskInputInWrongPlace();
};

WysiwygEditor.prototype.insertSelectionMarker = function(range) {
    return this._selectionMarker.insertMarker(range, this.getEditor());
};

WysiwygEditor.prototype.restoreSelectionMarker = function() {
    return this._selectionMarker.restore(this.getEditor());
};

WysiwygEditor.prototype.postProcessForChange = function() {
    var self = this;

    setTimeout(function() {
        self.getEditor()._ignoreChange = true;
        self._unformatIncompleteTask();
        self._ensureSpaceNextToTaskInput();
        self = null;
    }, 0);
};

WysiwygEditor.prototype._isInTable = function(range) {
    var target;

    if (range.collapsed) {
        target = range.startContainer;
    } else {
        target = range.commonAncestorContainer;
    }

    return !!$(target).closest('table').length;
};

module.exports = WysiwygEditor;

},{"./domUtils":8,"./squireExt":36,"./wwClipboardManager":49,"./wwSelectionMarker":50}]},{},[19]);

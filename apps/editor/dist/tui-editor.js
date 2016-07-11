/**
 * Toast UI Colorpicker
 * @version 1.0.1
 */
!function e(t,o,n){function i(s,l){if(!o[s]){if(!t[s]){var a="function"==typeof require&&require;if(!l&&a)return a(s,!0);if(r)return r(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var u=o[s]={exports:{}};t[s][0].call(u.exports,function(e){var o=t[s][1][e];return i(o?o:e)},u,u.exports,e,t,o,n)}return o[s].exports}for(var r="function"==typeof require&&require,s=0;s<n.length;s++)i(n[s]);return i}({1:[function(e,t,o){"use strict";tui.util.defineNamespace("tui.component.colorpicker",{domutil:e("./src/js/core/domutil"),domevent:e("./src/js/core/domevent"),Collection:e("./src/js/core/collection"),View:e("./src/js/core/view"),Drag:e("./src/js/core/drag"),create:e("./src/js/factory"),Palette:e("./src/js/palette"),Slider:e("./src/js/slider"),colorutil:e("./src/js/colorutil"),svgvml:e("./src/js/svgvml")})},{"./src/js/colorutil":2,"./src/js/core/collection":3,"./src/js/core/domevent":4,"./src/js/core/domutil":5,"./src/js/core/drag":6,"./src/js/core/view":7,"./src/js/factory":8,"./src/js/palette":10,"./src/js/slider":11,"./src/js/svgvml":12}],2:[function(e,t,o){"use strict";var n=/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i,i={leadingZero:function(e,t){var o="",n=0;if((e+"").length>t)return e+"";for(;t-1>n;n+=1)o+="0";return(o+e).slice(-1*t)},isValidRGB:function(e){return n.test(e)},hexToRGB:function(e){var t,o,n;return i.isValidRGB(e)?(e=e.substring(1),t=parseInt(e.substr(0,2),16),o=parseInt(e.substr(2,2),16),n=parseInt(e.substr(4,2),16),[t,o,n]):!1},rgbToHEX:function(e,t,o){var n="#"+i.leadingZero(e.toString(16),2)+i.leadingZero(t.toString(16),2)+i.leadingZero(o.toString(16),2);return i.isValidRGB(n)?n:!1},rgbToHSV:function(e,t,o){var n,i,r,s,l,a;if(e/=255,t/=255,o/=255,n=Math.max(e,t,o),i=Math.min(e,t,o),l=n,a=n-i,s=0===n?0:a/n,n===i)r=0;else{switch(n){case e:r=(t-o)/a+(o>t?6:0);break;case t:r=(o-e)/a+2;break;case o:r=(e-t)/a+4}r/=6}return[Math.round(360*r),Math.round(100*s),Math.round(100*l)]},hsvToRGB:function(e,t,o){var n,i,r,s,l,a,c,u;if(e=Math.max(0,Math.min(360,e)),t=Math.max(0,Math.min(100,t)),o=Math.max(0,Math.min(100,o)),t/=100,o/=100,0===t)return n=i=r=o,[Math.round(255*n),Math.round(255*i),Math.round(255*r)];switch(e/=60,s=Math.floor(e),l=e-s,a=o*(1-t),c=o*(1-t*l),u=o*(1-t*(1-l)),s){case 0:n=o,i=u,r=a;break;case 1:n=c,i=o,r=a;break;case 2:n=a,i=o,r=u;break;case 3:n=a,i=c,r=o;break;case 4:n=u,i=a,r=o;break;default:n=o,i=a,r=c}return[Math.round(255*n),Math.round(255*i),Math.round(255*r)]}};t.exports=i},{}],3:[function(e,t,o){(function(e){"use strict";function o(e){this.items={},this.length=0,s(e)&&(this.getItemID=e)}var n=e.tui.util,i=n.forEachOwnProperties,r=n.forEachArray,s=n.isFunction,l=n.isObject,a=Array.prototype.slice;o.and=function(e){var t;return e=a.call(arguments),t=e.length,function(o){for(var n=0;t>n;n+=1)if(!e[n].call(null,o))return!1;return!0}},o.or=function(e){var t;return e=a.call(arguments),t=e.length,function(o){for(var n=1,i=e[0].call(null,o);t>n;n+=1)i=i||e[n].call(null,o);return i}},o.merge=function(e){var t=a.call(arguments),i={},s=new o(t[0].getItemID),l=n.extend;return r(t,function(e){l(i,e.items)}),s.items=i,s.length=n.keys(s.items).length,s},o.prototype.getItemID=function(e){return e._id+""},o.prototype.add=function(e){var t,o;return arguments.length>1?void r(a.call(arguments),function(e){this.add(e)},this):(t=this.getItemID(e),o=this.items,o[t]||(this.length+=1),void(o[t]=e))},o.prototype.remove=function(e){var t,o,i=[];return this.length?arguments.length>1?i=n.map(a.call(arguments),function(e){return this.remove(e)},this):(t=this.items,l(e)&&(e=this.getItemID(e)),t[e]?(this.length-=1,o=t[e],delete t[e],o):i):i},o.prototype.clear=function(){this.items={},this.length=0},o.prototype.has=function(e){var t,o;return this.length?(t=s(e),o=!1,t?this.each(function(t){return e(t)===!0?(o=!0,!1):void 0}):(e=l(e)?this.getItemID(e):e,o=n.isExisty(this.items[e])),o):!1},o.prototype.doWhenHas=function(e,t,o){var i=this.items[e];n.isExisty(i)&&t.call(o||this,i)},o.prototype.find=function(e){var t=new o;return this.hasOwnProperty("getItemID")&&(t.getItemID=this.getItemID),this.each(function(o){e(o)===!0&&t.add(o)}),t},o.prototype.groupBy=function(e,t){var i,r,s={},l=n.isFunction,a=l(e),c=this.getItemID;if(n.isArray(e)){if(n.forEachArray(e,function(e){s[e+""]=new o(c)}),!t)return s;e=t,a=!0}return this.each(function(t){a?r=e(t):(r=t[e],l(r)&&(r=r.apply(t))),i=s[r],i||(i=s[r]=new o(c)),i.add(t)}),s},o.prototype.single=function(){var e;return this.each(function(t){return e=t,!1},this),e},o.prototype.sort=function(e){var t=[];return this.each(function(e){t.push(e)}),s(e)&&(t=t.sort(e)),t},o.prototype.each=function(e,t){i(this.items,e,t||this)},o.prototype.toArray=function(){return this.length?n.map(this.items,function(e){return e}):[]},t.exports=o}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],4:[function(e,t,o){(function(e){"use strict";var o=e.tui.util,n=o.browser,i="_evt",r={START:["touchstart","mousedown"],END:{mousedown:"mouseup",touchstart:"touchend",pointerdown:"touchend",MSPointerDown:"touchend"},MOVE:{mousedown:"mousemove",touchstart:"touchmove",pointerdown:"touchmove",MSPointerDown:"touchmove"}},s={on:function(e,t,n,i){return o.isString(t)?void o.forEach(t.split(" "),function(t){s._on(e,t,n,i)}):void o.forEachOwnProperties(t,function(t,o){s._on(e,o,t,n)})},_on:function(e,t,n,r){var l,a,c;l=t+o.stamp(n)+(r?"_"+o.stamp(r):""),e[i]&&e[i][l]||(a=function(t){n.call(r||e,t||window.event)},c=a,"addEventListener"in e?"mouseenter"===t||"mouseleave"===t?(a=function(t){t=t||window.event,s._checkMouse(e,t)&&c(t)},e.addEventListener("mouseenter"===t?"mouseover":"mouseout",a,!1)):("mousewheel"===t&&e.addEventListener("DOMMouseScroll",a,!1),e.addEventListener(t,a,!1)):"attachEvent"in e&&e.attachEvent("on"+t,a),e[i]=e[i]||{},e[i][l]=a)},off:function(e,t,n,i){return o.isString(t)?void o.forEach(t.split(" "),function(t){s._off(e,t,n,i)}):void o.forEachOwnProperties(t,function(t,o){s._off(e,o,t,n)})},_off:function(e,t,n,r){var s=t+o.stamp(n)+(r?"_"+o.stamp(r):""),l=e[i]&&e[i][s];if(l){if("removeEventListener"in e)"mouseenter"===t||"mouseleave"===t?e.removeEventListener("mouseenter"===t?"mouseover":"mouseout",l,!1):("mousewheel"===t&&e.removeEventListener("DOMMouseScroll",l,!1),e.removeEventListener(t,l,!1));else if("detachEvent"in e)try{e.detachEvent("on"+t,l)}catch(a){}if(delete e[i][s],!o.keys(e[i]).length)return o.browser.msie&&o.browser.version<9?void(e[i]=null):void delete e[i]}},once:function(e,t,n,i){function r(){n.apply(i||e,arguments),l._off(e,t,r,i)}var l=this;return o.isObject(t)?void o.forEachOwnProperties(t,function(t,o){s.once(e,o,t,n)}):void s.on(e,t,r,i)},stopPropagation:function(e){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0},preventDefault:function(e){e.preventDefault?e.preventDefault():e.returnValue=!1},stop:function(e){s.preventDefault(e),s.stopPropagation(e)},disableScrollPropagation:function(e){s.on(e,"mousewheel MozMousePixelScroll",s.stopPropagation)},disableClickPropagation:function(e){s.on(e,r.START.join(" ")+" click dblclick",s.stopPropagation)},getMousePosition:function(e,t){var o;return t?(o=t.getBoundingClientRect(),[e.clientX-o.left-t.clientLeft,e.clientY-o.top-t.clientTop]):[e.clientX,e.clientY]},getWheelDelta:function(e){var t=0;return e.wheelDelta&&(t=e.wheelDelta/120),e.detail&&(t=-e.detail/3),t},_checkMouse:function(e,t){var o=t.relatedTarget;if(!o)return!0;try{for(;o&&o!==e;)o=o.parentNode}catch(n){return!1}return o!==e},trigger:function(e,t,n){var i=/(mouse|click)/;o.isUndefined(n)&&i.exec(t)&&(n=s.mouseEvent(t)),e.dispatchEvent?e.dispatchEvent(n):e.fireEvent&&e.fireEvent("on"+t,n)},mouseEvent:function(e,t){var i,r;return r=o.extend({bubbles:!0,cancelable:"mousemove"!==e,view:window,wheelDelta:0,detail:0,screenX:0,screenY:0,clientX:0,clientY:0,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,button:0,relatedTarget:void 0},t),n.msie&&n.version<9&&delete r.wheelDelta,"function"==typeof document.createEvent?(i=document.createEvent("MouseEvents"),i.initMouseEvent(e,r.bubbles,r.cancelable,r.view,r.detail,r.screenX,r.screenY,r.clientX,r.clientY,r.ctrlKey,r.altKey,r.shiftKey,r.metaKey,r.button,document.body.parentNode)):document.createEventObject&&(i=document.createEventObject(),o.forEach(r,function(e,t){i[t]=e},this),i.button={0:1,1:4,2:2}[i.button]||i.button),i},getMouseButton:function(e){var t,o="0,1,3,5,7",n="2,6",i="4";return document.implementation.hasFeature("MouseEvents","2.0")?e.button:(t=e.button+"",~o.indexOf(t)?0:~n.indexOf(t)?2:~i.indexOf(t)?1:void 0)}};t.exports=s}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],5:[function(e,t,o){(function(o){"use strict";function n(e){return e.replace(/^\s\s*/,"").replace(/\s\s*$/,"")}var i,r=e("./domevent"),s=e("./collection"),l=o.tui.util,a="_pos",c=/^auto$|^$|%/;i={appendHTMLElement:function(e,t,o){var n;return o=o||"",n=document.createElement(e),n.className=o,t?t.appendChild(n):document.body.appendChild(n),n},remove:function(e){e&&e.parentNode&&e.parentNode.removeChild(e)},get:function(e){return document.getElementById(e)},_matcher:function(e,t){var o=/^\./,n=/^#/;return o.test(t)?i.hasClass(e,t.replace(".","")):n.test(t)?e.id===t.replace("#",""):e.nodeName.toLowerCase()===t.toLowerCase()},find:function(e,t,o){function n(e,t){for(var l,u=e.childNodes,d=0,f=u.length;f>d;d+=1)if(l=u[d],"#text"!==l.nodeName)if(i._matcher(l,t)){if((c&&o(l)||!c)&&r.push(l),a){s=!0;break}}else if(l.childNodes.length>0&&(n(l,t),s))break}var r=[],s=!1,a=l.isUndefined(o)||o===!1,c=l.isFunction(o);return l.isString(t)&&(t=i.get(t)),t=t||window.document.body,n(t,e),a?r[0]||null:r},closest:function(e,t){var o=e.parentNode;if(i._matcher(e,t))return e;for(;o&&o!==window.document.body;){if(i._matcher(o,t))return o;o=o.parentNode}},text:function(e){var t="",o=0,n=e.nodeType;if(n){if(1===n||9===n||11===n){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)t+=i.text(e)}else if(3===n||4===n)return e.nodeValue}else for(;e[o];o+=1)t+=i.text(e[o]);return t},setData:function(e,t,o){return"dataset"in e?void(e.dataset[t]=o):void e.setAttribute("data-"+t,o)},getData:function(e,t){return"dataset"in e?e.dataset[t]:e.getAttribute("data-"+t)},hasClass:function(e,t){var o;return l.isUndefined(e.classList)?(o=i.getClass(e),o.length>0&&new RegExp("(^|\\s)"+t+"(\\s|$)").test(o)):e.classList.contains(t)},addClass:function(e,t){var o;l.isUndefined(e.classList)?i.hasClass(e,t)||(o=i.getClass(e),i.setClass(e,(o?o+" ":"")+t)):l.forEachArray(t.split(" "),function(t){e.classList.add(t)})},setClass:function(e,t){l.isUndefined(e.className.baseVal)?e.className=t:e.className.baseVal=t},removeClass:function(e,t){var o="";l.isUndefined(e.classList)?(o=(" "+i.getClass(e)+" ").replace(" "+t+" "," "),i.setClass(e,n(o))):e.classList.remove(t)},getClass:function(e){return e&&e.className?l.isUndefined(e.className.baseVal)?e.className:e.className.baseVal:""},getStyle:function(e,t){var o,n=e.style[t]||e.currentStyle&&e.currentStyle[t];return n&&"auto"!==n||!document.defaultView||(o=document.defaultView.getComputedStyle(e,null),n=o?o[t]:null),"auto"===n?null:n},getComputedStyle:function(e){var t=document.defaultView;return t&&t.getComputedStyle?document.defaultView.getComputedStyle(e):{getPropertyValue:function(t){var o=/(\-([a-z]){1})/g;return"float"===t&&(t="styleFloat"),o.test(t)&&(t=t.replace(o,function(){return arguments[2].toUpperCase()})),e.currentStyle[t]?e.currentStyle[t]:null}}},setPosition:function(e,t,o){t=l.isUndefined(t)?0:t,o=l.isUndefined(o)?0:o,e[a]=[t,o],e.style.left=t+"px",e.style.top=o+"px"},getPosition:function(e,t){var o,n,i;return t&&(e[a]=null),e[a]?e[a]:(o=0,n=0,(c.test(e.style.left)||c.test(e.style.top))&&"getBoundingClientRect"in e?(i=e.getBoundingClientRect(),o=i.left,n=i.top):(o=parseFloat(e.style.left||0),n=parseFloat(e.style.top||0)),[o,n])},getSize:function(e){var t,o=i.getStyle(e,"width"),n=i.getStyle(e,"height");return(c.test(o)||c.test(n))&&"getBoundingClientRect"in e?(t=e.getBoundingClientRect(),o=t.width,n=t.height):(o=parseFloat(o||0),n=parseFloat(n||0)),[o,n]},testProp:function(e){for(var t=document.documentElement.style,o=0,n=e.length;n>o;o+=1)if(e[o]in t)return e[o];return!1},getFormData:function(e){var t=new s(function(){return this.length}),o=function(e){return!e.disabled},n={};return t.add.apply(t,i.find("input",e,o).concat(i.find("select",e,o)).concat(i.find("textarea",e,o))),t=t.groupBy(function(e){return e&&e.getAttribute("name")||"_other"}),l.forEach(t,function(e,t){"_other"!==t&&e.each(function(o){var r=o.nodeName.toLowerCase(),s=o.type,a=[];"radio"===s?a=[e.find(function(e){return e.checked}).toArray().pop()]:"checkbox"===s?a=e.find(function(e){return e.checked}).toArray():"select"===r?e.find(function(e){return!!e.childNodes.length}).each(function(e){a=a.concat(i.find("option",e,function(e){return e.selected}))}):a=e.find(function(e){return""!==e.value}).toArray(),a=l.map(a,function(e){return e.value}),a.length?1===a.length&&(a=a[0]):a="",n[t]=a})}),n}};var u=i.testProp(["userSelect","WebkitUserSelect","OUserSelect","MozUserSelect","msUserSelect"]),d="onselectstart"in document,f="";i.disableTextSelection=function(){return d?function(){r.on(window,"selectstart",r.preventDefault)}:function(){var e=document.documentElement.style;f=e[u],e[u]="none"}}(),i.enableTextSelection=function(){return d?function(){r.off(window,"selectstart",r.preventDefault)}:function(){document.documentElement.style[u]=f}}(),i.disableImageDrag=function(){r.on(window,"dragstart",r.preventDefault)},i.enableImageDrag=function(){r.off(window,"dragstart",r.preventDefault)},t.exports=i}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./collection":3,"./domevent":4}],6:[function(e,t,o){(function(o){"use strict";function n(e,t){s.on(t,"mousedown",this._onMouseDown,this),this.options=i.extend({distance:10},e),this.container=t,this._isMoved=!1,this._distance=0,this._dragStartFired=!1,this._dragStartEventData=null}var i=o.tui.util,r=e("./domutil"),s=e("./domevent");n.prototype.destroy=function(){s.off(this.container,"mousedown",this._onMouseDown,this),this.options=this.container=this._isMoved=this._distance=this._dragStartFired=this._dragStartEventData=null},n.prototype._toggleDragEvent=function(e){var t,n,i=this.container;e?(t="on",n="disable"):(t="off",n="enable"),r[n+"TextSelection"](i),r[n+"ImageDrag"](i),s[t](o.document,{mousemove:this._onMouseMove,mouseup:this._onMouseUp},this)},n.prototype._getEventData=function(e){return{target:e.target||e.srcElement,originEvent:e}},n.prototype._onMouseDown=function(e){0===s.getMouseButton(e)&&(this._distance=0,this._dragStartFired=!1,this._dragStartEventData=this._getEventData(e),this._toggleDragEvent(!0))},n.prototype._onMouseMove=function(e){var t=this.options.distance;return s.preventDefault(e),this._isMoved=!0,this._distance<t?void(this._distance+=1):this._dragStartFired||(this._dragStartFired=!0,this.invoke("dragStart",this._dragStartEventData))?void this.fire("drag",this._getEventData(e)):void this._toggleDragEvent(!1)},n.prototype._onMouseUp=function(e){return this._toggleDragEvent(!1),this._isMoved?(this._isMoved=!1,void this.fire("dragEnd",this._getEventData(e))):void this.fire("click",this._getEventData(e))},i.CustomEvents.mixin(n),t.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./domevent":4,"./domutil":5}],7:[function(e,t,o){(function(o){"use strict";function n(e,t){var o=i.stamp(this);e=e||{},i.isUndefined(t)&&(t=r.appendHTMLElement("div")),r.addClass(t,"tui-view-"+o),this.id=o,this.container=t,this.childs=new s(function(e){return i.stamp(e)}),this.parent=null}var i=o.tui.util,r=e("./domutil"),s=e("./collection");n.prototype.addChild=function(e,t){t&&t.call(e,this),e.parent=this,this.childs.add(e)},n.prototype.removeChild=function(e,t){var o=i.isNumber(e)?this.childs.items[e]:e;e=i.stamp(o),t&&t.call(o,this),this.childs.remove(e)},n.prototype.render=function(){this.childs.each(function(e){e.render()})},n.prototype.recursive=function(e,t){i.isFunction(e)&&(t||e(this),this.childs.each(function(t){t.recursive(e)}))},n.prototype.resize=function(){for(var e=Array.prototype.slice.call(arguments),t=this.parent;t;)i.isFunction(t._onResize)&&t._onResize.apply(t,e),t=t.parent},n.prototype._beforeDestroy=function(){},n.prototype._destroy=function(){this._beforeDestroy(),this.childs.clear(),this.container.innerHTML="",this.id=this.parent=this.childs=this.container=null},n.prototype.destroy=function(e){this.childs.each(function(e){e.destroy(!0),e._destroy()}),e||this._destroy()},n.prototype.getViewBound=function(){var e=this.container,t=r.getPosition(e),o=r.getSize(e);return{x:t[0],y:t[1],width:o[0],height:o[1]}},t.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./collection":3,"./domutil":5}],8:[function(e,t,o){(function(o){"use strict";function n(e){alert(e)}function i(e){var t;return this instanceof i?(e=this.options=r.extend({container:null,color:"#f8f8f8",preset:["#181818","#282828","#383838","#585858","#b8b8b8","#d8d8d8","#e8e8e8","#f8f8f8","#ab4642","#dc9656","#f7ca88","#a1b56c","#86c1b9","#7cafc2","#ba8baf","#a16946"],cssPrefix:"tui-colorpicker-",detailTxt:"Detail"},e),e.container?(t=this.layout=new l(e,e.container),this.palette=new a(e,t.container),this.palette.on({_selectColor:this._onSelectColorInPalette,_toggleSlider:this._onToggleSlider},this),this.slider=new c(e,t.container),this.slider.on("_selectColor",this._onSelectColorInSlider,this),t.addChild(this.palette),t.addChild(this.slider),void this.render(e.color)):void n("Colorpicker(): need container option.")):new i(e)}var r=o.tui.util,s=e("./colorutil"),l=e("./layout"),a=e("./palette"),c=e("./slider");i.prototype._onSelectColorInPalette=function(e){var t=e.color,o=this.options;return s.isValidRGB(t)?void(o.color!==t&&(o.color=t,this.render(t),this.fire("selectColor",{color:t,origin:"palette"}))):void this.render()},i.prototype._onToggleSlider=function(){this.slider.toggle(!this.slider.isVisible())},i.prototype._onSelectColorInSlider=function(e){var t=e.color,o=this.options;o.color!==t&&(o.color=t,this.palette.render(t),this.fire("selectColor",{color:t,origin:"slider"}))},i.prototype.setColor=function(e){s.isValidRGB(e)||n("Colorpicker#setColor(): need valid hex string color value"),this.options.color=e,this.render(e)},i.prototype.getColor=function(){return this.options.color},i.prototype.toggle=function(e){this.layout.container.style.display=e?"block":"none"},i.prototype.render=function(e){this.layout.render(e||this.options.color)},i.prototype.destroy=function(){this.layout.destroy(),this.options.container.innerHTML="",this.layout=this.slider=this.palette=this.options=null},r.CustomEvents.mixin(i),t.exports=i}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./colorutil":2,"./layout":9,"./palette":10,"./slider":11}],9:[function(e,t,o){(function(o){"use strict";function n(e,t){this.options=i.extend({cssPrefix:"tui-colorpicker-"},e),t=r.appendHTMLElement("div",t,this.options.cssPrefix+"container"),s.call(this,e,t),this.render()}var i=o.tui.util,r=e("./core/domutil"),s=e("./core/view");i.inherit(n,s),n.prototype.render=function(e){this.recursive(function(t){t.render(e)},!0)},t.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./core/domutil":5,"./core/view":7}],10:[function(e,t,o){(function(o){"use strict";function n(e,t){this.options=i.extend({cssPrefix:"tui-colorpicker-",preset:["#181818","#282828","#383838","#585858","#B8B8B8","#D8D8D8","#E8E8E8","#F8F8F8","#AB4642","#DC9656","#F7CA88","#A1B56C","#86C1B9","#7CAFC2","#BA8BAF","#A16946"],detailTxt:"Detail"},e),t=r.appendHTMLElement("div",t,this.options.cssPrefix+"palette-container"),l.call(this,e,t)}var i=o.tui.util,r=e("./core/domutil"),s=e("./core/domevent"),l=e("./core/view"),a=e("../template/palette");i.inherit(n,l),n.prototype._onClick=function(e){var t=this.options,o=e.srcElement||e.target,n={};return r.hasClass(o,t.cssPrefix+"palette-button")?(n.color=o.value,void this.fire("_selectColor",n)):void(r.hasClass(o,t.cssPrefix+"palette-toggle-slider")&&this.fire("_toggleSlider"))},n.prototype._onChange=function(e){var t=this.options,o=e.srcElement||e.target,n={};return r.hasClass(o,t.cssPrefix+"palette-hex")?(n.color=o.value,void this.fire("_selectColor",n)):void 0},n.prototype._beforeDestroy=function(){this._toggleEvent(!1)},n.prototype._toggleEvent=function(e){var t,o=this.options,n=this.container,i=s[e?"on":"off"];i(n,"click",this._onClick,this),t=r.find("."+o.cssPrefix+"palette-hex",n),t&&i(t,"change",this._onChange,this)},n.prototype.render=function(e){var t=this.options,o="";this._toggleEvent(!1),o=a.layout.replace("{{colorList}}",i.map(t.preset,function(o){var n=a.item.replace(/{{color}}/g,o);return n=n.replace("{{selected}}",o===e?" "+t.cssPrefix+"selected":"")}).join("")),o=o.replace(/{{cssPrefix}}/g,t.cssPrefix).replace("{{detailTxt}}",t.detailTxt).replace(/{{color}}/g,e),this.container.innerHTML=o,this._toggleEvent(!0)},i.CustomEvents.mixin(n),t.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../template/palette":13,"./core/domevent":4,"./core/domutil":5,"./core/view":7}],11:[function(e,t,o){(function(o){"use strict";function n(e,t){t=r.appendHTMLElement("div",t,e.cssPrefix+"slider-container"),t.style.display="none",c.call(this,e,t),this.options=i.extend({color:"#f8f8f8",cssPrefix:"tui-colorpicker-"},e),this._dragDataCache={},this.sliderHandleElement=null,this.huebarHandleElement=null,this.baseColorElement=null,this.drag=new u({distance:0},t),this.drag.on({dragStart:this._onDragStart,drag:this._onDrag,dragEnd:this._onDragEnd,click:this._onClick},this)}var i=o.tui.util,r=e("./core/domutil"),s=e("./core/domevent"),l=e("./svgvml"),a=e("./colorutil"),c=e("./core/view"),u=e("./core/drag"),d=e("../template/slider"),f=[-7,112],p=[-3,115],h=359.99;i.inherit(n,c),n.prototype._beforeDestroy=function(){this.drag.off(),this.drag=this.options=this._dragDataCache=this.sliderHandleElement=this.huebarHandleElement=this.baseColorElement=null},n.prototype.toggle=function(e){this.container.style.display=e?"block":"none"},n.prototype.isVisible=function(){return"block"===this.container.style.display},n.prototype.render=function(e){var t,o,n=this,i=n.container,s=n.options,l=d.layout;l=l.replace(/{{slider}}/,d.slider),l=l.replace(/{{huebar}}/,d.huebar),l=l.replace(/{{cssPrefix}}/g,s.cssPrefix),n.container.innerHTML=l,n.sliderHandleElement=r.find("."+s.cssPrefix+"slider-handle",i),n.huebarHandleElement=r.find("."+s.cssPrefix+"huebar-handle",i),n.baseColorElement=r.find("."+s.cssPrefix+"slider-basecolor",i),t=a.hexToRGB(e),o=a.rgbToHSV.apply(null,t),this.moveHue(o[0],!0),this.moveSaturationAndValue(o[1],o[2],!0)},n.prototype._moveColorSliderHandle=function(e,t,o){var n,i=this.sliderHandleElement;t=Math.max(f[0],t),t=Math.min(f[1],t),e=Math.max(f[0],e),e=Math.min(f[1],e),l.setTranslateXY(i,e,t),n=t>50?"white":"black",l.setStrokeColor(i,n),o||this.fire("_selectColor",{color:a.rgbToHEX.apply(null,this.getRGB())})},n.prototype.moveSaturationAndValue=function(e,t,o){var n,i,r,s;e=e||0,t=t||0,n=Math.abs(f[0]),i=f[1],r=e*i/100-n,s=i-t*i/100-n,this._moveColorSliderHandle(r,s,o)},n.prototype._moveColorSliderByPosition=function(e,t){var o=f[0];this._moveColorSliderHandle(e+o,t+o)},n.prototype.getSaturationAndValue=function(){var e,t,o=Math.abs(f[0]),n=o+f[1],i=l.getTranslateXY(this.sliderHandleElement);return e=(i[1]+o)/n*100,t=100-(i[0]+o)/n*100,[e,t]},n.prototype._moveHueHandle=function(e,t){var o,n,i=this.huebarHandleElement,r=this.baseColorElement;e=Math.max(p[0],e),e=Math.min(p[1],e),l.setTranslateY(i,e),o=a.hsvToRGB(this.getHue(),100,100),n=a.rgbToHEX.apply(null,o),l.setGradientColorStop(r,n),t||this.fire("_selectColor",{color:a.rgbToHEX.apply(null,this.getRGB())})},n.prototype.moveHue=function(e,t){var o,n,i=0;o=Math.abs(p[0]),n=o+p[1],e=e||0,i=n*e/h-o,this._moveHueHandle(i,t)},n.prototype._moveHueByPosition=function(e){var t=p[0];this._moveHueHandle(e+t)},n.prototype.getHue=function(){var e,t,o=this.huebarHandleElement,n=l.getTranslateXY(o);return e=Math.abs(p[0]),t=e+p[1],(n[0]+e)*h/t},n.prototype.getHSV=function(){var e=this.getSaturationAndValue(),t=this.getHue();return[t].concat(e)},n.prototype.getRGB=function(){return a.hsvToRGB.apply(null,this.getHSV())},n.prototype._prepareColorSliderForMouseEvent=function(e){var t,o=this.options,n=r.closest(e.target,"."+o.cssPrefix+"slider-part");return t=this._dragDataCache={isColorSlider:r.hasClass(n,o.cssPrefix+"slider-left"),parentElement:n}},n.prototype._onClick=function(e){var t=this._prepareColorSliderForMouseEvent(e),o=s.getMousePosition(e.originEvent,t.parentElement);t.isColorSlider?this._moveColorSliderByPosition(o[0],o[1]):this._moveHueByPosition(o[1]),this._dragDataCache=null},n.prototype._onDragStart=function(e){this._prepareColorSliderForMouseEvent(e)},n.prototype._onDrag=function(e){var t=this._dragDataCache,o=s.getMousePosition(e.originEvent,t.parentElement);t.isColorSlider?this._moveColorSliderByPosition(o[0],o[1]):this._moveHueByPosition(o[1])},n.prototype._onDragEnd=function(){this._dragDataCache=null},i.CustomEvents.mixin(n),t.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../template/slider":14,"./colorutil":2,"./core/domevent":4,"./core/domutil":5,"./core/drag":6,"./core/view":7,"./svgvml":12}],12:[function(e,t,o){(function(e){"use strict";var o=e.tui.util,n=/[\.\-0-9]+/g,i=-6,r={isOldBrowser:function(){var e=r._isOldBrowser;return o.isExisty(e)||(r._isOldBrowser=e=o.browser.msie&&o.browser.version<9),e},getTranslateXY:function(e){var t;return r.isOldBrowser()?(t=e.style,[parseFloat(t.top),parseFloat(t.left)]):(t=e.getAttribute("transform"))?(t=t.match(n),[parseFloat(t[1]),parseFloat(t[0])]):[0,0]},setTranslateXY:function(e,t,o){r.isOldBrowser()?(e.style.left=t+"px",e.style.top=o+"px"):e.setAttribute("transform","translate("+t+","+o+")")},setTranslateY:function(e,t){r.isOldBrowser()?e.style.top=t+"px":e.setAttribute("transform","translate("+i+","+t+")")},setStrokeColor:function(e,t){r.isOldBrowser()?e.strokecolor=t:e.setAttribute("stroke",t)},setGradientColorStop:function(e,t){r.isOldBrowser()?e.color=t:e.setAttribute("stop-color",t)}};t.exports=r}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],13:[function(e,t,o){"use strict";var n=['<ul class="{{cssPrefix}}clearfix">{{colorList}}</ul>','<div class="{{cssPrefix}}clearfix" style="overflow:hidden">','<input type="button" class="{{cssPrefix}}palette-toggle-slider" value="{{detailTxt}}" />','<input type="text" class="{{cssPrefix}}palette-hex" value="{{color}}" maxlength="7" />','<span class="{{cssPrefix}}palette-preview" style="background-color:{{color}};color:{{color}}">{{color}}</span>',"</div>"].join("\n"),i='<li><input class="{{cssPrefix}}palette-button{{selected}}" type="button" style="background-color:{{color}};color:{{color}}" title="{{color}}" value="{{color}}" /></li>';t.exports={layout:n,item:i}},{}],14:[function(e,t,o){(function(e){"use strict";var o=e.tui.util,n=['<div class="{{cssPrefix}}slider-left {{cssPrefix}}slider-part">{{slider}}</div>','<div class="{{cssPrefix}}slider-right {{cssPrefix}}slider-part">{{huebar}}</div>'].join("\n"),i=['<svg class="{{cssPrefix}}svg {{cssPrefix}}svg-slider">',"<defs>",'<linearGradient id="{{cssPrefix}}svg-fill-color" x1="0%" y1="0%" x2="100%" y2="0%">','<stop offset="0%" stop-color="rgb(255,255,255)" />','<stop class="{{cssPrefix}}slider-basecolor" offset="100%" stop-color="rgb(255,0,0)" />',"</linearGradient>",'<linearGradient id="{{cssPrefix}}svn-fill-black" x1="0%" y1="0%" x2="0%" y2="100%">','<stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:0" />','<stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:1" />',"</linearGradient>","</defs>",'<rect width="100%" height="100%" fill="url(#{{cssPrefix}}svg-fill-color)"></rect>','<rect width="100%" height="100%" fill="url(#{{cssPrefix}}svn-fill-black)"></rect>','<path transform="translate(0,0)" class="{{cssPrefix}}slider-handle" d="M0 7.5 L15 7.5 M7.5 15 L7.5 0 M2 7 a5.5 5.5 0 1 1 0 1 Z" stroke="black" stroke-width="0.75" fill="none" />',"</svg>"].join("\n"),r=['<div class="{{cssPrefix}}vml-slider">','<v:rect strokecolor="none" class="{{cssPrefix}}vml {{cssPrefix}}vml-slider-bg">','<v:fill class="{{cssPrefix}}vml {{cssPrefix}}slider-basecolor" type="gradient" method="none" color="#ff0000" color2="#fff" angle="90" />',"</v:rect>",'<v:rect strokecolor="#ccc" class="{{cssPrefix}}vml {{cssPrefix}}vml-slider-bg">','<v:fill type="gradient" method="none" color="black" color2="white" o:opacity2="0%" class="{{cssPrefix}}vml" />',"</v:rect>",'<v:shape class="{{cssPrefix}}vml {{cssPrefix}}slider-handle" coordsize="1 1" style="width:1px;height:1px;"path="m 0,7 l 14,7 m 7,14 l 7,0 ar 12,12 2,2 z" filled="false" stroked="true" />',"</div>"].join("\n"),s=['<svg class="{{cssPrefix}}svg {{cssPrefix}}svg-huebar">',"<defs>",'<linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">','<stop offset="0%" stop-color="rgb(255,0,0)" />','<stop offset="16.666%" stop-color="rgb(255,255,0)" />','<stop offset="33.333%" stop-color="rgb(0,255,0)" />','<stop offset="50%" stop-color="rgb(0,255,255)" />','<stop offset="66.666%" stop-color="rgb(0,0,255)" />','<stop offset="83.333%" stop-color="rgb(255,0,255)" />','<stop offset="100%" stop-color="rgb(255,0,0)" />',"</linearGradient>","</defs>",'<rect width="18px" height="100%" fill="url(#g)"></rect>','<path transform="translate(-6,-3)" class="{{cssPrefix}}huebar-handle" d="M0 0 L4 4 L0 8 L0 0 Z" fill="black" stroke="none" />',"</svg>"].join("\n"),l=['<div class="{{cssPrefix}}vml-huebar">','<v:rect strokecolor="#ccc" class="{{cssPrefix}}vml {{cssPrefix}}vml-huebar-bg">','<v:fill type="gradient" method="none" colors="0% rgb(255,0,0), 16.666% rgb(255,255,0), 33.333% rgb(0,255,0), 50% rgb(0,255,255), 66.666% rgb(0,0,255), 83.333% rgb(255,0,255), 100% rgb(255,0,0)" angle="180" class="{{cssPrefix}}vml" />',"</v:rect>",'<v:shape class="{{cssPrefix}}vml {{cssPrefix}}huebar-handle" coordsize="1 1" style="width:1px;height:1px;position:absolute;z-index:1;right:22px;top:-3px;"path="m 0,0 l 4,4 l 0,8 l 0,0 z" filled="true" fillcolor="black" stroked="false" />',"</div>"].join("\n"),a=o.browser.msie&&o.browser.version<9;a&&e.document.namespaces.add("v","urn:schemas-microsoft-com:vml"),t.exports={layout:n,slider:a?r:i,huebar:a?l:s}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1]);
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview entry point
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var ToastUIEditor;

	//codemirror modes&addons
	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);

	//default extensions
	__webpack_require__(5);
	__webpack_require__(7);
	__webpack_require__(13);
	__webpack_require__(14);

	ToastUIEditor = __webpack_require__(22);

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
	            instance = ToastUIEditor.factory(options);
	            $.data(el, 'tuiEditor', instance);
	        }
	    }

	    return this;
	};

	window.tui = window.tui || {};
	window.tui.Editor = ToastUIEditor;


/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */
/***/ function(module, exports) {

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


/***/ },
/* 3 */
/***/ function(module, exports) {

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


/***/ },
/* 4 */
/***/ function(module, exports) {

	// CodeMirror, copyright (c) by Marijn Haverbeke and others
	// Distributed under an MIT license: http://codemirror.net/LICENSE
	'use strict';

	/*eslint-disable */
	var listRE = /^(\s*)(>[> ]*|[*+-]\s(?:\[(?:x|\s)\]\s)?|(\d+)([.)]\s(?:\[(?:x|\s)\]\s)?))(\s*)/,
	    emptyListRE = /^(\s*)(>[> ]*|[*+-]\s(?:\[(?:x|\s)\]\s)?|(\d+)([.)]\s(?:\[(?:x|\s)\]\s)?))(\s*)$/,
	    FIND_CODEBLOCK_START_RX = /^ *(`{3,}|~{3,})[ \.]*\S+ */,
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

	CodeMirror.commands.newlineAndIndentContinue = function(cm) {
	    if (cm.getOption("disableInput")) return CodeMirror.Pass;
	    var ranges = cm.listSelections(), replacements = [];

	    for (var i = 0; i < ranges.length; i++) {
	        var pos = ranges[i].head;
	        var eolState = cm.getStateAfter(pos.line);
	        var inList = eolState.base.list !== false;
	        var inQuote = eolState.base.quote !== 0;

	        var line = cm.getLine(pos.line);
	        var isCodeBlockStart = FIND_CODEBLOCK_START_RX.test(line);
	        var match = listRE.exec(line);
	        var cursor;

	        if (!ranges[i].empty() || (!inList && !inQuote && !isCodeBlockStart) || (!match && !isCodeBlockStart)) {
	            cm.execCommand("newlineAndIndent");
	            return;
	        }

	        if (isCodeBlockStart) {
	            cursor = cm.getCursor();

	            if (cursor.line !== pos.line || cursor.ch !== line.length) {
	                cm.execCommand("newlineAndIndent");
	                return;
	            }
	        }

	        if (emptyListRE.test(line)) {
	            cm.replaceRange("", {
	                line: pos.line, ch: 0
	            }, {
	                line: pos.line, ch: pos.ch + 1
	            });
	            replacements[i] = "\n";
	        } else if(isCodeBlockStart) {
	            replacements[i] = '\n\n```';
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

	    if (isCodeBlockStart) {
	        cm.setCursor(pos.line + 1, 0);
	    }
	};
	/*eslint-enable */


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var extManager = __webpack_require__(6);

	var FIND_TASK_RX = /^\s*\* \[[xX ]\] [^\n]*/mg;
	var FIND_CHECKED_TASK_RX = /^\s*\* \[[xX]\] [^\n]*/mg;

	extManager.defineExtension('taskCounter', function(editor) {
	    editor.getTaskCount = function() {
	        var found, count;

	        if (editor.isViewOnly()) {
	            count = editor.preview.$el.find('input').length;
	        } else if (editor.isMarkdownMode()) {
	            found = editor.mdEditor.getValue().match(FIND_TASK_RX);
	            count = found ? found.length : 0;
	        } else {
	            count = editor.wwEditor.get$Body().find('input').length;
	        }

	        return count;
	    };

	    editor.getCheckedTaskCount = function() {
	        var found, count;

	        if (editor.isViewOnly()) {
	            count = editor.preview.$el.find('input:checked').length;
	        } else if (editor.isMarkdownMode()) {
	            found = editor.mdEditor.getValue().match(FIND_CHECKED_TASK_RX);
	            count = found ? found.length : 0;
	        } else {
	            count = editor.wwEditor.get$Body().find('input:checked').length;
	        }

	        return count;
	    };
	});


/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var util = tui.util;

	/**
	 * ExtManager
	 * @exports ExtManager
	 * @constructor
	 * @class ExtManager
	 */
	function ExtManager() {
	    this.exts = new util.Map();
	}

	/**
	 * defineExtension
	 * Defined Extension
	 * @api
	 * @memberOf ExtManager
	 * @param {string} name extension name
	 * @param {ExtManager~extension} ext extension
	 */
	ExtManager.prototype.defineExtension = function(name, ext) {
	    this.exts.set(name, ext);
	};

	/**
	 * Apply extensions
	 * @api
	 * @memberOf ExtManager
	 * @param {object} context Context
	 * @param {Array.<string>} extNames Extension names
	 */
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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements Scroll Follow Extension
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var extManager = __webpack_require__(6),
	    ScrollSync = __webpack_require__(8),
	    SectionManager = __webpack_require__(9),
	    Button = __webpack_require__(10);

	extManager.defineExtension('scrollFollow', function(editor) {
	    var scrollable = false,
	        active = true,
	        sectionManager, scrollSync,
	        className = 'tui-scrollfollow',
	        TOOL_TIP = {
	            active: '자동 스크롤 끄기',
	            inActive: '자동 스크롤 켜기'
	        },
	        button,
	        cm;

	    if (editor.isViewOnly()) {
	        return;
	    }

	    cm = editor.getCodeMirror();

	    sectionManager = new SectionManager(cm, editor.preview);
	    scrollSync = new ScrollSync(sectionManager, cm, editor.preview.$el);

	    //UI
	    if (editor.getUI().name === 'default') {
	        //init button
	        button = new Button({
	            className: className,
	            command: 'scrollFollowToggle',
	            tooltip: TOOL_TIP.active,
	            $el: $('<button class="active ' + className + ' tui-toolbar-icons" type="button"></button>')
	        });

	        editor.getUI().toolbar.addButton(button);

	        if (editor.currentMode === 'wysiwyg') {
	            button.$el.hide();
	        }

	        //hide scroll follow button in wysiwyg
	        editor.on('changeModeToWysiwyg', function() {
	            button.$el.hide();
	        });

	        editor.on('changeModeToMarkdown', function() {
	            button.$el.show();
	        });

	        //Commands
	        editor.addCommand('markdown', {
	            name: 'scrollFollowToggle',
	            exec: function() {
	                active = !active;

	                if (active) {
	                    button.$el.addClass('active');
	                    button.tooltip = TOOL_TIP.active;
	                } else {
	                    button.$el.removeClass('active');
	                    button.tooltip = TOOL_TIP.inActive;
	                }
	            }
	        });
	    }

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
	});


/***/ },
/* 8 */
/***/ function(module, exports) {

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
	 * @returns {number} height
	 */
	ScrollSync.prototype._getEditorSectionHeight = function(section) {
	    var height;

	    height = this.cm.heightAtLine(section.end, 'local');
	    height -= this.cm.heightAtLine(section.start > 0 ? section.start - 1 : 0, 'local');

	    return height;
	};

	/**
	 * _getLineHeightGapInSection
	 * get height gap between passed line in passed section
	 * @param {object} section section be caculated
	 * @param {number} line line number
	 * @returns {number} gap
	 */
	ScrollSync.prototype._getEditorLineHeightGapInSection = function(section, line) {
	    var gap;

	    gap = this.cm.heightAtLine(line, 'local');
	    gap -= this.cm.heightAtLine(section.start > 0 ? section.start - 1 : 0, 'local');

	    return Math.max(gap, 0);
	};

	/**
	 * _getSectionScrollRatio
	 * get ratio of height between scrollTop line and scrollTop section
	 * @param {object} section section be caculated
	 * @param {number} line line number
	 * @returns {number} ratio
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
	 * @returns {object} scroll factors
	 */
	ScrollSync.prototype._getScrollFactorsOfEditor = function() {
	    var topLine, topSection, ratio, isEditorBottom, factors,
	        cm = this.cm,
	        scrollInfo = cm.getScrollInfo();

	    isEditorBottom = (scrollInfo.height - scrollInfo.top) <= scrollInfo.clientHeight;

	    if (isEditorBottom) {
	        factors = {
	            isEditorBottom: isEditorBottom
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
	 * @returns {number|undefined} scrollTop value, when something wrong then return undefined
	 */
	ScrollSync.prototype._getScrollTopForPreview = function() {
	    var scrollTop, scrollFactors, section, ratio;

	    scrollFactors = this._getScrollFactorsOfEditor();
	    section = scrollFactors.section;
	    ratio = scrollFactors.sectionRatio;

	    if (scrollFactors.isEditorBottom) {
	        scrollTop = this.$contents.height();
	    } else if (section.$previewSectionEl) {
	        scrollTop = section.$previewSectionEl[0].offsetTop;
	        scrollTop += (section.$previewSectionEl.height() * ratio) - SCROLL_TOP_PADDING;
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


/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * @fileoverview Implements Scroll Follow Extension SectionManager Module
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var FIND_HEADER_RX = /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/,
	    FIND_SETEXT_HEADER_RX = /^ *(?:={1,}|-{1,})\s*$/,
	    FIND_CODEBLOCK_END_RX = /^ *(`{3,}|~{3,})[ ]*$/,
	    FIND_CODEBLOCK_START_RX = /^ *(`{3,}|~{3,})[ \.]*(\S+)? */,
	    FIND_SPACE = /\s/g;

	/**
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
	 * @returns {object[]} section object list
	 */
	SectionManager.prototype.getSectionList = function() {
	    return this._sectionList;
	};

	/**
	 * _makeSectionData
	 * make default section object
	 * @param {number} start initial start line number
	 * @param {number} end initial end line number
	 * @returns {object} section object
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
	    var isSection, i, lineLength, lineString, nextLineString, prevLineString,
	        isTrimming = true,
	        onTable = false,
	        onCodeBlock = false,
	        trimCapture = '';

	    lineLength = this.cm.getDoc().lineCount();

	    for (i = 0; i < lineLength; i += 1) {
	        isSection = false;
	        lineString = this.cm.getLine(i);
	        nextLineString = this.cm.getLine(i + 1) || '';
	        prevLineString = this.cm.getLine(i - 1) || '';

	        if (onTable && (!lineString || !this._isTableCode(lineString))) {
	            onTable = false;
	        } else if (!onTable && this._isTable(lineString, nextLineString)) {
	            onTable = true;
	        }

	        if (onCodeBlock && this._isCodeBlockEnd(prevLineString)) {
	            onCodeBlock = false;
	        } else if (!onCodeBlock && this._isCodeBlockStart(lineString)) {
	            onCodeBlock = this._doFollowedLinesHaveCodeBlockEnd(i, lineLength);
	        }

	        //atx header
	        if (this._isAtxHeader(lineString)) {
	            isSection = true;
	        //setext header
	        } else if (!onCodeBlock && !onTable && this._isSeTextHeader(lineString, nextLineString)) {
	            isSection = true;
	        }

	        //빈공간으로 시작되다다가 헤더를 만난경우 섹션은 두개가 생성되는데
	        //프리뷰에서는 빈공간이 트리밍되어 섹션 한개 밖에 생성되지 않아 매칭이 되지 않는 문제 해결
	        if (isTrimming) {
	            trimCapture += lineString.trim();

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
	 * _doFollowedLinesHaveCodeBlockEnd
	 * Check if follow lines have codeblock end
	 * @param {number} lineIndex current index
	 * @param {number} lineLength line length
	 * @returns {boolean} result
	 */
	SectionManager.prototype._doFollowedLinesHaveCodeBlockEnd = function(lineIndex, lineLength) {
	    var i,
	        doLineHaveCodeBlockEnd = false;

	    for (i = lineIndex + 1; i < lineLength; i += 1) {
	        if (this._isCodeBlockEnd(this.cm.getLine(i))) {
	            doLineHaveCodeBlockEnd = true;
	            break;
	        }
	    }

	    return doLineHaveCodeBlockEnd;
	};

	/**
	 * _isCodeBlockStart
	 * Check if passed string have code block start
	 * @param {string} string string to check
	 * @returns {boolean} result
	 */
	SectionManager.prototype._isCodeBlockStart = function(string) {
	    return FIND_CODEBLOCK_START_RX.test(string);
	};

	/**
	 * _isCodeBlockEnd
	 * Check if passed string have code block end
	 * @param {string} string string to check
	 * @returns {boolean} result
	 */
	SectionManager.prototype._isCodeBlockEnd = function(string) {
	    return FIND_CODEBLOCK_END_RX.test(string);
	};

	/**
	 * _isTable
	 * Check if passed string have table
	 * @param {string} lineString current line string
	 * @param {string} nextLineString next line string
	 * @returns {boolean} result
	 */
	SectionManager.prototype._isTable = function(lineString, nextLineString) {
	    return (this._isTableCode(lineString) && this._isTableAligner(nextLineString));
	};

	/**
	 * _isTableCode
	 * Check if passed string have table code
	 * @param {string} string string to check
	 * @returns {boolean} result
	 */
	SectionManager.prototype._isTableCode = function(string) {
	    return /(^\S?.*\|.*)/.test(string);
	};

	/**
	 * _isTableAligner
	 * Check if passed string have table align code
	 * @param {string} string string to check
	 * @returns {boolean} result
	 */
	SectionManager.prototype._isTableAligner = function(string) {
	    return /(\s*[-:]+\s*\|)+/.test(string);
	};

	/**
	 * _isAtxHeader
	 * Check if passed string have atx header
	 * @param {string} string string to check
	 * @returns {boolean} result
	 */
	SectionManager.prototype._isAtxHeader = function(string) {
	    return FIND_HEADER_RX.test(string);
	};

	/**
	 * _isSeTextHeader
	 * @param {string} lineString current line string
	 * @param {string} nextLineString next line string
	 * @returns {boolean} result
	 */
	SectionManager.prototype._isSeTextHeader = function(lineString, nextLineString) {
	    return lineString.replace(FIND_SPACE, '') !== '' && nextLineString && FIND_SETEXT_HEADER_RX.test(nextLineString);
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
	            $sectionDiv = $('<div class="content-id-' + index + '"></div>');
	            self._sectionList[index].$previewSectionEl = $(childs).wrapAll($sectionDiv).parent();
	        }
	    });
	};

	/**
	 * findElementNodeFilter
	 * @this Node
	 * @returns {boolean} true or not
	 */
	function findElementNodeFilter() {
	    return this.nodeType === Node.ELEMENT_NODE;
	}

	/**
	 * _getPreviewSections
	 * get preview html section group to make section
	 * @returns {array[]} element node array
	 */
	SectionManager.prototype._getPreviewSections = function() {
	    var lastSection = 0,
	        sections = [];

	    sections[0] = [];

	    this.$previewContent.contents().filter(findElementNodeFilter).each(function(index, el) {
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
	 * @returns {object} section
	 */
	SectionManager.prototype.sectionByLine = function(line) {
	    var sectionIndex,
	        sectionList = this._sectionList,
	        sectionLength = sectionList.length;

	    for (sectionIndex = 0; sectionIndex < sectionLength; sectionIndex += 1) {
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


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */
	'use strict';

	var UIController = __webpack_require__(11);
	var Tooltip = __webpack_require__(12);

	var util = tui.util;
	var tooltip = new Tooltip();

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
	        className: options.className + ' tui-toolbar-icons',
	        rootElement: options.$el
	    });

	    this._setOptions(options);

	    this.render();

	    this.attachEvents({
	        'click': '_onClick'
	    });

	    if (options.tooltip) {
	        this.attachEvents({
	            'mouseover': '_onOver',
	            'mouseout': '_onOut'
	        });
	    }
	}

	Button.prototype = util.extend(
	    {},
	    UIController.prototype
	);

	Button.prototype._setOptions = function(options) {
	    this.command = options.command;
	    this.event = options.event;
	    this.text = options.text;
	    this.tooltip = options.tooltip;
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

	Button.prototype._onOver = function() {
	    tooltip.show(this.$el, this.tooltip);
	};

	Button.prototype._onOut = function() {
	    tooltip.hide();
	};

	module.exports = Button;


/***/ },
/* 11 */
/***/ function(module, exports) {

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
	    var self = this;

	    this.remove();
	    this.detachEvents();

	    util.forEachOwnProperties(this, function(value, key) {
	        self[key] = null;
	    });
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


/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * @fileoverview
	 * @author Minho Choi(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var TOOLTIP_CONTENT = '<div class="tui-tooltip"><div class="arrow"></div><span class="text"></span></span></div>';

	/**
	 * Tooltip
	 * @exports Tooltip
	 * @constructor
	 */
	function Tooltip() {
	    this.$el = $(TOOLTIP_CONTENT);
	    this.$el.appendTo('body');
	    this.$el.hide();
	}

	/**
	 * 툴팁을 보여줌
	 * @param {jQuery} target 툴팁을 보여줄 대상
	 * @param {String} text 툴팁내용
	 */
	Tooltip.prototype.show = function(target, text) {
	    this.$el.css({
	        'top': target.offset().top + target.height() + 13,
	        'left': target.offset().left + 3
	    }).find('.text').html(text).end().show();
	};

	Tooltip.prototype.hide = function() {
	    this.$el.hide();
	};

	module.exports = Tooltip;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements Color syntax Extension
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var extManager = __webpack_require__(6);

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

	    if (!editor.isViewOnly() && editor.getUI().name === 'default') {
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
	                var sq = wwe.getEditor();

	                if (!sq.hasFormat('PRE')) {
	                    if (color === RESET_COLOR) {
	                        sq.changeFormat(null, {
	                            class: 'colour',
	                            tag: 'span'
	                        });
	                    } else {
	                        sq.setTextColour(color);
	                    }
	                }

	                sq.focus();
	            }
	        });

	        initUI(editor);
	    }
	});

	function initUI(editor) {
	    var $colorPickerContainer, $button, colorPicker, popup, $buttonBar, selectedColor, className;

	    className = 'tui-color';

	    editor.eventManager.addEventType('colorButtonClicked');

	    editor.getUI().toolbar.addButton({
	        className: className,
	        event: 'colorButtonClicked',
	        tooltip: '글자색상'
	    }, 2);
	    $button = editor.getUI().toolbar.$el.find('button.' + className);

	    $colorPickerContainer = $('<div />');

	    $buttonBar = $('<div><button type="button" class="te-apply-button">입력</button></div>');
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
	            'position': 'absolute'
	        }
	    });

	    editor.eventManager.listen('focus', function() {
	        popup.hide();
	    });

	    editor.eventManager.listen('colorButtonClicked', function() {
	        editor.eventManager.emit('closeAllPopup');
	        if (popup.isShow()) {
	            popup.hide();
	        } else {
	            popup.$el.css({
	                'top': $button.position().top + $button.height() + 5,
	                'left': $button.position().left
	            });
	            popup.show();
	        }
	    });

	    editor.eventManager.listen('closeAllPopup', function() {
	        popup.hide();
	    });

	    editor.eventManager.listen('removeEditor', function() {
	        colorPicker.off('selectColor');
	    });

	    colorPicker.on('selectColor', function(e) {
	        selectedColor = e.color;

	        if (e.origin === 'palette') {
	            editor.exec('color', selectedColor);
	            popup.hide();
	        }
	    });

	    popup.$el.find('.te-apply-button').on('click', function() {
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

	        return '#' + get2DigitNumberString(r.toString(16))
	            + get2DigitNumberString(g.toString(16))
	            + get2DigitNumberString(b.toString(16));
	    });
	}

	function get2DigitNumberString(numberStr) {
	    return numberStr === '0' ? '00' : numberStr;
	}


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements mark extension for making text marker
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var extManager = __webpack_require__(6),
	    MarkerList = __webpack_require__(15),
	    MarkerManager = __webpack_require__(16),
	    WysiwygMarkerHelper = __webpack_require__(18),
	    ViewOnlyMarkerHelper = __webpack_require__(20),
	    MarkdownMarkerHelper = __webpack_require__(21);

	var util = tui.util;

	var MARKER_UPDATE_DELAY = 100,
	    FIND_CRLF_RX = /(\n)|(\r\n)|(\r)/g;

	/**
	 * Mark Extension
	 * Define marker extension
	 */
	extManager.defineExtension('mark', function(editor) {
	    var ml = new MarkerList(),
	        mm = new MarkerManager(ml),
	        wmh, mmh, vmh;

	    editor.eventManager.addEventType('markerUpdated');

	    if (editor.isViewOnly()) {
	        vmh = new ViewOnlyMarkerHelper(editor.preview);
	    } else {
	        wmh = new WysiwygMarkerHelper(editor.getSquire());
	        mmh = new MarkdownMarkerHelper(editor.getCodeMirror());
	    }

	    /**
	     * getHelper
	     * Get helper for current situation
	     * @returns {object} helper
	     */
	    function getHelper() {
	        var helper;

	        if (editor.isViewOnly()) {
	            helper = vmh;
	        } else if (editor.isWysiwygMode()) {
	            helper = wmh;
	        } else {
	            helper = mmh;
	        }

	        return helper;
	    }

	    function updateMarkWhenResizing() {
	        var helper = getHelper();

	        ml.getAll().forEach(function(marker) {
	            helper.updateMarkerWithExtraInfo(marker);
	        });

	        editor.eventManager.emit('markerUpdated', ml.getAll());
	    }

	    //We need to update marker after window have been resized
	    $(window).on('resize', updateMarkWhenResizing);

	    editor.on('removeEditor', function() {
	        $(window).off('resize', updateMarkWhenResizing);
	    });

	    //Reset marker content after set value
	    editor.on('setValueAfter', function() {
	        var helper = getHelper();
	        mm.resetContent(helper.getTextContent());
	    });

	    /**
	     * setValueWithMarkers
	     * Set value with markers
	     * @param {string} value markdown content
	     * @param {object} markerDataCollection marker data that obtain with exportMarkers method
	     * @returns {Array.<object>} markers
	     */
	    editor.setValueWithMarkers = function(value, markerDataCollection) {
	        var helper;

	        ml.resetMarkers();

	        markerDataCollection.forEach(function(markerData) {
	            ml.addMarker(markerData.start, markerData.end, markerData.id);
	        });

	        editor.setValue(value);

	        mm.resetContent(value.replace(FIND_CRLF_RX, ''));

	        if (this.isViewOnly() || this.isWysiwygMode()) {
	            helper = getHelper();
	            mm.updateMarkersByContent(helper.getTextContent());
	        } else {
	            helper = mmh;
	        }

	        ml.getAll().forEach(function(marker) {
	            helper.updateMarkerWithExtraInfo(marker);
	        });

	        this.eventManager.emit('markerUpdated', ml.getAll());

	        return ml.getAll();
	    };

	    /**
	     * getMarker
	     * Get markers that have given id
	     * @param {string} id id of marker
	     * @returns {object}
	     */
	    editor.getMarker = function(id) {
	        return ml.getMarker(id);
	    };

	    /**
	     * getMarkersAll
	     * Get all markers
	     * @returns {Array.<object>}
	     */
	    editor.getMarkersAll = function() {
	        return ml.getAll();
	    };

	    /**
	     * removeMarker
	     * Remove marker with given id
	     * @param {string} id of marker that should be removed
	     * @returns {marker} removed marker
	     */
	    editor.removeMarker = function(id) {
	        return ml.removeMarker(id);
	    };

	    /**
	     * getMarkersData
	     * Get marker data to export so you can restore markers next time
	     * @returns {object} markers data
	     */
	    editor.exportMarkers = function() {
	        var markersData;

	        if (this.isMarkdownMode()) {
	            markersData = ml.getMarkersData();
	        } else if (this.isViewOnly() || this.isWysiwygMode()) {
	            mm.updateMarkersByContent(this.getValue().replace(FIND_CRLF_RX, ''));
	            markersData = ml.getMarkersData();
	            mm.updateMarkersByContent(getHelper().getTextContent());
	        }

	        return markersData;
	    };

	    /**
	     * selectMarker
	     * Make selection with marker that have given id
	     * @param {string} id id of marker
	     */
	    editor.selectMarker = function(id) {
	        var helper = getHelper(),
	            marker = this.getMarker(id);

	        if (marker) {
	            helper.selectOffsetRange(marker.start, marker.end);
	        }
	    };

	    /**
	     * addMarker
	     * Add Marker with given id
	     * if you pass just id then it uses current selection for marker
	     * or you can pass start and end offset for marker
	     * @param {number|string} start start offset or id
	     * @param {number} end end offset
	     * @param {string} id id of marker
	     * @returns {object} marker that have made
	     */
	    editor.addMarker = function(start, end, id) {
	        var marker,
	            helper = getHelper();

	        if (!id) {
	            id = start;
	            marker = helper.getMarkerInfoOfCurrentSelection();
	        } else {
	            marker = {
	                start: start,
	                end: end
	            };

	            marker = helper.updateMarkerWithExtraInfo(marker);
	        }

	        if (marker) {
	            marker.id = id;
	            marker = ml.addMarker(marker);
	            ml.sortBy('end');
	            this.eventManager.emit('markerUpdated', [marker]);
	        }

	        return marker;
	    };

	    /**
	     * clearSelect
	     * Clear selection
	     */
	    editor.clearSelect = function() {
	        getHelper().clearSelect();
	    };

	    if (!editor.isViewOnly()) {
	        editor.on('changeMode', function() {
	            editor._updateMarkers();
	        });

	        editor.on('change', util.debounce(function() {
	            editor._updateMarkers();
	        }, MARKER_UPDATE_DELAY));

	        /**
	         * _updateMarkers
	         * Update markers with current text content
	         */
	        editor._updateMarkers = function() {
	            var helper = getHelper();

	            if (!ml.getAll().length) {
	                return;
	            }

	            mm.updateMarkersByContent(helper.getTextContent());

	            ml.getAll().forEach(function(marker) {
	                helper.updateMarkerWithExtraInfo(marker);
	            });

	            editor.eventManager.emit('markerUpdated', ml.getAll());
	        };
	    }
	});


/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	var util = tui.util;

	/**
	 * Markerlist
	 * @exports Markerlist
	 * @constructor
	 * @class
	 */
	function Markerlist() {
	    this._sortedMarkers = [];
	    this._markersWithId = {};
	}

	/**
	 * addMarker
	 * Add Marker
	 * @param {number|object} start start text offset
	 * @param {number} end end text offset
	 * @param {string} id id of marker
	 * @returns {object} marker
	 */
	Markerlist.prototype.addMarker = function(start, end, id) {
	    var marker;

	    if (!id) {
	        marker = start;
	    } else {
	        marker = {
	            start: start,
	            end: end,
	            id: id
	        };
	    }

	    if (!this._markersWithId[marker.id]) {
	        this._sortedMarkers.push(marker);
	        this._markersWithId[marker.id] = marker;
	    }

	    return marker;
	};

	/**
	 * getMarker
	 * Get marker with given id
	 * @param {string} id id of marker
	 * @returns {object} marker
	 */
	Markerlist.prototype.getMarker = function(id) {
	    return this._markersWithId[id];
	};

	/**
	 * removeMarker
	 * Remove marker with given id
	 * @param {string} id of marker that should be removed
	 * @returns {marker} removed marker
	 */
	Markerlist.prototype.removeMarker = function(id) {
	    var removedMarker, index;

	    removedMarker = this._markersWithId[id];
	    delete this._markersWithId[id];

	    index = this._sortedMarkers.indexOf(removedMarker);
	    this._sortedMarkers.splice(index, 1);

	    return removedMarker;
	};

	/**
	 * updateMarker
	 * Update marker with extra information
	 * @param {string} id id of marker
	 * @param {object} obj extra information
	 * @returns {object} marker
	 */
	Markerlist.prototype.updateMarker = function(id, obj) {
	    var marker = this.getMarker(id);

	    return util.extend(marker, obj);
	};

	/**
	 * forEachByRangeAffected
	 * Iterate markers affected by given range
	 * @param {number} start start offset
	 * @param {end} end end offset
	 * @param {function} iteratee iteratee
	 */
	Markerlist.prototype.forEachByRangeAffected = function(start, end, iteratee) {
	    var rangeMarkers;

	    rangeMarkers = this._getMarkersByRangeAffected(start, end);

	    rangeMarkers.forEach(iteratee);
	};

	/**
	 * _getMarkersByRangeAffected
	 * Get markers affected by given range
	 * @param {number} start start offset
	 * @param {end} end end offset
	 * @returns {Array.<object>} markers
	 */
	Markerlist.prototype._getMarkersByRangeAffected = function(start, end) {
	    var rangeMarkers;

	    rangeMarkers = this._sortedMarkers.filter(function(marker) {
	        if (marker.end > end || marker.end > start) {
	            return true;
	        }

	        return false;
	    });

	    return rangeMarkers;
	};

	/**
	 * getAll
	 * Get markers all
	 * @returns {Array.<object>} markers
	 */
	Markerlist.prototype.getAll = function() {
	    return this._sortedMarkers;
	};

	/**
	 * resetMarkers
	 * Reset markerlist
	 */
	Markerlist.prototype.resetMarkers = function() {
	    this._sortedMarkers = [];
	    this._markersWithId = {};
	};

	/**
	 * sortBy
	 * Sort markers with given key of marker
	 * @param {string} rangeKey, start or end
	 */
	Markerlist.prototype.sortBy = function(rangeKey) {
	    this._sortedMarkers.sort(function(a, b) {
	        return a[rangeKey] - b[rangeKey];
	    });
	};

	/**
	 * getMarkersData
	 * Get marker data to export
	 * @returns {object} markers data
	 */
	Markerlist.prototype.getMarkersData = function() {
	    return this.getAll().map(function(marker) {
	        return {
	            start: marker.start,
	            end: marker.end,
	            id: marker.id
	        };
	    });
	};

	module.exports = Markerlist;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var DiffMatchPatch = __webpack_require__(17);

	var util = tui.util;

	var CHANGE_NOTHING = 0,
	    CHANGE_ADD = 1,
	    CHANGE_MINUS = -1;

	/**
	 * MarkerManager
	 * @exports MarkerManager
	 * @constructor
	 * @class
	 * @param {MarkerList} markerList MarkerList object
	 */
	function MarkerManager(markerList) {
	    this._dmp = new DiffMatchPatch();
	    this.markerList = markerList;
	    this.oldTextContent = null;
	}

	/**
	 * resetContent
	 * Reset content
	 * @param {string} content reset base content
	 */
	MarkerManager.prototype.resetContent = function(content) {
	    this.oldTextContent = (util.isString(content) ? content : null);
	};

	/**
	 * uppdateMarkersByContent
	 * Get updated markers by updated content
	 * @param {string} newContent updated content
	 * @returns {object} updated markers
	 */
	MarkerManager.prototype.updateMarkersByContent = function(newContent) {
	    var markerDiffs;

	    if (util.isNull(this.oldTextContent)) {
	        this.resetContent(newContent);

	        return [];
	    }

	    markerDiffs = this._makeMarkerDiffs(newContent);

	    this.oldTextContent = newContent;

	    return this._getUpdateMarkersWithDiffs(markerDiffs);
	};

	/**
	 * _makeMarkerDiffs
	 * Make diffs of marker by updated content
	 * @param {string} newContent updated content
	 * @returns {object} marker diffs
	 */
	MarkerManager.prototype._makeMarkerDiffs = function(newContent) {
	    var markerList = this.markerList,
	        self = this,
	        markerDiffs = {};

	    this._forEachChanges(newContent, function(changedStart, changedEnd, diffLen) {
	        markerList.forEachByRangeAffected(changedStart, changedEnd, function(marker) {
	            var markerDiff = markerDiffs[marker.id],
	                startDiff, endDiff;

	            startDiff = self._calculateStartDiff(changedStart, changedEnd, diffLen, marker);
	            endDiff = self._calculateEndDiff(changedStart, changedEnd, diffLen, marker);

	            if (markerDiff) {
	                markerDiff.start += startDiff;
	                markerDiff.end += endDiff;
	            } else {
	                markerDiffs[marker.id] = {
	                    start: startDiff,
	                    end: endDiff
	                };
	            }
	        });
	    });

	    return markerDiffs;
	};

	/**
	 * _forEachChanges
	 * Iterate each change of updated content
	 * @param {string} newContent updated content
	 * @param {function} iteratee iteratee
	 */
	MarkerManager.prototype._forEachChanges = function(newContent, iteratee) {
	    var changedStart = 0,
	        changedEnd = 0,
	        changes = this._dmp.diff_main(this.oldTextContent, newContent);

	    changes.forEach(function(change) {
	        var type = change[0],
	            text = change[1],
	            diffLen = 0;

	        var changedLen = text.length;

	        //이전 변경점 end를 이번 변경점 start로 만들어 위치를 조정한다.
	        changedStart = changedEnd;

	        if (type === CHANGE_NOTHING) {
	            changedStart += changedLen;
	            changedEnd += changedLen;

	            return;
	        }

	        if (type === CHANGE_ADD) {
	            diffLen += changedLen; //더해진경우는 End값이 변경될 필요가없다 변경전의 위치는 start와 end가 collapse일수밖에 없다.. 일반적인 컨트롤상황에서는
	        } else if (type === CHANGE_MINUS) {
	            diffLen -= changedLen;
	            changedEnd += changedLen; //빠지면 빠지기전까지의 범위가 end가 되어야한다.
	        }

	        iteratee(changedStart, changedEnd, diffLen);
	    });
	};

	/**
	 * _calculateStartDiff
	 * Calculate start diff
	 * @param {number} start change start offset
	 * @param {number} end change end offset
	 * @param {number} diff diff count of change
	 * @param {object} marker marker to calculate diff
	 * @returns {number} start diff of marker
	 */
	MarkerManager.prototype._calculateStartDiff = function(start, end, diff, marker) {
	    var startDiff;

	    // ~AB~[CDE]F
	    if (start <= marker.start && end <= marker.start) {
	        startDiff = diff;
	    // A~B[C~DE]F
	    } else if (start <= marker.start && end > marker.start) {
	        startDiff = start - marker.start;
	    } else {
	        startDiff = 0;
	    }

	    return startDiff;
	};

	/**
	 * _calculateEndDiff
	 * Calculate end diff
	 * @param {number} start change start offset
	 * @param {number} end change end offset
	 * @param {number} diff diff count of change
	 * @param {object} marker marker to calculate diff
	 * @returns {number} end diff of marker
	 */
	MarkerManager.prototype._calculateEndDiff = function(start, end, diff, marker) {
	    var endDiff;

	    // ~AB[CDE~]F
	    if (end <= marker.end) {
	        endDiff = diff;
	    // AB[CD~E]~F
	    } else if (start <= marker.end && end > marker.start) {
	        endDiff = start - marker.end;
	    } else {
	        endDiff = 0;
	    }

	    return endDiff;
	};

	/**
	 * _getUpdateMarkersWithDiffs
	 * Get updated markers with diffs
	 * @param {object} markerDiffs marker diff object that contains diff info of specific marker
	 * @returns {Array.<object>} updated markers
	 */
	MarkerManager.prototype._getUpdateMarkersWithDiffs = function(markerDiffs) {
	    var updatedMarkers = [],
	        markerList = this.markerList;

	    util.forEachOwnProperties(markerDiffs, function(markerDiff, id) {
	        var marker = markerList.getMarker(id);

	        markerList.updateMarker(id, {
	            start: marker.start += markerDiff.start,
	            end: marker.end += markerDiff.end
	        });

	        updatedMarkers.push(marker);
	    });

	    return updatedMarkers;
	};

	module.exports = MarkerManager;


/***/ },
/* 17 */
/***/ function(module, exports) {

	/*eslint-disable */
	/**
	 * Diff Match and Patch
	 *
	 * Copyright 2006 Google Inc.
	 * http://code.google.com/p/google-diff-match-patch/
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *   http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * @fileoverview Computes the difference between two texts to create a patch.
	 * Applies the patch onto another text, allowing for errors.
	 * @author fraser@google.com (Neil Fraser)
	 */

	/**
	 * Class containing the diff, match and patch methods.
	 * @constructor
	 */
	function diff_match_patch() {

	  // Defaults.
	  // Redefine these in your program to override the defaults.

	  // Number of seconds to map a diff before giving up (0 for infinity).
	  this.Diff_Timeout = 1.0;
	  // Cost of an empty edit operation in terms of edit characters.
	  this.Diff_EditCost = 4;
	  // At what point is no match declared (0.0 = perfection, 1.0 = very loose).
	  this.Match_Threshold = 0.5;
	  // How far to search for a match (0 = exact location, 1000+ = broad match).
	  // A match this many characters away from the expected location will add
	  // 1.0 to the score (0.0 is a perfect match).
	  this.Match_Distance = 1000;
	  // When deleting a large block of text (over ~64 characters), how close do
	  // the contents have to be to match the expected contents. (0.0 = perfection,
	  // 1.0 = very loose).  Note that Match_Threshold controls how closely the
	  // end points of a delete need to match.
	  this.Patch_DeleteThreshold = 0.5;
	  // Chunk size for context length.
	  this.Patch_Margin = 4;

	  // The number of bits in an int.
	  this.Match_MaxBits = 32;
	}


	//  DIFF FUNCTIONS


	/**
	 * The data structure representing a diff is an array of tuples:
	 * [[DIFF_DELETE, 'Hello'], [DIFF_INSERT, 'Goodbye'], [DIFF_EQUAL, ' world.']]
	 * which means: delete 'Hello', add 'Goodbye' and keep ' world.'
	 */
	var DIFF_DELETE = -1;
	var DIFF_INSERT = 1;
	var DIFF_EQUAL = 0;

	/** @typedef {{0: number, 1: string}} */
	diff_match_patch.Diff;


	/**
	 * Find the differences between two texts.  Simplifies the problem by stripping
	 * any common prefix or suffix off the texts before diffing.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {boolean=} opt_checklines Optional speedup flag. If present and false,
	 *     then don't run a line-level diff first to identify the changed areas.
	 *     Defaults to true, which does a faster, slightly less optimal diff.
	 * @param {number} opt_deadline Optional time when the diff should be complete
	 *     by.  Used internally for recursive calls.  Users should set DiffTimeout
	 *     instead.
	 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
	 */
	diff_match_patch.prototype.diff_main = function(text1, text2, opt_checklines,
	    opt_deadline) {
	  // Set a deadline by which time the diff must be complete.
	  if (typeof opt_deadline == 'undefined') {
	    if (this.Diff_Timeout <= 0) {
	      opt_deadline = Number.MAX_VALUE;
	    } else {
	      opt_deadline = (new Date).getTime() + this.Diff_Timeout * 1000;
	    }
	  }
	  var deadline = opt_deadline;

	  // Check for null inputs.
	  if (text1 == null || text2 == null) {
	    throw new Error('Null input. (diff_main)');
	  }

	  // Check for equality (speedup).
	  if (text1 == text2) {
	    if (text1) {
	      return [[DIFF_EQUAL, text1]];
	    }
	    return [];
	  }

	  if (typeof opt_checklines == 'undefined') {
	    opt_checklines = true;
	  }
	  var checklines = opt_checklines;

	  // Trim off common prefix (speedup).
	  var commonlength = this.diff_commonPrefix(text1, text2);
	  var commonprefix = text1.substring(0, commonlength);
	  text1 = text1.substring(commonlength);
	  text2 = text2.substring(commonlength);

	  // Trim off common suffix (speedup).
	  commonlength = this.diff_commonSuffix(text1, text2);
	  var commonsuffix = text1.substring(text1.length - commonlength);
	  text1 = text1.substring(0, text1.length - commonlength);
	  text2 = text2.substring(0, text2.length - commonlength);

	  // Compute the diff on the middle block.
	  var diffs = this.diff_compute_(text1, text2, checklines, deadline);

	  // Restore the prefix and suffix.
	  if (commonprefix) {
	    diffs.unshift([DIFF_EQUAL, commonprefix]);
	  }
	  if (commonsuffix) {
	    diffs.push([DIFF_EQUAL, commonsuffix]);
	  }
	  this.diff_cleanupMerge(diffs);
	  return diffs;
	};


	/**
	 * Find the differences between two texts.  Assumes that the texts do not
	 * have any common prefix or suffix.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {boolean} checklines Speedup flag.  If false, then don't run a
	 *     line-level diff first to identify the changed areas.
	 *     If true, then run a faster, slightly less optimal diff.
	 * @param {number} deadline Time when the diff should be complete by.
	 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
	 * @private
	 */
	diff_match_patch.prototype.diff_compute_ = function(text1, text2, checklines,
	    deadline) {
	  var diffs;

	  if (!text1) {
	    // Just add some text (speedup).
	    return [[DIFF_INSERT, text2]];
	  }

	  if (!text2) {
	    // Just delete some text (speedup).
	    return [[DIFF_DELETE, text1]];
	  }

	  var longtext = text1.length > text2.length ? text1 : text2;
	  var shorttext = text1.length > text2.length ? text2 : text1;
	  var i = longtext.indexOf(shorttext);
	  if (i != -1) {
	    // Shorter text is inside the longer text (speedup).
	    diffs = [[DIFF_INSERT, longtext.substring(0, i)],
	             [DIFF_EQUAL, shorttext],
	             [DIFF_INSERT, longtext.substring(i + shorttext.length)]];
	    // Swap insertions for deletions if diff is reversed.
	    if (text1.length > text2.length) {
	      diffs[0][0] = diffs[2][0] = DIFF_DELETE;
	    }
	    return diffs;
	  }

	  if (shorttext.length == 1) {
	    // Single character string.
	    // After the previous speedup, the character can't be an equality.
	    return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
	  }

	  // Check to see if the problem can be split in two.
	  var hm = this.diff_halfMatch_(text1, text2);
	  if (hm) {
	    // A half-match was found, sort out the return data.
	    var text1_a = hm[0];
	    var text1_b = hm[1];
	    var text2_a = hm[2];
	    var text2_b = hm[3];
	    var mid_common = hm[4];
	    // Send both pairs off for separate processing.
	    var diffs_a = this.diff_main(text1_a, text2_a, checklines, deadline);
	    var diffs_b = this.diff_main(text1_b, text2_b, checklines, deadline);
	    // Merge the results.
	    return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
	  }

	  if (checklines && text1.length > 100 && text2.length > 100) {
	    return this.diff_lineMode_(text1, text2, deadline);
	  }

	  return this.diff_bisect_(text1, text2, deadline);
	};


	/**
	 * Do a quick line-level diff on both strings, then rediff the parts for
	 * greater accuracy.
	 * This speedup can produce non-minimal diffs.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {number} deadline Time when the diff should be complete by.
	 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
	 * @private
	 */
	diff_match_patch.prototype.diff_lineMode_ = function(text1, text2, deadline) {
	  // Scan the text on a line-by-line basis first.
	  var a = this.diff_linesToChars_(text1, text2);
	  text1 = a.chars1;
	  text2 = a.chars2;
	  var linearray = a.lineArray;

	  var diffs = this.diff_main(text1, text2, false, deadline);

	  // Convert the diff back to original text.
	  this.diff_charsToLines_(diffs, linearray);
	  // Eliminate freak matches (e.g. blank lines)
	  this.diff_cleanupSemantic(diffs);

	  // Rediff any replacement blocks, this time character-by-character.
	  // Add a dummy entry at the end.
	  diffs.push([DIFF_EQUAL, '']);
	  var pointer = 0;
	  var count_delete = 0;
	  var count_insert = 0;
	  var text_delete = '';
	  var text_insert = '';
	  while (pointer < diffs.length) {
	    switch (diffs[pointer][0]) {
	      case DIFF_INSERT:
	        count_insert++;
	        text_insert += diffs[pointer][1];
	        break;
	      case DIFF_DELETE:
	        count_delete++;
	        text_delete += diffs[pointer][1];
	        break;
	      case DIFF_EQUAL:
	        // Upon reaching an equality, check for prior redundancies.
	        if (count_delete >= 1 && count_insert >= 1) {
	          // Delete the offending records and add the merged ones.
	          diffs.splice(pointer - count_delete - count_insert,
	                       count_delete + count_insert);
	          pointer = pointer - count_delete - count_insert;
	          var a = this.diff_main(text_delete, text_insert, false, deadline);
	          for (var j = a.length - 1; j >= 0; j--) {
	            diffs.splice(pointer, 0, a[j]);
	          }
	          pointer = pointer + a.length;
	        }
	        count_insert = 0;
	        count_delete = 0;
	        text_delete = '';
	        text_insert = '';
	        break;
	    }
	    pointer++;
	  }
	  diffs.pop();  // Remove the dummy entry at the end.

	  return diffs;
	};


	/**
	 * Find the 'middle snake' of a diff, split the problem in two
	 * and return the recursively constructed diff.
	 * See Myers 1986 paper: An O(ND) Difference Algorithm and Its Variations.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {number} deadline Time at which to bail if not yet complete.
	 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
	 * @private
	 */
	diff_match_patch.prototype.diff_bisect_ = function(text1, text2, deadline) {
	  // Cache the text lengths to prevent multiple calls.
	  var text1_length = text1.length;
	  var text2_length = text2.length;
	  var max_d = Math.ceil((text1_length + text2_length) / 2);
	  var v_offset = max_d;
	  var v_length = 2 * max_d;
	  var v1 = new Array(v_length);
	  var v2 = new Array(v_length);
	  // Setting all elements to -1 is faster in Chrome & Firefox than mixing
	  // integers and undefined.
	  for (var x = 0; x < v_length; x++) {
	    v1[x] = -1;
	    v2[x] = -1;
	  }
	  v1[v_offset + 1] = 0;
	  v2[v_offset + 1] = 0;
	  var delta = text1_length - text2_length;
	  // If the total number of characters is odd, then the front path will collide
	  // with the reverse path.
	  var front = (delta % 2 != 0);
	  // Offsets for start and end of k loop.
	  // Prevents mapping of space beyond the grid.
	  var k1start = 0;
	  var k1end = 0;
	  var k2start = 0;
	  var k2end = 0;
	  for (var d = 0; d < max_d; d++) {
	    // Bail out if deadline is reached.
	    if ((new Date()).getTime() > deadline) {
	      break;
	    }

	    // Walk the front path one step.
	    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
	      var k1_offset = v_offset + k1;
	      var x1;
	      if (k1 == -d || (k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1])) {
	        x1 = v1[k1_offset + 1];
	      } else {
	        x1 = v1[k1_offset - 1] + 1;
	      }
	      var y1 = x1 - k1;
	      while (x1 < text1_length && y1 < text2_length &&
	             text1.charAt(x1) == text2.charAt(y1)) {
	        x1++;
	        y1++;
	      }
	      v1[k1_offset] = x1;
	      if (x1 > text1_length) {
	        // Ran off the right of the graph.
	        k1end += 2;
	      } else if (y1 > text2_length) {
	        // Ran off the bottom of the graph.
	        k1start += 2;
	      } else if (front) {
	        var k2_offset = v_offset + delta - k1;
	        if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] != -1) {
	          // Mirror x2 onto top-left coordinate system.
	          var x2 = text1_length - v2[k2_offset];
	          if (x1 >= x2) {
	            // Overlap detected.
	            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
	          }
	        }
	      }
	    }

	    // Walk the reverse path one step.
	    for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
	      var k2_offset = v_offset + k2;
	      var x2;
	      if (k2 == -d || (k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1])) {
	        x2 = v2[k2_offset + 1];
	      } else {
	        x2 = v2[k2_offset - 1] + 1;
	      }
	      var y2 = x2 - k2;
	      while (x2 < text1_length && y2 < text2_length &&
	             text1.charAt(text1_length - x2 - 1) ==
	             text2.charAt(text2_length - y2 - 1)) {
	        x2++;
	        y2++;
	      }
	      v2[k2_offset] = x2;
	      if (x2 > text1_length) {
	        // Ran off the left of the graph.
	        k2end += 2;
	      } else if (y2 > text2_length) {
	        // Ran off the top of the graph.
	        k2start += 2;
	      } else if (!front) {
	        var k1_offset = v_offset + delta - k2;
	        if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] != -1) {
	          var x1 = v1[k1_offset];
	          var y1 = v_offset + x1 - k1_offset;
	          // Mirror x2 onto top-left coordinate system.
	          x2 = text1_length - x2;
	          if (x1 >= x2) {
	            // Overlap detected.
	            return this.diff_bisectSplit_(text1, text2, x1, y1, deadline);
	          }
	        }
	      }
	    }
	  }
	  // Diff took too long and hit the deadline or
	  // number of diffs equals number of characters, no commonality at all.
	  return [[DIFF_DELETE, text1], [DIFF_INSERT, text2]];
	};


	/**
	 * Given the location of the 'middle snake', split the diff in two parts
	 * and recurse.
	 * @param {string} text1 Old string to be diffed.
	 * @param {string} text2 New string to be diffed.
	 * @param {number} x Index of split point in text1.
	 * @param {number} y Index of split point in text2.
	 * @param {number} deadline Time at which to bail if not yet complete.
	 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
	 * @private
	 */
	diff_match_patch.prototype.diff_bisectSplit_ = function(text1, text2, x, y,
	    deadline) {
	  var text1a = text1.substring(0, x);
	  var text2a = text2.substring(0, y);
	  var text1b = text1.substring(x);
	  var text2b = text2.substring(y);

	  // Compute both diffs serially.
	  var diffs = this.diff_main(text1a, text2a, false, deadline);
	  var diffsb = this.diff_main(text1b, text2b, false, deadline);

	  return diffs.concat(diffsb);
	};


	/**
	 * Split two texts into an array of strings.  Reduce the texts to a string of
	 * hashes where each Unicode character represents one line.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {{chars1: string, chars2: string, lineArray: !Array.<string>}}
	 *     An object containing the encoded text1, the encoded text2 and
	 *     the array of unique strings.
	 *     The zeroth element of the array of unique strings is intentionally blank.
	 * @private
	 */
	diff_match_patch.prototype.diff_linesToChars_ = function(text1, text2) {
	  var lineArray = [];  // e.g. lineArray[4] == 'Hello\n'
	  var lineHash = {};   // e.g. lineHash['Hello\n'] == 4

	  // '\x00' is a valid character, but various debuggers don't like it.
	  // So we'll insert a junk entry to avoid generating a null character.
	  lineArray[0] = '';

	  /**
	   * Split a text into an array of strings.  Reduce the texts to a string of
	   * hashes where each Unicode character represents one line.
	   * Modifies linearray and linehash through being a closure.
	   * @param {string} text String to encode.
	   * @return {string} Encoded string.
	   * @private
	   */
	  function diff_linesToCharsMunge_(text) {
	    var chars = '';
	    // Walk the text, pulling out a substring for each line.
	    // text.split('\n') would would temporarily double our memory footprint.
	    // Modifying text would create many large strings to garbage collect.
	    var lineStart = 0;
	    var lineEnd = -1;
	    // Keeping our own length variable is faster than looking it up.
	    var lineArrayLength = lineArray.length;
	    while (lineEnd < text.length - 1) {
	      lineEnd = text.indexOf('\n', lineStart);
	      if (lineEnd == -1) {
	        lineEnd = text.length - 1;
	      }
	      var line = text.substring(lineStart, lineEnd + 1);
	      lineStart = lineEnd + 1;

	      if (lineHash.hasOwnProperty ? lineHash.hasOwnProperty(line) :
	          (lineHash[line] !== undefined)) {
	        chars += String.fromCharCode(lineHash[line]);
	      } else {
	        chars += String.fromCharCode(lineArrayLength);
	        lineHash[line] = lineArrayLength;
	        lineArray[lineArrayLength++] = line;
	      }
	    }
	    return chars;
	  }

	  var chars1 = diff_linesToCharsMunge_(text1);
	  var chars2 = diff_linesToCharsMunge_(text2);
	  return {chars1: chars1, chars2: chars2, lineArray: lineArray};
	};


	/**
	 * Rehydrate the text in a diff from a string of line hashes to real lines of
	 * text.
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 * @param {!Array.<string>} lineArray Array of unique strings.
	 * @private
	 */
	diff_match_patch.prototype.diff_charsToLines_ = function(diffs, lineArray) {
	  for (var x = 0; x < diffs.length; x++) {
	    var chars = diffs[x][1];
	    var text = [];
	    for (var y = 0; y < chars.length; y++) {
	      text[y] = lineArray[chars.charCodeAt(y)];
	    }
	    diffs[x][1] = text.join('');
	  }
	};


	/**
	 * Determine the common prefix of two strings.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {number} The number of characters common to the start of each
	 *     string.
	 */
	diff_match_patch.prototype.diff_commonPrefix = function(text1, text2) {
	  // Quick check for common null cases.
	  if (!text1 || !text2 || text1.charAt(0) != text2.charAt(0)) {
	    return 0;
	  }
	  // Binary search.
	  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
	  var pointermin = 0;
	  var pointermax = Math.min(text1.length, text2.length);
	  var pointermid = pointermax;
	  var pointerstart = 0;
	  while (pointermin < pointermid) {
	    if (text1.substring(pointerstart, pointermid) ==
	        text2.substring(pointerstart, pointermid)) {
	      pointermin = pointermid;
	      pointerstart = pointermin;
	    } else {
	      pointermax = pointermid;
	    }
	    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
	  }
	  return pointermid;
	};


	/**
	 * Determine the common suffix of two strings.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {number} The number of characters common to the end of each string.
	 */
	diff_match_patch.prototype.diff_commonSuffix = function(text1, text2) {
	  // Quick check for common null cases.
	  if (!text1 || !text2 ||
	      text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
	    return 0;
	  }
	  // Binary search.
	  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
	  var pointermin = 0;
	  var pointermax = Math.min(text1.length, text2.length);
	  var pointermid = pointermax;
	  var pointerend = 0;
	  while (pointermin < pointermid) {
	    if (text1.substring(text1.length - pointermid, text1.length - pointerend) ==
	        text2.substring(text2.length - pointermid, text2.length - pointerend)) {
	      pointermin = pointermid;
	      pointerend = pointermin;
	    } else {
	      pointermax = pointermid;
	    }
	    pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
	  }
	  return pointermid;
	};


	/**
	 * Determine if the suffix of one string is the prefix of another.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {number} The number of characters common to the end of the first
	 *     string and the start of the second string.
	 * @private
	 */
	diff_match_patch.prototype.diff_commonOverlap_ = function(text1, text2) {
	  // Cache the text lengths to prevent multiple calls.
	  var text1_length = text1.length;
	  var text2_length = text2.length;
	  // Eliminate the null case.
	  if (text1_length == 0 || text2_length == 0) {
	    return 0;
	  }
	  // Truncate the longer string.
	  if (text1_length > text2_length) {
	    text1 = text1.substring(text1_length - text2_length);
	  } else if (text1_length < text2_length) {
	    text2 = text2.substring(0, text1_length);
	  }
	  var text_length = Math.min(text1_length, text2_length);
	  // Quick check for the worst case.
	  if (text1 == text2) {
	    return text_length;
	  }

	  // Start by looking for a single character match
	  // and increase length until no match is found.
	  // Performance analysis: http://neil.fraser.name/news/2010/11/04/
	  var best = 0;
	  var length = 1;
	  while (true) {
	    var pattern = text1.substring(text_length - length);
	    var found = text2.indexOf(pattern);
	    if (found == -1) {
	      return best;
	    }
	    length += found;
	    if (found == 0 || text1.substring(text_length - length) ==
	        text2.substring(0, length)) {
	      best = length;
	      length++;
	    }
	  }
	};


	/**
	 * Do the two texts share a substring which is at least half the length of the
	 * longer text?
	 * This speedup can produce non-minimal diffs.
	 * @param {string} text1 First string.
	 * @param {string} text2 Second string.
	 * @return {Array.<string>} Five element Array, containing the prefix of
	 *     text1, the suffix of text1, the prefix of text2, the suffix of
	 *     text2 and the common middle.  Or null if there was no match.
	 * @private
	 */
	diff_match_patch.prototype.diff_halfMatch_ = function(text1, text2) {
	  if (this.Diff_Timeout <= 0) {
	    // Don't risk returning a non-optimal diff if we have unlimited time.
	    return null;
	  }
	  var longtext = text1.length > text2.length ? text1 : text2;
	  var shorttext = text1.length > text2.length ? text2 : text1;
	  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
	    return null;  // Pointless.
	  }
	  var dmp = this;  // 'this' becomes 'window' in a closure.

	  /**
	   * Does a substring of shorttext exist within longtext such that the substring
	   * is at least half the length of longtext?
	   * Closure, but does not reference any external variables.
	   * @param {string} longtext Longer string.
	   * @param {string} shorttext Shorter string.
	   * @param {number} i Start index of quarter length substring within longtext.
	   * @return {Array.<string>} Five element Array, containing the prefix of
	   *     longtext, the suffix of longtext, the prefix of shorttext, the suffix
	   *     of shorttext and the common middle.  Or null if there was no match.
	   * @private
	   */
	  function diff_halfMatchI_(longtext, shorttext, i) {
	    // Start with a 1/4 length substring at position i as a seed.
	    var seed = longtext.substring(i, i + Math.floor(longtext.length / 4));
	    var j = -1;
	    var best_common = '';
	    var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
	    while ((j = shorttext.indexOf(seed, j + 1)) != -1) {
	      var prefixLength = dmp.diff_commonPrefix(longtext.substring(i),
	                                               shorttext.substring(j));
	      var suffixLength = dmp.diff_commonSuffix(longtext.substring(0, i),
	                                               shorttext.substring(0, j));
	      if (best_common.length < suffixLength + prefixLength) {
	        best_common = shorttext.substring(j - suffixLength, j) +
	            shorttext.substring(j, j + prefixLength);
	        best_longtext_a = longtext.substring(0, i - suffixLength);
	        best_longtext_b = longtext.substring(i + prefixLength);
	        best_shorttext_a = shorttext.substring(0, j - suffixLength);
	        best_shorttext_b = shorttext.substring(j + prefixLength);
	      }
	    }
	    if (best_common.length * 2 >= longtext.length) {
	      return [best_longtext_a, best_longtext_b,
	              best_shorttext_a, best_shorttext_b, best_common];
	    } else {
	      return null;
	    }
	  }

	  // First check if the second quarter is the seed for a half-match.
	  var hm1 = diff_halfMatchI_(longtext, shorttext,
	                             Math.ceil(longtext.length / 4));
	  // Check again based on the third quarter.
	  var hm2 = diff_halfMatchI_(longtext, shorttext,
	                             Math.ceil(longtext.length / 2));
	  var hm;
	  if (!hm1 && !hm2) {
	    return null;
	  } else if (!hm2) {
	    hm = hm1;
	  } else if (!hm1) {
	    hm = hm2;
	  } else {
	    // Both matched.  Select the longest.
	    hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
	  }

	  // A half-match was found, sort out the return data.
	  var text1_a, text1_b, text2_a, text2_b;
	  if (text1.length > text2.length) {
	    text1_a = hm[0];
	    text1_b = hm[1];
	    text2_a = hm[2];
	    text2_b = hm[3];
	  } else {
	    text2_a = hm[0];
	    text2_b = hm[1];
	    text1_a = hm[2];
	    text1_b = hm[3];
	  }
	  var mid_common = hm[4];
	  return [text1_a, text1_b, text2_a, text2_b, mid_common];
	};


	/**
	 * Reduce the number of edits by eliminating semantically trivial equalities.
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 */
	diff_match_patch.prototype.diff_cleanupSemantic = function(diffs) {
	  var changes = false;
	  var equalities = [];  // Stack of indices where equalities are found.
	  var equalitiesLength = 0;  // Keeping our own length var is faster in JS.
	  /** @type {?string} */
	  var lastequality = null;
	  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
	  var pointer = 0;  // Index of current position.
	  // Number of characters that changed prior to the equality.
	  var length_insertions1 = 0;
	  var length_deletions1 = 0;
	  // Number of characters that changed after the equality.
	  var length_insertions2 = 0;
	  var length_deletions2 = 0;
	  while (pointer < diffs.length) {
	    if (diffs[pointer][0] == DIFF_EQUAL) {  // Equality found.
	      equalities[equalitiesLength++] = pointer;
	      length_insertions1 = length_insertions2;
	      length_deletions1 = length_deletions2;
	      length_insertions2 = 0;
	      length_deletions2 = 0;
	      lastequality = diffs[pointer][1];
	    } else {  // An insertion or deletion.
	      if (diffs[pointer][0] == DIFF_INSERT) {
	        length_insertions2 += diffs[pointer][1].length;
	      } else {
	        length_deletions2 += diffs[pointer][1].length;
	      }
	      // Eliminate an equality that is smaller or equal to the edits on both
	      // sides of it.
	      if (lastequality && (lastequality.length <=
	          Math.max(length_insertions1, length_deletions1)) &&
	          (lastequality.length <= Math.max(length_insertions2,
	                                           length_deletions2))) {
	        // Duplicate record.
	        diffs.splice(equalities[equalitiesLength - 1], 0,
	                     [DIFF_DELETE, lastequality]);
	        // Change second copy to insert.
	        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
	        // Throw away the equality we just deleted.
	        equalitiesLength--;
	        // Throw away the previous equality (it needs to be reevaluated).
	        equalitiesLength--;
	        pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
	        length_insertions1 = 0;  // Reset the counters.
	        length_deletions1 = 0;
	        length_insertions2 = 0;
	        length_deletions2 = 0;
	        lastequality = null;
	        changes = true;
	      }
	    }
	    pointer++;
	  }

	  // Normalize the diff.
	  if (changes) {
	    this.diff_cleanupMerge(diffs);
	  }
	  this.diff_cleanupSemanticLossless(diffs);

	  // Find any overlaps between deletions and insertions.
	  // e.g: <del>abcxxx</del><ins>xxxdef</ins>
	  //   -> <del>abc</del>xxx<ins>def</ins>
	  // e.g: <del>xxxabc</del><ins>defxxx</ins>
	  //   -> <ins>def</ins>xxx<del>abc</del>
	  // Only extract an overlap if it is as big as the edit ahead or behind it.
	  pointer = 1;
	  while (pointer < diffs.length) {
	    if (diffs[pointer - 1][0] == DIFF_DELETE &&
	        diffs[pointer][0] == DIFF_INSERT) {
	      var deletion = diffs[pointer - 1][1];
	      var insertion = diffs[pointer][1];
	      var overlap_length1 = this.diff_commonOverlap_(deletion, insertion);
	      var overlap_length2 = this.diff_commonOverlap_(insertion, deletion);
	      if (overlap_length1 >= overlap_length2) {
	        if (overlap_length1 >= deletion.length / 2 ||
	            overlap_length1 >= insertion.length / 2) {
	          // Overlap found.  Insert an equality and trim the surrounding edits.
	          diffs.splice(pointer, 0,
	              [DIFF_EQUAL, insertion.substring(0, overlap_length1)]);
	          diffs[pointer - 1][1] =
	              deletion.substring(0, deletion.length - overlap_length1);
	          diffs[pointer + 1][1] = insertion.substring(overlap_length1);
	          pointer++;
	        }
	      } else {
	        if (overlap_length2 >= deletion.length / 2 ||
	            overlap_length2 >= insertion.length / 2) {
	          // Reverse overlap found.
	          // Insert an equality and swap and trim the surrounding edits.
	          diffs.splice(pointer, 0,
	              [DIFF_EQUAL, deletion.substring(0, overlap_length2)]);
	          diffs[pointer - 1][0] = DIFF_INSERT;
	          diffs[pointer - 1][1] =
	              insertion.substring(0, insertion.length - overlap_length2);
	          diffs[pointer + 1][0] = DIFF_DELETE;
	          diffs[pointer + 1][1] =
	              deletion.substring(overlap_length2);
	          pointer++;
	        }
	      }
	      pointer++;
	    }
	    pointer++;
	  }
	};


	/**
	 * Look for single edits surrounded on both sides by equalities
	 * which can be shifted sideways to align the edit to a word boundary.
	 * e.g: The c<ins>at c</ins>ame. -> The <ins>cat </ins>came.
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 */
	diff_match_patch.prototype.diff_cleanupSemanticLossless = function(diffs) {
	  /**
	   * Given two strings, compute a score representing whether the internal
	   * boundary falls on logical boundaries.
	   * Scores range from 6 (best) to 0 (worst).
	   * Closure, but does not reference any external variables.
	   * @param {string} one First string.
	   * @param {string} two Second string.
	   * @return {number} The score.
	   * @private
	   */
	  function diff_cleanupSemanticScore_(one, two) {
	    if (!one || !two) {
	      // Edges are the best.
	      return 6;
	    }

	    // Each port of this function behaves slightly differently due to
	    // subtle differences in each language's definition of things like
	    // 'whitespace'.  Since this function's purpose is largely cosmetic,
	    // the choice has been made to use each language's native features
	    // rather than force total conformity.
	    var char1 = one.charAt(one.length - 1);
	    var char2 = two.charAt(0);
	    var nonAlphaNumeric1 = char1.match(diff_match_patch.nonAlphaNumericRegex_);
	    var nonAlphaNumeric2 = char2.match(diff_match_patch.nonAlphaNumericRegex_);
	    var whitespace1 = nonAlphaNumeric1 &&
	        char1.match(diff_match_patch.whitespaceRegex_);
	    var whitespace2 = nonAlphaNumeric2 &&
	        char2.match(diff_match_patch.whitespaceRegex_);
	    var lineBreak1 = whitespace1 &&
	        char1.match(diff_match_patch.linebreakRegex_);
	    var lineBreak2 = whitespace2 &&
	        char2.match(diff_match_patch.linebreakRegex_);
	    var blankLine1 = lineBreak1 &&
	        one.match(diff_match_patch.blanklineEndRegex_);
	    var blankLine2 = lineBreak2 &&
	        two.match(diff_match_patch.blanklineStartRegex_);

	    if (blankLine1 || blankLine2) {
	      // Five points for blank lines.
	      return 5;
	    } else if (lineBreak1 || lineBreak2) {
	      // Four points for line breaks.
	      return 4;
	    } else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
	      // Three points for end of sentences.
	      return 3;
	    } else if (whitespace1 || whitespace2) {
	      // Two points for whitespace.
	      return 2;
	    } else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
	      // One point for non-alphanumeric.
	      return 1;
	    }
	    return 0;
	  }

	  var pointer = 1;
	  // Intentionally ignore the first and last element (don't need checking).
	  while (pointer < diffs.length - 1) {
	    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
	        diffs[pointer + 1][0] == DIFF_EQUAL) {
	      // This is a single edit surrounded by equalities.
	      var equality1 = diffs[pointer - 1][1];
	      var edit = diffs[pointer][1];
	      var equality2 = diffs[pointer + 1][1];

	      // First, shift the edit as far left as possible.
	      var commonOffset = this.diff_commonSuffix(equality1, edit);
	      if (commonOffset) {
	        var commonString = edit.substring(edit.length - commonOffset);
	        equality1 = equality1.substring(0, equality1.length - commonOffset);
	        edit = commonString + edit.substring(0, edit.length - commonOffset);
	        equality2 = commonString + equality2;
	      }

	      // Second, step character by character right, looking for the best fit.
	      var bestEquality1 = equality1;
	      var bestEdit = edit;
	      var bestEquality2 = equality2;
	      var bestScore = diff_cleanupSemanticScore_(equality1, edit) +
	          diff_cleanupSemanticScore_(edit, equality2);
	      while (edit.charAt(0) === equality2.charAt(0)) {
	        equality1 += edit.charAt(0);
	        edit = edit.substring(1) + equality2.charAt(0);
	        equality2 = equality2.substring(1);
	        var score = diff_cleanupSemanticScore_(equality1, edit) +
	            diff_cleanupSemanticScore_(edit, equality2);
	        // The >= encourages trailing rather than leading whitespace on edits.
	        if (score >= bestScore) {
	          bestScore = score;
	          bestEquality1 = equality1;
	          bestEdit = edit;
	          bestEquality2 = equality2;
	        }
	      }

	      if (diffs[pointer - 1][1] != bestEquality1) {
	        // We have an improvement, save it back to the diff.
	        if (bestEquality1) {
	          diffs[pointer - 1][1] = bestEquality1;
	        } else {
	          diffs.splice(pointer - 1, 1);
	          pointer--;
	        }
	        diffs[pointer][1] = bestEdit;
	        if (bestEquality2) {
	          diffs[pointer + 1][1] = bestEquality2;
	        } else {
	          diffs.splice(pointer + 1, 1);
	          pointer--;
	        }
	      }
	    }
	    pointer++;
	  }
	};

	// Define some regex patterns for matching boundaries.
	diff_match_patch.nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
	diff_match_patch.whitespaceRegex_ = /\s/;
	diff_match_patch.linebreakRegex_ = /[\r\n]/;
	diff_match_patch.blanklineEndRegex_ = /\n\r?\n$/;
	diff_match_patch.blanklineStartRegex_ = /^\r?\n\r?\n/;

	/**
	 * Reduce the number of edits by eliminating operationally trivial equalities.
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 */
	diff_match_patch.prototype.diff_cleanupEfficiency = function(diffs) {
	  var changes = false;
	  var equalities = [];  // Stack of indices where equalities are found.
	  var equalitiesLength = 0;  // Keeping our own length var is faster in JS.
	  /** @type {?string} */
	  var lastequality = null;
	  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
	  var pointer = 0;  // Index of current position.
	  // Is there an insertion operation before the last equality.
	  var pre_ins = false;
	  // Is there a deletion operation before the last equality.
	  var pre_del = false;
	  // Is there an insertion operation after the last equality.
	  var post_ins = false;
	  // Is there a deletion operation after the last equality.
	  var post_del = false;
	  while (pointer < diffs.length) {
	    if (diffs[pointer][0] == DIFF_EQUAL) {  // Equality found.
	      if (diffs[pointer][1].length < this.Diff_EditCost &&
	          (post_ins || post_del)) {
	        // Candidate found.
	        equalities[equalitiesLength++] = pointer;
	        pre_ins = post_ins;
	        pre_del = post_del;
	        lastequality = diffs[pointer][1];
	      } else {
	        // Not a candidate, and can never become one.
	        equalitiesLength = 0;
	        lastequality = null;
	      }
	      post_ins = post_del = false;
	    } else {  // An insertion or deletion.
	      if (diffs[pointer][0] == DIFF_DELETE) {
	        post_del = true;
	      } else {
	        post_ins = true;
	      }
	      /*
	       * Five types to be split:
	       * <ins>A</ins><del>B</del>XY<ins>C</ins><del>D</del>
	       * <ins>A</ins>X<ins>C</ins><del>D</del>
	       * <ins>A</ins><del>B</del>X<ins>C</ins>
	       * <ins>A</del>X<ins>C</ins><del>D</del>
	       * <ins>A</ins><del>B</del>X<del>C</del>
	       */
	      if (lastequality && ((pre_ins && pre_del && post_ins && post_del) ||
	                           ((lastequality.length < this.Diff_EditCost / 2) &&
	                            (pre_ins + pre_del + post_ins + post_del) == 3))) {
	        // Duplicate record.
	        diffs.splice(equalities[equalitiesLength - 1], 0,
	                     [DIFF_DELETE, lastequality]);
	        // Change second copy to insert.
	        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
	        equalitiesLength--;  // Throw away the equality we just deleted;
	        lastequality = null;
	        if (pre_ins && pre_del) {
	          // No changes made which could affect previous entry, keep going.
	          post_ins = post_del = true;
	          equalitiesLength = 0;
	        } else {
	          equalitiesLength--;  // Throw away the previous equality.
	          pointer = equalitiesLength > 0 ?
	              equalities[equalitiesLength - 1] : -1;
	          post_ins = post_del = false;
	        }
	        changes = true;
	      }
	    }
	    pointer++;
	  }

	  if (changes) {
	    this.diff_cleanupMerge(diffs);
	  }
	};


	/**
	 * Reorder and merge like edit sections.  Merge equalities.
	 * Any edit section can move as long as it doesn't cross an equality.
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 */
	diff_match_patch.prototype.diff_cleanupMerge = function(diffs) {
	  diffs.push([DIFF_EQUAL, '']);  // Add a dummy entry at the end.
	  var pointer = 0;
	  var count_delete = 0;
	  var count_insert = 0;
	  var text_delete = '';
	  var text_insert = '';
	  var commonlength;
	  while (pointer < diffs.length) {
	    switch (diffs[pointer][0]) {
	      case DIFF_INSERT:
	        count_insert++;
	        text_insert += diffs[pointer][1];
	        pointer++;
	        break;
	      case DIFF_DELETE:
	        count_delete++;
	        text_delete += diffs[pointer][1];
	        pointer++;
	        break;
	      case DIFF_EQUAL:
	        // Upon reaching an equality, check for prior redundancies.
	        if (count_delete + count_insert > 1) {
	          if (count_delete !== 0 && count_insert !== 0) {
	            // Factor out any common prefixies.
	            commonlength = this.diff_commonPrefix(text_insert, text_delete);
	            if (commonlength !== 0) {
	              if ((pointer - count_delete - count_insert) > 0 &&
	                  diffs[pointer - count_delete - count_insert - 1][0] ==
	                  DIFF_EQUAL) {
	                diffs[pointer - count_delete - count_insert - 1][1] +=
	                    text_insert.substring(0, commonlength);
	              } else {
	                diffs.splice(0, 0, [DIFF_EQUAL,
	                                    text_insert.substring(0, commonlength)]);
	                pointer++;
	              }
	              text_insert = text_insert.substring(commonlength);
	              text_delete = text_delete.substring(commonlength);
	            }
	            // Factor out any common suffixies.
	            commonlength = this.diff_commonSuffix(text_insert, text_delete);
	            if (commonlength !== 0) {
	              diffs[pointer][1] = text_insert.substring(text_insert.length -
	                  commonlength) + diffs[pointer][1];
	              text_insert = text_insert.substring(0, text_insert.length -
	                  commonlength);
	              text_delete = text_delete.substring(0, text_delete.length -
	                  commonlength);
	            }
	          }
	          // Delete the offending records and add the merged ones.
	          if (count_delete === 0) {
	            diffs.splice(pointer - count_insert,
	                count_delete + count_insert, [DIFF_INSERT, text_insert]);
	          } else if (count_insert === 0) {
	            diffs.splice(pointer - count_delete,
	                count_delete + count_insert, [DIFF_DELETE, text_delete]);
	          } else {
	            diffs.splice(pointer - count_delete - count_insert,
	                count_delete + count_insert, [DIFF_DELETE, text_delete],
	                [DIFF_INSERT, text_insert]);
	          }
	          pointer = pointer - count_delete - count_insert +
	                    (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
	        } else if (pointer !== 0 && diffs[pointer - 1][0] == DIFF_EQUAL) {
	          // Merge this equality with the previous one.
	          diffs[pointer - 1][1] += diffs[pointer][1];
	          diffs.splice(pointer, 1);
	        } else {
	          pointer++;
	        }
	        count_insert = 0;
	        count_delete = 0;
	        text_delete = '';
	        text_insert = '';
	        break;
	    }
	  }
	  if (diffs[diffs.length - 1][1] === '') {
	    diffs.pop();  // Remove the dummy entry at the end.
	  }

	  // Second pass: look for single edits surrounded on both sides by equalities
	  // which can be shifted sideways to eliminate an equality.
	  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
	  var changes = false;
	  pointer = 1;
	  // Intentionally ignore the first and last element (don't need checking).
	  while (pointer < diffs.length - 1) {
	    if (diffs[pointer - 1][0] == DIFF_EQUAL &&
	        diffs[pointer + 1][0] == DIFF_EQUAL) {
	      // This is a single edit surrounded by equalities.
	      if (diffs[pointer][1].substring(diffs[pointer][1].length -
	          diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
	        // Shift the edit over the previous equality.
	        diffs[pointer][1] = diffs[pointer - 1][1] +
	            diffs[pointer][1].substring(0, diffs[pointer][1].length -
	                                        diffs[pointer - 1][1].length);
	        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
	        diffs.splice(pointer - 1, 1);
	        changes = true;
	      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) ==
	          diffs[pointer + 1][1]) {
	        // Shift the edit over the next equality.
	        diffs[pointer - 1][1] += diffs[pointer + 1][1];
	        diffs[pointer][1] =
	            diffs[pointer][1].substring(diffs[pointer + 1][1].length) +
	            diffs[pointer + 1][1];
	        diffs.splice(pointer + 1, 1);
	        changes = true;
	      }
	    }
	    pointer++;
	  }
	  // If shifts were made, the diff needs reordering and another shift sweep.
	  if (changes) {
	    this.diff_cleanupMerge(diffs);
	  }
	};


	/**
	 * loc is a location in text1, compute and return the equivalent location in
	 * text2.
	 * e.g. 'The cat' vs 'The big cat', 1->1, 5->8
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 * @param {number} loc Location within text1.
	 * @return {number} Location within text2.
	 */
	diff_match_patch.prototype.diff_xIndex = function(diffs, loc) {
	  var chars1 = 0;
	  var chars2 = 0;
	  var last_chars1 = 0;
	  var last_chars2 = 0;
	  var x;
	  for (x = 0; x < diffs.length; x++) {
	    if (diffs[x][0] !== DIFF_INSERT) {  // Equality or deletion.
	      chars1 += diffs[x][1].length;
	    }
	    if (diffs[x][0] !== DIFF_DELETE) {  // Equality or insertion.
	      chars2 += diffs[x][1].length;
	    }
	    if (chars1 > loc) {  // Overshot the location.
	      break;
	    }
	    last_chars1 = chars1;
	    last_chars2 = chars2;
	  }
	  // Was the location was deleted?
	  if (diffs.length != x && diffs[x][0] === DIFF_DELETE) {
	    return last_chars2;
	  }
	  // Add the remaining character length.
	  return last_chars2 + (loc - last_chars1);
	};


	/**
	 * Convert a diff array into a pretty HTML report.
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 * @return {string} HTML representation.
	 */
	diff_match_patch.prototype.diff_prettyHtml = function(diffs) {
	  var html = [];
	  var pattern_amp = /&/g;
	  var pattern_lt = /</g;
	  var pattern_gt = />/g;
	  var pattern_para = /\n/g;
	  for (var x = 0; x < diffs.length; x++) {
	    var op = diffs[x][0];    // Operation (insert, delete, equal)
	    var data = diffs[x][1];  // Text of change.
	    var text = data.replace(pattern_amp, '&amp;').replace(pattern_lt, '&lt;')
	        .replace(pattern_gt, '&gt;').replace(pattern_para, '&para;<br>');
	    switch (op) {
	      case DIFF_INSERT:
	        html[x] = '<ins style="background:#e6ffe6;">' + text + '</ins>';
	        break;
	      case DIFF_DELETE:
	        html[x] = '<del style="background:#ffe6e6;">' + text + '</del>';
	        break;
	      case DIFF_EQUAL:
	        html[x] = '<span>' + text + '</span>';
	        break;
	    }
	  }
	  return html.join('');
	};


	/**
	 * Compute and return the source text (all equalities and deletions).
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 * @return {string} Source text.
	 */
	diff_match_patch.prototype.diff_text1 = function(diffs) {
	  var text = [];
	  for (var x = 0; x < diffs.length; x++) {
	    if (diffs[x][0] !== DIFF_INSERT) {
	      text[x] = diffs[x][1];
	    }
	  }
	  return text.join('');
	};


	/**
	 * Compute and return the destination text (all equalities and insertions).
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 * @return {string} Destination text.
	 */
	diff_match_patch.prototype.diff_text2 = function(diffs) {
	  var text = [];
	  for (var x = 0; x < diffs.length; x++) {
	    if (diffs[x][0] !== DIFF_DELETE) {
	      text[x] = diffs[x][1];
	    }
	  }
	  return text.join('');
	};


	/**
	 * Compute the Levenshtein distance; the number of inserted, deleted or
	 * substituted characters.
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 * @return {number} Number of changes.
	 */
	diff_match_patch.prototype.diff_levenshtein = function(diffs) {
	  var levenshtein = 0;
	  var insertions = 0;
	  var deletions = 0;
	  for (var x = 0; x < diffs.length; x++) {
	    var op = diffs[x][0];
	    var data = diffs[x][1];
	    switch (op) {
	      case DIFF_INSERT:
	        insertions += data.length;
	        break;
	      case DIFF_DELETE:
	        deletions += data.length;
	        break;
	      case DIFF_EQUAL:
	        // A deletion and an insertion is one substitution.
	        levenshtein += Math.max(insertions, deletions);
	        insertions = 0;
	        deletions = 0;
	        break;
	    }
	  }
	  levenshtein += Math.max(insertions, deletions);
	  return levenshtein;
	};


	/**
	 * Crush the diff into an encoded string which describes the operations
	 * required to transform text1 into text2.
	 * E.g. =3\t-2\t+ing  -> Keep 3 chars, delete 2 chars, insert 'ing'.
	 * Operations are tab-separated.  Inserted text is escaped using %xx notation.
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 * @return {string} Delta text.
	 */
	diff_match_patch.prototype.diff_toDelta = function(diffs) {
	  var text = [];
	  for (var x = 0; x < diffs.length; x++) {
	    switch (diffs[x][0]) {
	      case DIFF_INSERT:
	        text[x] = '+' + encodeURI(diffs[x][1]);
	        break;
	      case DIFF_DELETE:
	        text[x] = '-' + diffs[x][1].length;
	        break;
	      case DIFF_EQUAL:
	        text[x] = '=' + diffs[x][1].length;
	        break;
	    }
	  }
	  return text.join('\t').replace(/%20/g, ' ');
	};


	/**
	 * Given the original text1, and an encoded string which describes the
	 * operations required to transform text1 into text2, compute the full diff.
	 * @param {string} text1 Source string for the diff.
	 * @param {string} delta Delta text.
	 * @return {!Array.<!diff_match_patch.Diff>} Array of diff tuples.
	 * @throws {!Error} If invalid input.
	 */
	diff_match_patch.prototype.diff_fromDelta = function(text1, delta) {
	  var diffs = [];
	  var diffsLength = 0;  // Keeping our own length var is faster in JS.
	  var pointer = 0;  // Cursor in text1
	  var tokens = delta.split(/\t/g);
	  for (var x = 0; x < tokens.length; x++) {
	    // Each token begins with a one character parameter which specifies the
	    // operation of this token (delete, insert, equality).
	    var param = tokens[x].substring(1);
	    switch (tokens[x].charAt(0)) {
	      case '+':
	        try {
	          diffs[diffsLength++] = [DIFF_INSERT, decodeURI(param)];
	        } catch (ex) {
	          // Malformed URI sequence.
	          throw new Error('Illegal escape in diff_fromDelta: ' + param);
	        }
	        break;
	      case '-':
	        // Fall through.
	      case '=':
	        var n = parseInt(param, 10);
	        if (isNaN(n) || n < 0) {
	          throw new Error('Invalid number in diff_fromDelta: ' + param);
	        }
	        var text = text1.substring(pointer, pointer += n);
	        if (tokens[x].charAt(0) == '=') {
	          diffs[diffsLength++] = [DIFF_EQUAL, text];
	        } else {
	          diffs[diffsLength++] = [DIFF_DELETE, text];
	        }
	        break;
	      default:
	        // Blank tokens are ok (from a trailing \t).
	        // Anything else is an error.
	        if (tokens[x]) {
	          throw new Error('Invalid diff operation in diff_fromDelta: ' +
	                          tokens[x]);
	        }
	    }
	  }
	  if (pointer != text1.length) {
	    throw new Error('Delta length (' + pointer +
	        ') does not equal source text length (' + text1.length + ').');
	  }
	  return diffs;
	};


	//  MATCH FUNCTIONS


	/**
	 * Locate the best instance of 'pattern' in 'text' near 'loc'.
	 * @param {string} text The text to search.
	 * @param {string} pattern The pattern to search for.
	 * @param {number} loc The location to search around.
	 * @return {number} Best match index or -1.
	 */
	diff_match_patch.prototype.match_main = function(text, pattern, loc) {
	  // Check for null inputs.
	  if (text == null || pattern == null || loc == null) {
	    throw new Error('Null input. (match_main)');
	  }

	  loc = Math.max(0, Math.min(loc, text.length));
	  if (text == pattern) {
	    // Shortcut (potentially not guaranteed by the algorithm)
	    return 0;
	  } else if (!text.length) {
	    // Nothing to match.
	    return -1;
	  } else if (text.substring(loc, loc + pattern.length) == pattern) {
	    // Perfect match at the perfect spot!  (Includes case of null pattern)
	    return loc;
	  } else {
	    // Do a fuzzy compare.
	    return this.match_bitap_(text, pattern, loc);
	  }
	};


	/**
	 * Locate the best instance of 'pattern' in 'text' near 'loc' using the
	 * Bitap algorithm.
	 * @param {string} text The text to search.
	 * @param {string} pattern The pattern to search for.
	 * @param {number} loc The location to search around.
	 * @return {number} Best match index or -1.
	 * @private
	 */
	diff_match_patch.prototype.match_bitap_ = function(text, pattern, loc) {
	  if (pattern.length > this.Match_MaxBits) {
	    throw new Error('Pattern too long for this browser.');
	  }

	  // Initialise the alphabet.
	  var s = this.match_alphabet_(pattern);

	  var dmp = this;  // 'this' becomes 'window' in a closure.

	  /**
	   * Compute and return the score for a match with e errors and x location.
	   * Accesses loc and pattern through being a closure.
	   * @param {number} e Number of errors in match.
	   * @param {number} x Location of match.
	   * @return {number} Overall score for match (0.0 = good, 1.0 = bad).
	   * @private
	   */
	  function match_bitapScore_(e, x) {
	    var accuracy = e / pattern.length;
	    var proximity = Math.abs(loc - x);
	    if (!dmp.Match_Distance) {
	      // Dodge divide by zero error.
	      return proximity ? 1.0 : accuracy;
	    }
	    return accuracy + (proximity / dmp.Match_Distance);
	  }

	  // Highest score beyond which we give up.
	  var score_threshold = this.Match_Threshold;
	  // Is there a nearby exact match? (speedup)
	  var best_loc = text.indexOf(pattern, loc);
	  if (best_loc != -1) {
	    score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
	    // What about in the other direction? (speedup)
	    best_loc = text.lastIndexOf(pattern, loc + pattern.length);
	    if (best_loc != -1) {
	      score_threshold =
	          Math.min(match_bitapScore_(0, best_loc), score_threshold);
	    }
	  }

	  // Initialise the bit arrays.
	  var matchmask = 1 << (pattern.length - 1);
	  best_loc = -1;

	  var bin_min, bin_mid;
	  var bin_max = pattern.length + text.length;
	  var last_rd;
	  for (var d = 0; d < pattern.length; d++) {
	    // Scan for the best match; each iteration allows for one more error.
	    // Run a binary search to determine how far from 'loc' we can stray at this
	    // error level.
	    bin_min = 0;
	    bin_mid = bin_max;
	    while (bin_min < bin_mid) {
	      if (match_bitapScore_(d, loc + bin_mid) <= score_threshold) {
	        bin_min = bin_mid;
	      } else {
	        bin_max = bin_mid;
	      }
	      bin_mid = Math.floor((bin_max - bin_min) / 2 + bin_min);
	    }
	    // Use the result from this iteration as the maximum for the next.
	    bin_max = bin_mid;
	    var start = Math.max(1, loc - bin_mid + 1);
	    var finish = Math.min(loc + bin_mid, text.length) + pattern.length;

	    var rd = Array(finish + 2);
	    rd[finish + 1] = (1 << d) - 1;
	    for (var j = finish; j >= start; j--) {
	      // The alphabet (s) is a sparse hash, so the following line generates
	      // warnings.
	      var charMatch = s[text.charAt(j - 1)];
	      if (d === 0) {  // First pass: exact match.
	        rd[j] = ((rd[j + 1] << 1) | 1) & charMatch;
	      } else {  // Subsequent passes: fuzzy match.
	        rd[j] = (((rd[j + 1] << 1) | 1) & charMatch) |
	                (((last_rd[j + 1] | last_rd[j]) << 1) | 1) |
	                last_rd[j + 1];
	      }
	      if (rd[j] & matchmask) {
	        var score = match_bitapScore_(d, j - 1);
	        // This match will almost certainly be better than any existing match.
	        // But check anyway.
	        if (score <= score_threshold) {
	          // Told you so.
	          score_threshold = score;
	          best_loc = j - 1;
	          if (best_loc > loc) {
	            // When passing loc, don't exceed our current distance from loc.
	            start = Math.max(1, 2 * loc - best_loc);
	          } else {
	            // Already passed loc, downhill from here on in.
	            break;
	          }
	        }
	      }
	    }
	    // No hope for a (better) match at greater error levels.
	    if (match_bitapScore_(d + 1, loc) > score_threshold) {
	      break;
	    }
	    last_rd = rd;
	  }
	  return best_loc;
	};


	/**
	 * Initialise the alphabet for the Bitap algorithm.
	 * @param {string} pattern The text to encode.
	 * @return {!Object} Hash of character locations.
	 * @private
	 */
	diff_match_patch.prototype.match_alphabet_ = function(pattern) {
	  var s = {};
	  for (var i = 0; i < pattern.length; i++) {
	    s[pattern.charAt(i)] = 0;
	  }
	  for (var i = 0; i < pattern.length; i++) {
	    s[pattern.charAt(i)] |= 1 << (pattern.length - i - 1);
	  }
	  return s;
	};


	//  PATCH FUNCTIONS


	/**
	 * Increase the context until it is unique,
	 * but don't let the pattern expand beyond Match_MaxBits.
	 * @param {!diff_match_patch.patch_obj} patch The patch to grow.
	 * @param {string} text Source text.
	 * @private
	 */
	diff_match_patch.prototype.patch_addContext_ = function(patch, text) {
	  if (text.length == 0) {
	    return;
	  }
	  var pattern = text.substring(patch.start2, patch.start2 + patch.length1);
	  var padding = 0;

	  // Look for the first and last matches of pattern in text.  If two different
	  // matches are found, increase the pattern length.
	  while (text.indexOf(pattern) != text.lastIndexOf(pattern) &&
	         pattern.length < this.Match_MaxBits - this.Patch_Margin -
	         this.Patch_Margin) {
	    padding += this.Patch_Margin;
	    pattern = text.substring(patch.start2 - padding,
	                             patch.start2 + patch.length1 + padding);
	  }
	  // Add one chunk for good luck.
	  padding += this.Patch_Margin;

	  // Add the prefix.
	  var prefix = text.substring(patch.start2 - padding, patch.start2);
	  if (prefix) {
	    patch.diffs.unshift([DIFF_EQUAL, prefix]);
	  }
	  // Add the suffix.
	  var suffix = text.substring(patch.start2 + patch.length1,
	                              patch.start2 + patch.length1 + padding);
	  if (suffix) {
	    patch.diffs.push([DIFF_EQUAL, suffix]);
	  }

	  // Roll back the start points.
	  patch.start1 -= prefix.length;
	  patch.start2 -= prefix.length;
	  // Extend the lengths.
	  patch.length1 += prefix.length + suffix.length;
	  patch.length2 += prefix.length + suffix.length;
	};


	/**
	 * Compute a list of patches to turn text1 into text2.
	 * Use diffs if provided, otherwise compute it ourselves.
	 * There are four ways to call this function, depending on what data is
	 * available to the caller:
	 * Method 1:
	 * a = text1, b = text2
	 * Method 2:
	 * a = diffs
	 * Method 3 (optimal):
	 * a = text1, b = diffs
	 * Method 4 (deprecated, use method 3):
	 * a = text1, b = text2, c = diffs
	 *
	 * @param {string|!Array.<!diff_match_patch.Diff>} a text1 (methods 1,3,4) or
	 * Array of diff tuples for text1 to text2 (method 2).
	 * @param {string|!Array.<!diff_match_patch.Diff>} opt_b text2 (methods 1,4) or
	 * Array of diff tuples for text1 to text2 (method 3) or undefined (method 2).
	 * @param {string|!Array.<!diff_match_patch.Diff>} opt_c Array of diff tuples
	 * for text1 to text2 (method 4) or undefined (methods 1,2,3).
	 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
	 */
	diff_match_patch.prototype.patch_make = function(a, opt_b, opt_c) {
	  var text1, diffs;
	  if (typeof a == 'string' && typeof opt_b == 'string' &&
	      typeof opt_c == 'undefined') {
	    // Method 1: text1, text2
	    // Compute diffs from text1 and text2.
	    text1 = /** @type {string} */(a);
	    diffs = this.diff_main(text1, /** @type {string} */(opt_b), true);
	    if (diffs.length > 2) {
	      this.diff_cleanupSemantic(diffs);
	      this.diff_cleanupEfficiency(diffs);
	    }
	  } else if (a && typeof a == 'object' && typeof opt_b == 'undefined' &&
	      typeof opt_c == 'undefined') {
	    // Method 2: diffs
	    // Compute text1 from diffs.
	    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(a);
	    text1 = this.diff_text1(diffs);
	  } else if (typeof a == 'string' && opt_b && typeof opt_b == 'object' &&
	      typeof opt_c == 'undefined') {
	    // Method 3: text1, diffs
	    text1 = /** @type {string} */(a);
	    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(opt_b);
	  } else if (typeof a == 'string' && typeof opt_b == 'string' &&
	      opt_c && typeof opt_c == 'object') {
	    // Method 4: text1, text2, diffs
	    // text2 is not used.
	    text1 = /** @type {string} */(a);
	    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */(opt_c);
	  } else {
	    throw new Error('Unknown call format to patch_make.');
	  }

	  if (diffs.length === 0) {
	    return [];  // Get rid of the null case.
	  }
	  var patches = [];
	  var patch = new diff_match_patch.patch_obj();
	  var patchDiffLength = 0;  // Keeping our own length var is faster in JS.
	  var char_count1 = 0;  // Number of characters into the text1 string.
	  var char_count2 = 0;  // Number of characters into the text2 string.
	  // Start with text1 (prepatch_text) and apply the diffs until we arrive at
	  // text2 (postpatch_text).  We recreate the patches one by one to determine
	  // context info.
	  var prepatch_text = text1;
	  var postpatch_text = text1;
	  for (var x = 0; x < diffs.length; x++) {
	    var diff_type = diffs[x][0];
	    var diff_text = diffs[x][1];

	    if (!patchDiffLength && diff_type !== DIFF_EQUAL) {
	      // A new patch starts here.
	      patch.start1 = char_count1;
	      patch.start2 = char_count2;
	    }

	    switch (diff_type) {
	      case DIFF_INSERT:
	        patch.diffs[patchDiffLength++] = diffs[x];
	        patch.length2 += diff_text.length;
	        postpatch_text = postpatch_text.substring(0, char_count2) + diff_text +
	                         postpatch_text.substring(char_count2);
	        break;
	      case DIFF_DELETE:
	        patch.length1 += diff_text.length;
	        patch.diffs[patchDiffLength++] = diffs[x];
	        postpatch_text = postpatch_text.substring(0, char_count2) +
	                         postpatch_text.substring(char_count2 +
	                             diff_text.length);
	        break;
	      case DIFF_EQUAL:
	        if (diff_text.length <= 2 * this.Patch_Margin &&
	            patchDiffLength && diffs.length != x + 1) {
	          // Small equality inside a patch.
	          patch.diffs[patchDiffLength++] = diffs[x];
	          patch.length1 += diff_text.length;
	          patch.length2 += diff_text.length;
	        } else if (diff_text.length >= 2 * this.Patch_Margin) {
	          // Time for a new patch.
	          if (patchDiffLength) {
	            this.patch_addContext_(patch, prepatch_text);
	            patches.push(patch);
	            patch = new diff_match_patch.patch_obj();
	            patchDiffLength = 0;
	            // Unlike Unidiff, our patch lists have a rolling context.
	            // http://code.google.com/p/google-diff-match-patch/wiki/Unidiff
	            // Update prepatch text & pos to reflect the application of the
	            // just completed patch.
	            prepatch_text = postpatch_text;
	            char_count1 = char_count2;
	          }
	        }
	        break;
	    }

	    // Update the current character count.
	    if (diff_type !== DIFF_INSERT) {
	      char_count1 += diff_text.length;
	    }
	    if (diff_type !== DIFF_DELETE) {
	      char_count2 += diff_text.length;
	    }
	  }
	  // Pick up the leftover patch if not empty.
	  if (patchDiffLength) {
	    this.patch_addContext_(patch, prepatch_text);
	    patches.push(patch);
	  }

	  return patches;
	};


	/**
	 * Given an array of patches, return another array that is identical.
	 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
	 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
	 */
	diff_match_patch.prototype.patch_deepCopy = function(patches) {
	  // Making deep copies is hard in JavaScript.
	  var patchesCopy = [];
	  for (var x = 0; x < patches.length; x++) {
	    var patch = patches[x];
	    var patchCopy = new diff_match_patch.patch_obj();
	    patchCopy.diffs = [];
	    for (var y = 0; y < patch.diffs.length; y++) {
	      patchCopy.diffs[y] = patch.diffs[y].slice();
	    }
	    patchCopy.start1 = patch.start1;
	    patchCopy.start2 = patch.start2;
	    patchCopy.length1 = patch.length1;
	    patchCopy.length2 = patch.length2;
	    patchesCopy[x] = patchCopy;
	  }
	  return patchesCopy;
	};


	/**
	 * Merge a set of patches onto the text.  Return a patched text, as well
	 * as a list of true/false values indicating which patches were applied.
	 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
	 * @param {string} text Old text.
	 * @return {!Array.<string|!Array.<boolean>>} Two element Array, containing the
	 *      new text and an array of boolean values.
	 */
	diff_match_patch.prototype.patch_apply = function(patches, text) {
	  if (patches.length == 0) {
	    return [text, []];
	  }

	  // Deep copy the patches so that no changes are made to originals.
	  patches = this.patch_deepCopy(patches);

	  var nullPadding = this.patch_addPadding(patches);
	  text = nullPadding + text + nullPadding;

	  this.patch_splitMax(patches);
	  // delta keeps track of the offset between the expected and actual location
	  // of the previous patch.  If there are patches expected at positions 10 and
	  // 20, but the first patch was found at 12, delta is 2 and the second patch
	  // has an effective expected position of 22.
	  var delta = 0;
	  var results = [];
	  for (var x = 0; x < patches.length; x++) {
	    var expected_loc = patches[x].start2 + delta;
	    var text1 = this.diff_text1(patches[x].diffs);
	    var start_loc;
	    var end_loc = -1;
	    if (text1.length > this.Match_MaxBits) {
	      // patch_splitMax will only provide an oversized pattern in the case of
	      // a monster delete.
	      start_loc = this.match_main(text, text1.substring(0, this.Match_MaxBits),
	                                  expected_loc);
	      if (start_loc != -1) {
	        end_loc = this.match_main(text,
	            text1.substring(text1.length - this.Match_MaxBits),
	            expected_loc + text1.length - this.Match_MaxBits);
	        if (end_loc == -1 || start_loc >= end_loc) {
	          // Can't find valid trailing context.  Drop this patch.
	          start_loc = -1;
	        }
	      }
	    } else {
	      start_loc = this.match_main(text, text1, expected_loc);
	    }
	    if (start_loc == -1) {
	      // No match found.  :(
	      results[x] = false;
	      // Subtract the delta for this failed patch from subsequent patches.
	      delta -= patches[x].length2 - patches[x].length1;
	    } else {
	      // Found a match.  :)
	      results[x] = true;
	      delta = start_loc - expected_loc;
	      var text2;
	      if (end_loc == -1) {
	        text2 = text.substring(start_loc, start_loc + text1.length);
	      } else {
	        text2 = text.substring(start_loc, end_loc + this.Match_MaxBits);
	      }
	      if (text1 == text2) {
	        // Perfect match, just shove the replacement text in.
	        text = text.substring(0, start_loc) +
	               this.diff_text2(patches[x].diffs) +
	               text.substring(start_loc + text1.length);
	      } else {
	        // Imperfect match.  Run a diff to get a framework of equivalent
	        // indices.
	        var diffs = this.diff_main(text1, text2, false);
	        if (text1.length > this.Match_MaxBits &&
	            this.diff_levenshtein(diffs) / text1.length >
	            this.Patch_DeleteThreshold) {
	          // The end points match, but the content is unacceptably bad.
	          results[x] = false;
	        } else {
	          this.diff_cleanupSemanticLossless(diffs);
	          var index1 = 0;
	          var index2;
	          for (var y = 0; y < patches[x].diffs.length; y++) {
	            var mod = patches[x].diffs[y];
	            if (mod[0] !== DIFF_EQUAL) {
	              index2 = this.diff_xIndex(diffs, index1);
	            }
	            if (mod[0] === DIFF_INSERT) {  // Insertion
	              text = text.substring(0, start_loc + index2) + mod[1] +
	                     text.substring(start_loc + index2);
	            } else if (mod[0] === DIFF_DELETE) {  // Deletion
	              text = text.substring(0, start_loc + index2) +
	                     text.substring(start_loc + this.diff_xIndex(diffs,
	                         index1 + mod[1].length));
	            }
	            if (mod[0] !== DIFF_DELETE) {
	              index1 += mod[1].length;
	            }
	          }
	        }
	      }
	    }
	  }
	  // Strip the padding off.
	  text = text.substring(nullPadding.length, text.length - nullPadding.length);
	  return [text, results];
	};


	/**
	 * Add some padding on text start and end so that edges can match something.
	 * Intended to be called only from within patch_apply.
	 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
	 * @return {string} The padding string added to each side.
	 */
	diff_match_patch.prototype.patch_addPadding = function(patches) {
	  var paddingLength = this.Patch_Margin;
	  var nullPadding = '';
	  for (var x = 1; x <= paddingLength; x++) {
	    nullPadding += String.fromCharCode(x);
	  }

	  // Bump all the patches forward.
	  for (var x = 0; x < patches.length; x++) {
	    patches[x].start1 += paddingLength;
	    patches[x].start2 += paddingLength;
	  }

	  // Add some padding on start of first diff.
	  var patch = patches[0];
	  var diffs = patch.diffs;
	  if (diffs.length == 0 || diffs[0][0] != DIFF_EQUAL) {
	    // Add nullPadding equality.
	    diffs.unshift([DIFF_EQUAL, nullPadding]);
	    patch.start1 -= paddingLength;  // Should be 0.
	    patch.start2 -= paddingLength;  // Should be 0.
	    patch.length1 += paddingLength;
	    patch.length2 += paddingLength;
	  } else if (paddingLength > diffs[0][1].length) {
	    // Grow first equality.
	    var extraLength = paddingLength - diffs[0][1].length;
	    diffs[0][1] = nullPadding.substring(diffs[0][1].length) + diffs[0][1];
	    patch.start1 -= extraLength;
	    patch.start2 -= extraLength;
	    patch.length1 += extraLength;
	    patch.length2 += extraLength;
	  }

	  // Add some padding on end of last diff.
	  patch = patches[patches.length - 1];
	  diffs = patch.diffs;
	  if (diffs.length == 0 || diffs[diffs.length - 1][0] != DIFF_EQUAL) {
	    // Add nullPadding equality.
	    diffs.push([DIFF_EQUAL, nullPadding]);
	    patch.length1 += paddingLength;
	    patch.length2 += paddingLength;
	  } else if (paddingLength > diffs[diffs.length - 1][1].length) {
	    // Grow last equality.
	    var extraLength = paddingLength - diffs[diffs.length - 1][1].length;
	    diffs[diffs.length - 1][1] += nullPadding.substring(0, extraLength);
	    patch.length1 += extraLength;
	    patch.length2 += extraLength;
	  }

	  return nullPadding;
	};


	/**
	 * Look through the patches and break up any which are longer than the maximum
	 * limit of the match algorithm.
	 * Intended to be called only from within patch_apply.
	 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
	 */
	diff_match_patch.prototype.patch_splitMax = function(patches) {
	  var patch_size = this.Match_MaxBits;
	  for (var x = 0; x < patches.length; x++) {
	    if (patches[x].length1 <= patch_size) {
	      continue;
	    }
	    var bigpatch = patches[x];
	    // Remove the big old patch.
	    patches.splice(x--, 1);
	    var start1 = bigpatch.start1;
	    var start2 = bigpatch.start2;
	    var precontext = '';
	    while (bigpatch.diffs.length !== 0) {
	      // Create one of several smaller patches.
	      var patch = new diff_match_patch.patch_obj();
	      var empty = true;
	      patch.start1 = start1 - precontext.length;
	      patch.start2 = start2 - precontext.length;
	      if (precontext !== '') {
	        patch.length1 = patch.length2 = precontext.length;
	        patch.diffs.push([DIFF_EQUAL, precontext]);
	      }
	      while (bigpatch.diffs.length !== 0 &&
	             patch.length1 < patch_size - this.Patch_Margin) {
	        var diff_type = bigpatch.diffs[0][0];
	        var diff_text = bigpatch.diffs[0][1];
	        if (diff_type === DIFF_INSERT) {
	          // Insertions are harmless.
	          patch.length2 += diff_text.length;
	          start2 += diff_text.length;
	          patch.diffs.push(bigpatch.diffs.shift());
	          empty = false;
	        } else if (diff_type === DIFF_DELETE && patch.diffs.length == 1 &&
	                   patch.diffs[0][0] == DIFF_EQUAL &&
	                   diff_text.length > 2 * patch_size) {
	          // This is a large deletion.  Let it pass in one chunk.
	          patch.length1 += diff_text.length;
	          start1 += diff_text.length;
	          empty = false;
	          patch.diffs.push([diff_type, diff_text]);
	          bigpatch.diffs.shift();
	        } else {
	          // Deletion or equality.  Only take as much as we can stomach.
	          diff_text = diff_text.substring(0,
	              patch_size - patch.length1 - this.Patch_Margin);
	          patch.length1 += diff_text.length;
	          start1 += diff_text.length;
	          if (diff_type === DIFF_EQUAL) {
	            patch.length2 += diff_text.length;
	            start2 += diff_text.length;
	          } else {
	            empty = false;
	          }
	          patch.diffs.push([diff_type, diff_text]);
	          if (diff_text == bigpatch.diffs[0][1]) {
	            bigpatch.diffs.shift();
	          } else {
	            bigpatch.diffs[0][1] =
	                bigpatch.diffs[0][1].substring(diff_text.length);
	          }
	        }
	      }
	      // Compute the head context for the next patch.
	      precontext = this.diff_text2(patch.diffs);
	      precontext =
	          precontext.substring(precontext.length - this.Patch_Margin);
	      // Append the end context for this patch.
	      var postcontext = this.diff_text1(bigpatch.diffs)
	                            .substring(0, this.Patch_Margin);
	      if (postcontext !== '') {
	        patch.length1 += postcontext.length;
	        patch.length2 += postcontext.length;
	        if (patch.diffs.length !== 0 &&
	            patch.diffs[patch.diffs.length - 1][0] === DIFF_EQUAL) {
	          patch.diffs[patch.diffs.length - 1][1] += postcontext;
	        } else {
	          patch.diffs.push([DIFF_EQUAL, postcontext]);
	        }
	      }
	      if (!empty) {
	        patches.splice(++x, 0, patch);
	      }
	    }
	  }
	};


	/**
	 * Take a list of patches and return a textual representation.
	 * @param {!Array.<!diff_match_patch.patch_obj>} patches Array of Patch objects.
	 * @return {string} Text representation of patches.
	 */
	diff_match_patch.prototype.patch_toText = function(patches) {
	  var text = [];
	  for (var x = 0; x < patches.length; x++) {
	    text[x] = patches[x];
	  }
	  return text.join('');
	};


	/**
	 * Parse a textual representation of patches and return a list of Patch objects.
	 * @param {string} textline Text representation of patches.
	 * @return {!Array.<!diff_match_patch.patch_obj>} Array of Patch objects.
	 * @throws {!Error} If invalid input.
	 */
	diff_match_patch.prototype.patch_fromText = function(textline) {
	  var patches = [];
	  if (!textline) {
	    return patches;
	  }
	  var text = textline.split('\n');
	  var textPointer = 0;
	  var patchHeader = /^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@$/;
	  while (textPointer < text.length) {
	    var m = text[textPointer].match(patchHeader);
	    if (!m) {
	      throw new Error('Invalid patch string: ' + text[textPointer]);
	    }
	    var patch = new diff_match_patch.patch_obj();
	    patches.push(patch);
	    patch.start1 = parseInt(m[1], 10);
	    if (m[2] === '') {
	      patch.start1--;
	      patch.length1 = 1;
	    } else if (m[2] == '0') {
	      patch.length1 = 0;
	    } else {
	      patch.start1--;
	      patch.length1 = parseInt(m[2], 10);
	    }

	    patch.start2 = parseInt(m[3], 10);
	    if (m[4] === '') {
	      patch.start2--;
	      patch.length2 = 1;
	    } else if (m[4] == '0') {
	      patch.length2 = 0;
	    } else {
	      patch.start2--;
	      patch.length2 = parseInt(m[4], 10);
	    }
	    textPointer++;

	    while (textPointer < text.length) {
	      var sign = text[textPointer].charAt(0);
	      try {
	        var line = decodeURI(text[textPointer].substring(1));
	      } catch (ex) {
	        // Malformed URI sequence.
	        throw new Error('Illegal escape in patch_fromText: ' + line);
	      }
	      if (sign == '-') {
	        // Deletion.
	        patch.diffs.push([DIFF_DELETE, line]);
	      } else if (sign == '+') {
	        // Insertion.
	        patch.diffs.push([DIFF_INSERT, line]);
	      } else if (sign == ' ') {
	        // Minor equality.
	        patch.diffs.push([DIFF_EQUAL, line]);
	      } else if (sign == '@') {
	        // Start of next patch.
	        break;
	      } else if (sign === '') {
	        // Blank line?  Whatever.
	      } else {
	        // WTF?
	        throw new Error('Invalid patch mode "' + sign + '" in: ' + line);
	      }
	      textPointer++;
	    }
	  }
	  return patches;
	};


	/**
	 * Class representing one patch operation.
	 * @constructor
	 */
	diff_match_patch.patch_obj = function() {
	  /** @type {!Array.<!diff_match_patch.Diff>} */
	  this.diffs = [];
	  /** @type {?number} */
	  this.start1 = null;
	  /** @type {?number} */
	  this.start2 = null;
	  /** @type {number} */
	  this.length1 = 0;
	  /** @type {number} */
	  this.length2 = 0;
	};


	/**
	 * Emmulate GNU diff's format.
	 * Header: @@ -382,8 +481,9 @@
	 * Indicies are printed as 1-based, not 0-based.
	 * @return {string} The GNU diff string.
	 */
	diff_match_patch.patch_obj.prototype.toString = function() {
	  var coords1, coords2;
	  if (this.length1 === 0) {
	    coords1 = this.start1 + ',0';
	  } else if (this.length1 == 1) {
	    coords1 = this.start1 + 1;
	  } else {
	    coords1 = (this.start1 + 1) + ',' + this.length1;
	  }
	  if (this.length2 === 0) {
	    coords2 = this.start2 + ',0';
	  } else if (this.length2 == 1) {
	    coords2 = this.start2 + 1;
	  } else {
	    coords2 = (this.start2 + 1) + ',' + this.length2;
	  }
	  var text = ['@@ -' + coords1 + ' +' + coords2 + ' @@\n'];
	  var op;
	  // Escape the body of the patch with %xx notation.
	  for (var x = 0; x < this.diffs.length; x++) {
	    switch (this.diffs[x][0]) {
	      case DIFF_INSERT:
	        op = '+';
	        break;
	      case DIFF_DELETE:
	        op = '-';
	        break;
	      case DIFF_EQUAL:
	        op = ' ';
	        break;
	    }
	    text[x + 1] = op + encodeURI(this.diffs[x][1]) + '\n';
	  }
	  return text.join('').replace(/%20/g, ' ');
	};

	module.exports = diff_match_patch;

	// Export these global variables so that they survive Google's JS compiler.
	// In a browser, 'this' will be 'window'.
	// Users of node.js should 'require' the uncompressed version since Google's
	// JS compiler may break the following exports for non-browser environments.
	//this['diff_match_patch'] = diff_match_patch;
	//this['DIFF_DELETE'] = DIFF_DELETE;
	//this['DIFF_INSERT'] = DIFF_INSERT;
	//this['DIFF_EQUAL'] = DIFF_EQUAL;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements wysiwyg marker helper for additional information
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var domUtils = __webpack_require__(19);

	var FIND_ZWB_RX = /\u200B/g;

	/**
	 * WysiwygMarkerHelper
	 * @exports WysiwygMarkerHelper
	 * @constructor
	 * @class
	 * @param {SquireExt} sqe squire instance
	 */
	function WysiwygMarkerHelper(sqe) {
	    this.sqe = sqe;
	}

	/**
	 * getTextContent
	 * Get text content of wysiwyg
	 * @returns {string}
	 */
	WysiwygMarkerHelper.prototype.getTextContent = function() {
	    return this.sqe.get$Body()[0].textContent.replace(FIND_ZWB_RX, '');
	};

	/**
	 * updateMarkerWithExtraInfo
	 * Update marker with extra info of CodeMirror
	 * @param {object} marker marker
	 * @returns {object} marker
	 */
	WysiwygMarkerHelper.prototype.updateMarkerWithExtraInfo = function(marker) {
	    var foundNode, markerRange, info;

	    foundNode = this._findOffsetNode([marker.start, marker.end]);

	    markerRange = this.sqe.getSelection().cloneRange();
	    markerRange.setStart(foundNode[0].container, foundNode[0].offsetInContainer);
	    markerRange.setEnd(foundNode[1].container, foundNode[1].offsetInContainer);

	    info = this._getExtraInfoOfRange(markerRange);

	    marker.text = info.text;
	    marker.top = info.top;
	    marker.left = info.left;
	    marker.height = info.height;

	    return marker;
	};

	/**
	 * _getExtraInfoOfRange
	 * Get extra info of range
	 * @param {Range} range range
	 * @returns {object} extra info
	 */
	WysiwygMarkerHelper.prototype._getExtraInfoOfRange = function(range) {
	    var text, top, left, rect, height, node, parentNode, containerOffset;
	    var endContainer = range.endContainer;
	    var endOffset = range.endOffset;

	    text = range.cloneContents().textContent.replace(FIND_ZWB_RX, '');

	    if (domUtils.getChildNodeByOffset(endContainer, endOffset)) {
	        range.setStart(endContainer, endOffset);
	        range.collapse(true);

	        rect = range.getBoundingClientRect();
	    }

	    if (rect && !rect.top) {
	        this.sqe.modifyDocument(function() {
	            node = document.createElement('SPAN');
	            node.textContent = '\u200B';
	            range.endContainer.parentNode.insertBefore(node, range.endContainer);
	            rect = node.getBoundingClientRect();
	            parentNode = node.parentNode;
	            parentNode.removeChild(node);
	        });
	    }

	    if (rect) {
	        containerOffset = this.sqe.get$Body().parent().offset();
	        top = this.sqe.scrollTop() + rect.top - containerOffset.top + $('body').scrollTop();
	        left = rect.left - containerOffset.left;
	        height = rect.height;
	    } else {
	        height = top = left = 0;
	    }

	    return {
	        text: text,
	        top: top,
	        left: left,
	        height: height
	    };
	};

	/**
	 * getMarkerInfoOfCurrentSelection
	 * Get marker info of current selection
	 * @returns {object} marker
	 */
	WysiwygMarkerHelper.prototype.getMarkerInfoOfCurrentSelection = function() {
	    var range, beforeRange, start, end, info;

	    range = this.sqe.getSelection().cloneRange();

	    if (this._extendRangeToTextNodeIfHasNone(range)) {
	        beforeRange = range.cloneRange();
	        beforeRange.setStart(this.sqe.get$Body()[0], 0);
	        beforeRange.setEnd(range.startContainer, range.startOffset);

	        info = this._getExtraInfoOfRange(range);

	        start = beforeRange.cloneContents().textContent.length;
	        end = start + info.text.length;

	        return {
	            start: start,
	            end: end,
	            text: info.text,
	            top: info.top,
	            left: info.left,
	            height: info.height
	        };
	    }

	    return null;
	};

	/**
	 * _extendRangeToTextNodeIfHasNone
	 * Extend range to text node if start or end container have none
	 * Containers of range should be text node
	 * @param {Range} range range
	 * @returns {boolean} success or fail
	 */
	WysiwygMarkerHelper.prototype._extendRangeToTextNodeIfHasNone = function(range) {
	    var endNode = domUtils.getChildNodeByOffset(range.endContainer, range.endOffset),
	        textNode;

	    if (!domUtils.isTextNode(range.endContainer) || !endNode.nodeValue.replace(FIND_ZWB_RX, '').length) {
	        if (domUtils.isTextNode(endNode)) {
	            range.setEnd(endNode, 0);
	        } else {
	            textNode = domUtils.getPrevTextNode(endNode);
	            if (textNode) {
	                range.setEnd(textNode, textNode.length);
	            } else {
	                return false;
	            }
	        }
	    }

	    return true;
	};

	/**
	 * _findOffsetNode
	 * Find offset nodes by given offset list
	 * @param {Array.<number>} offsetlist offset list
	 * @returns {Array.<object>} offset node informations
	 */
	WysiwygMarkerHelper.prototype._findOffsetNode = function(offsetlist) {
	    return domUtils.findOffsetNode(this.sqe.get$Body()[0], offsetlist, function(text) {
	        return text.replace(FIND_ZWB_RX, '');
	    });
	};

	/**
	 * selectOffsetRange
	 * Make selection with given offset range
	 * @param {number} start start offset
	 * @param {number} end end offset
	 */
	WysiwygMarkerHelper.prototype.selectOffsetRange = function(start, end) {
	    var foundNode = this._findOffsetNode([start, end]),
	        range = this.sqe.getSelection().cloneRange();

	    range.setStart(foundNode[0].container, foundNode[0].offsetInContainer);
	    range.setEnd(foundNode[1].container, foundNode[1].offsetInContainer);

	    this.sqe.setSelection(range);
	};

	/**
	 * clearSelect
	 * Clear selection of squire
	 */
	WysiwygMarkerHelper.prototype.clearSelect = function() {
	    var range = this.sqe.getSelection().cloneRange();
	    range.collapse(true);
	    this.sqe.setSelection(range);
	};

	module.exports = WysiwygMarkerHelper;


/***/ },
/* 19 */
/***/ function(module, exports) {

	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var FIND_ZWB = /\u200B/g;

	var util = tui.util;

	/**
	 * isTextNode
	 * Check if node is text node
	 * @param {Node} node node to check
	 * @returns {boolean} result
	 */
	var isTextNode = function(node) {
	    return node && node.nodeType === Node.TEXT_NODE;
	};

	/**
	 * isElemNode
	 * Check if node is element node
	 * @param {Node} node node to check
	 * @returns {boolean} result
	 */
	var isElemNode = function(node) {
	    return node && node.nodeType === Node.ELEMENT_NODE;
	};

	/**
	 * getNodeName
	 * Get node name of node
	 * @param {Node} node node
	 * @returns {string} node name
	 */
	var getNodeName = function(node) {
	    if (isElemNode(node)) {
	        return node.tagName;
	    }

	    return 'TEXT';
	};

	/**
	 * getTextLength
	 * Get node offset length of node(for Range API)
	 * @param {Node} node node
	 * @returns {number} length
	 */
	var getTextLength = function(node) {
	    var len;

	    if (isElemNode(node)) {
	        len = node.textContent.replace(FIND_ZWB, '').length;
	    } else if (isTextNode(node)) {
	        len = node.nodeValue.replace(FIND_ZWB, '').length;
	    }

	    return len;
	};

	/**
	 * getOffsetLength
	 * Get node offset length of node(for Range API)
	 * @param {Node} node node
	 * @returns {number} length
	 */
	var getOffsetLength = function(node) {
	    var len;

	    if (isElemNode(node)) {
	        len = node.childNodes.length;
	    } else if (isTextNode(node)) {
	        len = node.nodeValue.replace(FIND_ZWB, '').length;
	    }

	    return len;
	};

	/**
	 * getNodeOffsetOfParent
	 * get node offset between parent's childnodes
	 * @param {Node} node node
	 * @returns {number} offset(index)
	 */
	var getNodeOffsetOfParent = function(node) {
	    var i, t, found,
	        childNodesOfParent = node.parentNode.childNodes;

	    for (i = 0, t = childNodesOfParent.length; i < t; i += 1) {
	        if (childNodesOfParent[i] === node) {
	            found = i;
	            break;
	        }
	    }

	    return found;
	};

	/**
	 * getChildNodeByOffset
	 * get child node by offset
	 * @param {Node} node node
	 * @param {number} index offset index
	 * @returns {Node} foudned node
	 */
	var getChildNodeByOffset = function(node, index) {
	    var currentNode;

	    if (isTextNode(node)) {
	        currentNode = node;
	    } else if (node.childNodes.length && index >= 0) {
	        currentNode = node.childNodes[index];
	    }

	    return currentNode;
	};

	/**
	 * getNodeWithDirectionUntil
	 * find next node from passed node
	 * 노드의 다음 노드를 찾는다 sibling노드가 없으면 부모레벨까지 올라가서 찾는다.
	 * 부모노드를 따라 올라가며 방향에 맞는 노드를 찾는다.
	 * @param {strong} direction previous or next
	 * @param {Node} node node
	 * @param {string} untilNodeName parent node name to limit
	 * @returns {Node} founded node
	 */
	var getNodeWithDirectionUntil = function(direction, node, untilNodeName) {
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

	/**
	 * getPrevOffsetNodeUntil
	 * get prev node of childnode pointed with index
	 * 인덱스에 해당하는 차일드 노드의 이전 노드를 찾는다.
	 * @param {Node} node node
	 * @param {number} index offset index
	 * @param {string} untilNodeName parent node name to limit
	 * @returns {Node} founded node
	 */
	var getPrevOffsetNodeUntil = function(node, index, untilNodeName) {
	    var prevNode;

	    if (index > 0) {
	        prevNode = getChildNodeByOffset(node, index - 1);
	    } else {
	        prevNode = getNodeWithDirectionUntil('previous', node, untilNodeName);
	    }

	    return prevNode;
	};

	var getParentUntilBy = function(node, condition) {
	    var foundedNode;

	    while (node.parentNode && !condition(node.parentNode)) {
	        node = node.parentNode;
	    }

	    if (condition(node.parentNode)) {
	        foundedNode = node;
	    }

	    return foundedNode;
	};

	/**
	 * getParentUntil
	 * get parent node until paseed node name
	 * 특정 노드이전의 부모 노드를 찾는다
	 * @param {Node} node node
	 * @param {string|HTMLNode} untilNode node name or node to limit
	 * @returns {Node} founded node
	 */
	var getParentUntil = function(node, untilNode) {
	    var foundedNode;

	    if (util.isString(untilNode)) {
	        foundedNode = getParentUntilBy(node, function(targetNode) {
	            return untilNode === getNodeName(targetNode);
	        });
	    } else {
	        foundedNode = getParentUntilBy(node, function(targetNode) {
	            return untilNode === targetNode;
	        });
	    }

	    return foundedNode;
	};


	/**
	 * getNodeWithDirectionUnderParent
	 * get node of direction before passed parent
	 * 주어진 노드 이전까지 찾아올라가서 방향에 맞는 노드를 찾는다.
	 * @param {strong} direction previous or next
	 * @param {Node} node node
	 * @param {string|Node} underNode parent node name to limit
	 * @returns {Node} founded node
	 */
	var getNodeWithDirectionUnderParent = function(direction, node, underNode) {
	    var directionKey = direction + 'Sibling',
	        foundedNode;

	    node = getParentUntil(node, underNode);

	    if (node && node[directionKey]) {
	        foundedNode = node[directionKey];
	    }

	    return foundedNode;
	};

	/**
	 * getTopPrevNodeUnder
	 * get top previous top level node under given node
	 * @param {Node} node node
	 * @param {Node} underNode underNode
	 * @returns {Node} founded node
	 */
	var getTopPrevNodeUnder = function(node, underNode) {
	    return getNodeWithDirectionUnderParent('previous', node, underNode);
	};

	/**
	 * getNextTopBlockNode
	 * get next top level block node
	 * @param {Node} node node
	 * @param {Node} underNode underNode
	 * @returns {Node} founded node
	 */
	var getTopNextNodeUnder = function(node, underNode) {
	    return getNodeWithDirectionUnderParent('next', node, underNode);
	};

	/**
	 * Get parent element the body element
	 * @param {Node} node Node for start searching
	 * @returns {Node}
	 */
	var getTopBlockNode = function(node) {
	    return getParentUntil(node, 'BODY');
	};

	/**
	 * Get previous text node
	 * @param {Node} node Node for start searching
	 * @returns {Node}
	 */
	var getPrevTextNode = function(node) {
	    node = node.previousSibling || node.parentNode;

	    while (!isTextNode(node) && getNodeName(node) !== 'BODY') {
	        if (node.previousSibling) {
	            node = node.previousSibling;

	            while (node.lastChild) {
	                node = node.lastChild;
	            }
	        } else {
	            node = node.parentNode;
	        }
	    }

	    if (getNodeName(node) === 'BODY') {
	        node = null;
	    }

	    return node;
	};

	/**
	 * find node by offset
	 * @param {HTMLElement} root Root element
	 * @param {Array.<number>} offsetList offset list
	 * @param {function} textNodeFilter Text node filter
	 * @returns {Array}
	 */
	var findOffsetNode = function(root, offsetList, textNodeFilter) {
	    var result = [],
	        text = '',
	        walkerOffset = 0,
	        offset, walker, newWalkerOffset;

	    if (!offsetList.length) {
	        return result;
	    }

	    offset = offsetList.shift();
	    walker = document.createTreeWalker(root, 4, null, false);

	    while (walker.nextNode()) {
	        text = walker.currentNode.nodeValue || '';

	        if (textNodeFilter) {
	            text = textNodeFilter(text);
	        }

	        newWalkerOffset = walkerOffset + text.length;

	        while (newWalkerOffset >= offset) {
	            result.push({
	                container: walker.currentNode,
	                offsetInContainer: offset - walkerOffset,
	                offset: offset
	            });

	            if (!offsetList.length) {
	                return result;
	            }
	            offset = offsetList.shift();
	        }
	        walkerOffset = newWalkerOffset;
	    }

	    //오프셋에 해당하는 컨텐츠가 없는경우 컨텐츠 맨마지막으로 통일
	    //중간에 return으로 빠져나가지 않고 여기까지 왔다는것은 남은 offset이 있는것임
	    do {
	        result.push({
	            container: walker.currentNode,
	            offsetInContainer: text.length,
	            offset: offset
	        });
	        offset = offsetList.shift();
	    } while (!util.isUndefined(offset));

	    return result;
	};

	var getNodeInfo = function(node) {
	    var path = {};
	    var className;

	    path.tagName = node.nodeName;

	    if (node.id) {
	        path.id = node.id;
	    }

	    className = node.className.trim();

	    if (className) {
	        path.className = className;
	    }

	    return path;
	};

	var getPath = function(node, root) {
	    var paths = [];

	    while (node && node !== root) {
	        if (isElemNode(node)) {
	            paths.unshift(getNodeInfo(node));
	        }

	        node = node.parentNode;
	    }

	    return paths;
	};

	module.exports = {
	    getNodeName: getNodeName,
	    isTextNode: isTextNode,
	    isElemNode: isElemNode,
	    getTextLength: getTextLength,
	    getOffsetLength: getOffsetLength,
	    getPrevOffsetNodeUntil: getPrevOffsetNodeUntil,
	    getNodeOffsetOfParent: getNodeOffsetOfParent,
	    getChildNodeByOffset: getChildNodeByOffset,
	    getTopPrevNodeUnder: getTopPrevNodeUnder,
	    getTopNextNodeUnder: getTopNextNodeUnder,
	    getParentUntil: getParentUntil,
	    getTopBlockNode: getTopBlockNode,
	    getPrevTextNode: getPrevTextNode,
	    findOffsetNode: findOffsetNode,
	    getPath: getPath,
	    getNodInfo: getNodeInfo
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements viewOnly marker helper for additional information
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var domUtils = __webpack_require__(19);

	var FIND_CRLF_RX = /(\n)|(\r\n)|(\r)/g;

	/**
	 * ViewOnlyMarkerHelper
	 * @exports ViewOnlyMarkerHelper
	 * @constructor
	 * @class
	 * @param {Preview} preview preview instance
	 */
	function ViewOnlyMarkerHelper(preview) {
	    this.preview = preview;
	}

	/**
	 * getTextContent
	 * Get text content of wysiwyg
	 * @returns {string}
	 */
	ViewOnlyMarkerHelper.prototype.getTextContent = function() {
	    return this.preview.$el[0].textContent.replace(FIND_CRLF_RX, '');
	};

	/**
	 * updateMarkerWithExtraInfo
	 * Update marker with extra info of preview
	 * @param {object} marker marker
	 * @returns {object} marker
	 */
	ViewOnlyMarkerHelper.prototype.updateMarkerWithExtraInfo = function(marker) {
	    var foundNode, markerRange, info;

	    foundNode = this._findOffsetNode([marker.start, marker.end]);

	    markerRange = document.createRange();

	    markerRange.setStart(foundNode[0].container, foundNode[0].offsetInContainer);
	    markerRange.setEnd(foundNode[1].container, foundNode[1].offsetInContainer);

	    info = this._getExtraInfoOfRange(markerRange);

	    marker.text = info.text;
	    marker.top = info.top;
	    marker.left = info.left;
	    marker.height = info.height;

	    return marker;
	};

	/**
	 * _getExtraInfoOfRange
	 * Get extra info of range
	 * @param {Range} range range
	 * @returns {object} extra info
	 */
	ViewOnlyMarkerHelper.prototype._getExtraInfoOfRange = function(range) {
	    var text, top, left, rect, containerOffset, height, node, parentNode;

	    text = range.cloneContents().textContent.replace(FIND_CRLF_RX, '');

	    range.setStart(range.endContainer, range.endOffset);
	    range.collapse(true);

	    rect = range.getBoundingClientRect();

	    if (rect && !rect.top) {
	        node = document.createElement('SPAN');
	        node.textContent = '\u200B';
	        range.endContainer.parentNode.insertBefore(node, range.endContainer);
	        rect = node.getBoundingClientRect();
	        parentNode = node.parentNode;
	        parentNode.removeChild(node);
	    }

	    if (rect) {
	        containerOffset = this.preview.$el.offset();
	        top = rect.top + this.preview.$el.scrollTop() - containerOffset.top + $('body').scrollTop();
	        left = rect.left - containerOffset.left;
	        height = rect.height;
	    } else {
	        height = top = left = 0;
	    }

	    return {
	        text: text,
	        top: top,
	        left: left,
	        height: height
	    };
	};

	/**
	 * getRange
	 * get current range
	 * @returns {Range}
	 */
	function getRange() {
	    var selection = window.getSelection();
	    var range;

	    if (selection && selection.rangeCount) {
	        range = selection.getRangeAt(0).cloneRange();
	    } else {
	        range = document.createRange();
	        range.selectNodeContents(this.preview.$el[0]);
	        range.collapse(true);
	    }

	    return range;
	}

	/**
	 * getMarkerInfoOfCurrentSelection
	 * Get marker info of current selection
	 * @returns {object} marker
	 */
	ViewOnlyMarkerHelper.prototype.getMarkerInfoOfCurrentSelection = function() {
	    var range, beforeRange, start, end, info, isRangeInContent;

	    range = getRange();

	    isRangeInContent = $.contains(this.preview.$el[0], range.commonAncestorContainer);

	    if (isRangeInContent && this._extendRangeToTextNodeIfHasNone(range)) {
	        beforeRange = range.cloneRange();
	        beforeRange.setStart(this.preview.$el[0], 0);
	        beforeRange.setEnd(range.startContainer, range.startOffset);

	        info = this._getExtraInfoOfRange(range);

	        start = beforeRange.cloneContents().textContent.length;
	        end = start + info.text.length;

	        return {
	            start: start,
	            end: end,
	            text: info.text,
	            top: info.top,
	            left: info.left,
	            height: info.height
	        };
	    }

	    return null;
	};

	/**
	 * _extendRangeToTextNodeIfHasNone
	 * Extend range to text node if start or end container have none
	 * Containers of range should be text node
	 * @param {Range} range range
	 * @returns {boolean} success or fail
	 */
	ViewOnlyMarkerHelper.prototype._extendRangeToTextNodeIfHasNone = function(range) {
	    var endNode = domUtils.getChildNodeByOffset(range.endContainer, range.endOffset),
	        textNode;

	    if (!domUtils.isTextNode(range.endContainer)) {
	        if (domUtils.isTextNode(endNode)) {
	            range.setEnd(endNode, 0);
	        } else {
	            textNode = domUtils.getPrevTextNode(endNode);
	            if (textNode) {
	                range.setEnd(textNode, textNode.length);
	            } else {
	                return false;
	            }
	        }
	    }

	    return true;
	};

	/**
	 * _findOffsetNode
	 * Find offset nodes by given offset list
	 * @param {Array.<number>} offsetlist offset list
	 * @returns {Array.<object>} offset node informations
	 */
	ViewOnlyMarkerHelper.prototype._findOffsetNode = function(offsetlist) {
	    return domUtils.findOffsetNode(this.preview.$el[0], offsetlist, function(text) {
	        return text.replace(FIND_CRLF_RX, '');
	    });
	};

	/**
	 * selectOffsetRange
	 * Make selection with given offset range
	 * @param {number} start start offset
	 * @param {number} end end offset
	 */
	ViewOnlyMarkerHelper.prototype.selectOffsetRange = function(start, end) {
	    var foundNode = this._findOffsetNode([start, end]),
	        range = document.createRange(),
	        sel = window.getSelection();

	    range.setStart(foundNode[0].container, foundNode[0].offsetInContainer);
	    range.setEnd(foundNode[1].container, foundNode[1].offsetInContainer);

	    sel.removeAllRanges();
	    sel.addRange(range);
	};

	/**
	 * clearSelect
	 * Clear selection
	 */
	ViewOnlyMarkerHelper.prototype.clearSelect = function() {
	    window.getSelection().removeAllRanges();
	};

	module.exports = ViewOnlyMarkerHelper;


/***/ },
/* 21 */
/***/ function(module, exports) {

	/**
	 * @fileoverview Implements markdown marker helper for additional information
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var util = tui.util;

	var FIND_CRLF_RX = /(\n)|(\r\n)|(\r)/g;

	/**
	 *
	 * MarkdownMarkerHelper
	 * @exports MarkdownMarkerHelper
	 * @constructor
	 * @class
	 * @param {CodeMirror} cm codemirror instance
	 */
	function MarkdownMarkerHelper(cm) {
	    this.cm = cm;
	}

	/**
	 * getTextContent
	 * Get CRLF removed text content of CodeMirror
	 * @returns {string} text content
	 */
	MarkdownMarkerHelper.prototype.getTextContent = function() {
	    return this.cm.getValue().replace(FIND_CRLF_RX, '');
	};

	/**
	 * updateMarkerWithExtraInfo
	 * Update marker with extra info of CodeMirror
	 * @param {object} marker marker
	 * @returns {object} marker
	 */
	MarkdownMarkerHelper.prototype.updateMarkerWithExtraInfo = function(marker) {
	    var foundCursor, startCh, startLine, endCh, endLine, info;

	    foundCursor = this._findOffsetCursor([marker.start, marker.end]);

	    startLine = foundCursor[0].line;
	    startCh = foundCursor[0].ch;
	    endLine = foundCursor[1].line;
	    endCh = foundCursor[1].ch;

	    info = this._getExtraInfoOfRange(startLine, startCh, endLine, endCh);

	    marker.text = info.text.replace(FIND_CRLF_RX, ' ');
	    marker.top = info.top;
	    marker.left = info.left;
	    marker.height = info.height;

	    return marker;
	};

	/**
	 * _getExtraInfoOfRange
	 *  Get additional info of range
	 * @param {number} startLine start line
	 * @param {number} startCh start offset
	 * @param {number} endLine end line
	 * @param {number} endCh end offset
	 * @returns {object} information
	 */
	MarkdownMarkerHelper.prototype._getExtraInfoOfRange = function(startLine, startCh, endLine, endCh) {
	    var text, rect, top, left, height,
	        doc = this.cm.getDoc();

	    if (!doc.getValue().length) {
	        top = left = height = 0;
	        text = '';
	    } else {
	        text = doc.getRange({
	            line: startLine,
	            ch: startCh
	        }, {
	            line: endLine,
	            ch: endCh
	        });

	        rect = this.cm.charCoords({
	            line: endLine,
	            ch: endCh
	        }, 'local');

	        top = rect.top;
	        left = rect.left;
	        height = rect.bottom - rect.top;
	    }

	    return {
	        text: text,
	        top: top,
	        left: left,
	        height: height
	    };
	};

	/**
	 * getMarkerInfoOfCurrentSelection
	 * Get marker info of current selection
	 * @returns {object} marker
	 */
	MarkdownMarkerHelper.prototype.getMarkerInfoOfCurrentSelection = function() {
	    var doc = this.cm.getDoc(),
	        selection, start, end, info, foundCursor;

	    selection = this._getSelection();

	    start = doc.getRange({
	        line: 0,
	        ch: 0
	    }, selection.anchor).replace(FIND_CRLF_RX, '').length;

	    end = start + doc.getSelection().replace(FIND_CRLF_RX, '').length;

	    foundCursor = this._findOffsetCursor([start, end]);

	    info = this._getExtraInfoOfRange(foundCursor[0].line,
	                                     foundCursor[0].ch,
	                                     foundCursor[1].line,
	                                     foundCursor[1].ch);

	    return {
	        start: start,
	        end: end,
	        text: info.text.replace(FIND_CRLF_RX, ' '),
	        top: info.top,
	        left: info.left,
	        height: info.height
	    };
	};

	/**
	 * _getSelection
	 * Get selection of CodeMirror, if selection is reversed then correct it
	 * @returns {object} selection
	 */
	MarkdownMarkerHelper.prototype._getSelection = function() {
	    var selection, head, anchor, isReversedSelection, temp;

	    selection = this.cm.getDoc().listSelections()[0];
	    anchor = selection.anchor;
	    head = selection.head;

	    isReversedSelection = (anchor.line > head.line) || (anchor.line === head.line && anchor.ch > head.ch);

	    if (isReversedSelection) {
	        temp = head;
	        head = anchor;
	        anchor = temp;
	    }

	    return {
	        anchor: anchor,
	        head: head
	    };
	};

	/**
	 * _findOffsetCursor
	 * Find offset cursor by given offset list
	 * @param {Array.<number>} offsetlist offset list
	 * @returns {Array.<object>} offset cursors
	 */
	MarkdownMarkerHelper.prototype._findOffsetCursor = function(offsetlist) {
	    var doc = this.cm.getDoc();
	    var currentLength = 0;
	    var beforeLength = 0;
	    var result = [];
	    var offsetIndex = 0;
	    var lineLength = doc.lineCount();
	    var lineIndex;

	    for (lineIndex = 0; lineIndex < lineLength; lineIndex += 1) {
	        currentLength += doc.getLine(lineIndex).length;

	        while (currentLength >= offsetlist[offsetIndex]) {
	            result.push({
	                line: lineIndex,
	                ch: offsetlist[offsetIndex] - beforeLength
	            });

	            offsetIndex += 1;

	            if (util.isUndefined(offsetlist[offsetIndex])) {
	                return result;
	            }
	        }

	        beforeLength = currentLength;
	    }

	    while (!util.isUndefined(offsetlist[offsetIndex])) {
	        result.push({
	            line: lineIndex,
	            ch: currentLength - beforeLength
	        });

	        offsetIndex += 1;
	    }

	    return result;
	};

	/**
	 * selectOffsetRange
	 * Make selection with given offset range
	 * @param {number} start start offset
	 * @param {number} end end offset
	 */
	MarkdownMarkerHelper.prototype.selectOffsetRange = function(start, end) {
	    var foundCursor = this._findOffsetCursor([start, end]);

	    this.cm.setSelection({
	        line: foundCursor[0].line,
	        ch: foundCursor[0].ch
	    }, {
	        line: foundCursor[1].line,
	        ch: foundCursor[1].ch
	    });
	};

	/**
	 * clearSelect
	 * Clear selection of CodeMirror
	 */
	MarkdownMarkerHelper.prototype.clearSelect = function() {
	    var selection = this.cm.getDoc().listSelections()[0];

	    if (selection) {
	        this.cm.setCursor(selection.to());
	    }
	};

	module.exports = MarkdownMarkerHelper;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var MarkdownEditor = __webpack_require__(23),
	    Preview = __webpack_require__(26),
	    WysiwygEditor = __webpack_require__(28),
	    Layout = __webpack_require__(41),
	    EventManager = __webpack_require__(42),
	    CommandManager = __webpack_require__(43),
	    extManager = __webpack_require__(6),
	    ImportManager = __webpack_require__(45),
	    Convertor = __webpack_require__(47),
	    ViewOnly = __webpack_require__(49),
	    markedRenderer = __webpack_require__(48),
	    DefaultUI = __webpack_require__(50);


	//markdown commands
	var mdBold = __webpack_require__(61),
	    mdItalic = __webpack_require__(62),
	    mdStrike = __webpack_require__(63),
	    mdBlockquote = __webpack_require__(64),
	    mdHeading = __webpack_require__(65),
	    mdHR = __webpack_require__(66),
	    mdAddLink = __webpack_require__(67),
	    mdAddImage = __webpack_require__(68),
	    mdUL = __webpack_require__(69),
	    mdOL = __webpack_require__(70),
	    mdTable = __webpack_require__(71),
	    mdTask = __webpack_require__(72),
	    mdCode = __webpack_require__(73),
	    mdCodeBlock = __webpack_require__(74);

	//wysiwyg Commands
	var wwBold = __webpack_require__(75),
	    wwItalic = __webpack_require__(76),
	    wwStrike = __webpack_require__(77),
	    wwBlockquote = __webpack_require__(78),
	    wwAddImage = __webpack_require__(79),
	    wwAddLink = __webpack_require__(80),
	    wwHR = __webpack_require__(81),
	    wwHeading = __webpack_require__(82),
	    wwUL = __webpack_require__(83),
	    wwOL = __webpack_require__(84),
	    wwTable = __webpack_require__(85),
	    wwTableAddRow = __webpack_require__(86),
	    wwTableAddCol = __webpack_require__(87),
	    wwTableRemoveRow = __webpack_require__(88),
	    wwTableRemoveCol = __webpack_require__(89),
	    wwTableRemove = __webpack_require__(90),
	    wwIncreaseDepth = __webpack_require__(91),
	    wwDecreaseDepth = __webpack_require__(92),
	    wwTask = __webpack_require__(93),
	    wwCode = __webpack_require__(94),
	    wwCodeBlock = __webpack_require__(95);

	var util = tui.util;

	var __nedInstance = [];

	/**
	 * ToastUI Editor
	 * @exports ToastUIEditor
	 * @constructor
	 * @class ToastUIEditor
	 * @param {object} options Option object
	     * @param {number} options.height Editor's height (px)
	     * @param {string} options.initialValue Editor's initial value
	     * @param {string} options.previewStyle Markdown editor's preview style (tab, vertical)
	     * @param {string} options.initialEditType Initial editor type (markdown, wysiwyg)
	     * @param {object} options.events eventlist Event list
	         * @param {function} options.events.load It would be emitted when editor fully load
	         * @param {function} options.events.change It would be emitted when content changed
	         * @param {function} options.events.stateChange It would be emitted when format change by cursor position
	         * @param {function} options.events.focus It would be emitted when editor get focus
	         * @param {function} options.events.blur It would be emitted when editor loose focus
	     * @param {object} options.hooks Hook list
	         * @param {function} options.hooks.previewBeforeHook Submit preview to hook URL before preview be shown
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

	    this.layout = new Layout(options, this.eventManager);

	    this.setUI(this.options.UI || new DefaultUI(this));

	    this.mdEditor = new MarkdownEditor(this.layout.getMdEditorContainerEl(), this.eventManager);
	    this.preview = new Preview(this.layout.getPreviewEl(), this.eventManager, this.convertor);
	    this.wwEditor = WysiwygEditor.factory(this.layout.getWwEditorContainerEl(), this.eventManager);

	    this.changePreviewStyle(this.options.previewStyle);

	    this.mdEditor.init();

	    this.changeMode(self.options.initialEditType);

	    this.contentHeight(self.options.height);

	    this.setValue(self.options.initialValue);

	    extManager.applyExtension(self, self.options.exts);

	    this.eventManager.emit('load', self);

	    __nedInstance.push(this);
	}

	/**
	 * 프리뷰가 보여지는 방식을 변경한다
	 * @api
	 * @memberOf ToastUIEditor
	 * @param {string} style 스타일 이름 tab, vertical
	 */
	ToastUIEditor.prototype.changePreviewStyle = function(style) {
	    this.layout.changePreviewStyle(style);
	    this.mdPreviewStyle = style;
	    this.eventManager.emit('changePreviewStyle', style);
	};

	/**
	 * call commandManager's exec method
	 * @api
	 * @memberOf ToastUIEditor
	 */
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

	/**
	 * Bind eventHandler to event type
	 * @api
	 * @memberOf ToastUIEditor
	 * @param {string} type Event type
	 * @param {function} handler Event handler
	 */
	ToastUIEditor.prototype.on = function(type, handler) {
	    this.eventManager.listen(type, handler);
	};

	/**
	 * Unbind eventHandler from event type
	 * @api
	 * @memberOf ToastUIEditor
	 * @param {string} type Event type
	 */
	ToastUIEditor.prototype.off = function(type) {
	    this.eventManager.removeEventHandler(type);
	};

	/**
	 * Add hook to TUIEditor event
	 * @api
	 * @memberOf ToastUIEditor
	 * @param {string} type Event type
	 * @param {function} handler Event handler
	 */
	ToastUIEditor.prototype.addHook = function(type, handler) {
	    this.eventManager.removeEventHandler(type);
	    this.eventManager.listen(type, handler);
	};

	/**
	 * Remove hook from TUIEditor event
	 * @api
	 * @memberOf ToastUIEditor
	 * @param {string} type Event type
	 */
	ToastUIEditor.prototype.removeHook = function(type) {
	    this.eventManager.removeEventHandler(type);
	};

	/**
	 * Get CodeMirror instance
	 * @api
	 * @memberOf ToastUIEditor
	 * @returns {CodeMirror}
	 */
	ToastUIEditor.prototype.getCodeMirror = function() {
	    return this.mdEditor.getEditor();
	};

	/**
	 * Get SquireExt instance
	 * @api
	 * @memberOf ToastUIEditor
	 * @returns {SquireExt}
	 */
	ToastUIEditor.prototype.getSquire = function() {
	    return this.wwEditor.getEditor();
	};

	/**
	 * Set focus to current Editor
	 * @api
	 * @memberOf ToastUIEditor
	 */
	ToastUIEditor.prototype.focus = function() {
	    this.getCurrentModeEditor().focus();
	};

	/**
	 * Set cursor position to end
	 * @api
	 * @memberOf ToastUIEditor
	 */
	ToastUIEditor.prototype.moveCursorToEnd = function() {
	    this.getCurrentModeEditor().moveCursorToEnd();
	};

	/**
	 * Set cursor position to start
	 * @api
	 * @memberOf ToastUIEditor
	 */
	ToastUIEditor.prototype.moveCursorToStart = function() {
	    this.getCurrentModeEditor().moveCursorToStart();
	};

	/**
	 * Set Editor value
	 * @api
	 * @memberOf ToastUIEditor
	 * @param {string} markdown Markdown syntax text
	 */
	ToastUIEditor.prototype.setValue = function(markdown) {
	    markdown = markdown || '';

	    if (this.isMarkdownMode()) {
	        this.mdEditor.setValue(markdown);
	    } else {
	        this.wwEditor.setValue(this.convertor.toHTML(markdown));
	    }

	    this.eventManager.emit('setValueAfter', markdown);
	};

	/**
	 * Get editor value
	 * @api
	 * @memberOf ToastUIEditor
	 * @returns {string}
	 */
	ToastUIEditor.prototype.getValue = function() {
	    var markdown;

	    if (this.isMarkdownMode()) {
	        markdown = this.mdEditor.getValue();
	    } else {
	        markdown = this.convertor.toMarkdown(this.wwEditor.getValue());
	    }

	    return markdown;
	};

	/**
	 * Add widget to selection
	 * @api
	 * @memberOf ToastUIEditor
	 * @param {Range} selection Current selection
	 * @param {Node} node widget node
	 * @param {string} style Adding style "over" or "bottom"
	 * @param {number} [offset] Offset for adjust position
	 */
	ToastUIEditor.prototype.addWidget = function(selection, node, style, offset) {
	    this.getCurrentModeEditor().addWidget(selection, node, style, offset);
	};

	/**
	 * Set and return content area height
	 * @api
	 * @memberOf ToastUIEditor
	 * @param {number} height Content area height
	 * @returns {number}
	 */
	ToastUIEditor.prototype.contentHeight = function(height) {
	    if (height) {
	        this._contentHeight = height;
	        this.mdEditor.setHeight(height);
	        this.preview.setHeight(height);
	        this.wwEditor.setHeight(height);
	    }

	    return this._contentHeight;
	};

	/**
	 * Get current editor mode name
	 * @api
	 * @memberOf ToastUIEditor
	 * @returns {string}
	 */
	ToastUIEditor.prototype.getCurrentModeEditor = function() {
	    var editor;

	    if (this.isMarkdownMode()) {
	        editor = this.mdEditor;
	    } else {
	        editor = this.wwEditor;
	    }

	    return editor;
	};

	/**
	 * Return true if current editor mode is Markdown
	 * @api
	 * @memberOf ToastUIEditor
	 * @returns {boolean}
	 */
	ToastUIEditor.prototype.isMarkdownMode = function() {
	    return this.currentMode === 'markdown';
	};

	/**
	 * Return true if current editor mode is WYSIWYG
	 * @api
	 * @memberOf ToastUIEditor
	 * @returns {boolean}
	 */
	ToastUIEditor.prototype.isWysiwygMode = function() {
	    return this.currentMode === 'wysiwyg';
	};

	/**
	 * Return false
	 * @api
	 * @memberOf ToastUIEditor
	 * @returns {boolean}
	 */
	ToastUIEditor.prototype.isViewOnly = function() {
	    return false;
	};

	/**
	 * Get current Markdown editor's preview style
	 * @api
	 * @memberOf ToastUIEditor
	 * @returns {string}
	 */
	ToastUIEditor.prototype.getCurrentPreviewStyle = function() {
	    return this.mdPreviewStyle;
	};

	/**
	 * Change editor's mode to given mode string
	 * @api
	 * @memberOf ToastUIEditor
	 * @param {string} mode Editor mode name of want to change
	 */
	ToastUIEditor.prototype.changeMode = function(mode) {
	    if (this.currentMode === mode) {
	        return;
	    }

	    this.currentMode = mode;

	    if (this.isWysiwygMode()) {
	        this.layout.switchToWYSIWYG();
	        this.wwEditor.setValue(this.convertor.toHTML(this.mdEditor.getValue()));
	        this.eventManager.emit('changeModeToWysiwyg');
	    } else {
	        this.layout.switchToMarkdown();
	        this.mdEditor.setValue(this.convertor.toMarkdown(this.wwEditor.getValue()));
	        this.getCodeMirror().refresh();
	        this.eventManager.emit('changeModeToMarkdown');
	    }

	    this.eventManager.emit('changeMode', mode);

	    this.focus();
	};

	/**
	 * Remove TUIEditor from document
	 * @api
	 * @memberOf ToastUIEditor
	 */
	ToastUIEditor.prototype.remove = function() {
	    var self = this;
	    var i = __nedInstance.length - 1;
	    this.wwEditor.remove();
	    this.mdEditor.remove();
	    this.layout.remove();

	    if (this.getUI()) {
	        this.getUI().remove();
	    }

	    this.eventManager.emit('removeEditor');
	    this.eventManager.events.forEach(function(value, key) {
	        self.off(key);
	    });
	    this.eventManager = null;

	    for (; i >= 0; i -= 1) {
	        if (__nedInstance[i] === this) {
	            __nedInstance.splice(i, 1);
	        }
	    }
	};

	/**
	 * Hide TUIEditor
	 * @api
	 * @memberOf ToastUIEditor
	 */
	ToastUIEditor.prototype.hide = function() {
	    this.eventManager.emit('hide', this);
	};

	/**
	 * Show TUIEditor
	 * @api
	 * @memberOf ToastUIEditor
	 */
	ToastUIEditor.prototype.show = function() {
	    this.eventManager.emit('show', this);
	    this.getCodeMirror().refresh();
	};

	/**
	 * Scroll Editor content to Top
	 * @api
	 * @memberOf ToastUIEditor
	 * @param {number} value Scroll amount
	 * @returns {number}
	 */
	ToastUIEditor.prototype.scrollTop = function(value) {
	    return this.getCurrentModeEditor().scrollTop(value);
	};

	/**
	 * Set UI to private UI property
	 * @api
	 * @memberOf ToastUIEditor
	 * @param {UI} UI UI instance
	 */
	ToastUIEditor.prototype.setUI = function(UI) {
	    this._ui = UI;
	};

	/**
	 * Get _ui property
	 * @api
	 * @memberOf ToastUIEditor
	 * @returns {UI}
	 */
	ToastUIEditor.prototype.getUI = function() {
	    return this._ui;
	};

	/**
	 * Reset TUIEditor
	 * @api
	 * @memberOf ToastUIEditor
	 */
	ToastUIEditor.prototype.reset = function() {
	    this.wwEditor.reset();
	    this.mdEditor.reset();
	};

	/**
	 * Get current range
	 * @api
	 * @memberOf ToastUIEditor
	 * @returns {{start, end}|Range}
	 */
	ToastUIEditor.prototype.getRange = function() {
	    return this.getCurrentModeEditor().getRange();
	};

	/**
	 * Get text object of current range
	 * @api
	 * @memberOf ToastUIEditor
	 * @param {{start, end}|Range} range Range object of each editor
	 * @returns {object} TextObject class
	 */
	ToastUIEditor.prototype.getTextObject = function(range) {
	    return this.getCurrentModeEditor().getTextObject(range);
	};

	/**
	 * Get instance of TUIEditor
	 * @api
	 * @memberOf ToastUIEditor
	 * @returns {Array}
	 */
	ToastUIEditor.getInstances = function() {
	    return __nedInstance;
	};

	/**
	 * Define extension
	 * @api
	 * @memberOf ToastUIEditor
	 * @param {string} name Extension name
	 * @param {ExtManager~extension} ext extension
	 */
	ToastUIEditor.defineExtension = function(name, ext) {
	    extManager.defineExtension(name, ext);
	};

	/**
	 * Factory method for Editor
	 * @api
	 * @memberOf ToastUIEditor
	 * @param {object} options Option for initialize TUIEditor
	 * @returns {ToastUIEditor}
	 */
	ToastUIEditor.factory = function(options) {
	    var tuiEditor;

	    if (options.viewOnly) {
	        tuiEditor = new ViewOnly(options);
	    } else {
	        tuiEditor = new ToastUIEditor(options);

	        tuiEditor.addCommand(mdBold);
	        tuiEditor.addCommand(mdItalic);
	        tuiEditor.addCommand(mdBlockquote);
	        tuiEditor.addCommand(mdHeading);
	        tuiEditor.addCommand(mdHR);
	        tuiEditor.addCommand(mdAddLink);
	        tuiEditor.addCommand(mdAddImage);
	        tuiEditor.addCommand(mdUL);
	        tuiEditor.addCommand(mdOL);
	        tuiEditor.addCommand(mdTable);
	        tuiEditor.addCommand(mdTask);
	        tuiEditor.addCommand(mdCode);
	        tuiEditor.addCommand(mdCodeBlock);
	        tuiEditor.addCommand(mdStrike);

	        tuiEditor.addCommand(wwBold);
	        tuiEditor.addCommand(wwItalic);
	        tuiEditor.addCommand(wwBlockquote);
	        tuiEditor.addCommand(wwUL);
	        tuiEditor.addCommand(wwOL);
	        tuiEditor.addCommand(wwAddImage);
	        tuiEditor.addCommand(wwAddLink);
	        tuiEditor.addCommand(wwHR);
	        tuiEditor.addCommand(wwHeading);
	        tuiEditor.addCommand(wwIncreaseDepth);
	        tuiEditor.addCommand(wwDecreaseDepth);
	        tuiEditor.addCommand(wwTask);
	        tuiEditor.addCommand(wwTable);
	        tuiEditor.addCommand(wwTableAddRow);
	        tuiEditor.addCommand(wwTableAddCol);
	        tuiEditor.addCommand(wwTableRemoveRow);
	        tuiEditor.addCommand(wwTableRemoveCol);
	        tuiEditor.addCommand(wwTableRemove);
	        tuiEditor.addCommand(wwCode);
	        tuiEditor.addCommand(wwCodeBlock);
	        tuiEditor.addCommand(wwStrike);
	    }

	    return tuiEditor;
	};

	/**
	 * Marked renderer
	 * @api
	 * @memberOf ToastUIEditor
	 * @type {marked.renderer}
	 */
	ToastUIEditor.markedRenderer = markedRenderer;

	module.exports = ToastUIEditor;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var keyMapper = __webpack_require__(24).getSharedInstance();
	var MdTextObject = __webpack_require__(25);

	var CodeMirror = window.CodeMirror;

	/**
	 * MarkdownEditor
	 * @exports MarkdownEditor
	 * @constructor
	 * @class MarkdownEditor
	 * @param {jQuery} $el element to insert editor
	 * @param {EventManager} eventManager EventManager instance
	 */
	function MarkdownEditor($el, eventManager) {
	    this.eventManager = eventManager;
	    this.$editorContainerEl = $el;

	    this._latestState = {
	        bold: false,
	        italic: false
	    };
	}

	/**
	 * init
	 * @api
	 * @memberOf WysiwygEditor
	 * @param {string} initialValue Editor's initial content
	 */
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
	            'Enter': 'newlineAndIndentContinue',
	            'Tab': 'subListIndentTab',
	            'Shift-Tab': 'indentLess'
	        },
	        indentUnit: 4
	    });

	    this._initEvent();
	};

	/**
	 * _initEvent
	 * Initialize EventManager event handler
	 * @memberOf MarkdownEditor
	 * @private
	 */
	MarkdownEditor.prototype._initEvent = function() {
	    var self = this;

	    this.cm.getWrapperElement().addEventListener('click', function() {
	        self.eventManager.emit('click', {
	            source: 'markdown'
	        });
	    });

	    this.cm.on('beforeChange', function(cm, ev) {
	        if (ev.origin === 'paste') {
	            self.eventManager.emit('pasteBefore', {source: 'markdown', data: ev});
	        }
	    });

	    this.cm.on('change', function(cm, cmEvent) {
	        self._emitMarkdownEditorContentChangedEvent();
	        self._emitMarkdownEditorChangeEvent(cmEvent);
	    });

	    this.cm.on('focus', function() {
	        self.eventManager.emit('focus', {
	            source: 'markdown'
	        });
	        self.getEditor().refresh();
	    });

	    this.cm.on('blur', function() {
	        self.eventManager.emit('blur', {
	            source: 'markdown'
	        });
	    });

	    this.cm.on('scroll', function(cm, eventData) {
	        self.eventManager.emit('scroll', {
	            source: 'markdown',
	            data: eventData
	        });
	    });

	    this.cm.on('keydown', function(cm, keyboardEvent) {
	        self.eventManager.emit('keydown', {
	            source: 'markdown',
	            data: keyboardEvent
	        });

	        self.eventManager.emit('keyMap', {
	            source: 'markdown',
	            keyMap: keyMapper.convert(keyboardEvent),
	            data: keyboardEvent
	        });
	    });

	    this.cm.on('keyup', function(cm, keyboardEvent) {
	        self.eventManager.emit('keyup', {
	            source: 'markdown',
	            data: keyboardEvent
	        });
	    });

	    this.cm.on('paste', function(cm, clipboardEvent) {
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
	        var token, state, base, overlay;

	        token = self.cm.getTokenAt(self.cm.getCursor());

	        base = token.state.base;
	        overlay = token.state.overlay;

	        state = {
	            bold: !!base.strong,
	            italic: !!base.em,
	            code: !!overlay.code,
	            codeBlock: !!overlay.codeBlock,
	            source: 'markdown'
	        };

	        if (self._isStateChanged(self._latestState, state)) {
	            self.eventManager.emit('stateChange', state);
	            self._latestState = state;
	        }
	    });
	};

	/**
	 * getCurrentRange
	 * returns current selection's range
	 * @api
	 * @memberOf MarkdownEditor
	 * @returns {object} selection range
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

	/**
	 * Set focus to current Editor
	 * @api
	 * @memberOf MarkdownEditor
	 */
	MarkdownEditor.prototype.focus = function() {
	    this.cm.focus();
	};

	/**
	 * Remove Editor from document
	 * @api
	 * @memberOf MarkdownEditor
	 */
	MarkdownEditor.prototype.remove = function() {
	    this.cm.toTextArea();
	};

	/**
	 * Set Editor value
	 * @api
	 * @memberOf MarkdownEditor
	 * @param {string} markdown Markdown syntax text
	 */
	MarkdownEditor.prototype.setValue = function(markdown) {
	    this.getEditor().setValue(markdown);
	    this._emitMarkdownEditorContentChangedEvent();
	    this.moveCursorToEnd();
	    this.getEditor().refresh();
	};

	/**
	 * Get editor value
	 * @api
	 * @memberOf MarkdownEditor
	 * @returns {string}
	 */
	MarkdownEditor.prototype.getValue = function() {
	    return this.cm.getValue('\n');
	};

	/**
	 * Get CodeMirror instance
	 * @api
	 * @memberOf MarkdownEditor
	 * @returns {CodeMirror}
	 */
	MarkdownEditor.prototype.getEditor = function() {
	    return this.cm;
	};

	/**
	 * Reset Editor
	 * @api
	 * @memberOf MarkdownEditor
	 */
	MarkdownEditor.prototype.reset = function() {
	    this.setValue('');
	};

	/**
	 * Emit contentChangedFromMarkdown event
	 * @memberOf MarkdownEditor
	 * @private
	 */
	MarkdownEditor.prototype._emitMarkdownEditorContentChangedEvent = function() {
	    this.eventManager.emit('contentChangedFromMarkdown', this);
	};

	/**
	 * Clone CodeMirror event object
	 * @memberOf MarkdownEditor
	 * @param {event} e Event object
	 * @returns {{from: {line: number, ch: number}, to: {line: number, ch: number}}}
	 * @private
	 */
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

	/**
	 * Emit changeEvent
	 * @memberOf MarkdownEditor
	 * @param {event} e Event object
	 * @private
	 */
	MarkdownEditor.prototype._emitMarkdownEditorChangeEvent = function(e) {
	    var eventObj;

	    if (e.origin !== 'setValue') {
	        eventObj = {
	            source: 'markdown'
	        };

	        this.eventManager.emit('changeFromMarkdown', eventObj);
	        this.eventManager.emit('change', eventObj);
	    }
	};

	/**
	 * Get current caret position
	 * @api
	 * @memberOf MarkdownEditor
	 * @returns {{from: {line: number, ch: number}, to: {line: number, ch: number}}}
	 */
	MarkdownEditor.prototype.getCaretPosition = function() {
	    return this.cm.cursorCoords();
	};

	/**
	 * Add widget
	 * @api
	 * @memberOf MarkdownEditor
	 * @param {object} selection Selection object
	 * @param {HTMLElement} node Widget node
	 * @param {string} style Adding style "over" or "bottom"
	 * @param {number} offset Adding offset
	 */
	MarkdownEditor.prototype.addWidget = function(selection, node, style, offset) {
	    if (offset) {
	        selection.ch += offset;
	    }

	    this.cm.addWidget(selection.end, node, true, style);
	};

	/**
	 * Replace selection with given replacement content
	 * @api
	 * @memberOf MarkdownEditor
	 * @param {string} content Replacement content text
	 * @param {object} selection Selection object
	 */
	MarkdownEditor.prototype.replaceSelection = function(content, selection) {
	    if (selection) {
	        this.cm.setSelection(selection.from, selection.to);
	    }

	    this.cm.replaceSelection(content);
	    this.focus();
	};

	/**
	 * Replace selection with replacement content and offset
	 * @api
	 * @memberOf MarkdownEditor
	 * @param {string} content Replacement content text
	 * @param {number} offset Offset
	 * @param {number} overwriteLength Length to overwrite
	 */
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

	/**
	 * Set Editor height
	 * @api
	 * @memberOf MarkdownEditor
	 * @param {number} height Editor height
	 */
	MarkdownEditor.prototype.setHeight = function(height) {
	    this.$editorContainerEl.height(height);

	    if (height === 'auto') {
	        this.$editorContainerEl.find('.CodeMirror').height('auto');
	    }
	};

	/**
	 * Set cursor position to end
	 * @api
	 * @memberOf MarkdownEditor
	 */
	MarkdownEditor.prototype.moveCursorToEnd = function() {
	    var doc = this.getEditor().getDoc(),
	        lastLine = doc.lastLine();

	    doc.setCursor(lastLine, doc.getLine(lastLine).length);
	};

	/**
	 * Set cursor position to start
	 * @api
	 * @memberOf MarkdownEditor
	 */
	MarkdownEditor.prototype.moveCursorToStart = function() {
	    var doc = this.getEditor().getDoc(),
	        firstLine = doc.firstLine();

	    doc.setCursor(firstLine, 0);
	};

	/**
	 * Scroll Editor content to Top
	 * @api
	 * @memberOf MarkdownEditor
	 * @param {number} value Scroll amount
	 * @returns {number}
	 */
	MarkdownEditor.prototype.scrollTop = function(value) {
	    if (value) {
	        this.cm.scrollTo(0, value);
	    }

	    return this.cm.getScrollInfo().top;
	};

	/**
	 * Get start, end position of current selection
	 * @api
	 * @memberOf MarkdownEditor
	 * @returns {{start: {line: *, ch: *}, end: {line: *, ch: *}}}
	 */
	MarkdownEditor.prototype.getRange = function() {
	    var start = this.getEditor().getCursor('from');
	    var end = this.getEditor().getCursor('to');

	    return {
	        start: {
	            line: start.line,
	            ch: start.ch
	        },
	        end: {
	            line: end.line,
	            ch: end.ch
	        }
	    };
	};

	/**
	 * Get text object of current range
	 * @api
	 * @memberOf MarkdownEditor
	 * @param {{start, end}} range Range object of each editor
	 * @returns {object}
	 */
	MarkdownEditor.prototype.getTextObject = function(range) {
	    return new MdTextObject(this, range);
	};

	/**
	 * Return whether state changed or not
	 * @memberOf MarkdownEditor
	 * @param {object} previousState Previous state
	 * @param {object} currentState Current state
	 * @returns {boolean}
	 * @private
	 */
	MarkdownEditor.prototype._isStateChanged = function(previousState, currentState) {
	    var result = false;

	    tui.util.forEach(currentState, function(currentStateTypeValue, stateType) {
	        var isNeedToContinue = true;
	        var isStateChanged = previousState[stateType] !== currentStateTypeValue;

	        if (isStateChanged) {
	            result = true;
	            isNeedToContinue = false;
	        }

	        return isNeedToContinue;
	    });

	    return result;
	};

	module.exports = MarkdownEditor;


/***/ },
/* 24 */
/***/ function(module, exports) {

	/**
	 * @fileoverview Implements KeyMapper
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	/**
	 * Constant of key mapping
	 * @type {string[]}
	 */
	var KEYBOARD_MAP = [
	    '', // [0]
	    '', // [1]
	    '', // [2]
	    'CANCEL', // [3]
	    '', // [4]
	    '', // [5]
	    'HELP', // [6]
	    '', // [7]
	    'BACK_SPACE', // [8]
	    'TAB', // [9]
	    '', // [10]
	    '', // [11]
	    'CLEAR', // [12]
	    'ENTER', // [13]
	    'ENTER_SPECIAL', // [14]
	    '', // [15]
	    '', // [16] SHIFT
	    '', // [17] CONTROL
	    '', // [18] ALT
	    'PAUSE', // [19]
	    'CAPS_LOCK', // [20]
	    'KANA', // [21]
	    'EISU', // [22]
	    'JUNJA', // [23]
	    'FINAL', // [24]
	    'HANJA', // [25]
	    '', // [26]
	    'ESCAPE', // [27]
	    'CONVERT', // [28]
	    'NONCONVERT', // [29]
	    'ACCEPT', // [30]
	    'MODECHANGE', // [31]
	    'SPACE', // [32]
	    'PAGE_UP', // [33]
	    'PAGE_DOWN', // [34]
	    'END', // [35]
	    'HOME', // [36]
	    'LEFT', // [37]
	    'UP', // [38]
	    'RIGHT', // [39]
	    'DOWN', // [40]
	    'SELECT', // [41]
	    'PRINT', // [42]
	    'EXECUTE', // [43]
	    'PRINTSCREEN', // [44]
	    'INSERT', // [45]
	    'DELETE', // [46]
	    '', // [47]
	    '0', // [48]
	    '1', // [49]
	    '2', // [50]
	    '3', // [51]
	    '4', // [52]
	    '5', // [53]
	    '6', // [54]
	    '7', // [55]
	    '8', // [56]
	    '9', // [57]
	    ':', // [58]
	    ';', // [59]
	    '<', // [60]
	    '=', // [61]
	    '>', // [62]
	    '?', // [63]
	    'AT', // [64]
	    'A', // [65]
	    'B', // [66]
	    'C', // [67]
	    'D', // [68]
	    'E', // [69]
	    'F', // [70]
	    'G', // [71]
	    'H', // [72]
	    'I', // [73]
	    'J', // [74]
	    'K', // [75]
	    'L', // [76]
	    'M', // [77]
	    'N', // [78]
	    'O', // [79]
	    'P', // [80]
	    'Q', // [81]
	    'R', // [82]
	    'S', // [83]
	    'T', // [84]
	    'U', // [85]
	    'V', // [86]
	    'W', // [87]
	    'X', // [88]
	    'Y', // [89]
	    'Z', // [90]
	    '', // [91] META
	    '', // [92]
	    'CONTEXT_MENU', // [93]
	    '', // [94]
	    'SLEEP', // [95]
	    'NUMPAD0', // [96]
	    'NUMPAD1', // [97]
	    'NUMPAD2', // [98]
	    'NUMPAD3', // [99]
	    'NUMPAD4', // [100]
	    'NUMPAD5', // [101]
	    'NUMPAD6', // [102]
	    'NUMPAD7', // [103]
	    'NUMPAD8', // [104]
	    'NUMPAD9', // [105]
	    'MULTIPLY', // [106]
	    'ADD', // [107]
	    'SEPARATOR', // [108]
	    'SUBTRACT', // [109]
	    'DECIMAL', // [110]
	    'DIVIDE', // [111]
	    'F1', // [112]
	    'F2', // [113]
	    'F3', // [114]
	    'F4', // [115]
	    'F5', // [116]
	    'F6', // [117]
	    'F7', // [118]
	    'F8', // [119]
	    'F9', // [120]
	    'F10', // [121]
	    'F11', // [122]
	    'F12', // [123]
	    'F13', // [124]
	    'F14', // [125]
	    'F15', // [126]
	    'F16', // [127]
	    'F17', // [128]
	    'F18', // [129]
	    'F19', // [130]
	    'F20', // [131]
	    'F21', // [132]
	    'F22', // [133]
	    'F23', // [134]
	    'F24', // [135]
	    '', // [136]
	    '', // [137]
	    '', // [138]
	    '', // [139]
	    '', // [140]
	    '', // [141]
	    '', // [142]
	    '', // [143]
	    'NUM_LOCK', // [144]
	    'SCROLL_LOCK', // [145]
	    'WIN_OEM_FJ_JISHO', // [146]
	    'WIN_OEM_FJ_MASSHOU', // [147]
	    'WIN_OEM_FJ_TOUROKU', // [148]
	    'WIN_OEM_FJ_LOYA', // [149]
	    'WIN_OEM_FJ_ROYA', // [150]
	    '', // [151]
	    '', // [152]
	    '', // [153]
	    '', // [154]
	    '', // [155]
	    '', // [156]
	    '', // [157]
	    '', // [158]
	    '', // [159]
	    '@', // [160]
	    '!', // [161]
	    '"', // [162]
	    '#', // [163]
	    '$', // [164]
	    '%', // [165]
	    '&', // [166]
	    '_', // [167]
	    '(', // [168]
	    ')', // [169]
	    '*', // [170]
	    '+', // [171]
	    '|', // [172]
	    '-', // [173]
	    '{', // [174]
	    '}', // [175]
	    '~', // [176]
	    '', // [177]
	    '', // [178]
	    '', // [179]
	    '', // [180]
	    'VOLUME_MUTE', // [181]
	    'VOLUME_DOWN', // [182]
	    'VOLUME_UP', // [183]
	    '', // [184]
	    '', // [185]
	    ';', // [186]
	    '=', // [187]
	    ',', // [188]
	    '-', // [189]
	    '.', // [190]
	    '/', // [191]
	    '`', // [192]
	    '', // [193]
	    '', // [194]
	    '', // [195]
	    '', // [196]
	    '', // [197]
	    '', // [198]
	    '', // [199]
	    '', // [200]
	    '', // [201]
	    '', // [202]
	    '', // [203]
	    '', // [204]
	    '', // [205]
	    '', // [206]
	    '', // [207]
	    '', // [208]
	    '', // [209]
	    '', // [210]
	    '', // [211]
	    '', // [212]
	    '', // [213]
	    '', // [214]
	    '', // [215]
	    '', // [216]
	    '', // [217]
	    '', // [218]
	    '[', // [219]
	    '\\', // [220]
	    ']', // [221]
	    '\'', // [222]
	    '', // [223]
	    'META', // [224]
	    'ALTGR', // [225]
	    '', // [226]
	    'WIN_ICO_HELP', // [227]
	    'WIN_ICO_00', // [228]
	    '', // [229]
	    'WIN_ICO_CLEAR', // [230]
	    '', // [231]
	    '', // [232]
	    'WIN_OEM_RESET', // [233]
	    'WIN_OEM_JUMP', // [234]
	    'WIN_OEM_PA1', // [235]
	    'WIN_OEM_PA2', // [236]
	    'WIN_OEM_PA3', // [237]
	    'WIN_OEM_WSCTRL', // [238]
	    'WIN_OEM_CUSEL', // [239]
	    'WIN_OEM_ATTN', // [240]
	    'WIN_OEM_FINISH', // [241]
	    'WIN_OEM_COPY', // [242]
	    'WIN_OEM_AUTO', // [243]
	    'WIN_OEM_ENLW', // [244]
	    'WIN_OEM_BACKTAB', // [245]
	    'ATTN', // [246]
	    'CRSEL', // [247]
	    'EXSEL', // [248]
	    'EREOF', // [249]
	    'PLAY', // [250]
	    'ZOOM', // [251]
	    '', // [252]
	    'PA1', // [253]
	    'WIN_OEM_CLEAR', // [254]
	    '' // [255]
	];

	var sharedInstance;

	/**
	 * KeyMapper
	 * @exports KeyMapper
	 * @constructor
	 * @class KeyMapper
	 * @param {object} [options] options
	 *    @param {string} options.splitter splitter string default is +
	 */
	function KeyMapper(options) {
	    this._setSplitter(options);
	}

	/**
	 * Set key splitter
	 * @param {object} options Option object
	 * @memberOf KeyMapper
	 * @private
	 */
	KeyMapper.prototype._setSplitter = function(options) {
	    var splitter = options ? options.splitter : '+';
	    this._splitter = splitter;
	};
	/**
	 * Convert event to keyMap
	 * @api
	 * @memberOf KeyMapper
	 * @param {event} event Event object
	 * @returns {string}
	 */
	KeyMapper.prototype.convert = function(event) {
	    var keyMap = [], keyChar;

	    if (event.shiftKey) {
	        keyMap.push('SHIFT');
	    }

	    if (event.ctrlKey) {
	        keyMap.push('CTRL');
	    }

	    if (event.metaKey) {
	        keyMap.push('META');
	    }

	    if (event.altKey) {
	        keyMap.push('ALT');
	    }

	    keyChar = this._getKeyCodeChar(event.keyCode);

	    if (keyChar) {
	        keyMap.push(keyChar);
	    }

	    return keyMap.join(this._splitter);
	};

	/**
	 * Get character from key code
	 * @memberOf KeyMapper
	 * @param {number} keyCode Key code
	 * @returns {string}
	 * @private
	 */
	KeyMapper.prototype._getKeyCodeChar = function(keyCode) {
	    var keyCodeChar;

	    keyCodeChar = KEYBOARD_MAP[keyCode];

	    return keyCodeChar;
	};

	/**
	 * Get sharedInstance
	 * @api
	 * @memberOf KeyMapper
	 * @returns {KeyMapper}
	 */
	KeyMapper.getSharedInstance = function() {
	    if (!sharedInstance) {
	        sharedInstance = new KeyMapper();
	    }

	    return sharedInstance;
	};

	module.exports = KeyMapper;


/***/ },
/* 25 */
/***/ function(module, exports) {

	/**
	 * @fileoverview Implements markdown textObject
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	/**
	 * Markdown textObject
	 * @exports mdTextObject
	 * @constructor
	 * @class mdTextObject
	 * @param {MarkdownEditor} mde MarkdownEditor instance
	 * @param {object} range range
	 */
	function mdTextObject(mde, range) {
	    this._mde = mde;

	    this.setRange(range || mde.getRange());
	}

	/**
	 * Set start
	 * @memberOf mdTextObject
	 * @param {object} rangeStart Start of range
	 * @private
	 */
	mdTextObject.prototype._setStart = function(rangeStart) {
	    this._start = rangeStart;
	};
	/**
	 * Set end
	 * @private
	 * @memberOf mdTextObject
	 * @param {object} rangeEnd End of range
	 * @private
	 */
	mdTextObject.prototype._setEnd = function(rangeEnd) {
	    this._end = rangeEnd;
	};
	/**
	 * Set range to given range
	 * @private
	 * @memberOf mdTextObject
	 * @param {object} range Range object
	 */
	mdTextObject.prototype.setRange = function(range) {
	    this._setStart(range.start);
	    this._setEnd(range.end);
	};
	/**
	 * Set start to end
	 * @private
	 * @memberOf mdTextObject
	 * @param {object} range Range object
	 */
	mdTextObject.prototype.setEndBeforeRange = function(range) {
	    this._setEnd(range.start);
	};
	/**
	 * Expand startOffset by 1
	 * @private
	 * @memberOf mdTextObject
	 */
	mdTextObject.prototype.expandStartOffset = function() {
	    var start = this._start;

	    if (start.ch !== 0) {
	        start.ch -= 1;
	    }
	};
	/**
	 * Expand endOffset by 1
	 * @private
	 * @memberOf mdTextObject
	 */
	mdTextObject.prototype.expandEndOffset = function() {
	    var end = this._end;

	    if (end.ch < this._mde.getEditor().getDoc().getLine(end.line).length) {
	        end.ch += 1;
	    }
	};
	/**
	 * Get current selection's text content
	 * @private
	 * @memberOf mdTextObject
	 * @returns {{start: {line: number, ch: number}, end: {line: number, ch: number}}}
	 */
	mdTextObject.prototype.getTextContent = function() {
	    return this._mde.getEditor().getRange(this._start, this._end);
	};
	/**
	 * Replace current selection's content with given text content
	 * @private
	 * @memberOf mdTextObject
	 * @param {string} content Replacement content
	 */
	mdTextObject.prototype.replaceContent = function(content) {
	    this._mde.getEditor().replaceRange(content, this._start, this._end, '+input');
	};
	/**
	 * Delete current selection's content
	 * @private
	 * @memberOf mdTextObject
	 */
	mdTextObject.prototype.deleteContent = function() {
	    this._mde.getEditor().replaceRange('', this._start, this._end, '+delete');
	};
	/**
	 * peek StartBeforeOffset
	 * @private
	 * @memberOf mdTextObject
	 * @param {number} offset Offset
	 * @returns {{start: {line: number, ch: number}, end: {line: number, ch: number}}}
	 */
	mdTextObject.prototype.peekStartBeforeOffset = function(offset) {
	    var peekStart;

	    peekStart = {
	        line: this._start.line,
	        ch: Math.max(this._start.ch - offset, 0)
	    };

	    return this._mde.getEditor().getRange(peekStart, this._start);
	};

	module.exports = mdTextObject;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var LazyRunner = __webpack_require__(27);

	/**
	 * Preview
	 * @exports Preview
	 * @class Preview
	 * @constructor
	 * @param {jQuery} $el Container element for preview
	 * @param {EventManager} eventManager Event manager instance
	 * @param {Convertor} converter Convertor instance
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

	/**
	 * Initialize event
	 * @private
	 */
	Preview.prototype._initEvent = function() {
	    var self = this;

	    this.eventManager.listen('contentChangedFromMarkdown', function(markdownEditor) {
	        self.lazyRunner.run('refresh', markdownEditor.getValue());
	    });
	};

	/**
	 * Initialize content selection
	 * @private
	 */
	Preview.prototype._initContentSection = function() {
	    this.$previewContent = $('<div class="tui-editor-contents" />');
	    this.$el.append(this.$previewContent);
	};

	/**
	 * Refresh rendering
	 * @api
	 * @memberOf Preview
	 * @param {string} markdown Markdown text
	 */
	Preview.prototype.refresh = function(markdown) {
	    this.render(this.converter.toHTMLWithCodeHightlight(markdown));
	};

	/**
	 * Render HTML on preview
	 * @api
	 * @memberOf Preview
	 * @param {string} html HTML string
	 */
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

	/**
	 * Set preview height
	 * @api
	 * @memberOf Preview
	 * @param {number} height Height for preview container
	 */
	Preview.prototype.setHeight = function(height) {
	    this.$el.height(height);
	};

	module.exports = Preview;


/***/ },
/* 27 */
/***/ function(module, exports) {

	/**
	 * @fileoverview Implements LazyRunner
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var util = tui.util;

	/**
	 * LazyRunner
	 * @exports LazyRunner
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


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implments wysiwygEditor
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var domUtils = __webpack_require__(19),
	    WwClipboardManager = __webpack_require__(29),
	    WwSelectionMarker = __webpack_require__(31),
	    WwListManager = __webpack_require__(32),
	    WwTaskManager = __webpack_require__(33),
	    WwTableManager = __webpack_require__(34),
	    WwHrManager = __webpack_require__(35),
	    WwPManager = __webpack_require__(36),
	    WwHeadingManager = __webpack_require__(37),
	    WwCodeBlockManager = __webpack_require__(38),
	    SquireExt = __webpack_require__(39);

	var keyMapper = __webpack_require__(24).getSharedInstance();

	var WwTextObject = __webpack_require__(40);

	var util = tui.util;

	var FIND_EMPTY_LINE = /<(.+)>(<br>|<br \/>|<BR>|<BR \/>)<\/\1>/g,
	    FIND_UNNECESSARY_BR = /(?:<br>|<br \/>|<BR>|<BR \/>)<\/(.+?)>/g,
	    FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD|PRE)\b/;

	var EDITOR_CONTENT_CSS_CLASSNAME = 'tui-editor-contents';

	var canObserveMutations = (typeof MutationObserver !== 'undefined');

	/**
	 * WysiwygEditor
	 * @exports WysiwygEditor
	 * @constructor
	 * @class WysiwygEditor
	 * @param {jQuery} $el element to insert editor
	 * @param {EventManager} eventManager EventManager instance
	 */
	function WysiwygEditor($el, eventManager) {
	    this.eventManager = eventManager;
	    this.$editorContainerEl = $el;

	    this._height = 0;

	    this._silentChange = false;

	    this._keyEventHandlers = {};
	    this._managers = {};

	    this._clipboardManager = new WwClipboardManager(this);
	    this._selectionMarker = new WwSelectionMarker();

	    this._initEvent();
	    this._initDefaultKeyEventHandler();

	    this.postProcessForChange = util.debounce(function() {
	        this._postProcessForChange();
	    }.bind(this), 0);
	}

	/**
	 * init
	 * @api
	 * @memberOf WysiwygEditor
	 */
	WysiwygEditor.prototype.init = function() {
	    var $editorBody = $('<div />');

	    this.$editorContainerEl.append($editorBody);

	    this.editor = new SquireExt($editorBody[0], {
	        blockTag: 'DIV'
	    });

	    this._initSquireEvent();
	    this._clipboardManager.init();

	    this.get$Body().addClass(EDITOR_CONTENT_CSS_CLASSNAME);
	    this.$editorContainerEl.css('position', 'relative');
	};

	/**
	 * _preprocessForInlineElement
	 * Seperate anchor tags with \u200B and replace blank space between <br> and <img to <br>$1
	 * @param {string} html Inner html of content editable
	 * @returns {string}
	 * @memberOf WysiwygEditor
	 * @private
	 */
	WysiwygEditor.prototype._preprocessForInlineElement = function(html) {
	    return html.replace(/<br>( *)<img/g, '<br><br>$1<img');
	};
	/**
	 * _initEvent
	 * Initialize EventManager event handler
	 * @memberOf WysiwygEditor
	 * @private
	 */
	WysiwygEditor.prototype._initEvent = function() {
	    var self = this;

	    this.eventManager.listen('wysiwygSetValueBefore', function(html) {
	        return self._preprocessForInlineElement(html);
	    });

	    this.eventManager.listen('wysiwygSetValueAfter', function() {
	        self._wrapDefaultBlockToListInner();
	    });

	    this.eventManager.listen('wysiwygKeyEvent', function(ev) {
	        self._runKeyEventHandlers(ev.data, ev.keyMap);
	    });
	};

	/**
	 * addKeyEventHandler
	 * Add key event handler
	 * @api
	 * @memberOf WysiwygEditor
	 * @param {string} keyMap keyMap string
	 * @param {function} handler handler
	 */
	WysiwygEditor.prototype.addKeyEventHandler = function(keyMap, handler) {
	    if (!handler) {
	        handler = keyMap;
	        keyMap = 'DEFAULT';
	    }

	    if (!this._keyEventHandlers[keyMap]) {
	        this._keyEventHandlers[keyMap] = [];
	    }

	    this._keyEventHandlers[keyMap].push(handler);
	};

	/**
	 * _runKeyEventHandlers
	 * Run key event handler
	 * @param {Event} event event object
	 * @param {string} keyMap keyMapString
	 * @private
	 */
	WysiwygEditor.prototype._runKeyEventHandlers = function(event, keyMap) {
	    var range = this.getRange(),
	        handlers, isNeedNext;

	    handlers = this._keyEventHandlers.DEFAULT;

	    if (handlers) {
	        util.forEachArray(handlers, function(handler) {
	            isNeedNext = handler(event, range, keyMap);

	            return isNeedNext;
	        });
	    }

	    handlers = this._keyEventHandlers[keyMap];

	    if (handlers && isNeedNext !== false) {
	        util.forEachArray(handlers, function(handler) {
	            return handler(event, range, keyMap);
	        });
	    }
	};

	/**
	 * _initSquireEvent
	 * Initialize squire event
	 * @private
	 */
	WysiwygEditor.prototype._initSquireEvent = function() {
	    var self = this;
	    var isNeedFirePostProcessForRangeChange = false;

	    this.getEditor().addEventListener('paste', function(clipboardEvent) {
	        self.eventManager.emit('paste', {
	            source: 'wysiwyg',
	            data: clipboardEvent
	        });
	    });

	    this.getEditor().addEventListener('dragover', function(ev) {
	        ev.preventDefault();

	        return false;
	    });

	    this.getEditor().addEventListener('drop', function(ev) {
	        ev.preventDefault();

	        self.eventManager.emit('drop', {
	            source: 'wysiwyg',
	            data: ev
	        });

	        return false;
	    });

	    //no-iframe전환후 레인지가 업데이트 되기 전에 이벤트가 발생함
	    //그래서 레인지 업데이트 이후 체인지 관련 이벤트 발생
	    this.getEditor().addEventListener('input', util.debounce(function() {
	        var eventObj;

	        if (!self._silentChange && self.isEditorValid()) {
	            eventObj = {
	                source: 'wysiwyg'
	            };

	            self.eventManager.emit('changeFromWysiwyg', eventObj);
	            self.eventManager.emit('change', eventObj);
	            self.eventManager.emit('contentChangedFromWysiwyg', self);
	        } else {
	            self._silentChange = false;
	        }

	        self.getEditor().preserveLastLine();
	    }, 0));

	    this.getEditor().addEventListener('keydown', function(keyboardEvent) {
	        var range = self.getEditor().getSelection();

	        if (!range.collapsed) {
	            isNeedFirePostProcessForRangeChange = true;
	        }

	        self.eventManager.emit('keydown', {
	            source: 'wysiwyg',
	            data: keyboardEvent
	        });

	        self._onKeyDown(keyboardEvent);
	    });

	    if (util.browser.firefox) {
	        this.getEditor().addEventListener('keypress', function(keyboardEvent) {
	            var keyCode = keyboardEvent.keyCode;
	            var range;

	            if (keyCode === 13 || keyCode === 9) {
	                range = self.getEditor().getSelection();

	                if (!range.collapsed) {
	                    isNeedFirePostProcessForRangeChange = true;
	                }

	                self.eventManager.emit('keydown', {
	                    source: 'wysiwyg',
	                    data: keyboardEvent
	                });

	                self._onKeyDown(keyboardEvent);
	            }
	        });

	        //파폭에서 space입력시 텍스트노드가 분리되는 현상때문에 꼭 다시 머지해줘야한다..
	        //이렇게 하지 않으면 textObject에 문제가 생긴다.
	        self.getEditor().addEventListener('keyup', function() {
	            var range, prevLen, curEl;

	            range = self.getRange();

	            if (domUtils.isTextNode(range.commonAncestorContainer)
	                && domUtils.isTextNode(range.commonAncestorContainer.previousSibling)) {
	                prevLen = range.commonAncestorContainer.previousSibling.length;
	                curEl = range.commonAncestorContainer;

	                range.commonAncestorContainer.previousSibling.appendData(
	                    range.commonAncestorContainer.data);

	                range.setStart(range.commonAncestorContainer.previousSibling, prevLen + range.startOffset);
	                range.collapse(true);

	                curEl.parentNode.removeChild(curEl);

	                self.getEditor().setSelection(range);
	                range.detach();
	            }
	        });
	    }

	    this.getEditor().addEventListener('keyup', function(keyboardEvent) {
	        if (isNeedFirePostProcessForRangeChange) {
	            self.postProcessForChange();
	            isNeedFirePostProcessForRangeChange = false;
	        }

	        self.eventManager.emit('keyup', {
	            source: 'wysiwyg',
	            data: keyboardEvent
	        });
	    });

	    this.getEditor().addEventListener('scroll', function(ev) {
	        self.eventManager.emit('scroll', {
	            source: 'wysiwyg',
	            data: ev
	        });
	    });

	    this.getEditor().addEventListener('click', function(ev) {
	        self.eventManager.emit('click', {
	            source: 'wysiwyg',
	            data: ev
	        });
	    });

	    this.getEditor().addEventListener('mousedown', function(ev) {
	        self.eventManager.emit('mousedown', {
	            source: 'wysiwyg',
	            data: ev
	        });
	    });

	    this.getEditor().addEventListener('mouseup', function(ev) {
	        self.eventManager.emit('mouseup', {
	            source: 'wysiwyg',
	            data: ev
	        });
	    });

	    this.getEditor().addEventListener('contextmenu', function(ev) {
	        self.eventManager.emit('contextmenu', {
	            source: 'wysiwyg',
	            data: ev
	        });
	    });

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
	        var isInPreTag = /PRE/.test(data.path);
	        var isInCodeTag = />CODE$/.test(data.path);
	        var state = {
	            bold: /(>B)|(>STRONG)/.test(data.path),
	            italic: /(>I)|(>EM)/.test(data.path),
	            code: !isInPreTag && isInCodeTag,
	            codeBlock: isInPreTag && isInCodeTag,
	            source: 'wysiwyg'
	        };

	        self.eventManager.emit('stateChange', state);
	    });
	};

	/**
	 * Handler of keydown event
	 * @param {object} keyboardEvent Event object
	 * @private
	 */
	WysiwygEditor.prototype._onKeyDown = function(keyboardEvent) {
	    var keyMap = keyMapper.convert(keyboardEvent);

	    //to avoid duplicate event firing in firefox
	    if (keyboardEvent.keyCode) {
	        this.eventManager.emit('keyMap', {
	            source: 'wysiwyg',
	            keyMap: keyMap,
	            data: keyboardEvent
	        });

	        this.eventManager.emit('wysiwygKeyEvent', {
	            keyMap: keyMap,
	            data: keyboardEvent
	        });
	    }
	};

	/**
	 * _initDefaultKeyEventHandler
	 * Initialize default event handler
	 * @private
	 */
	WysiwygEditor.prototype._initDefaultKeyEventHandler = function() {
	    var self = this;

	    this.addKeyEventHandler('ENTER', function() {
	        self.defer(function() {
	            self._scrollToRangeIfNeed();
	        });
	    });

	    this.addKeyEventHandler('TAB', function(ev) {
	        var editor = self.getEditor();
	        var isAbleToInsert4Space = !self.getManager('list').isInList();

	        if (isAbleToInsert4Space) {
	            ev.preventDefault();
	            editor.insertPlainText('\u00a0\u00a0\u00a0\u00a0');

	            return false;
	        }

	        return true;
	    });
	};

	/**
	 * Scroll editor area to current cursor position if need
	 * @private
	 */
	WysiwygEditor.prototype._scrollToRangeIfNeed = function() {
	    var range = this.getEditor().getSelection().cloneRange();
	    var cursorTop = this.getEditor().getCursorPosition(range).top - this.$editorContainerEl.offset().top;

	    if (cursorTop >= this.get$Body().height()) {
	        range.endContainer.scrollIntoView();
	    }
	};

	/**
	 * _isInOrphanText
	 * check if range is orphan text
	 * @param {Range} range range
	 * @returns {boolean} result
	 * @private
	 */
	WysiwygEditor.prototype._isInOrphanText = function(range) {
	    return range.startContainer.nodeType === Node.TEXT_NODE
	           && range.startContainer.parentNode === this.get$Body()[0];
	};

	/**
	 * _wrapDefaultBlockTo
	 * Wrap default block to passed range
	 * @param {Range} range range
	 * @private
	 */
	WysiwygEditor.prototype._wrapDefaultBlockTo = function(range) {
	    var block, textElem, cursorOffset, insertTargetNode;

	    this.saveSelection(range);
	    this._joinSplitedTextNodes();
	    this.restoreSavedSelection();

	    range = this.getEditor().getSelection().cloneRange();

	    textElem = range.startContainer;
	    cursorOffset = range.startOffset;

	    //이때 range의 정보들이 body기준으로 변경된다(텍스트 노드가 사라져서)
	    //after code below, range range is arranged by body
	    block = this.getEditor().createDefaultBlock([range.startContainer]);

	    //range for insert block
	    insertTargetNode = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset);
	    if (insertTargetNode) {
	        range.setStartBefore(insertTargetNode);
	    } else {
	        //컨테이너의 차일드가 이노드 한개뿐일경우
	        range.selectNodeContents(range.startContainer);
	    }

	    range.collapse(true);

	    range.insertNode(block);

	    //revert range to original node
	    range.setStart(textElem, cursorOffset);
	    range.collapse(true);

	    this.getEditor().setSelection(range);
	};

	/**
	 * findTextNodeFilter
	 * @this Node
	 * @returns {boolean} true or not
	 */
	function findTextNodeFilter() {
	    return this.nodeType === Node.TEXT_NODE;
	}

	/**
	 * _joinSplitedTextNodes
	 * Join spliated text nodes
	 * @private
	 */
	WysiwygEditor.prototype._joinSplitedTextNodes = function() {
	    var textNodes, prevNode,
	        lastGroup,
	        nodesToRemove = [];

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


	/**
	 * saveSelection
	 * Save current selection before modification
	 * @api
	 * @memberOf WysiwygEditor
	 * @param {Range} range Range object
	 */
	WysiwygEditor.prototype.saveSelection = function(range) {
	    var sq = this.getEditor();

	    if (!range) {
	        range = sq.getSelection().cloneRange();
	    }

	    this.getEditor()._saveRangeToBookmark(range);
	};

	/**
	 * restoreSavedSelection
	 * Restore saved selection
	 * @api
	 * @memberOf WysiwygEditor
	 */
	WysiwygEditor.prototype.restoreSavedSelection = function() {
	    var sq = this.getEditor();
	    sq.setSelection(sq._getRangeAndRemoveBookmark());
	};

	/**
	 * _wrapDefaultBlockToListInner
	 * Wrap default block to list inner contents
	 * @private
	 */
	WysiwygEditor.prototype._wrapDefaultBlockToListInner = function() {
	    this.get$Body().find('li').each(function(index, node) {
	        if ($(node).find('div').length <= 0) {
	            $(node).wrapInner('<div />');
	        }
	    });
	};

	/**
	 * reset
	 * Reset wysiwyg editor
	 * @api
	 * @memberOf WysiwygEditor
	 */
	WysiwygEditor.prototype.reset = function() {
	    this.setValue('');
	};

	/**
	 * changeBlockFormatTo
	 * Change current range block format to passed tag
	 * @api
	 * @memberOf WysiwygEditor
	 * @param {string} targetTagName Target element tag name
	 */
	WysiwygEditor.prototype.changeBlockFormatTo = function(targetTagName) {
	    this.getEditor().changeBlockFormatTo(targetTagName);
	    this.eventManager.emit('wysiwygRangeChangeAfter', this);
	};

	/**
	 * makeEmptyBlockCurrentSelection
	 * Make empty block to current selection
	 * @api
	 * @memberOf WysiwygEditor
	 */
	WysiwygEditor.prototype.makeEmptyBlockCurrentSelection = function() {
	    var self = this;

	    this.getEditor().modifyBlocks(function(frag) {
	        if (!frag.textContent) {
	            frag = self.getEditor().createDefaultBlock();
	        }

	        return frag;
	    });
	};

	/**
	 * focus
	 * Focus to editor
	 * @api
	 * @memberOf WysiwygEditor
	 */
	WysiwygEditor.prototype.focus = function() {
	    this.editor.focus();
	};

	/**
	 * remove
	 * Remove wysiwyg editor
	 * @api
	 * @memberOf WysiwygEditor
	 */
	WysiwygEditor.prototype.remove = function() {
	    this.getEditor().destroy();

	    this.editor = null;
	    this.$body = null;
	};

	/**
	 * setHeight
	 * Set editor height
	 * @api
	 * @memberOf WysiwygEditor
	 * @param {number|string} height pixel of height or "auto"
	 */
	WysiwygEditor.prototype.setHeight = function(height) {
	    this._height = height;

	    if (height === 'auto') {
	        this.get$Body().css('overflow', 'visible');
	        this.get$Body().css('height', 'auto');
	    } else {
	        this.get$Body().css('overflow', 'auto');
	        this.get$Body().css('height', '100%');
	        this.$editorContainerEl.height(height);
	    }
	};

	/**
	 * setValue
	 * Set value to wysiwyg editor
	 * @api
	 * @memberOf WysiwygEditor
	 * @param {string} html HTML text
	 */
	WysiwygEditor.prototype.setValue = function(html) {
	    html = this.eventManager.emitReduce('wysiwygSetValueBefore', html);

	    this.editor.setHTML(html);

	    this.eventManager.emit('wysiwygSetValueAfter', this);
	    this.eventManager.emit('contentChangedFromWysiwyg', this);

	    this.moveCursorToEnd();

	    this.getEditor().preserveLastLine();

	    this.getEditor().removeLastUndoStack();
	    this.getEditor().saveUndoState();
	};

	/**
	 * getValue
	 * Get value of wysiwyg editor
	 * @api
	 * @memberOf WysiwygEditor
	 * @returns {string} html
	 */
	WysiwygEditor.prototype.getValue = function() {
	    var html;

	    this._prepareGetHTML();

	    html = this.editor.getHTML();

	    //empty line replace to br
	    html = html.replace(FIND_EMPTY_LINE, function(match, tag) {
	        var result;

	        //we maintain empty list
	        if (tag === 'li') {
	            result = match;
	        //we maintain empty table
	        } else if (tag === 'td' || tag === 'th') {
	            result = '<' + tag + '></' + tag + '>';
	        } else {
	            result = '<br />';
	        }

	        return result;
	    });

	    //remove unnecessary brs
	    html = html.replace(FIND_UNNECESSARY_BR, '</$1>');

	    //remove contenteditable block, in this case div
	    html = html.replace(/<div>/g, '');
	    html = html.replace(/<\/div>/g, '<br />');

	    html = this.eventManager.emitReduce('wysiwygProcessHTMLText', html);

	    return html;
	};

	/**
	 * _prepareGetHTML
	 * Prepare before get html
	 * @memberOf WysiwygEditor
	 * @private
	 */
	WysiwygEditor.prototype._prepareGetHTML = function() {
	    var self = this;
	    //for ensure to fire change event
	    self.get$Body().attr('lastGetValue', Date.now());

	    self._joinSplitedTextNodes();

	    self.getEditor().modifyDocument(function() {
	        self.eventManager.emit('wysiwygGetValueBefore', self);
	    });
	};

	/**
	 * _postProcessForChange
	 * Post process for change
	 * @private
	 * @memberOf WysiwygEditor
	 */
	WysiwygEditor.prototype._postProcessForChange = function() {
	    var self = this;
	    self.getEditor().modifyDocument(function() {
	        self.eventManager.emit('wysiwygRangeChangeAfter', self);
	    });
	};

	/**
	 * readySilentChange
	 * Ready to silent change
	 * @api
	 * @memberOf WysiwygEditor
	 */
	WysiwygEditor.prototype.readySilentChange = function() {
	    if (canObserveMutations && !this.getEditor().isIgnoreChange()) {
	        this._silentChange = true;
	    }
	};

	/**
	 * getEditor
	 * Get squire
	 * @api
	 * @memberOf WysiwygEditor
	 * @returns {SquireExt} squire
	 */
	WysiwygEditor.prototype.getEditor = function() {
	    return this.editor;
	};

	/**
	 * replaceSelection
	 * Replace text of passed range
	 * @api
	 * @memberOf WysiwygEditor
	 * @param {string} content Content for change current selection
	 * @param {Range} range range
	 */
	WysiwygEditor.prototype.replaceSelection = function(content, range) {
	    this.getEditor().replaceSelection(content, range);
	};

	/**
	 * replaceRelativeOffset
	 * Replace content by relative offset
	 * @api
	 * @memberOf WysiwygEditor
	 * @param {string} content Content for change current selection
	 * @param {number} offset Offset of current range
	 * @param {number} overwriteLength Length to overwrite content
	 */
	WysiwygEditor.prototype.replaceRelativeOffset = function(content, offset, overwriteLength) {
	    this.getEditor().replaceRelativeOffset(content, offset, overwriteLength);
	};

	/**
	 * addWidget
	 * Add widget to selection
	 * @api
	 * @memberOf WysiwygEditor
	 * @param {Range} range Range object
	 * @param {Node} node Widget node
	 * @param {string} style Adding style "over" or "bottom"
	 * @param {number} [offset] Offset to adjust position
	 */
	WysiwygEditor.prototype.addWidget = function(range, node, style, offset) {
	    var pos = this.getEditor().getSelectionPosition(range, style, offset);
	    var editorContainerPos = this.$editorContainerEl.offset();

	    this.$editorContainerEl.append(node);

	    $(node).css({
	        position: 'absolute',
	        top: pos.top - editorContainerPos.top,
	        left: pos.left - editorContainerPos.left
	    });
	};

	/**
	 * get$Body
	 * Get jQuery wrapped body container of Squire
	 * @api
	 * @memberOf WysiwygEditor
	 * @returns {JQuery} jquery body
	 */
	WysiwygEditor.prototype.get$Body = function() {
	    return this.getEditor().get$Body();
	};

	/**
	 * hasFormatWithRx
	 * Check with given regexp whether current path has some format or not
	 * @api
	 * @memberOf WysiwygEditor
	 * @param {RegExp} rx Regexp
	 * @returns {boolean} Match result
	 */
	WysiwygEditor.prototype.hasFormatWithRx = function(rx) {
	    return this.getEditor().getPath().match(rx);
	};

	/**
	 * breakToNewDefaultBlock
	 * Break line to new default block from passed range
	 * @api
	 * @memberOf WysiwygEditor
	 * @param {Range} range Range object
	 * @param {string} [where] "before" or not
	 */
	WysiwygEditor.prototype.breakToNewDefaultBlock = function(range, where) {
	    var div, appendBefore, currentNode;

	    currentNode = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset)
	        || domUtils.getChildNodeByOffset(range.startContainer, range.startOffset - 1);

	    appendBefore = domUtils.getParentUntil(currentNode, this.get$Body()[0]);

	    div = this.editor.createDefaultBlock();

	    if (where === 'before') {
	        $(appendBefore).before(div);
	    } else {
	        $(appendBefore).after(div);
	    }

	    range.setStart(div, 0);
	    range.collapse(true);
	    this.editor.setSelection(range);
	};


	/**
	 * replaceContentText
	 * Replace textContet of node
	 * @api
	 * @memberOf WysiwygEditor
	 * @param {Node} container Container node
	 * @param {string} from Target text to change
	 * @param {string} to Replacement text
	 */
	WysiwygEditor.prototype.replaceContentText = function(container, from, to) {
	    var before;

	    before = $(container).html();
	    $(container).html(before.replace(from, to));
	};

	/**
	 * unwrapBlockTag
	 * Unwrap Block tag of current range
	 * @api
	 * @memberOf WysiwygEditor
	 * @param {function} [condition] iterate with tagName
	 */
	WysiwygEditor.prototype.unwrapBlockTag = function(condition) {
	    if (!condition) {
	        condition = function(tagName) {
	            return FIND_BLOCK_TAGNAME_RX.test(tagName);
	        };
	    }

	    this.getEditor().changeBlockFormat(condition);
	    this.eventManager.emit('wysiwygRangeChangeAfter', this);
	};

	/**
	 * insertSelectionMarker
	 * Insert selection marker
	 * @api
	 * @memberOf WysiwygEditor
	 * @param {Range} range Range to save selection
	 * @returns {Range} range
	 */
	WysiwygEditor.prototype.insertSelectionMarker = function(range) {
	    return this._selectionMarker.insertMarker(range, this.getEditor());
	};

	/**
	 * restoreSelectionMarker
	 * Restore marker to selection
	 * @api
	 * @memberOf WysiwygEditor
	 * @returns {Range} range
	 */
	WysiwygEditor.prototype.restoreSelectionMarker = function() {
	    return this._selectionMarker.restore(this.getEditor());
	};

	/**
	 * addManager
	 * Add manager
	 * @api
	 * @memberOf WysiwygEditor
	 * @param {string} name Manager name
	 * @param {function} Manager Constructor
	 */
	WysiwygEditor.prototype.addManager = function(name, Manager) {
	    var instance;

	    if (!Manager) {
	        Manager = name;
	        name = null;
	    }

	    instance = new Manager(this);
	    this._managers[name || instance.name] = instance;
	};

	/**
	 * getManager
	 * Get manager by manager name
	 * @api
	 * @memberOf WysiwygEditor
	 * @param {string} name Manager name
	 * @returns {object} manager
	 */
	WysiwygEditor.prototype.getManager = function(name) {
	    return this._managers[name];
	};

	/**
	 * Set cursor position to end
	 * @api
	 * @memberOf WysiwygEditor
	 */
	WysiwygEditor.prototype.moveCursorToEnd = function() {
	    this.getEditor().moveCursorToEnd();
	    this.getEditor().scrollTop(this.get$Body().height());
	    this._correctRangeAfterMoveCursor('end');
	};

	/**
	 * Set cursor position to start
	 * @api
	 * @memberOf WysiwygEditor
	 */
	WysiwygEditor.prototype.moveCursorToStart = function() {
	    this.getEditor().moveCursorToStart();
	    this.getEditor().scrollTop(0);
	};

	/**
	 * Set cursor position to start
	 * @api
	 * @memberOf WysiwygEditor
	 * @param {number} value Scroll amount
	 * @returns {boolean}
	 */
	WysiwygEditor.prototype.scrollTop = function(value) {
	    return this.getEditor().scrollTop(value);
	};

	/**
	 * _correctRangeAfterMoveCursor
	 * For arrange Range after moveCursorToEnd api invocation. Squire has bug in Firefox, IE.
	 * @memberOf WysiwygEditor
	 * @param {string} direction Direction of cursor move
	 * @private
	 */
	WysiwygEditor.prototype._correctRangeAfterMoveCursor = function(direction) {
	    var range = this.getEditor().getSelection().cloneRange();
	    var cursorContainer, offset;

	    if (direction === 'start') {
	        cursorContainer = this.get$Body()[0].firstChild;
	        offset = 0;
	    } else {
	        cursorContainer = this.get$Body()[0].lastChild;
	        offset = domUtils.getOffsetLength(cursorContainer);

	        // IE have problem with cursor after br
	        if (domUtils.getNodeName(cursorContainer.lastChild) === 'BR') {
	            offset -= 1;
	        }
	    }

	    range.setStart(cursorContainer, offset);

	    range.collapse(true);

	    this.getEditor().setSelection(range);
	};

	/**
	 * Get current Range object
	 * @api
	 * @memberOf WysiwygEditor
	 * @returns {Range}
	 */
	WysiwygEditor.prototype.getRange = function() {
	    return this.getEditor().getSelection().cloneRange();
	};

	/**
	 * Get text object of current range
	 * @api
	 * @memberOf WysiwygEditor
	 * @param {Range} range Range object
	 * @returns {WwTextObject}
	 */
	WysiwygEditor.prototype.getTextObject = function(range) {
	    return new WwTextObject(this, range);
	};

	WysiwygEditor.prototype.defer = function(callback) {
	    var self = this;

	    setTimeout(function() {
	        if (self.isEditorValid()) {
	            callback(self);
	        }
	    }, 0);
	};

	WysiwygEditor.prototype.isEditorValid = function() {
	    return this.getEditor() && $.contains(this.$editorContainerEl[0].ownerDocument, this.$editorContainerEl[0]);
	};

	/**
	 * WysiwygEditor factory method
	 * @api
	 * @memberOf WysiwygEditor
	 * @param {jQuery} $el Container element for editor
	 * @param {EventManager} eventManager EventManager instance
	 * @returns {WysiwygEditor} wysiwygEditor
	 */
	WysiwygEditor.factory = function($el, eventManager) {
	    var wwe = new WysiwygEditor($el, eventManager);

	    wwe.init();

	    wwe.addManager(WwListManager);
	    wwe.addManager(WwTaskManager);
	    wwe.addManager(WwTableManager);
	    wwe.addManager(WwHrManager);
	    wwe.addManager(WwPManager);
	    wwe.addManager(WwHeadingManager);
	    wwe.addManager(WwCodeBlockManager);

	    return wwe;
	};

	module.exports = WysiwygEditor;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements wysiwyg editor clipboard manager
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var domUtils = __webpack_require__(19);
	var WwPasteContentHelper = __webpack_require__(30);
	var util = tui.util;

	var isMSBrowser = util.browser.msie || /Edge\//.test(navigator.userAgent);


	/**
	 * WwClipboardManager
	 * @exports WwClipboardManager
	 * @constructor
	 * @class WwClipboardManager
	 * @param {WysiwygEditor} wwe WysiwygEditor instance
	 */
	function WwClipboardManager(wwe) {
	    this.wwe = wwe;

	    this._pch = new WwPasteContentHelper(this.wwe);
	}

	/**
	 * init
	 * initialize
	 * @api
	 * @memberOf WwClipboardManager
	 */
	WwClipboardManager.prototype.init = function() {
	    this._initSquireEvent();
	};

	/**
	 * _initSquireEvent
	 * initialize squire events
	 * @private
	 * @memberOf WwClipboardManager
	 */
	WwClipboardManager.prototype._initSquireEvent = function() {
	    var self = this;

	    if (isMSBrowser) {
	        this.wwe.getEditor().addEventListener('keydown', function(event) {
	            //Ctrl+ C
	            if (event.ctrlKey && event.keyCode === 67) {
	                self._saveLastestClipboardRangeInfo();
	            //Ctrl + X
	            } else if (event.ctrlKey && event.keyCode === 88) {
	                self._saveLastestClipboardRangeInfo();
	                self.wwe.postProcessForChange();
	            }
	        });
	    } else {
	        this.wwe.getEditor().addEventListener('copy', function() {
	            self._saveLastestClipboardRangeInfo();
	        });
	        this.wwe.getEditor().addEventListener('cut', function() {
	            self._saveLastestClipboardRangeInfo();
	            self.wwe.postProcessForChange();
	        });
	    }

	    this.wwe.getEditor().addEventListener('willPaste', function(pasteData) {
	        if (self._latestClipboardRangeInfo
	            && self._latestClipboardRangeInfo.contents.textContent === pasteData.fragment.textContent) {
	            pasteData.fragment = $(self._latestClipboardRangeInfo.contents).clone()[0];
	            pasteData.rangeInfo = self._latestClipboardRangeInfo;
	        }

	        self._pch.preparePaste(pasteData);
	        self.wwe.eventManager.emit('pasteBefore', {source: 'wysiwyg', data: pasteData});
	        self._refineCursorWithPasteContents(pasteData.fragment);
	        self.wwe.postProcessForChange();
	    });
	};
	/**
	 * Refine cursor position with paste contents
	 * @memberOf WwClipboardManager
	 * @param {DocumentFragment} fragment Copied contents
	 * @private
	 */
	WwClipboardManager.prototype._refineCursorWithPasteContents = function(fragment) {
	    var node = fragment;
	    var range = this.wwe.getEditor().getSelection().cloneRange();

	    while (node.lastChild) {
	        node = node.lastChild;
	    }

	    this.wwe.defer(function(wwe) {
	        range.setStartAfter(node);
	        range.collapse(true);
	        wwe.getEditor().setSelection(range);
	    });
	};

	/**
	 * Check whether copied content from editor or not
	 * @memberOf WwClipboardManager
	 * @param {DocumentFragment} pasteData Copied contents
	 * @returns {boolean}
	 * @private
	 */
	WwClipboardManager.prototype._isCopyFromEditor = function(pasteData) {
	    var lastestClipboardContents;

	    if (!this._latestClipboardRangeInfo) {
	        return false;
	    }

	    lastestClipboardContents = this._latestClipboardRangeInfo.contents.textContent;

	    return lastestClipboardContents.replace(/\s/g, '') === pasteData.fragment.textContent.replace(/\s/g, '');
	};
	/**
	 * Save latest clipboard range information to _latestClipboardRangeInfo
	 * @memberOf WwClipboardManager
	 * @private
	 */
	WwClipboardManager.prototype._saveLastestClipboardRangeInfo = function() {
	    var commonAncestorName;
	    var range = this.wwe.getEditor().getSelection().cloneRange();
	    range = this._extendRange(range);

	    if (range.commonAncestorContainer === this.wwe.get$Body()[0]) {
	        commonAncestorName = 'BODY';
	    } else {
	        commonAncestorName = range.commonAncestorContainer.tagName;
	    }

	    this._latestClipboardRangeInfo = {
	        contents: range.cloneContents(),
	        commonAncestorName: commonAncestorName
	    };
	};

	/**
	 * _extendRange
	 * extend range if need
	 * @memberOf WwClipboardManager
	 * @param {Range} range to extend
	 * @returns {Range} range
	 * @private
	 */
	WwClipboardManager.prototype._extendRange = function(range) {
	    //텍스트 노드이면서 모두 선택된게 아니면 레인지를 확장할 필요가 없다.
	    if (domUtils.isTextNode(range.commonAncestorContainer)
	        && (range.startOffset !== 0 || range.commonAncestorContainer.textContent.length !== range.endOffset)
	    ) {
	        return range;
	    }

	    if (range.startOffset === 0) {
	        range = this._extendStartRange(range);
	    }

	    if (range.endOffset === domUtils.getOffsetLength(range.endContainer)) {
	        range = this._extendEndRange(range);
	    }

	    //commonAncestor의 모든 컨텐츠가 선택된경우 commonAncestor로 셀렉션 변경
	    if (this._isWholeCommonAncestorContainerSelected(range)) {
	        range.selectNode(range.commonAncestorContainer);
	    }

	    return range;
	};

	/**
	 * Extends current range's startContainer
	 * @memberOf WwClipboardManager
	 * @param {Range} range Range object
	 * @returns {Range}
	 * @private
	 */
	WwClipboardManager.prototype._extendStartRange = function(range) {
	    var newBound = range.startContainer;

	    //레인지 확장
	    while (newBound.parentNode !== range.commonAncestorContainer
	            && newBound.parentNode !== this.wwe.get$Body()[0]
	            && !newBound.previousSibling
	          ) {
	        newBound = newBound.parentNode;
	    }

	    //range단위를 한단계 확장 deleteContents는 start, end에 걸린 컨테이너 자체는 안지운다.
	    range.setStart(newBound.parentNode, domUtils.getNodeOffsetOfParent(newBound));

	    return range;
	};

	/**
	 * Extends current range's endContainer
	 * @memberOf WwClipboardManager
	 * @param {Range} range Range object
	 * @returns {Range}
	 * @private
	 */
	WwClipboardManager.prototype._extendEndRange = function(range) {
	    var newBound = range.endContainer;
	    var boundNext = newBound.nextSibling;

	    //레인지 확장
	    while (newBound.parentNode !== range.commonAncestorContainer
	            && newBound.parentNode !== this.wwe.get$Body()[0]
	            && (!boundNext || (domUtils.getNodeName(boundNext) === 'BR' && newBound.parentNode.lastChild === boundNext))
	          ) {
	        newBound = newBound.parentNode;
	        boundNext = newBound.nextSibling;
	    }

	    //range단위를 부모래밸로 한단계 확장 deleteContents는 start, end에 걸린 컨테이너 자체는 안지운다.
	    range.setEnd(newBound.parentNode, domUtils.getNodeOffsetOfParent(newBound) + 1);

	    return range;
	};

	/**
	 * _isWholeCommonAncestorContainerSelected
	 * Check whether whole commonAncestorContainter textContent selected or not
	 * 선택된 영역이 commonAncestorContainer의 모든 컨텐츠인치 체크
	 * @memberOf WwClipboardManager
	 * @param {Range} range Range object
	 * @returns {boolean} result
	 * @private
	 */
	WwClipboardManager.prototype._isWholeCommonAncestorContainerSelected = function(range) {
	    return range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
	        && range.commonAncestorContainer !== this.wwe.get$Body()[0]
	        && range.startOffset === 0
	        && range.endOffset === range.commonAncestorContainer.childNodes.length
	        && range.commonAncestorContainer === range.startContainer
	        && range.commonAncestorContainer === range.endContainer;
	};

	module.exports = WwClipboardManager;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements WwPasteContentHelper
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var domUtils = __webpack_require__(19);

	var util = tui.util;

	/**
	 * WwPasteContentHelper
	 * @exports WwPasteContentHelper
	 * @class WwPasteContentHelper
	 * @constructor
	 * @param {WysiwygEditor} wwe wysiwygEditor instance
	 */
	function WwPasteContentHelper(wwe) {
	    this.wwe = wwe;
	}

	/**
	 * Process paste data before paste
	 * @api
	 * @memberOf WwPasteContentHelper
	 * @param {object} pasteData Pasting data
	 */
	WwPasteContentHelper.prototype.preparePaste = function(pasteData) {
	    var range = this.wwe.getEditor().getSelection().cloneRange();
	    var newFragment = this.wwe.getEditor().getDocument().createDocumentFragment();
	    var firstBlockIsTaken = false;
	    var nodeName, node, childNodes;

	    this._pasteFirstAid(pasteData.fragment);

	    childNodes = util.toArray(pasteData.fragment.childNodes);

	    //prepare to paste as inline of first node if possible
	    //앞부분의 인라인으로 붙일수 있느부분은 인라인으로 붙을수 있도록 처리
	    if (childNodes.length && childNodes[0].tagName === 'DIV') {
	        $(newFragment).append(this._unwrapFragmentFirstChildForPasteAsInline(childNodes[0]));
	        childNodes.shift();
	    }

	    while (childNodes.length) {
	        node = childNodes[0];
	        nodeName = domUtils.getNodeName(node);

	        if (this.wwe.getManager('codeblock').isInCodeBlock(range)) {
	            newFragment.appendChild(this.wwe.getManager('codeblock').prepareToPasteOnCodeblock(childNodes));
	        } else if (nodeName === 'LI' || nodeName === 'UL' || nodeName === 'OL') {
	            newFragment.appendChild(this._prepareToPasteList(childNodes, pasteData.rangeInfo, firstBlockIsTaken));
	            //첫번째 현재위치와 병합될 가능성이있는 컨텐츠가 만들어진경우는 이후 위치에 대한 정보가 필요없다
	            firstBlockIsTaken = true;
	        } else {
	            $(newFragment).append(childNodes.shift());
	        }
	    }

	    pasteData.fragment = newFragment;
	};

	/**
	 * Wrap textNodes with div element
	 * @param {DocumentFragment} fragment - Fragment of paste data
	 * @memberOf WwPasteContentHelper
	 * @private
	 */
	WwPasteContentHelper.prototype._wrapTextNodeWithDiv = function(fragment) {
	    var array = util.toArray(fragment.childNodes);

	    util.forEachArray(array, function(node) {
	        var divElement;
	        var isTextNode = node.nodeType === 3;

	        if (isTextNode) {
	            divElement = document.createElement('div');

	            divElement.innerHTML = node.nodeValue + '<br>';

	            fragment.replaceChild(divElement, node);
	        }
	    });
	};

	/**
	 * Processing paste data after paste
	 * @param {DocumentFragment} fragment Pasting data
	 * @memberOf WwPasteContentHelper
	 * @private
	 */
	WwPasteContentHelper.prototype._pasteFirstAid = function(fragment) {
	    var self = this;

	    $(fragment).find('iframe, script, select, form, button, .Apple-converted-space').remove();

	    this._removeUnnecessaryBlocks(fragment);
	    this._removeStyles(fragment);

	    this._wrapTextNodeWithDiv(fragment);

	    this._preElementAid(fragment);

	    //br은 preElemnetAid에서 필요해서 처리후 불필요한 br은 삭제한다.
	    $(fragment).find('br').remove();

	    $(fragment).find('*').each(function() {
	        self._removeStyles(this);
	    });
	};

	/**
	 * PRE tag formatting
	 * @memberOf WwPasteContentHelper
	 * @private
	 * @param {DocumentFragment} nodes Pasting DocumentFragment
	 */
	WwPasteContentHelper.prototype._preElementAid = function(nodes) {
	    var textLines;

	    $(nodes).find('PRE').each(function(index, pre) {
	        //코드태그가 있으면 코드단위로 라인 구분
	        if ($(pre).has('code').length) {
	            textLines = [];

	            $(pre).find('code').each(function() {
	                textLines.push($(this).text().replace(/\n/g, ''));
	            });
	            //코드태그가 없으면 개행단위로 라인 구분
	        } else {
	            $(pre).find('br').replaceWith('\n');
	            textLines = $(pre).text().split(/\n/g);
	        }

	        $(pre).empty();

	        textLines.forEach(function(line) {
	            var lineDom = $('<div><code /><br/></div>');

	            lineDom.find('code').text(line);
	            $(pre).append(lineDom);
	        });
	    });
	};

	/**
	 * Remove unnecessary block element in pasting data
	 * @param {DocumentFragment} nodes Pasting DocumentFragment
	 * @memberOf WwPasteContentHelper
	 * @private
	 */
	WwPasteContentHelper.prototype._removeUnnecessaryBlocks = function(nodes) {
	    var blockTags = 'div, section, article, aside, nav, menus';
	    var blocks = $(nodes).find(blockTags);

	    blocks.each(function(index, blockElement) {
	        var $blockElement = $(blockElement);
	        var isDivInListItem = $blockElement.parent('li').length !== 0 && blockElement.tagName === 'DIV';

	        if (isDivInListItem) {
	            return;
	        }

	        $blockElement.replaceWith(function() {
	            return $(this).html();
	        });
	    });
	};

	/**
	 * Remove inline style
	 * @param {Node} node Node for remove style attribute
	 * @memberOf WwPasteContentHelper
	 * @private
	 */
	WwPasteContentHelper.prototype._removeStyles = function(node) {
	    var $node = $(node);
	    var colorValue;

	    if (domUtils.getNodeName($node[0]) !== 'SPAN') {
	        $node.removeAttr('style');
	    } else {
	        colorValue = $node.css('color');
	        $node.removeAttr('style');

	        if (colorValue) {
	            $node.css('color', colorValue);
	        } else {
	            $node.children().unwrap();
	        }
	    }
	};

	/**
	 * Processing before paste list
	 * @param {Array.<HTMLElement>} nodes Pasting data
	 * @param {object} rangeInfo Range information
	 * @param {boolean} firstBlockIsTaken Whether first block element taken or not
	 * @returns {DocumentFragment}
	 * @memberOf WwPasteContentHelper
	 * @private
	 */
	WwPasteContentHelper.prototype._prepareToPasteList = function(nodes, rangeInfo, firstBlockIsTaken) {
	    var listGroup;
	    var nodeName = domUtils.getNodeName(nodes[0]);
	    var node = nodes.shift();
	    var newFragment = this.wwe.getEditor().getDocument().createDocumentFragment();

	    //IE에서는 LI-UL 구조에서 UL이 전체가 선택되었는데 LI를 포함하지 않고 UL만 넘어올때가 있다.
	    if (nodeName !== 'LI' && nodes.length && nodes[0].tagName === 'LI') {
	        nodeName = 'LI';

	        node = this._makeNodeAndAppend({
	            tagName: nodeName
	        }, node);
	    }

	    //UL과 OL이고 리스트에 paste하는경우 뎊스처리
	    if (nodeName === 'OL' || nodeName === 'UL') {
	        //페이스트 데이터의 첫번째 블럭요소가 이미 만들어졌다면 커서의 위치에 대한 대응은 하지 않는다.
	        if (!firstBlockIsTaken && this.wwe.getEditor().hasFormat('LI')) {
	            $(newFragment).append(this._wrapCurrentFormat(node));
	        } else {
	            $(newFragment).append(node);
	        }
	    } else if (nodeName === 'LI') {
	        //리스트 그룹처리
	        listGroup = this.wwe.getEditor().getDocument().createDocumentFragment();
	        listGroup.appendChild(node);

	        while (nodes.length && nodes[0].tagName === 'LI') {
	            listGroup.appendChild(nodes.shift());
	        }

	        //리스트에 붙는경우 뎊스 연결
	        //페이스트 데이터의 첫번째 블럭요소가 이미 만들어졌다면 커서의 위치에 대한 대응은 하지 않는다.
	        if (!firstBlockIsTaken && this.wwe.getEditor().hasFormat('LI')) {
	            $(newFragment).append(this._wrapCurrentFormat(listGroup));
	        //카피할당시의 정보가 있다면 해당 리스트로 만듬
	        } else if (rangeInfo
	                   && (rangeInfo.commonAncestorName === 'UL' || rangeInfo.commonAncestorName === 'OL')) {
	            $(newFragment).append(this._makeNodeAndAppend({
	                tagName: rangeInfo.commonAncestorName
	            }, listGroup));
	        //외부에서온 리스트
	        } else {
	            $(newFragment).append(this._makeNodeAndAppend({
	                tagName: 'UL'
	            }, listGroup));
	        }
	    }

	    return newFragment;
	};

	/**
	 * Unwrap fragment first child for pasting node inline
	 * @memberOf WwPasteContentHelper
	 * @private
	 * @param {Node} node Pasting DocumentFragment
	 * @returns {NodeList}
	 */
	WwPasteContentHelper.prototype._unwrapFragmentFirstChildForPasteAsInline = function(node) {
	    $(node).find('br').remove();

	    return node.childNodes;
	};

	/**
	 * Wrap nodes with current format
	 * @param {DocumentFragment} nodes P
	 * @returns {HTMLElement}
	 * @private
	 */
	WwPasteContentHelper.prototype._wrapCurrentFormat = function(nodes) {
	    var self = this;
	    var currentTagName;

	    // 붙여질 뎊스에 맞게 확장
	    this._eachCurrentPath(function(path) {
	        if (path.tagName !== 'DIV') {
	            // 프레그먼트 노드인경우와 한번이상 감싸진 노드임
	            if (domUtils.isElemNode(nodes)) {
	                currentTagName = nodes.tagName;
	            } else {
	                currentTagName = nodes.firstChild.tagName;
	            }

	            if (path.tagName !== currentTagName) {
	                nodes = self._makeNodeAndAppend(path, nodes);
	            }
	        }
	    });

	    return nodes;
	};

	WwPasteContentHelper.prototype._eachCurrentPath = function(iteratee) {
	    var paths = domUtils.getPath(this.wwe.getEditor().getSelection().startContainer, this.wwe.get$Body()[0]);
	    var i;

	    for (i = paths.length - 1; i > -1; i -= 1) {
	        iteratee(paths[i]);
	    }
	};

	/** _makeNodeAndAppend
	 * make node and append their own children
	 * @param {HTMLElement} pathInfo HTMLElement to make
	 * @param {HTMLElement} content Nodes to append
	 * @returns {HTMLElement} node
	 * @memberOf WwPasteContentHelper
	 * @private
	 */
	WwPasteContentHelper.prototype._makeNodeAndAppend = function(pathInfo, content) {
	    var node = $('<' + pathInfo.tagName + '/>');

	    node.append(content);

	    if (pathInfo.id) {
	        node.attr('id', pathInfo.id);
	    }

	    if (pathInfo.className) {
	        node.addClass(pathInfo.className);
	    }

	    return node[0];
	};

	module.exports = WwPasteContentHelper;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements selection marker for wysiwyg
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var domUtils = __webpack_require__(19);

	var MARKER_CSS_CLASS = 'tui-editor-selection-marker';

	/**
	 * WwSelectionMarker
	 * @exports WwSelectionMarker
	 * @class WwSelectionMarker
	 * @constructor
	 */
	function WwSelectionMarker() {
	    this._markerNode = null;
	}

	/**
	 * insertMarker
	 * @param {Range} range range
	 * @param {SquireExt} sq SquireExt instance
	 * @returns {Range} range range
	 * @memberOf WwSelectionMarker
	 * @api
	 */
	WwSelectionMarker.prototype.insertMarker = function(range, sq) {
	    this._markerNode = this._makeMarker(sq);

	    range.insertNode(this._markerNode);
	    range.setStartAfter(this._markerNode);

	    return range;
	};

	/**
	 * _makeMarker
	 * Make marker element
	 * @param {SquireExt} sq SquireExt instance
	 * @returns {Node} marker
	 * @memberOf WwSelectionMarker
	 * @private
	 */
	WwSelectionMarker.prototype._makeMarker = function(sq) {
	    return sq.createElement('INPUT', {type: 'hidden', class: MARKER_CSS_CLASS});
	};

	/**
	 * restore
	 * Restore marker to selection
	 * @param {SquireExt} sq SquireExt instance
	 * @returns {Range} range
	 * @memberOf WwSelectionMarker
	 * @api
	 */
	WwSelectionMarker.prototype.restore = function(sq) {
	    var newRange = sq.getSelection().cloneRange();

	    newRange.setStartBefore(this._markerNode);
	    newRange.collapse(true);

	    sq.setSelection(newRange);

	    $(this._markerNode).remove();

	    //task안의 컬러의 경우, 컨테이너가 컬러span 그리고 startOffset이 0인경우 컬러가 끊긴다.
	    //입력시 컬러가 이어지도록하려면 추가 보정이 필요하다
	    if (newRange.startOffset === 0
	        && domUtils.isTextNode(newRange.startContainer.childNodes[0])
	        && !newRange.startContainer.childNodes[0].textContent.replace(/\u200B/, '')
	    ) {
	        newRange.setStart(newRange.startContainer.childNodes[0], 1);
	        sq.setSelection(newRange);
	    }

	    return newRange;
	};

	module.exports = WwSelectionMarker;


/***/ },
/* 32 */
/***/ function(module, exports) {

	/**
	 * @fileoverview Implements wysiwyg list manager
	 * @author Junghwan Park(junghwan.pakr@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var FIND_LI_ELEMENT = /<li/i;

	/**
	 * WwListManager
	 * @exports WwListManager
	 * @constructor
	 * @class WwListManager
	 * @param {WysiwygEditor} wwe WysiwygEditor instance
	 */
	function WwListManager(wwe) {
	    this.wwe = wwe;
	    this.eventManager = wwe.eventManager;

	    this._init();
	}

	/**
	 * Name property
	 * @api
	 * @memberOf WwListManager
	 * @type {string}
	 */
	WwListManager.prototype.name = 'list';

	/**
	 * _init
	 * Initialize
	 * @memberOf WwListManager
	 * @private
	 */
	WwListManager.prototype._init = function() {
	    this._initEvent();
	};

	/**
	 * _initEvent
	 * Initialize event
	 * @memberOf WwListManager
	 * @private
	 */
	WwListManager.prototype._initEvent = function() {
	    var self = this;

	    this.eventManager.listen('wysiwygRangeChangeAfter', function() {
	        self._findAndRemoveEmptyList();
	    });
	};
	/**
	 * Find empty list for whole container and remove it.
	 * @memberOf WwListManager
	 * @private
	 */
	WwListManager.prototype._findAndRemoveEmptyList = function() {
	    this.wwe.get$Body()
	        .find('ul,ol')
	        .each(function(index, node) {
	            if (!(FIND_LI_ELEMENT.test(node.innerHTML))) {
	                $(node).remove();
	            }
	        });
	};

	/**
	 * Return boolean value that current range is in the List or not
	 * @api
	 * @memberOf WwListManager
	 * @returns {boolean}
	 */
	WwListManager.prototype.isInList = function() {
	    var range = this.wwe.getEditor().getSelection().cloneRange();

	    return $(range.startContainer).parents('LI').length !== 0;
	};

	module.exports = WwListManager;


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements wysiwyg task manager
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var domUtils = __webpack_require__(19);

	var FIND_TASK_SPACES_RX = /^[\s\u200B]+/;

	/**
	 * WwTaskManager
	 * @exports WwTaskManager
	 * @class WwTaskManager
	 * @constructor
	 * @param {WysiwygEditor} wwe WysiwygEditor instance
	 */
	function WwTaskManager(wwe) {
	    this.wwe = wwe;
	    this.eventManager = wwe.eventManager;

	    this._init();
	}

	/**
	 * Name property
	 * @api
	 * @memberOf WwTaskManager
	 * @type {string}
	 */
	WwTaskManager.prototype.name = 'task';

	/**
	 * _init
	 * Init
	 * @memberOf WwTaskManager
	 * @private
	 */
	WwTaskManager.prototype._init = function() {
	    this._initKeyHandler();
	    this._initEvent();
	};

	/**
	 * _initEvent
	 * Initialize event
	 * @memberOf WwTaskManager
	 * @private
	 */
	WwTaskManager.prototype._initEvent = function() {
	    var self = this;

	    this.eventManager.listen('wysiwygRangeChangeAfter', function() {
	        self._removeTaskInputInWrongPlace();
	        self._unformatIncompleteTask();
	        self._ensureSpaceNextToTaskInput();
	    });

	    this.eventManager.listen('wysiwygSetValueAfter', function() {
	        self._ensureSpaceNextToTaskInput();
	        self._removeTaskListClass();
	    });

	    this.eventManager.listen('wysiwygGetValueBefore', function() {
	        self._addCheckedAttrToCheckedInput();
	    });

	    this.eventManager.listen('wysiwygProcessHTMLText', function(html) {
	        //we need remove task input space that made for safari
	        return html.replace(/<input type="checkbox">(\s|&nbsp;)/g, '<input type="checkbox">');
	    });
	};

	/**
	 * _initKeyHandler
	 * Initialize key event handler
	 * @memberOf WwTaskManager
	 * @private
	 */
	WwTaskManager.prototype._initKeyHandler = function() {
	    var self = this;

	    this.wwe.addKeyEventHandler('ENTER', function(ev, range) {
	        if (self.wwe.getEditor().hasFormat('LI')) {
	            //we need unformat task then let Squire control list and make task again
	            //빈 태스크의 경우 input과 태스크상태를 지우고 리스트만 남기고 스콰이어가 리스트를 컨트롤한다
	            //if문에 task가 아닌 li인지를 체크하는것은
	            //현 뎊스가 일반리스트이고 이전뎊스가 태스크인 경우 엔터시 비정상 태스크로 남는것을 방지하기 위함
	            self._unformatTaskIfNeedOnEnter(range);

	            self.wwe.defer(function() {
	                self._formatTaskIfNeed();
	            });

	            return false;
	        }

	        return true;
	    });

	    this.wwe.addKeyEventHandler('BACK_SPACE', function(ev, range) {
	        if (range.collapsed) {
	            if (self.isInTaskList(range)) {
	                self._unformatTaskIfNeedOnBackspace(range);
	                //and delete list by squire

	                return false;
	            }
	        }

	        return true;
	    });

	    this.wwe.addKeyEventHandler('TAB', function(ev, range) {
	        if (range.collapsed) {
	            if (self.wwe.getEditor().hasFormat('LI')) {
	                ev.preventDefault();
	                self.eventManager.emit('command', 'IncreaseDepth');

	                return false;
	            }
	        }

	        return true;
	    });

	    this.wwe.addKeyEventHandler('SHIFT+TAB', function(ev, range) {
	        var isNeedNext;

	        if (range.collapsed) {
	            if (self.wwe.getEditor().hasFormat('LI')) {
	                ev.preventDefault();
	                self.eventManager.emit('command', 'DecreaseDepth');
	                isNeedNext = false;
	            }
	        }

	        return isNeedNext;
	    });
	};

	/**
	 * isInTaskList
	 * Check whether passed range is in task list or not
	 * @param {Range} range range
	 * @returns {boolean} result
	 * @memberOf WwTaskManager
	 * @api
	 */
	WwTaskManager.prototype.isInTaskList = function(range) {
	    var li;

	    if (!range) {
	        range = this.wwe.getEditor().getSelection().cloneRange();
	    }

	    if (range.startContainer.nodeType === Node.ELEMENT_NODE
	        && range.startContainer.tagName === 'LI'
	    ) {
	        li = range.startContainer;
	    } else {
	        li = $(range.startContainer).parents('li')[0];
	    }

	    return $(li).hasClass('task-list-item');
	};

	/**
	 * _unformatIncompleteTask
	 * Unformat incomplete task
	 * @memberOf WwTaskManager
	 * @private
	 */
	WwTaskManager.prototype._unformatIncompleteTask = function() {
	    this.wwe.get$Body().find('.task-list-item').each(function(index, task) {
	        if ((!domUtils.isElemNode(task.firstChild) || task.firstChild.tagName !== 'INPUT')
	            && (!domUtils.isElemNode(task.firstChild.firstChild) || task.firstChild.firstChild.tagName !== 'INPUT')
	        ) {
	            $(task).removeClass('task-list-item');
	        }
	    });
	};

	/**
	 * _removeTaskInputInWrongPlace
	 * Remove task input in wrong place while user editing
	 * @memberOf WwTaskManager
	 * @private
	 */
	WwTaskManager.prototype._removeTaskInputInWrongPlace = function() {
	    var self = this;

	    this._addCheckedAttrToCheckedInput();

	    this.wwe.get$Body()
	        .find('input:checkbox')
	        .each(function(index, node) {
	            var isInsideTask, isCorrectPlace, parent;

	            isInsideTask = ($(node).parents('li').length > 1 || $(node).parents('li').hasClass('task-list-item'));
	            isCorrectPlace = !node.previousSibling;

	            if (!isInsideTask || !isCorrectPlace) {
	                parent = $(node).parent();
	                $(node).remove();
	                self.wwe.replaceContentText(parent, FIND_TASK_SPACES_RX, '');
	            }
	        });
	};

	/**
	 * _unformatTaskIfNeedOnEnter
	 * Unformat task if need on enter
	 * @param {Range} range range
	 * @memberOf WwTaskManager
	 * @private
	 */
	WwTaskManager.prototype._unformatTaskIfNeedOnEnter = function(range) {
	    var $li;

	    $li = $(range.startContainer).closest('li');

	    if (this._isEmptyTask(range) && !$li.find('ul').length) {
	        this.unformatTask(range.startContainer);
	        $li.html('<div><br></div>');

	        range = this.wwe.getEditor().getSelection().cloneRange();
	        range.setStart($li.find('div')[0], 0);
	        range.collapse(true);
	        this.wwe.getEditor().setSelection(range);
	    }
	};

	/**
	 * Return whether task is empty or not
	 * @param {Range} range Range object
	 * @returns {boolean}
	 * @memberOf WwTaskManager
	 * @private
	 */
	WwTaskManager.prototype._isEmptyTask = function(range) {
	    return this.isInTaskList(range) && this._isEmptyContainer(range.startContainer);
	};

	/**
	 * Return whether textContent is empty or not
	 * @param {Node} node Node
	 * @returns {boolean}
	 * @memberOf WwTaskManager
	 * @private
	 */
	WwTaskManager.prototype._isEmptyContainer = function(node) {
	    return node.textContent.replace(FIND_TASK_SPACES_RX, '') === '';
	};

	/**
	 * _unformatTaskIfNeedOnBackspace
	 * Unformat task if need on backspace
	 * @param {Range} range range
	 * @memberOf WwTaskManager
	 * @private
	 */
	WwTaskManager.prototype._unformatTaskIfNeedOnBackspace = function(range) {
	    var startContainer, startOffset,
	        prevEl, needRemove;

	    startContainer = range.startContainer;
	    startOffset = range.startOffset;

	    //스타트 컨테이너가 엘리먼트인경우 엘리먼트 offset을 기준으로 다음 지워질것이 input인지 판단한다
	    //유저가 임의로 Task빈칸에 수정을 가했을경우
	    if (domUtils.isElemNode(startContainer)) {
	        //태스크리스트의 제일 첫 오프셋인경우(인풋박스 바로 위)
	        if (startOffset === 0) {
	            prevEl = domUtils.getChildNodeByOffset(startContainer, startOffset);
	        //inputbox 오른편 어딘가에서 지워지는경우
	        } else {
	            prevEl = domUtils.getChildNodeByOffset(startContainer, startOffset - 1);

	            //지워질위치가 인풋스페이스 텍스트 영역으로 의심되는경우 그다음 엘리먼드로 prevEl을 지정해준다.(그다음이 input이면 지워지도록)
	            if (domUtils.isTextNode(prevEl) && prevEl.nodeValue.length === 1
	                && FIND_TASK_SPACES_RX.test(prevEl.nodeValue)) {
	                prevEl = domUtils.getChildNodeByOffset(startContainer, startOffset - 2);
	            }
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
	        this.wwe.saveSelection(range);

	        $(prevEl).closest('li').removeClass('task-list-item');
	        $(prevEl).remove();

	        this.wwe.restoreSavedSelection();
	    }
	};

	/**
	 * _addCheckedAttrToCheckedInput
	 * Add checked attr to checked input
	 * @memberOf WwTaskManager
	 * @private
	 */
	WwTaskManager.prototype._addCheckedAttrToCheckedInput = function() {
	    var doc = this.wwe.getEditor().getDocument();

	    //save input checked state to tag
	    $(doc.body).find('input').each(function(index, input) {
	        if (input.checked) {
	            $(input).attr('checked', 'checked');
	        } else {
	            $(input).removeAttr('checked');
	        }
	    });
	};

	/**
	 * _removeTaskListClass
	 * Remove tasklist class
	 * @memberOf WwTaskManager
	 * @private
	 */
	WwTaskManager.prototype._removeTaskListClass = function() {
	    //because task-list class is block merge normal list and task list
	    this.wwe.get$Body().find('.task-list').each(function(index, node) {
	        $(node).removeClass('task-list');
	    });
	};


	/**
	 * findTextNodeFilter
	 * @this Node
	 * @returns {boolean} true or not
	 */
	function findTextNodeFilter() {
	    return this.nodeType === Node.TEXT_NODE;
	}

	/**
	 * _ensureSpaceNextToTaskInput
	 * Ensure space next to task input
	 * this because we need some space after input for safari cursor issue
	 * @memberOf WwTaskManager
	 * @private
	 */
	WwTaskManager.prototype._ensureSpaceNextToTaskInput = function() {
	    var firstTextNode, $wrapper,
	        self = this;

	    this.wwe.get$Body().find('.task-list-item').each(function(i, node) {
	        $wrapper = $(node).find('div');

	        if (!$wrapper.length) {
	            $wrapper = $(node);
	        }

	        firstTextNode = $wrapper.contents().filter(findTextNodeFilter)[0];

	        if (!firstTextNode || !(firstTextNode.nodeValue.match(FIND_TASK_SPACES_RX))) {
	            $(self.wwe.getEditor().getDocument().createTextNode(' ')).insertAfter($wrapper.find('input'));
	        }
	    });
	};

	/**
	 * unformatTask
	 * Unforamt task
	 * @param {Node} node target
	 * @memberOf WwTaskManager
	 * @api
	 */
	WwTaskManager.prototype.unformatTask = function unformatTask(node) {
	    var $li, firstTextNode, $wrapper;

	    $li = $(node).closest('li');

	    $wrapper = $li.children('div');

	    if (!$wrapper.length) {
	        $wrapper = $li;
	    }

	    $wrapper.find('input:checkbox').remove();

	    $li.removeClass('task-list-item');

	    if (!$li.attr('class')) {
	        $li.removeAttr('class');
	    }

	    firstTextNode = $wrapper.contents().filter(findTextNodeFilter)[0];

	    if (firstTextNode && firstTextNode.nodeValue.match(FIND_TASK_SPACES_RX)) {
	        firstTextNode.nodeValue = firstTextNode.nodeValue.replace(FIND_TASK_SPACES_RX, '');
	    }
	};

	/**
	 * formatTask
	 * Format task
	 * @param {Node} node target
	 * @memberOf WwTaskManager
	 * @api
	 */
	WwTaskManager.prototype.formatTask = function(node) {
	    var range, $selected, $li, hasInput, $block, sq;

	    sq = this.wwe.getEditor();
	    $selected = $(node);
	    $li = $selected.closest('li');

	    hasInput = $li.children('input:checkbox').length || $li.children('div').eq(0).children('input:checkbox').length;

	    $li.addClass('task-list-item');

	    if (!hasInput) {
	        $block = $li.children('div').eq(0);

	        if (!$block.length) {
	            $block = $li.eq(0);
	        }

	        range = sq.getSelection().cloneRange();

	        range.setStart($block[0], 0);
	        range.collapse(true);

	        sq.insertElement(sq.createElement('INPUT', {
	            type: 'checkbox'
	        }), range);

	        range.setStart($block[0], 1);

	        //we need some space for safari
	        sq.insertElement(sq.getDocument().createTextNode(' '), range);
	    }
	};

	/**
	 * _formatTaskIfNeed
	 * Format task if current range has task class name
	 * @memberOf WwTaskManager
	 * @private
	 */
	WwTaskManager.prototype._formatTaskIfNeed = function() {
	    var range = this.wwe.getEditor().getSelection().cloneRange();

	    if (this.isInTaskList(range)) {
	        range = this.wwe.insertSelectionMarker(range);
	        this.formatTask(range.startContainer);
	        this.wwe.restoreSelectionMarker();
	    }
	};

	module.exports = WwTaskManager;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements wysiwyg table manager
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var domUtils = __webpack_require__(19);

	/**
	 * WwTableManager
	 * @exports WwTableManager
	 * @constructor
	 * @class WwTableManager
	 * @param {WysiwygEditor} wwe WysiwygEditor instance
	 */
	function WwTableManager(wwe) {
	    this.wwe = wwe;
	    this.eventManager = wwe.eventManager;

	    this._lastCellNode = null;
	    this._init();
	}

	/**
	 * Name property
	 * @api
	 * @memberOf WwTableManager
	 * @type {string}
	 */
	WwTableManager.prototype.name = 'table';

	/**
	 * _init
	 * Initialize
	 * @memberOf WwTableManager
	 * @private
	 */
	WwTableManager.prototype._init = function() {
	    this._initKeyHandler();
	    this._initEvent();
	};

	/**
	 * _initEvent
	 * Initialize event
	 * @memberOf WwTableManager
	 * @private
	 */
	WwTableManager.prototype._initEvent = function() {
	    var self = this;

	    this.eventManager.listen('wysiwygRangeChangeAfter', function() {
	        self._unwrapBlockInTable();
	    });

	    this.eventManager.listen('wysiwygSetValueAfter', function() {
	        self._unwrapBlockInTable();
	    });

	    this.eventManager.listen('wysiwygProcessHTMLText', function(html) {
	        //remove last br in td or th
	        return html.replace(/<br \/>(<\/td>|<\/th>)/g, '$1');
	    });
	};

	/**
	 * _initKeyHandler
	 * Initialize key event handler
	 * @memberOf WwTableManager
	 * @private
	 */
	WwTableManager.prototype._initKeyHandler = function() {
	    var self = this;

	    this.wwe.addKeyEventHandler(function(ev, range) {
	        if (self._isInTable(range)) {
	            self._recordUndoStateIfNeed(range);
	        } else if (self._lastCellNode) {
	            self._recordUndoStateAndResetCellNode(range);
	        }
	    });

	    this.wwe.addKeyEventHandler('ENTER', function(ev, range) {
	        var isNeedNext;

	        if (self._isAfterTable(range)) {
	            ev.preventDefault();
	            range.setStart(range.startContainer, range.startOffset - 1);
	            self.wwe.breakToNewDefaultBlock(range);
	            isNeedNext = false;
	        } else if (self._isBeforeTable(range)) {
	            ev.preventDefault();
	            self.wwe.breakToNewDefaultBlock(range, 'before');
	            isNeedNext = false;
	        } else if (self._isInTable(range)) {
	            self._appendBrIfTdOrThNotHaveAsLastChild(range);
	            isNeedNext = false;
	        }

	        return isNeedNext;
	    });

	    this.wwe.addKeyEventHandler('BACK_SPACE', function(ev, range) {
	        var isNeedNext;

	        if (range.collapsed) {
	            if (self._isInTable(range)) {
	                self._tableHandlerOnBackspace(range, ev);
	                isNeedNext = false;
	            } else if (self._isAfterTable(range)) {
	                ev.preventDefault();
	                self._removeTableOnBackspace(range);
	                isNeedNext = false;
	            }
	        }

	        return isNeedNext;
	    });
	};

	/**
	 * _isInTable
	 * Check whether passed range is in table or not
	 * @param {Range} range range
	 * @returns {boolean} result
	 * @memberOf WwTableManager
	 * @private
	 */
	WwTableManager.prototype._isInTable = function(range) {
	    var target;

	    if (range.collapsed) {
	        target = range.startContainer;
	    } else {
	        target = range.commonAncestorContainer;
	    }

	    return !!$(target).closest('table').length;
	};

	/**
	 * _isBeforeTable
	 * Check whether passed range is right before table or not
	 * @param {Range} range range
	 * @returns {boolean} result
	 * @memberOf WwTableManager
	 * @private
	 */
	WwTableManager.prototype._isBeforeTable = function(range) {
	    return domUtils.getNodeName(domUtils.getChildNodeByOffset(range.startContainer, range.startOffset)) === 'TABLE';
	};

	/**
	 * _isAfterTable
	 * Check whether passed range is right after table or not
	 * @param {Range} range range
	 * @returns {boolean} result
	 * @memberOf WwTableManager
	 * @private
	 */
	WwTableManager.prototype._isAfterTable = function(range) {
	    var prevElem = domUtils.getPrevOffsetNodeUntil(range.startContainer, range.startOffset);

	    return domUtils.getNodeName(prevElem) === 'TABLE'
		&& range.commonAncestorContainer === this.wwe.get$Body()[0];
	};

	/**
	 * _tableHandlerOnBackspace
	 * Backspace handler in table
	 * @param {Range} range range
	 * @param {Event} event event
	 * @memberOf WwTableManager
	 * @private
	 */
	WwTableManager.prototype._tableHandlerOnBackspace = function(range, event) {
	    var prevNode = domUtils.getPrevOffsetNodeUntil(range.startContainer, range.startOffset, 'TR'),
	        prevNodeName = domUtils.getNodeName(prevNode);

	    if (!prevNode || prevNodeName === 'TD' || prevNodeName === 'TH') {
	        event.preventDefault();
	    } else if (prevNodeName === 'BR' && prevNode.parentNode.childNodes.length !== 1) {
	        event.preventDefault();
	        $(prevNode).remove();
	    }
	};

	/**
	 * _appendBrIfTdOrThNotHaveAsLastChild
	 * Append br if td or th doesn't have br as last child
	 * @param {Range} range range
	 * @memberOf WwTableManager
	 * @private
	 */
	WwTableManager.prototype._appendBrIfTdOrThNotHaveAsLastChild = function(range) {
	    var paths, tdOrTh, startContainerNodeName;

	    startContainerNodeName = domUtils.getNodeName(range.startContainer);

	    if (startContainerNodeName === 'TD' || startContainerNodeName === 'TH') {
	        tdOrTh = range.startContainer;
	    } else {
	        paths = $(range.startContainer).parentsUntil('tr');
	        tdOrTh = paths[paths.length - 1];
	    }

	    if (domUtils.getNodeName(tdOrTh.lastChild) !== 'BR' && domUtils.getNodeName(tdOrTh.lastChild) !== 'DIV') {
	        $(tdOrTh).append('<br>');
	    }
	};

	/**
	 * _unwrapBlockInTable
	 * Unwrap default block tag in table
	 * For Squire default action making abnormal behavior, remove default blocks in Table after setValue() called
	 * @memberOf WwTableManager
	 * @private
	 */
	WwTableManager.prototype._unwrapBlockInTable = function() {
	    this.wwe.get$Body().find('td div, th div').each(function(index, node) {
	        $(node).children().unwrap();
	    });
	};

	/**
	 * _removeTableOnBackspace
	 * Remove table on backspace
	 * @param {Range} range range
	 * @memberOf WwTableManager
	 * @private
	 */
	WwTableManager.prototype._removeTableOnBackspace = function(range) {
	    var table = domUtils.getPrevOffsetNodeUntil(range.startContainer, range.startOffset);

	    this.wwe.getEditor().saveUndoState(range);

	    this.wwe.insertSelectionMarker(range);
	    $(table).remove();
	    this.wwe.restoreSelectionMarker();
	};

	/**
	 * _recordUndoStateIfNeed
	 * record undo state if need
	 * @param {Range} range range
	 * @memberOf WwTableManager
	 * @private
	 */
	WwTableManager.prototype._recordUndoStateIfNeed = function(range) {
	    var currentCellNode = domUtils.getParentUntil(range.startContainer, 'TR');

	    if (range.collapsed && this._lastCellNode !== currentCellNode) {
	        this.wwe.getEditor().saveUndoState(range);
	        this._lastCellNode = currentCellNode;
	    }
	};

	/**
	 * _recordUndoStateAndResetCellNode
	 * record undo state and reset last cell node
	 * @param {Range} range range
	 * @memberOf WwTableManager
	 * @private
	 */
	WwTableManager.prototype._recordUndoStateAndResetCellNode = function(range) {
	    this.wwe.getEditor().saveUndoState(range);
	    this._lastCellNode = null;
	};

	module.exports = WwTableManager;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements wysiwyg hr manager
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var domUtils = __webpack_require__(19);

	/**
	 * WwHrManager
	 * @exports WwHrManager
	 * @constructor
	 * @class WwHrManager
	 * @param {WysiwygEditor} wwe WysiwygEditor instance
	 */
	function WwHrManager(wwe) {
	    this.wwe = wwe;
	    this.eventManager = wwe.eventManager;

	    this._init();
	}
	/**
	 * Name property
	 * @api
	 * @memberOf WwHrManager
	 * @type {string}
	 */
	WwHrManager.prototype.name = 'hr';

	/**
	 * _init
	 * Initialize
	 * @memberOf WwHrManager
	 * @private
	 */
	WwHrManager.prototype._init = function() {
	    this._initKeyHandler();
	    this._initEvent();
	};

	/**
	 * _initEvent
	 * Initialize eventmanager event
	 * @memberOf WwHrManager
	 * @private
	 */
	WwHrManager.prototype._initEvent = function() {
	    var self = this;

	    this.eventManager.listen('wysiwygSetValueAfter', function() {
	        self._unwrapDivOnHr();
	    });

	    this.eventManager.listen('wysiwygGetValueBefore', function() {
	        self._wrapDefaultBlockToOrphanTexts();
	    });
	};

	/**
	 * _initKeyHandler
	 * Initialize key event handler
	 * @memberOf WwHrManager
	 * @private
	 */
	WwHrManager.prototype._initKeyHandler = function() {
	    var self = this;

	    this.wwe.addKeyEventHandler(function(ev, range) {
	        return self._onTypedInHr(range);
	    });

	    this.wwe.addKeyEventHandler('ENTER', function(ev, range) {
	        if (range.collapsed) {
	            return self._removeHrOnEnter(range, ev);
	        }

	        return true;
	    });

	    this.wwe.addKeyEventHandler('BACK_SPACE', function(ev, range) {
	        if (range.collapsed) {
	            return self._removeHrOnBackspace(range, ev);
	        }

	        return true;
	    });
	};

	/**
	 * _isInHr
	 * Check whether passed range is in hr or not
	 * @param {Range} range range
	 * @returns {boolean} result
	 * @memberOf WwHrManager
	 * @private
	 */
	WwHrManager.prototype._isInHr = function(range) {
	    return domUtils.getNodeName(range.startContainer.childNodes[range.startOffset]) === 'HR';
	};

	/**
	 * _isNearHr
	 * Check whether passed range is near hr or not
	 * @param {Range} range range
	 * @returns {boolean} result
	 * @memberOf WwHrManager
	 * @private
	 */
	WwHrManager.prototype._isNearHr = function(range) {
	    var prevNode = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset - 1);

	    return domUtils.getNodeName(prevNode) === 'HR';
	};

	/**
	 * Handler for delete HR when user typing within
	 * @param {Range} range Range object
	 * @memberOf WwHrManager
	 * @private
	 */
	WwHrManager.prototype._onTypedInHr = function(range) {
	    var self = this;

	    //HR위에서 테스트 컨텐츠 입력을 시도한경우에 대한 대비
	    if (this._isInHr(range) || this._isNearHr(range)) {
	        this.wwe.defer(function(wwe) {
	            wwe.saveSelection();
	            self._wrapDefaultBlockToOrphanTexts();
	            wwe.restoreSavedSelection();
	        });
	    }
	};

	/**
	 * _removeHrOnEnter
	 * Remove hr if need on enter
	 * @param {Range} range range
	 * @param {Event} ev event
	 * @returns {boolean} return true if hr was removed
	 * @memberOf WwHrManager
	 * @private
	 */
	WwHrManager.prototype._removeHrOnEnter = function(range, ev) {
	    var hrSuspect, blockPosition;

	    if (this._isInHr(range)) {
	        hrSuspect = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset);
	    } else if (this._isNearHr(range)) {
	        hrSuspect = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset - 1);
	        blockPosition = 'before';
	    }

	    return this._changeHrToNewDefaultBlock(hrSuspect, range, ev, blockPosition);
	};

	/**
	 * _removeHrOnBackspace
	 * Remove hr if need on backspace
	 * @param {Range} range range
	 * @param {Event} ev event
	 * @returns {boolean} return true if hr was removed
	 * @memberOf WwHrManager
	 * @private
	 */
	WwHrManager.prototype._removeHrOnBackspace = function(range, ev) {
	    var hrSuspect, blockPosition;

	    if (this._isInHr(range)) {
	        hrSuspect = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset);
	    } else if (range.startOffset === 0) {
	        hrSuspect = domUtils.getTopPrevNodeUnder(range.startContainer, this.wwe.get$Body()[0]);
	        blockPosition = 'none';
	    } else if (this._isNearHr(range)) {
	        hrSuspect = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset - 1);
	        blockPosition = 'before';
	    }

	    return this._changeHrToNewDefaultBlock(hrSuspect, range, ev, blockPosition);
	};

	/**
	 * _changeHrToNewDefaultBlock
	 * Remove hr and add new default block then set range to it
	 * @param {Node} hrSuspect Node could be hr
	 * @param {Range} range range
	 * @param {Event} ev event
	 * @param {strong} newBlockPosition new default block add position
	 * @returns {boolean} return true if hr was removed
	 * @memberOf WwHrManager
	 * @private
	 */
	WwHrManager.prototype._changeHrToNewDefaultBlock = function(hrSuspect, range, ev, newBlockPosition) {
	    if (hrSuspect && domUtils.getNodeName(hrSuspect) === 'HR') {
	        ev.preventDefault();

	        if (newBlockPosition !== 'none') {
	            this.wwe.breakToNewDefaultBlock(range, newBlockPosition);
	        }

	        $(hrSuspect).remove();

	        return false;
	    }

	    return true;
	};

	/**
	 * _unwrapDivOnHr
	 * Unwrap default block on hr
	 * @memberOf WwHrManager
	 * @private
	 */
	WwHrManager.prototype._unwrapDivOnHr = function() {
	    this.wwe.get$Body().find('hr').each(function(index, node) {
	        if ($(node).parent().is('div')) {
	            $(node).parent().find('br').remove();
	            $(node).unwrap();
	        }
	    });
	};


	/**
	 * findTextNodeFilter
	 * @function
	 * @this Node
	 * @returns {boolean}
	 */
	function findTextNodeFilter() {
	    return this.nodeType === Node.TEXT_NODE;
	}

	/**
	 * _wrapDefaultBlockToOrphanTexts
	 * Wrap default block to orphan texts
	 * mainly, this is used for orphan text that made by controlling hr
	 * @memberOf WwHrManager
	 * @private
	 */
	WwHrManager.prototype._wrapDefaultBlockToOrphanTexts = function() {
	    var textNodes;

	    textNodes = this.wwe.get$Body().contents().filter(findTextNodeFilter);

	    textNodes.each(function(i, node) {
	        $(node).wrap('<div />');
	    });
	};

	module.exports = WwHrManager;


/***/ },
/* 36 */
/***/ function(module, exports) {

	/**
	 * @fileoverview Implements wysiwyg p manager
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	/**
	 * WwPManager
	 * @exports WwPManager
	 * @class WwPManager
	 * @constructor
	 * @param {WysiwygEditor} wwe wysiwygEditor instance
	 */
	function WwPManager(wwe) {
	    this.wwe = wwe;
	    this.eventManager = wwe.eventManager;

	    this._init();
	}

	/**
	 * Name property
	 * @api
	 * @memberOf WwPManager
	 * @type {string}
	 */
	WwPManager.prototype.name = 'p';

	/**
	 * _init
	 * Init
	 * @memberOf WwPManager
	 * @private
	 */
	WwPManager.prototype._init = function() {
	    this._initEvent();
	};

	/**
	 * _initEvent
	 * Initialize event
	 * @memberOf WwPManager
	 * @private
	 */
	WwPManager.prototype._initEvent = function() {
	    var self = this;

	    this.eventManager.listen('wysiwygSetValueAfter', function() {
	        self._ensurePtagContentWrappedWithDiv();
	        self._unwrapPtags();
	    });
	};

	/**
	 * _ensurePtagContentWrappedWithDiv
	 * Wrap new line inside P tag to DIV, and additional empty line added within too
	 * @memberOf WwPManager
	 * @private
	 */
	WwPManager.prototype._ensurePtagContentWrappedWithDiv = function() {
	    this.wwe.get$Body().find('p').each(function(index, node) {
	        if ($(node).find('div').length <= 0) {
	            $(node).wrapInner('<div />');
	        }

	        if ($(node).next().is('p')) {
	            $(node).append('<div><br></div>');
	        }
	    });
	};

	/**
	 * _unwrapPtags
	 * Unwrap P tag
	 * @memberOf WwPManager
	 * @private
	 */
	WwPManager.prototype._unwrapPtags = function() {
	    this.wwe.get$Body().find('div').each(function(index, node) {
	        if ($(node).parent().is('p')) {
	            $(node).unwrap();
	        }
	    });
	};

	module.exports = WwPManager;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements wysiwyg heading manager
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var domUtils = __webpack_require__(19);

	var FIND_HEADING_RX = /h[\d]/i;

	/**
	 * WwHeadingManager
	 * @exports WwHeadingManager
	 * @constructor
	 * @class WwHeadingManager
	 * @param {WysiwygEditor} wwe WysiwygEditor instance
	 */
	function WwHeadingManager(wwe) {
	    this.wwe = wwe;
	    this.eventManager = wwe.eventManager;

	    this._init();
	}

	/**
	 * Name property
	 * @api
	 * @memberOf WwHeadingManager
	 * @type {string}
	 */
	WwHeadingManager.prototype.name = 'heading';

	/**
	 * _init
	 * Initialize
	 * @memberOf WwHeadingManager
	 * @private
	 */
	WwHeadingManager.prototype._init = function() {
	    this._initKeyHandler();
	};

	/**
	 * _initKeyHandler
	 * Initialize key event handler
	 * @memberOf WwHeadingManager
	 * @private
	 */
	WwHeadingManager.prototype._initKeyHandler = function() {
	    var self = this;

	    this.wwe.addKeyEventHandler('ENTER', function(ev, range) {
	        if (self.wwe.hasFormatWithRx(FIND_HEADING_RX)) {
	            self._onEnter(ev, range);

	            return false;
	        }

	        return true;
	    });

	    this.wwe.addKeyEventHandler('BACK_SPACE', function(ev, range) {
	        if (self.wwe.hasFormatWithRx(FIND_HEADING_RX)) {
	            self._removePrevTopNodeIfNeed(ev, range);

	            return false;
	        }

	        return true;
	    });
	};

	/**
	 * _unwrapHeading
	 * Unwrap heading
	 * @memberOf WwHeadingManager
	 * @private
	 */
	WwHeadingManager.prototype._unwrapHeading = function() {
	    this.wwe.unwrapBlockTag(function(node) {
	        return FIND_HEADING_RX.test(node);
	    });
	};

	/**
	 * _onEnter
	 * Enter key handler
	 * @memberOf WwHeadingManager
	 * @param {Event} event event object
	 * @param {Range} range range
	 * @private
	 */
	WwHeadingManager.prototype._onEnter = function(event, range) {
	    var self = this;

	    if (range.startOffset > 0) {
	        //squire의 처리 중간이나 마지막에 개입할 방법이 없어 지연 처리
	        this.wwe.defer(function(wwe) {
	            self._unwrapHeading();
	            wwe.getEditor().removeLastUndoStack();
	        });
	    } else {
	        event.preventDefault();
	        this._insertEmptyBlockToPrevious(range);
	    }
	};

	/**
	 * _insertEmptyBlockToPrevious
	 * Insert empty block to previous of passed range
	 * @api
	 * @memberOf WwHeadingManager
	 * @param {Range} range range
	 * @private
	 */
	WwHeadingManager.prototype._insertEmptyBlockToPrevious = function(range) {
	    this.wwe.getEditor().saveUndoState(range);
	    $('<div><br></div>').insertBefore(domUtils.getParentUntil(range.startContainer, this.wwe.get$Body()[0]));
	};

	/**
	 * _removePrevTopNodeIfNeed
	 * Remove previous top node if need
	 * @memberOf WwHeadingManager
	 * @param {Event} event event object
	 * @param {Range} range range
	 * @returns {Boolean} whether needed or not
	 * @private
	 */
	WwHeadingManager.prototype._removePrevTopNodeIfNeed = function(event, range) {
	    var isHandled, prevTopNode;

	    if (range.collapsed) {
	        prevTopNode = domUtils.getTopPrevNodeUnder(range.startContainer, this.wwe.get$Body()[0]);

	        if (range.startOffset === 0
	            && prevTopNode
	            && !prevTopNode.textContent.length
	           ) {
	            event.preventDefault();
	            this.wwe.getEditor().saveUndoState(range);
	            $(prevTopNode).remove();
	            isHandled = true;
	        }
	    }

	    return isHandled;
	};

	module.exports = WwHeadingManager;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements wysiwyg p manager
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var domUtils = __webpack_require__(19);

	var util = tui.util;

	var tagEntities = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;'
	};

	/**
	 * WwCodeBlockManager
	 * @exports WwCodeBlockManager
	 * @class WwCodeBlockManager
	 * @constructor
	 * @param {WysiwygEditor} wwe wysiwygEditor instance
	 */
	function WwCodeBlockManager(wwe) {
	    this.wwe = wwe;
	    this.eventManager = wwe.eventManager;

	    this._init();
	}

	/**
	 * Name property
	 * @api
	 * @memberOf WwCodeBlockManager
	 * @type {string}
	 */
	WwCodeBlockManager.prototype.name = 'codeblock';

	/**
	 * _init
	 * Initialize
	 * @memberOf WwCodeBlockManager
	 * @private
	 */
	WwCodeBlockManager.prototype._init = function() {
	    this._initKeyHandler();
	    this._initEvent();
	};

	/**
	 * _initKeyHandler
	 * Initialize key event handler
	 * @memberOf WwCodeBlockManager
	 * @private
	 */
	WwCodeBlockManager.prototype._initKeyHandler = function() {
	    this.wwe.addKeyEventHandler('ENTER', this._recoverIncompleteLineInPreTag.bind(this));
	    this.wwe.addKeyEventHandler('BACK_SPACE', this._unforamtCodeIfToplineZeroOffset.bind(this));
	    this.wwe.addKeyEventHandler('BACK_SPACE', this._unformatCodeIfCodeBlockHasOneCodeTag.bind(this));
	    this.wwe.addKeyEventHandler('BACK_SPACE', this._removeLastCharInCodeTagIfCodeTagHasOneChar.bind(this));
	    this.wwe.addKeyEventHandler('BACK_SPACE', this._removeCodeIfCodeIsEmpty.bind(this));
	    this.wwe.addKeyEventHandler('BACK_SPACE', this._recoverIncompleteLineInPreTag.bind(this));
	};

	/**
	 * _initEvent
	 * Initialize eventmanager event
	 * @memberOf WwCodeBlockManager
	 * @private
	 */
	WwCodeBlockManager.prototype._initEvent = function() {
	    var self = this;

	    this.eventManager.listen('wysiwygSetValueAfter', function() {
	        self._splitCodeblockToEachLine();
	    });

	    this.eventManager.listen('wysiwygProcessHTMLText', function(html) {
	        return self._mergeCodeblockEachlinesFromHTMLText(html);
	    });
	};

	/**
	 * Convert copied nodes to code block if need
	 * @api
	 * @memberOf WwCodeBlockManager
	 * @param {Array.<Node>} nodes Node array
	 * @returns {DocumentFragment}
	 */
	WwCodeBlockManager.prototype.prepareToPasteOnCodeblock = function(nodes) {
	    var range = this.wwe.getEditor().getSelection().cloneRange();
	    var frag = this.wwe.getEditor().getDocument().createDocumentFragment();

	    if (nodes.length === 1 && this._isCodeBlock(nodes[0])) {
	        frag.appendChild(this._copyCodeblockTypeFromRangeCodeblock(nodes.shift(), range));
	    } else {
	        frag.appendChild(this._copyCodeblockTypeFromRangeCodeblock(this.convertToCodeblock(nodes), range));
	    }

	    return frag;
	};

	/**
	 * Wrap nodes into code block
	 * @api
	 * @memberOf WwCodeBlockManager
	 * @param {Array.<Node>} nodes Node array
	 * @returns {HTMLElement} Code block element
	 */
	WwCodeBlockManager.prototype.convertToCodeblock = function(nodes) {
	    var $codeblock = $('<pre />');
	    var self = this;
	    var node = nodes.shift();

	    while (node) {
	        $codeblock.append(self._makeCodeBlockLineHtml(node.textContent));
	        node = nodes.shift();
	    }

	    return $codeblock[0];
	};

	/**
	 * Copy content with code block style from code block selection
	 * @memberOf WwCodeBlockManager
	 * @param {HTMLElement} element Copied element
	 * @param {Range} range Range object
	 * @returns {HTMLElement}
	 * @private
	 */
	WwCodeBlockManager.prototype._copyCodeblockTypeFromRangeCodeblock = function(element, range) {
	    var blockNode, attrs;

	    blockNode = domUtils.getParentUntil(range.commonAncestorContainer, this.wwe.get$Body()[0]);

	    if (domUtils.getNodeName(blockNode) === 'PRE') {
	        attrs = $(blockNode).prop('attributes');

	        util.forEach(attrs, function(attr) {
	            $(element).attr(attr.name, attr.value);
	        });
	    }

	    return element;
	};

	/**
	 * Merge code block lines
	 * @memberOf WwCodeBlockManager
	 * @param {string} html HTML string
	 * @returns {string}
	 * @private
	 */
	WwCodeBlockManager.prototype._mergeCodeblockEachlinesFromHTMLText = function(html) {
	    html = html.replace(/<pre( .*?)?>(.*?)<\/pre>/g, function(match, codeAttr, code) {
	        code = code.replace(/<\/code><br \/>/g, '\n');
	        code = code.replace(/<code ?(.*?)>/g, '');
	        code = code.replace(/\n$/, '');

	        return '<pre><code' + (codeAttr || '') + '>' + code + '</code></pre>';
	    });

	    return html;
	};

	/**
	 * Split code block to lines
	 * @memberOf WwCodeBlockManager
	 * @private
	 */
	WwCodeBlockManager.prototype._splitCodeblockToEachLine = function() {
	    var self = this;

	    this.wwe.get$Body().find('pre').each(function(index, pre) {
	        var codelines = pre.textContent.replace(/\n+$/, '').split('\n'),
	            lang = $(pre).find('code').attr('data-language');

	        if (lang) {
	            $(pre).attr('data-language', lang);
	            $(pre).addClass('lang-' + lang);
	        }

	        $(pre).empty();

	        util.forEach(codelines, function(line) {
	            $(pre).append(self._makeCodeBlockLineHtml(line));
	        });
	    });
	};

	/**
	 * Make code HTML text
	 * @memberOf WwCodeBlockManager
	 * @param {string} lineContent Content text
	 * @returns {string}
	 * @private
	 */
	WwCodeBlockManager.prototype._makeCodeBlockLineHtml = function(lineContent) {
	    if (!lineContent) {
	        lineContent = '\u200B';
	    }

	    return '<div><code>' + sanitizeHtmlCode(lineContent) + '</code><br></div>';
	};

	/**
	 * Insert ZWB code block if in empty code
	 * @memberOf WwCodeBlockManager
	 * @param {Event} ev Event object
	 * @param {Range} range Range object
	 * @returns {boolean}
	 * @private
	 */
	WwCodeBlockManager.prototype._inserNewCodeIfInEmptyCode = function(ev, range) {
	    if (this.isInCodeBlock(range) && domUtils.getTextLength(range.startContainer) === 0) {
	        ev.preventDefault();
	        this.wwe.getEditor().saveUndoState(range);
	        $('<div><code>&#8203</code><br></div>').insertBefore(domUtils.getParentUntil(range.startContainer, 'PRE'));

	        return false;
	    }

	    return true;
	};

	/**
	 * Unformat code at top line and offset equals 0
	 * @memberOf WwCodeBlockManager
	 * @param {Event} ev Event object
	 * @param {Range} range Range object
	 * @returns {boolean}
	 * @private
	 */
	WwCodeBlockManager.prototype._unforamtCodeIfToplineZeroOffset = function(ev, range) {
	    var currentNodeName, code;

	    if (!this.isInCodeBlock(range)) {
	        return true;
	    }

	    currentNodeName = domUtils.getNodeName(range.startContainer);
	    code = domUtils.getParentUntil(range.startContainer, 'PRE');

	    //최상단의 라인의 0오프셋 일때
	    if (currentNodeName === 'TEXT'
	        && range.startOffset === 0
	        && !code.previousSibling
	    ) {
	        $(code).text(range.startContainer.textContent);

	        range.setStart(code.childNodes[0], 0);
	        this.wwe.getEditor().setSelection(range);

	        return false;
	    }

	    return true;
	};

	/**
	 * Unformat code when one CODE tag in PRE tag
	 * @memberOf WwCodeBlockManager
	 * @param {Event} ev Event object
	 * @param {Range} range Range object
	 * @returns {boolean}
	 * @private
	 */
	WwCodeBlockManager.prototype._unformatCodeIfCodeBlockHasOneCodeTag = function(ev, range) {
	    var pre, div;

	    if (!this.isInCodeBlock(range)) {
	        return true;
	    }

	    pre = domUtils.getParentUntil(range.startContainer);
	    div = domUtils.getParentUntil(range.startContainer, 'PRE');

	    //코드블럭이 code하나밖에 없을때
	    if (range.startOffset === 0 && $(pre).find('code').length <= 1) {
	        $(div).find('code').children().unwrap('code');

	        return false;
	    }

	    return true;
	};

	/**
	 * Remove last character in CODE tag when CODE has one character
	 * @memberOf WwCodeBlockManager
	 * @param {Event} ev Event object
	 * @param {Range} range Range object
	 * @returns {boolean}
	 * @private
	 */
	WwCodeBlockManager.prototype._removeLastCharInCodeTagIfCodeTagHasOneChar = function(ev, range) {
	    var currentNodeName;

	    if (!this.isInCodeBlock(range)) {
	        return true;
	    }

	    currentNodeName = domUtils.getNodeName(range.startContainer);

	    //텍스트 노드인경우 마지막 케릭터와 code블럭이 함께 삭제되는것을 방지(squire가 삭제하면 다시만든다)
	    if (currentNodeName === 'TEXT'
	        && domUtils.getOffsetLength(range.startContainer) === 1
	        && range.startOffset <= 2
	    ) {
	        ev.preventDefault();
	        range.startContainer.textContent = '\u200B';

	        return false;
	    }

	    return true;
	};

	/**
	 * Recover incomplete line in PRE tag
	 * @memberOf WwCodeBlockManager
	 * @param {Event} ev Event object
	 * @param {Range} range Range object
	 * @returns {boolean}
	 * @private
	 */
	WwCodeBlockManager.prototype._recoverIncompleteLineInPreTag = function(ev, range) {
	    var pre;

	    if (this.wwe.getEditor().hasFormat('PRE')) {
	        pre = domUtils.getParentUntil(range.startContainer, this.wwe.get$Body()[0]);

	        this.wwe.defer(function(wwe) {
	            var modified;

	            $(pre).find('div').each(function(index, div) {
	                if (!$(div).find('code').length) {
	                    $(div).html('<code>' + ($(div).text() || '&#8203') + '</code><br>');
	                    modified = true;
	                }
	            });

	            if (modified) {
	                wwe.readySilentChange();
	            }
	        });
	    }

	    return true;
	};

	/**
	 * Remove blank CODE tag
	 * @memberOf WwCodeBlockManager
	 * @param {Event} ev Event object
	 * @param {Range} range Range object
	 * @returns {boolean}
	 * @private
	 */
	WwCodeBlockManager.prototype._removeCodeIfCodeIsEmpty = function(ev, range) {
	    var currentNodeName, div;

	    if (this.isInCodeBlock(range)) {
	        currentNodeName = domUtils.getNodeName(range.startContainer);
	        div = domUtils.getParentUntil(range.startContainer, 'PRE');

	        if (currentNodeName === 'TEXT'
	            && domUtils.getOffsetLength(range.startContainer) === 0
	            && range.startOffset <= 1
	        ) {
	            $(div).html('<br>');

	            range.setStart(div, 0);
	            range.collapse(true);

	            this.wwe.getEditor().setSelection(range);

	            return false;
	        }
	    }

	    return true;
	};

	/**
	 * Return boolean value of whether current range is in the code block
	 * @memberOf WwCodeBlockManager
	 * @param {Range} range Range object
	 * @returns {boolean}
	 */
	WwCodeBlockManager.prototype.isInCodeBlock = function(range) {
	    var target;

	    if (range.collapsed) {
	        target = range.startContainer;
	    } else {
	        target = range.commonAncestorContainer;
	    }

	    return this._isCodeBlock(target);
	};

	/**
	 * Verify given element is code block
	 * @memberOf WwCodeBlockManager
	 * @param {HTMLElement} element Element
	 * @returns {boolean}
	 * @private
	 */
	WwCodeBlockManager.prototype._isCodeBlock = function(element) {
	    return !!$(element).closest('pre').length
	        && (!!$(element).closest('code').length || !!$(element).find('code').length);
	};

	function sanitizeHtmlCode(code) {
	    return code.replace(/[<>&]/g, function(tag) {
	        return tagEntities[tag] || tag;
	    });
	}

	module.exports = WwCodeBlockManager;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var domUtils = __webpack_require__(19);

	var Squire = window.Squire,
	    util = tui.util;

	var FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD)\b/;

	var isIElt11 = /Trident\/[456]\./.test(navigator.userAgent);

	/**
	 * SquireExt
	 * @exports SquireExt
	 * @augments Squire
	 * @constructor
	 * @class
	 */
	function SquireExt() {
	    Squire.apply(this, arguments);

	    this._decorateHandlerToCancelable('copy');
	    this._decorateHandlerToCancelable(isIElt11 ? 'beforepaste' : 'paste');
	}

	SquireExt.prototype = util.extend(
	    {},
	    Squire.prototype
	);

	SquireExt.prototype.get$Body = function() {
	    this.$body = this.$body || $(this.getRoot());

	    return this.$body;
	};

	/**
	 * _decorateHandlerToCancelable
	 * Decorate squire handler to cancelable cuz sometimes, we dont need squire handler process
	 * @param {string} eventName event name
	 */
	SquireExt.prototype._decorateHandlerToCancelable = function(eventName) {
	    var handlers, handler;

	    handlers = this._events[eventName];

	    if (handlers.length > 1) {
	        throw new Error('too many' + eventName + ' handlers in squire');
	    }

	    handler = handlers[0].bind(this);

	    handlers[0] = function decoratedSquireHandler(event) {
	        if (!event.defaultPrevented) {
	            handler(event);
	        }
	    };
	};

	SquireExt.prototype.changeBlockFormat = function(srcCondition, targetTagName) {
	    var self = this;

	    this.modifyBlocks(function(frag) {
	        var current, newFrag, newBlock, nextBlock, tagName, lastNodeOfNextBlock, appendChidToNextBlock;

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

	            appendChidToNextBlock = function(node) {
	                nextBlock.appendChild(node);
	            };

	            //find tag
	            while (current !== frag) {
	                tagName = current.tagName;

	                if (util.isFunction(srcCondition) ? srcCondition(tagName) : (tagName === srcCondition)) {
	                    nextBlock = current.childNodes[0];

	                    //there is no next blocktag
	                    //eslint-disable-next-line max-depth
	                    if (!domUtils.isElemNode(nextBlock) || current.childNodes.length > 1) {
	                        nextBlock = self.createDefaultBlock();

	                        util.forEachArray(util.toArray(current.childNodes), appendChidToNextBlock);

	                        lastNodeOfNextBlock = nextBlock.lastChild;

	                        //remove unneccesary br
	                        //eslint-disable-next-line max-depth
	                        if (lastNodeOfNextBlock && domUtils.getNodeName(lastNodeOfNextBlock) === 'BR') {
	                            nextBlock.removeChild(lastNodeOfNextBlock);
	                        }
	                    }

	                    //eslint-disable-next-line max-depth
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

	SquireExt.prototype.getCaretPosition = function() {
	    return this.getCursorPosition();
	};

	SquireExt.prototype.replaceSelection = function(content, selection) {
	    if (selection) {
	        this.setSelection(selection);
	    }

	    this._ignoreChange = true;
	    this.insertHTML(content);
	};

	SquireExt.prototype.replaceRelativeOffset = function(content, offset, overwriteLength) {
	    var selection;

	    selection = this.getSelection().cloneRange();

	    this._replaceRelativeOffsetOfSelection(content, offset, overwriteLength, selection);
	};

	SquireExt.prototype._replaceRelativeOffsetOfSelection = function(content, offset, overwriteLength, selection) {
	    var startSelectionInfo, endSelectionInfo, finalOffset;
	    var endOffsetNode = selection.endContainer;
	    var endTextOffset = selection.endOffset;

	    if (domUtils.getNodeName(endOffsetNode) !== 'TEXT') {
	        endOffsetNode = this._getClosestTextNode(endOffsetNode, endTextOffset);

	        if (endOffsetNode) {
	            if (domUtils.isTextNode(endOffsetNode)) {
	                endTextOffset = endOffsetNode.nodeValue.length;
	            } else {
	                endTextOffset = endOffsetNode.textContent.length;
	            }
	        }
	    }

	    if (endOffsetNode) {
	        startSelectionInfo = this.getSelectionInfoByOffset(endOffsetNode, endTextOffset + offset);
	        selection.setStart(startSelectionInfo.element, startSelectionInfo.offset);

	        finalOffset = endTextOffset + (offset + overwriteLength);
	        endSelectionInfo = this.getSelectionInfoByOffset(endOffsetNode, finalOffset);
	        selection.setEnd(endSelectionInfo.element, endSelectionInfo.offset);

	        this.replaceSelection(content, selection);
	    } else {
	        this.replaceSelection(content);
	    }
	};

	SquireExt.prototype._getClosestTextNode = function(node, offset) {
	    var foundNode = domUtils.getChildNodeByOffset(node, offset - 1);

	    if (domUtils.getNodeName(foundNode) !== 'TEXT') {
	        foundNode = foundNode.previousSibling;
	    }

	    return foundNode;
	};

	SquireExt.prototype.getSelectionInfoByOffset = function(anchorElement, offset) {
	    var traceElement, traceElementLength, traceOffset, stepLength;
	    var direction = offset >= 0 ? 'next' : 'previous';
	    var offsetAbs = Math.abs(offset);
	    var latestAvailableElement = traceElement;

	    if (direction === 'next') {
	        traceElement = anchorElement;
	    } else {
	        traceElement = anchorElement.previousSibling;
	    }

	    traceOffset = offsetAbs;
	    stepLength = 0;

	    while (traceElement) {
	        if (domUtils.isTextNode(traceElement)) {
	            traceElementLength = traceElement.nodeValue.length;
	        } else {
	            traceElementLength = traceElement.textContent.length;
	        }

	        stepLength += traceElementLength;

	        if (offsetAbs <= stepLength) {
	            break;
	        }

	        traceOffset -= traceElementLength;

	        if (domUtils.getTextLength(traceElement) > 0) {
	            latestAvailableElement = traceElement;
	        }

	        traceElement = traceElement[direction + 'Sibling'];
	    }

	    if (!traceElement) {
	        traceElement = latestAvailableElement;
	        traceOffset = domUtils.getTextLength(traceElement);
	    }

	    if (direction === 'previous') {
	        traceOffset = domUtils.getTextLength(traceElement) - traceOffset;
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

	    selection.setStart(selection.endContainer, selection.endOffset);
	    selection.collapse(true);

	    this.setSelection(selection);

	    return pos;
	};

	SquireExt.prototype.removeLastUndoStack = function() {
	    if (this._undoStack.length) {
	        this._undoStackLength -= 1;
	        this._undoIndex -= 1;
	        this._undoStack.pop();
	        this._isInUndoState = false;
	    }
	};

	SquireExt.prototype.replaceParent = function(node, from, to) {
	    var target;
	    target = $(node).closest(from);

	    if (target.length) {
	        target.wrapInner('<' + to + '/>');
	        target.children().unwrap();
	    }
	};

	SquireExt.prototype.preserveLastLine = function() {
	    var lastBlock = this.get$Body().children().last();

	    if (domUtils.getNodeName(lastBlock[0]) !== 'DIV') {
	        this._ignoreChange = true;
	        $(this.createDefaultBlock()).insertAfter(lastBlock);
	    }
	};

	SquireExt.prototype.scrollTop = function(top) {
	    if (util.isUndefined(top)) {
	        return this.get$Body().scrollTop();
	    }

	    return this.get$Body().scrollTop(top);
	};

	SquireExt.prototype.isIgnoreChange = function() {
	    return this._ignoreChange;
	};

	module.exports = SquireExt;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements WwTextObject
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var domUtils = __webpack_require__(19);
	var isIE11 = tui.util.browser.msie && tui.util.browser.version === 11;
	var isWindowChrome = (navigator.appVersion.indexOf('Win') !== -1) && tui.util.browser.chrome;
	var isNeedOffsetFix = isIE11 || isWindowChrome;

	/**
	 * WwTextObject
	 * @exports WwTextObject
	 * @class WwTextObject
	 * @constructor
	 * @param {WysiwygEditor} wwe wysiwygEditor
	 * @param {Range} range Range object
	 */
	function WwTextObject(wwe, range) {
	    this._wwe = wwe;

	    //msie11 and window chrome can't make start offset of range api correctly when compositing korean.
	    //so we need fix this when compositing korean.(and maybe other languages that needs composition.)
	    if (isNeedOffsetFix) {
	        this.isComposition = false;
	        this._initCompositionEvent();
	    }

	    this.setRange(range || this._wwe.getRange());
	}

	/**
	 * Initialize composition event
	 * @memberOf WwTextObject
	 * @private
	 */
	WwTextObject.prototype._initCompositionEvent = function() {
	    var self = this;

	    this._wwe.getEditor().addEventListener('compositionstart', function() {
	        self.isComposition = true;
	    });

	    this._wwe.getEditor().addEventListener('compositionend', function() {
	        self.isComposition = false;
	    });
	};

	/**
	 * Set _range object to given range object
	 * @param {Range} range Range object
	 * @memberOf WwTextObject
	 * @api
	 */
	WwTextObject.prototype.setRange = function(range) {
	    if (this._range) {
	        this._range.detach();
	    }

	    this._range = range;
	};

	/**
	 * Expand start offset by one
	 * @memberOf WwTextObject
	 * @api
	 */
	WwTextObject.prototype.expandStartOffset = function() {
	    var range = this._range;

	    if (domUtils.isTextNode(range.startContainer) && range.startOffset > 0) {
	        range.setStart(range.startContainer, range.startOffset - 1);
	    }
	};

	/**
	 * Expand end offset by one
	 * @memberOf WwTextObject
	 * @api
	 */
	WwTextObject.prototype.expandEndOffset = function() {
	    var range = this._range;

	    if (domUtils.isTextNode(range.endContainer) && range.endOffset < range.endContainer.nodeValue.length) {
	        range.setEnd(range.endContainer, range.endOffset + 1);
	    }
	};

	/**
	 * setEnd range on start
	 * @param {Range} range Range object
	 * @memberOf WwTextObject
	 * @api
	 */
	WwTextObject.prototype.setEndBeforeRange = function(range) {
	    var offset = range.startOffset;

	    if (this.isComposition) {
	        offset += 1;
	    }

	    this._range.setEnd(range.startContainer, offset);
	};

	/**
	 * Get text content
	 * @returns {string}
	 * @memberOf WwTextObject
	 * @api
	 */
	WwTextObject.prototype.getTextContent = function() {
	    return this._range.cloneContents().textContent;
	};

	/**
	 * Replace current selection content to given text
	 * @param {string} content Text content
	 * @memberOf WwTextObject
	 * @api
	 */
	WwTextObject.prototype.replaceContent = function(content) {
	    this._wwe.getEditor().setSelection(this._range);
	    this._wwe.getEditor().insertHTML(content);
	    this._range = this._wwe.getRange();
	};

	/**
	 * Delete current selection content
	 * @memberOf WwTextObject
	 * @api
	 */
	WwTextObject.prototype.deleteContent = function() {
	    this._wwe.getEditor().setSelection(this._range);
	    this._wwe.getEditor().insertHTML('');
	    this._range = this._wwe.getRange();
	};

	/**
	 * Peek previous element's content
	 * @param {number} offset Offset to peek
	 * @returns {string}
	 * @memberOf WwTextObject
	 * @api
	 */
	WwTextObject.prototype.peekStartBeforeOffset = function(offset) {
	    var range = this._range.cloneRange();

	    range.setStart(range.startContainer, Math.max(range.startOffset - offset, 0));
	    range.setEnd(this._range.startContainer, this._range.startOffset);

	    return range.cloneContents().textContent;
	};

	module.exports = WwTextObject;


/***/ },
/* 41 */
/***/ function(module, exports) {

	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';
	/**
	 * Editor container template
	 * @type {string}
	 */
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
	 * @constructor
	 * @class Layout
	 * @param {object} options Option object
	 * @param {EventManager} eventManager Event manager instance
	 */
	function Layout(options, eventManager) {
	    this.$el = $(options.el);
	    this.height = options.height;
	    this.type = options.initialEditType;
	    this.eventManager = eventManager;

	    this.init();
	    this._initEvent();
	}

	/**
	 * Initializer
	 * @api
	 * @memberOf Layout
	 */
	Layout.prototype.init = function() {
	    this._renderLayout();

	    this._initMarkdownAndPreviewSection();
	    this._initWysiwygSection();
	};

	/**
	 * Initialize show and hide event
	 * @memberOf Layout
	 * @private
	 */
	Layout.prototype._initEvent = function() {
	    this.eventManager.listen('hide', this.hide.bind(this));
	    this.eventManager.listen('show', this.show.bind(this));
	};

	/**
	 * Create editor container with template
	 * @memberOf Layout
	 * @private
	 */
	Layout.prototype._renderLayout = function() {
	    this.$containerEl = $(containerTmpl).appendTo(this.$el);
	};

	/**
	 * Switch editor mode to WYSIWYG
	 * @api
	 * @memberOf Layout
	 */
	Layout.prototype.switchToWYSIWYG = function() {
	    this.$containerEl.removeClass('te-md-mode');
	    this.$containerEl.addClass('te-ww-mode');
	};

	/**
	 * Switch editor mode to Markdown
	 * @api
	 * @memberOf Layout
	 */
	Layout.prototype.switchToMarkdown = function() {
	    this.$containerEl.removeClass('te-ww-mode');
	    this.$containerEl.addClass('te-md-mode');
	};

	/**
	 * Initialize editor to Markdown and set preview section
	 * @memberOf Layout
	 * @private
	 */
	Layout.prototype._initMarkdownAndPreviewSection = function() {
	    this.$mdEditorContainerEl = this.$containerEl.find('.te-md-container .te-editor');
	    this.$previewEl = this.$containerEl.find('.te-md-container .te-preview');
	};

	/**
	 * Initialize editor to WYSIWYG
	 * @memberOf Layout
	 * @private
	 */
	Layout.prototype._initWysiwygSection = function() {
	    this.$wwEditorContainerEl = this.$containerEl.find('.te-ww-container .te-editor');
	};

	/**
	 * Set preview to vertical split style
	 * @memberOf Layout
	 * @private
	 */
	Layout.prototype._verticalSplitStyle = function() {
	    this.$containerEl.find('.te-md-container').removeClass('te-preview-style-tab');
	    this.$containerEl.find('.te-md-container').addClass('te-preview-style-vertical');
	};

	/**
	 * Set tab style preview mode
	 * @memberOf Layout
	 * @private
	 */
	Layout.prototype._tabStyle = function() {
	    this.$containerEl.find('.te-md-container').removeClass('te-preview-style-vertical');
	    this.$containerEl.find('.te-md-container').addClass('te-preview-style-tab');
	};

	/**
	 * Toggle preview style between tab and vertical split
	 * @api
	 * @memberOf Layout
	 * @param {string} style Preview style ('tab' or 'vertical')
	 */
	Layout.prototype.changePreviewStyle = function(style) {
	    if (style === 'tab') {
	        this._tabStyle();
	    } else if (style === 'vertical') {
	        this._verticalSplitStyle();
	    }
	};

	/**
	 * Hide Editor
	 * @api
	 * @memberOf Layout
	 */
	Layout.prototype.hide = function() {
	    this.$el.find('.tui-editor').addClass('te-hide');
	};

	/**
	 * Show Editor
	 * @api
	 * @memberOf Layout
	 */
	Layout.prototype.show = function() {
	    this.$el.find('.tui-editor').removeClass('te-hide');
	};

	/**
	 * Remove Editor
	 * @api
	 * @memberOf Layout
	 */
	Layout.prototype.remove = function() {
	    this.$el.find('.tui-editor').remove();
	};

	/**
	 * Get jQuery wrapped editor container element
	 * @api
	 * @memberOf Layout
	 * @returns {jQuery}
	 */
	Layout.prototype.getEditorEl = function() {
	    return this.$containerEl;
	};

	/**
	 * Get jQuery wrapped preview element
	 * @api
	 * @memberOf Layout
	 * @returns {jQuery}
	 */
	Layout.prototype.getPreviewEl = function() {
	    return this.$previewEl;
	};

	/**
	 * Get jQuery wrapped Markdown editor element
	 * @api
	 * @memberOf Layout
	 * @returns {jQuery}
	 */
	Layout.prototype.getMdEditorContainerEl = function() {
	    return this.$mdEditorContainerEl;
	};

	/**
	 * Get jQuery wrapped WYSIWYG editor element
	 * @api
	 * @memberOf Layout
	 * @returns {jQuery}
	 */
	Layout.prototype.getWwEditorContainerEl = function() {
	    return this.$wwEditorContainerEl;
	};

	module.exports = Layout;


/***/ },
/* 42 */
/***/ function(module, exports) {

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
	    'setValueAfter',
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
	    'openPopupTableUtils',
	    'openHeadingSelect',
	    'closeAllPopup',
	    'command',
	    'htmlUpdate',
	    'markdownUpdate',
	    'renderedHtmlUpdated',
	    'removeEditor',
	    'convertorAfterMarkdownToHtmlConverted',
	    'convertorAfterHtmlToMarkdownConverted',
	    'stateChange',
	    'wysiwygSetValueAfter',
	    'wysiwygSetValueBefore',
	    'wysiwygGetValueBefore',
	    'wysiwygProcessHTMLText',
	    'wysiwygRangeChangeAfter',
	    'wysiwygKeyEvent',
	    'pasteBefore',
	    'scroll',
	    'click',
	    'mousedown',
	    'mouseup',
	    'contextmenu',
	    'keydown',
	    'keyup',
	    'keyMap',
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
	 * @constructor
	 * @class EventManager
	 */
	function EventManager() {
	    this.events = new util.Map();
	    this.TYPE = new util.Enum(eventList);
	}

	/**
	 * Listen event and bind event handler
	 * @api
	 * @memberOf EventManager
	 * @param {string} typeStr Event type string
	 * @param {function} handler Event handler
	 */
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

	/**
	 * Emit event
	 * @api
	 * @memberOf EventManager
	 * @param {string} eventName Event name to emit
	 * @returns {Array}
	 */
	EventManager.prototype.emit = function() {
	    var args = util.toArray(arguments),
	        typeStr = args.shift(),
	        typeInfo = this._getTypeInfo(typeStr),
	        eventHandlers = this.events.get(typeInfo.type),
	        result,
	        results;

	    if (eventHandlers) {
	        util.forEach(eventHandlers, function(handler) {
	            result = handler.apply(null, args);

	            if (!util.isUndefined(result)) {
	                results = results || [];
	                results.push(result);
	            }
	        });
	    }

	    return results;
	};

	/**
	 * Emit given event and return result
	 * @api
	 * @memberOf EventManager
	 * @param {string} eventName Event name to emit
	 * @param {string} sourceText Source text to change
	 * @returns {string}
	 */
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

	/**
	 * Get event type and namespace
	 * @memberOf EventManager
	 * @param {string} typeStr Event type name
	 * @returns {{type: string, namespace: string}}
	 * @private
	 */
	EventManager.prototype._getTypeInfo = function(typeStr) {
	    var splited = typeStr.split('.');

	    return {
	        type: splited[0],
	        namespace: splited[1]
	    };
	};

	/**
	 * Check whether event type exists or not
	 * @param {string} type Event type name
	 * @returns {boolean}
	 * @private
	 */
	EventManager.prototype._hasEventType = function(type) {
	    return !util.isUndefined(this.TYPE[type.split('.')[0]]);
	};

	/**
	 * Add event type when given event not exists
	 * @api
	 * @memberOf EventManager
	 * @param {string} type Event type name
	 */
	EventManager.prototype.addEventType = function(type) {
	    if (this._hasEventType(type)) {
	        throw new Error('There is already have event type ' + type);
	    }

	    this.TYPE.set(type);
	};

	/**
	 * Remove event handler from given event type
	 * @api
	 * @memberOf EventManager
	 * @param {string} type Event type name
	 */
	EventManager.prototype.removeEventHandler = function(type) {
	    var self = this,
	        typeInfo = this._getTypeInfo(type),
	        namespace = typeInfo.namespace;

	    type = typeInfo.type;

	    if (type && !namespace) {
	        //dont use dot notation cuz eslint
	        this.events['delete'](type);
	    } else if (!type && namespace) {
	        this.events.forEach(function(eventHandlers, eventType) {
	            self._removeEventHandlerWithTypeInfo(eventType, namespace);
	        });
	    } else if (type && namespace) {
	        self._removeEventHandlerWithTypeInfo(type, namespace);
	    }
	};

	/**
	 * Remove event handler with event type information
	 * @memberOf EventManager
	 * @param {string} type Event type name
	 * @param {string} namespace Event namespace
	 * @private
	 */
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


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements CommandManager
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var util = tui.util;

	var Command = __webpack_require__(44);

	var isMac = /Mac/.test(navigator.platform),
	    KEYMAP_OS_INDEX = isMac ? 1 : 0;

	/**
	 * CommandManager
	 * @exports CommandManager
	 * @constructor
	 * @class CommandManager
	 * @param {ToastUIEditor} base nedInstance
	 */
	function CommandManager(base) {
	    this._command = new util.Map();
	    this._mdCommand = new util.Map();
	    this._wwCommand = new util.Map();
	    this.base = base;

	    this.keyMapCommand = {};

	    this._initEvent();
	}

	/**
	 * Add command
	 * @api
	 * @memberOf CommandManager
	 * @param {Command} command Command instance
	 * @returns {Command} Command
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

	    if (command.keyMap) {
	        this.keyMapCommand[command.keyMap[KEYMAP_OS_INDEX]] = name;
	    }

	    return command;
	};


	/**
	 * _initEvent
	 * Bind event handler to eventManager
	 * @private
	 * @memberOf CommandManager
	 */
	CommandManager.prototype._initEvent = function() {
	    var self = this;

	    this.base.eventManager.listen('command', function() {
	        self.exec.apply(self, arguments);
	    });

	    this.base.eventManager.listen('keyMap', function(ev) {
	        var command = self.keyMapCommand[ev.keyMap];

	        if (command) {
	            ev.data.preventDefault();
	            self.exec(command);
	        }
	    });
	};

	/**
	 * Execute command
	 * @api
	 * @memberOf CommandManager
	 * @param {String} name Command name
	 * @returns {*}
	 */
	CommandManager.prototype.exec = function(name) {
	    var commandToRun, result,
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
	        result = commandToRun.exec.apply(commandToRun, args);
	    }

	    return result;
	};
	/**
	 * Create command by given editor type and property object
	 * @api
	 * @memberOf CommandManager
	 * @param {string} type Command type
	 * @param {{name: string, keyMap: object}} props Property
	 * @returns {*}
	 */
	CommandManager.command = function(type, props) {
	    var command;

	    command = Command.factory(type, props.name, props.keyMap);

	    util.extend(command, props);

	    return command;
	};


	module.exports = CommandManager;


/***/ },
/* 44 */
/***/ function(module, exports) {

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
	 * @class Command
	 * @param {string} name Command name
	 * @param {number} type Command type (Command.TYPE)
	 * @param {Array.<string>} [keyMap] keyMap
	 */
	function Command(name, type, keyMap) {
	    this.name = name;
	    this.type = type;

	    if (keyMap) {
	        this.setKeyMap(keyMap);
	    }
	}

	/**
	 * getName
	 * returns Name of command
	 * @api
	 * @memberOf Command
	 * @returns {string} Command Name
	 */
	Command.prototype.getName = function() {
	    return this.name;
	};

	/**
	 * getType
	 * returns Type of command
	 * @api
	 * @memberOf Command
	 * @returns {number} Command Command type number
	 */
	Command.prototype.getType = function() {
	    return this.type;
	};

	/**
	 * isMDType
	 * returns whether Command Type is Markdown or not
	 * @api
	 * @memberOf Command
	 * @returns {boolean} result
	 */
	Command.prototype.isMDType = function() {
	    return this.type === Command.TYPE.MD;
	};

	/**
	 * isWWType
	 * returns whether Command Type is Wysiwyg or not
	 * @api
	 * @memberOf Command
	 * @returns {boolean} result
	 */
	Command.prototype.isWWType = function() {
	    return this.type === Command.TYPE.WW;
	};

	/**
	 * isGlobalType
	 * returns whether Command Type is Global or not
	 * @api
	 * @memberOf Command
	 * @returns {boolean} result
	 */
	Command.prototype.isGlobalType = function() {
	    return this.type === Command.TYPE.GB;
	};

	/**
	 * setKeyMap
	 * Set keymap value for each os
	 * @api
	 * @memberOf Command
	 * @param {string} win Windows Key(and etc)
	 * @param {string} mac Mac osx key
	 */
	Command.prototype.setKeyMap = function(win, mac) {
	    this.keyMap = [win, mac];
	};

	/**
	 * Command factory method
	 * @api
	 * @memberOf Command
	 * @param {string} typeStr Editor type name
	 * @param {object} props Property
	 *     @param {string} props.name Command name
	 *     @param {number} props.type Command type number
	 * @returns {Command}
	 */
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
	 * markdown : 0
	 * wysiwyg : 1
	 * global : 2
	 * @api
	 * @memberOf Command
	 * @type {object}
	 */
	Command.TYPE = {
	    MD: 0,
	    WW: 1,
	    GB: 2
	};

	module.exports = Command;


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implement Module for managing import external data such as image
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var excelTableParser = __webpack_require__(46);

	var util = tui.util;

	var FIND_EXCEL_DATA = /^(([^\n\r]*|"[^"]+")(\t([^\n\r]*?|"[^"]+")){1,}[\r\n]*){1,}$/;

	/**
	 * ImportManager
	 * @exports ImportManager
	 * @constructor
	 * @class ImportManager
	 * @param {EventManager} eventManager eventManager
	 */
	function ImportManager(eventManager) {
	    this.eventManager = eventManager;

	    this._initDropEvent();
	    this._initPasteEvent();
	    this._initDefaultImageImporter();
	}

	/**
	 * Initialize drop event
	 * @memberOf ImportManager
	 * @private
	 */
	ImportManager.prototype._initDropEvent = function() {
	    var self = this;

	    this.eventManager.listen('drop', function(ev) {
	        var items = ev.data.dataTransfer && ev.data.dataTransfer.files;
	        self._processBlobItems(items, ev.data);
	    });
	};

	/**
	 * Initialize paste event
	 * @memberOf ImportManager
	 * @private
	 */
	ImportManager.prototype._initPasteEvent = function() {
	    var self = this;

	    this.eventManager.listen('paste', function(ev) {
	        self._processClipboard(ev.data);
	    });
	};

	/**
	 * Initialize default image importer
	 * @memberOf ImportManager
	 * @private
	 */
	ImportManager.prototype._initDefaultImageImporter = function() {
	    this.eventManager.listen('addImageBlobHook', function(blob, callback) {
	        var reader = new FileReader();

	        reader.onload = function(event) {
	            callback(event.target.result);
	        };

	        reader.readAsDataURL(blob);
	    });
	};

	/**
	 * Emit add image blob hook
	 * @memberOf ImportManager
	 * @param {object} item item
	 * @private
	 */
	ImportManager.prototype._emitAddImageBlobHook = function(item) {
	    var self = this,
	        blob = item.name ? item : item.getAsFile(); //Blob or File

	    this.eventManager.emit('addImageBlobHook', blob, function(url) {
	        self.eventManager.emit('command', 'AddImage', {imageUrl: url, altText: blob.name || 'image'});
	    });
	};

	/**
	 * Add table with excel style data
	 * @memberOf ImportManager
	 * @param {string} content Table data
	 * @private
	 */
	ImportManager.prototype._addExcelTable = function(content) {
	    var tableInfo = excelTableParser(content);
	    this.eventManager.emit('command', 'Table', tableInfo.col, tableInfo.row, tableInfo.data);
	};

	/**
	 * Get blob or excel data from clipboard
	 * @memberOf ImportManager
	 * @param {object} evData Clipboard data
	 * @private
	 */
	ImportManager.prototype._processClipboard = function(evData) {
	    var blobItems,
	        cbData, types;

	    cbData = evData.clipboardData || window.clipboardData;

	    blobItems = cbData && cbData.items;
	    types = cbData.types;

	    if (blobItems && types && types.length === 1 && util.inArray('Files', types) !== -1) {
	        this._processBlobItems(blobItems, evData);
	    } else {
	        this._precessDataTransfer(cbData, evData);
	    }
	};

	/**
	 * Process for blob item
	 * @memberOf ImportManager
	 * @param {Array.<string>} items Item array
	 * @param {object} evData Event data
	 * @private
	 */
	ImportManager.prototype._processBlobItems = function(items, evData) {
	    var self = this;

	    if (items) {
	        util.forEachArray(items, function(item) {
	            if (item.type.indexOf('image') !== -1) {
	                evData.preventDefault();
	                evData.codemirrorIgnore = true;
	                self._emitAddImageBlobHook(item);

	                return false;
	            }

	            return true;
	        });
	    }
	};

	/**
	 * Process for excel style data
	 * @memberOf ImportManager
	 * @param {HTMLElement} cbData Clipboard data
	 * @param {object} evData Event data
	 * @private
	 */
	ImportManager.prototype._precessDataTransfer = function(cbData, evData) {
	    var content;

	    content = cbData.getData('text');

	    if (FIND_EXCEL_DATA.test(content) && confirm('테이블 포맷으로 붙여넣겠습니까?')) {
	        evData.preventDefault();
	        evData.codemirrorIgnore = true;
	        this._addExcelTable(content);
	    }
	};

	module.exports = ImportManager;


/***/ },
/* 46 */
/***/ function(module, exports) {

	/**
	 * @fileoverview Implements excelTableParser
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	/**
	 * excelTableParser
	 * Parse excel paste data
	 * @public
	 * @exports excelTableParser
	 * @param {string} content excel table content
	 * @returns {object} result
	 */
	function excelTableParser(content) {
	    var rows = getRows(content),
	        data = [],
	        rowLength = rows.length,
	        colLength = 0;

	    rows.forEach(function(row) {
	        var cols = row.split('\t');

	        if (!cols) {
	            return;
	        } else if (!colLength) {
	            colLength = cols.length;
	        }

	        data = data.concat(cols);
	    });

	    return {
	        col: colLength,
	        row: rowLength,
	        data: data
	    };
	}
	/**
	 * Get row data from raw text with Regexp
	 * @public
	 * @param {string} content Raw copied text data
	 * @returns {Array}
	 */
	function getRows(content) {
	    content = content.replace(/"([^"]+)"/g, function(match, cell) {
	        return cell.replace(/(\r\n)|(\r)/g, '<br/>');
	    });

	    //remove last LF or CR
	    content = content.replace(/(\r\n$)|(\r$)|(\n$)/, '');
	    //CR or CR-LF to LF
	    content = content.replace(/(\r\n)|(\r)/g, '\n');

	    return content.split('\n');
	}

	module.exports = excelTableParser;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Convertor have responsible to convert markdown and html
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var markedCustomRenderer = __webpack_require__(48);

	var marked = window.marked,
	    toMark = window.toMark,
	    hljs = window.hljs;

	/**
	 * Convertor
	 * @exports Convertor
	 * @constructor
	 * @class Convertor
	 * @param {EventManager} em EventManager instance
	 */
	function Convertor(em) {
	    this.eventManager = em;
	}

	/**
	 * _markdownToHtmlWithCodeHighlight
	 * Convert markdown to html with Codehighlight
	 * @private
	 * @memberOf Convertor
	 * @param {string} markdown markdown text
	 * @returns {string} html text
	 */
	Convertor.prototype._markdownToHtmlWithCodeHighlight = function(markdown) {
	    markdown = markdown.replace(/\\\|/g, ':ESCAPE_VERTICAL_BAR:');

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
	    }).replace(/:ESCAPE_VERTICAL_BAR:/g, '|');
	};

	/**
	 * _markdownToHtml
	 * Convert markdown to html
	 * @private
	 * @memberOf Convertor
	 * @param {string} markdown markdown text
	 * @returns {string} html text
	 */
	Convertor.prototype._markdownToHtml = function(markdown) {
	    markdown = markdown.replace(/\\\|/g, ':ESCAPE_VERTICAL_BAR:');

	    return marked(markdown, {
	        renderer: markedCustomRenderer,
	        gfm: true,
	        tables: true,
	        breaks: true,
	        pedantic: false,
	        sanitize: false,
	        smartLists: true,
	        smartypants: false
	    }).replace(/:ESCAPE_VERTICAL_BAR:/g, '|');
	};

	/**
	 * toHTMLWithCodeHightlight
	 * Convert markdown to html with Codehighlight
	 * emit convertorAfterMarkdownToHtmlConverted
	 * @api
	 * @memberOf Convertor
	 * @param {string} markdown markdown text
	 * @returns {string} html text
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
	 * @api
	 * @memberOf Convertor
	 * @param {string} markdown markdown text
	 * @returns {string} html text
	 */
	Convertor.prototype.toHTML = function(markdown) {
	    var html = this._markdownToHtml(markdown);
	    html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);

	    return this._sanitizeScript(html);
	};

	/**
	 * toMarkdown
	 * Convert html to markdown
	 * emit convertorAfterHtmlToMarkdownConverted
	 * @api
	 * @memberOf Convertor
	 * @param {string} html html text
	 * @returns {string} markdown text
	 */
	Convertor.prototype.toMarkdown = function(html) {
	    var markdown = toMark(html);
	    markdown = this.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', markdown);

	    return markdown;
	};

	/**
	 * _sanitizeScript
	 * Sanitize script tag
	 * @private
	 * @memberOf Convertor
	 * @param {string} html html text
	 * @returns {string}
	 */
	Convertor.prototype._sanitizeScript = function(html) {
	    html = html.replace(/<script.*?>/g, '&lt;script&gt;');
	    html = html.replace(/<\/script>/g, '&lt;/script&gt;');

	    return html;
	};

	/**
	 * factory
	 * Convertor factory
	 * @api
	 * @memberOf Convertor
	 * @param {EventManager} eventManager eventmanager
	 * @returns {Convertor}
	 */
	Convertor.factory = function(eventManager) {
	    return new Convertor(eventManager);
	};

	module.exports = Convertor;


/***/ },
/* 48 */
/***/ function(module, exports) {

	/**
	 * @fileoverview Implements markedCustomRenderer
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent
	 */

	'use strict';

	/**
	 * markedCustomRenderer
	 * @exports markedCustomRenderer
	 * @augments marked.Renderer
	 * @class markedCustomRenderer
	 */
	var markedCustomRenderer = new window.marked.Renderer();

	/**
	 * Task list Regexp
	 * @api
	 * @memberOf markedCustomRenderer
	 * @type {RegExp}
	 */
	var regexTaskList = /^((?:<p>|))(\[(?:x| )\]) /i;

	/**
	 * Render listItem by given text.
	 * @api
	 * @memberOf markedCustomRenderer
	 * @param {string} text Source text
	 * @returns {string}
	 */
	markedCustomRenderer.listitem = function(text) {
	    var cap,
	        checked,
	        className = '',
	        output = '';

	    cap = regexTaskList.exec(text);

	    if (cap) {
	        text = text.substring(cap[0].length);
	        className = ' class="task-list-item"';
	        checked = cap[2].toLowerCase() === '[x]' ? ' checked' : '';
	        output += cap[1] + '<input type="checkbox" class="task-list-item-checkbox"' + checked + '> ';
	    }

	    return '<li' + className + '>' + output + text + '</li>\n';
	};

	/**
	 * Render code
	 * @api
	 * @memberOf markedCustomRenderer
	 * @param {string} code Source text of code content
	 * @param {string} lang Type of language
	 * @param {boolean} escaped Whether text is escaped or not
	 * @returns {string}
	 */
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

	/**
	 * Render table
	 * @api
	 * @memberOf markedCustomRenderer
	 * @param {string} header Text for table header
	 * @param {string} body Text for table body
	 * @returns {string}
	 */
	markedCustomRenderer.table = function(header, body) {
	    var cellLen = header.match(/\/th/g).length;
	    var foundLastTr = body.match(/\n?<tr>[\s\S]*?<\/tr>\n$/g);
	    var lastTr;

	    if (foundLastTr && foundLastTr.length) {
	        lastTr = foundLastTr[0];
	    }

	    if (lastTr && lastTr.match(/\/td/g).length < cellLen) {
	        body = body.replace(/<\/td>\n<\/tr>\n$/g, '</td>\n<td></td>\n</tr>\n');
	    }

	    return '<table>\n'
	        + '<thead>\n'
	        + header
	        + '</thead>\n'
	        + '<tbody>\n'
	        + body
	        + '</tbody>\n'
	        + '</table>\n';
	};

	/**
	 * Replace 'del' to 's' tag
	 * @api
	 * @memberOf markedCustomRenderer
	 * @override
	 * @param {string} text Text content
	 * @returns {string}
	 */
	markedCustomRenderer.del = function(text) {
	    var textContent = '';

	    if (text) {
	        textContent = '<s>' + text + '</s>';
	    }

	    return textContent;
	};

	/**
	 * escape code from marked
	 * @param {string} html HTML string
	 * @param {string} encode Boolean value of whether encode or not
	 * @returns {string}
	 */
	function escape(html, encode) {
	    return html
	        .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
	        .replace(/</g, '&lt;')
	        .replace(/>/g, '&gt;')
	        .replace(/"/g, '&quot;')
	        .replace(/'/g, '&#39;');
	}

	module.exports = markedCustomRenderer;


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var Preview = __webpack_require__(26),
	    EventManager = __webpack_require__(42),
	    CommandManager = __webpack_require__(43),
	    extManager = __webpack_require__(6),
	    Convertor = __webpack_require__(47);

	var util = tui.util;

	/**
	 * ViewOnly
	 * @exports ToastUIEditorViewOnly
	 * @constructor
	 * @class ToastUIEditorViewOnly
	 * @param {object} options Option object
	    * @param {string} options.initialValue Editor's initial value
	    * @param {object} options.events eventlist Event list
	         * @param {function} options.events.load It would be emitted when editor fully load
	         * @param {function} options.events.change It would be emitted when content changed
	         * @param {function} options.events.stateChange It would be emitted when format change by cursor position
	         * @param {function} options.events.focus It would be emitted when editor get focus
	         * @param {function} options.events.blur It would be emitted when editor loose focus
	     * @param {object} options.hooks Hook list
	         * @param {function} options.hooks.previewBeforeHook Submit preview to hook URL before preview be shown
	 */
	function ToastUIEditorViewOnly(options) {
	    var self = this;

	    this.options = options;

	    this.eventManager = new EventManager();

	    this.commandManager = new CommandManager(this);
	    this.convertor = new Convertor(this.eventManager);

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

	    this.preview = new Preview($(self.options.el), this.eventManager, this.convertor);

	    extManager.applyExtension(self, self.options.exts);

	    self.setValue(self.options.initialValue);

	    self.eventManager.emit('load', self);
	}

	/**
	 * Set content for preview
	 * @api
	 * @memberOf ToastUIEditorViewOnly
	 * @param {string} markdown Markdown text
	 */
	ToastUIEditorViewOnly.prototype.setValue = function(markdown) {
	    this.markdownValue = markdown = markdown || '';

	    this.preview.refresh(this.markdownValue);
	    this.eventManager.emit('setValueAfter', this.markdownValue);
	};

	/**
	 * Get content of preview
	 * @api
	 * @memberOf ToastUIEditorViewOnly
	 * @returns {string}
	 */
	ToastUIEditorViewOnly.prototype.getValue = function() {
	    return this.markdownValue;
	};

	/**
	 * Bind eventHandler to event type
	 * @api
	 * @memberOf ToastUIEditorViewOnly
	 * @param {string} type Event type
	 * @param {function} handler Event handler
	 */
	ToastUIEditorViewOnly.prototype.on = function(type, handler) {
	    this.eventManager.listen(type, handler);
	};

	/**
	 * Unbind eventHandler from event type
	 * @api
	 * @memberOf ToastUIEditorViewOnly
	 * @param {string} type Event type
	 */
	ToastUIEditorViewOnly.prototype.off = function(type) {
	    this.eventManager.removeEventHandler(type);
	};

	/**
	 * Remove ViewOnly preview from document
	 * @api
	 * @memberOf ToastUIEditorViewOnly
	 */
	ToastUIEditorViewOnly.prototype.remove = function() {
	    this.eventManager.emit('removeEditor');
	    this.options = null;
	    this.eventManager = null;
	    this.commandManager = null;
	    this.convertor = null;
	    this.preview = null;
	};

	/**
	 * Add hook to ViewOnly preview's event
	 * @api
	 * @memberOf ToastUIEditorViewOnly
	 * @param {string} type Event type
	 * @param {function} handler Event handler
	 */
	ToastUIEditorViewOnly.prototype.addHook = function(type, handler) {
	    this.eventManager.removeEventHandler(type);
	    this.eventManager.listen(type, handler);
	};

	/**
	 * Return true
	 * @api
	 * @memberOf ToastUIEditorViewOnly
	 * @returns {boolean}
	 */
	ToastUIEditorViewOnly.prototype.isViewOnly = function() {
	    return true;
	};

	/**
	 * Return false
	 * @api
	 * @memberOf ToastUIEditorViewOnly
	 * @returns {boolean}
	 */
	ToastUIEditorViewOnly.prototype.isMarkdownMode = function() {
	    return false;
	};

	/**
	 * Return false
	 * @api
	 * @memberOf ToastUIEditorViewOnly
	 * @returns {boolean}
	 */
	ToastUIEditorViewOnly.prototype.isWysiwygMode = function() {
	    return false;
	};

	module.exports = ToastUIEditorViewOnly;


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var Toolbar = __webpack_require__(51),
	    Tab = __webpack_require__(52),
	    Layerpopup = __webpack_require__(54),
	    ModeSwitch = __webpack_require__(55),
	    PopupAddLink = __webpack_require__(56),
	    PopupAddImage = __webpack_require__(57),
	    PopupTableUtils = __webpack_require__(58),
	    PopupAddTable = __webpack_require__(59),
	    PopupAddHeading = __webpack_require__(60);

	/* eslint-disable indent */
	var containerTmpl = [
	    '<div class="tui-editor-defaultUI">',
	        '<div class="te-toolbar-section"></div>',
	        '<div class="te-markdown-tab-section"></div>',
	        '<div class="te-editor-section"></div>',
	        '<div class="te-mode-switch-section"></div>',
	    '</div>'
	].join('');
	/* eslint-enable indent */

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

	    this.type = editor.options.initialEditType;
	    this.editor = editor;

	    this.init(editor.options.el);
	    this._initEvent();
	}

	DefaultUI.prototype.init = function($container) {
	    this._renderLayout($container);

	    this._initEditorSection();

	    this._initToolbar();
	    this._initModeSwitch();

	    this._initPopupAddLink();
	    this._initPopupAddImage();
	    this._initPopupAddTable();
	    this._initPopupAddHeading();
	    this._initPopupTableUtils();

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

	DefaultUI.prototype._renderLayout = function($container) {
	    this.$el = $(containerTmpl).appendTo($container);
	};

	DefaultUI.prototype._initToolbar = function() {
	    this.toolbar = new Toolbar(this.editor.eventManager);
	    this.$el.find('.te-toolbar-section').append(this.toolbar.$el);
	};

	DefaultUI.prototype._initModeSwitch = function() {
	    var self = this;

	    this.modeSwitch = new ModeSwitch(this.type === 'markdown' ? ModeSwitch.TYPE.MARKDOWN : ModeSwitch.TYPE.WYSIWYG);
	    this.$el.find('.te-mode-switch-section').append(this.modeSwitch.$el);

	    this.modeSwitch.on('modeSwitched', function(ev, type) {
	        self.editor.changeMode(type);
	    });
	};

	DefaultUI.prototype.markdownTabControl = function() {
	    if (this.editor.isMarkdownMode() && this.editor.getCurrentPreviewStyle() === 'tab') {
	        this.$el.find('.te-markdown-tab-section').show();
	        this.markdownTab.activate('Editor');
	    } else {
	        this.$el.find('.te-markdown-tab-section').hide();
	    }
	};

	DefaultUI.prototype._initMarkdownTab = function() {
	    this.markdownTab = new Tab({
	        items: ['Editor', 'Preview'],
	        sections: [this.editor.layout.getMdEditorContainerEl(), this.editor.layout.getPreviewEl()]
	    });

	    this.$el.find('.te-markdown-tab-section').append(this.markdownTab.$el);
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
	        $button: this.$el.find('button.tui-table'),
	        css: {
	            'position': 'absolute'
	        }
	    });
	};

	DefaultUI.prototype._initPopupAddHeading = function() {
	    this.popupAddHeading = new PopupAddHeading({
	        $target: this.$el,
	        eventManager: this.editor.eventManager,
	        $button: this.$el.find('button.tui-heading'),
	        css: {
	            'position': 'absolute'
	        }
	    });
	};

	DefaultUI.prototype._initPopupTableUtils = function() {
	    var self = this;

	    this.editor.eventManager.listen('contextmenu', function(ev) {
	        if ($(ev.data.target).parents('table').length > 0) {
	            ev.data.preventDefault();
	            self.editor.eventManager.emit('openPopupTableUtils', ev.data);
	        }
	    });

	    this.popupTableUtils = new PopupTableUtils({
	        $target: this.$el,
	        eventManager: this.editor.eventManager
	    });
	};

	DefaultUI.prototype.hide = function() {
	    this.$el.addClass('te-hide');
	};

	DefaultUI.prototype.show = function() {
	    this.$el.removeClass('te-hide');
	};

	DefaultUI.prototype.remove = function() {
	    this.$el.remove();
	};

	DefaultUI.prototype.createPopup = function(options) {
	    return Layerpopup.factory(options);
	};

	module.exports = DefaultUI;


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var UIController = __webpack_require__(11),
	    Button = __webpack_require__(10);

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
	 * @param {Number} index 버튼위치 (optional)
	 */
	Toolbar.prototype.addButton = function(button, index) {
	    var ev = this.eventManager;

	    if (!button.render) {
	        button = new Button(button);
	    }

	    button.on('command', function emitCommandEvent($, commandName) {
	        ev.emit('command', commandName);
	    });

	    button.on('event', function emitEventByCommand($, eventName) {
	        ev.emit(eventName);
	    });

	    this.buttons.push(button);

	    if (index) {
	        this.$buttonContainer.find('button').eq(index - 1).after(button.$el);
	    } else {
	        this.$buttonContainer.append(button.$el);
	    }
	};

	/**
	 * 필요한 버튼들을 추가한다.
	 */
	Toolbar.prototype._initButton = function() {
	    this.addButton(new Button({
	        className: 'tui-heading',
	        event: 'openHeadingSelect',
	        tooltip: '제목크기'
	    }));

	    this.addButton(new Button({
	        className: 'tui-bold',
	        command: 'Bold',
	        tooltip: '굵게'
	    }));

	    this.addButton(new Button({
	        className: 'tui-italic',
	        command: 'Italic',
	        tooltip: '기울임꼴'
	    }));

	    this.addButton(new Button({
	        className: 'tui-strike',
	        command: 'Strike',
	        text: '~',
	        tooltip: '취소선'
	    }));

	    this.addButton(new Button({
	        className: 'tui-hrline',
	        command: 'HR',
	        tooltip: '문단나눔'
	    }));

	    this.addButton(new Button({
	        className: 'tui-quote',
	        command: 'Blockquote',
	        tooltip: '인용구'
	    }));

	    this.addButton(new Button({
	        className: 'tui-ul',
	        command: 'UL',
	        tooltip: '글머리 기호'
	    }));

	    this.addButton(new Button({
	        className: 'tui-ol',
	        command: 'OL',
	        tooltip: '번호 매기기'
	    }));

	    this.addButton(new Button({
	        className: 'tui-task',
	        command: 'Task',
	        tooltip: '체크박스'
	    }));

	    this.addButton(new Button({
	        className: 'tui-table',
	        event: 'openPopupAddTable',
	        tooltip: '표 삽입'
	    }));

	    this.addButton(new Button({
	        className: 'tui-link',
	        event: 'openPopupAddLink',
	        tooltip: '링크 삽입'
	    }));

	    this.addButton(new Button({
	        className: 'tui-codeblock',
	        command: 'CodeBlock',
	        text: 'CB',
	        tooltip: '코드블럭 삽입'
	    }));

	    this.addButton(new Button({
	        className: 'tui-code',
	        command: 'Code',
	        tooltip: '코드 삽입'
	    }));

	    this.addButton(new Button({
	        className: 'tui-image',
	        event: 'openPopupAddImage',
	        tooltip: '이미지 삽입'
	    }));
	};

	module.exports = Toolbar;


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview tab버튼 UI를 그리는 객체가 정의되어 있다
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var UIController = __webpack_require__(11),
	    templater = __webpack_require__(53);

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
	 * @returns {object[]} Button data
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
	 * @returns {boolean} result
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


/***/ },
/* 53 */
/***/ function(module, exports) {

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
	 * @returns {array} rendered text
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



/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements LayerPopup
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var UIController = __webpack_require__(11);

	var util = tui.util,
	    _id = 0,
	    CLASS_PREFIX = 'tui-popup-';

	/* eslint-disable indent */
	var LAYOUT_TEMPLATE = [
	    '<div class="' + CLASS_PREFIX + 'header">',
	        '<span class="' + CLASS_PREFIX + 'title"></span>',
	        '<button class="' + CLASS_PREFIX + 'close-button">x</button>',
	    '</div>',
	    '<div class="' + CLASS_PREFIX + 'body"></div>'
	].join('');
	/* eslint-enable indent */


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


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var UIController = __webpack_require__(11);

	var util = tui.util;

	var TYPE = {
	    MARKDOWN: 'markdown',
	    WYSIWYG: 'wysiwyg'
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

	    this._render();
	    this._switchType(util.isExisty(initialType) ? initialType : TYPE.MARKDOWN);
	}

	ModeSwitch.prototype = util.extend(
	    {},
	    UIController.prototype
	);

	ModeSwitch.prototype._render = function() {
	    this.$buttons = {};
	    this.$buttons.markdown = $('<button class="te-switch-button markdown" type="button">Markdown</button>');
	    this.$buttons.wysiwyg = $('<button class="te-switch-button wysiwyg" type="button">WYSIWYG</button>');
	    this.$el.append(this.$buttons.markdown);
	    this.$el.append(this.$buttons.wysiwyg);

	    this.attachEvents({
	        'click .markdown': '_changeMarkdown',
	        'click .wysiwyg': '_changeWysiwyg'
	    });
	};

	ModeSwitch.prototype._changeMarkdown = function() {
	    this._switchType(TYPE.MARKDOWN);
	};

	ModeSwitch.prototype._changeWysiwyg = function() {
	    this._switchType(TYPE.WYSIWYG);
	};

	ModeSwitch.prototype._setActiveButton = function(type) {
	    util.forEach(this.$buttons, function($button) {
	        $button.removeClass('active');
	    });
	    this.$buttons[type].addClass('active');
	};


	ModeSwitch.prototype._switchType = function(type) {
	    if (this.type === type) {
	        return;
	    }

	    this.type = type;
	    this._setActiveButton(type);
	    this.trigger('modeSwitched', this.type);
	};

	ModeSwitch.TYPE = TYPE;

	module.exports = ModeSwitch;


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements PopupAddLink
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var LayerPopup = __webpack_require__(54);

	var util = tui.util;

	/* eslint-disable indent */
	var POPUP_CONTENT = [
	    '<label for="linkText">링크에 표시할 내용</label>',
	    '<input type="text" class="te-link-text-input" />',
	    '<label for="url">URL</label>',
	    '<input type="text" class="te-url-input" />',
	    '<div class="te-button-section">',
	        '<button type="button" class="te-ok-button">확인</button>',
	        '<button type="button" class="te-close-button">취소</button>',
	    '</div>'
	].join('');
	/* eslint-enable indent */

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
	        title: '링크 추가',
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
	        self.trigger('okButtonClicked', self);
	        self.hide();
	    });

	    this.on('click .te-close-button', function() {
	        self.trigger('closeButtonClicked', self);
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
	        url: this.$el.find('.te-url-input').val().replace(/\(/g, '%28').replace(/\)/g, '%29')
	    };
	};

	PopupAddLink.prototype.resetInputs = function() {
	    this.$el.find('input').val('');
	};

	module.exports = PopupAddLink;


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements PopupAddImage
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var LayerPopup = __webpack_require__(54),
	    Tab = __webpack_require__(52);

	var util = tui.util;

	/* eslint-disable indent */
	var POPUP_CONTENT = [
	    '<div class="te-tab-section"></div>',
	    '<div class="te-url-type">',
	        '<label for="">이미지 URL</label>',
	        '<input type="text" class="te-image-url-input" />',
	    '</div>',
	    '<form enctype="multipart/form-data" class="te-file-type">',
	        '<label for="">이미지 선택</label>',
	        '<input type="file" class="te-image-file-input" accept="image/*" />',
	    '</form>',
	    '<label for="url">설명</label>',
	    '<input type="text" class="te-alt-text-input" />',
	    '<div class="te-button-section">',
	        '<button type="button" class="te-ok-button">삽입</button>',
	        '<button type="button" class="te-close-button">취소</button>',
	    '</div>'
	].join('');
	/* eslint-enable indent */

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
	        title: '이미지 삽입',
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
	        self.trigger('okButtonClicked', self);
	        self.hide();
	    });

	    this.on('click .te-close-button', function() {
	        self.trigger('closeButtonClicked', self);
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
	            self.eventManager.emit('addImageBlobHook',
	                                    self.$el.find('.te-image-file-input')[0].files[0],
	                                    self.applyImage);
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


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements PopupTableUtils
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var LayerPopup = __webpack_require__(54);

	var util = tui.util;

	var POPUP_CONTENT = [
	    '<button type="button" class="te-table-add-row">행 삽입</button>',
	    '<button type="button" class="te-table-add-col">열 삽입</button>',
	    '<button type="button" class="te-table-remove-row">행 삭제</button>',
	    '<button type="button" class="te-table-remove-col">열 삭제</button>',
	    '<button type="button" class="te-table-remove">표 삭제</button>'
	].join('');

	/**
	 * PopupTableUtils
	 * It implements table utils popup
	 * @exports PopupTableUtils
	 * @augments LayerPopup
	 * @constructor
	 * @class
	 * @param {object} options options
	 */
	function PopupTableUtils(options) {
	    options = util.extend({
	        title: false,
	        className: 'te-popup-table-utils',
	        content: POPUP_CONTENT
	    }, options);

	    LayerPopup.call(this, options);

	    this.eventManager = options.eventManager;

	    this.render();
	    this._bindContentEvent();
	    this._linkWithEventManager();
	}

	PopupTableUtils.prototype = util.extend(
	    {},
	    LayerPopup.prototype
	);

	/**
	 * _bindContentEvent
	 * Bind element events
	 */
	PopupTableUtils.prototype._bindContentEvent = function() {
	    var self = this;

	    this.on('click .te-table-add-row', function() {
	        self.eventManager.emit('command', 'AddRow');
	    });

	    this.on('click .te-table-add-col', function() {
	        self.eventManager.emit('command', 'AddCol');
	    });

	    this.on('click .te-table-remove-row', function() {
	        self.eventManager.emit('command', 'RemoveRow');
	    });

	    this.on('click .te-table-remove-col', function() {
	        self.eventManager.emit('command', 'RemoveCol');
	    });

	    this.on('click .te-table-remove', function() {
	        self.eventManager.emit('command', 'RemoveTable');
	    });
	};

	/**
	 * _linkWithEventManager
	 * Bind event manager event
	 */
	PopupTableUtils.prototype._linkWithEventManager = function() {
	    var self = this;

	    this.eventManager.listen('focus', function() {
	        self.hide();
	    });

	    this.eventManager.listen('mousedown', function() {
	        self.hide();
	    });

	    this.eventManager.listen('openPopupTableUtils', function(event) {
	        self.eventManager.emit('closeAllPopup');

	        self.$el.css({
	            'position': 'absolute',
	            'top': event.layerY + 30,
	            'left': event.layerX + 20
	        });

	        self.show();
	    });

	    this.eventManager.listen('closeAllPopup', function() {
	        self.hide();
	    });
	};


	module.exports = PopupTableUtils;


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements PopupAddTable
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var LayerPopup = __webpack_require__(54);

	var util = tui.util;

	/* eslint-disable indent */
	var POPUP_CONTENT = [
	    '<div class="te-table-selection">',
	        '<div class="te-table-header"></div>',
	        '<div class="te-table-body"></div>',
	        '<div class="te-selection-area"></div>',
	    '</div>',
	    '<p class="te-description"></p>'
	].join('');
	/* eslint-enable indent */

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
	    this.$button = options.$button;

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
	        self.$el.css({
	            'top': self.$button.position().top + self.$button.height() + 5,
	            'left': self.$button.position().left
	        });
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
	PopupAddTable.prototype._resizeTableBySelectionIfNeed = function(col, row) {
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
	 * @returns {object} bound
	 */
	PopupAddTable.prototype._getResizedTableBound = function(col, row) {
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
	 * @returns {boolean} result
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
	 * @returns {object} bound
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
	 * @returns {object} offset
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
	 * @returns {object} bound
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
	    var boundOffset;

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
	 * @returns {object} bound
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


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements PopupAddTable
	 * @author Minho choi(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var LayerPopup = __webpack_require__(54);

	var util = tui.util;

	/* eslint-disable indent */
	var POPUP_CONTENT = [
	    '<ul>',
	        '<li data-value="1"><h1>제목</h1></li>',
	        '<li data-value="2"><h2>제목</h2></li>',
	        '<li data-value="3"><h3>제목</h3></li>',
	        '<li data-value="4"><h4>제목</h4></li>',
	        '<li data-value="5"><h5>제목</h5></li>',
	        '<li data-value="6"><h6>제목</h6></li>',
	    '</ul>'
	].join('');
	/* eslint-enable indent */

	/**
	 * PopupHeading
	 * It implements Popup to add headings
	 * @exports PopupAddHeading
	 * @augments LayerPopup
	 * @constructor
	 * @class
	 * @param {object} options options
	 */
	function PopupAddHeading(options) {
	    options = util.extend({
	        title: false,
	        className: 'te-heading-add',
	        content: POPUP_CONTENT
	    }, options);
	    LayerPopup.call(this, options);
	    this.eventManager = options.eventManager;
	    this.$button = options.$button;
	    this.render();
	    this._linkWithEventManager();
	    this._bindEvent();
	}

	PopupAddHeading.prototype = util.extend(
	  {},
	  LayerPopup.prototype
	);

	PopupAddHeading.prototype._linkWithEventManager = function() {
	    var self = this;

	    this.eventManager.listen('focus', function() {
	        self.hide();
	    });

	    this.eventManager.listen('openHeadingSelect', function() {
	        self.eventManager.emit('closeAllPopup');
	        self.$el.css({
	            'top': self.$button.position().top + self.$button.height() + 5,
	            'left': self.$button.position().left
	        });
	        self.show();
	    });

	    this.eventManager.listen('closeAllPopup', function() {
	        self.hide();
	    });
	};

	PopupAddHeading.prototype._bindEvent = function() {
	    var self = this;

	    this.on('click li', /** @this Node */function() {
	        self.eventManager.emit('command', 'Heading', $(this).data('value'));
	    });
	};

	module.exports = PopupAddHeading;


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	var boldRegex = /^[\*_]{2,}[^\*_]*[\*_]{2,}$/;

	/**
	 * Bold
	 * Add bold markdown syntax to markdown editor
	 * @exports Bold
	 * @augments Command
	 */
	var Bold = CommandManager.command('markdown', /** @lends Bold */{
	    name: 'Bold',
	    keyMap: ['CTRL+B', 'META+B'],
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
	     * @returns {boolean} 볼드 적용 여부
	     */
	    isNeedRemove: function(text) {
	        return boldRegex.test(text);
	    },
	    /**
	     * Bold를 적용한다
	     * @param {string} text 셀렉션텍스트
	     * @returns {string} 볼드가 적용된 텍스트
	     */
	    append: function(text) {
	        return '**' + text + '**';
	    },
	    /**
	     * Bold를 제거한다
	     * @param {string} text 셀렉션텍스트
	     * @returns {string} 볼드가 제거된 텍스트
	     */
	    remove: function(text) {
	        return text.substr(2, text.length - 4);
	    },
	    /**
	     * 셀렉션영역을 확장한다
	     * @param {CodeMirror.doc} doc 코드미러 도큐먼트 객체
	     * @param {object} cursor 코드미러 커서 객체
	     * @returns {string} 셀렉션의 텍스트
	     */
	    expendSelection: function(doc, cursor) {
	        var tmpSelection = doc.getSelection(),
	            result;

	        doc.setSelection({line: cursor.line, ch: cursor.ch - 2}, {line: cursor.line, ch: cursor.ch + 2});

	        if (tmpSelection === '****' || tmpSelection === '____') {
	            result = tmpSelection;
	        } else {
	            doc.setSelection(cursor);
	        }

	        return result;
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


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements Italic markdown command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	var boldItalicRegex = /^[\*_]{3,}[^\*_]*[\*_]{3,}$/;
	var italicRegex = /^[\*_][^\*_]*[\*_]$/;

	/**
	 * Italic
	 * Add italic markdown syntax to markdown editor
	 * @exports Italic
	 * @augments Command
	 */
	var Italic = CommandManager.command('markdown', /** @lends Italic */{
	    name: 'Italic',
	    keyMap: ['CTRL+I', 'META+I'],
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
	     * @returns {boolean} 적용 여부
	     */
	    isNeedRemove: function(text) {
	        return italicRegex.test(text) || boldItalicRegex.test(text);
	    },
	    /**
	     * append
	     * 텍스트에 이탤릭을 적용한다
	     * @param {string} text 적용할 텍스트
	     * @returns {string} 이탤릭이 적용된 텍스트
	     */
	    append: function(text) {
	        return '_' + text + '_';
	    },
	    /**
	     * remove
	     * 텍스트에서 이탤릭을 제거한다
	     * @param {string} text 제거할 텍스트
	     * @returns {string} 제거된 텍스트
	     */
	    remove: function(text) {
	        return text.substr(1, text.length - 2);
	    },
	    /**
	     * expendWithBoldSelection
	     * 볼드와 함께 적용된 셀렉션 영역을 확장한다
	     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
	     * @param {object} cursor 커서객체
	     * @returns {string} 확장된 영역의 텍스트
	     */
	    expendWithBoldSelection: function(doc, cursor) {
	        var tmpSelection = doc.getSelection(),
	            result;

	        doc.setSelection({line: cursor.line, ch: cursor.ch - 3}, {line: cursor.line, ch: cursor.ch + 3});

	        if (tmpSelection === '******' || tmpSelection === '______') {
	            result = tmpSelection;
	        } else {
	            doc.setSelection(cursor);
	        }

	        return result;
	    },
	    /**
	     * expendOnlyBoldSelection
	     * 볼드만 적용된 셀렉션 영역을 확장한다
	     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
	     * @param {object} cursor 커서객체
	     * @returns {string} 확장된 영역의 텍스트
	     */
	    expendOnlyBoldSelection: function(doc, cursor) {
	        var tmpSelection = doc.getSelection(),
	            result = false;

	        doc.setSelection({line: cursor.line, ch: cursor.ch - 2}, {line: cursor.line, ch: cursor.ch + 2});

	        if (tmpSelection === '****' || tmpSelection === '____') {
	            doc.setSelection(cursor);
	            result = 'only';
	        }

	        return result;
	    },
	    /**
	     * expendSelection
	     * 이탤릭이 적용된 셀렉션 영역을 확장한다
	     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
	     * @param {object} cursor 커서객체
	     * @returns {string} 확장된 영역의 텍스트
	     */
	    expendSelection: function(doc, cursor) {
	        var tmpSelection = doc.getSelection(),
	            result;

	        doc.setSelection({line: cursor.line, ch: cursor.ch - 2}, {line: cursor.line, ch: cursor.ch + 2});

	        if (tmpSelection === '****' || tmpSelection === '____') {
	            result = tmpSelection;
	        } else {
	            doc.setSelection(cursor);
	        }

	        return result;
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


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements StrikeThrough markdown command
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	var strikeRegex = /^[~~](.*[\s\n]*.*)*[~~]$/;

	/**
	 * Strike
	 * Add strike markdown syntax to markdown editor
	 * @exports Strike
	 * @augments Command
	 */
	var Strike = CommandManager.command('markdown', /** @lends Strike */{
	    name: 'Strike',
	    keyMap: ['CTRL+S', 'META+S'],
	    /**
	     * Command handler
	     * @param {MarkdownEditor} mde MarkdownEditor instance
	     */
	    exec: function(mde) {
	        var cm = mde.getEditor();
	        var doc = cm.getDoc();
	        var cursor = doc.getCursor();
	        var selection = doc.getSelection();
	        var isNeedToRemove, isEmptySelection, result;

	        isNeedToRemove = this.hasStrikeSyntax(selection);
	        if (isNeedToRemove) {
	            result = this.remove(selection);
	        } else {
	            result = this.append(selection);
	        }

	        doc.replaceSelection(result, 'around');

	        isEmptySelection = !selection;
	        if (isEmptySelection && !isNeedToRemove) {
	            this.setCursorToCenter(doc, cursor, isNeedToRemove);
	        }

	        cm.focus();
	    },
	    /**
	     * hasStrikeSyntax
	     * @param {string} text Source text
	     * @returns {boolean} Boolean value of strike syntax removal
	     */
	    hasStrikeSyntax: function(text) {
	        return strikeRegex.test(text);
	    },
	    /**
	     * append
	     * @param {string} text 적용할 텍스트
	     * @returns {string} strikeThrough text
	     */
	    append: function(text) {
	        return '~~' + text + '~~';
	    },
	    /**
	     * remove
	     * @param {string} text 제거할 텍스트
	     * @returns {string} 제거된 텍스트
	     */
	    remove: function(text) {
	        return text.substr(2, text.length - 4);
	    },
	    /**
	     * setCursorToCenter
	     * 커서를 중앙으로 이동시킨다
	     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
	     * @param {object} cursor 커서객체
	     * @param {boolean} isRemoved 변경사항이 지우는 변경이었는지 여부
	     */
	    setCursorToCenter: function(doc, cursor, isRemoved) {
	        var pos = isRemoved ? -2 : 2;
	        doc.setCursor(cursor.line, cursor.ch + pos);
	    }
	});

	module.exports = Strike;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements Blockquote markdown command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * Blockquote
	 * Add blockquote markdown syntax to markdown editor
	 * @exports Blockquote
	 * @augments Command
	 */
	var Blockquote = CommandManager.command('markdown', /** @lends Blockquote */{
	    name: 'Blockquote',
	    keyMap: ['CTRL+Q', 'META+Q'],
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


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements Heading markdown command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	var util = tui.util;

	/**
	 * Heading
	 * Add heading markdown syntax to markdown editor
	 * @exports Heading
	 * @augments Command
	 */
	var Heading = CommandManager.command('markdown', /** @lends Heading */{
	    name: 'Heading',
	    /**
	     * Command Handler
	     * @param {MarkdownEditor} mde MarkdownEditor instance
	     * @param {number} size heading size
	     */
	    exec: function(mde, size) {
	        var textToModify, range, from, to, textLinesToModify, lengthOfCurrentLineBefore,
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

	        util.forEachArray(textLinesToModify, function(line, index) {
	            textLinesToModify[index] = getHeadingMarkdown(line, size);
	        });

	        //해당 에디터의 내용을 변경한다
	        doc.replaceRange(textLinesToModify.join('\n'), from, to);

	        range.to.ch += doc.getLine(to.line).length - lengthOfCurrentLineBefore;

	        doc.setCursor(range.to);

	        cm.focus();
	    }
	});

	var FIND_HEADING_RX = /^#+\s/g;

	function getHeadingMarkdown(text, size) {
	    var foundedHeading = text.match(FIND_HEADING_RX),
	        heading = '';

	    do {
	        heading += '#';
	        size -= 1;
	    } while (size > 0);

	    if (foundedHeading) {
	        text = text.split(foundedHeading[0])[1];
	    }

	    return heading + ' ' + text;
	}

	module.exports = Heading;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview HR markdown command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * HR
	 * Add HR markdown syntax to markdown editor
	 * @exports HR
	 * @augments Command
	 */
	var HR = CommandManager.command('markdown', /** @lends HR */{
	    name: 'HR',
	    keyMap: ['CTRL+L', 'META+L'],
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


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements Addlink markdown command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * AddLink
	 * Add link markdown syntax to markdown editor
	 * @exports AddLink
	 * @augments Command
	 */
	var AddLink = CommandManager.command('markdown', /** @lends AddLink */{
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


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implments AddImage markdown command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * AddImage
	 * Add Image markdown syntax to markdown Editor
	 * @exports AddImage
	 * @augments Command
	 */
	var AddImage = CommandManager.command('markdown', /** @lends AddImage */ {
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


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	var FIND_MD_OL_RX = /^[ \t]*[\d]+\. .*/,
	    FIND_MD_UL_RX = /^[ \t]*\* .*/;

	/**
	 * UL
	 * Add unordered list markdown syntax to markdown editor
	 * @exports UL
	 * @augments Command
	 */
	var UL = CommandManager.command('markdown', /** @lends UL */{
	    name: 'UL',
	    keyMap: ['CTRL+U', 'META+U'],
	    /**
	     * Command handler
	     * @param {MarkdownEditor} mde MarkdownEditor instance
	     */
	    exec: function(mde) {
	        var range, from, line, to,
	            cm = mde.getEditor(),
	            doc = cm.getDoc();

	        range = mde.getCurrentRange();

	        from = {
	            line: range.from.line,
	            ch: 0
	        };


	        line = doc.getLine(from.line);

	        if (line.match(FIND_MD_OL_RX)) {
	            line = line.replace(/[\d]+\. /, '* ');

	            to = {
	                line: from.line,
	                ch: line.length + 1
	            };

	            doc.replaceRange(line, from, to);
	        } else if (!line.match(FIND_MD_UL_RX)) {
	            doc.replaceRange('* ', from);
	        }

	        cm.focus();
	    }
	});

	module.exports = UL;


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements OL markdown command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	var FIND_MD_OL_RX = /^[ \t]*[\d]+\. .*/,
	    FIND_MD_UL_RX = /^[ \t]*\* .*/;

	/**
	 * OL
	 * Add ordered list markdown syntax to markdown editor
	 * @exports OL
	 * @augments Command
	 */
	var OL = CommandManager.command('markdown', /** @lends OL */{
	    name: 'OL',
	    keyMap: ['CTRL+O', 'META+O'],
	    /**
	     * Command handler
	     * @param {MarkdownEditor} mde MarkdownEditor instance
	     */
	    exec: function(mde) {
	        var range, from, line, to,
	            cm = mde.getEditor(),
	            doc = cm.getDoc();

	        range = mde.getCurrentRange();

	        from = {
	            line: range.from.line,
	            ch: 0
	        };


	        line = doc.getLine(from.line);

	        if (line.match(FIND_MD_UL_RX)) {
	            line = line.replace(/\* /, '1. ');

	            to = {
	                line: from.line,
	                ch: line.length - 1
	            };

	            doc.replaceRange(line, from, to);
	        } else if (!line.match(FIND_MD_OL_RX)) {
	            doc.replaceRange('1. ', from);
	        }

	        cm.focus();
	    }
	});

	module.exports = OL;


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements Table markdown command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * Table
	 * Add table markdown syntax to markdown editor
	 * @exports Table
	 * @augments Command
	 */
	var Table = CommandManager.command('markdown', /** @lends Table */{
	    name: 'Table',
	    /**
	     * Command handler
	     * @param {MarkdownEditor} mde MarkdownEditor instance
	     * @param {number} col column count
	     * @param {number} row row count
	     * @param {Array} data initial table data
	     */
	    exec: function(mde, col, row, data) {
	        var cm = mde.getEditor(),
	            doc = cm.getDoc(),
	            table = '\n';

	        if (cm.getCursor().ch > 0) {
	            table += '\n';
	        }

	        table += makeHeader(col, data);
	        table += makeBody(col, row - 1, data);

	        doc.replaceSelection(table);

	        if (!data) {
	            cm.setCursor(cm.getCursor().line - row, 2);
	        }

	        mde.focus();
	    }
	});

	/*
	 * makeHeader
	 * make table header markdown string
	 * @param {number} col column count
	 * @returns {string} markdown string
	 */
	function makeHeader(col, data) {
	    var header = '|',
	        border = '|',
	        index = 0;

	    while (col) {
	        if (data) {
	            header += ' ' + data[index] + ' |';
	            index += 1;
	        } else {
	            header += '  |';
	        }

	        border += ' --- |';

	        col -= 1;
	    }
	    return header + '\n' + border + '\n';
	}

	/**
	 * makeBody
	 * make table body markdown string
	 * @param {number} col column count
	 * @param {number} row row count
	 * @param {Array} data initial table data
	 * @returns {string} html string
	 */
	function makeBody(col, row, data) {
	    var body = '',
	        index = col,
	        irow, icol;

	    for (irow = 0; irow < row; irow += 1) {
	        body += '|';

	        for (icol = 0; icol < col; icol += 1) {
	            if (data) {
	                body += ' ' + data[index] + ' |';
	                index += 1;
	            } else {
	                body += '  |';
	            }
	        }

	        body += '\n';
	    }

	    body = body.replace(/\n$/g, '');

	    return body;
	}
	module.exports = Table;


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements Task markdown command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * Task
	 * @exports Task
	 * @augments Command
	 */

	var Task = CommandManager.command('markdown', /** @lends Task */{
	    name: 'Task',
	    keyMap: ['CTRL+T', 'META+T'],
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


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * Code
	 * Add code markdown syntax to markdown editor
	 * @exports Code
	 * @augments Command
	 */
	var Code = CommandManager.command('markdown', /** @lends Code */{
	    name: 'Code',
	    keyMap: ['SHIFT+CTRL+C', 'SHIFT+META+C'],
	    /**
	     * Command Handler
	     * @param {MarkdownEditor} mde MarkdownEditor instance
	     */
	    exec: function(mde) {
	        var range, selection,
	            cm = mde.getEditor(),
	            doc = cm.getDoc();

	        selection = doc.getSelection();
	        range = cm.getCursor();

	        doc.replaceSelection(this.append(selection), 'around');

	        if (!selection) {
	            doc.setCursor(range.line, range.ch + 1);
	        }

	        cm.focus();
	    },
	    /**
	     * Code를 적용한다
	     * @param {string} text 셀렉션텍스트
	     * @returns {string} 가 적용된 텍스트
	     */
	    append: function(text) {
	        return '`' + text + '`';
	    }
	});

	module.exports = Code;


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview CodeBlock markdown command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * CodeBlock
	 * Add CodeBlock markdown syntax to markdown editor
	 * @exports CodeBlock
	 * @augments Command
	 */
	var CodeBlock = CommandManager.command('markdown', /** @lends CodeBlock */{
	    name: 'CodeBlock',
	    keyMap: ['SHIFT+CTRL+P', 'SHIFT+META+P'],
	    /**
	     * Command handler
	     * @param {MarkdownEditor} mde MarkdownEditor instance
	     */
	    exec: function(mde) {
	        var range, rowFix,
	            cm = mde.getEditor(),
	            replaceText = '',
	            doc = cm.getDoc();

	        range = cm.getCursor();

	        if (doc.getLine(range.line).length) {
	            replaceText += '\n``` \n\n```\n\n';
	            doc.setCursor(range.line + 1, 0);
	            rowFix = 3;
	        } else {
	            replaceText += '\n``` \n\n```\n';
	            rowFix = 2;
	        }

	        doc.replaceSelection(replaceText);
	        cm.setCursor(doc.getCursor().line - rowFix, 0);

	        cm.focus();
	    }
	});

	module.exports = CodeBlock;


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * Bold
	 * Add bold to selected wysiwyg editor content
	 * @exports Bold
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var Bold = CommandManager.command('wysiwyg', /** @lends Bold */{
	    name: 'Bold',
	    keyMap: ['CTRL+B', 'META+B'],
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function(wwe) {
	        var sq = wwe.getEditor();


	        if (sq.hasFormat('b') || sq.hasFormat('strong')) {
	            sq.changeFormat(null, {tag: 'b'});
	        } else if (!sq.hasFormat('a') && !sq.hasFormat('PRE')) {
	            if (sq.hasFormat('code')) {
	                sq.changeFormat(null, {tag: 'code'});
	            }
	            sq.bold();
	        }

	        sq.focus();
	    }
	});

	module.exports = Bold;


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * Italic
	 * Add Italic to selected wysiwyg editor content
	 * @exports Italic
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var Italic = CommandManager.command('wysiwyg', /** @lends Italic */{
	    name: 'Italic',
	    keyMap: ['CTRL+I', 'META+I'],
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function(wwe) {
	        var sq = wwe.getEditor();

	        if (sq.hasFormat('i') || sq.hasFormat('em')) {
	            sq.changeFormat(null, {tag: 'i'});
	        } else if (!sq.hasFormat('a') && !sq.hasFormat('PRE')) {
	            if (sq.hasFormat('code')) {
	                sq.changeFormat(null, {tag: 'code'});
	            }
	            sq.italic();
	        }

	        sq.focus();
	    }
	});

	module.exports = Italic;


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * Strike
	 * Add strike to selected wysiwyg editor content
	 * @exports Strike
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var Strike = CommandManager.command('wysiwyg', /** @lends Strike */{
	    name: 'Strike',
	    keyMap: ['CTRL+S', 'META+S'],
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WysiwygEditor instance
	     */
	    exec: function(wwe) {
	        var sq = wwe.getEditor();

	        if (sq.hasFormat('S')) {
	            sq.changeFormat(null, {tag: 'S'});
	        } else if (!sq.hasFormat('a') && !sq.hasFormat('PRE')) {
	            if (sq.hasFormat('code')) {
	                sq.changeFormat(null, {tag: 'code'});
	            }
	            sq.strikethrough();
	        }

	        sq.focus();
	    }
	});

	module.exports = Strike;


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * Blockquote
	 * Add Blockquote to selected wysiwyg editor content
	 * @exports Blockquote
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var Blockquote = CommandManager.command('wysiwyg', /** @lends Blockquote */{
	    name: 'Blockquote',
	    keyMap: ['CTRL+Q', 'META+Q'],
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function(wwe) {
	        var sq = wwe.getEditor();

	        if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
	            wwe.unwrapBlockTag();
	            sq.increaseQuoteLevel();
	        }

	        sq.focus();
	    }
	});

	module.exports = Blockquote;


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements AddImage wysiwyg command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * AddImage
	 * Add Image markdown syntax to wysiwyg Editor
	 * @exports AddImage
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var AddImage = CommandManager.command('wysiwyg', /** @lends AddImage */{
	    name: 'AddImage',
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     *  @param {object} data data for image
	     */
	    exec: function(wwe, data) {
	        var sq = wwe.getEditor();

	        if (!sq.hasFormat('PRE')) {
	            sq.insertImage(data.imageUrl);
	        }

	        sq.focus();
	    }
	});


	module.exports = AddImage;


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements AddLink wysiwyg command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * AddLink
	 * Add link markdown syntax to wysiwyg Editor
	 * @exports AddLink
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var AddLink = CommandManager.command('wysiwyg', /** @lends AddLink */{
	    name: 'AddLink',
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     *  @param {object} data data for image
	     */
	    exec: function(wwe, data) {
	        var sq = wwe.getEditor(),
	            link;

	        if (!sq.hasFormat('PRE')) {
	            sq.removeAllFormatting();

	            if (sq.getSelectedText()) {
	                sq.makeLink(data.url);
	            } else {
	                link = sq.createElement('A', {href: data.url});
	                $(link).text(data.linkText);
	                sq.insertElement(link);
	            }
	        }

	        sq.focus();
	    }
	});


	module.exports = AddLink;


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements HR wysiwyg command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43),
	    domUtils = __webpack_require__(19);

	/**
	 * HR
	 * Add horizontal line markdown syntax to wysiwyg Editor
	 * @exports HR
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var HR = CommandManager.command('wysiwyg', /** @lends HR */{
	    name: 'HR',
	    keyMap: ['CTRL+L', 'META+L'],
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function(wwe) {
	        var sq = wwe.getEditor(),
	            range = sq.getSelection(),
	            currentNode, nextBlockNode, hr, previousSibling;

	        if (range.collapsed && !sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
	            currentNode = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset);
	            nextBlockNode = domUtils.getTopNextNodeUnder(currentNode, wwe.get$Body()[0]);

	            if (!nextBlockNode) {
	                nextBlockNode = sq.createDefaultBlock();
	                wwe.get$Body().append(nextBlockNode);
	            }

	            hr = sq.createElement('HR');

	            sq.modifyBlocks(function(frag) {
	                frag.appendChild(hr);

	                return frag;
	            });

	            previousSibling = hr.previousSibling;
	            if (previousSibling
	                && domUtils.isTextNode(previousSibling)
	                && domUtils.getTextLength(previousSibling) === 0
	            ) {
	                hr.parentNode.removeChild(previousSibling);
	            }

	            range.selectNodeContents(nextBlockNode);
	            range.collapse(true);

	            sq.setSelection(range);
	        }

	        sq.focus();
	    }
	});


	module.exports = HR;


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements Heading wysiwyg command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);
	var domUtils = __webpack_require__(19);

	/**
	 * Heading
	 * Add horizontal line markdown syntax to wysiwyg Editor
	 * @exports Heading
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var Heading = CommandManager.command('wysiwyg', /** @lends Heading */{
	    name: 'Heading',
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     *  @param {Number} size size
	     */
	    exec: function(wwe, size) {
	        var sq = wwe.getEditor(),
	            range = sq.getSelection().cloneRange();

	        if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
	            if (range.collapsed
	                || domUtils.getNodeName(range.commonAncestorContainer) === 'DIV'
	                || domUtils.getNodeName(range.commonAncestorContainer) === 'TEXT'
	            ) {
	                wwe.changeBlockFormatTo('H' + size);
	            }
	        }

	        sq.focus();
	    }
	});

	module.exports = Heading;


/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * UL
	 * Add UL to selected wysiwyg editor content
	 * @exports UL
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var UL = CommandManager.command('wysiwyg', /** @lends UL */{
	    name: 'UL',
	    keyMap: ['CTRL+U', 'META+U'],
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function(wwe) {
	        var sq = wwe.getEditor(),
	            range = sq.getSelection();

	        if (!range.collapsed) {
	            return;
	        }

	        if (sq.hasFormat('LI')) {
	            wwe.saveSelection(range);
	            sq.saveUndoState(range);
	            wwe.getManager('task').unformatTask(range.startContainer);
	            sq.replaceParent(range.startContainer, 'ol', 'ul');
	            wwe.restoreSavedSelection();
	        } else if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
	            wwe.unwrapBlockTag();
	            sq.makeUnorderedList();
	        }

	        sq.focus();
	    }
	});

	module.exports = UL;


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * OL
	 * Add OL to selected wysiwyg editor content
	 * @exports OL
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var OL = CommandManager.command('wysiwyg', /** @lends OL */{
	    name: 'OL',
	    keyMap: ['CTRL+O', 'META+O'],
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function(wwe) {
	        var sq = wwe.getEditor(),
	            range = sq.getSelection();

	        if (!range.collapsed) {
	            return;
	        }

	        if (sq.hasFormat('LI')) {
	            sq.saveUndoState(range);

	            wwe.saveSelection(range);
	            wwe.getManager('task').unformatTask(range.startContainer);
	            sq.replaceParent(range.startContainer, 'ul', 'ol');
	            wwe.restoreSavedSelection();
	        } else if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
	            wwe.unwrapBlockTag();
	            sq.makeOrderedList();
	        }

	        sq.focus();
	    }
	});

	module.exports = OL;


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	var tableID = 0,
	    TABLE_CLASS_PREFIX = 'te-content-table-';

	/**
	 * Table
	 * Add table to selected wysiwyg editor content
	 * @exports Table
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var Table = CommandManager.command('wysiwyg', /** @lends Table */{
	    name: 'Table',
	    /**
	     * Command Handler
	     * @param {WysiwygEditor} wwe WYsiwygEditor instance
	     * @param {number} col column count
	     * @param {number} row row count
	     * @param {Array} data initial table data
	     */
	    exec: function(wwe, col, row, data) {
	        var sq = wwe.getEditor(),
	            table;

	        if (!sq.getSelection().collapsed || sq.hasFormat('TABLE') || sq.hasFormat('PRE')) {
	            sq.focus();

	            return;
	        }

	        table = '<table class="' + TABLE_CLASS_PREFIX + tableID + '">';
	        table += makeHeader(col, data);
	        table += makeBody(col, row - 1, data);
	        table += '</table>';

	        sq.insertHTML(table);

	        sq.focus();

	        if (!data) {
	            focusToFirstTh(sq, wwe.get$Body().find('.' + TABLE_CLASS_PREFIX + tableID));
	        }

	        tableID += 1;
	    }
	});

	function focusToFirstTh(sq, $table) {
	    var range;

	    range = sq.getSelection();
	    range.selectNodeContents($table.find('th')[0]);
	    range.collapse(true);
	    sq.setSelection(range);
	}

	/**
	 * makeHeader
	 * make table header html string
	 * @param {number} col column count
	 * @param {string} data cell data
	 * @returns {string} html string
	 */
	function makeHeader(col, data) {
	    var header = '<thead><tr>',
	        index = 0;

	    while (col) {
	        header += '<th>';

	        if (data) {
	            header += data[index];
	            index += 1;
	        }

	        header += '</th>';
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
	 * @param {string} data cell data
	 * @returns {string} html string
	 */
	function makeBody(col, row, data) {
	    var body = '<tbody>',
	        index = col,
	        irow, icol;

	    for (irow = 0; irow < row; irow += 1) {
	        body += '<tr>';

	        for (icol = 0; icol < col; icol += 1) {
	            body += '<td>';

	            if (data) {
	                body += data[index];
	                index += 1;
	            }

	            body += '</td>';
	        }

	        body += '</tr>';
	    }

	    body += '</tbody>';

	    return body;
	}

	module.exports = Table;


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * AddRow
	 * Add Row to selected table
	 * @exports AddRow
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var AddRow = CommandManager.command('wysiwyg', /** @lends AddRow */{
	    name: 'AddRow',
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function(wwe) {
	        var sq = wwe.getEditor(),
	            range = sq.getSelection().cloneRange(),
	            $tr, $newRow;

	        if (sq.hasFormat('TD')) {
	            sq.saveUndoState(range);
	            $tr = $(range.startContainer).closest('tr');
	            $newRow = getNewRow($tr);
	            $newRow.insertAfter($tr);

	            sq.focus();

	            focusToFirstTd(sq, $newRow);
	        } else {
	            sq.focus();
	        }
	    }
	});

	function getNewRow($tr) {
	    var cloned = $tr.clone();

	    cloned.find('td').html('<br>');

	    return cloned;
	}

	function focusToFirstTd(sq, $tr) {
	    var range;

	    range = sq.getSelection();
	    range.selectNodeContents($tr.find('td')[0]);
	    range.collapse(true);
	    sq.setSelection(range);
	}

	module.exports = AddRow;


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43),
	    domUtils = __webpack_require__(19);

	/**
	 * AddCol
	 * Add col to selected table
	 * @exports AddCol
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var AddCol = CommandManager.command('wysiwyg', /** @lends AddCol */{
	    name: 'AddCol',
	    /**
	     * 커맨드 핸들러
	     * @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function(wwe) {
	        var sq = wwe.getEditor(),
	            range = sq.getSelection().cloneRange(),
	            $cell;

	        if (sq.hasFormat('TR')) {
	            sq.saveUndoState(range);

	            $cell = getCellByRange(range);
	            addColToCellAfter($cell);

	            sq.focus();

	            focusToNextCell(sq, $cell);
	        } else {
	            sq.focus();
	        }
	    }
	});

	function getCellByRange(range) {
	    var cell = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset);

	    if (domUtils.getNodeName(cell) === 'TD' || domUtils.getNodeName(cell) === 'TH') {
	        cell = $(cell);
	    } else {
	        cell = $(cell).parentsUntil('tr');
	    }

	    return cell;
	}

	function addColToCellAfter($cell) {
	    var index = $cell.index(),
	        cellToAdd;

	    $cell.parents('table').find('tr').each(function(n, tr) {
	        if (domUtils.getNodeName(tr.parentNode) === 'TBODY') {
	            cellToAdd = $('<td><br></td>');
	        } else {
	            cellToAdd = $('<th><br></th>');
	        }

	        $(cellToAdd).insertAfter($(tr).children().eq(index));
	    });
	}

	function focusToNextCell(sq, $cell) {
	    var range;

	    range = sq.getSelection();
	    range.selectNodeContents($cell.next()[0]);
	    range.collapse(true);

	    sq.setSelection(range);
	}

	module.exports = AddCol;


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * RemoveRow
	 * remove Row to selected table
	 * @exports RemoveRow
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var RemoveRow = CommandManager.command('wysiwyg', /** @lends RemoveRow */{
	    name: 'RemoveRow',
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function(wwe) {
	        var sq = wwe.getEditor(),
	            range = sq.getSelection().cloneRange(),
	            $tr, $nextFocus;

	        if (sq.hasFormat('TD') && $(range.startContainer).closest('table').find('tbody tr').length > 1) {
	            sq.saveUndoState(range);
	            $tr = $(range.startContainer).closest('tr');

	            $nextFocus = $tr.next().length ? $tr.next() : $tr.prev();

	            $tr.remove();

	            sq.focus();

	            if ($nextFocus.length) {
	                focusToFirstTd(sq, $nextFocus);
	            }
	        } else {
	            sq.focus();
	        }
	    }
	});

	function focusToFirstTd(sq, $tr) {
	    var range;

	    range = sq.getSelection();
	    range.selectNodeContents($tr.find('td')[0]);
	    range.collapse(true);
	    sq.setSelection(range);
	}

	module.exports = RemoveRow;


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43),
	    domUtils = __webpack_require__(19);

	/**
	 * RemoveCol
	 * remove Row to selected table
	 * @exports RemoveCol
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var RemoveCol = CommandManager.command('wysiwyg', /** @lends RemoveCol */{
	    name: 'RemoveCol',
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function(wwe) {
	        var sq = wwe.getEditor(),
	            range = sq.getSelection().cloneRange(),
	            $cell, $nextFocus;

	        if (sq.hasFormat('TR') && $(range.startContainer).closest('table').find('thead tr th').length > 1) {
	            sq.saveUndoState(range);
	            $cell = getCellByRange(range);
	            $nextFocus = $cell.next().length ? $cell.next() : $cell.prev();

	            removeColByCell($cell);

	            sq.focus();

	            focusToCell(sq, $nextFocus);
	        } else {
	            sq.focus();
	        }
	    }
	});

	function getCellByRange(range) {
	    var cell = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset);

	    if (domUtils.getNodeName(cell) === 'TD' || domUtils.getNodeName(cell) === 'TH') {
	        cell = $(cell);
	    } else {
	        cell = $(cell).parentsUntil('tr');
	    }

	    return cell;
	}

	function removeColByCell($cell) {
	    var index = $cell.index();

	    $cell.parents('table').find('tr').each(function(n, tr) {
	        $(tr).children().eq(index).remove();
	    });
	}

	function focusToCell(sq, $cell) {
	    var range;

	    if ($cell.length) {
	        range = sq.getSelection();
	        range.selectNodeContents($cell[0]);
	        range.collapse(true);
	        sq.setSelection(range);
	    }
	}

	module.exports = RemoveCol;


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * RemoveTable
	 * Remove selected table
	 * @exports RemoveTable
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var RemoveTable = CommandManager.command('wysiwyg', /** @lends RemoveTable */{
	    name: 'RemoveTable',
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function(wwe) {
	        var sq = wwe.getEditor(),
	            range = sq.getSelection().cloneRange(),
	            $table;

	        if (sq.hasFormat('TABLE')) {
	            sq.saveUndoState(range);
	            $table = $(range.startContainer).closest('table');

	            $table.remove();
	        }

	        sq.focus();
	    }
	});

	module.exports = RemoveTable;


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements incease depth wysiwyg command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * IncreaseDepth
	 * increase depth of list or task to wysiwyg Editor
	 * @exports IncreaseDepth
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var IncreaseTask = CommandManager.command('wysiwyg', /** @lends HR */{
	    name: 'IncreaseDepth',
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function(wwe) {
	        var $prev, prevClasses, $node, nodeClasses;
	        var range = wwe.getEditor().getSelection();
	        var isInTaskList = wwe.getManager('task').isInTaskList(range);
	            // IE10 에서 task의 startOffset에 ZWB를 가산하는 문제때문에,
	            // list 일때 depth 커서위치 1에서의 depth 이동을 제한하기 위해 사용
	        var isOffsetEuqals2InDIVForIE10 = (range.startContainer.tagName === 'DIV' && range.startOffset === 2);

	        if ((isInTaskList && range.startOffset <= 1)
	            || isOffsetEuqals2InDIVForIE10
	            || range.startOffset === 0
	        ) {
	            $node = $(range.startContainer).closest('li');
	            $prev = $node.prev();

	            if (!$prev.length) {
	                return;
	            }

	            wwe.getEditor().saveUndoState(range);

	            nodeClasses = $node.attr('class');
	            prevClasses = $prev.attr('class');

	            $node.removeAttr('class');
	            $prev.removeAttr('class');

	            wwe.getEditor().increaseListLevel();

	            $node.attr('class', nodeClasses);
	            $prev.attr('class', prevClasses);
	        }
	    }
	});

	module.exports = IncreaseTask;


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements incease depth wysiwyg command
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * DecreaseDepth
	 * decrease depth of list or task to wysiwyg Editor
	 * @exports IncreaseDepth
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var DecreaseDepth = CommandManager.command('wysiwyg', /** @lends HR */{
	    name: 'DecreaseDepth',
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WysiwygEditor instance
	     */
	    exec: function(wwe) {
	        var $node, nodeClasses, $input;
	        var range = wwe.getEditor().getSelection();
	        var isInTaskList = wwe.getManager('task').isInTaskList(range);
	        // IE10 에서 task의 startOffset에 ZWB를 가산하는 문제때문에,
	        // list 일때 depth 커서위치 1에서의 depth 이동을 제한하기 위해 사용
	        var isOffsetEuqals2InDIVForIE10 = (range.startContainer.tagName === 'DIV' && range.startOffset === 2);

	        $node = $(range.startContainer).closest('li');
	        $input = $($node.find('input:checkbox')[0]);
	        if ((isInTaskList && range.startOffset <= 1)
	            || isOffsetEuqals2InDIVForIE10
	            || range.startOffset === 0
	        ) {
	            wwe.getEditor().saveUndoState(range);

	            nodeClasses = $node.attr('class');
	            $node.removeAttr('class');

	            wwe.getEditor().decreaseListLevel();

	            if ($input.length && ($input.parents('ol,ul').length === 0
	                || $input.parents('li').length === 0
	                || !$input.parents('li').hasClass('task-list-item'))
	            ) {
	                $input.remove();
	            } else {
	                range = wwe.getEditor().getSelection().cloneRange();
	                $node = $(range.startContainer).closest('li');

	                if (nodeClasses) {
	                    $node.attr('class', nodeClasses);
	                } else {
	                    $node.removeAttr('class');
	                }
	            }
	        }
	    }
	});

	module.exports = DecreaseDepth;


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements Task WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	/**
	 * Task
	 * Add Task to selected wysiwyg editor content
	 * @exports Task
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var Task = CommandManager.command('wysiwyg', /** @lends Task */{
	    name: 'Task',
	    keyMap: ['CTRL+T', 'META+T'],
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function(wwe) {
	        var range,
	            sq = wwe.getEditor();

	        range = sq.getSelection().cloneRange();

	        if (range.collapsed && !sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
	            if (!sq.hasFormat('li')) {
	                wwe.unwrapBlockTag();
	                sq.makeUnorderedList();
	                range = sq.getSelection().cloneRange();
	            }

	            range = wwe.insertSelectionMarker(range);
	            wwe.getManager('task').formatTask(range.startContainer);
	            wwe.restoreSelectionMarker();
	        }

	        sq.focus();
	    }
	});

	module.exports = Task;


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43),
	    domUtils = __webpack_require__(19);

	/**
	 * Code
	 * Add bold to selected wysiwyg editor content
	 * @exports Code
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var Code = CommandManager.command('wysiwyg', /** @lends Code */{
	    name: 'Code',
	    keyMap: ['SHIFT+CTRL+C', 'SHIFT+META+C'],
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function(wwe) {
	        var sq = wwe.getEditor(), range;

	        if (!sq.hasFormat('PRE') && sq.hasFormat('code')) {
	            sq.changeFormat(null, {tag: 'code'});
	            removeUnnecessaryCodeInNextToRange(wwe.getEditor().getSelection().cloneRange());
	        } else if (!sq.hasFormat('a') && !sq.hasFormat('PRE')) {
	            if (sq.hasFormat('b')) {
	                sq.removeBold();
	            } else if (sq.hasFormat('i')) {
	                sq.removeItalic();
	            }

	            sq.changeFormat({tag: 'code'});

	            range = sq.getSelection().cloneRange();
	            range.setStart(range.endContainer, range.endOffset);
	            range.collapse(true);

	            sq.setSelection(range);
	        }

	        sq.focus();
	    }
	});

	/**
	 * removeUnnecessaryCodeInNextToRange
	 * Remove unnecessary code tag next to range, code tag made by squire
	 * @param {Range} range range object
	 */
	function removeUnnecessaryCodeInNextToRange(range) {
	    if (domUtils.getNodeName(range.startContainer.nextSibling) === 'CODE'
	        && domUtils.getTextLength(range.startContainer.nextSibling) === 0
	    ) {
	        $(range.startContainer.nextSibling).remove();
	    }
	}

	module.exports = Code;


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	'use strict';

	var CommandManager = __webpack_require__(43);

	var codeBlockID = 0,
	    CODEBLOCK_CLASS_PREFIX = 'te-content-codeblock-';
	/**
	 * CodeBlock
	 * Add CodeBlock to wysiwygEditor
	 * @exports CodeBlock
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var CodeBlock = CommandManager.command('wysiwyg', /** @lends CodeBlock */{
	    name: 'CodeBlock',
	    keyMap: ['SHIFT+CTRL+P', 'SHIFT+META+P'],
	    /**
	     * Command handler
	     * @param {WysiwygEditor} wwe WYsiwygEditor instance
	     * @param {string} type of language
	     */
	    exec: function(wwe, type) {
	        var attr, codeBlockBody;
	        var sq = wwe.getEditor();
	        var range = sq.getSelection().cloneRange();
	        if (!sq.hasFormat('PRE')) {
	            attr = ' class = "' + CODEBLOCK_CLASS_PREFIX + codeBlockID + '"';

	            if (type) {
	                attr += ' data-language="' + type + '"';
	            }

	            codeBlockBody = getCodeBlockBody(range, wwe);
	            sq.insertHTML('<pre' + attr + '>' + codeBlockBody + '</pre>');

	            focusToFirstCode(wwe.get$Body().find('.' + CODEBLOCK_CLASS_PREFIX + codeBlockID), wwe);

	            codeBlockID += 1;
	        }

	        sq.focus();
	    }
	});

	/**
	 * focusToFirstCode
	 * Focus to first code tag content of pre tag
	 * @param {jQuery} $pre pre tag
	 * @param {WysiwygEditor} wwe wysiwygEditor
	 */
	function focusToFirstCode($pre, wwe) {
	    var range = wwe.getEditor().getSelection().cloneRange();

	    range.setStart($pre.find('code')[0].firstChild, 0);
	    range.collapse(true);

	    wwe.getEditor().setSelection(range);
	}
	/**
	 * getCodeBlockBody
	 * get text wrapped by code
	 * @param {object} range range object
	 * @param {object} wwe wysiwyg editor
	 * @returns {string}
	 */
	function getCodeBlockBody(range, wwe) {
	    var codeBlock;
	    var mgr = wwe.getManager('codeblock');
	    var contents, nodes;

	    if (range.collapsed) {
	        nodes = [$('<div>&#8203<br></div>')[0]];
	    } else {
	        contents = range.extractContents();
	        nodes = [].slice.call(contents.childNodes);
	    }

	    codeBlock = mgr.convertToCodeblock(nodes).innerHTML;

	    return codeBlock;
	}

	module.exports = CodeBlock;


/***/ }
/******/ ]);
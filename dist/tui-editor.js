/**
 * Toast UI Colorpicker
 * @version 1.0.2
 */
!function e(t,o,n){function i(s,l){if(!o[s]){if(!t[s]){var a="function"==typeof require&&require;if(!l&&a)return a(s,!0);if(r)return r(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var u=o[s]={exports:{}};t[s][0].call(u.exports,function(e){var o=t[s][1][e];return i(o?o:e)},u,u.exports,e,t,o,n)}return o[s].exports}for(var r="function"==typeof require&&require,s=0;s<n.length;s++)i(n[s]);return i}({1:[function(e,t,o){"use strict";tui.util.defineNamespace("tui.component.colorpicker",{domutil:e("./src/js/core/domutil"),domevent:e("./src/js/core/domevent"),Collection:e("./src/js/core/collection"),View:e("./src/js/core/view"),Drag:e("./src/js/core/drag"),create:e("./src/js/factory"),Palette:e("./src/js/palette"),Slider:e("./src/js/slider"),colorutil:e("./src/js/colorutil"),svgvml:e("./src/js/svgvml")})},{"./src/js/colorutil":2,"./src/js/core/collection":3,"./src/js/core/domevent":4,"./src/js/core/domutil":5,"./src/js/core/drag":6,"./src/js/core/view":7,"./src/js/factory":8,"./src/js/palette":10,"./src/js/slider":11,"./src/js/svgvml":12}],2:[function(e,t,o){"use strict";var n=/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i,i={leadingZero:function(e,t){var o="",n=0;if((e+"").length>t)return e+"";for(;n<t-1;n+=1)o+="0";return(o+e).slice(t*-1)},isValidRGB:function(e){return n.test(e)},hexToRGB:function(e){var t,o,n;return!!i.isValidRGB(e)&&(e=e.substring(1),t=parseInt(e.substr(0,2),16),o=parseInt(e.substr(2,2),16),n=parseInt(e.substr(4,2),16),[t,o,n])},rgbToHEX:function(e,t,o){var n="#"+i.leadingZero(e.toString(16),2)+i.leadingZero(t.toString(16),2)+i.leadingZero(o.toString(16),2);return!!i.isValidRGB(n)&&n},rgbToHSV:function(e,t,o){var n,i,r,s,l,a;if(e/=255,t/=255,o/=255,n=Math.max(e,t,o),i=Math.min(e,t,o),l=n,a=n-i,s=0===n?0:a/n,n===i)r=0;else{switch(n){case e:r=(t-o)/a+(t<o?6:0);break;case t:r=(o-e)/a+2;break;case o:r=(e-t)/a+4}r/=6}return[Math.round(360*r),Math.round(100*s),Math.round(100*l)]},hsvToRGB:function(e,t,o){var n,i,r,s,l,a,c,u;if(e=Math.max(0,Math.min(360,e)),t=Math.max(0,Math.min(100,t)),o=Math.max(0,Math.min(100,o)),t/=100,o/=100,0===t)return n=i=r=o,[Math.round(255*n),Math.round(255*i),Math.round(255*r)];switch(e/=60,s=Math.floor(e),l=e-s,a=o*(1-t),c=o*(1-t*l),u=o*(1-t*(1-l)),s){case 0:n=o,i=u,r=a;break;case 1:n=c,i=o,r=a;break;case 2:n=a,i=o,r=u;break;case 3:n=a,i=c,r=o;break;case 4:n=u,i=a,r=o;break;default:n=o,i=a,r=c}return[Math.round(255*n),Math.round(255*i),Math.round(255*r)]}};t.exports=i},{}],3:[function(e,t,o){(function(e){"use strict";function o(e){this.items={},this.length=0,s(e)&&(this.getItemID=e)}var n=e.tui.util,i=n.forEachOwnProperties,r=n.forEachArray,s=n.isFunction,l=n.isObject,a=Array.prototype.slice;o.and=function(e){var t;return e=a.call(arguments),t=e.length,function(o){for(var n=0;n<t;n+=1)if(!e[n].call(null,o))return!1;return!0}},o.or=function(e){var t;return e=a.call(arguments),t=e.length,function(o){for(var n=1,i=e[0].call(null,o);n<t;n+=1)i=i||e[n].call(null,o);return i}},o.merge=function(e){var t=a.call(arguments),i={},s=new o(t[0].getItemID),l=n.extend;return r(t,function(e){l(i,e.items)}),s.items=i,s.length=n.keys(s.items).length,s},o.prototype.getItemID=function(e){return e._id+""},o.prototype.add=function(e){var t,o;return arguments.length>1?void r(a.call(arguments),function(e){this.add(e)},this):(t=this.getItemID(e),o=this.items,o[t]||(this.length+=1),void(o[t]=e))},o.prototype.remove=function(e){var t,o,i=[];return this.length?arguments.length>1?i=n.map(a.call(arguments),function(e){return this.remove(e)},this):(t=this.items,l(e)&&(e=this.getItemID(e)),t[e]?(this.length-=1,o=t[e],delete t[e],o):i):i},o.prototype.clear=function(){this.items={},this.length=0},o.prototype.has=function(e){var t,o;return!!this.length&&(t=s(e),o=!1,t?this.each(function(t){if(e(t)===!0)return o=!0,!1}):(e=l(e)?this.getItemID(e):e,o=n.isExisty(this.items[e])),o)},o.prototype.doWhenHas=function(e,t,o){var i=this.items[e];n.isExisty(i)&&t.call(o||this,i)},o.prototype.find=function(e){var t=new o;return this.hasOwnProperty("getItemID")&&(t.getItemID=this.getItemID),this.each(function(o){e(o)===!0&&t.add(o)}),t},o.prototype.groupBy=function(e,t){var i,r,s={},l=n.isFunction,a=l(e),c=this.getItemID;if(n.isArray(e)){if(n.forEachArray(e,function(e){s[e+""]=new o(c)}),!t)return s;e=t,a=!0}return this.each(function(t){a?r=e(t):(r=t[e],l(r)&&(r=r.apply(t))),i=s[r],i||(i=s[r]=new o(c)),i.add(t)}),s},o.prototype.single=function(){var e;return this.each(function(t){return e=t,!1},this),e},o.prototype.sort=function(e){var t=[];return this.each(function(e){t.push(e)}),s(e)&&(t=t.sort(e)),t},o.prototype.each=function(e,t){i(this.items,e,t||this)},o.prototype.toArray=function(){return this.length?n.map(this.items,function(e){return e}):[]},t.exports=o}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],4:[function(e,t,o){(function(e){"use strict";var o=e.tui.util,n=o.browser,i="_evt",r={START:["touchstart","mousedown"],END:{mousedown:"mouseup",touchstart:"touchend",pointerdown:"touchend",MSPointerDown:"touchend"},MOVE:{mousedown:"mousemove",touchstart:"touchmove",pointerdown:"touchmove",MSPointerDown:"touchmove"}},s={on:function(e,t,n,i){return o.isString(t)?void o.forEach(t.split(" "),function(t){s._on(e,t,n,i)}):void o.forEachOwnProperties(t,function(t,o){s._on(e,o,t,n)})},_on:function(e,t,n,r){var l,a,c;l=t+o.stamp(n)+(r?"_"+o.stamp(r):""),e[i]&&e[i][l]||(a=function(t){n.call(r||e,t||window.event)},c=a,"addEventListener"in e?"mouseenter"===t||"mouseleave"===t?(a=function(t){t=t||window.event,s._checkMouse(e,t)&&c(t)},e.addEventListener("mouseenter"===t?"mouseover":"mouseout",a,!1)):("mousewheel"===t&&e.addEventListener("DOMMouseScroll",a,!1),e.addEventListener(t,a,!1)):"attachEvent"in e&&e.attachEvent("on"+t,a),e[i]=e[i]||{},e[i][l]=a)},off:function(e,t,n,i){return o.isString(t)?void o.forEach(t.split(" "),function(t){s._off(e,t,n,i)}):void o.forEachOwnProperties(t,function(t,o){s._off(e,o,t,n)})},_off:function(e,t,n,r){var s=t+o.stamp(n)+(r?"_"+o.stamp(r):""),l=e[i]&&e[i][s];if(l){if("removeEventListener"in e)"mouseenter"===t||"mouseleave"===t?e.removeEventListener("mouseenter"===t?"mouseover":"mouseout",l,!1):("mousewheel"===t&&e.removeEventListener("DOMMouseScroll",l,!1),e.removeEventListener(t,l,!1));else if("detachEvent"in e)try{e.detachEvent("on"+t,l)}catch(a){}if(delete e[i][s],!o.keys(e[i]).length)return o.browser.msie&&o.browser.version<9?void(e[i]=null):void delete e[i]}},once:function(e,t,n,i){function r(){n.apply(i||e,arguments),l._off(e,t,r,i)}var l=this;return o.isObject(t)?void o.forEachOwnProperties(t,function(t,o){s.once(e,o,t,n)}):void s.on(e,t,r,i)},stopPropagation:function(e){e.stopPropagation?e.stopPropagation():e.cancelBubble=!0},preventDefault:function(e){e.preventDefault?e.preventDefault():e.returnValue=!1},stop:function(e){s.preventDefault(e),s.stopPropagation(e)},disableScrollPropagation:function(e){s.on(e,"mousewheel MozMousePixelScroll",s.stopPropagation)},disableClickPropagation:function(e){s.on(e,r.START.join(" ")+" click dblclick",s.stopPropagation)},getMousePosition:function(e,t){var o;return t?(o=t.getBoundingClientRect(),[e.clientX-o.left-t.clientLeft,e.clientY-o.top-t.clientTop]):[e.clientX,e.clientY]},getWheelDelta:function(e){var t=0;return e.wheelDelta&&(t=e.wheelDelta/120),e.detail&&(t=-e.detail/3),t},_checkMouse:function(e,t){var o=t.relatedTarget;if(!o)return!0;try{for(;o&&o!==e;)o=o.parentNode}catch(n){return!1}return o!==e},trigger:function(e,t,n){var i=/(mouse|click)/;o.isUndefined(n)&&i.exec(t)&&(n=s.mouseEvent(t)),e.dispatchEvent?e.dispatchEvent(n):e.fireEvent&&e.fireEvent("on"+t,n)},mouseEvent:function(e,t){var i,r;return r=o.extend({bubbles:!0,cancelable:"mousemove"!==e,view:window,wheelDelta:0,detail:0,screenX:0,screenY:0,clientX:0,clientY:0,ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1,button:0,relatedTarget:void 0},t),n.msie&&n.version<9&&delete r.wheelDelta,"function"==typeof document.createEvent?(i=document.createEvent("MouseEvents"),i.initMouseEvent(e,r.bubbles,r.cancelable,r.view,r.detail,r.screenX,r.screenY,r.clientX,r.clientY,r.ctrlKey,r.altKey,r.shiftKey,r.metaKey,r.button,document.body.parentNode)):document.createEventObject&&(i=document.createEventObject(),o.forEach(r,function(e,t){i[t]=e},this),i.button={0:1,1:4,2:2}[i.button]||i.button),i},getMouseButton:function(e){var t,o="0,1,3,5,7",n="2,6",i="4";return document.implementation.hasFeature("MouseEvents","2.0")?e.button:(t=e.button+"",~o.indexOf(t)?0:~n.indexOf(t)?2:~i.indexOf(t)?1:void 0)}};t.exports=s}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],5:[function(e,t,o){(function(o){"use strict";function n(e){return e.replace(/^\s\s*/,"").replace(/\s\s*$/,"")}var i,r=e("./domevent"),s=e("./collection"),l=o.tui.util,a="_pos",c=/^auto$|^$|%/;i={appendHTMLElement:function(e,t,o){var n;return o=o||"",n=document.createElement(e),n.className=o,t?t.appendChild(n):document.body.appendChild(n),n},remove:function(e){e&&e.parentNode&&e.parentNode.removeChild(e)},get:function(e){return document.getElementById(e)},_matcher:function(e,t){var o=/^\./,n=/^#/;return o.test(t)?i.hasClass(e,t.replace(".","")):n.test(t)?e.id===t.replace("#",""):e.nodeName.toLowerCase()===t.toLowerCase()},find:function(e,t,o){function n(e,t){for(var l,u=e.childNodes,d=0,f=u.length;d<f;d+=1)if(l=u[d],"#text"!==l.nodeName)if(i._matcher(l,t)){if((c&&o(l)||!c)&&r.push(l),a){s=!0;break}}else if(l.childNodes.length>0&&(n(l,t),s))break}var r=[],s=!1,a=l.isUndefined(o)||o===!1,c=l.isFunction(o);return l.isString(t)&&(t=i.get(t)),t=t||window.document.body,n(t,e),a?r[0]||null:r},closest:function(e,t){var o=e.parentNode;if(i._matcher(e,t))return e;for(;o&&o!==window.document.body;){if(i._matcher(o,t))return o;o=o.parentNode}},text:function(e){var t="",o=0,n=e.nodeType;if(n){if(1===n||9===n||11===n){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)t+=i.text(e)}else if(3===n||4===n)return e.nodeValue}else for(;e[o];o+=1)t+=i.text(e[o]);return t},setData:function(e,t,o){return"dataset"in e?void(e.dataset[t]=o):void e.setAttribute("data-"+t,o)},getData:function(e,t){return"dataset"in e?e.dataset[t]:e.getAttribute("data-"+t)},hasClass:function(e,t){var o;return l.isUndefined(e.classList)?(o=i.getClass(e),o.length>0&&new RegExp("(^|\\s)"+t+"(\\s|$)").test(o)):e.classList.contains(t)},addClass:function(e,t){var o;l.isUndefined(e.classList)?i.hasClass(e,t)||(o=i.getClass(e),i.setClass(e,(o?o+" ":"")+t)):l.forEachArray(t.split(" "),function(t){e.classList.add(t)})},setClass:function(e,t){l.isUndefined(e.className.baseVal)?e.className=t:e.className.baseVal=t},removeClass:function(e,t){var o="";l.isUndefined(e.classList)?(o=(" "+i.getClass(e)+" ").replace(" "+t+" "," "),i.setClass(e,n(o))):e.classList.remove(t)},getClass:function(e){return e&&e.className?l.isUndefined(e.className.baseVal)?e.className:e.className.baseVal:""},getStyle:function(e,t){var o,n=e.style[t]||e.currentStyle&&e.currentStyle[t];return n&&"auto"!==n||!document.defaultView||(o=document.defaultView.getComputedStyle(e,null),n=o?o[t]:null),"auto"===n?null:n},getComputedStyle:function(e){var t=document.defaultView;return t&&t.getComputedStyle?document.defaultView.getComputedStyle(e):{getPropertyValue:function(t){var o=/(\-([a-z]){1})/g;return"float"===t&&(t="styleFloat"),o.test(t)&&(t=t.replace(o,function(){return arguments[2].toUpperCase()})),e.currentStyle[t]?e.currentStyle[t]:null}}},setPosition:function(e,t,o){t=l.isUndefined(t)?0:t,o=l.isUndefined(o)?0:o,e[a]=[t,o],e.style.left=t+"px",e.style.top=o+"px"},getPosition:function(e,t){var o,n,i;return t&&(e[a]=null),e[a]?e[a]:(o=0,n=0,(c.test(e.style.left)||c.test(e.style.top))&&"getBoundingClientRect"in e?(i=e.getBoundingClientRect(),o=i.left,n=i.top):(o=parseFloat(e.style.left||0),n=parseFloat(e.style.top||0)),[o,n])},getSize:function(e){var t,o=i.getStyle(e,"width"),n=i.getStyle(e,"height");return(c.test(o)||c.test(n))&&"getBoundingClientRect"in e?(t=e.getBoundingClientRect(),o=t.width,n=t.height):(o=parseFloat(o||0),n=parseFloat(n||0)),[o,n]},testProp:function(e){for(var t=document.documentElement.style,o=0,n=e.length;o<n;o+=1)if(e[o]in t)return e[o];return!1},getFormData:function(e){var t=new s(function(){return this.length}),o=function(e){return!e.disabled},n={};return t.add.apply(t,i.find("input",e,o).concat(i.find("select",e,o)).concat(i.find("textarea",e,o))),t=t.groupBy(function(e){return e&&e.getAttribute("name")||"_other"}),l.forEach(t,function(e,t){"_other"!==t&&e.each(function(o){var r=o.nodeName.toLowerCase(),s=o.type,a=[];"radio"===s?a=[e.find(function(e){return e.checked}).toArray().pop()]:"checkbox"===s?a=e.find(function(e){return e.checked}).toArray():"select"===r?e.find(function(e){return!!e.childNodes.length}).each(function(e){a=a.concat(i.find("option",e,function(e){return e.selected}))}):a=e.find(function(e){return""!==e.value}).toArray(),a=l.map(a,function(e){return e.value}),a.length?1===a.length&&(a=a[0]):a="",n[t]=a})}),n}};var u=i.testProp(["userSelect","WebkitUserSelect","OUserSelect","MozUserSelect","msUserSelect"]),d="onselectstart"in document,f="";i.disableTextSelection=function(){return d?function(){r.on(window,"selectstart",r.preventDefault)}:function(){var e=document.documentElement.style;f=e[u],e[u]="none"}}(),i.enableTextSelection=function(){return d?function(){r.off(window,"selectstart",r.preventDefault)}:function(){document.documentElement.style[u]=f}}(),i.disableImageDrag=function(){r.on(window,"dragstart",r.preventDefault)},i.enableImageDrag=function(){r.off(window,"dragstart",r.preventDefault)},t.exports=i}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./collection":3,"./domevent":4}],6:[function(e,t,o){(function(o){"use strict";function n(e,t){s.on(t,"mousedown",this._onMouseDown,this),this.options=i.extend({distance:10},e),this.container=t,this._isMoved=!1,this._distance=0,this._dragStartFired=!1,this._dragStartEventData=null}var i=o.tui.util,r=e("./domutil"),s=e("./domevent");n.prototype.destroy=function(){s.off(this.container,"mousedown",this._onMouseDown,this),this.options=this.container=this._isMoved=this._distance=this._dragStartFired=this._dragStartEventData=null},n.prototype._toggleDragEvent=function(e){var t,n,i=this.container;e?(t="on",n="disable"):(t="off",n="enable"),r[n+"TextSelection"](i),r[n+"ImageDrag"](i),s[t](o.document,{mousemove:this._onMouseMove,mouseup:this._onMouseUp},this)},n.prototype._getEventData=function(e){return{target:e.target||e.srcElement,originEvent:e}},n.prototype._onMouseDown=function(e){0===s.getMouseButton(e)&&(this._distance=0,this._dragStartFired=!1,this._dragStartEventData=this._getEventData(e),this._toggleDragEvent(!0))},n.prototype._onMouseMove=function(e){var t=this.options.distance;return s.preventDefault(e),this._isMoved=!0,this._distance<t?void(this._distance+=1):this._dragStartFired||(this._dragStartFired=!0,this.invoke("dragStart",this._dragStartEventData))?void this.fire("drag",this._getEventData(e)):void this._toggleDragEvent(!1)},n.prototype._onMouseUp=function(e){return this._toggleDragEvent(!1),this._isMoved?(this._isMoved=!1,void this.fire("dragEnd",this._getEventData(e))):void this.fire("click",this._getEventData(e))},i.CustomEvents.mixin(n),t.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./domevent":4,"./domutil":5}],7:[function(e,t,o){(function(o){"use strict";function n(e,t){var o=i.stamp(this);e=e||{},i.isUndefined(t)&&(t=r.appendHTMLElement("div")),r.addClass(t,"tui-view-"+o),this.id=o,this.container=t,this.childs=new s(function(e){return i.stamp(e)}),this.parent=null}var i=o.tui.util,r=e("./domutil"),s=e("./collection");n.prototype.addChild=function(e,t){t&&t.call(e,this),e.parent=this,this.childs.add(e)},n.prototype.removeChild=function(e,t){var o=i.isNumber(e)?this.childs.items[e]:e;e=i.stamp(o),t&&t.call(o,this),this.childs.remove(e)},n.prototype.render=function(){this.childs.each(function(e){e.render()})},n.prototype.recursive=function(e,t){i.isFunction(e)&&(t||e(this),this.childs.each(function(t){t.recursive(e)}))},n.prototype.resize=function(){for(var e=Array.prototype.slice.call(arguments),t=this.parent;t;)i.isFunction(t._onResize)&&t._onResize.apply(t,e),t=t.parent},n.prototype._beforeDestroy=function(){},n.prototype._destroy=function(){this._beforeDestroy(),this.childs.clear(),this.container.innerHTML="",this.id=this.parent=this.childs=this.container=null},n.prototype.destroy=function(e){this.childs.each(function(e){e.destroy(!0),e._destroy()}),e||this._destroy()},n.prototype.getViewBound=function(){var e=this.container,t=r.getPosition(e),o=r.getSize(e);return{x:t[0],y:t[1],width:o[0],height:o[1]}},t.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./collection":3,"./domutil":5}],8:[function(e,t,o){(function(o){"use strict";function n(e){alert(e)}function i(e){var t;return this instanceof i?(e=this.options=r.extend({container:null,color:"#f8f8f8",preset:["#181818","#282828","#383838","#585858","#b8b8b8","#d8d8d8","#e8e8e8","#f8f8f8","#ab4642","#dc9656","#f7ca88","#a1b56c","#86c1b9","#7cafc2","#ba8baf","#a16946"],cssPrefix:"tui-colorpicker-",detailTxt:"Detail"},e),e.container?(t=this.layout=new l(e,e.container),this.palette=new a(e,t.container),this.palette.on({_selectColor:this._onSelectColorInPalette,_toggleSlider:this._onToggleSlider},this),this.slider=new c(e,t.container),this.slider.on("_selectColor",this._onSelectColorInSlider,this),t.addChild(this.palette),t.addChild(this.slider),void this.render(e.color)):void n("Colorpicker(): need container option.")):new i(e)}var r=o.tui.util,s=e("./colorutil"),l=e("./layout"),a=e("./palette"),c=e("./slider");i.prototype._onSelectColorInPalette=function(e){var t=e.color,o=this.options;return s.isValidRGB(t)?(this.fire("selectColor",{color:t,origin:"palette"}),void(o.color!==t&&(o.color=t,this.render(t)))):void this.render()},i.prototype._onToggleSlider=function(){this.slider.toggle(!this.slider.isVisible())},i.prototype._onSelectColorInSlider=function(e){var t=e.color,o=this.options;this.fire("selectColor",{color:t,origin:"slider"}),o.color!==t&&(o.color=t,this.palette.render(t))},i.prototype.setColor=function(e){s.isValidRGB(e)||n("Colorpicker#setColor(): need valid hex string color value"),this.options.color=e,this.render(e)},i.prototype.getColor=function(){return this.options.color},i.prototype.toggle=function(e){this.layout.container.style.display=e?"block":"none"},i.prototype.render=function(e){this.layout.render(e||this.options.color)},i.prototype.destroy=function(){this.layout.destroy(),this.options.container.innerHTML="",this.layout=this.slider=this.palette=this.options=null},r.CustomEvents.mixin(i),t.exports=i}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./colorutil":2,"./layout":9,"./palette":10,"./slider":11}],9:[function(e,t,o){(function(o){"use strict";function n(e,t){this.options=i.extend({cssPrefix:"tui-colorpicker-"},e),t=r.appendHTMLElement("div",t,this.options.cssPrefix+"container"),s.call(this,e,t),this.render()}var i=o.tui.util,r=e("./core/domutil"),s=e("./core/view");i.inherit(n,s),n.prototype.render=function(e){this.recursive(function(t){t.render(e)},!0)},t.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./core/domutil":5,"./core/view":7}],10:[function(e,t,o){(function(o){"use strict";function n(e,t){this.options=i.extend({cssPrefix:"tui-colorpicker-",preset:["#181818","#282828","#383838","#585858","#B8B8B8","#D8D8D8","#E8E8E8","#F8F8F8","#AB4642","#DC9656","#F7CA88","#A1B56C","#86C1B9","#7CAFC2","#BA8BAF","#A16946"],detailTxt:"Detail"},e),t=r.appendHTMLElement("div",t,this.options.cssPrefix+"palette-container"),l.call(this,e,t)}var i=o.tui.util,r=e("./core/domutil"),s=e("./core/domevent"),l=e("./core/view"),a=e("../template/palette");i.inherit(n,l),n.prototype._onClick=function(e){var t=this.options,o=e.srcElement||e.target,n={};return r.hasClass(o,t.cssPrefix+"palette-button")?(n.color=o.value,void this.fire("_selectColor",n)):void(r.hasClass(o,t.cssPrefix+"palette-toggle-slider")&&this.fire("_toggleSlider"))},n.prototype._onChange=function(e){var t=this.options,o=e.srcElement||e.target,n={};if(r.hasClass(o,t.cssPrefix+"palette-hex"))return n.color=o.value,void this.fire("_selectColor",n)},n.prototype._beforeDestroy=function(){this._toggleEvent(!1)},n.prototype._toggleEvent=function(e){var t,o=this.options,n=this.container,i=s[e?"on":"off"];i(n,"click",this._onClick,this),t=r.find("."+o.cssPrefix+"palette-hex",n),t&&i(t,"change",this._onChange,this)},n.prototype.render=function(e){var t=this.options,o="";this._toggleEvent(!1),o=a.layout.replace("{{colorList}}",i.map(t.preset,function(o){var n=a.item.replace(/{{color}}/g,o);return n=n.replace("{{selected}}",o===e?" "+t.cssPrefix+"selected":"")}).join("")),o=o.replace(/{{cssPrefix}}/g,t.cssPrefix).replace("{{detailTxt}}",t.detailTxt).replace(/{{color}}/g,e),this.container.innerHTML=o,this._toggleEvent(!0)},i.CustomEvents.mixin(n),t.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../template/palette":13,"./core/domevent":4,"./core/domutil":5,"./core/view":7}],11:[function(e,t,o){(function(o){"use strict";function n(e,t){t=r.appendHTMLElement("div",t,e.cssPrefix+"slider-container"),t.style.display="none",c.call(this,e,t),this.options=i.extend({color:"#f8f8f8",cssPrefix:"tui-colorpicker-"},e),this._dragDataCache={},this.sliderHandleElement=null,this.huebarHandleElement=null,this.baseColorElement=null,this.drag=new u({distance:0},t),this.drag.on({dragStart:this._onDragStart,drag:this._onDrag,dragEnd:this._onDragEnd,click:this._onClick},this)}var i=o.tui.util,r=e("./core/domutil"),s=e("./core/domevent"),l=e("./svgvml"),a=e("./colorutil"),c=e("./core/view"),u=e("./core/drag"),d=e("../template/slider"),f=[-7,112],p=[-3,115],h=359.99;i.inherit(n,c),n.prototype._beforeDestroy=function(){this.drag.off(),this.drag=this.options=this._dragDataCache=this.sliderHandleElement=this.huebarHandleElement=this.baseColorElement=null},n.prototype.toggle=function(e){this.container.style.display=e?"block":"none"},n.prototype.isVisible=function(){return"block"===this.container.style.display},n.prototype.render=function(e){var t,o,n=this,i=n.container,s=n.options,l=d.layout;l=l.replace(/{{slider}}/,d.slider),l=l.replace(/{{huebar}}/,d.huebar),l=l.replace(/{{cssPrefix}}/g,s.cssPrefix),n.container.innerHTML=l,n.sliderHandleElement=r.find("."+s.cssPrefix+"slider-handle",i),n.huebarHandleElement=r.find("."+s.cssPrefix+"huebar-handle",i),n.baseColorElement=r.find("."+s.cssPrefix+"slider-basecolor",i),t=a.hexToRGB(e),o=a.rgbToHSV.apply(null,t),this.moveHue(o[0],!0),this.moveSaturationAndValue(o[1],o[2],!0)},n.prototype._moveColorSliderHandle=function(e,t,o){var n,i=this.sliderHandleElement;t=Math.max(f[0],t),t=Math.min(f[1],t),e=Math.max(f[0],e),e=Math.min(f[1],e),l.setTranslateXY(i,e,t),n=t>50?"white":"black",l.setStrokeColor(i,n),o||this.fire("_selectColor",{color:a.rgbToHEX.apply(null,this.getRGB())})},n.prototype.moveSaturationAndValue=function(e,t,o){var n,i,r,s;e=e||0,t=t||0,n=Math.abs(f[0]),i=f[1],r=e*i/100-n,s=i-t*i/100-n,this._moveColorSliderHandle(r,s,o)},n.prototype._moveColorSliderByPosition=function(e,t){var o=f[0];this._moveColorSliderHandle(e+o,t+o)},n.prototype.getSaturationAndValue=function(){var e,t,o=Math.abs(f[0]),n=o+f[1],i=l.getTranslateXY(this.sliderHandleElement);return e=(i[1]+o)/n*100,t=100-(i[0]+o)/n*100,[e,t]},n.prototype._moveHueHandle=function(e,t){var o,n,i=this.huebarHandleElement,r=this.baseColorElement;e=Math.max(p[0],e),e=Math.min(p[1],e),l.setTranslateY(i,e),o=a.hsvToRGB(this.getHue(),100,100),n=a.rgbToHEX.apply(null,o),l.setGradientColorStop(r,n),t||this.fire("_selectColor",{color:a.rgbToHEX.apply(null,this.getRGB())})},n.prototype.moveHue=function(e,t){var o,n,i=0;o=Math.abs(p[0]),n=o+p[1],e=e||0,i=n*e/h-o,this._moveHueHandle(i,t)},n.prototype._moveHueByPosition=function(e){var t=p[0];this._moveHueHandle(e+t)},n.prototype.getHue=function(){var e,t,o=this.huebarHandleElement,n=l.getTranslateXY(o);return e=Math.abs(p[0]),t=e+p[1],(n[0]+e)*h/t},n.prototype.getHSV=function(){var e=this.getSaturationAndValue(),t=this.getHue();return[t].concat(e)},n.prototype.getRGB=function(){return a.hsvToRGB.apply(null,this.getHSV())},n.prototype._prepareColorSliderForMouseEvent=function(e){var t,o=this.options,n=r.closest(e.target,"."+o.cssPrefix+"slider-part");return t=this._dragDataCache={isColorSlider:r.hasClass(n,o.cssPrefix+"slider-left"),parentElement:n}},n.prototype._onClick=function(e){var t=this._prepareColorSliderForMouseEvent(e),o=s.getMousePosition(e.originEvent,t.parentElement);t.isColorSlider?this._moveColorSliderByPosition(o[0],o[1]):this._moveHueByPosition(o[1]),this._dragDataCache=null},n.prototype._onDragStart=function(e){this._prepareColorSliderForMouseEvent(e)},n.prototype._onDrag=function(e){var t=this._dragDataCache,o=s.getMousePosition(e.originEvent,t.parentElement);t.isColorSlider?this._moveColorSliderByPosition(o[0],o[1]):this._moveHueByPosition(o[1])},n.prototype._onDragEnd=function(){this._dragDataCache=null},i.CustomEvents.mixin(n),t.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../template/slider":14,"./colorutil":2,"./core/domevent":4,"./core/domutil":5,"./core/drag":6,"./core/view":7,"./svgvml":12}],12:[function(e,t,o){(function(e){"use strict";var o=e.tui.util,n=/[\.\-0-9]+/g,i=-6,r={isOldBrowser:function(){var e=r._isOldBrowser;return o.isExisty(e)||(r._isOldBrowser=e=o.browser.msie&&o.browser.version<9),e},getTranslateXY:function(e){var t;return r.isOldBrowser()?(t=e.style,[parseFloat(t.top),parseFloat(t.left)]):(t=e.getAttribute("transform"))?(t=t.match(n),[parseFloat(t[1]),parseFloat(t[0])]):[0,0]},setTranslateXY:function(e,t,o){r.isOldBrowser()?(e.style.left=t+"px",e.style.top=o+"px"):e.setAttribute("transform","translate("+t+","+o+")")},setTranslateY:function(e,t){r.isOldBrowser()?e.style.top=t+"px":e.setAttribute("transform","translate("+i+","+t+")")},setStrokeColor:function(e,t){r.isOldBrowser()?e.strokecolor=t:e.setAttribute("stroke",t)},setGradientColorStop:function(e,t){r.isOldBrowser()?e.color=t:e.setAttribute("stop-color",t)}};t.exports=r}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],13:[function(e,t,o){"use strict";var n=['<ul class="{{cssPrefix}}clearfix">{{colorList}}</ul>','<div class="{{cssPrefix}}clearfix" style="overflow:hidden">','<input type="button" class="{{cssPrefix}}palette-toggle-slider" value="{{detailTxt}}" />','<input type="text" class="{{cssPrefix}}palette-hex" value="{{color}}" maxlength="7" />','<span class="{{cssPrefix}}palette-preview" style="background-color:{{color}};color:{{color}}">{{color}}</span>',"</div>"].join("\n"),i='<li><input class="{{cssPrefix}}palette-button{{selected}}" type="button" style="background-color:{{color}};color:{{color}}" title="{{color}}" value="{{color}}" /></li>';t.exports={layout:n,item:i}},{}],14:[function(e,t,o){(function(e){"use strict";var o=e.tui.util,n=['<div class="{{cssPrefix}}slider-left {{cssPrefix}}slider-part">{{slider}}</div>','<div class="{{cssPrefix}}slider-right {{cssPrefix}}slider-part">{{huebar}}</div>'].join("\n"),i=['<svg class="{{cssPrefix}}svg {{cssPrefix}}svg-slider">',"<defs>",'<linearGradient id="{{cssPrefix}}svg-fill-color" x1="0%" y1="0%" x2="100%" y2="0%">','<stop offset="0%" stop-color="rgb(255,255,255)" />','<stop class="{{cssPrefix}}slider-basecolor" offset="100%" stop-color="rgb(255,0,0)" />',"</linearGradient>",'<linearGradient id="{{cssPrefix}}svn-fill-black" x1="0%" y1="0%" x2="0%" y2="100%">','<stop offset="0%" style="stop-color:rgb(0,0,0);stop-opacity:0" />','<stop offset="100%" style="stop-color:rgb(0,0,0);stop-opacity:1" />',"</linearGradient>","</defs>",'<rect width="100%" height="100%" fill="url(#{{cssPrefix}}svg-fill-color)"></rect>','<rect width="100%" height="100%" fill="url(#{{cssPrefix}}svn-fill-black)"></rect>','<path transform="translate(0,0)" class="{{cssPrefix}}slider-handle" d="M0 7.5 L15 7.5 M7.5 15 L7.5 0 M2 7 a5.5 5.5 0 1 1 0 1 Z" stroke="black" stroke-width="0.75" fill="none" />',"</svg>"].join("\n"),r=['<div class="{{cssPrefix}}vml-slider">','<v:rect strokecolor="none" class="{{cssPrefix}}vml {{cssPrefix}}vml-slider-bg">','<v:fill class="{{cssPrefix}}vml {{cssPrefix}}slider-basecolor" type="gradient" method="none" color="#ff0000" color2="#fff" angle="90" />',"</v:rect>",'<v:rect strokecolor="#ccc" class="{{cssPrefix}}vml {{cssPrefix}}vml-slider-bg">','<v:fill type="gradient" method="none" color="black" color2="white" o:opacity2="0%" class="{{cssPrefix}}vml" />',"</v:rect>",'<v:shape class="{{cssPrefix}}vml {{cssPrefix}}slider-handle" coordsize="1 1" style="width:1px;height:1px;"path="m 0,7 l 14,7 m 7,14 l 7,0 ar 12,12 2,2 z" filled="false" stroked="true" />',"</div>"].join("\n"),s=['<svg class="{{cssPrefix}}svg {{cssPrefix}}svg-huebar">',"<defs>",'<linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">','<stop offset="0%" stop-color="rgb(255,0,0)" />','<stop offset="16.666%" stop-color="rgb(255,255,0)" />','<stop offset="33.333%" stop-color="rgb(0,255,0)" />','<stop offset="50%" stop-color="rgb(0,255,255)" />','<stop offset="66.666%" stop-color="rgb(0,0,255)" />','<stop offset="83.333%" stop-color="rgb(255,0,255)" />','<stop offset="100%" stop-color="rgb(255,0,0)" />',"</linearGradient>","</defs>",'<rect width="18px" height="100%" fill="url(#g)"></rect>','<path transform="translate(-6,-3)" class="{{cssPrefix}}huebar-handle" d="M0 0 L4 4 L0 8 L0 0 Z" fill="black" stroke="none" />',"</svg>"].join("\n"),l=['<div class="{{cssPrefix}}vml-huebar">','<v:rect strokecolor="#ccc" class="{{cssPrefix}}vml {{cssPrefix}}vml-huebar-bg">','<v:fill type="gradient" method="none" colors="0% rgb(255,0,0), 16.666% rgb(255,255,0), 33.333% rgb(0,255,0), 50% rgb(0,255,255), 66.666% rgb(0,0,255), 83.333% rgb(255,0,255), 100% rgb(255,0,0)" angle="180" class="{{cssPrefix}}vml" />',"</v:rect>",'<v:shape class="{{cssPrefix}}vml {{cssPrefix}}huebar-handle" coordsize="1 1" style="width:1px;height:1px;position:absolute;z-index:1;right:22px;top:-3px;"path="m 0,0 l 4,4 l 0,8 l 0,0 z" filled="true" fillcolor="black" stroked="false" />',"</div>"].join("\n"),a=o.browser.msie&&o.browser.version<9;a&&e.document.namespaces.add("v","urn:schemas-microsoft-com:vml"),t.exports={layout:n,slider:a?r:i,huebar:a?l:s}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[1]);/******/ (function(modules) { // webpackBootstrap
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

	'use strict';

	var _editor = __webpack_require__(1);

	var _editor2 = _interopRequireDefault(_editor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	/**
	 * @fileoverview entry point
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	// codemirror modes&addons
	__webpack_require__(90);
	__webpack_require__(91);
	__webpack_require__(92);
	__webpack_require__(93);
	__webpack_require__(94);

	// default extensions
	__webpack_require__(95);
	__webpack_require__(96);
	__webpack_require__(99);
	__webpack_require__(100);

	window.tui = window.tui || {};
	window.tui.Editor = _editor2.default;

	// langs
	__webpack_require__(107);
	__webpack_require__(108);
	__webpack_require__(109);
	__webpack_require__(110);
	__webpack_require__(111);

	// for jquery
	$.fn.tuiEditor = function () {
	    var options = void 0,
	        instance = void 0;

	    var el = this[0];

	    if (el) {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        options = args[0] || {};

	        instance = $.data(el, 'tuiEditor');

	        if (instance) {
	            if (typeof options === 'string') {
	                var _instance;

	                return (_instance = instance)[options].apply(_instance, _toConsumableArray(args.slice(1)));
	            }
	        } else {
	            options.el = el;
	            instance = _editor2.default.factory(options);
	            $.data(el, 'tuiEditor', instance);
	        }
	    }

	    return this;
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	// markdown commands


	// wysiwyg Commands


	var _markdownEditor = __webpack_require__(2);

	var _markdownEditor2 = _interopRequireDefault(_markdownEditor);

	var _preview = __webpack_require__(5);

	var _preview2 = _interopRequireDefault(_preview);

	var _wysiwygEditor = __webpack_require__(7);

	var _wysiwygEditor2 = _interopRequireDefault(_wysiwygEditor);

	var _layout = __webpack_require__(22);

	var _layout2 = _interopRequireDefault(_layout);

	var _eventManager = __webpack_require__(23);

	var _eventManager2 = _interopRequireDefault(_eventManager);

	var _commandManager2 = __webpack_require__(24);

	var _commandManager3 = _interopRequireDefault(_commandManager2);

	var _extManager = __webpack_require__(26);

	var _extManager2 = _interopRequireDefault(_extManager);

	var _importManager = __webpack_require__(27);

	var _importManager2 = _interopRequireDefault(_importManager);

	var _convertor = __webpack_require__(30);

	var _convertor2 = _interopRequireDefault(_convertor);

	var _viewOnly = __webpack_require__(37);

	var _viewOnly2 = _interopRequireDefault(_viewOnly);

	var _defaultUI = __webpack_require__(38);

	var _defaultUI2 = _interopRequireDefault(_defaultUI);

	var _i18n = __webpack_require__(29);

	var _i18n2 = _interopRequireDefault(_i18n);

	var _bold = __webpack_require__(52);

	var _bold2 = _interopRequireDefault(_bold);

	var _italic = __webpack_require__(53);

	var _italic2 = _interopRequireDefault(_italic);

	var _strike = __webpack_require__(54);

	var _strike2 = _interopRequireDefault(_strike);

	var _blockquote = __webpack_require__(55);

	var _blockquote2 = _interopRequireDefault(_blockquote);

	var _heading = __webpack_require__(56);

	var _heading2 = _interopRequireDefault(_heading);

	var _paragraph = __webpack_require__(57);

	var _paragraph2 = _interopRequireDefault(_paragraph);

	var _hr = __webpack_require__(58);

	var _hr2 = _interopRequireDefault(_hr);

	var _addLink = __webpack_require__(59);

	var _addLink2 = _interopRequireDefault(_addLink);

	var _addImage = __webpack_require__(60);

	var _addImage2 = _interopRequireDefault(_addImage);

	var _ul = __webpack_require__(61);

	var _ul2 = _interopRequireDefault(_ul);

	var _ol = __webpack_require__(62);

	var _ol2 = _interopRequireDefault(_ol);

	var _table = __webpack_require__(63);

	var _table2 = _interopRequireDefault(_table);

	var _task = __webpack_require__(64);

	var _task2 = _interopRequireDefault(_task);

	var _code = __webpack_require__(65);

	var _code2 = _interopRequireDefault(_code);

	var _codeBlock = __webpack_require__(66);

	var _codeBlock2 = _interopRequireDefault(_codeBlock);

	var _bold3 = __webpack_require__(67);

	var _bold4 = _interopRequireDefault(_bold3);

	var _italic3 = __webpack_require__(68);

	var _italic4 = _interopRequireDefault(_italic3);

	var _strike3 = __webpack_require__(69);

	var _strike4 = _interopRequireDefault(_strike3);

	var _blockquote3 = __webpack_require__(70);

	var _blockquote4 = _interopRequireDefault(_blockquote3);

	var _addImage3 = __webpack_require__(71);

	var _addImage4 = _interopRequireDefault(_addImage3);

	var _addLink3 = __webpack_require__(72);

	var _addLink4 = _interopRequireDefault(_addLink3);

	var _hr3 = __webpack_require__(73);

	var _hr4 = _interopRequireDefault(_hr3);

	var _heading3 = __webpack_require__(74);

	var _heading4 = _interopRequireDefault(_heading3);

	var _paragraph3 = __webpack_require__(75);

	var _paragraph4 = _interopRequireDefault(_paragraph3);

	var _ul3 = __webpack_require__(76);

	var _ul4 = _interopRequireDefault(_ul3);

	var _ol3 = __webpack_require__(77);

	var _ol4 = _interopRequireDefault(_ol3);

	var _table3 = __webpack_require__(78);

	var _table4 = _interopRequireDefault(_table3);

	var _tableAddRow = __webpack_require__(79);

	var _tableAddRow2 = _interopRequireDefault(_tableAddRow);

	var _tableAddCol = __webpack_require__(80);

	var _tableAddCol2 = _interopRequireDefault(_tableAddCol);

	var _tableRemoveRow = __webpack_require__(81);

	var _tableRemoveRow2 = _interopRequireDefault(_tableRemoveRow);

	var _tableRemoveCol = __webpack_require__(82);

	var _tableRemoveCol2 = _interopRequireDefault(_tableRemoveCol);

	var _tableAlignCol = __webpack_require__(83);

	var _tableAlignCol2 = _interopRequireDefault(_tableAlignCol);

	var _tableRemove = __webpack_require__(84);

	var _tableRemove2 = _interopRequireDefault(_tableRemove);

	var _increaseDepth = __webpack_require__(85);

	var _increaseDepth2 = _interopRequireDefault(_increaseDepth);

	var _decreaseDepth = __webpack_require__(86);

	var _decreaseDepth2 = _interopRequireDefault(_decreaseDepth);

	var _task3 = __webpack_require__(87);

	var _task4 = _interopRequireDefault(_task3);

	var _code3 = __webpack_require__(88);

	var _code4 = _interopRequireDefault(_code3);

	var _codeBlock3 = __webpack_require__(89);

	var _codeBlock4 = _interopRequireDefault(_codeBlock3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
	    * @param {string} language language
	    * @param {boolean} useDefaultHTMLSanitizer use default htmlSanitizer
	 */

	var ToastUIEditor = function () {
	    function ToastUIEditor(options) {
	        _classCallCheck(this, ToastUIEditor);

	        var self = this;

	        this.options = $.extend({
	            'previewStyle': 'tab',
	            'initialEditType': 'markdown',
	            'height': 300,
	            'language': 'en_US',
	            'useDefaultHTMLSanitizer': true
	        }, options);

	        this.eventManager = new _eventManager2.default();

	        this.importManager = new _importManager2.default(this.eventManager);

	        this.commandManager = new _commandManager3.default(this);
	        this.convertor = new _convertor2.default(this.eventManager);

	        if (this.options.useDefaultHTMLSanitizer) {
	            this.convertor.initHtmlSanitizer();
	        }

	        if (this.options.hooks) {
	            util.forEach(this.options.hooks, function (fn, key) {
	                self.addHook(key, fn);
	            });
	        }

	        if (this.options.events) {
	            util.forEach(this.options.events, function (fn, key) {
	                self.on(key, fn);
	            });
	        }

	        this.layout = new _layout2.default(options, this.eventManager);

	        this.i18n = _i18n2.default;
	        this.i18n.setCode(this.options.language);

	        this.setUI(this.options.UI || new _defaultUI2.default(this));

	        this.mdEditor = new _markdownEditor2.default(this.layout.getMdEditorContainerEl(), this.eventManager);
	        this.preview = new _preview2.default(this.layout.getPreviewEl(), this.eventManager, this.convertor);
	        this.wwEditor = _wysiwygEditor2.default.factory(this.layout.getWwEditorContainerEl(), this.eventManager);

	        this.changePreviewStyle(this.options.previewStyle);

	        this.mdEditor.init();

	        this.changeMode(self.options.initialEditType, true);

	        this.contentHeight(self.options.height);

	        this.setValue(self.options.initialValue);

	        _extManager2.default.applyExtension(self, self.options.exts);

	        this.eventManager.emit('load', self);

	        __nedInstance.push(this);
	    }

	    /**
	     * 프리뷰가 보여지는 방식을 변경한다
	     * @api
	     * @memberOf ToastUIEditor
	     * @param {string} style 스타일 이름 tab, vertical
	     */


	    _createClass(ToastUIEditor, [{
	        key: 'changePreviewStyle',
	        value: function changePreviewStyle(style) {
	            this.layout.changePreviewStyle(style);
	            this.mdPreviewStyle = style;
	            this.eventManager.emit('changePreviewStyle', style);
	            this.eventManager.emit('previewNeedsRefresh');
	        }

	        /**
	         * call commandManager's exec method
	         * @api
	         * @memberOf ToastUIEditor
	         */

	    }, {
	        key: 'exec',
	        value: function exec() {
	            var _commandManager;

	            (_commandManager = this.commandManager).exec.apply(_commandManager, arguments);
	        }
	    }, {
	        key: 'addCommand',
	        value: function addCommand(type, props) {
	            if (!props) {
	                this.commandManager.addCommand(type);
	            } else {
	                this.commandManager.addCommand(_commandManager3.default.command(type, props));
	            }
	        }

	        /**
	         * Bind eventHandler to event type
	         * @api
	         * @memberOf ToastUIEditor
	         * @param {string} type Event type
	         * @param {function} handler Event handler
	         */

	    }, {
	        key: 'on',
	        value: function on(type, handler) {
	            this.eventManager.listen(type, handler);
	        }

	        /**
	         * Unbind eventHandler from event type
	         * @api
	         * @memberOf ToastUIEditor
	         * @param {string} type Event type
	         */

	    }, {
	        key: 'off',
	        value: function off(type) {
	            this.eventManager.removeEventHandler(type);
	        }

	        /**
	         * Add hook to TUIEditor event
	         * @api
	         * @memberOf ToastUIEditor
	         * @param {string} type Event type
	         * @param {function} handler Event handler
	         */

	    }, {
	        key: 'addHook',
	        value: function addHook(type, handler) {
	            this.eventManager.removeEventHandler(type);
	            this.eventManager.listen(type, handler);
	        }

	        /**
	         * Remove hook from TUIEditor event
	         * @api
	         * @memberOf ToastUIEditor
	         * @param {string} type Event type
	         */

	    }, {
	        key: 'removeHook',
	        value: function removeHook(type) {
	            this.eventManager.removeEventHandler(type);
	        }

	        /**
	         * Get CodeMirror instance
	         * @api
	         * @memberOf ToastUIEditor
	         * @returns {CodeMirror}
	         */

	    }, {
	        key: 'getCodeMirror',
	        value: function getCodeMirror() {
	            return this.mdEditor.getEditor();
	        }

	        /**
	         * Get SquireExt instance
	         * @api
	         * @memberOf ToastUIEditor
	         * @returns {SquireExt}
	         */

	    }, {
	        key: 'getSquire',
	        value: function getSquire() {
	            return this.wwEditor.getEditor();
	        }

	        /**
	         * Set focus to current Editor
	         * @api
	         * @memberOf ToastUIEditor
	         */

	    }, {
	        key: 'focus',
	        value: function focus() {
	            this.getCurrentModeEditor().focus();
	        }

	        /**
	         * Remove focus of current Editor
	         * @api
	         * @memberOf ToastUIEditor
	         */

	    }, {
	        key: 'blur',
	        value: function blur() {
	            this.getCurrentModeEditor().blur();
	        }

	        /**
	         * Set cursor position to end
	         * @api
	         * @memberOf ToastUIEditor
	         */

	    }, {
	        key: 'moveCursorToEnd',
	        value: function moveCursorToEnd() {
	            this.getCurrentModeEditor().moveCursorToEnd();
	        }

	        /**
	         * Set cursor position to start
	         * @api
	         * @memberOf ToastUIEditor
	         */

	    }, {
	        key: 'moveCursorToStart',
	        value: function moveCursorToStart() {
	            this.getCurrentModeEditor().moveCursorToStart();
	        }

	        /**
	         * Set Editor value
	         * @api
	         * @memberOf ToastUIEditor
	         * @param {string} markdown Markdown syntax text
	         */

	    }, {
	        key: 'setValue',
	        value: function setValue(markdown) {
	            markdown = markdown || '';

	            if (this.isMarkdownMode()) {
	                this.mdEditor.setValue(markdown);
	            } else {
	                this.wwEditor.setValue(this.convertor.toHTML(markdown));
	            }

	            this.eventManager.emit('setValueAfter', markdown);
	        }

	        /**
	         * Get editor value
	         * @api
	         * @memberOf ToastUIEditor
	         * @returns {string}
	         */

	    }, {
	        key: 'getValue',
	        value: function getValue() {
	            var markdown = void 0;

	            if (this.isMarkdownMode()) {
	                markdown = this.mdEditor.getValue();
	            } else {
	                markdown = this.convertor.toMarkdown(this.wwEditor.getValue());
	            }

	            return markdown;
	        }

	        /**
	         * Add widget to selection
	         * @api
	         * @memberOf ToastUIEditor
	         * @param {Range} selection Current selection
	         * @param {Node} node widget node
	         * @param {string} style Adding style "over" or "bottom"
	         * @param {number} [offset] Offset for adjust position
	         */

	    }, {
	        key: 'addWidget',
	        value: function addWidget(selection, node, style, offset) {
	            this.getCurrentModeEditor().addWidget(selection, node, style, offset);
	        }

	        /**
	         * Set and return content area height
	         * @api
	         * @memberOf ToastUIEditor
	         * @param {number} height Content area height
	         * @returns {number}
	         */

	    }, {
	        key: 'contentHeight',
	        value: function contentHeight(height) {
	            if (height) {
	                this._contentHeight = height;
	                this.mdEditor.setHeight(height);
	                this.preview.setHeight(height);
	                this.wwEditor.setHeight(height);
	            }

	            return this._contentHeight;
	        }

	        /**
	         * Get current editor mode name
	         * @api
	         * @memberOf ToastUIEditor
	         * @returns {string}
	         */

	    }, {
	        key: 'getCurrentModeEditor',
	        value: function getCurrentModeEditor() {
	            var editor = void 0;

	            if (this.isMarkdownMode()) {
	                editor = this.mdEditor;
	            } else {
	                editor = this.wwEditor;
	            }

	            return editor;
	        }

	        /**
	         * Return true if current editor mode is Markdown
	         * @api
	         * @memberOf ToastUIEditor
	         * @returns {boolean}
	         */

	    }, {
	        key: 'isMarkdownMode',
	        value: function isMarkdownMode() {
	            return this.currentMode === 'markdown';
	        }

	        /**
	         * Return true if current editor mode is WYSIWYG
	         * @api
	         * @memberOf ToastUIEditor
	         * @returns {boolean}
	         */

	    }, {
	        key: 'isWysiwygMode',
	        value: function isWysiwygMode() {
	            return this.currentMode === 'wysiwyg';
	        }

	        /**
	         * Return false
	         * @api
	         * @memberOf ToastUIEditor
	         * @returns {boolean}
	         */

	    }, {
	        key: 'isViewOnly',
	        value: function isViewOnly() {
	            return false;
	        }

	        /**
	         * Get current Markdown editor's preview style
	         * @api
	         * @memberOf ToastUIEditor
	         * @returns {string}
	         */

	    }, {
	        key: 'getCurrentPreviewStyle',
	        value: function getCurrentPreviewStyle() {
	            return this.mdPreviewStyle;
	        }

	        /**
	         * Change editor's mode to given mode string
	         * @api
	         * @memberOf ToastUIEditor
	         * @param {string} mode Editor mode name of want to change
	         * @param {boolean} isWithoutFocus Change mode without focus
	         */

	    }, {
	        key: 'changeMode',
	        value: function changeMode(mode, isWithoutFocus) {
	            if (this.currentMode === mode) {
	                return;
	            }

	            this.eventManager.emit('changeModeBefore', this.currentMode);

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

	            if (!isWithoutFocus) {
	                this.focus();
	            }
	        }

	        /**
	         * Remove TUIEditor from document
	         * @api
	         * @memberOf ToastUIEditor
	         */

	    }, {
	        key: 'remove',
	        value: function remove() {
	            var self = this;
	            var i = __nedInstance.length - 1;
	            this.wwEditor.remove();
	            this.mdEditor.remove();
	            this.layout.remove();

	            if (this.getUI()) {
	                this.getUI().remove();
	            }

	            this.eventManager.emit('removeEditor');
	            this.eventManager.events.forEach(function (value, key) {
	                self.off(key);
	            });
	            this.eventManager = null;

	            for (; i >= 0; i -= 1) {
	                if (__nedInstance[i] === this) {
	                    __nedInstance.splice(i, 1);
	                }
	            }
	        }

	        /**
	         * Hide TUIEditor
	         * @api
	         * @memberOf ToastUIEditor
	         */

	    }, {
	        key: 'hide',
	        value: function hide() {
	            this.eventManager.emit('hide', this);
	        }

	        /**
	         * Show TUIEditor
	         * @api
	         * @memberOf ToastUIEditor
	         */

	    }, {
	        key: 'show',
	        value: function show() {
	            this.eventManager.emit('show', this);
	            this.getCodeMirror().refresh();
	        }

	        /**
	         * Scroll Editor content to Top
	         * @api
	         * @memberOf ToastUIEditor
	         * @param {number} value Scroll amount
	         * @returns {number}
	         */

	    }, {
	        key: 'scrollTop',
	        value: function scrollTop(value) {
	            return this.getCurrentModeEditor().scrollTop(value);
	        }

	        /**
	         * Set UI to private UI property
	         * @api
	         * @memberOf ToastUIEditor
	         * @param {UI} UI UI instance
	         */

	    }, {
	        key: 'setUI',
	        value: function setUI(UI) {
	            this._ui = UI;
	        }

	        /**
	         * Get _ui property
	         * @api
	         * @memberOf ToastUIEditor
	         * @returns {UI}
	         */

	    }, {
	        key: 'getUI',
	        value: function getUI() {
	            return this._ui;
	        }

	        /**
	         * Reset TUIEditor
	         * @api
	         * @memberOf ToastUIEditor
	         */

	    }, {
	        key: 'reset',
	        value: function reset() {
	            this.wwEditor.reset();
	            this.mdEditor.reset();
	        }

	        /**
	         * Get current range
	         * @api
	         * @memberOf ToastUIEditor
	         * @returns {{start, end}|Range}
	         */

	    }, {
	        key: 'getRange',
	        value: function getRange() {
	            return this.getCurrentModeEditor().getRange();
	        }

	        /**
	         * Get text object of current range
	         * @api
	         * @memberOf ToastUIEditor
	         * @param {{start, end}|Range} range Range object of each editor
	         * @returns {object} TextObject class
	         */

	    }, {
	        key: 'getTextObject',
	        value: function getTextObject(range) {
	            return this.getCurrentModeEditor().getTextObject(range);
	        }

	        /**
	         * Get instance of TUIEditor
	         * @api
	         * @memberOf ToastUIEditor
	         * @returns {Array}
	         */

	    }], [{
	        key: 'getInstances',
	        value: function getInstances() {
	            return __nedInstance;
	        }

	        /**
	         * Define extension
	         * @api
	         * @memberOf ToastUIEditor
	         * @param {string} name Extension name
	         * @param {ExtManager~extension} ext extension
	         */

	    }, {
	        key: 'defineExtension',
	        value: function defineExtension(name, ext) {
	            _extManager2.default.defineExtension(name, ext);
	        }

	        /**
	         * Factory method for Editor
	         * @api
	         * @memberOf ToastUIEditor
	         * @param {object} options Option for initialize TUIEditor
	         * @returns {ToastUIEditor}
	         */

	    }, {
	        key: 'factory',
	        value: function factory(options) {
	            var tuiEditor = void 0;

	            if (options.viewOnly) {
	                tuiEditor = new _viewOnly2.default(options);
	            } else {
	                tuiEditor = new ToastUIEditor(options);

	                tuiEditor.addCommand(_bold2.default);
	                tuiEditor.addCommand(_italic2.default);
	                tuiEditor.addCommand(_blockquote2.default);
	                tuiEditor.addCommand(_heading2.default);
	                tuiEditor.addCommand(_paragraph2.default);
	                tuiEditor.addCommand(_hr2.default);
	                tuiEditor.addCommand(_addLink2.default);
	                tuiEditor.addCommand(_addImage2.default);
	                tuiEditor.addCommand(_ul2.default);
	                tuiEditor.addCommand(_ol2.default);
	                tuiEditor.addCommand(_table2.default);
	                tuiEditor.addCommand(_task2.default);
	                tuiEditor.addCommand(_code2.default);
	                tuiEditor.addCommand(_codeBlock2.default);
	                tuiEditor.addCommand(_strike2.default);

	                tuiEditor.addCommand(_bold4.default);
	                tuiEditor.addCommand(_italic4.default);
	                tuiEditor.addCommand(_blockquote4.default);
	                tuiEditor.addCommand(_ul4.default);
	                tuiEditor.addCommand(_ol4.default);
	                tuiEditor.addCommand(_addImage4.default);
	                tuiEditor.addCommand(_addLink4.default);
	                tuiEditor.addCommand(_hr4.default);
	                tuiEditor.addCommand(_heading4.default);
	                tuiEditor.addCommand(_paragraph4.default);
	                tuiEditor.addCommand(_increaseDepth2.default);
	                tuiEditor.addCommand(_decreaseDepth2.default);
	                tuiEditor.addCommand(_task4.default);
	                tuiEditor.addCommand(_table4.default);
	                tuiEditor.addCommand(_tableAddRow2.default);
	                tuiEditor.addCommand(_tableAddCol2.default);
	                tuiEditor.addCommand(_tableRemoveRow2.default);
	                tuiEditor.addCommand(_tableRemoveCol2.default);
	                tuiEditor.addCommand(_tableAlignCol2.default);
	                tuiEditor.addCommand(_tableRemove2.default);
	                tuiEditor.addCommand(_code4.default);
	                tuiEditor.addCommand(_codeBlock4.default);
	                tuiEditor.addCommand(_strike4.default);
	            }

	            return tuiEditor;
	        }
	    }]);

	    return ToastUIEditor;
	}();

	/**
	 * Export i18n instance
	 * @type {I18n}
	 */


	ToastUIEditor.i18n = _i18n2.default;

	/**
	 * MarkdownIt custom renderer with code highlighting
	 */
	ToastUIEditor.markdownItRenderer = _convertor2.default.getMarkdownHighlightRenderer();

	module.exports = ToastUIEditor;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _keyMapper = __webpack_require__(3);

	var _keyMapper2 = _interopRequireDefault(_keyMapper);

	var _mdTextObject = __webpack_require__(4);

	var _mdTextObject2 = _interopRequireDefault(_mdTextObject);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var CodeMirror = window.CodeMirror;
	var keyMapper = _keyMapper2.default.getSharedInstance();

	/**
	 * MarkdownEditor
	 * @exports MarkdownEditor
	 * @constructor
	 * @class MarkdownEditor
	 * @param {jQuery} $el element to insert editor
	 * @param {EventManager} eventManager EventManager instance
	 */

	var MarkdownEditor = function () {
	    function MarkdownEditor($el, eventManager) {
	        _classCallCheck(this, MarkdownEditor);

	        this.eventManager = eventManager;
	        this.$editorContainerEl = $el;

	        /**
	         * latest state info
	         * @type {object}
	         */
	        this._latestState = null;
	    }

	    /**
	     * init
	     * @api
	     * @memberOf WysiwygEditor
	     * @param {string} initialValue Editor's initial content
	     */


	    _createClass(MarkdownEditor, [{
	        key: 'init',
	        value: function init(initialValue) {
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
	                    'Shift-Tab': 'indentLess',
	                    'Alt-Up': 'replaceLineTextToUpper',
	                    'Alt-Down': 'replaceLineTextToLower'
	                },
	                indentUnit: 4
	            });

	            this._initEvent();
	        }

	        /**
	         * _initEvent
	         * Initialize EventManager event handler
	         * @memberOf MarkdownEditor
	         * @private
	         */

	    }, {
	        key: '_initEvent',
	        value: function _initEvent() {
	            var _this = this;

	            this.cm.getWrapperElement().addEventListener('click', function () {
	                _this.eventManager.emit('click', {
	                    source: 'markdown'
	                });
	            });

	            this.cm.on('beforeChange', function (cm, ev) {
	                if (ev.origin === 'paste') {
	                    _this.eventManager.emit('pasteBefore', {
	                        source: 'markdown',
	                        data: ev
	                    });
	                }
	            });

	            this.cm.on('change', function (cm, cmEvent) {
	                _this._emitMarkdownEditorContentChangedEvent();
	                _this._emitMarkdownEditorChangeEvent(cmEvent);
	            });

	            this.cm.on('focus', function () {
	                _this.eventManager.emit('focus', {
	                    source: 'markdown'
	                });
	                _this.getEditor().refresh();
	            });

	            this.cm.on('blur', function () {
	                _this.eventManager.emit('blur', {
	                    source: 'markdown'
	                });
	            });

	            this.cm.on('scroll', function (cm, eventData) {
	                _this.eventManager.emit('scroll', {
	                    source: 'markdown',
	                    data: eventData
	                });
	            });

	            this.cm.on('keydown', function (cm, keyboardEvent) {
	                _this.eventManager.emit('keydown', {
	                    source: 'markdown',
	                    data: keyboardEvent
	                });

	                _this.eventManager.emit('keyMap', {
	                    source: 'markdown',
	                    keyMap: keyMapper.convert(keyboardEvent),
	                    data: keyboardEvent
	                });
	            });

	            this.cm.on('keyup', function (cm, keyboardEvent) {
	                _this.eventManager.emit('keyup', {
	                    source: 'markdown',
	                    data: keyboardEvent
	                });
	            });

	            this.cm.on('copy', function (cm, ev) {
	                _this.eventManager.emit('copy', {
	                    source: 'markdown',
	                    data: ev
	                });
	            });

	            this.cm.on('cut', function (cm, ev) {
	                _this.eventManager.emit('cut', {
	                    source: 'markdown',
	                    data: ev
	                });
	            });

	            this.cm.on('paste', function (cm, clipboardEvent) {
	                _this.eventManager.emit('paste', {
	                    source: 'markdown',
	                    data: clipboardEvent
	                });
	            });

	            this.cm.on('drop', function (cm, eventData) {
	                eventData.preventDefault();

	                _this.eventManager.emit('drop', {
	                    source: 'markdown',
	                    data: eventData
	                });
	            });

	            this.cm.on('cursorActivity', function () {
	                var token = _this.cm.getTokenAt(_this.cm.getCursor());

	                var base = token.state.base;
	                var overlay = token.state.overlay;

	                var state = {
	                    bold: !!base.strong,
	                    italic: !!base.em,
	                    code: !!overlay.code,
	                    codeBlock: !!overlay.codeBlock,
	                    quote: !!base.quote,
	                    list: !!base.list,
	                    task: !!base.task,
	                    source: 'markdown'
	                };

	                if (!_this._latestState || _this._isStateChanged(_this._latestState, state)) {
	                    _this.eventManager.emit('stateChange', state);
	                    _this._latestState = state;
	                }
	            });
	        }

	        /**
	         * getCurrentRange
	         * returns current selection's range
	         * @api
	         * @memberOf MarkdownEditor
	         * @returns {object} selection range
	         */

	    }, {
	        key: 'getCurrentRange',
	        value: function getCurrentRange() {
	            var from = this.cm.getCursor('from'),
	                to = this.cm.getCursor('to');

	            return {
	                from: from,
	                to: to,
	                collapsed: from === to
	            };
	        }

	        /**
	         * Set focus to current Editor
	         * @api
	         * @memberOf MarkdownEditor
	         */

	    }, {
	        key: 'focus',
	        value: function focus() {
	            this.cm.focus();
	        }

	        /**
	         * Set focus to current Editor
	         * @api
	         * @memberOf MarkdownEditor
	         */

	    }, {
	        key: 'blur',
	        value: function blur() {
	            this.cm.getInputField().blur();
	        }

	        /**
	         * Remove Editor from document
	         * @api
	         * @memberOf MarkdownEditor
	         */

	    }, {
	        key: 'remove',
	        value: function remove() {
	            this.cm.toTextArea();
	        }

	        /**
	         * Set Editor value
	         * @api
	         * @memberOf MarkdownEditor
	         * @param {string} markdown Markdown syntax text
	         */

	    }, {
	        key: 'setValue',
	        value: function setValue(markdown) {
	            this.getEditor().setValue(markdown);
	            this._emitMarkdownEditorContentChangedEvent();
	            this.moveCursorToEnd();
	            this.getEditor().refresh();
	        }

	        /**
	         * Get editor value
	         * @api
	         * @memberOf MarkdownEditor
	         * @returns {string}
	         */

	    }, {
	        key: 'getValue',
	        value: function getValue() {
	            return this.cm.getValue('\n');
	        }

	        /**
	         * Get CodeMirror instance
	         * @api
	         * @memberOf MarkdownEditor
	         * @returns {CodeMirror}
	         */

	    }, {
	        key: 'getEditor',
	        value: function getEditor() {
	            return this.cm;
	        }

	        /**
	         * Reset Editor
	         * @api
	         * @memberOf MarkdownEditor
	         */

	    }, {
	        key: 'reset',
	        value: function reset() {
	            this.setValue('');
	        }

	        /**
	         * Emit contentChangedFromMarkdown event
	         * @memberOf MarkdownEditor
	         * @private
	         */

	    }, {
	        key: '_emitMarkdownEditorContentChangedEvent',
	        value: function _emitMarkdownEditorContentChangedEvent() {
	            this.eventManager.emit('contentChangedFromMarkdown', this);
	        }

	        /**
	         * Clone CodeMirror event object
	         * @memberOf MarkdownEditor
	         * @param {event} e Event object
	         * @returns {{from: {line: number, ch: number}, to: {line: number, ch: number}}}
	         * @private
	         */

	    }, {
	        key: '_cloneCMEventObject',
	        value: function _cloneCMEventObject(e) {
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
	        }

	        /**
	         * Emit changeEvent
	         * @memberOf MarkdownEditor
	         * @param {event} e Event object
	         * @private
	         */

	    }, {
	        key: '_emitMarkdownEditorChangeEvent',
	        value: function _emitMarkdownEditorChangeEvent(e) {
	            if (e.origin !== 'setValue') {
	                var eventObj = {
	                    source: 'markdown'
	                };

	                this.eventManager.emit('changeFromMarkdown', eventObj);
	                this.eventManager.emit('change', eventObj);
	            }
	        }

	        /**
	         * Get current caret position
	         * @api
	         * @memberOf MarkdownEditor
	         * @returns {{from: {line: number, ch: number}, to: {line: number, ch: number}}}
	         */

	    }, {
	        key: 'getCaretPosition',
	        value: function getCaretPosition() {
	            return this.cm.cursorCoords();
	        }

	        /**
	         * Add widget
	         * @api
	         * @memberOf MarkdownEditor
	         * @param {object} selection Selection object
	         * @param {HTMLElement} node Widget node
	         * @param {string} style Adding style "over" or "bottom"
	         * @param {number} offset Adding offset
	         */

	    }, {
	        key: 'addWidget',
	        value: function addWidget(selection, node, style, offset) {
	            if (offset) {
	                selection.ch += offset;
	            }

	            this.cm.addWidget(selection.end, node, true, style);
	        }

	        /**
	         * Replace selection with given replacement content
	         * @api
	         * @memberOf MarkdownEditor
	         * @param {string} content Replacement content text
	         * @param {object} selection Selection object
	         */

	    }, {
	        key: 'replaceSelection',
	        value: function replaceSelection(content, selection) {
	            if (selection) {
	                this.cm.setSelection(selection.from, selection.to);
	            }

	            this.cm.replaceSelection(content);
	            this.focus();
	        }

	        /**
	         * Replace selection with replacement content and offset
	         * @api
	         * @memberOf MarkdownEditor
	         * @param {string} content Replacement content text
	         * @param {number} offset Offset
	         * @param {number} overwriteLength Length to overwrite
	         */

	    }, {
	        key: 'replaceRelativeOffset',
	        value: function replaceRelativeOffset(content, offset, overwriteLength) {
	            var cursor = this.cm.getCursor(),
	                selection = {
	                from: {
	                    line: cursor.line,
	                    ch: cursor.ch + offset
	                },
	                to: {
	                    line: cursor.line,
	                    ch: cursor.ch + offset + overwriteLength
	                }
	            };

	            this.replaceSelection(content, selection);
	        }

	        /**
	         * Set Editor height
	         * @api
	         * @memberOf MarkdownEditor
	         * @param {number} height Editor height
	         */

	    }, {
	        key: 'setHeight',
	        value: function setHeight(height) {
	            this.$editorContainerEl.height(height);

	            if (height === 'auto') {
	                this.$editorContainerEl.find('.CodeMirror').height('auto');
	            }
	        }

	        /**
	         * Set cursor position to end
	         * @api
	         * @memberOf MarkdownEditor
	         */

	    }, {
	        key: 'moveCursorToEnd',
	        value: function moveCursorToEnd() {
	            var doc = this.getEditor().getDoc(),
	                lastLine = doc.lastLine();

	            doc.setCursor(lastLine, doc.getLine(lastLine).length);
	        }

	        /**
	         * Set cursor position to start
	         * @api
	         * @memberOf MarkdownEditor
	         */

	    }, {
	        key: 'moveCursorToStart',
	        value: function moveCursorToStart() {
	            var doc = this.getEditor().getDoc(),
	                firstLine = doc.firstLine();

	            doc.setCursor(firstLine, 0);
	        }

	        /**
	         * Scroll Editor content to Top
	         * @api
	         * @memberOf MarkdownEditor
	         * @param {number} value Scroll amount
	         * @returns {number}
	         */

	    }, {
	        key: 'scrollTop',
	        value: function scrollTop(value) {
	            if (value) {
	                this.cm.scrollTo(0, value);
	            }

	            return this.cm.getScrollInfo().top;
	        }

	        /**
	         * Get start, end position of current selection
	         * @api
	         * @memberOf MarkdownEditor
	         * @returns {{start: {line: *, ch: *}, end: {line: *, ch: *}}}
	         */

	    }, {
	        key: 'getRange',
	        value: function getRange() {
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
	        }

	        /**
	         * Get text object of current range
	         * @api
	         * @memberOf MarkdownEditor
	         * @param {{start, end}} range Range object of each editor
	         * @returns {object}
	         */

	    }, {
	        key: 'getTextObject',
	        value: function getTextObject(range) {
	            return new _mdTextObject2.default(this, range);
	        }

	        /**
	         * Return whether state changed or not
	         * @memberOf MarkdownEditor
	         * @param {object} previousState Previous state
	         * @param {object} currentState Current state
	         * @returns {boolean}
	         * @private
	         */

	    }, {
	        key: '_isStateChanged',
	        value: function _isStateChanged(previousState, currentState) {
	            var result = false;

	            tui.util.forEach(currentState, function (currentStateTypeValue, stateType) {
	                result = previousState[stateType] !== currentStateTypeValue;

	                return !result;
	            });

	            return result;
	        }
	    }]);

	    return MarkdownEditor;
	}();

	module.exports = MarkdownEditor;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @fileoverview Implements KeyMapper
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	/**
	 * Constant of key mapping
	 * @type {string[]}
	 */
	var KEYBOARD_MAP = ['', // [0]
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

	var sharedInstance = void 0;

	/**
	 * KeyMapper
	 * @exports KeyMapper
	 * @constructor
	 * @class KeyMapper
	 * @param {object} [options] options
	 *    @param {string} options.splitter splitter string default is +
	 */

	var KeyMapper = function () {
	    function KeyMapper(options) {
	        _classCallCheck(this, KeyMapper);

	        this._setSplitter(options);
	    }

	    /**
	     * Set key splitter
	     * @param {object} options Option object
	     * @memberOf KeyMapper
	     * @private
	     */


	    _createClass(KeyMapper, [{
	        key: '_setSplitter',
	        value: function _setSplitter(options) {
	            var splitter = options ? options.splitter : '+';
	            this._splitter = splitter;
	        }

	        /**
	         * Convert event to keyMap
	         * @api
	         * @memberOf KeyMapper
	         * @param {event} event Event object
	         * @returns {string}
	         */

	    }, {
	        key: 'convert',
	        value: function convert(event) {
	            var keyMap = [];

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

	            var keyChar = this._getKeyCodeChar(event.keyCode);

	            if (keyChar) {
	                keyMap.push(keyChar);
	            }

	            return keyMap.join(this._splitter);
	        }

	        /**
	         * Get character from key code
	         * @memberOf KeyMapper
	         * @param {number} keyCode Key code
	         * @returns {string}
	         * @private
	         */

	    }, {
	        key: '_getKeyCodeChar',
	        value: function _getKeyCodeChar(keyCode) {
	            var keyCodeCharacter = KEYBOARD_MAP[keyCode];

	            return keyCodeCharacter;
	        }

	        /**
	         * Get sharedInstance
	         * @api
	         * @memberOf KeyMapper
	         * @returns {KeyMapper}
	         */

	    }], [{
	        key: 'getSharedInstance',
	        value: function getSharedInstance() {
	            if (!sharedInstance) {
	                sharedInstance = new KeyMapper();
	            }

	            return sharedInstance;
	        }
	    }]);

	    return KeyMapper;
	}();

	module.exports = KeyMapper;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @fileoverview Implements markdown textObject
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	/**
	 * Markdown textObject
	 * @exports mdTextObject
	 * @constructor
	 * @class mdTextObject
	 * @param {MarkdownEditor} mde MarkdownEditor instance
	 * @param {object} range range
	 */
	var mdTextObject = function () {
	    function mdTextObject(mde, range) {
	        _classCallCheck(this, mdTextObject);

	        this._mde = mde;

	        this.setRange(range || mde.getRange());
	    }

	    /**
	     * Set start
	     * @memberOf mdTextObject
	     * @param {object} rangeStart Start of range
	     * @private
	     */


	    _createClass(mdTextObject, [{
	        key: '_setStart',
	        value: function _setStart(rangeStart) {
	            this._start = rangeStart;
	        }

	        /**
	         * Set end
	         * @private
	         * @memberOf mdTextObject
	         * @param {object} rangeEnd End of range
	         * @private
	         */

	    }, {
	        key: '_setEnd',
	        value: function _setEnd(rangeEnd) {
	            this._end = rangeEnd;
	        }

	        /**
	         * Set range to given range
	         * @private
	         * @memberOf mdTextObject
	         * @param {object} range Range object
	         */

	    }, {
	        key: 'setRange',
	        value: function setRange(range) {
	            this._setStart(range.start);
	            this._setEnd(range.end);
	        }

	        /**
	         * Set start to end
	         * @private
	         * @memberOf mdTextObject
	         * @param {object} range Range object
	         */

	    }, {
	        key: 'setEndBeforeRange',
	        value: function setEndBeforeRange(range) {
	            this._setEnd(range.start);
	        }

	        /**
	         * Expand startOffset by 1
	         * @private
	         * @memberOf mdTextObject
	         */

	    }, {
	        key: 'expandStartOffset',
	        value: function expandStartOffset() {
	            var start = this._start;

	            if (start.ch !== 0) {
	                start.ch -= 1;
	            }
	        }

	        /**
	         * Expand endOffset by 1
	         * @private
	         * @memberOf mdTextObject
	         */

	    }, {
	        key: 'expandEndOffset',
	        value: function expandEndOffset() {
	            var end = this._end;

	            if (end.ch < this._mde.getEditor().getDoc().getLine(end.line).length) {
	                end.ch += 1;
	            }
	        }

	        /**
	         * Get current selection's text content
	         * @private
	         * @memberOf mdTextObject
	         * @returns {{start: {line: number, ch: number}, end: {line: number, ch: number}}}
	         */

	    }, {
	        key: 'getTextContent',
	        value: function getTextContent() {
	            return this._mde.getEditor().getRange(this._start, this._end);
	        }

	        /**
	         * Replace current selection's content with given text content
	         * @private
	         * @memberOf mdTextObject
	         * @param {string} content Replacement content
	         */

	    }, {
	        key: 'replaceContent',
	        value: function replaceContent(content) {
	            this._mde.getEditor().replaceRange(content, this._start, this._end, '+input');
	        }

	        /**
	         * Delete current selection's content
	         * @private
	         * @memberOf mdTextObject
	         */

	    }, {
	        key: 'deleteContent',
	        value: function deleteContent() {
	            this._mde.getEditor().replaceRange('', this._start, this._end, '+delete');
	        }

	        /**
	         * peek StartBeforeOffset
	         * @private
	         * @memberOf mdTextObject
	         * @param {number} offset Offset
	         * @returns {{start: {line: number, ch: number}, end: {line: number, ch: number}}}
	         */

	    }, {
	        key: 'peekStartBeforeOffset',
	        value: function peekStartBeforeOffset(offset) {
	            var peekStart = {
	                line: this._start.line,
	                ch: Math.max(this._start.ch - offset, 0)
	            };

	            return this._mde.getEditor().getRange(peekStart, this._start);
	        }
	    }]);

	    return mdTextObject;
	}();

	module.exports = mdTextObject;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var LazyRunner = __webpack_require__(6);

	/**
	 * Preview
	 * @exports Preview
	 * @class Preview
	 * @constructor
	 * @param {jQuery} $el Container element for preview
	 * @param {EventManager} eventManager Event manager instance
	 * @param {Convertor} converter Convertor instance
	 **/

	var Preview = function () {
	    function Preview($el, eventManager, converter) {
	        _classCallCheck(this, Preview);

	        this.eventManager = eventManager;
	        this.converter = converter;
	        this.$el = $el;

	        this._initContentSection();

	        this.lazyRunner = new LazyRunner();

	        this.lazyRunner.registerLazyRunFunction('refresh', this.refresh, 800, this);

	        this._initEvent();
	    }

	    /**
	     * Initialize event
	     * @private
	     */


	    _createClass(Preview, [{
	        key: '_initEvent',
	        value: function _initEvent() {
	            var _this = this;

	            var latestMarkdownValue = '';

	            this.eventManager.listen('contentChangedFromMarkdown', function (markdownEditor) {
	                latestMarkdownValue = markdownEditor.getValue();

	                if (_this.isVisible()) {
	                    _this.lazyRunner.run('refresh', markdownEditor.getValue().replace(/<br>\n/g, '<br>'));
	                }
	            });

	            this.eventManager.listen('previewNeedsRefresh', function (value) {
	                _this.refresh(value || latestMarkdownValue);
	            });
	            this.$el.on('scroll', function (event) {
	                _this.eventManager.emit('scroll', {
	                    source: 'preview',
	                    data: event
	                });
	            });
	        }

	        /**
	         * Initialize content selection
	         * @private
	         */

	    }, {
	        key: '_initContentSection',
	        value: function _initContentSection() {
	            this.$previewContent = $('<div class="tui-editor-contents" />');
	            this.$el.append(this.$previewContent);
	        }

	        /**
	         * Refresh rendering
	         * @api
	         * @memberOf Preview
	         * @param {string} markdown Markdown text
	         */

	    }, {
	        key: 'refresh',
	        value: function refresh(markdown) {
	            this.render(this.converter.toHTMLWithCodeHightlight(markdown));
	        }

	        /**
	         * Render HTML on preview
	         * @api
	         * @memberOf Preview
	         * @param {string} html HTML string
	         */

	    }, {
	        key: 'render',
	        value: function render(html) {
	            var finalHtml = html;
	            var processedDataByHook = this.eventManager.emit('previewBeforeHook', html);

	            if (processedDataByHook) {
	                finalHtml = processedDataByHook[0];
	            }

	            this.$previewContent.empty();
	            this.$previewContent.html(finalHtml);

	            this.eventManager.emit('previewRenderAfter', this);
	        }

	        /**
	         * Set preview height
	         * @api
	         * @memberOf Preview
	         * @param {number} height Height for preview container
	         */

	    }, {
	        key: 'setHeight',
	        value: function setHeight(height) {
	            this.$el.height(height);
	        }

	        /**
	         * Is Preview visible
	         * @returns {boolean} result
	         */

	    }, {
	        key: 'isVisible',
	        value: function isVisible() {
	            return this.$el.css('display') !== 'none';
	        }
	    }]);

	    return Preview;
	}();

	module.exports = Preview;

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @fileoverview Implements LazyRunner
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var util = tui.util;

	/**
	 * LazyRunner
	 * @exports LazyRunner
	 * @constructor
	 * @class
	 */

	var LazyRunner = function () {
	    function LazyRunner() {
	        _classCallCheck(this, LazyRunner);

	        this.globalTOID = null;
	        this.lazyRunFunctions = {};
	    }

	    _createClass(LazyRunner, [{
	        key: "run",
	        value: function run(fn, params, context, delay) {
	            var TOID = void 0;

	            if (util.isString(fn)) {
	                TOID = this._runRegisteredRun(fn, params, context, delay);
	            } else {
	                TOID = this._runSingleRun(fn, params, context, delay, this.globalTOID);
	                this.globalTOID = TOID;
	            }

	            return TOID;
	        }
	    }, {
	        key: "registerLazyRunFunction",
	        value: function registerLazyRunFunction(name, fn, delay, context) {
	            context = context || this;

	            this.lazyRunFunctions[name] = {
	                fn: fn,
	                delay: delay,
	                context: context,
	                TOID: null
	            };
	        }
	    }, {
	        key: "_runSingleRun",
	        value: function _runSingleRun(fn, params, context, delay, TOID) {
	            this._clearTOIDIfNeed(TOID);

	            TOID = setTimeout(function () {
	                fn.call(context, params);
	            }, delay);

	            return TOID;
	        }
	    }, {
	        key: "_runRegisteredRun",
	        value: function _runRegisteredRun(lazyRunName, params, context, delay) {
	            var fn = this.lazyRunFunctions[lazyRunName].fn;
	            var TOID = this.lazyRunFunctions[lazyRunName].TOID;
	            delay = delay || this.lazyRunFunctions[lazyRunName].delay;
	            context = context || this.lazyRunFunctions[lazyRunName].context;

	            TOID = this._runSingleRun(fn, params, context, delay, TOID);

	            this.lazyRunFunctions[lazyRunName].TOID = TOID;

	            return TOID;
	        }
	    }, {
	        key: "_clearTOIDIfNeed",
	        value: function _clearTOIDIfNeed(TOID) {
	            if (TOID) {
	                clearTimeout(TOID);
	            }
	        }
	    }]);

	    return LazyRunner;
	}();

	module.exports = LazyRunner;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implments wysiwygEditor
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _domUtils = __webpack_require__(8);

	var _domUtils2 = _interopRequireDefault(_domUtils);

	var _wwClipboardManager = __webpack_require__(9);

	var _wwClipboardManager2 = _interopRequireDefault(_wwClipboardManager);

	var _wwListManager = __webpack_require__(12);

	var _wwListManager2 = _interopRequireDefault(_wwListManager);

	var _wwTaskManager = __webpack_require__(13);

	var _wwTaskManager2 = _interopRequireDefault(_wwTaskManager);

	var _wwTableManager = __webpack_require__(14);

	var _wwTableManager2 = _interopRequireDefault(_wwTableManager);

	var _wwTableSelectionManager = __webpack_require__(15);

	var _wwTableSelectionManager2 = _interopRequireDefault(_wwTableSelectionManager);

	var _wwHrManager = __webpack_require__(16);

	var _wwHrManager2 = _interopRequireDefault(_wwHrManager);

	var _wwPManager = __webpack_require__(17);

	var _wwPManager2 = _interopRequireDefault(_wwPManager);

	var _wwHeadingManager = __webpack_require__(18);

	var _wwHeadingManager2 = _interopRequireDefault(_wwHeadingManager);

	var _wwCodeBlockManager = __webpack_require__(19);

	var _wwCodeBlockManager2 = _interopRequireDefault(_wwCodeBlockManager);

	var _squireExt = __webpack_require__(20);

	var _squireExt2 = _interopRequireDefault(_squireExt);

	var _keyMapper = __webpack_require__(3);

	var _keyMapper2 = _interopRequireDefault(_keyMapper);

	var _wwTextObject = __webpack_require__(21);

	var _wwTextObject2 = _interopRequireDefault(_wwTextObject);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var keyMapper = _keyMapper2.default.getSharedInstance();

	var util = tui.util;

	var FIND_EMPTY_LINE = /<(.+)>(<br>|<br \/>|<BR>|<BR \/>)<\/\1>/g,
	    FIND_UNNECESSARY_BR = /(?:<br>|<br \/>|<BR>|<BR \/>)<\/(.+?)>/g,
	    FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD|PRE)\b/;

	var EDITOR_CONTENT_CSS_CLASSNAME = 'tui-editor-contents';

	var canObserveMutations = typeof MutationObserver !== 'undefined';

	/**
	 * WysiwygEditor
	 * @exports WysiwygEditor
	 * @param {jQuery} $el element to insert editor
	 * @param {EventManager} eventManager EventManager instance
	 * @constructor
	 * @class WysiwygEditor
	 */

	var WysiwygEditor = function () {
	    function WysiwygEditor($el, eventManager) {
	        var _this = this;

	        _classCallCheck(this, WysiwygEditor);

	        this.eventManager = eventManager;
	        this.$editorContainerEl = $el;

	        this._height = 0;

	        this._silentChange = false;

	        this._keyEventHandlers = {};
	        this._managers = {};

	        this._initEvent();
	        this._initDefaultKeyEventHandler();

	        this.postProcessForChange = util.debounce(function () {
	            return _this._postProcessForChange();
	        }, 0);
	    }

	    /**
	     * init
	     * @api
	     * @memberOf WysiwygEditor
	     */


	    _createClass(WysiwygEditor, [{
	        key: 'init',
	        value: function init() {
	            var $editorBody = $('<div />');

	            this.$editorContainerEl.append($editorBody);

	            this.editor = new _squireExt2.default($editorBody[0], {
	                blockTag: 'DIV',
	                leafNodeNames: {
	                    'HR': false
	                }
	            });

	            this._clipboardManager = new _wwClipboardManager2.default(this);
	            this._initSquireEvent();
	            this._clipboardManager.init();

	            this.get$Body().addClass(EDITOR_CONTENT_CSS_CLASSNAME);
	            this.$editorContainerEl.css('position', 'relative');
	        }

	        /**
	         * _preprocessForInlineElement
	         * Seperate anchor tags with \u200B and replace blank space between <br> and <img to <br>$1
	         * @param {string} html Inner html of content editable
	         * @returns {string}
	         * @memberOf WysiwygEditor
	         * @private
	         */

	    }, {
	        key: '_preprocessForInlineElement',
	        value: function _preprocessForInlineElement(html) {
	            return html.replace(/<br>( *)<img/g, '<br><br>$1<img');
	        }
	        /**
	         * _initEvent
	         * Initialize EventManager event handler
	         * @memberOf WysiwygEditor
	         * @private
	         */

	    }, {
	        key: '_initEvent',
	        value: function _initEvent() {
	            var self = this;

	            this.eventManager.listen('wysiwygSetValueBefore', function (html) {
	                return self._preprocessForInlineElement(html);
	            });

	            this.eventManager.listen('wysiwygKeyEvent', function (ev) {
	                return self._runKeyEventHandlers(ev.data, ev.keyMap);
	            });
	        }

	        /**
	         * addKeyEventHandler
	         * Add key event handler
	         * @api
	         * @memberOf WysiwygEditor
	         * @param {string} keyMap keyMap string
	         * @param {function} handler handler
	         */

	    }, {
	        key: 'addKeyEventHandler',
	        value: function addKeyEventHandler(keyMap, handler) {
	            if (!handler) {
	                handler = keyMap;
	                keyMap = 'DEFAULT';
	            }

	            if (!this._keyEventHandlers[keyMap]) {
	                this._keyEventHandlers[keyMap] = [];
	            }

	            this._keyEventHandlers[keyMap].push(handler);
	        }

	        /**
	         * _runKeyEventHandlers
	         * Run key event handler
	         * @param {Event} event event object
	         * @param {string} keyMap keyMapString
	         * @private
	         */

	    }, {
	        key: '_runKeyEventHandlers',
	        value: function _runKeyEventHandlers(event, keyMap) {
	            var range = this.getRange();
	            var handlers = void 0,
	                isNeedNext = void 0;

	            handlers = this._keyEventHandlers.DEFAULT;

	            if (handlers) {
	                util.forEachArray(handlers, function (handler) {
	                    isNeedNext = handler(event, range, keyMap);

	                    return isNeedNext;
	                });
	            }

	            handlers = this._keyEventHandlers[keyMap];

	            if (handlers && isNeedNext !== false) {
	                util.forEachArray(handlers, function (handler) {
	                    return handler(event, range, keyMap);
	                });
	            }
	        }

	        /**
	         * _initSquireEvent
	         * Initialize squire event
	         * @private
	         */

	    }, {
	        key: '_initSquireEvent',
	        value: function _initSquireEvent() {
	            var self = this;
	            var isNeedFirePostProcessForRangeChange = false;

	            this.getEditor().addEventListener(util.browser.msie ? 'beforepaste' : 'paste', function (clipboardEvent) {
	                self.eventManager.emit('paste', {
	                    source: 'wysiwyg',
	                    data: clipboardEvent
	                });
	            });

	            this.getEditor().addEventListener('dragover', function (ev) {
	                ev.preventDefault();

	                return false;
	            });

	            this.getEditor().addEventListener('drop', function (ev) {
	                ev.preventDefault();

	                self.eventManager.emit('drop', {
	                    source: 'wysiwyg',
	                    data: ev
	                });

	                return false;
	            });

	            // no-iframe전환후 레인지가 업데이트 되기 전에 이벤트가 발생함
	            // 그래서 레인지 업데이트 이후 체인지 관련 이벤트 발생
	            this.getEditor().addEventListener('input', util.debounce(function () {
	                if (!self._silentChange && self.isEditorValid()) {
	                    var eventObj = {
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

	            this.getEditor().addEventListener('keydown', function (keyboardEvent) {
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
	                this.getEditor().addEventListener('keypress', function (keyboardEvent) {
	                    var keyCode = keyboardEvent.keyCode;

	                    if (keyCode === 13 || keyCode === 9) {
	                        var range = self.getEditor().getSelection();

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

	                // 파폭에서 space입력시 텍스트노드가 분리되는 현상때문에 꼭 다시 머지해줘야한다..
	                // 이렇게 하지 않으면 textObject에 문제가 생긴다.
	                self.getEditor().addEventListener('keyup', function () {
	                    var range = self.getRange();

	                    if (_domUtils2.default.isTextNode(range.commonAncestorContainer) && _domUtils2.default.isTextNode(range.commonAncestorContainer.previousSibling)) {
	                        var prevLen = range.commonAncestorContainer.previousSibling.length;
	                        var curEl = range.commonAncestorContainer;

	                        range.commonAncestorContainer.previousSibling.appendData(range.commonAncestorContainer.data);

	                        range.setStart(range.commonAncestorContainer.previousSibling, prevLen + range.startOffset);
	                        range.collapse(true);

	                        curEl.parentNode.removeChild(curEl);

	                        self.getEditor().setSelection(range);
	                        range.detach();
	                    }
	                });
	            }

	            this.getEditor().addEventListener('keyup', function (keyboardEvent) {
	                if (isNeedFirePostProcessForRangeChange) {
	                    self.postProcessForChange();
	                    isNeedFirePostProcessForRangeChange = false;
	                }

	                self.eventManager.emit('keyup', {
	                    source: 'wysiwyg',
	                    data: keyboardEvent
	                });
	            });

	            this.getEditor().addEventListener('scroll', function (ev) {
	                self.eventManager.emit('scroll', {
	                    source: 'wysiwyg',
	                    data: ev
	                });
	            });

	            this.getEditor().addEventListener('click', function (ev) {
	                self.eventManager.emit('click', {
	                    source: 'wysiwyg',
	                    data: ev
	                });
	            });

	            this.getEditor().addEventListener('mousedown', function (ev) {
	                self.eventManager.emit('mousedown', {
	                    source: 'wysiwyg',
	                    data: ev
	                });
	            });

	            this.getEditor().addEventListener('mouseover', function (ev) {
	                self.eventManager.emit('mouseover', {
	                    source: 'wysiwyg',
	                    data: ev
	                });
	            });

	            this.getEditor().addEventListener('mouseup', function (ev) {
	                self.eventManager.emit('mouseup', {
	                    source: 'wysiwyg',
	                    data: ev
	                });
	            });

	            this.getEditor().addEventListener('contextmenu', function (ev) {
	                self.eventManager.emit('contextmenu', {
	                    source: 'wysiwyg',
	                    data: ev
	                });
	            });

	            this.getEditor().addEventListener('focus', function () {
	                self.eventManager.emit('focus', {
	                    source: 'wysiwyg'
	                });
	            });

	            this.getEditor().addEventListener('blur', function () {
	                self.eventManager.emit('blur', {
	                    source: 'wysiwyg'
	                });
	            });

	            this.getEditor().addEventListener('pathChange', function (data) {
	                var state = {
	                    bold: /(>B|>STRONG|^B$|^STRONG$)/.test(data.path),
	                    italic: /(>I|>EM|^I$|^EM$)/.test(data.path),
	                    code: /CODE/.test(data.path),
	                    codeBlock: /PRE/.test(data.path),
	                    quote: /BLOCKQUOTE/.test(data.path),
	                    list: /LI(?!.task-list-item)/.test(self._getLastLiString(data.path)),
	                    task: /LI.task-list-item/.test(self._getLastLiString(data.path)),
	                    source: 'wysiwyg'
	                };

	                self.eventManager.emit('stateChange', state);
	            });
	        }

	        /**
	         * Return last matched list item path string matched index to end
	         * @param {string} path Full path string of current selection
	         * @returns {string}
	         * @private
	         */

	    }, {
	        key: '_getLastLiString',
	        value: function _getLastLiString(path) {
	            var foundedListItem = /LI[^UO]*$/.exec(path);
	            var result = void 0;

	            if (foundedListItem) {
	                result = foundedListItem[0];
	            } else {
	                result = '';
	            }

	            return result;
	        }

	        /**
	         * Handler of keydown event
	         * @param {object} keyboardEvent Event object
	         * @private
	         */

	    }, {
	        key: '_onKeyDown',
	        value: function _onKeyDown(keyboardEvent) {
	            var keyMap = keyMapper.convert(keyboardEvent);

	            // to avoid duplicate event firing in firefox
	            if (keyboardEvent.keyCode) {
	                this.eventManager.emit('keyMap', {
	                    source: 'wysiwyg',
	                    keyMap: keyMap,
	                    data: keyboardEvent
	                });

	                if (!keyboardEvent.defaultPrevented) {
	                    this.eventManager.emit('wysiwygKeyEvent', {
	                        keyMap: keyMap,
	                        data: keyboardEvent
	                    });
	                }
	            }
	        }

	        /**
	         * _initDefaultKeyEventHandler
	         * Initialize default event handler
	         * @private
	         */

	    }, {
	        key: '_initDefaultKeyEventHandler',
	        value: function _initDefaultKeyEventHandler() {
	            var self = this;

	            this.addKeyEventHandler('ENTER', function (ev, range) {
	                if (self._isInOrphanText(range)) {
	                    // We need this cuz input text right after table make orphan text in webkit
	                    self.defer(function () {
	                        self._wrapDefaultBlockToOrphanTexts();
	                        self.breakToNewDefaultBlock(range, 'before');
	                    });
	                }

	                self.defer(function () {
	                    self._scrollToRangeIfNeed();
	                });
	            });

	            this.addKeyEventHandler('TAB', function (ev) {
	                var sq = self.getEditor();
	                var range = sq.getSelection();
	                var isAbleToInput4Spaces = range.collapsed && self._isCursorNotInRestrictedAreaOfTabAction(sq);
	                var isTextSelection = !range.collapsed && _domUtils2.default.isTextNode(range.commonAncestorContainer);

	                ev.preventDefault();
	                if (isAbleToInput4Spaces || isTextSelection) {
	                    sq.insertPlainText('\xA0\xA0\xA0\xA0');

	                    return false;
	                }

	                return true;
	            });
	        }
	    }, {
	        key: '_wrapDefaultBlockToOrphanTexts',
	        value: function _wrapDefaultBlockToOrphanTexts() {
	            var textNodes = this.get$Body().contents().filter(this.findTextNodeFilter);

	            textNodes.each(function (i, node) {
	                if (node.nextSibling && node.nextSibling.tagName === 'BR') {
	                    $(node.nextSibling).remove();
	                }

	                $(node).wrap('<div />');
	            });
	        }

	        /**
	         * Scroll editor area to current cursor position if need
	         * @private
	         */

	    }, {
	        key: '_scrollToRangeIfNeed',
	        value: function _scrollToRangeIfNeed() {
	            var range = this.getEditor().getSelection().cloneRange();
	            var cursorTop = this.getEditor().getCursorPosition(range).top - this.$editorContainerEl.offset().top;

	            if (cursorTop >= this.get$Body().height()) {
	                range.endContainer.scrollIntoView();
	            }
	        }

	        /**
	         * _isInOrphanText
	         * check if range is orphan text
	         * @param {Range} range range
	         * @returns {boolean} result
	         * @private
	         */

	    }, {
	        key: '_isInOrphanText',
	        value: function _isInOrphanText(range) {
	            return range.startContainer.nodeType === Node.TEXT_NODE && range.startContainer.parentNode === this.get$Body()[0];
	        }

	        /**
	         * _wrapDefaultBlockTo
	         * Wrap default block to passed range
	         * @param {Range} range range
	         * @private
	         */

	    }, {
	        key: '_wrapDefaultBlockTo',
	        value: function _wrapDefaultBlockTo(range) {
	            this.saveSelection(range);
	            this._joinSplitedTextNodes();
	            this.restoreSavedSelection();

	            range = this.getEditor().getSelection().cloneRange();

	            var textElem = range.startContainer;
	            var cursorOffset = range.startOffset;

	            // 이때 range의 정보들이 body기준으로 변경된다(텍스트 노드가 사라져서)
	            // after code below, range range is arranged by body
	            var block = this.getEditor().createDefaultBlock([range.startContainer]);

	            // range for insert block
	            var insertTargetNode = _domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset);
	            if (insertTargetNode) {
	                range.setStartBefore(insertTargetNode);
	            } else {
	                // 컨테이너의 차일드가 이노드 한개뿐일경우
	                range.selectNodeContents(range.startContainer);
	            }

	            range.collapse(true);

	            range.insertNode(block);

	            // revert range to original node
	            range.setStart(textElem, cursorOffset);
	            range.collapse(true);

	            this.getEditor().setSelection(range);
	        }

	        /**
	         * findTextNodeFilter
	         * @this Node
	         * @returns {boolean} true or not
	         */

	    }, {
	        key: 'findTextNodeFilter',
	        value: function findTextNodeFilter() {
	            return this.nodeType === Node.TEXT_NODE;
	        }

	        /**
	         * _joinSplitedTextNodes
	         * Join spliated text nodes
	         * @private
	         */

	    }, {
	        key: '_joinSplitedTextNodes',
	        value: function _joinSplitedTextNodes() {
	            var prevNode = void 0,
	                lastGroup = void 0;
	            var nodesToRemove = [];
	            var textNodes = this.get$Body().contents().filter(this.findTextNodeFilter);

	            textNodes.each(function (i, node) {
	                if (prevNode === node.previousSibling) {
	                    lastGroup.nodeValue += node.nodeValue;
	                    nodesToRemove.push(node);
	                } else {
	                    lastGroup = node;
	                }

	                prevNode = node;
	            });

	            $(nodesToRemove).remove();
	        }

	        /**
	         * saveSelection
	         * Save current selection before modification
	         * @api
	         * @memberOf WysiwygEditor
	         * @param {Range} range Range object
	         */

	    }, {
	        key: 'saveSelection',
	        value: function saveSelection(range) {
	            var sq = this.getEditor();

	            if (!range) {
	                range = sq.getSelection().cloneRange();
	            }

	            this.getEditor()._saveRangeToBookmark(range);
	        }

	        /**
	         * restoreSavedSelection
	         * Restore saved selection
	         * @api
	         * @memberOf WysiwygEditor
	         */

	    }, {
	        key: 'restoreSavedSelection',
	        value: function restoreSavedSelection() {
	            var sq = this.getEditor();
	            sq.setSelection(sq._getRangeAndRemoveBookmark());
	        }

	        /**
	         * reset
	         * Reset wysiwyg editor
	         * @api
	         * @memberOf WysiwygEditor
	         */

	    }, {
	        key: 'reset',
	        value: function reset() {
	            this.setValue('');
	        }

	        /**
	         * changeBlockFormatTo
	         * Change current range block format to passed tag
	         * @api
	         * @memberOf WysiwygEditor
	         * @param {string} targetTagName Target element tag name
	         */

	    }, {
	        key: 'changeBlockFormatTo',
	        value: function changeBlockFormatTo(targetTagName) {
	            this.getEditor().changeBlockFormatTo(targetTagName);
	            this.eventManager.emit('wysiwygRangeChangeAfter', this);
	        }

	        /**
	         * makeEmptyBlockCurrentSelection
	         * Make empty block to current selection
	         * @api
	         * @memberOf WysiwygEditor
	         */

	    }, {
	        key: 'makeEmptyBlockCurrentSelection',
	        value: function makeEmptyBlockCurrentSelection() {
	            var self = this;

	            this.getEditor().modifyBlocks(function (frag) {
	                if (!frag.textContent) {
	                    frag = self.getEditor().createDefaultBlock();
	                }

	                return frag;
	            });
	        }

	        /**
	         * focus
	         * Focus to editor
	         * @api
	         * @memberOf WysiwygEditor
	         */

	    }, {
	        key: 'focus',
	        value: function focus() {
	            this.editor.focus();
	        }

	        /**
	         * blur
	         * Remove focus of editor
	         * @api
	         * @memberOf WysiwygEditor
	         */

	    }, {
	        key: 'blur',
	        value: function blur() {
	            this.editor.blur();
	        }

	        /**
	         * remove
	         * Remove wysiwyg editor
	         * @api
	         * @memberOf WysiwygEditor
	         */

	    }, {
	        key: 'remove',
	        value: function remove() {
	            this.getEditor().destroy();

	            this.editor = null;
	            this.$body = null;
	        }

	        /**
	         * setHeight
	         * Set editor height
	         * @api
	         * @memberOf WysiwygEditor
	         * @param {number|string} height pixel of height or "auto"
	         */

	    }, {
	        key: 'setHeight',
	        value: function setHeight(height) {
	            this._height = height;

	            if (height === 'auto') {
	                this.get$Body().css('overflow', 'visible');
	                this.get$Body().css('height', 'auto');
	            } else {
	                this.get$Body().css('overflow', 'auto');
	                this.get$Body().css('height', '100%');
	                this.$editorContainerEl.height(height);
	            }
	        }

	        /**
	         * setValue
	         * Set value to wysiwyg editor
	         * @api
	         * @memberOf WysiwygEditor
	         * @param {string} html HTML text
	         */

	    }, {
	        key: 'setValue',
	        value: function setValue(html) {
	            html = this.eventManager.emitReduce('wysiwygSetValueBefore', html);

	            this.editor.setHTML(html);

	            this.eventManager.emit('wysiwygSetValueAfter', this);
	            this.eventManager.emit('contentChangedFromWysiwyg', this);

	            this.moveCursorToEnd();

	            this.getEditor().preserveLastLine();

	            this.getEditor().removeLastUndoStack();
	            this.getEditor().saveUndoState();
	        }

	        /**
	         * getValue
	         * Get value of wysiwyg editor
	         * @api
	         * @memberOf WysiwygEditor
	         * @returns {string} html
	         */

	    }, {
	        key: 'getValue',
	        value: function getValue() {
	            this._prepareGetHTML();

	            var html = this.editor.getHTML();

	            // empty line replace to br
	            html = html.replace(FIND_EMPTY_LINE, function (match, tag) {
	                var result = void 0;

	                // we maintain empty list
	                if (tag === 'li') {
	                    result = match;
	                    // we maintain empty table
	                } else if (tag === 'td' || tag === 'th') {
	                    result = '<' + tag + '></' + tag + '>';
	                } else {
	                    result = '<br />';
	                }

	                return result;
	            });

	            // remove unnecessary brs
	            html = html.replace(FIND_UNNECESSARY_BR, '</$1>');

	            // remove contenteditable block, in this case div
	            html = html.replace(/<div>/g, '');
	            html = html.replace(/<\/div>/g, '<br />');

	            html = this.eventManager.emitReduce('wysiwygProcessHTMLText', html);

	            return html;
	        }

	        /**
	         * _prepareGetHTML
	         * Prepare before get html
	         * @memberOf WysiwygEditor
	         * @private
	         */

	    }, {
	        key: '_prepareGetHTML',
	        value: function _prepareGetHTML() {
	            var self = this;
	            // for ensure to fire change event
	            self.get$Body().attr('lastGetValue', Date.now());

	            self._joinSplitedTextNodes();

	            self.getEditor().modifyDocument(function () {
	                self.eventManager.emit('wysiwygGetValueBefore', self);
	            });
	        }

	        /**
	         * _postProcessForChange
	         * Post process for change
	         * @private
	         * @memberOf WysiwygEditor
	         */

	    }, {
	        key: '_postProcessForChange',
	        value: function _postProcessForChange() {
	            var self = this;
	            self.getEditor().modifyDocument(function () {
	                self.eventManager.emit('wysiwygRangeChangeAfter', self);
	            });
	        }

	        /**
	         * readySilentChange
	         * Ready to silent change
	         * @api
	         * @memberOf WysiwygEditor
	         */

	    }, {
	        key: 'readySilentChange',
	        value: function readySilentChange() {
	            if (canObserveMutations && !this.getEditor().isIgnoreChange()) {
	                this._silentChange = true;
	            }
	        }

	        /**
	         * getEditor
	         * Get squire
	         * @api
	         * @memberOf WysiwygEditor
	         * @returns {SquireExt} squire
	         */

	    }, {
	        key: 'getEditor',
	        value: function getEditor() {
	            return this.editor;
	        }

	        /**
	         * replaceSelection
	         * Replace text of passed range
	         * @api
	         * @memberOf WysiwygEditor
	         * @param {string} content Content for change current selection
	         * @param {Range} range range
	         */

	    }, {
	        key: 'replaceSelection',
	        value: function replaceSelection(content, range) {
	            this.getEditor().replaceSelection(content, range);
	        }

	        /**
	         * replaceRelativeOffset
	         * Replace content by relative offset
	         * @api
	         * @memberOf WysiwygEditor
	         * @param {string} content Content for change current selection
	         * @param {number} offset Offset of current range
	         * @param {number} overwriteLength Length to overwrite content
	         */

	    }, {
	        key: 'replaceRelativeOffset',
	        value: function replaceRelativeOffset(content, offset, overwriteLength) {
	            this.getEditor().replaceRelativeOffset(content, offset, overwriteLength);
	        }

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

	    }, {
	        key: 'addWidget',
	        value: function addWidget(range, node, style, offset) {
	            var pos = this.getEditor().getSelectionPosition(range, style, offset);
	            var editorContainerPos = this.$editorContainerEl.offset();

	            this.$editorContainerEl.append(node);

	            $(node).css({
	                position: 'absolute',
	                top: pos.top - editorContainerPos.top,
	                left: pos.left - editorContainerPos.left
	            });
	        }

	        /**
	         * get$Body
	         * Get jQuery wrapped body container of Squire
	         * @api
	         * @memberOf WysiwygEditor
	         * @returns {JQuery} jquery body
	         */

	    }, {
	        key: 'get$Body',
	        value: function get$Body() {
	            return this.getEditor().get$Body();
	        }

	        /**
	         * hasFormatWithRx
	         * Check with given regexp whether current path has some format or not
	         * @api
	         * @memberOf WysiwygEditor
	         * @param {RegExp} rx Regexp
	         * @returns {boolean} Match result
	         */

	    }, {
	        key: 'hasFormatWithRx',
	        value: function hasFormatWithRx(rx) {
	            return this.getEditor().getPath().match(rx);
	        }

	        /**
	         * breakToNewDefaultBlock
	         * Break line to new default block from passed range
	         * @api
	         * @memberOf WysiwygEditor
	         * @param {Range} range Range object
	         * @param {string} [where] "before" or not
	         */

	    }, {
	        key: 'breakToNewDefaultBlock',
	        value: function breakToNewDefaultBlock(range, where) {
	            var div = this.editor.createDefaultBlock();
	            var currentNode = _domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset) || _domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset - 1);
	            var appendBefore = _domUtils2.default.getParentUntil(currentNode, this.get$Body()[0]);

	            if (where === 'before') {
	                $(appendBefore).before(div);
	            } else {
	                $(appendBefore).after(div);
	            }

	            range.setStart(div, 0);
	            range.collapse(true);
	            this.editor.setSelection(range);
	        }

	        /**
	         * replaceContentText
	         * Replace textContet of node
	         * @api
	         * @memberOf WysiwygEditor
	         * @param {Node} container Container node
	         * @param {string} from Target text to change
	         * @param {string} to Replacement text
	         */

	    }, {
	        key: 'replaceContentText',
	        value: function replaceContentText(container, from, to) {
	            var before = $(container).html();
	            $(container).html(before.replace(from, to));
	        }

	        /**
	         * unwrapBlockTag
	         * Unwrap Block tag of current range
	         * @api
	         * @memberOf WysiwygEditor
	         * @param {function} [condition] iterate with tagName
	         */

	    }, {
	        key: 'unwrapBlockTag',
	        value: function unwrapBlockTag(condition) {
	            if (!condition) {
	                condition = function condition(tagName) {
	                    return FIND_BLOCK_TAGNAME_RX.test(tagName);
	                };
	            }

	            this.getEditor().changeBlockFormat(condition);
	            this.eventManager.emit('wysiwygRangeChangeAfter', this);
	        }

	        /**
	         * addManager
	         * Add manager
	         * @api
	         * @memberOf WysiwygEditor
	         * @param {string} name Manager name
	         * @param {function} Manager Constructor
	         */

	    }, {
	        key: 'addManager',
	        value: function addManager(name, Manager) {
	            if (!Manager) {
	                Manager = name;
	                name = null;
	            }

	            var instance = new Manager(this);
	            this._managers[name || instance.name] = instance;
	        }

	        /**
	         * getManager
	         * Get manager by manager name
	         * @api
	         * @memberOf WysiwygEditor
	         * @param {string} name Manager name
	         * @returns {object} manager
	         */

	    }, {
	        key: 'getManager',
	        value: function getManager(name) {
	            return this._managers[name];
	        }

	        /**
	         * Set cursor position to end
	         * @api
	         * @memberOf WysiwygEditor
	         */

	    }, {
	        key: 'moveCursorToEnd',
	        value: function moveCursorToEnd() {
	            this.getEditor().moveCursorToEnd();
	            this.getEditor().scrollTop(this.get$Body().height());
	            this._correctRangeAfterMoveCursor('end');
	        }

	        /**
	         * Set cursor position to start
	         * @api
	         * @memberOf WysiwygEditor
	         */

	    }, {
	        key: 'moveCursorToStart',
	        value: function moveCursorToStart() {
	            this.getEditor().moveCursorToStart();
	            this.getEditor().scrollTop(0);
	        }

	        /**
	         * Set cursor position to start
	         * @api
	         * @memberOf WysiwygEditor
	         * @param {number} value Scroll amount
	         * @returns {boolean}
	         */

	    }, {
	        key: 'scrollTop',
	        value: function scrollTop(value) {
	            return this.getEditor().scrollTop(value);
	        }

	        /**
	         * _correctRangeAfterMoveCursor
	         * For arrange Range after moveCursorToEnd api invocation. Squire has bug in Firefox, IE.
	         * @memberOf WysiwygEditor
	         * @param {string} direction Direction of cursor move
	         * @private
	         */

	    }, {
	        key: '_correctRangeAfterMoveCursor',
	        value: function _correctRangeAfterMoveCursor(direction) {
	            var range = this.getEditor().getSelection().cloneRange();
	            var cursorContainer = this.get$Body()[0];

	            if (direction === 'start') {
	                while (cursorContainer.firstChild) {
	                    cursorContainer = cursorContainer.firstChild;
	                }
	            } else {
	                while (cursorContainer.lastChild) {
	                    cursorContainer = cursorContainer.lastChild;
	                }
	            }

	            // IE have problem with cursor after br
	            if (cursorContainer.tagName === 'BR') {
	                range.setStartBefore(cursorContainer);
	            } else {
	                range.setStartAfter(cursorContainer);
	            }

	            range.collapse(true);

	            this.getEditor().setSelection(range);
	        }

	        /**
	         * Get current Range object
	         * @api
	         * @memberOf WysiwygEditor
	         * @returns {Range}
	         */

	    }, {
	        key: 'getRange',
	        value: function getRange() {
	            return this.getEditor().getSelection().cloneRange();
	        }

	        /**
	         * Get text object of current range
	         * @api
	         * @memberOf WysiwygEditor
	         * @param {Range} range Range object
	         * @returns {WwTextObject}
	         */

	    }, {
	        key: 'getTextObject',
	        value: function getTextObject(range) {
	            return new _wwTextObject2.default(this, range);
	        }
	    }, {
	        key: 'defer',
	        value: function defer(callback, delayOffset) {
	            var self = this;
	            var delay = delayOffset ? delayOffset : 0;

	            setTimeout(function () {
	                if (self.isEditorValid()) {
	                    callback(self);
	                }
	            }, delay);
	        }
	    }, {
	        key: 'isEditorValid',
	        value: function isEditorValid() {
	            return this.getEditor() && $.contains(this.$editorContainerEl[0].ownerDocument, this.$editorContainerEl[0]);
	        }
	    }, {
	        key: '_isCursorNotInRestrictedAreaOfTabAction',
	        value: function _isCursorNotInRestrictedAreaOfTabAction(editor) {
	            return !editor.hasFormat('li') && !editor.hasFormat('blockquote') && !editor.hasFormat('table');
	        }

	        /**
	         * WysiwygEditor factory method
	         * @api
	         * @memberOf WysiwygEditor
	         * @param {jQuery} $el Container element for editor
	         * @param {EventManager} eventManager EventManager instance
	         * @returns {WysiwygEditor} wysiwygEditor
	         */

	    }], [{
	        key: 'factory',
	        value: function factory($el, eventManager) {
	            var wwe = new WysiwygEditor($el, eventManager);

	            wwe.init();

	            wwe.addManager(_wwListManager2.default);
	            wwe.addManager(_wwTaskManager2.default);
	            wwe.addManager(_wwTableSelectionManager2.default);
	            wwe.addManager(_wwTableManager2.default);
	            wwe.addManager(_wwHrManager2.default);
	            wwe.addManager(_wwPManager2.default);
	            wwe.addManager(_wwHeadingManager2.default);
	            wwe.addManager(_wwCodeBlockManager2.default);

	            return wwe;
	        }
	    }]);

	    return WysiwygEditor;
	}();

	module.exports = WysiwygEditor;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var FIND_ZWB = /\u200B/g;

	var util = tui.util;

	/**
	 * isTextNode
	 * Check if node is text node
	 * @param {Node} node node to check
	 * @returns {boolean} result
	 */
	var isTextNode = function isTextNode(node) {
	    return node && node.nodeType === Node.TEXT_NODE;
	};

	/**
	 * isElemNode
	 * Check if node is element node
	 * @param {Node} node node to check
	 * @returns {boolean} result
	 */
	var isElemNode = function isElemNode(node) {
	    return node && node.nodeType === Node.ELEMENT_NODE;
	};

	/**
	 * getNodeName
	 * Get node name of node
	 * @param {Node} node node
	 * @returns {string} node name
	 */
	var getNodeName = function getNodeName(node) {
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
	var getTextLength = function getTextLength(node) {
	    var len = void 0;

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
	var getOffsetLength = function getOffsetLength(node) {
	    var len = void 0;

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
	var getNodeOffsetOfParent = function getNodeOffsetOfParent(node) {
	    var childNodesOfParent = node.parentNode.childNodes;
	    var i = void 0,
	        t = void 0,
	        found = void 0;

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
	var getChildNodeByOffset = function getChildNodeByOffset(node, index) {
	    var currentNode = void 0;

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
	var getNodeWithDirectionUntil = function getNodeWithDirectionUntil(direction, node, untilNodeName) {
	    var directionKey = direction + 'Sibling';
	    var nodeName = void 0,
	        foundedNode = void 0;

	    while (node && !node[directionKey]) {
	        nodeName = getNodeName(node.parentNode);

	        if (nodeName === untilNodeName || nodeName === 'BODY') {
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
	var getPrevOffsetNodeUntil = function getPrevOffsetNodeUntil(node, index, untilNodeName) {
	    var prevNode = void 0;

	    if (index > 0) {
	        prevNode = getChildNodeByOffset(node, index - 1);
	    } else {
	        prevNode = getNodeWithDirectionUntil('previous', node, untilNodeName);
	    }

	    return prevNode;
	};

	var getParentUntilBy = function getParentUntilBy(node, condition) {
	    var foundedNode = void 0;

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
	var getParentUntil = function getParentUntil(node, untilNode) {
	    var foundedNode = void 0;

	    if (util.isString(untilNode)) {
	        foundedNode = getParentUntilBy(node, function (targetNode) {
	            return untilNode === getNodeName(targetNode);
	        });
	    } else {
	        foundedNode = getParentUntilBy(node, function (targetNode) {
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
	var getNodeWithDirectionUnderParent = function getNodeWithDirectionUnderParent(direction, node, underNode) {
	    var directionKey = direction + 'Sibling';
	    var foundedNode = void 0;

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
	var getTopPrevNodeUnder = function getTopPrevNodeUnder(node, underNode) {
	    return getNodeWithDirectionUnderParent('previous', node, underNode);
	};

	/**
	 * getNextTopBlockNode
	 * get next top level block node
	 * @param {Node} node node
	 * @param {Node} underNode underNode
	 * @returns {Node} founded node
	 */
	var getTopNextNodeUnder = function getTopNextNodeUnder(node, underNode) {
	    return getNodeWithDirectionUnderParent('next', node, underNode);
	};

	/**
	 * Get parent element the body element
	 * @param {Node} node Node for start searching
	 * @returns {Node}
	 */
	var getTopBlockNode = function getTopBlockNode(node) {
	    return getParentUntil(node, 'BODY');
	};

	/**
	 * Get previous text node
	 * @param {Node} node Node for start searching
	 * @returns {Node}
	 */
	var getPrevTextNode = function getPrevTextNode(node) {
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
	var findOffsetNode = function findOffsetNode(root, offsetList, textNodeFilter) {
	    var result = [];
	    var text = '';
	    var walkerOffset = 0;
	    var newWalkerOffset = void 0;

	    if (!offsetList.length) {
	        return result;
	    }

	    var offset = offsetList.shift();
	    var walker = document.createTreeWalker(root, 4, null, false);

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

	    // 오프셋에 해당하는 컨텐츠가 없는경우 컨텐츠 맨마지막으로 통일
	    // 중간에 return으로 빠져나가지 않고 여기까지 왔다는것은 남은 offset이 있는것임
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

	var getNodeInfo = function getNodeInfo(node) {
	    var path = {};

	    path.tagName = node.nodeName;

	    if (node.id) {
	        path.id = node.id;
	    }

	    var className = node.className.trim();

	    if (className) {
	        path.className = className;
	    }

	    return path;
	};

	var getPath = function getPath(node, root) {
	    var paths = [];

	    while (node && node !== root) {
	        if (isElemNode(node)) {
	            paths.unshift(getNodeInfo(node));
	        }

	        node = node.parentNode;
	    }

	    return paths;
	};

	/**
	 * Find next, previous TD or TH element by given TE element
	 * @param {HTMLElement} node TD element
	 * @param {string} direction Boolean value for direction true is find next cell
	 * @returns {HTMLElement|null}
	 */
	var getTableCellByDirection = function getTableCellByDirection(node, direction) {
	    var isForward = true;
	    var targetElement = null;

	    if (tui.util.isUndefined(direction) || direction !== 'next' && direction !== 'previous') {
	        return null;
	    } else if (direction === 'previous') {
	        isForward = false;
	    }

	    if (isForward) {
	        targetElement = node.nextElementSibling;
	    } else {
	        targetElement = node.previousElementSibling;
	    }

	    return targetElement;
	};

	/**
	 * Find sibling TR's TD element by given TD and direction
	 * @param {HTMLElement} node TD element
	 * @param {string} direction Boolean value for find first TD in next line
	 * @param {boolean} [needEdgeCell=false] Boolean value for find first TD in next line
	 * @returns {HTMLElement|null}
	 */
	var getSiblingRowCellByDirection = function getSiblingRowCellByDirection(node, direction, needEdgeCell) {
	    var isForward = true;
	    var tableCellElement = null;
	    var $node = void 0,
	        index = void 0,
	        $targetRowElement = void 0,
	        $currentContainer = void 0,
	        $siblingContainer = void 0,
	        isSiblingContainerExists = void 0;

	    if (tui.util.isUndefined(direction) || direction !== 'next' && direction !== 'previous') {
	        return null;
	    } else if (direction === 'previous') {
	        isForward = false;
	    }

	    if (node) {
	        $node = $(node);

	        if (isForward) {
	            $targetRowElement = $node.parent().next();
	            $currentContainer = $node.parents('thead');
	            $siblingContainer = $currentContainer[0] && $currentContainer.next();
	            isSiblingContainerExists = $siblingContainer && getNodeName($siblingContainer[0]) === 'TBODY';

	            index = 0;
	        } else {
	            $targetRowElement = $node.parent().prev();
	            $currentContainer = $node.parents('tbody');
	            $siblingContainer = $currentContainer[0] && $currentContainer.prev();
	            isSiblingContainerExists = $siblingContainer && getNodeName($siblingContainer[0]) === 'THEAD';

	            index = node.parentNode.childNodes.length - 1;
	        }

	        if (tui.util.isUndefined(needEdgeCell) || !needEdgeCell) {
	            index = getNodeOffsetOfParent(node);
	        }

	        if ($targetRowElement[0]) {
	            tableCellElement = $targetRowElement.children('td,th')[index];
	        } else if ($currentContainer[0] && isSiblingContainerExists) {
	            tableCellElement = $siblingContainer.find('td,th')[index];
	        }

	        return tableCellElement;
	    }

	    return null;
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
	    getNodeInfo: getNodeInfo,
	    getTableCellByDirection: getTableCellByDirection,
	    getSiblingRowCellByDirection: getSiblingRowCellByDirection
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg editor clipboard manager
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _domUtils = __webpack_require__(8);

	var _domUtils2 = _interopRequireDefault(_domUtils);

	var _wwPasteContentHelper = __webpack_require__(10);

	var _wwPasteContentHelper2 = _interopRequireDefault(_wwPasteContentHelper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SET_SELECTION_DELAY = 50;

	/**
	 * WwClipboardManager
	 * @exports WwClipboardManager
	 * @constructor
	 * @class WwClipboardManager
	 * @param {WysiwygEditor} wwe WysiwygEditor instance
	 */

	var WwClipboardManager = function () {
	    function WwClipboardManager(wwe) {
	        _classCallCheck(this, WwClipboardManager);

	        this.wwe = wwe;

	        this._pch = new _wwPasteContentHelper2.default(this.wwe);
	    }

	    /**
	     * init
	     * initialize
	     * @api
	     * @memberOf WwClipboardManager
	     */


	    _createClass(WwClipboardManager, [{
	        key: 'init',
	        value: function init() {
	            this._initSquireEvent();
	        }

	        /**
	         * _initSquireEvent
	         * initialize squire events
	         * @private
	         * @memberOf WwClipboardManager
	         */

	    }, {
	        key: '_initSquireEvent',
	        value: function _initSquireEvent() {
	            var _this = this;

	            this.wwe.getEditor().addEventListener('copy', function (ev) {
	                _this.wwe.eventManager.emit('copy', {
	                    source: 'wysiwyg',
	                    data: ev
	                });

	                _this._executeActionFor('copy');
	            });

	            this.wwe.getEditor().addEventListener('cut', function (ev) {
	                _this.wwe.eventManager.emit('cut', {
	                    source: 'wysiwyg',
	                    data: ev
	                });

	                _this._executeActionFor('cut');
	            });

	            this.wwe.getEditor().addEventListener('willPaste', function (pasteData) {
	                _this._addRangeInfoAndReplaceFragmentIfNeed(pasteData);

	                _this._pch.preparePaste(pasteData);

	                _this.wwe.eventManager.emit('pasteBefore', {
	                    source: 'wysiwyg',
	                    data: pasteData
	                });

	                _this._refineCursorWithPasteContentsIfNeed(pasteData.fragment);
	                _this.wwe.postProcessForChange();
	            });
	        }
	        /**
	         * Refine cursor position with paste contents
	         * @memberOf WwClipboardManager
	         * @param {DocumentFragment} fragment Copied contents
	         * @private
	         */

	    }, {
	        key: '_refineCursorWithPasteContentsIfNeed',
	        value: function _refineCursorWithPasteContentsIfNeed(fragment) {
	            var node = fragment;
	            var sq = this.wwe.getEditor();
	            var range = sq.getSelection().cloneRange();

	            if (fragment.childNodes.length !== 0 && !_domUtils2.default.isTextNode(node.firstChild)) {
	                while (node.lastChild) {
	                    node = node.lastChild;
	                }

	                this.wwe.defer(function () {
	                    sq.focus();

	                    range.setStartAfter(node);
	                    range.collapse(true);
	                    sq.setSelection(range);
	                }, SET_SELECTION_DELAY);
	            }
	        }

	        /**
	         * Check whether copied content from editor or not
	         * @memberOf WwClipboardManager
	         * @param {DocumentFragment} pasteData Copied contents
	         * @returns {boolean}
	         * @private
	         */

	    }, {
	        key: '_isCopyFromEditor',
	        value: function _isCopyFromEditor(pasteData) {
	            if (!this._latestClipboardRangeInfo) {
	                return false;
	            }

	            var lastestClipboardContents = this._latestClipboardRangeInfo.contents.textContent;

	            return lastestClipboardContents.replace(/\s/g, '') === pasteData.fragment.textContent.replace(/\s/g, '');
	        }
	        /**
	         * Save latest clipboard range information to _latestClipboardRangeInfo
	         * @memberOf WwClipboardManager
	         * @private
	         */

	    }, {
	        key: '_saveLastestClipboardRangeInfo',
	        value: function _saveLastestClipboardRangeInfo() {
	            var commonAncestorName = void 0;
	            var range = this.wwe.getEditor().getSelection().cloneRange();
	            this._extendRange(range);

	            if (range.commonAncestorContainer === this.wwe.get$Body()[0]) {
	                commonAncestorName = 'BODY';
	            } else {
	                commonAncestorName = range.commonAncestorContainer.tagName;
	            }

	            this._latestClipboardRangeInfo = {
	                contents: range.cloneContents(),
	                commonAncestorName: commonAncestorName
	            };
	        }

	        /**
	         * _extendRange
	         * extend range if need
	         * @memberOf WwClipboardManager
	         * @param {Range} range to extend
	         * @private
	         */

	    }, {
	        key: '_extendRange',
	        value: function _extendRange(range) {
	            // 텍스트 노드이면서 모두 선택된게 아니면 레인지를 확장할 필요가 없다.
	            if (_domUtils2.default.isTextNode(range.commonAncestorContainer) && (range.startOffset !== 0 || range.commonAncestorContainer.textContent.length !== range.endOffset) && range.commonAncestorContainer.nodeName !== 'TD') {
	                return;
	            }

	            if (range.startOffset === 0) {
	                range = this._extendStartRange(range);
	            }

	            if (range.endOffset === _domUtils2.default.getOffsetLength(range.endContainer)) {
	                range = this._extendEndRange(range);
	            }

	            // commonAncestor의 모든 컨텐츠가 선택된경우 commonAncestor로 셀렉션 변경
	            if (this._isWholeCommonAncestorContainerSelected(range)) {
	                range.selectNode(range.commonAncestorContainer);
	            }
	            this.wwe.getEditor().setSelection(range);
	        }

	        /**
	         * Extends current range's startContainer
	         * @memberOf WwClipboardManager
	         * @param {Range} range Range object
	         * @returns {Range}
	         * @private
	         */

	    }, {
	        key: '_extendStartRange',
	        value: function _extendStartRange(range) {
	            var newBound = range.startContainer;

	            // 레인지 확장
	            while (newBound.parentNode !== range.commonAncestorContainer && newBound.parentNode !== this.wwe.get$Body()[0] && !newBound.previousSibling) {
	                newBound = newBound.parentNode;
	            }

	            // range단위를 한단계 확장 deleteContents는 start, end에 걸린 컨테이너 자체는 안지운다.
	            range.setStart(newBound.parentNode, _domUtils2.default.getNodeOffsetOfParent(newBound));

	            return range;
	        }

	        /**
	         * Extends current range's endContainer
	         * @memberOf WwClipboardManager
	         * @param {Range} range Range object
	         * @returns {Range}
	         * @private
	         */

	    }, {
	        key: '_extendEndRange',
	        value: function _extendEndRange(range) {
	            var newBound = range.endContainer;
	            var boundNext = newBound.nextSibling;

	            // 레인지 확장
	            while (newBound.parentNode !== range.commonAncestorContainer && newBound.parentNode !== this.wwe.get$Body()[0] && (!boundNext || _domUtils2.default.getNodeName(boundNext) === 'BR' && newBound.parentNode.lastChild === boundNext)) {
	                newBound = newBound.parentNode;
	                boundNext = newBound.nextSibling;
	            }

	            // range단위를 부모래밸로 한단계 확장 deleteContents는 start, end에 걸린 컨테이너 자체는 안지운다.
	            range.setEnd(newBound.parentNode, _domUtils2.default.getNodeOffsetOfParent(newBound) + 1);

	            return range;
	        }

	        /**
	         * _isWholeCommonAncestorContainerSelected
	         * Check whether whole commonAncestorContainter textContent selected or not
	         * 선택된 영역이 commonAncestorContainer의 모든 컨텐츠인치 체크
	         * @memberOf WwClipboardManager
	         * @param {Range} range Range object
	         * @returns {boolean} result
	         * @private
	         */

	    }, {
	        key: '_isWholeCommonAncestorContainerSelected',
	        value: function _isWholeCommonAncestorContainerSelected(range) {
	            return range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE && range.commonAncestorContainer !== this.wwe.get$Body()[0] && range.startOffset === 0 && range.endOffset === range.commonAncestorContainer.childNodes.length && range.commonAncestorContainer === range.startContainer && range.commonAncestorContainer === range.endContainer;
	        }

	        /**
	         * Table cut and copy action helper for safari and IE's
	         * @param {string} [action] Boolean value for cut action
	         * @private
	         */

	    }, {
	        key: '_executeActionFor',
	        value: function _executeActionFor(action) {
	            this._saveLastestClipboardRangeInfo();
	            if (action === 'cut') {
	                this.wwe.postProcessForChange();
	            }
	        }

	        /**
	         * Replace pasteData to lastClipboardRangeInfo's data
	         * @param {object} pasteData Clipboard data
	         * @private
	         */

	    }, {
	        key: '_addRangeInfoAndReplaceFragmentIfNeed',
	        value: function _addRangeInfoAndReplaceFragmentIfNeed(pasteData) {
	            var hasRangeInfo = !!this._latestClipboardRangeInfo;
	            var savedContents = hasRangeInfo && this._latestClipboardRangeInfo.contents;
	            var isSameContents = savedContents.textContent === pasteData.fragment.textContent;

	            if (hasRangeInfo) {
	                pasteData.rangeInfo = this._latestClipboardRangeInfo;

	                if (isSameContents) {
	                    pasteData.fragment = $(savedContents).clone()[0];
	                }
	            }
	        }
	    }]);

	    return WwClipboardManager;
	}();

	module.exports = WwClipboardManager;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements WwPasteContentHelper
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _domUtils = __webpack_require__(8);

	var _domUtils2 = _interopRequireDefault(_domUtils);

	var _htmlSanitizer = __webpack_require__(11);

	var _htmlSanitizer2 = _interopRequireDefault(_htmlSanitizer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var util = tui.util;

	/**
	 * WwPasteContentHelper
	 * @exports WwPasteContentHelper
	 * @class WwPasteContentHelper
	 * @constructor
	 * @param {WysiwygEditor} wwe wysiwygEditor instance
	 */

	var WwPasteContentHelper = function () {
	    function WwPasteContentHelper(wwe) {
	        _classCallCheck(this, WwPasteContentHelper);

	        this.wwe = wwe;
	    }

	    /**
	     * Process paste data before paste
	     * @api
	     * @memberOf WwPasteContentHelper
	     * @param {object} pasteData Pasting data
	     */


	    _createClass(WwPasteContentHelper, [{
	        key: 'preparePaste',
	        value: function preparePaste(pasteData) {
	            var range = this.wwe.getEditor().getSelection().cloneRange();
	            var codeblockManager = this.wwe.getManager('codeblock');
	            var tableManager = this.wwe.getManager('table');
	            var firstBlockIsTaken = false;
	            var newFragment = this.wwe.getEditor().getDocument().createDocumentFragment();
	            var nodeName = void 0,
	                node = void 0,
	                isPastingList = void 0;

	            pasteData.fragment = this._pasteFirstAid(pasteData.fragment);

	            var childNodes = util.toArray(pasteData.fragment.childNodes);

	            // prepare to paste as inline of first node if possible
	            // 앞부분의 인라인으로 붙일수 있느부분은 인라인으로 붙을수 있도록 처리
	            if (childNodes.length && childNodes[0].tagName === 'DIV') {
	                $(newFragment).append(this._unwrapFragmentFirstChildForPasteAsInline(childNodes[0]));
	                childNodes.shift();
	            }

	            while (childNodes.length) {
	                node = childNodes[0];
	                nodeName = _domUtils2.default.getNodeName(node);
	                isPastingList = nodeName === 'LI' || nodeName === 'UL' || nodeName === 'OL';

	                if (codeblockManager.isInCodeBlock(range)) {
	                    newFragment.appendChild(codeblockManager.prepareToPasteOnCodeblock(childNodes));
	                } else if (tableManager.isInTable(range)) {
	                    newFragment = tableManager.prepareToPasteOnTable(pasteData, node);
	                    childNodes.shift();
	                } else if (isPastingList) {
	                    newFragment.appendChild(this._prepareToPasteList(childNodes, pasteData.rangeInfo, firstBlockIsTaken));
	                    // 첫번째 현재위치와 병합될 가능성이있는 컨텐츠가 만들어진경우는 이후 위치에 대한 정보가 필요없다
	                    firstBlockIsTaken = true;
	                } else {
	                    newFragment.appendChild(childNodes.shift());
	                }
	            }

	            pasteData.fragment = newFragment;
	        }

	        /**
	         * Wrap orphan node(inline, text) with div element
	         * @param {DocumentFragment} fragment - Fragment of paste data
	         * @memberOf WwPasteContentHelper
	         * @returns {DocumentFragment}
	         * @private
	         */

	    }, {
	        key: '_wrapOrphanNodeWithDiv',
	        value: function _wrapOrphanNodeWithDiv(fragment) {
	            var newFrag = document.createDocumentFragment();
	            var array = util.toArray(fragment.childNodes);
	            var currentDiv = void 0;

	            util.forEachArray(array, function (node) {
	                var isTextNode = node.nodeType === 3;
	                /* eslint-disable max-len */
	                var isInlineNode = /^(SPAN|A|CODE|EM|I|STRONG|B|S|ABBR|ACRONYM|CITE|DFN|KBD|SAMP|VAR|BDO|Q|SUB|SUP)$/ig.test(node.tagName);
	                /* eslint-enable max-len */

	                if (isTextNode || isInlineNode) {
	                    if (!currentDiv) {
	                        currentDiv = document.createElement('div');
	                        newFrag.appendChild(currentDiv);
	                    }

	                    currentDiv.appendChild(node);
	                } else {
	                    if (currentDiv && currentDiv.lastChild.tagName !== 'BR') {
	                        currentDiv.appendChild($('<br/>')[0]);
	                    }

	                    currentDiv = null;
	                    newFrag.appendChild(node);
	                }
	            });

	            return newFrag;
	        }

	        /**
	         * Processing paste data after paste
	         * @param {DocumentFragment} fragment Pasting data
	         * @memberOf WwPasteContentHelper
	         * @returns {DocumentFragment}
	         * @private
	         */

	    }, {
	        key: '_pasteFirstAid',
	        value: function _pasteFirstAid(fragment) {
	            var _this = this;

	            var blockTags = 'div, section, article, aside, nav, menus, p';

	            fragment = (0, _htmlSanitizer2.default)(fragment);

	            $(fragment).find('*').each(function (i, node) {
	                _this._removeStyles(node);
	            });

	            this._unwrapIfNonBlockElementHasBr(fragment);
	            this._unwrapNestedBlocks(fragment, blockTags);

	            this._removeUnnecessaryBlocks(fragment, blockTags);
	            this._removeStyles(fragment);

	            fragment = this._wrapOrphanNodeWithDiv(fragment);

	            this._preElementAid(fragment);

	            this._tableElementAid(fragment);

	            $(fragment).children('br').remove();

	            return fragment;
	        }

	        /**
	         * PRE tag formatting
	         * @memberOf WwPasteContentHelper
	         * @private
	         * @param {DocumentFragment} nodes Pasting DocumentFragment
	         */

	    }, {
	        key: '_preElementAid',
	        value: function _preElementAid(nodes) {
	            var codeblockManager = this.wwe.getManager('codeblock');

	            codeblockManager.splitCodeblockToEachLine(nodes);
	        }

	        /**
	         * Unwrap span children of document fragment with div element
	         * @param {DocumentFragment} fragment - Fragment of paste data
	         * @memberOf WwPasteContentHelper
	         * @private
	         */

	    }, {
	        key: '_unwrapIfNonBlockElementHasBr',
	        value: function _unwrapIfNonBlockElementHasBr(fragment) {
	            var nonBlockElements = $(fragment).find('span, a, b, em, i, s');

	            nonBlockElements.each(function (i, node) {
	                var brChildren = $(node).children('br');

	                if (brChildren.length && node.nodeName !== 'LI' && node.nodeName !== 'UL') {
	                    brChildren.eq(0).unwrap();
	                }
	            });
	        }

	        /**
	         * Unwrap nested block elements
	         * @param {DocumentFragment} fragment - Fragment of paste data
	         * @param {string} blockTags - Tag names of block tag
	         * @private
	         */

	    }, {
	        key: '_unwrapNestedBlocks',
	        value: function _unwrapNestedBlocks(fragment, blockTags) {
	            var leafElements = $(fragment).find(':not(:has(*))').not('b,s,i,em,code,span');

	            leafElements.each(function (i, node) {
	                var leafElement = node.nodeName === 'BR' ? $(node.parentNode) : $(node);
	                var parent = void 0;

	                while (leafElement.parents(blockTags).length) {
	                    parent = leafElement.parent(blockTags);

	                    if (parent.length) {
	                        leafElement.unwrap();
	                    } else {
	                        leafElement = leafElement.parent();
	                    }
	                }
	            });
	        }

	        /**
	         * Remove unnecessary block element in pasting data
	         * @param {DocumentFragment} fragment Pasting DocumentFragment
	         * @param {string} blockTags - Tag names of block tag
	         * @memberOf WwPasteContentHelper
	         * @private
	         */

	    }, {
	        key: '_removeUnnecessaryBlocks',
	        value: function _removeUnnecessaryBlocks(fragment, blockTags) {
	            $(fragment).find(blockTags).each(function (index, blockElement) {
	                var $blockElement = $(blockElement);
	                var tagName = blockElement.tagName;
	                var isDivElement = tagName === 'DIV';
	                var isInListItem = $blockElement.parent('li').length !== 0;
	                var isInBlockquote = $blockElement.parent('blockquote').length !== 0;
	                var hasBlockChildElement = $blockElement.children(blockTags).length;

	                if (isDivElement && (isInListItem || isInBlockquote || !hasBlockChildElement)) {
	                    return;
	                }

	                $blockElement.replaceWith($blockElement.html());
	            });
	        }

	        /**
	         * Remove inline style
	         * @param {Node} node Node for remove style attribute
	         * @memberOf WwPasteContentHelper
	         * @private
	         */

	    }, {
	        key: '_removeStyles',
	        value: function _removeStyles(node) {
	            var $node = $(node);
	            var colorValue = void 0;

	            if (_domUtils2.default.getNodeName($node[0]) !== 'SPAN') {
	                $node.removeAttr('style');
	            } else {
	                // Most browser return computed color value even if without style attribute
	                if ($node.attr('style')) {
	                    colorValue = $node.css('color');
	                }

	                $node.removeAttr('style');

	                if (colorValue) {
	                    $node.css('color', colorValue);
	                } else {
	                    $node.contents().unwrap();
	                }
	            }
	        }

	        /**
	         * Processing before paste list
	         * @param {Array.<HTMLElement>} nodes Pasting data
	         * @param {object} rangeInfo Range information
	         * @param {boolean} firstBlockIsTaken Whether first block element taken or not
	         * @returns {DocumentFragment}
	         * @memberOf WwPasteContentHelper
	         * @private
	         */

	    }, {
	        key: '_prepareToPasteList',
	        value: function _prepareToPasteList(nodes, rangeInfo, firstBlockIsTaken) {
	            var nodeName = _domUtils2.default.getNodeName(nodes[0]);
	            var node = nodes.shift();
	            var newFragment = this.wwe.getEditor().getDocument().createDocumentFragment();

	            // IE에서는 LI-UL 구조에서 UL이 전체가 선택되었는데 LI를 포함하지 않고 UL만 넘어올때가 있다.
	            if (nodeName !== 'LI' && nodes.length && nodes[0].tagName === 'LI') {
	                nodeName = 'LI';

	                node = this._makeNodeAndAppend({
	                    tagName: nodeName
	                }, node);
	            }

	            // UL과 OL이고 리스트에 paste하는경우 뎊스처리
	            if (nodeName === 'OL' || nodeName === 'UL') {
	                // 페이스트 데이터의 첫번째 블럭요소가 이미 만들어졌다면 커서의 위치에 대한 대응은 하지 않는다.
	                if (!firstBlockIsTaken && this.wwe.getEditor().hasFormat('LI')) {
	                    $(newFragment).append(this._wrapCurrentFormat(node));
	                } else {
	                    $(newFragment).append(node);
	                }
	            } else if (nodeName === 'LI') {
	                // 리스트 그룹처리
	                var listGroup = this.wwe.getEditor().getDocument().createDocumentFragment();
	                listGroup.appendChild(node);

	                while (nodes.length && nodes[0].tagName === 'LI') {
	                    listGroup.appendChild(nodes.shift());
	                }

	                // 리스트에 붙는경우 뎊스 연결
	                // 페이스트 데이터의 첫번째 블럭요소가 이미 만들어졌다면 커서의 위치에 대한 대응은 하지 않는다.
	                if (!firstBlockIsTaken && this.wwe.getEditor().hasFormat('LI')) {
	                    $(newFragment).append(this._wrapCurrentFormat(listGroup));
	                    // 카피할당시의 정보가 있다면 해당 리스트로 만듬
	                } else if (rangeInfo && (rangeInfo.commonAncestorName === 'UL' || rangeInfo.commonAncestorName === 'OL')) {
	                    $(newFragment).append(this._makeNodeAndAppend({
	                        tagName: rangeInfo.commonAncestorName
	                    }, listGroup));
	                    // 외부에서온 리스트
	                } else {
	                    $(newFragment).append(this._makeNodeAndAppend({
	                        tagName: 'UL'
	                    }, listGroup));
	                }
	            }

	            return newFragment;
	        }

	        /**
	         * Unwrap fragment first child for pasting node inline
	         * @memberOf WwPasteContentHelper
	         * @private
	         * @param {Node} node Pasting DocumentFragment
	         * @returns {NodeList}
	         */

	    }, {
	        key: '_unwrapFragmentFirstChildForPasteAsInline',
	        value: function _unwrapFragmentFirstChildForPasteAsInline(node) {
	            $(node).find('br').remove();

	            return node.childNodes;
	        }

	        /**
	         * Wrap nodes with current format
	         * @param {DocumentFragment} nodes P
	         * @returns {HTMLElement}
	         * @private
	         */

	    }, {
	        key: '_wrapCurrentFormat',
	        value: function _wrapCurrentFormat(nodes) {
	            var _this2 = this;

	            var currentTagName = void 0;

	            // 붙여질 뎊스에 맞게 확장
	            this._eachCurrentPath(function (path) {
	                if (path.tagName !== 'DIV') {
	                    // 프레그먼트 노드인경우와 한번이상 감싸진 노드임
	                    if (_domUtils2.default.isElemNode(nodes)) {
	                        currentTagName = nodes.tagName;
	                    } else {
	                        currentTagName = nodes.firstChild.tagName;
	                    }

	                    if (path.tagName !== currentTagName) {
	                        nodes = _this2._makeNodeAndAppend(path, nodes);
	                    }
	                }
	            });

	            return nodes;
	        }
	    }, {
	        key: '_eachCurrentPath',
	        value: function _eachCurrentPath(iteratee) {
	            var paths = _domUtils2.default.getPath(this.wwe.getEditor().getSelection().startContainer, this.wwe.get$Body()[0]);

	            for (var i = paths.length - 1; i > -1; i -= 1) {
	                iteratee(paths[i]);
	            }
	        }

	        /** _makeNodeAndAppend
	         * make node and append their own children
	         * @param {HTMLElement} pathInfo HTMLElement to make
	         * @param {HTMLElement} content Nodes to append
	         * @returns {HTMLElement} node
	         * @memberOf WwPasteContentHelper
	         * @private
	         */

	    }, {
	        key: '_makeNodeAndAppend',
	        value: function _makeNodeAndAppend(pathInfo, content) {
	            var node = $('<' + pathInfo.tagName + '/>');

	            node.append(content);

	            if (pathInfo.id) {
	                node.attr('id', pathInfo.id);
	            }

	            if (pathInfo.className) {
	                node.addClass(pathInfo.className);
	            }

	            return node[0];
	        }

	        /**
	         * Pasting table element pre-process
	         * @param {DocumentFragment} fragment pasteData's fragment
	         * @memberOf WwPasteContentHelper
	         * @private
	         */

	    }, {
	        key: '_tableElementAid',
	        value: function _tableElementAid(fragment) {
	            this._completeTableIfNeed(fragment);
	            this._updateTableIDClassName(fragment);
	        }

	        /**
	         * Complete and append table to fragment
	         * @param {DocumentFragment} fragment Copied data
	         * @private
	         */

	    }, {
	        key: '_completeTableIfNeed',
	        value: function _completeTableIfNeed(fragment) {
	            var tableManager = this.wwe.getManager('table');
	            var wrapperTr = tableManager.wrapDanglingTableCellsIntoTrIfNeed(fragment);

	            if (wrapperTr) {
	                $(fragment).append(wrapperTr);
	            }

	            var wrapperTbody = tableManager.wrapTrsIntoTbodyIfNeed(fragment);

	            if (wrapperTbody) {
	                $(fragment).append(wrapperTbody);
	            }

	            var wrapperTable = tableManager.wrapTheadAndTbodyIntoTableIfNeed(fragment);

	            if (wrapperTable) {
	                $(fragment).append(wrapperTable);
	            }
	        }

	        /**
	         * Update table ID class name in fragment
	         * @param {DocumentFragment} fragment Copied data
	         * @private
	         */

	    }, {
	        key: '_updateTableIDClassName',
	        value: function _updateTableIDClassName(fragment) {
	            var tableManager = this.wwe.getManager('table');

	            $(fragment).find('table').each(function (index, table) {
	                $(table).removeClass(function (idx, className) {
	                    return className.replace(/.*\s*(te-content-table-\d+)\s*.*/, '$1');
	                });
	            });

	            $(fragment).find('table').each(function (index, table) {
	                $(table).addClass(tableManager.getTableIDClassName());
	            });
	        }
	    }]);

	    return WwPasteContentHelper;
	}();

	module.exports = WwPasteContentHelper;

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * @fileoverview Implements htmlSanitizer
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var util = tui.util;

	var HTML_ATTR_LIST_RX = new RegExp('^(abbr|align|alt|axis|bgcolor|border|cellpadding|cellspacing|class|clear|' + 'color|cols|colspan|compact|coords|dir|face|headers|height|hreflang|hspace|' + 'ismap|lang|language|nohref|nowrap|rel|rev|rows|rowspan|rules|' + 'scope|scrolling|shape|size|span|start|summary|tabindex|target|title|type|' + 'valign|value|vspace|width|checked|mathvariant|encoding|id|name|' + 'background|cite|href|longdesc|src|usemap|xlink:href|data-+|checked|style)', 'g');

	var SVG_ATTR_LIST_RX = new RegExp('^(accent-height|accumulate|additive|alphabetic|arabic-form|ascent|' + 'baseProfile|bbox|begin|by|calcMode|cap-height|class|color|color-rendering|content|' + 'cx|cy|d|dx|dy|descent|display|dur|end|fill|fill-rule|font-family|font-size|font-stretch|' + 'font-style|font-variant|font-weight|from|fx|fy|g1|g2|glyph-name|gradientUnits|hanging|' + 'height|horiz-adv-x|horiz-origin-x|ideographic|k|keyPoints|keySplines|keyTimes|lang|' + 'marker-end|marker-mid|marker-start|markerHeight|markerUnits|markerWidth|mathematical|' + 'max|min|offset|opacity|orient|origin|overline-position|overline-thickness|panose-1|' + 'path|pathLength|points|preserveAspectRatio|r|refX|refY|repeatCount|repeatDur|' + 'requiredExtensions|requiredFeatures|restart|rotate|rx|ry|slope|stemh|stemv|stop-color|' + 'stop-opacity|strikethrough-position|strikethrough-thickness|stroke|stroke-dasharray|' + 'stroke-dashoffset|stroke-linecap|stroke-linejoin|stroke-miterlimit|stroke-opacity|' + 'stroke-width|systemLanguage|target|text-anchor|to|transform|type|u1|u2|underline-position|' + 'underline-thickness|unicode|unicode-range|units-per-em|values|version|viewBox|visibility|' + 'width|widths|x|x-height|x1|x2|xlink:actuate|xlink:arcrole|xlink:role|xlink:show|xlink:title|' + 'xlink:type|xml:base|xml:lang|xml:space|xmlns|xmlns:xlink|y|y1|y2|zoomAndPan)', 'g');

	/**
	 * htmlSanitizer
	 * @api
	 * @exports htmlSanitizer
	 * @param {string|Node} html html or Node
	 * @param {boolean} [needHtmlText] pass true if need html text
	 * @returns {string|DocumentFragment} result
	 */
	function htmlSanitizer(html, needHtmlText) {
	    var $html = $('<div />');

	    $html.append(html);

	    removeUnnecessaryTags($html);
	    leaveOnlyWhitelistAttribute($html);

	    return finalizeHtml($html, needHtmlText);
	}

	/**
	 * Remove unnecessary tags
	 * @private
	 * @param {jQuery} $html jQuery instance
	 */
	function removeUnnecessaryTags($html) {
	    $html.find('script, iframe, textarea, form, button, select').remove();
	}

	/**
	 * Leave only white list attributes
	 * @private
	 * @param {jQuery} $html jQuery instance
	 */
	function leaveOnlyWhitelistAttribute($html) {
	    $html.find('*').each(function (index, node) {
	        var blacklist = util.toArray(node.attributes).filter(function (attr) {
	            var isHTMLAttr = attr.name.match(HTML_ATTR_LIST_RX);
	            var isSVGAttr = attr.name.match(SVG_ATTR_LIST_RX);

	            return !isHTMLAttr && !isSVGAttr;
	        });

	        util.forEachArray(blacklist, function (attr) {
	            node.attributes.removeNamedItem(attr.name);
	        });
	    });
	}

	/**
	 * Finalize html result
	 * @private
	 * @param {jQuery} $html jQuery instance
	 * @param {boolean} needHtmlText pass true if need html text
	 * @returns {string|DocumentFragment} result
	 */
	function finalizeHtml($html, needHtmlText) {
	    var returnValue = void 0;

	    if (needHtmlText) {
	        returnValue = $html[0].innerHTML;
	    } else {
	        var frag = document.createDocumentFragment();
	        var childNodes = tui.util.toArray($html[0].childNodes);
	        var length = childNodes.length;

	        for (var i = 0; i < length; i += 1) {
	            frag.appendChild(childNodes[i]);
	        }
	        returnValue = frag;
	    }

	    return returnValue;
	}

	module.exports = htmlSanitizer;

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @fileoverview Implements wysiwyg list manager
	 * @author Junghwan Park(junghwan.pakr@nhnent.com) FE Development Team/NHN Ent.
	 */

	var FIND_LI_ELEMENT = /<li/i;

	/**
	 * WwListManager
	 * @exports WwListManager
	 * @constructor
	 * @class WwListManager
	 * @param {WysiwygEditor} wwe WysiwygEditor instance
	 */

	var WwListManager = function () {
	    function WwListManager(wwe) {
	        _classCallCheck(this, WwListManager);

	        this.wwe = wwe;
	        this.eventManager = wwe.eventManager;

	        /**
	         * Name property
	         * @api
	         * @memberOf WwListManager
	         * @type {string}
	         */
	        this.name = 'list';

	        this._init();
	    }

	    /**
	     * _init
	     * Initialize
	     * @memberOf WwListManager
	     * @private
	     */


	    _createClass(WwListManager, [{
	        key: '_init',
	        value: function _init() {
	            this._initEvent();
	            this._initKeyHandler();
	        }

	        /**
	         * _initEvent
	         * Initialize event
	         * @memberOf WwListManager
	         * @private
	         */

	    }, {
	        key: '_initEvent',
	        value: function _initEvent() {
	            var _this = this;

	            this.eventManager.listen('wysiwygRangeChangeAfter', function () {
	                _this._findAndRemoveEmptyList();
	                _this._removeBranchListAll();
	                _this._wrapDefaultBlockToListInner();
	            });

	            this.eventManager.listen('wysiwygSetValueAfter', function () {
	                _this._removeBranchListAll();
	                _this._wrapDefaultBlockToListInner();
	            });

	            this.eventManager.listen('wysiwygProcessHTMLText', function (html) {
	                return _this._prepareInsertBlankToBetweenSameList(html);
	            });

	            this.eventManager.listen('convertorAfterHtmlToMarkdownConverted', function (markdown) {
	                return markdown.replace(/:BLANK_LINE:\n/g, '');
	            });
	        }
	    }, {
	        key: '_initKeyHandler',
	        value: function _initKeyHandler() {
	            var _this2 = this;

	            this.wwe.addKeyEventHandler('TAB', function (ev, range) {
	                var isNeedNext = void 0;

	                if (range.collapsed) {
	                    if (_this2.wwe.getEditor().hasFormat('LI')) {
	                        ev.preventDefault();
	                        _this2.eventManager.emit('command', 'IncreaseDepth');

	                        isNeedNext = false;
	                    }
	                }

	                return isNeedNext;
	            });

	            this.wwe.addKeyEventHandler('SHIFT+TAB', function (ev, range) {
	                var isNeedNext = void 0;

	                if (range.collapsed) {
	                    if (_this2.wwe.getEditor().hasFormat('LI')) {
	                        ev.preventDefault();
	                        var $ul = $(range.startContainer).closest('li').children('ul, ol');

	                        _this2.eventManager.emit('command', 'DecreaseDepth');

	                        if ($ul.length && !$ul.prev().length) {
	                            _this2._removeBranchList($ul);
	                        }

	                        isNeedNext = false;
	                    }
	                }

	                return isNeedNext;
	            });

	            this.wwe.addKeyEventHandler('ENTER', function (ev, range) {
	                if (range.collapsed) {
	                    if (_this2.wwe.getEditor().hasFormat('LI')) {
	                        _this2.wwe.defer(function () {
	                            var afterRange = _this2.wwe.getRange();
	                            var $li = $(afterRange.startContainer).parents('li').eq(0);
	                            _this2._removeBranchListAll($li);
	                        });
	                    }
	                }
	            });

	            this.wwe.addKeyEventHandler('BACK_SPACE', function (ev, range) {
	                if (range.collapsed) {
	                    if (_this2.wwe.getEditor().hasFormat('LI')) {
	                        _this2.wwe.defer(function () {
	                            _this2._removeBranchListAll();
	                        });
	                    }
	                }
	            });
	        }

	        /**
	         * Find empty list for whole container and remove it.
	         * @memberOf WwListManager
	         * @private
	         */

	    }, {
	        key: '_findAndRemoveEmptyList',
	        value: function _findAndRemoveEmptyList() {
	            this.wwe.get$Body().find('ul,ol').each(function (index, node) {
	                if (!FIND_LI_ELEMENT.test(node.innerHTML)) {
	                    $(node).remove();
	                }
	            });
	        }

	        /**
	         * Remove branch lists all from body
	         * @memberOf WwListManager
	         * @private
	         * @param {jQuery|HTMLElement} $root root to remove branch list
	         */

	    }, {
	        key: '_removeBranchListAll',
	        value: function _removeBranchListAll($root) {
	            var _this3 = this;

	            $root = !$root ? this.wwe.get$Body() : $($root);

	            $root.find('li ul, li ol').each(function (idx, node) {
	                if (!node || node.previousSibling) {
	                    return;
	                }
	                _this3._removeBranchList(node);
	            });
	        }

	        /**
	         * Remove branch list of passed list(ul, ol)
	         * @memberOf WwListManager
	         * @param {HTMLElement} list list
	         * @private
	         */

	    }, {
	        key: '_removeBranchList',
	        value: function _removeBranchList(list) {
	            var $list = $(list);
	            var $branchRoot = $list;

	            while (!$branchRoot[0].previousSibling && $branchRoot[0].parentElement.tagName.match(/UL|OL|LI/g)) {
	                $branchRoot = $branchRoot.parent();
	            }

	            var $firstLi = $branchRoot.children('li').eq(0);

	            $branchRoot.prepend($list.children().unwrap());

	            $firstLi.remove();
	        }

	        /**
	         * _wrapDefaultBlockToListInner
	         * Wrap default block to list inner contents
	         * @private
	         */

	    }, {
	        key: '_wrapDefaultBlockToListInner',
	        value: function _wrapDefaultBlockToListInner() {
	            this.wwe.get$Body().find('li').each(function (index, node) {
	                if ($(node).children('div, p').length <= 0) {
	                    $(node).wrapInner('<div />');
	                    $(node).find('div').children('ul, ol').appendTo(node);
	                }
	            });
	        }
	    }, {
	        key: '_prepareInsertBlankToBetweenSameList',
	        value: function _prepareInsertBlankToBetweenSameList(html) {
	            return html.replace(/<\/(ul|ol)>(<br \/>|<br>){0,}<\1>/g, '</$1>:BLANK_LINE:<$1>');
	        }
	    }]);

	    return WwListManager;
	}();

	module.exports = WwListManager;

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @fileoverview Implements wysiwyg task manager
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var TASK_CLASS_NAME = 'task-list-item';
	var TASK_ATTR_NAME = 'data-te-task';
	var TASK_CHECKED_CLASS_NAME = 'checked';

	/**
	 * WwTaskManager
	 * @exports WwTaskManager
	 * @class WwTaskManager
	 * @constructor
	 * @param {WysiwygEditor} wwe WysiwygEditor instance
	 */

	var WwTaskManager = function () {
	    function WwTaskManager(wwe) {
	        _classCallCheck(this, WwTaskManager);

	        this.wwe = wwe;
	        this.eventManager = wwe.eventManager;

	        /**
	         * Name property
	         * @api
	         * @memberOf WwTaskManager
	         * @type {string}
	         */
	        this.name = 'task';

	        this._init();
	    }

	    /**
	     * _init
	     * Init
	     * @memberOf WwTaskManager
	     * @private
	     */


	    _createClass(WwTaskManager, [{
	        key: '_init',
	        value: function _init() {
	            this._initKeyHandler();
	            this._initEvent();

	            this.wwe.getEditor().addEventListener('mousedown', function (ev) {
	                var isOnTaskBox = ev.offsetX < 18 && ev.offsetY < 18;

	                if (ev.target.hasAttribute(TASK_ATTR_NAME) && isOnTaskBox) {
	                    $(ev.target).toggleClass(TASK_CHECKED_CLASS_NAME);
	                }
	            });
	        }

	        /**
	         * _initEvent
	         * Initialize event
	         * @memberOf WwTaskManager
	         * @private
	         */

	    }, {
	        key: '_initEvent',
	        value: function _initEvent() {
	            var _this = this;

	            this.eventManager.listen('wysiwygSetValueAfter', function () {
	                _this._removeTaskListClass();
	            });
	        }

	        /**
	         * _initKeyHandler
	         * Initialize key event handler
	         * @memberOf WwTaskManager
	         * @private
	         */

	    }, {
	        key: '_initKeyHandler',
	        value: function _initKeyHandler() {
	            var _this2 = this;

	            this.wwe.addKeyEventHandler('ENTER', function (ev, range) {
	                if (_this2.isInTaskList(range)) {
	                    _this2.wwe.defer(function () {
	                        var newRange = _this2.wwe.getRange();
	                        var $li = $(newRange.startContainer).closest('li');
	                        $li.removeClass(TASK_CHECKED_CLASS_NAME);
	                    });
	                }
	            });
	        }

	        /**
	         * isInTaskList
	         * Check whether passed range is in task list or not
	         * @param {Range} range range
	         * @returns {boolean} result
	         * @memberOf WwTaskManager
	         * @api
	         */

	    }, {
	        key: 'isInTaskList',
	        value: function isInTaskList(range) {
	            var li = void 0;

	            if (!range) {
	                range = this.wwe.getEditor().getSelection().cloneRange();
	            }

	            if (range.startContainer.nodeType === Node.ELEMENT_NODE && range.startContainer.tagName === 'LI') {
	                li = range.startContainer;
	            } else {
	                li = $(range.startContainer).parents('li')[0];
	            }

	            return $(li).hasClass(TASK_CLASS_NAME);
	        }

	        /**
	         * unformatTask
	         * Unforamt task
	         * @param {Node} node target
	         * @memberOf WwTaskManager
	         * @api
	         */

	    }, {
	        key: 'unformatTask',
	        value: function unformatTask(node) {
	            var $li = $(node).closest('li');

	            $li.removeClass(TASK_CLASS_NAME);
	            $li.removeClass(TASK_CHECKED_CLASS_NAME);

	            $li.removeAttr(TASK_ATTR_NAME);

	            if (!$li.attr('class')) {
	                $li.removeAttr('class');
	            }
	        }

	        /**
	         * formatTask
	         * Format task
	         * @param {Node} node target
	         * @memberOf WwTaskManager
	         * @api
	         */

	    }, {
	        key: 'formatTask',
	        value: function formatTask(node) {
	            var $selected = $(node);
	            var $li = $selected.closest('li');

	            $li.addClass(TASK_CLASS_NAME);
	            $li.attr(TASK_ATTR_NAME, '');
	        }

	        /**
	         * _formatTaskIfNeed
	         * Format task if current range has task class name
	         * @memberOf WwTaskManager
	         * @private
	         */

	    }, {
	        key: '_formatTaskIfNeed',
	        value: function _formatTaskIfNeed() {
	            var range = this.wwe.getEditor().getSelection().cloneRange();

	            if (this.isInTaskList(range)) {
	                this.formatTask(range.startContainer);
	            }
	        }

	        /**
	         * _removeTaskListClass
	         * Remove tasklist class
	         * @memberOf WwTaskManager
	         * @private
	         */

	    }, {
	        key: '_removeTaskListClass',
	        value: function _removeTaskListClass() {
	            // because task-list class is block merge normal list and task list
	            this.wwe.get$Body().find('.task-list').each(function (index, node) {
	                $(node).removeClass('task-list');
	            });
	        }
	    }]);

	    return WwTaskManager;
	}();

	module.exports = WwTaskManager;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg table manager
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _domUtils = __webpack_require__(8);

	var _domUtils2 = _interopRequireDefault(_domUtils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var isIE10 = tui.util.browser.msie && tui.util.browser.version === 10;
	var TABLE_COMPLETION_DELAY = 10;
	var SET_SELECTION_DELAY = 50;
	var TABLE_CLASS_PREFIX = 'te-content-table-';
	var isIE10And11 = tui.util.browser.msie && (tui.util.browser.version === 10 || tui.util.browser.version === 11);

	/**
	 * WwTableManager
	 * @exports WwTableManager
	 * @constructor
	 * @class WwTableManager
	 * @param {WysiwygEditor} wwe WysiwygEditor instance
	 */

	var WwTableManager = function () {
	    function WwTableManager(wwe) {
	        _classCallCheck(this, WwTableManager);

	        this.wwe = wwe;
	        this.eventManager = wwe.eventManager;

	        /**
	         * Name property
	         * @api
	         * @memberOf WwTableManager
	         * @type {string}
	         */
	        this.name = 'table';

	        this._lastCellNode = null;
	        this._init();
	    }

	    /**
	     * _init
	     * Initialize
	     * @memberOf WwTableManager
	     * @private
	     */


	    _createClass(WwTableManager, [{
	        key: '_init',
	        value: function _init() {
	            this._initKeyHandler();
	            this._initEvent();
	            this.tableID = 0;
	        }

	        /**
	         * _initEvent
	         * Initialize event
	         * @memberOf WwTableManager
	         * @private
	         */

	    }, {
	        key: '_initEvent',
	        value: function _initEvent() {
	            var _this = this;

	            this.eventManager.listen('wysiwygRangeChangeAfter', function () {
	                _this._unwrapBlockInTable();
	                _this.wwe.defer(function () {
	                    _this._completeTableIfNeed();
	                }, TABLE_COMPLETION_DELAY);
	                _this.wwe.getManager('tableSelection').removeClassAttrbuteFromAllCellsIfNeed();
	                _this._insertDefaultBlockBetweenTable();
	            });

	            this.eventManager.listen('wysiwygSetValueAfter', function () {
	                _this._unwrapBlockInTable();
	                _this._insertDefaultBlockBetweenTable();
	            });

	            // remove last br in td or th
	            this.eventManager.listen('wysiwygProcessHTMLText', function (html) {
	                return html.replace(/<br \/>(<\/td>|<\/th>)/g, '$1');
	            });

	            this.wwe.getEditor().addEventListener('paste', function (ev) {
	                var range = _this.wwe.getEditor().getSelection();
	                var isNotPastingIntoTextNode = !_domUtils2.default.isTextNode(range.commonAncestorContainer);

	                if (_this.isInTable(range) && !range.collapsed && isNotPastingIntoTextNode) {
	                    ev.preventDefault();
	                }
	                _this.wwe.defer(function () {
	                    _this._completeTableIfNeed();
	                }, TABLE_COMPLETION_DELAY);
	            });
	        }

	        /**
	         * _initKeyHandler
	         * Initialize key event handler
	         * @memberOf WwTableManager
	         * @private
	         */

	    }, {
	        key: '_initKeyHandler',
	        value: function _initKeyHandler() {
	            var _this2 = this;

	            var selectionManager = this.wwe.getManager('tableSelection');

	            this.wwe.addKeyEventHandler(function (ev, range, keymap) {
	                var isRangeInTable = _this2.isInTable(range);

	                if (isRangeInTable && !_this2._isSingleModifierKey(keymap)) {
	                    _this2._recordUndoStateIfNeed(range);
	                    _this2._removeBRIfNeed(range);
	                    _this2._removeContentsAndChangeSelectionIfNeed(range, keymap, ev);
	                } else if (!isRangeInTable && _this2._lastCellNode) {
	                    _this2._recordUndoStateAndResetCellNode(range);
	                }

	                if (isRangeInTable && !_this2._isModifierKeyPushed(ev)) {
	                    _this2.wwe.getEditor().modifyDocument(function () {
	                        selectionManager.removeClassAttrbuteFromAllCellsIfNeed();
	                    });
	                }
	            });

	            this.wwe.addKeyEventHandler('ENTER', function (ev, range) {
	                var isNeedNext = void 0;

	                if (_this2._isAfterTable(range)) {
	                    ev.preventDefault();
	                    range.setStart(range.startContainer, range.startOffset - 1);
	                    _this2.wwe.breakToNewDefaultBlock(range);
	                    isNeedNext = false;
	                } else if (_this2._isBeforeTable(range)) {
	                    ev.preventDefault();
	                    _this2.wwe.breakToNewDefaultBlock(range, 'before');
	                    isNeedNext = false;
	                } else if (_this2.isInTable(range)) {
	                    _this2._appendBrIfTdOrThNotHaveAsLastChild(range);
	                    isNeedNext = false;
	                }

	                return isNeedNext;
	            });

	            this.wwe.addKeyEventHandler('BACK_SPACE', function (ev, range, keymap) {
	                return _this2._handleBackspaceAndDeleteKeyEvent(ev, range, keymap);
	            });
	            this.wwe.addKeyEventHandler('DELETE', function (ev, range, keymap) {
	                return _this2._handleBackspaceAndDeleteKeyEvent(ev, range, keymap);
	            });
	            this.wwe.addKeyEventHandler('TAB', function () {
	                return _this2._moveCursorTo('next', 'cell');
	            });

	            this.wwe.addKeyEventHandler('SHIFT+TAB', function (ev) {
	                return _this2._moveCursorTo('previous', 'cell', ev);
	            });
	            this.wwe.addKeyEventHandler('UP', function (ev) {
	                return _this2._moveCursorTo('previous', 'row', ev);
	            });
	            this.wwe.addKeyEventHandler('DOWN', function (ev) {
	                return _this2._moveCursorTo('next', 'row', ev);
	            });

	            this._bindKeyEventForTableCopyAndCut();
	        }

	        /**
	         * isInTable
	         * Check whether passed range is in table or not
	         * @param {Range} range range
	         * @returns {boolean} result
	         * @memberOf WwTableManager
	         * @api
	         */

	    }, {
	        key: 'isInTable',
	        value: function isInTable(range) {
	            var target = void 0,
	                result = void 0;

	            if (range.collapsed) {
	                target = range.startContainer;
	                result = !!$(target).closest('table').length;
	            } else {
	                target = range.commonAncestorContainer;
	                result = !!$(target).closest('table').length || !!$(range.cloneContents()).find('table').length;
	            }

	            return result;
	        }

	        /**
	         * _isBeforeTable
	         * Check whether passed range is right before table or not
	         * @param {Range} range range
	         * @returns {boolean} result
	         * @memberOf WwTableManager
	         * @private
	         */

	    }, {
	        key: '_isBeforeTable',
	        value: function _isBeforeTable(range) {
	            return _domUtils2.default.getNodeName(_domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset)) === 'TABLE';
	        }

	        /**
	         * _isAfterTable
	         * Check whether passed range is right after table or not
	         * @param {Range} range range
	         * @returns {boolean} result
	         * @memberOf WwTableManager
	         * @private
	         */

	    }, {
	        key: '_isAfterTable',
	        value: function _isAfterTable(range) {
	            var prevElem = _domUtils2.default.getPrevOffsetNodeUntil(range.startContainer, range.startOffset);

	            return _domUtils2.default.getNodeName(prevElem) === 'TABLE' && range.commonAncestorContainer === this.wwe.get$Body()[0];
	        }

	        /**
	         * Handle backspace and delete key event
	         * @param {object} ev Event object
	         * @param {Range} range Range Object
	         * @param {string} keymap keymap
	         * @returns {boolean|null}
	         * @private
	         */

	    }, {
	        key: '_handleBackspaceAndDeleteKeyEvent',
	        value: function _handleBackspaceAndDeleteKeyEvent(ev, range, keymap) {
	            var isBackspace = keymap === 'BACK_SPACE';
	            var isTextOrElementDelete = range.commonAncestorContainer.nodeType !== 3 && range.commonAncestorContainer !== this.wwe.get$Body()[0];
	            var isNeedNext = void 0;

	            if (range.collapsed) {
	                if (this.isInTable(range)) {
	                    if (isBackspace) {
	                        this._tableHandlerOnBackspace(range, ev);
	                    } else {
	                        this._tableHandlerOnDelete(range, ev);
	                    }

	                    this._insertBRIfNeed(range);
	                    this._removeContentsAndChangeSelectionIfNeed(range, keymap, ev);
	                    isNeedNext = false;
	                } else if (!isBackspace && this._isBeforeTable(range) || isBackspace && this._isAfterTable(range)) {
	                    ev.preventDefault();
	                    var startOffset = isBackspace ? range.startOffset - 1 : range.startOffset;
	                    this._removeTable(range, _domUtils2.default.getChildNodeByOffset(range.startContainer, startOffset));
	                    isNeedNext = false;
	                }
	            } else if (this.isInTable(range)) {
	                if (isTextOrElementDelete) {
	                    ev.preventDefault();
	                    this._removeContentsAndChangeSelectionIfNeed(range, keymap, ev);
	                    isNeedNext = false;
	                }
	            }

	            return isNeedNext;
	        }

	        /**
	         * _tableHandlerOnBackspace
	         * Backspace handler in table
	         * @param {Range} range range
	         * @param {Event} event event
	         * @memberOf WwTableManager
	         * @private
	         */

	    }, {
	        key: '_tableHandlerOnBackspace',
	        value: function _tableHandlerOnBackspace(range, event) {
	            var prevNode = _domUtils2.default.getPrevOffsetNodeUntil(range.startContainer, range.startOffset, 'TR'),
	                prevNodeName = _domUtils2.default.getNodeName(prevNode);

	            if (!prevNode || prevNodeName === 'TD' || prevNodeName === 'TH') {
	                event.preventDefault();
	            } else if (prevNodeName === 'BR' && prevNode.parentNode.childNodes.length !== 1) {
	                event.preventDefault();
	                $(prevNode).remove();
	            }
	        }
	        /**
	         * Return whether delete non text or not
	         * @param {Range} range Range object
	         * @returns {boolean}
	         */

	    }, {
	        key: 'isNonTextDeleting',
	        value: function isNonTextDeleting(range) {
	            var currentElement = range.startContainer;
	            var nextNode = currentElement.nextSibling;
	            var nextNodeName = _domUtils2.default.getNodeName(nextNode);
	            var currentNodeName = _domUtils2.default.getNodeName(currentElement);

	            var isCellDeleting = currentNodeName === nextNodeName && currentNodeName !== 'TEXT';
	            var isEndOfText = (!nextNode || nextNodeName === 'BR' && nextNode.parentNode.lastChild === nextNode) && _domUtils2.default.isTextNode(currentElement) && range.startOffset === currentElement.nodeValue.length;
	            var isLastCellOfRow = !isEndOfText && $(currentElement).parents('tr').children().last()[0] === currentElement && (currentNodeName === 'TD' || currentNodeName === 'TH');

	            return isCellDeleting || isEndOfText || isLastCellOfRow;
	        }
	        /**
	         * _tableHandlerOnDelete
	         * Delete handler in table
	         * @param {Range} range range
	         * @param {Event} event event
	         * @memberOf WwTableManager
	         * @private
	         */

	    }, {
	        key: '_tableHandlerOnDelete',
	        value: function _tableHandlerOnDelete(range, event) {
	            var needPreventDefault = this.isNonTextDeleting(range);

	            if (needPreventDefault) {
	                event.preventDefault();
	                range.startContainer.normalize();
	            }
	        }

	        /**
	         * _appendBrIfTdOrThNotHaveAsLastChild
	         * Append br if td or th doesn't have br as last child
	         * @param {Range} range range
	         * @memberOf WwTableManager
	         * @private
	         */

	    }, {
	        key: '_appendBrIfTdOrThNotHaveAsLastChild',
	        value: function _appendBrIfTdOrThNotHaveAsLastChild(range) {
	            var startContainerNodeName = _domUtils2.default.getNodeName(range.startContainer);
	            var tdOrTh = void 0;

	            if (startContainerNodeName === 'TD' || startContainerNodeName === 'TH') {
	                tdOrTh = range.startContainer;
	            } else {
	                var paths = $(range.startContainer).parentsUntil('tr');
	                tdOrTh = paths[paths.length - 1];
	            }

	            if (_domUtils2.default.getNodeName(tdOrTh.lastChild) !== 'BR' && _domUtils2.default.getNodeName(tdOrTh.lastChild) !== 'DIV' && !isIE10And11) {
	                $(tdOrTh).append($('<br />')[0]);
	            }
	        }

	        /**
	         * _unwrapBlockInTable
	         * Unwrap default block tag in table
	         * For Squire default action making abnormal behavior, remove default blocks in Table after setValue() called
	         * @memberOf WwTableManager
	         * @private
	         */

	    }, {
	        key: '_unwrapBlockInTable',
	        value: function _unwrapBlockInTable() {
	            this.wwe.get$Body().find('td div,th div,tr>br,td>br,th>br').each(function (index, node) {
	                if (_domUtils2.default.getNodeName(node) === 'BR') {
	                    var parentNodeName = _domUtils2.default.getNodeName(node.parentNode);
	                    var isInTableCell = /TD|TH/.test(parentNodeName);
	                    var isEmptyTableCell = node.parentNode.textContent.length === 0;
	                    var isLastBR = node.parentNode.lastChild === node;

	                    if (parentNodeName === 'TR' || isInTableCell && !isEmptyTableCell && isLastBR) {
	                        $(node).remove();
	                    }
	                } else {
	                    $(node).children().unwrap();
	                }
	            });
	        }

	        /**
	         * Insert default block between table element
	         * @private
	         */

	    }, {
	        key: '_insertDefaultBlockBetweenTable',
	        value: function _insertDefaultBlockBetweenTable() {
	            this.wwe.get$Body().find('table').each(function (index, node) {
	                if (node.nextElementSibling && node.nextElementSibling.nodeName === 'TABLE') {
	                    $('<div><br /></div>').insertAfter(node);
	                }
	            });
	        }

	        /**
	         * _removeTable
	         * Remove table
	         * @param {Range} range range
	         * @param {Node} table table
	         * @memberOf WwTableManager
	         * @private
	         */

	    }, {
	        key: '_removeTable',
	        value: function _removeTable(range, table) {
	            if (table.tagName === 'TABLE') {
	                this.wwe.getEditor().saveUndoState(range);
	                this.wwe.saveSelection(range);
	                $(table).remove();
	                this.wwe.restoreSavedSelection();
	            }
	        }

	        /**
	         * _recordUndoStateIfNeed
	         * record undo state if need
	         * @param {Range} range range
	         * @memberOf WwTableManager
	         * @private
	         */

	    }, {
	        key: '_recordUndoStateIfNeed',
	        value: function _recordUndoStateIfNeed(range) {
	            var currentCellNode = _domUtils2.default.getParentUntil(range.startContainer, 'TR');

	            if (range.collapsed && this._lastCellNode !== currentCellNode) {
	                this.wwe.getEditor().saveUndoState(range);
	                this._lastCellNode = currentCellNode;
	            }
	        }

	        /**
	         * _recordUndoStateAndResetCellNode
	         * record undo state and reset last cell node
	         * @param {Range} range range
	         * @memberOf WwTableManager
	         * @private
	         */

	    }, {
	        key: '_recordUndoStateAndResetCellNode',
	        value: function _recordUndoStateAndResetCellNode(range) {
	            this.wwe.getEditor().saveUndoState(range);
	            this.resetLastCellNode();
	        }

	        /**
	         * Paste table data into table element
	         * @param {DocumentFragment} fragment Fragment of table element within
	         * @private
	         */

	    }, {
	        key: '_pasteDataIntoTable',
	        value: function _pasteDataIntoTable(fragment) {
	            var range = this.wwe.getEditor().getSelection();
	            var tableData = this._getTableDataFromTable(fragment);
	            var startContainer = range.startContainer;
	            var parentNode = startContainer.parentNode;
	            var isTextInTableCell = parentNode.tagName === 'TD' || parentNode.tagName === 'TH';
	            var isTableCell = startContainer.tagName === 'TD' || startContainer.tagName === 'TH';
	            var isTextNode = startContainer.nodeType === 3;
	            var brString = isIE10 ? '' : '<br />';
	            var anchorElement = void 0,
	                td = void 0,
	                tr = void 0,
	                tdContent = void 0;

	            if (isTextNode && isTextInTableCell) {
	                anchorElement = parentNode;
	            } else if (isTableCell) {
	                anchorElement = startContainer;
	            } else {
	                anchorElement = $(startContainer).find('th,td')[0];
	            }

	            td = anchorElement;

	            while (tableData.length) {
	                tr = tableData.shift();

	                while (td && tr.length) {
	                    tdContent = tr.shift();

	                    if (tdContent.length) {
	                        td.textContent = tdContent;
	                    } else {
	                        td.innerHTML = brString;
	                    }

	                    td = _domUtils2.default.getTableCellByDirection(td, 'next');
	                }

	                td = _domUtils2.default.getSiblingRowCellByDirection(anchorElement, 'next', false);
	                anchorElement = td;
	            }
	        }

	        /**
	         * Get array data from table element
	         * @param {DocumentFragment} fragment table element
	         * @returns {Array}
	         * @private
	         */

	    }, {
	        key: '_getTableDataFromTable',
	        value: function _getTableDataFromTable(fragment) {
	            var $fragment = $(fragment);
	            var tableData = [];
	            var trs = $fragment.find('tr');

	            trs.each(function (i, tr) {
	                var trData = [];
	                var tds = $(tr).children();

	                tds.each(function (index, cell) {
	                    trData.push(cell.textContent);
	                });

	                if (trData.length) {
	                    tableData.push(trData);
	                }
	            });

	            return tableData;
	        }

	        /**
	         * Remove selected table contents
	         * @param {jQuery} selectedCells Selected cells wrapped by jQuery
	         * @private
	         */

	    }, {
	        key: '_removeTableContents',
	        value: function _removeTableContents(selectedCells) {
	            this.wwe.getEditor().saveUndoState();

	            selectedCells.each(function (i, cell) {
	                var brHTMLString = isIE10 ? '' : '<br />';
	                $(cell).html(brHTMLString);
	            });
	        }

	        /**
	         * Wrap dangling table cells with new TR
	         * @param {DocumentFragment} fragment Pasting data
	         * @returns {HTMLElement|null}
	         */

	    }, {
	        key: 'wrapDanglingTableCellsIntoTrIfNeed',
	        value: function wrapDanglingTableCellsIntoTrIfNeed(fragment) {
	            var danglingTableCells = $(fragment).children('td,th');
	            var tr = void 0;

	            if (danglingTableCells.length) {
	                (function () {
	                    var $wrapperTr = $('<tr></tr>');

	                    danglingTableCells.each(function (i, cell) {
	                        $wrapperTr.append(cell);
	                    });

	                    tr = $wrapperTr[0];
	                })();
	            }

	            return tr;
	        }

	        /**
	         * Wrap TRs with new TBODY
	         * @param {DocumentFragment} fragment Pasting data
	         * @returns {HTMLElement|null}
	         */

	    }, {
	        key: 'wrapTrsIntoTbodyIfNeed',
	        value: function wrapTrsIntoTbodyIfNeed(fragment) {
	            var danglingTrs = $(fragment).children('tr');
	            var ths = danglingTrs.find('th');
	            var tbody = void 0;

	            if (ths.length) {
	                ths.each(function (i, node) {
	                    var $node = $(node);
	                    var td = $('<td></td>');

	                    td.html($node.html());
	                    td.insertBefore(node);

	                    $node.detach();
	                });
	            }

	            if (danglingTrs.length) {
	                (function () {
	                    var $wrapperTableBody = $('<tbody></tbody>');

	                    danglingTrs.each(function (i, tr) {
	                        $wrapperTableBody.append(tr);
	                    });

	                    tbody = $wrapperTableBody[0];
	                })();
	            }

	            return tbody;
	        }

	        /**
	         * Wrap THEAD followed by TBODY both into Table
	         * @param {DocumentFragment} fragment Pasting data
	         * @returns {HTMLElement|null}
	         */

	    }, {
	        key: 'wrapTheadAndTbodyIntoTableIfNeed',
	        value: function wrapTheadAndTbodyIntoTableIfNeed(fragment) {
	            var danglingThead = $(fragment).children('thead');
	            var danglingTbody = $(fragment).children('tbody');
	            var $wrapperTable = $('<table></table>');
	            var table = void 0;

	            if (!danglingTbody.length && danglingThead.length) {
	                $wrapperTable.append(danglingThead[0]);
	                $wrapperTable.append('<tbody><tr></tr></tbody>');
	                table = $wrapperTable[0];
	            } else if (danglingTbody.length && !danglingThead.length) {
	                $wrapperTable.append('<thead><tr></tr></thead>');
	                $wrapperTable.append(danglingTbody[0]);
	                table = $wrapperTable[0];
	            } else if (danglingTbody.length && danglingThead.length) {
	                $wrapperTable.append(danglingThead[0]);
	                $wrapperTable.append(danglingTbody[0]);
	                table = $wrapperTable[0];
	            }

	            return table;
	        }
	        /**
	         * Prepare to paste data on table
	         * @param {object} pasteData Pasting data
	         * @param {HTMLElement} node Current pasting element
	         * @returns {DocumentFragment}
	         * @memberOf WwTableManager
	         * @api
	         */

	    }, {
	        key: 'prepareToPasteOnTable',
	        value: function prepareToPasteOnTable(pasteData, node) {
	            var newFragment = document.createDocumentFragment();
	            if (this._isTableOrSubTableElement(node.nodeName)) {
	                this._expandTableIfNeed(pasteData.fragment);
	                this._pasteDataIntoTable(pasteData.fragment);
	                pasteData.fragment = newFragment;
	            } else {
	                newFragment.textContent = newFragment.textContent + pasteData.fragment.textContent;
	            }

	            return newFragment;
	        }

	        /**
	         * Whether pasting element is table element
	         * @param {string} pastingNodeName Pasting node name
	         * @returns {boolean}
	         * @private
	         */

	    }, {
	        key: '_isTableOrSubTableElement',
	        value: function _isTableOrSubTableElement(pastingNodeName) {
	            return pastingNodeName === 'TABLE' || pastingNodeName === 'TBODY' || pastingNodeName === 'THEAD' || pastingNodeName === 'TR' || pastingNodeName === 'TD';
	        }

	        /**
	         * Stuff table cells into incomplete rows
	         * @param {jQuery} $trs jQuery wrapped TRs
	         * @param {number} maximumCellLength maximum cell length of table
	         * @private
	         */

	    }, {
	        key: '_stuffTableCellsIntoIncompleteRow',
	        value: function _stuffTableCellsIntoIncompleteRow($trs, maximumCellLength) {
	            $trs.each(function (rowIndex, row) {
	                var $row = $(row);
	                var tableCells = $row.find('th,td');
	                var parentNodeName = _domUtils2.default.getNodeName($row.parent()[0]);
	                var cellTagName = parentNodeName === 'THEAD' ? 'th' : 'td';

	                for (var cellLength = tableCells.length; cellLength < maximumCellLength; cellLength += 1) {
	                    $row.append($(tableCellGenerator(1, cellTagName))[0]);
	                }
	            });
	        }

	        /**
	         * Prepare to table cell stuffing
	         * @param {jQuery} $trs jQuery wrapped TRs
	         * @returns {{maximumCellLength: *, needTableCellStuffingAid: boolean}}
	         * @private
	         */

	    }, {
	        key: '_prepareToTableCellStuffing',
	        value: function _prepareToTableCellStuffing($trs) {
	            var maximumCellLength = $trs.eq(0).find('th,td').length;
	            var needTableCellStuffingAid = false;

	            $trs.each(function (i, row) {
	                var cellCount = $(row).find('th,td').length;

	                if (maximumCellLength !== cellCount) {
	                    needTableCellStuffingAid = true;

	                    if (maximumCellLength < cellCount) {
	                        maximumCellLength = cellCount;
	                    }
	                }
	            });

	            return {
	                maximumCellLength: maximumCellLength,
	                needTableCellStuffingAid: needTableCellStuffingAid
	            };
	        }

	        /**
	         * Add TBODY or THEAD if need
	         * @param {jQuery} table Table element
	         * @private
	         */

	    }, {
	        key: '_addTbodyOrTheadIfNeed',
	        value: function _addTbodyOrTheadIfNeed(table) {
	            var isTheadNotExists = !table.find('thead').length;
	            var isTbodyNotExists = !table.find('tbody').length;
	            var absentNode = void 0;

	            if (isTheadNotExists) {
	                absentNode = $('<thead><tr></tr></thead>')[0];
	                table.prepend(absentNode);
	            } else if (isTbodyNotExists) {
	                absentNode = $('<tbody><tr></tr></tbody>')[0];
	                table.append(absentNode);
	            }
	        }

	        /**
	         * Append table cells
	         * @param {HTMLElement} node Table element
	         * @private
	         */

	    }, {
	        key: '_tableCellAppendAidForTableElement',
	        value: function _tableCellAppendAidForTableElement(node) {
	            var table = $(node);

	            this._addTbodyOrTheadIfNeed(table);
	            this._addTrIntoContainerIfNeed(table);

	            var trs = table.find('tr');
	            var tableAidInformation = this._prepareToTableCellStuffing(trs);
	            var maximumCellLength = tableAidInformation.maximumCellLength;
	            var needTableCellStuffingAid = tableAidInformation.needTableCellStuffingAid;

	            if (needTableCellStuffingAid) {
	                this._stuffTableCellsIntoIncompleteRow(trs, maximumCellLength);
	            }
	        }

	        /**
	         * Generate THEAD and append TDs with same amount of given TBODY
	         * @param {HTMLElement} node TR element
	         * @returns {{thead: HTMLElement, tbody: HTMLElement}}
	         * @private
	         */

	    }, {
	        key: '_generateTheadAndTbodyFromTbody',
	        value: function _generateTheadAndTbodyFromTbody(node) {
	            var tr = $('<tr></tr>');
	            var thead = $('<thead></thead>');

	            tr.append(tableCellGenerator($(node).find('tr').eq(0).find('td').length, 'th'));
	            thead.append(tr);

	            return {
	                thead: thead[0],
	                tbody: node
	            };
	        }

	        /**
	         * Generate TBODY and append TDs with same amount of given THEAD
	         * @param {HTMLElement} node TR element
	         * @returns {{thead: HTMLElement, tbody: HTMLElement}}
	         * @private
	         */

	    }, {
	        key: '_generateTheadAndTbodyFromThead',
	        value: function _generateTheadAndTbodyFromThead(node) {
	            var tr = $('<tr></tr>');
	            var tbody = $('<tbody></tbody>');

	            tr.append(tableCellGenerator($(node).find('th').length, 'td'));
	            tbody.append(tr);

	            return {
	                thead: node,
	                tbody: tbody[0]
	            };
	        }

	        /**
	         * Generate THEAD and TBODY and append given TR within
	         * @param {HTMLElement} node TR element
	         * @returns {{thead: HTMLElement, tbody: HTMLElement}}
	         * @private
	         */

	    }, {
	        key: '_generateTheadAndTbodyFromTr',
	        value: function _generateTheadAndTbodyFromTr(node) {
	            var $node = $(node);
	            var thead = $('<thead></thead>');
	            var tbody = $('<tbody></tbody>');
	            var theadRow = void 0,
	                tbodyRow = void 0;

	            if ($node.children()[0].tagName === 'TH') {
	                theadRow = node;
	                tbodyRow = $('<tr>' + tableCellGenerator($node.find('th').length, 'td') + '</tr>')[0];
	            } else {
	                theadRow = $('<tr>' + tableCellGenerator($node.find('td').length, 'th') + '</tr>')[0];
	                tbodyRow = node;
	            }

	            thead.append(theadRow);
	            tbody.append(tbodyRow);

	            return {
	                thead: thead[0],
	                tbody: tbody[0]
	            };
	        }

	        /**
	         * Complete passed table
	         * @param {HTMLElement} node Table inner element
	         * @private
	         */

	    }, {
	        key: '_completeIncompleteTable',
	        value: function _completeIncompleteTable(node) {
	            var nodeName = node.tagName;
	            var table = void 0,
	                completedTableContents = void 0;

	            if (nodeName === 'TABLE') {
	                table = node;
	            } else {
	                table = $('<table></table>');
	                table.insertAfter(node);

	                if (nodeName === 'TBODY') {
	                    completedTableContents = this._generateTheadAndTbodyFromTbody(node);
	                } else if (nodeName === 'THEAD') {
	                    completedTableContents = this._generateTheadAndTbodyFromThead(node);
	                } else if (nodeName === 'TR') {
	                    completedTableContents = this._generateTheadAndTbodyFromTr(node);
	                }
	                table.append(completedTableContents.thead);
	                table.append(completedTableContents.tbody);
	            }
	            this._tableCellAppendAidForTableElement(table);
	        }

	        /**
	         * Whole editor body searching incomplete table completion
	         * @private
	         */

	    }, {
	        key: '_completeTableIfNeed',
	        value: function _completeTableIfNeed() {
	            var _this3 = this;

	            var $body = this.wwe.getEditor().get$Body();

	            $body.children().each(function (index, node) {
	                var $node = $(node);

	                if (!_this3._isTableOrSubTableElement(node.nodeName)) {
	                    return;
	                } else if (node.nodeName === 'TABLE' && $node.find('thead').length === 0 && $node.find('tbody').length === 0) {
	                    $node.remove();
	                }

	                _this3._completeIncompleteTable(node);
	            });
	        }

	        /**
	         * Reset _lastCellNode to null
	         * @memberOf WwTableManager
	         */

	    }, {
	        key: 'resetLastCellNode',
	        value: function resetLastCellNode() {
	            this._lastCellNode = null;
	        }
	        /**
	         * Set _lastCellNode to given node
	         * @param {HTMLElement} node Table cell
	         * @memberOf WwTableManager
	         */

	    }, {
	        key: 'setLastCellNode',
	        value: function setLastCellNode(node) {
	            this._lastCellNode = node;
	        }

	        /**
	         * Return whether only modifier key pressed or not
	         * @param {string} keymap Pressed keymap string
	         * @returns {boolean}
	         * @private
	         */

	    }, {
	        key: '_isSingleModifierKey',
	        value: function _isSingleModifierKey(keymap) {
	            return keymap === 'META' && keymap === 'SHIFT' && keymap === 'ALT' && keymap === 'CONTROL';
	        }

	        /**
	         * Return whether modifier keys pressed or not
	         * @param {object} ev keyboard event object
	         * @returns {boolean}
	         * @private
	         */

	    }, {
	        key: '_isModifierKeyPushed',
	        value: function _isModifierKeyPushed(ev) {
	            return ev.metaKey || ev.ctrlKey || ev.altKey || ev.shiftKey;
	        }

	        /**
	         * Add one row into empty TBODY
	         * @param {jQuery} $table Currently processing table
	         * @private
	         */

	    }, {
	        key: '_addTrIntoContainerIfNeed',
	        value: function _addTrIntoContainerIfNeed($table) {
	            var $trContainers = $table.children();

	            $trContainers.each(function (i, container) {
	                var hasNoRows = $(container).find('tr').length === 0;

	                if (hasNoRows) {
	                    $(container).append($('<tr></tr>')[0]);
	                }
	            });
	        }
	    }, {
	        key: '_expandTableIfNeed',
	        value: function _expandTableIfNeed(fragment) {
	            var range = this.wwe.getEditor().getSelection().cloneRange();
	            var $table = $(range.startContainer).parents('table');
	            var difference = this._getColumnAndRowDifference(fragment, range);

	            if (difference.column < 0) {
	                this._appendCellForAllRow($table, difference.column);
	            }

	            if (difference.row < 0) {
	                this._appendRow($table, difference.row);
	            }
	        }
	    }, {
	        key: '_getColumnAndRowDifference',
	        value: function _getColumnAndRowDifference(fragment, range) {
	            var tableData = this._getTableDataFromTable(fragment);
	            var rowLength = tableData.length;
	            var columnLength = tableData[0].length;
	            var $currentCell = $(range.startContainer).closest('th,td');
	            var $currentRow = $currentCell.parent();
	            var currentColumnIndex = _domUtils2.default.getNodeOffsetOfParent($currentCell[0]);
	            var currentRowIndex = _domUtils2.default.getNodeOffsetOfParent($currentCell[0].parentNode);
	            var $table = $currentRow.parents('table');
	            var tableColumnLength = $table.find('tr').eq(0).children().length;
	            var tableRowLength = $table.find('tr').length;
	            var isInTbody = $currentRow.parents('tbody').length;

	            if (isInTbody) {
	                currentRowIndex += 1;
	            }

	            return {
	                row: tableRowLength - (currentRowIndex + rowLength),
	                column: tableColumnLength - (currentColumnIndex + columnLength)
	            };
	        }
	    }, {
	        key: '_appendCellForAllRow',
	        value: function _appendCellForAllRow($table, columnDifference) {
	            var brString = isIE10 ? '' : '<br />';

	            $table.find('tr').each(function (i, row) {
	                var tagName = void 0;

	                for (var index = columnDifference; index < 0; index += 1) {
	                    if (i === 0) {
	                        tagName = 'th';
	                    } else {
	                        tagName = 'td';
	                    }
	                    $(row).append($('<' + tagName + '>' + brString + '</' + tagName + '>')[0]);
	                }
	            });
	        }
	    }, {
	        key: '_appendRow',
	        value: function _appendRow($table, rowDifference) {
	            var newRow = $table.find('tr').last().clone();
	            var brHTMLSting = isIE10 ? '' : '<br />';

	            newRow.find('td').html(brHTMLSting);

	            for (; rowDifference < 0; rowDifference += 1) {
	                $table.find('tbody').append(newRow.clone()[0]);
	            }
	        }

	        /**
	         * Get sibling textNode by given direction
	         * @param {HTMLElement} currentTextNode Current text node
	         * @param {boolean} isNext Boolean value whether direction equals 'next'
	         * @returns {boolean|null}
	         * @private
	         */

	    }, {
	        key: '_getSiblingTextNodeByDirection',
	        value: function _getSiblingTextNodeByDirection(currentTextNode, isNext) {
	            var isPreviousLineExist = currentTextNode.previousSibling && currentTextNode.previousSibling.nodeName === 'BR' && currentTextNode.previousSibling.previousSibling && currentTextNode.previousSibling.previousSibling.nodeType === 3;
	            var isNextLineExist = currentTextNode.nextSibling && currentTextNode.nextSibling.nodeName === 'BR' && currentTextNode.nextSibling.nextSibling && currentTextNode.nextSibling.nextSibling.nodeType === 3;
	            var target = void 0;

	            if (isNext && isNextLineExist) {
	                target = currentTextNode.nextSibling.nextSibling;
	            } else if (!isNext && isPreviousLineExist) {
	                target = currentTextNode.previousSibling.previousSibling;
	            }

	            return target;
	        }

	        /**
	         * Change selection to sibling cell
	         * @param {HTMLElement} currentCell current TD or TH
	         * @param {Range} range Range object
	         * @param {string} direction 'next' or 'previous'
	         * @param {string} scale 'row' or 'cell'
	         */

	    }, {
	        key: '_changeSelectionToTargetCell',
	        value: function _changeSelectionToTargetCell(currentCell, range, direction, scale) {
	            var startContainer = range.startContainer;
	            var isNext = direction === 'next';
	            var isRow = scale === 'row';
	            var target = void 0,
	                textOffset = void 0;

	            if (isRow) {
	                if (_domUtils2.default.isTextNode(startContainer)) {
	                    target = this._getSiblingTextNodeByDirection(startContainer, isNext);
	                    if (target) {
	                        textOffset = target.length < range.startOffset ? target.length : range.startOffset;

	                        range.setStart(target, textOffset);
	                        range.collapse(true);

	                        return;
	                    }
	                }

	                target = _domUtils2.default.getSiblingRowCellByDirection(currentCell, direction, false);
	            } else {
	                target = _domUtils2.default.getTableCellByDirection(currentCell, direction);
	                if (!target) {
	                    target = _domUtils2.default.getSiblingRowCellByDirection(currentCell, direction, true);
	                }
	            }

	            if (target) {
	                range.setStart(target, 0);
	                range.collapse(true);
	            } else {
	                target = $(currentCell).parents('table')[0];
	                if (isNext) {
	                    range.setStart(target.nextElementSibling, 0);
	                } else if (target.previousElementSibling && target.previousElementSibling.nodeName !== 'TABLE') {
	                    range.setStart(target.previousElementSibling, 1);
	                } else {
	                    range.setStartBefore(target);
	                }

	                range.collapse(true);
	            }
	        }

	        /**
	         * Create selection by selected cells and collapse that selection to end
	         * @private
	         */

	    }, {
	        key: '_collapseRangeToEndContainer',
	        value: function _collapseRangeToEndContainer() {
	            var sq = this.wwe.getEditor();
	            var range = sq.getSelection().cloneRange();
	            var selectedCells = this.wwe.getManager('tableSelection').getSelectedCells();

	            if (selectedCells.length && this.isInTable(range)) {
	                this.wwe.defer(function () {
	                    range.collapse(false);
	                    sq.setSelection(range);
	                }, SET_SELECTION_DELAY);
	            }
	        }

	        /**
	         * Move cursor to given direction by interval formatter
	         * @param {string} direction 'next' or 'previous'
	         * @param {string} interval 'row' or 'cell'
	         * @param {object} [ev] Event object
	         * @returns {boolean | null}
	         * @private
	         */

	    }, {
	        key: '_moveCursorTo',
	        value: function _moveCursorTo(direction, interval, ev) {
	            var sq = this.wwe.getEditor();
	            var range = sq.getSelection().cloneRange();
	            var currentCell = $(range.startContainer).closest('td,th')[0];
	            var isNeedNext = void 0;

	            if (range.collapsed) {
	                if (this.isInTable(range) && currentCell) {
	                    if ((direction === 'previous' || interval === 'row') && !tui.util.isUndefined(ev)) {
	                        ev.preventDefault();
	                    }

	                    this._changeSelectionToTargetCell(currentCell, range, direction, interval);
	                    sq.setSelection(range);

	                    isNeedNext = false;
	                }
	            }

	            return isNeedNext;
	        }

	        /**
	         * Bind pre process for table copy and cut key event
	         * @private
	         */

	    }, {
	        key: '_bindKeyEventForTableCopyAndCut',
	        value: function _bindKeyEventForTableCopyAndCut() {
	            var _this4 = this;

	            var isMac = /Mac OS X/.test(navigator.userAgent);
	            var commandKey = isMac ? 'metaKey' : 'ctrlKey';
	            var selectionManager = this.wwe.getManager('tableSelection');

	            this.wwe.getEditor().addEventListener('keydown', function (event) {
	                if (event[commandKey]) {
	                    selectionManager.createRangeBySelectedCells();
	                }
	            });

	            this.wwe.getEditor().addEventListener('keyup', function () {
	                _this4._collapseRangeToEndContainer();
	            });
	        }

	        /**
	         * Remove contents and change selection if need
	         * @param {Range} range Range object
	         * @param {string} keymap keymap
	         * @param {object} ev Event object
	         * @private
	         */

	    }, {
	        key: '_removeContentsAndChangeSelectionIfNeed',
	        value: function _removeContentsAndChangeSelectionIfNeed(range, keymap, ev) {
	            var isTextInput = keymap.length <= 1;
	            var isDeleteOperation = keymap === 'BACK_SPACE' || keymap === 'DELETE';
	            var selectedCells = this.wwe.getManager('tableSelection').getSelectedCells();
	            var firstSelectedCell = selectedCells.first()[0];

	            if ((isTextInput || isDeleteOperation) && !this._isModifierKeyPushed(ev) && selectedCells.length) {
	                if (isDeleteOperation) {
	                    this._recordUndoStateIfNeed(range);
	                }
	                this._removeTableContents(selectedCells);

	                this._lastCellNode = firstSelectedCell;

	                range.setStart(firstSelectedCell, 0);
	                range.collapse(true);
	                this.wwe.getEditor().setSelection(range);
	            }
	        }

	        /**
	         * Return new table ID class name string
	         * @returns {string}
	         * @memberOf WwTableManager
	         * @api
	         */

	    }, {
	        key: 'getTableIDClassName',
	        value: function getTableIDClassName() {
	            var tableClassName = TABLE_CLASS_PREFIX + this.tableID;
	            this.tableID += 1;

	            return tableClassName;
	        }

	        /**
	         * Remove br when text inputted
	         * @param {Range} range Range object
	         * @private
	         */

	    }, {
	        key: '_removeBRIfNeed',
	        value: function _removeBRIfNeed(range) {
	            var isText = _domUtils2.default.isTextNode(range.startContainer);
	            var startContainer = isText ? range.startContainer.parentNode : range.startContainer;
	            var nodeName = _domUtils2.default.getNodeName(startContainer);

	            if (/td|th/i.test(nodeName) && range.collapsed && startContainer.textContent.length === 1) {
	                $(startContainer).find('br').remove();
	            }
	        }

	        /**
	         * Insert br when text deleted
	         * @param {Range} range Range object
	         * @private
	         */

	    }, {
	        key: '_insertBRIfNeed',
	        value: function _insertBRIfNeed(range) {
	            var isText = _domUtils2.default.isTextNode(range.startContainer);
	            var currentCell = isText ? range.startContainer.parentNode : range.startContainer;
	            var nodeName = _domUtils2.default.getNodeName(currentCell);
	            var $currentCell = $(currentCell);

	            if (/td|th/i.test(nodeName) && range.collapsed && !currentCell.textContent.length && !$currentCell.children().length && !isIE10And11) {
	                currentCell.normalize();
	                $currentCell.append('<br>');
	            }
	        }
	    }]);

	    return WwTableManager;
	}();

	/**
	 * Generate table cell HTML text
	 * @param {number} amount Amount of cells
	 * @param {string} tagName Tag name of cell 'td' or 'th'
	 * @private
	 * @returns {string}
	 */


	function tableCellGenerator(amount, tagName) {
	    var brHTMLString = '<br />';
	    var cellString = '<' + tagName + '>' + brHTMLString + '</' + tagName + '>';
	    var tdString = '';

	    for (var i = 0; i < amount; i += 1) {
	        tdString = tdString + cellString;
	    }

	    return tdString;
	}
	module.exports = WwTableManager;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg table selection manager
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _domUtils = __webpack_require__(8);

	var _domUtils2 = _interopRequireDefault(_domUtils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TABLE_CELL_SELECTED_CLASS_NAME = 'te-cell-selected';

	/**
	 * WwTableSelectionManager
	 * @exports WwTableSelectionManager
	 * @constructor
	 * @class WwTableSelectionManager
	 * @param {WysiwygEditor} wwe WysiwygEditor instance
	 */

	var WwTableSelectionManager = function () {
	    function WwTableSelectionManager(wwe) {
	        _classCallCheck(this, WwTableSelectionManager);

	        this.wwe = wwe;
	        this.eventManager = wwe.eventManager;

	        /**
	         * Name property
	         * @api
	         * @memberOf WwTableSelectionManager
	         * @type {string}
	         */
	        this.name = 'tableSelection';

	        this._init();
	    }

	    /**
	     * _init
	     * Initialize
	     * @memberOf WwTableSelectionManager
	     * @private
	     */


	    _createClass(WwTableSelectionManager, [{
	        key: '_init',
	        value: function _init() {
	            this._initEvent();

	            // For disable firefox's table tool UI and table resize handler
	            if (tui.util.browser.firefox) {
	                document.execCommand('enableObjectResizing', false, 'false');
	                document.execCommand('enableInlineTableEditing', false, 'false');
	            }
	        }

	        /**
	         * _initEvent
	         * Initialize event
	         * @memberOf WwTableSelectionManager
	         * @private
	         */

	    }, {
	        key: '_initEvent',
	        value: function _initEvent() {
	            var _this = this;

	            var selectionStart = void 0,
	                selectionEnd = void 0;

	            /**
	             * Start table selection timer
	             * @type {object}
	             * @private
	             */
	            this._tableSelectionTimer = null;
	            /**
	             * Remove selection timer for Firefox table selection
	             * @type {object}
	             * @private
	             */
	            this._removeSelectionTimer = null;
	            /**
	             * Boolean value for whether selection started
	             * @type {boolean}
	             * @private
	             */
	            this._isSelectionStarted = false;

	            this.eventManager.listen('mousedown', function (ev) {
	                var MOUSE_RIGHT_BUTTON = 2;
	                selectionStart = $(ev.data.target).closest('td,th')[0];
	                var isSelectedCell = $(selectionStart).hasClass(TABLE_CELL_SELECTED_CLASS_NAME);
	                selectionEnd = null;

	                if (!isSelectedCell || isSelectedCell && ev.data.button !== MOUSE_RIGHT_BUTTON) {
	                    _this.removeClassAttrbuteFromAllCellsIfNeed();

	                    _this._setTableSelectionTimerIfNeed(selectionStart);
	                }
	            });

	            this.eventManager.listen('mouseover', function (ev) {
	                selectionEnd = $(ev.data.target).closest('td,th')[0];

	                var range = _this.wwe.getEditor().getSelection();
	                var isEndsInTable = $(selectionEnd).parents('table')[0];
	                var isSameCell = selectionStart === selectionEnd;
	                var isTextSelect = _this._isTextSelect(range, isSameCell);

	                if (_this._isSelectionStarted && isEndsInTable && (!isTextSelect || isSameCell) && !isTextSelect) {
	                    // For disable firefox's native table cell selection
	                    if (tui.util.browser.firefox && !_this._removeSelectionTimer) {
	                        _this._removeSelectionTimer = setInterval(function () {
	                            window.getSelection().removeAllRanges();
	                        }, 10);
	                    }
	                    _this._highlightTableCellsBy(selectionStart, selectionEnd);
	                }
	            });
	            this.eventManager.listen('mouseup', function (ev) {
	                selectionEnd = $(ev.data.target).closest('td,th')[0];

	                var range = _this.wwe.getEditor().getSelection();
	                var isSameCell = selectionStart === selectionEnd;
	                var isTextSelect = _this._isTextSelect(range, isSameCell);

	                _this._clearTableSelectionTimerIfNeed();

	                if (_this._isSelectionStarted) {
	                    if (isTextSelect) {
	                        _this.removeClassAttrbuteFromAllCellsIfNeed();
	                    } else {
	                        _this.wwe.getManager('table').resetLastCellNode();

	                        range = _this.wwe.getEditor().getSelection();
	                        range.collapse(true);
	                        _this.wwe.getEditor().setSelection(range);
	                    }
	                }

	                _this._isSelectionStarted = false;
	            });
	        }

	        /**
	         * Return whether single cell text selection or not
	         * @param {Range} range Range object
	         * @param {boolean} isSameCell Boolean value for same cell selection
	         * @returns {boolean}
	         * @private
	         */

	    }, {
	        key: '_isTextSelect',
	        value: function _isTextSelect(range, isSameCell) {
	            return (/TD|TH|TEXT/i.test(range.commonAncestorContainer.nodeName) && isSameCell
	            );
	        }

	        /**
	         * Set setTimeout and setInterval timer execution if table selecting situation
	         * @param {HTMLElement} selectionStart Start element
	         * @private
	         */

	    }, {
	        key: '_setTableSelectionTimerIfNeed',
	        value: function _setTableSelectionTimerIfNeed(selectionStart) {
	            var _this2 = this;

	            var isTableSelecting = $(selectionStart).parents('table').length;

	            if (isTableSelecting) {
	                this._tableSelectionTimer = setTimeout(function () {
	                    _this2._isSelectionStarted = true;
	                }, 100);
	            }
	        }

	        /**
	         * Clear setTimeout and setInterval timer execution
	         * @private
	         */

	    }, {
	        key: '_clearTableSelectionTimerIfNeed',
	        value: function _clearTableSelectionTimerIfNeed() {
	            clearTimeout(this._tableSelectionTimer);
	            // For disable firefox's native table selection
	            if (tui.util.browser.firefox && this._removeSelectionTimer) {
	                clearTimeout(this._removeSelectionTimer);
	                this._removeSelectionTimer = null;
	            }
	        }

	        /**
	         * Re arrange selection when table does not include both start and end selection element
	         * @param {HTMLElement} selectionStart Start element of selection
	         * @param {HTMLElement} selectionEnd End element of selection
	         * @returns {{startContainer: HTMLElement, endContainer: HTMLElement}}
	         * @private
	         */

	    }, {
	        key: '_reArrangeSelectionIfneed',
	        value: function _reArrangeSelectionIfneed(selectionStart, selectionEnd) {
	            var isRangeStartInTable = $(selectionStart).parents('table').length;
	            var isRangeEndInTable = $(selectionEnd).parents('table').length;
	            var isStartRangeOut = isRangeEndInTable && !isRangeStartInTable;
	            var isEndRangeOut = !isRangeEndInTable && isRangeStartInTable;

	            if (isStartRangeOut) {
	                selectionStart = $(selectionEnd).parents('table').find('th').first()[0];
	            } else if (isEndRangeOut) {
	                selectionEnd = $(selectionStart).parents('table').find('td').last()[0];
	            }

	            return {
	                startContainer: selectionStart,
	                endContainer: selectionEnd
	            };
	        }

	        /**
	         * Apply select direction to editor
	         * @param {{startContainer: HTMLElement, endContainer: HTMLElement}} selectionInformation
	         *     Selection start and end element
	         * @param {Range} range Range object
	         * @returns {Range}
	         * @private
	         */

	    }, {
	        key: '_applySelectionDirection',
	        value: function _applySelectionDirection(selectionInformation, range) {
	            var nodeOffsetOfParent = _domUtils2.default.getNodeOffsetOfParent;
	            var selectionStart = selectionInformation.startContainer;
	            var selectionEnd = selectionInformation.endContainer;
	            var rowDirection = nodeOffsetOfParent($(selectionStart).closest('tr')[0]) - nodeOffsetOfParent($(selectionEnd).closest('tr')[0]);
	            var cellDirection = nodeOffsetOfParent(selectionStart) - nodeOffsetOfParent(selectionEnd);
	            var isSameRow = rowDirection === 0;
	            var isRowIncreases = rowDirection < 0;
	            var isColumnIncreases = cellDirection > 0;

	            if (isSameRow) {
	                if (isColumnIncreases) {
	                    range.setStart(selectionEnd, 0);
	                    range.setEnd(selectionStart, 1);
	                } else {
	                    range.setStart(selectionStart, 0);
	                    range.setEnd(selectionEnd, 1);
	                }
	            } else if (isRowIncreases) {
	                range.setStart(selectionStart, 0);
	                range.setEnd(selectionEnd, 1);
	            } else {
	                range.setStart(selectionEnd, 0);
	                range.setEnd(selectionStart, 1);
	            }

	            return range;
	        }

	        /**
	         * Get table cell element
	         * @param {Node | HTMLElement} node textNode or table cell element
	         * @returns {HTMLElement}
	         * @private
	         */

	    }, {
	        key: '_getTableCell',
	        value: function _getTableCell(node) {
	            return node.nodeType === 3 ? $(node).parent('td,th')[0] : node;
	        }

	        /**
	         * Get selection coordinate by current selection
	         * @param {HTMLElement} selectionStart start element
	         * @param {HTMLElement} selectionEnd end element
	         * @returns {{from: {row: number, cell: number}, to: {row: number, cell: number}}}
	         * @memberOf WwTableSelectionManager
	         * @api
	         */

	    }, {
	        key: 'getSelectionRangeFromTable',
	        value: function getSelectionRangeFromTable(selectionStart, selectionEnd) {
	            var nodeOffsetOfParent = _domUtils2.default.getNodeOffsetOfParent;
	            var startRowOffset = nodeOffsetOfParent(selectionStart.parentNode);
	            var endRowOffset = nodeOffsetOfParent(selectionEnd.parentNode);
	            var startCellOffset = nodeOffsetOfParent(selectionStart);
	            var endCellOffset = nodeOffsetOfParent(selectionEnd);
	            var startCellContainer = _domUtils2.default.getParentUntil(selectionStart, 'TABLE');
	            var endCellContainer = _domUtils2.default.getParentUntil(selectionEnd, 'TABLE');
	            var isReversedTheadAndTbodySelect = _domUtils2.default.getNodeName(startCellContainer) === 'TBODY' && _domUtils2.default.getNodeName(endCellContainer) === 'THEAD';
	            var isTheadAndTbodySelect = startCellContainer !== endCellContainer;
	            var isBothInTbody = !!$(selectionStart).parents('tbody').length && !!$(selectionEnd).parents('tbody').length;
	            var start = {
	                row: startRowOffset,
	                cell: startCellOffset
	            };
	            var end = {
	                row: endRowOffset,
	                cell: endCellOffset
	            };
	            var from = void 0,
	                to = void 0;

	            if (isReversedTheadAndTbodySelect) {
	                start.row += 1;
	            } else if (isTheadAndTbodySelect) {
	                end.row += 1;
	            } else if (isBothInTbody) {
	                start.row += 1;
	                end.row += 1;
	            }

	            if (startRowOffset > endRowOffset || startRowOffset === endRowOffset && startCellOffset > endCellOffset) {
	                from = end;
	                to = start;
	            } else {
	                from = start;
	                to = end;
	            }

	            return {
	                from: from,
	                to: to
	            };
	        }

	        /**
	         * Highlight selected table cells
	         * @param {HTMLElement} selectionStart start element
	         * @param {HTMLElement} selectionEnd end element
	         * @private
	         */

	    }, {
	        key: '_highlightTableCellsBy',
	        value: function _highlightTableCellsBy(selectionStart, selectionEnd) {
	            var trs = $(selectionStart).parents('table').find('tr');
	            var selection = this.getSelectionRangeFromTable(selectionStart, selectionEnd);
	            var rowFrom = selection.from.row;
	            var cellFrom = selection.from.cell;
	            var rowTo = selection.to.row;
	            var cellTo = selection.to.cell;

	            trs.each(function (rowIndex, row) {
	                $(row).find('td,th').each(function (cellIndex, cell) {
	                    var $cell = $(cell);
	                    var isFromRow = rowIndex === rowFrom;
	                    var isToRow = rowIndex === rowTo;

	                    if (isFromRow && cellIndex < cellFrom || isToRow && cellIndex > cellTo || rowIndex < rowFrom || rowIndex > rowTo) {
	                        $cell.removeClass(TABLE_CELL_SELECTED_CLASS_NAME);
	                    } else {
	                        $cell.addClass(TABLE_CELL_SELECTED_CLASS_NAME);
	                    }
	                });
	            });
	        }

	        /**
	         * Remove '.te-cell-selected' class from all of table Cell
	         * @memberOf WwTableSelectionManager
	         * @api
	         */

	    }, {
	        key: 'removeClassAttrbuteFromAllCellsIfNeed',
	        value: function removeClassAttrbuteFromAllCellsIfNeed() {
	            this.wwe.get$Body().find('td.' + TABLE_CELL_SELECTED_CLASS_NAME + ',th.' + TABLE_CELL_SELECTED_CLASS_NAME).each(function (i, node) {
	                var $node = $(node);

	                $node.removeClass(TABLE_CELL_SELECTED_CLASS_NAME);

	                if (!$node.attr('class').length) {
	                    $node.removeAttr('class');
	                }
	            });
	        }
	    }, {
	        key: 'getSelectedCells',
	        value: function getSelectedCells() {
	            return this.wwe.get$Body().find('.' + TABLE_CELL_SELECTED_CLASS_NAME);
	        }

	        /**
	         * Create selection by selected cells and collapse that selection to end
	         * @private
	         */

	    }, {
	        key: 'createRangeBySelectedCells',
	        value: function createRangeBySelectedCells() {
	            var sq = this.wwe.getEditor();
	            var range = sq.getSelection().cloneRange();
	            var selectedCells = this.getSelectedCells();
	            var tableManager = this.wwe.getManager('table');

	            if (selectedCells.length && tableManager.isInTable(range)) {
	                range.setStart(selectedCells.first()[0], 0);
	                range.setEnd(selectedCells.last()[0], 1);
	                sq.setSelection(range);
	            }
	        }
	    }]);

	    return WwTableSelectionManager;
	}();

	module.exports = WwTableSelectionManager;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg hr manager
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _domUtils = __webpack_require__(8);

	var _domUtils2 = _interopRequireDefault(_domUtils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * WwHrManager
	 * @exports WwHrManager
	 * @constructor
	 * @class WwHrManager
	 * @param {WysiwygEditor} wwe WysiwygEditor instance
	 */
	var WwHrManager = function () {
	    function WwHrManager(wwe) {
	        _classCallCheck(this, WwHrManager);

	        this.wwe = wwe;
	        this.eventManager = wwe.eventManager;

	        /**
	         * Name property
	         * @api
	         * @memberOf WwHrManager
	         * @type {string}
	         */
	        this.name = 'hr';

	        this._init();
	    }

	    /**
	     * _init
	     * Initialize
	     * @memberOf WwHrManager
	     * @private
	     */


	    _createClass(WwHrManager, [{
	        key: '_init',
	        value: function _init() {
	            this._initKeyHandler();
	            this._initEvent();
	        }

	        /**
	         * _initEvent
	         * Initialize eventmanager event
	         * @memberOf WwHrManager
	         * @private
	         */

	    }, {
	        key: '_initEvent',
	        value: function _initEvent() {
	            var _this = this;

	            this.eventManager.listen('wysiwygSetValueAfter', function () {
	                _this._unwrapDivOnHr();
	            });

	            this.eventManager.listen('wysiwygGetValueBefore', function () {
	                _this._wrapDefaultBlockToOrphanTexts();
	            });
	        }

	        /**
	         * _initKeyHandler
	         * Initialize key event handler
	         * @memberOf WwHrManager
	         * @private
	         */

	    }, {
	        key: '_initKeyHandler',
	        value: function _initKeyHandler() {
	            var _this2 = this;

	            this.wwe.addKeyEventHandler(function (ev, range) {
	                return _this2._onTypedInHr(range);
	            });

	            this.wwe.addKeyEventHandler('ENTER', function (ev, range) {
	                if (range.collapsed) {
	                    return _this2._removeHrOnEnter(range, ev);
	                }

	                return true;
	            });

	            this.wwe.addKeyEventHandler('BACK_SPACE', function (ev, range) {
	                if (range.collapsed) {
	                    return _this2._removeHrOnBackspace(range, ev);
	                }

	                return true;
	            });
	        }

	        /**
	         * _isInHr
	         * Check whether passed range is in hr or not
	         * @param {Range} range range
	         * @returns {boolean} result
	         * @memberOf WwHrManager
	         * @private
	         */

	    }, {
	        key: '_isInHr',
	        value: function _isInHr(range) {
	            return _domUtils2.default.getNodeName(range.startContainer.childNodes[range.startOffset]) === 'HR';
	        }

	        /**
	         * _isNearHr
	         * Check whether passed range is near hr or not
	         * @param {Range} range range
	         * @returns {boolean} result
	         * @memberOf WwHrManager
	         * @private
	         */

	    }, {
	        key: '_isNearHr',
	        value: function _isNearHr(range) {
	            var prevNode = _domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset - 1);

	            return _domUtils2.default.getNodeName(prevNode) === 'HR';
	        }

	        /**
	         * Handler for delete HR when user typing within
	         * @param {Range} range Range object
	         * @memberOf WwHrManager
	         * @private
	         */

	    }, {
	        key: '_onTypedInHr',
	        value: function _onTypedInHr(range) {
	            var _this3 = this;

	            // HR위에서 테스트 컨텐츠 입력을 시도한경우에 대한 대비
	            if (this._isInHr(range) || this._isNearHr(range)) {
	                this.wwe.defer(function (wwe) {
	                    wwe.saveSelection();
	                    _this3._wrapDefaultBlockToOrphanTexts();
	                    wwe.restoreSavedSelection();
	                });
	            }
	        }

	        /**
	         * _removeHrOnEnter
	         * Remove hr if need on enter
	         * @param {Range} range range
	         * @param {Event} ev event
	         * @returns {boolean} return true if hr was removed
	         * @memberOf WwHrManager
	         * @private
	         */

	    }, {
	        key: '_removeHrOnEnter',
	        value: function _removeHrOnEnter(range, ev) {
	            var hrSuspect = void 0,
	                blockPosition = void 0;

	            if (this._isInHr(range)) {
	                hrSuspect = _domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset);
	            } else if (this._isNearHr(range)) {
	                hrSuspect = _domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset - 1);
	                blockPosition = 'before';
	            }

	            return this._changeHrToNewDefaultBlock(hrSuspect, range, ev, blockPosition);
	        }

	        /**
	         * _removeHrOnBackspace
	         * Remove hr if need on backspace
	         * @param {Range} range range
	         * @param {Event} ev event
	         * @returns {boolean} return true if hr was removed
	         * @memberOf WwHrManager
	         * @private
	         */

	    }, {
	        key: '_removeHrOnBackspace',
	        value: function _removeHrOnBackspace(range, ev) {
	            var hrSuspect = void 0,
	                blockPosition = void 0;

	            if (this._isInHr(range)) {
	                hrSuspect = _domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset);
	            } else if (range.startOffset === 0) {
	                hrSuspect = _domUtils2.default.getTopPrevNodeUnder(range.startContainer, this.wwe.get$Body()[0]);
	                blockPosition = 'none';
	            } else if (this._isNearHr(range)) {
	                hrSuspect = _domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset - 1);
	                blockPosition = 'before';
	            }

	            return this._changeHrToNewDefaultBlock(hrSuspect, range, ev, blockPosition);
	        }

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

	    }, {
	        key: '_changeHrToNewDefaultBlock',
	        value: function _changeHrToNewDefaultBlock(hrSuspect, range, ev, newBlockPosition) {
	            if (hrSuspect && _domUtils2.default.getNodeName(hrSuspect) === 'HR') {
	                ev.preventDefault();

	                if (newBlockPosition !== 'none') {
	                    this.wwe.breakToNewDefaultBlock(range, newBlockPosition);
	                }

	                $(hrSuspect).remove();

	                return false;
	            }

	            return true;
	        }

	        /**
	         * _unwrapDivOnHr
	         * Unwrap default block on hr
	         * @memberOf WwHrManager
	         * @private
	         */

	    }, {
	        key: '_unwrapDivOnHr',
	        value: function _unwrapDivOnHr() {
	            var editorContentBody = this.wwe.get$Body()[0];
	            this.wwe.get$Body().find('hr').each(function (index, node) {
	                var parentDiv = $(node).parent('div');
	                if (parentDiv[0] !== editorContentBody) {
	                    parentDiv.find('br').remove();
	                    $(node).unwrap();
	                }
	            });
	        }

	        /**
	         * _wrapDefaultBlockToOrphanTexts
	         * Wrap default block to orphan texts
	         * mainly, this is used for orphan text that made by controlling hr
	         * @memberOf WwHrManager
	         * @private
	         */

	    }, {
	        key: '_wrapDefaultBlockToOrphanTexts',
	        value: function _wrapDefaultBlockToOrphanTexts() {
	            var textNodes = this.wwe.get$Body().contents().filter(findTextNodeFilter);

	            textNodes.each(function (i, node) {
	                $(node).wrap('<div />');
	            });
	        }
	    }]);

	    return WwHrManager;
	}();

	/**
	 * findTextNodeFilter
	 * @function
	 * @this Node
	 * @returns {boolean}
	 */


	function findTextNodeFilter() {
	    return this.nodeType === Node.TEXT_NODE;
	}

	module.exports = WwHrManager;

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @fileoverview Implements wysiwyg p manager
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	/**
	 * WwPManager
	 * @exports WwPManager
	 * @class WwPManager
	 * @constructor
	 * @param {WysiwygEditor} wwe wysiwygEditor instance
	 */
	var WwPManager = function () {
	    function WwPManager(wwe) {
	        _classCallCheck(this, WwPManager);

	        this.wwe = wwe;
	        this.eventManager = wwe.eventManager;

	        /**
	         * Name property
	         * @api
	         * @memberOf WwPManager
	         * @type {string}
	         */
	        this.name = 'p';

	        this._initEvent();
	    }

	    /**
	     * _initEvent
	     * Initialize event
	     * @memberOf WwPManager
	     * @private
	     */


	    _createClass(WwPManager, [{
	        key: '_initEvent',
	        value: function _initEvent() {
	            var _this = this;

	            this.eventManager.listen('wysiwygSetValueBefore', function (html) {
	                return _this._splitPtagContentLines(html);
	            });

	            this.eventManager.listen('wysiwygSetValueAfter', function () {
	                _this._ensurePtagContentWrappedWithDiv();
	                _this._unwrapPtags();
	            });
	        }

	        /**
	         * Split multiple line content of p tags
	         * @param {string} html html text
	         * @returns {string} result
	         */

	    }, {
	        key: '_splitPtagContentLines',
	        value: function _splitPtagContentLines(html) {
	            html = html.replace(/<p>([\s\S]*?)<\/p>/gi, function (whole, content) {
	                var lines = content.split(/<br>/gi);
	                var linesLenIndex = lines.length - 1;
	                var splitedContent = '';

	                splitedContent = lines.map(function (line, index) {
	                    var result = '';

	                    if (index > 0 && index < linesLenIndex) {
	                        line = line ? line : '<br>';
	                    }

	                    if (line) {
	                        result = '<div>' + line + '</div>';
	                    }

	                    return result;
	                });

	                // For paragraph, we add empty line
	                splitedContent.push('<div><br></div>');

	                return splitedContent.join('');
	            });

	            return html;
	        }

	        /**
	         * _ensurePtagContentWrappedWithDiv
	         * Wrap new line inside P tag to DIV, and additional empty line added within too
	         * @memberOf WwPManager
	         * @private
	         */

	    }, {
	        key: '_ensurePtagContentWrappedWithDiv',
	        value: function _ensurePtagContentWrappedWithDiv() {
	            this.wwe.get$Body().find('p').each(function (index, node) {
	                if ($(node).find('div').length <= 0) {
	                    $(node).wrapInner('<div />');
	                }

	                if ($(node).next().is('p')) {
	                    $(node).append('<div><br></div>');
	                }
	            });
	        }

	        /**
	         * _unwrapPtags
	         * Unwrap P tag
	         * @memberOf WwPManager
	         * @private
	         */

	    }, {
	        key: '_unwrapPtags',
	        value: function _unwrapPtags() {
	            this.wwe.get$Body().find('div').each(function (index, node) {
	                if ($(node).parent().is('p')) {
	                    $(node).unwrap();
	                }
	            });
	        }
	    }]);

	    return WwPManager;
	}();

	module.exports = WwPManager;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg heading manager
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _domUtils = __webpack_require__(8);

	var _domUtils2 = _interopRequireDefault(_domUtils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var FIND_HEADING_RX = /h[\d]/i;

	/**
	 * WwHeadingManager
	 * @exports WwHeadingManager
	 * @constructor
	 * @class WwHeadingManager
	 * @param {WysiwygEditor} wwe WysiwygEditor instance
	 */

	var WwHeadingManager = function () {
	    function WwHeadingManager(wwe) {
	        _classCallCheck(this, WwHeadingManager);

	        this.wwe = wwe;
	        this.eventManager = wwe.eventManager;

	        /**
	         * Name property
	         * @api
	         * @memberOf WwHeadingManager
	         * @type {string}
	         */
	        this.name = 'heading';

	        this._init();
	    }

	    /**
	     * _init
	     * Initialize
	     * @memberOf WwHeadingManager
	     * @private
	     */


	    _createClass(WwHeadingManager, [{
	        key: '_init',
	        value: function _init() {
	            this._initEvent();
	            this._initKeyHandler();
	        }
	    }, {
	        key: '_initEvent',
	        value: function _initEvent() {
	            var _this = this;

	            this.eventManager.listen('wysiwygSetValueAfter', function () {
	                _this._wrapDefaultBlockToHeadingInner();
	            });
	        }

	        /**
	         * _initKeyHandler
	         * Initialize key event handler
	         * @memberOf WwHeadingManager
	         * @private
	         */

	    }, {
	        key: '_initKeyHandler',
	        value: function _initKeyHandler() {
	            var _this2 = this;

	            this.wwe.addKeyEventHandler('ENTER', function (ev, range) {
	                if (_this2.wwe.hasFormatWithRx(FIND_HEADING_RX)) {
	                    _this2._onEnter(ev, range);

	                    return false;
	                }

	                return true;
	            });

	            this.wwe.addKeyEventHandler('BACK_SPACE', function (ev, range) {
	                if (_this2.wwe.hasFormatWithRx(FIND_HEADING_RX)) {
	                    _this2._removePrevTopNodeIfNeed(ev, range);

	                    return false;
	                }

	                return true;
	            });
	        }

	        /**
	         * _wrapDefaultBlockToHeadingInner
	         * Wrap default block to heading inner contents
	         * @private
	         */

	    }, {
	        key: '_wrapDefaultBlockToHeadingInner',
	        value: function _wrapDefaultBlockToHeadingInner() {
	            this.wwe.get$Body().find('h1, h2, h3, h4, h5, h6').each(function (index, node) {
	                if ($(node).children('div, p').length <= 0) {
	                    $(node).wrapInner('<div />');
	                }
	            });
	        }

	        /**
	         * _unwrapHeading
	         * Unwrap heading
	         * @memberOf WwHeadingManager
	         * @private
	         */

	    }, {
	        key: '_unwrapHeading',
	        value: function _unwrapHeading() {
	            this.wwe.unwrapBlockTag(function (node) {
	                return FIND_HEADING_RX.test(node);
	            });
	        }

	        /**
	         * _onEnter
	         * Enter key handler
	         * @memberOf WwHeadingManager
	         * @param {Event} event event object
	         * @param {Range} range range
	         * @private
	         */

	    }, {
	        key: '_onEnter',
	        value: function _onEnter(event, range) {
	            var _this3 = this;

	            if (range.startOffset > 0) {
	                // squire의 처리 중간이나 마지막에 개입할 방법이 없어 지연 처리
	                this.wwe.defer(function (wwe) {
	                    _this3._unwrapHeading();
	                    wwe.getEditor().removeLastUndoStack();
	                });
	            } else {
	                event.preventDefault();
	                this._insertEmptyBlockToPrevious(range);
	            }
	        }

	        /**
	         * _insertEmptyBlockToPrevious
	         * Insert empty block to previous of passed range
	         * @api
	         * @memberOf WwHeadingManager
	         * @param {Range} range range
	         * @private
	         */

	    }, {
	        key: '_insertEmptyBlockToPrevious',
	        value: function _insertEmptyBlockToPrevious(range) {
	            this.wwe.getEditor().saveUndoState(range);
	            $('<div><br></div>').insertBefore(_domUtils2.default.getParentUntil(range.startContainer, this.wwe.get$Body()[0]));
	        }

	        /**
	         * _removePrevTopNodeIfNeed
	         * Remove previous top node if need
	         * @memberOf WwHeadingManager
	         * @param {Event} event event object
	         * @param {Range} range range
	         * @returns {Boolean} whether needed or not
	         * @private
	         */

	    }, {
	        key: '_removePrevTopNodeIfNeed',
	        value: function _removePrevTopNodeIfNeed(event, range) {
	            var isHandled = false;

	            if (range.collapsed && range.startOffset === 0) {
	                var startContainer = range.startContainer;
	                var prevTopNode = _domUtils2.default.getTopPrevNodeUnder(startContainer, this.wwe.get$Body()[0]);
	                var isPrevTopNodeEmpty = prevTopNode && prevTopNode.textContent.length === 0;
	                var sq = this.wwe.getEditor();

	                if (startContainer.textContent.length === 0) {
	                    isHandled = this._removeHedingAndChangeSelection(event, range, prevTopNode);
	                } else if (isPrevTopNodeEmpty) {
	                    event.preventDefault();
	                    sq.saveUndoState(range);

	                    $(prevTopNode).remove();
	                    isHandled = true;
	                }
	            }

	            return isHandled;
	        }

	        /**
	         * Remove heading and change selection
	         * @param {object} event Event object
	         * @param {Range} range Range object
	         * @param {HTMLElement} prevTopNode Previous top node
	         * @returns {boolean}
	         * @private
	         */

	    }, {
	        key: '_removeHedingAndChangeSelection',
	        value: function _removeHedingAndChangeSelection(event, range, prevTopNode) {
	            var startContainer = range.startContainer;
	            var sq = this.wwe.getEditor();
	            var $Body = this.wwe.get$Body();
	            var isHeading = FIND_HEADING_RX.test(_domUtils2.default.getNodeName(startContainer));
	            var headingElement = isHeading ? startContainer : $(startContainer).parents('h1,h2,h3,h4,h5,h6')[0];
	            var targetNode = prevTopNode;
	            var offset = 1;

	            if (!event.defaultPrevented) {
	                event.preventDefault();
	                sq.saveUndoState(range);
	            }

	            $(headingElement).remove();

	            if (!prevTopNode) {
	                targetNode = $Body.children('div').first()[0];
	                offset = 0;
	            }

	            range.setStart(targetNode, offset);
	            range.collapse(true);
	            sq.setSelection(range);

	            return true;
	        }
	    }]);

	    return WwHeadingManager;
	}();

	module.exports = WwHeadingManager;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements wysiwyg p manager
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _domUtils = __webpack_require__(8);

	var _domUtils2 = _interopRequireDefault(_domUtils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var util = tui.util;

	var tagEntities = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;'
	};

	var FIND_ZWS_RX = /\u200B/g;
	var CODEBLOCK_ATTR_NAME = 'data-te-codeblock';

	/**
	 * WwCodeBlockManager
	 * @exports WwCodeBlockManager
	 * @class WwCodeBlockManager
	 * @constructor
	 * @param {WysiwygEditor} wwe wysiwygEditor instance
	 */

	var WwCodeBlockManager = function () {
	    function WwCodeBlockManager(wwe) {
	        _classCallCheck(this, WwCodeBlockManager);

	        this.wwe = wwe;
	        this.eventManager = wwe.eventManager;

	        /**
	         * Name property
	         * @api
	         * @memberOf WwCodeBlockManager
	         * @type {string}
	         */
	        this.name = 'codeblock';

	        this._init();
	    }
	    /**
	     * _init
	     * Initialize
	     * @memberOf WwCodeBlockManager
	     * @private
	     */


	    _createClass(WwCodeBlockManager, [{
	        key: '_init',
	        value: function _init() {
	            this._initKeyHandler();
	            this._initEvent();
	        }

	        /**
	         * _initKeyHandler
	         * Initialize key event handler
	         * @memberOf WwCodeBlockManager
	         * @private
	         */

	    }, {
	        key: '_initKeyHandler',
	        value: function _initKeyHandler() {
	            this.wwe.addKeyEventHandler('BACK_SPACE', this._removeCodeblockIfNeed.bind(this));
	        }

	        /**
	         * _initEvent
	         * Initialize eventmanager event
	         * @memberOf WwCodeBlockManager
	         * @private
	         */

	    }, {
	        key: '_initEvent',
	        value: function _initEvent() {
	            var self = this;

	            this.eventManager.listen('wysiwygSetValueAfter', function () {
	                self.splitCodeblockToEachLine();
	            });

	            this.eventManager.listen('wysiwygProcessHTMLText', function (html) {
	                return self._mergeCodeblockEachlinesFromHTMLText(html);
	            });
	        }

	        /**
	         * Convert copied nodes to code block if need
	         * @api
	         * @memberOf WwCodeBlockManager
	         * @param {Array.<Node>} nodes Node array
	         * @returns {DocumentFragment}
	         */

	    }, {
	        key: 'prepareToPasteOnCodeblock',
	        value: function prepareToPasteOnCodeblock(nodes) {
	            var range = this.wwe.getEditor().getSelection().cloneRange();
	            var frag = this.wwe.getEditor().getDocument().createDocumentFragment();

	            if (nodes.length === 1 && this._isCodeBlock(nodes[0])) {
	                frag.appendChild(this._copyCodeblockTypeFromRangeCodeblock(nodes.shift(), range));
	            } else {
	                frag.appendChild(this._copyCodeblockTypeFromRangeCodeblock(this.convertToCodeblock(nodes), range));
	            }

	            return frag;
	        }

	        /**
	         * Wrap nodes into code block
	         * @api
	         * @memberOf WwCodeBlockManager
	         * @param {Array.<Node>} nodes Node array
	         * @returns {HTMLElement} Code block element
	         */

	    }, {
	        key: 'convertToCodeblock',
	        value: function convertToCodeblock(nodes) {
	            var $codeblock = $('<pre />');
	            var self = this;
	            var node = nodes.shift();

	            while (util.isTruthy(node)) {
	                $codeblock.append(self._makeCodeBlockLineHtml(util.isString(node) ? node : node.textContent));
	                node = nodes.shift();
	            }

	            $codeblock.attr(CODEBLOCK_ATTR_NAME, '');

	            return $codeblock[0];
	        }

	        /**
	         * Copy content with code block style from code block selection
	         * @memberOf WwCodeBlockManager
	         * @param {HTMLElement} element Copied element
	         * @param {Range} range Range object
	         * @returns {HTMLElement}
	         * @private
	         */

	    }, {
	        key: '_copyCodeblockTypeFromRangeCodeblock',
	        value: function _copyCodeblockTypeFromRangeCodeblock(element, range) {
	            var blockNode = _domUtils2.default.getParentUntil(range.commonAncestorContainer, this.wwe.get$Body()[0]);

	            if (_domUtils2.default.getNodeName(blockNode) === 'PRE') {
	                var attrs = $(blockNode).prop('attributes');

	                util.forEach(attrs, function (attr) {
	                    $(element).attr(attr.name, attr.value);
	                });
	            }

	            return element;
	        }

	        /**
	         * Merge code block lines
	         * @memberOf WwCodeBlockManager
	         * @param {string} html HTML string
	         * @returns {string}
	         * @private
	         */

	    }, {
	        key: '_mergeCodeblockEachlinesFromHTMLText',
	        value: function _mergeCodeblockEachlinesFromHTMLText(html) {
	            html = html.replace(/<pre( .*?)?>(.*?)<\/pre>/g, function (match, codeAttr, code) {
	                code = code.replace(/<br \/>/g, '\n');
	                code = code.replace(/<div ?(.*?)>/g, '');
	                code = code.replace(/\n$/, '');

	                return '<pre><code' + (codeAttr || '') + '>' + code + '</code></pre>';
	            });

	            return html;
	        }

	        /**
	         * Split code block to lines
	         * @memberOf WwCodeBlockManager
	         * @param {HTMLElement} node root node to find pre
	         * @private
	         */

	    }, {
	        key: 'splitCodeblockToEachLine',
	        value: function splitCodeblockToEachLine(node) {
	            var self = this;

	            if (!node) {
	                node = this.wwe.get$Body();
	            }

	            $(node).find('pre').each(function (index, pre) {
	                var $pre = $(pre);
	                var lang = $pre.find('code').attr('data-language');
	                var textLines = void 0;

	                // pre태그 밑에 라인으로 의심되는 요소들이 있다면
	                if ($pre.children().length > 1) {
	                    textLines = [];

	                    $pre.children().each(function (idx, childNode) {
	                        if ((childNode.nodeName === 'DIV' || childNode.nodeName === 'P') && !$(childNode).find('br').length) {
	                            $(childNode).append('<br>');
	                        }
	                    });
	                }

	                $pre.find('br').replaceWith('\n');
	                textLines = $pre.text().replace(/\s+$/, '').split(/\n/g);

	                if (lang) {
	                    $pre.attr('data-language', lang);
	                    $pre.addClass('lang-' + lang);
	                }

	                $pre.empty();

	                util.forEach(textLines, function (line) {
	                    $pre.append(self._makeCodeBlockLineHtml(line));
	                });

	                $pre.attr(CODEBLOCK_ATTR_NAME, '');
	            });
	        }

	        /**
	         * Make code HTML text
	         * @memberOf WwCodeBlockManager
	         * @param {string} lineContent Content text
	         * @returns {string}
	         * @private
	         */

	    }, {
	        key: '_makeCodeBlockLineHtml',
	        value: function _makeCodeBlockLineHtml(lineContent) {
	            if (!lineContent) {
	                lineContent = '<br>';
	            } else {
	                lineContent = sanitizeHtmlCode(lineContent);
	            }

	            return '<div>' + lineContent + '</div>';
	        }

	        /**
	         * Remove codeblock if need
	         * @memberOf WwCodeBlockManager
	         * @param {Event} ev Event object
	         * @param {Range} range Range object
	         * @returns {boolean}
	         * @private
	         */

	    }, {
	        key: '_removeCodeblockIfNeed',
	        value: function _removeCodeblockIfNeed(ev, range) {
	            var self = this;

	            if (!this.isInCodeBlock(range)) {
	                return true;
	            }

	            var pre = $(range.startContainer).closest('pre');
	            var $div = $(pre).find('div').eq(0);
	            var codeContent = $div.text().replace(FIND_ZWS_RX, '');

	            // 코드블럭이 code한줄 밖에 없을때
	            if ((range.startOffset === 0 || codeContent.length === 0) && $(pre).find('div').length <= 1) {
	                this.wwe.getEditor().modifyBlocks(function () {
	                    var newFrag = self.wwe.getEditor().getDocument().createDocumentFragment();
	                    var content = void 0;

	                    if (codeContent.length === 0) {
	                        content = '<br>';
	                    } else {
	                        content = $div.html().replace(FIND_ZWS_RX, '');
	                    }

	                    $(newFrag).append($('<div>' + content + '</div>'));

	                    return newFrag;
	                });

	                return false;
	            }

	            return true;
	        }

	        /**
	         * Return boolean value of whether current range is in the code block
	         * @memberOf WwCodeBlockManager
	         * @param {Range} range Range object
	         * @returns {boolean}
	         */

	    }, {
	        key: 'isInCodeBlock',
	        value: function isInCodeBlock(range) {
	            var target = void 0;

	            if (range.collapsed) {
	                target = range.startContainer;
	            } else {
	                target = range.commonAncestorContainer;
	            }

	            return this._isCodeBlock(target);
	        }

	        /**
	         * Verify given element is code block
	         * @memberOf WwCodeBlockManager
	         * @param {HTMLElement} element Element
	         * @returns {boolean}
	         * @private
	         */

	    }, {
	        key: '_isCodeBlock',
	        value: function _isCodeBlock(element) {
	            return !!$(element).closest('pre').length;
	        }
	    }]);

	    return WwCodeBlockManager;
	}();

	/**
	 * Sanitize HTML code
	 * @param {string} code code string
	 * @returns {string}
	 */


	function sanitizeHtmlCode(code) {
	    return code.replace(/[<>&]/g, function (tag) {
	        return tagEntities[tag] || tag;
	    });
	}

	module.exports = WwCodeBlockManager;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _domUtils = __webpack_require__(8);

	var _domUtils2 = _interopRequireDefault(_domUtils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @fileoverview Implements
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

	var Squire = window.Squire;
	var util = tui.util;

	var FIND_BLOCK_TAGNAME_RX = /\b(H[\d]|LI|P|BLOCKQUOTE|TD)\b/;
	var isIElt11 = /Trident\/[456]\./.test(navigator.userAgent);

	/**
	 * SquireExt
	 * @exports SquireExt
	 * @augments Squire
	 * @constructor
	 * @class
	 */

	var SquireExt = function (_Squire) {
	    _inherits(SquireExt, _Squire);

	    function SquireExt() {
	        var _ref;

	        _classCallCheck(this, SquireExt);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        var _this = _possibleConstructorReturn(this, (_ref = SquireExt.__proto__ || Object.getPrototypeOf(SquireExt)).call.apply(_ref, [this].concat(args)));

	        _this._decorateHandlerToCancelable('copy');
	        _this._decorateHandlerToCancelable(isIElt11 ? 'beforepaste' : 'paste');

	        _this.get$Body = function () {
	            _this.$body = _this.$body || $(_this.getRoot());

	            return _this.$body;
	        };
	        return _this;
	    }

	    /**
	     * _decorateHandlerToCancelable
	     * Decorate squire handler to cancelable cuz sometimes, we dont need squire handler process
	     * @param {string} eventName event name
	     */


	    _createClass(SquireExt, [{
	        key: '_decorateHandlerToCancelable',
	        value: function _decorateHandlerToCancelable(eventName) {
	            var handlers = this._events[eventName];

	            if (handlers.length > 1) {
	                throw new Error('too many' + eventName + 'handlers in squire');
	            }

	            var handler = handlers[0].bind(this);

	            handlers[0] = function (event) {
	                if (!event.defaultPrevented) {
	                    handler(event);
	                }
	            };
	        }
	    }, {
	        key: 'changeBlockFormat',
	        value: function changeBlockFormat(srcCondition, targetTagName) {
	            var _this2 = this;

	            this.modifyBlocks(function (frag) {
	                var current = void 0,
	                    newFrag = void 0,
	                    newBlock = void 0,
	                    nextBlock = void 0,
	                    tagName = void 0,
	                    lastNodeOfNextBlock = void 0,
	                    appendChidToNextBlock = void 0;

	                // HR은 Block으로 치지 않아서 frag에나타나지 않는다
	                // 디폴트 블럭을 만들어준다.
	                if (frag.childNodes.length) {
	                    current = frag.childNodes[0];
	                } else {
	                    current = _this2.createDefaultBlock();
	                    frag.appendChild(current);
	                }

	                if (srcCondition) {
	                    // find last depth
	                    while (current.firstChild) {
	                        current = current.firstChild;
	                    }

	                    appendChidToNextBlock = function appendChidToNextBlock(node) {
	                        nextBlock.appendChild(node);
	                    };

	                    // find tag
	                    while (current !== frag) {
	                        tagName = current.tagName;

	                        if (util.isFunction(srcCondition) ? srcCondition(tagName) : tagName === srcCondition) {
	                            nextBlock = current.childNodes[0];

	                            // there is no next blocktag
	                            // eslint-disable-next-line max-depth
	                            if (!_domUtils2.default.isElemNode(nextBlock) || current.childNodes.length > 1) {
	                                nextBlock = _this2.createDefaultBlock();

	                                util.forEachArray(util.toArray(current.childNodes), appendChidToNextBlock);

	                                lastNodeOfNextBlock = nextBlock.lastChild;

	                                // remove unneccesary br
	                                // eslint-disable-next-line max-depth
	                                if (lastNodeOfNextBlock && _domUtils2.default.getNodeName(lastNodeOfNextBlock) === 'BR') {
	                                    nextBlock.removeChild(lastNodeOfNextBlock);
	                                }
	                            }

	                            // eslint-disable-next-line max-depth
	                            if (targetTagName) {
	                                newBlock = _this2.createElement(targetTagName, [nextBlock]);
	                            } else {
	                                newBlock = nextBlock;
	                            }

	                            newFrag = _this2.getDocument().createDocumentFragment();
	                            newFrag.appendChild(newBlock);

	                            frag = newFrag;

	                            break;
	                        }

	                        current = current.parentNode;
	                    }
	                }

	                // if source condition node is not founded, we wrap current div node with node named targetTagName
	                if ((!newFrag || !srcCondition) && targetTagName && _domUtils2.default.getNodeName(frag.childNodes[0]) === 'DIV') {
	                    frag = _this2.createElement(targetTagName, [frag.childNodes[0]]);
	                }

	                return frag;
	            });
	        }
	    }, {
	        key: 'changeBlockFormatTo',
	        value: function changeBlockFormatTo(targetTagName) {
	            this.changeBlockFormat(function (tagName) {
	                return FIND_BLOCK_TAGNAME_RX.test(tagName);
	            }, targetTagName);
	        }
	    }, {
	        key: 'getCaretPosition',
	        value: function getCaretPosition() {
	            return this.getCursorPosition();
	        }
	    }, {
	        key: 'replaceSelection',
	        value: function replaceSelection(content, selection) {
	            if (selection) {
	                this.setSelection(selection);
	            }

	            this._ignoreChange = true;
	            this.insertHTML(content);
	        }
	    }, {
	        key: 'replaceRelativeOffset',
	        value: function replaceRelativeOffset(content, offset, overwriteLength) {
	            var selection = this.getSelection().cloneRange();

	            this._replaceRelativeOffsetOfSelection(content, offset, overwriteLength, selection);
	        }
	    }, {
	        key: '_replaceRelativeOffsetOfSelection',
	        value: function _replaceRelativeOffsetOfSelection(content, offset, overwriteLength, selection) {
	            var startSelectionInfo = void 0,
	                endSelectionInfo = void 0,
	                finalOffset = void 0;
	            var endOffsetNode = selection.endContainer;
	            var endTextOffset = selection.endOffset;

	            if (_domUtils2.default.getNodeName(endOffsetNode) !== 'TEXT') {
	                endOffsetNode = this._getClosestTextNode(endOffsetNode, endTextOffset);

	                if (endOffsetNode) {
	                    if (_domUtils2.default.isTextNode(endOffsetNode)) {
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
	        }
	    }, {
	        key: '_getClosestTextNode',
	        value: function _getClosestTextNode(node, offset) {
	            var foundNode = _domUtils2.default.getChildNodeByOffset(node, offset - 1);

	            if (_domUtils2.default.getNodeName(foundNode) !== 'TEXT') {
	                foundNode = foundNode.previousSibling;
	            }

	            return foundNode;
	        }
	    }, {
	        key: 'getSelectionInfoByOffset',
	        value: function getSelectionInfoByOffset(anchorElement, offset) {
	            var traceElement = void 0,
	                traceElementLength = void 0,
	                traceOffset = void 0,
	                stepLength = void 0;
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
	                if (_domUtils2.default.isTextNode(traceElement)) {
	                    traceElementLength = traceElement.nodeValue.length;
	                } else {
	                    traceElementLength = traceElement.textContent.length;
	                }

	                stepLength += traceElementLength;

	                if (offsetAbs <= stepLength) {
	                    break;
	                }

	                traceOffset -= traceElementLength;

	                if (_domUtils2.default.getTextLength(traceElement) > 0) {
	                    latestAvailableElement = traceElement;
	                }

	                traceElement = traceElement[direction + 'Sibling'];
	            }

	            if (!traceElement) {
	                traceElement = latestAvailableElement;
	                traceOffset = _domUtils2.default.getTextLength(traceElement);
	            }

	            if (direction === 'previous') {
	                traceOffset = _domUtils2.default.getTextLength(traceElement) - traceOffset;
	            }

	            return {
	                element: traceElement,
	                offset: traceOffset
	            };
	        }
	    }, {
	        key: 'getSelectionPosition',
	        value: function getSelectionPosition(selection, style, offset) {
	            var marker = this.createElement('INPUT');
	            var range = selection.cloneRange();
	            var endSelectionInfo = this.getSelectionInfoByOffset(selection.endContainer, selection.endOffset + (offset || 0));
	            range.setStart(range.startContainer, range.startOffset);
	            range.setEnd(endSelectionInfo.element, endSelectionInfo.offset);

	            // to prevent squire input event fire
	            this._ignoreChange = true;
	            this.insertElement(marker, range);

	            var pos = $(marker).offset();

	            if (style !== 'over') {
	                pos.top += $(marker).outerHeight();
	            }

	            marker.parentNode.removeChild(marker);

	            selection.setStart(selection.endContainer, selection.endOffset);
	            selection.collapse(true);

	            this.setSelection(selection);

	            return pos;
	        }
	    }, {
	        key: 'removeLastUndoStack',
	        value: function removeLastUndoStack() {
	            if (this._undoStack.length) {
	                this._undoStackLength -= 1;
	                this._undoIndex -= 1;
	                this._undoStack.pop();
	                this._isInUndoState = false;
	            }
	        }
	    }, {
	        key: 'replaceParent',
	        value: function replaceParent(node, from, to) {
	            var target = $(node).closest(from);

	            if (target.length) {
	                target.wrapInner('<' + to + '/>');
	                target.children().unwrap();
	            }
	        }
	    }, {
	        key: 'preserveLastLine',
	        value: function preserveLastLine() {
	            var lastBlock = this.get$Body().children().last();

	            if (_domUtils2.default.getNodeName(lastBlock[0]) !== 'DIV') {
	                this._ignoreChange = true;
	                $(this.createDefaultBlock()).insertAfter(lastBlock);
	            }
	        }
	    }, {
	        key: 'scrollTop',
	        value: function scrollTop(top) {
	            if (util.isUndefined(top)) {
	                return this.get$Body().scrollTop();
	            }

	            return this.get$Body().scrollTop(top);
	        }
	    }, {
	        key: 'isIgnoreChange',
	        value: function isIgnoreChange() {
	            return this._ignoreChange;
	        }
	    }, {
	        key: 'focus',
	        value: function focus() {
	            var scrollTop = this.scrollTop();

	            Squire.prototype.focus.call(this);

	            // In webkit, if contenteditable element focus method have been invoked when another input element has focus,
	            // contenteditable scroll to top automatically so we need scroll it back
	            if (scrollTop !== this.scrollTop()) {
	                this.scrollTop(scrollTop);
	            }

	            return this;
	        }
	    }]);

	    return SquireExt;
	}(Squire);

	module.exports = SquireExt;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements WwTextObject
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _domUtils = __webpack_require__(8);

	var _domUtils2 = _interopRequireDefault(_domUtils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var isIE11 = tui.util.browser.msie && tui.util.browser.version === 11;
	var isWindowChrome = navigator.appVersion.indexOf('Win') !== -1 && tui.util.browser.chrome;
	var isNeedOffsetFix = isIE11 || isWindowChrome;

	/**
	 * WwTextObject
	 * @exports WwTextObject
	 * @class WwTextObject
	 * @constructor
	 * @param {WysiwygEditor} wwe wysiwygEditor
	 * @param {Range} range Range object
	 */

	var WwTextObject = function () {
	    function WwTextObject(wwe, range) {
	        _classCallCheck(this, WwTextObject);

	        this._wwe = wwe;

	        // msie11 and window chrome can't make start offset of range api correctly when compositing korean.
	        // so we need fix this when compositing korean.(and maybe other languages that needs composition.)
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


	    _createClass(WwTextObject, [{
	        key: '_initCompositionEvent',
	        value: function _initCompositionEvent() {
	            var _this = this;

	            this._wwe.getEditor().addEventListener('compositionstart', function () {
	                _this.isComposition = true;
	            });

	            this._wwe.getEditor().addEventListener('compositionend', function () {
	                _this.isComposition = false;
	            });
	        }

	        /**
	         * Set _range object to given range object
	         * @param {Range} range Range object
	         * @memberOf WwTextObject
	         * @api
	         */

	    }, {
	        key: 'setRange',
	        value: function setRange(range) {
	            if (this._range) {
	                this._range.detach();
	            }

	            this._range = range;
	        }

	        /**
	         * Expand start offset by one
	         * @memberOf WwTextObject
	         * @api
	         */

	    }, {
	        key: 'expandStartOffset',
	        value: function expandStartOffset() {
	            var range = this._range;

	            if (_domUtils2.default.isTextNode(range.startContainer) && range.startOffset > 0) {
	                range.setStart(range.startContainer, range.startOffset - 1);
	            }
	        }

	        /**
	         * Expand end offset by one
	         * @memberOf WwTextObject
	         * @api
	         */

	    }, {
	        key: 'expandEndOffset',
	        value: function expandEndOffset() {
	            var range = this._range;

	            if (_domUtils2.default.isTextNode(range.endContainer) && range.endOffset < range.endContainer.nodeValue.length) {
	                range.setEnd(range.endContainer, range.endOffset + 1);
	            }
	        }

	        /**
	         * setEnd range on start
	         * @param {Range} range Range object
	         * @memberOf WwTextObject
	         * @api
	         */

	    }, {
	        key: 'setEndBeforeRange',
	        value: function setEndBeforeRange(range) {
	            var offset = range.startOffset;

	            if (this.isComposition) {
	                offset += 1;
	            }

	            this._range.setEnd(range.startContainer, offset);
	        }

	        /**
	         * Get text content
	         * @returns {string}
	         * @memberOf WwTextObject
	         * @api
	         */

	    }, {
	        key: 'getTextContent',
	        value: function getTextContent() {
	            return this._range.cloneContents().textContent;
	        }

	        /**
	         * Replace current selection content to given text
	         * @param {string} content Text content
	         * @memberOf WwTextObject
	         * @api
	         */

	    }, {
	        key: 'replaceContent',
	        value: function replaceContent(content) {
	            this._wwe.getEditor().setSelection(this._range);
	            this._wwe.getEditor().insertHTML(content);
	            this._range = this._wwe.getRange();
	        }

	        /**
	         * Delete current selection content
	         * @memberOf WwTextObject
	         * @api
	         */

	    }, {
	        key: 'deleteContent',
	        value: function deleteContent() {
	            this._wwe.getEditor().setSelection(this._range);
	            this._wwe.getEditor().insertHTML('');
	            this._range = this._wwe.getRange();
	        }

	        /**
	         * Peek previous element's content
	         * @param {number} offset Offset to peek
	         * @returns {string}
	         * @memberOf WwTextObject
	         * @api
	         */

	    }, {
	        key: 'peekStartBeforeOffset',
	        value: function peekStartBeforeOffset(offset) {
	            var range = this._range.cloneRange();

	            range.setStart(range.startContainer, Math.max(range.startOffset - offset, 0));
	            range.setEnd(this._range.startContainer, this._range.startOffset);

	            return range.cloneContents().textContent;
	        }
	    }]);

	    return WwTextObject;
	}();

	module.exports = WwTextObject;

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	/**
	 * Editor container template
	 * @type {string}
	 */
	var containerTmpl = ['<div class="tui-editor">', '<div class="te-md-container">', '<div class="te-editor" />', '<div class="te-md-splitter" />', '<div class="te-preview" />', '</div>', '<div class="te-ww-container">', '<div class="te-editor" />', '</div>', '</div>'].join('');

	/**
	 * Layout
	 * @exports Layout
	 * @constructor
	 * @class Layout
	 * @param {object} options Option object
	 * @param {EventManager} eventManager Event manager instance
	 */

	var Layout = function () {
	    function Layout(options, eventManager) {
	        _classCallCheck(this, Layout);

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


	    _createClass(Layout, [{
	        key: 'init',
	        value: function init() {
	            this._renderLayout();

	            this._initMarkdownAndPreviewSection();
	            this._initWysiwygSection();
	        }

	        /**
	         * Initialize show and hide event
	         * @memberOf Layout
	         * @private
	         */

	    }, {
	        key: '_initEvent',
	        value: function _initEvent() {
	            this.eventManager.listen('hide', this.hide.bind(this));
	            this.eventManager.listen('show', this.show.bind(this));
	        }

	        /**
	         * Create editor container with template
	         * @memberOf Layout
	         * @private
	         */

	    }, {
	        key: '_renderLayout',
	        value: function _renderLayout() {
	            this.$containerEl = $(containerTmpl).appendTo(this.$el);
	        }

	        /**
	         * Switch editor mode to WYSIWYG
	         * @api
	         * @memberOf Layout
	         */

	    }, {
	        key: 'switchToWYSIWYG',
	        value: function switchToWYSIWYG() {
	            this.$containerEl.removeClass('te-md-mode');
	            this.$containerEl.addClass('te-ww-mode');
	        }

	        /**
	         * Switch editor mode to Markdown
	         * @api
	         * @memberOf Layout
	         */

	    }, {
	        key: 'switchToMarkdown',
	        value: function switchToMarkdown() {
	            this.$containerEl.removeClass('te-ww-mode');
	            this.$containerEl.addClass('te-md-mode');
	        }

	        /**
	         * Initialize editor to Markdown and set preview section
	         * @memberOf Layout
	         * @private
	         */

	    }, {
	        key: '_initMarkdownAndPreviewSection',
	        value: function _initMarkdownAndPreviewSection() {
	            this.$mdEditorContainerEl = this.$containerEl.find('.te-md-container .te-editor');
	            this.$previewEl = this.$containerEl.find('.te-md-container .te-preview');
	        }

	        /**
	         * Initialize editor to WYSIWYG
	         * @memberOf Layout
	         * @private
	         */

	    }, {
	        key: '_initWysiwygSection',
	        value: function _initWysiwygSection() {
	            this.$wwEditorContainerEl = this.$containerEl.find('.te-ww-container .te-editor');
	        }

	        /**
	         * Set preview to vertical split style
	         * @memberOf Layout
	         * @private
	         */

	    }, {
	        key: '_verticalSplitStyle',
	        value: function _verticalSplitStyle() {
	            this.$containerEl.find('.te-md-container').removeClass('te-preview-style-tab');
	            this.$containerEl.find('.te-md-container').addClass('te-preview-style-vertical');
	        }

	        /**
	         * Set tab style preview mode
	         * @memberOf Layout
	         * @private
	         */

	    }, {
	        key: '_tabStyle',
	        value: function _tabStyle() {
	            this.$containerEl.find('.te-md-container').removeClass('te-preview-style-vertical');
	            this.$containerEl.find('.te-md-container').addClass('te-preview-style-tab');
	        }

	        /**
	         * Toggle preview style between tab and vertical split
	         * @api
	         * @memberOf Layout
	         * @param {string} style Preview style ('tab' or 'vertical')
	         */

	    }, {
	        key: 'changePreviewStyle',
	        value: function changePreviewStyle(style) {
	            if (style === 'tab') {
	                this._tabStyle();
	            } else if (style === 'vertical') {
	                this._verticalSplitStyle();
	            }
	        }

	        /**
	         * Hide Editor
	         * @api
	         * @memberOf Layout
	         */

	    }, {
	        key: 'hide',
	        value: function hide() {
	            this.$el.find('.tui-editor').addClass('te-hide');
	        }

	        /**
	         * Show Editor
	         * @api
	         * @memberOf Layout
	         */

	    }, {
	        key: 'show',
	        value: function show() {
	            this.$el.find('.tui-editor').removeClass('te-hide');
	        }

	        /**
	         * Remove Editor
	         * @api
	         * @memberOf Layout
	         */

	    }, {
	        key: 'remove',
	        value: function remove() {
	            this.$el.find('.tui-editor').remove();
	        }

	        /**
	         * Get jQuery wrapped editor container element
	         * @api
	         * @memberOf Layout
	         * @returns {jQuery}
	         */

	    }, {
	        key: 'getEditorEl',
	        value: function getEditorEl() {
	            return this.$containerEl;
	        }

	        /**
	         * Get jQuery wrapped preview element
	         * @api
	         * @memberOf Layout
	         * @returns {jQuery}
	         */

	    }, {
	        key: 'getPreviewEl',
	        value: function getPreviewEl() {
	            return this.$previewEl;
	        }

	        /**
	         * Get jQuery wrapped Markdown editor element
	         * @api
	         * @memberOf Layout
	         * @returns {jQuery}
	         */

	    }, {
	        key: 'getMdEditorContainerEl',
	        value: function getMdEditorContainerEl() {
	            return this.$mdEditorContainerEl;
	        }

	        /**
	         * Get jQuery wrapped WYSIWYG editor element
	         * @api
	         * @memberOf Layout
	         * @returns {jQuery}
	         */

	    }, {
	        key: 'getWwEditorContainerEl',
	        value: function getWwEditorContainerEl() {
	            return this.$wwEditorContainerEl;
	        }
	    }]);

	    return Layout;
	}();

	module.exports = Layout;

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @fileoverview Implements EventManager
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */
	var util = tui.util;

	var eventList = ['previewBeforeHook', 'previewRenderAfter', 'previewNeedsRefresh', 'addImageBlobHook', 'setValueAfter', 'contentChangedFromWysiwyg', 'changeFromWysiwyg', 'contentChangedFromMarkdown', 'changeFromMarkdown', 'change', 'changeModeToWysiwyg', 'changeModeToMarkdown', 'changeModeBefore', 'changeMode', 'changePreviewStyle', 'openPopupAddLink', 'openPopupAddImage', 'openPopupAddTable', 'openPopupTableUtils', 'openHeadingSelect', 'closeAllPopup', 'command', 'htmlUpdate', 'markdownUpdate', 'renderedHtmlUpdated', 'removeEditor', 'convertorAfterMarkdownToHtmlConverted', 'convertorAfterHtmlToMarkdownConverted', 'stateChange', 'wysiwygSetValueAfter', 'wysiwygSetValueBefore', 'wysiwygGetValueBefore', 'wysiwygProcessHTMLText', 'wysiwygRangeChangeAfter', 'wysiwygKeyEvent', 'pasteBefore', 'scroll', 'click', 'mousedown', 'mouseover', 'mouseup', 'contextmenu', 'keydown', 'keyup', 'keyMap', 'load', 'focus', 'blur', 'paste', 'copy', 'cut', 'drop', 'show', 'hide'];

	/**
	 * EventManager
	 * @exports EventManager
	 * @class EventManager
	 */

	var EventManager = function () {
	    function EventManager() {
	        _classCallCheck(this, EventManager);

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


	    _createClass(EventManager, [{
	        key: 'listen',
	        value: function listen(typeStr, handler) {
	            var typeInfo = this._getTypeInfo(typeStr);
	            var eventHandlers = this.events.get(typeInfo.type) || [];

	            if (!this._hasEventType(typeInfo.type)) {
	                throw new Error('There is no event type ' + typeInfo.type);
	            }

	            if (typeInfo.namespace) {
	                handler.namespace = typeInfo.namespace;
	            }

	            eventHandlers.push(handler);

	            this.events.set(typeInfo.type, eventHandlers);
	        }

	        /**
	         * Emit event
	         * @api
	         * @memberOf EventManager
	         * @param {string} eventName Event name to emit
	         * @returns {Array}
	         */

	    }, {
	        key: 'emit',
	        value: function emit() {
	            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	                args[_key] = arguments[_key];
	            }

	            var typeStr = args.shift();
	            var typeInfo = this._getTypeInfo(typeStr);
	            var eventHandlers = this.events.get(typeInfo.type);
	            var results = void 0;

	            if (eventHandlers) {
	                util.forEach(eventHandlers, function (handler) {
	                    var result = handler.apply(undefined, args);

	                    if (!util.isUndefined(result)) {
	                        results = results || [];
	                        results.push(result);
	                    }
	                });
	            }

	            return results;
	        }

	        /**
	         * Emit given event and return result
	         * @api
	         * @memberOf EventManager
	         * @param {string} eventName Event name to emit
	         * @param {string} sourceText Source text to change
	         * @returns {string}
	         */

	    }, {
	        key: 'emitReduce',
	        value: function emitReduce() {
	            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	                args[_key2] = arguments[_key2];
	            }

	            var type = args.shift();
	            var eventHandlers = this.events.get(type);

	            if (eventHandlers) {
	                util.forEach(eventHandlers, function (handler) {
	                    var result = handler.apply(undefined, args);

	                    if (!util.isFalsy(result)) {
	                        args[0] = result;
	                    }
	                });
	            }

	            return args[0];
	        }

	        /**
	         * Get event type and namespace
	         * @memberOf EventManager
	         * @param {string} typeStr Event type name
	         * @returns {{type: string, namespace: string}}
	         * @private
	         */

	    }, {
	        key: '_getTypeInfo',
	        value: function _getTypeInfo(typeStr) {
	            var splited = typeStr.split('.');

	            return {
	                type: splited[0],
	                namespace: splited[1]
	            };
	        }

	        /**
	         * Check whether event type exists or not
	         * @param {string} type Event type name
	         * @returns {boolean}
	         * @private
	         */

	    }, {
	        key: '_hasEventType',
	        value: function _hasEventType(type) {
	            return !util.isUndefined(this.TYPE[this._getTypeInfo(type).type]);
	        }

	        /**
	         * Add event type when given event not exists
	         * @api
	         * @memberOf EventManager
	         * @param {string} type Event type name
	         */

	    }, {
	        key: 'addEventType',
	        value: function addEventType(type) {
	            if (this._hasEventType(type)) {
	                throw new Error('There is already have event type ' + type);
	            }

	            this.TYPE.set(type);
	        }

	        /**
	         * Remove event handler from given event type
	         * @api
	         * @memberOf EventManager
	         * @param {string} typeStr Event type name
	         */

	    }, {
	        key: 'removeEventHandler',
	        value: function removeEventHandler(typeStr) {
	            var _this = this;

	            var _getTypeInfo2 = this._getTypeInfo(typeStr),
	                type = _getTypeInfo2.type,
	                namespace = _getTypeInfo2.namespace;

	            if (type && !namespace) {
	                // dont use dot notation cuz eslint
	                this.events['delete'](type);
	            } else if (!type && namespace) {
	                this.events.forEach(function (eventHandlers, eventType) {
	                    _this._removeEventHandlerWithTypeInfo(eventType, namespace);
	                });
	            } else if (type && namespace) {
	                this._removeEventHandlerWithTypeInfo(type, namespace);
	            }
	        }

	        /**
	         * Remove event handler with event type information
	         * @memberOf EventManager
	         * @param {string} type Event type name
	         * @param {string} namespace Event namespace
	         * @private
	         */

	    }, {
	        key: '_removeEventHandlerWithTypeInfo',
	        value: function _removeEventHandlerWithTypeInfo(type, namespace) {
	            var handlersToSurvive = [];
	            var eventHandlers = this.events.get(type);

	            eventHandlers.map(function (handler) {
	                if (handler.namespace !== namespace) {
	                    handlersToSurvive.push(handler);
	                }
	            });

	            this.events.set(type, handlersToSurvive);
	        }
	    }]);

	    return EventManager;
	}();

	module.exports = EventManager;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implements CommandManager
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _command = __webpack_require__(25);

	var _command2 = _interopRequireDefault(_command);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var util = tui.util;

	var isMac = /Mac/.test(navigator.platform);
	var KEYMAP_OS_INDEX = isMac ? 1 : 0;

	/**
	 * CommandManager
	 * @exports CommandManager
	 * @class
	 */

	var CommandManager = function () {
	    /**
	     * @param {ToastUIEditor} base nedInstance
	     */
	    function CommandManager(base) {
	        _classCallCheck(this, CommandManager);

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


	    _createClass(CommandManager, [{
	        key: 'addCommand',
	        value: function addCommand(command) {
	            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	                args[_key - 1] = arguments[_key];
	            }

	            if (args.length) {
	                command = CommandManager.command.apply(CommandManager, [command].concat(args));
	            }

	            var name = command.getName();

	            var commandBase = void 0;

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
	        }

	        /**
	         * _initEvent
	         * Bind event handler to eventManager
	         * @private
	         * @memberOf CommandManager
	         */

	    }, {
	        key: '_initEvent',
	        value: function _initEvent() {
	            var _this = this;

	            this.base.eventManager.listen('command', function () {
	                _this.exec.apply(_this, arguments);
	            });

	            this.base.eventManager.listen('keyMap', function (ev) {
	                var command = _this.keyMapCommand[ev.keyMap];

	                if (command) {
	                    ev.data.preventDefault();
	                    _this.exec(command);
	                }
	            });
	        }

	        /**
	         * Execute command
	         * @api
	         * @memberOf CommandManager
	         * @param {String} name Command name
	         * @returns {*}
	         */

	    }, {
	        key: 'exec',
	        value: function exec(name) {
	            var commandToRun = void 0,
	                result = void 0;
	            var context = this.base;

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
	                var _commandToRun;

	                for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	                    args[_key2 - 1] = arguments[_key2];
	                }

	                args.unshift(context);
	                result = (_commandToRun = commandToRun).exec.apply(_commandToRun, args);
	            }

	            return result;
	        }
	    }]);

	    return CommandManager;
	}();

	/**
	 * Create command by given editor type and property object
	 * @api
	 * @memberOf CommandManager
	 * @param {string} type Command type
	 * @param {{name: string, keyMap: object}} props Property
	 * @returns {*}
	 */


	CommandManager.command = function (type, props) {
	    var command = _command2.default.factory(type, props.name, props.keyMap);

	    util.extend(command, props);

	    return command;
	};

	module.exports = CommandManager;

/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @fileoverview Implements Command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var util = tui.util;

	/**
	 * Command class
	 * @exports Command
	 * @class
	 */

	var Command = function () {
	    /**
	     * @param {string} name Command name
	     * @param {number} type Command type (Command.TYPE)
	     * @param {Array.<string>} [keyMap] keyMap
	     */
	    function Command(name, type, keyMap) {
	        _classCallCheck(this, Command);

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


	    _createClass(Command, [{
	        key: 'getName',
	        value: function getName() {
	            return this.name;
	        }

	        /**
	         * getType
	         * returns Type of command
	         * @api
	         * @memberOf Command
	         * @returns {number} Command Command type number
	         */

	    }, {
	        key: 'getType',
	        value: function getType() {
	            return this.type;
	        }

	        /**
	         * isMDType
	         * returns whether Command Type is Markdown or not
	         * @api
	         * @memberOf Command
	         * @returns {boolean} result
	         */

	    }, {
	        key: 'isMDType',
	        value: function isMDType() {
	            return this.type === Command.TYPE.MD;
	        }

	        /**
	         * isWWType
	         * returns whether Command Type is Wysiwyg or not
	         * @api
	         * @memberOf Command
	         * @returns {boolean} result
	         */

	    }, {
	        key: 'isWWType',
	        value: function isWWType() {
	            return this.type === Command.TYPE.WW;
	        }

	        /**
	         * isGlobalType
	         * returns whether Command Type is Global or not
	         * @api
	         * @memberOf Command
	         * @returns {boolean} result
	         */

	    }, {
	        key: 'isGlobalType',
	        value: function isGlobalType() {
	            return this.type === Command.TYPE.GB;
	        }

	        /**
	         * setKeyMap
	         * Set keymap value for each os
	         * @api
	         * @memberOf Command
	         * @param {string} win Windows Key(and etc)
	         * @param {string} mac Mac osx key
	         */

	    }, {
	        key: 'setKeyMap',
	        value: function setKeyMap(win, mac) {
	            this.keyMap = [win, mac];
	        }
	    }]);

	    return Command;
	}();

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


	Command.factory = function (typeStr, props) {
	    var type = void 0;

	    if (typeStr === 'markdown') {
	        type = Command.TYPE.MD;
	    } else if (typeStr === 'wysiwyg') {
	        type = Command.TYPE.WW;
	    } else if (typeStr === 'global') {
	        type = Command.TYPE.GB;
	    }

	    var command = new Command(props.name, type);

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
/* 26 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var util = tui.util;

	/**
	 * ExtManager
	 * @exports ExtManager
	 * @constructor
	 * @class ExtManager
	 */

	var ExtManager = function () {
	    function ExtManager() {
	        _classCallCheck(this, ExtManager);

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


	    _createClass(ExtManager, [{
	        key: "defineExtension",
	        value: function defineExtension(name, ext) {
	            this.exts.set(name, ext);
	        }

	        /**
	         * Apply extensions
	         * @api
	         * @memberOf ExtManager
	         * @param {object} context Context
	         * @param {Array.<string>} extNames Extension names
	         */

	    }, {
	        key: "applyExtension",
	        value: function applyExtension(context, extNames) {
	            var _this = this;

	            if (extNames) {
	                extNames.forEach(function (extName) {
	                    if (_this.exts.has(extName)) {
	                        _this.exts.get(extName)(context);
	                    }
	                });
	            }
	        }
	    }]);

	    return ExtManager;
	}();

	module.exports = new ExtManager();

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Implement Module for managing import external data such as image
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _excelTableParser = __webpack_require__(28);

	var _excelTableParser2 = _interopRequireDefault(_excelTableParser);

	var _i18n = __webpack_require__(29);

	var _i18n2 = _interopRequireDefault(_i18n);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var util = tui.util;
	var FIND_EXCEL_DATA = /^(([^\n\r]*|"[^"]+")(\t([^\n\r]*?|"[^"]+")){1,}[\r\n]*){1,}$/;

	/**
	 * ImportManager
	 * @exports ImportManager
	 * @constructor
	 * @class ImportManager
	 * @param {EventManager} eventManager eventManager
	 */

	var ImportManager = function () {
	    function ImportManager(eventManager) {
	        _classCallCheck(this, ImportManager);

	        this.eventManager = eventManager;
	        this._lastState = null;

	        this._initEvent();
	        this._initDefaultImageImporter();
	    }

	    /**
	     * Initialize event handler
	     * @memberOf ImportManager
	     * @private
	     */


	    _createClass(ImportManager, [{
	        key: '_initEvent',
	        value: function _initEvent() {
	            var _this = this;

	            this.eventManager.listen('stateChange', function (ev) {
	                _this._lastState = ev;
	            });

	            this.eventManager.listen('drop', function (ev) {
	                var items = ev.data.dataTransfer && ev.data.dataTransfer.files;
	                _this._processBlobItems(items, ev.data);
	            });

	            this.eventManager.listen('paste', function (ev) {
	                _this._processClipboard(ev.data);
	            });

	            this.eventManager.listen('pasteBefore', function (ev) {
	                _this._decodeURL(ev);
	            });
	        }

	        /**
	         * Initialize default image importer
	         * @memberOf ImportManager
	         * @private
	         */

	    }, {
	        key: '_initDefaultImageImporter',
	        value: function _initDefaultImageImporter() {
	            this.eventManager.listen('addImageBlobHook', function (blob, callback) {
	                var reader = new FileReader();

	                reader.onload = function (event) {
	                    callback(event.target.result);
	                };

	                reader.readAsDataURL(blob);
	            });
	        }

	        /**
	         * Emit add image blob hook
	         * @memberOf ImportManager
	         * @param {object} item item
	         * @private
	         */

	    }, {
	        key: '_emitAddImageBlobHook',
	        value: function _emitAddImageBlobHook(item) {
	            var _this2 = this;

	            var blob = item.name ? item : item.getAsFile(); // Blob or File

	            this.eventManager.emit('addImageBlobHook', blob, function (url) {
	                _this2.eventManager.emit('command', 'AddImage', {
	                    imageUrl: url,
	                    altText: blob.name || 'image'
	                });
	            });
	        }

	        /**
	         * Decode url when paste link
	         * @param {object} ev event object
	         */

	    }, {
	        key: '_decodeURL',
	        value: function _decodeURL(ev) {
	            if (ev.source === 'markdown' && ev.data.text.length === 1 && ev.data.text[0].match(/https?:\/\//g)) {
	                ev.data.update(null, null, [decodeURIComponent(ev.data.text[0])]);
	            } else if (ev.source === 'wysiwyg' && ev.data.fragment.childNodes.length === 1 && ev.data.fragment.firstChild.nodeType === Node.ELEMENT_NODE && ev.data.fragment.firstChild.tagName === 'A') {
	                ev.data.fragment.firstChild.textContent = decodeURIComponent(ev.data.fragment.firstChild.textContent);
	            }
	        }

	        /**
	         * Add table with excel style data
	         * @memberOf ImportManager
	         * @param {string} content Table data
	         * @private
	         */

	    }, {
	        key: '_addExcelTable',
	        value: function _addExcelTable(content) {
	            var tableInfo = (0, _excelTableParser2.default)(content);
	            this.eventManager.emit('command', 'Table', tableInfo.col, tableInfo.row, tableInfo.data);
	        }

	        /**
	         * Get blob or excel data from clipboard
	         * @memberOf ImportManager
	         * @param {object} evData Clipboard data
	         * @private
	         */

	    }, {
	        key: '_processClipboard',
	        value: function _processClipboard(evData) {
	            var cbData = evData.clipboardData || window.clipboardData;
	            var blobItems = cbData && cbData.items;
	            var types = cbData.types;

	            if (blobItems && types && types.length === 1 && util.inArray('Files', types) !== -1) {
	                this._processBlobItems(blobItems, evData);
	            } else if (!this._isInBlockFormat()) {
	                this._precessDataTransfer(cbData, evData);
	            }
	        }

	        /**
	         * Process for blob item
	         * @memberOf ImportManager
	         * @param {Array.<string>} items Item array
	         * @param {object} evData Event data
	         * @private
	         */

	    }, {
	        key: '_processBlobItems',
	        value: function _processBlobItems(items, evData) {
	            var _this3 = this;

	            if (items) {
	                util.forEachArray(items, function (item) {
	                    if (item.type.indexOf('image') !== -1) {
	                        evData.preventDefault();
	                        evData.codemirrorIgnore = true;
	                        _this3._emitAddImageBlobHook(item);

	                        return false;
	                    }

	                    return true;
	                });
	            }
	        }

	        /**
	         * Process for excel style data
	         * @memberOf ImportManager
	         * @param {HTMLElement} cbData Clipboard data
	         * @param {object} evData Event data
	         * @private
	         */

	    }, {
	        key: '_precessDataTransfer',
	        value: function _precessDataTransfer(cbData, evData) {
	            var textContent = cbData.getData('text');

	            if (FIND_EXCEL_DATA.test(textContent) && confirm(_i18n2.default.get('Would you like to paste as table?'))) {
	                evData.preventDefault();
	                evData.codemirrorIgnore = true;
	                this._addExcelTable(textContent);
	            }
	        }

	        /**
	         * Returns if current cursor state is in block format ex) blockquote, list, task, codeblock
	         * @returns {boolean}
	         * @private
	         */

	    }, {
	        key: '_isInBlockFormat',
	        value: function _isInBlockFormat() {
	            var state = this._lastState;

	            return state && (state.codeBlock || state.list || state.task || state.code);
	        }
	    }]);

	    return ImportManager;
	}();

	module.exports = ImportManager;

/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * @fileoverview Implements excelTableParser
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	/**
	 * excelTableParser
	 * Parse excel paste data
	 * @public
	 * @exports excelTableParser
	 * @param {string} content excel table content
	 * @returns {object} result
	 */
	function excelTableParser(content) {
	    var rows = getRows(content);
	    var rowLength = rows.length;
	    var data = [];
	    var colLength = 0;

	    rows.forEach(function (row) {
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
	    content = content.replace(/"([^"]+)"/g, function (match, cell) {
	        return cell.replace(/(\r\n)|(\r)/g, '<br/>');
	    });

	    // remove last LF or CR
	    content = content.replace(/(\r\n$)|(\r$)|(\n$)/, '');
	    // CR or CR-LF to LF
	    content = content.replace(/(\r\n)|(\r)/g, '\n');

	    return content.split('\n');
	}

	module.exports = excelTableParser;

/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @fileoverview Implements i18n
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var util = tui.util;

	var sharedInstance = void 0;

	var DEFAULT_CODE = 'en_US';

	/**
	 * I18n
	 * @exports I18n
	 * @class
	 */

	var I18n = function () {
	    function I18n() {
	        _classCallCheck(this, I18n);

	        this._code = DEFAULT_CODE;
	        this._langs = new util.Map();
	    }

	    /**
	     * Set locale code
	     * @param {string} code locale code
	     */


	    _createClass(I18n, [{
	        key: 'setCode',
	        value: function setCode(code) {
	            this._code = code;
	        }

	        /**
	         * Set language set
	         * @param {string|string[]} codes locale code
	         * @param {object} data language set
	         */

	    }, {
	        key: 'setLang',
	        value: function setLang(codes, data) {
	            var _this = this;

	            codes = [].concat(codes);

	            codes.forEach(function (code) {
	                if (!_this._langs.has(code)) {
	                    _this._langs.set(code, data);
	                } else {
	                    var langData = _this._langs.get(code);
	                    _this._langs.set(code, util.extend(langData, data));
	                }
	            });
	        }

	        /**
	         * Get text of key
	         * @param {string} key key of text
	         * @param {string} code locale code
	         * @returns {string}
	         */

	    }, {
	        key: 'get',
	        value: function get(key, code) {
	            if (!code) {
	                code = this._code;
	            }

	            var langSet = this._langs.get(code);

	            if (!langSet) {
	                langSet = this._langs.get(DEFAULT_CODE);
	            }

	            var text = langSet[key];

	            if (!text) {
	                throw new Error('There is no text key "' + key + '" in ' + code);
	            }

	            return text;
	        }
	    }], [{
	        key: 'getSharedInstance',
	        value: function getSharedInstance() {
	            if (!sharedInstance) {
	                sharedInstance = new I18n();
	            }

	            return sharedInstance;
	        }
	    }]);

	    return I18n;
	}();

	exports.I18n = I18n;
	exports.default = I18n.getSharedInstance();

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview Convertor have responsible to convert markdown and html
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _htmlSanitizer = __webpack_require__(11);

	var _htmlSanitizer2 = _interopRequireDefault(_htmlSanitizer);

	var _markdownitTaskPlugin = __webpack_require__(31);

	var _markdownitTaskPlugin2 = _interopRequireDefault(_markdownitTaskPlugin);

	var _markdownitCodeBlockPlugin = __webpack_require__(32);

	var _markdownitCodeBlockPlugin2 = _interopRequireDefault(_markdownitCodeBlockPlugin);

	var _markdownitCodeRenderer = __webpack_require__(33);

	var _markdownitCodeRenderer2 = _interopRequireDefault(_markdownitCodeRenderer);

	var _markdownitBlockQuoteRenderer = __webpack_require__(34);

	var _markdownitBlockQuoteRenderer2 = _interopRequireDefault(_markdownitBlockQuoteRenderer);

	var _markdownitTableRenderer = __webpack_require__(35);

	var _markdownitTableRenderer2 = _interopRequireDefault(_markdownitTableRenderer);

	var _markdownitHtmlBlockRenderer = __webpack_require__(36);

	var _markdownitHtmlBlockRenderer2 = _interopRequireDefault(_markdownitHtmlBlockRenderer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var markdownIt = window.markdownit,
	    toMark = window.toMark,
	    hljs = window.hljs;

	var markdownitHighlight = markdownIt({
	    html: true,
	    breaks: true,
	    quotes: '“”‘’',
	    langPrefix: 'lang-',
	    highlight: function highlight(codeText, type) {
	        return hljs.getLanguage(type) ? hljs.highlight(type, codeText).value : escape(codeText, false);
	    }
	});
	var markdownit = markdownIt({
	    html: true,
	    breaks: true,
	    quotes: '“”‘’',
	    langPrefix: 'lang-'
	});

	markdownitHighlight.block.ruler.at('table', _markdownitTableRenderer2.default, ['paragraph', 'reference']);
	markdownitHighlight.block.ruler.at('code', _markdownitCodeRenderer2.default);
	markdownitHighlight.block.ruler.at('blockquote', _markdownitBlockQuoteRenderer2.default, ['paragraph', 'reference', 'list']);
	markdownitHighlight.block.ruler.at('html_block', _markdownitHtmlBlockRenderer2.default, ['paragraph', 'reference', 'blockquote']);
	markdownitHighlight.use(_markdownitTaskPlugin2.default);
	markdownitHighlight.use(_markdownitCodeBlockPlugin2.default);

	markdownit.block.ruler.at('table', _markdownitTableRenderer2.default, ['paragraph', 'reference']);
	markdownit.block.ruler.at('code', _markdownitCodeRenderer2.default);
	markdownit.block.ruler.at('blockquote', _markdownitBlockQuoteRenderer2.default, ['paragraph', 'reference', 'list']);
	markdownit.block.ruler.at('html_block', _markdownitHtmlBlockRenderer2.default, ['paragraph', 'reference', 'blockquote']);
	markdownit.use(_markdownitTaskPlugin2.default);
	markdownit.use(_markdownitCodeBlockPlugin2.default);

	/**
	 * Convertor
	 * @exports Convertor
	 * @constructor
	 * @class Convertor
	 * @param {EventManager} em EventManager instance
	 */

	var Convertor = function () {
	    function Convertor(em) {
	        _classCallCheck(this, Convertor);

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


	    _createClass(Convertor, [{
	        key: '_markdownToHtmlWithCodeHighlight',
	        value: function _markdownToHtmlWithCodeHighlight(markdown) {
	            markdown = markdown.replace(/<br>/ig, '<br data-tomark-pass>');

	            var renderedHTML = markdownitHighlight.render(markdown);
	            renderedHTML = this._removeBrToMarkPassAttributeInCode(renderedHTML);

	            return renderedHTML;
	        }

	        /**
	         * _markdownToHtml
	         * Convert markdown to html
	         * @private
	         * @memberOf Convertor
	         * @param {string} markdown markdown text
	         * @returns {string} html text
	         */

	    }, {
	        key: '_markdownToHtml',
	        value: function _markdownToHtml(markdown) {
	            markdown = markdown.replace(/<br>/ig, '<br data-tomark-pass>');

	            var renderedHTML = markdownitHighlight.render(markdown);
	            renderedHTML = this._removeBrToMarkPassAttributeInCode(renderedHTML);

	            return renderedHTML;
	        }

	        /**
	         * Remove BR's data-tomark-pass attribute text when br in code element
	         * @param {string} renderedHTML Rendered HTML string from markdown editor
	         * @returns {string}
	         * @private
	         */

	    }, {
	        key: '_removeBrToMarkPassAttributeInCode',
	        value: function _removeBrToMarkPassAttributeInCode(renderedHTML) {
	            var $wrapperDiv = $('<div />');

	            $wrapperDiv.html(renderedHTML);

	            $wrapperDiv.find('code, pre').each(function (i, codeOrPre) {
	                var $code = $(codeOrPre);
	                $code.html($code.html().replace(/&lt;br data-tomark-pass&gt;/, '&lt;br&gt;'));
	            });

	            renderedHTML = $wrapperDiv.html();

	            return renderedHTML;
	        }

	        /**
	         * toHTMLWithCodeHightlight
	         * Convert markdown to html with Codehighlight
	         * emit convertorAfterMarkdownToHtmlConverted
	         * @api
	         * @memberOf Convertor
	         * @param {string} markdown markdown text
	         * @returns {string} html text
	         */

	    }, {
	        key: 'toHTMLWithCodeHightlight',
	        value: function toHTMLWithCodeHightlight(markdown) {
	            var html = this._markdownToHtmlWithCodeHighlight(markdown);
	            html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);

	            return html;
	        }

	        /**
	         * toHTML
	         * Convert markdown to html
	         * emit convertorAfterMarkdownToHtmlConverted
	         * @api
	         * @memberOf Convertor
	         * @param {string} markdown markdown text
	         * @returns {string} html text
	         */

	    }, {
	        key: 'toHTML',
	        value: function toHTML(markdown) {
	            var html = this._markdownToHtml(markdown);
	            html = this.eventManager.emitReduce('convertorAfterMarkdownToHtmlConverted', html);

	            return html;
	        }
	    }, {
	        key: 'initHtmlSanitizer',
	        value: function initHtmlSanitizer() {
	            this.eventManager.listen('convertorAfterMarkdownToHtmlConverted', function (html) {
	                return (0, _htmlSanitizer2.default)(html, true);
	            });
	        }

	        /**
	         * toMarkdown
	         * Convert html to markdown
	         * emit convertorAfterHtmlToMarkdownConverted
	         * @api
	         * @memberOf Convertor
	         * @param {string} html html text
	         * @returns {string} markdown text
	         */

	    }, {
	        key: 'toMarkdown',
	        value: function toMarkdown(html) {
	            var resultArray = [];
	            var markdown = toMark(this._appendAttributeForBrIfNeed(html));
	            markdown = this.eventManager.emitReduce('convertorAfterHtmlToMarkdownConverted', markdown);

	            tui.util.forEach(markdown.split('\n'), function (line, index) {
	                var FIND_TABLE_RX = /^\|[^|]*\|/ig;
	                var FIND_CODE_RX = /`[^`]*<br>[^`]*`/ig;

	                if (!FIND_CODE_RX.test(line) && !FIND_TABLE_RX.test(line)) {
	                    line = line.replace(/<br>/ig, '<br>\n');
	                }
	                resultArray[index] = line;
	            });

	            return resultArray.join('\n');
	        }
	    }, {
	        key: '_appendAttributeForBrIfNeed',
	        value: function _appendAttributeForBrIfNeed(html) {
	            var FIND_BR_RX = /<br>/ig;
	            var FIND_DOUBLE_BR_RX = /<br \/><br \/>/ig;
	            var FIND_PASSING_AND_NORMAL_BR_RX = /<br data-tomark-pass \/><br \/>(.)/ig;
	            var FIND_FIRST_TWO_BRS_RX = /([^>])<br data-tomark-pass \/><br data-tomark-pass \/>/g;

	            html = html.replace(FIND_BR_RX, '<br />');

	            html = html.replace(FIND_DOUBLE_BR_RX, '<br data-tomark-pass /><br data-tomark-pass />');

	            var div = document.createElement('div');
	            var $div = $(div);
	            $div.html(html);
	            $div.find('pre br,code br').each(function (index, node) {
	                if (node.hasAttribute('data-tomark-pass')) {
	                    node.removeAttribute('data-tomark-pass');
	                }
	            });

	            html = $div.html().replace(/<br data-tomark-pass="">/ig, '<br data-tomark-pass />');
	            html = html.replace(FIND_BR_RX, '<br />');

	            html = html.replace(FIND_PASSING_AND_NORMAL_BR_RX, '<br data-tomark-pass /><br data-tomark-pass />$1');
	            html = html.replace(FIND_FIRST_TWO_BRS_RX, '$1<br /><br />');

	            return html;
	        }

	        /**
	         * factory
	         * Convertor factory
	         * @api
	         * @memberOf Convertor
	         * @param {EventManager} eventManager eventmanager
	         * @returns {Convertor}
	         */

	    }], [{
	        key: 'factory',
	        value: function factory(eventManager) {
	            return new Convertor(eventManager);
	        }

	        /**
	         * Return markdown-it highlight renderer
	         * @returns {markdownIt}
	         */

	    }, {
	        key: 'getMarkdownHighlightRenderer',
	        value: function getMarkdownHighlightRenderer() {
	            return markdownitHighlight;
	        }
	    }]);

	    return Convertor;
	}();

	/**
	 * escape code from markdown-it
	 * @param {string} html HTML string
	 * @param {string} encode Boolean value of whether encode or not
	 * @returns {string}
	 */


	function escape(html, encode) {
	    return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
	}
	module.exports = Convertor;

/***/ },
/* 31 */
/***/ function(module, exports) {

	'use strict';

	// Copyright (c) 2016, Revin Guillen.
	// Distributed under an MIT license: https://github.com/revin/markdown-it-task-lists/

	/**
	 * @fileoverview Implements markdownitTaskPlugin
	 * @modifier Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
	 * @modifier Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
	 */
	/* eslint-disable */

	/**
	 * Task list renderer for Markdown-it
	 * @param {object} markdownit Markdown-it instance
	 */
	var MarkdownitTaskRenderer = function MarkdownitTaskRenderer(markdownit) {
	    markdownit.core.ruler.after('inline', 'tui-task-list', function (state) {
	        var TASK_LIST_ITEM_CLASS_NAME = 'task-list-item';
	        var CHECKED_CLASS_NAME = 'checked';
	        var tokens = state.tokens;
	        var className;
	        var tokenIndex;

	        // tokenIndex=0 'ul', tokenIndex=1 'li', tokenIndex=2 'p_open'
	        for (tokenIndex = 2; tokenIndex < tokens.length; tokenIndex += 1) {
	            if (isTaskListItemToken(tokens, tokenIndex)) {
	                if (isChecked(tokens[tokenIndex])) {
	                    className = TASK_LIST_ITEM_CLASS_NAME + ' ' + CHECKED_CLASS_NAME;
	                } else {
	                    className = TASK_LIST_ITEM_CLASS_NAME;
	                }

	                removeMarkdownTaskFormatText(tokens[tokenIndex]);

	                setTokenAttribute(tokens[tokenIndex - 2], 'class', className);
	                setTokenAttribute(tokens[tokenIndex - 2], 'data-te-task', '');
	            }
	        }
	    });
	};

	/**
	 * Remove task format text for rendering
	 * @param {object} token Token object
	 */
	function removeMarkdownTaskFormatText(token) {
	    // '[X] ' length is 4
	    // FIXED: we don't need first space
	    token.content = token.content.slice(4);
	    token.children[0].content = token.children[0].content.slice(4);
	}

	/**
	 * Return boolean value whether task checked or not
	 * @param {object} token Token object
	 * @returns {boolean}
	 */
	function isChecked(token) {
	    var checked = false;

	    if (token.content.indexOf('[x]') === 0 || token.content.indexOf('[X]') === 0) {
	        checked = true;
	    }

	    return checked;
	}

	/**
	 * Set attribute of passed token
	 * @param {object} token Token object
	 * @param {string} attributeName Attribute name for set
	 * @param {string} attributeValue Attribute value for set
	 */
	function setTokenAttribute(token, attributeName, attributeValue) {
	    var index = token.attrIndex(attributeName);
	    var attr = [attributeName, attributeValue];

	    if (index < 0) {
	        token.attrPush(attr);
	    } else {
	        token.attrs[index] = attr;
	    }
	}

	/**
	 * Return boolean value whether task list item or not
	 * @param {array} tokens Token object
	 * @param {number} index Number of token index
	 * @returns {boolean}
	 */
	function isTaskListItemToken(tokens, index) {
	    return tokens[index].type === 'inline' && tokens[index - 1].type === 'paragraph_open' && tokens[index - 2].type === 'list_item_open' && (tokens[index].content.indexOf('[ ]') === 0 || tokens[index].content.indexOf('[x]') === 0 || tokens[index].content.indexOf('[X]') === 0);
	}
	/* eslint-enable */

	module.exports = MarkdownitTaskRenderer;

/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';

	// Copyright (c) 2016, Revin Guillen.
	// Distributed under an MIT license: https://github.com/revin/markdown-it-task-lists/
	/* eslint-disable */
	/**
	 * @fileoverview Implements markdownitCodeBlockPlugin
	 * @modifier Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
	 * @modifier Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
	 */

	/**
	 * Code block renderer for Markdown-it
	 * @param {object} markdownit Markdown-it instance
	 */
	var MarkdownitCodeBlockRenderer = function MarkdownitCodeBlockRenderer(markdownit) {
	    markdownit.core.ruler.after('block', 'tui-code-block', function (state) {
	        var tokens = state.tokens;
	        var currentToken, tokenIndex;

	        for (tokenIndex = 0; tokenIndex < tokens.length; tokenIndex += 1) {
	            currentToken = tokens[tokenIndex];

	            if (isCodeFenceToken(currentToken) && currentToken.info) {
	                setTokenAttribute(currentToken, 'data-language', escape(currentToken.info.replace(' ', ''), true));
	            }
	        }
	    });
	};

	/**
	 * Set attribute of passed token
	 * @param {object} token Token object
	 * @param {string} attributeName Attribute name for set
	 * @param {string} attributeValue Attribute value for set
	 */
	function setTokenAttribute(token, attributeName, attributeValue) {
	    var index = token.attrIndex(attributeName);
	    var attr = [attributeName, attributeValue];

	    if (index < 0) {
	        token.attrPush(attr);
	    } else {
	        token.attrs[index] = attr;
	    }
	}
	/**
	 * Return boolean value whether passed token is code fence or not
	 * @param {object} token Token object
	 * @returns {boolean}
	 */
	function isCodeFenceToken(token) {
	    return token.block === true && token.tag === 'code' && token.type === 'fence';
	}

	/**
	 * escape code from markdown-it
	 * @param {string} html HTML string
	 * @param {string} encode Boolean value of whether encode or not
	 * @returns {string}
	 */
	function escape(html, encode) {
	    return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
	}
	/* eslint-enable */

	module.exports = MarkdownitCodeBlockRenderer;

/***/ },
/* 33 */
/***/ function(module, exports) {

	'use strict';

	// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
	// Distributed under an ISC license: https://github.com/markdown-it/markdown-it/
	/**
	 * @fileoverview Implements MarkdownItCodeRenderer
	 * @modifier Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
	 * @modifier Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
	 */

	/* eslint-disable */
	module.exports = function code(state, startLine, endLine /*, silent*/) {
	    // Added by Junghwan Park
	    var FIND_LIST_RX = / {0,3}(?:-|\*|\d\.) /;
	    var lines = state.src.split('\n');
	    var currentLine = lines[startLine];
	    // Added by Junghwan Park

	    var nextLine,
	        last,
	        token,
	        emptyLines = 0;

	    // Add condition by Junghwan Park
	    if (currentLine.match(FIND_LIST_RX) || state.sCount[startLine] - state.blkIndent < 4) {
	        // Add condition by Junghwan Park
	        return false;
	    }

	    last = nextLine = startLine + 1;

	    while (nextLine < endLine) {
	        if (state.isEmpty(nextLine)) {
	            emptyLines++;

	            // workaround for lists: 2 blank lines should terminate indented
	            // code block, but not fenced code block
	            if (emptyLines >= 2 && state.parentType === 'list') {
	                break;
	            }

	            nextLine++;
	            continue;
	        }

	        emptyLines = 0;

	        if (state.sCount[nextLine] - state.blkIndent >= 4) {
	            nextLine++;
	            last = nextLine;
	            continue;
	        }
	        break;
	    }

	    state.line = last;

	    token = state.push('code_block', 'code', 0);
	    token.content = state.getLines(startLine, last, 4 + state.blkIndent, true);
	    token.map = [startLine, state.line];

	    return true;
	};
	/* eslint-enable */

/***/ },
/* 34 */
/***/ function(module, exports) {

	'use strict';

	// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
	// Distributed under an ISC license: https://github.com/markdown-it/markdown-it/
	/**
	 * @fileoverview Implements MarkdownItBlockQuoteRenderer
	 * @modifier Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
	 * @modifier Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
	 */

	/* eslint-disable */
	module.exports = function blockquote(state, startLine, endLine, silent) {
	    // Added by Junghwan Park
	    var FIND_LIST_RX = /(?:-|\*|\d+\.) {1,4}(?:> {0,3})[^>]*$/;
	    var sourceLines = state.src.split('\n');
	    var currentLine = sourceLines[startLine];
	    // Added by Junghwan Park

	    var nextLine,
	        lastLineEmpty,
	        oldTShift,
	        oldSCount,
	        oldBMarks,
	        oldIndent,
	        oldParentType,
	        lines,
	        initial,
	        offset,
	        ch,
	        terminatorRules,
	        token,
	        i,
	        l,
	        terminate,
	        pos = state.bMarks[startLine] + state.tShift[startLine],
	        max = state.eMarks[startLine];

	    // check the block quote marker
	    // Add condition by Junghwan Park
	    if (currentLine.match(FIND_LIST_RX) /*&& !currentLine.match(/^ {0,6}>/)*/ || state.src.charCodeAt(pos++) !== 0x3E /* > */) {
	        return false;
	    }

	    // we know that it's going to be a valid blockquote,
	    // so no point trying to find the end of it in silent mode
	    if (silent) {
	        return true;
	    }

	    // skip one optional space (but not tab, check cmark impl) after '>'
	    if (state.src.charCodeAt(pos) === 0x20) {
	        pos++;
	    }

	    oldIndent = state.blkIndent;
	    state.blkIndent = 0;

	    // skip spaces after ">" and re-calculate offset
	    initial = offset = state.sCount[startLine] + pos - (state.bMarks[startLine] + state.tShift[startLine]);

	    oldBMarks = [state.bMarks[startLine]];
	    state.bMarks[startLine] = pos;

	    while (pos < max) {
	        ch = state.src.charCodeAt(pos);

	        if (isSpace(ch)) {
	            if (ch === 0x09) {
	                offset += 4 - offset % 4;
	            } else {
	                offset++;
	            }
	        } else {
	            break;
	        }

	        pos++;
	    }

	    lastLineEmpty = pos >= max;

	    oldSCount = [state.sCount[startLine]];
	    state.sCount[startLine] = offset - initial;

	    oldTShift = [state.tShift[startLine]];
	    state.tShift[startLine] = pos - state.bMarks[startLine];

	    terminatorRules = state.md.block.ruler.getRules('blockquote');

	    // Search the end of the block
	    //
	    // Block ends with either:
	    //  1. an empty line outside:
	    //     ```
	    //     > test
	    //
	    //     ```
	    //  2. an empty line inside:
	    //     ```
	    //     >
	    //     test
	    //     ```
	    //  3. another tag
	    //     ```
	    //     > test
	    //      - - -
	    //     ```
	    for (nextLine = startLine + 1; nextLine < endLine; nextLine++) {
	        if (state.sCount[nextLine] < oldIndent) {
	            break;
	        }

	        pos = state.bMarks[nextLine] + state.tShift[nextLine];
	        max = state.eMarks[nextLine];

	        if (pos >= max) {
	            // Case 1: line is not inside the blockquote, and this line is empty.
	            break;
	        }

	        if (state.src.charCodeAt(pos++) === 0x3E /* > */) {
	                // This line is inside the blockquote.

	                // skip one optional space (but not tab, check cmark impl) after '>'
	                if (state.src.charCodeAt(pos) === 0x20) {
	                    pos++;
	                }

	                // skip spaces after ">" and re-calculate offset
	                initial = offset = state.sCount[nextLine] + pos - (state.bMarks[nextLine] + state.tShift[nextLine]);

	                oldBMarks.push(state.bMarks[nextLine]);
	                state.bMarks[nextLine] = pos;

	                while (pos < max) {
	                    ch = state.src.charCodeAt(pos);

	                    if (isSpace(ch)) {
	                        if (ch === 0x09) {
	                            offset += 4 - offset % 4;
	                        } else {
	                            offset++;
	                        }
	                    } else {
	                        break;
	                    }

	                    pos++;
	                }

	                lastLineEmpty = pos >= max;

	                oldSCount.push(state.sCount[nextLine]);
	                state.sCount[nextLine] = offset - initial;

	                oldTShift.push(state.tShift[nextLine]);
	                state.tShift[nextLine] = pos - state.bMarks[nextLine];
	                continue;
	            }

	        // Case 2: line is not inside the blockquote, and the last line was empty.
	        if (lastLineEmpty) {
	            break;
	        }

	        // Case 3: another tag found.
	        terminate = false;
	        for (i = 0, l = terminatorRules.length; i < l; i++) {
	            if (terminatorRules[i](state, nextLine, endLine, true)) {
	                terminate = true;
	                break;
	            }
	        }
	        if (terminate) {
	            break;
	        }

	        oldBMarks.push(state.bMarks[nextLine]);
	        oldTShift.push(state.tShift[nextLine]);
	        oldSCount.push(state.sCount[nextLine]);

	        // A negative indentation means that this is a paragraph continuation
	        //
	        state.sCount[nextLine] = -1;
	    }

	    oldParentType = state.parentType;
	    state.parentType = 'blockquote';

	    token = state.push('blockquote_open', 'blockquote', 1);
	    token.markup = '>';
	    token.map = lines = [startLine, 0];

	    state.md.block.tokenize(state, startLine, nextLine);

	    token = state.push('blockquote_close', 'blockquote', -1);
	    token.markup = '>';

	    state.parentType = oldParentType;
	    lines[1] = state.line;

	    // Restore original tShift; this might not be necessary since the parser
	    // has already been here, but just to make sure we can do that.
	    for (i = 0; i < oldTShift.length; i++) {
	        state.bMarks[i + startLine] = oldBMarks[i];
	        state.tShift[i + startLine] = oldTShift[i];
	        state.sCount[i + startLine] = oldSCount[i];
	    }
	    state.blkIndent = oldIndent;

	    return true;
	};

	function isSpace(code) {
	    switch (code) {
	        case 0x09:
	        case 0x20:
	            return true;
	    }
	    return false;
	}
	/* eslint-enable */

/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict';

	// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
	// Distributed under an ISC license: https://github.com/markdown-it/markdown-it/

	/**
	 * @fileoverview Implements markdownitTableRenderer
	 * @modifier Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
	 * @modifier Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
	 */

	/*eslint-disable */
	function getLine(state, line) {
	    var pos = state.bMarks[line] + state.blkIndent,
	        max = state.eMarks[line];

	    return state.src.substr(pos, max - pos);
	}

	function escapedSplit(str) {
	    var result = [],
	        pos = 0,
	        max = str.length,
	        ch,
	        escapes = 0,
	        lastPos = 0,
	        backTicked = false,
	        lastBackTick = 0;

	    ch = str.charCodeAt(pos);

	    while (pos < max) {
	        if (ch === 0x60 /* ` */ && escapes % 2 === 0) {
	            backTicked = !backTicked;
	            lastBackTick = pos;
	        } else if (ch === 0x7c /* | */ && escapes % 2 === 0 && !backTicked) {
	            result.push(str.substring(lastPos, pos));
	            lastPos = pos + 1;
	        } else if (ch === 0x5c /* \ */) {
	                escapes += 1;
	            } else {
	            escapes = 0;
	        }

	        pos += 1;

	        // If there was an un-closed backtick, go back to just after
	        // the last backtick, but as if it was a normal character
	        if (pos === max && backTicked) {
	            backTicked = false;
	            pos = lastBackTick + 1;
	        }

	        ch = str.charCodeAt(pos);
	    }

	    result.push(str.substring(lastPos));

	    return result;
	}

	module.exports = function table(state, startLine, endLine, silent) {
	    var ch, lineText, pos, i, nextLine, columns, columnCount, token, aligns, t, tableLines, tbodyLines;

	    // should have at least three lines
	    if (startLine + 2 > endLine) {
	        return false;
	    }

	    nextLine = startLine + 1;

	    if (state.sCount[nextLine] < state.blkIndent) {
	        return false;
	    }

	    // first character of the second line should be '|' or '-'

	    pos = state.bMarks[nextLine] + state.tShift[nextLine];
	    if (pos >= state.eMarks[nextLine]) {
	        return false;
	    }

	    ch = state.src.charCodeAt(pos);
	    if (ch !== 0x7C /* | */ && ch !== 0x2D /* - */ && ch !== 0x3A /* : */) {
	            return false;
	        }

	    lineText = getLine(state, startLine + 1);
	    if (!/^[-:| ]+$/.test(lineText)) {
	        return false;
	    }

	    columns = lineText.split('|');
	    aligns = [];
	    for (i = 0; i < columns.length; i += 1) {
	        t = columns[i].trim();
	        if (!t) {
	            // allow empty columns before and after table, but not in between columns;
	            // e.g. allow ` |---| `, disallow ` ---||--- `
	            if (i === 0 || i === columns.length - 1) {
	                continue;
	            } else {
	                return false;
	            }
	        }

	        if (!/^:?-+:?$/.test(t)) {
	            return false;
	        }
	        if (t.charCodeAt(t.length - 1) === 0x3A /* : */) {
	                aligns.push(t.charCodeAt(0) === 0x3A /* : */ ? 'center' : 'right');
	            } else if (t.charCodeAt(0) === 0x3A /* : */) {
	                aligns.push('left');
	            } else {
	            aligns.push('');
	        }
	    }

	    lineText = getLine(state, startLine).trim();
	    if (lineText.indexOf('|') === -1) {
	        return false;
	    }
	    columns = escapedSplit(lineText.replace(/^\||\|$/g, ''));

	    // header row will define an amount of columns in the entire table,
	    // and align row shouldn't be smaller than that (the rest of the rows can)
	    columnCount = columns.length;
	    if (columnCount > aligns.length) {
	        return false;
	    }

	    if (silent) {
	        return true;
	    }

	    token = state.push('table_open', 'table', 1);
	    token.map = tableLines = [startLine, 0];

	    token = state.push('thead_open', 'thead', 1);
	    token.map = [startLine, startLine + 1];

	    token = state.push('tr_open', 'tr', 1);
	    token.map = [startLine, startLine + 1];

	    for (i = 0; i < columns.length; i += 1) {
	        token = state.push('th_open', 'th', 1);
	        token.map = [startLine, startLine + 1];
	        if (aligns[i]) {
	            // FIXED: change property style to align
	            token.attrs = [['align', aligns[i]]];
	        }

	        token = state.push('inline', '', 0);
	        token.content = columns[i].trim();
	        token.map = [startLine, startLine + 1];
	        token.children = [];

	        token = state.push('th_close', 'th', -1);
	    }

	    token = state.push('tr_close', 'tr', -1);
	    token = state.push('thead_close', 'thead', -1);

	    token = state.push('tbody_open', 'tbody', 1);
	    token.map = tbodyLines = [startLine + 2, 0];

	    for (nextLine = startLine + 2; nextLine < endLine; nextLine += 1) {
	        if (state.sCount[nextLine] < state.blkIndent) {
	            break;
	        }

	        lineText = getLine(state, nextLine);
	        if (lineText.indexOf('|') === -1) {
	            break;
	        }

	        // keep spaces at beginning of line to indicate an empty first cell, but
	        // strip trailing whitespace
	        columns = escapedSplit(lineText.replace(/^\||\|\s*$/g, ''));

	        token = state.push('tr_open', 'tr', 1);
	        for (i = 0; i < columnCount; i += 1) {
	            token = state.push('td_open', 'td', 1);
	            if (aligns[i]) {
	                // FIXED: change property style to align
	                token.attrs = [['align', aligns[i]]];
	            }

	            token = state.push('inline', '', 0);
	            token.content = columns[i] ? columns[i].trim() : '';
	            token.children = [];

	            token = state.push('td_close', 'td', -1);
	        }
	        token = state.push('tr_close', 'tr', -1);
	    }
	    token = state.push('tbody_close', 'tbody', -1);
	    token = state.push('table_close', 'table', -1);

	    tableLines[1] = tbodyLines[1] = nextLine;
	    state.line = nextLine;
	    return true;
	};
	/*eslint-enable */

/***/ },
/* 36 */
/***/ function(module, exports) {

	// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
	// Distributed under an ISC license: https://github.com/markdown-it/markdown-it/

	/**
	 * @fileoverview Implements markdownitHtmlBlockRenderer
	 * @modifier Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
	 * @modifier Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
	 */
	/* eslint-disable */
	// HTML block

	'use strict';

	// An array of opening and corresponding closing sequences for html tags,
	// last argument defines whether it can terminate a paragraph or not
	//

	// void tag names --- Added by Junghwan Park

	var voidTagNames = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
	var HTML_SEQUENCES = [[/^<(script|pre|style)(?=(\s|>|$))/i, /<\/(script|pre|style)>/i, true], [/^<!--/, /-->/, true], [/^<\?/, /\?>/, true], [/^<![A-Z]/, />/, true], [/^<!\[CDATA\[/, /\]\]>/, true], [new RegExp('^<(' + voidTagNames.join('|') + ')', 'i'), /^\/?>$/, true], [new RegExp('^</?(address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|pre|section|source|title|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?=(\\s|/?>|$))', 'i'), /^$/, true], [/^(?:<[A-Za-z][A-Za-z0-9\-]*(?:\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\s*=\s*(?:[^"'=<>`\x00-\x20]+|'[^']*'|"[^"]*"))?)*\s*\/?>|<\/[A-Za-z][A-Za-z0-9\-]*\s*>)\s*$/, /^$/, false]];

	module.exports = function html_block(state, startLine, endLine, silent) {
	    var i,
	        nextLine,
	        token,
	        lineText,
	        pos = state.bMarks[startLine] + state.tShift[startLine],
	        max = state.eMarks[startLine];

	    if (!state.md.options.html) {
	        return false;
	    }

	    if (state.src.charCodeAt(pos) !== 0x3C /* < */) {
	            return false;
	        }

	    lineText = state.src.slice(pos, max);

	    for (i = 0; i < HTML_SEQUENCES.length; i++) {
	        if (HTML_SEQUENCES[i][0].test(lineText)) {
	            // add condition for return when meet void element --- Added by Junghwan Park
	            if (i === 5) {
	                return false;
	            } else {
	                break;
	            }
	        }
	    }

	    if (i === HTML_SEQUENCES.length) {
	        return false;
	    }

	    if (silent) {
	        // true if this sequence can be a terminator, false otherwise
	        return HTML_SEQUENCES[i][2];
	    }

	    nextLine = startLine + 1;

	    // If we are here - we detected HTML block.
	    // Let's roll down till block end.
	    if (!HTML_SEQUENCES[i][1].test(lineText)) {
	        for (; nextLine < endLine; nextLine++) {
	            if (state.sCount[nextLine] < state.blkIndent) {
	                break;
	            }

	            pos = state.bMarks[nextLine] + state.tShift[nextLine];
	            max = state.eMarks[nextLine];
	            lineText = state.src.slice(pos, max);

	            if (HTML_SEQUENCES[i][1].test(lineText)) {
	                if (lineText.length !== 0) {
	                    nextLine++;
	                }
	                break;
	            }
	        }
	    }

	    state.line = nextLine;

	    token = state.push('html_block', '', 0);
	    token.map = [startLine, nextLine];
	    token.content = state.getLines(startLine, nextLine, state.blkIndent, true);

	    return true;
	};
	/* eslint-enable */

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @fileoverview
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

	var _preview = __webpack_require__(5);

	var _preview2 = _interopRequireDefault(_preview);

	var _eventManager = __webpack_require__(23);

	var _eventManager2 = _interopRequireDefault(_eventManager);

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	var _extManager = __webpack_require__(26);

	var _extManager2 = _interopRequireDefault(_extManager);

	var _convertor = __webpack_require__(30);

	var _convertor2 = _interopRequireDefault(_convertor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var util = tui.util;

	var TASK_ATTR_NAME = 'data-te-task';
	var TASK_CHECKED_CLASS_NAME = 'checked';

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

	var ToastUIEditorViewOnly = function () {
	    function ToastUIEditorViewOnly(options) {
	        var _this = this;

	        _classCallCheck(this, ToastUIEditorViewOnly);

	        this.options = options;

	        this.eventManager = new _eventManager2.default();

	        this.commandManager = new _commandManager2.default(this);
	        this.convertor = new _convertor2.default(this.eventManager);

	        if (this.options.hooks) {
	            util.forEach(this.options.hooks, function (fn, key) {
	                _this.addHook(key, fn);
	            });
	        }

	        if (this.options.events) {
	            util.forEach(this.options.events, function (fn, key) {
	                _this.on(key, fn);
	            });
	        }

	        this.preview = new _preview2.default($(this.options.el), this.eventManager, this.convertor);

	        this.preview.$el.on('mousedown', function (ev) {
	            var isBeneathTaskBox = ev.offsetX < 18 && ev.offsetY > 18;
	            if (ev.target.hasAttribute(TASK_ATTR_NAME) && !isBeneathTaskBox) {
	                $(ev.target).toggleClass(TASK_CHECKED_CLASS_NAME);
	                _this.eventManager.emit('change', {
	                    source: 'viewOnly',
	                    data: ev
	                });
	            }
	        });

	        _extManager2.default.applyExtension(this, this.options.exts);

	        this.setValue(this.options.initialValue);

	        this.eventManager.emit('load', this);
	    }

	    /**
	     * Set content for preview
	     * @api
	     * @memberOf ToastUIEditorViewOnly
	     * @param {string} markdown Markdown text
	     */


	    _createClass(ToastUIEditorViewOnly, [{
	        key: 'setValue',
	        value: function setValue(markdown) {
	            this.markdownValue = markdown = markdown || '';

	            this.preview.refresh(this.markdownValue);
	            this.eventManager.emit('setValueAfter', this.markdownValue);
	        }

	        /**
	         * Bind eventHandler to event type
	         * @api
	         * @memberOf ToastUIEditorViewOnly
	         * @param {string} type Event type
	         * @param {function} handler Event handler
	         */

	    }, {
	        key: 'on',
	        value: function on(type, handler) {
	            this.eventManager.listen(type, handler);
	        }

	        /**
	         * Unbind eventHandler from event type
	         * @api
	         * @memberOf ToastUIEditorViewOnly
	         * @param {string} type Event type
	         */

	    }, {
	        key: 'off',
	        value: function off(type) {
	            this.eventManager.removeEventHandler(type);
	        }

	        /**
	         * Remove ViewOnly preview from document
	         * @api
	         * @memberOf ToastUIEditorViewOnly
	         */

	    }, {
	        key: 'remove',
	        value: function remove() {
	            this.eventManager.emit('removeEditor');
	            this.options = null;
	            this.eventManager = null;
	            this.commandManager = null;
	            this.convertor = null;
	            this.preview = null;
	        }

	        /**
	         * Add hook to ViewOnly preview's event
	         * @api
	         * @memberOf ToastUIEditorViewOnly
	         * @param {string} type Event type
	         * @param {function} handler Event handler
	         */

	    }, {
	        key: 'addHook',
	        value: function addHook(type, handler) {
	            this.eventManager.removeEventHandler(type);
	            this.eventManager.listen(type, handler);
	        }

	        /**
	         * Return true
	         * @api
	         * @memberOf ToastUIEditorViewOnly
	         * @returns {boolean}
	         */

	    }, {
	        key: 'isViewOnly',
	        value: function isViewOnly() {
	            return true;
	        }

	        /**
	         * Return false
	         * @api
	         * @memberOf ToastUIEditorViewOnly
	         * @returns {boolean}
	         */

	    }, {
	        key: 'isMarkdownMode',
	        value: function isMarkdownMode() {
	            return false;
	        }

	        /**
	         * Return false
	         * @api
	         * @memberOf ToastUIEditorViewOnly
	         * @returns {boolean}
	         */

	    }, {
	        key: 'isWysiwygMode',
	        value: function isWysiwygMode() {
	            return false;
	        }
	    }]);

	    return ToastUIEditorViewOnly;
	}();

	module.exports = ToastUIEditorViewOnly;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _toolbar = __webpack_require__(39);

	var _toolbar2 = _interopRequireDefault(_toolbar);

	var _tab = __webpack_require__(43);

	var _tab2 = _interopRequireDefault(_tab);

	var _layerpopup = __webpack_require__(45);

	var _layerpopup2 = _interopRequireDefault(_layerpopup);

	var _modeSwitch = __webpack_require__(46);

	var _modeSwitch2 = _interopRequireDefault(_modeSwitch);

	var _popupAddLink = __webpack_require__(47);

	var _popupAddLink2 = _interopRequireDefault(_popupAddLink);

	var _popupAddImage = __webpack_require__(48);

	var _popupAddImage2 = _interopRequireDefault(_popupAddImage);

	var _popupTableUtils = __webpack_require__(49);

	var _popupTableUtils2 = _interopRequireDefault(_popupTableUtils);

	var _popupAddTable = __webpack_require__(50);

	var _popupAddTable2 = _interopRequireDefault(_popupAddTable);

	var _popupAddHeading = __webpack_require__(51);

	var _popupAddHeading2 = _interopRequireDefault(_popupAddHeading);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* eslint-disable indent */
	var containerTmpl = ['<div class="tui-editor-defaultUI">', '<div class="te-toolbar-section"></div>', '<div class="te-markdown-tab-section"></div>', '<div class="te-editor-section"></div>', '<div class="te-mode-switch-section"></div>', '</div>'].join('');
	/* eslint-enable indent */

	/**
	 * DefaultUI
	 * @exports DefaultUI
	 * @extends {}
	 * @constructor
	 * @class
	 * @param {ToastUIEditor} editor editor
	 */
	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	function DefaultUI(editor) {
	    this.name = 'default';

	    this.type = editor.options.initialEditType;
	    this.editor = editor;

	    this.init(editor.options.el);
	    this._initEvent();
	}

	DefaultUI.prototype.init = function ($container) {
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

	DefaultUI.prototype._initEditorSection = function () {
	    this.$el.find('.te-editor-section').append(this.editor.layout.getEditorEl());
	};

	DefaultUI.prototype._initEvent = function () {
	    var self = this;

	    this.editor.eventManager.listen('hide', this.hide.bind(this));
	    this.editor.eventManager.listen('show', this.show.bind(this));
	    this.editor.eventManager.listen('changeMode', function () {
	        self.markdownTabControl();
	    });

	    this.editor.eventManager.listen('changePreviewStyle', function () {
	        self.markdownTabControl();
	    });
	};

	DefaultUI.prototype._renderLayout = function ($container) {
	    this.$el = $(containerTmpl).appendTo($container);
	};

	DefaultUI.prototype._initToolbar = function () {
	    this.toolbar = new _toolbar2.default(this.editor.eventManager);
	    this.$el.find('.te-toolbar-section').append(this.toolbar.$el);
	};

	DefaultUI.prototype._initModeSwitch = function () {
	    var self = this;

	    this.modeSwitch = new _modeSwitch2.default(this.type === 'markdown' ? _modeSwitch2.default.TYPE.MARKDOWN : _modeSwitch2.default.TYPE.WYSIWYG);
	    this.$el.find('.te-mode-switch-section').append(this.modeSwitch.$el);

	    this.modeSwitch.on('modeSwitched', function (ev, type) {
	        self.editor.changeMode(type);
	    });
	};

	DefaultUI.prototype.markdownTabControl = function () {
	    if (this.editor.isMarkdownMode() && this.editor.getCurrentPreviewStyle() === 'tab') {
	        this.$el.find('.te-markdown-tab-section').show();
	        this.markdownTab.activate('Editor');
	    } else {
	        this.$el.find('.te-markdown-tab-section').hide();
	    }
	};

	DefaultUI.prototype._initMarkdownTab = function () {
	    var editor = this.editor;

	    this.markdownTab = new _tab2.default({
	        items: ['Editor', 'Preview'],
	        sections: [editor.layout.getMdEditorContainerEl(), editor.layout.getPreviewEl()]
	    });

	    this.$el.find('.te-markdown-tab-section').append(this.markdownTab.$el);

	    this.markdownTab.on('itemClick', function (ev, itemText) {
	        if (itemText === 'Preview') {
	            editor.eventManager.emit('previewNeedsRefresh');
	        } else {
	            editor.getCodeMirror().focus();
	        }
	    });
	};

	DefaultUI.prototype._initPopupAddLink = function () {
	    this.popupAddLink = new _popupAddLink2.default({
	        $target: this.$el,
	        eventManager: this.editor.eventManager
	    });
	};

	DefaultUI.prototype._initPopupAddImage = function () {
	    this.popupAddImage = new _popupAddImage2.default({
	        $target: this.$el,
	        eventManager: this.editor.eventManager
	    });
	};

	DefaultUI.prototype._initPopupAddTable = function () {
	    this.popupAddTable = new _popupAddTable2.default({
	        $target: this.$el,
	        eventManager: this.editor.eventManager,
	        $button: this.$el.find('button.tui-table'),
	        css: {
	            'position': 'absolute'
	        }
	    });
	};

	DefaultUI.prototype._initPopupAddHeading = function () {
	    this.popupAddHeading = new _popupAddHeading2.default({
	        $target: this.$el,
	        eventManager: this.editor.eventManager,
	        $button: this.$el.find('button.tui-heading'),
	        css: {
	            'position': 'absolute'
	        }
	    });
	};

	DefaultUI.prototype._initPopupTableUtils = function () {
	    var self = this;

	    this.editor.eventManager.listen('contextmenu', function (ev) {
	        if ($(ev.data.target).parents('table').length > 0) {
	            ev.data.preventDefault();
	            self.editor.eventManager.emit('openPopupTableUtils', ev.data);
	        }
	    });

	    this.popupTableUtils = new _popupTableUtils2.default({
	        $target: this.$el,
	        eventManager: this.editor.eventManager
	    });
	};

	DefaultUI.prototype.hide = function () {
	    this.$el.addClass('te-hide');
	};

	DefaultUI.prototype.show = function () {
	    this.$el.removeClass('te-hide');
	};

	DefaultUI.prototype.remove = function () {
	    this.$el.remove();
	};

	DefaultUI.prototype.createPopup = function (options) {
	    return _layerpopup2.default.factory(options);
	};

	module.exports = DefaultUI;

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _uicontroller = __webpack_require__(40);

	var _uicontroller2 = _interopRequireDefault(_uicontroller);

	var _button = __webpack_require__(41);

	var _button2 = _interopRequireDefault(_button);

	var _i18n = __webpack_require__(29);

	var _i18n2 = _interopRequireDefault(_i18n);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var util = tui.util;

	/**
	 * Toolbar
	 * @exports Toolbar
	 * @augments UIController
	 * @constructor
	 * @class
	 * @param {EventManager} eventManager 이벤트 매니저
	 */
	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	function Toolbar(eventManager) {
	    _uicontroller2.default.call(this, {
	        tagName: 'div',
	        className: 'tui-editor-defaultUI-toolbar'
	    });

	    this.buttons = [];

	    this.eventManager = eventManager;

	    this.render();
	    this._initButton();
	}

	Toolbar.prototype = util.extend({}, _uicontroller2.default.prototype);

	/**
	 * render
	 * Render toolbar
	 */
	Toolbar.prototype.render = function () {
	    this.$buttonContainer = this.$el;
	};

	/**
	 * 버튼을 추가한다
	 * @param {Button} buttons 버튼
	 * @param {Number} index 버튼위치 (optional)
	 */
	Toolbar.prototype.addButton = function (buttons, index) {
	    var _this = this;

	    var TOOLBAR_GROUP_CLASS_NAME = 'tui-toolbar-button-group';
	    var $buttonWrap = $('<div class="' + TOOLBAR_GROUP_CLASS_NAME + '"></div>');

	    if (util.isArray(buttons)) {
	        util.forEach(buttons, function (button) {
	            $buttonWrap.append(_this._setButton(button).$el);
	        });
	    } else {
	        $buttonWrap.append(this._setButton(buttons).$el);
	    }

	    if (index) {
	        this.$buttonContainer.find('.' + TOOLBAR_GROUP_CLASS_NAME).eq(index - 1).after($buttonWrap);
	    } else {
	        this.$buttonContainer.append($buttonWrap);
	    }
	};

	/**
	 * 버튼에 이벤트 바인딩
	 * @param {Button} button 버튼
	 * @returns {Button}
	 */
	Toolbar.prototype._setButton = function (button) {
	    var ev = this.eventManager;
	    if (!button.render) {
	        button = new _button2.default(button);
	    }

	    button.on('command', function emitCommandEvent($, commandName) {
	        ev.emit('command', commandName);
	    });

	    button.on('event', function emitEventByCommand($, eventName) {
	        ev.emit(eventName);
	    });

	    this.buttons.push(button);

	    return button;
	};

	/**
	 * 필요한 버튼들을 추가한다.
	 */
	Toolbar.prototype._initButton = function () {
	    var _this2 = this;

	    this.addButton(new _button2.default({
	        className: 'tui-heading',
	        event: 'openHeadingSelect',
	        tooltip: _i18n2.default.get('Headings')
	    }));

	    this.addButton([new _button2.default({
	        className: 'tui-bold',
	        command: 'Bold',
	        tooltip: _i18n2.default.get('Bold'),
	        state: 'bold'
	    }), new _button2.default({
	        className: 'tui-italic',
	        command: 'Italic',
	        tooltip: _i18n2.default.get('Italic'),
	        state: 'italic'
	    }), new _button2.default({
	        className: 'tui-strike',
	        command: 'Strike',
	        text: '~',
	        tooltip: _i18n2.default.get('Strike')
	    })]);

	    this.addButton([new _button2.default({
	        className: 'tui-ul',
	        command: 'UL',
	        tooltip: _i18n2.default.get('Unordered list')
	    }), new _button2.default({
	        className: 'tui-ol',
	        command: 'OL',
	        tooltip: _i18n2.default.get('Ordered list')
	    }), new _button2.default({
	        className: 'tui-task',
	        command: 'Task',
	        tooltip: _i18n2.default.get('Task')
	    })]);

	    this.addButton([new _button2.default({
	        className: 'tui-hrline',
	        command: 'HR',
	        tooltip: _i18n2.default.get('Line')
	    }), new _button2.default({
	        className: 'tui-table',
	        event: 'openPopupAddTable',
	        tooltip: _i18n2.default.get('Insert table')
	    })]);

	    this.addButton([new _button2.default({
	        className: 'tui-image',
	        event: 'openPopupAddImage',
	        tooltip: _i18n2.default.get('Insert image')
	    }), new _button2.default({
	        className: 'tui-link',
	        event: 'openPopupAddLink',
	        tooltip: _i18n2.default.get('Insert link')
	    })]);

	    this.addButton(new _button2.default({
	        className: 'tui-quote',
	        command: 'Blockquote',
	        tooltip: _i18n2.default.get('Blockquote'),
	        state: 'quote'
	    }));

	    this.addButton([new _button2.default({
	        className: 'tui-codeblock',
	        command: 'CodeBlock',
	        text: 'CB',
	        tooltip: _i18n2.default.get('Insert codeblock'),
	        state: 'codeBlock'
	    }), new _button2.default({
	        className: 'tui-code',
	        command: 'Code',
	        tooltip: _i18n2.default.get('Code'),
	        state: 'code'
	    })]);

	    this.eventManager.listen('stateChange', function (ev) {
	        util.forEach(_this2.buttons, function (button) {
	            if (button.state) {
	                if (ev[button.state]) {
	                    button.$el.addClass('active');
	                } else {
	                    button.$el.removeClass('active');
	                }
	            }
	        });
	    });
	};

	module.exports = Toolbar;

/***/ },
/* 40 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * @fileoverview HTML UI를 관리하는 컨트롤러
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var util = tui.util;
	var _id = 0;
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
	UIController.prototype.on = function (aType, aFn) {
	    var self = this;

	    if (util.isObject(aType)) {
	        util.forEach(aType, function (fn, type) {
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
	UIController.prototype._addEvent = function (type, fn) {
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
	UIController.prototype.off = function (type, fn) {
	    if (type) {
	        var parsedType = this._parseEventType(type);
	        var event = parsedType[0];
	        var selector = parsedType[1];

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
	UIController.prototype._parseEventType = function (type) {
	    var splitType = type.split(' '),
	        event = splitType.shift(),
	        selector = splitType.join(' ');

	    return [event, selector];
	};

	/**
	 * 파라메터로 넘어오는 이벤트 리스트 혹은 this.events를 토대로 dom 이벤트를 한꺼번에 바인드한다.
	 * @param {object} events 이벤트 목록
	 */
	UIController.prototype.attachEvents = function (events) {
	    var self = this;
	    var eventlist = events || this.events;
	    var handler = void 0;

	    if (eventlist) {
	        util.forEach(eventlist, function (handlerName, type) {
	            if (self[handlerName]) {
	                type = self.getEventNameWithNamespace(type);
	                handler = util.bind(self[handlerName], self);
	                self.on(type, handler);
	            } else {
	                throw new Error('UIController#attachEvents: ' + handlerName + '\uB780 \uBA54\uC11C\uB4DC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.');
	            }
	        });
	    }
	};

	/**
	 * attachEvents로 걸린 이벤트핸들러를 한꺼번에 해제한다.
	 */
	UIController.prototype.detachEvents = function () {
	    this.$el.off('.uicEvent' + this.id);
	};

	/**
	 * UIC의 rootElement인 this.$el을 설정한다 인자가 없으면 생성한다.
	 * @param {jQuery} $el 설정할 엘리먼트
	 */
	UIController.prototype.setRootElement = function ($el) {
	    var className = this.className;
	    var tagName = this.tagName;

	    if (!$el) {
	        className = className || 'uic' + this.id;
	        $el = $('<' + tagName + ' class="' + className + '"/>');
	    }
	    this.$el = $el;
	};

	/**
	 * 커스텀 이벤트를 발생시킨다.
	 */
	UIController.prototype.trigger = function () {
	    var _$el;

	    (_$el = this.$el).trigger.apply(_$el, arguments);
	};

	/**
	 * id를 생성한다.
	 * @private
	 */
	UIController.prototype._initID = function () {
	    this.id = _id;
	    _id += 1;
	};

	/**
	 * 이벤트종류에 네임스페이스를 더한다.
	 * "click" -> "click.uicEvent23"
	 * @param {string} event 이벤트 핸들러, 셀릭터 스트링
	 * @returns {string} 네임스페이스가 포함된 이벤트스트링
	 */
	UIController.prototype.getEventNameWithNamespace = function (event) {
	    var eventSplited = event.split(' ');
	    eventSplited[0] += '.uicEvent' + this.id;

	    return eventSplited.join(' ');
	};

	/**
	 * uic안에 서브uic를 삽입한다.
	 * 두번째 인자로 셀렉터를 넘기면 this.$el이 아닌 셀렉터에 해당하는 엘리먼트를 찾아서 그엘리먼트에 서브 UIC의 엘리먼트를 붙인다.
	 * @param {UIController} uic UIController instance
	 * @param {string} [targetSEL] 셀렉터
	 */
	UIController.prototype.addUIC = function (uic, targetSEL) {
	    if (targetSEL) {
	        this.$el.find(targetSEL).append(uic.$el);
	    } else {
	        this.$el.append(uic.$el);
	    }
	};

	/**
	 * 엘리먼트의 이벤트를 해제 후 제거한다.
	 */
	UIController.prototype.remove = function () {
	    this.detachEvents();
	    this.$el.remove();
	};

	/**
	 * 소멸자
	 */
	UIController.prototype.destroy = function () {
	    var self = this;

	    this.remove();
	    this.detachEvents();

	    util.forEachOwnProperties(this, function (value, key) {
	        self[key] = null;
	    });
	};

	/**
	 * UIController를 확장해 새 생성자를 만든다.
	 * @param {Object} props properties to extend
	 * @returns {UIController} 생성자
	 */
	UIController.extend = function (props) {
	    var newUIC = util.defineClass(this, props);

	    newUIC.extend = UIController.extend;

	    return newUIC;
	};

	module.exports = UIController;

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var UIController = __webpack_require__(40);
	var Tooltip = __webpack_require__(42);

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

	Button.prototype = util.extend({}, UIController.prototype);

	Button.prototype._setOptions = function (options) {
	    this.command = options.command;
	    this.event = options.event;
	    this.text = options.text;
	    this.tooltip = options.tooltip;
	    this.style = options.style;
	    this.state = options.state;
	};

	/**
	 * Button의 모습을 그린다
	 */
	Button.prototype.render = function () {
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
	Button.prototype._onClick = function () {
	    if (this.command) {
	        this.trigger('command', this.command);
	    } else {
	        this.trigger('event', this.event);
	    }

	    this.trigger('clicked');
	};

	Button.prototype._onOver = function () {
	    tooltip.show(this.$el, this.tooltip);
	};

	Button.prototype._onOut = function () {
	    tooltip.hide();
	};

	module.exports = Button;

/***/ },
/* 42 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * @fileoverview
	 * @author Minho Choi(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

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
	Tooltip.prototype.show = function (target, text) {
	    this.$el.css({
	        'top': target.offset().top + target.height() + 13,
	        'left': target.offset().left + 3
	    }).find('.text').html(text).end().show();
	};

	Tooltip.prototype.hide = function () {
	    this.$el.hide();
	};

	module.exports = Tooltip;

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _uicontroller = __webpack_require__(40);

	var _uicontroller2 = _interopRequireDefault(_uicontroller);

	var _templater = __webpack_require__(44);

	var _templater2 = _interopRequireDefault(_templater);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @fileoverview tab버튼 UI를 그리는 객체가 정의되어 있다
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var util = tui.util;
	/*eslint-disable*/
	var buttonTmpl = '<button type="button" data-index="${index}">${name}</button>';
	/*eslint-enable*/

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
	 * const tab = new Tab({
	 *     items: ['Editor', 'Preview'],
	 *     sections: [this.$mdEditorContainerEl, this.$previewEl]
	 * });
	 */
	function Tab(options) {
	    _uicontroller2.default.call(this, {
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

	Tab.prototype = util.extend({}, _uicontroller2.default.prototype);

	/**
	 * render
	 * render UI
	 */
	Tab.prototype.render = function () {
	    var buttonHtml = (0, _templater2.default)(buttonTmpl, this._getButtonData());

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
	Tab.prototype._applyInitName = function (initName) {
	    if (initName) {
	        this.activate(initName);
	    }
	};

	/**
	 * _getButtonData
	 * Make button data by this.items
	 * @returns {object[]} Button data
	 */
	Tab.prototype._getButtonData = function () {
	    var buttonData = [];

	    for (var i = 0, len = this.items.length; i < len; i += 1) {
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
	Tab.prototype._onButtonClick = function (ev) {
	    var $button = $(ev.target);
	    this._activateTabByButton($button);
	    this.trigger('itemClick', $button.text());
	};

	/**
	 * _deactivate
	 * Deactive active section and button
	 */
	Tab.prototype._deactivate = function () {
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
	Tab.prototype._activateButton = function ($button) {
	    this._$activeButton = $button;
	    this._$activeButton.addClass('te-tab-active');
	};

	/**
	 * _activateSection
	 * Activate Section
	 * @param {number} index Section index to activate
	 */
	Tab.prototype._activateSection = function (index) {
	    if (this.sections) {
	        this.sections[index].addClass('te-tab-active');
	    }
	};

	/**
	 * activate
	 * Activate Section & Button
	 * @param {string} name button name to activate
	 */
	Tab.prototype.activate = function (name) {
	    var $button = this.$el.find('button:contains("' + name + '")');
	    this._activateTabByButton($button);
	};

	/**
	 * _activateTabByButton
	 * Activate tab section by button
	 * @param {jQuery} $button button to activate
	 */
	Tab.prototype._activateTabByButton = function ($button) {
	    if (this._isActivatedButton($button)) {
	        return;
	    }

	    this._deactivate();

	    this._activateButton($button);
	    this._activateSection($button.attr('data-index'));
	};

	/**
	 * _isActivatedButton
	 * Check passed button is activated
	 * @param {jQuery} $button Button to check
	 * @returns {boolean} result
	 */
	Tab.prototype._isActivatedButton = function ($button) {
	    return this._$activeButton && this._$activeButton.text() === $button.text();
	};

	/**
	 * _initItemClickEvent
	 * Initialize itemClick event handler
	 * @param {function} handler Function to invoke when button is clicked
	 */
	Tab.prototype._initItemClickEvent = function (handler) {
	    if (handler) {
	        this.on('itemClick', handler);
	    }
	};

	module.exports = Tab;

/***/ },
/* 44 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * @fileoverview Implements templater function
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var util = tui.util;

	/**
	 * 템플릿데이터에 객체의 데이터를 삽입해 스트링을 리턴한다.
	 * 매핑데이터를 배열로 전달하면 갯수만큼 템플릿을 반복생성한다.
	 * @param {string} template 템플릿 텍스트
	 * @param {object|object[]} mapper 템플릿과 합성될 데이터
	 * @returns {array} rendered text
	 */
	function templater(template, mapper) {
	    var totalReplaced = [];
	    var replaced = void 0;

	    if (!util.isArray(mapper)) {
	        mapper = [mapper];
	    }

	    util.forEach(mapper, function (mapdata) {
	        replaced = template.replace(/\${([\w]+)}/g, function (matchedString, name) {
	            return util.isExisty(mapdata, name) ? mapdata[name].toString() : '';
	        });

	        totalReplaced.push(replaced);
	    });

	    return totalReplaced;
	}

	module.exports = templater;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _uicontroller = __webpack_require__(40);

	var _uicontroller2 = _interopRequireDefault(_uicontroller);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var util = tui.util; /**
	                      * @fileoverview Implements LayerPopup
	                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	                      */

	var CLASS_PREFIX = 'tui-popup-';
	var _id = 0;

	/* eslint-disable indent */
	var LAYOUT_TEMPLATE = ['<div class="' + CLASS_PREFIX + 'header">', '<span class="' + CLASS_PREFIX + 'title"></span>', '<button class="' + CLASS_PREFIX + 'close-button">x</button>', '</div>', '<div class="' + CLASS_PREFIX + 'body"></div>'].join('');
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

	    _uicontroller2.default.call(this, {
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

	LayerPopup.prototype = util.extend({}, _uicontroller2.default.prototype);

	LayerPopup.prototype._initTarget = function (options) {
	    this.$target = options.$target || $('body');
	};

	LayerPopup.prototype._initExternalPopupHtmlIfNeed = function (options) {
	    if (options.$el) {
	        this.$el = options.$el;
	        this._isExternalHtmlUse = true;
	    }
	};

	LayerPopup.prototype._initCloserOpener = function (options) {
	    this.openerCssQuery = options.openerCssQuery;
	    this.closerCssQuery = options.closerCssQuery;
	};

	LayerPopup.prototype._initContent = function (options) {
	    if (options.content) {
	        this.$content = $(options.content);
	    } else if (options.textContent) {
	        this.$content = options.textContent;
	    }
	};

	LayerPopup.prototype._initTitle = function (options) {
	    this.title = options.title;
	};

	LayerPopup.prototype._initClassName = function (options) {
	    if (options.className) {
	        this.className = options.className;
	    }
	};

	LayerPopup.prototype.render = function () {
	    this._renderLayout();
	    this._renderTitle();
	    this._renderContent();

	    this._attachPopupEvent();
	};

	LayerPopup.prototype._renderLayout = function () {
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

	LayerPopup.prototype._renderContent = function () {
	    if (!this._isExternalHtmlUse) {
	        this.setContent(this.$content);
	    }
	};

	LayerPopup.prototype._renderTitle = function () {
	    if (!this._isExternalHtmlUse && this.title !== false) {
	        this.setTitle(this.title);
	    }
	};

	LayerPopup.prototype._getFullClassName = function (lastName) {
	    return '.' + CLASS_PREFIX + lastName;
	};

	LayerPopup.prototype._attachOpenerCloserEvent = function () {
	    var self = this;

	    if (this.openerCssQuery) {
	        $(this.openerCssQuery).on('click.' + this._getId(), function () {
	            self.show();
	        });
	    }

	    if (this.closerCssQuery) {
	        $(this.closerCssQuery).on('click.' + this._getId(), function () {
	            self.hide();
	        });
	    }
	};

	LayerPopup.prototype._detachOpenerCloserEvent = function () {
	    if (this.openerCssQuery) {
	        $(this.openerCssQuery).off('.' + this._getId());
	    }

	    if (this.closerCssQuery) {
	        $(this.closerCssQuery).off('.' + this._getId());
	    }
	};

	LayerPopup.prototype._attachPopupControlEvent = function () {
	    var self = this;

	    this.on('click ' + this._getFullClassName('close-button'), function () {
	        self.hide();
	    });
	};

	LayerPopup.prototype._detachPopupEvent = function () {
	    this.off();
	    this._detachOpenerCloserEvent();
	};

	LayerPopup.prototype._attachPopupEvent = function () {
	    this._attachPopupControlEvent();
	    this._attachOpenerCloserEvent();
	};

	LayerPopup.prototype._setId = function () {
	    this._id = _id;
	    _id += 1;
	};

	LayerPopup.prototype._getId = function () {
	    return this._id;
	};

	LayerPopup.prototype.setContent = function ($content) {
	    this.$body.empty();
	    this.$body.append($content);
	};

	LayerPopup.prototype.setTitle = function (title) {
	    var $title = this.$el.find(this._getFullClassName('title'));

	    $title.empty();
	    $title.append(title);
	};

	LayerPopup.prototype.hide = function () {
	    this.$el.css('display', 'none');
	    this._isShow = false;
	    this.trigger('hidden', this);
	};

	LayerPopup.prototype.show = function () {
	    this.$el.css('display', 'block');
	    this._isShow = true;
	    this.trigger('shown', this);
	};

	LayerPopup.prototype.isShow = function () {
	    return this._isShow;
	};

	LayerPopup.prototype.remove = function () {
	    this.trigger('remove', this);
	    this._detachPopupEvent();

	    this.$el.empty();
	    this.$el.remove();
	};

	LayerPopup.prototype.css = function () {
	    var _$el;

	    (_$el = this.$el).css.apply(_$el, arguments);
	};

	LayerPopup.prototype._initCssStyles = function (options) {
	    if (options.css) {
	        this.css(options.css);
	    }
	};

	LayerPopup.factory = function (options) {
	    var popup = new LayerPopup(options);
	    popup.render();

	    return popup;
	};

	LayerPopup.CLASS_PREFIX = CLASS_PREFIX;

	module.exports = LayerPopup;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _uicontroller = __webpack_require__(40);

	var _uicontroller2 = _interopRequireDefault(_uicontroller);

	var _i18n = __webpack_require__(29);

	var _i18n2 = _interopRequireDefault(_i18n);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

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
	    _uicontroller2.default.call(this, {
	        tagName: 'div',
	        className: 'te-mode-switch'
	    });

	    this._render();
	    this._switchType(util.isExisty(initialType) ? initialType : TYPE.MARKDOWN);
	}

	ModeSwitch.prototype = util.extend({}, _uicontroller2.default.prototype);

	ModeSwitch.prototype._render = function () {
	    this.$buttons = {};
	    this.$buttons.markdown = $('<button class="te-switch-button markdown" type="button">' + _i18n2.default.get('Markdown') + '</button>');
	    this.$buttons.wysiwyg = $('<button class="te-switch-button wysiwyg" type="button">' + _i18n2.default.get('WYSIWYG') + '</button>');
	    this.$el.append(this.$buttons.markdown);
	    this.$el.append(this.$buttons.wysiwyg);

	    this.attachEvents({
	        'click .markdown': '_changeMarkdown',
	        'click .wysiwyg': '_changeWysiwyg'
	    });
	};

	ModeSwitch.prototype._changeMarkdown = function () {
	    this._switchType(TYPE.MARKDOWN);
	};

	ModeSwitch.prototype._changeWysiwyg = function () {
	    this._switchType(TYPE.WYSIWYG);
	};

	ModeSwitch.prototype._setActiveButton = function (type) {
	    util.forEach(this.$buttons, function ($button) {
	        $button.removeClass('active');
	    });
	    this.$buttons[type].addClass('active');
	};

	ModeSwitch.prototype._switchType = function (type) {
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
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _layerpopup = __webpack_require__(45);

	var _layerpopup2 = _interopRequireDefault(_layerpopup);

	var _i18n = __webpack_require__(29);

	var _i18n2 = _interopRequireDefault(_i18n);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @fileoverview Implements PopupAddLink
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var util = tui.util;

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
	    /* eslint-disable indent */
	    var POPUP_CONTENT = ['<label for="linkText">' + _i18n2.default.get('Link text') + '</label>', '<input type="text" class="te-link-text-input" />', '<label for="url">' + _i18n2.default.get('URL') + '</label>', '<input type="text" class="te-url-input" />', '<div class="te-button-section">', '<button type="button" class="te-ok-button">' + _i18n2.default.get('OK') + '</button>', '<button type="button" class="te-close-button">' + _i18n2.default.get('Cancel') + '</button>', '</div>'].join('');
	    /* eslint-enable indent */

	    options = util.extend({
	        title: _i18n2.default.get('Insert link'),
	        className: 'te-popup-add-link tui-editor-popup',
	        content: POPUP_CONTENT
	    }, options);

	    _layerpopup2.default.call(this, options);

	    this.render();
	    this._bindContentEvent();
	    this._linkWithEventManager(options.eventManager);
	}

	PopupAddLink.prototype = util.extend({}, _layerpopup2.default.prototype);

	PopupAddLink.prototype._bindContentEvent = function () {
	    var self = this;

	    this.on('click .te-ok-button', function () {
	        self.trigger('okButtonClicked', self);
	        self.hide();
	    });

	    this.on('click .te-close-button', function () {
	        self.trigger('closeButtonClicked', self);
	        self.hide();
	    });

	    this.on('shown', function () {
	        self.$el.find('.te-link-text-input').focus();
	    });

	    this.on('hidden', function () {
	        self.resetInputs();
	    });
	};

	PopupAddLink.prototype._linkWithEventManager = function (eventManager) {
	    var self = this;

	    eventManager.listen('focus', function () {
	        self.hide();
	    });

	    eventManager.listen('openPopupAddLink', function () {
	        eventManager.emit('closeAllPopup');
	        self.show();
	    });

	    eventManager.listen('closeAllPopup', function () {
	        self.hide();
	    });

	    this.on('okButtonClicked', function () {
	        eventManager.emit('command', 'AddLink', self.getValue());
	    });
	};

	PopupAddLink.prototype.getValue = function () {
	    return {
	        linkText: this.$el.find('.te-link-text-input').val(),
	        url: this.$el.find('.te-url-input').val().replace(/\(/g, '%28').replace(/\)/g, '%29')
	    };
	};

	PopupAddLink.prototype.resetInputs = function () {
	    this.$el.find('input').val('');
	};

	module.exports = PopupAddLink;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _layerpopup = __webpack_require__(45);

	var _layerpopup2 = _interopRequireDefault(_layerpopup);

	var _tab = __webpack_require__(43);

	var _tab2 = _interopRequireDefault(_tab);

	var _i18n = __webpack_require__(29);

	var _i18n2 = _interopRequireDefault(_i18n);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var util = tui.util;

	/**
	 * PopupAddImage
	 * It implements a Image Add Popup
	 * @exports PopupAddImage
	 * @augments LayerPopup
	 * @constructor
	 * @class
	 * @param {object} options options
	 */
	/**
	 * @fileoverview Implements PopupAddImage
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	function PopupAddImage(options) {
	    /* eslint-disable indent */
	    var POPUP_CONTENT = ['<div class="te-tab-section"></div>', '<div class="te-url-type">', '<label for="">' + _i18n2.default.get('Image URL') + '</label>', '<input type="text" class="te-image-url-input" />', '</div>', '<form enctype="multipart/form-data" class="te-file-type">', '<label for="">' + _i18n2.default.get('Select image file') + '</label>', '<input type="file" class="te-image-file-input" accept="image/*" />', '</form>', '<label for="url">' + _i18n2.default.get('Description') + '</label>', '<input type="text" class="te-alt-text-input" />', '<div class="te-button-section">', '<button type="button" class="te-ok-button">' + _i18n2.default.get('OK') + '</button>', '<button type="button" class="te-close-button">' + _i18n2.default.get('Cancel') + '</button>', '</div>'].join('');
	    /* eslint-enable indent */

	    options = util.extend({
	        title: _i18n2.default.get('Insert image'),
	        className: 'te-popup-add-image tui-editor-popup',
	        content: POPUP_CONTENT
	    }, options);

	    _layerpopup2.default.call(this, options);

	    this.eventManager = options.eventManager;

	    this.render();

	    this._bindContentEvent();
	    this._linkWithEventManager();
	    this._initApplyImageBindContext();
	}

	PopupAddImage.prototype = util.extend({}, _layerpopup2.default.prototype);

	PopupAddImage.prototype._bindContentEvent = function () {
	    var self = this;

	    this.on('click .te-ok-button', function () {
	        self.trigger('okButtonClicked', self);
	        self.hide();
	    });

	    this.on('click .te-close-button', function () {
	        self.trigger('closeButtonClicked', self);
	        self.hide();
	    });

	    this.on('shown', function () {
	        self.$el.find('.te-image-url-input').focus();
	    });

	    this.on('hidden', function () {
	        self.resetInputs();
	    });

	    this.tab.on('itemClick', function () {
	        self.resetInputs();
	    });

	    this.on('change .te-image-file-input', function () {
	        var filename = self.$el.find('.te-image-file-input').val().split('\\').pop();
	        self.$el.find('.te-alt-text-input').val(filename);
	    });
	};

	PopupAddImage.prototype._linkWithEventManager = function () {
	    var self = this;

	    this.eventManager.listen('focus', function () {
	        self.hide();
	    });

	    this.eventManager.listen('openPopupAddImage', function () {
	        self.eventManager.emit('closeAllPopup');
	        self.show();
	    });

	    this.eventManager.listen('closeAllPopup', function () {
	        self.hide();
	    });

	    this.on('okButtonClicked', function () {
	        if (self._isUrlType()) {
	            self.applyImage();
	        } else {
	            self._preAltValue = self.$el.find('.te-alt-text-input').val();
	            self.eventManager.emit('addImageBlobHook', self.$el.find('.te-image-file-input')[0].files[0], self.applyImage);
	        }
	    });
	};

	PopupAddImage.prototype._initApplyImageBindContext = function () {
	    var self = this;

	    this.applyImage = function (url) {
	        var info = void 0;

	        if (url) {
	            info = self._getImageInfoWithGivenUrl(url);
	        } else {
	            info = self._getImageInfo();
	        }

	        self.eventManager.emit('command', 'AddImage', info);
	        self.hide();
	    };
	};

	PopupAddImage.prototype._isUrlType = function () {
	    return !!this.$el.find('.te-image-url-input').val();
	};

	/**
	 * _renderContent
	 * @override
	 */
	PopupAddImage.prototype._renderContent = function () {
	    var $popup = this.$el;

	    _layerpopup2.default.prototype._renderContent.call(this);

	    this.tab = new _tab2.default({
	        initName: _i18n2.default.get('File'),
	        items: [_i18n2.default.get('File'), _i18n2.default.get('URL')],
	        sections: [$popup.find('.te-file-type'), $popup.find('.te-url-type')]
	    });

	    this.$body.find('.te-tab-section').append(this.tab.$el);
	};

	PopupAddImage.prototype._getImageInfoWithGivenUrl = function (imageUrl) {
	    var altText = this._preAltValue;
	    this._preAltValue = '';

	    return this._makeImageInfo(imageUrl, altText);
	};

	PopupAddImage.prototype._getImageInfo = function () {
	    var imageUrl = this.$el.find('.te-image-url-input').val(),
	        altText = this.$el.find('.te-alt-text-input').val();

	    return this._makeImageInfo(imageUrl, altText);
	};

	PopupAddImage.prototype._makeImageInfo = function (url, alt) {
	    return {
	        imageUrl: url,
	        altText: alt
	    };
	};

	PopupAddImage.prototype._getImageFileForm = function () {
	    return this.$el.find('form');
	};

	PopupAddImage.prototype.resetInputs = function () {
	    this.$el.find('input').val('');
	};

	module.exports = PopupAddImage;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _layerpopup = __webpack_require__(45);

	var _layerpopup2 = _interopRequireDefault(_layerpopup);

	var _i18n = __webpack_require__(29);

	var _i18n2 = _interopRequireDefault(_i18n);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @fileoverview Implements PopupTableUtils
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var util = tui.util;

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
	    var POPUP_CONTENT = ['<button type="button" class="te-table-add-row">' + _i18n2.default.get('Add row') + '</button>', '<button type="button" class="te-table-add-col">' + _i18n2.default.get('Add col') + '</button>', '<button type="button" class="te-table-remove-row">' + _i18n2.default.get('Remove row') + '</button>', '<button type="button" class="te-table-remove-col">' + _i18n2.default.get('Remove col') + '</button>', '<button type="button" class="te-table-col-align-left">' + _i18n2.default.get('Align left') + '</button>', '<button type="button" class="te-table-col-align-center">' + _i18n2.default.get('Align center') + '</button>', '<button type="button" class="te-table-col-align-right">' + _i18n2.default.get('Align right') + '</button>', '<button type="button" class="te-table-remove">' + _i18n2.default.get('Remove table') + '</button>'].join('');

	    options = util.extend({
	        title: false,
	        className: 'te-popup-table-utils',
	        content: POPUP_CONTENT
	    }, options);

	    _layerpopup2.default.call(this, options);

	    this.eventManager = options.eventManager;

	    this.render();
	    this._bindContentEvent();
	    this._linkWithEventManager();
	}

	PopupTableUtils.prototype = util.extend({}, _layerpopup2.default.prototype);

	/**
	 * _bindContentEvent
	 * Bind element events
	 */
	PopupTableUtils.prototype._bindContentEvent = function () {
	    var self = this;

	    this.on('click .te-table-add-row', function () {
	        self.eventManager.emit('command', 'AddRow');
	    });

	    this.on('click .te-table-add-col', function () {
	        self.eventManager.emit('command', 'AddCol');
	    });

	    this.on('click .te-table-remove-row', function () {
	        self.eventManager.emit('command', 'RemoveRow');
	    });

	    this.on('click .te-table-col-align-left', function () {
	        self.eventManager.emit('command', 'AlignCol', 'left');
	    });

	    this.on('click .te-table-col-align-center', function () {
	        self.eventManager.emit('command', 'AlignCol', 'center');
	    });

	    this.on('click .te-table-col-align-right', function () {
	        self.eventManager.emit('command', 'AlignCol', 'right');
	    });

	    this.on('click .te-table-remove-col', function () {
	        self.eventManager.emit('command', 'RemoveCol');
	    });

	    this.on('click .te-table-remove', function () {
	        self.eventManager.emit('command', 'RemoveTable');
	    });
	};

	/**
	 * _linkWithEventManager
	 * Bind event manager event
	 */
	PopupTableUtils.prototype._linkWithEventManager = function () {
	    var self = this;

	    this.eventManager.listen('focus', function () {
	        self.hide();
	    });

	    this.eventManager.listen('mousedown', function () {
	        self.hide();
	    });

	    this.eventManager.listen('openPopupTableUtils', function (event) {
	        var offset = self.$el.parent().offset();
	        var x = event.clientX - offset.left;
	        var y = event.clientY - offset.top + $(window).scrollTop();

	        self.eventManager.emit('closeAllPopup');

	        self.$el.css({
	            'position': 'absolute',
	            'top': y + 5,
	            'left': x + 10
	        });

	        self.show();
	    });

	    this.eventManager.listen('closeAllPopup', function () {
	        self.hide();
	    });
	};

	module.exports = PopupTableUtils;

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _layerpopup = __webpack_require__(45);

	var _layerpopup2 = _interopRequireDefault(_layerpopup);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var util = tui.util;

	/* eslint-disable indent */
	/**
	 * @fileoverview Implements PopupAddTable
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var POPUP_CONTENT = ['<div class="te-table-selection">', '<div class="te-table-header"></div>', '<div class="te-table-body"></div>', '<div class="te-selection-area"></div>', '</div>', '<p class="te-description"></p>'].join('');
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

	    _layerpopup2.default.call(this, options);

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

	PopupAddTable.prototype = util.extend({}, _layerpopup2.default.prototype);

	/**
	 * _cacheElements
	 * Cache elements for use
	 */
	PopupAddTable.prototype._cacheElements = function () {
	    this.$header = this.$el.find('.te-table-header');
	    this.$body = this.$el.find('.te-table-body');
	    this.$selection = this.$el.find('.te-selection-area');
	    this.$desc = this.$el.find('.te-description');
	};

	/**
	 * _bindContentEvent
	 * Bind element events
	 */
	PopupAddTable.prototype._bindContentEvent = function () {
	    var self = this;

	    this.on('mousemove .te-table-selection', function (ev) {
	        var x = ev.pageX - self._selectionOffset.left;
	        var y = ev.pageY - self._selectionOffset.top;
	        var bound = self._getSelectionBoundByOffset(x, y);

	        self._resizeTableBySelectionIfNeed(bound.col, bound.row);

	        self._setSelectionAreaByBound(bound.col, bound.row);
	        self._setDisplayText(bound.col, bound.row);
	        self._setSelectedBound(bound.col, bound.row);
	    });

	    this.on('click .te-table-selection', function () {
	        var tableSize = self._getSelectedTableSize();
	        self.eventManager.emit('command', 'Table', tableSize.col, tableSize.row);
	    });
	};

	/**
	 * _linkWithEventManager
	 * Bind event manager event
	 */
	PopupAddTable.prototype._linkWithEventManager = function () {
	    var self = this;

	    this.eventManager.listen('focus', function () {
	        self.hide();
	    });

	    this.eventManager.listen('openPopupAddTable', function () {
	        self.eventManager.emit('closeAllPopup');
	        self.$el.css({
	            'top': self.$button.position().top + self.$button.height() + 5,
	            'left': self.$button.position().left
	        });
	        self.show();
	        self._selectionOffset = self.$el.find('.te-table-selection').offset();
	    });

	    this.eventManager.listen('closeAllPopup', function () {
	        self.hide();
	    });
	};

	/**
	 * _resizeTableBySelectionIfNeed
	 * Resize table if need
	 * @param {number} col column index
	 * @param {number} row row index
	 */
	PopupAddTable.prototype._resizeTableBySelectionIfNeed = function (col, row) {
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
	PopupAddTable.prototype._getResizedTableBound = function (col, row) {
	    var resizedCol = void 0,
	        resizedRow = void 0,
	        resizedBound = void 0;

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
	PopupAddTable.prototype._isNeedResizeTable = function (col, row) {
	    return col && col !== this._tableBound.col || row && row !== this._tableBound.row;
	};

	/**
	 * _getBoundByOffset
	 * Get bound by offset
	 * @param {number} x offset
	 * @param {number} y offset
	 * @returns {object} bound
	 */
	PopupAddTable.prototype._getBoundByOffset = function (x, y) {
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
	PopupAddTable.prototype._getOffsetByBound = function (col, row) {
	    var x = col * CELL_WIDTH + CELL_WIDTH,
	        y = row * CELL_HEIGHT + CELL_HEIGHT;

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
	PopupAddTable.prototype._setTableSizeByBound = function (col, row) {
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
	PopupAddTable.prototype._getSelectionBoundByOffset = function (x, y) {
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
	PopupAddTable.prototype._setSelectionAreaByBound = function (col, row) {
	    var boundOffset = this._getOffsetByBound(col, row);
	    this._setSelectionArea(boundOffset.x, boundOffset.y);
	};

	/**
	 * _setSelectedBound
	 * Set selected bound
	 * @param {number} col column index
	 * @param {number} row row index
	 */
	PopupAddTable.prototype._setSelectedBound = function (col, row) {
	    this._selectedBound.col = col;
	    this._selectedBound.row = row;
	};

	/**
	 * _getSelectedTableSize
	 * Get selected table size
	 * @returns {object} bound
	 */
	PopupAddTable.prototype._getSelectedTableSize = function () {
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
	PopupAddTable.prototype._setDisplayText = function (col, row) {
	    this.$desc.html(col + 1 + ' x ' + (row + 1));
	};

	/**
	 * _setTableSize
	 * Set table element size
	 * @param {number} x offset
	 * @param {number} y offset
	 */
	PopupAddTable.prototype._setTableSize = function (x, y) {
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
	PopupAddTable.prototype._setSelectionArea = function (x, y) {
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
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _layerpopup = __webpack_require__(45);

	var _layerpopup2 = _interopRequireDefault(_layerpopup);

	var _i18n = __webpack_require__(29);

	var _i18n2 = _interopRequireDefault(_i18n);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @fileoverview Implements PopupAddTable
	 * @author Minho choi(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var util = tui.util;

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
	    /* eslint-disable indent */
	    var POPUP_CONTENT = ['<ul>', '<li data-value="1" data-type="Heading"><h1>' + _i18n2.default.get('Heading') + ' 1</h1></li>', '<li data-value="2" data-type="Heading"><h2>' + _i18n2.default.get('Heading') + ' 2</h2></li>', '<li data-value="3" data-type="Heading"><h3>' + _i18n2.default.get('Heading') + ' 3</h3></li>', '<li data-value="4" data-type="Heading"><h4>' + _i18n2.default.get('Heading') + ' 4</h4></li>', '<li data-value="5" data-type="Heading"><h5>' + _i18n2.default.get('Heading') + ' 5</h5></li>', '<li data-value="6" data-type="Heading"><h6>' + _i18n2.default.get('Heading') + ' 6</h6></li>', '<li data-type="Paragraph"><div>' + _i18n2.default.get('Paragraph') + '</div></li>', '</ul>'].join('');
	    /* eslint-enable indent */

	    options = util.extend({
	        title: false,
	        className: 'te-heading-add',
	        content: POPUP_CONTENT
	    }, options);
	    _layerpopup2.default.call(this, options);
	    this.eventManager = options.eventManager;
	    this.$button = options.$button;
	    this.render();
	    this._linkWithEventManager();
	    this._bindEvent();
	}

	PopupAddHeading.prototype = util.extend({}, _layerpopup2.default.prototype);

	PopupAddHeading.prototype._linkWithEventManager = function () {
	    var self = this;

	    this.eventManager.listen('focus', function () {
	        self.hide();
	    });

	    this.eventManager.listen('openHeadingSelect', function () {
	        self.eventManager.emit('closeAllPopup');
	        self.$el.css({
	            'top': self.$button.position().top + self.$button.height() + 5,
	            'left': self.$button.position().left
	        });
	        self.show();
	    });

	    this.eventManager.listen('closeAllPopup', function () {
	        self.hide();
	    });
	};

	PopupAddHeading.prototype._bindEvent = function () {
	    var self = this;

	    /* eslint-disable prefer-arrow-callback*/
	    this.on('click li', /** @this Node */function () {
	        self.eventManager.emit('command', $(this).data('type'), $(this).data('value'));
	    });
	    /* eslint-enable prefer-arrow-callback*/
	};

	module.exports = PopupAddHeading;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var boldRegex = /^[\*_]{2,}[^\*_]*[\*_]{2,}$/;

	/**
	 * Bold
	 * Add bold markdown syntax to markdown editor
	 * @exports Bold
	 * @augments Command
	 */
	/**
	 * @fileoverview
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var Bold = _commandManager2.default.command('markdown', /** @lends Bold */{
	    name: 'Bold',
	    keyMap: ['CTRL+B', 'META+B'],
	    /**
	     * Command Handler
	     * @param {MarkdownEditor} mde MarkdownEditor instance
	     */
	    exec: function exec(mde) {
	        var cm = mde.getEditor();
	        var doc = cm.getDoc();

	        var cursor = doc.getCursor();
	        var selection = doc.getSelection();
	        var isEmpty = !selection;

	        // if selection is empty, expend selection to detect a syntax
	        if (isEmpty && cursor.ch > 1) {
	            var tmpSelection = this.expendSelection(doc, cursor);
	            selection = tmpSelection || selection;
	        }

	        var isRemoved = this.isNeedRemove(selection);
	        var result = isRemoved ? this.remove(selection) : this.append(selection);

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
	    isNeedRemove: function isNeedRemove(text) {
	        return boldRegex.test(text);
	    },

	    /**
	     * Bold를 적용한다
	     * @param {string} text 셀렉션텍스트
	     * @returns {string} 볼드가 적용된 텍스트
	     */
	    append: function append(text) {
	        return '**' + text + '**';
	    },

	    /**
	     * Bold를 제거한다
	     * @param {string} text 셀렉션텍스트
	     * @returns {string} 볼드가 제거된 텍스트
	     */
	    remove: function remove(text) {
	        return text.substr(2, text.length - 4);
	    },

	    /**
	     * 셀렉션영역을 확장한다
	     * @param {CodeMirror.doc} doc 코드미러 도큐먼트 객체
	     * @param {object} cursor 코드미러 커서 객체
	     * @returns {string} 셀렉션의 텍스트
	     */
	    expendSelection: function expendSelection(doc, cursor) {
	        var tmpSelection = doc.getSelection();
	        var result = void 0;
	        var start = {
	            line: cursor.line,
	            ch: cursor.ch - 2
	        };
	        var end = {
	            line: cursor.line,
	            ch: cursor.ch + 2
	        };

	        doc.setSelection(start, end);

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
	    setCursorToCenter: function setCursorToCenter(doc, cursor) {
	        doc.setCursor(cursor.line, cursor.ch + 2);
	    }
	});

	module.exports = Bold;

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var boldItalicRegex = /^[\*_]{3,}[^\*_]*[\*_]{3,}$/; /**
	                                                      * @fileoverview Implements Italic markdown command
	                                                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	                                                      */

	var italicRegex = /^[\*_][^\*_]*[\*_]$/;

	/**
	 * Italic
	 * Add italic markdown syntax to markdown editor
	 * @exports Italic
	 * @augments Command
	 */
	var Italic = _commandManager2.default.command('markdown', /** @lends Italic */{
	    name: 'Italic',
	    keyMap: ['CTRL+I', 'META+I'],
	    /**
	     * Command handler
	     * @param {MarkdownEditor} mde MarkdownEditor instance
	     */
	    exec: function exec(mde) {
	        var cm = mde.getEditor();
	        var doc = cm.getDoc();

	        var cursor = doc.getCursor();
	        var selection = doc.getSelection();
	        var isEmpty = !selection;
	        var isWithBold = false;
	        var tmpSelection = void 0;

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

	        var isRemoved = this.isNeedRemove(selection);
	        var result = isRemoved ? this.remove(selection) : this.append(selection);

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
	    isNeedRemove: function isNeedRemove(text) {
	        return italicRegex.test(text) || boldItalicRegex.test(text);
	    },

	    /**
	     * append
	     * 텍스트에 이탤릭을 적용한다
	     * @param {string} text 적용할 텍스트
	     * @returns {string} 이탤릭이 적용된 텍스트
	     */
	    append: function append(text) {
	        return '_' + text + '_';
	    },

	    /**
	     * remove
	     * 텍스트에서 이탤릭을 제거한다
	     * @param {string} text 제거할 텍스트
	     * @returns {string} 제거된 텍스트
	     */
	    remove: function remove(text) {
	        return text.substr(1, text.length - 2);
	    },

	    /**
	     * expendWithBoldSelection
	     * 볼드와 함께 적용된 셀렉션 영역을 확장한다
	     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
	     * @param {object} cursor 커서객체
	     * @returns {string} 확장된 영역의 텍스트
	     */
	    expendWithBoldSelection: function expendWithBoldSelection(doc, cursor) {
	        var tmpSelection = doc.getSelection();
	        var result = void 0;
	        var start = {
	            line: cursor.line,
	            ch: cursor.ch - 3
	        };
	        var end = {
	            line: cursor.line,
	            ch: cursor.ch + 3
	        };

	        doc.setSelection(start, end);

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
	    expendOnlyBoldSelection: function expendOnlyBoldSelection(doc, cursor) {
	        var tmpSelection = doc.getSelection();
	        var result = false;
	        var start = {
	            line: cursor.line,
	            ch: cursor.ch - 2
	        };
	        var end = {
	            line: cursor.line,
	            ch: cursor.ch + 2
	        };

	        doc.setSelection(start, end);

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
	    expendSelection: function expendSelection(doc, cursor) {
	        var tmpSelection = doc.getSelection();
	        var result = void 0;
	        var start = {
	            line: cursor.line,
	            ch: cursor.ch - 2
	        };
	        var end = {
	            line: cursor.line,
	            ch: cursor.ch + 2
	        };

	        doc.setSelection(start, end);

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
	    setCursorToCenter: function setCursorToCenter(doc, cursor, isRemoved) {
	        var pos = isRemoved ? -1 : 1;
	        doc.setCursor(cursor.line, cursor.ch + pos);
	    }
	});

	module.exports = Italic;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var strikeRegex = /^[~~](.*[\s\n]*.*)*[~~]$/;

	/**
	 * Strike
	 * Add strike markdown syntax to markdown editor
	 * @exports Strike
	 * @augments Command
	 */
	/**
	 * @fileoverview Implements StrikeThrough markdown command
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 */

	var Strike = _commandManager2.default.command('markdown', /** @lends Strike */{
	    name: 'Strike',
	    keyMap: ['CTRL+S', 'META+S'],
	    /**
	     * Command handler
	     * @param {MarkdownEditor} mde MarkdownEditor instance
	     */
	    exec: function exec(mde) {
	        var cm = mde.getEditor();
	        var doc = cm.getDoc();
	        var cursor = doc.getCursor();
	        var selection = doc.getSelection();
	        var isNeedToRemove = this.hasStrikeSyntax(selection);

	        var result = void 0;

	        if (isNeedToRemove) {
	            result = this.remove(selection);
	        } else {
	            result = this.append(selection);
	        }

	        doc.replaceSelection(result, 'around');

	        var isEmptySelection = !selection;

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
	    hasStrikeSyntax: function hasStrikeSyntax(text) {
	        return strikeRegex.test(text);
	    },

	    /**
	     * append
	     * @param {string} text 적용할 텍스트
	     * @returns {string} strikeThrough text
	     */
	    append: function append(text) {
	        return '~~' + text + '~~';
	    },

	    /**
	     * remove
	     * @param {string} text 제거할 텍스트
	     * @returns {string} 제거된 텍스트
	     */
	    remove: function remove(text) {
	        return text.substr(2, text.length - 4);
	    },

	    /**
	     * setCursorToCenter
	     * 커서를 중앙으로 이동시킨다
	     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
	     * @param {object} cursor 커서객체
	     * @param {boolean} isRemoved 변경사항이 지우는 변경이었는지 여부
	     */
	    setCursorToCenter: function setCursorToCenter(doc, cursor, isRemoved) {
	        var pos = isRemoved ? -2 : 2;
	        doc.setCursor(cursor.line, cursor.ch + pos);
	    }
	});

	module.exports = Strike;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Blockquote
	 * Add blockquote markdown syntax to markdown editor
	 * @exports Blockquote
	 * @augments Command
	 */
	var Blockquote = _commandManager2.default.command('markdown', /** @lends Blockquote */{
	    name: 'Blockquote',
	    keyMap: ['CTRL+Q', 'META+Q'],
	    /**
	     *  커맨드 핸들러
	     *  @param {MarkdownEditor} mde MarkdownEditor instance
	     */
	    exec: function exec(mde) {
	        var cm = mde.getEditor();
	        var doc = cm.getDoc();

	        // range 을 가공함
	        var range = mde.getCurrentRange();

	        var from = {
	            line: range.from.line,
	            ch: 0
	        };

	        var to = {
	            line: range.to.line,
	            ch: doc.getLineHandle(range.to.line).text.length
	        };

	        // 영역의 텍스트를 가저오고
	        var textToModify = doc.getRange(from, to);

	        // 텍스트 컨텐트를 변경 한다
	        var textLinesToModify = textToModify.split('\n');
	        var lineLength = textLinesToModify.length;

	        for (var i = 0; i < lineLength; i += 1) {
	            textLinesToModify[i] = '>' + textLinesToModify[i];
	        }

	        // 해당 에디터의 내용을 변경한다
	        doc.replaceRange(textLinesToModify.join('\n'), from, to);

	        range.to.ch += 1;

	        doc.setCursor(range.to);

	        cm.focus();
	    }
	}); /**
	     * @fileoverview Implements Blockquote markdown command
	     * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	     */

	module.exports = Blockquote;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var util = tui.util; /**
	                      * @fileoverview Implements Heading markdown command
	                      * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
	                      * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
	                      * @author Jiung Kang(jiung-kang@nhnent.com) FE Development Lab/NHN Ent.
	                      */

	var FIND_HEADING_RX = /^#+\s/g;

	/**
	 * Heading
	 * Add heading markdown syntax to markdown editor
	 * @exports Heading
	 * @augments Command
	 */
	var Heading = _commandManager2.default.command('markdown', /** @lends Heading */{
	    name: 'Heading',
	    /**
	     * Command Handler
	     * @param {MarkdownEditor} mde MarkdownEditor instance
	     * @param {number} size heading size
	     */
	    exec: function exec(mde, size) {
	        var cm = mde.getEditor();
	        var doc = cm.getDoc();

	        // 선택된 영역을 가공함
	        var range = mde.getCurrentRange();

	        var from = {
	            line: range.from.line,
	            ch: 0
	        };

	        var to = {
	            line: range.to.line,
	            ch: doc.getLineHandle(range.to.line).text.length
	        };

	        var lengthOfCurrentLineBefore = doc.getLine(to.line).length;

	        // 영역의 텍스트를 가저오고
	        var textToModify = doc.getRange(from, to);

	        // 원하는 대로 가공한다
	        var textLinesToModify = textToModify.split('\n');

	        util.forEachArray(textLinesToModify, function (line, index) {
	            textLinesToModify[index] = getHeadingMarkdown(line, size);
	        });

	        // 해당 에디터의 내용을 변경한다
	        doc.replaceRange(textLinesToModify.join('\n'), from, to);

	        range.to.ch += doc.getLine(to.line).length - lengthOfCurrentLineBefore;

	        doc.setSelection(from, range.to);

	        cm.focus();
	    }
	});

	/**
	 * Get heading markdown
	 * @param {string} text Source test
	 * @param {number} size size
	 * @returns {string}
	 */
	function getHeadingMarkdown(text, size) {
	    var foundedHeading = text.match(FIND_HEADING_RX);
	    var heading = '';

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
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var util = tui.util;

	/**
	 * Paragraph
	 * Convert selected lines to paragraph
	 * @exports Paragraph
	 * @augments Command
	 */
	/**
	 * @fileoverview Implements Paragraph markdown command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 * @author Jiung Kang(jiung-kang@nhnent.com) FE Development Team/NHN Ent.
	 */

	var Paragraph = _commandManager2.default.command('markdown', /** @lends Paragraph */{
	    name: 'Paragraph',
	    /**
	     * Command Handler
	     * @param {MarkdownEditor} mde MarkdownEditor instance
	     */
	    exec: function exec(mde) {
	        var cm = mde.getEditor();
	        var doc = cm.getDoc();
	        var range = mde.getCurrentRange();
	        var from = {
	            line: range.from.line,
	            ch: 0
	        };
	        var to = {
	            line: range.to.line,
	            ch: doc.getLineHandle(range.to.line).text.length
	        };

	        var lengthOfCurrentLineBefore = doc.getLine(to.line).length;
	        var textToModify = doc.getRange(from, to);
	        var textLines = textToModify.split('\n');

	        util.forEachArray(textLines, function (line, index) {
	            textLines[index] = getParagraphMarkdown(line);
	        });

	        doc.replaceRange(textLines.join('\n'), from, to);

	        range.to.ch += doc.getLine(to.line).length - lengthOfCurrentLineBefore;

	        doc.setSelection(from, to);

	        cm.focus();
	    }
	});
	/**
	 * Get paragraph markdown lineText
	 * @param {string} lineText line lineText
	 * @returns {string}
	 */
	function getParagraphMarkdown(lineText) {
	    var headingRx = /^(#{1,6}| *((?:\*|-|\d\.)(?: \[[ xX]])?)) /;

	    return lineText.replace(headingRx, '');
	}

	module.exports = Paragraph;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * HR
	 * Add HR markdown syntax to markdown editor
	 * @exports HR
	 * @augments Command
	 */
	var HR = _commandManager2.default.command('markdown', /** @lends HR */{
	    name: 'HR',
	    keyMap: ['CTRL+L', 'META+L'],
	    /**
	     * Command handler
	     * @param {MarkdownEditor} mde MarkdownEditor instance
	     */
	    exec: function exec(mde) {
	        var cm = mde.getEditor();
	        var doc = cm.getDoc();
	        var replaceText = '';

	        var range = mde.getCurrentRange();

	        var from = {
	            line: range.from.line,
	            ch: range.from.ch
	        };

	        var to = {
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
	}); /**
	     * @fileoverview HR markdown command
	     * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	     */

	module.exports = HR;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * AddLink
	 * Add link markdown syntax to markdown editor
	 * @exports AddLink
	 * @augments Command
	 */
	var AddLink = _commandManager2.default.command('markdown', /** @lends AddLink */{
	    name: 'AddLink',
	    /**
	     *  커맨드 핸들러
	     *  @param {MarkdownEditor} mde MarkdownEditor instance
	     *  @param {object} data data for image
	     */
	    exec: function exec(mde, data) {
	        var cm = mde.getEditor();
	        var doc = cm.getDoc();

	        var range = mde.getCurrentRange();

	        var from = {
	            line: range.from.line,
	            ch: range.from.ch
	        };

	        var to = {
	            line: range.to.line,
	            ch: range.to.ch
	        };

	        var replaceText = '[' + data.linkText + '](' + data.url + ')';

	        doc.replaceRange(replaceText, from, to);

	        cm.focus();
	    }
	}); /**
	     * @fileoverview Implements Addlink markdown command
	     * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	     */

	module.exports = AddLink;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * AddImage
	 * Add Image markdown syntax to markdown Editor
	 * @exports AddImage
	 * @augments Command
	 */
	var AddImage = _commandManager2.default.command('markdown', /** @lends AddImage */{
	    name: 'AddImage',
	    /**
	     * Command Handler
	     * @param {MarkdownEditor} mde MarkdownEditor instance
	     * @param {object} data data for image
	     */
	    exec: function exec(mde, data) {
	        var cm = mde.getEditor();
	        var doc = cm.getDoc();

	        var range = mde.getCurrentRange();

	        var from = {
	            line: range.from.line,
	            ch: range.from.ch
	        };

	        var to = {
	            line: range.to.line,
	            ch: range.to.ch
	        };

	        var replaceText = '![' + data.altText + '](' + data.imageUrl + ')';

	        doc.replaceRange(replaceText, from, to, '+addImage');

	        cm.focus();
	    }
	}); /**
	     * @fileoverview Implments AddImage markdown command
	     * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	     */

	module.exports = AddImage;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var FIND_MD_OL_RX = /^[ \t]*[\d]+\. .*/; /**
	                                          * @fileoverview
	                                          * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	                                          */

	var FIND_MD_UL_RX = /^[ \t]*\* .*/;

	/**
	 * UL
	 * Add unordered list markdown syntax to markdown editor
	 * @exports UL
	 * @augments Command
	 */
	var UL = _commandManager2.default.command('markdown', /** @lends UL */{
	    name: 'UL',
	    keyMap: ['CTRL+U', 'META+U'],
	    /**
	     * Command handler
	     * @param {MarkdownEditor} mde MarkdownEditor instance
	     */
	    exec: function exec(mde) {
	        var cm = mde.getEditor();
	        var doc = cm.getDoc();
	        var range = mde.getCurrentRange();

	        var from = {
	            line: range.from.line,
	            ch: 0
	        };

	        var line = doc.getLine(from.line);

	        var to = void 0;

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
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var FIND_MD_OL_RX = /^[ \t]*[\d]+\. .*/; /**
	                                          * @fileoverview Implements OL markdown command
	                                          * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	                                          */

	var FIND_MD_UL_RX = /^[ \t]*\* .*/;

	/**
	 * OL
	 * Add ordered list markdown syntax to markdown editor
	 * @exports OL
	 * @augments Command
	 */
	var OL = _commandManager2.default.command('markdown', /** @lends OL */{
	    name: 'OL',
	    keyMap: ['CTRL+O', 'META+O'],
	    /**
	     * Command handler
	     * @param {MarkdownEditor} mde MarkdownEditor instance
	     */
	    exec: function exec(mde) {
	        var cm = mde.getEditor();
	        var doc = cm.getDoc();

	        var range = mde.getCurrentRange();

	        var from = {
	            line: range.from.line,
	            ch: 0
	        };

	        var line = doc.getLine(from.line);

	        var to = void 0;

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
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Table
	 * Add table markdown syntax to markdown editor
	 * @exports Table
	 * @augments Command
	 */
	var Table = _commandManager2.default.command('markdown', /** @lends Table */{
	    name: 'Table',
	    /**
	     * Command handler
	     * @param {MarkdownEditor} mde MarkdownEditor instance
	     * @param {number} col column count
	     * @param {number} row row count
	     * @param {Array} data initial table data
	     */
	    exec: function exec(mde, col, row, data) {
	        var cm = mde.getEditor();
	        var doc = cm.getDoc();
	        var table = '\n';

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

	/**
	 * makeHeader
	 * make table header markdown string
	 * @param {number} col Column count
	 * @param {array} data Cell's text content
	 * @returns {string} markdown string
	 */
	/**
	 * @fileoverview Implements Table markdown command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	function makeHeader(col, data) {
	    var header = '|';
	    var border = '|';
	    var index = 0;

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
	    var body = '';
	    var index = col;

	    for (var irow = 0; irow < row; irow += 1) {
	        body += '|';

	        for (var icol = 0; icol < col; icol += 1) {
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
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Task
	 * @exports Task
	 * @augments Command
	 */

	var Task = _commandManager2.default.command('markdown', /** @lends Task */{
	    name: 'Task',
	    keyMap: ['CTRL+T', 'META+T'],
	    /**
	     * Command handler
	     * @param {MarkdownEditor} mde MarkdownEditor instance
	     */
	    exec: function exec(mde) {
	        var cm = mde.getEditor();
	        var doc = cm.getDoc();

	        var range = mde.getCurrentRange();

	        var from = {
	            line: range.from.line,
	            ch: range.from.ch
	        };

	        var to = {
	            line: range.to.line,
	            ch: range.to.ch
	        };

	        var replaceText = '* [ ] ';

	        doc.replaceRange(replaceText, from, to);

	        cm.focus();
	    }
	}); /**
	     * @fileoverview Implements Task markdown command
	     * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	     */

	module.exports = Task;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Code
	 * Add code markdown syntax to markdown editor
	 * @exports Code
	 * @augments Command
	 */
	var Code = _commandManager2.default.command('markdown', /** @lends Code */{
	  name: 'Code',
	  keyMap: ['SHIFT+CTRL+C', 'SHIFT+META+C'],
	  /**
	   * Command Handler
	   * @param {MarkdownEditor} mde MarkdownEditor instance
	   */
	  exec: function exec(mde) {
	    var cm = mde.getEditor();
	    var doc = cm.getDoc();

	    var selection = doc.getSelection();
	    var range = cm.getCursor();

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
	  append: function append(text) {
	    return '`' + text + '`';
	  }
	}); /**
	     * @fileoverview
	     * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	     */

	module.exports = Code;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * CodeBlock
	 * Add CodeBlock markdown syntax to markdown editor
	 * @exports CodeBlock
	 * @augments Command
	 */
	var CodeBlock = _commandManager2.default.command('markdown', /** @lends CodeBlock */{
	    name: 'CodeBlock',
	    keyMap: ['SHIFT+CTRL+P', 'SHIFT+META+P'],
	    /**
	     * Command handler
	     * @param {MarkdownEditor} mde MarkdownEditor instance
	     */
	    exec: function exec(mde) {
	        var cm = mde.getEditor();
	        var doc = cm.getDoc();
	        var replaceText = '';
	        var rowFix = void 0;

	        var range = cm.getCursor();

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
	}); /**
	     * @fileoverview CodeBlock markdown command
	     * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	     */

	module.exports = CodeBlock;

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	var _domUtils = __webpack_require__(8);

	var _domUtils2 = _interopRequireDefault(_domUtils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Bold
	 * Add bold to selected wysiwyg editor content
	 * @exports Bold
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 */

	var Bold = _commandManager2.default.command('wysiwyg', /** @lends Bold */{
	    name: 'Bold',
	    keyMap: ['CTRL+B', 'META+B'],
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function exec(wwe) {
	        var sq = wwe.getEditor();
	        var tableSelectionManager = wwe.getManager('tableSelection');

	        sq.focus();

	        if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
	            tableSelectionManager.createRangeBySelectedCells();
	        }

	        if (sq.hasFormat('b') || sq.hasFormat('strong')) {
	            sq.changeFormat(null, { tag: 'b' });
	        } else if (!sq.hasFormat('a') && !sq.hasFormat('PRE')) {
	            if (sq.hasFormat('code')) {
	                sq.changeFormat(null, { tag: 'code' });
	            }
	            sq.bold();
	        }

	        var range = sq.getSelection();
	        if (sq.hasFormat('table') && !_domUtils2.default.isTextNode(range.commonAncestorContainer)) {
	            range.collapse(true);
	            sq.setSelection(range);
	        }
	    }
	});

	module.exports = Bold;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	var _domUtils = __webpack_require__(8);

	var _domUtils2 = _interopRequireDefault(_domUtils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Italic
	 * Add Italic to selected wysiwyg editor content
	 * @exports Italic
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 */

	var Italic = _commandManager2.default.command('wysiwyg', /** @lends Italic */{
	    name: 'Italic',
	    keyMap: ['CTRL+I', 'META+I'],
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function exec(wwe) {
	        var sq = wwe.getEditor();
	        var range = sq.getSelection();
	        var tableSelectionManager = wwe.getManager('tableSelection');

	        sq.focus();

	        if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
	            tableSelectionManager.createRangeBySelectedCells();
	        }

	        if (sq.hasFormat('i') || sq.hasFormat('em')) {
	            sq.changeFormat(null, { tag: 'i' });
	        } else if (!sq.hasFormat('a') && !sq.hasFormat('PRE')) {
	            if (sq.hasFormat('code')) {
	                sq.changeFormat(null, { tag: 'code' });
	            }
	            sq.italic();
	        }

	        if (sq.hasFormat('table') && !_domUtils2.default.isTextNode(range.commonAncestorContainer)) {
	            range.collapse(true);
	            sq.setSelection(range);
	        }
	    }
	});

	module.exports = Italic;

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	var _domUtils = __webpack_require__(8);

	var _domUtils2 = _interopRequireDefault(_domUtils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Strike
	 * Add strike to selected wysiwyg editor content
	 * @exports Strike
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 */

	var Strike = _commandManager2.default.command('wysiwyg', /** @lends Strike */{
	    name: 'Strike',
	    keyMap: ['CTRL+S', 'META+S'],
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WysiwygEditor instance
	     */
	    exec: function exec(wwe) {
	        var sq = wwe.getEditor();
	        var range = sq.getSelection();
	        var tableSelectionManager = wwe.getManager('tableSelection');

	        sq.focus();

	        if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
	            tableSelectionManager.createRangeBySelectedCells();
	        }

	        if (sq.hasFormat('S')) {
	            sq.changeFormat(null, { tag: 'S' });
	        } else if (!sq.hasFormat('a') && !sq.hasFormat('PRE')) {
	            if (sq.hasFormat('code')) {
	                sq.changeFormat(null, { tag: 'code' });
	            }
	            sq.strikethrough();
	        }

	        if (sq.hasFormat('table') && !_domUtils2.default.isTextNode(range.commonAncestorContainer)) {
	            range.collapse(true);
	            sq.setSelection(range);
	        }
	    }
	});

	module.exports = Strike;

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 */

	var CommandManager = __webpack_require__(24);

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
	  exec: function exec(wwe) {
	    var sq = wwe.getEditor();

	    sq.focus();

	    if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
	      wwe.unwrapBlockTag();
	      sq.increaseQuoteLevel();
	    }
	  }
	});

	module.exports = Blockquote;

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @fileoverview Implements AddImage wysiwyg command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 */

	var CommandManager = __webpack_require__(24);

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
	  exec: function exec(wwe, data) {
	    var sq = wwe.getEditor();

	    sq.focus();

	    if (!sq.hasFormat('PRE')) {
	      sq.insertImage(data.imageUrl, { 'alt': data.altText });
	    }
	  }
	});

	module.exports = AddImage;

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @fileoverview Implements AddLink wysiwyg command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 */

	var CommandManager = __webpack_require__(24);

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
	    exec: function exec(wwe, data) {
	        var sq = wwe.getEditor();

	        sq.focus();

	        if (!sq.hasFormat('PRE')) {
	            sq.removeAllFormatting();

	            if (sq.getSelectedText()) {
	                sq.makeLink(data.url);
	            } else {
	                var link = sq.createElement('A', { href: data.url });
	                $(link).text(data.linkText);
	                sq.insertElement(link);
	            }
	        }
	    }
	});

	module.exports = AddLink;

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	var _domUtils = __webpack_require__(8);

	var _domUtils2 = _interopRequireDefault(_domUtils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * HR
	 * Add horizontal line markdown syntax to wysiwyg Editor
	 * @exports HR
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	/**
	 * @fileoverview Implements HR wysiwyg command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 */

	var HR = _commandManager2.default.command('wysiwyg', /** @lends HR */{
	    name: 'HR',
	    keyMap: ['CTRL+L', 'META+L'],
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function exec(wwe) {
	        var sq = wwe.getEditor();
	        var range = sq.getSelection();
	        var currentNode = void 0,
	            nextBlockNode = void 0,
	            previousSibling = void 0;

	        if (range.collapsed && !sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
	            (function () {
	                currentNode = _domUtils2.default.getChildNodeByOffset(range.startContainer, range.startOffset);
	                nextBlockNode = _domUtils2.default.getTopNextNodeUnder(currentNode, wwe.get$Body()[0]);

	                if (!nextBlockNode) {
	                    nextBlockNode = sq.createDefaultBlock();
	                    wwe.get$Body().append(nextBlockNode);
	                }

	                var hr = sq.createElement('HR');

	                sq.modifyBlocks(function (frag) {
	                    frag.appendChild(hr);

	                    return frag;
	                });

	                previousSibling = hr.previousSibling;
	                if (previousSibling && _domUtils2.default.isTextNode(previousSibling) && _domUtils2.default.getTextLength(previousSibling) === 0) {
	                    hr.parentNode.removeChild(previousSibling);
	                }

	                range.selectNodeContents(nextBlockNode);
	                range.collapse(true);

	                sq.setSelection(range);
	            })();
	        }

	        sq.focus();
	    }
	});

	module.exports = HR;

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Heading
	 * Convert selected root level contents to heading with size wysiwyg Editor
	 * @exports Heading
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var Heading = _commandManager2.default.command('wysiwyg', /** @lends Heading */{
	    name: 'Heading',
	    /**
	     * Command handler
	     * @param {WysiwygEditor} wwe WYSIWYGEditor instance
	     * @param {Number} size size
	     */
	    exec: function exec(wwe, size) {
	        var sq = wwe.getEditor();
	        var blockTagName = 'h1, h2, h3, h4, h5, h6, div';

	        sq.focus();

	        if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
	            sq.modifyBlocks(function (fragment) {
	                $(fragment).children(blockTagName).each(function (index, block) {
	                    var headingHTML = '<H' + size + ' />';
	                    var $block = $(block);

	                    if ($block.is('DIV')) {
	                        $block.wrap(headingHTML);
	                    } else {
	                        var $wrapperHeading = $(headingHTML);

	                        $wrapperHeading.insertBefore(block);
	                        $wrapperHeading.html($block.html());
	                        $block.remove();
	                    }
	                });

	                return fragment;
	            });
	        }
	    }
	}); /**
	     * @fileoverview Implements Heading wysiwyg command
	     * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
	     * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
	     * @author Jiung Kang(jiung-kang@nhnent.com) FE Development Lab/NHN Ent.
	     */

	module.exports = Heading;

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Paragraph
	 * Convert selected contents to paragraph only heading and list
	 * @exports Heading
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var Paragraph = _commandManager2.default.command('wysiwyg', /** @lends Paragraph */{
	    name: 'Paragraph',
	    /**
	     * Command handler
	     * @param {WysiwygEditor} wwe WYSIWYGEditor instance
	     */
	    exec: function exec(wwe) {
	        var sq = wwe.getEditor();

	        sq.focus();

	        if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
	            sq.modifyBlocks(function (fragment) {
	                var $newFragment = $(document.createDocumentFragment());

	                $(fragment).children().each(function (index, block) {
	                    if (block.nodeName.match(/h\d/i)) {
	                        $newFragment.append($(block).children());
	                    } else if (block.nodeName.match(/ul|ol/i)) {
	                        $(block).find('li').each(function (i, listItem) {
	                            $newFragment.append($(listItem).children());
	                        });
	                    } else {
	                        $newFragment.append(block);
	                    }
	                });

	                return $newFragment[0];
	            });
	        }
	    }
	}); /**
	     * @fileoverview Implements Paragraph wysiwyg command
	     * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Lab/NHN Ent.
	     * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Lab/NHN Ent.
	     * @author Jiung Kang(jiung-kang@nhnent.com) FE Development Lab/NHN Ent.
	     */

	module.exports = Paragraph;

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * UL
	 * Add UL to selected wysiwyg editor content
	 * @exports UL
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var UL = _commandManager2.default.command('wysiwyg', /** @lends UL */{
	    name: 'UL',
	    keyMap: ['CTRL+U', 'META+U'],
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function exec(wwe) {
	        var sq = wwe.getEditor();
	        var range = sq.getSelection();

	        sq.focus();

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
	    }
	}); /**
	     * @fileoverview Implements WysiwygCommand
	     * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	     * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	     */

	module.exports = UL;

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * OL
	 * Add OL to selected wysiwyg editor content
	 * @exports OL
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var OL = _commandManager2.default.command('wysiwyg', /** @lends OL */{
	    name: 'OL',
	    keyMap: ['CTRL+O', 'META+O'],
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function exec(wwe) {
	        var sq = wwe.getEditor();
	        var range = sq.getSelection();

	        sq.focus();

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
	    }
	}); /**
	     * @fileoverview Implements WysiwygCommand
	     * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	     * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	     */

	module.exports = OL;

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Table
	 * Add table to selected wysiwyg editor content
	 * @exports Table
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var Table = _commandManager2.default.command('wysiwyg', /** @lends Table */{
	    name: 'Table',
	    /**
	     * Command Handler
	     * @param {WysiwygEditor} wwe WYsiwygEditor instance
	     * @param {number} col column count
	     * @param {number} row row count
	     * @param {Array} data initial table data
	     */
	    exec: function exec(wwe, col, row, data) {
	        var sq = wwe.getEditor();
	        var tableIDClassName = wwe.getManager('table').getTableIDClassName();
	        var tableHTMLString = void 0;

	        if (!sq.getSelection().collapsed || sq.hasFormat('TABLE') || sq.hasFormat('PRE')) {
	            sq.focus();

	            return;
	        }

	        tableHTMLString = '<table class="' + tableIDClassName + '">';
	        tableHTMLString += makeHeader(col, data);
	        tableHTMLString += makeBody(col, row - 1, data);
	        tableHTMLString += '</table>';

	        sq.insertHTML(tableHTMLString);

	        sq.focus();

	        if (!data) {
	            focusToFirstTh(sq, wwe.get$Body().find('.' + tableIDClassName));
	        }
	    }
	});

	/**
	 * Focus to first th
	 * @param {Squire} sq Squire instance
	 * @param {jQuery} $table jQuery wrapped table element
	 */
	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 */

	function focusToFirstTh(sq, $table) {
	    var range = sq.getSelection();

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
	    var header = '<thead><tr>';
	    var index = 0;

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
	    var body = '<tbody>';
	    var index = col;

	    for (var irow = 0; irow < row; irow += 1) {
	        body += '<tr>';

	        for (var icol = 0; icol < col; icol += 1) {
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
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * AddRow
	 * Add Row to selected table
	 * @exports AddRow
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var AddRow = _commandManager2.default.command('wysiwyg', /** @lends AddRow */{
	    name: 'AddRow',
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function exec(wwe) {
	        var sq = wwe.getEditor();
	        var range = sq.getSelection().cloneRange();
	        var $tr = void 0,
	            $newRow = void 0;

	        sq.focus();

	        if (sq.hasFormat('TD')) {
	            sq.saveUndoState(range);
	            $tr = $(range.startContainer).closest('tr');
	            $newRow = getNewRow($tr);
	            $newRow.insertAfter($tr);

	            focusToFirstTd(sq, $newRow);
	        } else if (sq.hasFormat('TH')) {
	            sq.saveUndoState(range);
	            $tr = $(range.startContainer).parents('thead').next('tbody').children('tr').eq(0);
	            $newRow = getNewRow($tr);
	            $newRow.insertBefore($tr);

	            focusToFirstTd(sq, $newRow);
	        }
	    }
	});

	/**
	 * Get new row of given row
	 * @param {jQuery} $tr jQuery wrapped table row
	 * @returns {HTMLElement}
	 */
	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 */

	function getNewRow($tr) {
	    var cloned = $tr.clone();
	    var htmlString = tui.util.browser.msie ? '' : '<br />';

	    cloned.find('td').html(htmlString);

	    return cloned;
	}
	/**
	 * Focus to first table cell
	 * @param {Squire} sq Squire instance
	 * @param {jQuery} $tr jQuery wrapped table row
	 */
	function focusToFirstTd(sq, $tr) {
	    var range = sq.getSelection();

	    range.selectNodeContents($tr.find('td')[0]);
	    range.collapse(true);
	    sq.setSelection(range);
	}

	module.exports = AddRow;

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	var _domUtils = __webpack_require__(8);

	var _domUtils2 = _interopRequireDefault(_domUtils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * AddCol
	 * Add col to selected table
	 * @exports AddCol
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 */

	var AddCol = _commandManager2.default.command('wysiwyg', /** @lends AddCol */{
	    name: 'AddCol',
	    /**
	     * 커맨드 핸들러
	     * @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function exec(wwe) {
	        var sq = wwe.getEditor();
	        var range = sq.getSelection().cloneRange();
	        var $cell = void 0;

	        sq.focus();

	        if (sq.hasFormat('TR')) {
	            sq.saveUndoState(range);

	            $cell = getCellByRange(range);
	            addColToCellAfter($cell);

	            focusToNextCell(sq, $cell);
	        }
	    }
	});

	/**
	 * Get cell by range object
	 * @param {Range} range range
	 * @returns {HTMLElement}
	 */
	function getCellByRange(range) {
	    var cell = range.startContainer;

	    if (_domUtils2.default.getNodeName(cell) === 'TD' || _domUtils2.default.getNodeName(cell) === 'TH') {
	        cell = $(cell);
	    } else {
	        cell = $(cell).parentsUntil('tr');
	    }

	    return cell;
	}

	/**
	 * Add column to after the current cell
	 * @param {jQuery} $cell jQuery wrapped table cell
	 */
	function addColToCellAfter($cell) {
	    var index = $cell.index();
	    var cellToAdd = void 0;

	    $cell.parents('table').find('tr').each(function (n, tr) {
	        if (_domUtils2.default.getNodeName(tr.parentNode) === 'TBODY') {
	            cellToAdd = $('<td></td>');
	        } else {
	            cellToAdd = $('<th></th>');
	        }
	        if (!tui.util.browser.msie) {
	            cellToAdd.append($('<br />')[0]);
	        }

	        $(cellToAdd).insertAfter($(tr).children().eq(index));
	    });
	}

	/**
	 * Focus to next cell
	 * @param {Squire} sq Squire instance
	 * @param {jQuery} $cell jQuery wrapped table cell
	 */
	function focusToNextCell(sq, $cell) {
	    var range = sq.getSelection();

	    range.selectNodeContents($cell.next()[0]);
	    range.collapse(true);

	    sq.setSelection(range);
	}

	module.exports = AddCol;

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	var _domUtils = __webpack_require__(8);

	var _domUtils2 = _interopRequireDefault(_domUtils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * RemoveRow
	 * remove Row to selected table
	 * @exports RemoveRow
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 */

	var RemoveRow = _commandManager2.default.command('wysiwyg', /** @lends RemoveRow */{
	    name: 'RemoveRow',
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function exec(wwe) {
	        var sq = wwe.getEditor();
	        var range = sq.getSelection().cloneRange();
	        var $table = $(range.startContainer).parents('table');
	        var selectionMgr = wwe.getManager('tableSelection');
	        var tableMgr = wwe.getManager('table');
	        var $tr = getTrs(range, selectionMgr, $table);
	        var tbodyRowLength = $table.find('tbody tr').length;

	        sq.focus();

	        if ((sq.hasFormat('TD') || sq.hasFormat('TABLE')) && tbodyRowLength > 1) {
	            sq.saveUndoState(range);
	            var $nextFocus = $tr.last().next()[0] ? $tr.last().next() : $tr.first().prev();

	            if ($nextFocus.length) {
	                focusToFirstTd(sq, range, $nextFocus, tableMgr);
	            }
	            $tr.remove();
	        }
	        selectionMgr.removeClassAttrbuteFromAllCellsIfNeed();
	    }
	});

	/**
	 * Focus to first TD in given TR
	 * @param {SquireExt} sq Squire instance
	 * @param {Range} range Range object
	 * @param {jQuery} $tr jQuery wrapped TR
	 * @param {object} tableMgr Table manager
	 */
	function focusToFirstTd(sq, range, $tr, tableMgr) {
	    var nextFocusCell = $tr.find('td')[0];
	    range.setStart(nextFocusCell, 0);
	    range.collapse(true);

	    tableMgr.setLastCellNode(nextFocusCell);
	    sq.setSelection(range);
	}

	/**
	 * Get start, end row index from current range
	 * @param {HTMLElement} firstSelectedCell Range object
	 * @param {object} rangeInformation Range information object
	 * @param {jQuery} $table jquery wrapped TABLE
	 * @returns {jQuery}
	 */
	function getSelectedRows(firstSelectedCell, rangeInformation, $table) {
	    var tbodyRowLength = $table.find('tbody tr').length;
	    var isStartContainerInThead = $(firstSelectedCell).parents('thead').length;
	    var startRowIndex = rangeInformation.from.row;
	    var endRowIndex = rangeInformation.to.row;

	    if (isStartContainerInThead) {
	        startRowIndex += 1;
	    }

	    var isWholeTbodySelected = (startRowIndex === 1 || isStartContainerInThead) && endRowIndex === tbodyRowLength;

	    if (isWholeTbodySelected) {
	        endRowIndex -= 1;
	    }

	    return $table.find('tr').slice(startRowIndex, endRowIndex + 1);
	}

	/**
	 * Get TRs
	 * @param {Range} range Range object
	 * @param {object} selectionMgr Table selection manager
	 * @param {jQuery} $table current table
	 * @returns {jQuery}
	 */
	function getTrs(range, selectionMgr, $table) {
	    var selectedCells = selectionMgr.getSelectedCells();
	    var rangeInformation = void 0,
	        trs = void 0,
	        startCell = void 0,
	        endCell = void 0;

	    if (selectedCells.length) {
	        rangeInformation = selectionMgr.getSelectionRangeFromTable(selectedCells.first()[0], selectedCells.last()[0]);
	        trs = getSelectedRows(selectedCells.first()[0], rangeInformation, $table);
	    } else {
	        var startContainer = range.startContainer;
	        var endContainer = range.endContainer;

	        startCell = _domUtils2.default.isTextNode(startContainer) ? $(startContainer).parent('td,th')[0] : startContainer;
	        endCell = _domUtils2.default.isTextNode(endContainer) ? $(endContainer).parent('td,th')[0] : endContainer;
	        rangeInformation = selectionMgr.getSelectionRangeFromTable(startCell, endCell);
	        trs = getSelectedRows(startCell, rangeInformation, $table);
	    }

	    return trs;
	}
	module.exports = RemoveRow;

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	var _domUtils = __webpack_require__(8);

	var _domUtils2 = _interopRequireDefault(_domUtils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * RemoveCol
	 * remove Row to selected table
	 * @exports RemoveCol
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 */

	var RemoveCol = _commandManager2.default.command('wysiwyg', /** @lends RemoveCol */{
	    name: 'RemoveCol',
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function exec(wwe) {
	        var sq = wwe.getEditor();
	        var range = sq.getSelection().cloneRange();
	        var tableMgr = wwe.getManager('table');
	        var isAbleToRemoveColumn = $(range.startContainer).closest('table').find('thead tr th').length > 1;

	        sq.focus();

	        if (sq.hasFormat('TR') && isAbleToRemoveColumn) {
	            sq.saveUndoState(range);
	            var $cell = getCellByRange(range);
	            var $nextFocus = $cell.next().length ? $cell.next() : $cell.prev();

	            removeColByCell($cell);

	            focusToCell(sq, $nextFocus, tableMgr);
	        }
	    }
	});

	/**
	 * Get cell by range object
	 * @param {Range} range range
	 * @returns {HTMLElement|Node}
	 */
	function getCellByRange(range) {
	    var cell = range.startContainer;

	    if (_domUtils2.default.getNodeName(cell) === 'TD' || _domUtils2.default.getNodeName(cell) === 'TH') {
	        cell = $(cell);
	    } else {
	        cell = $(cell).parentsUntil('tr');
	    }

	    return cell;
	}

	/**
	 * Remove column by given cell
	 * @param {jQuery} $cell jQuery wrapped table cell
	 */
	function removeColByCell($cell) {
	    var index = $cell.index();

	    $cell.parents('table').find('tr').each(function (n, tr) {
	        $(tr).children().eq(index).remove();
	    });
	}

	/**
	 * Focus to given cell
	 * @param {Squire} sq Squire instance
	 * @param {jQuery} $cell jQuery wrapped table cell
	 * @param {object} tableMgr Table manager instance
	 */
	function focusToCell(sq, $cell, tableMgr) {
	    var nextFocusCell = $cell[0];

	    if ($cell.length) {
	        var range = sq.getSelection();
	        range.selectNodeContents($cell[0]);
	        range.collapse(true);
	        sq.setSelection(range);

	        tableMgr.setLastCellNode(nextFocusCell);
	    }
	}

	module.exports = RemoveCol;

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	var _domUtils = __webpack_require__(8);

	var _domUtils2 = _interopRequireDefault(_domUtils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * AlignCol
	 * Align selected column's text content to given direction
	 * @exports AlignCol
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 */

	var AlignCol = _commandManager2.default.command('wysiwyg', /** @lends AlignCol */{
	    name: 'AlignCol',
	    /**
	     * 커맨드 핸들러
	     * @param {WysiwygEditor} wwe WYsiwygEditor instance
	     * @param {string} alignDirection Align direction
	     */
	    exec: function exec(wwe, alignDirection) {
	        var sq = wwe.getEditor();
	        var range = sq.getSelection().cloneRange();
	        var selectionMgr = wwe.getManager('tableSelection');
	        var rangeInformation = getRangeInformation(range, selectionMgr);

	        sq.focus();

	        if (sq.hasFormat('TR')) {
	            sq.saveUndoState(range);

	            var $table = $(range.startContainer).parents('table');

	            var selectionInformation = getSelectionInformation($table, rangeInformation);

	            setAlignAttributeToTableCells($table, alignDirection, selectionInformation);
	        }
	        selectionMgr.removeClassAttrbuteFromAllCellsIfNeed();
	    }
	});

	/**
	 * Set Column align
	 * @param {jQuery} $table jQuery wrapped TABLE
	 * @param {string} alignDirection 'left' or 'center' or 'right'
	 * @param {{
	 *     startColumnIndex: number,
	 *     endColumnIndex: number,
	 *     isDivided: boolean
	 *     }} selectionInformation start, end column index and boolean value for whether range divided or not
	 */
	function setAlignAttributeToTableCells($table, alignDirection, selectionInformation) {
	    var isDivided = selectionInformation.isDivided || false;
	    var start = selectionInformation.startColumnIndex;
	    var end = selectionInformation.endColumnIndex;
	    var columnLength = $table.find('tr').eq(0).find('td,th').length;

	    $table.find('tr').each(function (n, tr) {
	        $(tr).children('td,th').each(function (index, cell) {
	            if (isDivided && (start <= index && index <= columnLength || index <= end)) {
	                $(cell).attr('align', alignDirection);
	            } else if (start <= index && index <= end) {
	                $(cell).attr('align', alignDirection);
	            }
	        });
	    });
	}

	/**
	 * Return start, end column index and boolean value for whether range divided or not
	 * @param {jQuery} $table jQuery wrapped TABLE
	 * @param {{startColumnIndex: number, endColumnIndex: number}} rangeInformation Range information
	 * @returns {{startColumnIndex: number, endColumnIndex: number, isDivided: boolean}}
	 */
	function getSelectionInformation($table, rangeInformation) {
	    var columnLength = $table.find('tr').eq(0).find('td,th').length;
	    var from = rangeInformation.from;
	    var to = rangeInformation.to;
	    var startColumnIndex = void 0,
	        endColumnIndex = void 0,
	        isDivided = void 0;

	    if (from.row === to.row) {
	        startColumnIndex = from.cell;
	        endColumnIndex = to.cell;
	    } else if (from.row < to.row) {
	        if (from.cell <= to.cell) {
	            startColumnIndex = 0;
	            endColumnIndex = columnLength - 1;
	        } else {
	            startColumnIndex = from.cell;
	            endColumnIndex = to.cell;
	            isDivided = true;
	        }
	    }

	    return {
	        startColumnIndex: startColumnIndex,
	        endColumnIndex: endColumnIndex,
	        isDivided: isDivided
	    };
	}

	/**
	 * Get range information
	 * @param {Range} range Range object
	 * @param {object} selectionMgr Table selection manager
	 * @returns {object}
	 */
	function getRangeInformation(range, selectionMgr) {
	    var selectedCells = selectionMgr.getSelectedCells();
	    var rangeInformation = void 0,
	        startCell = void 0;

	    if (selectedCells.length) {
	        rangeInformation = selectionMgr.getSelectionRangeFromTable(selectedCells.first()[0], selectedCells.last()[0]);
	    } else {
	        var startContainer = range.startContainer;
	        startCell = _domUtils2.default.isTextNode(startContainer) ? $(startContainer).parent('td,th')[0] : startContainer;
	        rangeInformation = selectionMgr.getSelectionRangeFromTable(startCell, startCell);
	    }

	    return rangeInformation;
	}

	module.exports = AlignCol;

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * RemoveTable
	 * Remove selected table
	 * @exports RemoveTable
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var RemoveTable = _commandManager2.default.command('wysiwyg', /** @lends RemoveTable */{
	  name: 'RemoveTable',
	  /**
	   *  커맨드 핸들러
	   *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	   */
	  exec: function exec(wwe) {
	    var sq = wwe.getEditor();
	    var range = sq.getSelection().cloneRange();

	    if (sq.hasFormat('TABLE')) {
	      sq.saveUndoState(range);
	      var $table = $(range.startContainer).closest('table');

	      $table.remove();
	    }

	    sq.focus();
	  }
	}); /**
	     * @fileoverview Implements WysiwygCommand
	     * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	     * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	     */

	module.exports = RemoveTable;

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * IncreaseDepth
	 * increase depth of list or task to wysiwyg Editor
	 * @exports IncreaseDepth
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var IncreaseTask = _commandManager2.default.command('wysiwyg', /** @lends HR */{
	    name: 'IncreaseDepth',
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function exec(wwe) {
	        var range = wwe.getEditor().getSelection();
	        var $node = $(range.startContainer).closest('li');
	        var prevClasses = void 0,
	            nodeClasses = void 0,
	            nextClasses = void 0;

	        var $prev = $node.prev();

	        if ($prev.length && $node.length) {
	            var $next = $node.find('li').eq(0);

	            wwe.getEditor().saveUndoState();

	            nodeClasses = $node.attr('class');
	            prevClasses = $prev.attr('class');
	            nextClasses = $next.attr('class');

	            $node.removeAttr('class');
	            $prev.removeAttr('class');

	            if ($next.length && !$next.children('div').length) {
	                $next.removeAttr('class');
	            }

	            wwe.getEditor().increaseListLevel();

	            $node.attr('class', nodeClasses);
	            $prev.attr('class', prevClasses);
	            $next.attr('class', nextClasses);
	        }
	    }
	}); /**
	     * @fileoverview Implements incease depth wysiwyg command
	     * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	     * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	     */

	module.exports = IncreaseTask;

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @fileoverview Implements incease depth wysiwyg command
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 */

	var CommandManager = __webpack_require__(24);

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
	  exec: function exec(wwe) {
	    var $node = getCurrent$Li(wwe);

	    if ($node.length) {
	      wwe.getEditor().saveUndoState();

	      var nodeClasses = $node.attr('class');
	      wwe.getEditor().decreaseListLevel();

	      $node = getCurrent$Li(wwe);
	      $node.attr('class', nodeClasses);
	    }
	  }
	});

	/**
	 * Get list item element of current selection
	 * @param {object} wwe Wysiwyg editor instance
	 * @returns {jQuery}
	 */
	function getCurrent$Li(wwe) {
	  var range = wwe.getEditor().getSelection();

	  return $(range.startContainer).closest('li');
	}

	module.exports = DecreaseDepth;

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Task
	 * Add Task to selected wysiwyg editor content
	 * @exports Task
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	var Task = _commandManager2.default.command('wysiwyg', /** @lends Task */{
	    name: 'Task',
	    keyMap: ['CTRL+T', 'META+T'],
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function exec(wwe) {
	        var sq = wwe.getEditor();

	        sq.focus();

	        var range = sq.getSelection().cloneRange();

	        if (range.collapsed && !sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
	            if (!sq.hasFormat('li')) {
	                wwe.unwrapBlockTag();
	                sq.makeUnorderedList();
	                range = sq.getSelection().cloneRange();
	            }

	            sq.saveUndoState(range);
	            wwe.getManager('task').formatTask(range.startContainer);
	        }
	    }
	}); /**
	     * @fileoverview Implements Task WysiwygCommand
	     * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	     * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	     */

	module.exports = Task;

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _commandManager = __webpack_require__(24);

	var _commandManager2 = _interopRequireDefault(_commandManager);

	var _domUtils = __webpack_require__(8);

	var _domUtils2 = _interopRequireDefault(_domUtils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Code
	 * Add bold to selected wysiwyg editor content
	 * @exports Code
	 * @augments Command
	 * @augments WysiwygCommand
	 */
	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 */

	var Code = _commandManager2.default.command('wysiwyg', /** @lends Code */{
	    name: 'Code',
	    keyMap: ['SHIFT+CTRL+C', 'SHIFT+META+C'],
	    /**
	     *  커맨드 핸들러
	     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
	     */
	    exec: function exec(wwe) {
	        var sq = wwe.getEditor();
	        var range = sq.getSelection();
	        var tableSelectionManager = wwe.getManager('tableSelection');

	        sq.focus();

	        if (sq.hasFormat('table') && tableSelectionManager.getSelectedCells().length) {
	            tableSelectionManager.createRangeBySelectedCells();
	        }

	        if (!sq.hasFormat('PRE') && sq.hasFormat('code')) {
	            sq.changeFormat(null, { tag: 'code' });
	            removeUnnecessaryCodeInNextToRange(wwe.getEditor().getSelection().cloneRange());
	        } else if (!sq.hasFormat('a') && !sq.hasFormat('PRE')) {
	            if (sq.hasFormat('b')) {
	                sq.removeBold();
	            } else if (sq.hasFormat('i')) {
	                sq.removeItalic();
	            }

	            sq.changeFormat({ tag: 'code' });

	            range = sq.getSelection().cloneRange();
	            range.setStart(range.endContainer, range.endOffset);
	            range.collapse(true);

	            sq.setSelection(range);
	        }

	        if (sq.hasFormat('table') && !_domUtils2.default.isTextNode(range.commonAncestorContainer)) {
	            range.collapse(true);
	            sq.setSelection(range);
	        }
	    }
	});

	/**
	 * removeUnnecessaryCodeInNextToRange
	 * Remove unnecessary code tag next to range, code tag made by squire
	 * @param {Range} range range object
	 */
	function removeUnnecessaryCodeInNextToRange(range) {
	    if (_domUtils2.default.getNodeName(range.startContainer.nextSibling) === 'CODE' && _domUtils2.default.getTextLength(range.startContainer.nextSibling) === 0) {
	        $(range.startContainer.nextSibling).remove();
	    }
	}

	module.exports = Code;

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @fileoverview Implements WysiwygCommand
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
	 */

	var CommandManager = __webpack_require__(24);

	var CODEBLOCK_CLASS_PREFIX = 'te-content-codeblock-';
	var CODEBLOCK_ATTR_NAME = 'data-te-codeblock';
	var codeBlockID = 0;

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
	    exec: function exec(wwe, type) {
	        var sq = wwe.getEditor();
	        var range = sq.getSelection().cloneRange();
	        if (!sq.hasFormat('PRE') && !sq.hasFormat('TABLE')) {
	            var attr = CODEBLOCK_ATTR_NAME + ' class = "' + CODEBLOCK_CLASS_PREFIX + codeBlockID + '"';

	            if (type) {
	                attr += ' data-language="' + type + '"';
	            }

	            var codeBlockBody = getCodeBlockBody(range, wwe);
	            sq.insertHTML('<pre ' + attr + '>' + codeBlockBody + '</pre>');

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

	    range.setStartBefore($pre.find('div')[0].firstChild);
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
	    var mgr = wwe.getManager('codeblock');
	    var contents = void 0,
	        nodes = void 0;

	    if (range.collapsed) {
	        nodes = [$('<div><br></div>')[0]];
	    } else {
	        contents = range.extractContents();
	        nodes = tui.util.toArray(contents.childNodes);
	    }

	    var codeBlock = mgr.convertToCodeblock(nodes).innerHTML;

	    return codeBlock;
	}

	module.exports = CodeBlock;

/***/ },
/* 90 */
/***/ function(module, exports) {

	"use strict";

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

	/*eslint-disable */
	CodeMirror.overlayMode = function (base, overlay, combine) {
	  return {
	    startState: function startState() {
	      return {
	        base: CodeMirror.startState(base),
	        overlay: CodeMirror.startState(overlay),
	        basePos: 0, baseCur: null,
	        overlayPos: 0, overlayCur: null,
	        streamSeen: null
	      };
	    },
	    copyState: function copyState(state) {
	      return {
	        base: CodeMirror.copyState(base, state.base),
	        overlay: CodeMirror.copyState(overlay, state.overlay),
	        basePos: state.basePos, baseCur: null,
	        overlayPos: state.overlayPos, overlayCur: null
	      };
	    },

	    token: function token(stream, state) {
	      if (stream != state.streamSeen || Math.min(state.basePos, state.overlayPos) < stream.start) {
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
	      if (state.overlayCur == null) return state.baseCur;else if (state.baseCur != null && state.overlay.combineTokens || combine && state.overlay.combineTokens == null) return state.baseCur + " " + state.overlayCur;else return state.overlayCur;
	    },

	    indent: base.indent && function (state, textAfter) {
	      return base.indent(state.base, textAfter);
	    },
	    electricChars: base.electricChars,

	    innerMode: function innerMode(state) {
	      return { state: state.base, mode: base };
	    },

	    blankLine: function blankLine(state) {
	      if (base.blankLine) base.blankLine(state.base);
	      if (overlay.blankLine) overlay.blankLine(state.overlay);
	    }
	  };
	};
	/*eslint-enable */

/***/ },
/* 91 */
/***/ function(module, exports) {

	// CodeMirror, copyright (c) by Marijn Haverbeke and others
	// Distributed under an MIT license: http://codemirror.net/LICENSE

	/*eslint-disable */
	"use strict";

	CodeMirror.defineMode("markdown", function (cmCfg, modeCfg) {

	  var htmlFound = CodeMirror.modes.hasOwnProperty("xml");
	  var htmlMode = CodeMirror.getMode(cmCfg, htmlFound ? { name: "xml", htmlMode: true } : "text/plain");

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
	  if (modeCfg.highlightFormatting === undefined) modeCfg.highlightFormatting = false;

	  // Maximum number of nested blockquotes. Set to 0 for infinite nesting.
	  // Excess `>` will emit `error` token.
	  if (modeCfg.maxBlockquoteDepth === undefined) modeCfg.maxBlockquoteDepth = 0;

	  // Should underscores in words open/close em/strong?
	  if (modeCfg.underscoresBreakWords === undefined) modeCfg.underscoresBreakWords = true;

	  // Use `fencedCodeBlocks` to configure fenced code blocks. false to
	  // disable, string to specify a precise regexp that the fence should
	  // match, and true to allow three or more backticks or tildes (as
	  // per CommonMark).

	  // Turn on task lists? ("- [ ] " and "- [x] ")
	  if (modeCfg.taskLists === undefined) modeCfg.taskLists = false;

	  // Turn on strikethrough syntax
	  if (modeCfg.strikethrough === undefined) modeCfg.strikethrough = false;

	  var codeDepth = 0;

	  var header = 'header',
	      code = 'comment',
	      quote = 'quote',
	      list1 = 'variable-2',
	      list2 = 'variable-3',
	      list3 = 'keyword',
	      hr = 'hr',
	      image = 'tag',
	      formatting = 'formatting',
	      linkinline = 'link',
	      linkemail = 'link',
	      linktext = 'link',
	      linkhref = 'string',
	      em = 'em',
	      strong = 'strong',
	      strikethrough = 'strikethrough';

	  var hrRE = /^([*\-_])(?:\s*\1){2,}\s*$/,
	      ulRE = /^[*\-+]\s+/,
	      olRE = /^[0-9]+([.)])\s+/,
	      taskListRE = /^\[(x| )\](?=\s)/ // Must follow ulRE or olRE
	  ,
	      atxHeaderRE = modeCfg.allowAtxHeaderWithoutSpace ? /^(#+)/ : /^(#+)(?: |$)/,
	      setextHeaderRE = /^ *(?:\={1,}|-{1,})\s*$/,
	      textRE = /^[^#!\[\]*_\\<>` "'(~]+/,
	      fencedCodeRE = new RegExp("^(" + (modeCfg.fencedCodeBlocks === true ? "~~~+|```+" : modeCfg.fencedCodeBlocks) + ")[ \\t]*([\\w+#]*)");

	  function switchInline(stream, state, f) {
	    state.f = state.inline = f;
	    return f(stream, state);
	  }

	  function switchBlock(stream, state, f) {
	    state.f = state.block = f;
	    return f(stream, state);
	  }

	  function lineIsEmpty(line) {
	    return !line || !/\S/.test(line.string);
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
	    state.prevLine = state.thisLine;
	    state.thisLine = null;
	    return null;
	  }

	  function blockNormal(stream, state) {

	    var sol = stream.sol();

	    var prevLineIsList = state.list !== false,
	        prevLineIsIndentedCode = state.indentedCode;

	    state.indentedCode = false;

	    if (prevLineIsList) {
	      if (state.indentationDiff >= 0) {
	        // Continued list
	        if (state.indentationDiff < 4) {
	          // Only adjust indentation if *not* a code block
	          state.indentation -= state.indentationDiff;
	        }
	        state.list = null;
	      }
	      if (state.indentation > 0) {
	        state.list = null;
	        state.listDepth = Math.floor(state.indentation / 4) + 1;
	      } else {
	        // No longer a list
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
	    } else if (!lineIsEmpty(state.prevLine) && !state.quote && !prevLineIsList && !prevLineIsIndentedCode && (match = stream.match(setextHeaderRE))) {
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
	        state.task = true; // task state 관리를 위해 추가
	      }
	      state.f = state.inline;
	      if (modeCfg.highlightFormatting) state.formatting = ["list", "list-" + listType];
	      return getType(state);
	    } else if (modeCfg.fencedCodeBlocks && (match = stream.match(fencedCodeRE, true))) {
	      state.fencedChars = match[1];
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
	    if (htmlFound && state.htmlState.tagStart === null && !state.htmlState.context && state.htmlState.tokenize.isInText || state.md_inside && stream.current().indexOf(">") > -1) {
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
	    } else {
	      // Only apply inline styles to non-url text
	      if (state.strong) {
	        styles.push(strong);
	      }
	      if (state.em) {
	        styles.push(em);
	      }
	      if (state.strikethrough) {
	        styles.push(strikethrough);
	      }

	      if (state.linkText) {
	        styles.push(linktext);
	      }

	      if (state.code) {
	        styles.push(code);
	      }
	    }

	    if (state.header) {
	      styles.push(header);styles.push(header + "-" + state.header);
	    }

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
	    if (typeof style !== 'undefined') return style;

	    if (state.list) {
	      // List marker (*, +, -, 1., etc)
	      state.list = null;
	      return getType(state);
	    }

	    if (state.taskList) {
	      var taskOpen = stream.match(taskListRE, true)[1] !== "x";
	      if (taskOpen) state.taskOpen = true;else state.taskClosed = true;
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
	      matchCh = (matchCh + '').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
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
	        if (difference === codeDepth) {
	          // Must be exact
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
	      if (type) {
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
	      if (type) {
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
	    
	        if (ch === '<' && stream.match(/^\/\w*?>/)) {
	          state.md_inside = false;
	          return "tag";
	        }
	    */

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
	    if (ch === '*' || ch === '_' && !ignoreUnderscore) {
	      if (sol && stream.peek() === ' ') {
	        // Do nothing, surrounded by newline and space
	      } else if (state.strong === ch && stream.eat(ch)) {
	        // Remove STRONG
	        if (modeCfg.highlightFormatting) state.formatting = "strong";
	        var t = getType(state);
	        state.strong = false;
	        return t;
	      } else if (!state.strong && stream.eat(ch)) {
	        // Add STRONG
	        state.strong = ch;
	        if (modeCfg.highlightFormatting) state.formatting = "strong";
	        return getType(state);
	      } else if (state.em === ch) {
	        // Remove EM
	        if (modeCfg.highlightFormatting) state.formatting = "em";
	        var t = getType(state);
	        state.em = false;
	        return t;
	      } else if (!state.em) {
	        // Add EM
	        state.em = ch;
	        if (modeCfg.highlightFormatting) state.formatting = "em";
	        return getType(state);
	      }
	    } else if (ch === ' ') {
	      if (stream.eat('*') || stream.eat('_')) {
	        // Probably surrounded by spaces
	        if (stream.peek() === ' ') {
	          // Surrounded by spaces, ignore
	          return getType(state);
	        } else {
	          // Not surrounded by spaces, back up pointer
	          stream.backUp(1);
	        }
	      }
	    }

	    if (modeCfg.strikethrough) {
	      if (ch === '~' && stream.eatWhile(ch)) {
	        if (state.strikethrough) {
	          // Remove strikethrough
	          if (modeCfg.highlightFormatting) state.formatting = "strikethrough";
	          var t = getType(state);
	          state.strikethrough = false;
	          return t;
	        } else if (stream.match(/^[^\s]/, false)) {
	          // Add strikethrough
	          state.strikethrough = true;
	          if (modeCfg.highlightFormatting) state.formatting = "strikethrough";
	          return getType(state);
	        }
	      } else if (ch === ' ') {
	        if (stream.match(/^~~/, true)) {
	          // Probably surrounded by space
	          if (stream.peek() === ' ') {
	            // Surrounded by spaces, ignore
	            return getType(state);
	          } else {
	            // Not surrounded by spaces, back up pointer
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
	      if (type) {
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
	    if (stream.eatSpace()) {
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
	    return function (stream, state) {
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
	    if (stream.eatSpace()) {
	      return null;
	    }
	    // Match URL
	    stream.match(/^[^\s]+/, true);
	    // Check for link title
	    if (stream.peek() === undefined) {
	      // End of line, set flag to check next line
	      state.linkTitle = true;
	    } else {
	      // More content on line, check if link title
	      stream.match(/^(?:\s+(?:"(?:[^"\\]|\\\\|\\.)+"|'(?:[^'\\]|\\\\|\\.)+'|\((?:[^)\\]|\\\\|\\.)+\)))?/, true);
	    }
	    state.f = state.inline = inlineNormal;
	    return linkhref + " url";
	  }

	  var savedInlineRE = [];
	  function inlineRE(endChar) {
	    if (!savedInlineRE[endChar]) {
	      // Escape endChar for RegExp (taken from http://stackoverflow.com/a/494122/526741)
	      endChar = (endChar + '').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
	      // Match any non-endChar, escaped character, as well as the closing
	      // endChar.
	      savedInlineRE[endChar] = new RegExp('^(?:[^\\\\]|\\\\.)*?(' + endChar + ')');
	    }
	    return savedInlineRE[endChar];
	  }

	  var mode = {
	    startState: function startState() {
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
	        task: false,
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

	    copyState: function copyState(s) {
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
	        task: s.task, // task state 관리를 위해 추가
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

	    token: function token(stream, state) {

	      // Reset state.formatting
	      state.formatting = false;

	      if (stream != state.thisLine) {
	        var forceBlankLine = state.header || state.hr;

	        // Reset state.header and state.hr
	        state.header = 0;
	        state.hr = false;

	        if (stream.match(/^\s*$/, true) || forceBlankLine) {
	          blankLine(state);
	          if (!forceBlankLine) return null;
	          state.prevLine = null;
	        }

	        state.prevLine = state.thisLine;
	        state.thisLine = stream;

	        // Reset state.taskList
	        state.taskList = false;
	        state.task = false; // task state 관리를 위해 추가

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

	    innerMode: function innerMode(state) {
	      if (state.block == htmlBlock) return { state: state.htmlState, mode: htmlMode };
	      if (state.localState) return { state: state.localState, mode: state.localMode };
	      return { state: state, mode: mode };
	    },

	    blankLine: blankLine,

	    getType: getType,
	    closeBrackets: "()[]{}''\"\"``",
	    fold: "markdown"
	  };
	  return mode;
	}, "xml");

	CodeMirror.defineMIME("text/x-markdown", "markdown");
	/*eslint-enable */

/***/ },
/* 92 */
/***/ function(module, exports) {

	'use strict';

	// CodeMirror, copyright (c) by Marijn Haverbeke and others
	// Distributed under an MIT license: http://codemirror.net/LICENSE


	/*eslint-disable */
	var urlRE = /^((?:(?:aaas?|about|acap|adiumxtra|af[ps]|aim|apt|attachment|aw|beshare|bitcoin|bolo|callto|cap|chrome(?:-extension)?|cid|coap|com-eventbrite-attendee|content|crid|cvs|data|dav|dict|dlna-(?:playcontainer|playsingle)|dns|doi|dtn|dvb|ed2k|facetime|feed|file|finger|fish|ftp|geo|gg|git|gizmoproject|go|gopher|gtalk|h323|hcp|https?|iax|icap|icon|im|imap|info|ipn|ipp|irc[6s]?|iris(?:\.beep|\.lwz|\.xpc|\.xpcs)?|itms|jar|javascript|jms|keyparc|lastfm|ldaps?|magnet|mailto|maps|market|message|mid|mms|ms-help|msnim|msrps?|mtqp|mumble|mupdate|mvn|news|nfs|nih?|nntp|notes|oid|opaquelocktoken|palm|paparazzi|platform|pop|pres|proxy|psyc|query|res(?:ource)?|rmi|rsync|rtmp|rtsp|secondlife|service|session|sftp|sgn|shttp|sieve|sips?|skype|sm[bs]|snmp|soap\.beeps?|soldat|spotify|ssh|steam|svn|tag|teamspeak|tel(?:net)?|tftp|things|thismessage|tip|tn3270|tv|udp|unreal|urn|ut2004|vemmi|ventrilo|view-source|webcal|wss?|wtai|wyciwyg|xcon(?:-userid)?|xfire|xmlrpc\.beeps?|xmpp|xri|ymsgr|z39\.50[rs]?):(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]|\([^\s()<>]*\))+(?:\([^\s()<>]*\)|[^\s`*!()\[\]{};:'".,<>?«»“”‘’]))/i;

	CodeMirror.defineMode("gfm", function (config, modeConfig) {
	  var codeDepth = 0;
	  function blankLine(state) {
	    state.code = false;
	    return null;
	  }
	  var gfmOverlay = {
	    startState: function startState() {
	      return {
	        code: false,
	        codeBlock: false,
	        ateSpace: false
	      };
	    },
	    copyState: function copyState(s) {
	      return {
	        code: s.code,
	        codeBlock: s.codeBlock,
	        ateSpace: s.ateSpace
	      };
	    },
	    token: function token(stream, state) {
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
	          if (difference === codeDepth) {
	            // Must be exact
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

	CodeMirror.defineMIME("text/x-gfm", "gfm"); /*eslint-enable */

/***/ },
/* 93 */
/***/ function(module, exports) {

	"use strict";

	// CodeMirror, copyright (c) by Marijn Haverbeke and others
	// Distributed under an MIT license: http://codemirror.net/LICENSE

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

	        if (listRE.test(cursorBeforeTextInline)) {
	            cm.replaceRange(Array(cm.getOption("indentUnit") + 1).join(" ") + line, {
	                line: pos.line, ch: 0
	            }, {
	                line: pos.line, ch: line.length
	            }, '+input');
	            cm.setCursor(pos.line, pos.ch + 4);
	        } else {
	            if (cm.somethingSelected()) cm.indentSelection("add");else cm.execCommand("insertSoftTab");
	        }
	    }
	};

	CodeMirror.commands.newlineAndIndentContinue = function (cm) {
	    if (cm.getOption("disableInput")) return CodeMirror.Pass;
	    var ranges = cm.listSelections(),
	        replacements = [];

	    for (var i = 0; i < ranges.length; i++) {
	        var pos = ranges[i].head;
	        var eolState = cm.getStateAfter(pos.line);
	        var inList = eolState.base.list !== false;
	        var inQuote = eolState.base.quote !== 0;

	        var line = cm.getLine(pos.line);
	        var isCodeBlockStart = FIND_CODEBLOCK_START_RX.test(line);
	        var match = listRE.exec(line);
	        var cursor = cm.getCursor();

	        if (!ranges[i].empty() || !inList && !inQuote && !isCodeBlockStart || !match && !isCodeBlockStart) {
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

	        if (emptyListRE.test(line) && cursor.ch > 0) {
	            cm.replaceRange("", {
	                line: pos.line, ch: 0
	            }, {
	                line: pos.line, ch: line.length
	            });
	            replacements[i] = "\n";
	        } else if (isCodeBlockStart) {
	            replacements[i] = '\n\n```';
	        } else {
	            var indent = match[1],
	                after = match[5],
	                bullet;
	            if (indent.length === pos.ch) {
	                bullet = "";
	            } else if (unorderedListRE.test(match[2]) || match[2].indexOf(">") >= 0) {
	                bullet = match[2];
	            } else {
	                bullet = parseInt(match[3], 10) + 1 + match[4];
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
/* 94 */
/***/ function(module, exports) {

	"use strict";

	// CodeMirror, copyright (c) by Marijn Haverbeke and others
	// Distributed under an MIT license: http://codemirror.net/LICENSE
	// Modified by Junghwan Park <junghwan.park@nhnent.com>

	/*eslint-disable */

	CodeMirror.commands.replaceLineTextToUpper = function (cm) {
	    if (cm.getOption("disableInput")) {
	        return CodeMirror.Pass;
	    }

	    var ranges = cm.listSelections();
	    var lineAdjustment = -1;

	    for (var i = 0; i < ranges.length; i++) {
	        var range = ranges[i];
	        var from = range.anchor;
	        var to = range.head;

	        if (isSameLineSelection(range) && to.line > 0) {
	            replaceSingleLine(cm, from, to, lineAdjustment);
	        } else if (!isRangeCollapsed(range)) {
	            var topLine = from.line < to.line ? from.line : to.line;

	            if (topLine > 0) {
	                var upper = from.line === topLine ? from : to;
	                var bottom = from.line === topLine ? to : from;
	                replaceMultiLine(cm, upper, bottom, lineAdjustment);
	            }
	        }
	    }
	};

	CodeMirror.commands.replaceLineTextToLower = function (cm) {
	    if (cm.getOption("disableInput")) {
	        return CodeMirror.Pass;
	    }

	    var ranges = cm.listSelections();
	    var lineAdjustment = 1;

	    for (var i = 0; i < ranges.length; i++) {
	        var range = ranges[i];
	        var from = range.anchor;
	        var to = range.head;
	        var isLastLine = to.line === cm.lastLine();

	        if (isSameLineSelection(range) && !isLastLine) {
	            replaceSingleLine(cm, from, to, lineAdjustment);
	        } else if (!isRangeCollapsed(range)) {
	            var topLine = from.line < to.line ? from.line : to.line;
	            var upper = from.line === topLine ? from : to;
	            var bottom = from.line === topLine ? to : from;

	            if (bottom.line < cm.lastLine()) {
	                replaceMultiLine(cm, upper, bottom, lineAdjustment);
	            }
	        }
	    }
	};

	function isRangeCollapsed(range) {
	    return isSameLineSelection(range) && range.anchor.ch === range.head.ch;
	}

	function isSameLineSelection(range) {
	    return range.anchor.line === range.head.line;
	}

	function replaceSingleLine(cm, from, to, lineAdjustment) {
	    var currentLine = cm.getLine(to.line);
	    var replacement = cm.getLine(to.line + lineAdjustment);
	    var range = {
	        anchor: from,
	        head: to
	    };

	    cm.replaceRange(replacement, {
	        line: to.line, ch: 0
	    }, {
	        line: to.line, ch: currentLine.length
	    }, '+input');

	    cm.replaceRange(currentLine, {
	        line: to.line + lineAdjustment, ch: 0
	    }, {
	        line: to.line + lineAdjustment, ch: replacement.length
	    }, '+input');

	    if (isRangeCollapsed(range)) {
	        cm.setCursor({
	            line: to.line + lineAdjustment,
	            ch: to.ch
	        });
	    } else {
	        cm.setSelection({
	            line: from.line + lineAdjustment,
	            ch: from.ch
	        }, {
	            line: to.line + lineAdjustment,
	            ch: to.ch
	        });
	    }
	}

	function replaceMultiLine(cm, upper, bottom, lineAdjustment) {
	    var rangeContent = cm.getRange({
	        line: upper.line, ch: 0
	    }, {
	        line: bottom.line, ch: cm.getLine(bottom.line).length
	    });
	    var edgeLineOfConcern = lineAdjustment > 0 ? bottom : upper;
	    var replacement = cm.getLine(edgeLineOfConcern.line + lineAdjustment);
	    var targetLine = void 0;

	    if (lineAdjustment > 0) {
	        targetLine = upper;
	    } else {
	        targetLine = bottom;
	    }

	    cm.replaceRange(replacement, {
	        line: targetLine.line, ch: 0
	    }, {
	        line: targetLine.line, ch: cm.getLine(targetLine.line).length
	    }, '+input');

	    cm.replaceRange(rangeContent, {
	        line: upper.line + lineAdjustment, ch: 0
	    }, {
	        line: bottom.line + lineAdjustment, ch: cm.getLine(bottom.line + lineAdjustment).length
	    }, '+input');

	    cm.setSelection({
	        line: upper.line + lineAdjustment, ch: upper.ch
	    }, {
	        line: bottom.line + lineAdjustment, ch: bottom.ch
	    });
	}
	/*eslint-enable */

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * @fileoverview Implements Task counter
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var extManager = __webpack_require__(26);

	var FIND_TASK_RX = /^\s*\* \[[xX ]\] [^\n]*/mg;
	var FIND_CHECKED_TASK_RX = /^\s*\* \[[xX]\] [^\n]*/mg;

	extManager.defineExtension('taskCounter', function (editor) {
	    editor.getTaskCount = function () {
	        var found = void 0,
	            count = void 0;

	        if (editor.isViewOnly()) {
	            count = editor.preview.$el.find('.task-list-item').length;
	        } else if (editor.isMarkdownMode()) {
	            found = editor.mdEditor.getValue().match(FIND_TASK_RX);
	            count = found ? found.length : 0;
	        } else {
	            count = editor.wwEditor.get$Body().find('.task-list-item').length;
	        }

	        return count;
	    };

	    editor.getCheckedTaskCount = function () {
	        var found = void 0,
	            count = void 0;

	        if (editor.isViewOnly()) {
	            count = editor.preview.$el.find('.task-list-item.checked').length;
	        } else if (editor.isMarkdownMode()) {
	            found = editor.mdEditor.getValue().match(FIND_CHECKED_TASK_RX);
	            count = found ? found.length : 0;
	        } else {
	            count = editor.wwEditor.get$Body().find('.task-list-item.checked').length;
	        }

	        return count;
	    };
	});

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extManager = __webpack_require__(26);

	var _extManager2 = _interopRequireDefault(_extManager);

	var _scrollFollow = __webpack_require__(97);

	var _scrollFollow2 = _interopRequireDefault(_scrollFollow);

	var _scrollFollow3 = __webpack_require__(98);

	var _scrollFollow4 = _interopRequireDefault(_scrollFollow3);

	var _button = __webpack_require__(41);

	var _button2 = _interopRequireDefault(_button);

	var _i18n = __webpack_require__(29);

	var _i18n2 = _interopRequireDefault(_i18n);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_extManager2.default.defineExtension('scrollFollow', function (editor) {
	    var className = 'tui-scrollfollow';
	    var TOOL_TIP = {
	        active: _i18n2.default.get('Auto scroll enabled'),
	        inActive: _i18n2.default.get('Auto scroll disabled')
	    };

	    if (editor.isViewOnly()) {
	        return;
	    }

	    var cm = editor.getCodeMirror();
	    var sectionManager = new _scrollFollow4.default(cm, editor.preview);
	    var scrollSync = new _scrollFollow2.default(sectionManager, cm, editor.preview.$el);

	    var isScrollable = false;
	    var isActive = true;
	    var button = void 0;

	    // UI
	    if (editor.getUI().name === 'default') {
	        // init button
	        button = new _button2.default({
	            className: className,
	            command: 'scrollFollowToggle',
	            tooltip: TOOL_TIP.active,
	            $el: $('<button class="active ' + className + '" type="button"></button>')
	        });

	        editor.getUI().toolbar.addButton(button);

	        changeButtonVisiblityStateIfNeed();
	        // hide scroll follow button in wysiwyg
	        editor.on('changeMode', changeButtonVisiblityStateIfNeed);
	        editor.on('changePreviewStyle', changeButtonVisiblityStateIfNeed);

	        // Commands
	        editor.addCommand('markdown', {
	            name: 'scrollFollowToggle',
	            exec: function exec() {
	                isActive = !isActive;
	                button._onOut();
	                if (isActive) {
	                    button.$el.addClass('active');
	                    button.tooltip = TOOL_TIP.active;
	                } else {
	                    button.$el.removeClass('active');
	                    button.tooltip = TOOL_TIP.inActive;
	                }
	                button._onOver();
	            }
	        });
	    }

	    // Events
	    cm.on('change', function () {
	        isScrollable = false;
	        sectionManager.makeSectionList();
	    });

	    function changeButtonVisiblityStateIfNeed() {
	        if (editor.mdPreviewStyle === 'vertical' && editor.currentMode === 'markdown') {
	            button.$el.show();
	        } else {
	            button.$el.hide();
	        }
	    }

	    editor.on('previewRenderAfter', function () {
	        sectionManager.sectionMatch();
	        scrollSync.syncPreviewScrollTopToMarkdown();
	        isScrollable = true;
	    });

	    editor.eventManager.listen('scroll', function (event) {
	        if (!isActive) {
	            return;
	        }

	        if (isScrollable && editor.preview.isVisible()) {
	            if (event.source === 'markdown' && !scrollSync.isMarkdownScrollEventBlocked) {
	                scrollSync.syncPreviewScrollTopToMarkdown();
	            } else if (event.source === 'preview' && !scrollSync.isPreviewScrollEventBlocked) {
	                scrollSync.syncMarkdownScrollTopToPreview();
	            }
	        } else {
	            scrollSync.saveScrollInfo();
	        }
	    });
	}); /**
	     * @fileoverview Implements Scroll Follow Extension
	     * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	     */

/***/ },
/* 97 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @fileoverview Implements Scroll Follow Extension ScrollSync Module
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var PREVIEW_MARGIN_TOP = 57;
	var SCROLL_TOP_PADDING = 20;
	var SCROLL_BOCKING_RESET_DELAY = 15;

	/**
	 * ScrollSync
	 * manage scroll sync between markdown editor and preview
	 * @exports ScrollSync
	 * @constructor
	 * @class
	 * @param {SectionManager} sectionManager sectionManager
	 * @param {CodeMirror} cm CodeMirror
	 * @param {jQuery} $previewContainerEl preview container
	 */

	var ScrollSync = function () {
	    function ScrollSync(sectionManager, cm, $previewContainerEl) {
	        _classCallCheck(this, ScrollSync);

	        this.sectionManager = sectionManager;
	        this.cm = cm;
	        this.$previewContainerEl = $previewContainerEl;
	        this.$contents = this.$previewContainerEl.find('.tui-editor-contents');
	        this.releaseTimer = null;
	        /**
	         * current timeout id needs animation
	         * @type {number}
	         */
	        this._currentTimeoutId = null;

	        /**
	         * Saved scrollInfo object of CodeMirror
	         * @type {object}
	         */
	        this._savedScrollInfo = null;
	    }

	    /**
	     * _getEditorSectionHeight
	     * Return section height of editor
	     * @param {object} section section be calculated height
	     * @returns {number} height
	     */


	    _createClass(ScrollSync, [{
	        key: '_getEditorSectionHeight',
	        value: function _getEditorSectionHeight(section) {
	            var height = this.cm.heightAtLine(section.end, 'local');
	            height -= this.cm.heightAtLine(section.start > 0 ? section.start - 1 : 0, 'local');

	            return height;
	        }

	        /**
	         * _getLineHeightGapInSection
	         * Return height gap between passed line in passed section
	         * @param {object} section section be calculated
	         * @param {number} line line number
	         * @returns {number} gap
	         */

	    }, {
	        key: '_getEditorLineHeightGapInSection',
	        value: function _getEditorLineHeightGapInSection(section, line) {
	            var gap = this.cm.heightAtLine(line, 'local');
	            gap -= this.cm.heightAtLine(section.start > 0 ? section.start - 1 : 0, 'local');

	            return Math.max(gap, 0);
	        }

	        /**
	         * _getSectionScrollRatio
	         * Return ratio of height between scrollTop line and scrollTop section
	         * @param {object} section section be calculated
	         * @param {number} line line number
	         * @returns {number} ratio
	         */

	    }, {
	        key: '_getEditorSectionScrollRatio',
	        value: function _getEditorSectionScrollRatio(section, line) {
	            var isOneLine = section.end === section.start;
	            var ratio = void 0;

	            if (isOneLine) {
	                ratio = 0;
	            } else {
	                ratio = this._getEditorLineHeightGapInSection(section, line) / this._getEditorSectionHeight(section);
	            }

	            return ratio;
	        }

	        /**
	         * _getScrollFactorsOfEditor
	         * Return Scroll Information of editor for preview scroll sync
	         * @returns {object} scroll factors
	         */

	    }, {
	        key: '_getScrollFactorsOfEditor',
	        value: function _getScrollFactorsOfEditor() {
	            var cm = this.cm;
	            var scrollInfo = cm.getScrollInfo();
	            var topLine = void 0,
	                topSection = void 0,
	                ratio = void 0,
	                factors = void 0;

	            // if codemirror has not visible scrollInfo have incorrect value
	            // so we use saved scroll info for alternative
	            scrollInfo = this._fallbackScrollInfoIfIncorrect(scrollInfo);

	            var isEditorBottom = scrollInfo.height - scrollInfo.top <= scrollInfo.clientHeight;

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
	        }

	        /**
	         * Return Scroll Information of editor for Markdown scroll sync
	         * @returns {object} scroll factors
	         * @private
	         */

	    }, {
	        key: '_getScrollInfoForMarkdown',
	        value: function _getScrollInfoForMarkdown() {
	            var _this = this;

	            var sectionList = this.sectionManager.getSectionList();
	            var factors = void 0;

	            tui.util.forEachArray(sectionList, function (section) {
	                var $div = section.$previewSectionEl;
	                var $preview = $div.parent().parent();
	                var isPreviewBottom = $preview[0].clientHeight - $preview.scrollTop() <= $preview[0].height;
	                var needNext = true;

	                if (isPreviewBottom) {
	                    factors = {
	                        isPreviewBottom: isPreviewBottom
	                    };
	                    needNext = false;
	                } else if (_this._isTopSection($preview, $div)) {
	                    factors = {
	                        section: section,
	                        sectionRatio: _this._getMarkdownEditorScrollRatio($preview, $div)
	                    };
	                    needNext = false;
	                }

	                return needNext;
	            });

	            return factors;
	        }

	        /**
	         * Return ScrollRatio for Markdown scroll value
	         * @param {jQuery} $preview jQuery wrapped preview container
	         * @param {jQuery} $div jQuery wrapped section div element
	         * @returns {number}
	         * @private
	         */

	    }, {
	        key: '_getMarkdownEditorScrollRatio',
	        value: function _getMarkdownEditorScrollRatio($preview, $div) {
	            return ($preview.scrollTop() - $div[0].offsetTop) / $div.height();
	        }

	        /**
	         * _getScrollTopForPreview
	         * Return scrollTop value for preview
	         * @returns {number|undefined} scrollTop value, when something wrong then return undefined
	         */

	    }, {
	        key: '_getScrollTopForPreview',
	        value: function _getScrollTopForPreview() {
	            var scrollTop = void 0;

	            var scrollFactors = this._getScrollFactorsOfEditor();
	            var section = scrollFactors.section;
	            var ratio = scrollFactors.sectionRatio;

	            if (scrollFactors.isEditorBottom) {
	                scrollTop = this.$contents.height();
	            } else if (section.$previewSectionEl) {
	                scrollTop = section.$previewSectionEl[0].offsetTop;
	                scrollTop += section.$previewSectionEl.height() * ratio - SCROLL_TOP_PADDING;
	            }

	            scrollTop = scrollTop && Math.max(scrollTop, 0);

	            return scrollTop;
	        }

	        /**
	         * Return scrollTop value for Markdown editor
	         * @returns {number}
	         * @private
	         */

	    }, {
	        key: '_getScrollTopForMarkdown',
	        value: function _getScrollTopForMarkdown() {
	            var scrollTop = void 0;
	            var scrollFactors = this._getScrollInfoForMarkdown();
	            var ratio = scrollFactors.sectionRatio;

	            if (scrollFactors.isPreviewBottom) {
	                scrollTop = this.cm.getScrollInfo().height;
	            } else if (scrollFactors.section) {
	                var section = scrollFactors.section;
	                var coordsAtStart = this.cm.charCoords({
	                    line: section.start,
	                    char: 0
	                }, 'local');
	                var coordsAtEnd = this.cm.charCoords({
	                    line: section.end,
	                    char: 0
	                }, 'local');

	                scrollTop = coordsAtStart.top;
	                scrollTop += (coordsAtEnd.top - coordsAtStart.top) * ratio;
	            }

	            scrollTop = scrollTop && Math.max(scrollTop, 0);

	            return scrollTop;
	        }

	        /**
	         * syncPreviewScrollTopToMarkdown
	         * sync preview scroll to markdown
	         */

	    }, {
	        key: 'syncPreviewScrollTopToMarkdown',
	        value: function syncPreviewScrollTopToMarkdown() {
	            var _this2 = this;

	            var $previewContainerEl = this.$previewContainerEl;
	            var sourceScrollTop = $previewContainerEl.scrollTop();
	            var targetScrollTop = this._getScrollTopForPreview();

	            this.isPreviewScrollEventBlocked = true;

	            this._animateRun(sourceScrollTop, targetScrollTop, function (deltaScrollTop) {
	                clearTimeout(_this2.releaseTimer);

	                $previewContainerEl.scrollTop(deltaScrollTop);

	                _this2.releaseTimer = setTimeout(function () {
	                    _this2.isPreviewScrollEventBlocked = false;
	                }, SCROLL_BOCKING_RESET_DELAY);
	            });
	        }

	        /**
	         * syncMarkdownScrollTopToPreview
	         * sync markdown scroll to preview
	         */

	    }, {
	        key: 'syncMarkdownScrollTopToPreview',
	        value: function syncMarkdownScrollTopToPreview() {
	            var _this3 = this;

	            var codeMirror = this.cm;
	            var codeMirrorScrollInfo = codeMirror.getScrollInfo();
	            var sourceScrollTop = codeMirrorScrollInfo.top;
	            var targetScrollTop = this._getScrollTopForMarkdown();

	            this.isMarkdownScrollEventBlocked = true;

	            this._animateRun(sourceScrollTop, targetScrollTop, function (deltaScrollTop) {
	                clearTimeout(_this3.releaseTimer);

	                codeMirror.scrollTo(0, deltaScrollTop);

	                _this3.releaseTimer = setTimeout(function () {
	                    _this3.isMarkdownScrollEventBlocked = false;
	                }, SCROLL_BOCKING_RESET_DELAY);
	            });
	        }

	        /**
	         * _animateRun
	         * animate with passed Callback
	         * @param {number} originValue original value
	         * @param {number} targetValue target value
	         * @param {function} stepCB callback function
	         */

	    }, {
	        key: '_animateRun',
	        value: function _animateRun(originValue, targetValue, stepCB) {
	            var valueDiff = targetValue - originValue,
	                startTime = Date.now(),
	                self = this;

	            // if already doing animation
	            if (this._currentTimeoutId) {
	                clearTimeout(this._currentTimeoutId);
	            }

	            /**
	             * Each animation step
	             */
	            function step() {
	                var stepTime = Date.now();
	                var progress = (stepTime - startTime) / 200; // 200 is animation time
	                var deltaValue = void 0;

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
	        }

	        /**
	         * Fallback to saved scrolInfo if incorrect scrollInfo passed
	         * this because incorrect CodeMirror returns scrollInfo if CodeMirror is invisible
	         * @param {object} scrollInfo scrollInfo
	         * @returns {object} scrollInfo
	         * @private
	         */

	    }, {
	        key: '_fallbackScrollInfoIfIncorrect',
	        value: function _fallbackScrollInfoIfIncorrect(scrollInfo) {
	            return scrollInfo.height < 0 && this._savedScrollInfo ? this._savedScrollInfo : scrollInfo;
	        }

	        /**
	         * Save Codemirror's scrollInfo for alternative use
	         * memberOf ScrollSync
	         */

	    }, {
	        key: 'saveScrollInfo',
	        value: function saveScrollInfo() {
	            this._savedScrollInfo = this.cm.getScrollInfo();
	        }

	        /**
	         * Return whether given range is top section of preview contents or not
	         * @param {jQuery} $preview jQuery wrapped preview container
	         * @param {jQuery} $div jQuery wrapped section div element
	         * @returns {boolean}
	         * @private
	         */

	    }, {
	        key: '_isTopSection',
	        value: function _isTopSection($preview, $div) {
	            var previewScrollTop = $preview.scrollTop();
	            var divOffsetTop = $div[0].offsetTop;
	            var divHeight = $div.height();
	            var isSectionBegin = previewScrollTop >= divOffsetTop - PREVIEW_MARGIN_TOP;
	            var isSectionEnd = previewScrollTop > divOffsetTop + divHeight;

	            return isSectionBegin && !isSectionEnd;
	        }
	    }]);

	    return ScrollSync;
	}();

	module.exports = ScrollSync;

/***/ },
/* 98 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @fileoverview Implements Scroll Follow Extension SectionManager Module
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var FIND_HEADER_RX = /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/;
	var FIND_LIST_RX = /^ *(\*|-|\d+\.|[*-] \[[ xX]])\s/;
	var FIND_QUOTE_RX = /^ {0,3}(> ?)+\s/;
	var FIND_IMAGE_RX = /^ {0,3}!\[([^\[\]]*)]\(([^)]*)\)/;
	var FIND_SETEXT_HEADER_RX = /^ *(?:={1,}|-{1,})\s*$/;
	var FIND_CODEBLOCK_END_RX = /^ *(`{3,}|~{3,})[ ]*$/;
	var FIND_CODEBLOCK_START_RX = /^ *(`{3,}|~{3,})[ .]*(\S+)? */;
	var FIND_SPACE = /\s/g;

	/**
	 * SectionManager
	 * manage logical markdown content sections
	 * @exports SectionManager
	 * @constructor
	 * @class
	 * @param {CodeMirror} cm codemirror
	 * @param {Preview} preview preview
	 */

	var SectionManager = function () {
	    function SectionManager(cm, preview) {
	        _classCallCheck(this, SectionManager);

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


	    _createClass(SectionManager, [{
	        key: '_addNewSection',
	        value: function _addNewSection(start, end) {
	            var newSection = this._makeSectionData(start, end);
	            this._sectionList.push(newSection);
	            this._currentSection = newSection;
	        }

	        /**
	         * getSectionList
	         * return section list
	         * @returns {object[]} section object list
	         */

	    }, {
	        key: 'getSectionList',
	        value: function getSectionList() {
	            return this._sectionList;
	        }

	        /**
	         * _makeSectionData
	         * make default section object
	         * @param {number} start initial start line number
	         * @param {number} end initial end line number
	         * @returns {object} section object
	         */

	    }, {
	        key: '_makeSectionData',
	        value: function _makeSectionData(start, end) {
	            return {
	                start: start,
	                end: end,
	                $previewSectionEl: null
	            };
	        }

	        /**
	         * _updateCurrentSectionEnd
	         * update current section's end line number
	         * @param {number} end end value to update
	         */

	    }, {
	        key: '_updateCurrentSectionEnd',
	        value: function _updateCurrentSectionEnd(end) {
	            this._currentSection.end = end;
	        }

	        /**
	         * _eachLineState
	         * iterate codemiror lines, callback function parameter pass line type and line number
	         * @param {function} iteratee callback function
	         */

	    }, {
	        key: '_eachLineState',
	        value: function _eachLineState(iteratee) {
	            var isSection = void 0,
	                i = void 0,
	                lineString = void 0,
	                nextLineString = void 0,
	                prevLineString = void 0,
	                isTrimming = true,
	                onTable = false,
	                onCodeBlock = false,
	                trimCapture = '';
	            var isRightAfterImageSection = false;
	            var isEnsuredSection = false;
	            var codeblockStartLineIndex = void 0;

	            var lineLength = this.cm.getDoc().lineCount();

	            for (i = 0; i < lineLength; i += 1) {
	                isSection = false;
	                lineString = this.cm.getLine(i);
	                nextLineString = this.cm.getLine(i + 1) || '';
	                prevLineString = this.cm.getLine(i - 1) || '';
	                var isCodeBlockEnded = this._isCodeBlockEnd(prevLineString) && codeblockStartLineIndex !== i - 1;

	                if (onTable && (!lineString || !this._isTableCode(lineString))) {
	                    onTable = false;
	                } else if (!onTable && this._isTable(lineString, nextLineString)) {
	                    onTable = true;
	                }

	                if (onCodeBlock && isCodeBlockEnded) {
	                    onCodeBlock = false;
	                }
	                if (!onCodeBlock && this._isCodeBlockStart(lineString)) {
	                    onCodeBlock = this._doFollowedLinesHaveCodeBlockEnd(i, lineLength);
	                    codeblockStartLineIndex = i;
	                }

	                if (isEnsuredSection && lineString.length !== 0) {
	                    if (this._isIndependentImage(onCodeBlock, onTable, lineString, prevLineString)) {
	                        isRightAfterImageSection = true;
	                        isEnsuredSection = true;
	                    } else {
	                        isRightAfterImageSection = false;
	                        isEnsuredSection = false;
	                    }

	                    isSection = true;
	                } else if (this._isAtxHeader(lineString)) {
	                    isRightAfterImageSection = false;
	                    isSection = true;
	                    isEnsuredSection = false;
	                    // setext header
	                } else if (!this._isCodeBlockEnd(lineString) && !onTable && this._isSeTextHeader(lineString, nextLineString)) {
	                    isRightAfterImageSection = false;
	                    isSection = true;
	                    isEnsuredSection = false;
	                } else if (this._isIndependentImage(onCodeBlock, onTable, lineString, prevLineString)) {
	                    isRightAfterImageSection = true;
	                    isSection = true;
	                    isEnsuredSection = false;
	                } else if (isRightAfterImageSection && lineString.length === 0) {
	                    isRightAfterImageSection = false;
	                    isEnsuredSection = true;
	                }

	                // 빈공간으로 시작되다다가 헤더를 만난경우 섹션은 두개가 생성되는데
	                // 프리뷰에서는 빈공간이 트리밍되어 섹션 한개 밖에 생성되지 않아 매칭이 되지 않는 문제 해결
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
	        }

	        /**
	         * Return whether is independent image line with padding lines top and bottom
	         * @param {boolean} onCodeBlock Is on codeblock
	         * @param {boolean} onTable Is on table
	         * @param {string} lineString Current line string
	         * @param {string} prevLineString Previous line string
	         * @returns {boolean}
	         * @private
	         */

	    }, {
	        key: '_isIndependentImage',
	        value: function _isIndependentImage(onCodeBlock, onTable, lineString, prevLineString) {
	            return !onCodeBlock && !onTable && this._isImage(lineString) && !this._isList(lineString) && !this._isQuote(lineString) && prevLineString.length === 0;
	        }

	        /**
	         * _doFollowedLinesHaveCodeBlockEnd
	         * Check if follow lines have codeblock end
	         * @param {number} lineIndex current index
	         * @param {number} lineLength line length
	         * @returns {boolean} result
	         */

	    }, {
	        key: '_doFollowedLinesHaveCodeBlockEnd',
	        value: function _doFollowedLinesHaveCodeBlockEnd(lineIndex, lineLength) {
	            var doLineHaveCodeBlockEnd = false;

	            for (var i = lineIndex + 1; i < lineLength; i += 1) {
	                if (this._isCodeBlockEnd(this.cm.getLine(i))) {
	                    doLineHaveCodeBlockEnd = true;
	                    break;
	                }
	            }

	            return doLineHaveCodeBlockEnd;
	        }

	        /**
	         * _isCodeBlockStart
	         * Check if passed string have code block start
	         * @param {string} string string to check
	         * @returns {boolean} result
	         */

	    }, {
	        key: '_isCodeBlockStart',
	        value: function _isCodeBlockStart(string) {
	            return FIND_CODEBLOCK_START_RX.test(string);
	        }

	        /**
	         * _isCodeBlockEnd
	         * Check if passed string have code block end
	         * @param {string} string string to check
	         * @returns {boolean} result
	         */

	    }, {
	        key: '_isCodeBlockEnd',
	        value: function _isCodeBlockEnd(string) {
	            return FIND_CODEBLOCK_END_RX.test(string);
	        }

	        /**
	         * _isTable
	         * Check if passed string have table
	         * @param {string} lineString current line string
	         * @param {string} nextLineString next line string
	         * @returns {boolean} result
	         */

	    }, {
	        key: '_isTable',
	        value: function _isTable(lineString, nextLineString) {
	            return this._isTableCode(lineString) && this._isTableAligner(nextLineString);
	        }

	        /**
	         * _isTableCode
	         * Check if passed string have table code
	         * @param {string} string string to check
	         * @returns {boolean} result
	         */

	    }, {
	        key: '_isTableCode',
	        value: function _isTableCode(string) {
	            return (/(^\S?.*\|.*)/.test(string)
	            );
	        }

	        /**
	         * _isTableAligner
	         * Check if passed string have table align code
	         * @param {string} string string to check
	         * @returns {boolean} result
	         */

	    }, {
	        key: '_isTableAligner',
	        value: function _isTableAligner(string) {
	            return (/(\s*[-:]+\s*\|)+/.test(string)
	            );
	        }

	        /**
	         * _isAtxHeader
	         * Check if passed string have atx header
	         * @param {string} string string to check
	         * @returns {boolean} result
	         */

	    }, {
	        key: '_isAtxHeader',
	        value: function _isAtxHeader(string) {
	            return FIND_HEADER_RX.test(string);
	        }

	        /**
	         * _isSeTextHeader
	         * @param {string} lineString current line string
	         * @param {string} nextLineString next line string
	         * @returns {boolean} result
	         */

	    }, {
	        key: '_isSeTextHeader',
	        value: function _isSeTextHeader(lineString, nextLineString) {
	            return lineString.replace(FIND_SPACE, '') !== '' && nextLineString && FIND_SETEXT_HEADER_RX.test(nextLineString);
	        }
	    }, {
	        key: '_isImage',
	        value: function _isImage(lineString) {
	            return FIND_IMAGE_RX.test(lineString);
	        }
	    }, {
	        key: '_isList',
	        value: function _isList(lineString) {
	            return FIND_LIST_RX.test(lineString);
	        }
	    }, {
	        key: '_isQuote',
	        value: function _isQuote(lineString) {
	            return FIND_QUOTE_RX.test(lineString);
	        }

	        /**
	         * makeSectionList
	         * make section list
	         */

	    }, {
	        key: 'makeSectionList',
	        value: function makeSectionList() {
	            var _this = this;

	            this._sectionList = [];

	            this._eachLineState(function (isSection, lineNumber) {
	                if (isSection || !_this._sectionList.length) {
	                    _this._addNewSection(lineNumber, lineNumber);
	                } else {
	                    _this._updateCurrentSectionEnd(lineNumber);
	                }
	            });
	        }

	        /**
	         * sectionMatch
	         * make preview sections then match section list with preview section element
	         */

	    }, {
	        key: 'sectionMatch',
	        value: function sectionMatch() {
	            if (this._sectionList) {
	                var sections = this._getPreviewSections();
	                this._matchPreviewSectionsWithSectionlist(sections);
	            }
	        }

	        /**
	         * _matchPreviewSectionsWithSectionlist
	         * match section list with preview section element
	         * @param {HTMLNode[]} sections section nodes
	         */

	    }, {
	        key: '_matchPreviewSectionsWithSectionlist',
	        value: function _matchPreviewSectionsWithSectionlist(sections) {
	            var _this2 = this;

	            sections.forEach(function (childs, index) {
	                if (_this2._sectionList[index]) {
	                    var $sectionDiv = $('<div class=\'content-id-' + index + '\'></div>');
	                    _this2._sectionList[index].$previewSectionEl = $(childs).wrapAll($sectionDiv).parent();
	                }
	            });
	        }

	        /**
	         * _getPreviewSections
	         * get preview html section group to make section
	         * @returns {array[]} element node array
	         */

	    }, {
	        key: '_getPreviewSections',
	        value: function _getPreviewSections() {
	            var sections = [];
	            var lastSection = 0;
	            var isRightAfterImageSection = false;

	            sections[0] = [];

	            this.$previewContent.contents().filter(findElementNodeFilter).each(function (index, el) {
	                var isParagraph = el.tagName === 'P';
	                var isHeading = el.tagName.match(/^(H1|H2|H3|H4|H5|H6)$/);
	                var isImage = isParagraph && el.childNodes[0].nodeName === 'IMG';

	                if ((isHeading || isImage || isRightAfterImageSection) && sections[lastSection].length) {
	                    sections.push([]);
	                    lastSection += 1;
	                    isRightAfterImageSection = false;
	                }

	                if (isImage) {
	                    isRightAfterImageSection = true;
	                }

	                sections[lastSection].push(el);
	            });

	            return sections;
	        }

	        /**
	         * _sectionByLine
	         * get section by markdown line
	         * @param {number} line markdown editor line number
	         * @returns {object} section
	         */

	    }, {
	        key: 'sectionByLine',
	        value: function sectionByLine(line) {
	            var sectionIndex = void 0;
	            var sectionList = this._sectionList;
	            var sectionLength = sectionList.length;

	            for (sectionIndex = 0; sectionIndex < sectionLength; sectionIndex += 1) {
	                if (line <= sectionList[sectionIndex].end) {
	                    break;
	                }
	            }

	            if (sectionIndex === sectionLength) {
	                sectionIndex = sectionLength - 1;
	            }

	            return sectionList[sectionIndex];
	        }
	    }]);

	    return SectionManager;
	}();

	/**
	 * findElementNodeFilter
	 * @this Node
	 * @returns {boolean} true or not
	 */


	function findElementNodeFilter() {
	    return this.nodeType === Node.ELEMENT_NODE;
	}

	module.exports = SectionManager;

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extManager = __webpack_require__(26);

	var _extManager2 = _interopRequireDefault(_extManager);

	var _i18n = __webpack_require__(29);

	var _i18n2 = _interopRequireDefault(_i18n);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @fileoverview Implements Color syntax Extension
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var colorSyntaxRx = /\{color:(.+?)}(.*?)\{color}/g;
	var colorHtmlRx = /<span (?:class="colour" )?style="color:(.+?)"(?: class="colour")?>(.*?)/g;
	var colorHtmlCompleteRx = /<span (?:class="colour" )?style="color:(.+?)"(?: class="colour")?>(.*?)<\/span>/g;
	var decimalColorRx = /rgb\((\d+)[, ]+(\d+)[, ]+(\d+)\)/g;

	var RESET_COLOR = '#181818';

	_extManager2.default.defineExtension('colorSyntax', function (editor) {
	    var useCustomSyntax = false;
	    var preset = void 0;

	    if (editor.options.colorSyntax) {
	        useCustomSyntax = !!editor.options.colorSyntax.useCustomSyntax;
	        preset = editor.options.colorSyntax.preset;
	    }

	    editor.eventManager.listen('convertorAfterMarkdownToHtmlConverted', function (html) {
	        var replacement = void 0;

	        if (!useCustomSyntax) {
	            replacement = html;
	        } else {
	            replacement = html.replace(colorSyntaxRx, function (matched, p1, p2) {
	                return makeHTMLColorSyntax(p2, p1);
	            });
	        }

	        return replacement;
	    });

	    editor.eventManager.listen('convertorAfterHtmlToMarkdownConverted', function (markdown) {
	        var findRx = useCustomSyntax ? colorHtmlCompleteRx : colorHtmlRx;

	        return markdown.replace(findRx, function (founded, color, text) {
	            var replacement = void 0;

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
	            exec: function exec(mde, color) {
	                var cm = mde.getEditor();

	                if (!color) {
	                    return;
	                }

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
	            exec: function exec(wwe, color) {
	                var sq = wwe.getEditor();

	                if (!color) {
	                    return;
	                }

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

	        initUI(editor, preset);
	    }
	});

	/**
	 * Initialize UI
	 * @param {object} editor Editor instance
	 * @param {Array.<string>} preset Preset for color palette
	 */
	function initUI(editor, preset) {
	    var className = 'tui-color';

	    editor.eventManager.addEventType('colorButtonClicked');

	    editor.getUI().toolbar.addButton({
	        className: className,
	        event: 'colorButtonClicked',
	        tooltip: _i18n2.default.get('Text color')
	    }, 2);
	    var $button = editor.getUI().toolbar.$el.find('button.' + className);

	    var $colorPickerContainer = $('<div />');

	    var $buttonBar = $('<button type="button" class="te-apply-button">입력</button>');

	    var cpOptions = {
	        container: $colorPickerContainer[0]
	    };

	    if (preset) {
	        cpOptions.preset = preset;
	    }

	    var colorPicker = tui.component.colorpicker.create(cpOptions);

	    var selectedColor = colorPicker.getColor();

	    $colorPickerContainer.append($buttonBar);

	    var popup = editor.getUI().createPopup({
	        title: false,
	        content: $colorPickerContainer,
	        className: 'tui-popup-color',
	        $target: editor.getUI().$el,
	        css: {
	            'width': 'auto',
	            'position': 'absolute'
	        }
	    });

	    editor.eventManager.listen('focus', function () {
	        popup.hide();
	    });

	    editor.eventManager.listen('colorButtonClicked', function () {
	        editor.eventManager.emit('closeAllPopup');
	        if (popup.isShow()) {
	            popup.hide();
	        } else {
	            popup.$el.css({
	                'top': $button.position().top + $button.height() + 5,
	                'left': $button.position().left
	            });
	            popup.show();
	            colorPicker.slider.toggle(true);
	        }
	    });

	    editor.eventManager.listen('closeAllPopup', function () {
	        popup.hide();
	    });

	    editor.eventManager.listen('removeEditor', function () {
	        colorPicker.off('selectColor');
	    });

	    colorPicker.on('selectColor', function (e) {
	        selectedColor = e.color;

	        if (e.origin === 'palette') {
	            editor.exec('color', selectedColor);
	            popup.hide();
	        }
	    });

	    popup.$el.find('.te-apply-button').on('click', function () {
	        editor.exec('color', selectedColor);
	    });
	}

	/**
	 * Make custom color syntax
	 * @param {string} text Text content
	 * @param {string} color Color value
	 * @returns {string}
	 */
	function makeCustomColorSyntax(text, color) {
	    return '{color:' + color + '}' + text + '{color}';
	}

	/**
	 * Make HTML color syntax by given text content and color value
	 * @param {string} text Text content
	 * @param {string} color Color value
	 * @returns {string}
	 */
	function makeHTMLColorSyntax(text, color) {
	    return '<span style="color:' + color + '">' + text + '</span>';
	}

	/**
	 * Change decimal color value to hexadecimal color value
	 * @param {string} color Color value string
	 * @returns {string}
	 */
	function changeDecColorToHex(color) {
	    return color.replace(decimalColorRx, function (colorValue, r, g, b) {
	        r = parseInt(r, 10);
	        g = parseInt(g, 10);
	        b = parseInt(b, 10);

	        var colorHexValue = get2DigitNumberString(r.toString(16)) + get2DigitNumberString(g.toString(16)) + get2DigitNumberString(b.toString(16));

	        return '#' + colorHexValue;
	    });
	}

	/**
	 * Get binary number string
	 * @param {string} numberStr String to convert binary number
	 * @returns {string}
	 */
	function get2DigitNumberString(numberStr) {
	    return numberStr === '0' ? '00' : numberStr;
	}

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _extManager = __webpack_require__(26);

	var _extManager2 = _interopRequireDefault(_extManager);

	var _markerList = __webpack_require__(101);

	var _markerList2 = _interopRequireDefault(_markerList);

	var _markerManager = __webpack_require__(102);

	var _markerManager2 = _interopRequireDefault(_markerManager);

	var _wysiwygMarkerHelper = __webpack_require__(104);

	var _wysiwygMarkerHelper2 = _interopRequireDefault(_wysiwygMarkerHelper);

	var _viewOnlyMarkerHelper = __webpack_require__(105);

	var _viewOnlyMarkerHelper2 = _interopRequireDefault(_viewOnlyMarkerHelper);

	var _markdownMarkerHelper = __webpack_require__(106);

	var _markdownMarkerHelper2 = _interopRequireDefault(_markdownMarkerHelper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @fileoverview Implements mark extension for making text marker
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var util = tui.util;

	var MARKER_UPDATE_DELAY = 100;
	var FIND_CRLF_RX = /(\n)|(\r\n)|(\r)/g;

	/**
	 * Mark Extension
	 * Define marker extension
	 */
	_extManager2.default.defineExtension('mark', function (editor) {
	    var ml = new _markerList2.default();
	    var mm = new _markerManager2.default(ml);
	    var wmh = void 0,
	        mmh = void 0,
	        vmh = void 0;

	    editor.eventManager.addEventType('markerUpdated');

	    if (editor.isViewOnly()) {
	        vmh = new _viewOnlyMarkerHelper2.default(editor.preview);
	    } else {
	        wmh = new _wysiwygMarkerHelper2.default(editor.getSquire());
	        mmh = new _markdownMarkerHelper2.default(editor.getCodeMirror());
	    }

	    /**
	     * getHelper
	     * Get helper for current situation
	     * @returns {object} helper
	     */
	    function getHelper() {
	        var helper = void 0;

	        if (editor.isViewOnly()) {
	            helper = vmh;
	        } else if (editor.isWysiwygMode()) {
	            helper = wmh;
	        } else {
	            helper = mmh;
	        }

	        return helper;
	    }

	    /**
	     * Update mark when resizing
	     */
	    function updateMarkWhenResizing() {
	        var helper = getHelper();

	        ml.getAll().forEach(function (marker) {
	            helper.updateMarkerWithExtraInfo(marker);
	        });

	        editor.eventManager.emit('markerUpdated', ml.getAll());
	    }

	    // We need to update marker after window have been resized
	    $(window).on('resize', updateMarkWhenResizing);

	    editor.on('removeEditor', function () {
	        $(window).off('resize', updateMarkWhenResizing);
	    });

	    // Reset marker content after set value
	    editor.on('setValueAfter', function () {
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
	    editor.setValueWithMarkers = function (value, markerDataCollection) {
	        var helper = void 0;

	        ml.resetMarkers();

	        markerDataCollection.forEach(function (markerData) {
	            ml.addMarker(markerData.start, markerData.end, markerData.id);
	        });

	        editor.setValue(value);

	        mm.resetContent(value.replace(FIND_CRLF_RX, ''));

	        if (editor.isViewOnly() || editor.isWysiwygMode()) {
	            helper = getHelper();
	            mm.updateMarkersByContent(helper.getTextContent());
	        } else {
	            helper = mmh;
	        }

	        ml.getAll().forEach(function (marker) {
	            helper.updateMarkerWithExtraInfo(marker);
	        });

	        editor.eventManager.emit('markerUpdated', ml.getAll());

	        return ml.getAll();
	    };

	    /**
	     * getMarker
	     * Get markers that have given id
	     * @param {string} id id of marker
	     * @returns {object}
	     */
	    editor.getMarker = function (id) {
	        return ml.getMarker(id);
	    };

	    /**
	     * getMarkersAll
	     * Get all markers
	     * @returns {Array.<object>}
	     */
	    editor.getMarkersAll = function () {
	        return ml.getAll();
	    };

	    /**
	     * removeMarker
	     * Remove marker with given id
	     * @param {string} id of marker that should be removed
	     * @returns {marker} removed marker
	     */
	    editor.removeMarker = function (id) {
	        return ml.removeMarker(id);
	    };

	    /**
	     * getMarkersData
	     * Get marker data to export so you can restore markers next time
	     * @returns {object} markers data
	     */
	    editor.exportMarkers = function () {
	        var markersData = void 0;

	        if (editor.isMarkdownMode()) {
	            markersData = ml.getMarkersData();
	        } else if (editor.isViewOnly() || editor.isWysiwygMode()) {
	            mm.updateMarkersByContent(editor.getValue().replace(FIND_CRLF_RX, ''));
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
	    editor.selectMarker = function (id) {
	        var helper = getHelper();
	        var marker = editor.getMarker(id);

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
	    editor.addMarker = function (start, end, id) {
	        var marker = void 0;
	        var helper = getHelper();

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
	            editor.eventManager.emit('markerUpdated', [marker]);
	        }

	        return marker;
	    };

	    /**
	     * clearSelect
	     * Clear selection
	     */
	    editor.clearSelect = function () {
	        getHelper().clearSelect();
	    };

	    if (!editor.isViewOnly()) {
	        editor.on('changeMode', function () {
	            editor._updateMarkers();
	        });

	        editor.on('change', util.debounce(function () {
	            editor._updateMarkers();
	        }, MARKER_UPDATE_DELAY));

	        /**
	         * _updateMarkers
	         * Update markers with current text content
	         */
	        editor._updateMarkers = function () {
	            var helper = getHelper();

	            if (!ml.getAll().length) {
	                return;
	            }

	            mm.updateMarkersByContent(helper.getTextContent());

	            ml.getAll().forEach(function (marker) {
	                helper.updateMarkerWithExtraInfo(marker);
	            });

	            editor.eventManager.emit('markerUpdated', ml.getAll());
	        };
	    }
	});

/***/ },
/* 101 */
/***/ function(module, exports) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @fileoverview Implements markdown marker helper for additional information
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var util = tui.util;

	/**
	 * Markerlist
	 * @exports Markerlist
	 * @constructor
	 * @class
	 */

	var Markerlist = function () {
	    function Markerlist() {
	        _classCallCheck(this, Markerlist);

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


	    _createClass(Markerlist, [{
	        key: "addMarker",
	        value: function addMarker(start, end, id) {
	            var marker = void 0;

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
	        }

	        /**
	         * getMarker
	         * Get marker with given id
	         * @param {string} id id of marker
	         * @returns {object} marker
	         */

	    }, {
	        key: "getMarker",
	        value: function getMarker(id) {
	            return this._markersWithId[id];
	        }

	        /**
	         * removeMarker
	         * Remove marker with given id
	         * @param {string} id of marker that should be removed
	         * @returns {marker} removed marker
	         */

	    }, {
	        key: "removeMarker",
	        value: function removeMarker(id) {
	            var removedMarker = this._markersWithId[id];
	            delete this._markersWithId[id];

	            var index = this._sortedMarkers.indexOf(removedMarker);
	            this._sortedMarkers.splice(index, 1);

	            return removedMarker;
	        }

	        /**
	         * updateMarker
	         * Update marker with extra information
	         * @param {string} id id of marker
	         * @param {object} obj extra information
	         * @returns {object} marker
	         */

	    }, {
	        key: "updateMarker",
	        value: function updateMarker(id, obj) {
	            var marker = this.getMarker(id);

	            return util.extend(marker, obj);
	        }

	        /**
	         * forEachByRangeAffected
	         * Iterate markers affected by given range
	         * @param {number} start start offset
	         * @param {end} end end offset
	         * @param {function} iteratee iteratee
	         */

	    }, {
	        key: "forEachByRangeAffected",
	        value: function forEachByRangeAffected(start, end, iteratee) {
	            var rangeMarkers = this._getMarkersByRangeAffected(start, end);

	            rangeMarkers.forEach(iteratee);
	        }

	        /**
	         * _getMarkersByRangeAffected
	         * Get markers affected by given range
	         * @param {number} start start offset
	         * @param {end} end end offset
	         * @returns {Array.<object>} markers
	         */

	    }, {
	        key: "_getMarkersByRangeAffected",
	        value: function _getMarkersByRangeAffected(start, end) {
	            var rangeMarkers = this._sortedMarkers.filter(function (marker) {
	                if (marker.end > end || marker.end > start) {
	                    return true;
	                }

	                return false;
	            });

	            return rangeMarkers;
	        }

	        /**
	         * getAll
	         * Get markers all
	         * @returns {Array.<object>} markers
	         */

	    }, {
	        key: "getAll",
	        value: function getAll() {
	            return this._sortedMarkers;
	        }

	        /**
	         * resetMarkers
	         * Reset markerlist
	         */

	    }, {
	        key: "resetMarkers",
	        value: function resetMarkers() {
	            this._sortedMarkers = [];
	            this._markersWithId = {};
	        }

	        /**
	         * sortBy
	         * Sort markers with given key of marker
	         * @param {string} rangeKey, start or end
	         */

	    }, {
	        key: "sortBy",
	        value: function sortBy(rangeKey) {
	            this._sortedMarkers.sort(function (a, b) {
	                return a[rangeKey] - b[rangeKey];
	            });
	        }

	        /**
	         * getMarkersData
	         * Get marker data to export
	         * @returns {object} markers data
	         */

	    }, {
	        key: "getMarkersData",
	        value: function getMarkersData() {
	            return this.getAll().map(function (marker) {
	                return {
	                    start: marker.start,
	                    end: marker.end,
	                    id: marker.id
	                };
	            });
	        }
	    }]);

	    return Markerlist;
	}();

	module.exports = Markerlist;

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @fileoverview Implements markdown marker helper for additional information
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var DiffMatchPatch = __webpack_require__(103);

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

	var MarkerManager = function () {
	    function MarkerManager(markerList) {
	        _classCallCheck(this, MarkerManager);

	        this._dmp = new DiffMatchPatch();
	        this.markerList = markerList;
	        this.oldTextContent = null;
	    }

	    /**
	     * resetContent
	     * Reset content
	     * @param {string} content reset base content
	     */


	    _createClass(MarkerManager, [{
	        key: 'resetContent',
	        value: function resetContent(content) {
	            this.oldTextContent = util.isString(content) ? content : null;
	        }

	        /**
	         * uppdateMarkersByContent
	         * Get updated markers by updated content
	         * @param {string} newContent updated content
	         * @returns {object} updated markers
	         */

	    }, {
	        key: 'updateMarkersByContent',
	        value: function updateMarkersByContent(newContent) {
	            if (util.isNull(this.oldTextContent)) {
	                this.resetContent(newContent);

	                return [];
	            }

	            var markerDiffs = this._makeMarkerDiffs(newContent);

	            this.oldTextContent = newContent;

	            return this._getUpdateMarkersWithDiffs(markerDiffs);
	        }

	        /**
	         * _makeMarkerDiffs
	         * Make diffs of marker by updated content
	         * @param {string} newContent updated content
	         * @returns {object} marker diffs
	         */

	    }, {
	        key: '_makeMarkerDiffs',
	        value: function _makeMarkerDiffs(newContent) {
	            var markerList = this.markerList,
	                self = this,
	                markerDiffs = {};

	            this._forEachChanges(newContent, function (changedStart, changedEnd, diffLen) {
	                markerList.forEachByRangeAffected(changedStart, changedEnd, function (marker) {
	                    var markerDiff = markerDiffs[marker.id];

	                    var startDiff = self._calculateStartDiff(changedStart, changedEnd, diffLen, marker);
	                    var endDiff = self._calculateEndDiff(changedStart, changedEnd, diffLen, marker);

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
	        }

	        /**
	         * _forEachChanges
	         * Iterate each change of updated content
	         * @param {string} newContent updated content
	         * @param {function} iteratee iteratee
	         */

	    }, {
	        key: '_forEachChanges',
	        value: function _forEachChanges(newContent, iteratee) {
	            var changedStart = 0;
	            var changedEnd = 0;
	            var changes = this._dmp.diff_main(this.oldTextContent, newContent);

	            changes.forEach(function (change) {
	                var type = change[0];
	                var text = change[1];
	                var diffLen = 0;

	                var changedLen = text.length;

	                // 이전 변경점 end를 이번 변경점 start로 만들어 위치를 조정한다.
	                changedStart = changedEnd;

	                if (type === CHANGE_NOTHING) {
	                    changedStart += changedLen;
	                    changedEnd += changedLen;

	                    return;
	                }

	                if (type === CHANGE_ADD) {
	                    diffLen += changedLen; // 더해진경우는 End값이 변경될 필요가없다 변경전의 위치는 start와 end가 collapse일수밖에 없다.. 일반적인 컨트롤상황에서는
	                } else if (type === CHANGE_MINUS) {
	                    diffLen -= changedLen;
	                    changedEnd += changedLen; // 빠지면 빠지기전까지의 범위가 end가 되어야한다.
	                }

	                iteratee(changedStart, changedEnd, diffLen);
	            });
	        }

	        /**
	         * _calculateStartDiff
	         * Calculate start diff
	         * @param {number} start change start offset
	         * @param {number} end change end offset
	         * @param {number} diff diff count of change
	         * @param {object} marker marker to calculate diff
	         * @returns {number} start diff of marker
	         */

	    }, {
	        key: '_calculateStartDiff',
	        value: function _calculateStartDiff(start, end, diff, marker) {
	            var startDiff = void 0;

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
	        }

	        /**
	         * _calculateEndDiff
	         * Calculate end diff
	         * @param {number} start change start offset
	         * @param {number} end change end offset
	         * @param {number} diff diff count of change
	         * @param {object} marker marker to calculate diff
	         * @returns {number} end diff of marker
	         */

	    }, {
	        key: '_calculateEndDiff',
	        value: function _calculateEndDiff(start, end, diff, marker) {
	            var endDiff = void 0;

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
	        }

	        /**
	         * _getUpdateMarkersWithDiffs
	         * Get updated markers with diffs
	         * @param {object} markerDiffs marker diff object that contains diff info of specific marker
	         * @returns {Array.<object>} updated markers
	         */

	    }, {
	        key: '_getUpdateMarkersWithDiffs',
	        value: function _getUpdateMarkersWithDiffs(markerDiffs) {
	            var updatedMarkers = [],
	                markerList = this.markerList;

	            util.forEachOwnProperties(markerDiffs, function (markerDiff, id) {
	                var marker = markerList.getMarker(id);

	                markerList.updateMarker(id, {
	                    start: marker.start += markerDiff.start,
	                    end: marker.end += markerDiff.end
	                });

	                updatedMarkers.push(marker);
	            });

	            return updatedMarkers;
	        }
	    }]);

	    return MarkerManager;
	}();

	module.exports = MarkerManager;

/***/ },
/* 103 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
	diff_match_patch.prototype.diff_main = function (text1, text2, opt_checklines, opt_deadline) {
	  // Set a deadline by which time the diff must be complete.
	  if (typeof opt_deadline == 'undefined') {
	    if (this.Diff_Timeout <= 0) {
	      opt_deadline = Number.MAX_VALUE;
	    } else {
	      opt_deadline = new Date().getTime() + this.Diff_Timeout * 1000;
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
	diff_match_patch.prototype.diff_compute_ = function (text1, text2, checklines, deadline) {
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
	    diffs = [[DIFF_INSERT, longtext.substring(0, i)], [DIFF_EQUAL, shorttext], [DIFF_INSERT, longtext.substring(i + shorttext.length)]];
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
	diff_match_patch.prototype.diff_lineMode_ = function (text1, text2, deadline) {
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
	          diffs.splice(pointer - count_delete - count_insert, count_delete + count_insert);
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
	  diffs.pop(); // Remove the dummy entry at the end.

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
	diff_match_patch.prototype.diff_bisect_ = function (text1, text2, deadline) {
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
	  var front = delta % 2 != 0;
	  // Offsets for start and end of k loop.
	  // Prevents mapping of space beyond the grid.
	  var k1start = 0;
	  var k1end = 0;
	  var k2start = 0;
	  var k2end = 0;
	  for (var d = 0; d < max_d; d++) {
	    // Bail out if deadline is reached.
	    if (new Date().getTime() > deadline) {
	      break;
	    }

	    // Walk the front path one step.
	    for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
	      var k1_offset = v_offset + k1;
	      var x1;
	      if (k1 == -d || k1 != d && v1[k1_offset - 1] < v1[k1_offset + 1]) {
	        x1 = v1[k1_offset + 1];
	      } else {
	        x1 = v1[k1_offset - 1] + 1;
	      }
	      var y1 = x1 - k1;
	      while (x1 < text1_length && y1 < text2_length && text1.charAt(x1) == text2.charAt(y1)) {
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
	      if (k2 == -d || k2 != d && v2[k2_offset - 1] < v2[k2_offset + 1]) {
	        x2 = v2[k2_offset + 1];
	      } else {
	        x2 = v2[k2_offset - 1] + 1;
	      }
	      var y2 = x2 - k2;
	      while (x2 < text1_length && y2 < text2_length && text1.charAt(text1_length - x2 - 1) == text2.charAt(text2_length - y2 - 1)) {
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
	diff_match_patch.prototype.diff_bisectSplit_ = function (text1, text2, x, y, deadline) {
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
	diff_match_patch.prototype.diff_linesToChars_ = function (text1, text2) {
	  var lineArray = []; // e.g. lineArray[4] == 'Hello\n'
	  var lineHash = {}; // e.g. lineHash['Hello\n'] == 4

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

	      if (lineHash.hasOwnProperty ? lineHash.hasOwnProperty(line) : lineHash[line] !== undefined) {
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
	  return { chars1: chars1, chars2: chars2, lineArray: lineArray };
	};

	/**
	 * Rehydrate the text in a diff from a string of line hashes to real lines of
	 * text.
	 * @param {!Array.<!diff_match_patch.Diff>} diffs Array of diff tuples.
	 * @param {!Array.<string>} lineArray Array of unique strings.
	 * @private
	 */
	diff_match_patch.prototype.diff_charsToLines_ = function (diffs, lineArray) {
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
	diff_match_patch.prototype.diff_commonPrefix = function (text1, text2) {
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
	    if (text1.substring(pointerstart, pointermid) == text2.substring(pointerstart, pointermid)) {
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
	diff_match_patch.prototype.diff_commonSuffix = function (text1, text2) {
	  // Quick check for common null cases.
	  if (!text1 || !text2 || text1.charAt(text1.length - 1) != text2.charAt(text2.length - 1)) {
	    return 0;
	  }
	  // Binary search.
	  // Performance analysis: http://neil.fraser.name/news/2007/10/09/
	  var pointermin = 0;
	  var pointermax = Math.min(text1.length, text2.length);
	  var pointermid = pointermax;
	  var pointerend = 0;
	  while (pointermin < pointermid) {
	    if (text1.substring(text1.length - pointermid, text1.length - pointerend) == text2.substring(text2.length - pointermid, text2.length - pointerend)) {
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
	diff_match_patch.prototype.diff_commonOverlap_ = function (text1, text2) {
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
	    if (found == 0 || text1.substring(text_length - length) == text2.substring(0, length)) {
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
	diff_match_patch.prototype.diff_halfMatch_ = function (text1, text2) {
	  if (this.Diff_Timeout <= 0) {
	    // Don't risk returning a non-optimal diff if we have unlimited time.
	    return null;
	  }
	  var longtext = text1.length > text2.length ? text1 : text2;
	  var shorttext = text1.length > text2.length ? text2 : text1;
	  if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
	    return null; // Pointless.
	  }
	  var dmp = this; // 'this' becomes 'window' in a closure.

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
	      var prefixLength = dmp.diff_commonPrefix(longtext.substring(i), shorttext.substring(j));
	      var suffixLength = dmp.diff_commonSuffix(longtext.substring(0, i), shorttext.substring(0, j));
	      if (best_common.length < suffixLength + prefixLength) {
	        best_common = shorttext.substring(j - suffixLength, j) + shorttext.substring(j, j + prefixLength);
	        best_longtext_a = longtext.substring(0, i - suffixLength);
	        best_longtext_b = longtext.substring(i + prefixLength);
	        best_shorttext_a = shorttext.substring(0, j - suffixLength);
	        best_shorttext_b = shorttext.substring(j + prefixLength);
	      }
	    }
	    if (best_common.length * 2 >= longtext.length) {
	      return [best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b, best_common];
	    } else {
	      return null;
	    }
	  }

	  // First check if the second quarter is the seed for a half-match.
	  var hm1 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 4));
	  // Check again based on the third quarter.
	  var hm2 = diff_halfMatchI_(longtext, shorttext, Math.ceil(longtext.length / 2));
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
	diff_match_patch.prototype.diff_cleanupSemantic = function (diffs) {
	  var changes = false;
	  var equalities = []; // Stack of indices where equalities are found.
	  var equalitiesLength = 0; // Keeping our own length var is faster in JS.
	  /** @type {?string} */
	  var lastequality = null;
	  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
	  var pointer = 0; // Index of current position.
	  // Number of characters that changed prior to the equality.
	  var length_insertions1 = 0;
	  var length_deletions1 = 0;
	  // Number of characters that changed after the equality.
	  var length_insertions2 = 0;
	  var length_deletions2 = 0;
	  while (pointer < diffs.length) {
	    if (diffs[pointer][0] == DIFF_EQUAL) {
	      // Equality found.
	      equalities[equalitiesLength++] = pointer;
	      length_insertions1 = length_insertions2;
	      length_deletions1 = length_deletions2;
	      length_insertions2 = 0;
	      length_deletions2 = 0;
	      lastequality = diffs[pointer][1];
	    } else {
	      // An insertion or deletion.
	      if (diffs[pointer][0] == DIFF_INSERT) {
	        length_insertions2 += diffs[pointer][1].length;
	      } else {
	        length_deletions2 += diffs[pointer][1].length;
	      }
	      // Eliminate an equality that is smaller or equal to the edits on both
	      // sides of it.
	      if (lastequality && lastequality.length <= Math.max(length_insertions1, length_deletions1) && lastequality.length <= Math.max(length_insertions2, length_deletions2)) {
	        // Duplicate record.
	        diffs.splice(equalities[equalitiesLength - 1], 0, [DIFF_DELETE, lastequality]);
	        // Change second copy to insert.
	        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
	        // Throw away the equality we just deleted.
	        equalitiesLength--;
	        // Throw away the previous equality (it needs to be reevaluated).
	        equalitiesLength--;
	        pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
	        length_insertions1 = 0; // Reset the counters.
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
	    if (diffs[pointer - 1][0] == DIFF_DELETE && diffs[pointer][0] == DIFF_INSERT) {
	      var deletion = diffs[pointer - 1][1];
	      var insertion = diffs[pointer][1];
	      var overlap_length1 = this.diff_commonOverlap_(deletion, insertion);
	      var overlap_length2 = this.diff_commonOverlap_(insertion, deletion);
	      if (overlap_length1 >= overlap_length2) {
	        if (overlap_length1 >= deletion.length / 2 || overlap_length1 >= insertion.length / 2) {
	          // Overlap found.  Insert an equality and trim the surrounding edits.
	          diffs.splice(pointer, 0, [DIFF_EQUAL, insertion.substring(0, overlap_length1)]);
	          diffs[pointer - 1][1] = deletion.substring(0, deletion.length - overlap_length1);
	          diffs[pointer + 1][1] = insertion.substring(overlap_length1);
	          pointer++;
	        }
	      } else {
	        if (overlap_length2 >= deletion.length / 2 || overlap_length2 >= insertion.length / 2) {
	          // Reverse overlap found.
	          // Insert an equality and swap and trim the surrounding edits.
	          diffs.splice(pointer, 0, [DIFF_EQUAL, deletion.substring(0, overlap_length2)]);
	          diffs[pointer - 1][0] = DIFF_INSERT;
	          diffs[pointer - 1][1] = insertion.substring(0, insertion.length - overlap_length2);
	          diffs[pointer + 1][0] = DIFF_DELETE;
	          diffs[pointer + 1][1] = deletion.substring(overlap_length2);
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
	diff_match_patch.prototype.diff_cleanupSemanticLossless = function (diffs) {
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
	    var whitespace1 = nonAlphaNumeric1 && char1.match(diff_match_patch.whitespaceRegex_);
	    var whitespace2 = nonAlphaNumeric2 && char2.match(diff_match_patch.whitespaceRegex_);
	    var lineBreak1 = whitespace1 && char1.match(diff_match_patch.linebreakRegex_);
	    var lineBreak2 = whitespace2 && char2.match(diff_match_patch.linebreakRegex_);
	    var blankLine1 = lineBreak1 && one.match(diff_match_patch.blanklineEndRegex_);
	    var blankLine2 = lineBreak2 && two.match(diff_match_patch.blanklineStartRegex_);

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
	    if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
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
	      var bestScore = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
	      while (edit.charAt(0) === equality2.charAt(0)) {
	        equality1 += edit.charAt(0);
	        edit = edit.substring(1) + equality2.charAt(0);
	        equality2 = equality2.substring(1);
	        var score = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
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
	diff_match_patch.prototype.diff_cleanupEfficiency = function (diffs) {
	  var changes = false;
	  var equalities = []; // Stack of indices where equalities are found.
	  var equalitiesLength = 0; // Keeping our own length var is faster in JS.
	  /** @type {?string} */
	  var lastequality = null;
	  // Always equal to diffs[equalities[equalitiesLength - 1]][1]
	  var pointer = 0; // Index of current position.
	  // Is there an insertion operation before the last equality.
	  var pre_ins = false;
	  // Is there a deletion operation before the last equality.
	  var pre_del = false;
	  // Is there an insertion operation after the last equality.
	  var post_ins = false;
	  // Is there a deletion operation after the last equality.
	  var post_del = false;
	  while (pointer < diffs.length) {
	    if (diffs[pointer][0] == DIFF_EQUAL) {
	      // Equality found.
	      if (diffs[pointer][1].length < this.Diff_EditCost && (post_ins || post_del)) {
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
	    } else {
	      // An insertion or deletion.
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
	      if (lastequality && (pre_ins && pre_del && post_ins && post_del || lastequality.length < this.Diff_EditCost / 2 && pre_ins + pre_del + post_ins + post_del == 3)) {
	        // Duplicate record.
	        diffs.splice(equalities[equalitiesLength - 1], 0, [DIFF_DELETE, lastequality]);
	        // Change second copy to insert.
	        diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
	        equalitiesLength--; // Throw away the equality we just deleted;
	        lastequality = null;
	        if (pre_ins && pre_del) {
	          // No changes made which could affect previous entry, keep going.
	          post_ins = post_del = true;
	          equalitiesLength = 0;
	        } else {
	          equalitiesLength--; // Throw away the previous equality.
	          pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
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
	diff_match_patch.prototype.diff_cleanupMerge = function (diffs) {
	  diffs.push([DIFF_EQUAL, '']); // Add a dummy entry at the end.
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
	              if (pointer - count_delete - count_insert > 0 && diffs[pointer - count_delete - count_insert - 1][0] == DIFF_EQUAL) {
	                diffs[pointer - count_delete - count_insert - 1][1] += text_insert.substring(0, commonlength);
	              } else {
	                diffs.splice(0, 0, [DIFF_EQUAL, text_insert.substring(0, commonlength)]);
	                pointer++;
	              }
	              text_insert = text_insert.substring(commonlength);
	              text_delete = text_delete.substring(commonlength);
	            }
	            // Factor out any common suffixies.
	            commonlength = this.diff_commonSuffix(text_insert, text_delete);
	            if (commonlength !== 0) {
	              diffs[pointer][1] = text_insert.substring(text_insert.length - commonlength) + diffs[pointer][1];
	              text_insert = text_insert.substring(0, text_insert.length - commonlength);
	              text_delete = text_delete.substring(0, text_delete.length - commonlength);
	            }
	          }
	          // Delete the offending records and add the merged ones.
	          if (count_delete === 0) {
	            diffs.splice(pointer - count_insert, count_delete + count_insert, [DIFF_INSERT, text_insert]);
	          } else if (count_insert === 0) {
	            diffs.splice(pointer - count_delete, count_delete + count_insert, [DIFF_DELETE, text_delete]);
	          } else {
	            diffs.splice(pointer - count_delete - count_insert, count_delete + count_insert, [DIFF_DELETE, text_delete], [DIFF_INSERT, text_insert]);
	          }
	          pointer = pointer - count_delete - count_insert + (count_delete ? 1 : 0) + (count_insert ? 1 : 0) + 1;
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
	    diffs.pop(); // Remove the dummy entry at the end.
	  }

	  // Second pass: look for single edits surrounded on both sides by equalities
	  // which can be shifted sideways to eliminate an equality.
	  // e.g: A<ins>BA</ins>C -> <ins>AB</ins>AC
	  var changes = false;
	  pointer = 1;
	  // Intentionally ignore the first and last element (don't need checking).
	  while (pointer < diffs.length - 1) {
	    if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
	      // This is a single edit surrounded by equalities.
	      if (diffs[pointer][1].substring(diffs[pointer][1].length - diffs[pointer - 1][1].length) == diffs[pointer - 1][1]) {
	        // Shift the edit over the previous equality.
	        diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(0, diffs[pointer][1].length - diffs[pointer - 1][1].length);
	        diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
	        diffs.splice(pointer - 1, 1);
	        changes = true;
	      } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) == diffs[pointer + 1][1]) {
	        // Shift the edit over the next equality.
	        diffs[pointer - 1][1] += diffs[pointer + 1][1];
	        diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
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
	diff_match_patch.prototype.diff_xIndex = function (diffs, loc) {
	  var chars1 = 0;
	  var chars2 = 0;
	  var last_chars1 = 0;
	  var last_chars2 = 0;
	  var x;
	  for (x = 0; x < diffs.length; x++) {
	    if (diffs[x][0] !== DIFF_INSERT) {
	      // Equality or deletion.
	      chars1 += diffs[x][1].length;
	    }
	    if (diffs[x][0] !== DIFF_DELETE) {
	      // Equality or insertion.
	      chars2 += diffs[x][1].length;
	    }
	    if (chars1 > loc) {
	      // Overshot the location.
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
	diff_match_patch.prototype.diff_prettyHtml = function (diffs) {
	  var html = [];
	  var pattern_amp = /&/g;
	  var pattern_lt = /</g;
	  var pattern_gt = />/g;
	  var pattern_para = /\n/g;
	  for (var x = 0; x < diffs.length; x++) {
	    var op = diffs[x][0]; // Operation (insert, delete, equal)
	    var data = diffs[x][1]; // Text of change.
	    var text = data.replace(pattern_amp, '&amp;').replace(pattern_lt, '&lt;').replace(pattern_gt, '&gt;').replace(pattern_para, '&para;<br>');
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
	diff_match_patch.prototype.diff_text1 = function (diffs) {
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
	diff_match_patch.prototype.diff_text2 = function (diffs) {
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
	diff_match_patch.prototype.diff_levenshtein = function (diffs) {
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
	diff_match_patch.prototype.diff_toDelta = function (diffs) {
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
	diff_match_patch.prototype.diff_fromDelta = function (text1, delta) {
	  var diffs = [];
	  var diffsLength = 0; // Keeping our own length var is faster in JS.
	  var pointer = 0; // Cursor in text1
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
	          throw new Error('Invalid diff operation in diff_fromDelta: ' + tokens[x]);
	        }
	    }
	  }
	  if (pointer != text1.length) {
	    throw new Error('Delta length (' + pointer + ') does not equal source text length (' + text1.length + ').');
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
	diff_match_patch.prototype.match_main = function (text, pattern, loc) {
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
	diff_match_patch.prototype.match_bitap_ = function (text, pattern, loc) {
	  if (pattern.length > this.Match_MaxBits) {
	    throw new Error('Pattern too long for this browser.');
	  }

	  // Initialise the alphabet.
	  var s = this.match_alphabet_(pattern);

	  var dmp = this; // 'this' becomes 'window' in a closure.

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
	    return accuracy + proximity / dmp.Match_Distance;
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
	      score_threshold = Math.min(match_bitapScore_(0, best_loc), score_threshold);
	    }
	  }

	  // Initialise the bit arrays.
	  var matchmask = 1 << pattern.length - 1;
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
	      if (d === 0) {
	        // First pass: exact match.
	        rd[j] = (rd[j + 1] << 1 | 1) & charMatch;
	      } else {
	        // Subsequent passes: fuzzy match.
	        rd[j] = (rd[j + 1] << 1 | 1) & charMatch | ((last_rd[j + 1] | last_rd[j]) << 1 | 1) | last_rd[j + 1];
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
	diff_match_patch.prototype.match_alphabet_ = function (pattern) {
	  var s = {};
	  for (var i = 0; i < pattern.length; i++) {
	    s[pattern.charAt(i)] = 0;
	  }
	  for (var i = 0; i < pattern.length; i++) {
	    s[pattern.charAt(i)] |= 1 << pattern.length - i - 1;
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
	diff_match_patch.prototype.patch_addContext_ = function (patch, text) {
	  if (text.length == 0) {
	    return;
	  }
	  var pattern = text.substring(patch.start2, patch.start2 + patch.length1);
	  var padding = 0;

	  // Look for the first and last matches of pattern in text.  If two different
	  // matches are found, increase the pattern length.
	  while (text.indexOf(pattern) != text.lastIndexOf(pattern) && pattern.length < this.Match_MaxBits - this.Patch_Margin - this.Patch_Margin) {
	    padding += this.Patch_Margin;
	    pattern = text.substring(patch.start2 - padding, patch.start2 + patch.length1 + padding);
	  }
	  // Add one chunk for good luck.
	  padding += this.Patch_Margin;

	  // Add the prefix.
	  var prefix = text.substring(patch.start2 - padding, patch.start2);
	  if (prefix) {
	    patch.diffs.unshift([DIFF_EQUAL, prefix]);
	  }
	  // Add the suffix.
	  var suffix = text.substring(patch.start2 + patch.length1, patch.start2 + patch.length1 + padding);
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
	diff_match_patch.prototype.patch_make = function (a, opt_b, opt_c) {
	  var text1, diffs;
	  if (typeof a == 'string' && typeof opt_b == 'string' && typeof opt_c == 'undefined') {
	    // Method 1: text1, text2
	    // Compute diffs from text1 and text2.
	    text1 = /** @type {string} */a;
	    diffs = this.diff_main(text1, /** @type {string} */opt_b, true);
	    if (diffs.length > 2) {
	      this.diff_cleanupSemantic(diffs);
	      this.diff_cleanupEfficiency(diffs);
	    }
	  } else if (a && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && typeof opt_b == 'undefined' && typeof opt_c == 'undefined') {
	    // Method 2: diffs
	    // Compute text1 from diffs.
	    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */a;
	    text1 = this.diff_text1(diffs);
	  } else if (typeof a == 'string' && opt_b && (typeof opt_b === 'undefined' ? 'undefined' : _typeof(opt_b)) == 'object' && typeof opt_c == 'undefined') {
	    // Method 3: text1, diffs
	    text1 = /** @type {string} */a;
	    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */opt_b;
	  } else if (typeof a == 'string' && typeof opt_b == 'string' && opt_c && (typeof opt_c === 'undefined' ? 'undefined' : _typeof(opt_c)) == 'object') {
	    // Method 4: text1, text2, diffs
	    // text2 is not used.
	    text1 = /** @type {string} */a;
	    diffs = /** @type {!Array.<!diff_match_patch.Diff>} */opt_c;
	  } else {
	    throw new Error('Unknown call format to patch_make.');
	  }

	  if (diffs.length === 0) {
	    return []; // Get rid of the null case.
	  }
	  var patches = [];
	  var patch = new diff_match_patch.patch_obj();
	  var patchDiffLength = 0; // Keeping our own length var is faster in JS.
	  var char_count1 = 0; // Number of characters into the text1 string.
	  var char_count2 = 0; // Number of characters into the text2 string.
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
	        postpatch_text = postpatch_text.substring(0, char_count2) + diff_text + postpatch_text.substring(char_count2);
	        break;
	      case DIFF_DELETE:
	        patch.length1 += diff_text.length;
	        patch.diffs[patchDiffLength++] = diffs[x];
	        postpatch_text = postpatch_text.substring(0, char_count2) + postpatch_text.substring(char_count2 + diff_text.length);
	        break;
	      case DIFF_EQUAL:
	        if (diff_text.length <= 2 * this.Patch_Margin && patchDiffLength && diffs.length != x + 1) {
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
	diff_match_patch.prototype.patch_deepCopy = function (patches) {
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
	diff_match_patch.prototype.patch_apply = function (patches, text) {
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
	      start_loc = this.match_main(text, text1.substring(0, this.Match_MaxBits), expected_loc);
	      if (start_loc != -1) {
	        end_loc = this.match_main(text, text1.substring(text1.length - this.Match_MaxBits), expected_loc + text1.length - this.Match_MaxBits);
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
	        text = text.substring(0, start_loc) + this.diff_text2(patches[x].diffs) + text.substring(start_loc + text1.length);
	      } else {
	        // Imperfect match.  Run a diff to get a framework of equivalent
	        // indices.
	        var diffs = this.diff_main(text1, text2, false);
	        if (text1.length > this.Match_MaxBits && this.diff_levenshtein(diffs) / text1.length > this.Patch_DeleteThreshold) {
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
	            if (mod[0] === DIFF_INSERT) {
	              // Insertion
	              text = text.substring(0, start_loc + index2) + mod[1] + text.substring(start_loc + index2);
	            } else if (mod[0] === DIFF_DELETE) {
	              // Deletion
	              text = text.substring(0, start_loc + index2) + text.substring(start_loc + this.diff_xIndex(diffs, index1 + mod[1].length));
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
	diff_match_patch.prototype.patch_addPadding = function (patches) {
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
	    patch.start1 -= paddingLength; // Should be 0.
	    patch.start2 -= paddingLength; // Should be 0.
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
	diff_match_patch.prototype.patch_splitMax = function (patches) {
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
	      while (bigpatch.diffs.length !== 0 && patch.length1 < patch_size - this.Patch_Margin) {
	        var diff_type = bigpatch.diffs[0][0];
	        var diff_text = bigpatch.diffs[0][1];
	        if (diff_type === DIFF_INSERT) {
	          // Insertions are harmless.
	          patch.length2 += diff_text.length;
	          start2 += diff_text.length;
	          patch.diffs.push(bigpatch.diffs.shift());
	          empty = false;
	        } else if (diff_type === DIFF_DELETE && patch.diffs.length == 1 && patch.diffs[0][0] == DIFF_EQUAL && diff_text.length > 2 * patch_size) {
	          // This is a large deletion.  Let it pass in one chunk.
	          patch.length1 += diff_text.length;
	          start1 += diff_text.length;
	          empty = false;
	          patch.diffs.push([diff_type, diff_text]);
	          bigpatch.diffs.shift();
	        } else {
	          // Deletion or equality.  Only take as much as we can stomach.
	          diff_text = diff_text.substring(0, patch_size - patch.length1 - this.Patch_Margin);
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
	            bigpatch.diffs[0][1] = bigpatch.diffs[0][1].substring(diff_text.length);
	          }
	        }
	      }
	      // Compute the head context for the next patch.
	      precontext = this.diff_text2(patch.diffs);
	      precontext = precontext.substring(precontext.length - this.Patch_Margin);
	      // Append the end context for this patch.
	      var postcontext = this.diff_text1(bigpatch.diffs).substring(0, this.Patch_Margin);
	      if (postcontext !== '') {
	        patch.length1 += postcontext.length;
	        patch.length2 += postcontext.length;
	        if (patch.diffs.length !== 0 && patch.diffs[patch.diffs.length - 1][0] === DIFF_EQUAL) {
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
	diff_match_patch.prototype.patch_toText = function (patches) {
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
	diff_match_patch.prototype.patch_fromText = function (textline) {
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
	diff_match_patch.patch_obj = function () {
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
	diff_match_patch.patch_obj.prototype.toString = function () {
	  var coords1, coords2;
	  if (this.length1 === 0) {
	    coords1 = this.start1 + ',0';
	  } else if (this.length1 == 1) {
	    coords1 = this.start1 + 1;
	  } else {
	    coords1 = this.start1 + 1 + ',' + this.length1;
	  }
	  if (this.length2 === 0) {
	    coords2 = this.start2 + ',0';
	  } else if (this.length2 == 1) {
	    coords2 = this.start2 + 1;
	  } else {
	    coords2 = this.start2 + 1 + ',' + this.length2;
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
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @fileoverview Implements wysiwyg marker helper for additional information
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var domUtils = __webpack_require__(8);

	var FIND_ZWB_RX = /\u200B/g;

	/**
	 * WysiwygMarkerHelper
	 * @exports WysiwygMarkerHelper
	 * @constructor
	 * @class
	 * @param {SquireExt} sqe squire instance
	 */

	var WysiwygMarkerHelper = function () {
	    function WysiwygMarkerHelper(sqe) {
	        _classCallCheck(this, WysiwygMarkerHelper);

	        this.sqe = sqe;
	    }

	    /**
	     * getTextContent
	     * Get text content of wysiwyg
	     * @returns {string}
	     */


	    _createClass(WysiwygMarkerHelper, [{
	        key: 'getTextContent',
	        value: function getTextContent() {
	            return this.sqe.get$Body()[0].textContent.replace(FIND_ZWB_RX, '');
	        }

	        /**
	         * updateMarkerWithExtraInfo
	         * Update marker with extra info of CodeMirror
	         * @param {object} marker marker
	         * @returns {object} marker
	         */

	    }, {
	        key: 'updateMarkerWithExtraInfo',
	        value: function updateMarkerWithExtraInfo(marker) {
	            var foundNode = this._findOffsetNode([marker.start, marker.end]);

	            var markerRange = this.sqe.getSelection().cloneRange();
	            markerRange.setStart(foundNode[0].container, foundNode[0].offsetInContainer);
	            markerRange.setEnd(foundNode[1].container, foundNode[1].offsetInContainer);

	            var info = this._getExtraInfoOfRange(markerRange);

	            marker.text = info.text;
	            marker.top = info.top;
	            marker.left = info.left;
	            marker.height = info.height;

	            return marker;
	        }

	        /**
	         * _getExtraInfoOfRange
	         * Get extra info of range
	         * @param {Range} range range
	         * @returns {object} extra info
	         */

	    }, {
	        key: '_getExtraInfoOfRange',
	        value: function _getExtraInfoOfRange(range) {
	            var top = void 0,
	                left = void 0,
	                rect = void 0,
	                height = void 0,
	                node = void 0,
	                parentNode = void 0,
	                containerOffset = void 0;
	            var endContainer = range.endContainer;
	            var endOffset = range.endOffset;

	            var text = range.cloneContents().textContent.replace(FIND_ZWB_RX, '');

	            if (domUtils.getChildNodeByOffset(endContainer, endOffset)) {
	                range.setStart(endContainer, endOffset);
	                range.collapse(true);

	                rect = range.getBoundingClientRect();
	            }

	            if (rect && !rect.top) {
	                this.sqe.modifyDocument(function () {
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
	        }

	        /**
	         * getMarkerInfoOfCurrentSelection
	         * Get marker info of current selection
	         * @returns {object} marker
	         */

	    }, {
	        key: 'getMarkerInfoOfCurrentSelection',
	        value: function getMarkerInfoOfCurrentSelection() {
	            var beforeRange = void 0,
	                start = void 0,
	                end = void 0,
	                info = void 0;

	            var range = this.sqe.getSelection().cloneRange();

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
	        }

	        /**
	         * _extendRangeToTextNodeIfHasNone
	         * Extend range to text node if start or end container have none
	         * Containers of range should be text node
	         * @param {Range} range range
	         * @returns {boolean} success or fail
	         */

	    }, {
	        key: '_extendRangeToTextNodeIfHasNone',
	        value: function _extendRangeToTextNodeIfHasNone(range) {
	            var endNode = domUtils.getChildNodeByOffset(range.endContainer, range.endOffset);
	            var textNode = void 0;

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
	        }

	        /**
	         * _findOffsetNode
	         * Find offset nodes by given offset list
	         * @param {Array.<number>} offsetlist offset list
	         * @returns {Array.<object>} offset node informations
	         */

	    }, {
	        key: '_findOffsetNode',
	        value: function _findOffsetNode(offsetlist) {
	            return domUtils.findOffsetNode(this.sqe.get$Body()[0], offsetlist, function (text) {
	                return text.replace(FIND_ZWB_RX, '');
	            });
	        }

	        /**
	         * selectOffsetRange
	         * Make selection with given offset range
	         * @param {number} start start offset
	         * @param {number} end end offset
	         */

	    }, {
	        key: 'selectOffsetRange',
	        value: function selectOffsetRange(start, end) {
	            var foundNode = this._findOffsetNode([start, end]),
	                range = this.sqe.getSelection().cloneRange();

	            range.setStart(foundNode[0].container, foundNode[0].offsetInContainer);
	            range.setEnd(foundNode[1].container, foundNode[1].offsetInContainer);

	            this.sqe.setSelection(range);
	        }

	        /**
	         * clearSelect
	         * Clear selection of squire
	         */

	    }, {
	        key: 'clearSelect',
	        value: function clearSelect() {
	            var range = this.sqe.getSelection().cloneRange();
	            range.collapse(true);
	            this.sqe.setSelection(range);
	        }
	    }]);

	    return WysiwygMarkerHelper;
	}();

	module.exports = WysiwygMarkerHelper;

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @fileoverview Implements viewOnly marker helper for additional information
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

	var domUtils = __webpack_require__(8);

	var FIND_CRLF_RX = /(\n)|(\r\n)|(\r)/g;

	/**
	 * ViewOnlyMarkerHelper
	 * @exports ViewOnlyMarkerHelper
	 * @constructor
	 * @class
	 * @param {Preview} preview preview instance
	 */

	var ViewOnlyMarkerHelper = function () {
	    function ViewOnlyMarkerHelper(preview) {
	        _classCallCheck(this, ViewOnlyMarkerHelper);

	        this.preview = preview;
	    }

	    /**
	     * getTextContent
	     * Get text content of wysiwyg
	     * @returns {string}
	     */


	    _createClass(ViewOnlyMarkerHelper, [{
	        key: 'getTextContent',
	        value: function getTextContent() {
	            return this.preview.$el[0].textContent.replace(FIND_CRLF_RX, '');
	        }

	        /**
	         * updateMarkerWithExtraInfo
	         * Update marker with extra info of preview
	         * @param {object} marker marker
	         * @returns {object} marker
	         */

	    }, {
	        key: 'updateMarkerWithExtraInfo',
	        value: function updateMarkerWithExtraInfo(marker) {
	            var foundNode = this._findOffsetNode([marker.start, marker.end]);

	            var markerRange = document.createRange();

	            markerRange.setStart(foundNode[0].container, foundNode[0].offsetInContainer);
	            markerRange.setEnd(foundNode[1].container, foundNode[1].offsetInContainer);

	            var info = this._getExtraInfoOfRange(markerRange);

	            marker.text = info.text;
	            marker.top = info.top;
	            marker.left = info.left;
	            marker.height = info.height;

	            return marker;
	        }

	        /**
	         * _getExtraInfoOfRange
	         * Get extra info of range
	         * @param {Range} range range
	         * @returns {object} extra info
	         */

	    }, {
	        key: '_getExtraInfoOfRange',
	        value: function _getExtraInfoOfRange(range) {
	            var top = void 0,
	                left = void 0,
	                rect = void 0,
	                containerOffset = void 0,
	                height = void 0,
	                node = void 0,
	                parentNode = void 0;

	            var text = range.cloneContents().textContent.replace(FIND_CRLF_RX, '');

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
	        }

	        /**
	         * getMarkerInfoOfCurrentSelection
	         * Get marker info of current selection
	         * @returns {object} marker
	         */

	    }, {
	        key: 'getMarkerInfoOfCurrentSelection',
	        value: function getMarkerInfoOfCurrentSelection() {
	            var beforeRange = void 0,
	                start = void 0,
	                end = void 0,
	                info = void 0;

	            var range = getRange();

	            var isRangeInContent = $.contains(this.preview.$el[0], range.commonAncestorContainer);

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
	        }

	        /**
	         * _extendRangeToTextNodeIfHasNone
	         * Extend range to text node if start or end container have none
	         * Containers of range should be text node
	         * @param {Range} range range
	         * @returns {boolean} success or fail
	         */

	    }, {
	        key: '_extendRangeToTextNodeIfHasNone',
	        value: function _extendRangeToTextNodeIfHasNone(range) {
	            var endNode = domUtils.getChildNodeByOffset(range.endContainer, range.endOffset);
	            var textNode = void 0;

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
	        }

	        /**
	         * _findOffsetNode
	         * Find offset nodes by given offset list
	         * @param {Array.<number>} offsetlist offset list
	         * @returns {Array.<object>} offset node informations
	         */

	    }, {
	        key: '_findOffsetNode',
	        value: function _findOffsetNode(offsetlist) {
	            return domUtils.findOffsetNode(this.preview.$el[0], offsetlist, function (text) {
	                return text.replace(FIND_CRLF_RX, '');
	            });
	        }

	        /**
	         * selectOffsetRange
	         * Make selection with given offset range
	         * @param {number} start start offset
	         * @param {number} end end offset
	         */

	    }, {
	        key: 'selectOffsetRange',
	        value: function selectOffsetRange(start, end) {
	            var foundNode = this._findOffsetNode([start, end]),
	                range = document.createRange(),
	                sel = window.getSelection();

	            range.setStart(foundNode[0].container, foundNode[0].offsetInContainer);
	            range.setEnd(foundNode[1].container, foundNode[1].offsetInContainer);

	            sel.removeAllRanges();
	            sel.addRange(range);
	        }

	        /**
	         * clearSelect
	         * Clear selection
	         */

	    }, {
	        key: 'clearSelect',
	        value: function clearSelect() {
	            window.getSelection().removeAllRanges();
	        }
	    }]);

	    return ViewOnlyMarkerHelper;
	}();

	/**
	 * getRange
	 * get current range
	 * @returns {Range}
	 */


	function getRange() {
	    var selection = window.getSelection();
	    var range = void 0;

	    if (selection && selection.rangeCount) {
	        range = selection.getRangeAt(0).cloneRange();
	    } else {
	        range = document.createRange();
	        range.selectNodeContents(this.preview.$el[0]);
	        range.collapse(true);
	    }

	    return range;
	}

	module.exports = ViewOnlyMarkerHelper;

/***/ },
/* 106 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @fileoverview Implements markdown marker helper for additional information
	 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
	 */

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

	var MarkdownMarkerHelper = function () {
	    function MarkdownMarkerHelper(cm) {
	        _classCallCheck(this, MarkdownMarkerHelper);

	        this.cm = cm;
	    }

	    /**
	     * getTextContent
	     * Get CRLF removed text content of CodeMirror
	     * @returns {string} text content
	     */


	    _createClass(MarkdownMarkerHelper, [{
	        key: 'getTextContent',
	        value: function getTextContent() {
	            return this.cm.getValue().replace(FIND_CRLF_RX, '');
	        }

	        /**
	         * updateMarkerWithExtraInfo
	         * Update marker with extra info of CodeMirror
	         * @param {object} marker marker
	         * @returns {object} marker
	         */

	    }, {
	        key: 'updateMarkerWithExtraInfo',
	        value: function updateMarkerWithExtraInfo(marker) {
	            var foundCursor = this._findOffsetCursor([marker.start, marker.end]);

	            var startLine = foundCursor[0].line;
	            var startCh = foundCursor[0].ch;
	            var endLine = foundCursor[1].line;
	            var endCh = foundCursor[1].ch;

	            var info = this._getExtraInfoOfRange(startLine, startCh, endLine, endCh);

	            marker.text = info.text.replace(FIND_CRLF_RX, ' ');
	            marker.top = info.top;
	            marker.left = info.left;
	            marker.height = info.height;

	            return marker;
	        }

	        /**
	         * _getExtraInfoOfRange
	         *  Get additional info of range
	         * @param {number} startLine start line
	         * @param {number} startCh start offset
	         * @param {number} endLine end line
	         * @param {number} endCh end offset
	         * @returns {object} information
	         */

	    }, {
	        key: '_getExtraInfoOfRange',
	        value: function _getExtraInfoOfRange(startLine, startCh, endLine, endCh) {
	            var text = void 0,
	                rect = void 0,
	                top = void 0,
	                left = void 0,
	                height = void 0;
	            var doc = this.cm.getDoc();

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
	        }

	        /**
	         * getMarkerInfoOfCurrentSelection
	         * Get marker info of current selection
	         * @returns {object} marker
	         */

	    }, {
	        key: 'getMarkerInfoOfCurrentSelection',
	        value: function getMarkerInfoOfCurrentSelection() {
	            var doc = this.cm.getDoc();

	            var selection = this._getSelection();

	            var start = doc.getRange({
	                line: 0,
	                ch: 0
	            }, selection.anchor).replace(FIND_CRLF_RX, '').length;

	            var end = start + doc.getSelection().replace(FIND_CRLF_RX, '').length;

	            var foundCursor = this._findOffsetCursor([start, end]);

	            var info = this._getExtraInfoOfRange(foundCursor[0].line, foundCursor[0].ch, foundCursor[1].line, foundCursor[1].ch);

	            return {
	                start: start,
	                end: end,
	                text: info.text.replace(FIND_CRLF_RX, ' '),
	                top: info.top,
	                left: info.left,
	                height: info.height
	            };
	        }

	        /**
	         * _getSelection
	         * Get selection of CodeMirror, if selection is reversed then correct it
	         * @returns {object} selection
	         */

	    }, {
	        key: '_getSelection',
	        value: function _getSelection() {
	            var selection = this.cm.getDoc().listSelections()[0];
	            var anchor = selection.anchor;
	            var head = selection.head;

	            var isReversedSelection = anchor.line > head.line || anchor.line === head.line && anchor.ch > head.ch;

	            if (isReversedSelection) {
	                var temp = head;
	                head = anchor;
	                anchor = temp;
	            }

	            return {
	                anchor: anchor,
	                head: head
	            };
	        }

	        /**
	         * _findOffsetCursor
	         * Find offset cursor by given offset list
	         * @param {Array.<number>} offsetlist offset list
	         * @returns {Array.<object>} offset cursors
	         */

	    }, {
	        key: '_findOffsetCursor',
	        value: function _findOffsetCursor(offsetlist) {
	            var doc = this.cm.getDoc();
	            var beforeLength = 0;
	            var result = [];
	            var lineLength = doc.lineCount();
	            var offsetIndex = 0;
	            var currentLength = 0;
	            var lineIndex = void 0;

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
	        }

	        /**
	         * selectOffsetRange
	         * Make selection with given offset range
	         * @param {number} start start offset
	         * @param {number} end end offset
	         */

	    }, {
	        key: 'selectOffsetRange',
	        value: function selectOffsetRange(start, end) {
	            var foundCursor = this._findOffsetCursor([start, end]);

	            this.cm.setSelection({
	                line: foundCursor[0].line,
	                ch: foundCursor[0].ch
	            }, {
	                line: foundCursor[1].line,
	                ch: foundCursor[1].ch
	            });
	        }

	        /**
	         * clearSelect
	         * Clear selection of CodeMirror
	         */

	    }, {
	        key: 'clearSelect',
	        value: function clearSelect() {
	            var selection = this.cm.getDoc().listSelections()[0];

	            if (selection) {
	                this.cm.setCursor(selection.to());
	            }
	        }
	    }]);

	    return MarkdownMarkerHelper;
	}();

	module.exports = MarkdownMarkerHelper;

/***/ },
/* 107 */
/***/ function(module, exports) {

	'use strict';

	tui.Editor.i18n.setLang(['en', 'en_US'], {
	    'Markdown': 'Markdown',
	    'WYSIWYG': 'WYSIWYG',
	    'Headings': 'Headings',
	    'Paragraph': 'Paragraph',
	    'Bold': 'Bold',
	    'Italic': 'Italic',
	    'Strike': 'Strike',
	    'Code': 'Code',
	    'Line': 'Line',
	    'Blockquote': 'Blockquote',
	    'Unordered list': 'Unordered list',
	    'Ordered list': 'Ordered list',
	    'Task': 'Task',
	    'Insert link': 'Insert link',
	    'Insert codeblock': 'Insert codeblock',
	    'Insert table': 'Insert table',
	    'Insert image': 'Insert image',
	    'Heading': 'Heading',
	    'Image URL': 'Image URL',
	    'Select image file': 'Select image file',
	    'Description': 'Description',
	    'OK': 'OK',
	    'Cancel': 'Cancel',
	    'File': 'File',
	    'URL': 'URL',
	    'Link text': 'Link text',
	    'Add row': 'Add row',
	    'Add col': 'Add col',
	    'Remove row': 'Remove row',
	    'Remove col': 'Remove col',
	    'Align left': 'Align left',
	    'Align center': 'Align center',
	    'Align right': 'Align right',
	    'Remove table': 'Remove table',
	    'Would you like to paste as table?': 'Would you like to paste as table?',
	    'Text color': 'Text color',
	    'Auto scroll enabled': 'Auto scroll enabled',
	    'Auto scroll disabled': 'Auto scroll disabled'
	});

/***/ },
/* 108 */
/***/ function(module, exports) {

	'use strict';

	tui.Editor.i18n.setLang(['ko', 'ko_KR'], {
	    'Markdown': '마크다운',
	    'WYSIWYG': '위지윅',
	    'Headings': '제목크기',
	    'Paragraph': '본문',
	    'Bold': '굵게',
	    'Italic': '기울임꼴',
	    'Strike': '취소선',
	    'Code': '코드',
	    'Line': '문단나눔',
	    'Blockquote': '인용구',
	    'Unordered list': '글머리 기호',
	    'Ordered list': '번호 매기기',
	    'Task': '체크박스',
	    'Insert link': '링크 삽입',
	    'Insert codeblock': '코드블럭 삽입',
	    'Insert table': '표 삽입',
	    'Insert image': '이미지 삽입',
	    'Heading': '제목',
	    'Image URL': '이미지 주소',
	    'Select image file': '이미지 파일을 선택하세요.',
	    'Description': '설명',
	    'OK': '확인',
	    'Cancel': '취소',
	    'File': '파일',
	    'URL': '주소',
	    'Link text': '링크 텍스트',
	    'Add row': '행 추가',
	    'Add col': '열 추가',
	    'Remove row': '행 삭제',
	    'Remove col': '열 삭제',
	    'Align left': '왼쪽 정렬',
	    'Align center': '가운데 정렬',
	    'Align right': '오른쪽 정렬',
	    'Remove table': '표 삭제',
	    'Would you like to paste as table?': '표형태로 붙여 넣겠습니까?',
	    'Text color': '글자 색상',
	    'Auto scroll enabled': '자동 스크롤 켜짐',
	    'Auto scroll disabled': '자동 스크롤 꺼짐'
	});

/***/ },
/* 109 */
/***/ function(module, exports) {

	'use strict';

	tui.Editor.i18n.setLang(['zh', 'zh_CN'], {
	    'Markdown': 'Markdown',
	    'WYSIWYG': '所见即所得',
	    'Headings': '标题',
	    'Paragraph': '文本',
	    'Bold': '加粗',
	    'Italic': '斜体字',
	    'Strike': '删除线',
	    'Code': '内嵌代码',
	    'Line': '画水平线',
	    'Blockquote': '引用块',
	    'Unordered list': '无序列表',
	    'Ordered list': '有序列表',
	    'Task': '任务',
	    'Insert link': '插入链接',
	    'Insert codeblock': '插入代码块',
	    'Insert table': '插入表格',
	    'Insert image': '插入图片',
	    'Heading': '标题',
	    'Image URL': '图片网址',
	    'Select image file': '选择映像文件',
	    'Description': '说明',
	    'OK': '确认',
	    'Cancel': '取消',
	    'File': '文件',
	    'URL': 'URL',
	    'Link text': '链接文本',
	    'Add row': '添加一行',
	    'Add col': '添加列',
	    'Remove row': '删除行',
	    'Remove col': '删除列',
	    'Align left': '左对齐',
	    'Align center': '居中对齐',
	    'Align right': '右对齐',
	    'Remove table': '删除表',
	    'Would you like to paste as table?': '你想粘贴表吗?',
	    'Text color': '文字色相',
	    'Auto scroll enabled': '自动滚动启用',
	    'Auto scroll disabled': '自动的滚动作非使用'
	});

/***/ },
/* 110 */
/***/ function(module, exports) {

	'use strict';

	tui.Editor.i18n.setLang(['ja', 'ja_JP'], {
	    'Markdown': 'マークダウン',
	    'WYSIWYG': 'WYSIWYG',
	    'Headings': '見出し',
	    'Paragraph': '本文',
	    'Bold': '太字',
	    'Italic': 'イタリック',
	    'Strike': 'ストライク',
	    'Code': 'コード',
	    'Line': 'ライン',
	    'Blockquote': '引用',
	    'Unordered list': '番号なしリスト',
	    'Ordered list': '順序付きリスト',
	    'Task': 'タスク',
	    'Insert link': 'リンク挿入',
	    'Insert codeblock': 'コードブロック挿入',
	    'Insert table': 'テーブル挿入',
	    'Insert image': '画像挿入',
	    'Heading': '見出し',
	    'Image URL': 'イメージURL',
	    'Select image file': '画像ファイル選択',
	    'Description': 'ディスクリプション ',
	    'OK': 'はい',
	    'Cancel': 'キャンセル',
	    'File': 'ファイル',
	    'URL': 'URL',
	    'Link text': 'リンクテキスト',
	    'Add row': '行追加',
	    'Add col': '列追加',
	    'Remove row': '行削除',
	    'Remove col': '列削除',
	    'Align left': '左揃え',
	    'Align center': '中央揃え',
	    'Align right': '右揃え',
	    'Remove table': 'テーブル削除',
	    'Would you like to paste as table?': 'テーブルを貼り付けますか?',
	    'Text color': '文字色相',
	    'Auto scroll enabled': '自動スクロールが有効',
	    'Auto scroll disabled': '自動スクロールを無効に'
	});

/***/ },
/* 111 */
/***/ function(module, exports) {

	'use strict';

	tui.Editor.i18n.setLang(['nl', 'nl_NL'], {
	    'Markdown': 'Markdown',
	    'WYSIWYG': 'WYSIWYG',
	    'Headings': 'Koppen',
	    'Paragraph': 'tekst',
	    'Bold': 'Vet',
	    'Italic': 'Cursief',
	    'Strike': 'Doorhalen',
	    'Code': 'Code',
	    'Line': 'Regel',
	    'Blockquote': 'Citaatblok',
	    'Unordered list': 'Opsomming',
	    'Ordered list': 'Genummerde opsomming',
	    'Task': 'Taak',
	    'Insert link': 'Link invoegen',
	    'Insert codeblock': 'Codeblok toevoegen',
	    'Insert table': 'Tabel invoegen',
	    'Insert image': 'Afbeelding invoegen',
	    'Heading': 'Kop',
	    'Image URL': 'Afbeelding URL',
	    'Select image file': 'Selecteer een afbeelding',
	    'Description': 'Omschrijving',
	    'OK': 'OK',
	    'Cancel': 'Annuleren',
	    'File': 'Bestand',
	    'URL': 'URL',
	    'Link text': 'Link tekst',
	    'Add row': 'Rij toevoegen',
	    'Add col': 'Kolom toevoegen',
	    'Remove row': 'Rij verwijderen',
	    'Remove col': 'Kolom verwijderen',
	    'Align left': 'Links uitlijnen',
	    'Align center': 'Centreren',
	    'Align right': 'Rechts uitlijnen',
	    'Remove table': 'Verwijder tabel',
	    'Would you like to paste as table?': 'Wil je dit als tabel plakken?',
	    'Text color': 'tekst kleur',
	    'Auto scroll enabled': 'Auto scroll enabled',
	    'Auto scroll disabled': 'Auto scroll uitgeschakeld'
	});

/***/ }
/******/ ]);
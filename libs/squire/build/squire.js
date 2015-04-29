!function(e,t){"use strict";function n(e,t,n){this.root=this.currentNode=e,this.nodeType=t,this.filter=n}function r(e,t){for(var n=e.length;n--;)if(!t(e[n]))return!1;return!0}function o(e,t,n){if(e.nodeName!==t)return!1;for(var r in n)if(e.getAttribute(r)!==n[r])return!1;return!0}function i(e,t){return e.nodeType===t.nodeType&&e.nodeName===t.nodeName&&e.className===t.className&&(!e.style&&!t.style||e.style.cssText===t.style.cssText)}function a(e){return e.nodeType===O&&!!tt[e.nodeName]}function s(e){return et.test(e.nodeName)}function d(e){return e.nodeType===O&&!s(e)&&r(e.childNodes,s)}function l(e){return e.nodeType===O&&!s(e)&&!d(e)}function c(e){var t=e.ownerDocument,r=new n(t.body,R,d,!1);return r.currentNode=e,r}function h(e){return c(e).previousNode()}function f(e){return c(e).nextNode()}function u(e,t,n){do if(o(e,t,n))return e;while(e=e.parentNode);return null}function p(e){var t,n,r,o,i=e.parentNode;return i&&e.nodeType===O?(t=p(i),t+=(t?">":"")+e.nodeName,(n=e.id)&&(t+="#"+n),(r=e.className.trim())&&(o=r.split(/\s\s*/),o.sort(),t+=".",t+=o.join("."))):t=i?p(i):"",t}function g(e){var t=e.nodeType;return t===O?e.childNodes.length:e.length||0}function m(e){var t=e.parentNode;return t&&t.removeChild(e),e}function v(e,t){var n=e.parentNode;n&&n.replaceChild(t,e)}function N(e){for(var t=e.ownerDocument.createDocumentFragment(),n=e.childNodes,r=n?n.length:0;r--;)t.appendChild(e.firstChild);return t}function C(e,n,r,o){var i,a,s,d,l=e.createElement(n);if(r instanceof Array&&(o=r,r=null),r)for(i in r)a=r[i],a!==t&&l.setAttribute(i,r[i]);if(o)for(s=0,d=o.length;d>s;s+=1)l.appendChild(o[s]);return l}function _(e){var t,n,r,o=e.ownerDocument,i=e;if("BODY"===e.nodeName&&((n=e.firstChild)&&"BR"!==n.nodeName||(r=k(o),t=r?r.createDefaultBlock():C(o,"DIV"),n?e.replaceChild(t,n):e.appendChild(t),e=t,t=null)),s(e)){for(n=e.firstChild;G&&n&&n.nodeType===x&&!n.data;)e.removeChild(n),n=e.firstChild;n||(G?(t=o.createTextNode(w),k(o)._didAddZWS()):t=o.createTextNode(""))}else if(Q){for(;e.nodeType!==x&&!a(e);){if(n=e.firstChild,!n){t=o.createTextNode("");break}e=n}e.nodeType===x?/^ +$/.test(e.data)&&(e.data=""):a(e)&&e.parentNode.insertBefore(o.createTextNode(""),e)}else if(!e.querySelector("BR"))for(t=C(o,"BR");(n=e.lastElementChild)&&!s(n);)e=n;return t&&e.appendChild(t),i}function S(e){var t,n,r,o,i=e.childNodes,a=e.ownerDocument,d=null;for(t=0,n=i.length;n>t;t+=1)r=i[t],o="BR"===r.nodeName,!o&&s(r)?(d||(d=C(a,"DIV")),d.appendChild(r),t-=1,n-=1):(o||d)&&(d||(d=C(a,"DIV")),_(d),o?e.replaceChild(d,r):(e.insertBefore(d,r),t+=1,n+=1),d=null),l(r)&&S(r);return d&&e.appendChild(_(d)),e}function y(e,t,n){var r,o,i,a=e.nodeType;if(a===x&&e!==n)return y(e.parentNode,e.splitText(t),n);if(a===O){if("number"==typeof t&&(t=t<e.childNodes.length?e.childNodes[t]:null),e===n)return t;for(r=e.parentNode,o=e.cloneNode(!1);t;)i=t.nextSibling,o.appendChild(t),t=i;return"OL"===e.nodeName&&u(e,"BLOCKQUOTE")&&(o.start=(+e.start||1)+e.childNodes.length-1),_(e),_(o),(i=e.nextSibling)?r.insertBefore(o,i):r.appendChild(o),y(r,o,n)}return t}function T(e,t){if(e.nodeType===O)for(var n,r,o,a=e.childNodes,d=a.length,l=[];d--;)if(n=a[d],r=d&&a[d-1],d&&s(n)&&i(n,r)&&!tt[n.nodeName])t.startContainer===n&&(t.startContainer=r,t.startOffset+=g(r)),t.endContainer===n&&(t.endContainer=r,t.endOffset+=g(r)),t.startContainer===e&&(t.startOffset>d?t.startOffset-=1:t.startOffset===d&&(t.startContainer=r,t.startOffset=g(r))),t.endContainer===e&&(t.endOffset>d?t.endOffset-=1:t.endOffset===d&&(t.endContainer=r,t.endOffset=g(r))),m(n),n.nodeType===x?r.appendData(n.data):l.push(N(n));else if(n.nodeType===O){for(o=l.length;o--;)n.appendChild(l.pop());T(n,t)}}function E(e,t,n){for(var r,o,i,a=t;1===a.parentNode.childNodes.length;)a=a.parentNode;m(a),o=e.childNodes.length,r=e.lastChild,r&&"BR"===r.nodeName&&(e.removeChild(r),o-=1),i={startContainer:e,startOffset:o,endContainer:e,endOffset:o},e.appendChild(N(t)),T(e,i),n.setStart(i.startContainer,i.startOffset),n.collapse(!0),V&&(r=e.lastChild)&&"BR"===r.nodeName&&e.removeChild(r)}function B(e){var t,n,r=e.previousSibling,o=e.firstChild,a=e.ownerDocument,s="LI"===e.nodeName;if(!s||o&&/^[OU]L$/.test(o.nodeName))if(r&&i(r,e)){if(!l(r)){if(!s)return;n=C(a,"DIV"),n.appendChild(N(r)),r.appendChild(n)}m(e),t=!l(e),r.appendChild(N(e)),t&&S(r),o&&B(o)}else s&&(r=C(a,"DIV"),e.insertBefore(r,o),_(r))}function k(e){for(var t,n=St.length;n--;)if(t=St[n],t._doc===e)return t;return null}function b(e){var t,n=e.defaultView,r=e.body;this._win=n,this._doc=e,this._body=r,this._events={},this._sel=n.getSelection(),this._lastSelection=null,$&&this.addEventListener("beforedeactivate",this.getSelection),this._hasZWS=!1,this._lastAnchorNode=null,this._lastFocusNode=null,this._path="",this.addEventListener("keyup",this._updatePathOnEvent),this.addEventListener("mouseup",this._updatePathOnEvent),n.addEventListener("focus",this,!1),n.addEventListener("blur",this,!1),this._undoIndex=-1,this._undoStack=[],this._undoStackLength=0,this._isInUndoState=!1,this._ignoreChange=!1,j?(t=new MutationObserver(this._docWasChanged.bind(this)),t.observe(r,{childList:!0,attributes:!0,characterData:!0,subtree:!0}),this._mutation=t):this.addEventListener("keyup",this._keyUpDetectChange),this.defaultBlockTag="DIV",this.defaultBlockProperties=null,this._awaitingPaste=!1,this.addEventListener(z?"beforecut":"cut",this._onCut),this.addEventListener(z?"beforepaste":"paste",this._onPaste),this.addEventListener(V?"keypress":"keydown",this._onKey),this._keyHandlers=Object.create(_t),z&&(n.Text.prototype.splitText=function(e){var t=this.ownerDocument.createTextNode(this.data.slice(e)),n=this.nextSibling,r=this.parentNode,o=this.length-e;return n?r.insertBefore(t,n):r.appendChild(t),o&&this.deleteData(e,o),t}),r.setAttribute("contenteditable","true"),this.setHTML("");try{e.execCommand("enableObjectResizing",!1,"false"),e.execCommand("enableInlineTableEditing",!1,"false")}catch(o){}St.push(this)}var L=2,O=1,x=3,R=1,A=4,D=0,U=1,I=2,P=3,w="​",F=e.defaultView,H=navigator.userAgent,M=/iP(?:ad|hone|od)/.test(H),W=/Mac OS X/.test(H),K=/Gecko\//.test(H),z=/Trident\/[456]\./.test(H),V=!!F.opera,Z=/WebKit\//.test(H),q=W?"meta-":"ctrl-",Q=z||V,G=z||Z,$=z,j="undefined"!=typeof MutationObserver,Y=/[^ \t\r\n]/,X=Array.prototype.indexOf;Object.create||(Object.create=function(e){var t=function(){};return t.prototype=e,new t});var J={1:1,2:2,3:4,8:128,9:256,11:1024};n.prototype.nextNode=function(){for(var e,t=this.currentNode,n=this.root,r=this.nodeType,o=this.filter;;){for(e=t.firstChild;!e&&t&&t!==n;)e=t.nextSibling,e||(t=t.parentNode);if(!e)return null;if(J[e.nodeType]&r&&o(e))return this.currentNode=e,e;t=e}},n.prototype.previousNode=function(){for(var e,t=this.currentNode,n=this.root,r=this.nodeType,o=this.filter;;){if(t===n)return null;if(e=t.previousSibling)for(;t=e.lastChild;)e=t;else e=t.parentNode;if(!e)return null;if(J[e.nodeType]&r&&o(e))return this.currentNode=e,e;t=e}};var et=/^(?:#text|A(?:BBR|CRONYM)?|B(?:R|D[IO])?|C(?:ITE|ODE)|D(?:ATA|FN|EL)|EM|FONT|HR|I(?:NPUT|MG|NS)?|KBD|Q|R(?:P|T|UBY)|S(?:U[BP]|PAN|TR(?:IKE|ONG)|MALL|AMP)?|U|VAR|WBR)$/,tt={BR:1,IMG:1,INPUT:1},nt=function(e,t){for(var n=e.childNodes;t&&e.nodeType===O;)e=n[t-1],n=e.childNodes,t=n.length;return e},rt=function(e,t){if(e.nodeType===O){var n=e.childNodes;if(t<n.length)e=n[t];else{for(;e&&!e.nextSibling;)e=e.parentNode;e&&(e=e.nextSibling)}}return e},ot=function(e,t){var n,r,o,i,a=e.startContainer,s=e.startOffset,d=e.endContainer,l=e.endOffset;a.nodeType===x?(n=a.parentNode,r=n.childNodes,s===a.length?(s=X.call(r,a)+1,e.collapsed&&(d=n,l=s)):(s&&(i=a.splitText(s),d===a?(l-=s,d=i):d===n&&(l+=1),a=i),s=X.call(r,a)),a=n):r=a.childNodes,o=r.length,s===o?a.appendChild(t):a.insertBefore(t,r[s]),a===d&&(l+=r.length-o),e.setStart(a,s),e.setEnd(d,l)},it=function(e,t){var n=e.startContainer,r=e.startOffset,o=e.endContainer,i=e.endOffset;t||(t=e.commonAncestorContainer),t.nodeType===x&&(t=t.parentNode);for(var a,s,d,l=y(o,i,t),c=y(n,r,t),h=t.ownerDocument.createDocumentFragment();c!==l;)a=c.nextSibling,h.appendChild(c),c=a;return n=t,r=l?X.call(t.childNodes,l):t.childNodes.length,d=t.childNodes[r],s=d&&d.previousSibling,s&&s.nodeType===x&&d.nodeType===x&&(n=s,r=s.length,s.appendData(d.data),m(d)),e.setStart(n,r),e.collapse(!0),_(t),h},at=function(e){ct(e),it(e),lt(e);var t=ht(e),n=ft(e);t&&n&&t!==n&&E(t,n,e),t&&_(t);var r=e.endContainer.ownerDocument.body,o=r.firstChild;o&&"BR"!==o.nodeName||(_(r),e.selectNodeContents(r.firstChild))},st=function(e,t){for(var n=!0,r=t.childNodes,o=r.length;o--;)if(!s(r[o])){n=!1;break}if(e.collapsed||at(e),lt(e),n)ot(e,t),e.collapse(!1);else{for(var i,a,d=e.startContainer,l=y(d,e.startOffset,u(d.parentNode,"BLOCKQUOTE")||d.ownerDocument.body),c=l.previousSibling,h=c,p=h.childNodes.length,m=l,v=0,N=l.parentNode;(i=h.lastChild)&&i.nodeType===O&&"BR"!==i.nodeName;)h=i,p=h.childNodes.length;for(;(i=m.firstChild)&&i.nodeType===O&&"BR"!==i.nodeName;)m=i;for(;(i=t.firstChild)&&s(i);)h.appendChild(i);for(;(i=t.lastChild)&&s(i);)m.insertBefore(i,m.firstChild),v+=1;for(a=t;a=f(a);)_(a);N.insertBefore(t,l),a=l.previousSibling,l.textContent?B(l):N.removeChild(l),l.parentNode||(m=a,v=g(m)),c.textContent?B(c):(h=c.nextSibling,p=0,N.removeChild(c)),e.setStart(h,p),e.setEnd(m,v),lt(e)}},dt=function(e,t,n){var r=t.ownerDocument.createRange();if(r.selectNode(t),n){var o=e.compareBoundaryPoints(P,r)>-1,i=e.compareBoundaryPoints(U,r)<1;return!o&&!i}var a=e.compareBoundaryPoints(D,r)<1,s=e.compareBoundaryPoints(I,r)>-1;return a&&s},lt=function(e){for(var t,n=e.startContainer,r=e.startOffset,o=e.endContainer,i=e.endOffset;n.nodeType!==x&&(t=n.childNodes[r],t&&!a(t));)n=t,r=0;if(i)for(;o.nodeType!==x&&(t=o.childNodes[i-1],t&&!a(t));)o=t,i=g(o);else for(;o.nodeType!==x&&(t=o.firstChild,t&&!a(t));)o=t;e.collapsed?(e.setStart(o,i),e.setEnd(n,r)):(e.setStart(n,r),e.setEnd(o,i))},ct=function(e,t){var n,r=e.startContainer,o=e.startOffset,i=e.endContainer,a=e.endOffset;for(t||(t=e.commonAncestorContainer);r!==t&&!o;)n=r.parentNode,o=X.call(n.childNodes,r),r=n;for(;i!==t&&a===g(i);)n=i.parentNode,a=X.call(n.childNodes,i)+1,i=n;e.setStart(r,o),e.setEnd(i,a)},ht=function(e){var t,n=e.startContainer;return s(n)?t=h(n):d(n)?t=n:(t=nt(n,e.startOffset),t=f(t)),t&&dt(e,t,!0)?t:null},ft=function(e){var t,n,r=e.endContainer;if(s(r))t=h(r);else if(d(r))t=r;else{if(t=rt(r,e.endOffset),!t)for(t=r.ownerDocument.body;n=t.lastChild;)t=n;t=h(t)}return t&&dt(e,t,!0)?t:null},ut=new n(null,A|R,function(e){return e.nodeType===x?Y.test(e.data):"IMG"===e.nodeName}),pt=function(e){var t=e.startContainer,n=e.startOffset;if(t.nodeType===x){if(n)return!1;ut.currentNode=t}else ut.currentNode=rt(t,n);return ut.root=ht(e),!ut.previousNode()},gt=function(e){var t,n=e.endContainer,r=e.endOffset;if(n.nodeType===x){if(t=n.data.length,t&&t>r)return!1;ut.currentNode=n}else ut.currentNode=nt(n,r);return ut.root=ft(e),!ut.nextNode()},mt=function(e){var t,n=ht(e),r=ft(e);n&&r&&(t=n.parentNode,e.setStart(t,X.call(t.childNodes,n)),t=r.parentNode,e.setEnd(t,X.call(t.childNodes,r)+1))},vt=function(e){return function(t,n){n.preventDefault(),t[e]()}},Nt=function(e,t){return t=t||null,function(n,r){r.preventDefault();var o=n.getSelection();n.hasFormat(e,null,o)?n.changeFormat(null,{tag:e},o):n.changeFormat({tag:e},t,o)}},Ct=function(e,t){try{t||(t=e.getSelection());var n,r=t.startContainer;for(r.nodeType===x&&(r=r.parentNode),n=r;s(n)&&(!n.textContent||n.textContent===w);)r=n,n=r.parentNode;r!==n&&(t.setStart(n,X.call(n.childNodes,r)),t.collapse(!0),n.removeChild(r),d(n)||(n=h(n)),_(n),lt(t)),e._ensureBottomLine(),e.setSelection(t),e._updatePath(t,!0)}catch(o){e.didError(o)}},_t={enter:function(e,t,n){var r,o,i;if(t.preventDefault(),e._recordUndoState(n),Ht(n.startContainer),e._removeZWS(),e._getRangeAndRemoveBookmark(n),n.collapsed||at(n),r=ht(n),!r||/^T[HD]$/.test(r.nodeName))return ot(n,e.createElement("BR")),n.collapse(!1),e.setSelection(n),void e._updatePath(n,!0);if((o=u(r,"LI"))&&(r=o),!r.textContent){if(u(r,"UL")||u(r,"OL"))return e.modifyBlocks(wt,n);if(u(r,"BLOCKQUOTE"))return e.modifyBlocks(Rt,n)}for(i=Lt(e,r,n.startContainer,n.startOffset),Et(r),Zt(r),_(r);i.nodeType===O;){var a,s=i.firstChild;if("A"===i.nodeName&&(!i.textContent||i.textContent===w)){s=e._doc.createTextNode(""),v(i,s),i=s;break}for(;s&&s.nodeType===x&&!s.data&&(a=s.nextSibling,a&&"BR"!==a.nodeName);)m(s),s=a;if(!s||"BR"===s.nodeName||s.nodeType===x&&!V)break;i=s}n=e._createRange(i,0),e.setSelection(n),e._updatePath(n,!0),i.nodeType===x&&(i=i.parentNode);var d=e._doc,l=e._body;i.offsetTop+i.offsetHeight>(d.documentElement.scrollTop||l.scrollTop)+l.offsetHeight&&i.scrollIntoView(!1)},backspace:function(e,t,n){if(e._removeZWS(),e._recordUndoState(n),e._getRangeAndRemoveBookmark(n),n.collapsed)if(pt(n)){t.preventDefault();var r=ht(n),o=r&&h(r);if(o){if(!o.isContentEditable)return void m(o);for(E(o,r,n),r=o.parentNode;r&&!r.nextSibling;)r=r.parentNode;r&&(r=r.nextSibling)&&B(r),e.setSelection(n)}else if(r){if(u(r,"UL")||u(r,"OL"))return e.modifyBlocks(wt,n);if(u(r,"BLOCKQUOTE"))return e.modifyBlocks(xt,n);e.setSelection(n),e._updatePath(n,!0)}}else e.setSelection(n),setTimeout(function(){Ct(e)},0);else t.preventDefault(),at(n),Ct(e,n)},"delete":function(e,t,n){if(e._removeZWS(),e._recordUndoState(n),e._getRangeAndRemoveBookmark(n),n.collapsed)if(gt(n)){t.preventDefault();var r=ht(n),o=r&&f(r);if(o){if(!o.isContentEditable)return void m(o);for(E(r,o,n),o=r.parentNode;o&&!o.nextSibling;)o=o.parentNode;o&&(o=o.nextSibling)&&B(o),e.setSelection(n),e._updatePath(n,!0)}}else e.setSelection(n),setTimeout(function(){Ct(e)},0);else t.preventDefault(),at(n),Ct(e,n)},tab:function(e,t,n){var r,o;if(e._removeZWS(),n.collapsed&&pt(n)&&gt(n)){for(r=ht(n);o=r.parentNode;){if("UL"===o.nodeName||"OL"===o.nodeName){r.previousSibling&&(t.preventDefault(),e.modifyBlocks(Pt,n));break}r=o}t.preventDefault()}},space:function(e,t,n){var r,o;e._recordUndoState(n),Ht(n.startContainer),e._getRangeAndRemoveBookmark(n),r=n.endContainer,o=r.parentNode,n.collapsed&&"A"===o.nodeName&&!r.nextSibling&&n.endOffset===g(r)&&n.setStartAfter(o),e.setSelection(n)},left:function(e){e._removeZWS()},right:function(e){e._removeZWS()}};W&&K&&F.getSelection().modify&&(_t["meta-left"]=function(e,t){t.preventDefault(),e._sel.modify("move","backward","lineboundary")},_t["meta-right"]=function(e,t){t.preventDefault(),e._sel.modify("move","forward","lineboundary")}),_t[q+"b"]=Nt("B"),_t[q+"i"]=Nt("I"),_t[q+"u"]=Nt("U"),_t[q+"shift-7"]=Nt("S"),_t[q+"shift-5"]=Nt("SUB",{tag:"SUP"}),_t[q+"shift-6"]=Nt("SUP",{tag:"SUB"}),_t[q+"shift-8"]=vt("makeUnorderedList"),_t[q+"shift-9"]=vt("makeOrderedList"),_t[q+"["]=vt("decreaseQuoteLevel"),_t[q+"]"]=vt("increaseQuoteLevel"),_t[q+"y"]=vt("redo"),_t[q+"z"]=vt("undo"),_t[q+"shift-z"]=vt("redo");var St=[],yt=b.prototype;yt.createElement=function(e,t,n){return C(this._doc,e,t,n)},yt.createDefaultBlock=function(e){return _(this.createElement(this.defaultBlockTag,this.defaultBlockProperties,e))},yt.didError=function(e){console.log(e)},yt.getDocument=function(){return this._doc};var Tt={focus:1,blur:1,pathChange:1,select:1,input:1,undoStateChange:1};yt.fireEvent=function(e,t){var n,r,o,i=this._events[e];if(i)for(t||(t={}),t.type!==e&&(t.type=e),i=i.slice(),n=0,r=i.length;r>n;n+=1){o=i[n];try{o.handleEvent?o.handleEvent(t):o.call(this,t)}catch(a){a.details="Squire: fireEvent error. Event type: "+e,this.didError(a)}}return this},yt.destroy=function(){var e,t=this._win,n=this._doc,r=this._events;t.removeEventListener("focus",this,!1),t.removeEventListener("blur",this,!1);for(e in r)Tt[e]||n.removeEventListener(e,this,!0);this._mutation&&this._mutation.disconnect();for(var o=St.length;o--;)St[o]===this&&St.splice(o,1)},yt.handleEvent=function(e){this.fireEvent(e.type,e)},yt.addEventListener=function(e,t){var n=this._events[e];return t?(n||(n=this._events[e]=[],Tt[e]||this._doc.addEventListener(e,this,!0)),n.push(t),this):(this.didError({name:"Squire: addEventListener with null or undefined fn",message:"Event type: "+e}),this)},yt.removeEventListener=function(e,t){var n,r=this._events[e];if(r){for(n=r.length;n--;)r[n]===t&&r.splice(n,1);r.length||(delete this._events[e],Tt[e]||this._doc.removeEventListener(e,this,!1))}return this},yt._createRange=function(e,t,n,r){if(e instanceof this._win.Range)return e.cloneRange();var o=this._doc.createRange();return o.setStart(e,t),n?o.setEnd(n,r):o.setEnd(e,t),o},yt.setSelection=function(e){if(e){M&&this._win.focus();var t=this._sel;t.removeAllRanges(),t.addRange(e)}return this},yt.getSelection=function(){var e,t,n,r=this._sel;return r.rangeCount?(e=r.getRangeAt(0).cloneRange(),t=e.startContainer,n=e.endContainer,t&&a(t)&&e.setStartBefore(t),n&&a(n)&&e.setEndBefore(n),this._lastSelection=e):e=this._lastSelection,e||(e=this._createRange(this._body.firstChild,0)),e},yt.getSelectedText=function(){var e,t=this.getSelection(),r=new n(t.commonAncestorContainer,A|R,function(e){return dt(t,e,!0)}),o=t.startContainer,i=t.endContainer,a=r.currentNode=o,d="",l=!1;for(r.filter(a)||(a=r.nextNode());a;)a.nodeType===x?(e=a.data,e&&/\S/.test(e)&&(a===i&&(e=e.slice(0,t.endOffset)),a===o&&(e=e.slice(t.startOffset)),d+=e,l=!0)):("BR"===a.nodeName||l&&!s(a))&&(d+="\n",l=!1),a=r.nextNode();return d},yt.getPath=function(){return this._path};var Et=function(e){for(var t,r,o,i=new n(e,A,function(){return!0},!1);r=i.nextNode();)for(;(o=r.data.indexOf(w))>-1;){if(1===r.length){do t=r.parentNode,t.removeChild(r),r=t;while(s(r)&&!g(r));break}r.deleteData(o,1)}};yt._didAddZWS=function(){this._hasZWS=!0},yt._removeZWS=function(){this._hasZWS&&(Et(this._body),this._hasZWS=!1)},yt._updatePath=function(e,t){var n,r=e.startContainer,o=e.endContainer;(t||r!==this._lastAnchorNode||o!==this._lastFocusNode)&&(this._lastAnchorNode=r,this._lastFocusNode=o,n=r&&o?r===o?p(o):"(selection)":"",this._path!==n&&(this._path=n,this.fireEvent("pathChange",{path:n}))),e.collapsed||this.fireEvent("select")},yt._updatePathOnEvent=function(){this._updatePath(this.getSelection())},yt.focus=function(){return V||this._body.focus(),this._win.focus(),this},yt.blur=function(){return K&&this._body.blur(),top.focus(),this};var Bt="squire-selection-start",kt="squire-selection-end";yt._saveRangeToBookmark=function(e){var t,n=this.createElement("INPUT",{id:Bt,type:"hidden"}),r=this.createElement("INPUT",{id:kt,type:"hidden"});ot(e,n),e.collapse(!1),ot(e,r),n.compareDocumentPosition(r)&L&&(n.id=kt,r.id=Bt,t=n,n=r,r=t),e.setStartAfter(n),e.setEndBefore(r)},yt._getRangeAndRemoveBookmark=function(e){var t=this._doc,n=t.getElementById(Bt),r=t.getElementById(kt);if(n&&r){var o,i=n.parentNode,a=r.parentNode,s={startContainer:i,endContainer:a,startOffset:X.call(i.childNodes,n),endOffset:X.call(a.childNodes,r)};i===a&&(s.endOffset-=1),m(n),m(r),T(i,s),i!==a&&T(a,s),e||(e=t.createRange()),e.setStart(s.startContainer,s.startOffset),e.setEnd(s.endContainer,s.endOffset),o=e.collapsed,lt(e),o&&e.collapse(!0)}return e||null},yt._keyUpDetectChange=function(e){var t=e.keyCode;e.ctrlKey||e.metaKey||e.altKey||!(16>t||t>20)||!(33>t||t>45)||this._docWasChanged()},yt._docWasChanged=function(){return j&&this._ignoreChange?void(this._ignoreChange=!1):(this._isInUndoState&&(this._isInUndoState=!1,this.fireEvent("undoStateChange",{canUndo:!0,canRedo:!1})),void this.fireEvent("input"))},yt._recordUndoState=function(e){if(!this._isInUndoState){var t=this._undoIndex+=1,n=this._undoStack;t<this._undoStackLength&&(n.length=this._undoStackLength=t),e&&this._saveRangeToBookmark(e),n[t]=this._getHTML(),this._undoStackLength+=1,this._isInUndoState=!0}},yt.undo=function(){if(0!==this._undoIndex||!this._isInUndoState){this._recordUndoState(this.getSelection()),this._undoIndex-=1,this._setHTML(this._undoStack[this._undoIndex]);var e=this._getRangeAndRemoveBookmark();e&&this.setSelection(e),this._isInUndoState=!0,this.fireEvent("undoStateChange",{canUndo:0!==this._undoIndex,canRedo:!0}),this.fireEvent("input")}return this},yt.redo=function(){var e=this._undoIndex,t=this._undoStackLength;if(t>e+1&&this._isInUndoState){this._undoIndex+=1,this._setHTML(this._undoStack[this._undoIndex]);var n=this._getRangeAndRemoveBookmark();n&&this.setSelection(n),this.fireEvent("undoStateChange",{canUndo:!0,canRedo:t>e+2}),this.fireEvent("input")}return this},yt.hasFormat=function(e,t,r){if(e=e.toUpperCase(),t||(t={}),!r&&!(r=this.getSelection()))return!1;var o,i,a=r.commonAncestorContainer;if(u(a,e,t))return!0;if(a.nodeType===x)return!1;o=new n(a,A,function(e){return dt(r,e,!0)},!1);for(var s=!1;i=o.nextNode();){if(!u(i,e,t))return!1;s=!0}return s},yt._addFormat=function(e,t,r){var o,i,a,s,d,l,c,h;if(r.collapsed)o=_(this.createElement(e,t)),ot(r,o),r.setStart(o.firstChild,o.firstChild.length),r.collapse(!0);else{if(i=new n(r.commonAncestorContainer,A|R,function(e){return(e.nodeType===x||"BR"===e.nodeName)&&dt(r,e,!0)},!1),a=r.startContainer,d=r.startOffset,s=r.endContainer,l=r.endOffset,i.currentNode=a,i.filter(a)||(a=i.nextNode(),d=0),!a)return r;do c=i.currentNode,h=!u(c,e,t),h&&(c===s&&c.length>l&&c.splitText(l),c===a&&d&&(c=c.splitText(d),s===a&&(s=c,l-=d),a=c,d=0),o=this.createElement(e,t),v(c,o),o.appendChild(c));while(i.nextNode());s.nodeType!==x&&(c.nodeType===x?(s=c,l=c.length):(s=c.parentNode,l=1)),r=this._createRange(a,d,s,l)}return r},yt._removeFormat=function(e,t,n,r){this._saveRangeToBookmark(n);var i,a=this._doc;n.collapsed&&(G?(i=a.createTextNode(w),this._didAddZWS()):i=a.createTextNode(""),ot(n,i));for(var d=n.commonAncestorContainer;s(d);)d=d.parentNode;var l=n.startContainer,c=n.startOffset,h=n.endContainer,f=n.endOffset,u=[],p=function(e,t){if(!dt(n,e,!1)){var r,o,i=e.nodeType===x;if(!dt(n,e,!0))return void("INPUT"===e.nodeName||i&&!e.data||u.push([t,e]));if(i)e===h&&f!==e.length&&u.push([t,e.splitText(f)]),e===l&&c&&(e.splitText(c),u.push([t,e]));else for(r=e.firstChild;r;r=o)o=r.nextSibling,p(r,t)}},g=Array.prototype.filter.call(d.getElementsByTagName(e),function(r){return dt(n,r,!0)&&o(r,e,t)});r||g.forEach(function(e){p(e,e)}),u.forEach(function(e){var t=e[0].cloneNode(!1),n=e[1];v(n,t),t.appendChild(n)}),g.forEach(function(e){v(e,N(e))}),this._getRangeAndRemoveBookmark(n),i&&n.collapse(!1);var m={startContainer:n.startContainer,startOffset:n.startOffset,endContainer:n.endContainer,endOffset:n.endOffset};return T(d,m),n.setStart(m.startContainer,m.startOffset),n.setEnd(m.endContainer,m.endOffset),n},yt.changeFormat=function(e,t,n,r){return n||(n=this.getSelection())?(this._recordUndoState(n),this._getRangeAndRemoveBookmark(n),t&&(n=this._removeFormat(t.tag.toUpperCase(),t.attributes||{},n,r)),e&&(n=this._addFormat(e.tag.toUpperCase(),e.attributes||{},n)),this.setSelection(n),this._updatePath(n,!0),j||this._docWasChanged(),this):void 0};var bt={DT:"DD",DD:"DT",LI:"LI"},Lt=function(e,t,n,r){var i=bt[t.nodeName],a=null,s=y(n,r,t.parentNode);return i||(i=e.defaultBlockTag,a=e.defaultBlockProperties),o(s,i,a)||(t=C(s.ownerDocument,i,a),s.dir&&(t.className="rtl"===s.dir?"dir-rtl":"",t.dir=s.dir),v(s,t),t.appendChild(N(s)),s=t),s};yt.forEachBlock=function(e,t,n){if(!n&&!(n=this.getSelection()))return this;t&&(this._recordUndoState(n),this._getRangeAndRemoveBookmark(n));var r=ht(n),o=ft(n);if(r&&o)do if(e(r)||r===o)break;while(r=f(r));return t&&(this.setSelection(n),this._updatePath(n,!0),j||this._docWasChanged()),this},yt.modifyBlocks=function(e,t){if(!t&&!(t=this.getSelection()))return this;this._isInUndoState?this._saveRangeToBookmark(t):this._recordUndoState(t),mt(t);var n,r=this._body;return ct(t,r),n=it(t,r),ot(t,e.call(this,n)),t.endOffset<t.endContainer.childNodes.length&&B(t.endContainer.childNodes[t.endOffset]),B(t.startContainer.childNodes[t.startOffset]),this._getRangeAndRemoveBookmark(t),this.setSelection(t),this._updatePath(t,!0),j||this._docWasChanged(),this};var Ot=function(e){return this.createElement("BLOCKQUOTE",[e])},xt=function(e){var t=e.querySelectorAll("blockquote");return Array.prototype.filter.call(t,function(e){return!u(e.parentNode,"BLOCKQUOTE")}).forEach(function(e){v(e,N(e))}),e},Rt=function(){return this.createDefaultBlock([this.createElement("INPUT",{id:Bt,type:"hidden"}),this.createElement("INPUT",{id:kt,type:"hidden"})])},At=function(e,n,r){for(var o,i,a,s,d=c(n);o=d.nextNode();)i=o.parentNode.nodeName,"LI"!==i?(s=e.createElement("LI",{"class":"rtl"===o.dir?"dir-rtl":t,dir:o.dir||t}),(a=o.previousSibling)&&a.nodeName===r?a.appendChild(s):v(o,e.createElement(r,[s])),s.appendChild(o)):(o=o.parentNode.parentNode,i=o.nodeName,i!==r&&/^[OU]L$/.test(i)&&v(o,e.createElement(r,[N(o)])))},Dt=function(e){return At(this,e,"UL"),e},Ut=function(e){return At(this,e,"OL"),e},It=function(e){var t,n,r,o,i,a,s,d=e.querySelectorAll("UL, OL");for(t=0,n=d.length;n>t;t+=1){for(o=d[t],i=N(o),a=i.childNodes,r=a.length;r--;)s=a[r],v(s,N(s));S(i),v(o,i)}return e},Pt=function(e){var t,n,r,o,i,a=e.querySelectorAll("LI");for(t=0,n=a.length;n>t;t+=1)r=a[t],l(r.firstChild)||(o=r.parentNode.nodeName,i=r.previousSibling,i&&(i=i.lastChild)&&i.nodeName===o||v(r,this.createElement("LI",[i=this.createElement(o)])),i.appendChild(r));return e},wt=function(e){var t=e.querySelectorAll("LI");return Array.prototype.filter.call(t,function(e){return!l(e.firstChild)}).forEach(function(t){var n,r=t.parentNode,o=r.parentNode,i=t.firstChild,a=i;for(t.previousSibling&&(r=y(r,t,o));a&&(n=a.nextSibling,!l(a));)o.insertBefore(a,r),a=n;for("LI"===o.nodeName&&i.previousSibling&&y(o,i,o.parentNode);t!==e&&!t.childNodes.length;)r=t.parentNode,r.removeChild(t),t=r},this),S(e),e},Ft=/\b((?:(?:ht|f)tps?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,}\/)(?:[^\s()<>]+|\([^\s()<>]+\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))|([\w\-.%+]+@(?:[\w\-]+\.)+[A-Z]{2,}\b)/i,Ht=function(e){for(var t,r,o,i,a,s,d,l=e.ownerDocument,c=new n(e,A,function(e){return!u(e,"A")},!1);t=c.nextNode();)for(r=t.data,o=t.parentNode;i=Ft.exec(r);)a=i.index,s=a+i[0].length,a&&(d=l.createTextNode(r.slice(0,a)),o.insertBefore(d,t)),d=l.createElement("A"),d.textContent=r.slice(a,s),d.href=i[1]?/^(?:ht|f)tps?:/.test(i[1])?i[1]:"http://"+i[1]:"mailto:"+i[2],o.insertBefore(d,t),t.data=r=r.slice(s)},Mt=/^(?:A(?:DDRESS|RTICLE|SIDE|UDIO)|BLOCKQUOTE|CAPTION|D(?:[DLT]|IV)|F(?:IGURE|OOTER)|H[1-6]|HEADER|L(?:ABEL|EGEND|I)|O(?:L|UTPUT)|P(?:RE)?|SECTION|T(?:ABLE|BODY|D|FOOT|H|HEAD|R)|UL)$/,Wt={1:10,2:13,3:16,4:18,5:24,6:32,7:48},Kt={backgroundColor:{regexp:Y,replace:function(e,t){return C(e,"SPAN",{"class":"highlight",style:"background-color: "+t})}},color:{regexp:Y,replace:function(e,t){return C(e,"SPAN",{"class":"colour",style:"color:"+t})}},fontWeight:{regexp:/^bold/i,replace:function(e){return C(e,"B")}},fontStyle:{regexp:/^italic/i,replace:function(e){return C(e,"I")}},fontFamily:{regexp:Y,replace:function(e,t){return C(e,"SPAN",{"class":"font",style:"font-family:"+t})}},fontSize:{regexp:Y,replace:function(e,t){return C(e,"SPAN",{"class":"size",style:"font-size:"+t})}}},zt=function(e){return function(t,n){var r=C(t.ownerDocument,e);return n.replaceChild(r,t),r.appendChild(N(t)),r}},Vt={SPAN:function(e,t){var n,r,o,i,a,s,d=e.style,l=e.ownerDocument;for(n in Kt)r=Kt[n],o=d[n],o&&r.regexp.test(o)&&(s=r.replace(l,o),i&&i.appendChild(s),i=s,a||(a=s));return a&&(i.appendChild(N(e)),t.replaceChild(a,e)),i||e},STRONG:zt("B"),EM:zt("I"),STRIKE:zt("S"),FONT:function(e,t){var n,r,o,i,a,s=e.face,d=e.size,l=e.color,c=e.ownerDocument;return s&&(n=C(c,"SPAN",{"class":"font",style:"font-family:"+s}),a=n,i=n),d&&(r=C(c,"SPAN",{"class":"size",style:"font-size:"+Wt[d]+"px"}),a||(a=r),i&&i.appendChild(r),i=r),l&&/^#?([\dA-F]{3}){1,2}$/i.test(l)&&("#"!==l.charAt(0)&&(l="#"+l),o=C(c,"SPAN",{"class":"colour",style:"color:"+l}),a||(a=o),i&&i.appendChild(o),i=o),a||(a=i=C(c,"SPAN")),t.replaceChild(a,e),i.appendChild(N(e)),i},TT:function(e,t){var n=C(e.ownerDocument,"SPAN",{"class":"font",style:'font-family:menlo,consolas,"courier new",monospace'});return t.replaceChild(n,e),n.appendChild(N(e)),n}},Zt=function(e){for(var t,n=e.childNodes,r=n.length;r--;)t=n[r],t.nodeType!==O||a(t)?t.nodeType!==x||t.data||e.removeChild(t):(Zt(t),s(t)&&!t.firstChild&&e.removeChild(t))},qt=function(e,t){var n,r,o,i,a,d,l,c,h,f,u=e.childNodes;for(n=0,r=u.length;r>n;n+=1)if(o=u[n],i=o.nodeName,a=o.nodeType,d=Vt[i],a===O){if(l=o.childNodes.length,d)o=d(o,e);else{if(!Mt.test(i)&&!s(o)){n-=1,r+=l-1,e.replaceChild(N(o),o);continue}!t&&o.style.cssText&&o.removeAttribute("style")}l&&qt(o,t)}else{if(a===x){if(c=o.data,/\S/.test(c)){if(s(e))continue;if(h=0,f=c.length,!n||!s(u[n-1])){for(;f>h&&!Y.test(c.charAt(h));)h+=1;h&&(o.data=c=c.slice(h),f-=h)}if(n+1===r||!s(u[n+1])){for(h=f;h>0&&!Y.test(c.charAt(h-1));)h-=1;f>h&&(o.data=c.slice(0,h))}continue}if(n&&r>n+1&&s(u[n-1])&&s(u[n+1])){o.data=" ";continue}}e.removeChild(o),n-=1,r-=1}return e},Qt=function(e){return e.nodeType===O?"BR"===e.nodeName:Y.test(e.data)},Gt=function(e){for(var t,r=e.parentNode;s(r);)r=r.parentNode;return t=new n(r,R|A,Qt),t.currentNode=e,!!t.nextNode()},$t=function(e){var t,n,r,o=e.querySelectorAll("BR"),i=[],a=o.length;for(t=0;a>t;t+=1)i[t]=Gt(o[t]);for(;a--;)if(n=o[a],r=n.parentNode){for(;s(r);)r=r.parentNode;if(d(r)){if(i[a]){if("DIV"!==r.nodeName)continue;y(n.parentNode,n,r.parentNode)}m(n)}else S(r)}};yt._ensureBottomLine=function(){var e=this._body,t=e.lastElementChild;t&&t.nodeName===this.defaultBlockTag&&d(t)||e.appendChild(this.createDefaultBlock())},yt._onCut=function(){var e=this.getSelection(),t=this;this._recordUndoState(e),this._getRangeAndRemoveBookmark(e),this.setSelection(e),setTimeout(function(){try{t._ensureBottomLine()}catch(e){t.didError(e)}},0)},yt._onPaste=function(e){if(!this._awaitingPaste){var t,n,r=e.clipboardData,o=r&&r.items,i=!1,a=!1;if(o){for(t=o.length;t--;){if(n=o[t].type,"text/html"===n){a=!1;break}/^image\/.*/.test(n)&&(a=!0)}if(a)return e.preventDefault(),this.fireEvent("dragover",{dataTransfer:r,preventDefault:function(){i=!0}}),void(i&&this.fireEvent("drop",{dataTransfer:r}))}this._awaitingPaste=!0;var s,d,l,c,h,u=this,p=this._body,g=this.getSelection();u._recordUndoState(g),u._getRangeAndRemoveBookmark(g),s=g.startContainer,d=g.startOffset,l=g.endContainer,c=g.endOffset,h=ht(g);var v=this.createElement("DIV",{style:"position: absolute; overflow: hidden; top:"+(p.scrollTop+(h?h.getBoundingClientRect().top:0))+"px; left: 0; width: 1px; height: 1px;"});p.appendChild(v),g.selectNodeContents(v),this.setSelection(g),setTimeout(function(){try{var e=N(m(v)),t=e.firstChild,n=u._createRange(s,d,l,c);if(t){t===e.lastChild&&"DIV"===t.nodeName&&e.replaceChild(N(t),t),e.normalize(),Ht(e),qt(e,!1),$t(e),Zt(e);for(var r=e,o=!0;r=f(r);)_(r);u.fireEvent("willPaste",{fragment:e,preventDefault:function(){o=!1}}),o&&(st(n,e),j||u._docWasChanged(),n.collapse(!1),u._ensureBottomLine())}u.setSelection(n),u._updatePath(n,!0),u._awaitingPaste=!1}catch(i){u.didError(i)}},0)}};var jt={8:"backspace",9:"tab",13:"enter",32:"space",37:"left",39:"right",46:"delete",219:"[",221:"]"};yt._onKey=function(e){var t=e.keyCode,n=jt[t],r="",o=this.getSelection();n||(n=String.fromCharCode(t).toLowerCase(),/^[A-Za-z0-9]$/.test(n)||(n="")),V&&46===e.which&&(n="."),t>111&&124>t&&(n="f"+(t-111)),"backspace"!==n&&"delete"!==n&&(e.altKey&&(r+="alt-"),e.ctrlKey&&(r+="ctrl-"),e.metaKey&&(r+="meta-")),e.shiftKey&&(r+="shift-"),n=r+n,this._keyHandlers[n]?this._keyHandlers[n](this,e,o):1!==n.length||o.collapsed||(this._recordUndoState(o),this._getRangeAndRemoveBookmark(o),at(o),this._ensureBottomLine(),this.setSelection(o),this._updatePath(o,!0))},yt.setKeyHandler=function(e,t){return this._keyHandlers[e]=t,this},yt._getHTML=function(){return this._body.innerHTML},yt._setHTML=function(e){var t=this._body;t.innerHTML=e;do _(t);while(t=f(t));this._ignoreChange=!0},yt.getHTML=function(e){var t,n,r,o,i,a=[];if(e&&(i=this.getSelection())&&this._saveRangeToBookmark(i),Q)for(t=this._body;t=f(t);)t.textContent||t.querySelector("BR")||(n=this.createElement("BR"),t.appendChild(n),a.push(n));if(r=this._getHTML().replace(/\u200B/g,""),Q)for(o=a.length;o--;)m(a[o]);return i&&this._getRangeAndRemoveBookmark(i),r
},yt.setHTML=function(e){var t,n=this._doc.createDocumentFragment(),r=this.createElement("DIV");r.innerHTML=e,n.appendChild(N(r)),qt(n,!0),$t(n),S(n);for(var o=n;o=f(o);)_(o);this._ignoreChange=!0;for(var i=this._body;t=i.lastChild;)i.removeChild(t);i.appendChild(n),_(i),this._undoIndex=-1,this._undoStack.length=0,this._undoStackLength=0,this._isInUndoState=!1;var a=this._getRangeAndRemoveBookmark()||this._createRange(i.firstChild,0);return this._recordUndoState(a),this._getRangeAndRemoveBookmark(a),$?this._lastSelection=a:this.setSelection(a),this._updatePath(a,!0),this},yt.insertElement=function(e,t){if(t||(t=this.getSelection()),t.collapse(!0),s(e))ot(t,e),t.setStartAfter(e);else{for(var n,r,o=this._body,i=ht(t)||o;i!==o&&!i.nextSibling;)i=i.parentNode;i!==o&&(n=i.parentNode,r=y(n,i.nextSibling,o)),r?(o.insertBefore(e,r),t.setStart(r,0),t.setStart(r,0),lt(t)):(o.appendChild(e),o.appendChild(this.createDefaultBlock()),t.setStart(e,0),t.setEnd(e,0)),this.focus(),this.setSelection(t),this._updatePath(t)}return this},yt.insertImage=function(e){var t=this.createElement("IMG",{src:e});return this.insertElement(t),t},yt.insertHTML=function(e){var t=this.getSelection(),n=this._doc.createDocumentFragment(),r=this.createElement("DIV");r.innerHTML=e,n.appendChild(N(r)),this._recordUndoState(t),this._getRangeAndRemoveBookmark(t);try{n.normalize(),Ht(n),qt(n,!0),$t(n),Zt(n),S(n);for(var o=n;o=f(o);)_(o);st(t,n),j||this._docWasChanged(),t.collapse(!1),this._ensureBottomLine(),this.setSelection(t),this._updatePath(t,!0)}catch(i){this.didError(i)}return this};var Yt=function(e,t,n){return function(){return this[e](t,n),this.focus()}};yt.addStyles=function(e){if(e){var t=this._doc.documentElement.firstChild,n=this.createElement("STYLE",{type:"text/css"});n.styleSheet?(t.appendChild(n),n.styleSheet.cssText=e):(n.appendChild(this._doc.createTextNode(e)),t.appendChild(n))}return this},yt.bold=Yt("changeFormat",{tag:"B"}),yt.italic=Yt("changeFormat",{tag:"I"}),yt.underline=Yt("changeFormat",{tag:"U"}),yt.strikethrough=Yt("changeFormat",{tag:"S"}),yt.subscript=Yt("changeFormat",{tag:"SUB"},{tag:"SUP"}),yt.superscript=Yt("changeFormat",{tag:"SUP"},{tag:"SUB"}),yt.removeBold=Yt("changeFormat",null,{tag:"B"}),yt.removeItalic=Yt("changeFormat",null,{tag:"I"}),yt.removeUnderline=Yt("changeFormat",null,{tag:"U"}),yt.removeStrikethrough=Yt("changeFormat",null,{tag:"S"}),yt.removeSubscript=Yt("changeFormat",null,{tag:"SUB"}),yt.removeSuperscript=Yt("changeFormat",null,{tag:"SUP"}),yt.makeLink=function(e,t){var n=this.getSelection();if(n.collapsed){var r=e.indexOf(":")+1;if(r)for(;"/"===e[r];)r+=1;ot(n,this._doc.createTextNode(e.slice(r)))}return t||(t={}),t.href=e,this.changeFormat({tag:"A",attributes:t},{tag:"A"},n),this.focus()},yt.removeLink=function(){return this.changeFormat(null,{tag:"A"},this.getSelection(),!0),this.focus()},yt.setFontFace=function(e){return this.changeFormat({tag:"SPAN",attributes:{"class":"font",style:"font-family: "+e+", sans-serif;"}},{tag:"SPAN",attributes:{"class":"font"}}),this.focus()},yt.setFontSize=function(e){return this.changeFormat({tag:"SPAN",attributes:{"class":"size",style:"font-size: "+("number"==typeof e?e+"px":e)}},{tag:"SPAN",attributes:{"class":"size"}}),this.focus()},yt.setTextColour=function(e){return this.changeFormat({tag:"SPAN",attributes:{"class":"colour",style:"color: "+e}},{tag:"SPAN",attributes:{"class":"colour"}}),this.focus()},yt.setHighlightColour=function(e){return this.changeFormat({tag:"SPAN",attributes:{"class":"highlight",style:"background-color: "+e}},{tag:"SPAN",attributes:{"class":"highlight"}}),this.focus()},yt.setTextAlignment=function(e){return this.forEachBlock(function(t){t.className=(t.className.split(/\s+/).filter(function(e){return!/align/.test(e)}).join(" ")+" align-"+e).trim(),t.style.textAlign=e},!0),this.focus()},yt.setTextDirection=function(e){return this.forEachBlock(function(t){t.className=(t.className.split(/\s+/).filter(function(e){return!/dir/.test(e)}).join(" ")+" dir-"+e).trim(),t.dir=e},!0),this.focus()},yt.increaseQuoteLevel=Yt("modifyBlocks",Ot),yt.decreaseQuoteLevel=Yt("modifyBlocks",xt),yt.makeUnorderedList=Yt("modifyBlocks",Dt),yt.makeOrderedList=Yt("modifyBlocks",Ut),yt.removeList=Yt("modifyBlocks",It),yt.increaseListLevel=Yt("modifyBlocks",Pt),yt.decreaseListLevel=Yt("modifyBlocks",wt),top!==F?(F.editor=new b(e),F.onEditorLoad&&(F.onEditorLoad(F.editor),F.onEditorLoad=null)):F.Squire=b}(document);
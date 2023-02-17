/*!
 * @toast-ui/editor
 * @version 3.2.2 | Fri Feb 17 2023
 * @author NHN Cloud FE Development Lab <dl_javascript@nhn.com>
 * @license MIT
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("prosemirror-inputrules"), require("prosemirror-keymap"), require("prosemirror-model"), require("prosemirror-state"), require("prosemirror-view"));
	else if(typeof define === 'function' && define.amd)
		define(["prosemirror-inputrules", "prosemirror-keymap", "prosemirror-model", "prosemirror-state", "prosemirror-view"], factory);
	else if(typeof exports === 'object')
		exports["toastui"] = factory(require("prosemirror-inputrules"), require("prosemirror-keymap"), require("prosemirror-model"), require("prosemirror-state"), require("prosemirror-view"));
	else
		root["toastui"] = root["toastui"] || {}, root["toastui"]["Editor"] = factory(root[undefined], root[undefined], root[undefined], root[undefined], root[undefined]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__479__, __WEBPACK_EXTERNAL_MODULE__481__, __WEBPACK_EXTERNAL_MODULE__43__, __WEBPACK_EXTERNAL_MODULE__814__, __WEBPACK_EXTERNAL_MODULE__311__) {
return /******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 368:
/***/ (function(module) {

/*! @license DOMPurify 2.3.3 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/2.3.3/LICENSE */

(function (global, factory) {
   true ? module.exports = factory() :
  0;
}(this, function () { 'use strict';

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

  var hasOwnProperty = Object.hasOwnProperty,
      setPrototypeOf = Object.setPrototypeOf,
      isFrozen = Object.isFrozen,
      getPrototypeOf = Object.getPrototypeOf,
      getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var freeze = Object.freeze,
      seal = Object.seal,
      create = Object.create; // eslint-disable-line import/no-mutable-exports

  var _ref = typeof Reflect !== 'undefined' && Reflect,
      apply = _ref.apply,
      construct = _ref.construct;

  if (!apply) {
    apply = function apply(fun, thisValue, args) {
      return fun.apply(thisValue, args);
    };
  }

  if (!freeze) {
    freeze = function freeze(x) {
      return x;
    };
  }

  if (!seal) {
    seal = function seal(x) {
      return x;
    };
  }

  if (!construct) {
    construct = function construct(Func, args) {
      return new (Function.prototype.bind.apply(Func, [null].concat(_toConsumableArray(args))))();
    };
  }

  var arrayForEach = unapply(Array.prototype.forEach);
  var arrayPop = unapply(Array.prototype.pop);
  var arrayPush = unapply(Array.prototype.push);

  var stringToLowerCase = unapply(String.prototype.toLowerCase);
  var stringMatch = unapply(String.prototype.match);
  var stringReplace = unapply(String.prototype.replace);
  var stringIndexOf = unapply(String.prototype.indexOf);
  var stringTrim = unapply(String.prototype.trim);

  var regExpTest = unapply(RegExp.prototype.test);

  var typeErrorCreate = unconstruct(TypeError);

  function unapply(func) {
    return function (thisArg) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return apply(func, thisArg, args);
    };
  }

  function unconstruct(func) {
    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return construct(func, args);
    };
  }

  /* Add properties to a lookup table */
  function addToSet(set, array) {
    if (setPrototypeOf) {
      // Make 'in' and truthy checks like Boolean(set.constructor)
      // independent of any properties defined on Object.prototype.
      // Prevent prototype setters from intercepting set as a this value.
      setPrototypeOf(set, null);
    }

    var l = array.length;
    while (l--) {
      var element = array[l];
      if (typeof element === 'string') {
        var lcElement = stringToLowerCase(element);
        if (lcElement !== element) {
          // Config presets (e.g. tags.js, attrs.js) are immutable.
          if (!isFrozen(array)) {
            array[l] = lcElement;
          }

          element = lcElement;
        }
      }

      set[element] = true;
    }

    return set;
  }

  /* Shallow clone an object */
  function clone(object) {
    var newObject = create(null);

    var property = void 0;
    for (property in object) {
      if (apply(hasOwnProperty, object, [property])) {
        newObject[property] = object[property];
      }
    }

    return newObject;
  }

  /* IE10 doesn't support __lookupGetter__ so lets'
   * simulate it. It also automatically checks
   * if the prop is function or getter and behaves
   * accordingly. */
  function lookupGetter(object, prop) {
    while (object !== null) {
      var desc = getOwnPropertyDescriptor(object, prop);
      if (desc) {
        if (desc.get) {
          return unapply(desc.get);
        }

        if (typeof desc.value === 'function') {
          return unapply(desc.value);
        }
      }

      object = getPrototypeOf(object);
    }

    function fallbackValue(element) {
      console.warn('fallback value for', element);
      return null;
    }

    return fallbackValue;
  }

  var html = freeze(['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']);

  // SVG
  var svg = freeze(['svg', 'a', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'stop', 'style', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'view', 'vkern']);

  var svgFilters = freeze(['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence']);

  // List of SVG elements that are disallowed by default.
  // We still need to know them so that we can do namespace
  // checks properly in case one wants to add them to
  // allow-list.
  var svgDisallowed = freeze(['animate', 'color-profile', 'cursor', 'discard', 'fedropshadow', 'feimage', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignobject', 'hatch', 'hatchpath', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'missing-glyph', 'script', 'set', 'solidcolor', 'unknown', 'use']);

  var mathMl = freeze(['math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover']);

  // Similarly to SVG, we want to know all MathML elements,
  // even those that we disallow by default.
  var mathMlDisallowed = freeze(['maction', 'maligngroup', 'malignmark', 'mlongdiv', 'mscarries', 'mscarry', 'msgroup', 'mstack', 'msline', 'msrow', 'semantics', 'annotation', 'annotation-xml', 'mprescripts', 'none']);

  var text = freeze(['#text']);

  var html$1 = freeze(['accept', 'action', 'align', 'alt', 'autocapitalize', 'autocomplete', 'autopictureinpicture', 'autoplay', 'background', 'bgcolor', 'border', 'capture', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'controlslist', 'coords', 'crossorigin', 'datetime', 'decoding', 'default', 'dir', 'disabled', 'disablepictureinpicture', 'disableremoteplayback', 'download', 'draggable', 'enctype', 'enterkeyhint', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'inputmode', 'integrity', 'ismap', 'kind', 'label', 'lang', 'list', 'loading', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'minlength', 'multiple', 'muted', 'name', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'pattern', 'placeholder', 'playsinline', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'role', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'sizes', 'span', 'srclang', 'start', 'src', 'srcset', 'step', 'style', 'summary', 'tabindex', 'title', 'translate', 'type', 'usemap', 'valign', 'value', 'width', 'xmlns', 'slot']);

  var svg$1 = freeze(['accent-height', 'accumulate', 'additive', 'alignment-baseline', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'class', 'clip', 'clippathunits', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterunits', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'height', 'href', 'id', 'image-rendering', 'in', 'in2', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lang', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'media', 'method', 'mode', 'min', 'name', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'preserveaspectratio', 'primitiveunits', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'specularconstant', 'specularexponent', 'spreadmethod', 'startoffset', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'style', 'surfacescale', 'systemlanguage', 'tabindex', 'targetx', 'targety', 'transform', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'type', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'width', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2', 'z', 'zoomandpan']);

  var mathMl$1 = freeze(['accent', 'accentunder', 'align', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'dir', 'display', 'displaystyle', 'encoding', 'fence', 'frame', 'height', 'href', 'id', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset', 'width', 'xmlns']);

  var xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

  // eslint-disable-next-line unicorn/better-regex
  var MUSTACHE_EXPR = seal(/\{\{[\s\S]*|[\s\S]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode
  var ERB_EXPR = seal(/<%[\s\S]*|[\s\S]*%>/gm);
  var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/); // eslint-disable-line no-useless-escape
  var ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape
  var IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
  );
  var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
  var ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g // eslint-disable-line no-control-regex
  );

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

  function _toConsumableArray$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

  var getGlobal = function getGlobal() {
    return typeof window === 'undefined' ? null : window;
  };

  /**
   * Creates a no-op policy for internal use only.
   * Don't export this function outside this module!
   * @param {?TrustedTypePolicyFactory} trustedTypes The policy factory.
   * @param {Document} document The document object (to determine policy name suffix)
   * @return {?TrustedTypePolicy} The policy created (or null, if Trusted Types
   * are not supported).
   */
  var _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, document) {
    if ((typeof trustedTypes === 'undefined' ? 'undefined' : _typeof(trustedTypes)) !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
      return null;
    }

    // Allow the callers to control the unique policy name
    // by adding a data-tt-policy-suffix to the script element with the DOMPurify.
    // Policy creation with duplicate names throws in Trusted Types.
    var suffix = null;
    var ATTR_NAME = 'data-tt-policy-suffix';
    if (document.currentScript && document.currentScript.hasAttribute(ATTR_NAME)) {
      suffix = document.currentScript.getAttribute(ATTR_NAME);
    }

    var policyName = 'dompurify' + (suffix ? '#' + suffix : '');

    try {
      return trustedTypes.createPolicy(policyName, {
        createHTML: function createHTML(html$$1) {
          return html$$1;
        }
      });
    } catch (_) {
      // Policy creation failed (most likely another DOMPurify script has
      // already run). Skip creating the policy, as this will only cause errors
      // if TT are enforced.
      console.warn('TrustedTypes policy ' + policyName + ' could not be created.');
      return null;
    }
  };

  function createDOMPurify() {
    var window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();

    var DOMPurify = function DOMPurify(root) {
      return createDOMPurify(root);
    };

    /**
     * Version label, exposed for easier checks
     * if DOMPurify is up to date or not
     */
    DOMPurify.version = '2.3.3';

    /**
     * Array of elements that DOMPurify removed during sanitation.
     * Empty if nothing was removed.
     */
    DOMPurify.removed = [];

    if (!window || !window.document || window.document.nodeType !== 9) {
      // Not running in a browser, provide a factory function
      // so that you can pass your own Window
      DOMPurify.isSupported = false;

      return DOMPurify;
    }

    var originalDocument = window.document;

    var document = window.document;
    var DocumentFragment = window.DocumentFragment,
        HTMLTemplateElement = window.HTMLTemplateElement,
        Node = window.Node,
        Element = window.Element,
        NodeFilter = window.NodeFilter,
        _window$NamedNodeMap = window.NamedNodeMap,
        NamedNodeMap = _window$NamedNodeMap === undefined ? window.NamedNodeMap || window.MozNamedAttrMap : _window$NamedNodeMap,
        Text = window.Text,
        Comment = window.Comment,
        DOMParser = window.DOMParser,
        trustedTypes = window.trustedTypes;


    var ElementPrototype = Element.prototype;

    var cloneNode = lookupGetter(ElementPrototype, 'cloneNode');
    var getNextSibling = lookupGetter(ElementPrototype, 'nextSibling');
    var getChildNodes = lookupGetter(ElementPrototype, 'childNodes');
    var getParentNode = lookupGetter(ElementPrototype, 'parentNode');

    // As per issue #47, the web-components registry is inherited by a
    // new document created via createHTMLDocument. As per the spec
    // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
    // a new empty registry is used when creating a template contents owner
    // document, so we use that as our parent document to ensure nothing
    // is inherited.
    if (typeof HTMLTemplateElement === 'function') {
      var template = document.createElement('template');
      if (template.content && template.content.ownerDocument) {
        document = template.content.ownerDocument;
      }
    }

    var trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, originalDocument);
    var emptyHTML = trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML('') : '';

    var _document = document,
        implementation = _document.implementation,
        createNodeIterator = _document.createNodeIterator,
        createDocumentFragment = _document.createDocumentFragment,
        getElementsByTagName = _document.getElementsByTagName;
    var importNode = originalDocument.importNode;


    var documentMode = {};
    try {
      documentMode = clone(document).documentMode ? document.documentMode : {};
    } catch (_) {}

    var hooks = {};

    /**
     * Expose whether this browser supports running the full DOMPurify.
     */
    DOMPurify.isSupported = typeof getParentNode === 'function' && implementation && typeof implementation.createHTMLDocument !== 'undefined' && documentMode !== 9;

    var MUSTACHE_EXPR$$1 = MUSTACHE_EXPR,
        ERB_EXPR$$1 = ERB_EXPR,
        DATA_ATTR$$1 = DATA_ATTR,
        ARIA_ATTR$$1 = ARIA_ATTR,
        IS_SCRIPT_OR_DATA$$1 = IS_SCRIPT_OR_DATA,
        ATTR_WHITESPACE$$1 = ATTR_WHITESPACE;
    var IS_ALLOWED_URI$$1 = IS_ALLOWED_URI;

    /**
     * We consider the elements and attributes below to be safe. Ideally
     * don't add any new ones but feel free to remove unwanted ones.
     */

    /* allowed element names */

    var ALLOWED_TAGS = null;
    var DEFAULT_ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray$1(html), _toConsumableArray$1(svg), _toConsumableArray$1(svgFilters), _toConsumableArray$1(mathMl), _toConsumableArray$1(text)));

    /* Allowed attribute names */
    var ALLOWED_ATTR = null;
    var DEFAULT_ALLOWED_ATTR = addToSet({}, [].concat(_toConsumableArray$1(html$1), _toConsumableArray$1(svg$1), _toConsumableArray$1(mathMl$1), _toConsumableArray$1(xml)));

    /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */
    var FORBID_TAGS = null;

    /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */
    var FORBID_ATTR = null;

    /* Decide if ARIA attributes are okay */
    var ALLOW_ARIA_ATTR = true;

    /* Decide if custom data attributes are okay */
    var ALLOW_DATA_ATTR = true;

    /* Decide if unknown protocols are okay */
    var ALLOW_UNKNOWN_PROTOCOLS = false;

    /* Output should be safe for common template engines.
     * This means, DOMPurify removes data attributes, mustaches and ERB
     */
    var SAFE_FOR_TEMPLATES = false;

    /* Decide if document with <html>... should be returned */
    var WHOLE_DOCUMENT = false;

    /* Track whether config is already set on this instance of DOMPurify. */
    var SET_CONFIG = false;

    /* Decide if all elements (e.g. style, script) must be children of
     * document.body. By default, browsers might move them to document.head */
    var FORCE_BODY = false;

    /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
     * string (or a TrustedHTML object if Trusted Types are supported).
     * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
     */
    var RETURN_DOM = false;

    /* Decide if a DOM `DocumentFragment` should be returned, instead of a html
     * string  (or a TrustedHTML object if Trusted Types are supported) */
    var RETURN_DOM_FRAGMENT = false;

    /* If `RETURN_DOM` or `RETURN_DOM_FRAGMENT` is enabled, decide if the returned DOM
     * `Node` is imported into the current `Document`. If this flag is not enabled the
     * `Node` will belong (its ownerDocument) to a fresh `HTMLDocument`, created by
     * DOMPurify.
     *
     * This defaults to `true` starting DOMPurify 2.2.0. Note that setting it to `false`
     * might cause XSS from attacks hidden in closed shadowroots in case the browser
     * supports Declarative Shadow: DOM https://web.dev/declarative-shadow-dom/
     */
    var RETURN_DOM_IMPORT = true;

    /* Try to return a Trusted Type object instead of a string, return a string in
     * case Trusted Types are not supported  */
    var RETURN_TRUSTED_TYPE = false;

    /* Output should be free from DOM clobbering attacks? */
    var SANITIZE_DOM = true;

    /* Keep element content when removing element? */
    var KEEP_CONTENT = true;

    /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
     * of importing it into a new Document and returning a sanitized copy */
    var IN_PLACE = false;

    /* Allow usage of profiles like html, svg and mathMl */
    var USE_PROFILES = {};

    /* Tags to ignore content of when KEEP_CONTENT is true */
    var FORBID_CONTENTS = null;
    var DEFAULT_FORBID_CONTENTS = addToSet({}, ['annotation-xml', 'audio', 'colgroup', 'desc', 'foreignobject', 'head', 'iframe', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'noembed', 'noframes', 'noscript', 'plaintext', 'script', 'style', 'svg', 'template', 'thead', 'title', 'video', 'xmp']);

    /* Tags that are safe for data: URIs */
    var DATA_URI_TAGS = null;
    var DEFAULT_DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image', 'track']);

    /* Attributes safe for values like "javascript:" */
    var URI_SAFE_ATTRIBUTES = null;
    var DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'role', 'summary', 'title', 'value', 'style', 'xmlns']);

    var MATHML_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
    var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    var HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
    /* Document namespace */
    var NAMESPACE = HTML_NAMESPACE;
    var IS_EMPTY_INPUT = false;

    /* Parsing of strict XHTML documents */
    var PARSER_MEDIA_TYPE = void 0;
    var SUPPORTED_PARSER_MEDIA_TYPES = ['application/xhtml+xml', 'text/html'];
    var DEFAULT_PARSER_MEDIA_TYPE = 'text/html';
    var transformCaseFunc = void 0;

    /* Keep a reference to config to pass to hooks */
    var CONFIG = null;

    /* Ideally, do not touch anything below this line */
    /* ______________________________________________ */

    var formElement = document.createElement('form');

    /**
     * _parseConfig
     *
     * @param  {Object} cfg optional config literal
     */
    // eslint-disable-next-line complexity
    var _parseConfig = function _parseConfig(cfg) {
      if (CONFIG && CONFIG === cfg) {
        return;
      }

      /* Shield configuration object from tampering */
      if (!cfg || (typeof cfg === 'undefined' ? 'undefined' : _typeof(cfg)) !== 'object') {
        cfg = {};
      }

      /* Shield configuration object from prototype pollution */
      cfg = clone(cfg);

      /* Set configuration parameters */
      ALLOWED_TAGS = 'ALLOWED_TAGS' in cfg ? addToSet({}, cfg.ALLOWED_TAGS) : DEFAULT_ALLOWED_TAGS;
      ALLOWED_ATTR = 'ALLOWED_ATTR' in cfg ? addToSet({}, cfg.ALLOWED_ATTR) : DEFAULT_ALLOWED_ATTR;
      URI_SAFE_ATTRIBUTES = 'ADD_URI_SAFE_ATTR' in cfg ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR) : DEFAULT_URI_SAFE_ATTRIBUTES;
      DATA_URI_TAGS = 'ADD_DATA_URI_TAGS' in cfg ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS) : DEFAULT_DATA_URI_TAGS;
      FORBID_CONTENTS = 'FORBID_CONTENTS' in cfg ? addToSet({}, cfg.FORBID_CONTENTS) : DEFAULT_FORBID_CONTENTS;
      FORBID_TAGS = 'FORBID_TAGS' in cfg ? addToSet({}, cfg.FORBID_TAGS) : {};
      FORBID_ATTR = 'FORBID_ATTR' in cfg ? addToSet({}, cfg.FORBID_ATTR) : {};
      USE_PROFILES = 'USE_PROFILES' in cfg ? cfg.USE_PROFILES : false;
      ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true
      ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true
      ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false
      SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false
      WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false
      RETURN_DOM = cfg.RETURN_DOM || false; // Default false
      RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false
      RETURN_DOM_IMPORT = cfg.RETURN_DOM_IMPORT !== false; // Default true
      RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false
      FORCE_BODY = cfg.FORCE_BODY || false; // Default false
      SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true
      KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true
      IN_PLACE = cfg.IN_PLACE || false; // Default false
      IS_ALLOWED_URI$$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI$$1;
      NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;

      PARSER_MEDIA_TYPE =
      // eslint-disable-next-line unicorn/prefer-includes
      SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? PARSER_MEDIA_TYPE = DEFAULT_PARSER_MEDIA_TYPE : PARSER_MEDIA_TYPE = cfg.PARSER_MEDIA_TYPE;

      // HTML tags and attributes are not case-sensitive, converting to lowercase. Keeping XHTML as is.
      transformCaseFunc = PARSER_MEDIA_TYPE === 'application/xhtml+xml' ? function (x) {
        return x;
      } : stringToLowerCase;

      if (SAFE_FOR_TEMPLATES) {
        ALLOW_DATA_ATTR = false;
      }

      if (RETURN_DOM_FRAGMENT) {
        RETURN_DOM = true;
      }

      /* Parse profile info */
      if (USE_PROFILES) {
        ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray$1(text)));
        ALLOWED_ATTR = [];
        if (USE_PROFILES.html === true) {
          addToSet(ALLOWED_TAGS, html);
          addToSet(ALLOWED_ATTR, html$1);
        }

        if (USE_PROFILES.svg === true) {
          addToSet(ALLOWED_TAGS, svg);
          addToSet(ALLOWED_ATTR, svg$1);
          addToSet(ALLOWED_ATTR, xml);
        }

        if (USE_PROFILES.svgFilters === true) {
          addToSet(ALLOWED_TAGS, svgFilters);
          addToSet(ALLOWED_ATTR, svg$1);
          addToSet(ALLOWED_ATTR, xml);
        }

        if (USE_PROFILES.mathMl === true) {
          addToSet(ALLOWED_TAGS, mathMl);
          addToSet(ALLOWED_ATTR, mathMl$1);
          addToSet(ALLOWED_ATTR, xml);
        }
      }

      /* Merge configuration parameters */
      if (cfg.ADD_TAGS) {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }

        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS);
      }

      if (cfg.ADD_ATTR) {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }

        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR);
      }

      if (cfg.ADD_URI_SAFE_ATTR) {
        addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR);
      }

      if (cfg.FORBID_CONTENTS) {
        if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
          FORBID_CONTENTS = clone(FORBID_CONTENTS);
        }

        addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS);
      }

      /* Add #text in case KEEP_CONTENT is set to true */
      if (KEEP_CONTENT) {
        ALLOWED_TAGS['#text'] = true;
      }

      /* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */
      if (WHOLE_DOCUMENT) {
        addToSet(ALLOWED_TAGS, ['html', 'head', 'body']);
      }

      /* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */
      if (ALLOWED_TAGS.table) {
        addToSet(ALLOWED_TAGS, ['tbody']);
        delete FORBID_TAGS.tbody;
      }

      // Prevent further manipulation of configuration.
      // Not available in IE8, Safari 5, etc.
      if (freeze) {
        freeze(cfg);
      }

      CONFIG = cfg;
    };

    var MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ['mi', 'mo', 'mn', 'ms', 'mtext']);

    var HTML_INTEGRATION_POINTS = addToSet({}, ['foreignobject', 'desc', 'title', 'annotation-xml']);

    /* Keep track of all possible SVG and MathML tags
     * so that we can perform the namespace checks
     * correctly. */
    var ALL_SVG_TAGS = addToSet({}, svg);
    addToSet(ALL_SVG_TAGS, svgFilters);
    addToSet(ALL_SVG_TAGS, svgDisallowed);

    var ALL_MATHML_TAGS = addToSet({}, mathMl);
    addToSet(ALL_MATHML_TAGS, mathMlDisallowed);

    /**
     *
     *
     * @param  {Element} element a DOM element whose namespace is being checked
     * @returns {boolean} Return false if the element has a
     *  namespace that a spec-compliant parser would never
     *  return. Return true otherwise.
     */
    var _checkValidNamespace = function _checkValidNamespace(element) {
      var parent = getParentNode(element);

      // In JSDOM, if we're inside shadow DOM, then parentNode
      // can be null. We just simulate parent in this case.
      if (!parent || !parent.tagName) {
        parent = {
          namespaceURI: HTML_NAMESPACE,
          tagName: 'template'
        };
      }

      var tagName = stringToLowerCase(element.tagName);
      var parentTagName = stringToLowerCase(parent.tagName);

      if (element.namespaceURI === SVG_NAMESPACE) {
        // The only way to switch from HTML namespace to SVG
        // is via <svg>. If it happens via any other tag, then
        // it should be killed.
        if (parent.namespaceURI === HTML_NAMESPACE) {
          return tagName === 'svg';
        }

        // The only way to switch from MathML to SVG is via
        // svg if parent is either <annotation-xml> or MathML
        // text integration points.
        if (parent.namespaceURI === MATHML_NAMESPACE) {
          return tagName === 'svg' && (parentTagName === 'annotation-xml' || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
        }

        // We only allow elements that are defined in SVG
        // spec. All others are disallowed in SVG namespace.
        return Boolean(ALL_SVG_TAGS[tagName]);
      }

      if (element.namespaceURI === MATHML_NAMESPACE) {
        // The only way to switch from HTML namespace to MathML
        // is via <math>. If it happens via any other tag, then
        // it should be killed.
        if (parent.namespaceURI === HTML_NAMESPACE) {
          return tagName === 'math';
        }

        // The only way to switch from SVG to MathML is via
        // <math> and HTML integration points
        if (parent.namespaceURI === SVG_NAMESPACE) {
          return tagName === 'math' && HTML_INTEGRATION_POINTS[parentTagName];
        }

        // We only allow elements that are defined in MathML
        // spec. All others are disallowed in MathML namespace.
        return Boolean(ALL_MATHML_TAGS[tagName]);
      }

      if (element.namespaceURI === HTML_NAMESPACE) {
        // The only way to switch from SVG to HTML is via
        // HTML integration points, and from MathML to HTML
        // is via MathML text integration points
        if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
          return false;
        }

        if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
          return false;
        }

        // Certain elements are allowed in both SVG and HTML
        // namespace. We need to specify them explicitly
        // so that they don't get erronously deleted from
        // HTML namespace.
        var commonSvgAndHTMLElements = addToSet({}, ['title', 'style', 'font', 'a', 'script']);

        // We disallow tags that are specific for MathML
        // or SVG and should never appear in HTML namespace
        return !ALL_MATHML_TAGS[tagName] && (commonSvgAndHTMLElements[tagName] || !ALL_SVG_TAGS[tagName]);
      }

      // The code should never reach this place (this means
      // that the element somehow got namespace that is not
      // HTML, SVG or MathML). Return false just in case.
      return false;
    };

    /**
     * _forceRemove
     *
     * @param  {Node} node a DOM node
     */
    var _forceRemove = function _forceRemove(node) {
      arrayPush(DOMPurify.removed, { element: node });
      try {
        // eslint-disable-next-line unicorn/prefer-dom-node-remove
        node.parentNode.removeChild(node);
      } catch (_) {
        try {
          node.outerHTML = emptyHTML;
        } catch (_) {
          node.remove();
        }
      }
    };

    /**
     * _removeAttribute
     *
     * @param  {String} name an Attribute name
     * @param  {Node} node a DOM node
     */
    var _removeAttribute = function _removeAttribute(name, node) {
      try {
        arrayPush(DOMPurify.removed, {
          attribute: node.getAttributeNode(name),
          from: node
        });
      } catch (_) {
        arrayPush(DOMPurify.removed, {
          attribute: null,
          from: node
        });
      }

      node.removeAttribute(name);

      // We void attribute values for unremovable "is"" attributes
      if (name === 'is' && !ALLOWED_ATTR[name]) {
        if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
          try {
            _forceRemove(node);
          } catch (_) {}
        } else {
          try {
            node.setAttribute(name, '');
          } catch (_) {}
        }
      }
    };

    /**
     * _initDocument
     *
     * @param  {String} dirty a string of dirty markup
     * @return {Document} a DOM, filled with the dirty markup
     */
    var _initDocument = function _initDocument(dirty) {
      /* Create a HTML document */
      var doc = void 0;
      var leadingWhitespace = void 0;

      if (FORCE_BODY) {
        dirty = '<remove></remove>' + dirty;
      } else {
        /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
        var matches = stringMatch(dirty, /^[\r\n\t ]+/);
        leadingWhitespace = matches && matches[0];
      }

      if (PARSER_MEDIA_TYPE === 'application/xhtml+xml') {
        // Root of XHTML doc must contain xmlns declaration (see https://www.w3.org/TR/xhtml1/normative.html#strict)
        dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + '</body></html>';
      }

      var dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
      /*
       * Use the DOMParser API by default, fallback later if needs be
       * DOMParser not work for svg when has multiple root element.
       */
      if (NAMESPACE === HTML_NAMESPACE) {
        try {
          doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
        } catch (_) {}
      }

      /* Use createHTMLDocument in case DOMParser is not available */
      if (!doc || !doc.documentElement) {
        doc = implementation.createDocument(NAMESPACE, 'template', null);
        try {
          doc.documentElement.innerHTML = IS_EMPTY_INPUT ? '' : dirtyPayload;
        } catch (_) {
          // Syntax error if dirtyPayload is invalid xml
        }
      }

      var body = doc.body || doc.documentElement;

      if (dirty && leadingWhitespace) {
        body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
      }

      /* Work on whole document or just its body */
      if (NAMESPACE === HTML_NAMESPACE) {
        return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
      }

      return WHOLE_DOCUMENT ? doc.documentElement : body;
    };

    /**
     * _createIterator
     *
     * @param  {Document} root document/fragment to create iterator for
     * @return {Iterator} iterator instance
     */
    var _createIterator = function _createIterator(root) {
      return createNodeIterator.call(root.ownerDocument || root, root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT, null, false);
    };

    /**
     * _isClobbered
     *
     * @param  {Node} elm element to check for clobbering attacks
     * @return {Boolean} true if clobbered, false if safe
     */
    var _isClobbered = function _isClobbered(elm) {
      if (elm instanceof Text || elm instanceof Comment) {
        return false;
      }

      if (typeof elm.nodeName !== 'string' || typeof elm.textContent !== 'string' || typeof elm.removeChild !== 'function' || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== 'function' || typeof elm.setAttribute !== 'function' || typeof elm.namespaceURI !== 'string' || typeof elm.insertBefore !== 'function') {
        return true;
      }

      return false;
    };

    /**
     * _isNode
     *
     * @param  {Node} obj object to check whether it's a DOM node
     * @return {Boolean} true is object is a DOM node
     */
    var _isNode = function _isNode(object) {
      return (typeof Node === 'undefined' ? 'undefined' : _typeof(Node)) === 'object' ? object instanceof Node : object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string';
    };

    /**
     * _executeHook
     * Execute user configurable hooks
     *
     * @param  {String} entryPoint  Name of the hook's entry point
     * @param  {Node} currentNode node to work on with the hook
     * @param  {Object} data additional hook parameters
     */
    var _executeHook = function _executeHook(entryPoint, currentNode, data) {
      if (!hooks[entryPoint]) {
        return;
      }

      arrayForEach(hooks[entryPoint], function (hook) {
        hook.call(DOMPurify, currentNode, data, CONFIG);
      });
    };

    /**
     * _sanitizeElements
     *
     * @protect nodeName
     * @protect textContent
     * @protect removeChild
     *
     * @param   {Node} currentNode to check for permission to exist
     * @return  {Boolean} true if node was killed, false if left alive
     */
    var _sanitizeElements = function _sanitizeElements(currentNode) {
      var content = void 0;

      /* Execute a hook if present */
      _executeHook('beforeSanitizeElements', currentNode, null);

      /* Check if element is clobbered or can clobber */
      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }

      /* Check if tagname contains Unicode */
      if (stringMatch(currentNode.nodeName, /[\u0080-\uFFFF]/)) {
        _forceRemove(currentNode);
        return true;
      }

      /* Now let's check the element's type and name */
      var tagName = transformCaseFunc(currentNode.nodeName);

      /* Execute a hook if present */
      _executeHook('uponSanitizeElement', currentNode, {
        tagName: tagName,
        allowedTags: ALLOWED_TAGS
      });

      /* Detect mXSS attempts abusing namespace confusion */
      if (!_isNode(currentNode.firstElementChild) && (!_isNode(currentNode.content) || !_isNode(currentNode.content.firstElementChild)) && regExpTest(/<[/\w]/g, currentNode.innerHTML) && regExpTest(/<[/\w]/g, currentNode.textContent)) {
        _forceRemove(currentNode);
        return true;
      }

      /* Mitigate a problem with templates inside select */
      if (tagName === 'select' && regExpTest(/<template/i, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }

      /* Remove element if anything forbids its presence */
      if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
        /* Keep content except for bad-listed elements */
        if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
          var parentNode = getParentNode(currentNode) || currentNode.parentNode;
          var childNodes = getChildNodes(currentNode) || currentNode.childNodes;

          if (childNodes && parentNode) {
            var childCount = childNodes.length;

            for (var i = childCount - 1; i >= 0; --i) {
              parentNode.insertBefore(cloneNode(childNodes[i], true), getNextSibling(currentNode));
            }
          }
        }

        _forceRemove(currentNode);
        return true;
      }

      /* Check whether element has a valid namespace */
      if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }

      if ((tagName === 'noscript' || tagName === 'noembed') && regExpTest(/<\/no(script|embed)/i, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }

      /* Sanitize element content to be template-safe */
      if (SAFE_FOR_TEMPLATES && currentNode.nodeType === 3) {
        /* Get the element's text content */
        content = currentNode.textContent;
        content = stringReplace(content, MUSTACHE_EXPR$$1, ' ');
        content = stringReplace(content, ERB_EXPR$$1, ' ');
        if (currentNode.textContent !== content) {
          arrayPush(DOMPurify.removed, { element: currentNode.cloneNode() });
          currentNode.textContent = content;
        }
      }

      /* Execute a hook if present */
      _executeHook('afterSanitizeElements', currentNode, null);

      return false;
    };

    /**
     * _isValidAttribute
     *
     * @param  {string} lcTag Lowercase tag name of containing element.
     * @param  {string} lcName Lowercase attribute name.
     * @param  {string} value Attribute value.
     * @return {Boolean} Returns true if `value` is valid, otherwise false.
     */
    // eslint-disable-next-line complexity
    var _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
      /* Make sure attribute cannot clobber */
      if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in document || value in formElement)) {
        return false;
      }

      /* Allow valid data-* attributes: At least one character after "-"
          (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
          XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
          We don't need to check the value; it's always URI safe. */
      if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR$$1, lcName)) ; else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$$1, lcName)) ; else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
        return false;

        /* Check value is safe. First, is attr inert? If so, is safe */
      } else if (URI_SAFE_ATTRIBUTES[lcName]) ; else if (regExpTest(IS_ALLOWED_URI$$1, stringReplace(value, ATTR_WHITESPACE$$1, ''))) ; else if ((lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') && lcTag !== 'script' && stringIndexOf(value, 'data:') === 0 && DATA_URI_TAGS[lcTag]) ; else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$$1, stringReplace(value, ATTR_WHITESPACE$$1, ''))) ; else if (!value) ; else {
        return false;
      }

      return true;
    };

    /**
     * _sanitizeAttributes
     *
     * @protect attributes
     * @protect nodeName
     * @protect removeAttribute
     * @protect setAttribute
     *
     * @param  {Node} currentNode to sanitize
     */
    var _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
      var attr = void 0;
      var value = void 0;
      var lcName = void 0;
      var l = void 0;
      /* Execute a hook if present */
      _executeHook('beforeSanitizeAttributes', currentNode, null);

      var attributes = currentNode.attributes;

      /* Check if we have attributes; if not we might have a text node */

      if (!attributes) {
        return;
      }

      var hookEvent = {
        attrName: '',
        attrValue: '',
        keepAttr: true,
        allowedAttributes: ALLOWED_ATTR
      };
      l = attributes.length;

      /* Go backwards over all attributes; safely remove bad ones */
      while (l--) {
        attr = attributes[l];
        var _attr = attr,
            name = _attr.name,
            namespaceURI = _attr.namespaceURI;

        value = stringTrim(attr.value);
        lcName = transformCaseFunc(name);

        /* Execute a hook if present */
        hookEvent.attrName = lcName;
        hookEvent.attrValue = value;
        hookEvent.keepAttr = true;
        hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set
        _executeHook('uponSanitizeAttribute', currentNode, hookEvent);
        value = hookEvent.attrValue;
        /* Did the hooks approve of the attribute? */
        if (hookEvent.forceKeepAttr) {
          continue;
        }

        /* Remove attribute */
        _removeAttribute(name, currentNode);

        /* Did the hooks approve of the attribute? */
        if (!hookEvent.keepAttr) {
          continue;
        }

        /* Work around a security issue in jQuery 3.0 */
        if (regExpTest(/\/>/i, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }

        /* Sanitize attribute content to be template-safe */
        if (SAFE_FOR_TEMPLATES) {
          value = stringReplace(value, MUSTACHE_EXPR$$1, ' ');
          value = stringReplace(value, ERB_EXPR$$1, ' ');
        }

        /* Is `value` valid for this attribute? */
        var lcTag = transformCaseFunc(currentNode.nodeName);
        if (!_isValidAttribute(lcTag, lcName, value)) {
          continue;
        }

        /* Handle invalid data-* attribute set by try-catching it */
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
            currentNode.setAttribute(name, value);
          }

          arrayPop(DOMPurify.removed);
        } catch (_) {}
      }

      /* Execute a hook if present */
      _executeHook('afterSanitizeAttributes', currentNode, null);
    };

    /**
     * _sanitizeShadowDOM
     *
     * @param  {DocumentFragment} fragment to iterate over recursively
     */
    var _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
      var shadowNode = void 0;
      var shadowIterator = _createIterator(fragment);

      /* Execute a hook if present */
      _executeHook('beforeSanitizeShadowDOM', fragment, null);

      while (shadowNode = shadowIterator.nextNode()) {
        /* Execute a hook if present */
        _executeHook('uponSanitizeShadowNode', shadowNode, null);

        /* Sanitize tags and elements */
        if (_sanitizeElements(shadowNode)) {
          continue;
        }

        /* Deep shadow DOM detected */
        if (shadowNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(shadowNode.content);
        }

        /* Check attributes, sanitize if necessary */
        _sanitizeAttributes(shadowNode);
      }

      /* Execute a hook if present */
      _executeHook('afterSanitizeShadowDOM', fragment, null);
    };

    /**
     * Sanitize
     * Public method providing core sanitation functionality
     *
     * @param {String|Node} dirty string or DOM node
     * @param {Object} configuration object
     */
    // eslint-disable-next-line complexity
    DOMPurify.sanitize = function (dirty, cfg) {
      var body = void 0;
      var importedNode = void 0;
      var currentNode = void 0;
      var oldNode = void 0;
      var returnNode = void 0;
      /* Make sure we have a string to sanitize.
        DO NOT return early, as this will return the wrong type if
        the user has requested a DOM object rather than a string */
      IS_EMPTY_INPUT = !dirty;
      if (IS_EMPTY_INPUT) {
        dirty = '<!-->';
      }

      /* Stringify, in case dirty is an object */
      if (typeof dirty !== 'string' && !_isNode(dirty)) {
        // eslint-disable-next-line no-negated-condition
        if (typeof dirty.toString !== 'function') {
          throw typeErrorCreate('toString is not a function');
        } else {
          dirty = dirty.toString();
          if (typeof dirty !== 'string') {
            throw typeErrorCreate('dirty is not a string, aborting');
          }
        }
      }

      /* Check we can run. Otherwise fall back or ignore */
      if (!DOMPurify.isSupported) {
        if (_typeof(window.toStaticHTML) === 'object' || typeof window.toStaticHTML === 'function') {
          if (typeof dirty === 'string') {
            return window.toStaticHTML(dirty);
          }

          if (_isNode(dirty)) {
            return window.toStaticHTML(dirty.outerHTML);
          }
        }

        return dirty;
      }

      /* Assign config vars */
      if (!SET_CONFIG) {
        _parseConfig(cfg);
      }

      /* Clean up removed elements */
      DOMPurify.removed = [];

      /* Check if dirty is correctly typed for IN_PLACE */
      if (typeof dirty === 'string') {
        IN_PLACE = false;
      }

      if (IN_PLACE) ; else if (dirty instanceof Node) {
        /* If dirty is a DOM element, append to an empty document to avoid
           elements being stripped by the parser */
        body = _initDocument('<!---->');
        importedNode = body.ownerDocument.importNode(dirty, true);
        if (importedNode.nodeType === 1 && importedNode.nodeName === 'BODY') {
          /* Node is already a body, use as is */
          body = importedNode;
        } else if (importedNode.nodeName === 'HTML') {
          body = importedNode;
        } else {
          // eslint-disable-next-line unicorn/prefer-dom-node-append
          body.appendChild(importedNode);
        }
      } else {
        /* Exit directly if we have nothing to do */
        if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT &&
        // eslint-disable-next-line unicorn/prefer-includes
        dirty.indexOf('<') === -1) {
          return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
        }

        /* Initialize the document to work on */
        body = _initDocument(dirty);

        /* Check we have a DOM node from the data */
        if (!body) {
          return RETURN_DOM ? null : emptyHTML;
        }
      }

      /* Remove first element node (ours) if FORCE_BODY is set */
      if (body && FORCE_BODY) {
        _forceRemove(body.firstChild);
      }

      /* Get node iterator */
      var nodeIterator = _createIterator(IN_PLACE ? dirty : body);

      /* Now start iterating over the created document */
      while (currentNode = nodeIterator.nextNode()) {
        /* Fix IE's strange behavior with manipulated textNodes #89 */
        if (currentNode.nodeType === 3 && currentNode === oldNode) {
          continue;
        }

        /* Sanitize tags and elements */
        if (_sanitizeElements(currentNode)) {
          continue;
        }

        /* Shadow DOM detected, sanitize it */
        if (currentNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(currentNode.content);
        }

        /* Check attributes, sanitize if necessary */
        _sanitizeAttributes(currentNode);

        oldNode = currentNode;
      }

      oldNode = null;

      /* If we sanitized `dirty` in-place, return it. */
      if (IN_PLACE) {
        return dirty;
      }

      /* Return sanitized string or DOM */
      if (RETURN_DOM) {
        if (RETURN_DOM_FRAGMENT) {
          returnNode = createDocumentFragment.call(body.ownerDocument);

          while (body.firstChild) {
            // eslint-disable-next-line unicorn/prefer-dom-node-append
            returnNode.appendChild(body.firstChild);
          }
        } else {
          returnNode = body;
        }

        if (RETURN_DOM_IMPORT) {
          /*
            AdoptNode() is not used because internal state is not reset
            (e.g. the past names map of a HTMLFormElement), this is safe
            in theory but we would rather not risk another attack vector.
            The state that is cloned by importNode() is explicitly defined
            by the specs.
          */
          returnNode = importNode.call(originalDocument, returnNode, true);
        }

        return returnNode;
      }

      var serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;

      /* Sanitize final string template-safe */
      if (SAFE_FOR_TEMPLATES) {
        serializedHTML = stringReplace(serializedHTML, MUSTACHE_EXPR$$1, ' ');
        serializedHTML = stringReplace(serializedHTML, ERB_EXPR$$1, ' ');
      }

      return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
    };

    /**
     * Public method to set the configuration once
     * setConfig
     *
     * @param {Object} cfg configuration object
     */
    DOMPurify.setConfig = function (cfg) {
      _parseConfig(cfg);
      SET_CONFIG = true;
    };

    /**
     * Public method to remove the configuration
     * clearConfig
     *
     */
    DOMPurify.clearConfig = function () {
      CONFIG = null;
      SET_CONFIG = false;
    };

    /**
     * Public method to check if an attribute value is valid.
     * Uses last set config, if any. Otherwise, uses config defaults.
     * isValidAttribute
     *
     * @param  {string} tag Tag name of containing element.
     * @param  {string} attr Attribute name.
     * @param  {string} value Attribute value.
     * @return {Boolean} Returns true if `value` is valid. Otherwise, returns false.
     */
    DOMPurify.isValidAttribute = function (tag, attr, value) {
      /* Initialize shared config vars if necessary. */
      if (!CONFIG) {
        _parseConfig({});
      }

      var lcTag = transformCaseFunc(tag);
      var lcName = transformCaseFunc(attr);
      return _isValidAttribute(lcTag, lcName, value);
    };

    /**
     * AddHook
     * Public method to add DOMPurify hooks
     *
     * @param {String} entryPoint entry point for the hook to add
     * @param {Function} hookFunction function to execute
     */
    DOMPurify.addHook = function (entryPoint, hookFunction) {
      if (typeof hookFunction !== 'function') {
        return;
      }

      hooks[entryPoint] = hooks[entryPoint] || [];
      arrayPush(hooks[entryPoint], hookFunction);
    };

    /**
     * RemoveHook
     * Public method to remove a DOMPurify hook at a given entryPoint
     * (pops it from the stack of hooks if more are present)
     *
     * @param {String} entryPoint entry point for the hook to remove
     */
    DOMPurify.removeHook = function (entryPoint) {
      if (hooks[entryPoint]) {
        arrayPop(hooks[entryPoint]);
      }
    };

    /**
     * RemoveHooks
     * Public method to remove all DOMPurify hooks at a given entryPoint
     *
     * @param  {String} entryPoint entry point for the hooks to remove
     */
    DOMPurify.removeHooks = function (entryPoint) {
      if (hooks[entryPoint]) {
        hooks[entryPoint] = [];
      }
    };

    /**
     * RemoveAllHooks
     * Public method to remove all DOMPurify hooks
     *
     */
    DOMPurify.removeAllHooks = function () {
      hooks = {};
    };

    return DOMPurify;
  }

  var purify = createDOMPurify();

  return purify;

}));
//# sourceMappingURL=purify.js.map


/***/ }),

/***/ 928:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/* eslint-disable complexity */
/**
 * @fileoverview Returns the first index at which a given element can be found in the array.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isArray = __webpack_require__(322);

/**
 * @module array
 */

/**
 * Returns the first index at which a given element can be found in the array
 * from start index(default 0), or -1 if it is not present.
 * It compares searchElement to elements of the Array using strict equality
 * (the same method used by the ===, or triple-equals, operator).
 * @param {*} searchElement Element to locate in the array
 * @param {Array} array Array that will be traversed.
 * @param {number} startIndex Start index in array for searching (default 0)
 * @returns {number} the First index at which a given element, or -1 if it is not present
 * @memberof module:array
 * @example
 * // ES6
 * import inArray from 'tui-code-snippet/array/inArray';
 * 
 * // CommonJS
 * const inArray = require('tui-code-snippet/array/inArray');
 *
 * const arr = ['one', 'two', 'three', 'four'];
 * const idx1 = inArray('one', arr, 3); // -1
 * const idx2 = inArray('one', arr); // 0
 */
function inArray(searchElement, array, startIndex) {
  var i;
  var length;
  startIndex = startIndex || 0;

  if (!isArray(array)) {
    return -1;
  }

  if (Array.prototype.indexOf) {
    return Array.prototype.indexOf.call(array, searchElement, startIndex);
  }

  length = array.length;
  for (i = startIndex; startIndex >= 0 && i < length; i += 1) {
    if (array[i] === searchElement) {
      return i;
    }
  }

  return -1;
}

module.exports = inArray;


/***/ }),

/***/ 690:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Execute the provided callback once for each property of object(or element of array) which actually exist.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isArray = __webpack_require__(322);
var forEachArray = __webpack_require__(893);
var forEachOwnProperties = __webpack_require__(956);

/**
 * @module collection
 */

/**
 * Execute the provided callback once for each property of object(or element of array) which actually exist.
 * If the object is Array-like object(ex-arguments object), It needs to transform to Array.(see 'ex2' of example).
 * If the callback function returns false, the loop will be stopped.
 * Callback function(iteratee) is invoked with three arguments:
 *  1) The value of the property(or The value of the element)
 *  2) The name of the property(or The index of the element)
 *  3) The object being traversed
 * @param {Object} obj The object that will be traversed
 * @param {function} iteratee Callback function
 * @param {Object} [context] Context(this) of callback function
 * @memberof module:collection
 * @example
 * // ES6
 * import forEach from 'tui-code-snippet/collection/forEach'; 
 * 
 * // CommonJS
 * const forEach = require('tui-code-snippet/collection/forEach'); 
 *
 * let sum = 0;
 *
 * forEach([1,2,3], function(value){
 *   sum += value;
 * });
 * alert(sum); // 6
 *
 * // In case of Array-like object
 * const array = Array.prototype.slice.call(arrayLike); // change to array
 * forEach(array, function(value){
 *   sum += value;
 * });
 */
function forEach(obj, iteratee, context) {
  if (isArray(obj)) {
    forEachArray(obj, iteratee, context);
  } else {
    forEachOwnProperties(obj, iteratee, context);
  }
}

module.exports = forEach;


/***/ }),

/***/ 893:
/***/ (function(module) {

"use strict";
/**
 * @fileoverview Execute the provided callback once for each element present in the array(or Array-like object) in ascending order.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Execute the provided callback once for each element present
 * in the array(or Array-like object) in ascending order.
 * If the callback function returns false, the loop will be stopped.
 * Callback function(iteratee) is invoked with three arguments:
 *  1) The value of the element
 *  2) The index of the element
 *  3) The array(or Array-like object) being traversed
 * @param {Array|Arguments|NodeList} arr The array(or Array-like object) that will be traversed
 * @param {function} iteratee Callback function
 * @param {Object} [context] Context(this) of callback function
 * @memberof module:collection
 * @example
 * // ES6
 * import forEachArray from 'tui-code-snippet/collection/forEachArray';
 * 
 * // CommonJS
 * const forEachArray = require('tui-code-snippet/collection/forEachArray'); 
 *
 * let sum = 0;
 *
 * forEachArray([1,2,3], function(value){
 *   sum += value;
 * });
 * alert(sum); // 6
 */
function forEachArray(arr, iteratee, context) {
  var index = 0;
  var len = arr.length;

  context = context || null;

  for (; index < len; index += 1) {
    if (iteratee.call(context, arr[index], index, arr) === false) {
      break;
    }
  }
}

module.exports = forEachArray;


/***/ }),

/***/ 956:
/***/ (function(module) {

"use strict";
/**
 * @fileoverview Execute the provided callback once for each property of object which actually exist.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Execute the provided callback once for each property of object which actually exist.
 * If the callback function returns false, the loop will be stopped.
 * Callback function(iteratee) is invoked with three arguments:
 *  1) The value of the property
 *  2) The name of the property
 *  3) The object being traversed
 * @param {Object} obj The object that will be traversed
 * @param {function} iteratee  Callback function
 * @param {Object} [context] Context(this) of callback function
 * @memberof module:collection
 * @example
 * // ES6
 * import forEachOwnProperties from 'tui-code-snippet/collection/forEachOwnProperties';
 * 
 * // CommonJS
 * const forEachOwnProperties = require('tui-code-snippet/collection/forEachOwnProperties'); 
 *
 * let sum = 0;
 *
 * forEachOwnProperties({a:1,b:2,c:3}, function(value){
 *   sum += value;
 * });
 * alert(sum); // 6
 */
function forEachOwnProperties(obj, iteratee, context) {
  var key;

  context = context || null;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (iteratee.call(context, obj[key], key, obj) === false) {
        break;
      }
    }
  }
}

module.exports = forEachOwnProperties;


/***/ }),

/***/ 990:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Transform the Array-like object to Array.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var forEachArray = __webpack_require__(893);

/**
 * Transform the Array-like object to Array.
 * In low IE (below 8), Array.prototype.slice.call is not perfect. So, try-catch statement is used.
 * @param {*} arrayLike Array-like object
 * @returns {Array} Array
 * @memberof module:collection
 * @example
 * // ES6
 * import toArray from 'tui-code-snippet/collection/toArray'; 
 * 
 * // CommonJS
 * const toArray = require('tui-code-snippet/collection/toArray'); 
 *
 * const arrayLike = {
 *   0: 'one',
 *   1: 'two',
 *   2: 'three',
 *   3: 'four',
 *   length: 4
 * };
 * const result = toArray(arrayLike);
 *
 * alert(result instanceof Array); // true
 * alert(result); // one,two,three,four
 */
function toArray(arrayLike) {
  var arr;
  try {
    arr = Array.prototype.slice.call(arrayLike);
  } catch (e) {
    arr = [];
    forEachArray(arrayLike, function(value) {
      arr.push(value);
    });
  }

  return arr;
}

module.exports = toArray;


/***/ }),

/***/ 755:
/***/ (function(module) {

"use strict";
/**
 * @fileoverview Get event collection for specific HTML element
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var EVENT_KEY = '_feEventKey';

/**
 * Get event collection for specific HTML element
 * @param {HTMLElement} element - HTML element
 * @param {string} type - event type
 * @returns {array}
 * @private
 */
function safeEvent(element, type) {
  var events = element[EVENT_KEY];
  var handlers;

  if (!events) {
    events = element[EVENT_KEY] = {};
  }

  handlers = events[type];
  if (!handlers) {
    handlers = events[type] = [];
  }

  return handlers;
}

module.exports = safeEvent;


/***/ }),

/***/ 349:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Unbind DOM events
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isString = __webpack_require__(758);
var forEach = __webpack_require__(690);

var safeEvent = __webpack_require__(755);

/**
 * Unbind DOM events
 * If a handler function is not passed, remove all events of that type.
 * @param {HTMLElement} element - element to unbind events
 * @param {(string|object)} types - Space splitted events names or eventName:handler object
 * @param {function} [handler] - handler function
 * @memberof module:domEvent
 * @example
 * // Following the example of domEvent#on
 * 
 * // Unbind one event from an element.
 * off(div, 'click', toggle);
 * 
 * // Unbind multiple events with a same handler from multiple elements at once.
 * // Use event names splitted by a space.
 * off(element, 'mouseenter mouseleave', changeColor);
 * 
 * // Unbind multiple events with different handlers from an element at once.
 * // Use an object which of key is an event name and value is a handler function.
 * off(div, {
 *   keydown: highlight,
 *   keyup: dehighlight
 * });
 * 
 * // Unbind events without handlers.
 * off(div, 'drag');
 */
function off(element, types, handler) {
  if (isString(types)) {
    forEach(types.split(/\s+/g), function(type) {
      unbindEvent(element, type, handler);
    });

    return;
  }

  forEach(types, function(func, type) {
    unbindEvent(element, type, func);
  });
}

/**
 * Unbind DOM events
 * If a handler function is not passed, remove all events of that type.
 * @param {HTMLElement} element - element to unbind events
 * @param {string} type - events name
 * @param {function} [handler] - handler function
 * @private
 */
function unbindEvent(element, type, handler) {
  var events = safeEvent(element, type);
  var index;

  if (!handler) {
    forEach(events, function(item) {
      removeHandler(element, type, item.wrappedHandler);
    });
    events.splice(0, events.length);
  } else {
    forEach(events, function(item, idx) {
      if (handler === item.handler) {
        removeHandler(element, type, item.wrappedHandler);
        index = idx;

        return false;
      }

      return true;
    });
    events.splice(index, 1);
  }
}

/**
 * Remove an event handler
 * @param {HTMLElement} element - An element to remove an event
 * @param {string} type - event type
 * @param {function} handler - event handler
 * @private
 */
function removeHandler(element, type, handler) {
  if ('removeEventListener' in element) {
    element.removeEventListener(type, handler);
  } else if ('detachEvent' in element) {
    element.detachEvent('on' + type, handler);
  }
}

module.exports = off;


/***/ }),

/***/ 348:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Bind DOM events
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isString = __webpack_require__(758);
var forEach = __webpack_require__(690);

var safeEvent = __webpack_require__(755);

/**
 * Bind DOM events.
 * @param {HTMLElement} element - element to bind events
 * @param {(string|object)} types - Space splitted events names or eventName:handler object
 * @param {(function|object)} handler - handler function or context for handler method
 * @param {object} [context] context - context for handler method.
 * @memberof module:domEvent
 * @example
 * const div = document.querySelector('div');
 * 
 * // Bind one event to an element.
 * on(div, 'click', toggle);
 * 
 * // Bind multiple events with a same handler to multiple elements at once.
 * // Use event names splitted by a space.
 * on(div, 'mouseenter mouseleave', changeColor);
 * 
 * // Bind multiple events with different handlers to an element at once.
 * // Use an object which of key is an event name and value is a handler function.
 * on(div, {
 *   keydown: highlight,
 *   keyup: dehighlight
 * });
 * 
 * // Set a context for handler method.
 * const name = 'global';
 * const repository = {name: 'CodeSnippet'};
 * on(div, 'drag', function() {
 *   console.log(this.name);
 * }, repository);
 * // Result when you drag a div: "CodeSnippet"
 */
function on(element, types, handler, context) {
  if (isString(types)) {
    forEach(types.split(/\s+/g), function(type) {
      bindEvent(element, type, handler, context);
    });

    return;
  }

  forEach(types, function(func, type) {
    bindEvent(element, type, func, handler);
  });
}

/**
 * Bind DOM events
 * @param {HTMLElement} element - element to bind events
 * @param {string} type - events name
 * @param {function} handler - handler function or context for handler method
 * @param {object} [context] context - context for handler method.
 * @private
 */
function bindEvent(element, type, handler, context) {
  /**
     * Event handler
     * @param {Event} e - event object
     */
  function eventHandler(e) {
    handler.call(context || element, e || window.event);
  }

  if ('addEventListener' in element) {
    element.addEventListener(type, eventHandler);
  } else if ('attachEvent' in element) {
    element.attachEvent('on' + type, eventHandler);
  }
  memorizeHandler(element, type, handler, eventHandler);
}

/**
 * Memorize DOM event handler for unbinding.
 * @param {HTMLElement} element - element to bind events
 * @param {string} type - events name
 * @param {function} handler - handler function that user passed at on() use
 * @param {function} wrappedHandler - handler function that wrapped by domevent for implementing some features
 * @private
 */
function memorizeHandler(element, type, handler, wrappedHandler) {
  var events = safeEvent(element, type);
  var existInEvents = false;

  forEach(events, function(obj) {
    if (obj.handler === handler) {
      existInEvents = true;

      return false;
    }

    return true;
  });

  if (!existInEvents) {
    events.push({
      handler: handler,
      wrappedHandler: wrappedHandler
    });
  }
}

module.exports = on;


/***/ }),

/***/ 24:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Set className value
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isArray = __webpack_require__(322);
var isUndefined = __webpack_require__(929);

/**
 * Set className value
 * @param {(HTMLElement|SVGElement)} element - target element
 * @param {(string|string[])} cssClass - class names
 * @private
 */
function setClassName(element, cssClass) {
  cssClass = isArray(cssClass) ? cssClass.join(' ') : cssClass;

  cssClass = cssClass.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

  if (isUndefined(element.className.baseVal)) {
    element.className = cssClass;

    return;
  }

  element.className.baseVal = cssClass;
}

module.exports = setClassName;


/***/ }),

/***/ 204:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Add css class to element
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var forEach = __webpack_require__(690);
var inArray = __webpack_require__(928);
var getClass = __webpack_require__(902);
var setClassName = __webpack_require__(24);

/**
 * domUtil module
 * @module domUtil
 */

/**
 * Add css class to element
 * @param {(HTMLElement|SVGElement)} element - target element
 * @param {...string} cssClass - css classes to add
 * @memberof module:domUtil
 */
function addClass(element) {
  var cssClass = Array.prototype.slice.call(arguments, 1);
  var classList = element.classList;
  var newClass = [];
  var origin;

  if (classList) {
    forEach(cssClass, function(name) {
      element.classList.add(name);
    });

    return;
  }

  origin = getClass(element);

  if (origin) {
    cssClass = [].concat(origin.split(/\s+/), cssClass);
  }

  forEach(cssClass, function(cls) {
    if (inArray(cls, newClass) < 0) {
      newClass.push(cls);
    }
  });

  setClassName(element, newClass);
}

module.exports = addClass;


/***/ }),

/***/ 522:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Setting element style
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isString = __webpack_require__(758);
var forEach = __webpack_require__(690);

/**
 * Setting element style
 * @param {(HTMLElement|SVGElement)} element - element to setting style
 * @param {(string|object)} key - style prop name or {prop: value} pair object
 * @param {string} [value] - style value
 * @memberof module:domUtil
 */
function css(element, key, value) {
  var style = element.style;

  if (isString(key)) {
    style[key] = value;

    return;
  }

  forEach(key, function(v, k) {
    style[k] = v;
  });
}

module.exports = css;


/***/ }),

/***/ 902:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Get HTML element's design classes.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isUndefined = __webpack_require__(929);

/**
 * Get HTML element's design classes.
 * @param {(HTMLElement|SVGElement)} element target element
 * @returns {string} element css class name
 * @memberof module:domUtil
 */
function getClass(element) {
  if (!element || !element.className) {
    return '';
  }

  if (isUndefined(element.className.baseVal)) {
    return element.className;
  }

  return element.className.baseVal;
}

module.exports = getClass;


/***/ }),

/***/ 714:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check element has specific css class
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var inArray = __webpack_require__(928);
var getClass = __webpack_require__(902);

/**
 * Check element has specific css class
 * @param {(HTMLElement|SVGElement)} element - target element
 * @param {string} cssClass - css class
 * @returns {boolean}
 * @memberof module:domUtil
 */
function hasClass(element, cssClass) {
  var origin;

  if (element.classList) {
    return element.classList.contains(cssClass);
  }

  origin = getClass(element).split(/\s+/);

  return inArray(cssClass, origin) > -1;
}

module.exports = hasClass;


/***/ }),

/***/ 471:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check element match selector
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var inArray = __webpack_require__(928);
var toArray = __webpack_require__(990);

var elProto = Element.prototype;
var matchSelector = elProto.matches ||
    elProto.webkitMatchesSelector ||
    elProto.mozMatchesSelector ||
    elProto.msMatchesSelector ||
    function(selector) {
      var doc = this.document || this.ownerDocument;

      return inArray(this, toArray(doc.querySelectorAll(selector))) > -1;
    };

/**
 * Check element match selector
 * @param {HTMLElement} element - element to check
 * @param {string} selector - selector to check
 * @returns {boolean} is selector matched to element?
 * @memberof module:domUtil
 */
function matches(element, selector) {
  return matchSelector.call(element, selector);
}

module.exports = matches;


/***/ }),

/***/ 462:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Remove css class from element
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var forEachArray = __webpack_require__(893);
var inArray = __webpack_require__(928);
var getClass = __webpack_require__(902);
var setClassName = __webpack_require__(24);

/**
 * Remove css class from element
 * @param {(HTMLElement|SVGElement)} element - target element
 * @param {...string} cssClass - css classes to remove
 * @memberof module:domUtil
 */
function removeClass(element) {
  var cssClass = Array.prototype.slice.call(arguments, 1);
  var classList = element.classList;
  var origin, newClass;

  if (classList) {
    forEachArray(cssClass, function(name) {
      classList.remove(name);
    });

    return;
  }

  origin = getClass(element).split(/\s+/);
  newClass = [];
  forEachArray(origin, function(name) {
    if (inArray(name, cssClass) < 0) {
      newClass.push(name);
    }
  });

  setClassName(element, newClass);
}

module.exports = removeClass;


/***/ }),

/***/ 969:
/***/ (function(module) {

"use strict";
/**
 * @fileoverview Extend the target object from other objects.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * @module object
 */

/**
 * Extend the target object from other objects.
 * @param {object} target - Object that will be extended
 * @param {...object} objects - Objects as sources
 * @returns {object} Extended object
 * @memberof module:object
 */
function extend(target, objects) { // eslint-disable-line no-unused-vars
  var hasOwnProp = Object.prototype.hasOwnProperty;
  var source, prop, i, len;

  for (i = 1, len = arguments.length; i < len; i += 1) {
    source = arguments[i];
    for (prop in source) {
      if (hasOwnProp.call(source, prop)) {
        target[prop] = source[prop];
      }
    }
  }

  return target;
}

module.exports = extend;


/***/ }),

/***/ 254:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Request image ping.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var forEachOwnProperties = __webpack_require__(956);

/**
 * @module request
 */

/**
 * Request image ping.
 * @param {String} url url for ping request
 * @param {Object} trackingInfo infos for make query string
 * @returns {HTMLElement}
 * @memberof module:request
 * @example
 * // ES6
 * import imagePing from 'tui-code-snippet/request/imagePing';
 * 
 * // CommonJS
 * const imagePing = require('tui-code-snippet/request/imagePing');
 *
 * imagePing('https://www.google-analytics.com/collect', {
 *   v: 1,
 *   t: 'event',
 *   tid: 'trackingid',
 *   cid: 'cid',
 *   dp: 'dp',
 *   dh: 'dh'
 * });
 */
function imagePing(url, trackingInfo) {
  var trackingElement = document.createElement('img');
  var queryString = '';
  forEachOwnProperties(trackingInfo, function(value, key) {
    queryString += '&' + key + '=' + value;
  });
  queryString = queryString.substring(1);

  trackingElement.src = url + '?' + queryString;

  trackingElement.style.display = 'none';
  document.body.appendChild(trackingElement);
  document.body.removeChild(trackingElement);

  return trackingElement;
}

module.exports = imagePing;


/***/ }),

/***/ 391:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Send hostname on DOMContentLoaded.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isUndefined = __webpack_require__(929);
var imagePing = __webpack_require__(254);

var ms7days = 7 * 24 * 60 * 60 * 1000;

/**
 * Check if the date has passed 7 days
 * @param {number} date - milliseconds
 * @returns {boolean}
 * @private
 */
function isExpired(date) {
  var now = new Date().getTime();

  return now - date > ms7days;
}

/**
 * Send hostname on DOMContentLoaded.
 * To prevent hostname set tui.usageStatistics to false.
 * @param {string} appName - application name
 * @param {string} trackingId - GA tracking ID
 * @ignore
 */
function sendHostname(appName, trackingId) {
  var url = 'https://www.google-analytics.com/collect';
  var hostname = location.hostname;
  var hitType = 'event';
  var eventCategory = 'use';
  var applicationKeyForStorage = 'TOAST UI ' + appName + ' for ' + hostname + ': Statistics';
  var date = window.localStorage.getItem(applicationKeyForStorage);

  // skip if the flag is defined and is set to false explicitly
  if (!isUndefined(window.tui) && window.tui.usageStatistics === false) {
    return;
  }

  // skip if not pass seven days old
  if (date && !isExpired(date)) {
    return;
  }

  window.localStorage.setItem(applicationKeyForStorage, new Date().getTime());

  setTimeout(function() {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      imagePing(url, {
        v: 1,
        t: hitType,
        tid: trackingId,
        cid: hostname,
        dp: hostname,
        dh: appName,
        el: appName,
        ec: eventCategory
      });
    }
  }, 1000);
}

module.exports = sendHostname;


/***/ }),

/***/ 322:
/***/ (function(module) {

"use strict";
/**
 * @fileoverview Check whether the given variable is an instance of Array or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is an instance of Array or not.
 * If the given variable is an instance of Array, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is array instance?
 * @memberof module:type
 */
function isArray(obj) {
  return obj instanceof Array;
}

module.exports = isArray;


/***/ }),

/***/ 65:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is existing or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isUndefined = __webpack_require__(929);
var isNull = __webpack_require__(934);

/**
 * Check whether the given variable is existing or not.
 * If the given variable is not null and not undefined, returns true.
 * @param {*} param - Target for checking
 * @returns {boolean} Is existy?
 * @memberof module:type
 * @example
 * // ES6
 * import isExisty from 'tui-code-snippet/type/isExisty');
 * 
 * // CommonJS
 * const isExisty = require('tui-code-snippet/type/isExisty');
 *
 * isExisty(''); //true
 * isExisty(0); //true
 * isExisty([]); //true
 * isExisty({}); //true
 * isExisty(null); //false
 * isExisty(undefined); //false
*/
function isExisty(param) {
  return !isUndefined(param) && !isNull(param);
}

module.exports = isExisty;


/***/ }),

/***/ 404:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is falsy or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isTruthy = __webpack_require__(790);

/**
 * Check whether the given variable is falsy or not.
 * If the given variable is null or undefined or false, returns true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is falsy?
 * @memberof module:type
 */
function isFalsy(obj) {
  return !isTruthy(obj);
}

module.exports = isFalsy;


/***/ }),

/***/ 294:
/***/ (function(module) {

"use strict";
/**
 * @fileoverview Check whether the given variable is a function or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is a function or not.
 * If the given variable is a function, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is function?
 * @memberof module:type
 */
function isFunction(obj) {
  return obj instanceof Function;
}

module.exports = isFunction;


/***/ }),

/***/ 934:
/***/ (function(module) {

"use strict";
/**
 * @fileoverview Check whether the given variable is null or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is null or not.
 * If the given variable(arguments[0]) is null, returns true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is null?
 * @memberof module:type
 */
function isNull(obj) {
  return obj === null;
}

module.exports = isNull;


/***/ }),

/***/ 758:
/***/ (function(module) {

"use strict";
/**
 * @fileoverview Check whether the given variable is a string or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is a string or not.
 * If the given variable is a string, return true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is string?
 * @memberof module:type
 */
function isString(obj) {
  return typeof obj === 'string' || obj instanceof String;
}

module.exports = isString;


/***/ }),

/***/ 790:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";
/**
 * @fileoverview Check whether the given variable is truthy or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



var isExisty = __webpack_require__(65);

/**
 * Check whether the given variable is truthy or not.
 * If the given variable is not null or not undefined or not false, returns true.
 * (It regards 0 as true)
 * @param {*} obj - Target for checking
 * @returns {boolean} Is truthy?
 * @memberof module:type
 */
function isTruthy(obj) {
  return isExisty(obj) && obj !== false;
}

module.exports = isTruthy;


/***/ }),

/***/ 929:
/***/ (function(module) {

"use strict";
/**
 * @fileoverview Check whether the given variable is undefined or not.
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */



/**
 * Check whether the given variable is undefined or not.
 * If the given variable is undefined, returns true.
 * @param {*} obj - Target for checking
 * @returns {boolean} Is undefined?
 * @memberof module:type
 */
function isUndefined(obj) {
  return obj === undefined; // eslint-disable-line no-undefined
}

module.exports = isUndefined;


/***/ }),

/***/ 479:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__479__;

/***/ }),

/***/ 481:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__481__;

/***/ }),

/***/ 43:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__43__;

/***/ }),

/***/ 814:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__814__;

/***/ }),

/***/ 311:
/***/ (function(module) {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__311__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ indexViewer; }
});

;// CONCATENATED MODULE: ../../node_modules/tslib/tslib.es6.js
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var tslib_es6_assign = function() {
    tslib_es6_assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return tslib_es6_assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

;// CONCATENATED MODULE: ../../libs/toastmark/dist/esm/index.js
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */
var esm_extendStatics = function (d, b) {
    esm_extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p))
                d[p] = b[p]; };
    return esm_extendStatics(d, b);
};
function esm_extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    esm_extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var esm_assign = function () {
    esm_assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    return esm_assign.apply(this, arguments);
};
function esm_spreadArray(to, from, pack) {
    if (pack || arguments.length === 2)
        for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar)
                    ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
    return to.concat(ar || Array.prototype.slice.call(from));
}
var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof __webpack_require__.g !== 'undefined' ? __webpack_require__.g : typeof self !== 'undefined' ? self : {};
var encodeCache = {};
// Create a lookup array where anything but characters in `chars` string
// and alphanumeric chars is percent-encoded.
//
function getEncodeCache(exclude) {
    var i, ch, cache = encodeCache[exclude];
    if (cache) {
        return cache;
    }
    cache = encodeCache[exclude] = [];
    for (i = 0; i < 128; i++) {
        ch = String.fromCharCode(i);
        if (/^[0-9a-z]$/i.test(ch)) {
            // always allow unencoded alphanumeric characters
            cache.push(ch);
        }
        else {
            cache.push('%' + ('0' + i.toString(16).toUpperCase()).slice(-2));
        }
    }
    for (i = 0; i < exclude.length; i++) {
        cache[exclude.charCodeAt(i)] = exclude[i];
    }
    return cache;
}
// Encode unsafe characters with percent-encoding, skipping already
// encoded sequences.
//
//  - string       - string to encode
//  - exclude      - list of characters to ignore (in addition to a-zA-Z0-9)
//  - keepEscaped  - don't encode '%' in a correct escape sequence (default: true)
//
function encode$1(string, exclude, keepEscaped) {
    var i, l, code, nextCode, cache, result = '';
    if (typeof exclude !== 'string') {
        // encode(string, keepEscaped)
        keepEscaped = exclude;
        exclude = encode$1.defaultChars;
    }
    if (typeof keepEscaped === 'undefined') {
        keepEscaped = true;
    }
    cache = getEncodeCache(exclude);
    for (i = 0, l = string.length; i < l; i++) {
        code = string.charCodeAt(i);
        if (keepEscaped && code === 0x25 /* % */ && i + 2 < l) {
            if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
                result += string.slice(i, i + 3);
                i += 2;
                continue;
            }
        }
        if (code < 128) {
            result += cache[code];
            continue;
        }
        if (code >= 0xD800 && code <= 0xDFFF) {
            if (code >= 0xD800 && code <= 0xDBFF && i + 1 < l) {
                nextCode = string.charCodeAt(i + 1);
                if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
                    result += encodeURIComponent(string[i] + string[i + 1]);
                    i++;
                    continue;
                }
            }
            result += '%EF%BF%BD';
            continue;
        }
        result += encodeURIComponent(string[i]);
    }
    return result;
}
encode$1.defaultChars = ";/?:@&=+$,-_.!~*'()#";
encode$1.componentChars = "-_.!~*'()";
var encode_1 = encode$1;
var lib = {};
var decode = {};
var Aacute$1 = "Á";
var aacute$1 = "á";
var Abreve = "Ă";
var abreve = "ă";
var ac = "∾";
var acd = "∿";
var acE = "∾̳";
var Acirc$1 = "Â";
var acirc$1 = "â";
var acute$1 = "´";
var Acy = "А";
var acy = "а";
var AElig$1 = "Æ";
var aelig$1 = "æ";
var af = "⁡";
var Afr = "𝔄";
var afr = "𝔞";
var Agrave$1 = "À";
var agrave$1 = "à";
var alefsym = "ℵ";
var aleph = "ℵ";
var Alpha = "Α";
var alpha = "α";
var Amacr = "Ā";
var amacr = "ā";
var amalg = "⨿";
var amp$2 = "&";
var AMP$1 = "&";
var andand = "⩕";
var And = "⩓";
var and = "∧";
var andd = "⩜";
var andslope = "⩘";
var andv = "⩚";
var ang = "∠";
var ange = "⦤";
var angle = "∠";
var angmsdaa = "⦨";
var angmsdab = "⦩";
var angmsdac = "⦪";
var angmsdad = "⦫";
var angmsdae = "⦬";
var angmsdaf = "⦭";
var angmsdag = "⦮";
var angmsdah = "⦯";
var angmsd = "∡";
var angrt = "∟";
var angrtvb = "⊾";
var angrtvbd = "⦝";
var angsph = "∢";
var angst = "Å";
var angzarr = "⍼";
var Aogon = "Ą";
var aogon = "ą";
var Aopf = "𝔸";
var aopf = "𝕒";
var apacir = "⩯";
var ap = "≈";
var apE = "⩰";
var ape = "≊";
var apid = "≋";
var apos$1 = "'";
var ApplyFunction = "⁡";
var approx = "≈";
var approxeq = "≊";
var Aring$1 = "Å";
var aring$1 = "å";
var Ascr = "𝒜";
var ascr = "𝒶";
var Assign = "≔";
var ast = "*";
var asymp = "≈";
var asympeq = "≍";
var Atilde$1 = "Ã";
var atilde$1 = "ã";
var Auml$1 = "Ä";
var auml$1 = "ä";
var awconint = "∳";
var awint = "⨑";
var backcong = "≌";
var backepsilon = "϶";
var backprime = "‵";
var backsim = "∽";
var backsimeq = "⋍";
var Backslash = "∖";
var Barv = "⫧";
var barvee = "⊽";
var barwed = "⌅";
var Barwed = "⌆";
var barwedge = "⌅";
var bbrk = "⎵";
var bbrktbrk = "⎶";
var bcong = "≌";
var Bcy = "Б";
var bcy = "б";
var bdquo = "„";
var becaus = "∵";
var because = "∵";
var Because = "∵";
var bemptyv = "⦰";
var bepsi = "϶";
var bernou = "ℬ";
var Bernoullis = "ℬ";
var Beta = "Β";
var beta = "β";
var beth = "ℶ";
var between = "≬";
var Bfr = "𝔅";
var bfr = "𝔟";
var bigcap = "⋂";
var bigcirc = "◯";
var bigcup = "⋃";
var bigodot = "⨀";
var bigoplus = "⨁";
var bigotimes = "⨂";
var bigsqcup = "⨆";
var bigstar = "★";
var bigtriangledown = "▽";
var bigtriangleup = "△";
var biguplus = "⨄";
var bigvee = "⋁";
var bigwedge = "⋀";
var bkarow = "⤍";
var blacklozenge = "⧫";
var blacksquare = "▪";
var blacktriangle = "▴";
var blacktriangledown = "▾";
var blacktriangleleft = "◂";
var blacktriangleright = "▸";
var blank = "␣";
var blk12 = "▒";
var blk14 = "░";
var blk34 = "▓";
var block = "█";
var bne = "=⃥";
var bnequiv = "≡⃥";
var bNot = "⫭";
var bnot = "⌐";
var Bopf = "𝔹";
var bopf = "𝕓";
var bot = "⊥";
var bottom = "⊥";
var bowtie = "⋈";
var boxbox = "⧉";
var boxdl = "┐";
var boxdL = "╕";
var boxDl = "╖";
var boxDL = "╗";
var boxdr = "┌";
var boxdR = "╒";
var boxDr = "╓";
var boxDR = "╔";
var boxh = "─";
var boxH = "═";
var boxhd = "┬";
var boxHd = "╤";
var boxhD = "╥";
var boxHD = "╦";
var boxhu = "┴";
var boxHu = "╧";
var boxhU = "╨";
var boxHU = "╩";
var boxminus = "⊟";
var boxplus = "⊞";
var boxtimes = "⊠";
var boxul = "┘";
var boxuL = "╛";
var boxUl = "╜";
var boxUL = "╝";
var boxur = "└";
var boxuR = "╘";
var boxUr = "╙";
var boxUR = "╚";
var boxv = "│";
var boxV = "║";
var boxvh = "┼";
var boxvH = "╪";
var boxVh = "╫";
var boxVH = "╬";
var boxvl = "┤";
var boxvL = "╡";
var boxVl = "╢";
var boxVL = "╣";
var boxvr = "├";
var boxvR = "╞";
var boxVr = "╟";
var boxVR = "╠";
var bprime = "‵";
var breve = "˘";
var Breve = "˘";
var brvbar$1 = "¦";
var bscr = "𝒷";
var Bscr = "ℬ";
var bsemi = "⁏";
var bsim = "∽";
var bsime = "⋍";
var bsolb = "⧅";
var bsol = "\\";
var bsolhsub = "⟈";
var bull = "•";
var bullet = "•";
var bump = "≎";
var bumpE = "⪮";
var bumpe = "≏";
var Bumpeq = "≎";
var bumpeq = "≏";
var Cacute = "Ć";
var cacute = "ć";
var capand = "⩄";
var capbrcup = "⩉";
var capcap = "⩋";
var cap = "∩";
var Cap = "⋒";
var capcup = "⩇";
var capdot = "⩀";
var CapitalDifferentialD = "ⅅ";
var caps = "∩︀";
var caret = "⁁";
var caron = "ˇ";
var Cayleys = "ℭ";
var ccaps = "⩍";
var Ccaron = "Č";
var ccaron = "č";
var Ccedil$1 = "Ç";
var ccedil$1 = "ç";
var Ccirc = "Ĉ";
var ccirc = "ĉ";
var Cconint = "∰";
var ccups = "⩌";
var ccupssm = "⩐";
var Cdot = "Ċ";
var cdot = "ċ";
var cedil$1 = "¸";
var Cedilla = "¸";
var cemptyv = "⦲";
var cent$1 = "¢";
var centerdot = "·";
var CenterDot = "·";
var cfr = "𝔠";
var Cfr = "ℭ";
var CHcy = "Ч";
var chcy = "ч";
var check = "✓";
var checkmark = "✓";
var Chi = "Χ";
var chi = "χ";
var circ = "ˆ";
var circeq = "≗";
var circlearrowleft = "↺";
var circlearrowright = "↻";
var circledast = "⊛";
var circledcirc = "⊚";
var circleddash = "⊝";
var CircleDot = "⊙";
var circledR = "®";
var circledS = "Ⓢ";
var CircleMinus = "⊖";
var CirclePlus = "⊕";
var CircleTimes = "⊗";
var cir = "○";
var cirE = "⧃";
var cire = "≗";
var cirfnint = "⨐";
var cirmid = "⫯";
var cirscir = "⧂";
var ClockwiseContourIntegral = "∲";
var CloseCurlyDoubleQuote = "”";
var CloseCurlyQuote = "’";
var clubs = "♣";
var clubsuit = "♣";
var colon = ":";
var Colon = "∷";
var Colone = "⩴";
var colone = "≔";
var coloneq = "≔";
var comma = ",";
var commat = "@";
var comp = "∁";
var compfn = "∘";
var complement = "∁";
var complexes = "ℂ";
var cong = "≅";
var congdot = "⩭";
var Congruent = "≡";
var conint = "∮";
var Conint = "∯";
var ContourIntegral = "∮";
var copf = "𝕔";
var Copf = "ℂ";
var coprod = "∐";
var Coproduct = "∐";
var copy$1 = "©";
var COPY$1 = "©";
var copysr = "℗";
var CounterClockwiseContourIntegral = "∳";
var crarr = "↵";
var cross = "✗";
var Cross = "⨯";
var Cscr = "𝒞";
var cscr = "𝒸";
var csub = "⫏";
var csube = "⫑";
var csup = "⫐";
var csupe = "⫒";
var ctdot = "⋯";
var cudarrl = "⤸";
var cudarrr = "⤵";
var cuepr = "⋞";
var cuesc = "⋟";
var cularr = "↶";
var cularrp = "⤽";
var cupbrcap = "⩈";
var cupcap = "⩆";
var CupCap = "≍";
var cup = "∪";
var Cup = "⋓";
var cupcup = "⩊";
var cupdot = "⊍";
var cupor = "⩅";
var cups = "∪︀";
var curarr = "↷";
var curarrm = "⤼";
var curlyeqprec = "⋞";
var curlyeqsucc = "⋟";
var curlyvee = "⋎";
var curlywedge = "⋏";
var curren$1 = "¤";
var curvearrowleft = "↶";
var curvearrowright = "↷";
var cuvee = "⋎";
var cuwed = "⋏";
var cwconint = "∲";
var cwint = "∱";
var cylcty = "⌭";
var dagger = "†";
var Dagger = "‡";
var daleth = "ℸ";
var darr = "↓";
var Darr = "↡";
var dArr = "⇓";
var dash = "‐";
var Dashv = "⫤";
var dashv = "⊣";
var dbkarow = "⤏";
var dblac = "˝";
var Dcaron = "Ď";
var dcaron = "ď";
var Dcy = "Д";
var dcy = "д";
var ddagger = "‡";
var ddarr = "⇊";
var DD = "ⅅ";
var dd = "ⅆ";
var DDotrahd = "⤑";
var ddotseq = "⩷";
var deg$1 = "°";
var Del = "∇";
var Delta = "Δ";
var delta = "δ";
var demptyv = "⦱";
var dfisht = "⥿";
var Dfr = "𝔇";
var dfr = "𝔡";
var dHar = "⥥";
var dharl = "⇃";
var dharr = "⇂";
var DiacriticalAcute = "´";
var DiacriticalDot = "˙";
var DiacriticalDoubleAcute = "˝";
var DiacriticalGrave = "`";
var DiacriticalTilde = "˜";
var diam = "⋄";
var diamond = "⋄";
var Diamond = "⋄";
var diamondsuit = "♦";
var diams = "♦";
var die = "¨";
var DifferentialD = "ⅆ";
var digamma = "ϝ";
var disin = "⋲";
var div = "÷";
var divide$1 = "÷";
var divideontimes = "⋇";
var divonx = "⋇";
var DJcy = "Ђ";
var djcy = "ђ";
var dlcorn = "⌞";
var dlcrop = "⌍";
var dollar = "$";
var Dopf = "𝔻";
var dopf = "𝕕";
var Dot = "¨";
var dot = "˙";
var DotDot = "⃜";
var doteq = "≐";
var doteqdot = "≑";
var DotEqual = "≐";
var dotminus = "∸";
var dotplus = "∔";
var dotsquare = "⊡";
var doublebarwedge = "⌆";
var DoubleContourIntegral = "∯";
var DoubleDot = "¨";
var DoubleDownArrow = "⇓";
var DoubleLeftArrow = "⇐";
var DoubleLeftRightArrow = "⇔";
var DoubleLeftTee = "⫤";
var DoubleLongLeftArrow = "⟸";
var DoubleLongLeftRightArrow = "⟺";
var DoubleLongRightArrow = "⟹";
var DoubleRightArrow = "⇒";
var DoubleRightTee = "⊨";
var DoubleUpArrow = "⇑";
var DoubleUpDownArrow = "⇕";
var DoubleVerticalBar = "∥";
var DownArrowBar = "⤓";
var downarrow = "↓";
var DownArrow = "↓";
var Downarrow = "⇓";
var DownArrowUpArrow = "⇵";
var DownBreve = "̑";
var downdownarrows = "⇊";
var downharpoonleft = "⇃";
var downharpoonright = "⇂";
var DownLeftRightVector = "⥐";
var DownLeftTeeVector = "⥞";
var DownLeftVectorBar = "⥖";
var DownLeftVector = "↽";
var DownRightTeeVector = "⥟";
var DownRightVectorBar = "⥗";
var DownRightVector = "⇁";
var DownTeeArrow = "↧";
var DownTee = "⊤";
var drbkarow = "⤐";
var drcorn = "⌟";
var drcrop = "⌌";
var Dscr = "𝒟";
var dscr = "𝒹";
var DScy = "Ѕ";
var dscy = "ѕ";
var dsol = "⧶";
var Dstrok = "Đ";
var dstrok = "đ";
var dtdot = "⋱";
var dtri = "▿";
var dtrif = "▾";
var duarr = "⇵";
var duhar = "⥯";
var dwangle = "⦦";
var DZcy = "Џ";
var dzcy = "џ";
var dzigrarr = "⟿";
var Eacute$1 = "É";
var eacute$1 = "é";
var easter = "⩮";
var Ecaron = "Ě";
var ecaron = "ě";
var Ecirc$1 = "Ê";
var ecirc$1 = "ê";
var ecir = "≖";
var ecolon = "≕";
var Ecy = "Э";
var ecy = "э";
var eDDot = "⩷";
var Edot = "Ė";
var edot = "ė";
var eDot = "≑";
var ee = "ⅇ";
var efDot = "≒";
var Efr = "𝔈";
var efr = "𝔢";
var eg = "⪚";
var Egrave$1 = "È";
var egrave$1 = "è";
var egs = "⪖";
var egsdot = "⪘";
var el = "⪙";
var Element = "∈";
var elinters = "⏧";
var ell = "ℓ";
var els = "⪕";
var elsdot = "⪗";
var Emacr = "Ē";
var emacr = "ē";
var empty = "∅";
var emptyset = "∅";
var EmptySmallSquare = "◻";
var emptyv = "∅";
var EmptyVerySmallSquare = "▫";
var emsp13 = " ";
var emsp14 = " ";
var emsp = " ";
var ENG = "Ŋ";
var eng = "ŋ";
var ensp = " ";
var Eogon = "Ę";
var eogon = "ę";
var Eopf = "𝔼";
var eopf = "𝕖";
var epar = "⋕";
var eparsl = "⧣";
var eplus = "⩱";
var epsi = "ε";
var Epsilon = "Ε";
var epsilon = "ε";
var epsiv = "ϵ";
var eqcirc = "≖";
var eqcolon = "≕";
var eqsim = "≂";
var eqslantgtr = "⪖";
var eqslantless = "⪕";
var Equal = "⩵";
var equals = "=";
var EqualTilde = "≂";
var equest = "≟";
var Equilibrium = "⇌";
var equiv = "≡";
var equivDD = "⩸";
var eqvparsl = "⧥";
var erarr = "⥱";
var erDot = "≓";
var escr = "ℯ";
var Escr = "ℰ";
var esdot = "≐";
var Esim = "⩳";
var esim = "≂";
var Eta = "Η";
var eta = "η";
var ETH$1 = "Ð";
var eth$1 = "ð";
var Euml$1 = "Ë";
var euml$1 = "ë";
var euro = "€";
var excl = "!";
var exist = "∃";
var Exists = "∃";
var expectation = "ℰ";
var exponentiale = "ⅇ";
var ExponentialE = "ⅇ";
var fallingdotseq = "≒";
var Fcy = "Ф";
var fcy = "ф";
var female = "♀";
var ffilig = "ﬃ";
var fflig = "ﬀ";
var ffllig = "ﬄ";
var Ffr = "𝔉";
var ffr = "𝔣";
var filig = "ﬁ";
var FilledSmallSquare = "◼";
var FilledVerySmallSquare = "▪";
var fjlig = "fj";
var flat = "♭";
var fllig = "ﬂ";
var fltns = "▱";
var fnof = "ƒ";
var Fopf = "𝔽";
var fopf = "𝕗";
var forall = "∀";
var ForAll = "∀";
var fork = "⋔";
var forkv = "⫙";
var Fouriertrf = "ℱ";
var fpartint = "⨍";
var frac12$1 = "½";
var frac13 = "⅓";
var frac14$1 = "¼";
var frac15 = "⅕";
var frac16 = "⅙";
var frac18 = "⅛";
var frac23 = "⅔";
var frac25 = "⅖";
var frac34$1 = "¾";
var frac35 = "⅗";
var frac38 = "⅜";
var frac45 = "⅘";
var frac56 = "⅚";
var frac58 = "⅝";
var frac78 = "⅞";
var frasl = "⁄";
var frown = "⌢";
var fscr = "𝒻";
var Fscr = "ℱ";
var gacute = "ǵ";
var Gamma = "Γ";
var gamma = "γ";
var Gammad = "Ϝ";
var gammad = "ϝ";
var gap = "⪆";
var Gbreve = "Ğ";
var gbreve = "ğ";
var Gcedil = "Ģ";
var Gcirc = "Ĝ";
var gcirc = "ĝ";
var Gcy = "Г";
var gcy = "г";
var Gdot = "Ġ";
var gdot = "ġ";
var ge = "≥";
var gE = "≧";
var gEl = "⪌";
var gel = "⋛";
var geq = "≥";
var geqq = "≧";
var geqslant = "⩾";
var gescc = "⪩";
var ges = "⩾";
var gesdot = "⪀";
var gesdoto = "⪂";
var gesdotol = "⪄";
var gesl = "⋛︀";
var gesles = "⪔";
var Gfr = "𝔊";
var gfr = "𝔤";
var gg = "≫";
var Gg = "⋙";
var ggg = "⋙";
var gimel = "ℷ";
var GJcy = "Ѓ";
var gjcy = "ѓ";
var gla = "⪥";
var gl = "≷";
var glE = "⪒";
var glj = "⪤";
var gnap = "⪊";
var gnapprox = "⪊";
var gne = "⪈";
var gnE = "≩";
var gneq = "⪈";
var gneqq = "≩";
var gnsim = "⋧";
var Gopf = "𝔾";
var gopf = "𝕘";
var grave = "`";
var GreaterEqual = "≥";
var GreaterEqualLess = "⋛";
var GreaterFullEqual = "≧";
var GreaterGreater = "⪢";
var GreaterLess = "≷";
var GreaterSlantEqual = "⩾";
var GreaterTilde = "≳";
var Gscr = "𝒢";
var gscr = "ℊ";
var gsim = "≳";
var gsime = "⪎";
var gsiml = "⪐";
var gtcc = "⪧";
var gtcir = "⩺";
var gt$2 = ">";
var GT$1 = ">";
var Gt = "≫";
var gtdot = "⋗";
var gtlPar = "⦕";
var gtquest = "⩼";
var gtrapprox = "⪆";
var gtrarr = "⥸";
var gtrdot = "⋗";
var gtreqless = "⋛";
var gtreqqless = "⪌";
var gtrless = "≷";
var gtrsim = "≳";
var gvertneqq = "≩︀";
var gvnE = "≩︀";
var Hacek = "ˇ";
var hairsp = " ";
var half = "½";
var hamilt = "ℋ";
var HARDcy = "Ъ";
var hardcy = "ъ";
var harrcir = "⥈";
var harr = "↔";
var hArr = "⇔";
var harrw = "↭";
var Hat = "^";
var hbar = "ℏ";
var Hcirc = "Ĥ";
var hcirc = "ĥ";
var hearts = "♥";
var heartsuit = "♥";
var hellip = "…";
var hercon = "⊹";
var hfr = "𝔥";
var Hfr = "ℌ";
var HilbertSpace = "ℋ";
var hksearow = "⤥";
var hkswarow = "⤦";
var hoarr = "⇿";
var homtht = "∻";
var hookleftarrow = "↩";
var hookrightarrow = "↪";
var hopf = "𝕙";
var Hopf = "ℍ";
var horbar = "―";
var HorizontalLine = "─";
var hscr = "𝒽";
var Hscr = "ℋ";
var hslash = "ℏ";
var Hstrok = "Ħ";
var hstrok = "ħ";
var HumpDownHump = "≎";
var HumpEqual = "≏";
var hybull = "⁃";
var hyphen = "‐";
var Iacute$1 = "Í";
var iacute$1 = "í";
var ic = "⁣";
var Icirc$1 = "Î";
var icirc$1 = "î";
var Icy = "И";
var icy = "и";
var Idot = "İ";
var IEcy = "Е";
var iecy = "е";
var iexcl$1 = "¡";
var iff = "⇔";
var ifr = "𝔦";
var Ifr = "ℑ";
var Igrave$1 = "Ì";
var igrave$1 = "ì";
var ii = "ⅈ";
var iiiint = "⨌";
var iiint = "∭";
var iinfin = "⧜";
var iiota = "℩";
var IJlig = "Ĳ";
var ijlig = "ĳ";
var Imacr = "Ī";
var imacr = "ī";
var esm_image = "ℑ";
var ImaginaryI = "ⅈ";
var imagline = "ℐ";
var imagpart = "ℑ";
var imath = "ı";
var Im = "ℑ";
var imof = "⊷";
var imped = "Ƶ";
var Implies = "⇒";
var incare = "℅";
var infin = "∞";
var infintie = "⧝";
var inodot = "ı";
var intcal = "⊺";
var esm_int = "∫";
var Int = "∬";
var integers = "ℤ";
var Integral = "∫";
var intercal = "⊺";
var Intersection = "⋂";
var intlarhk = "⨗";
var intprod = "⨼";
var InvisibleComma = "⁣";
var InvisibleTimes = "⁢";
var IOcy = "Ё";
var iocy = "ё";
var Iogon = "Į";
var iogon = "į";
var Iopf = "𝕀";
var iopf = "𝕚";
var Iota = "Ι";
var iota = "ι";
var iprod = "⨼";
var iquest$1 = "¿";
var iscr = "𝒾";
var Iscr = "ℐ";
var isin = "∈";
var isindot = "⋵";
var isinE = "⋹";
var isins = "⋴";
var isinsv = "⋳";
var isinv = "∈";
var it = "⁢";
var Itilde = "Ĩ";
var itilde = "ĩ";
var Iukcy = "І";
var iukcy = "і";
var Iuml$1 = "Ï";
var iuml$1 = "ï";
var Jcirc = "Ĵ";
var jcirc = "ĵ";
var Jcy = "Й";
var jcy = "й";
var Jfr = "𝔍";
var jfr = "𝔧";
var jmath = "ȷ";
var Jopf = "𝕁";
var jopf = "𝕛";
var Jscr = "𝒥";
var jscr = "𝒿";
var Jsercy = "Ј";
var jsercy = "ј";
var Jukcy = "Є";
var jukcy = "є";
var Kappa = "Κ";
var kappa = "κ";
var kappav = "ϰ";
var Kcedil = "Ķ";
var kcedil = "ķ";
var Kcy = "К";
var kcy = "к";
var Kfr = "𝔎";
var kfr = "𝔨";
var kgreen = "ĸ";
var KHcy = "Х";
var khcy = "х";
var KJcy = "Ќ";
var kjcy = "ќ";
var Kopf = "𝕂";
var kopf = "𝕜";
var Kscr = "𝒦";
var kscr = "𝓀";
var lAarr = "⇚";
var Lacute = "Ĺ";
var lacute = "ĺ";
var laemptyv = "⦴";
var lagran = "ℒ";
var Lambda = "Λ";
var lambda = "λ";
var lang = "⟨";
var Lang = "⟪";
var langd = "⦑";
var langle = "⟨";
var lap = "⪅";
var Laplacetrf = "ℒ";
var laquo$1 = "«";
var larrb = "⇤";
var larrbfs = "⤟";
var larr = "←";
var Larr = "↞";
var lArr = "⇐";
var larrfs = "⤝";
var larrhk = "↩";
var larrlp = "↫";
var larrpl = "⤹";
var larrsim = "⥳";
var larrtl = "↢";
var latail = "⤙";
var lAtail = "⤛";
var lat = "⪫";
var late = "⪭";
var lates = "⪭︀";
var lbarr = "⤌";
var lBarr = "⤎";
var lbbrk = "❲";
var lbrace = "{";
var lbrack = "[";
var lbrke = "⦋";
var lbrksld = "⦏";
var lbrkslu = "⦍";
var Lcaron = "Ľ";
var lcaron = "ľ";
var Lcedil = "Ļ";
var lcedil = "ļ";
var lceil = "⌈";
var lcub = "{";
var Lcy = "Л";
var lcy = "л";
var ldca = "⤶";
var ldquo = "“";
var ldquor = "„";
var ldrdhar = "⥧";
var ldrushar = "⥋";
var ldsh = "↲";
var le = "≤";
var lE = "≦";
var LeftAngleBracket = "⟨";
var LeftArrowBar = "⇤";
var leftarrow = "←";
var LeftArrow = "←";
var Leftarrow = "⇐";
var LeftArrowRightArrow = "⇆";
var leftarrowtail = "↢";
var LeftCeiling = "⌈";
var LeftDoubleBracket = "⟦";
var LeftDownTeeVector = "⥡";
var LeftDownVectorBar = "⥙";
var LeftDownVector = "⇃";
var LeftFloor = "⌊";
var leftharpoondown = "↽";
var leftharpoonup = "↼";
var leftleftarrows = "⇇";
var leftrightarrow = "↔";
var LeftRightArrow = "↔";
var Leftrightarrow = "⇔";
var leftrightarrows = "⇆";
var leftrightharpoons = "⇋";
var leftrightsquigarrow = "↭";
var LeftRightVector = "⥎";
var LeftTeeArrow = "↤";
var LeftTee = "⊣";
var LeftTeeVector = "⥚";
var leftthreetimes = "⋋";
var LeftTriangleBar = "⧏";
var LeftTriangle = "⊲";
var LeftTriangleEqual = "⊴";
var LeftUpDownVector = "⥑";
var LeftUpTeeVector = "⥠";
var LeftUpVectorBar = "⥘";
var LeftUpVector = "↿";
var LeftVectorBar = "⥒";
var LeftVector = "↼";
var lEg = "⪋";
var leg = "⋚";
var leq = "≤";
var leqq = "≦";
var leqslant = "⩽";
var lescc = "⪨";
var les = "⩽";
var lesdot = "⩿";
var lesdoto = "⪁";
var lesdotor = "⪃";
var lesg = "⋚︀";
var lesges = "⪓";
var lessapprox = "⪅";
var lessdot = "⋖";
var lesseqgtr = "⋚";
var lesseqqgtr = "⪋";
var LessEqualGreater = "⋚";
var LessFullEqual = "≦";
var LessGreater = "≶";
var lessgtr = "≶";
var LessLess = "⪡";
var lesssim = "≲";
var LessSlantEqual = "⩽";
var LessTilde = "≲";
var lfisht = "⥼";
var lfloor = "⌊";
var Lfr = "𝔏";
var lfr = "𝔩";
var lg = "≶";
var lgE = "⪑";
var lHar = "⥢";
var lhard = "↽";
var lharu = "↼";
var lharul = "⥪";
var lhblk = "▄";
var LJcy = "Љ";
var ljcy = "љ";
var llarr = "⇇";
var ll = "≪";
var Ll = "⋘";
var llcorner = "⌞";
var Lleftarrow = "⇚";
var llhard = "⥫";
var lltri = "◺";
var Lmidot = "Ŀ";
var lmidot = "ŀ";
var lmoustache = "⎰";
var lmoust = "⎰";
var lnap = "⪉";
var lnapprox = "⪉";
var lne = "⪇";
var lnE = "≨";
var lneq = "⪇";
var lneqq = "≨";
var lnsim = "⋦";
var loang = "⟬";
var loarr = "⇽";
var lobrk = "⟦";
var longleftarrow = "⟵";
var LongLeftArrow = "⟵";
var Longleftarrow = "⟸";
var longleftrightarrow = "⟷";
var LongLeftRightArrow = "⟷";
var Longleftrightarrow = "⟺";
var longmapsto = "⟼";
var longrightarrow = "⟶";
var LongRightArrow = "⟶";
var Longrightarrow = "⟹";
var looparrowleft = "↫";
var looparrowright = "↬";
var lopar = "⦅";
var Lopf = "𝕃";
var lopf = "𝕝";
var loplus = "⨭";
var lotimes = "⨴";
var lowast = "∗";
var lowbar = "_";
var LowerLeftArrow = "↙";
var LowerRightArrow = "↘";
var loz = "◊";
var lozenge = "◊";
var lozf = "⧫";
var lpar = "(";
var lparlt = "⦓";
var lrarr = "⇆";
var lrcorner = "⌟";
var lrhar = "⇋";
var lrhard = "⥭";
var lrm = "‎";
var lrtri = "⊿";
var lsaquo = "‹";
var lscr = "𝓁";
var Lscr = "ℒ";
var lsh = "↰";
var Lsh = "↰";
var lsim = "≲";
var lsime = "⪍";
var lsimg = "⪏";
var lsqb = "[";
var lsquo = "‘";
var lsquor = "‚";
var Lstrok = "Ł";
var lstrok = "ł";
var ltcc = "⪦";
var ltcir = "⩹";
var lt$2 = "<";
var LT$1 = "<";
var Lt = "≪";
var ltdot = "⋖";
var lthree = "⋋";
var ltimes = "⋉";
var ltlarr = "⥶";
var ltquest = "⩻";
var ltri = "◃";
var ltrie = "⊴";
var ltrif = "◂";
var ltrPar = "⦖";
var lurdshar = "⥊";
var luruhar = "⥦";
var lvertneqq = "≨︀";
var lvnE = "≨︀";
var macr$1 = "¯";
var male = "♂";
var malt = "✠";
var maltese = "✠";
var map = "↦";
var mapsto = "↦";
var mapstodown = "↧";
var mapstoleft = "↤";
var mapstoup = "↥";
var marker = "▮";
var mcomma = "⨩";
var Mcy = "М";
var mcy = "м";
var mdash = "—";
var mDDot = "∺";
var measuredangle = "∡";
var MediumSpace = " ";
var Mellintrf = "ℳ";
var Mfr = "𝔐";
var mfr = "𝔪";
var mho = "℧";
var micro$1 = "µ";
var midast = "*";
var midcir = "⫰";
var mid = "∣";
var middot$1 = "·";
var minusb = "⊟";
var minus = "−";
var minusd = "∸";
var minusdu = "⨪";
var MinusPlus = "∓";
var mlcp = "⫛";
var mldr = "…";
var mnplus = "∓";
var models = "⊧";
var Mopf = "𝕄";
var mopf = "𝕞";
var mp = "∓";
var mscr = "𝓂";
var Mscr = "ℳ";
var mstpos = "∾";
var Mu = "Μ";
var mu = "μ";
var multimap = "⊸";
var mumap = "⊸";
var nabla = "∇";
var Nacute = "Ń";
var nacute = "ń";
var nang = "∠⃒";
var nap = "≉";
var napE = "⩰̸";
var napid = "≋̸";
var napos = "ŉ";
var napprox = "≉";
var natural = "♮";
var naturals = "ℕ";
var natur = "♮";
var nbsp$1 = " ";
var nbump = "≎̸";
var nbumpe = "≏̸";
var ncap = "⩃";
var Ncaron = "Ň";
var ncaron = "ň";
var Ncedil = "Ņ";
var ncedil = "ņ";
var ncong = "≇";
var ncongdot = "⩭̸";
var ncup = "⩂";
var Ncy = "Н";
var ncy = "н";
var ndash = "–";
var nearhk = "⤤";
var nearr = "↗";
var neArr = "⇗";
var nearrow = "↗";
var ne = "≠";
var nedot = "≐̸";
var NegativeMediumSpace = "​";
var NegativeThickSpace = "​";
var NegativeThinSpace = "​";
var NegativeVeryThinSpace = "​";
var nequiv = "≢";
var nesear = "⤨";
var nesim = "≂̸";
var NestedGreaterGreater = "≫";
var NestedLessLess = "≪";
var NewLine = "\n";
var nexist = "∄";
var nexists = "∄";
var Nfr = "𝔑";
var nfr = "𝔫";
var ngE = "≧̸";
var nge = "≱";
var ngeq = "≱";
var ngeqq = "≧̸";
var ngeqslant = "⩾̸";
var nges = "⩾̸";
var nGg = "⋙̸";
var ngsim = "≵";
var nGt = "≫⃒";
var ngt = "≯";
var ngtr = "≯";
var nGtv = "≫̸";
var nharr = "↮";
var nhArr = "⇎";
var nhpar = "⫲";
var ni = "∋";
var nis = "⋼";
var nisd = "⋺";
var niv = "∋";
var NJcy = "Њ";
var njcy = "њ";
var nlarr = "↚";
var nlArr = "⇍";
var nldr = "‥";
var nlE = "≦̸";
var nle = "≰";
var nleftarrow = "↚";
var nLeftarrow = "⇍";
var nleftrightarrow = "↮";
var nLeftrightarrow = "⇎";
var nleq = "≰";
var nleqq = "≦̸";
var nleqslant = "⩽̸";
var nles = "⩽̸";
var nless = "≮";
var nLl = "⋘̸";
var nlsim = "≴";
var nLt = "≪⃒";
var nlt = "≮";
var nltri = "⋪";
var nltrie = "⋬";
var nLtv = "≪̸";
var nmid = "∤";
var NoBreak = "⁠";
var NonBreakingSpace = " ";
var nopf = "𝕟";
var Nopf = "ℕ";
var Not = "⫬";
var not$1 = "¬";
var NotCongruent = "≢";
var NotCupCap = "≭";
var NotDoubleVerticalBar = "∦";
var NotElement = "∉";
var NotEqual = "≠";
var NotEqualTilde = "≂̸";
var NotExists = "∄";
var NotGreater = "≯";
var NotGreaterEqual = "≱";
var NotGreaterFullEqual = "≧̸";
var NotGreaterGreater = "≫̸";
var NotGreaterLess = "≹";
var NotGreaterSlantEqual = "⩾̸";
var NotGreaterTilde = "≵";
var NotHumpDownHump = "≎̸";
var NotHumpEqual = "≏̸";
var notin = "∉";
var notindot = "⋵̸";
var notinE = "⋹̸";
var notinva = "∉";
var notinvb = "⋷";
var notinvc = "⋶";
var NotLeftTriangleBar = "⧏̸";
var NotLeftTriangle = "⋪";
var NotLeftTriangleEqual = "⋬";
var NotLess = "≮";
var NotLessEqual = "≰";
var NotLessGreater = "≸";
var NotLessLess = "≪̸";
var NotLessSlantEqual = "⩽̸";
var NotLessTilde = "≴";
var NotNestedGreaterGreater = "⪢̸";
var NotNestedLessLess = "⪡̸";
var notni = "∌";
var notniva = "∌";
var notnivb = "⋾";
var notnivc = "⋽";
var NotPrecedes = "⊀";
var NotPrecedesEqual = "⪯̸";
var NotPrecedesSlantEqual = "⋠";
var NotReverseElement = "∌";
var NotRightTriangleBar = "⧐̸";
var NotRightTriangle = "⋫";
var NotRightTriangleEqual = "⋭";
var NotSquareSubset = "⊏̸";
var NotSquareSubsetEqual = "⋢";
var NotSquareSuperset = "⊐̸";
var NotSquareSupersetEqual = "⋣";
var NotSubset = "⊂⃒";
var NotSubsetEqual = "⊈";
var NotSucceeds = "⊁";
var NotSucceedsEqual = "⪰̸";
var NotSucceedsSlantEqual = "⋡";
var NotSucceedsTilde = "≿̸";
var NotSuperset = "⊃⃒";
var NotSupersetEqual = "⊉";
var NotTilde = "≁";
var NotTildeEqual = "≄";
var NotTildeFullEqual = "≇";
var NotTildeTilde = "≉";
var NotVerticalBar = "∤";
var nparallel = "∦";
var npar = "∦";
var nparsl = "⫽⃥";
var npart = "∂̸";
var npolint = "⨔";
var npr = "⊀";
var nprcue = "⋠";
var nprec = "⊀";
var npreceq = "⪯̸";
var npre = "⪯̸";
var nrarrc = "⤳̸";
var nrarr = "↛";
var nrArr = "⇏";
var nrarrw = "↝̸";
var nrightarrow = "↛";
var nRightarrow = "⇏";
var nrtri = "⋫";
var nrtrie = "⋭";
var nsc = "⊁";
var nsccue = "⋡";
var nsce = "⪰̸";
var Nscr = "𝒩";
var nscr = "𝓃";
var nshortmid = "∤";
var nshortparallel = "∦";
var nsim = "≁";
var nsime = "≄";
var nsimeq = "≄";
var nsmid = "∤";
var nspar = "∦";
var nsqsube = "⋢";
var nsqsupe = "⋣";
var nsub = "⊄";
var nsubE = "⫅̸";
var nsube = "⊈";
var nsubset = "⊂⃒";
var nsubseteq = "⊈";
var nsubseteqq = "⫅̸";
var nsucc = "⊁";
var nsucceq = "⪰̸";
var nsup = "⊅";
var nsupE = "⫆̸";
var nsupe = "⊉";
var nsupset = "⊃⃒";
var nsupseteq = "⊉";
var nsupseteqq = "⫆̸";
var ntgl = "≹";
var Ntilde$1 = "Ñ";
var ntilde$1 = "ñ";
var ntlg = "≸";
var ntriangleleft = "⋪";
var ntrianglelefteq = "⋬";
var ntriangleright = "⋫";
var ntrianglerighteq = "⋭";
var Nu = "Ν";
var nu = "ν";
var num = "#";
var numero = "№";
var numsp = " ";
var nvap = "≍⃒";
var nvdash = "⊬";
var nvDash = "⊭";
var nVdash = "⊮";
var nVDash = "⊯";
var nvge = "≥⃒";
var nvgt = ">⃒";
var nvHarr = "⤄";
var nvinfin = "⧞";
var nvlArr = "⤂";
var nvle = "≤⃒";
var nvlt = "<⃒";
var nvltrie = "⊴⃒";
var nvrArr = "⤃";
var nvrtrie = "⊵⃒";
var nvsim = "∼⃒";
var nwarhk = "⤣";
var nwarr = "↖";
var nwArr = "⇖";
var nwarrow = "↖";
var nwnear = "⤧";
var Oacute$1 = "Ó";
var oacute$1 = "ó";
var oast = "⊛";
var Ocirc$1 = "Ô";
var ocirc$1 = "ô";
var ocir = "⊚";
var Ocy = "О";
var ocy = "о";
var odash = "⊝";
var Odblac = "Ő";
var odblac = "ő";
var odiv = "⨸";
var odot = "⊙";
var odsold = "⦼";
var OElig = "Œ";
var oelig = "œ";
var ofcir = "⦿";
var Ofr = "𝔒";
var ofr = "𝔬";
var ogon = "˛";
var Ograve$1 = "Ò";
var ograve$1 = "ò";
var ogt = "⧁";
var ohbar = "⦵";
var ohm = "Ω";
var oint = "∮";
var olarr = "↺";
var olcir = "⦾";
var olcross = "⦻";
var oline = "‾";
var olt = "⧀";
var Omacr = "Ō";
var omacr = "ō";
var Omega = "Ω";
var omega = "ω";
var Omicron = "Ο";
var omicron = "ο";
var omid = "⦶";
var ominus = "⊖";
var Oopf = "𝕆";
var oopf = "𝕠";
var opar = "⦷";
var OpenCurlyDoubleQuote = "“";
var OpenCurlyQuote = "‘";
var operp = "⦹";
var oplus = "⊕";
var orarr = "↻";
var Or = "⩔";
var or = "∨";
var ord = "⩝";
var order = "ℴ";
var orderof = "ℴ";
var ordf$1 = "ª";
var ordm$1 = "º";
var origof = "⊶";
var oror = "⩖";
var orslope = "⩗";
var orv = "⩛";
var oS = "Ⓢ";
var Oscr = "𝒪";
var oscr = "ℴ";
var Oslash$1 = "Ø";
var oslash$1 = "ø";
var osol = "⊘";
var Otilde$1 = "Õ";
var otilde$1 = "õ";
var otimesas = "⨶";
var Otimes = "⨷";
var otimes = "⊗";
var Ouml$1 = "Ö";
var ouml$1 = "ö";
var ovbar = "⌽";
var OverBar = "‾";
var OverBrace = "⏞";
var OverBracket = "⎴";
var OverParenthesis = "⏜";
var para$1 = "¶";
var parallel = "∥";
var par = "∥";
var parsim = "⫳";
var parsl = "⫽";
var part = "∂";
var PartialD = "∂";
var Pcy = "П";
var pcy = "п";
var percnt = "%";
var period = ".";
var permil = "‰";
var perp = "⊥";
var pertenk = "‱";
var Pfr = "𝔓";
var pfr = "𝔭";
var Phi = "Φ";
var phi = "φ";
var phiv = "ϕ";
var phmmat = "ℳ";
var phone = "☎";
var Pi = "Π";
var pi = "π";
var pitchfork = "⋔";
var piv = "ϖ";
var planck = "ℏ";
var planckh = "ℎ";
var plankv = "ℏ";
var plusacir = "⨣";
var plusb = "⊞";
var pluscir = "⨢";
var plus = "+";
var plusdo = "∔";
var plusdu = "⨥";
var pluse = "⩲";
var PlusMinus = "±";
var plusmn$1 = "±";
var plussim = "⨦";
var plustwo = "⨧";
var pm = "±";
var Poincareplane = "ℌ";
var pointint = "⨕";
var popf = "𝕡";
var Popf = "ℙ";
var pound$1 = "£";
var prap = "⪷";
var Pr = "⪻";
var pr = "≺";
var prcue = "≼";
var precapprox = "⪷";
var prec = "≺";
var preccurlyeq = "≼";
var Precedes = "≺";
var PrecedesEqual = "⪯";
var PrecedesSlantEqual = "≼";
var PrecedesTilde = "≾";
var preceq = "⪯";
var precnapprox = "⪹";
var precneqq = "⪵";
var precnsim = "⋨";
var pre = "⪯";
var prE = "⪳";
var precsim = "≾";
var prime = "′";
var Prime = "″";
var primes = "ℙ";
var prnap = "⪹";
var prnE = "⪵";
var prnsim = "⋨";
var prod = "∏";
var Product = "∏";
var profalar = "⌮";
var profline = "⌒";
var profsurf = "⌓";
var prop = "∝";
var Proportional = "∝";
var Proportion = "∷";
var propto = "∝";
var prsim = "≾";
var prurel = "⊰";
var Pscr = "𝒫";
var pscr = "𝓅";
var Psi = "Ψ";
var psi = "ψ";
var puncsp = " ";
var Qfr = "𝔔";
var qfr = "𝔮";
var qint = "⨌";
var qopf = "𝕢";
var Qopf = "ℚ";
var qprime = "⁗";
var Qscr = "𝒬";
var qscr = "𝓆";
var quaternions = "ℍ";
var quatint = "⨖";
var quest = "?";
var questeq = "≟";
var quot$2 = "\"";
var QUOT$1 = "\"";
var rAarr = "⇛";
var race = "∽̱";
var Racute = "Ŕ";
var racute = "ŕ";
var radic = "√";
var raemptyv = "⦳";
var rang = "⟩";
var Rang = "⟫";
var rangd = "⦒";
var range = "⦥";
var rangle = "⟩";
var raquo$1 = "»";
var rarrap = "⥵";
var rarrb = "⇥";
var rarrbfs = "⤠";
var rarrc = "⤳";
var rarr = "→";
var Rarr = "↠";
var rArr = "⇒";
var rarrfs = "⤞";
var rarrhk = "↪";
var rarrlp = "↬";
var rarrpl = "⥅";
var rarrsim = "⥴";
var Rarrtl = "⤖";
var rarrtl = "↣";
var rarrw = "↝";
var ratail = "⤚";
var rAtail = "⤜";
var ratio = "∶";
var rationals = "ℚ";
var rbarr = "⤍";
var rBarr = "⤏";
var RBarr = "⤐";
var rbbrk = "❳";
var rbrace = "}";
var rbrack = "]";
var rbrke = "⦌";
var rbrksld = "⦎";
var rbrkslu = "⦐";
var Rcaron = "Ř";
var rcaron = "ř";
var Rcedil = "Ŗ";
var rcedil = "ŗ";
var rceil = "⌉";
var rcub = "}";
var Rcy = "Р";
var rcy = "р";
var rdca = "⤷";
var rdldhar = "⥩";
var rdquo = "”";
var rdquor = "”";
var rdsh = "↳";
var real = "ℜ";
var realine = "ℛ";
var realpart = "ℜ";
var reals = "ℝ";
var Re = "ℜ";
var rect = "▭";
var reg$1 = "®";
var REG$1 = "®";
var ReverseElement = "∋";
var ReverseEquilibrium = "⇋";
var ReverseUpEquilibrium = "⥯";
var rfisht = "⥽";
var rfloor = "⌋";
var rfr = "𝔯";
var Rfr = "ℜ";
var rHar = "⥤";
var rhard = "⇁";
var rharu = "⇀";
var rharul = "⥬";
var Rho = "Ρ";
var rho = "ρ";
var rhov = "ϱ";
var RightAngleBracket = "⟩";
var RightArrowBar = "⇥";
var rightarrow = "→";
var RightArrow = "→";
var Rightarrow = "⇒";
var RightArrowLeftArrow = "⇄";
var rightarrowtail = "↣";
var RightCeiling = "⌉";
var RightDoubleBracket = "⟧";
var RightDownTeeVector = "⥝";
var RightDownVectorBar = "⥕";
var RightDownVector = "⇂";
var RightFloor = "⌋";
var rightharpoondown = "⇁";
var rightharpoonup = "⇀";
var rightleftarrows = "⇄";
var rightleftharpoons = "⇌";
var rightrightarrows = "⇉";
var rightsquigarrow = "↝";
var RightTeeArrow = "↦";
var RightTee = "⊢";
var RightTeeVector = "⥛";
var rightthreetimes = "⋌";
var RightTriangleBar = "⧐";
var RightTriangle = "⊳";
var RightTriangleEqual = "⊵";
var RightUpDownVector = "⥏";
var RightUpTeeVector = "⥜";
var RightUpVectorBar = "⥔";
var RightUpVector = "↾";
var RightVectorBar = "⥓";
var RightVector = "⇀";
var ring = "˚";
var risingdotseq = "≓";
var rlarr = "⇄";
var rlhar = "⇌";
var rlm = "‏";
var rmoustache = "⎱";
var rmoust = "⎱";
var rnmid = "⫮";
var roang = "⟭";
var roarr = "⇾";
var robrk = "⟧";
var ropar = "⦆";
var ropf = "𝕣";
var Ropf = "ℝ";
var roplus = "⨮";
var rotimes = "⨵";
var RoundImplies = "⥰";
var rpar = ")";
var rpargt = "⦔";
var rppolint = "⨒";
var rrarr = "⇉";
var Rrightarrow = "⇛";
var rsaquo = "›";
var rscr = "𝓇";
var Rscr = "ℛ";
var rsh = "↱";
var Rsh = "↱";
var rsqb = "]";
var rsquo = "’";
var rsquor = "’";
var rthree = "⋌";
var rtimes = "⋊";
var rtri = "▹";
var rtrie = "⊵";
var rtrif = "▸";
var rtriltri = "⧎";
var RuleDelayed = "⧴";
var ruluhar = "⥨";
var rx = "℞";
var Sacute = "Ś";
var sacute = "ś";
var sbquo = "‚";
var scap = "⪸";
var Scaron = "Š";
var scaron = "š";
var Sc = "⪼";
var sc = "≻";
var sccue = "≽";
var sce = "⪰";
var scE = "⪴";
var Scedil = "Ş";
var scedil = "ş";
var Scirc = "Ŝ";
var scirc = "ŝ";
var scnap = "⪺";
var scnE = "⪶";
var scnsim = "⋩";
var scpolint = "⨓";
var scsim = "≿";
var Scy = "С";
var scy = "с";
var sdotb = "⊡";
var sdot = "⋅";
var sdote = "⩦";
var searhk = "⤥";
var searr = "↘";
var seArr = "⇘";
var searrow = "↘";
var sect$1 = "§";
var semi = ";";
var seswar = "⤩";
var setminus = "∖";
var setmn = "∖";
var sext = "✶";
var Sfr = "𝔖";
var sfr = "𝔰";
var sfrown = "⌢";
var sharp = "♯";
var SHCHcy = "Щ";
var shchcy = "щ";
var SHcy = "Ш";
var shcy = "ш";
var ShortDownArrow = "↓";
var ShortLeftArrow = "←";
var shortmid = "∣";
var shortparallel = "∥";
var ShortRightArrow = "→";
var ShortUpArrow = "↑";
var shy$1 = "­";
var Sigma = "Σ";
var sigma = "σ";
var sigmaf = "ς";
var sigmav = "ς";
var sim = "∼";
var simdot = "⩪";
var sime = "≃";
var simeq = "≃";
var simg = "⪞";
var simgE = "⪠";
var siml = "⪝";
var simlE = "⪟";
var simne = "≆";
var simplus = "⨤";
var simrarr = "⥲";
var slarr = "←";
var SmallCircle = "∘";
var smallsetminus = "∖";
var smashp = "⨳";
var smeparsl = "⧤";
var smid = "∣";
var smile = "⌣";
var smt = "⪪";
var smte = "⪬";
var smtes = "⪬︀";
var SOFTcy = "Ь";
var softcy = "ь";
var solbar = "⌿";
var solb = "⧄";
var sol = "/";
var Sopf = "𝕊";
var sopf = "𝕤";
var spades = "♠";
var spadesuit = "♠";
var spar = "∥";
var sqcap = "⊓";
var sqcaps = "⊓︀";
var sqcup = "⊔";
var sqcups = "⊔︀";
var Sqrt = "√";
var sqsub = "⊏";
var sqsube = "⊑";
var sqsubset = "⊏";
var sqsubseteq = "⊑";
var sqsup = "⊐";
var sqsupe = "⊒";
var sqsupset = "⊐";
var sqsupseteq = "⊒";
var square = "□";
var Square = "□";
var SquareIntersection = "⊓";
var SquareSubset = "⊏";
var SquareSubsetEqual = "⊑";
var SquareSuperset = "⊐";
var SquareSupersetEqual = "⊒";
var SquareUnion = "⊔";
var squarf = "▪";
var squ = "□";
var squf = "▪";
var srarr = "→";
var Sscr = "𝒮";
var sscr = "𝓈";
var ssetmn = "∖";
var ssmile = "⌣";
var sstarf = "⋆";
var Star = "⋆";
var star = "☆";
var starf = "★";
var straightepsilon = "ϵ";
var straightphi = "ϕ";
var strns = "¯";
var sub = "⊂";
var Sub = "⋐";
var subdot = "⪽";
var subE = "⫅";
var sube = "⊆";
var subedot = "⫃";
var submult = "⫁";
var subnE = "⫋";
var subne = "⊊";
var subplus = "⪿";
var subrarr = "⥹";
var subset = "⊂";
var Subset = "⋐";
var subseteq = "⊆";
var subseteqq = "⫅";
var SubsetEqual = "⊆";
var subsetneq = "⊊";
var subsetneqq = "⫋";
var subsim = "⫇";
var subsub = "⫕";
var subsup = "⫓";
var succapprox = "⪸";
var succ = "≻";
var succcurlyeq = "≽";
var Succeeds = "≻";
var SucceedsEqual = "⪰";
var SucceedsSlantEqual = "≽";
var SucceedsTilde = "≿";
var succeq = "⪰";
var succnapprox = "⪺";
var succneqq = "⪶";
var succnsim = "⋩";
var succsim = "≿";
var SuchThat = "∋";
var sum = "∑";
var Sum = "∑";
var sung = "♪";
var sup1$1 = "¹";
var sup2$1 = "²";
var sup3$1 = "³";
var sup = "⊃";
var Sup = "⋑";
var supdot = "⪾";
var supdsub = "⫘";
var supE = "⫆";
var supe = "⊇";
var supedot = "⫄";
var Superset = "⊃";
var SupersetEqual = "⊇";
var suphsol = "⟉";
var suphsub = "⫗";
var suplarr = "⥻";
var supmult = "⫂";
var supnE = "⫌";
var supne = "⊋";
var supplus = "⫀";
var supset = "⊃";
var Supset = "⋑";
var supseteq = "⊇";
var supseteqq = "⫆";
var supsetneq = "⊋";
var supsetneqq = "⫌";
var supsim = "⫈";
var supsub = "⫔";
var supsup = "⫖";
var swarhk = "⤦";
var swarr = "↙";
var swArr = "⇙";
var swarrow = "↙";
var swnwar = "⤪";
var szlig$1 = "ß";
var Tab = "\t";
var target = "⌖";
var Tau = "Τ";
var tau = "τ";
var tbrk = "⎴";
var Tcaron = "Ť";
var tcaron = "ť";
var Tcedil = "Ţ";
var tcedil = "ţ";
var Tcy = "Т";
var tcy = "т";
var tdot = "⃛";
var telrec = "⌕";
var Tfr = "𝔗";
var tfr = "𝔱";
var there4 = "∴";
var therefore = "∴";
var Therefore = "∴";
var Theta = "Θ";
var theta = "θ";
var thetasym = "ϑ";
var thetav = "ϑ";
var thickapprox = "≈";
var thicksim = "∼";
var ThickSpace = "  ";
var ThinSpace = " ";
var thinsp = " ";
var thkap = "≈";
var thksim = "∼";
var THORN$1 = "Þ";
var thorn$1 = "þ";
var tilde = "˜";
var Tilde = "∼";
var TildeEqual = "≃";
var TildeFullEqual = "≅";
var TildeTilde = "≈";
var timesbar = "⨱";
var timesb = "⊠";
var times$1 = "×";
var timesd = "⨰";
var tint = "∭";
var toea = "⤨";
var topbot = "⌶";
var topcir = "⫱";
var esm_top = "⊤";
var Topf = "𝕋";
var topf = "𝕥";
var topfork = "⫚";
var tosa = "⤩";
var tprime = "‴";
var trade = "™";
var TRADE = "™";
var triangle = "▵";
var triangledown = "▿";
var triangleleft = "◃";
var trianglelefteq = "⊴";
var triangleq = "≜";
var triangleright = "▹";
var trianglerighteq = "⊵";
var tridot = "◬";
var trie = "≜";
var triminus = "⨺";
var TripleDot = "⃛";
var triplus = "⨹";
var trisb = "⧍";
var tritime = "⨻";
var trpezium = "⏢";
var Tscr = "𝒯";
var tscr = "𝓉";
var TScy = "Ц";
var tscy = "ц";
var TSHcy = "Ћ";
var tshcy = "ћ";
var Tstrok = "Ŧ";
var tstrok = "ŧ";
var twixt = "≬";
var twoheadleftarrow = "↞";
var twoheadrightarrow = "↠";
var Uacute$1 = "Ú";
var uacute$1 = "ú";
var uarr = "↑";
var Uarr = "↟";
var uArr = "⇑";
var Uarrocir = "⥉";
var Ubrcy = "Ў";
var ubrcy = "ў";
var Ubreve = "Ŭ";
var ubreve = "ŭ";
var Ucirc$1 = "Û";
var ucirc$1 = "û";
var Ucy = "У";
var ucy = "у";
var udarr = "⇅";
var Udblac = "Ű";
var udblac = "ű";
var udhar = "⥮";
var ufisht = "⥾";
var Ufr = "𝔘";
var ufr = "𝔲";
var Ugrave$1 = "Ù";
var ugrave$1 = "ù";
var uHar = "⥣";
var uharl = "↿";
var uharr = "↾";
var uhblk = "▀";
var ulcorn = "⌜";
var ulcorner = "⌜";
var ulcrop = "⌏";
var ultri = "◸";
var Umacr = "Ū";
var umacr = "ū";
var uml$1 = "¨";
var UnderBar = "_";
var UnderBrace = "⏟";
var UnderBracket = "⎵";
var UnderParenthesis = "⏝";
var Union = "⋃";
var UnionPlus = "⊎";
var Uogon = "Ų";
var uogon = "ų";
var Uopf = "𝕌";
var uopf = "𝕦";
var UpArrowBar = "⤒";
var uparrow = "↑";
var UpArrow = "↑";
var Uparrow = "⇑";
var UpArrowDownArrow = "⇅";
var updownarrow = "↕";
var UpDownArrow = "↕";
var Updownarrow = "⇕";
var UpEquilibrium = "⥮";
var upharpoonleft = "↿";
var upharpoonright = "↾";
var uplus = "⊎";
var UpperLeftArrow = "↖";
var UpperRightArrow = "↗";
var upsi = "υ";
var Upsi = "ϒ";
var upsih = "ϒ";
var Upsilon = "Υ";
var upsilon = "υ";
var UpTeeArrow = "↥";
var UpTee = "⊥";
var upuparrows = "⇈";
var urcorn = "⌝";
var urcorner = "⌝";
var urcrop = "⌎";
var Uring = "Ů";
var uring = "ů";
var urtri = "◹";
var Uscr = "𝒰";
var uscr = "𝓊";
var utdot = "⋰";
var Utilde = "Ũ";
var utilde = "ũ";
var utri = "▵";
var utrif = "▴";
var uuarr = "⇈";
var Uuml$1 = "Ü";
var uuml$1 = "ü";
var uwangle = "⦧";
var vangrt = "⦜";
var varepsilon = "ϵ";
var varkappa = "ϰ";
var varnothing = "∅";
var varphi = "ϕ";
var varpi = "ϖ";
var varpropto = "∝";
var varr = "↕";
var vArr = "⇕";
var varrho = "ϱ";
var varsigma = "ς";
var varsubsetneq = "⊊︀";
var varsubsetneqq = "⫋︀";
var varsupsetneq = "⊋︀";
var varsupsetneqq = "⫌︀";
var vartheta = "ϑ";
var vartriangleleft = "⊲";
var vartriangleright = "⊳";
var vBar = "⫨";
var Vbar = "⫫";
var vBarv = "⫩";
var Vcy = "В";
var vcy = "в";
var vdash = "⊢";
var vDash = "⊨";
var Vdash = "⊩";
var VDash = "⊫";
var Vdashl = "⫦";
var veebar = "⊻";
var vee = "∨";
var Vee = "⋁";
var veeeq = "≚";
var vellip = "⋮";
var verbar = "|";
var Verbar = "‖";
var vert = "|";
var Vert = "‖";
var VerticalBar = "∣";
var VerticalLine = "|";
var VerticalSeparator = "❘";
var VerticalTilde = "≀";
var VeryThinSpace = " ";
var Vfr = "𝔙";
var vfr = "𝔳";
var vltri = "⊲";
var vnsub = "⊂⃒";
var vnsup = "⊃⃒";
var Vopf = "𝕍";
var vopf = "𝕧";
var vprop = "∝";
var vrtri = "⊳";
var Vscr = "𝒱";
var vscr = "𝓋";
var vsubnE = "⫋︀";
var vsubne = "⊊︀";
var vsupnE = "⫌︀";
var vsupne = "⊋︀";
var Vvdash = "⊪";
var vzigzag = "⦚";
var Wcirc = "Ŵ";
var wcirc = "ŵ";
var wedbar = "⩟";
var wedge = "∧";
var Wedge = "⋀";
var wedgeq = "≙";
var weierp = "℘";
var Wfr = "𝔚";
var wfr = "𝔴";
var Wopf = "𝕎";
var wopf = "𝕨";
var wp = "℘";
var wr = "≀";
var wreath = "≀";
var Wscr = "𝒲";
var wscr = "𝓌";
var xcap = "⋂";
var xcirc = "◯";
var xcup = "⋃";
var xdtri = "▽";
var Xfr = "𝔛";
var xfr = "𝔵";
var xharr = "⟷";
var xhArr = "⟺";
var Xi = "Ξ";
var xi = "ξ";
var xlarr = "⟵";
var xlArr = "⟸";
var xmap = "⟼";
var xnis = "⋻";
var xodot = "⨀";
var Xopf = "𝕏";
var xopf = "𝕩";
var xoplus = "⨁";
var xotime = "⨂";
var xrarr = "⟶";
var xrArr = "⟹";
var Xscr = "𝒳";
var xscr = "𝓍";
var xsqcup = "⨆";
var xuplus = "⨄";
var xutri = "△";
var xvee = "⋁";
var xwedge = "⋀";
var Yacute$1 = "Ý";
var yacute$1 = "ý";
var YAcy = "Я";
var yacy = "я";
var Ycirc = "Ŷ";
var ycirc = "ŷ";
var Ycy = "Ы";
var ycy = "ы";
var yen$1 = "¥";
var Yfr = "𝔜";
var yfr = "𝔶";
var YIcy = "Ї";
var yicy = "ї";
var Yopf = "𝕐";
var yopf = "𝕪";
var Yscr = "𝒴";
var yscr = "𝓎";
var YUcy = "Ю";
var yucy = "ю";
var yuml$1 = "ÿ";
var Yuml = "Ÿ";
var Zacute = "Ź";
var zacute = "ź";
var Zcaron = "Ž";
var zcaron = "ž";
var Zcy = "З";
var zcy = "з";
var Zdot = "Ż";
var zdot = "ż";
var zeetrf = "ℨ";
var ZeroWidthSpace = "​";
var Zeta = "Ζ";
var zeta = "ζ";
var zfr = "𝔷";
var Zfr = "ℨ";
var ZHcy = "Ж";
var zhcy = "ж";
var zigrarr = "⇝";
var zopf = "𝕫";
var Zopf = "ℤ";
var Zscr = "𝒵";
var zscr = "𝓏";
var zwj = "‍";
var zwnj = "‌";
var require$$1$1 = {
    Aacute: Aacute$1,
    aacute: aacute$1,
    Abreve: Abreve,
    abreve: abreve,
    ac: ac,
    acd: acd,
    acE: acE,
    Acirc: Acirc$1,
    acirc: acirc$1,
    acute: acute$1,
    Acy: Acy,
    acy: acy,
    AElig: AElig$1,
    aelig: aelig$1,
    af: af,
    Afr: Afr,
    afr: afr,
    Agrave: Agrave$1,
    agrave: agrave$1,
    alefsym: alefsym,
    aleph: aleph,
    Alpha: Alpha,
    alpha: alpha,
    Amacr: Amacr,
    amacr: amacr,
    amalg: amalg,
    amp: amp$2,
    AMP: AMP$1,
    andand: andand,
    And: And,
    and: and,
    andd: andd,
    andslope: andslope,
    andv: andv,
    ang: ang,
    ange: ange,
    angle: angle,
    angmsdaa: angmsdaa,
    angmsdab: angmsdab,
    angmsdac: angmsdac,
    angmsdad: angmsdad,
    angmsdae: angmsdae,
    angmsdaf: angmsdaf,
    angmsdag: angmsdag,
    angmsdah: angmsdah,
    angmsd: angmsd,
    angrt: angrt,
    angrtvb: angrtvb,
    angrtvbd: angrtvbd,
    angsph: angsph,
    angst: angst,
    angzarr: angzarr,
    Aogon: Aogon,
    aogon: aogon,
    Aopf: Aopf,
    aopf: aopf,
    apacir: apacir,
    ap: ap,
    apE: apE,
    ape: ape,
    apid: apid,
    apos: apos$1,
    ApplyFunction: ApplyFunction,
    approx: approx,
    approxeq: approxeq,
    Aring: Aring$1,
    aring: aring$1,
    Ascr: Ascr,
    ascr: ascr,
    Assign: Assign,
    ast: ast,
    asymp: asymp,
    asympeq: asympeq,
    Atilde: Atilde$1,
    atilde: atilde$1,
    Auml: Auml$1,
    auml: auml$1,
    awconint: awconint,
    awint: awint,
    backcong: backcong,
    backepsilon: backepsilon,
    backprime: backprime,
    backsim: backsim,
    backsimeq: backsimeq,
    Backslash: Backslash,
    Barv: Barv,
    barvee: barvee,
    barwed: barwed,
    Barwed: Barwed,
    barwedge: barwedge,
    bbrk: bbrk,
    bbrktbrk: bbrktbrk,
    bcong: bcong,
    Bcy: Bcy,
    bcy: bcy,
    bdquo: bdquo,
    becaus: becaus,
    because: because,
    Because: Because,
    bemptyv: bemptyv,
    bepsi: bepsi,
    bernou: bernou,
    Bernoullis: Bernoullis,
    Beta: Beta,
    beta: beta,
    beth: beth,
    between: between,
    Bfr: Bfr,
    bfr: bfr,
    bigcap: bigcap,
    bigcirc: bigcirc,
    bigcup: bigcup,
    bigodot: bigodot,
    bigoplus: bigoplus,
    bigotimes: bigotimes,
    bigsqcup: bigsqcup,
    bigstar: bigstar,
    bigtriangledown: bigtriangledown,
    bigtriangleup: bigtriangleup,
    biguplus: biguplus,
    bigvee: bigvee,
    bigwedge: bigwedge,
    bkarow: bkarow,
    blacklozenge: blacklozenge,
    blacksquare: blacksquare,
    blacktriangle: blacktriangle,
    blacktriangledown: blacktriangledown,
    blacktriangleleft: blacktriangleleft,
    blacktriangleright: blacktriangleright,
    blank: blank,
    blk12: blk12,
    blk14: blk14,
    blk34: blk34,
    block: block,
    bne: bne,
    bnequiv: bnequiv,
    bNot: bNot,
    bnot: bnot,
    Bopf: Bopf,
    bopf: bopf,
    bot: bot,
    bottom: bottom,
    bowtie: bowtie,
    boxbox: boxbox,
    boxdl: boxdl,
    boxdL: boxdL,
    boxDl: boxDl,
    boxDL: boxDL,
    boxdr: boxdr,
    boxdR: boxdR,
    boxDr: boxDr,
    boxDR: boxDR,
    boxh: boxh,
    boxH: boxH,
    boxhd: boxhd,
    boxHd: boxHd,
    boxhD: boxhD,
    boxHD: boxHD,
    boxhu: boxhu,
    boxHu: boxHu,
    boxhU: boxhU,
    boxHU: boxHU,
    boxminus: boxminus,
    boxplus: boxplus,
    boxtimes: boxtimes,
    boxul: boxul,
    boxuL: boxuL,
    boxUl: boxUl,
    boxUL: boxUL,
    boxur: boxur,
    boxuR: boxuR,
    boxUr: boxUr,
    boxUR: boxUR,
    boxv: boxv,
    boxV: boxV,
    boxvh: boxvh,
    boxvH: boxvH,
    boxVh: boxVh,
    boxVH: boxVH,
    boxvl: boxvl,
    boxvL: boxvL,
    boxVl: boxVl,
    boxVL: boxVL,
    boxvr: boxvr,
    boxvR: boxvR,
    boxVr: boxVr,
    boxVR: boxVR,
    bprime: bprime,
    breve: breve,
    Breve: Breve,
    brvbar: brvbar$1,
    bscr: bscr,
    Bscr: Bscr,
    bsemi: bsemi,
    bsim: bsim,
    bsime: bsime,
    bsolb: bsolb,
    bsol: bsol,
    bsolhsub: bsolhsub,
    bull: bull,
    bullet: bullet,
    bump: bump,
    bumpE: bumpE,
    bumpe: bumpe,
    Bumpeq: Bumpeq,
    bumpeq: bumpeq,
    Cacute: Cacute,
    cacute: cacute,
    capand: capand,
    capbrcup: capbrcup,
    capcap: capcap,
    cap: cap,
    Cap: Cap,
    capcup: capcup,
    capdot: capdot,
    CapitalDifferentialD: CapitalDifferentialD,
    caps: caps,
    caret: caret,
    caron: caron,
    Cayleys: Cayleys,
    ccaps: ccaps,
    Ccaron: Ccaron,
    ccaron: ccaron,
    Ccedil: Ccedil$1,
    ccedil: ccedil$1,
    Ccirc: Ccirc,
    ccirc: ccirc,
    Cconint: Cconint,
    ccups: ccups,
    ccupssm: ccupssm,
    Cdot: Cdot,
    cdot: cdot,
    cedil: cedil$1,
    Cedilla: Cedilla,
    cemptyv: cemptyv,
    cent: cent$1,
    centerdot: centerdot,
    CenterDot: CenterDot,
    cfr: cfr,
    Cfr: Cfr,
    CHcy: CHcy,
    chcy: chcy,
    check: check,
    checkmark: checkmark,
    Chi: Chi,
    chi: chi,
    circ: circ,
    circeq: circeq,
    circlearrowleft: circlearrowleft,
    circlearrowright: circlearrowright,
    circledast: circledast,
    circledcirc: circledcirc,
    circleddash: circleddash,
    CircleDot: CircleDot,
    circledR: circledR,
    circledS: circledS,
    CircleMinus: CircleMinus,
    CirclePlus: CirclePlus,
    CircleTimes: CircleTimes,
    cir: cir,
    cirE: cirE,
    cire: cire,
    cirfnint: cirfnint,
    cirmid: cirmid,
    cirscir: cirscir,
    ClockwiseContourIntegral: ClockwiseContourIntegral,
    CloseCurlyDoubleQuote: CloseCurlyDoubleQuote,
    CloseCurlyQuote: CloseCurlyQuote,
    clubs: clubs,
    clubsuit: clubsuit,
    colon: colon,
    Colon: Colon,
    Colone: Colone,
    colone: colone,
    coloneq: coloneq,
    comma: comma,
    commat: commat,
    comp: comp,
    compfn: compfn,
    complement: complement,
    complexes: complexes,
    cong: cong,
    congdot: congdot,
    Congruent: Congruent,
    conint: conint,
    Conint: Conint,
    ContourIntegral: ContourIntegral,
    copf: copf,
    Copf: Copf,
    coprod: coprod,
    Coproduct: Coproduct,
    copy: copy$1,
    COPY: COPY$1,
    copysr: copysr,
    CounterClockwiseContourIntegral: CounterClockwiseContourIntegral,
    crarr: crarr,
    cross: cross,
    Cross: Cross,
    Cscr: Cscr,
    cscr: cscr,
    csub: csub,
    csube: csube,
    csup: csup,
    csupe: csupe,
    ctdot: ctdot,
    cudarrl: cudarrl,
    cudarrr: cudarrr,
    cuepr: cuepr,
    cuesc: cuesc,
    cularr: cularr,
    cularrp: cularrp,
    cupbrcap: cupbrcap,
    cupcap: cupcap,
    CupCap: CupCap,
    cup: cup,
    Cup: Cup,
    cupcup: cupcup,
    cupdot: cupdot,
    cupor: cupor,
    cups: cups,
    curarr: curarr,
    curarrm: curarrm,
    curlyeqprec: curlyeqprec,
    curlyeqsucc: curlyeqsucc,
    curlyvee: curlyvee,
    curlywedge: curlywedge,
    curren: curren$1,
    curvearrowleft: curvearrowleft,
    curvearrowright: curvearrowright,
    cuvee: cuvee,
    cuwed: cuwed,
    cwconint: cwconint,
    cwint: cwint,
    cylcty: cylcty,
    dagger: dagger,
    Dagger: Dagger,
    daleth: daleth,
    darr: darr,
    Darr: Darr,
    dArr: dArr,
    dash: dash,
    Dashv: Dashv,
    dashv: dashv,
    dbkarow: dbkarow,
    dblac: dblac,
    Dcaron: Dcaron,
    dcaron: dcaron,
    Dcy: Dcy,
    dcy: dcy,
    ddagger: ddagger,
    ddarr: ddarr,
    DD: DD,
    dd: dd,
    DDotrahd: DDotrahd,
    ddotseq: ddotseq,
    deg: deg$1,
    Del: Del,
    Delta: Delta,
    delta: delta,
    demptyv: demptyv,
    dfisht: dfisht,
    Dfr: Dfr,
    dfr: dfr,
    dHar: dHar,
    dharl: dharl,
    dharr: dharr,
    DiacriticalAcute: DiacriticalAcute,
    DiacriticalDot: DiacriticalDot,
    DiacriticalDoubleAcute: DiacriticalDoubleAcute,
    DiacriticalGrave: DiacriticalGrave,
    DiacriticalTilde: DiacriticalTilde,
    diam: diam,
    diamond: diamond,
    Diamond: Diamond,
    diamondsuit: diamondsuit,
    diams: diams,
    die: die,
    DifferentialD: DifferentialD,
    digamma: digamma,
    disin: disin,
    div: div,
    divide: divide$1,
    divideontimes: divideontimes,
    divonx: divonx,
    DJcy: DJcy,
    djcy: djcy,
    dlcorn: dlcorn,
    dlcrop: dlcrop,
    dollar: dollar,
    Dopf: Dopf,
    dopf: dopf,
    Dot: Dot,
    dot: dot,
    DotDot: DotDot,
    doteq: doteq,
    doteqdot: doteqdot,
    DotEqual: DotEqual,
    dotminus: dotminus,
    dotplus: dotplus,
    dotsquare: dotsquare,
    doublebarwedge: doublebarwedge,
    DoubleContourIntegral: DoubleContourIntegral,
    DoubleDot: DoubleDot,
    DoubleDownArrow: DoubleDownArrow,
    DoubleLeftArrow: DoubleLeftArrow,
    DoubleLeftRightArrow: DoubleLeftRightArrow,
    DoubleLeftTee: DoubleLeftTee,
    DoubleLongLeftArrow: DoubleLongLeftArrow,
    DoubleLongLeftRightArrow: DoubleLongLeftRightArrow,
    DoubleLongRightArrow: DoubleLongRightArrow,
    DoubleRightArrow: DoubleRightArrow,
    DoubleRightTee: DoubleRightTee,
    DoubleUpArrow: DoubleUpArrow,
    DoubleUpDownArrow: DoubleUpDownArrow,
    DoubleVerticalBar: DoubleVerticalBar,
    DownArrowBar: DownArrowBar,
    downarrow: downarrow,
    DownArrow: DownArrow,
    Downarrow: Downarrow,
    DownArrowUpArrow: DownArrowUpArrow,
    DownBreve: DownBreve,
    downdownarrows: downdownarrows,
    downharpoonleft: downharpoonleft,
    downharpoonright: downharpoonright,
    DownLeftRightVector: DownLeftRightVector,
    DownLeftTeeVector: DownLeftTeeVector,
    DownLeftVectorBar: DownLeftVectorBar,
    DownLeftVector: DownLeftVector,
    DownRightTeeVector: DownRightTeeVector,
    DownRightVectorBar: DownRightVectorBar,
    DownRightVector: DownRightVector,
    DownTeeArrow: DownTeeArrow,
    DownTee: DownTee,
    drbkarow: drbkarow,
    drcorn: drcorn,
    drcrop: drcrop,
    Dscr: Dscr,
    dscr: dscr,
    DScy: DScy,
    dscy: dscy,
    dsol: dsol,
    Dstrok: Dstrok,
    dstrok: dstrok,
    dtdot: dtdot,
    dtri: dtri,
    dtrif: dtrif,
    duarr: duarr,
    duhar: duhar,
    dwangle: dwangle,
    DZcy: DZcy,
    dzcy: dzcy,
    dzigrarr: dzigrarr,
    Eacute: Eacute$1,
    eacute: eacute$1,
    easter: easter,
    Ecaron: Ecaron,
    ecaron: ecaron,
    Ecirc: Ecirc$1,
    ecirc: ecirc$1,
    ecir: ecir,
    ecolon: ecolon,
    Ecy: Ecy,
    ecy: ecy,
    eDDot: eDDot,
    Edot: Edot,
    edot: edot,
    eDot: eDot,
    ee: ee,
    efDot: efDot,
    Efr: Efr,
    efr: efr,
    eg: eg,
    Egrave: Egrave$1,
    egrave: egrave$1,
    egs: egs,
    egsdot: egsdot,
    el: el,
    Element: Element,
    elinters: elinters,
    ell: ell,
    els: els,
    elsdot: elsdot,
    Emacr: Emacr,
    emacr: emacr,
    empty: empty,
    emptyset: emptyset,
    EmptySmallSquare: EmptySmallSquare,
    emptyv: emptyv,
    EmptyVerySmallSquare: EmptyVerySmallSquare,
    emsp13: emsp13,
    emsp14: emsp14,
    emsp: emsp,
    ENG: ENG,
    eng: eng,
    ensp: ensp,
    Eogon: Eogon,
    eogon: eogon,
    Eopf: Eopf,
    eopf: eopf,
    epar: epar,
    eparsl: eparsl,
    eplus: eplus,
    epsi: epsi,
    Epsilon: Epsilon,
    epsilon: epsilon,
    epsiv: epsiv,
    eqcirc: eqcirc,
    eqcolon: eqcolon,
    eqsim: eqsim,
    eqslantgtr: eqslantgtr,
    eqslantless: eqslantless,
    Equal: Equal,
    equals: equals,
    EqualTilde: EqualTilde,
    equest: equest,
    Equilibrium: Equilibrium,
    equiv: equiv,
    equivDD: equivDD,
    eqvparsl: eqvparsl,
    erarr: erarr,
    erDot: erDot,
    escr: escr,
    Escr: Escr,
    esdot: esdot,
    Esim: Esim,
    esim: esim,
    Eta: Eta,
    eta: eta,
    ETH: ETH$1,
    eth: eth$1,
    Euml: Euml$1,
    euml: euml$1,
    euro: euro,
    excl: excl,
    exist: exist,
    Exists: Exists,
    expectation: expectation,
    exponentiale: exponentiale,
    ExponentialE: ExponentialE,
    fallingdotseq: fallingdotseq,
    Fcy: Fcy,
    fcy: fcy,
    female: female,
    ffilig: ffilig,
    fflig: fflig,
    ffllig: ffllig,
    Ffr: Ffr,
    ffr: ffr,
    filig: filig,
    FilledSmallSquare: FilledSmallSquare,
    FilledVerySmallSquare: FilledVerySmallSquare,
    fjlig: fjlig,
    flat: flat,
    fllig: fllig,
    fltns: fltns,
    fnof: fnof,
    Fopf: Fopf,
    fopf: fopf,
    forall: forall,
    ForAll: ForAll,
    fork: fork,
    forkv: forkv,
    Fouriertrf: Fouriertrf,
    fpartint: fpartint,
    frac12: frac12$1,
    frac13: frac13,
    frac14: frac14$1,
    frac15: frac15,
    frac16: frac16,
    frac18: frac18,
    frac23: frac23,
    frac25: frac25,
    frac34: frac34$1,
    frac35: frac35,
    frac38: frac38,
    frac45: frac45,
    frac56: frac56,
    frac58: frac58,
    frac78: frac78,
    frasl: frasl,
    frown: frown,
    fscr: fscr,
    Fscr: Fscr,
    gacute: gacute,
    Gamma: Gamma,
    gamma: gamma,
    Gammad: Gammad,
    gammad: gammad,
    gap: gap,
    Gbreve: Gbreve,
    gbreve: gbreve,
    Gcedil: Gcedil,
    Gcirc: Gcirc,
    gcirc: gcirc,
    Gcy: Gcy,
    gcy: gcy,
    Gdot: Gdot,
    gdot: gdot,
    ge: ge,
    gE: gE,
    gEl: gEl,
    gel: gel,
    geq: geq,
    geqq: geqq,
    geqslant: geqslant,
    gescc: gescc,
    ges: ges,
    gesdot: gesdot,
    gesdoto: gesdoto,
    gesdotol: gesdotol,
    gesl: gesl,
    gesles: gesles,
    Gfr: Gfr,
    gfr: gfr,
    gg: gg,
    Gg: Gg,
    ggg: ggg,
    gimel: gimel,
    GJcy: GJcy,
    gjcy: gjcy,
    gla: gla,
    gl: gl,
    glE: glE,
    glj: glj,
    gnap: gnap,
    gnapprox: gnapprox,
    gne: gne,
    gnE: gnE,
    gneq: gneq,
    gneqq: gneqq,
    gnsim: gnsim,
    Gopf: Gopf,
    gopf: gopf,
    grave: grave,
    GreaterEqual: GreaterEqual,
    GreaterEqualLess: GreaterEqualLess,
    GreaterFullEqual: GreaterFullEqual,
    GreaterGreater: GreaterGreater,
    GreaterLess: GreaterLess,
    GreaterSlantEqual: GreaterSlantEqual,
    GreaterTilde: GreaterTilde,
    Gscr: Gscr,
    gscr: gscr,
    gsim: gsim,
    gsime: gsime,
    gsiml: gsiml,
    gtcc: gtcc,
    gtcir: gtcir,
    gt: gt$2,
    GT: GT$1,
    Gt: Gt,
    gtdot: gtdot,
    gtlPar: gtlPar,
    gtquest: gtquest,
    gtrapprox: gtrapprox,
    gtrarr: gtrarr,
    gtrdot: gtrdot,
    gtreqless: gtreqless,
    gtreqqless: gtreqqless,
    gtrless: gtrless,
    gtrsim: gtrsim,
    gvertneqq: gvertneqq,
    gvnE: gvnE,
    Hacek: Hacek,
    hairsp: hairsp,
    half: half,
    hamilt: hamilt,
    HARDcy: HARDcy,
    hardcy: hardcy,
    harrcir: harrcir,
    harr: harr,
    hArr: hArr,
    harrw: harrw,
    Hat: Hat,
    hbar: hbar,
    Hcirc: Hcirc,
    hcirc: hcirc,
    hearts: hearts,
    heartsuit: heartsuit,
    hellip: hellip,
    hercon: hercon,
    hfr: hfr,
    Hfr: Hfr,
    HilbertSpace: HilbertSpace,
    hksearow: hksearow,
    hkswarow: hkswarow,
    hoarr: hoarr,
    homtht: homtht,
    hookleftarrow: hookleftarrow,
    hookrightarrow: hookrightarrow,
    hopf: hopf,
    Hopf: Hopf,
    horbar: horbar,
    HorizontalLine: HorizontalLine,
    hscr: hscr,
    Hscr: Hscr,
    hslash: hslash,
    Hstrok: Hstrok,
    hstrok: hstrok,
    HumpDownHump: HumpDownHump,
    HumpEqual: HumpEqual,
    hybull: hybull,
    hyphen: hyphen,
    Iacute: Iacute$1,
    iacute: iacute$1,
    ic: ic,
    Icirc: Icirc$1,
    icirc: icirc$1,
    Icy: Icy,
    icy: icy,
    Idot: Idot,
    IEcy: IEcy,
    iecy: iecy,
    iexcl: iexcl$1,
    iff: iff,
    ifr: ifr,
    Ifr: Ifr,
    Igrave: Igrave$1,
    igrave: igrave$1,
    ii: ii,
    iiiint: iiiint,
    iiint: iiint,
    iinfin: iinfin,
    iiota: iiota,
    IJlig: IJlig,
    ijlig: ijlig,
    Imacr: Imacr,
    imacr: imacr,
    image: esm_image,
    ImaginaryI: ImaginaryI,
    imagline: imagline,
    imagpart: imagpart,
    imath: imath,
    Im: Im,
    imof: imof,
    imped: imped,
    Implies: Implies,
    incare: incare,
    "in": "∈",
    infin: infin,
    infintie: infintie,
    inodot: inodot,
    intcal: intcal,
    int: esm_int,
    Int: Int,
    integers: integers,
    Integral: Integral,
    intercal: intercal,
    Intersection: Intersection,
    intlarhk: intlarhk,
    intprod: intprod,
    InvisibleComma: InvisibleComma,
    InvisibleTimes: InvisibleTimes,
    IOcy: IOcy,
    iocy: iocy,
    Iogon: Iogon,
    iogon: iogon,
    Iopf: Iopf,
    iopf: iopf,
    Iota: Iota,
    iota: iota,
    iprod: iprod,
    iquest: iquest$1,
    iscr: iscr,
    Iscr: Iscr,
    isin: isin,
    isindot: isindot,
    isinE: isinE,
    isins: isins,
    isinsv: isinsv,
    isinv: isinv,
    it: it,
    Itilde: Itilde,
    itilde: itilde,
    Iukcy: Iukcy,
    iukcy: iukcy,
    Iuml: Iuml$1,
    iuml: iuml$1,
    Jcirc: Jcirc,
    jcirc: jcirc,
    Jcy: Jcy,
    jcy: jcy,
    Jfr: Jfr,
    jfr: jfr,
    jmath: jmath,
    Jopf: Jopf,
    jopf: jopf,
    Jscr: Jscr,
    jscr: jscr,
    Jsercy: Jsercy,
    jsercy: jsercy,
    Jukcy: Jukcy,
    jukcy: jukcy,
    Kappa: Kappa,
    kappa: kappa,
    kappav: kappav,
    Kcedil: Kcedil,
    kcedil: kcedil,
    Kcy: Kcy,
    kcy: kcy,
    Kfr: Kfr,
    kfr: kfr,
    kgreen: kgreen,
    KHcy: KHcy,
    khcy: khcy,
    KJcy: KJcy,
    kjcy: kjcy,
    Kopf: Kopf,
    kopf: kopf,
    Kscr: Kscr,
    kscr: kscr,
    lAarr: lAarr,
    Lacute: Lacute,
    lacute: lacute,
    laemptyv: laemptyv,
    lagran: lagran,
    Lambda: Lambda,
    lambda: lambda,
    lang: lang,
    Lang: Lang,
    langd: langd,
    langle: langle,
    lap: lap,
    Laplacetrf: Laplacetrf,
    laquo: laquo$1,
    larrb: larrb,
    larrbfs: larrbfs,
    larr: larr,
    Larr: Larr,
    lArr: lArr,
    larrfs: larrfs,
    larrhk: larrhk,
    larrlp: larrlp,
    larrpl: larrpl,
    larrsim: larrsim,
    larrtl: larrtl,
    latail: latail,
    lAtail: lAtail,
    lat: lat,
    late: late,
    lates: lates,
    lbarr: lbarr,
    lBarr: lBarr,
    lbbrk: lbbrk,
    lbrace: lbrace,
    lbrack: lbrack,
    lbrke: lbrke,
    lbrksld: lbrksld,
    lbrkslu: lbrkslu,
    Lcaron: Lcaron,
    lcaron: lcaron,
    Lcedil: Lcedil,
    lcedil: lcedil,
    lceil: lceil,
    lcub: lcub,
    Lcy: Lcy,
    lcy: lcy,
    ldca: ldca,
    ldquo: ldquo,
    ldquor: ldquor,
    ldrdhar: ldrdhar,
    ldrushar: ldrushar,
    ldsh: ldsh,
    le: le,
    lE: lE,
    LeftAngleBracket: LeftAngleBracket,
    LeftArrowBar: LeftArrowBar,
    leftarrow: leftarrow,
    LeftArrow: LeftArrow,
    Leftarrow: Leftarrow,
    LeftArrowRightArrow: LeftArrowRightArrow,
    leftarrowtail: leftarrowtail,
    LeftCeiling: LeftCeiling,
    LeftDoubleBracket: LeftDoubleBracket,
    LeftDownTeeVector: LeftDownTeeVector,
    LeftDownVectorBar: LeftDownVectorBar,
    LeftDownVector: LeftDownVector,
    LeftFloor: LeftFloor,
    leftharpoondown: leftharpoondown,
    leftharpoonup: leftharpoonup,
    leftleftarrows: leftleftarrows,
    leftrightarrow: leftrightarrow,
    LeftRightArrow: LeftRightArrow,
    Leftrightarrow: Leftrightarrow,
    leftrightarrows: leftrightarrows,
    leftrightharpoons: leftrightharpoons,
    leftrightsquigarrow: leftrightsquigarrow,
    LeftRightVector: LeftRightVector,
    LeftTeeArrow: LeftTeeArrow,
    LeftTee: LeftTee,
    LeftTeeVector: LeftTeeVector,
    leftthreetimes: leftthreetimes,
    LeftTriangleBar: LeftTriangleBar,
    LeftTriangle: LeftTriangle,
    LeftTriangleEqual: LeftTriangleEqual,
    LeftUpDownVector: LeftUpDownVector,
    LeftUpTeeVector: LeftUpTeeVector,
    LeftUpVectorBar: LeftUpVectorBar,
    LeftUpVector: LeftUpVector,
    LeftVectorBar: LeftVectorBar,
    LeftVector: LeftVector,
    lEg: lEg,
    leg: leg,
    leq: leq,
    leqq: leqq,
    leqslant: leqslant,
    lescc: lescc,
    les: les,
    lesdot: lesdot,
    lesdoto: lesdoto,
    lesdotor: lesdotor,
    lesg: lesg,
    lesges: lesges,
    lessapprox: lessapprox,
    lessdot: lessdot,
    lesseqgtr: lesseqgtr,
    lesseqqgtr: lesseqqgtr,
    LessEqualGreater: LessEqualGreater,
    LessFullEqual: LessFullEqual,
    LessGreater: LessGreater,
    lessgtr: lessgtr,
    LessLess: LessLess,
    lesssim: lesssim,
    LessSlantEqual: LessSlantEqual,
    LessTilde: LessTilde,
    lfisht: lfisht,
    lfloor: lfloor,
    Lfr: Lfr,
    lfr: lfr,
    lg: lg,
    lgE: lgE,
    lHar: lHar,
    lhard: lhard,
    lharu: lharu,
    lharul: lharul,
    lhblk: lhblk,
    LJcy: LJcy,
    ljcy: ljcy,
    llarr: llarr,
    ll: ll,
    Ll: Ll,
    llcorner: llcorner,
    Lleftarrow: Lleftarrow,
    llhard: llhard,
    lltri: lltri,
    Lmidot: Lmidot,
    lmidot: lmidot,
    lmoustache: lmoustache,
    lmoust: lmoust,
    lnap: lnap,
    lnapprox: lnapprox,
    lne: lne,
    lnE: lnE,
    lneq: lneq,
    lneqq: lneqq,
    lnsim: lnsim,
    loang: loang,
    loarr: loarr,
    lobrk: lobrk,
    longleftarrow: longleftarrow,
    LongLeftArrow: LongLeftArrow,
    Longleftarrow: Longleftarrow,
    longleftrightarrow: longleftrightarrow,
    LongLeftRightArrow: LongLeftRightArrow,
    Longleftrightarrow: Longleftrightarrow,
    longmapsto: longmapsto,
    longrightarrow: longrightarrow,
    LongRightArrow: LongRightArrow,
    Longrightarrow: Longrightarrow,
    looparrowleft: looparrowleft,
    looparrowright: looparrowright,
    lopar: lopar,
    Lopf: Lopf,
    lopf: lopf,
    loplus: loplus,
    lotimes: lotimes,
    lowast: lowast,
    lowbar: lowbar,
    LowerLeftArrow: LowerLeftArrow,
    LowerRightArrow: LowerRightArrow,
    loz: loz,
    lozenge: lozenge,
    lozf: lozf,
    lpar: lpar,
    lparlt: lparlt,
    lrarr: lrarr,
    lrcorner: lrcorner,
    lrhar: lrhar,
    lrhard: lrhard,
    lrm: lrm,
    lrtri: lrtri,
    lsaquo: lsaquo,
    lscr: lscr,
    Lscr: Lscr,
    lsh: lsh,
    Lsh: Lsh,
    lsim: lsim,
    lsime: lsime,
    lsimg: lsimg,
    lsqb: lsqb,
    lsquo: lsquo,
    lsquor: lsquor,
    Lstrok: Lstrok,
    lstrok: lstrok,
    ltcc: ltcc,
    ltcir: ltcir,
    lt: lt$2,
    LT: LT$1,
    Lt: Lt,
    ltdot: ltdot,
    lthree: lthree,
    ltimes: ltimes,
    ltlarr: ltlarr,
    ltquest: ltquest,
    ltri: ltri,
    ltrie: ltrie,
    ltrif: ltrif,
    ltrPar: ltrPar,
    lurdshar: lurdshar,
    luruhar: luruhar,
    lvertneqq: lvertneqq,
    lvnE: lvnE,
    macr: macr$1,
    male: male,
    malt: malt,
    maltese: maltese,
    "Map": "⤅",
    map: map,
    mapsto: mapsto,
    mapstodown: mapstodown,
    mapstoleft: mapstoleft,
    mapstoup: mapstoup,
    marker: marker,
    mcomma: mcomma,
    Mcy: Mcy,
    mcy: mcy,
    mdash: mdash,
    mDDot: mDDot,
    measuredangle: measuredangle,
    MediumSpace: MediumSpace,
    Mellintrf: Mellintrf,
    Mfr: Mfr,
    mfr: mfr,
    mho: mho,
    micro: micro$1,
    midast: midast,
    midcir: midcir,
    mid: mid,
    middot: middot$1,
    minusb: minusb,
    minus: minus,
    minusd: minusd,
    minusdu: minusdu,
    MinusPlus: MinusPlus,
    mlcp: mlcp,
    mldr: mldr,
    mnplus: mnplus,
    models: models,
    Mopf: Mopf,
    mopf: mopf,
    mp: mp,
    mscr: mscr,
    Mscr: Mscr,
    mstpos: mstpos,
    Mu: Mu,
    mu: mu,
    multimap: multimap,
    mumap: mumap,
    nabla: nabla,
    Nacute: Nacute,
    nacute: nacute,
    nang: nang,
    nap: nap,
    napE: napE,
    napid: napid,
    napos: napos,
    napprox: napprox,
    natural: natural,
    naturals: naturals,
    natur: natur,
    nbsp: nbsp$1,
    nbump: nbump,
    nbumpe: nbumpe,
    ncap: ncap,
    Ncaron: Ncaron,
    ncaron: ncaron,
    Ncedil: Ncedil,
    ncedil: ncedil,
    ncong: ncong,
    ncongdot: ncongdot,
    ncup: ncup,
    Ncy: Ncy,
    ncy: ncy,
    ndash: ndash,
    nearhk: nearhk,
    nearr: nearr,
    neArr: neArr,
    nearrow: nearrow,
    ne: ne,
    nedot: nedot,
    NegativeMediumSpace: NegativeMediumSpace,
    NegativeThickSpace: NegativeThickSpace,
    NegativeThinSpace: NegativeThinSpace,
    NegativeVeryThinSpace: NegativeVeryThinSpace,
    nequiv: nequiv,
    nesear: nesear,
    nesim: nesim,
    NestedGreaterGreater: NestedGreaterGreater,
    NestedLessLess: NestedLessLess,
    NewLine: NewLine,
    nexist: nexist,
    nexists: nexists,
    Nfr: Nfr,
    nfr: nfr,
    ngE: ngE,
    nge: nge,
    ngeq: ngeq,
    ngeqq: ngeqq,
    ngeqslant: ngeqslant,
    nges: nges,
    nGg: nGg,
    ngsim: ngsim,
    nGt: nGt,
    ngt: ngt,
    ngtr: ngtr,
    nGtv: nGtv,
    nharr: nharr,
    nhArr: nhArr,
    nhpar: nhpar,
    ni: ni,
    nis: nis,
    nisd: nisd,
    niv: niv,
    NJcy: NJcy,
    njcy: njcy,
    nlarr: nlarr,
    nlArr: nlArr,
    nldr: nldr,
    nlE: nlE,
    nle: nle,
    nleftarrow: nleftarrow,
    nLeftarrow: nLeftarrow,
    nleftrightarrow: nleftrightarrow,
    nLeftrightarrow: nLeftrightarrow,
    nleq: nleq,
    nleqq: nleqq,
    nleqslant: nleqslant,
    nles: nles,
    nless: nless,
    nLl: nLl,
    nlsim: nlsim,
    nLt: nLt,
    nlt: nlt,
    nltri: nltri,
    nltrie: nltrie,
    nLtv: nLtv,
    nmid: nmid,
    NoBreak: NoBreak,
    NonBreakingSpace: NonBreakingSpace,
    nopf: nopf,
    Nopf: Nopf,
    Not: Not,
    not: not$1,
    NotCongruent: NotCongruent,
    NotCupCap: NotCupCap,
    NotDoubleVerticalBar: NotDoubleVerticalBar,
    NotElement: NotElement,
    NotEqual: NotEqual,
    NotEqualTilde: NotEqualTilde,
    NotExists: NotExists,
    NotGreater: NotGreater,
    NotGreaterEqual: NotGreaterEqual,
    NotGreaterFullEqual: NotGreaterFullEqual,
    NotGreaterGreater: NotGreaterGreater,
    NotGreaterLess: NotGreaterLess,
    NotGreaterSlantEqual: NotGreaterSlantEqual,
    NotGreaterTilde: NotGreaterTilde,
    NotHumpDownHump: NotHumpDownHump,
    NotHumpEqual: NotHumpEqual,
    notin: notin,
    notindot: notindot,
    notinE: notinE,
    notinva: notinva,
    notinvb: notinvb,
    notinvc: notinvc,
    NotLeftTriangleBar: NotLeftTriangleBar,
    NotLeftTriangle: NotLeftTriangle,
    NotLeftTriangleEqual: NotLeftTriangleEqual,
    NotLess: NotLess,
    NotLessEqual: NotLessEqual,
    NotLessGreater: NotLessGreater,
    NotLessLess: NotLessLess,
    NotLessSlantEqual: NotLessSlantEqual,
    NotLessTilde: NotLessTilde,
    NotNestedGreaterGreater: NotNestedGreaterGreater,
    NotNestedLessLess: NotNestedLessLess,
    notni: notni,
    notniva: notniva,
    notnivb: notnivb,
    notnivc: notnivc,
    NotPrecedes: NotPrecedes,
    NotPrecedesEqual: NotPrecedesEqual,
    NotPrecedesSlantEqual: NotPrecedesSlantEqual,
    NotReverseElement: NotReverseElement,
    NotRightTriangleBar: NotRightTriangleBar,
    NotRightTriangle: NotRightTriangle,
    NotRightTriangleEqual: NotRightTriangleEqual,
    NotSquareSubset: NotSquareSubset,
    NotSquareSubsetEqual: NotSquareSubsetEqual,
    NotSquareSuperset: NotSquareSuperset,
    NotSquareSupersetEqual: NotSquareSupersetEqual,
    NotSubset: NotSubset,
    NotSubsetEqual: NotSubsetEqual,
    NotSucceeds: NotSucceeds,
    NotSucceedsEqual: NotSucceedsEqual,
    NotSucceedsSlantEqual: NotSucceedsSlantEqual,
    NotSucceedsTilde: NotSucceedsTilde,
    NotSuperset: NotSuperset,
    NotSupersetEqual: NotSupersetEqual,
    NotTilde: NotTilde,
    NotTildeEqual: NotTildeEqual,
    NotTildeFullEqual: NotTildeFullEqual,
    NotTildeTilde: NotTildeTilde,
    NotVerticalBar: NotVerticalBar,
    nparallel: nparallel,
    npar: npar,
    nparsl: nparsl,
    npart: npart,
    npolint: npolint,
    npr: npr,
    nprcue: nprcue,
    nprec: nprec,
    npreceq: npreceq,
    npre: npre,
    nrarrc: nrarrc,
    nrarr: nrarr,
    nrArr: nrArr,
    nrarrw: nrarrw,
    nrightarrow: nrightarrow,
    nRightarrow: nRightarrow,
    nrtri: nrtri,
    nrtrie: nrtrie,
    nsc: nsc,
    nsccue: nsccue,
    nsce: nsce,
    Nscr: Nscr,
    nscr: nscr,
    nshortmid: nshortmid,
    nshortparallel: nshortparallel,
    nsim: nsim,
    nsime: nsime,
    nsimeq: nsimeq,
    nsmid: nsmid,
    nspar: nspar,
    nsqsube: nsqsube,
    nsqsupe: nsqsupe,
    nsub: nsub,
    nsubE: nsubE,
    nsube: nsube,
    nsubset: nsubset,
    nsubseteq: nsubseteq,
    nsubseteqq: nsubseteqq,
    nsucc: nsucc,
    nsucceq: nsucceq,
    nsup: nsup,
    nsupE: nsupE,
    nsupe: nsupe,
    nsupset: nsupset,
    nsupseteq: nsupseteq,
    nsupseteqq: nsupseteqq,
    ntgl: ntgl,
    Ntilde: Ntilde$1,
    ntilde: ntilde$1,
    ntlg: ntlg,
    ntriangleleft: ntriangleleft,
    ntrianglelefteq: ntrianglelefteq,
    ntriangleright: ntriangleright,
    ntrianglerighteq: ntrianglerighteq,
    Nu: Nu,
    nu: nu,
    num: num,
    numero: numero,
    numsp: numsp,
    nvap: nvap,
    nvdash: nvdash,
    nvDash: nvDash,
    nVdash: nVdash,
    nVDash: nVDash,
    nvge: nvge,
    nvgt: nvgt,
    nvHarr: nvHarr,
    nvinfin: nvinfin,
    nvlArr: nvlArr,
    nvle: nvle,
    nvlt: nvlt,
    nvltrie: nvltrie,
    nvrArr: nvrArr,
    nvrtrie: nvrtrie,
    nvsim: nvsim,
    nwarhk: nwarhk,
    nwarr: nwarr,
    nwArr: nwArr,
    nwarrow: nwarrow,
    nwnear: nwnear,
    Oacute: Oacute$1,
    oacute: oacute$1,
    oast: oast,
    Ocirc: Ocirc$1,
    ocirc: ocirc$1,
    ocir: ocir,
    Ocy: Ocy,
    ocy: ocy,
    odash: odash,
    Odblac: Odblac,
    odblac: odblac,
    odiv: odiv,
    odot: odot,
    odsold: odsold,
    OElig: OElig,
    oelig: oelig,
    ofcir: ofcir,
    Ofr: Ofr,
    ofr: ofr,
    ogon: ogon,
    Ograve: Ograve$1,
    ograve: ograve$1,
    ogt: ogt,
    ohbar: ohbar,
    ohm: ohm,
    oint: oint,
    olarr: olarr,
    olcir: olcir,
    olcross: olcross,
    oline: oline,
    olt: olt,
    Omacr: Omacr,
    omacr: omacr,
    Omega: Omega,
    omega: omega,
    Omicron: Omicron,
    omicron: omicron,
    omid: omid,
    ominus: ominus,
    Oopf: Oopf,
    oopf: oopf,
    opar: opar,
    OpenCurlyDoubleQuote: OpenCurlyDoubleQuote,
    OpenCurlyQuote: OpenCurlyQuote,
    operp: operp,
    oplus: oplus,
    orarr: orarr,
    Or: Or,
    or: or,
    ord: ord,
    order: order,
    orderof: orderof,
    ordf: ordf$1,
    ordm: ordm$1,
    origof: origof,
    oror: oror,
    orslope: orslope,
    orv: orv,
    oS: oS,
    Oscr: Oscr,
    oscr: oscr,
    Oslash: Oslash$1,
    oslash: oslash$1,
    osol: osol,
    Otilde: Otilde$1,
    otilde: otilde$1,
    otimesas: otimesas,
    Otimes: Otimes,
    otimes: otimes,
    Ouml: Ouml$1,
    ouml: ouml$1,
    ovbar: ovbar,
    OverBar: OverBar,
    OverBrace: OverBrace,
    OverBracket: OverBracket,
    OverParenthesis: OverParenthesis,
    para: para$1,
    parallel: parallel,
    par: par,
    parsim: parsim,
    parsl: parsl,
    part: part,
    PartialD: PartialD,
    Pcy: Pcy,
    pcy: pcy,
    percnt: percnt,
    period: period,
    permil: permil,
    perp: perp,
    pertenk: pertenk,
    Pfr: Pfr,
    pfr: pfr,
    Phi: Phi,
    phi: phi,
    phiv: phiv,
    phmmat: phmmat,
    phone: phone,
    Pi: Pi,
    pi: pi,
    pitchfork: pitchfork,
    piv: piv,
    planck: planck,
    planckh: planckh,
    plankv: plankv,
    plusacir: plusacir,
    plusb: plusb,
    pluscir: pluscir,
    plus: plus,
    plusdo: plusdo,
    plusdu: plusdu,
    pluse: pluse,
    PlusMinus: PlusMinus,
    plusmn: plusmn$1,
    plussim: plussim,
    plustwo: plustwo,
    pm: pm,
    Poincareplane: Poincareplane,
    pointint: pointint,
    popf: popf,
    Popf: Popf,
    pound: pound$1,
    prap: prap,
    Pr: Pr,
    pr: pr,
    prcue: prcue,
    precapprox: precapprox,
    prec: prec,
    preccurlyeq: preccurlyeq,
    Precedes: Precedes,
    PrecedesEqual: PrecedesEqual,
    PrecedesSlantEqual: PrecedesSlantEqual,
    PrecedesTilde: PrecedesTilde,
    preceq: preceq,
    precnapprox: precnapprox,
    precneqq: precneqq,
    precnsim: precnsim,
    pre: pre,
    prE: prE,
    precsim: precsim,
    prime: prime,
    Prime: Prime,
    primes: primes,
    prnap: prnap,
    prnE: prnE,
    prnsim: prnsim,
    prod: prod,
    Product: Product,
    profalar: profalar,
    profline: profline,
    profsurf: profsurf,
    prop: prop,
    Proportional: Proportional,
    Proportion: Proportion,
    propto: propto,
    prsim: prsim,
    prurel: prurel,
    Pscr: Pscr,
    pscr: pscr,
    Psi: Psi,
    psi: psi,
    puncsp: puncsp,
    Qfr: Qfr,
    qfr: qfr,
    qint: qint,
    qopf: qopf,
    Qopf: Qopf,
    qprime: qprime,
    Qscr: Qscr,
    qscr: qscr,
    quaternions: quaternions,
    quatint: quatint,
    quest: quest,
    questeq: questeq,
    quot: quot$2,
    QUOT: QUOT$1,
    rAarr: rAarr,
    race: race,
    Racute: Racute,
    racute: racute,
    radic: radic,
    raemptyv: raemptyv,
    rang: rang,
    Rang: Rang,
    rangd: rangd,
    range: range,
    rangle: rangle,
    raquo: raquo$1,
    rarrap: rarrap,
    rarrb: rarrb,
    rarrbfs: rarrbfs,
    rarrc: rarrc,
    rarr: rarr,
    Rarr: Rarr,
    rArr: rArr,
    rarrfs: rarrfs,
    rarrhk: rarrhk,
    rarrlp: rarrlp,
    rarrpl: rarrpl,
    rarrsim: rarrsim,
    Rarrtl: Rarrtl,
    rarrtl: rarrtl,
    rarrw: rarrw,
    ratail: ratail,
    rAtail: rAtail,
    ratio: ratio,
    rationals: rationals,
    rbarr: rbarr,
    rBarr: rBarr,
    RBarr: RBarr,
    rbbrk: rbbrk,
    rbrace: rbrace,
    rbrack: rbrack,
    rbrke: rbrke,
    rbrksld: rbrksld,
    rbrkslu: rbrkslu,
    Rcaron: Rcaron,
    rcaron: rcaron,
    Rcedil: Rcedil,
    rcedil: rcedil,
    rceil: rceil,
    rcub: rcub,
    Rcy: Rcy,
    rcy: rcy,
    rdca: rdca,
    rdldhar: rdldhar,
    rdquo: rdquo,
    rdquor: rdquor,
    rdsh: rdsh,
    real: real,
    realine: realine,
    realpart: realpart,
    reals: reals,
    Re: Re,
    rect: rect,
    reg: reg$1,
    REG: REG$1,
    ReverseElement: ReverseElement,
    ReverseEquilibrium: ReverseEquilibrium,
    ReverseUpEquilibrium: ReverseUpEquilibrium,
    rfisht: rfisht,
    rfloor: rfloor,
    rfr: rfr,
    Rfr: Rfr,
    rHar: rHar,
    rhard: rhard,
    rharu: rharu,
    rharul: rharul,
    Rho: Rho,
    rho: rho,
    rhov: rhov,
    RightAngleBracket: RightAngleBracket,
    RightArrowBar: RightArrowBar,
    rightarrow: rightarrow,
    RightArrow: RightArrow,
    Rightarrow: Rightarrow,
    RightArrowLeftArrow: RightArrowLeftArrow,
    rightarrowtail: rightarrowtail,
    RightCeiling: RightCeiling,
    RightDoubleBracket: RightDoubleBracket,
    RightDownTeeVector: RightDownTeeVector,
    RightDownVectorBar: RightDownVectorBar,
    RightDownVector: RightDownVector,
    RightFloor: RightFloor,
    rightharpoondown: rightharpoondown,
    rightharpoonup: rightharpoonup,
    rightleftarrows: rightleftarrows,
    rightleftharpoons: rightleftharpoons,
    rightrightarrows: rightrightarrows,
    rightsquigarrow: rightsquigarrow,
    RightTeeArrow: RightTeeArrow,
    RightTee: RightTee,
    RightTeeVector: RightTeeVector,
    rightthreetimes: rightthreetimes,
    RightTriangleBar: RightTriangleBar,
    RightTriangle: RightTriangle,
    RightTriangleEqual: RightTriangleEqual,
    RightUpDownVector: RightUpDownVector,
    RightUpTeeVector: RightUpTeeVector,
    RightUpVectorBar: RightUpVectorBar,
    RightUpVector: RightUpVector,
    RightVectorBar: RightVectorBar,
    RightVector: RightVector,
    ring: ring,
    risingdotseq: risingdotseq,
    rlarr: rlarr,
    rlhar: rlhar,
    rlm: rlm,
    rmoustache: rmoustache,
    rmoust: rmoust,
    rnmid: rnmid,
    roang: roang,
    roarr: roarr,
    robrk: robrk,
    ropar: ropar,
    ropf: ropf,
    Ropf: Ropf,
    roplus: roplus,
    rotimes: rotimes,
    RoundImplies: RoundImplies,
    rpar: rpar,
    rpargt: rpargt,
    rppolint: rppolint,
    rrarr: rrarr,
    Rrightarrow: Rrightarrow,
    rsaquo: rsaquo,
    rscr: rscr,
    Rscr: Rscr,
    rsh: rsh,
    Rsh: Rsh,
    rsqb: rsqb,
    rsquo: rsquo,
    rsquor: rsquor,
    rthree: rthree,
    rtimes: rtimes,
    rtri: rtri,
    rtrie: rtrie,
    rtrif: rtrif,
    rtriltri: rtriltri,
    RuleDelayed: RuleDelayed,
    ruluhar: ruluhar,
    rx: rx,
    Sacute: Sacute,
    sacute: sacute,
    sbquo: sbquo,
    scap: scap,
    Scaron: Scaron,
    scaron: scaron,
    Sc: Sc,
    sc: sc,
    sccue: sccue,
    sce: sce,
    scE: scE,
    Scedil: Scedil,
    scedil: scedil,
    Scirc: Scirc,
    scirc: scirc,
    scnap: scnap,
    scnE: scnE,
    scnsim: scnsim,
    scpolint: scpolint,
    scsim: scsim,
    Scy: Scy,
    scy: scy,
    sdotb: sdotb,
    sdot: sdot,
    sdote: sdote,
    searhk: searhk,
    searr: searr,
    seArr: seArr,
    searrow: searrow,
    sect: sect$1,
    semi: semi,
    seswar: seswar,
    setminus: setminus,
    setmn: setmn,
    sext: sext,
    Sfr: Sfr,
    sfr: sfr,
    sfrown: sfrown,
    sharp: sharp,
    SHCHcy: SHCHcy,
    shchcy: shchcy,
    SHcy: SHcy,
    shcy: shcy,
    ShortDownArrow: ShortDownArrow,
    ShortLeftArrow: ShortLeftArrow,
    shortmid: shortmid,
    shortparallel: shortparallel,
    ShortRightArrow: ShortRightArrow,
    ShortUpArrow: ShortUpArrow,
    shy: shy$1,
    Sigma: Sigma,
    sigma: sigma,
    sigmaf: sigmaf,
    sigmav: sigmav,
    sim: sim,
    simdot: simdot,
    sime: sime,
    simeq: simeq,
    simg: simg,
    simgE: simgE,
    siml: siml,
    simlE: simlE,
    simne: simne,
    simplus: simplus,
    simrarr: simrarr,
    slarr: slarr,
    SmallCircle: SmallCircle,
    smallsetminus: smallsetminus,
    smashp: smashp,
    smeparsl: smeparsl,
    smid: smid,
    smile: smile,
    smt: smt,
    smte: smte,
    smtes: smtes,
    SOFTcy: SOFTcy,
    softcy: softcy,
    solbar: solbar,
    solb: solb,
    sol: sol,
    Sopf: Sopf,
    sopf: sopf,
    spades: spades,
    spadesuit: spadesuit,
    spar: spar,
    sqcap: sqcap,
    sqcaps: sqcaps,
    sqcup: sqcup,
    sqcups: sqcups,
    Sqrt: Sqrt,
    sqsub: sqsub,
    sqsube: sqsube,
    sqsubset: sqsubset,
    sqsubseteq: sqsubseteq,
    sqsup: sqsup,
    sqsupe: sqsupe,
    sqsupset: sqsupset,
    sqsupseteq: sqsupseteq,
    square: square,
    Square: Square,
    SquareIntersection: SquareIntersection,
    SquareSubset: SquareSubset,
    SquareSubsetEqual: SquareSubsetEqual,
    SquareSuperset: SquareSuperset,
    SquareSupersetEqual: SquareSupersetEqual,
    SquareUnion: SquareUnion,
    squarf: squarf,
    squ: squ,
    squf: squf,
    srarr: srarr,
    Sscr: Sscr,
    sscr: sscr,
    ssetmn: ssetmn,
    ssmile: ssmile,
    sstarf: sstarf,
    Star: Star,
    star: star,
    starf: starf,
    straightepsilon: straightepsilon,
    straightphi: straightphi,
    strns: strns,
    sub: sub,
    Sub: Sub,
    subdot: subdot,
    subE: subE,
    sube: sube,
    subedot: subedot,
    submult: submult,
    subnE: subnE,
    subne: subne,
    subplus: subplus,
    subrarr: subrarr,
    subset: subset,
    Subset: Subset,
    subseteq: subseteq,
    subseteqq: subseteqq,
    SubsetEqual: SubsetEqual,
    subsetneq: subsetneq,
    subsetneqq: subsetneqq,
    subsim: subsim,
    subsub: subsub,
    subsup: subsup,
    succapprox: succapprox,
    succ: succ,
    succcurlyeq: succcurlyeq,
    Succeeds: Succeeds,
    SucceedsEqual: SucceedsEqual,
    SucceedsSlantEqual: SucceedsSlantEqual,
    SucceedsTilde: SucceedsTilde,
    succeq: succeq,
    succnapprox: succnapprox,
    succneqq: succneqq,
    succnsim: succnsim,
    succsim: succsim,
    SuchThat: SuchThat,
    sum: sum,
    Sum: Sum,
    sung: sung,
    sup1: sup1$1,
    sup2: sup2$1,
    sup3: sup3$1,
    sup: sup,
    Sup: Sup,
    supdot: supdot,
    supdsub: supdsub,
    supE: supE,
    supe: supe,
    supedot: supedot,
    Superset: Superset,
    SupersetEqual: SupersetEqual,
    suphsol: suphsol,
    suphsub: suphsub,
    suplarr: suplarr,
    supmult: supmult,
    supnE: supnE,
    supne: supne,
    supplus: supplus,
    supset: supset,
    Supset: Supset,
    supseteq: supseteq,
    supseteqq: supseteqq,
    supsetneq: supsetneq,
    supsetneqq: supsetneqq,
    supsim: supsim,
    supsub: supsub,
    supsup: supsup,
    swarhk: swarhk,
    swarr: swarr,
    swArr: swArr,
    swarrow: swarrow,
    swnwar: swnwar,
    szlig: szlig$1,
    Tab: Tab,
    target: target,
    Tau: Tau,
    tau: tau,
    tbrk: tbrk,
    Tcaron: Tcaron,
    tcaron: tcaron,
    Tcedil: Tcedil,
    tcedil: tcedil,
    Tcy: Tcy,
    tcy: tcy,
    tdot: tdot,
    telrec: telrec,
    Tfr: Tfr,
    tfr: tfr,
    there4: there4,
    therefore: therefore,
    Therefore: Therefore,
    Theta: Theta,
    theta: theta,
    thetasym: thetasym,
    thetav: thetav,
    thickapprox: thickapprox,
    thicksim: thicksim,
    ThickSpace: ThickSpace,
    ThinSpace: ThinSpace,
    thinsp: thinsp,
    thkap: thkap,
    thksim: thksim,
    THORN: THORN$1,
    thorn: thorn$1,
    tilde: tilde,
    Tilde: Tilde,
    TildeEqual: TildeEqual,
    TildeFullEqual: TildeFullEqual,
    TildeTilde: TildeTilde,
    timesbar: timesbar,
    timesb: timesb,
    times: times$1,
    timesd: timesd,
    tint: tint,
    toea: toea,
    topbot: topbot,
    topcir: topcir,
    top: esm_top,
    Topf: Topf,
    topf: topf,
    topfork: topfork,
    tosa: tosa,
    tprime: tprime,
    trade: trade,
    TRADE: TRADE,
    triangle: triangle,
    triangledown: triangledown,
    triangleleft: triangleleft,
    trianglelefteq: trianglelefteq,
    triangleq: triangleq,
    triangleright: triangleright,
    trianglerighteq: trianglerighteq,
    tridot: tridot,
    trie: trie,
    triminus: triminus,
    TripleDot: TripleDot,
    triplus: triplus,
    trisb: trisb,
    tritime: tritime,
    trpezium: trpezium,
    Tscr: Tscr,
    tscr: tscr,
    TScy: TScy,
    tscy: tscy,
    TSHcy: TSHcy,
    tshcy: tshcy,
    Tstrok: Tstrok,
    tstrok: tstrok,
    twixt: twixt,
    twoheadleftarrow: twoheadleftarrow,
    twoheadrightarrow: twoheadrightarrow,
    Uacute: Uacute$1,
    uacute: uacute$1,
    uarr: uarr,
    Uarr: Uarr,
    uArr: uArr,
    Uarrocir: Uarrocir,
    Ubrcy: Ubrcy,
    ubrcy: ubrcy,
    Ubreve: Ubreve,
    ubreve: ubreve,
    Ucirc: Ucirc$1,
    ucirc: ucirc$1,
    Ucy: Ucy,
    ucy: ucy,
    udarr: udarr,
    Udblac: Udblac,
    udblac: udblac,
    udhar: udhar,
    ufisht: ufisht,
    Ufr: Ufr,
    ufr: ufr,
    Ugrave: Ugrave$1,
    ugrave: ugrave$1,
    uHar: uHar,
    uharl: uharl,
    uharr: uharr,
    uhblk: uhblk,
    ulcorn: ulcorn,
    ulcorner: ulcorner,
    ulcrop: ulcrop,
    ultri: ultri,
    Umacr: Umacr,
    umacr: umacr,
    uml: uml$1,
    UnderBar: UnderBar,
    UnderBrace: UnderBrace,
    UnderBracket: UnderBracket,
    UnderParenthesis: UnderParenthesis,
    Union: Union,
    UnionPlus: UnionPlus,
    Uogon: Uogon,
    uogon: uogon,
    Uopf: Uopf,
    uopf: uopf,
    UpArrowBar: UpArrowBar,
    uparrow: uparrow,
    UpArrow: UpArrow,
    Uparrow: Uparrow,
    UpArrowDownArrow: UpArrowDownArrow,
    updownarrow: updownarrow,
    UpDownArrow: UpDownArrow,
    Updownarrow: Updownarrow,
    UpEquilibrium: UpEquilibrium,
    upharpoonleft: upharpoonleft,
    upharpoonright: upharpoonright,
    uplus: uplus,
    UpperLeftArrow: UpperLeftArrow,
    UpperRightArrow: UpperRightArrow,
    upsi: upsi,
    Upsi: Upsi,
    upsih: upsih,
    Upsilon: Upsilon,
    upsilon: upsilon,
    UpTeeArrow: UpTeeArrow,
    UpTee: UpTee,
    upuparrows: upuparrows,
    urcorn: urcorn,
    urcorner: urcorner,
    urcrop: urcrop,
    Uring: Uring,
    uring: uring,
    urtri: urtri,
    Uscr: Uscr,
    uscr: uscr,
    utdot: utdot,
    Utilde: Utilde,
    utilde: utilde,
    utri: utri,
    utrif: utrif,
    uuarr: uuarr,
    Uuml: Uuml$1,
    uuml: uuml$1,
    uwangle: uwangle,
    vangrt: vangrt,
    varepsilon: varepsilon,
    varkappa: varkappa,
    varnothing: varnothing,
    varphi: varphi,
    varpi: varpi,
    varpropto: varpropto,
    varr: varr,
    vArr: vArr,
    varrho: varrho,
    varsigma: varsigma,
    varsubsetneq: varsubsetneq,
    varsubsetneqq: varsubsetneqq,
    varsupsetneq: varsupsetneq,
    varsupsetneqq: varsupsetneqq,
    vartheta: vartheta,
    vartriangleleft: vartriangleleft,
    vartriangleright: vartriangleright,
    vBar: vBar,
    Vbar: Vbar,
    vBarv: vBarv,
    Vcy: Vcy,
    vcy: vcy,
    vdash: vdash,
    vDash: vDash,
    Vdash: Vdash,
    VDash: VDash,
    Vdashl: Vdashl,
    veebar: veebar,
    vee: vee,
    Vee: Vee,
    veeeq: veeeq,
    vellip: vellip,
    verbar: verbar,
    Verbar: Verbar,
    vert: vert,
    Vert: Vert,
    VerticalBar: VerticalBar,
    VerticalLine: VerticalLine,
    VerticalSeparator: VerticalSeparator,
    VerticalTilde: VerticalTilde,
    VeryThinSpace: VeryThinSpace,
    Vfr: Vfr,
    vfr: vfr,
    vltri: vltri,
    vnsub: vnsub,
    vnsup: vnsup,
    Vopf: Vopf,
    vopf: vopf,
    vprop: vprop,
    vrtri: vrtri,
    Vscr: Vscr,
    vscr: vscr,
    vsubnE: vsubnE,
    vsubne: vsubne,
    vsupnE: vsupnE,
    vsupne: vsupne,
    Vvdash: Vvdash,
    vzigzag: vzigzag,
    Wcirc: Wcirc,
    wcirc: wcirc,
    wedbar: wedbar,
    wedge: wedge,
    Wedge: Wedge,
    wedgeq: wedgeq,
    weierp: weierp,
    Wfr: Wfr,
    wfr: wfr,
    Wopf: Wopf,
    wopf: wopf,
    wp: wp,
    wr: wr,
    wreath: wreath,
    Wscr: Wscr,
    wscr: wscr,
    xcap: xcap,
    xcirc: xcirc,
    xcup: xcup,
    xdtri: xdtri,
    Xfr: Xfr,
    xfr: xfr,
    xharr: xharr,
    xhArr: xhArr,
    Xi: Xi,
    xi: xi,
    xlarr: xlarr,
    xlArr: xlArr,
    xmap: xmap,
    xnis: xnis,
    xodot: xodot,
    Xopf: Xopf,
    xopf: xopf,
    xoplus: xoplus,
    xotime: xotime,
    xrarr: xrarr,
    xrArr: xrArr,
    Xscr: Xscr,
    xscr: xscr,
    xsqcup: xsqcup,
    xuplus: xuplus,
    xutri: xutri,
    xvee: xvee,
    xwedge: xwedge,
    Yacute: Yacute$1,
    yacute: yacute$1,
    YAcy: YAcy,
    yacy: yacy,
    Ycirc: Ycirc,
    ycirc: ycirc,
    Ycy: Ycy,
    ycy: ycy,
    yen: yen$1,
    Yfr: Yfr,
    yfr: yfr,
    YIcy: YIcy,
    yicy: yicy,
    Yopf: Yopf,
    yopf: yopf,
    Yscr: Yscr,
    yscr: yscr,
    YUcy: YUcy,
    yucy: yucy,
    yuml: yuml$1,
    Yuml: Yuml,
    Zacute: Zacute,
    zacute: zacute,
    Zcaron: Zcaron,
    zcaron: zcaron,
    Zcy: Zcy,
    zcy: zcy,
    Zdot: Zdot,
    zdot: zdot,
    zeetrf: zeetrf,
    ZeroWidthSpace: ZeroWidthSpace,
    Zeta: Zeta,
    zeta: zeta,
    zfr: zfr,
    Zfr: Zfr,
    ZHcy: ZHcy,
    zhcy: zhcy,
    zigrarr: zigrarr,
    zopf: zopf,
    Zopf: Zopf,
    Zscr: Zscr,
    zscr: zscr,
    zwj: zwj,
    zwnj: zwnj
};
var Aacute = "Á";
var aacute = "á";
var Acirc = "Â";
var acirc = "â";
var acute = "´";
var AElig = "Æ";
var aelig = "æ";
var Agrave = "À";
var agrave = "à";
var amp$1 = "&";
var AMP = "&";
var Aring = "Å";
var aring = "å";
var Atilde = "Ã";
var atilde = "ã";
var Auml = "Ä";
var auml = "ä";
var brvbar = "¦";
var Ccedil = "Ç";
var ccedil = "ç";
var cedil = "¸";
var cent = "¢";
var copy = "©";
var COPY = "©";
var curren = "¤";
var deg = "°";
var divide = "÷";
var Eacute = "É";
var eacute = "é";
var Ecirc = "Ê";
var ecirc = "ê";
var Egrave = "È";
var egrave = "è";
var ETH = "Ð";
var eth = "ð";
var Euml = "Ë";
var euml = "ë";
var frac12 = "½";
var frac14 = "¼";
var frac34 = "¾";
var gt$1 = ">";
var GT = ">";
var Iacute = "Í";
var iacute = "í";
var Icirc = "Î";
var icirc = "î";
var iexcl = "¡";
var Igrave = "Ì";
var igrave = "ì";
var iquest = "¿";
var Iuml = "Ï";
var iuml = "ï";
var laquo = "«";
var lt$1 = "<";
var LT = "<";
var macr = "¯";
var micro = "µ";
var middot = "·";
var nbsp = " ";
var not = "¬";
var Ntilde = "Ñ";
var ntilde = "ñ";
var Oacute = "Ó";
var oacute = "ó";
var Ocirc = "Ô";
var ocirc = "ô";
var Ograve = "Ò";
var ograve = "ò";
var ordf = "ª";
var ordm = "º";
var Oslash = "Ø";
var oslash = "ø";
var Otilde = "Õ";
var otilde = "õ";
var Ouml = "Ö";
var ouml = "ö";
var para = "¶";
var plusmn = "±";
var pound = "£";
var quot$1 = "\"";
var QUOT = "\"";
var raquo = "»";
var reg = "®";
var REG = "®";
var sect = "§";
var shy = "­";
var sup1 = "¹";
var sup2 = "²";
var sup3 = "³";
var szlig = "ß";
var THORN = "Þ";
var thorn = "þ";
var times = "×";
var Uacute = "Ú";
var uacute = "ú";
var Ucirc = "Û";
var ucirc = "û";
var Ugrave = "Ù";
var ugrave = "ù";
var uml = "¨";
var Uuml = "Ü";
var uuml = "ü";
var Yacute = "Ý";
var yacute = "ý";
var yen = "¥";
var yuml = "ÿ";
var require$$1 = {
    Aacute: Aacute,
    aacute: aacute,
    Acirc: Acirc,
    acirc: acirc,
    acute: acute,
    AElig: AElig,
    aelig: aelig,
    Agrave: Agrave,
    agrave: agrave,
    amp: amp$1,
    AMP: AMP,
    Aring: Aring,
    aring: aring,
    Atilde: Atilde,
    atilde: atilde,
    Auml: Auml,
    auml: auml,
    brvbar: brvbar,
    Ccedil: Ccedil,
    ccedil: ccedil,
    cedil: cedil,
    cent: cent,
    copy: copy,
    COPY: COPY,
    curren: curren,
    deg: deg,
    divide: divide,
    Eacute: Eacute,
    eacute: eacute,
    Ecirc: Ecirc,
    ecirc: ecirc,
    Egrave: Egrave,
    egrave: egrave,
    ETH: ETH,
    eth: eth,
    Euml: Euml,
    euml: euml,
    frac12: frac12,
    frac14: frac14,
    frac34: frac34,
    gt: gt$1,
    GT: GT,
    Iacute: Iacute,
    iacute: iacute,
    Icirc: Icirc,
    icirc: icirc,
    iexcl: iexcl,
    Igrave: Igrave,
    igrave: igrave,
    iquest: iquest,
    Iuml: Iuml,
    iuml: iuml,
    laquo: laquo,
    lt: lt$1,
    LT: LT,
    macr: macr,
    micro: micro,
    middot: middot,
    nbsp: nbsp,
    not: not,
    Ntilde: Ntilde,
    ntilde: ntilde,
    Oacute: Oacute,
    oacute: oacute,
    Ocirc: Ocirc,
    ocirc: ocirc,
    Ograve: Ograve,
    ograve: ograve,
    ordf: ordf,
    ordm: ordm,
    Oslash: Oslash,
    oslash: oslash,
    Otilde: Otilde,
    otilde: otilde,
    Ouml: Ouml,
    ouml: ouml,
    para: para,
    plusmn: plusmn,
    pound: pound,
    quot: quot$1,
    QUOT: QUOT,
    raquo: raquo,
    reg: reg,
    REG: REG,
    sect: sect,
    shy: shy,
    sup1: sup1,
    sup2: sup2,
    sup3: sup3,
    szlig: szlig,
    THORN: THORN,
    thorn: thorn,
    times: times,
    Uacute: Uacute,
    uacute: uacute,
    Ucirc: Ucirc,
    ucirc: ucirc,
    Ugrave: Ugrave,
    ugrave: ugrave,
    uml: uml,
    Uuml: Uuml,
    uuml: uuml,
    Yacute: Yacute,
    yacute: yacute,
    yen: yen,
    yuml: yuml
};
var amp = "&";
var apos = "'";
var gt = ">";
var lt = "<";
var quot = "\"";
var require$$0$1 = {
    amp: amp,
    apos: apos,
    gt: gt,
    lt: lt,
    quot: quot
};
var decode_codepoint = {};
var require$$0 = {
    "0": 65533,
    "128": 8364,
    "130": 8218,
    "131": 402,
    "132": 8222,
    "133": 8230,
    "134": 8224,
    "135": 8225,
    "136": 710,
    "137": 8240,
    "138": 352,
    "139": 8249,
    "140": 338,
    "142": 381,
    "145": 8216,
    "146": 8217,
    "147": 8220,
    "148": 8221,
    "149": 8226,
    "150": 8211,
    "151": 8212,
    "152": 732,
    "153": 8482,
    "154": 353,
    "155": 8250,
    "156": 339,
    "158": 382,
    "159": 376
};
var __importDefault$2 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(decode_codepoint, "__esModule", { value: true });
var decode_json_1 = __importDefault$2(require$$0);
// Adapted from https://github.com/mathiasbynens/he/blob/master/src/he.js#L94-L119
var fromCodePoint$2 = 
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
String.fromCodePoint ||
    function (codePoint) {
        var output = "";
        if (codePoint > 0xffff) {
            codePoint -= 0x10000;
            output += String.fromCharCode(((codePoint >>> 10) & 0x3ff) | 0xd800);
            codePoint = 0xdc00 | (codePoint & 0x3ff);
        }
        output += String.fromCharCode(codePoint);
        return output;
    };
function decodeCodePoint(codePoint) {
    if ((codePoint >= 0xd800 && codePoint <= 0xdfff) || codePoint > 0x10ffff) {
        return "\uFFFD";
    }
    if (codePoint in decode_json_1.default) {
        codePoint = decode_json_1.default[codePoint];
    }
    return fromCodePoint$2(codePoint);
}
decode_codepoint.default = decodeCodePoint;
var __importDefault$1 = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(decode, "__esModule", { value: true });
decode.decodeHTML = decode.decodeHTMLStrict = decode.decodeXML = void 0;
var entities_json_1$1 = __importDefault$1(require$$1$1);
var legacy_json_1 = __importDefault$1(require$$1);
var xml_json_1$1 = __importDefault$1(require$$0$1);
var decode_codepoint_1 = __importDefault$1(decode_codepoint);
var strictEntityRe = /&(?:[a-zA-Z0-9]+|#[xX][\da-fA-F]+|#\d+);/g;
decode.decodeXML = getStrictDecoder(xml_json_1$1.default);
decode.decodeHTMLStrict = getStrictDecoder(entities_json_1$1.default);
function getStrictDecoder(map) {
    var replace = getReplacer(map);
    return function (str) { return String(str).replace(strictEntityRe, replace); };
}
var sorter = function (a, b) { return (a < b ? 1 : -1); };
decode.decodeHTML = (function () {
    var legacy = Object.keys(legacy_json_1.default).sort(sorter);
    var keys = Object.keys(entities_json_1$1.default).sort(sorter);
    for (var i = 0, j = 0; i < keys.length; i++) {
        if (legacy[j] === keys[i]) {
            keys[i] += ";?";
            j++;
        }
        else {
            keys[i] += ";";
        }
    }
    var re = new RegExp("&(?:" + keys.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g");
    var replace = getReplacer(entities_json_1$1.default);
    function replacer(str) {
        if (str.substr(-1) !== ";")
            str += ";";
        return replace(str);
    }
    // TODO consider creating a merged map
    return function (str) { return String(str).replace(re, replacer); };
})();
function getReplacer(map) {
    return function replace(str) {
        if (str.charAt(1) === "#") {
            var secondChar = str.charAt(2);
            if (secondChar === "X" || secondChar === "x") {
                return decode_codepoint_1.default(parseInt(str.substr(3), 16));
            }
            return decode_codepoint_1.default(parseInt(str.substr(2), 10));
        }
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return map[str.slice(1, -1)] || str;
    };
}
var encode = {};
var esm_importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(encode, "__esModule", { value: true });
encode.escapeUTF8 = encode.escape = encode.encodeNonAsciiHTML = encode.encodeHTML = encode.encodeXML = void 0;
var xml_json_1 = esm_importDefault(require$$0$1);
var inverseXML = getInverseObj(xml_json_1.default);
var xmlReplacer = getInverseReplacer(inverseXML);
/**
 * Encodes all non-ASCII characters, as well as characters not valid in XML
 * documents using XML entities.
 *
 * If a character has no equivalent entity, a
 * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
 */
encode.encodeXML = getASCIIEncoder(inverseXML);
var entities_json_1 = esm_importDefault(require$$1$1);
var inverseHTML = getInverseObj(entities_json_1.default);
var htmlReplacer = getInverseReplacer(inverseHTML);
/**
 * Encodes all entities and non-ASCII characters in the input.
 *
 * This includes characters that are valid ASCII characters in HTML documents.
 * For example `#` will be encoded as `&num;`. To get a more compact output,
 * consider using the `encodeNonAsciiHTML` function.
 *
 * If a character has no equivalent entity, a
 * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
 */
encode.encodeHTML = getInverse(inverseHTML, htmlReplacer);
/**
 * Encodes all non-ASCII characters, as well as characters not valid in HTML
 * documents using HTML entities.
 *
 * If a character has no equivalent entity, a
 * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
 */
encode.encodeNonAsciiHTML = getASCIIEncoder(inverseHTML);
function getInverseObj(obj) {
    return Object.keys(obj)
        .sort()
        .reduce(function (inverse, name) {
        inverse[obj[name]] = "&" + name + ";";
        return inverse;
    }, {});
}
function getInverseReplacer(inverse) {
    var single = [];
    var multiple = [];
    for (var _i = 0, _a = Object.keys(inverse); _i < _a.length; _i++) {
        var k = _a[_i];
        if (k.length === 1) {
            // Add value to single array
            single.push("\\" + k);
        }
        else {
            // Add value to multiple array
            multiple.push(k);
        }
    }
    // Add ranges to single characters.
    single.sort();
    for (var start = 0; start < single.length - 1; start++) {
        // Find the end of a run of characters
        var end = start;
        while (end < single.length - 1 &&
            single[end].charCodeAt(1) + 1 === single[end + 1].charCodeAt(1)) {
            end += 1;
        }
        var count = 1 + end - start;
        // We want to replace at least three characters
        if (count < 3)
            continue;
        single.splice(start, count, single[start] + "-" + single[end]);
    }
    multiple.unshift("[" + single.join("") + "]");
    return new RegExp(multiple.join("|"), "g");
}
// /[^\0-\x7F]/gu
var reNonASCII = /(?:[\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g;
var getCodePoint = 
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
String.prototype.codePointAt != null
    ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        function (str) { return str.codePointAt(0); }
    : // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        function (c) {
            return (c.charCodeAt(0) - 0xd800) * 0x400 +
                c.charCodeAt(1) -
                0xdc00 +
                0x10000;
        };
function singleCharReplacer(c) {
    return "&#x" + (c.length > 1 ? getCodePoint(c) : c.charCodeAt(0))
        .toString(16)
        .toUpperCase() + ";";
}
function getInverse(inverse, re) {
    return function (data) {
        return data
            .replace(re, function (name) { return inverse[name]; })
            .replace(reNonASCII, singleCharReplacer);
    };
}
var reEscapeChars = new RegExp(xmlReplacer.source + "|" + reNonASCII.source, "g");
/**
 * Encodes all non-ASCII characters, as well as characters not valid in XML
 * documents using numeric hexadecimal reference (eg. `&#xfc;`).
 *
 * Have a look at `escapeUTF8` if you want a more concise output at the expense
 * of reduced transportability.
 *
 * @param data String to escape.
 */
function esm_escape(data) {
    return data.replace(reEscapeChars, singleCharReplacer);
}
encode.escape = esm_escape;
/**
 * Encodes all characters not valid in XML documents using numeric hexadecimal
 * reference (eg. `&#xfc;`).
 *
 * Note that the output will be character-set dependent.
 *
 * @param data String to escape.
 */
function escapeUTF8(data) {
    return data.replace(xmlReplacer, singleCharReplacer);
}
encode.escapeUTF8 = escapeUTF8;
function getASCIIEncoder(obj) {
    return function (data) {
        return data.replace(reEscapeChars, function (c) { return obj[c] || singleCharReplacer(c); });
    };
}
(function (exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.decodeXMLStrict = exports.decodeHTML5Strict = exports.decodeHTML4Strict = exports.decodeHTML5 = exports.decodeHTML4 = exports.decodeHTMLStrict = exports.decodeHTML = exports.decodeXML = exports.encodeHTML5 = exports.encodeHTML4 = exports.escapeUTF8 = exports.escape = exports.encodeNonAsciiHTML = exports.encodeHTML = exports.encodeXML = exports.encode = exports.decodeStrict = exports.decode = void 0;
    var decode_1 = decode;
    var encode_1 = encode;
    /**
     * Decodes a string with entities.
     *
     * @param data String to decode.
     * @param level Optional level to decode at. 0 = XML, 1 = HTML. Default is 0.
     * @deprecated Use `decodeXML` or `decodeHTML` directly.
     */
    function decode$1(data, level) {
        return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTML)(data);
    }
    exports.decode = decode$1;
    /**
     * Decodes a string with entities. Does not allow missing trailing semicolons for entities.
     *
     * @param data String to decode.
     * @param level Optional level to decode at. 0 = XML, 1 = HTML. Default is 0.
     * @deprecated Use `decodeHTMLStrict` or `decodeXML` directly.
     */
    function decodeStrict(data, level) {
        return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTMLStrict)(data);
    }
    exports.decodeStrict = decodeStrict;
    /**
     * Encodes a string with entities.
     *
     * @param data String to encode.
     * @param level Optional level to encode at. 0 = XML, 1 = HTML. Default is 0.
     * @deprecated Use `encodeHTML`, `encodeXML` or `encodeNonAsciiHTML` directly.
     */
    function encode$1(data, level) {
        return (!level || level <= 0 ? encode_1.encodeXML : encode_1.encodeHTML)(data);
    }
    exports.encode = encode$1;
    var encode_2 = encode;
    Object.defineProperty(exports, "encodeXML", { enumerable: true, get: function () { return encode_2.encodeXML; } });
    Object.defineProperty(exports, "encodeHTML", { enumerable: true, get: function () { return encode_2.encodeHTML; } });
    Object.defineProperty(exports, "encodeNonAsciiHTML", { enumerable: true, get: function () { return encode_2.encodeNonAsciiHTML; } });
    Object.defineProperty(exports, "escape", { enumerable: true, get: function () { return encode_2.escape; } });
    Object.defineProperty(exports, "escapeUTF8", { enumerable: true, get: function () { return encode_2.escapeUTF8; } });
    // Legacy aliases (deprecated)
    Object.defineProperty(exports, "encodeHTML4", { enumerable: true, get: function () { return encode_2.encodeHTML; } });
    Object.defineProperty(exports, "encodeHTML5", { enumerable: true, get: function () { return encode_2.encodeHTML; } });
    var decode_2 = decode;
    Object.defineProperty(exports, "decodeXML", { enumerable: true, get: function () { return decode_2.decodeXML; } });
    Object.defineProperty(exports, "decodeHTML", { enumerable: true, get: function () { return decode_2.decodeHTML; } });
    Object.defineProperty(exports, "decodeHTMLStrict", { enumerable: true, get: function () { return decode_2.decodeHTMLStrict; } });
    // Legacy aliases (deprecated)
    Object.defineProperty(exports, "decodeHTML4", { enumerable: true, get: function () { return decode_2.decodeHTML; } });
    Object.defineProperty(exports, "decodeHTML5", { enumerable: true, get: function () { return decode_2.decodeHTML; } });
    Object.defineProperty(exports, "decodeHTML4Strict", { enumerable: true, get: function () { return decode_2.decodeHTMLStrict; } });
    Object.defineProperty(exports, "decodeHTML5Strict", { enumerable: true, get: function () { return decode_2.decodeHTMLStrict; } });
    Object.defineProperty(exports, "decodeXMLStrict", { enumerable: true, get: function () { return decode_2.decodeXML; } });
}(lib));
var ENTITY = '&(?:#x[a-f0-9]{1,6}|#[0-9]{1,7}|[a-z][a-z0-9]{1,31});';
var C_BACKSLASH$1 = 92;
var reBackslashOrAmp = /[\\&]/;
var ESCAPABLE = '[!"#$%&\'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]';
var reEntityOrEscapedChar = new RegExp("\\\\" + ESCAPABLE + "|" + ENTITY, 'gi');
var XMLSPECIAL = '[&<>"]';
var reXmlSpecial = new RegExp(XMLSPECIAL, 'g');
var unescapeChar = function (s) {
    if (s.charCodeAt(0) === C_BACKSLASH$1) {
        return s.charAt(1);
    }
    return lib.decodeHTML(s);
};
// Replace entities and backslash escapes with literal characters.
function unescapeString(s) {
    if (reBackslashOrAmp.test(s)) {
        return s.replace(reEntityOrEscapedChar, unescapeChar);
    }
    return s;
}
function normalizeURI(uri) {
    try {
        return encode_1(uri);
    }
    catch (err) {
        return uri;
    }
}
function replaceUnsafeChar(s) {
    switch (s) {
        case '&':
            return '&amp;';
        case '<':
            return '&lt;';
        case '>':
            return '&gt;';
        case '"':
            return '&quot;';
        default:
            return s;
    }
}
function escapeXml(s) {
    if (reXmlSpecial.test(s)) {
        return s.replace(reXmlSpecial, replaceUnsafeChar);
    }
    return s;
}
function repeat(str, count) {
    var arr = [];
    for (var i = 0; i < count; i++) {
        arr.push(str);
    }
    return arr.join('');
}
function isEmpty(str) {
    if (!str) {
        return true;
    }
    return !/[^ \t]+/.test(str);
}
var NodeWalker = /** @class */ (function () {
    function NodeWalker(root) {
        this.current = root;
        this.root = root;
        this.entering = true;
    }
    NodeWalker.prototype.next = function () {
        var cur = this.current;
        var entering = this.entering;
        if (cur === null) {
            return null;
        }
        var container = isContainer(cur);
        if (entering && container) {
            if (cur.firstChild) {
                this.current = cur.firstChild;
                this.entering = true;
            }
            else {
                // stay on node but exit
                this.entering = false;
            }
        }
        else if (cur === this.root) {
            this.current = null;
        }
        else if (cur.next === null) {
            this.current = cur.parent;
            this.entering = false;
        }
        else {
            this.current = cur.next;
            this.entering = true;
        }
        return { entering: entering, node: cur };
    };
    NodeWalker.prototype.resumeAt = function (node, entering) {
        this.current = node;
        this.entering = entering === true;
    };
    return NodeWalker;
}());
function isContainer(node) {
    switch (node.type) {
        case 'document':
        case 'blockQuote':
        case 'list':
        case 'item':
        case 'paragraph':
        case 'heading':
        case 'emph':
        case 'strong':
        case 'strike':
        case 'link':
        case 'image':
        case 'table':
        case 'tableHead':
        case 'tableBody':
        case 'tableRow':
        case 'tableCell':
        case 'tableDelimRow':
        case 'customInline':
            return true;
        default:
            return false;
    }
}
var lastNodeId = 1;
var nodeMap = {};
function getNodeById(id) {
    return nodeMap[id];
}
function removeNodeById(id) {
    delete nodeMap[id];
}
function removeAllNode() {
    nodeMap = {};
}
var esm_Node = /** @class */ (function () {
    function Node(nodeType, sourcepos) {
        this.parent = null;
        this.prev = null;
        this.next = null;
        // only for container node
        this.firstChild = null;
        this.lastChild = null;
        // only for leaf node
        this.literal = null;
        if (nodeType === 'document') {
            this.id = -1;
        }
        else {
            this.id = lastNodeId++;
        }
        this.type = nodeType;
        this.sourcepos = sourcepos;
        nodeMap[this.id] = this;
    }
    Node.prototype.isContainer = function () {
        return isContainer(this);
    };
    Node.prototype.unlink = function () {
        if (this.prev) {
            this.prev.next = this.next;
        }
        else if (this.parent) {
            this.parent.firstChild = this.next;
        }
        if (this.next) {
            this.next.prev = this.prev;
        }
        else if (this.parent) {
            this.parent.lastChild = this.prev;
        }
        this.parent = null;
        this.next = null;
        this.prev = null;
    };
    Node.prototype.replaceWith = function (node) {
        this.insertBefore(node);
        this.unlink();
    };
    Node.prototype.insertAfter = function (sibling) {
        sibling.unlink();
        sibling.next = this.next;
        if (sibling.next) {
            sibling.next.prev = sibling;
        }
        sibling.prev = this;
        this.next = sibling;
        if (this.parent) {
            sibling.parent = this.parent;
            if (!sibling.next) {
                sibling.parent.lastChild = sibling;
            }
        }
    };
    Node.prototype.insertBefore = function (sibling) {
        sibling.unlink();
        sibling.prev = this.prev;
        if (sibling.prev) {
            sibling.prev.next = sibling;
        }
        sibling.next = this;
        this.prev = sibling;
        sibling.parent = this.parent;
        if (!sibling.prev) {
            sibling.parent.firstChild = sibling;
        }
    };
    Node.prototype.appendChild = function (child) {
        child.unlink();
        child.parent = this;
        if (this.lastChild) {
            this.lastChild.next = child;
            child.prev = this.lastChild;
            this.lastChild = child;
        }
        else {
            this.firstChild = child;
            this.lastChild = child;
        }
    };
    Node.prototype.prependChild = function (child) {
        child.unlink();
        child.parent = this;
        if (this.firstChild) {
            this.firstChild.prev = child;
            child.next = this.firstChild;
            this.firstChild = child;
        }
        else {
            this.firstChild = child;
            this.lastChild = child;
        }
    };
    Node.prototype.walker = function () {
        return new NodeWalker(this);
    };
    return Node;
}());
var BlockNode = /** @class */ (function (_super) {
    esm_extends(BlockNode, _super);
    function BlockNode(nodeType, sourcepos) {
        var _this = _super.call(this, nodeType, sourcepos) || this;
        // temporal data (for parsing)
        _this.open = true;
        _this.lineOffsets = null;
        _this.stringContent = null;
        _this.lastLineBlank = false;
        _this.lastLineChecked = false;
        _this.type = nodeType;
        return _this;
    }
    return BlockNode;
}(esm_Node));
var ListNode = /** @class */ (function (_super) {
    esm_extends(ListNode, _super);
    function ListNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.listData = null;
        return _this;
    }
    return ListNode;
}(BlockNode));
var HeadingNode = /** @class */ (function (_super) {
    esm_extends(HeadingNode, _super);
    function HeadingNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.level = 0;
        _this.headingType = 'atx';
        return _this;
    }
    return HeadingNode;
}(BlockNode));
var CodeBlockNode = /** @class */ (function (_super) {
    esm_extends(CodeBlockNode, _super);
    function CodeBlockNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isFenced = false;
        _this.fenceChar = null;
        _this.fenceLength = 0;
        _this.fenceOffset = -1;
        _this.info = null;
        _this.infoPadding = 0;
        return _this;
    }
    return CodeBlockNode;
}(BlockNode));
var TableNode = /** @class */ (function (_super) {
    esm_extends(TableNode, _super);
    function TableNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.columns = [];
        return _this;
    }
    return TableNode;
}(BlockNode));
var TableCellNode = /** @class */ (function (_super) {
    esm_extends(TableCellNode, _super);
    function TableCellNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.startIdx = 0;
        _this.endIdx = 0;
        _this.paddingLeft = 0;
        _this.paddingRight = 0;
        _this.ignored = false;
        return _this;
    }
    return TableCellNode;
}(BlockNode));
var RefDefNode = /** @class */ (function (_super) {
    esm_extends(RefDefNode, _super);
    function RefDefNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.title = '';
        _this.dest = '';
        _this.label = '';
        return _this;
    }
    return RefDefNode;
}(BlockNode));
var CustomBlockNode = /** @class */ (function (_super) {
    esm_extends(CustomBlockNode, _super);
    function CustomBlockNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.syntaxLength = 0;
        _this.offset = -1;
        _this.info = '';
        return _this;
    }
    return CustomBlockNode;
}(BlockNode));
var HtmlBlockNode = /** @class */ (function (_super) {
    esm_extends(HtmlBlockNode, _super);
    function HtmlBlockNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.htmlBlockType = -1;
        return _this;
    }
    return HtmlBlockNode;
}(BlockNode));
var LinkNode = /** @class */ (function (_super) {
    esm_extends(LinkNode, _super);
    function LinkNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.destination = null;
        _this.title = null;
        _this.extendedAutolink = false;
        return _this;
    }
    return LinkNode;
}(esm_Node));
var CodeNode = /** @class */ (function (_super) {
    esm_extends(CodeNode, _super);
    function CodeNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tickCount = 0;
        return _this;
    }
    return CodeNode;
}(esm_Node));
var CustomInlineNode = /** @class */ (function (_super) {
    esm_extends(CustomInlineNode, _super);
    function CustomInlineNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.info = '';
        return _this;
    }
    return CustomInlineNode;
}(esm_Node));
function createNode(type, sourcepos) {
    switch (type) {
        case 'heading':
            return new HeadingNode(type, sourcepos);
        case 'list':
        case 'item':
            return new ListNode(type, sourcepos);
        case 'link':
        case 'image':
            return new LinkNode(type, sourcepos);
        case 'codeBlock':
            return new CodeBlockNode(type, sourcepos);
        case 'htmlBlock':
            return new HtmlBlockNode(type, sourcepos);
        case 'table':
            return new TableNode(type, sourcepos);
        case 'tableCell':
            return new TableCellNode(type, sourcepos);
        case 'document':
        case 'paragraph':
        case 'blockQuote':
        case 'thematicBreak':
        case 'tableRow':
        case 'tableBody':
        case 'tableHead':
        case 'frontMatter':
            return new BlockNode(type, sourcepos);
        case 'code':
            return new CodeNode(type, sourcepos);
        case 'refDef':
            return new RefDefNode(type, sourcepos);
        case 'customBlock':
            return new CustomBlockNode(type, sourcepos);
        case 'customInline':
            return new CustomInlineNode(type, sourcepos);
        default:
            return new esm_Node(type, sourcepos);
    }
}
function isCodeBlock(node) {
    return node.type === 'codeBlock';
}
function isHtmlBlock(node) {
    return node.type === 'htmlBlock';
}
function isHeading(node) {
    return node.type === 'heading';
}
function isList(node) {
    return node.type === 'list';
}
function isTable(node) {
    return node.type === 'table';
}
function isRefDef(node) {
    return node.type === 'refDef';
}
function isCustomBlock(node) {
    return node.type === 'customBlock';
}
function isCustomInline(node) {
    return node.type === 'customInline';
}
function esm_text(s, sourcepos) {
    var node = createNode('text', sourcepos);
    node.literal = s;
    return node;
}
var TAGNAME = '[A-Za-z][A-Za-z0-9-]*';
var ATTRIBUTENAME = '[a-zA-Z_:][a-zA-Z0-9:._-]*';
var UNQUOTEDVALUE = '[^"\'=<>`\\x00-\\x20]+';
var SINGLEQUOTEDVALUE = "'[^']*'";
var DOUBLEQUOTEDVALUE = '"[^"]*"';
var ATTRIBUTEVALUE = "(?:" + UNQUOTEDVALUE + "|" + SINGLEQUOTEDVALUE + "|" + DOUBLEQUOTEDVALUE + ")";
var ATTRIBUTEVALUESPEC = "" + '(?:\\s*=\\s*' + ATTRIBUTEVALUE + ")";
var ATTRIBUTE = "" + '(?:\\s+' + ATTRIBUTENAME + ATTRIBUTEVALUESPEC + "?)";
var OPENTAG = "<" + TAGNAME + ATTRIBUTE + "*\\s*/?>";
var CLOSETAG = "</" + TAGNAME + "\\s*[>]";
var HTMLCOMMENT = '<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->';
var PROCESSINGINSTRUCTION = '[<][?].*?[?][>]';
var DECLARATION = '<![A-Z]+\\s+[^>]*>';
var CDATA = '<!\\[CDATA\\[[\\s\\S]*?\\]\\]>';
var HTMLTAG = "(?:" + OPENTAG + "|" + CLOSETAG + "|" + HTMLCOMMENT + "|" + PROCESSINGINSTRUCTION + "|" + DECLARATION + "|" + CDATA + ")";
var reHtmlTag = new RegExp("^" + HTMLTAG, 'i');
// derived from https://github.com/mathiasbynens/String.fromCodePoint
/*! http://mths.be/fromcodepoint v0.2.1 by @mathias */
var fromCodePoint;
if (String.fromCodePoint) {
    fromCodePoint = function (_) {
        try {
            return String.fromCodePoint(_);
        }
        catch (e) {
            if (e instanceof RangeError) {
                return String.fromCharCode(0xfffd);
            }
            throw e;
        }
    };
}
else {
    var stringFromCharCode_1 = String.fromCharCode;
    var floor_1 = Math.floor;
    fromCodePoint = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var MAX_SIZE = 0x4000;
        var codeUnits = [];
        var highSurrogate;
        var lowSurrogate;
        var index = -1;
        var length = args.length;
        if (!length) {
            return '';
        }
        var result = '';
        while (++index < length) {
            var codePoint = Number(args[index]);
            if (!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
                codePoint < 0 || // not a valid Unicode code point
                codePoint > 0x10ffff || // not a valid Unicode code point
                floor_1(codePoint) !== codePoint // not an integer
            ) {
                return String.fromCharCode(0xfffd);
            }
            if (codePoint <= 0xffff) {
                // BMP code point
                codeUnits.push(codePoint);
            }
            else {
                // Astral code point; split in surrogate halves
                // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                codePoint -= 0x10000;
                highSurrogate = (codePoint >> 10) + 0xd800;
                lowSurrogate = (codePoint % 0x400) + 0xdc00;
                codeUnits.push(highSurrogate, lowSurrogate);
            }
            if (index + 1 === length || codeUnits.length > MAX_SIZE) {
                result += stringFromCharCode_1.apply(void 0, codeUnits);
                codeUnits.length = 0;
            }
        }
        return result;
    };
}
var fromCodePoint$1 = fromCodePoint;
var DOMAIN = '(?:[w-]+.)*[A-Za-z0-9-]+.[A-Za-z0-9-]+';
var PATH = '[^<\\s]*[^<?!.,:*_?~\\s]';
var EMAIL = '[\\w.+-]+@(?:[\\w-]+\\.)+[\\w-]+';
function trimUnmatchedTrailingParens(source) {
    var trailingParen = /\)+$/.exec(source);
    if (trailingParen) {
        var count = 0;
        for (var _i = 0, source_1 = source; _i < source_1.length; _i++) {
            var ch = source_1[_i];
            if (ch === '(') {
                if (count < 0) {
                    count = 1;
                }
                else {
                    count += 1;
                }
            }
            else if (ch === ')') {
                count -= 1;
            }
        }
        if (count < 0) {
            var trimCount = Math.min(-count, trailingParen[0].length);
            return source.substring(0, source.length - trimCount);
        }
    }
    return source;
}
function trimTrailingEntity(source) {
    return source.replace(/&[A-Za-z0-9]+;$/, '');
}
function parseEmailLink(source) {
    var reEmailLink = new RegExp(EMAIL, 'g');
    var result = [];
    var m;
    while ((m = reEmailLink.exec(source))) {
        var text_1 = m[0];
        if (!/[_-]+$/.test(text_1)) {
            result.push({
                text: text_1,
                range: [m.index, m.index + text_1.length - 1],
                url: "mailto:" + text_1,
            });
        }
    }
    return result;
}
function parseUrlLink(source) {
    var reWwwAutolink = new RegExp("(www|https?://)." + DOMAIN + PATH, 'g');
    var result = [];
    var m;
    while ((m = reWwwAutolink.exec(source))) {
        var text_2 = trimTrailingEntity(trimUnmatchedTrailingParens(m[0]));
        var scheme = m[1] === 'www' ? 'http://' : '';
        result.push({
            text: text_2,
            range: [m.index, m.index + text_2.length - 1],
            url: "" + scheme + text_2,
        });
    }
    return result;
}
function baseAutolinkParser(source) {
    return esm_spreadArray(esm_spreadArray([], parseUrlLink(source)), parseEmailLink(source)).sort(function (a, b) { return a.range[0] - b.range[0]; });
}
function convertExtAutoLinks(walker, autolinkParser) {
    if (typeof autolinkParser === 'boolean') {
        autolinkParser = baseAutolinkParser;
    }
    var event;
    var _loop_1 = function () {
        var entering = event.entering, node = event.node;
        if (entering && node.type === 'text' && node.parent.type !== 'link') {
            var literal = node.literal;
            var linkInfos = autolinkParser(literal);
            if (!linkInfos || !linkInfos.length) {
                return "continue";
            }
            var lastIdx = 0;
            var _a = node.sourcepos[0], lineNum_1 = _a[0], chPos_1 = _a[1];
            var sourcepos = function (startIdx, endIdx) {
                return [
                    [lineNum_1, chPos_1 + startIdx],
                    [lineNum_1, chPos_1 + endIdx],
                ];
            };
            var newNodes = [];
            for (var _i = 0, linkInfos_1 = linkInfos; _i < linkInfos_1.length; _i++) {
                var _b = linkInfos_1[_i], range = _b.range, url = _b.url, linkText = _b.text;
                if (range[0] > lastIdx) {
                    newNodes.push(esm_text(literal.substring(lastIdx, range[0]), sourcepos(lastIdx, range[0] - 1)));
                }
                var linkNode = createNode('link', sourcepos.apply(void 0, range));
                linkNode.appendChild(esm_text(linkText, sourcepos.apply(void 0, range)));
                linkNode.destination = url;
                linkNode.extendedAutolink = true;
                newNodes.push(linkNode);
                lastIdx = range[1] + 1;
            }
            if (lastIdx < literal.length) {
                newNodes.push(esm_text(literal.substring(lastIdx), sourcepos(lastIdx, literal.length - 1)));
            }
            for (var _c = 0, newNodes_1 = newNodes; _c < newNodes_1.length; _c++) {
                var newNode = newNodes_1[_c];
                node.insertBefore(newNode);
            }
            node.unlink();
        }
    };
    while ((event = walker.next())) {
        _loop_1();
    }
}
function last(arr) {
    return arr[arr.length - 1];
}
// normalize a reference in reference link (remove []s, trim,
// collapse internal space, unicode case fold.
// See commonmark/commonmark.js#168.
function normalizeReference(str) {
    return str
        .slice(1, str.length - 1)
        .trim()
        .replace(/[ \t\r\n]+/, ' ')
        .toLowerCase()
        .toUpperCase();
}
function iterateObject(obj, iteratee) {
    Object.keys(obj).forEach(function (key) {
        iteratee(key, obj[key]);
    });
}
function omit(obj) {
    var propNames = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        propNames[_i - 1] = arguments[_i];
    }
    var resultMap = esm_assign({}, obj);
    propNames.forEach(function (key) {
        delete resultMap[key];
    });
    return resultMap;
}
function isEmptyObj(obj) {
    return !Object.keys(obj).length;
}
function clearObj(obj) {
    Object.keys(obj).forEach(function (key) {
        delete obj[key];
    });
}
var C_NEWLINE = 10;
var C_ASTERISK = 42;
var C_UNDERSCORE = 95;
var C_BACKTICK = 96;
var C_OPEN_BRACKET$1 = 91;
var C_CLOSE_BRACKET = 93;
var C_TILDE = 126;
var C_LESSTHAN$1 = 60;
var C_BANG = 33;
var C_BACKSLASH = 92;
var C_AMPERSAND = 38;
var C_OPEN_PAREN = 40;
var C_CLOSE_PAREN = 41;
var C_COLON = 58;
var C_SINGLEQUOTE = 39;
var C_DOUBLEQUOTE = 34;
var C_DOLLAR = 36;
// Some regexps used in inline parser:
var ESCAPED_CHAR = "\\\\" + ESCAPABLE;
var rePunctuation = new RegExp(/[!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]/);
var reLinkTitle = new RegExp("^(?:\"(" + ESCAPED_CHAR + "|[^\"\\x00])*\"" +
    "|" +
    ("'(" + ESCAPED_CHAR + "|[^'\\x00])*'") +
    "|" +
    ("\\((" + ESCAPED_CHAR + "|[^()\\x00])*\\))"));
var reLinkDestinationBraces = /^(?:<(?:[^<>\n\\\x00]|\\.)*>)/;
var reEscapable = new RegExp("^" + ESCAPABLE);
var reEntityHere = new RegExp("^" + ENTITY, 'i');
var reTicks = /`+/;
var reTicksHere = /^`+/;
var reEllipses = /\.\.\./g;
var reDash = /--+/g;
var reEmailAutolink = /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/;
var reAutolink = /^<[A-Za-z][A-Za-z0-9.+-]{1,31}:[^<>\x00-\x20]*>/i;
var reSpnl = /^ *(?:\n *)?/;
var reWhitespaceChar = /^[ \t\n\x0b\x0c\x0d]/;
var reUnicodeWhitespaceChar = /^\s/;
var reFinalSpace = / *$/;
var reInitialSpace = /^ */;
var reSpaceAtEndOfLine = /^ *(?:\n|$)/;
var reLinkLabel = /^\[(?:[^\\\[\]]|\\.){0,1000}\]/;
// Matches a string of non-special characters.
var reMain = /^[^\n`\[\]\\!<&*_'"~$]+/m;
var InlineParser = /** @class */ (function () {
    function InlineParser(options) {
        // An InlineParser keeps track of a subject (a string to be parsed)
        // and a position in that subject.
        this.subject = '';
        this.delimiters = null; // used by handleDelim method
        this.brackets = null;
        this.pos = 0;
        this.lineStartNum = 0;
        this.lineIdx = 0;
        this.lineOffsets = [0];
        this.linePosOffset = 0;
        this.refMap = {};
        this.refLinkCandidateMap = {};
        this.refDefCandidateMap = {};
        this.options = options;
    }
    InlineParser.prototype.sourcepos = function (start, end) {
        var linePosOffset = this.linePosOffset + this.lineOffsets[this.lineIdx];
        var lineNum = this.lineStartNum + this.lineIdx;
        var startpos = [lineNum, start + linePosOffset];
        if (typeof end === 'number') {
            return [startpos, [lineNum, end + linePosOffset]];
        }
        return startpos;
    };
    InlineParser.prototype.nextLine = function () {
        this.lineIdx += 1;
        this.linePosOffset = -this.pos;
    };
    // If re matches at current position in the subject, advance
    // position in subject and return the match; otherwise return null.
    InlineParser.prototype.match = function (re) {
        var m = re.exec(this.subject.slice(this.pos));
        if (m === null) {
            return null;
        }
        this.pos += m.index + m[0].length;
        return m[0];
    };
    // Returns the code for the character at the current subject position, or -1
    // there are no more characters.
    InlineParser.prototype.peek = function () {
        if (this.pos < this.subject.length) {
            return this.subject.charCodeAt(this.pos);
        }
        return -1;
    };
    // Parse zero or more space characters, including at most one newline
    InlineParser.prototype.spnl = function () {
        this.match(reSpnl);
        return true;
    };
    // All of the parsers below try to match something at the current position
    // in the subject.  If they succeed in matching anything, they
    // return the inline matched, advancing the subject.
    // Attempt to parse backticks, adding either a backtick code span or a
    // literal sequence of backticks.
    InlineParser.prototype.parseBackticks = function (block) {
        var startpos = this.pos + 1;
        var ticks = this.match(reTicksHere);
        if (ticks === null) {
            return false;
        }
        var afterOpenTicks = this.pos;
        var matched;
        while ((matched = this.match(reTicks)) !== null) {
            if (matched === ticks) {
                var contents = this.subject.slice(afterOpenTicks, this.pos - ticks.length);
                var sourcepos = this.sourcepos(startpos, this.pos);
                var lines = contents.split('\n');
                if (lines.length > 1) {
                    var lastLine = last(lines);
                    this.lineIdx += lines.length - 1;
                    this.linePosOffset = -(this.pos - lastLine.length - ticks.length);
                    sourcepos[1] = this.sourcepos(this.pos);
                    contents = lines.join(' ');
                }
                var node = createNode('code', sourcepos);
                if (contents.length > 0 &&
                    contents.match(/[^ ]/) !== null &&
                    contents[0] == ' ' &&
                    contents[contents.length - 1] == ' ') {
                    node.literal = contents.slice(1, contents.length - 1);
                }
                else {
                    node.literal = contents;
                }
                node.tickCount = ticks.length;
                block.appendChild(node);
                return true;
            }
        }
        // If we got here, we didn't match a closing backtick sequence.
        this.pos = afterOpenTicks;
        block.appendChild(esm_text(ticks, this.sourcepos(startpos, this.pos - 1)));
        return true;
    };
    // Parse a backslash-escaped special character, adding either the escaped
    // character, a hard line break (if the backslash is followed by a newline),
    // or a literal backslash to the block's children.  Assumes current character
    // is a backslash.
    InlineParser.prototype.parseBackslash = function (block) {
        var subj = this.subject;
        var node;
        this.pos += 1;
        var startpos = this.pos;
        if (this.peek() === C_NEWLINE) {
            this.pos += 1;
            node = createNode('linebreak', this.sourcepos(this.pos - 1, this.pos));
            block.appendChild(node);
            this.nextLine();
        }
        else if (reEscapable.test(subj.charAt(this.pos))) {
            block.appendChild(esm_text(subj.charAt(this.pos), this.sourcepos(startpos, this.pos)));
            this.pos += 1;
        }
        else {
            block.appendChild(esm_text('\\', this.sourcepos(startpos, startpos)));
        }
        return true;
    };
    // Attempt to parse an autolink (URL or email in pointy brackets).
    InlineParser.prototype.parseAutolink = function (block) {
        var m;
        var dest;
        var node;
        var startpos = this.pos + 1;
        if ((m = this.match(reEmailAutolink))) {
            dest = m.slice(1, m.length - 1);
            node = createNode('link', this.sourcepos(startpos, this.pos));
            node.destination = normalizeURI("mailto:" + dest);
            node.title = '';
            node.appendChild(esm_text(dest, this.sourcepos(startpos + 1, this.pos - 1)));
            block.appendChild(node);
            return true;
        }
        if ((m = this.match(reAutolink))) {
            dest = m.slice(1, m.length - 1);
            node = createNode('link', this.sourcepos(startpos, this.pos));
            node.destination = normalizeURI(dest);
            node.title = '';
            node.appendChild(esm_text(dest, this.sourcepos(startpos + 1, this.pos - 1)));
            block.appendChild(node);
            return true;
        }
        return false;
    };
    // Attempt to parse a raw HTML tag.
    InlineParser.prototype.parseHtmlTag = function (block) {
        var startpos = this.pos + 1;
        var m = this.match(reHtmlTag);
        if (m === null) {
            return false;
        }
        var node = createNode('htmlInline', this.sourcepos(startpos, this.pos));
        node.literal = m;
        block.appendChild(node);
        return true;
    };
    // Scan a sequence of characters with code cc, and return information about
    // the number of delimiters and whether they are positioned such that
    // they can open and/or close emphasis or strong emphasis.  A utility
    // function for strong/emph parsing.
    InlineParser.prototype.scanDelims = function (cc) {
        var numdelims = 0;
        var startpos = this.pos;
        if (cc === C_SINGLEQUOTE || cc === C_DOUBLEQUOTE) {
            numdelims++;
            this.pos++;
        }
        else {
            while (this.peek() === cc) {
                numdelims++;
                this.pos++;
            }
        }
        if (numdelims === 0 || (numdelims < 2 && (cc === C_TILDE || cc === C_DOLLAR))) {
            this.pos = startpos;
            return null;
        }
        var charBefore = startpos === 0 ? '\n' : this.subject.charAt(startpos - 1);
        var ccAfter = this.peek();
        var charAfter;
        if (ccAfter === -1) {
            charAfter = '\n';
        }
        else {
            charAfter = fromCodePoint$1(ccAfter);
        }
        var afterIsWhitespace = reUnicodeWhitespaceChar.test(charAfter);
        var afterIsPunctuation = rePunctuation.test(charAfter);
        var beforeIsWhitespace = reUnicodeWhitespaceChar.test(charBefore);
        var beforeIsPunctuation = rePunctuation.test(charBefore);
        var leftFlanking = !afterIsWhitespace && (!afterIsPunctuation || beforeIsWhitespace || beforeIsPunctuation);
        var rightFlanking = !beforeIsWhitespace && (!beforeIsPunctuation || afterIsWhitespace || afterIsPunctuation);
        var canOpen;
        var canClose;
        if (cc === C_UNDERSCORE) {
            canOpen = leftFlanking && (!rightFlanking || beforeIsPunctuation);
            canClose = rightFlanking && (!leftFlanking || afterIsPunctuation);
        }
        else if (cc === C_SINGLEQUOTE || cc === C_DOUBLEQUOTE) {
            canOpen = leftFlanking && !rightFlanking;
            canClose = rightFlanking;
        }
        else if (cc === C_DOLLAR) {
            canOpen = !afterIsWhitespace;
            canClose = !beforeIsWhitespace;
        }
        else {
            canOpen = leftFlanking;
            canClose = rightFlanking;
        }
        this.pos = startpos;
        return { numdelims: numdelims, canOpen: canOpen, canClose: canClose };
    };
    // Handle a delimiter marker for emphasis or a quote.
    InlineParser.prototype.handleDelim = function (cc, block) {
        var res = this.scanDelims(cc);
        if (!res) {
            return false;
        }
        var numdelims = res.numdelims;
        var startpos = this.pos + 1;
        var contents;
        this.pos += numdelims;
        if (cc === C_SINGLEQUOTE) {
            contents = '\u2019';
        }
        else if (cc === C_DOUBLEQUOTE) {
            contents = '\u201C';
        }
        else {
            contents = this.subject.slice(startpos - 1, this.pos);
        }
        var node = esm_text(contents, this.sourcepos(startpos, this.pos));
        block.appendChild(node);
        // Add entry to stack for this opener
        if ((res.canOpen || res.canClose) &&
            (this.options.smart || (cc !== C_SINGLEQUOTE && cc !== C_DOUBLEQUOTE))) {
            this.delimiters = {
                cc: cc,
                numdelims: numdelims,
                origdelims: numdelims,
                node: node,
                previous: this.delimiters,
                next: null,
                canOpen: res.canOpen,
                canClose: res.canClose,
            };
            if (this.delimiters.previous) {
                this.delimiters.previous.next = this.delimiters;
            }
        }
        return true;
    };
    InlineParser.prototype.removeDelimiter = function (delim) {
        if (delim.previous !== null) {
            delim.previous.next = delim.next;
        }
        if (delim.next === null) {
            // top of stack
            this.delimiters = delim.previous;
        }
        else {
            delim.next.previous = delim.previous;
        }
    };
    InlineParser.prototype.removeDelimitersBetween = function (bottom, top) {
        if (bottom.next !== top) {
            bottom.next = top;
            top.previous = bottom;
        }
    };
    /**
     * Process all delimiters - emphasis, strong emphasis, strikethrough(gfm)
     * If the smart punctuation options is true,
     * convert single/double quotes to corresponding unicode characters.
     **/
    InlineParser.prototype.processEmphasis = function (stackBottom) {
        var _a;
        var opener;
        var closer;
        var oldCloser;
        var openerInl, closerInl;
        var openerFound;
        var oddMatch = false;
        var openersBottom = (_a = {},
            _a[C_UNDERSCORE] = [stackBottom, stackBottom, stackBottom],
            _a[C_ASTERISK] = [stackBottom, stackBottom, stackBottom],
            _a[C_SINGLEQUOTE] = [stackBottom],
            _a[C_DOUBLEQUOTE] = [stackBottom],
            _a[C_TILDE] = [stackBottom],
            _a[C_DOLLAR] = [stackBottom],
            _a);
        // find first closer above stackBottom:
        closer = this.delimiters;
        while (closer !== null && closer.previous !== stackBottom) {
            closer = closer.previous;
        }
        // move forward, looking for closers, and handling each
        while (closer !== null) {
            var closercc = closer.cc;
            var closerEmph = closercc === C_UNDERSCORE || closercc === C_ASTERISK;
            if (!closer.canClose) {
                closer = closer.next;
            }
            else {
                // found emphasis closer. now look back for first matching opener:
                opener = closer.previous;
                openerFound = false;
                while (opener !== null &&
                    opener !== stackBottom &&
                    opener !== openersBottom[closercc][closerEmph ? closer.origdelims % 3 : 0]) {
                    oddMatch =
                        closerEmph &&
                            (closer.canOpen || opener.canClose) &&
                            closer.origdelims % 3 !== 0 &&
                            (opener.origdelims + closer.origdelims) % 3 === 0;
                    if (opener.cc === closer.cc && opener.canOpen && !oddMatch) {
                        openerFound = true;
                        break;
                    }
                    opener = opener.previous;
                }
                oldCloser = closer;
                if (closerEmph || closercc === C_TILDE || closercc === C_DOLLAR) {
                    if (!openerFound) {
                        closer = closer.next;
                    }
                    else if (opener) {
                        // (null opener check for type narrowing)
                        // calculate actual number of delimiters used from closer
                        var useDelims = closer.numdelims >= 2 && opener.numdelims >= 2 ? 2 : 1;
                        var emptyDelims = closerEmph ? 0 : 1;
                        openerInl = opener.node;
                        closerInl = closer.node;
                        // build contents for new emph element
                        var nodeType = closerEmph
                            ? useDelims === 1
                                ? 'emph'
                                : 'strong'
                            : 'strike';
                        if (closercc === C_DOLLAR) {
                            nodeType = 'customInline';
                        }
                        var newNode = createNode(nodeType);
                        var openerEndPos = openerInl.sourcepos[1];
                        var closerStartPos = closerInl.sourcepos[0];
                        newNode.sourcepos = [
                            [openerEndPos[0], openerEndPos[1] - useDelims + 1],
                            [closerStartPos[0], closerStartPos[1] + useDelims - 1],
                        ];
                        openerInl.sourcepos[1][1] -= useDelims;
                        closerInl.sourcepos[0][1] += useDelims;
                        openerInl.literal = openerInl.literal.slice(useDelims);
                        closerInl.literal = closerInl.literal.slice(useDelims);
                        opener.numdelims -= useDelims;
                        closer.numdelims -= useDelims;
                        // remove used delimiters from stack elts and inlines
                        var tmp = openerInl.next;
                        var next = void 0;
                        while (tmp && tmp !== closerInl) {
                            next = tmp.next;
                            tmp.unlink();
                            newNode.appendChild(tmp);
                            tmp = next;
                        }
                        // build custom inline node
                        if (closercc === C_DOLLAR) {
                            var textNode = newNode.firstChild;
                            var literal = textNode.literal || '';
                            var info = literal.split(/\s/)[0];
                            newNode.info = info;
                            if (literal.length <= info.length) {
                                textNode.unlink();
                            }
                            else {
                                textNode.sourcepos[0][1] += info.length;
                                textNode.literal = literal.replace(info + " ", '');
                            }
                        }
                        openerInl.insertAfter(newNode);
                        // remove elts between opener and closer in delimiters stack
                        this.removeDelimitersBetween(opener, closer);
                        // if opener has 0 delims, remove it and the inline
                        // if opener has 1 delims and character is tilde, remove delimiter only
                        if (opener.numdelims <= emptyDelims) {
                            if (opener.numdelims === 0) {
                                openerInl.unlink();
                            }
                            this.removeDelimiter(opener);
                        }
                        // if closer has 0 delims, remove it and the inline
                        // if closer has 1 delims and character is tilde, remove delimiter only
                        if (closer.numdelims <= emptyDelims) {
                            if (closer.numdelims === 0) {
                                closerInl.unlink();
                            }
                            var tempstack = closer.next;
                            this.removeDelimiter(closer);
                            closer = tempstack;
                        }
                    }
                }
                else if (closercc === C_SINGLEQUOTE) {
                    closer.node.literal = '\u2019';
                    if (openerFound) {
                        opener.node.literal = '\u2018';
                    }
                    closer = closer.next;
                }
                else if (closercc === C_DOUBLEQUOTE) {
                    closer.node.literal = '\u201D';
                    if (openerFound) {
                        opener.node.literal = '\u201C';
                    }
                    closer = closer.next;
                }
                if (!openerFound) {
                    // Set lower bound for future searches for openers:
                    openersBottom[closercc][closerEmph ? oldCloser.origdelims % 3 : 0] = oldCloser.previous;
                    if (!oldCloser.canOpen) {
                        // We can remove a closer that can't be an opener,
                        // once we've seen there's no matching opener:
                        this.removeDelimiter(oldCloser);
                    }
                }
            }
        }
        // remove all delimiters
        while (this.delimiters !== null && this.delimiters !== stackBottom) {
            this.removeDelimiter(this.delimiters);
        }
    };
    // Attempt to parse link title (sans quotes), returning the string
    // or null if no match.
    InlineParser.prototype.parseLinkTitle = function () {
        var title = this.match(reLinkTitle);
        if (title === null) {
            return null;
        }
        // chop off quotes from title and unescape:
        return unescapeString(title.substr(1, title.length - 2));
    };
    // Attempt to parse link destination, returning the string or null if no match.
    InlineParser.prototype.parseLinkDestination = function () {
        var res = this.match(reLinkDestinationBraces);
        if (res === null) {
            if (this.peek() === C_LESSTHAN$1) {
                return null;
            }
            // @TODO handrolled parser; res should be null or the string
            var savepos = this.pos;
            var openparens = 0;
            var c = void 0;
            while ((c = this.peek()) !== -1) {
                if (c === C_BACKSLASH && reEscapable.test(this.subject.charAt(this.pos + 1))) {
                    this.pos += 1;
                    if (this.peek() !== -1) {
                        this.pos += 1;
                    }
                }
                else if (c === C_OPEN_PAREN) {
                    this.pos += 1;
                    openparens += 1;
                }
                else if (c === C_CLOSE_PAREN) {
                    if (openparens < 1) {
                        break;
                    }
                    else {
                        this.pos += 1;
                        openparens -= 1;
                    }
                }
                else if (reWhitespaceChar.exec(fromCodePoint$1(c)) !== null) {
                    break;
                }
                else {
                    this.pos += 1;
                }
            }
            if (this.pos === savepos && c !== C_CLOSE_PAREN) {
                return null;
            }
            if (openparens !== 0) {
                return null;
            }
            res = this.subject.substr(savepos, this.pos - savepos);
            return normalizeURI(unescapeString(res));
        } // chop off surrounding <..>:
        return normalizeURI(unescapeString(res.substr(1, res.length - 2)));
    };
    // Attempt to parse a link label, returning number of characters parsed.
    InlineParser.prototype.parseLinkLabel = function () {
        var m = this.match(reLinkLabel);
        if (m === null || m.length > 1001) {
            return 0;
        }
        return m.length;
    };
    // Add open bracket to delimiter stack and add a text node to block's children.
    InlineParser.prototype.parseOpenBracket = function (block) {
        var startpos = this.pos;
        this.pos += 1;
        var node = esm_text('[', this.sourcepos(this.pos, this.pos));
        block.appendChild(node);
        // Add entry to stack for this opener
        this.addBracket(node, startpos, false);
        return true;
    };
    // IF next character is [, and ! delimiter to delimiter stack and
    // add a text node to block's children.  Otherwise just add a text node.
    InlineParser.prototype.parseBang = function (block) {
        var startpos = this.pos;
        this.pos += 1;
        if (this.peek() === C_OPEN_BRACKET$1) {
            this.pos += 1;
            var node = esm_text('![', this.sourcepos(this.pos - 1, this.pos));
            block.appendChild(node);
            // Add entry to stack for this opener
            this.addBracket(node, startpos + 1, true);
        }
        else {
            var node = esm_text('!', this.sourcepos(this.pos, this.pos));
            block.appendChild(node);
        }
        return true;
    };
    // Try to match close bracket against an opening in the delimiter
    // stack.  Add either a link or image, or a plain [ character,
    // to block's children.  If there is a matching delimiter,
    // remove it from the delimiter stack.
    InlineParser.prototype.parseCloseBracket = function (block) {
        var dest = null;
        var title = null;
        var matched = false;
        this.pos += 1;
        var startpos = this.pos;
        // get last [ or ![
        var opener = this.brackets;
        if (opener === null) {
            // no matched opener, just return a literal
            block.appendChild(esm_text(']', this.sourcepos(startpos, startpos)));
            return true;
        }
        if (!opener.active) {
            // no matched opener, just return a literal
            block.appendChild(esm_text(']', this.sourcepos(startpos, startpos)));
            // take opener off brackets stack
            this.removeBracket();
            return true;
        }
        // If we got here, open is a potential opener
        var isImage = opener.image;
        // Check to see if we have a link/image
        var savepos = this.pos;
        // Inline link?
        if (this.peek() === C_OPEN_PAREN) {
            this.pos++;
            if (this.spnl() &&
                (dest = this.parseLinkDestination()) !== null &&
                this.spnl() &&
                // make sure there's a space before the title:
                ((reWhitespaceChar.test(this.subject.charAt(this.pos - 1)) &&
                    (title = this.parseLinkTitle())) ||
                    true) &&
                this.spnl() &&
                this.peek() === C_CLOSE_PAREN) {
                this.pos += 1;
                matched = true;
            }
            else {
                this.pos = savepos;
            }
        }
        var refLabel = '';
        if (!matched) {
            // Next, see if there's a link label
            var beforelabel = this.pos;
            var n = this.parseLinkLabel();
            if (n > 2) {
                refLabel = this.subject.slice(beforelabel, beforelabel + n);
            }
            else if (!opener.bracketAfter) {
                // Empty or missing second label means to use the first label as the reference.
                // The reference must not contain a bracket. If we know there's a bracket, we don't even bother checking it.
                refLabel = this.subject.slice(opener.index, startpos);
            }
            if (n === 0) {
                // If shortcut reference link, rewind before spaces we skipped.
                this.pos = savepos;
            }
            if (refLabel) {
                refLabel = normalizeReference(refLabel);
                // lookup rawlabel in refMap
                var link = this.refMap[refLabel];
                if (link) {
                    dest = link.destination;
                    title = link.title;
                    matched = true;
                }
            }
        }
        if (matched) {
            var node = createNode(isImage ? 'image' : 'link');
            node.destination = dest;
            node.title = title || '';
            node.sourcepos = [opener.startpos, this.sourcepos(this.pos)];
            var tmp = opener.node.next;
            var next = void 0;
            while (tmp) {
                next = tmp.next;
                tmp.unlink();
                node.appendChild(tmp);
                tmp = next;
            }
            block.appendChild(node);
            this.processEmphasis(opener.previousDelimiter);
            this.removeBracket();
            opener.node.unlink();
            // We remove this bracket and processEmphasis will remove later delimiters.
            // Now, for a link, we also deactivate earlier link openers.
            // (no links in links)
            if (!isImage) {
                opener = this.brackets;
                while (opener !== null) {
                    if (!opener.image) {
                        opener.active = false; // deactivate this opener
                    }
                    opener = opener.previous;
                }
            }
            if (this.options.referenceDefinition) {
                this.refLinkCandidateMap[block.id] = { node: block, refLabel: refLabel };
            }
            return true;
        } // no match
        this.removeBracket(); // remove this opener from stack
        this.pos = startpos;
        block.appendChild(esm_text(']', this.sourcepos(startpos, startpos)));
        if (this.options.referenceDefinition) {
            this.refLinkCandidateMap[block.id] = { node: block, refLabel: refLabel };
        }
        return true;
    };
    InlineParser.prototype.addBracket = function (node, index, image) {
        if (this.brackets !== null) {
            this.brackets.bracketAfter = true;
        }
        this.brackets = {
            node: node,
            startpos: this.sourcepos(index + (image ? 0 : 1)),
            previous: this.brackets,
            previousDelimiter: this.delimiters,
            index: index,
            image: image,
            active: true,
        };
    };
    InlineParser.prototype.removeBracket = function () {
        if (this.brackets) {
            this.brackets = this.brackets.previous;
        }
    };
    // Attempt to parse an entity.
    InlineParser.prototype.parseEntity = function (block) {
        var m;
        var startpos = this.pos + 1;
        if ((m = this.match(reEntityHere))) {
            block.appendChild(esm_text(lib.decodeHTML(m), this.sourcepos(startpos, this.pos)));
            return true;
        }
        return false;
    };
    // Parse a run of ordinary characters, or a single character with
    // a special meaning in markdown, as a plain string.
    InlineParser.prototype.parseString = function (block) {
        var m;
        var startpos = this.pos + 1;
        if ((m = this.match(reMain))) {
            if (this.options.smart) {
                var lit = m.replace(reEllipses, '\u2026').replace(reDash, function (chars) {
                    var enCount = 0;
                    var emCount = 0;
                    if (chars.length % 3 === 0) {
                        // If divisible by 3, use all em dashes
                        emCount = chars.length / 3;
                    }
                    else if (chars.length % 2 === 0) {
                        // If divisible by 2, use all en dashes
                        enCount = chars.length / 2;
                    }
                    else if (chars.length % 3 === 2) {
                        // If 2 extra dashes, use en dash for last 2; em dashes for rest
                        enCount = 1;
                        emCount = (chars.length - 2) / 3;
                    }
                    else {
                        // Use en dashes for last 4 hyphens; em dashes for rest
                        enCount = 2;
                        emCount = (chars.length - 4) / 3;
                    }
                    return repeat('\u2014', emCount) + repeat('\u2013', enCount);
                });
                block.appendChild(esm_text(lit, this.sourcepos(startpos, this.pos)));
            }
            else {
                var node = esm_text(m, this.sourcepos(startpos, this.pos));
                block.appendChild(node);
            }
            return true;
        }
        return false;
    };
    // Parse a newline.  If it was preceded by two spaces, return a hard
    // line break; otherwise a soft line break.
    InlineParser.prototype.parseNewline = function (block) {
        this.pos += 1; // assume we're at a \n
        // check previous node for trailing spaces
        var lastc = block.lastChild;
        if (lastc && lastc.type === 'text' && lastc.literal[lastc.literal.length - 1] === ' ') {
            var hardbreak = lastc.literal[lastc.literal.length - 2] === ' ';
            var litLen = lastc.literal.length;
            lastc.literal = lastc.literal.replace(reFinalSpace, '');
            var finalSpaceLen = litLen - lastc.literal.length;
            lastc.sourcepos[1][1] -= finalSpaceLen;
            block.appendChild(createNode(hardbreak ? 'linebreak' : 'softbreak', this.sourcepos(this.pos - finalSpaceLen, this.pos)));
        }
        else {
            block.appendChild(createNode('softbreak', this.sourcepos(this.pos, this.pos)));
        }
        this.nextLine();
        this.match(reInitialSpace); // gobble leading spaces in next line
        return true;
    };
    // Attempt to parse a link reference, modifying refmap.
    InlineParser.prototype.parseReference = function (block, refMap) {
        if (!this.options.referenceDefinition) {
            return 0;
        }
        this.subject = block.stringContent;
        this.pos = 0;
        var title = null;
        var startpos = this.pos;
        // label:
        var matchChars = this.parseLinkLabel();
        if (matchChars === 0) {
            return 0;
        }
        var rawlabel = this.subject.substr(0, matchChars);
        // colon:
        if (this.peek() === C_COLON) {
            this.pos++;
        }
        else {
            this.pos = startpos;
            return 0;
        }
        //  link url
        this.spnl();
        var dest = this.parseLinkDestination();
        if (dest === null) {
            this.pos = startpos;
            return 0;
        }
        var beforetitle = this.pos;
        this.spnl();
        if (this.pos !== beforetitle) {
            title = this.parseLinkTitle();
        }
        if (title === null) {
            title = '';
            // rewind before spaces
            this.pos = beforetitle;
        }
        // make sure we're at line end:
        var atLineEnd = true;
        if (this.match(reSpaceAtEndOfLine) === null) {
            if (title === '') {
                atLineEnd = false;
            }
            else {
                // the potential title we found is not at the line end,
                // but it could still be a legal link reference if we
                // discard the title
                title = '';
                // rewind before spaces
                this.pos = beforetitle;
                // and instead check if the link URL is at the line end
                atLineEnd = this.match(reSpaceAtEndOfLine) !== null;
            }
        }
        if (!atLineEnd) {
            this.pos = startpos;
            return 0;
        }
        var normalLabel = normalizeReference(rawlabel);
        if (normalLabel === '') {
            // label must contain non-whitespace characters
            this.pos = startpos;
            return 0;
        }
        var sourcepos = this.getReferenceDefSourcepos(block);
        block.sourcepos[0][0] = sourcepos[1][0] + 1;
        var node = createNode('refDef', sourcepos);
        node.title = title;
        node.dest = dest;
        node.label = normalLabel;
        block.insertBefore(node);
        if (!refMap[normalLabel]) {
            refMap[normalLabel] = createRefDefState(node);
        }
        else {
            this.refDefCandidateMap[node.id] = node;
        }
        return this.pos - startpos;
    };
    InlineParser.prototype.mergeTextNodes = function (walker) {
        var event;
        var textNodes = [];
        while ((event = walker.next())) {
            var entering = event.entering, node = event.node;
            if (entering && node.type === 'text') {
                textNodes.push(node);
            }
            else if (textNodes.length === 1) {
                textNodes = [];
            }
            else if (textNodes.length > 1) {
                var firstNode = textNodes[0];
                var lastNode = textNodes[textNodes.length - 1];
                if (firstNode.sourcepos && lastNode.sourcepos) {
                    firstNode.sourcepos[1] = lastNode.sourcepos[1];
                }
                firstNode.next = lastNode.next;
                if (firstNode.next) {
                    firstNode.next.prev = firstNode;
                }
                for (var i = 1; i < textNodes.length; i += 1) {
                    firstNode.literal += textNodes[i].literal;
                    textNodes[i].unlink();
                }
                textNodes = [];
            }
        }
    };
    InlineParser.prototype.getReferenceDefSourcepos = function (block) {
        var lines = block.stringContent.split(/\n|\r\n/);
        var passedUrlLine = false;
        var quotationCount = 0;
        var lastLineOffset = { line: 0, ch: 0 };
        for (var i = 0; i < lines.length; i += 1) {
            var line = lines[i];
            if (reWhitespaceChar.test(line)) {
                break;
            }
            if (/\:/.test(line) && quotationCount === 0) {
                if (passedUrlLine) {
                    break;
                }
                var lineOffset = line.indexOf(':') === line.length - 1 ? i + 1 : i;
                lastLineOffset = { line: lineOffset, ch: lines[lineOffset].length };
                passedUrlLine = true;
            }
            // should consider extendable title
            var matched = line.match(/'|"/g);
            if (matched) {
                quotationCount += matched.length;
            }
            if (quotationCount === 2) {
                lastLineOffset = { line: i, ch: line.length };
                break;
            }
        }
        return [
            [block.sourcepos[0][0], block.sourcepos[0][1]],
            [block.sourcepos[0][0] + lastLineOffset.line, lastLineOffset.ch],
        ];
    };
    // Parse the next inline element in subject, advancing subject position.
    // On success, add the result to block's children and return true.
    // On failure, return false.
    InlineParser.prototype.parseInline = function (block) {
        var _a;
        var res = false;
        var c = this.peek();
        if (c === -1) {
            return false;
        }
        switch (c) {
            case C_NEWLINE:
                res = this.parseNewline(block);
                break;
            case C_BACKSLASH:
                res = this.parseBackslash(block);
                break;
            case C_BACKTICK:
                res = this.parseBackticks(block);
                break;
            case C_ASTERISK:
            case C_UNDERSCORE:
            case C_TILDE:
            case C_DOLLAR:
                res = this.handleDelim(c, block);
                break;
            case C_SINGLEQUOTE:
            case C_DOUBLEQUOTE:
                res = !!((_a = this.options) === null || _a === void 0 ? void 0 : _a.smart) && this.handleDelim(c, block);
                break;
            case C_OPEN_BRACKET$1:
                res = this.parseOpenBracket(block);
                break;
            case C_BANG:
                res = this.parseBang(block);
                break;
            case C_CLOSE_BRACKET:
                res = this.parseCloseBracket(block);
                break;
            case C_LESSTHAN$1:
                res = this.parseAutolink(block) || this.parseHtmlTag(block);
                break;
            case C_AMPERSAND:
                if (!block.disabledEntityParse) {
                    res = this.parseEntity(block);
                }
                break;
            default:
                res = this.parseString(block);
                break;
        }
        if (!res) {
            this.pos += 1;
            block.appendChild(esm_text(fromCodePoint$1(c), this.sourcepos(this.pos, this.pos + 1)));
        }
        return true;
    };
    // Parse string content in block into inline children,
    // using refmap to resolve references.
    InlineParser.prototype.parse = function (block) {
        this.subject = block.stringContent.trim();
        this.pos = 0;
        this.delimiters = null;
        this.brackets = null;
        this.lineOffsets = block.lineOffsets || [0];
        this.lineIdx = 0;
        this.linePosOffset = 0;
        this.lineStartNum = block.sourcepos[0][0];
        if (isHeading(block)) {
            this.lineOffsets[0] += block.level + 1;
        }
        while (this.parseInline(block)) { }
        block.stringContent = null; // allow raw string to be garbage collected
        this.processEmphasis(null);
        this.mergeTextNodes(block.walker());
        var _a = this.options, extendedAutolinks = _a.extendedAutolinks, customParser = _a.customParser;
        if (extendedAutolinks) {
            convertExtAutoLinks(block.walker(), extendedAutolinks);
        }
        if (customParser && block.firstChild) {
            var event_1;
            var walker = block.firstChild.walker();
            while ((event_1 = walker.next())) {
                var node = event_1.node, entering = event_1.entering;
                if (customParser[node.type]) {
                    customParser[node.type](node, { entering: entering, options: this.options });
                }
            }
        }
    };
    return InlineParser;
}());
var reTaskListItemMarker = /^\[([ \txX])\][ \t]+/;
// finalize for block handler
function taskListItemFinalize(_, block) {
    if (block.firstChild && block.firstChild.type === 'paragraph') {
        var p = block.firstChild;
        var m = p.stringContent.match(reTaskListItemMarker);
        if (m) {
            var mLen = m[0].length;
            p.stringContent = p.stringContent.substring(mLen - 1);
            p.sourcepos[0][1] += mLen;
            p.lineOffsets[0] += mLen;
            block.listData.task = true;
            block.listData.checked = /[xX]/.test(m[1]);
        }
    }
}
var table = {
    continue: function () {
        return 0 /* Go */;
    },
    finalize: function () { },
    canContain: function (t) {
        return t === 'tableHead' || t === 'tableBody';
    },
    acceptsLines: false,
};
var tableBody$1 = {
    continue: function () {
        return 0 /* Go */;
    },
    finalize: function () { },
    canContain: function (t) {
        return t === 'tableRow';
    },
    acceptsLines: false,
};
var tableHead$1 = {
    continue: function () {
        return 1 /* Stop */;
    },
    finalize: function () { },
    canContain: function (t) {
        return t === 'tableRow' || t === 'tableDelimRow';
    },
    acceptsLines: false,
};
var tableDelimRow = {
    continue: function () {
        return 1 /* Stop */;
    },
    finalize: function () { },
    canContain: function (t) {
        return t === 'tableDelimCell';
    },
    acceptsLines: false,
};
var tableDelimCell = {
    continue: function () {
        return 1 /* Stop */;
    },
    finalize: function () { },
    canContain: function () {
        return false;
    },
    acceptsLines: false,
};
var tableRow = {
    continue: function () {
        return 1 /* Stop */;
    },
    finalize: function () { },
    canContain: function (t) {
        return t === 'tableCell';
    },
    acceptsLines: false,
};
var tableCell = {
    continue: function () {
        return 1 /* Stop */;
    },
    finalize: function () { },
    canContain: function () {
        return false;
    },
    acceptsLines: false,
};
var CODE_INDENT = 4;
var C_TAB = 9;
var C_GREATERTHAN = 62;
var C_LESSTHAN = 60;
var C_SPACE = 32;
var C_OPEN_BRACKET = 91;
var reNonSpace = /[^ \t\f\v\r\n]/;
var reClosingCodeFence = /^(?:`{3,}|~{3,})(?= *$)/;
// Returns true if block ends with a blank line, descending if needed
// into lists and sublists.
function endsWithBlankLine(block) {
    var curBlock = block;
    while (curBlock) {
        if (curBlock.lastLineBlank) {
            return true;
        }
        var t = curBlock.type;
        if (!curBlock.lastLineChecked && (t === 'list' || t === 'item')) {
            curBlock.lastLineChecked = true;
            curBlock = curBlock.lastChild;
        }
        else {
            curBlock.lastLineChecked = true;
            break;
        }
    }
    return false;
}
function peek(ln, pos) {
    if (pos < ln.length) {
        return ln.charCodeAt(pos);
    }
    return -1;
}
// Returns true if string contains only space characters.
function isBlank(s) {
    return !reNonSpace.test(s);
}
function isSpaceOrTab(c) {
    return c === C_SPACE || c === C_TAB;
}
var reClosingCustomBlock = /^\$\$$/;
var customBlock$1 = {
    continue: function (parser, container) {
        var line = parser.currentLine;
        var match = line.match(reClosingCustomBlock);
        if (match) {
            // closing custom block
            parser.lastLineLength = match[0].length;
            parser.finalize(container, parser.lineNumber);
            return 2 /* Finished */;
        }
        // skip optional spaces of custom block offset
        var i = container.offset;
        while (i > 0 && isSpaceOrTab(peek(line, parser.offset))) {
            parser.advanceOffset(1, true);
            i--;
        }
        return 0 /* Go */;
    },
    finalize: function (_, block) {
        if (block.stringContent === null) {
            return;
        }
        // first line becomes info string
        var content = block.stringContent;
        var newlinePos = content.indexOf('\n');
        var firstLine = content.slice(0, newlinePos);
        var rest = content.slice(newlinePos + 1);
        var infoString = firstLine.match(/^(\s*)(.*)/);
        block.info = unescapeString(infoString[2].trim());
        block.literal = rest;
        block.stringContent = null;
    },
    canContain: function () {
        return false;
    },
    acceptsLines: true,
};
var noop = {
    continue: function () {
        return 1 /* Stop */;
    },
    finalize: function () { },
    canContain: function () {
        return false;
    },
    acceptsLines: true,
};
var document$1 = {
    continue: function () {
        return 0 /* Go */;
    },
    finalize: function () { },
    canContain: function (t) {
        return t !== 'item';
    },
    acceptsLines: false,
};
var list = {
    continue: function () {
        return 0 /* Go */;
    },
    finalize: function (_, block) {
        var item = block.firstChild;
        while (item) {
            // check for non-final list item ending with blank line:
            if (endsWithBlankLine(item) && item.next) {
                block.listData.tight = false;
                break;
            }
            // recurse into children of list item, to see if there are
            // spaces between any of them:
            var subitem = item.firstChild;
            while (subitem) {
                if (endsWithBlankLine(subitem) && (item.next || subitem.next)) {
                    block.listData.tight = false;
                    break;
                }
                subitem = subitem.next;
            }
            item = item.next;
        }
    },
    canContain: function (t) {
        return t === 'item';
    },
    acceptsLines: false,
};
var blockQuote$1 = {
    continue: function (parser) {
        var ln = parser.currentLine;
        if (!parser.indented && peek(ln, parser.nextNonspace) === C_GREATERTHAN) {
            parser.advanceNextNonspace();
            parser.advanceOffset(1, false);
            if (isSpaceOrTab(peek(ln, parser.offset))) {
                parser.advanceOffset(1, true);
            }
        }
        else {
            return 1 /* Stop */;
        }
        return 0 /* Go */;
    },
    finalize: function () { },
    canContain: function (t) {
        return t !== 'item';
    },
    acceptsLines: false,
};
var item = {
    continue: function (parser, container) {
        if (parser.blank) {
            if (container.firstChild === null) {
                // Blank line after empty list item
                return 1 /* Stop */;
            }
            parser.advanceNextNonspace();
        }
        else if (parser.indent >= container.listData.markerOffset + container.listData.padding) {
            parser.advanceOffset(container.listData.markerOffset + container.listData.padding, true);
        }
        else {
            return 1 /* Stop */;
        }
        return 0 /* Go */;
    },
    finalize: taskListItemFinalize,
    canContain: function (t) {
        return t !== 'item';
    },
    acceptsLines: false,
};
var heading = {
    continue: function () {
        // a heading can never container > 1 line, so fail to match:
        return 1 /* Stop */;
    },
    finalize: function () { },
    canContain: function () {
        return false;
    },
    acceptsLines: false,
};
var thematicBreak$1 = {
    continue: function () {
        // a thematic break can never container > 1 line, so fail to match:
        return 1 /* Stop */;
    },
    finalize: function () { },
    canContain: function () {
        return false;
    },
    acceptsLines: false,
};
var codeBlock = {
    continue: function (parser, container) {
        var ln = parser.currentLine;
        var indent = parser.indent;
        if (container.isFenced) {
            // fenced
            var match = indent <= 3 &&
                ln.charAt(parser.nextNonspace) === container.fenceChar &&
                ln.slice(parser.nextNonspace).match(reClosingCodeFence);
            if (match && match[0].length >= container.fenceLength) {
                // closing fence - we're at end of line, so we can return
                parser.lastLineLength = parser.offset + indent + match[0].length;
                parser.finalize(container, parser.lineNumber);
                return 2 /* Finished */;
            }
            // skip optional spaces of fence offset
            var i = container.fenceOffset;
            while (i > 0 && isSpaceOrTab(peek(ln, parser.offset))) {
                parser.advanceOffset(1, true);
                i--;
            }
        }
        else {
            // indented
            if (indent >= CODE_INDENT) {
                parser.advanceOffset(CODE_INDENT, true);
            }
            else if (parser.blank) {
                parser.advanceNextNonspace();
            }
            else {
                return 1 /* Stop */;
            }
        }
        return 0 /* Go */;
    },
    finalize: function (_, block) {
        var _a;
        if (block.stringContent === null) {
            return;
        }
        if (block.isFenced) {
            // fenced
            // first line becomes info string
            var content = block.stringContent;
            var newlinePos = content.indexOf('\n');
            var firstLine = content.slice(0, newlinePos);
            var rest = content.slice(newlinePos + 1);
            var infoString = firstLine.match(/^(\s*)(.*)/);
            block.infoPadding = infoString[1].length;
            block.info = unescapeString(infoString[2].trim());
            block.literal = rest;
        }
        else {
            // indented
            block.literal = (_a = block.stringContent) === null || _a === void 0 ? void 0 : _a.replace(/(\n *)+$/, '\n');
        }
        block.stringContent = null; // allow GC
    },
    canContain: function () {
        return false;
    },
    acceptsLines: true,
};
var htmlBlock$1 = {
    continue: function (parser, container) {
        return parser.blank && (container.htmlBlockType === 6 || container.htmlBlockType === 7)
            ? 1 /* Stop */
            : 0 /* Go */;
    },
    finalize: function (_, block) {
        var _a;
        block.literal = ((_a = block.stringContent) === null || _a === void 0 ? void 0 : _a.replace(/(\n *)+$/, '')) || null;
        block.stringContent = null; // allow GC
    },
    canContain: function () {
        return false;
    },
    acceptsLines: true,
};
var paragraph = {
    continue: function (parser) {
        return parser.blank ? 1 /* Stop */ : 0 /* Go */;
    },
    finalize: function (parser, block) {
        if (block.stringContent === null) {
            return;
        }
        var pos;
        var hasReferenceDefs = false;
        // try parsing the beginning as link reference definitions:
        while (peek(block.stringContent, 0) === C_OPEN_BRACKET &&
            (pos = parser.inlineParser.parseReference(block, parser.refMap))) {
            block.stringContent = block.stringContent.slice(pos);
            hasReferenceDefs = true;
        }
        if (hasReferenceDefs && isBlank(block.stringContent)) {
            block.unlink();
        }
    },
    canContain: function () {
        return false;
    },
    acceptsLines: true,
};
var refDef = noop;
var frontMatter$2 = noop;
var blockHandlers = {
    document: document$1,
    list: list,
    blockQuote: blockQuote$1,
    item: item,
    heading: heading,
    thematicBreak: thematicBreak$1,
    codeBlock: codeBlock,
    htmlBlock: htmlBlock$1,
    paragraph: paragraph,
    table: table,
    tableBody: tableBody$1,
    tableHead: tableHead$1,
    tableRow: tableRow,
    tableCell: tableCell,
    tableDelimRow: tableDelimRow,
    tableDelimCell: tableDelimCell,
    refDef: refDef,
    customBlock: customBlock$1,
    frontMatter: frontMatter$2,
};
function parseRowContent(content) {
    var startIdx = 0;
    var offset = 0;
    var cells = [];
    for (var i = 0; i < content.length; i += 1) {
        if (content[i] === '|' && content[i - 1] !== '\\') {
            var cell = content.substring(startIdx, i);
            if (startIdx === 0 && isEmpty(cell)) {
                offset = i + 1;
            }
            else {
                cells.push(cell);
            }
            startIdx = i + 1;
        }
    }
    if (startIdx < content.length) {
        var cell = content.substring(startIdx, content.length);
        if (!isEmpty(cell)) {
            cells.push(cell);
        }
    }
    return [offset, cells];
}
function generateTableCells(cellType, contents, lineNum, chPos) {
    var cells = [];
    for (var _i = 0, contents_1 = contents; _i < contents_1.length; _i++) {
        var content = contents_1[_i];
        var preSpaces = content.match(/^[ \t]+/);
        var paddingLeft = preSpaces ? preSpaces[0].length : 0;
        var paddingRight = void 0, trimmed = void 0;
        if (paddingLeft === content.length) {
            paddingLeft = 0;
            paddingRight = 0;
            trimmed = '';
        }
        else {
            var postSpaces = content.match(/[ \t]+$/);
            paddingRight = postSpaces ? postSpaces[0].length : 0;
            trimmed = content.slice(paddingLeft, content.length - paddingRight);
        }
        var chPosStart = chPos + paddingLeft;
        var tableCell = createNode(cellType, [
            [lineNum, chPos],
            [lineNum, chPos + content.length - 1],
        ]);
        tableCell.stringContent = trimmed.replace(/\\\|/g, '|'); // replace esacped pipe(\|)
        tableCell.startIdx = cells.length;
        tableCell.endIdx = cells.length;
        tableCell.lineOffsets = [chPosStart - 1];
        tableCell.paddingLeft = paddingLeft;
        tableCell.paddingRight = paddingRight;
        cells.push(tableCell);
        chPos += content.length + 1;
    }
    return cells;
}
function getColumnFromDelimCell(cellNode) {
    var align = null;
    var content = cellNode.stringContent;
    var firstCh = content[0];
    var lastCh = content[content.length - 1];
    if (lastCh === ':') {
        align = firstCh === ':' ? 'center' : 'right';
    }
    else if (firstCh === ':') {
        align = 'left';
    }
    return { align: align };
}
var tableHead = function (parser, container) {
    var stringContent = container.stringContent;
    if (container.type === 'paragraph' && !parser.indented && !parser.blank) {
        var lastNewLineIdx = stringContent.length - 1;
        var lastLineStartIdx = stringContent.lastIndexOf('\n', lastNewLineIdx - 1) + 1;
        var headerContent = stringContent.slice(lastLineStartIdx, lastNewLineIdx);
        var delimContent = parser.currentLine.slice(parser.nextNonspace);
        var _a = parseRowContent(headerContent), headerOffset = _a[0], headerCells = _a[1];
        var _b = parseRowContent(delimContent), delimOffset = _b[0], delimCells = _b[1];
        var reValidDelimCell_1 = /^[ \t]*:?-+:?[ \t]*$/;
        if (
        // not checking if the number of header cells and delimiter cells are the same
        // to consider the case of merged-column (via plugin)
        !headerCells.length ||
            !delimCells.length ||
            delimCells.some(function (cell) { return !reValidDelimCell_1.test(cell); }) ||
            // to prevent to regard setTextHeading as tabel delim cell with 'disallowDeepHeading' option
            (delimCells.length === 1 && delimContent.indexOf('|') !== 0)) {
            return 0 /* None */;
        }
        var lineOffsets = container.lineOffsets;
        var firstLineNum = parser.lineNumber - 1;
        var firstLineStart = last(lineOffsets) + 1;
        var table = createNode('table', [
            [firstLineNum, firstLineStart],
            [parser.lineNumber, parser.offset],
        ]);
        // eslint-disable-next-line arrow-body-style
        table.columns = delimCells.map(function () { return ({ align: null }); });
        container.insertAfter(table);
        if (lineOffsets.length === 1) {
            container.unlink();
        }
        else {
            container.stringContent = stringContent.slice(0, lastLineStartIdx);
            var paraLastLineStartIdx = stringContent.lastIndexOf('\n', lastLineStartIdx - 2) + 1;
            var paraLastLineLen = lastLineStartIdx - paraLastLineStartIdx - 1;
            parser.lastLineLength = lineOffsets[lineOffsets.length - 2] + paraLastLineLen;
            parser.finalize(container, firstLineNum - 1);
        }
        parser.advanceOffset(parser.currentLine.length - parser.offset, false);
        var tableHead_1 = createNode('tableHead', [
            [firstLineNum, firstLineStart],
            [parser.lineNumber, parser.offset],
        ]);
        table.appendChild(tableHead_1);
        var tableHeadRow_1 = createNode('tableRow', [
            [firstLineNum, firstLineStart],
            [firstLineNum, firstLineStart + headerContent.length - 1],
        ]);
        var tableDelimRow_1 = createNode('tableDelimRow', [
            [parser.lineNumber, parser.nextNonspace + 1],
            [parser.lineNumber, parser.offset],
        ]);
        tableHead_1.appendChild(tableHeadRow_1);
        tableHead_1.appendChild(tableDelimRow_1);
        generateTableCells('tableCell', headerCells, firstLineNum, firstLineStart + headerOffset).forEach(function (cellNode) {
            tableHeadRow_1.appendChild(cellNode);
        });
        var delimCellNodes = generateTableCells('tableDelimCell', delimCells, parser.lineNumber, parser.nextNonspace + 1 + delimOffset);
        delimCellNodes.forEach(function (cellNode) {
            tableDelimRow_1.appendChild(cellNode);
        });
        table.columns = delimCellNodes.map(getColumnFromDelimCell);
        parser.tip = table;
        return 2 /* Leaf */;
    }
    return 0 /* None */;
};
var tableBody = function (parser, container) {
    if ((container.type !== 'table' && container.type !== 'tableBody') ||
        (!parser.blank && parser.currentLine.indexOf('|') === -1)) {
        return 0 /* None */;
    }
    parser.advanceOffset(parser.currentLine.length - parser.offset, false);
    if (parser.blank) {
        var table_1 = container;
        if (container.type === 'tableBody') {
            table_1 = container.parent;
            parser.finalize(container, parser.lineNumber - 1);
        }
        parser.finalize(table_1, parser.lineNumber - 1);
        return 0 /* None */;
    }
    var tableBody = container;
    if (container.type === 'table') {
        tableBody = parser.addChild('tableBody', parser.nextNonspace);
        tableBody.stringContent = null;
    }
    var tableRow = createNode('tableRow', [
        [parser.lineNumber, parser.nextNonspace + 1],
        [parser.lineNumber, parser.currentLine.length],
    ]);
    tableBody.appendChild(tableRow);
    var table = tableBody.parent;
    var content = parser.currentLine.slice(parser.nextNonspace);
    var _a = parseRowContent(content), offset = _a[0], cellContents = _a[1];
    generateTableCells('tableCell', cellContents, parser.lineNumber, parser.nextNonspace + 1 + offset).forEach(function (cellNode, idx) {
        if (idx >= table.columns.length) {
            cellNode.ignored = true;
        }
        tableRow.appendChild(cellNode);
    });
    return 2 /* Leaf */;
};
var reCustomBlock = /^(\$\$)(\s*[a-zA-Z])+/;
var reCanBeCustomInline = /^(\$\$)(\s*[a-zA-Z])+.*(\$\$)/;
var customBlock = function (parser) {
    var match;
    if (!parser.indented &&
        !reCanBeCustomInline.test(parser.currentLine) &&
        (match = parser.currentLine.match(reCustomBlock))) {
        var syntaxLength = match[1].length;
        parser.closeUnmatchedBlocks();
        var container = parser.addChild('customBlock', parser.nextNonspace);
        container.syntaxLength = syntaxLength;
        container.offset = parser.indent;
        parser.advanceNextNonspace();
        parser.advanceOffset(syntaxLength, false);
        return 2 /* Leaf */;
    }
    return 0 /* None */;
};
var reCodeFence = /^`{3,}(?!.*`)|^~{3,}/;
var reHtmlBlockOpen = [
    /./,
    /^<(?:script|pre|style)(?:\s|>|$)/i,
    /^<!--/,
    /^<[?]/,
    /^<![A-Z]/,
    /^<!\[CDATA\[/,
    /^<[/]?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[123456]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:\s|[/]?[>]|$)/i,
    new RegExp("^(?:" + OPENTAG + "|" + CLOSETAG + ")\\s*$", 'i'),
];
var reSetextHeadingLine = /^(?:=+|-+)[ \t]*$/;
var reATXHeadingMarker = /^#{1,6}(?:[ \t]+|$)/;
var reThematicBreak = /^(?:(?:\*[ \t]*){3,}|(?:_[ \t]*){3,}|(?:-[ \t]*){3,})[ \t]*$/;
var reBulletListMarker = /^[*+-]/;
var reOrderedListMarker = /^(\d{1,9})([.)])/;
// Parse a list marker and return data on the marker (type,
// start, delimiter, bullet character, padding) or null.
function parseListMarker(parser, container) {
    var rest = parser.currentLine.slice(parser.nextNonspace);
    var match;
    var nextc;
    var data = {
        type: 'bullet',
        tight: true,
        bulletChar: '',
        start: 0,
        delimiter: '',
        padding: 0,
        markerOffset: parser.indent,
        // GFM: Task List Item
        task: false,
        checked: false,
    };
    if (parser.indent >= 4) {
        return null;
    }
    if ((match = rest.match(reBulletListMarker))) {
        data.type = 'bullet';
        data.bulletChar = match[0][0];
    }
    else if ((match = rest.match(reOrderedListMarker)) &&
        (container.type !== 'paragraph' || match[1] === '1')) {
        data.type = 'ordered';
        data.start = parseInt(match[1], 10);
        data.delimiter = match[2];
    }
    else {
        return null;
    }
    // make sure we have spaces after
    nextc = peek(parser.currentLine, parser.nextNonspace + match[0].length);
    if (!(nextc === -1 || nextc === C_TAB || nextc === C_SPACE)) {
        return null;
    }
    // if it interrupts paragraph, make sure first line isn't blank
    if (container.type === 'paragraph' &&
        !parser.currentLine.slice(parser.nextNonspace + match[0].length).match(reNonSpace)) {
        return null;
    }
    // we've got a match! advance offset and calculate padding
    parser.advanceNextNonspace(); // to start of marker
    parser.advanceOffset(match[0].length, true); // to end of marker
    var spacesStartCol = parser.column;
    var spacesStartOffset = parser.offset;
    do {
        parser.advanceOffset(1, true);
        nextc = peek(parser.currentLine, parser.offset);
    } while (parser.column - spacesStartCol < 5 && isSpaceOrTab(nextc));
    var blankItem = peek(parser.currentLine, parser.offset) === -1;
    var spacesAfterMarker = parser.column - spacesStartCol;
    if (spacesAfterMarker >= 5 || spacesAfterMarker < 1 || blankItem) {
        data.padding = match[0].length + 1;
        parser.column = spacesStartCol;
        parser.offset = spacesStartOffset;
        if (isSpaceOrTab(peek(parser.currentLine, parser.offset))) {
            parser.advanceOffset(1, true);
        }
    }
    else {
        data.padding = match[0].length + spacesAfterMarker;
    }
    return data;
}
// Returns true if the two list items are of the same type,
// with the same delimiter and bullet character.  This is used
// in agglomerating list items into lists.
function listsMatch(listData, itemData) {
    return (listData.type === itemData.type &&
        listData.delimiter === itemData.delimiter &&
        listData.bulletChar === itemData.bulletChar);
}
function isDisallowedDeepHeading(parser, node) {
    return parser.options.disallowDeepHeading && (node.type === 'blockQuote' || node.type === 'item');
}
var blockQuote = function (parser) {
    if (!parser.indented && peek(parser.currentLine, parser.nextNonspace) === C_GREATERTHAN) {
        parser.advanceNextNonspace();
        parser.advanceOffset(1, false);
        // optional following space
        if (isSpaceOrTab(peek(parser.currentLine, parser.offset))) {
            parser.advanceOffset(1, true);
        }
        parser.closeUnmatchedBlocks();
        parser.addChild('blockQuote', parser.nextNonspace);
        return 1 /* Container */;
    }
    return 0 /* None */;
};
var atxHeading = function (parser, container) {
    var match;
    if (!parser.indented &&
        // The nested Heading is disallowed in list and blockquote with 'disallowDeepHeading' option
        !isDisallowedDeepHeading(parser, container) &&
        (match = parser.currentLine.slice(parser.nextNonspace).match(reATXHeadingMarker))) {
        parser.advanceNextNonspace();
        parser.advanceOffset(match[0].length, false);
        parser.closeUnmatchedBlocks();
        var heading = parser.addChild('heading', parser.nextNonspace);
        heading.level = match[0].trim().length; // number of #s
        heading.headingType = 'atx';
        // remove trailing ###s:
        heading.stringContent = parser.currentLine
            .slice(parser.offset)
            .replace(/^[ \t]*#+[ \t]*$/, '')
            .replace(/[ \t]+#+[ \t]*$/, '');
        parser.advanceOffset(parser.currentLine.length - parser.offset);
        return 2 /* Leaf */;
    }
    return 0 /* None */;
};
var fencedCodeBlock = function (parser) {
    var match;
    if (!parser.indented &&
        (match = parser.currentLine.slice(parser.nextNonspace).match(reCodeFence))) {
        var fenceLength = match[0].length;
        parser.closeUnmatchedBlocks();
        var container = parser.addChild('codeBlock', parser.nextNonspace);
        container.isFenced = true;
        container.fenceLength = fenceLength;
        container.fenceChar = match[0][0];
        container.fenceOffset = parser.indent;
        parser.advanceNextNonspace();
        parser.advanceOffset(fenceLength, false);
        return 2 /* Leaf */;
    }
    return 0 /* None */;
};
var htmlBlock = function (parser, container) {
    if (!parser.indented && peek(parser.currentLine, parser.nextNonspace) === C_LESSTHAN) {
        var s = parser.currentLine.slice(parser.nextNonspace);
        var disallowedTags = parser.options.disallowedHtmlBlockTags;
        var blockType = void 0;
        for (blockType = 1; blockType <= 7; blockType++) {
            var matched = s.match(reHtmlBlockOpen[blockType]);
            if (matched) {
                if (blockType === 7) {
                    if (container.type === 'paragraph') {
                        return 0 /* None */;
                    }
                    if (disallowedTags.length > 0) {
                        var reDisallowedTags = new RegExp("</?(?:" + disallowedTags.join('|') + ")", 'i');
                        if (reDisallowedTags.test(matched[0])) {
                            return 0 /* None */;
                        }
                    }
                }
                parser.closeUnmatchedBlocks();
                // We don't adjust parser.offset;
                // spaces are part of the HTML block:
                var b = parser.addChild('htmlBlock', parser.offset);
                b.htmlBlockType = blockType;
                return 2 /* Leaf */;
            }
        }
    }
    return 0 /* None */;
};
var seTextHeading = function (parser, container) {
    var match;
    if (container.stringContent !== null &&
        !parser.indented &&
        container.type === 'paragraph' &&
        // The nested Heading is disallowed in list and blockquote with 'disallowDeepHeading' option
        !isDisallowedDeepHeading(parser, container.parent) &&
        (match = parser.currentLine.slice(parser.nextNonspace).match(reSetextHeadingLine))) {
        parser.closeUnmatchedBlocks();
        // resolve reference link definitions
        var pos = void 0;
        while (peek(container.stringContent, 0) === C_OPEN_BRACKET &&
            (pos = parser.inlineParser.parseReference(container, parser.refMap))) {
            container.stringContent = container.stringContent.slice(pos);
        }
        if (container.stringContent.length > 0) {
            var heading = createNode('heading', container.sourcepos);
            heading.level = match[0][0] === '=' ? 1 : 2;
            heading.headingType = 'setext';
            heading.stringContent = container.stringContent;
            container.insertAfter(heading);
            container.unlink();
            parser.tip = heading;
            parser.advanceOffset(parser.currentLine.length - parser.offset, false);
            return 2 /* Leaf */;
        }
        return 0 /* None */;
    }
    return 0 /* None */;
};
var thematicBreak = function (parser) {
    if (!parser.indented && reThematicBreak.test(parser.currentLine.slice(parser.nextNonspace))) {
        parser.closeUnmatchedBlocks();
        parser.addChild('thematicBreak', parser.nextNonspace);
        parser.advanceOffset(parser.currentLine.length - parser.offset, false);
        return 2 /* Leaf */;
    }
    return 0 /* None */;
};
var listItem = function (parser, container) {
    var data;
    var currNode = container;
    if ((!parser.indented || container.type === 'list') &&
        (data = parseListMarker(parser, currNode))) {
        parser.closeUnmatchedBlocks();
        // add the list if needed
        if (parser.tip.type !== 'list' || !listsMatch(currNode.listData, data)) {
            currNode = parser.addChild('list', parser.nextNonspace);
            currNode.listData = data;
        }
        // add the list item
        currNode = parser.addChild('item', parser.nextNonspace);
        currNode.listData = data;
        return 1 /* Container */;
    }
    return 0 /* None */;
};
// indented code block
var indentedCodeBlock = function (parser) {
    if (parser.indented && parser.tip.type !== 'paragraph' && !parser.blank) {
        // indented code
        parser.advanceOffset(CODE_INDENT, true);
        parser.closeUnmatchedBlocks();
        parser.addChild('codeBlock', parser.offset);
        return 2 /* Leaf */;
    }
    return 0 /* None */;
};
var blockStarts = [
    blockQuote,
    atxHeading,
    fencedCodeBlock,
    htmlBlock,
    seTextHeading,
    thematicBreak,
    listItem,
    indentedCodeBlock,
    tableHead,
    tableBody,
    customBlock,
];
// `---` for YAML, `+++` for TOML, `;;;` for JSON
var reFrontMatter = /^(-{3}|\+{3}|;{3})$/;
var frontMatter$1 = function (parser, container) {
    var currentLine = parser.currentLine, lineNumber = parser.lineNumber, indented = parser.indented;
    if (lineNumber === 1 &&
        !indented &&
        container.type === 'document' &&
        reFrontMatter.test(currentLine)) {
        parser.closeUnmatchedBlocks();
        var frontMatter_1 = parser.addChild('frontMatter', parser.nextNonspace);
        frontMatter_1.stringContent = currentLine;
        parser.advanceNextNonspace();
        parser.advanceOffset(currentLine.length, false);
        return 2 /* Leaf */;
    }
    return 0 /* None */;
};
var frontMatter = {
    continue: function (parser, container) {
        var line = parser.currentLine;
        var match = line.match(reFrontMatter);
        if (container.type === 'frontMatter' && match) {
            container.stringContent += line;
            parser.lastLineLength = match[0].length;
            parser.finalize(container, parser.lineNumber);
            return 2 /* Finished */;
        }
        return 0 /* Go */;
    },
    finalize: function (_, block) {
        if (block.stringContent === null) {
            return;
        }
        block.literal = block.stringContent;
        block.stringContent = null;
    },
    canContain: function () {
        return false;
    },
    acceptsLines: true,
};
var reHtmlBlockClose = [
    /./,
    /<\/(?:script|pre|style)>/i,
    /-->/,
    /\?>/,
    />/,
    /\]\]>/,
];
var reMaybeSpecial = /^[#`~*+_=<>0-9-;$]/;
var reLineEnding$1 = /\r\n|\n|\r/;
function esm_document() {
    return createNode('document', [
        [1, 1],
        [0, 0],
    ]);
}
var defaultOptions$1 = {
    smart: false,
    tagFilter: false,
    extendedAutolinks: false,
    disallowedHtmlBlockTags: [],
    referenceDefinition: false,
    disallowDeepHeading: false,
    customParser: null,
    frontMatter: false,
};
var Parser = /** @class */ (function () {
    function Parser(options) {
        this.options = esm_assign(esm_assign({}, defaultOptions$1), options);
        this.doc = esm_document();
        this.tip = this.doc;
        this.oldtip = this.doc;
        this.lineNumber = 0;
        this.offset = 0;
        this.column = 0;
        this.nextNonspace = 0;
        this.nextNonspaceColumn = 0;
        this.indent = 0;
        this.currentLine = '';
        this.indented = false;
        this.blank = false;
        this.partiallyConsumedTab = false;
        this.allClosed = true;
        this.lastMatchedContainer = this.doc;
        this.refMap = {};
        this.refLinkCandidateMap = {};
        this.refDefCandidateMap = {};
        this.lastLineLength = 0;
        this.lines = [];
        if (this.options.frontMatter) {
            blockHandlers.frontMatter = frontMatter;
            blockStarts.unshift(frontMatter$1);
        }
        this.inlineParser = new InlineParser(this.options);
    }
    Parser.prototype.advanceOffset = function (count, columns) {
        if (columns === void 0) {
            columns = false;
        }
        var currentLine = this.currentLine;
        var charsToTab, charsToAdvance;
        var c;
        while (count > 0 && (c = currentLine[this.offset])) {
            if (c === '\t') {
                charsToTab = 4 - (this.column % 4);
                if (columns) {
                    this.partiallyConsumedTab = charsToTab > count;
                    charsToAdvance = charsToTab > count ? count : charsToTab;
                    this.column += charsToAdvance;
                    this.offset += this.partiallyConsumedTab ? 0 : 1;
                    count -= charsToAdvance;
                }
                else {
                    this.partiallyConsumedTab = false;
                    this.column += charsToTab;
                    this.offset += 1;
                    count -= 1;
                }
            }
            else {
                this.partiallyConsumedTab = false;
                this.offset += 1;
                this.column += 1; // assume ascii; block starts are ascii
                count -= 1;
            }
        }
    };
    Parser.prototype.advanceNextNonspace = function () {
        this.offset = this.nextNonspace;
        this.column = this.nextNonspaceColumn;
        this.partiallyConsumedTab = false;
    };
    Parser.prototype.findNextNonspace = function () {
        var currentLine = this.currentLine;
        var i = this.offset;
        var cols = this.column;
        var c;
        while ((c = currentLine.charAt(i)) !== '') {
            if (c === ' ') {
                i++;
                cols++;
            }
            else if (c === '\t') {
                i++;
                cols += 4 - (cols % 4);
            }
            else {
                break;
            }
        }
        this.blank = c === '\n' || c === '\r' || c === '';
        this.nextNonspace = i;
        this.nextNonspaceColumn = cols;
        this.indent = this.nextNonspaceColumn - this.column;
        this.indented = this.indent >= CODE_INDENT;
    };
    // Add a line to the block at the tip.  We assume the tip
    // can accept lines -- that check should be done before calling this.
    Parser.prototype.addLine = function () {
        if (this.partiallyConsumedTab) {
            this.offset += 1; // skip over tab
            // add space characters:
            var charsToTab = 4 - (this.column % 4);
            this.tip.stringContent += repeat(' ', charsToTab);
        }
        if (this.tip.lineOffsets) {
            this.tip.lineOffsets.push(this.offset);
        }
        else {
            this.tip.lineOffsets = [this.offset];
        }
        this.tip.stringContent += this.currentLine.slice(this.offset) + "\n";
    };
    // Add block of type tag as a child of the tip.  If the tip can't
    // accept children, close and finalize it and try its parent,
    // and so on til we find a block that can accept children.
    Parser.prototype.addChild = function (tag, offset) {
        while (!blockHandlers[this.tip.type].canContain(tag)) {
            this.finalize(this.tip, this.lineNumber - 1);
        }
        var columnNumber = offset + 1; // offset 0 = column 1
        var newBlock = createNode(tag, [
            [this.lineNumber, columnNumber],
            [0, 0],
        ]);
        newBlock.stringContent = '';
        this.tip.appendChild(newBlock);
        this.tip = newBlock;
        return newBlock;
    };
    // Finalize and close any unmatched blocks.
    Parser.prototype.closeUnmatchedBlocks = function () {
        if (!this.allClosed) {
            // finalize any blocks not matched
            while (this.oldtip !== this.lastMatchedContainer) {
                var parent_1 = this.oldtip.parent;
                this.finalize(this.oldtip, this.lineNumber - 1);
                this.oldtip = parent_1;
            }
            this.allClosed = true;
        }
    };
    // Finalize a block.  Close it and do any necessary postprocessing,
    // e.g. creating stringContent from strings, setting the 'tight'
    // or 'loose' status of a list, and parsing the beginnings
    // of paragraphs for reference definitions.  Reset the tip to the
    // parent of the closed block.
    Parser.prototype.finalize = function (block, lineNumber) {
        var above = block.parent;
        block.open = false;
        block.sourcepos[1] = [lineNumber, this.lastLineLength];
        blockHandlers[block.type].finalize(this, block);
        this.tip = above;
    };
    // Walk through a block & children recursively, parsing string content
    // into inline content where appropriate.
    Parser.prototype.processInlines = function (block) {
        var event;
        var customParser = this.options.customParser;
        var walker = block.walker();
        this.inlineParser.refMap = this.refMap;
        this.inlineParser.refLinkCandidateMap = this.refLinkCandidateMap;
        this.inlineParser.refDefCandidateMap = this.refDefCandidateMap;
        this.inlineParser.options = this.options;
        while ((event = walker.next())) {
            var node = event.node, entering = event.entering;
            var t = node.type;
            if (customParser && customParser[t]) {
                customParser[t](node, { entering: entering, options: this.options });
            }
            if (!entering &&
                (t === 'paragraph' ||
                    t === 'heading' ||
                    (t === 'tableCell' && !node.ignored))) {
                this.inlineParser.parse(node);
            }
        }
    };
    // Analyze a line of text and update the document appropriately.
    // We parse markdown text by calling this on each line of input,
    // then finalizing the document.
    Parser.prototype.incorporateLine = function (ln) {
        var container = this.doc;
        this.oldtip = this.tip;
        this.offset = 0;
        this.column = 0;
        this.blank = false;
        this.partiallyConsumedTab = false;
        this.lineNumber += 1;
        // replace NUL characters for security
        if (ln.indexOf('\u0000') !== -1) {
            ln = ln.replace(/\0/g, '\uFFFD');
        }
        this.currentLine = ln;
        // For each containing block, try to parse the associated line start.
        // Bail out on failure: container will point to the last matching block.
        // Set allMatched to false if not all containers match.
        var allMatched = true;
        var lastChild;
        while ((lastChild = container.lastChild) && lastChild.open) {
            container = lastChild;
            this.findNextNonspace();
            switch (blockHandlers[container.type]['continue'](this, container)) {
                case 0 /* Go */: // we've matched, keep going
                    break;
                case 1 /* Stop */: // we've failed to match a block
                    allMatched = false;
                    break;
                case 2 /* Finished */: // we've hit end of line for fenced code close and can return
                    this.lastLineLength = ln.length;
                    return;
                default:
                    throw new Error('continue returned illegal value, must be 0, 1, or 2');
            }
            if (!allMatched) {
                container = container.parent; // back up to last matching block
                break;
            }
        }
        this.allClosed = container === this.oldtip;
        this.lastMatchedContainer = container;
        var matchedLeaf = container.type !== 'paragraph' && blockHandlers[container.type].acceptsLines;
        var blockStartsLen = blockStarts.length;
        // Unless last matched container is a code block, try new container starts,
        // adding children to the last matched container:
        while (!matchedLeaf) {
            this.findNextNonspace();
            // this is a little performance optimization:
            if (container.type !== 'table' &&
                container.type !== 'tableBody' &&
                container.type !== 'paragraph' &&
                !this.indented &&
                !reMaybeSpecial.test(ln.slice(this.nextNonspace))) {
                this.advanceNextNonspace();
                break;
            }
            var i = 0;
            while (i < blockStartsLen) {
                var res = blockStarts[i](this, container);
                if (res === 1 /* Container */) {
                    container = this.tip;
                    break;
                }
                else if (res === 2 /* Leaf */) {
                    container = this.tip;
                    matchedLeaf = true;
                    break;
                }
                else {
                    i++;
                }
            }
            if (i === blockStartsLen) {
                // nothing matched
                this.advanceNextNonspace();
                break;
            }
        }
        // What remains at the offset is a text line.  Add the text to the
        // appropriate container.
        // First check for a lazy paragraph continuation:
        if (!this.allClosed && !this.blank && this.tip.type === 'paragraph') {
            // lazy paragraph continuation
            this.addLine();
        }
        else {
            // not a lazy continuation
            // finalize any blocks not matched
            this.closeUnmatchedBlocks();
            if (this.blank && container.lastChild) {
                container.lastChild.lastLineBlank = true;
            }
            var t = container.type;
            // Block quote lines are never blank as they start with >
            // and we don't count blanks in fenced code for purposes of tight/loose
            // lists or breaking out of lists. We also don't set _lastLineBlank
            // on an empty list item, or if we just closed a fenced block.
            var lastLineBlank = this.blank &&
                !(t === 'blockQuote' ||
                    (isCodeBlock(container) && container.isFenced) ||
                    (t === 'item' && !container.firstChild && container.sourcepos[0][0] === this.lineNumber));
            // propagate lastLineBlank up through parents:
            var cont = container;
            while (cont) {
                cont.lastLineBlank = lastLineBlank;
                cont = cont.parent;
            }
            if (blockHandlers[t].acceptsLines) {
                this.addLine();
                // if HtmlBlock, check for end condition
                if (isHtmlBlock(container) &&
                    container.htmlBlockType >= 1 &&
                    container.htmlBlockType <= 5 &&
                    reHtmlBlockClose[container.htmlBlockType].test(this.currentLine.slice(this.offset))) {
                    this.lastLineLength = ln.length;
                    this.finalize(container, this.lineNumber);
                }
            }
            else if (this.offset < ln.length && !this.blank) {
                // create paragraph container for line
                container = this.addChild('paragraph', this.offset);
                this.advanceNextNonspace();
                this.addLine();
            }
        }
        this.lastLineLength = ln.length;
    };
    // The main parsing function.  Returns a parsed document AST.
    Parser.prototype.parse = function (input, lineTexts) {
        this.doc = esm_document();
        this.tip = this.doc;
        this.lineNumber = 0;
        this.lastLineLength = 0;
        this.offset = 0;
        this.column = 0;
        this.lastMatchedContainer = this.doc;
        this.currentLine = '';
        var lines = input.split(reLineEnding$1);
        var len = lines.length;
        this.lines = lineTexts ? lineTexts : lines;
        if (this.options.referenceDefinition) {
            this.clearRefMaps();
        }
        if (input.charCodeAt(input.length - 1) === C_NEWLINE) {
            // ignore last blank line created by final newline
            len -= 1;
        }
        for (var i = 0; i < len; i++) {
            this.incorporateLine(lines[i]);
        }
        while (this.tip) {
            this.finalize(this.tip, len);
        }
        this.processInlines(this.doc);
        return this.doc;
    };
    Parser.prototype.partialParseStart = function (lineNumber, lines) {
        this.doc = esm_document();
        this.tip = this.doc;
        this.lineNumber = lineNumber - 1;
        this.lastLineLength = 0;
        this.offset = 0;
        this.column = 0;
        this.lastMatchedContainer = this.doc;
        this.currentLine = '';
        var len = lines.length;
        for (var i = 0; i < len; i++) {
            this.incorporateLine(lines[i]);
        }
        return this.doc;
    };
    Parser.prototype.partialParseExtends = function (lines) {
        for (var i = 0; i < lines.length; i++) {
            this.incorporateLine(lines[i]);
        }
    };
    Parser.prototype.partialParseFinish = function () {
        while (this.tip) {
            this.finalize(this.tip, this.lineNumber);
        }
        this.processInlines(this.doc);
    };
    Parser.prototype.setRefMaps = function (refMap, refLinkCandidateMap, refDefCandidateMap) {
        this.refMap = refMap;
        this.refLinkCandidateMap = refLinkCandidateMap;
        this.refDefCandidateMap = refDefCandidateMap;
    };
    Parser.prototype.clearRefMaps = function () {
        [this.refMap, this.refLinkCandidateMap, this.refDefCandidateMap].forEach(function (map) {
            clearObj(map);
        });
    };
    return Parser;
}());
function comparePos(p1, p2) {
    if (p1[0] < p2[0]) {
        return 1 /* LT */;
    }
    if (p1[0] > p2[0]) {
        return -1 /* GT */;
    }
    if (p1[1] < p2[1]) {
        return 1 /* LT */;
    }
    if (p1[1] > p2[1]) {
        return -1 /* GT */;
    }
    return 0 /* EQ */;
}
function compareRangeAndPos(_a, pos) {
    var startPos = _a[0], endPos = _a[1];
    if (comparePos(endPos, pos) === 1 /* LT */) {
        return 1 /* LT */;
    }
    if (comparePos(startPos, pos) === -1 /* GT */) {
        return -1 /* GT */;
    }
    return 0 /* EQ */;
}
function removeNextUntil(node, last) {
    if (node.parent !== last.parent || node === last) {
        return;
    }
    var next = node.next;
    while (next && next !== last) {
        var temp = next.next;
        for (var _i = 0, _a = ['parent', 'prev', 'next']; _i < _a.length; _i++) {
            var type = _a[_i];
            if (next[type]) {
                removeNodeById(next[type].id);
                next[type] = null;
            }
        }
        next = temp;
    }
    node.next = last.next;
    if (last.next) {
        last.next.prev = node;
    }
    else {
        node.parent.lastChild = node;
    }
}
function getChildNodes(parent) {
    var nodes = [];
    var curr = parent.firstChild;
    while (curr) {
        nodes.push(curr);
        curr = curr.next;
    }
    return nodes;
}
function insertNodesBefore(target, nodes) {
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var node = nodes_1[_i];
        target.insertBefore(node);
    }
}
function prependChildNodes(parent, nodes) {
    for (var i = nodes.length - 1; i >= 0; i -= 1) {
        parent.prependChild(nodes[i]);
    }
}
function updateNextLineNumbers(base, diff) {
    if (!base || !base.parent || diff === 0) {
        return;
    }
    var walker = base.parent.walker();
    walker.resumeAt(base, true);
    var event;
    while ((event = walker.next())) {
        var node = event.node, entering = event.entering;
        if (entering) {
            node.sourcepos[0][0] += diff;
            node.sourcepos[1][0] += diff;
        }
    }
}
function compareRangeAndLine(_a, line) {
    var startPos = _a[0], endPos = _a[1];
    if (endPos[0] < line) {
        return 1 /* LT */;
    }
    if (startPos[0] > line) {
        return -1 /* GT */;
    }
    return 0 /* EQ */;
}
function findChildNodeAtLine(parent, line) {
    var node = parent.firstChild;
    while (node) {
        var comp = compareRangeAndLine(node.sourcepos, line);
        if (comp === 0 /* EQ */) {
            return node;
        }
        if (comp === -1 /* GT */) {
            // To consider that top line is blank line
            return node.prev || node;
        }
        node = node.next;
    }
    return parent.lastChild;
}
function lastLeafNode(node) {
    while (node.lastChild) {
        node = node.lastChild;
    }
    return node;
}
function sameLineTopAncestor(node) {
    while (node.parent &&
        node.parent.type !== 'document' &&
        node.parent.sourcepos[0][0] === node.sourcepos[0][0]) {
        node = node.parent;
    }
    return node;
}
function findFirstNodeAtLine(parent, line) {
    var node = parent.firstChild;
    var prev = null;
    while (node) {
        var comp = compareRangeAndLine(node.sourcepos, line);
        if (comp === 0 /* EQ */) {
            if (node.sourcepos[0][0] === line || !node.firstChild) {
                return node;
            }
            prev = node;
            node = node.firstChild;
        }
        else if (comp === -1 /* GT */) {
            break;
        }
        else {
            prev = node;
            node = node.next;
        }
    }
    if (prev) {
        return sameLineTopAncestor(lastLeafNode(prev));
    }
    return null;
}
function findNodeAtPosition(parent, pos) {
    var node = parent;
    var prev = null;
    while (node) {
        var comp = compareRangeAndPos(node.sourcepos, pos);
        if (comp === 0 /* EQ */) {
            if (node.firstChild) {
                prev = node;
                node = node.firstChild;
            }
            else {
                return node;
            }
        }
        else if (comp === -1 /* GT */) {
            return prev;
        }
        else if (node.next) {
            node = node.next;
        }
        else {
            return prev;
        }
    }
    return node;
}
function findNodeById(id) {
    return getNodeById(id) || null;
}
function invokeNextUntil(callback, start, end) {
    if (end === void 0) {
        end = null;
    }
    if (start) {
        var walker = start.walker();
        while (start && start !== end) {
            callback(start);
            var next = walker.next();
            if (next) {
                start = next.node;
            }
            else {
                break;
            }
        }
    }
}
function isUnlinked(id) {
    var node = findNodeById(id);
    if (!node) {
        return true;
    }
    while (node && node.type !== 'document') {
        // eslint-disable-next-line no-loop-func
        if (!node.parent && !node.prev && !node.next) {
            return true;
        }
        node = node.parent;
    }
    return false;
}
var reLineEnding = /\r\n|\n|\r/;
function canBeContinuedListItem(lineText) {
    var spaceMatch = lineText.match(/^[ \t]+/);
    if (spaceMatch && (spaceMatch[0].length >= 2 || /\t/.test(spaceMatch[0]))) {
        return true;
    }
    var leftTrimmed = spaceMatch ? lineText.slice(spaceMatch.length) : lineText;
    return reBulletListMarker.test(leftTrimmed) || reOrderedListMarker.test(leftTrimmed);
}
function canBeContinuedTableBody(lineText) {
    return !isBlank(lineText) && lineText.indexOf('|') !== -1;
}
function createRefDefState(node) {
    var id = node.id, title = node.title, sourcepos = node.sourcepos, dest = node.dest;
    return {
        id: id,
        title: title,
        sourcepos: sourcepos,
        unlinked: false,
        destination: dest,
    };
}
var ToastMark = /** @class */ (function () {
    function ToastMark(contents, options) {
        this.refMap = {};
        this.refLinkCandidateMap = {};
        this.refDefCandidateMap = {};
        this.referenceDefinition = !!(options === null || options === void 0 ? void 0 : options.referenceDefinition);
        this.parser = new Parser(options);
        this.parser.setRefMaps(this.refMap, this.refLinkCandidateMap, this.refDefCandidateMap);
        this.eventHandlerMap = { change: [] };
        contents = contents || '';
        this.lineTexts = contents.split(reLineEnding);
        this.root = this.parser.parse(contents, this.lineTexts);
    }
    ToastMark.prototype.updateLineTexts = function (startPos, endPos, newText) {
        var _a;
        var startLine = startPos[0], startCol = startPos[1];
        var endLine = endPos[0], endCol = endPos[1];
        var newLines = newText.split(reLineEnding);
        var newLineLen = newLines.length;
        var startLineText = this.lineTexts[startLine - 1];
        var endLineText = this.lineTexts[endLine - 1];
        newLines[0] = startLineText.slice(0, startCol - 1) + newLines[0];
        newLines[newLineLen - 1] = newLines[newLineLen - 1] + endLineText.slice(endCol - 1);
        var removedLineLen = endLine - startLine + 1;
        (_a = this.lineTexts).splice.apply(_a, esm_spreadArray([startLine - 1, removedLineLen], newLines));
        return newLineLen - removedLineLen;
    };
    ToastMark.prototype.updateRootNodeState = function () {
        if (this.lineTexts.length === 1 && this.lineTexts[0] === '') {
            this.root.lastLineBlank = true;
            this.root.sourcepos = [
                [1, 1],
                [1, 0],
            ];
            return;
        }
        if (this.root.lastChild) {
            this.root.lastLineBlank = this.root.lastChild.lastLineBlank;
        }
        var lineTexts = this.lineTexts;
        var idx = lineTexts.length - 1;
        while (lineTexts[idx] === '') {
            idx -= 1;
        }
        if (lineTexts.length - 2 > idx) {
            idx += 1;
        }
        this.root.sourcepos[1] = [idx + 1, lineTexts[idx].length];
    };
    ToastMark.prototype.replaceRangeNodes = function (startNode, endNode, newNodes) {
        if (!startNode) {
            if (endNode) {
                insertNodesBefore(endNode, newNodes);
                removeNodeById(endNode.id);
                endNode.unlink();
            }
            else {
                prependChildNodes(this.root, newNodes);
            }
        }
        else {
            insertNodesBefore(startNode, newNodes);
            removeNextUntil(startNode, endNode);
            [startNode.id, endNode.id].forEach(function (id) { return removeNodeById(id); });
            startNode.unlink();
        }
    };
    ToastMark.prototype.getNodeRange = function (startPos, endPos) {
        var startNode = findChildNodeAtLine(this.root, startPos[0]);
        var endNode = findChildNodeAtLine(this.root, endPos[0]);
        // extend node range to include a following block which doesn't have preceding blank line
        if (endNode && endNode.next && endPos[0] + 1 === endNode.next.sourcepos[0][0]) {
            endNode = endNode.next;
        }
        return [startNode, endNode];
    };
    ToastMark.prototype.trigger = function (eventName, param) {
        this.eventHandlerMap[eventName].forEach(function (handler) {
            handler(param);
        });
    };
    ToastMark.prototype.extendEndLine = function (line) {
        while (this.lineTexts[line] === '') {
            line += 1;
        }
        return line;
    };
    ToastMark.prototype.parseRange = function (startNode, endNode, startLine, endLine) {
        // extends starting range if the first node can be a continued list item
        if (startNode &&
            startNode.prev &&
            ((isList(startNode.prev) && canBeContinuedListItem(this.lineTexts[startLine - 1])) ||
                (isTable(startNode.prev) && canBeContinuedTableBody(this.lineTexts[startLine - 1])))) {
            startNode = startNode.prev;
            startLine = startNode.sourcepos[0][0];
        }
        var editedLines = this.lineTexts.slice(startLine - 1, endLine);
        var root = this.parser.partialParseStart(startLine, editedLines);
        // extends ending range if the following node can be a fenced code block or a continued list item
        var nextNode = endNode ? endNode.next : this.root.firstChild;
        var lastChild = root.lastChild;
        var isOpenedLastChildCodeBlock = lastChild && isCodeBlock(lastChild) && lastChild.open;
        var isOpenedLastChildCustomBlock = lastChild && isCustomBlock(lastChild) && lastChild.open;
        var isLastChildList = lastChild && isList(lastChild);
        while (((isOpenedLastChildCodeBlock || isOpenedLastChildCustomBlock) && nextNode) ||
            (isLastChildList && nextNode && (nextNode.type === 'list' || nextNode.sourcepos[0][1] >= 2))) {
            var newEndLine = this.extendEndLine(nextNode.sourcepos[1][0]);
            this.parser.partialParseExtends(this.lineTexts.slice(endLine, newEndLine));
            if (!startNode) {
                startNode = endNode;
            }
            endNode = nextNode;
            endLine = newEndLine;
            nextNode = nextNode.next;
        }
        this.parser.partialParseFinish();
        var newNodes = getChildNodes(root);
        return { newNodes: newNodes, extStartNode: startNode, extEndNode: endNode };
    };
    ToastMark.prototype.getRemovedNodeRange = function (extStartNode, extEndNode) {
        if (!extStartNode ||
            (extStartNode && isRefDef(extStartNode)) ||
            (extEndNode && isRefDef(extEndNode))) {
            return null;
        }
        return {
            id: [extStartNode.id, extEndNode.id],
            line: [extStartNode.sourcepos[0][0] - 1, extEndNode.sourcepos[1][0] - 1],
        };
    };
    ToastMark.prototype.markDeletedRefMap = function (extStartNode, extEndNode) {
        var _this = this;
        if (!isEmptyObj(this.refMap)) {
            var markDeleted = function (node) {
                if (isRefDef(node)) {
                    var refDefState = _this.refMap[node.label];
                    if (refDefState && node.id === refDefState.id) {
                        refDefState.unlinked = true;
                    }
                }
            };
            if (extStartNode) {
                invokeNextUntil(markDeleted, extStartNode.parent, extEndNode);
            }
            if (extEndNode) {
                invokeNextUntil(markDeleted, extEndNode);
            }
        }
    };
    ToastMark.prototype.replaceWithNewRefDefState = function (nodes) {
        var _this = this;
        if (!isEmptyObj(this.refMap)) {
            var replaceWith_1 = function (node) {
                if (isRefDef(node)) {
                    var label = node.label;
                    var refDefState = _this.refMap[label];
                    if (!refDefState || refDefState.unlinked) {
                        _this.refMap[label] = createRefDefState(node);
                    }
                }
            };
            nodes.forEach(function (node) {
                invokeNextUntil(replaceWith_1, node);
            });
        }
    };
    ToastMark.prototype.replaceWithRefDefCandidate = function () {
        var _this = this;
        if (!isEmptyObj(this.refDefCandidateMap)) {
            iterateObject(this.refDefCandidateMap, function (_, candidate) {
                var label = candidate.label, sourcepos = candidate.sourcepos;
                var refDefState = _this.refMap[label];
                if (!refDefState ||
                    refDefState.unlinked ||
                    refDefState.sourcepos[0][0] > sourcepos[0][0]) {
                    _this.refMap[label] = createRefDefState(candidate);
                }
            });
        }
    };
    ToastMark.prototype.getRangeWithRefDef = function (startLine, endLine, startNode, endNode, lineDiff) {
        if (this.referenceDefinition && !isEmptyObj(this.refMap)) {
            var prevNode = findChildNodeAtLine(this.root, startLine - 1);
            var nextNode = findChildNodeAtLine(this.root, endLine + 1);
            if (prevNode && isRefDef(prevNode) && prevNode !== startNode && prevNode !== endNode) {
                startNode = prevNode;
                startLine = startNode.sourcepos[0][0];
            }
            if (nextNode && isRefDef(nextNode) && nextNode !== startNode && nextNode !== endNode) {
                endNode = nextNode;
                endLine = this.extendEndLine(endNode.sourcepos[1][0] + lineDiff);
            }
        }
        return [startNode, endNode, startLine, endLine];
    };
    ToastMark.prototype.parse = function (startPos, endPos, lineDiff) {
        if (lineDiff === void 0) {
            lineDiff = 0;
        }
        var range = this.getNodeRange(startPos, endPos);
        var startNode = range[0], endNode = range[1];
        var startLine = startNode ? Math.min(startNode.sourcepos[0][0], startPos[0]) : startPos[0];
        var endLine = this.extendEndLine((endNode ? Math.max(endNode.sourcepos[1][0], endPos[0]) : endPos[0]) + lineDiff);
        var parseResult = this.parseRange.apply(this, this.getRangeWithRefDef(startLine, endLine, startNode, endNode, lineDiff));
        var newNodes = parseResult.newNodes, extStartNode = parseResult.extStartNode, extEndNode = parseResult.extEndNode;
        var removedNodeRange = this.getRemovedNodeRange(extStartNode, extEndNode);
        var nextNode = extEndNode ? extEndNode.next : this.root.firstChild;
        if (this.referenceDefinition) {
            this.markDeletedRefMap(extStartNode, extEndNode);
            this.replaceRangeNodes(extStartNode, extEndNode, newNodes);
            this.replaceWithNewRefDefState(newNodes);
        }
        else {
            this.replaceRangeNodes(extStartNode, extEndNode, newNodes);
        }
        return { nodes: newNodes, removedNodeRange: removedNodeRange, nextNode: nextNode };
    };
    ToastMark.prototype.parseRefLink = function () {
        var _this = this;
        var result = [];
        if (!isEmptyObj(this.refMap)) {
            iterateObject(this.refMap, function (label, value) {
                if (value.unlinked) {
                    delete _this.refMap[label];
                }
                iterateObject(_this.refLinkCandidateMap, function (_, candidate) {
                    var node = candidate.node, refLabel = candidate.refLabel;
                    if (refLabel === label) {
                        result.push(_this.parse(node.sourcepos[0], node.sourcepos[1]));
                    }
                });
            });
        }
        return result;
    };
    ToastMark.prototype.removeUnlinkedCandidate = function () {
        if (!isEmptyObj(this.refDefCandidateMap)) {
            [this.refLinkCandidateMap, this.refDefCandidateMap].forEach(function (candidateMap) {
                iterateObject(candidateMap, function (id) {
                    if (isUnlinked(id)) {
                        delete candidateMap[id];
                    }
                });
            });
        }
    };
    ToastMark.prototype.editMarkdown = function (startPos, endPos, newText) {
        var lineDiff = this.updateLineTexts(startPos, endPos, newText);
        var parseResult = this.parse(startPos, endPos, lineDiff);
        var editResult = omit(parseResult, 'nextNode');
        updateNextLineNumbers(parseResult.nextNode, lineDiff);
        this.updateRootNodeState();
        var result = [editResult];
        if (this.referenceDefinition) {
            this.removeUnlinkedCandidate();
            this.replaceWithRefDefCandidate();
            result = result.concat(this.parseRefLink());
        }
        this.trigger('change', result);
        return result;
    };
    ToastMark.prototype.getLineTexts = function () {
        return this.lineTexts;
    };
    ToastMark.prototype.getRootNode = function () {
        return this.root;
    };
    ToastMark.prototype.findNodeAtPosition = function (pos) {
        var node = findNodeAtPosition(this.root, pos);
        if (!node || node === this.root) {
            return null;
        }
        return node;
    };
    ToastMark.prototype.findFirstNodeAtLine = function (line) {
        return findFirstNodeAtLine(this.root, line);
    };
    ToastMark.prototype.on = function (eventName, callback) {
        this.eventHandlerMap[eventName].push(callback);
    };
    ToastMark.prototype.off = function (eventName, callback) {
        var handlers = this.eventHandlerMap[eventName];
        var idx = handlers.indexOf(callback);
        handlers.splice(idx, 1);
    };
    ToastMark.prototype.findNodeById = function (id) {
        return findNodeById(id);
    };
    ToastMark.prototype.removeAllNode = function () {
        removeAllNode();
    };
    return ToastMark;
}());
var disallowedTags = [
    'title',
    'textarea',
    'style',
    'xmp',
    'iframe',
    'noembed',
    'noframes',
    'script',
    'plaintext',
];
var reDisallowedTag = new RegExp("<(/?(?:" + disallowedTags.join('|') + ")[^>]*>)", 'ig');
function filterDisallowedTags(str) {
    if (reDisallowedTag.test(str)) {
        return str.replace(reDisallowedTag, function (_, group) { return "&lt;" + group; });
    }
    return str;
}
var baseConvertors = {
    heading: function (node, _a) {
        var entering = _a.entering;
        return {
            type: entering ? 'openTag' : 'closeTag',
            tagName: "h" + node.level,
            outerNewLine: true,
        };
    },
    text: function (node) {
        return {
            type: 'text',
            content: node.literal,
        };
    },
    softbreak: function (_, _a) {
        var options = _a.options;
        return {
            type: 'html',
            content: options.softbreak,
        };
    },
    linebreak: function () {
        return {
            type: 'html',
            content: '<br />\n',
        };
    },
    emph: function (_, _a) {
        var entering = _a.entering;
        return {
            type: entering ? 'openTag' : 'closeTag',
            tagName: 'em',
        };
    },
    strong: function (_, _a) {
        var entering = _a.entering;
        return {
            type: entering ? 'openTag' : 'closeTag',
            tagName: 'strong',
        };
    },
    paragraph: function (node, _a) {
        var _b;
        var entering = _a.entering;
        var grandparent = (_b = node.parent) === null || _b === void 0 ? void 0 : _b.parent;
        if (grandparent && grandparent.type === 'list') {
            if (grandparent.listData.tight) {
                return null;
            }
        }
        return {
            type: entering ? 'openTag' : 'closeTag',
            tagName: 'p',
            outerNewLine: true,
        };
    },
    thematicBreak: function () {
        return {
            type: 'openTag',
            tagName: 'hr',
            outerNewLine: true,
            selfClose: true,
        };
    },
    blockQuote: function (_, _a) {
        var entering = _a.entering;
        return {
            type: entering ? 'openTag' : 'closeTag',
            tagName: 'blockquote',
            outerNewLine: true,
            innerNewLine: true,
        };
    },
    list: function (node, _a) {
        var entering = _a.entering;
        var _b = node.listData, type = _b.type, start = _b.start;
        var tagName = type === 'bullet' ? 'ul' : 'ol';
        var attributes = {};
        if (tagName === 'ol' && start !== null && start !== 1) {
            attributes.start = start.toString();
        }
        return {
            type: entering ? 'openTag' : 'closeTag',
            tagName: tagName,
            attributes: attributes,
            outerNewLine: true,
        };
    },
    item: function (_, _a) {
        var entering = _a.entering;
        return {
            type: entering ? 'openTag' : 'closeTag',
            tagName: 'li',
            outerNewLine: true,
        };
    },
    htmlInline: function (node, _a) {
        var options = _a.options;
        var content = options.tagFilter ? filterDisallowedTags(node.literal) : node.literal;
        return { type: 'html', content: content };
    },
    htmlBlock: function (node, _a) {
        var options = _a.options;
        var content = options.tagFilter ? filterDisallowedTags(node.literal) : node.literal;
        if (options.nodeId) {
            return [
                { type: 'openTag', tagName: 'div', outerNewLine: true },
                { type: 'html', content: content },
                { type: 'closeTag', tagName: 'div', outerNewLine: true },
            ];
        }
        return { type: 'html', content: content, outerNewLine: true };
    },
    code: function (node) {
        return [
            { type: 'openTag', tagName: 'code' },
            { type: 'text', content: node.literal },
            { type: 'closeTag', tagName: 'code' },
        ];
    },
    codeBlock: function (node) {
        var infoStr = node.info;
        var infoWords = infoStr ? infoStr.split(/\s+/) : [];
        var codeClassNames = [];
        if (infoWords.length > 0 && infoWords[0].length > 0) {
            codeClassNames.push("language-" + escapeXml(infoWords[0]));
        }
        return [
            { type: 'openTag', tagName: 'pre', outerNewLine: true },
            { type: 'openTag', tagName: 'code', classNames: codeClassNames },
            { type: 'text', content: node.literal },
            { type: 'closeTag', tagName: 'code' },
            { type: 'closeTag', tagName: 'pre', outerNewLine: true },
        ];
    },
    link: function (node, _a) {
        var entering = _a.entering;
        if (entering) {
            var _b = node, title = _b.title, destination = _b.destination;
            return {
                type: 'openTag',
                tagName: 'a',
                attributes: esm_assign({ href: escapeXml(destination) }, (title && { title: escapeXml(title) })),
            };
        }
        return { type: 'closeTag', tagName: 'a' };
    },
    image: function (node, _a) {
        var getChildrenText = _a.getChildrenText, skipChildren = _a.skipChildren;
        var _b = node, title = _b.title, destination = _b.destination;
        skipChildren();
        return {
            type: 'openTag',
            tagName: 'img',
            selfClose: true,
            attributes: esm_assign({ src: escapeXml(destination), alt: getChildrenText(node) }, (title && { title: escapeXml(title) })),
        };
    },
    customBlock: function (node, context, convertors) {
        var info = node.info.trim().toLowerCase();
        var customConvertor = convertors[info];
        if (customConvertor) {
            try {
                return customConvertor(node, context);
            }
            catch (e) {
                console.warn("[@toast-ui/editor] - The error occurred when " + info + " block node was parsed in markdown renderer: " + e);
            }
        }
        return [
            { type: 'openTag', tagName: 'div', outerNewLine: true },
            { type: 'text', content: node.literal },
            { type: 'closeTag', tagName: 'div', outerNewLine: true },
        ];
    },
    frontMatter: function (node) {
        return [
            {
                type: 'openTag',
                tagName: 'div',
                outerNewLine: true,
                // Because front matter is metadata, it should not be render.
                attributes: { style: 'white-space: pre; display: none;' },
            },
            { type: 'text', content: node.literal },
            { type: 'closeTag', tagName: 'div', outerNewLine: true },
        ];
    },
    customInline: function (node, context, convertors) {
        var _a = node, info = _a.info, firstChild = _a.firstChild;
        var nomalizedInfo = info.trim().toLowerCase();
        var customConvertor = convertors[nomalizedInfo];
        var entering = context.entering;
        if (customConvertor) {
            try {
                return customConvertor(node, context);
            }
            catch (e) {
                console.warn("[@toast-ui/editor] - The error occurred when " + nomalizedInfo + " inline node was parsed in markdown renderer: " + e);
            }
        }
        return entering
            ? [
                { type: 'openTag', tagName: 'span' },
                { type: 'text', content: "$$" + info + (firstChild ? ' ' : '') },
            ]
            : [
                { type: 'text', content: '$$' },
                { type: 'closeTag', tagName: 'span' },
            ];
    },
};
var gfmConvertors = {
    strike: function (_, _a) {
        var entering = _a.entering;
        return {
            type: entering ? 'openTag' : 'closeTag',
            tagName: 'del',
        };
    },
    item: function (node, _a) {
        var entering = _a.entering;
        var _b = node.listData, checked = _b.checked, task = _b.task;
        if (entering) {
            var itemTag = {
                type: 'openTag',
                tagName: 'li',
                outerNewLine: true,
            };
            if (task) {
                return [
                    itemTag,
                    {
                        type: 'openTag',
                        tagName: 'input',
                        selfClose: true,
                        attributes: esm_assign(esm_assign({}, (checked && { checked: '' })), { disabled: '', type: 'checkbox' }),
                    },
                    {
                        type: 'text',
                        content: ' ',
                    },
                ];
            }
            return itemTag;
        }
        return {
            type: 'closeTag',
            tagName: 'li',
            outerNewLine: true,
        };
    },
    table: function (_, _a) {
        var entering = _a.entering;
        return {
            type: entering ? 'openTag' : 'closeTag',
            tagName: 'table',
            outerNewLine: true,
        };
    },
    tableHead: function (_, _a) {
        var entering = _a.entering;
        return {
            type: entering ? 'openTag' : 'closeTag',
            tagName: 'thead',
            outerNewLine: true,
        };
    },
    tableBody: function (_, _a) {
        var entering = _a.entering;
        return {
            type: entering ? 'openTag' : 'closeTag',
            tagName: 'tbody',
            outerNewLine: true,
        };
    },
    tableRow: function (node, _a) {
        var entering = _a.entering;
        if (entering) {
            return {
                type: 'openTag',
                tagName: 'tr',
                outerNewLine: true,
            };
        }
        var result = [];
        if (node.lastChild) {
            var columnLen = node.parent.parent.columns.length;
            var lastColIdx = node.lastChild.endIdx;
            for (var i = lastColIdx + 1; i < columnLen; i += 1) {
                result.push({
                    type: 'openTag',
                    tagName: 'td',
                    outerNewLine: true,
                }, {
                    type: 'closeTag',
                    tagName: 'td',
                    outerNewLine: true,
                });
            }
        }
        result.push({
            type: 'closeTag',
            tagName: 'tr',
            outerNewLine: true,
        });
        return result;
    },
    tableCell: function (node, _a) {
        var entering = _a.entering;
        if (node.ignored) {
            return {
                type: 'text',
                content: '',
            };
        }
        var tablePart = node.parent.parent;
        var tagName = tablePart.type === 'tableHead' ? 'th' : 'td';
        var table = tablePart.parent;
        var columnInfo = table.columns[node.startIdx];
        var attributes = (columnInfo === null || columnInfo === void 0 ? void 0 : columnInfo.align) ? { align: columnInfo.align } : null;
        if (entering) {
            return esm_assign({ type: 'openTag', tagName: tagName, outerNewLine: true }, (attributes && { attributes: attributes }));
        }
        return {
            type: 'closeTag',
            tagName: tagName,
            outerNewLine: true,
        };
    },
};
var defaultOptions = {
    softbreak: '\n',
    gfm: false,
    tagFilter: false,
    nodeId: false,
};
function getChildrenText(node) {
    var buffer = [];
    var walker = node.walker();
    var event = null;
    while ((event = walker.next())) {
        var node_1 = event.node;
        if (node_1.type === 'text') {
            buffer.push(node_1.literal);
        }
    }
    return buffer.join('');
}
var Renderer = /** @class */ (function () {
    function Renderer(customOptions) {
        this.buffer = [];
        this.options = esm_assign(esm_assign({}, defaultOptions), customOptions);
        this.convertors = this.createConvertors();
        delete this.options.convertors;
    }
    Renderer.prototype.createConvertors = function () {
        var convertors = esm_assign({}, baseConvertors);
        if (this.options.gfm) {
            convertors = esm_assign(esm_assign({}, convertors), gfmConvertors);
        }
        if (this.options.convertors) {
            var customConvertors_1 = this.options.convertors;
            var nodeTypes = Object.keys(customConvertors_1);
            var defaultConvertors_1 = esm_assign(esm_assign({}, baseConvertors), gfmConvertors);
            nodeTypes.forEach(function (nodeType) {
                var orgConvertor = convertors[nodeType];
                var convertor = customConvertors_1[nodeType];
                var convertorType = Object.keys(defaultConvertors_1).indexOf(nodeType) === -1
                    ? nodeType.toLowerCase()
                    : nodeType;
                if (orgConvertor) {
                    convertors[convertorType] = function (node, context, convertors) {
                        context.origin = function () { return orgConvertor(node, context, convertors); };
                        return convertor(node, context);
                    };
                }
                else {
                    convertors[convertorType] = convertor;
                }
            });
        }
        return convertors;
    };
    Renderer.prototype.getConvertors = function () {
        return this.convertors;
    };
    Renderer.prototype.getOptions = function () {
        return this.options;
    };
    Renderer.prototype.render = function (rootNode) {
        var _this = this;
        this.buffer = [];
        var walker = rootNode.walker();
        var event = null;
        var _loop_1 = function () {
            var node = event.node, entering = event.entering;
            var convertor = this_1.convertors[node.type];
            if (!convertor) {
                return "continue";
            }
            var skipped = false;
            var context = {
                entering: entering,
                leaf: !isContainer(node),
                options: this_1.options,
                getChildrenText: getChildrenText,
                skipChildren: function () {
                    skipped = true;
                },
            };
            var converted = isCustomBlock(node) || isCustomInline(node)
                ? convertor(node, context, this_1.convertors)
                : convertor(node, context);
            if (converted) {
                var htmlNodes = Array.isArray(converted) ? converted : [converted];
                htmlNodes.forEach(function (htmlNode, index) {
                    if (htmlNode.type === 'openTag' && _this.options.nodeId && index === 0) {
                        if (!htmlNode.attributes) {
                            htmlNode.attributes = {};
                        }
                        htmlNode.attributes['data-nodeid'] = String(node.id);
                    }
                    _this.renderHTMLNode(htmlNode);
                });
                if (skipped) {
                    walker.resumeAt(node, false);
                    walker.next();
                }
            }
        };
        var this_1 = this;
        while ((event = walker.next())) {
            _loop_1();
        }
        this.addNewLine();
        return this.buffer.join('');
    };
    Renderer.prototype.renderHTMLNode = function (node) {
        switch (node.type) {
            case 'openTag':
            case 'closeTag':
                this.renderElementNode(node);
                break;
            case 'text':
                this.renderTextNode(node);
                break;
            case 'html':
                this.renderRawHtmlNode(node);
                break;
            // no-default-case
        }
    };
    Renderer.prototype.generateOpenTagString = function (node) {
        var _this = this;
        var tagName = node.tagName, classNames = node.classNames, attributes = node.attributes;
        this.buffer.push("<" + tagName);
        if (classNames && classNames.length > 0) {
            this.buffer.push(" class=\"" + classNames.join(' ') + "\"");
        }
        if (attributes) {
            Object.keys(attributes).forEach(function (attrName) {
                var attrValue = attributes[attrName];
                _this.buffer.push(" " + attrName + "=\"" + attrValue + "\"");
            });
        }
        if (node.selfClose) {
            this.buffer.push(' /');
        }
        this.buffer.push('>');
    };
    Renderer.prototype.generateCloseTagString = function (_a) {
        var tagName = _a.tagName;
        this.buffer.push("</" + tagName + ">");
    };
    Renderer.prototype.addNewLine = function () {
        if (this.buffer.length && last(last(this.buffer)) !== '\n') {
            this.buffer.push('\n');
        }
    };
    Renderer.prototype.addOuterNewLine = function (node) {
        if (node.outerNewLine) {
            this.addNewLine();
        }
    };
    Renderer.prototype.addInnerNewLine = function (node) {
        if (node.innerNewLine) {
            this.addNewLine();
        }
    };
    Renderer.prototype.renderTextNode = function (node) {
        this.buffer.push(escapeXml(node.content));
    };
    Renderer.prototype.renderRawHtmlNode = function (node) {
        this.addOuterNewLine(node);
        this.buffer.push(node.content);
        this.addOuterNewLine(node);
    };
    Renderer.prototype.renderElementNode = function (node) {
        if (node.type === 'openTag') {
            this.addOuterNewLine(node);
            this.generateOpenTagString(node);
            if (node.selfClose) {
                this.addOuterNewLine(node);
            }
            else {
                this.addInnerNewLine(node);
            }
        }
        else {
            this.addInnerNewLine(node);
            this.generateCloseTagString(node);
            this.addOuterNewLine(node);
        }
    };
    return Renderer;
}());


// EXTERNAL MODULE: ../../node_modules/tui-code-snippet/collection/forEachOwnProperties.js
var collection_forEachOwnProperties = __webpack_require__(956);
var forEachOwnProperties_default = /*#__PURE__*/__webpack_require__.n(collection_forEachOwnProperties);
// EXTERNAL MODULE: ../../node_modules/tui-code-snippet/object/extend.js
var extend = __webpack_require__(969);
var extend_default = /*#__PURE__*/__webpack_require__.n(extend);
// EXTERNAL MODULE: ../../node_modules/tui-code-snippet/domEvent/on.js
var on = __webpack_require__(348);
var on_default = /*#__PURE__*/__webpack_require__.n(on);
// EXTERNAL MODULE: ../../node_modules/tui-code-snippet/domEvent/off.js
var off = __webpack_require__(349);
var off_default = /*#__PURE__*/__webpack_require__.n(off);
// EXTERNAL MODULE: ../../node_modules/tui-code-snippet/domUtil/addClass.js
var addClass = __webpack_require__(204);
var addClass_default = /*#__PURE__*/__webpack_require__.n(addClass);
// EXTERNAL MODULE: ../../node_modules/tui-code-snippet/domUtil/removeClass.js
var removeClass = __webpack_require__(462);
var removeClass_default = /*#__PURE__*/__webpack_require__.n(removeClass);
// EXTERNAL MODULE: ../../node_modules/tui-code-snippet/domUtil/css.js
var css = __webpack_require__(522);
var css_default = /*#__PURE__*/__webpack_require__.n(css);
// EXTERNAL MODULE: ../../node_modules/tui-code-snippet/collection/toArray.js
var collection_toArray = __webpack_require__(990);
var toArray_default = /*#__PURE__*/__webpack_require__.n(collection_toArray);
// EXTERNAL MODULE: ../../node_modules/tui-code-snippet/type/isArray.js
var type_isArray = __webpack_require__(322);
var isArray_default = /*#__PURE__*/__webpack_require__.n(type_isArray);
// EXTERNAL MODULE: ../../node_modules/tui-code-snippet/type/isString.js
var type_isString = __webpack_require__(758);
var isString_default = /*#__PURE__*/__webpack_require__.n(type_isString);
// EXTERNAL MODULE: ../../node_modules/tui-code-snippet/type/isUndefined.js
var type_isUndefined = __webpack_require__(929);
var isUndefined_default = /*#__PURE__*/__webpack_require__.n(type_isUndefined);
// EXTERNAL MODULE: ../../node_modules/tui-code-snippet/domUtil/hasClass.js
var hasClass = __webpack_require__(714);
var hasClass_default = /*#__PURE__*/__webpack_require__.n(hasClass);
// EXTERNAL MODULE: ../../node_modules/tui-code-snippet/domUtil/matches.js
var domUtil_matches = __webpack_require__(471);
;// CONCATENATED MODULE: ./src/utils/constants.ts
var TAG_NAME = '[A-Za-z][A-Za-z0-9-]*';
var ATTRIBUTE_NAME = '[a-zA-Z_:][a-zA-Z0-9:._-]*';
var UNQUOTED_VALUE = '[^"\'=<>`\\x00-\\x20]+';
var SINGLE_QUOTED_VALUE = "'[^']*'";
var DOUBLE_QUOTED_VALUE = '"[^"]*"';
var ATTRIBUTE_VALUE = "(?:" + UNQUOTED_VALUE + "|" + SINGLE_QUOTED_VALUE + "|" + DOUBLE_QUOTED_VALUE + ")";
var ATTRIBUTE_VALUE_SPEC = "" + '(?:\\s*=\\s*' + ATTRIBUTE_VALUE + ")";
var constants_ATTRIBUTE = "" + '(?:\\s+' + ATTRIBUTE_NAME + ATTRIBUTE_VALUE_SPEC + "?)";
var constants_OPEN_TAG = "<(" + TAG_NAME + ")(" + constants_ATTRIBUTE + ")*\\s*/?>";
var CLOSE_TAG = "</(" + TAG_NAME + ")\\s*[>]";
var constants_HTML_TAG = "(?:" + constants_OPEN_TAG + "|" + CLOSE_TAG + ")";
var reHTMLTag = new RegExp("^" + constants_HTML_TAG, 'i');
var constants_reBR = /<br\s*\/*>/i;
var reHTMLComment = /<! ---->|<!--(?:-?[^>-])(?:-?[^-])*-->/;
var constants_ALTERNATIVE_TAG_FOR_BR = '</p><p>';

// EXTERNAL MODULE: ../../node_modules/tui-code-snippet/type/isNull.js
var type_isNull = __webpack_require__(934);
// EXTERNAL MODULE: ../../node_modules/tui-code-snippet/request/sendHostname.js
var request_sendHostname = __webpack_require__(391);
;// CONCATENATED MODULE: ./src/utils/common.ts





var isMac = /Mac/.test(navigator.platform);
var reSpaceMoreThanOne = /[\u0020]+/g;
var common_reEscapeChars = /[>(){}[\]+-.!#|]/g;
var reEscapeHTML = /<([a-zA-Z_][a-zA-Z0-9\-._]*)(\s|[^\\>])*\/?>|<(\/)([a-zA-Z_][a-zA-Z0-9\-._]*)\s*\/?>|<!--[^-]+-->|<([a-zA-Z_][a-zA-Z0-9\-.:/]*)>/g;
var reEscapeBackSlash = /\\[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\\]/g;
var reEscapePairedChars = /[*_~`]/g;
var reMdImageSyntax = /!\[.*\]\(.*\)/g;
var reEscapedCharInLinkSyntax = /[[\]]/g;
var reEscapeBackSlashInSentence = /(?:^|[^\\])\\(?!\\)/g;
var common_XMLSPECIAL = '[&<>"]';
var common_reXmlSpecial = new RegExp(common_XMLSPECIAL, 'g');
function common_replaceUnsafeChar(char) {
    switch (char) {
        case '&':
            return '&amp;';
        case '<':
            return '&lt;';
        case '>':
            return '&gt;';
        case '"':
            return '&quot;';
        default:
            return char;
    }
}
function common_escapeXml(text) {
    if (common_reXmlSpecial.test(text)) {
        return text.replace(common_reXmlSpecial, common_replaceUnsafeChar);
    }
    return text;
}
function sendHostName() {
    sendHostname('editor', 'UA-129966929-1');
}
function common_includes(arr, targetItem) {
    return arr.indexOf(targetItem) !== -1;
}
var availableLinkAttributes = ['rel', 'target', 'hreflang', 'type'];
var reMarkdownTextToEscapeMap = {
    codeblock: /(^ {4}[^\n]+\n*)+/,
    thematicBreak: /^ *((\* *){3,}|(- *){3,} *|(_ *){3,}) */,
    atxHeading: /^(#{1,6}) +[\s\S]+/,
    seTextheading: /^([^\n]+)\n *(=|-){2,} */,
    blockquote: /^( *>[^\n]+.*)+/,
    list: /^ *(\*+|-+|\d+\.) [\s\S]+/,
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? */,
    link: /!?\[.*\]\(.*\)/,
    reflink: /!?\[.*\]\s*\[([^\]]*)\]/,
    verticalBar: /\u007C/,
    fencedCodeblock: /^((`|~){3,})/,
};
function sanitizeLinkAttribute(attribute) {
    if (!attribute) {
        return null;
    }
    var linkAttributes = {};
    availableLinkAttributes.forEach(function (key) {
        if (!isUndefined_default()(attribute[key])) {
            linkAttributes[key] = attribute[key];
        }
    });
    return linkAttributes;
}
function common_repeat(text, count) {
    var result = '';
    for (var i = 0; i < count; i += 1) {
        result += text;
    }
    return result;
}
function isNeedEscapeText(text) {
    var needEscape = false;
    forEachOwnProperties(reMarkdownTextToEscapeMap, function (reMarkdownTextToEscape) {
        if (reMarkdownTextToEscape.test(text)) {
            needEscape = true;
        }
        return !needEscape;
    });
    return needEscape;
}
function escapeTextForLink(text) {
    var imageSyntaxRanges = [];
    var result = reMdImageSyntax.exec(text);
    while (result) {
        imageSyntaxRanges.push([result.index, result.index + result[0].length]);
        result = reMdImageSyntax.exec(text);
    }
    return text.replace(reEscapedCharInLinkSyntax, function (matched, offset) {
        var isDelimiter = imageSyntaxRanges.some(function (range) { return offset > range[0] && offset < range[1]; });
        return isDelimiter ? matched : "\\" + matched;
    });
}
function common_escape(text) {
    var aheadReplacer = function (matched) { return "\\" + matched; };
    var behindReplacer = function (matched) { return matched + "\\"; };
    var escapedText = text.replace(reSpaceMoreThanOne, ' ');
    if (reEscapeBackSlash.test(escapedText)) {
        escapedText = escapedText.replace(reEscapeBackSlash, aheadReplacer);
    }
    if (reEscapeBackSlashInSentence.test(escapedText)) {
        escapedText = escapedText.replace(reEscapeBackSlashInSentence, behindReplacer);
    }
    escapedText = escapedText.replace(reEscapePairedChars, aheadReplacer);
    if (reEscapeHTML.test(escapedText)) {
        escapedText = escapedText.replace(reEscapeHTML, aheadReplacer);
    }
    if (isNeedEscapeText(escapedText)) {
        escapedText = escapedText.replace(common_reEscapeChars, aheadReplacer);
    }
    return escapedText;
}
function quote(text) {
    var result;
    if (text.indexOf('"') === -1) {
        result = '""';
    }
    else {
        result = text.indexOf("'") === -1 ? "''" : '()';
    }
    return result[0] + text + result[1];
}
function common_isNil(value) {
    return isNull(value) || isUndefined(value);
}
function shallowEqual(o1, o2) {
    if (o1 === null && o1 === o2) {
        return true;
    }
    if (typeof o1 !== 'object' || typeof o2 !== 'object' || common_isNil(o1) || common_isNil(o2)) {
        return o1 === o2;
    }
    for (var key in o1) {
        if (o1[key] !== o2[key]) {
            return false;
        }
    }
    for (var key in o2) {
        if (!(key in o1)) {
            return false;
        }
    }
    return true;
}
function common_last(arr) {
    return arr[arr.length - 1];
}
function common_between(value, min, max) {
    return value >= min && value <= max;
}
function isObject(obj) {
    return typeof obj === 'object' && obj !== null;
}
function deepMergedCopy(targetObj, obj) {
    var resultObj = tslib_es6_assign({}, targetObj);
    if (targetObj && obj) {
        Object.keys(obj).forEach(function (prop) {
            if (isObject(resultObj[prop])) {
                if (Array.isArray(obj[prop])) {
                    resultObj[prop] = deepCopyArray(obj[prop]);
                }
                else if (resultObj.hasOwnProperty(prop)) {
                    resultObj[prop] = deepMergedCopy(resultObj[prop], obj[prop]);
                }
                else {
                    resultObj[prop] = deepCopy(obj[prop]);
                }
            }
            else {
                resultObj[prop] = obj[prop];
            }
        });
    }
    return resultObj;
}
function deepCopyArray(items) {
    return items.map(function (item) {
        if (isObject(item)) {
            return Array.isArray(item) ? deepCopyArray(item) : deepCopy(item);
        }
        return item;
    });
}
function deepCopy(obj) {
    var keys = Object.keys(obj);
    if (!keys.length) {
        return obj;
    }
    return keys.reduce(function (acc, prop) {
        if (isObject(obj[prop])) {
            acc[prop] = Array.isArray(obj[prop]) ? deepCopyArray(obj[prop]) : deepCopy(obj[prop]);
        }
        else {
            acc[prop] = obj[prop];
        }
        return acc;
    }, {});
}
function common_assign(targetObj, obj) {
    if (obj === void 0) { obj = {}; }
    Object.keys(obj).forEach(function (prop) {
        if (targetObj.hasOwnProperty(prop) && typeof targetObj[prop] === 'object') {
            if (Array.isArray(obj[prop])) {
                targetObj[prop] = obj[prop];
            }
            else {
                common_assign(targetObj[prop], obj[prop]);
            }
        }
        else {
            targetObj[prop] = obj[prop];
        }
    });
    return targetObj;
}
function getSortedNumPair(valueA, valueB) {
    return valueA > valueB ? [valueB, valueA] : [valueA, valueB];
}

;// CONCATENATED MODULE: ./src/utils/dom.ts










function isPositionInBox(style, offsetX, offsetY) {
    var left = parseInt(style.left, 10);
    var top = parseInt(style.top, 10);
    var width = parseInt(style.width, 10) + parseInt(style.paddingLeft, 10) + parseInt(style.paddingRight, 10);
    var height = parseInt(style.height, 10) + parseInt(style.paddingTop, 10) + parseInt(style.paddingBottom, 10);
    return offsetX >= left && offsetX <= left + width && offsetY >= top && offsetY <= top + height;
}
var CLS_PREFIX = 'toastui-editor-';
function cls() {
    var names = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        names[_i] = arguments[_i];
    }
    var result = [];
    for (var _a = 0, names_1 = names; _a < names_1.length; _a++) {
        var name = names_1[_a];
        var className = void 0;
        if (Array.isArray(name)) {
            className = name[0] ? name[1] : null;
        }
        else {
            className = name;
        }
        if (className) {
            result.push("" + CLS_PREFIX + className);
        }
    }
    return result.join(' ');
}
function clsWithMdPrefix() {
    var names = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        names[_i] = arguments[_i];
    }
    return names.map(function (className) { return CLS_PREFIX + "md-" + className; }).join(' ');
}
function isTextNode(node) {
    return (node === null || node === void 0 ? void 0 : node.nodeType) === Node.TEXT_NODE;
}
function isElemNode(node) {
    return node && node.nodeType === Node.ELEMENT_NODE;
}
function findNodes(element, selector) {
    var nodeList = toArray(element.querySelectorAll(selector));
    if (nodeList.length) {
        return nodeList;
    }
    return [];
}
function appendNodes(node, nodesToAppend) {
    nodesToAppend = isArray(nodesToAppend) ? toArray(nodesToAppend) : [nodesToAppend];
    nodesToAppend.forEach(function (nodeToAppend) {
        node.appendChild(nodeToAppend);
    });
}
function insertBeforeNode(insertedNode, node) {
    if (node.parentNode) {
        node.parentNode.insertBefore(insertedNode, node);
    }
}
function removeNode(node) {
    if (node.parentNode) {
        node.parentNode.removeChild(node);
    }
}
function unwrapNode(node) {
    var result = [];
    while (node.firstChild) {
        result.push(node.firstChild);
        if (node.parentNode) {
            node.parentNode.insertBefore(node.firstChild, node);
        }
    }
    removeNode(node);
    return result;
}
function toggleClass(element, className, state) {
    if (isUndefined_default()(state)) {
        state = !hasClass_default()(element, className);
    }
    var toggleFn = state ? (addClass_default()) : (removeClass_default());
    toggleFn(element, className);
}
function createElementWith(contents, target) {
    var container = document.createElement('div');
    if (isString_default()(contents)) {
        container.innerHTML = contents;
    }
    else {
        container.appendChild(contents);
    }
    var firstChild = container.firstChild;
    if (target) {
        target.appendChild(firstChild);
    }
    return firstChild;
}
function getOuterWidth(el) {
    var computed = window.getComputedStyle(el);
    return (['margin-left', 'margin-right'].reduce(function (acc, type) { return acc + parseInt(computed.getPropertyValue(type), 10); }, 0) + el.offsetWidth);
}
function closest(node, found) {
    var condition;
    if (isString(found)) {
        condition = function (target) { return matches(target, found); };
    }
    else {
        condition = function (target) { return target === found; };
    }
    while (node && node !== document) {
        if (isElemNode(node) && condition(node)) {
            return node;
        }
        node = node.parentNode;
    }
    return null;
}
function getTotalOffset(el, root) {
    var offsetTop = 0;
    var offsetLeft = 0;
    while (el && el !== root) {
        var top = el.offsetTop, left = el.offsetLeft, offsetParent = el.offsetParent;
        offsetTop += top;
        offsetLeft += left;
        if (offsetParent === root.offsetParent) {
            break;
        }
        el = el.offsetParent;
    }
    return { offsetTop: offsetTop, offsetLeft: offsetLeft };
}
function finalizeHtml(html, needHtmlText) {
    var result;
    if (needHtmlText) {
        result = html.innerHTML;
    }
    else {
        var frag = document.createDocumentFragment();
        var childNodes = toArray(html.childNodes);
        var length = childNodes.length;
        for (var i = 0; i < length; i += 1) {
            frag.appendChild(childNodes[i]);
        }
        result = frag;
    }
    return result;
}
function dom_empty(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}
function appendNode(node, appended) {
    if (isString(appended)) {
        node.insertAdjacentHTML('beforeend', appended);
    }
    else {
        var nodes = appended.length
            ? toArray(appended)
            : [appended];
        for (var i = 0, len = nodes.length; i < len; i += 1) {
            node.appendChild(nodes[i]);
        }
    }
}
function prependNode(node, appended) {
    if (isString(appended)) {
        node.insertAdjacentHTML('afterbegin', appended);
    }
    else {
        var nodes = appended.length
            ? toArray(appended)
            : [appended];
        for (var i = nodes.length - 1, len = 0; i >= len; i -= 1) {
            node.insertBefore(nodes[i], node.firstChild);
        }
    }
}
function setAttributes(attributes, element) {
    Object.keys(attributes).forEach(function (attrName) {
        if (isNil(attributes[attrName])) {
            element.removeAttribute(attrName);
        }
        else {
            element.setAttribute(attrName, attributes[attrName]);
        }
    });
}
function replaceBRWithEmptyBlock(html) {
    // remove br in paragraph to compatible with markdown
    var replacedHTML = html.replace(/<p><br\s*\/*><\/p>/gi, '<p></p>');
    var reHTMLTag = new RegExp(HTML_TAG, 'ig');
    var htmlTagMatched = replacedHTML.match(reHTMLTag);
    htmlTagMatched === null || htmlTagMatched === void 0 ? void 0 : htmlTagMatched.forEach(function (htmlTag, index) {
        if (reBR.test(htmlTag)) {
            var alternativeTag = ALTERNATIVE_TAG_FOR_BR;
            if (index) {
                var prevTag = htmlTagMatched[index - 1];
                var openTagMatched = prevTag.match(OPEN_TAG);
                if (openTagMatched && !/br/i.test(openTagMatched[1])) {
                    var tagName = openTagMatched[1];
                    alternativeTag = "</" + tagName + "><" + tagName + ">";
                }
            }
            replacedHTML = replacedHTML.replace(reBR, alternativeTag);
        }
    });
    return replacedHTML;
}
function removeProseMirrorHackNodes(html) {
    var reProseMirrorImage = /<img class="ProseMirror-separator" alt="">/g;
    var reProseMirrorTrailingBreak = / class="ProseMirror-trailingBreak"/g;
    var resultHTML = html;
    resultHTML = resultHTML.replace(reProseMirrorImage, '');
    resultHTML = resultHTML.replace(reProseMirrorTrailingBreak, '');
    return resultHTML;
}

// EXTERNAL MODULE: ../../node_modules/tui-code-snippet/type/isFunction.js
var isFunction = __webpack_require__(294);
var isFunction_default = /*#__PURE__*/__webpack_require__.n(isFunction);
;// CONCATENATED MODULE: ./src/utils/markdown.ts

function hasSpecificTypeAncestor(mdNode) {
    var types = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        types[_i - 1] = arguments[_i];
    }
    while (mdNode && mdNode.parent && mdNode.parent.type !== 'document') {
        if (includes(types, mdNode.parent.type)) {
            return true;
        }
        mdNode = mdNode.parent;
    }
    return false;
}
function markdown_getMdStartLine(mdNode) {
    return mdNode.sourcepos[0][0];
}
function markdown_getMdEndLine(mdNode) {
    return mdNode.sourcepos[1][0];
}
function getMdStartCh(mdNode) {
    return mdNode.sourcepos[0][1];
}
function getMdEndCh(mdNode) {
    return mdNode.sourcepos[1][1];
}
function isMultiLineNode(mdNode) {
    var type = mdNode.type;
    return type === 'codeBlock' || type === 'paragraph';
}
function isHTMLNode(mdNode) {
    var type = mdNode.type;
    return type === 'htmlBlock' || type === 'htmlInline';
}
function markdown_isStyledInlineNode(mdNode) {
    var type = mdNode.type;
    return (type === 'strike' ||
        type === 'strong' ||
        type === 'emph' ||
        type === 'code' ||
        type === 'link' ||
        type === 'image');
}
function isCodeBlockNode(mdNode) {
    return mdNode && mdNode.type === 'codeBlock';
}
function isCustomBlockNode(mdNode) {
    return mdNode && mdNode.type === 'customBlock';
}
function isListNode(mdNode) {
    return mdNode && (mdNode.type === 'item' || mdNode.type === 'list');
}
function isOrderedListNode(mdNode) {
    return isListNode(mdNode) && mdNode.listData.type === 'ordered';
}
function isBulletListNode(mdNode) {
    return isListNode(mdNode) && mdNode.listData.type !== 'ordered';
}
function isTableCellNode(mdNode) {
    return mdNode && (mdNode.type === 'tableCell' || mdNode.type === 'tableDelimCell');
}
function isInlineNode(mdNode) {
    switch (mdNode.type) {
        case 'code':
        case 'text':
        case 'emph':
        case 'strong':
        case 'strike':
        case 'link':
        case 'image':
        case 'htmlInline':
        case 'linebreak':
        case 'softbreak':
        case 'customInline':
            return true;
        default:
            return false;
    }
}
function findClosestNode(mdNode, condition, includeSelf) {
    if (includeSelf === void 0) { includeSelf = true; }
    mdNode = includeSelf ? mdNode : mdNode.parent;
    while (mdNode && mdNode.type !== 'document') {
        if (condition(mdNode)) {
            return mdNode;
        }
        mdNode = mdNode.parent;
    }
    return null;
}
function traverseParentNodes(mdNode, iteratee, includeSelf) {
    if (includeSelf === void 0) { includeSelf = true; }
    mdNode = includeSelf ? mdNode : mdNode.parent;
    while (mdNode && mdNode.type !== 'document') {
        iteratee(mdNode);
        mdNode = mdNode.parent;
    }
}
function addOffsetPos(originPos, offset) {
    return [originPos[0], originPos[1] + offset];
}
function setOffsetPos(originPos, newOffset) {
    return [originPos[0], newOffset];
}
function getInlineMarkdownText(mdNode) {
    var text = mdNode.firstChild.literal;
    switch (mdNode.type) {
        case 'emph':
            return "*" + text + "*";
        case 'strong':
            return "**" + text + "**";
        case 'strike':
            return "~~" + text + "~~";
        case 'code':
            return "`" + text + "`";
        case 'link':
        case 'image':
            /* eslint-disable no-case-declarations */
            var _a = mdNode, destination = _a.destination, title = _a.title;
            var delim = mdNode.type === 'link' ? '' : '!';
            return delim + "[" + text + "](" + destination + (title ? " \"" + title + "\"" : '') + ")";
        default:
            return null;
    }
}
function markdown_isContainer(node) {
    switch (node.type) {
        case 'document':
        case 'blockQuote':
        case 'list':
        case 'item':
        case 'paragraph':
        case 'heading':
        case 'emph':
        case 'strong':
        case 'strike':
        case 'link':
        case 'image':
        case 'table':
        case 'tableHead':
        case 'tableBody':
        case 'tableRow':
        case 'tableCell':
        case 'tableDelimRow':
        case 'customInline':
            return true;
        default:
            return false;
    }
}
function markdown_getChildrenText(node) {
    var buffer = [];
    var walker = node.walker();
    var event = null;
    while ((event = walker.next())) {
        var childNode = event.node;
        if (childNode.type === 'text') {
            buffer.push(childNode.literal);
        }
    }
    return buffer.join('');
}

;// CONCATENATED MODULE: ./src/widget/rules.ts

var widgetRules = (/* unused pure expression or super */ null && ([]));
var widgetRuleMap = {};
var reWidgetPrefix = /\$\$widget\d+\s/;
function unwrapWidgetSyntax(text) {
    var index = text.search(reWidgetPrefix);
    if (index !== -1) {
        var rest = text.substring(index);
        var replaced = rest.replace(reWidgetPrefix, '').replace('$$', '');
        text = text.substring(0, index);
        text += unwrapWidgetSyntax(replaced);
    }
    return text;
}
function createWidgetContent(info, text) {
    return "$$" + info + " " + text + "$$";
}
function widgetToDOM(info, text) {
    var _a = widgetRuleMap[info], rule = _a.rule, toDOM = _a.toDOM;
    var matches = unwrapWidgetSyntax(text).match(rule);
    if (matches) {
        text = matches[0];
    }
    return toDOM(text);
}
function getWidgetRules() {
    return widgetRules;
}
function setWidgetRules(rules) {
    widgetRules = rules;
    widgetRules.forEach(function (rule, index) {
        widgetRuleMap["widget" + index] = rule;
    });
}
function mergeNodes(nodes, text, schema, ruleIndex) {
    return nodes.concat(createNodesWithWidget(text, schema, ruleIndex));
}
/**
 * create nodes with plain text and replace text matched to the widget rules with the widget node
 * For example, in case the text and widget rules as below
 *
 * text: $test plain text #test
 * widget rules: [{ rule: /$.+/ }, { rule: /#.+/ }]
 *
 * The creating node process is recursive and is as follows.
 *
 * in first widget rule(/$.+/)
 *  $test -> widget node
 *  plain text -> match with next widget rule
 *  #test -> match with next widget rule
 *
 * in second widget rule(/#.+/)
 *  plain text -> text node(no rule for matching)
 *  #test -> widget node
 */
function createNodesWithWidget(text, schema, ruleIndex) {
    if (ruleIndex === void 0) { ruleIndex = 0; }
    var nodes = [];
    var rule = (widgetRules[ruleIndex] || {}).rule;
    var nextRuleIndex = ruleIndex + 1;
    text = unwrapWidgetSyntax(text);
    if (rule && rule.test(text)) {
        var index = void 0;
        while ((index = text.search(rule)) !== -1) {
            var prev = text.substring(0, index);
            // get widget node on first splitted text using next widget rule
            if (prev) {
                nodes = mergeNodes(nodes, prev, schema, nextRuleIndex);
            }
            // build widget node using current widget rule
            text = text.substring(index);
            var literal = text.match(rule)[0];
            var info = "widget" + ruleIndex;
            nodes.push(schema.nodes.widget.create({ info: info }, schema.text(createWidgetContent(info, literal))));
            text = text.substring(literal.length);
        }
        // get widget node on last splitted text using next widget rule
        if (text) {
            nodes = mergeNodes(nodes, text, schema, nextRuleIndex);
        }
    }
    else if (text) {
        nodes =
            ruleIndex < widgetRules.length - 1
                ? mergeNodes(nodes, text, schema, nextRuleIndex)
                : [schema.text(text)];
    }
    return nodes;
}
function getWidgetContent(widgetNode) {
    var event;
    var text = '';
    var walker = widgetNode.walker();
    while ((event = walker.next())) {
        var node = event.node, entering = event.entering;
        if (entering) {
            if (node !== widgetNode && node.type !== 'text') {
                text += getInlineMarkdownText(node);
                // skip the children
                walker.resumeAt(widgetNode, false);
                walker.next();
            }
            else if (node.type === 'text') {
                text += node.literal;
            }
        }
    }
    return text;
}

// EXTERNAL MODULE: ../../node_modules/dompurify/dist/purify.js
var purify = __webpack_require__(368);
var purify_default = /*#__PURE__*/__webpack_require__.n(purify);
;// CONCATENATED MODULE: ./src/sanitizer/htmlSanitizer.ts



var CAN_BE_WHITE_TAG_LIST = ['iframe', 'embed'];
var whiteTagList = [];
function htmlSanitizer_registerTagWhitelistIfPossible(tagName) {
    if (common_includes(CAN_BE_WHITE_TAG_LIST, tagName)) {
        whiteTagList.push(tagName.toLowerCase());
    }
}
function sanitizeHTML(html, options) {
    return purify_default().sanitize(html, tslib_es6_assign({ ADD_TAGS: whiteTagList, ADD_ATTR: ['rel', 'target', 'hreflang', 'type'], FORBID_TAGS: [
            'input',
            'script',
            'textarea',
            'form',
            'button',
            'select',
            'meta',
            'style',
            'link',
            'title',
            'object',
            'base',
        ] }, options));
}

;// CONCATENATED MODULE: ./src/wysiwyg/nodes/html.ts




function getChildrenHTML(node, typeName) {
    return node
        .literal.replace(new RegExp("(<\\s*" + typeName + "[^>]*>)|(</" + typeName + "\\s*[>])", 'ig'), '')
        .trim();
}
function getHTMLAttrsByHTMLString(html) {
    html = html.match(reHTMLTag)[0];
    var attrs = html.match(new RegExp(constants_ATTRIBUTE, 'g'));
    return attrs
        ? attrs.reduce(function (acc, attr) {
            var _a = attr.trim().split('='), name = _a[0], values = _a.slice(1);
            if (values.length) {
                acc[name] = values.join('=').replace(/'|"/g, '').trim();
            }
            return acc;
        }, {})
        : {};
}
function getHTMLAttrs(dom) {
    return toArray_default()(dom.attributes).reduce(function (acc, attr) {
        acc[attr.nodeName] = attr.nodeValue;
        return acc;
    }, {});
}
function sanitizeDOM(node, typeName, sanitizer, wwToDOMAdaptor) {
    var dom = wwToDOMAdaptor.getToDOMNode(typeName)(node);
    var html = sanitizer(dom.outerHTML);
    var container = document.createElement('div');
    container.innerHTML = html;
    dom = container.firstChild;
    var htmlAttrs = getHTMLAttrs(dom);
    return { dom: dom, htmlAttrs: htmlAttrs };
}
var schemaFactory = {
    htmlBlock: function (typeName, sanitizeHTML, wwToDOMAdaptor) {
        return {
            atom: true,
            content: 'block+',
            group: 'block',
            attrs: {
                htmlAttrs: { default: {} },
                childrenHTML: { default: '' },
                htmlBlock: { default: true },
            },
            parseDOM: [
                {
                    tag: typeName,
                    getAttrs: function (dom) {
                        return {
                            htmlAttrs: getHTMLAttrs(dom),
                            childrenHTML: dom.innerHTML,
                        };
                    },
                },
            ],
            toDOM: function (node) {
                var _a = sanitizeDOM(node, typeName, sanitizeHTML, wwToDOMAdaptor), dom = _a.dom, htmlAttrs = _a.htmlAttrs;
                htmlAttrs.class = htmlAttrs.class ? htmlAttrs.class + " html-block" : 'html-block';
                return __spreadArray([typeName, htmlAttrs], toArray_default()(dom.childNodes));
            },
        };
    },
    htmlInline: function (typeName, sanitizeHTML, wwToDOMAdaptor) {
        return {
            attrs: {
                htmlAttrs: { default: {} },
                htmlInline: { default: true },
            },
            parseDOM: [
                {
                    tag: typeName,
                    getAttrs: function (dom) {
                        return {
                            htmlAttrs: getHTMLAttrs(dom),
                        };
                    },
                },
            ],
            toDOM: function (node) {
                var htmlAttrs = sanitizeDOM(node, typeName, sanitizeHTML, wwToDOMAdaptor).htmlAttrs;
                return [typeName, htmlAttrs, 0];
            },
        };
    },
};
function createHTMLSchemaMap(convertorMap, sanitizeHTML, wwToDOMAdaptor) {
    var htmlSchemaMap = { nodes: {}, marks: {} };
    ['htmlBlock', 'htmlInline'].forEach(function (htmlType) {
        if (convertorMap[htmlType]) {
            Object.keys(convertorMap[htmlType]).forEach(function (type) {
                var targetType = htmlType === 'htmlBlock' ? 'nodes' : 'marks';
                // register tag white list for preventing to remove the html in sanitizer
                registerTagWhitelistIfPossible(type);
                htmlSchemaMap[targetType][type] = schemaFactory[htmlType](type, sanitizeHTML, wwToDOMAdaptor);
            });
        }
    });
    return htmlSchemaMap;
}

;// CONCATENATED MODULE: ./src/markdown/htmlRenderConvertors.ts






var reCloseTag = /^\s*<\s*\//;
var htmlRenderConvertors_baseConvertors = {
    paragraph: function (_, _a) {
        var entering = _a.entering, origin = _a.origin, options = _a.options;
        if (options.nodeId) {
            return {
                type: entering ? 'openTag' : 'closeTag',
                outerNewLine: true,
                tagName: 'p',
            };
        }
        return origin();
    },
    softbreak: function (node) {
        var isPrevNodeHTML = node.prev && node.prev.type === 'htmlInline';
        var isPrevBR = isPrevNodeHTML && /<br ?\/?>/.test(node.prev.literal);
        var content = isPrevBR ? '\n' : '<br>\n';
        return { type: 'html', content: content };
    },
    item: function (node, _a) {
        var entering = _a.entering;
        if (entering) {
            var attributes = {};
            var classNames = [];
            if (node.listData.task) {
                attributes['data-task'] = '';
                classNames.push('task-list-item');
                if (node.listData.checked) {
                    classNames.push('checked');
                    attributes['data-task-checked'] = '';
                }
            }
            return {
                type: 'openTag',
                tagName: 'li',
                classNames: classNames,
                attributes: attributes,
                outerNewLine: true,
            };
        }
        return {
            type: 'closeTag',
            tagName: 'li',
            outerNewLine: true,
        };
    },
    code: function (node) {
        var attributes = { 'data-backticks': String(node.tickCount) };
        return [
            { type: 'openTag', tagName: 'code', attributes: attributes },
            { type: 'text', content: node.literal },
            { type: 'closeTag', tagName: 'code' },
        ];
    },
    codeBlock: function (node) {
        var _a = node, fenceLength = _a.fenceLength, info = _a.info;
        var infoWords = info ? info.split(/\s+/) : [];
        var preClasses = [];
        var codeAttrs = {};
        if (fenceLength > 3) {
            codeAttrs['data-backticks'] = fenceLength;
        }
        if (infoWords.length > 0 && infoWords[0].length > 0) {
            var lang = infoWords[0];
            preClasses.push("lang-" + lang);
            codeAttrs['data-language'] = lang;
        }
        return [
            { type: 'openTag', tagName: 'pre', classNames: preClasses },
            { type: 'openTag', tagName: 'code', attributes: codeAttrs },
            { type: 'text', content: node.literal },
            { type: 'closeTag', tagName: 'code' },
            { type: 'closeTag', tagName: 'pre' },
        ];
    },
    customInline: function (node, _a) {
        var origin = _a.origin, entering = _a.entering, skipChildren = _a.skipChildren;
        var info = node.info;
        if (info.indexOf('widget') !== -1 && entering) {
            skipChildren();
            var content = getWidgetContent(node);
            var htmlInline = widgetToDOM(info, content).outerHTML;
            return [
                { type: 'openTag', tagName: 'span', classNames: ['tui-widget'] },
                { type: 'html', content: htmlInline },
                { type: 'closeTag', tagName: 'span' },
            ];
        }
        return origin();
    },
};
function getHTMLRenderConvertors(linkAttributes, customConvertors) {
    var convertors = tslib_es6_assign({}, htmlRenderConvertors_baseConvertors);
    if (linkAttributes) {
        convertors.link = function (_, _a) {
            var entering = _a.entering, origin = _a.origin;
            var result = origin();
            if (entering) {
                result.attributes = tslib_es6_assign(tslib_es6_assign({}, result.attributes), linkAttributes);
            }
            return result;
        };
    }
    if (customConvertors) {
        Object.keys(customConvertors).forEach(function (nodeType) {
            var orgConvertor = convertors[nodeType];
            var customConvertor = customConvertors[nodeType];
            if (orgConvertor && isFunction_default()(customConvertor)) {
                convertors[nodeType] = function (node, context) {
                    var newContext = tslib_es6_assign({}, context);
                    newContext.origin = function () { return orgConvertor(node, context); };
                    return customConvertor(node, newContext);
                };
            }
            else if (common_includes(['htmlBlock', 'htmlInline'], nodeType) && !isFunction_default()(customConvertor)) {
                convertors[nodeType] = function (node, context) {
                    var matched = node.literal.match(reHTMLTag);
                    if (matched) {
                        var rootHTML = matched[0], openTagName = matched[1], closeTagName = matched[3];
                        var typeName = (openTagName || closeTagName).toLowerCase();
                        var htmlConvertor = customConvertor[typeName];
                        var childrenHTML = getChildrenHTML(node, typeName);
                        if (htmlConvertor) {
                            // copy for preventing to overwrite the originial property
                            var newNode = tslib_es6_assign({}, node);
                            newNode.attrs = getHTMLAttrsByHTMLString(rootHTML);
                            newNode.childrenHTML = childrenHTML;
                            newNode.type = typeName;
                            context.entering = !reCloseTag.test(node.literal);
                            return htmlConvertor(newNode, context);
                        }
                    }
                    return context.origin();
                };
            }
            else {
                convertors[nodeType] = customConvertor;
            }
        });
    }
    return convertors;
}

;// CONCATENATED MODULE: ./src/markdown/scroll/dom.ts


var nestableTypes = (/* unused pure expression or super */ null && (['list', 'item', 'blockQuote']));
var nestableTagNames = ['UL', 'OL', 'BLOCKQUOTE'];
function isBlankLine(doc, index) {
    var _a;
    var pmNode = doc.child(index);
    return !pmNode.childCount || (pmNode.childCount === 1 && !((_a = pmNode.firstChild.text) === null || _a === void 0 ? void 0 : _a.trim()));
}
function getEditorRangeHeightInfo(doc, mdNode, children) {
    var start = getMdStartLine(mdNode) - 1;
    var end = getMdEndLine(mdNode) - 1;
    var rect = children[start].getBoundingClientRect();
    var height = children[end].offsetTop -
        children[start].offsetTop +
        children[end].clientHeight;
    return {
        height: height <= 0
            ? children[start].clientHeight
            : height + getBlankLinesHeight(doc, children, Math.min(end + 1, doc.childCount - 1)),
        rect: rect,
    };
}
function getBlankLinesHeight(doc, children, start) {
    var end = doc.childCount - 1;
    var height = 0;
    while (start <= end && isBlankLine(doc, start)) {
        height += children[start].clientHeight;
        start += 1;
    }
    return height;
}
function findAncestorHavingId(el, root) {
    while (!el.getAttribute('data-nodeid') && el.parentElement !== root) {
        el = el.parentElement;
    }
    return el;
}
function dom_getTotalOffsetTop(el, root) {
    var offsetTop = 0;
    while (el && el !== root) {
        if (!common_includes(nestableTagNames, el.tagName)) {
            offsetTop += el.offsetTop;
        }
        if (el.offsetParent === root.offsetParent) {
            break;
        }
        el = el.parentElement;
    }
    return offsetTop;
}
function findAdjacentElementToScrollTop(scrollTop, root) {
    var el = root;
    var prev = null;
    while (el) {
        var firstElementChild = el.firstElementChild;
        if (!firstElementChild) {
            break;
        }
        var lastSibling = findLastSiblingElementToScrollTop(firstElementChild, scrollTop, dom_getTotalOffsetTop(el, root));
        prev = el;
        el = lastSibling;
    }
    var adjacentEl = el || prev;
    return adjacentEl === root ? null : adjacentEl;
}
function findLastSiblingElementToScrollTop(el, scrollTop, offsetTop) {
    if (el && scrollTop > offsetTop + el.offsetTop) {
        return (findLastSiblingElementToScrollTop(el.nextElementSibling, scrollTop, offsetTop) || el);
    }
    return null;
}
function getAdditionalPos(scrollTop, offsetTop, height, targetNodeHeight) {
    var ratio = Math.min((scrollTop - offsetTop) / height, 1);
    return ratio * targetNodeHeight;
}
function getParentNodeObj(previewContent, mdNode) {
    var el = previewContent.querySelector("[data-nodeid=\"" + mdNode.id + "\"]");
    while (!el || isStyledInlineNode(mdNode)) {
        mdNode = mdNode.parent;
        el = previewContent.querySelector("[data-nodeid=\"" + mdNode.id + "\"]");
    }
    return getNonNestableNodeObj({ mdNode: mdNode, el: el });
}
function getNonNestableNodeObj(_a) {
    var mdNode = _a.mdNode, el = _a.el;
    while ((includes(nestableTypes, mdNode.type) || mdNode.type === 'table') && mdNode.firstChild) {
        mdNode = mdNode.firstChild;
        el = el.firstElementChild;
    }
    return { mdNode: mdNode, el: el };
}

;// CONCATENATED MODULE: ./src/markdown/scroll/offset.ts


var offsetInfoMap = {};
function setHeight(id, height) {
    offsetInfoMap[id] = offsetInfoMap[id] || {};
    offsetInfoMap[id].height = height;
}
function setOffsetTop(id, offsetTop) {
    offsetInfoMap[id] = offsetInfoMap[id] || {};
    offsetInfoMap[id].offsetTop = offsetTop;
}
function getHeight(id) {
    return offsetInfoMap[id] && offsetInfoMap[id].height;
}
function getOffsetTop(id) {
    return offsetInfoMap[id] && offsetInfoMap[id].offsetTop;
}
function removeOffsetInfoByNode(node) {
    if (node) {
        delete offsetInfoMap[Number(node.getAttribute('data-nodeid'))];
        toArray_default()(node.children).forEach(function (child) {
            removeOffsetInfoByNode(child);
        });
    }
}
function getAndSaveOffsetInfo(node, root, mdNodeId) {
    var cachedHeight = getHeight(mdNodeId);
    var cachedTop = getOffsetTop(mdNodeId);
    var nodeHeight = cachedHeight || node.clientHeight;
    var offsetTop = cachedTop || getTotalOffsetTop(node, root) || node.offsetTop;
    if (!cachedHeight) {
        setHeight(mdNodeId, nodeHeight);
    }
    if (!cachedTop) {
        setOffsetTop(mdNodeId, offsetTop);
    }
    return { nodeHeight: nodeHeight, offsetTop: offsetTop };
}

;// CONCATENATED MODULE: ./src/markdown/mdPreview.ts











var CLASS_HIGHLIGHT = cls('md-preview-highlight');
function findTableCell(tableRow, chOffset) {
    var cell = tableRow.firstChild;
    while (cell && cell.next) {
        if (getMdStartCh(cell.next) > chOffset + 1) {
            break;
        }
        cell = cell.next;
    }
    return cell;
}
/**
 * Class Markdown Preview
 * @param {HTMLElement} el - base element
 * @param {eventEmitter} eventEmitter - event manager
 * @param {object} options
 * @param {boolean} options.isViewer - true for view-only mode
 * @param {boolean} options.highlight - true for using live-highlight feature
 * @param {object} opitons.linkAttributes - attributes for link element
 * @param {object} opitons.customHTMLRenderer - map of custom HTML render functions
 *
 * @ignore
 */
var MarkdownPreview = /** @class */ (function () {
    function MarkdownPreview(eventEmitter, options) {
        var el = document.createElement('div');
        this.el = el;
        this.eventEmitter = eventEmitter;
        this.isViewer = !!options.isViewer;
        this.el.className = cls('md-preview');
        var linkAttributes = options.linkAttributes, customHTMLRenderer = options.customHTMLRenderer, sanitizer = options.sanitizer, _a = options.highlight, highlight = _a === void 0 ? false : _a;
        this.renderer = new Renderer({
            gfm: true,
            nodeId: true,
            convertors: getHTMLRenderConvertors(linkAttributes, customHTMLRenderer),
        });
        this.cursorNodeId = null;
        this.sanitizer = sanitizer;
        this.initEvent(highlight);
        this.initContentSection();
        // To prevent overflowing contents in the viewer
        if (this.isViewer) {
            this.previewContent.style.overflowWrap = 'break-word';
        }
    }
    MarkdownPreview.prototype.initContentSection = function () {
        this.previewContent = createElementWith("<div class=\"" + cls('contents') + "\"></div>");
        if (!this.isViewer) {
            this.el.appendChild(this.previewContent);
        }
    };
    MarkdownPreview.prototype.toggleActive = function (active) {
        toggleClass(this.el, 'active', active);
    };
    MarkdownPreview.prototype.initEvent = function (highlight) {
        var _this = this;
        this.eventEmitter.listen('updatePreview', this.update.bind(this));
        if (this.isViewer) {
            return;
        }
        if (highlight) {
            this.eventEmitter.listen('changeToolbarState', function (_a) {
                var mdNode = _a.mdNode, cursorPos = _a.cursorPos;
                _this.updateCursorNode(mdNode, cursorPos);
            });
            this.eventEmitter.listen('blur', function () {
                _this.removeHighlight();
            });
        }
        on_default()(this.el, 'scroll', function (event) {
            _this.eventEmitter.emit('scroll', 'preview', findAdjacentElementToScrollTop(event.target.scrollTop, _this.previewContent));
        });
        this.eventEmitter.listen('changePreviewTabPreview', function () { return _this.toggleActive(true); });
        this.eventEmitter.listen('changePreviewTabWrite', function () { return _this.toggleActive(false); });
    };
    MarkdownPreview.prototype.removeHighlight = function () {
        if (this.cursorNodeId) {
            var currentEl = this.getElementByNodeId(this.cursorNodeId);
            if (currentEl) {
                removeClass_default()(currentEl, CLASS_HIGHLIGHT);
            }
        }
    };
    MarkdownPreview.prototype.updateCursorNode = function (cursorNode, cursorPos) {
        if (cursorNode) {
            cursorNode = findClosestNode(cursorNode, function (mdNode) { return !isInlineNode(mdNode); });
            if (cursorNode.type === 'tableRow') {
                cursorNode = findTableCell(cursorNode, cursorPos[1]);
            }
            else if (cursorNode.type === 'tableBody') {
                // empty line next to table
                cursorNode = null;
            }
        }
        var cursorNodeId = cursorNode ? cursorNode.id : null;
        if (this.cursorNodeId === cursorNodeId) {
            return;
        }
        var oldEL = this.getElementByNodeId(this.cursorNodeId);
        var newEL = this.getElementByNodeId(cursorNodeId);
        if (oldEL) {
            removeClass_default()(oldEL, CLASS_HIGHLIGHT);
        }
        if (newEL) {
            addClass_default()(newEL, CLASS_HIGHLIGHT);
        }
        this.cursorNodeId = cursorNodeId;
    };
    MarkdownPreview.prototype.getElementByNodeId = function (nodeId) {
        return nodeId
            ? this.previewContent.querySelector("[data-nodeid=\"" + nodeId + "\"]")
            : null;
    };
    MarkdownPreview.prototype.update = function (changed) {
        var _this = this;
        changed.forEach(function (editResult) { return _this.replaceRangeNodes(editResult); });
        this.eventEmitter.emit('afterPreviewRender', this);
    };
    MarkdownPreview.prototype.replaceRangeNodes = function (editResult) {
        var _this = this;
        var nodes = editResult.nodes, removedNodeRange = editResult.removedNodeRange;
        var contentEl = this.previewContent;
        var newHtml = this.eventEmitter.emitReduce('beforePreviewRender', this.sanitizer(nodes.map(function (node) { return _this.renderer.render(node); }).join('')));
        if (!removedNodeRange) {
            contentEl.insertAdjacentHTML('afterbegin', newHtml);
        }
        else {
            var _a = removedNodeRange.id, startNodeId = _a[0], endNodeId = _a[1];
            var startEl = this.getElementByNodeId(startNodeId);
            var endEl = this.getElementByNodeId(endNodeId);
            if (startEl) {
                startEl.insertAdjacentHTML('beforebegin', newHtml);
                var el = startEl;
                while (el && el !== endEl) {
                    var nextEl = el.nextElementSibling;
                    removeNode(el);
                    removeOffsetInfoByNode(el);
                    el = nextEl;
                }
                if (el === null || el === void 0 ? void 0 : el.parentNode) {
                    removeNode(el);
                    removeOffsetInfoByNode(el);
                }
            }
        }
    };
    MarkdownPreview.prototype.getRenderer = function () {
        return this.renderer;
    };
    MarkdownPreview.prototype.destroy = function () {
        off_default()(this.el, 'scroll');
        this.el = null;
    };
    MarkdownPreview.prototype.getElement = function () {
        return this.el;
    };
    MarkdownPreview.prototype.getHTML = function () {
        return removeProseMirrorHackNodes(this.previewContent.innerHTML);
    };
    MarkdownPreview.prototype.setHTML = function (html) {
        this.previewContent.innerHTML = html;
    };
    MarkdownPreview.prototype.setHeight = function (height) {
        css_default()(this.el, { height: height + "px" });
    };
    MarkdownPreview.prototype.setMinHeight = function (minHeight) {
        css_default()(this.el, { minHeight: minHeight + "px" });
    };
    return MarkdownPreview;
}());
/* harmony default export */ var mdPreview = (MarkdownPreview);

// EXTERNAL MODULE: external {"commonjs":"prosemirror-state","commonjs2":"prosemirror-state","amd":"prosemirror-state"}
var external_commonjs_prosemirror_state_commonjs2_prosemirror_state_amd_prosemirror_state_ = __webpack_require__(814);
// EXTERNAL MODULE: external {"commonjs":"prosemirror-inputrules","commonjs2":"prosemirror-inputrules","amd":"prosemirror-inputrules"}
var external_commonjs_prosemirror_inputrules_commonjs2_prosemirror_inputrules_amd_prosemirror_inputrules_ = __webpack_require__(479);
// EXTERNAL MODULE: external {"commonjs":"prosemirror-view","commonjs2":"prosemirror-view","amd":"prosemirror-view"}
var external_commonjs_prosemirror_view_commonjs2_prosemirror_view_amd_prosemirror_view_ = __webpack_require__(311);
// EXTERNAL MODULE: external {"commonjs":"prosemirror-keymap","commonjs2":"prosemirror-keymap","amd":"prosemirror-keymap"}
var external_commonjs_prosemirror_keymap_commonjs2_prosemirror_keymap_amd_prosemirror_keymap_ = __webpack_require__(481);
// EXTERNAL MODULE: external {"commonjs":"prosemirror-model","commonjs2":"prosemirror-model","amd":"prosemirror-model"}
var external_commonjs_prosemirror_model_commonjs2_prosemirror_model_amd_prosemirror_model_ = __webpack_require__(43);
// EXTERNAL MODULE: ../../node_modules/tui-code-snippet/array/inArray.js
var inArray = __webpack_require__(928);
var inArray_default = /*#__PURE__*/__webpack_require__.n(inArray);
;// CONCATENATED MODULE: ./src/utils/map.ts

/**
 * @class
 * @ignore
 * @classdesc ES6 Map
 */
var map_Map = /** @class */ (function () {
    function Map() {
        this.keys = [];
        this.values = [];
    }
    Map.prototype.getKeyIndex = function (key) {
        return inArray_default()(key, this.keys);
    };
    Map.prototype.get = function (key) {
        return this.values[this.getKeyIndex(key)];
    };
    Map.prototype.set = function (key, value) {
        var keyIndex = this.getKeyIndex(key);
        if (keyIndex > -1) {
            this.values[keyIndex] = value;
        }
        else {
            this.keys.push(key);
            this.values.push(value);
        }
        return this;
    };
    Map.prototype.has = function (key) {
        return this.getKeyIndex(key) > -1;
    };
    Map.prototype.delete = function (key) {
        var keyIndex = this.getKeyIndex(key);
        if (keyIndex > -1) {
            this.keys.splice(keyIndex, 1);
            this.values.splice(keyIndex, 1);
            return true;
        }
        return false;
    };
    Map.prototype.forEach = function (callback, thisArg) {
        var _this = this;
        if (thisArg === void 0) { thisArg = this; }
        this.values.forEach(function (value, index) {
            if (value && _this.keys[index]) {
                callback.call(thisArg, value, _this.keys[index], _this);
            }
        });
    };
    Map.prototype.clear = function () {
        this.keys = [];
        this.values = [];
    };
    return Map;
}());
/* harmony default export */ var utils_map = (map_Map);

;// CONCATENATED MODULE: ./src/i18n/i18n.ts
/**
 * @fileoverview Implements i18n
 * @author NHN Cloud FE Development Lab <dl_javascript@nhn.com>
 */


var DEFAULT_CODE = 'en-US';
/**
 * Class I18n
 * @ignore
 */
var I18n = /** @class */ (function () {
    function I18n() {
        this.code = DEFAULT_CODE;
        this.langs = new utils_map();
    }
    I18n.prototype.setCode = function (code) {
        this.code = code || DEFAULT_CODE;
    };
    /**
     * Set language set
     * @param {string|string[]} codes locale code
     * @param {object} data language set
     */
    I18n.prototype.setLanguage = function (codes, data) {
        var _this = this;
        codes = [].concat(codes);
        codes.forEach(function (code) {
            if (!_this.langs.has(code)) {
                _this.langs.set(code, data);
            }
            else {
                var langData = _this.langs.get(code);
                _this.langs.set(code, extend_default()(langData, data));
            }
        });
    };
    I18n.prototype.get = function (key, code) {
        if (!code) {
            code = this.code;
        }
        var langSet = this.langs.get(code);
        if (!langSet) {
            langSet = this.langs.get(DEFAULT_CODE);
        }
        var text = langSet[key];
        if (!text) {
            throw new Error("There is no text key \"" + key + "\" in " + code);
        }
        return text;
    };
    return I18n;
}());

/* harmony default export */ var i18n = (new I18n());

;// CONCATENATED MODULE: ./src/wysiwyg/helper/node.ts


function findNodeBy(pos, condition) {
    var depth = pos.depth;
    while (depth) {
        var node = pos.node(depth);
        if (condition(node, depth)) {
            return {
                node: node,
                depth: depth,
                offset: depth > 0 ? pos.before(depth) : 0,
            };
        }
        depth -= 1;
    }
    return null;
}
function node_isListNode(_a) {
    var type = _a.type;
    return type.name === 'bulletList' || type.name === 'orderedList';
}
function isInListNode(pos) {
    return !!findNodeBy(pos, function (_a) {
        var type = _a.type;
        return type.name === 'listItem' || type.name === 'bulletList' || type.name === 'orderedList';
    });
}
function isInTableNode(pos) {
    return !!findNodeBy(pos, function (_a) {
        var type = _a.type;
        return type.name === 'tableHeadCell' || type.name === 'tableBodyCell';
    });
}
function findListItem(pos) {
    return findNodeBy(pos, function (_a) {
        var type = _a.type;
        return type.name === 'listItem';
    });
}
function createDOMInfoParsedRawHTML(tag) {
    return {
        tag: tag,
        getAttrs: function (dom) {
            var rawHTML = dom.getAttribute('data-raw-html');
            return __assign({}, (rawHTML && { rawHTML: rawHTML }));
        },
    };
}
function createCellAttrs(attrs) {
    return Object.keys(attrs).reduce(function (acc, attrName) {
        if (attrName !== 'rawHTML' && attrs[attrName]) {
            attrName = attrName === 'className' ? 'class' : attrName;
            acc[attrName] = attrs[attrName];
        }
        return acc;
    }, {});
}
function createParsedCellDOM(tag) {
    return {
        tag: tag,
        getAttrs: function (dom) {
            return ['rawHTML', 'colspan', 'rowspan', 'extended'].reduce(function (acc, attrName) {
                var attrNameInDOM = attrName === 'rawHTML' ? 'data-raw-html' : attrName;
                var attrValue = dom.getAttribute(attrNameInDOM);
                if (attrValue) {
                    acc[attrName] = includes(['rawHTML', 'extended'], attrName)
                        ? attrValue
                        : Number(attrValue);
                }
                return acc;
            }, {});
        },
    };
}
function getDefaultCustomAttrs() {
    return {
        htmlAttrs: { default: null },
        classNames: { default: null },
    };
}
function getCustomAttrs(attrs) {
    var htmlAttrs = attrs.htmlAttrs, classNames = attrs.classNames;
    return __assign(__assign({}, htmlAttrs), { class: classNames ? classNames.join(' ') : null });
}

;// CONCATENATED MODULE: ./src/wysiwyg/helper/tableOffsetMap.ts


var cache = new Map();
/* eslint-disable @typescript-eslint/no-unused-vars */
var TableOffsetMap = /** @class */ (function () {
    function TableOffsetMap(table, tableRows, tableStartPos, rowInfo) {
        this.table = table;
        this.tableRows = tableRows;
        this.tableStartPos = tableStartPos;
        this.rowInfo = rowInfo;
    }
    TableOffsetMap.create = function (cellPos) {
        var table = findNodeBy(cellPos, function (_a) {
            var type = _a.type;
            return type.name === 'table';
        });
        if (table) {
            var node = table.node, depth = table.depth, offset = table.offset;
            var cached = cache.get(node);
            if ((cached === null || cached === void 0 ? void 0 : cached.tableStartPos) === offset + 1) {
                return cached;
            }
            var rows_1 = [];
            var tablePos = cellPos.start(depth);
            var thead = node.child(0);
            var tbody = node.child(1);
            var theadCellInfo = createOffsetMap(thead, tablePos);
            var tbodyCellInfo = createOffsetMap(tbody, tablePos + thead.nodeSize);
            thead.forEach(function (row) { return rows_1.push(row); });
            tbody.forEach(function (row) { return rows_1.push(row); });
            var map = new TableOffsetMap(node, rows_1, tablePos, theadCellInfo.concat(tbodyCellInfo));
            cache.set(node, map);
            return map;
        }
        return null;
    };
    Object.defineProperty(TableOffsetMap.prototype, "totalRowCount", {
        get: function () {
            return this.rowInfo.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TableOffsetMap.prototype, "totalColumnCount", {
        get: function () {
            return this.rowInfo[0].length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TableOffsetMap.prototype, "tableStartOffset", {
        get: function () {
            return this.tableStartPos;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TableOffsetMap.prototype, "tableEndOffset", {
        get: function () {
            return this.tableStartPos + this.table.nodeSize - 1;
        },
        enumerable: false,
        configurable: true
    });
    TableOffsetMap.prototype.getCellInfo = function (rowIdx, colIdx) {
        return this.rowInfo[rowIdx][colIdx];
    };
    TableOffsetMap.prototype.posAt = function (rowIdx, colIdx) {
        for (var i = 0, rowStart = this.tableStartPos;; i += 1) {
            var rowEnd = rowStart + this.tableRows[i].nodeSize;
            if (i === rowIdx) {
                var index = colIdx;
                // Skip the cells from previous row(via rowspan)
                while (index < this.totalColumnCount && this.rowInfo[i][index].offset < rowStart) {
                    index += 1;
                }
                return index === this.totalColumnCount ? rowEnd : this.rowInfo[i][index].offset;
            }
            rowStart = rowEnd;
        }
    };
    TableOffsetMap.prototype.getNodeAndPos = function (rowIdx, colIdx) {
        var cellInfo = this.rowInfo[rowIdx][colIdx];
        return {
            node: this.table.nodeAt(cellInfo.offset - this.tableStartOffset),
            pos: cellInfo.offset,
        };
    };
    TableOffsetMap.prototype.extendedRowspan = function (rowIdx, colIdx) {
        return false;
    };
    TableOffsetMap.prototype.extendedColspan = function (rowIdx, colIdx) {
        return false;
    };
    TableOffsetMap.prototype.getRowspanCount = function (rowIdx, colIdx) {
        return 0;
    };
    TableOffsetMap.prototype.getColspanCount = function (rowIdx, colIdx) {
        return 0;
    };
    TableOffsetMap.prototype.decreaseColspanCount = function (rowIdx, colIdx) {
        return 0;
    };
    TableOffsetMap.prototype.decreaseRowspanCount = function (rowIdx, colIdx) {
        return 0;
    };
    TableOffsetMap.prototype.getColspanStartInfo = function (rowIdx, colIdx) {
        return null;
    };
    TableOffsetMap.prototype.getRowspanStartInfo = function (rowIdx, colIdx) {
        return null;
    };
    TableOffsetMap.prototype.getCellStartOffset = function (rowIdx, colIdx) {
        var offset = this.rowInfo[rowIdx][colIdx].offset;
        return this.extendedRowspan(rowIdx, colIdx) ? this.posAt(rowIdx, colIdx) : offset;
    };
    TableOffsetMap.prototype.getCellEndOffset = function (rowIdx, colIdx) {
        var _a = this.rowInfo[rowIdx][colIdx], offset = _a.offset, nodeSize = _a.nodeSize;
        return this.extendedRowspan(rowIdx, colIdx) ? this.posAt(rowIdx, colIdx) : offset + nodeSize;
    };
    TableOffsetMap.prototype.getCellIndex = function (cellPos) {
        for (var rowIdx = 0; rowIdx < this.totalRowCount; rowIdx += 1) {
            var rowInfo = this.rowInfo[rowIdx];
            for (var colIdx = 0; colIdx < this.totalColumnCount; colIdx += 1) {
                if (rowInfo[colIdx].offset + 1 > cellPos.pos) {
                    return [rowIdx, colIdx];
                }
            }
        }
        return [0, 0];
    };
    TableOffsetMap.prototype.getRectOffsets = function (startCellPos, endCellPos) {
        var _a, _b, _c;
        if (endCellPos === void 0) { endCellPos = startCellPos; }
        if (startCellPos.pos > endCellPos.pos) {
            _a = [endCellPos, startCellPos], startCellPos = _a[0], endCellPos = _a[1];
        }
        var _d = this.getCellIndex(startCellPos), startRowIdx = _d[0], startColIdx = _d[1];
        var _e = this.getCellIndex(endCellPos), endRowIdx = _e[0], endColIdx = _e[1];
        _b = getSortedNumPair(startRowIdx, endRowIdx), startRowIdx = _b[0], endRowIdx = _b[1];
        _c = getSortedNumPair(startColIdx, endColIdx), startColIdx = _c[0], endColIdx = _c[1];
        return this.getSpannedOffsets({ startRowIdx: startRowIdx, startColIdx: startColIdx, endRowIdx: endRowIdx, endColIdx: endColIdx });
    };
    TableOffsetMap.prototype.getSpannedOffsets = function (selectionInfo) {
        return selectionInfo;
    };
    return TableOffsetMap;
}());

/* eslint-enable @typescript-eslint/no-unused-vars */
var createOffsetMap = function (headOrBody, startOffset) {
    var cellInfoMatrix = [];
    headOrBody.forEach(function (row, rowOffset) {
        // get row index based on table(not table head or table body)
        var rowInfo = { rowspanMap: {}, colspanMap: {}, length: 0 };
        row.forEach(function (_a, cellOffset) {
            var nodeSize = _a.nodeSize;
            var colIdx = 0;
            while (rowInfo[colIdx]) {
                colIdx += 1;
            }
            rowInfo[colIdx] = {
                // 2 is the sum of the front and back positions of the tag
                offset: startOffset + rowOffset + cellOffset + 2,
                nodeSize: nodeSize,
            };
            rowInfo.length += 1;
        });
        cellInfoMatrix.push(rowInfo);
    });
    return cellInfoMatrix;
};
function mixinTableOffsetMapPrototype(offsetMapMixin, createOffsetMapMixin) {
    common_assign(TableOffsetMap.prototype, offsetMapMixin);
    createOffsetMap = createOffsetMapMixin;
    return TableOffsetMap;
}

;// CONCATENATED MODULE: ./src/helper/plugin.ts










function execPlugin(pluginInfo) {
    var plugin = pluginInfo.plugin, eventEmitter = pluginInfo.eventEmitter, usageStatistics = pluginInfo.usageStatistics, instance = pluginInfo.instance;
    var pmState = { Plugin: external_commonjs_prosemirror_state_commonjs2_prosemirror_state_amd_prosemirror_state_.Plugin, PluginKey: external_commonjs_prosemirror_state_commonjs2_prosemirror_state_amd_prosemirror_state_.PluginKey, Selection: external_commonjs_prosemirror_state_commonjs2_prosemirror_state_amd_prosemirror_state_.Selection, TextSelection: external_commonjs_prosemirror_state_commonjs2_prosemirror_state_amd_prosemirror_state_.TextSelection };
    var pmView = { Decoration: external_commonjs_prosemirror_view_commonjs2_prosemirror_view_amd_prosemirror_view_.Decoration, DecorationSet: external_commonjs_prosemirror_view_commonjs2_prosemirror_view_amd_prosemirror_view_.DecorationSet };
    var pmModel = { Fragment: external_commonjs_prosemirror_model_commonjs2_prosemirror_model_amd_prosemirror_model_.Fragment };
    var pmRules = { InputRule: external_commonjs_prosemirror_inputrules_commonjs2_prosemirror_inputrules_amd_prosemirror_inputrules_.InputRule, inputRules: external_commonjs_prosemirror_inputrules_commonjs2_prosemirror_inputrules_amd_prosemirror_inputrules_.inputRules, undoInputRule: external_commonjs_prosemirror_inputrules_commonjs2_prosemirror_inputrules_amd_prosemirror_inputrules_.undoInputRule };
    var pmKeymap = { keymap: external_commonjs_prosemirror_keymap_commonjs2_prosemirror_keymap_amd_prosemirror_keymap_.keymap };
    var context = {
        eventEmitter: eventEmitter,
        usageStatistics: usageStatistics,
        instance: instance,
        pmState: pmState,
        pmView: pmView,
        pmModel: pmModel,
        pmRules: pmRules,
        pmKeymap: pmKeymap,
        i18n: i18n,
    };
    if (isArray_default()(plugin)) {
        var pluginFn = plugin[0], _a = plugin[1], options = _a === void 0 ? {} : _a;
        return pluginFn(context, options);
    }
    return plugin(context);
}
function getPluginInfo(pluginsInfo) {
    var plugins = pluginsInfo.plugins, eventEmitter = pluginsInfo.eventEmitter, usageStatistics = pluginsInfo.usageStatistics, instance = pluginsInfo.instance;
    eventEmitter.listen('mixinTableOffsetMapPrototype', mixinTableOffsetMapPrototype);
    return (plugins !== null && plugins !== void 0 ? plugins : []).reduce(function (acc, plugin) {
        var pluginInfoResult = execPlugin({
            plugin: plugin,
            eventEmitter: eventEmitter,
            usageStatistics: usageStatistics,
            instance: instance,
        });
        if (!pluginInfoResult) {
            throw new Error('The return value of the executed plugin is empty.');
        }
        var markdownParsers = pluginInfoResult.markdownParsers, toHTMLRenderers = pluginInfoResult.toHTMLRenderers, toMarkdownRenderers = pluginInfoResult.toMarkdownRenderers, markdownPlugins = pluginInfoResult.markdownPlugins, wysiwygPlugins = pluginInfoResult.wysiwygPlugins, wysiwygNodeViews = pluginInfoResult.wysiwygNodeViews, markdownCommands = pluginInfoResult.markdownCommands, wysiwygCommands = pluginInfoResult.wysiwygCommands, toolbarItems = pluginInfoResult.toolbarItems;
        if (toHTMLRenderers) {
            acc.toHTMLRenderers = deepMergedCopy(acc.toHTMLRenderers, toHTMLRenderers);
        }
        if (toMarkdownRenderers) {
            acc.toMarkdownRenderers = deepMergedCopy(acc.toMarkdownRenderers, toMarkdownRenderers);
        }
        if (markdownPlugins) {
            acc.mdPlugins = acc.mdPlugins.concat(markdownPlugins);
        }
        if (wysiwygPlugins) {
            acc.wwPlugins = acc.wwPlugins.concat(wysiwygPlugins);
        }
        if (wysiwygNodeViews) {
            acc.wwNodeViews = tslib_es6_assign(tslib_es6_assign({}, acc.wwNodeViews), wysiwygNodeViews);
        }
        if (markdownCommands) {
            acc.mdCommands = tslib_es6_assign(tslib_es6_assign({}, acc.mdCommands), markdownCommands);
        }
        if (wysiwygCommands) {
            acc.wwCommands = tslib_es6_assign(tslib_es6_assign({}, acc.wwCommands), wysiwygCommands);
        }
        if (toolbarItems) {
            acc.toolbarItems = acc.toolbarItems.concat(toolbarItems);
        }
        if (markdownParsers) {
            acc.markdownParsers = tslib_es6_assign(tslib_es6_assign({}, acc.markdownParsers), markdownParsers);
        }
        return acc;
    }, {
        toHTMLRenderers: {},
        toMarkdownRenderers: {},
        mdPlugins: [],
        wwPlugins: [],
        wwNodeViews: {},
        mdCommands: {},
        wwCommands: {},
        toolbarItems: [],
        markdownParsers: {},
    });
}

// EXTERNAL MODULE: ../../node_modules/tui-code-snippet/type/isFalsy.js
var isFalsy = __webpack_require__(404);
var isFalsy_default = /*#__PURE__*/__webpack_require__.n(isFalsy);
;// CONCATENATED MODULE: ./src/event/eventEmitter.ts




var eventTypeList = [
    'afterPreviewRender',
    'updatePreview',
    'changeMode',
    'needChangeMode',
    'command',
    'changePreviewStyle',
    'changePreviewTabPreview',
    'changePreviewTabWrite',
    'scroll',
    'contextmenu',
    'show',
    'hide',
    'changeLanguage',
    'changeToolbarState',
    'toggleScrollSync',
    'mixinTableOffsetMapPrototype',
    'setFocusedNode',
    'removePopupWidget',
    'query',
    // provide event for user
    'openPopup',
    'closePopup',
    'addImageBlobHook',
    'beforePreviewRender',
    'beforeConvertWysiwygToMarkdown',
    'load',
    'loadUI',
    'change',
    'caretChange',
    'destroy',
    'focus',
    'blur',
    'keydown',
    'keyup',
];
/**
 * Class EventEmitter
 * @ignore
 */
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        var _this = this;
        this.events = new utils_map();
        this.eventTypes = eventTypeList.reduce(function (types, type) {
            return tslib_es6_assign(tslib_es6_assign({}, types), { type: type });
        }, {});
        this.hold = false;
        eventTypeList.forEach(function (eventType) {
            _this.addEventType(eventType);
        });
    }
    /**
     * Listen event and bind event handler
     * @param {string} type Event type string
     * @param {function} handler Event handler
     */
    EventEmitter.prototype.listen = function (type, handler) {
        var typeInfo = this.getTypeInfo(type);
        var eventHandlers = this.events.get(typeInfo.type) || [];
        if (!this.hasEventType(typeInfo.type)) {
            throw new Error("There is no event type " + typeInfo.type);
        }
        if (typeInfo.namespace) {
            handler.namespace = typeInfo.namespace;
        }
        eventHandlers.push(handler);
        this.events.set(typeInfo.type, eventHandlers);
    };
    /**
     * Emit event
     * @param {string} eventName Event name to emit
     * @returns {Array}
     */
    EventEmitter.prototype.emit = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var typeInfo = this.getTypeInfo(type);
        var eventHandlers = this.events.get(typeInfo.type);
        var results = [];
        if (!this.hold && eventHandlers) {
            eventHandlers.forEach(function (handler) {
                var result = handler.apply(void 0, args);
                if (!isUndefined_default()(result)) {
                    results.push(result);
                }
            });
        }
        return results;
    };
    /**
     * Emit given event and return result
     * @param {string} eventName Event name to emit
     * @param {any} source Source to change
     * @returns {string}
     */
    EventEmitter.prototype.emitReduce = function (type, source) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var eventHandlers = this.events.get(type);
        if (!this.hold && eventHandlers) {
            eventHandlers.forEach(function (handler) {
                var result = handler.apply(void 0, __spreadArray([source], args));
                if (!isFalsy_default()(result)) {
                    source = result;
                }
            });
        }
        return source;
    };
    /**
     * Get event type and namespace
     * @param {string} type Event type name
     * @returns {{type: string, namespace: string}}
     * @private
     */
    EventEmitter.prototype.getTypeInfo = function (type) {
        var splited = type.split('.');
        return {
            type: splited[0],
            namespace: splited[1],
        };
    };
    /**
     * Check whether event type exists or not
     * @param {string} type Event type name
     * @returns {boolean}
     * @private
     */
    EventEmitter.prototype.hasEventType = function (type) {
        return !isUndefined_default()(this.eventTypes[this.getTypeInfo(type).type]);
    };
    /**
     * Add event type when given event not exists
     * @param {string} type Event type name
     */
    EventEmitter.prototype.addEventType = function (type) {
        if (this.hasEventType(type)) {
            throw new Error("There is already have event type " + type);
        }
        this.eventTypes[type] = type;
    };
    /**
     * Remove event handler from given event type
     * @param {string} eventType Event type name
     * @param {function} [handler] - registered event handler
     */
    EventEmitter.prototype.removeEventHandler = function (eventType, handler) {
        var _this = this;
        var _a = this.getTypeInfo(eventType), type = _a.type, namespace = _a.namespace;
        if (type && handler) {
            this.removeEventHandlerWithHandler(type, handler);
        }
        else if (type && !namespace) {
            this.events.delete(type);
        }
        else if (!type && namespace) {
            this.events.forEach(function (_, evtType) {
                _this.removeEventHandlerWithTypeInfo(evtType, namespace);
            });
        }
        else if (type && namespace) {
            this.removeEventHandlerWithTypeInfo(type, namespace);
        }
    };
    /**
     * Remove event handler with event handler
     * @param {string} type - event type name
     * @param {function} handler - event handler
     * @private
     */
    EventEmitter.prototype.removeEventHandlerWithHandler = function (type, handler) {
        var eventHandlers = this.events.get(type);
        if (eventHandlers) {
            var handlerIndex = eventHandlers.indexOf(handler);
            if (eventHandlers.indexOf(handler) >= 0) {
                eventHandlers.splice(handlerIndex, 1);
            }
        }
    };
    /**
     * Remove event handler with event type information
     * @param {string} type Event type name
     * @param {string} namespace Event namespace
     * @private
     */
    EventEmitter.prototype.removeEventHandlerWithTypeInfo = function (type, namespace) {
        var handlersToSurvive = [];
        var eventHandlers = this.events.get(type);
        if (!eventHandlers) {
            return;
        }
        eventHandlers.map(function (handler) {
            if (handler.namespace !== namespace) {
                handlersToSurvive.push(handler);
            }
            return null;
        });
        this.events.set(type, handlersToSurvive);
    };
    EventEmitter.prototype.getEvents = function () {
        return this.events;
    };
    EventEmitter.prototype.holdEventInvoke = function (fn) {
        this.hold = true;
        fn();
        this.hold = false;
    };
    return EventEmitter;
}());
/* harmony default export */ var eventEmitter = (EventEmitter);

;// CONCATENATED MODULE: ./src/viewer.ts












var TASK_ATTR_NAME = 'data-task';
var DISABLED_TASK_ATTR_NAME = 'data-task-disabled';
var TASK_CHECKED_CLASS_NAME = 'checked';
function registerHTMLTagToWhitelist(convertorMap) {
    ['htmlBlock', 'htmlInline'].forEach(function (htmlType) {
        if (convertorMap[htmlType]) {
            // register tag white list for preventing to remove the html in sanitizer
            Object.keys(convertorMap[htmlType]).forEach(function (type) { return htmlSanitizer_registerTagWhitelistIfPossible(type); });
        }
    });
}
/**
 * Class ToastUIEditorViewer
 * @param {object} options Option object
 *     @param {HTMLElement} options.el - container element
 *     @param {string} [options.initialValue] Editor's initial value
 *     @param {Object} [options.events] - Events
 *         @param {function} [options.events.load] - It would be emitted when editor fully load
 *         @param {function} [options.events.change] - It would be emitted when content changed
 *         @param {function} [options.events.caretChange] - It would be emitted when format change by cursor position
 *         @param {function} [options.events.focus] - It would be emitted when editor get focus
 *         @param {function} [options.events.blur] - It would be emitted when editor loose focus
 *     @param {Array.<function|Array>} [options.plugins] - Array of plugins. A plugin can be either a function or an array in the form of [function, options].
 *     @param {Object} [options.extendedAutolinks] - Using extended Autolinks specified in GFM spec
 *     @param {Object} [options.linkAttributes] - Attributes of anchor element that should be rel, target, hreflang, type
 *     @param {Object} [options.customHTMLRenderer=null] - Object containing custom renderer functions correspond to change markdown node to preview HTML or wysiwyg node
 *     @param {boolean} [options.referenceDefinition=false] - whether use the specification of link reference definition
 *     @param {function} [options.customHTMLSanitizer=null] - custom HTML sanitizer
 *     @param {boolean} [options.frontMatter=false] - whether use the front matter
 *     @param {string} [options.theme] - The theme to style the viewer with. The default is included in toastui-editor.css.
 */
var ToastUIEditorViewer = /** @class */ (function () {
    function ToastUIEditorViewer(options) {
        var _this = this;
        this.options = extend_default()({
            linkAttributes: null,
            extendedAutolinks: false,
            customHTMLRenderer: null,
            referenceDefinition: false,
            customHTMLSanitizer: null,
            frontMatter: false,
            usageStatistics: true,
            theme: 'light',
        }, options);
        this.eventEmitter = new eventEmitter();
        var linkAttributes = sanitizeLinkAttribute(this.options.linkAttributes);
        var _a = getPluginInfo({
            plugins: this.options.plugins,
            eventEmitter: this.eventEmitter,
            usageStatistics: this.options.usageStatistics,
            instance: this,
        }) || {}, toHTMLRenderers = _a.toHTMLRenderers, markdownParsers = _a.markdownParsers;
        var _b = this.options, customHTMLRenderer = _b.customHTMLRenderer, extendedAutolinks = _b.extendedAutolinks, referenceDefinition = _b.referenceDefinition, frontMatter = _b.frontMatter, customHTMLSanitizer = _b.customHTMLSanitizer;
        var rendererOptions = {
            linkAttributes: linkAttributes,
            customHTMLRenderer: tslib_es6_assign(tslib_es6_assign({}, toHTMLRenderers), customHTMLRenderer),
            extendedAutolinks: extendedAutolinks,
            referenceDefinition: referenceDefinition,
            frontMatter: frontMatter,
            sanitizer: customHTMLSanitizer || sanitizeHTML,
        };
        registerHTMLTagToWhitelist(rendererOptions.customHTMLRenderer);
        if (this.options.events) {
            forEachOwnProperties_default()(this.options.events, function (fn, key) {
                _this.on(key, fn);
            });
        }
        var _c = this.options, el = _c.el, initialValue = _c.initialValue, theme = _c.theme;
        var existingHTML = el.innerHTML;
        if (theme !== 'light') {
            el.classList.add(cls(theme));
        }
        el.innerHTML = '';
        this.toastMark = new ToastMark('', {
            disallowedHtmlBlockTags: ['br', 'img'],
            extendedAutolinks: extendedAutolinks,
            referenceDefinition: referenceDefinition,
            disallowDeepHeading: true,
            frontMatter: frontMatter,
            customParser: markdownParsers,
        });
        this.preview = new mdPreview(this.eventEmitter, tslib_es6_assign(tslib_es6_assign({}, rendererOptions), { isViewer: true }));
        on_default()(this.preview.previewContent, 'mousedown', this.toggleTask.bind(this));
        if (initialValue) {
            this.setMarkdown(initialValue);
        }
        else if (existingHTML) {
            this.preview.setHTML(existingHTML);
        }
        el.appendChild(this.preview.previewContent);
        this.eventEmitter.emit('load', this);
    }
    /**
     * Toggle task by detecting mousedown event.
     * @param {MouseEvent} ev - event
     * @private
     */
    ToastUIEditorViewer.prototype.toggleTask = function (ev) {
        var element = ev.target;
        var style = getComputedStyle(element, ':before');
        if (!element.hasAttribute(DISABLED_TASK_ATTR_NAME) &&
            element.hasAttribute(TASK_ATTR_NAME) &&
            isPositionInBox(style, ev.offsetX, ev.offsetY)) {
            toggleClass(element, TASK_CHECKED_CLASS_NAME);
            this.eventEmitter.emit('change', {
                source: 'viewer',
                date: ev,
            });
        }
    };
    /**
     * Set content for preview
     * @param {string} markdown Markdown text
     */
    ToastUIEditorViewer.prototype.setMarkdown = function (markdown) {
        var lineTexts = this.toastMark.getLineTexts();
        var length = lineTexts.length;
        var lastLine = common_last(lineTexts);
        var endSourcepos = [length, lastLine.length + 1];
        var editResult = this.toastMark.editMarkdown([1, 1], endSourcepos, markdown || '');
        this.eventEmitter.emit('updatePreview', editResult);
    };
    /**
     * Bind eventHandler to event type
     * @param {string} type Event type
     * @param {function} handler Event handler
     */
    ToastUIEditorViewer.prototype.on = function (type, handler) {
        this.eventEmitter.listen(type, handler);
    };
    /**
     * Unbind eventHandler from event type
     * @param {string} type Event type
     */
    ToastUIEditorViewer.prototype.off = function (type) {
        this.eventEmitter.removeEventHandler(type);
    };
    /**
     * Add hook to TUIEditor event
     * @param {string} type Event type
     * @param {function} handler Event handler
     */
    ToastUIEditorViewer.prototype.addHook = function (type, handler) {
        this.eventEmitter.removeEventHandler(type);
        this.eventEmitter.listen(type, handler);
    };
    /**
     * Remove Viewer preview from document
     */
    ToastUIEditorViewer.prototype.destroy = function () {
        off_default()(this.preview.el, 'mousedown', this.toggleTask.bind(this));
        this.preview.destroy();
        this.eventEmitter.emit('destroy');
    };
    /**
     * Return true
     * @returns {boolean}
     */
    ToastUIEditorViewer.prototype.isViewer = function () {
        return true;
    };
    /**
     * Return false
     * @returns {boolean}
     */
    ToastUIEditorViewer.prototype.isMarkdownMode = function () {
        return false;
    };
    /**
     * Return false
     * @returns {boolean}
     */
    ToastUIEditorViewer.prototype.isWysiwygMode = function () {
        return false;
    };
    return ToastUIEditorViewer;
}());
/* harmony default export */ var viewer = (ToastUIEditorViewer);

;// CONCATENATED MODULE: ./src/indexViewer.ts


/* harmony default export */ var indexViewer = (viewer);

}();
__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});
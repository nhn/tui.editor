/**
 * @fileoverview Implements htmlSanitizer
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';
import isString from 'tui-code-snippet/type/isString';

import domUtils from './utils/dom';

const HTML_ATTR_LIST_RX = new RegExp(
  '^(abbr|align|alt|axis|bgcolor|border|cellpadding|cellspacing|class|clear|' +
    'color|cols|compact|coords|dir|face|headers|height|hreflang|hspace|' +
    'ismap|lang|language|nohref|nowrap|rel|rev|rows|rules|' +
    'scope|scrolling|shape|size|span|start|summary|tabindex|target|title|type|' +
    'valign|value|vspace|width|checked|mathvariant|encoding|id|name|' +
    'background|cite|href|longdesc|src|usemap|xlink:href|data-+|checked|style)',
  'g'
);

const SVG_ATTR_LIST_RX = new RegExp(
  '^(accent-height|accumulate|additive|alphabetic|arabic-form|ascent|' +
    'baseProfile|bbox|begin|by|calcMode|cap-height|class|color|color-rendering|content|' +
    'cx|cy|d|dx|dy|descent|display|dur|end|fill|fill-rule|font-family|font-size|font-stretch|' +
    'font-style|font-variant|font-weight|from|fx|fy|g1|g2|glyph-name|gradientUnits|hanging|' +
    'height|horiz-adv-x|horiz-origin-x|ideographic|k|keyPoints|keySplines|keyTimes|lang|' +
    'marker-end|marker-mid|marker-start|markerHeight|markerUnits|markerWidth|mathematical|' +
    'max|min|offset|opacity|orient|origin|overline-position|overline-thickness|panose-1|' +
    'path|pathLength|points|preserveAspectRatio|r|refX|refY|repeatCount|repeatDur|' +
    'requiredExtensions|requiredFeatures|restart|rotate|rx|ry|slope|stemh|stemv|stop-color|' +
    'stop-opacity|strikethrough-position|strikethrough-thickness|stroke|stroke-dasharray|' +
    'stroke-dashoffset|stroke-linecap|stroke-linejoin|stroke-miterlimit|stroke-opacity|' +
    'stroke-width|systemLanguage|target|text-anchor|to|transform|type|u1|u2|underline-position|' +
    'underline-thickness|unicode|unicode-range|units-per-em|values|version|viewBox|visibility|' +
    'width|widths|x|x-height|x1|x2|xlink:actuate|xlink:arcrole|xlink:role|xlink:show|xlink:title|' +
    'xlink:type|xml:base|xml:lang|xml:space|xmlns|xmlns:xlink|y|y1|y2|zoomAndPan)',
  'g'
);

const XSS_ATTR_RX = /href|src|background/gi;
const XSS_VALUE_RX = /((java|vb|live)script|x):/gi;
const ON_EVENT_RX = /^on\S+/;

/**
 * htmlSanitizer
 * @param {string|Node} html - html or Node
 * @param {boolean} [needHtmlText] - pass true if need html text
 * @returns {string|DocumentFragment} - result
 * @ignore
 */
function htmlSanitizer(html, needHtmlText) {
  const root = document.createElement('div');

  if (isString(html)) {
    html = html.replace(/<!--[\s\S]*?-->/g, '');
    root.innerHTML = html;
  } else {
    root.appendChild(html);
  }

  removeUnnecessaryTags(root);
  leaveOnlyWhitelistAttribute(root);

  return domUtils.finalizeHtml(root, needHtmlText);
}

/**
 * Removes unnecessary tags.
 * @param {HTMLElement} html - root element
 * @private
 */
function removeUnnecessaryTags(html) {
  const removedTags = domUtils.findAll(
    html,
    'script, iframe, textarea, form, button, select, input, meta, style, link, title, embed, object, details, summary'
  );

  removedTags.forEach(node => {
    domUtils.remove(node);
  });
}

/**
 * Checks whether the attribute and value that causing XSS or not.
 * @param {string} attrName - name of attribute
 * @param {string} attrValue - value of attirbute
 * @param {boolean} state
 * @private
 */
function isXSSAttribute(attrName, attrValue) {
  return attrName.match(XSS_ATTR_RX) && attrValue.match(XSS_VALUE_RX);
}

/**
 * Removes attributes of blacklist from node.
 * @param {HTMLElement} node - node to remove attributes
 * @param {NamedNodeMap} blacklistAttrs - attributes of blacklist
 * @private
 */
function removeBlacklistAttributes(node, blacklistAttrs) {
  toArray(blacklistAttrs).forEach(({ name }) => {
    if (ON_EVENT_RX.test(name)) {
      node[name] = null;
    }

    if (node.getAttribute(name)) {
      node.removeAttribute(name);
    }
  });
}

/**
 * Leaves only white list attributes.
 * @param {HTMLElement} html - root element
 * @private
 */
function leaveOnlyWhitelistAttribute(html) {
  domUtils.findAll(html, '*').forEach(node => {
    const { attributes } = node;
    const blacklist = toArray(attributes).filter(attr => {
      const { name, value } = attr;
      const htmlAttr = name.match(HTML_ATTR_LIST_RX);
      const svgAttr = name.match(SVG_ATTR_LIST_RX);
      const xssAttr = htmlAttr && isXSSAttribute(name, value);

      return (!htmlAttr && !svgAttr) || xssAttr;
    });

    removeBlacklistAttributes(node, blacklist);
  });
}

export default htmlSanitizer;

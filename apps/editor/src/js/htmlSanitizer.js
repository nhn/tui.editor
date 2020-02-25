/**
 * @fileoverview Implements htmlSanitizer
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';
import isString from 'tui-code-snippet/type/isString';

import domUtils from './domUtils';

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

const ATTR_VALUE_BLACK_LIST_RX = {
  href: /^(javascript:).*/g
};

/**
 * htmlSanitizer
 * @param {string|Node} html html or Node
 * @param {boolean} [needHtmlText] pass true if need html text
 * @returns {string|DocumentFragment} result
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
  removeInvalidAttributeValues(root);

  return finalizeHtml(root, needHtmlText);
}

/**
 * Remove unnecessary tags
 * @private
 * @param {HTMLElement} html root element
 */
function removeUnnecessaryTags(html) {
  const removedTags = domUtils.findAll(
    html,
    'script, iframe, textarea, form, button, select, meta, style, link, title, embed, object, details, summary'
  );

  removedTags.forEach(node => {
    domUtils.remove(node);
  });
}

/**
 * Leave only white list attributes
 * @private
 * @param {HTMLElement} html root element
 */
function leaveOnlyWhitelistAttribute(html) {
  domUtils.findAll(html, '*').forEach(node => {
    const attrs = node.attributes;
    const blacklist = toArray(attrs).filter(attr => {
      const isHTMLAttr = attr.name.match(HTML_ATTR_LIST_RX);
      const isSVGAttr = attr.name.match(SVG_ATTR_LIST_RX);

      return !isHTMLAttr && !isSVGAttr;
    });

    toArray(blacklist).forEach(attr => {
      // Edge svg attribute name returns uppercase bug. error guard.
      // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5579311/
      if (attrs.getNamedItem(attr.name)) {
        attrs.removeNamedItem(attr.name);
      }
    });
  });
}

/**
 * Remove invalid attribute values
 * @private
 * @param {HTMLElement} html root element
 */
function removeInvalidAttributeValues(html) {
  for (const attr in ATTR_VALUE_BLACK_LIST_RX) {
    if (ATTR_VALUE_BLACK_LIST_RX.hasOwnProperty(attr)) {
      domUtils.findAll(html, `[${attr}]`).forEach(node => {
        const attrs = node.attributes;
        const valueBlackListRX = ATTR_VALUE_BLACK_LIST_RX[attr];
        const attrItem = attrs.getNamedItem(attr);

        if (valueBlackListRX && attrItem && attrItem.value.toLowerCase().match(valueBlackListRX)) {
          attrs.removeNamedItem(attr);
        }
      });
    }
  }
}

/**
 * Finalize html result
 * @private
 * @param {HTMLElement} html root element
 * @param {boolean} needHtmlText pass true if need html text
 * @returns {string|DocumentFragment} result
 */
function finalizeHtml(html, needHtmlText) {
  let returnValue;

  if (needHtmlText) {
    returnValue = html.innerHTML;
  } else {
    const frag = document.createDocumentFragment();
    const childNodes = toArray(html.childNodes);
    const { length } = childNodes;

    for (let i = 0; i < length; i += 1) {
      frag.appendChild(childNodes[i]);
    }
    returnValue = frag;
  }

  return returnValue;
}

export default htmlSanitizer;

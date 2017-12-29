/**
 * @fileoverview Implements htmlSanitizer
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';
import util from 'tui-code-snippet';

const HTML_ATTR_LIST_RX = new RegExp('^(abbr|align|alt|axis|bgcolor|border|cellpadding|cellspacing|class|clear|' +
    'color|cols|compact|coords|dir|face|headers|height|hreflang|hspace|' +
    'ismap|lang|language|nohref|nowrap|rel|rev|rows|rules|' +
    'scope|scrolling|shape|size|span|start|summary|tabindex|target|title|type|' +
    'valign|value|vspace|width|checked|mathvariant|encoding|id|name|' +
    'background|cite|href|longdesc|src|usemap|xlink:href|data-+|checked|style)', 'g');

const SVG_ATTR_LIST_RX = new RegExp('^(accent-height|accumulate|additive|alphabetic|arabic-form|ascent|' +
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
    'xlink:type|xml:base|xml:lang|xml:space|xmlns|xmlns:xlink|y|y1|y2|zoomAndPan)', 'g');

/**
 * htmlSanitizer
 * @param {string|Node} html html or Node
 * @param {boolean} [needHtmlText] pass true if need html text
 * @returns {string|DocumentFragment} result
 * @ignore
 */
function htmlSanitizer(html, needHtmlText) {
  const $html = $('<div />');

  html = html.replace(/<!--[\s\S]*?-->/g, '');

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
  $html.find('script, iframe, textarea, form, button, select, meta, style, link, title').remove();
}

/**
 * Leave only white list attributes
 * @private
 * @param {jQuery} $html jQuery instance
 */
function leaveOnlyWhitelistAttribute($html) {
  $html.find('*').each((index, node) => {
    const attrs = node.attributes;
    const blacklist = util.toArray(attrs).filter(attr => {
      const isHTMLAttr = attr.name.match(HTML_ATTR_LIST_RX);
      const isSVGAttr = attr.name.match(SVG_ATTR_LIST_RX);

      return !isHTMLAttr && !isSVGAttr;
    });

    util.forEachArray(blacklist, attr => {
      // Edge svg attribute name returns uppercase bug. error guard.
      // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/5579311/
      if (attrs.getNamedItem(attr.name)) {
        attrs.removeNamedItem(attr.name);
      }
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
  let returnValue;

  if (needHtmlText) {
    returnValue = $html[0].innerHTML;
  } else {
    const frag = document.createDocumentFragment();
    const childNodes = util.toArray($html[0].childNodes);
    const {length} = childNodes;

    for (let i = 0; i < length; i += 1) {
      frag.appendChild(childNodes[i]);
    }
    returnValue = frag;
  }

  return returnValue;
}

export default htmlSanitizer;

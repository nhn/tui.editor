import toArray from 'tui-code-snippet/collection/toArray';
import isString from 'tui-code-snippet/type/isString';

import { finalizeHtml, findNodes, removeNode } from '@/utils/dom';
import { includes } from '@/utils/common';
import { TAG_NAME } from '@/utils/constants';

type GlobalEventTypes = keyof Omit<
  Omit<GlobalEventHandlers, 'addEventListener'>,
  'removeEventListener'
>;

const reHTMLAttr = new RegExp(
  '^(abbr|align|alt|axis|bgcolor|border|cellpadding|cellspacing|class|clear|' +
    'color|cols|compact|coords|dir|face|headers|height|hreflang|hspace|' +
    'ismap|lang|language|nohref|nowrap|rel|rev|rows|rules|' +
    'scope|scrolling|shape|size|span|start|summary|tabindex|target|title|type|' +
    'valign|value|vspace|width|checked|mathvariant|encoding|id|name|' +
    'background|cite|href|longdesc|src|usemap|xlink:href|data-+|checked|style)',
  'g'
);

const reSvgAttr = new RegExp(
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

const reXSSAttr = /href|src|background/i;
const reXSSAttrValue = /((java|vb|live)script|x):/i;
const reOnEvent = /^on\S+/i;
const reXSSOnload = new RegExp(`(<${TAG_NAME}[^>]*)(onload\\s*=)`, 'ig');
const reComment = /<!--[\s\S]*?-->/g;
const reWhitespace = /[ \t\r\n]/g;
const DEFAULT_TAG_BLACK_LIST = [
  'script',
  'iframe',
  'textarea',
  'form',
  'button',
  'select',
  'input',
  'meta',
  'style',
  'link',
  'title',
  'embed',
  'object',
  'details',
  'summary',
  'base',
];
const CAN_BE_TAG_WHITE_LIST = ['iframe', 'embed', 'details', 'summary'];
const tagBlacklist = [...DEFAULT_TAG_BLACK_LIST];

export function registerTagWhitelistIfPossible(tagName: string) {
  if (includes(CAN_BE_TAG_WHITE_LIST, tagName)) {
    const index = tagBlacklist.indexOf(tagName);

    if (index > -1) {
      tagBlacklist.splice(index, 1);
    }
  }
}

export function sanitizeHTML(html: string) {
  const root = document.createElement('div');

  if (isString(html)) {
    html = html.replace(reComment, '').replace(reXSSOnload, '$1');
    root.innerHTML = html;
  }

  removeUnnecessaryTags(root);
  leaveOnlyWhitelistAttribute(root);

  return finalizeHtml(root, true) as string;
}

function removeUnnecessaryTags(html: HTMLElement) {
  const removedTags = findNodes(html, tagBlacklist.join(','));

  removedTags.forEach((node) => {
    removeNode(node);
  });
}

function isXSSAttribute(attrName: string, attrValue: string) {
  return attrName.match(reXSSAttr) && attrValue.replace(reWhitespace, '').match(reXSSAttrValue);
}

function removeBlacklistAttributes(node: HTMLElement, blacklistAttrs: Attr[]) {
  blacklistAttrs.forEach(({ name }: Attr) => {
    if (reOnEvent.test(name)) {
      node[name as GlobalEventTypes] = null;
    }
    node.removeAttribute(name);
  });
}

function leaveOnlyWhitelistAttribute(html: HTMLElement) {
  findNodes(html, '*').forEach((node) => {
    const { attributes } = node as HTMLElement;

    const blacklist = toArray(attributes).filter((attr) => {
      const { name, value } = attr;
      const htmlAttr = name.match(reHTMLAttr);
      const svgAttr = name.match(reSvgAttr);
      const xssAttr = htmlAttr && isXSSAttribute(name, value);

      return (!htmlAttr && !svgAttr) || xssAttr;
    });

    removeBlacklistAttributes(node as HTMLElement, blacklist);
  });
}

export function sanitizeXSSAttributeValue(attrValue: string) {
  attrValue = attrValue.replace(reComment, '');

  return reXSSAttrValue.test(attrValue) ? '' : attrValue;
}

import { Node, Mark } from 'prosemirror-model';

const TAG_NAME = '[A-Za-z][A-Za-z0-9-]*';
const ATTRIBUTE_NAME = '[a-zA-Z_:][a-zA-Z0-9:._-]*';
const UNQUOTED_VALUE = '[^"\'=<>`\\x00-\\x20]+';

const SINGLE_QUOTED_VALUE = "'[^']*'";
const DOUBLE_QUOTED_VALUE = '"[^"]*"';

const ATTRIBUTE_VALUE = `(?:${UNQUOTED_VALUE}|${SINGLE_QUOTED_VALUE}|${DOUBLE_QUOTED_VALUE})`;
const ATTRIBUTE_VALUE_SPEC = `${'(?:\\s*=\\s*'}${ATTRIBUTE_VALUE})`;
const ATTRIBUTE = `${'(?:\\s+'}${ATTRIBUTE_NAME}${ATTRIBUTE_VALUE_SPEC}?)`;

const OPEN_TAG = `<(${TAG_NAME})(${ATTRIBUTE})*\\s*/?>`;
const CLOSE_TAG = `</(${TAG_NAME})\\s*[>]`;

const HTML_TAG = `(?:${OPEN_TAG}|${CLOSE_TAG})`;

export const reHTMLTag = new RegExp(`^${HTML_TAG}`, 'i');

export function getMatchedAttributeValue(rawHTML: string, attrName: string) {
  const wrapper = document.createElement('div');

  wrapper.innerHTML = rawHTML;

  const el = wrapper.firstChild as HTMLElement;

  return el.getAttribute(attrName) || '';
}

export function addBackticks(node: Node, side: number) {
  const ticks = /`+/g;
  let len = 0;

  if (node.isText && node.text) {
    let matched = ticks.exec(node.text);

    while (matched) {
      len = Math.max(len, matched[0].length);
      matched = ticks.exec(node.text);
    }
  }

  let result = len > 0 && side > 0 ? ' `' : '`';

  for (let i = 0; i < len; i += 1) {
    result += '`';
  }

  if (len > 0 && side < 0) {
    result += ' ';
  }

  return result;
}

export function mergeMarkText(a: Node, b: Node) {
  if (a.isText && b.isText && Mark.sameSet(a.marks, b.marks)) {
    // @ts-ignore
    // type is not defined for "withText" in prosemirror-model
    return a.withText(a.text! + b.text);
  }

  return false;
}

export function getTextWithoutTrailingNewline(text: string) {
  return text[text.length - 1] === '\n' ? text.slice(0, text.length - 1) : text;
}

export function isBRTag(html: string) {
  return /<br ?\/?>/.test(html);
}

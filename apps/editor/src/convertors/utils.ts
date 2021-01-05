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

const FOUND_ATTRIBUTE_VALUE = `\\s*=\\s*(?:[""']([^""']*)[""']|(\\S+))`;

export function getMatchedAttributeValue(tag: string, attrName: string) {
  const reAttrValue = new RegExp(`${attrName}${FOUND_ATTRIBUTE_VALUE}`, 'i');
  const matched = tag.match(reAttrValue);

  if (matched) {
    return matched[1];
  }

  return '';
}

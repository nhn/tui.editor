import encode from 'mdurl/encode';
import decode from 'mdurl/decode';

const C_BACKSLASH = 92;

import { decodeHTML } from 'entities';

export const ENTITY = '&(?:#x[a-f0-9]{1,6}|#[0-9]{1,7}|[a-z][a-z0-9]{1,31});';

const TAGNAME = '[A-Za-z][A-Za-z0-9-]*';
const ATTRIBUTENAME = '[a-zA-Z_:][a-zA-Z0-9:._-]*';
const UNQUOTEDVALUE = '[^"\'=<>`\\x00-\\x20]+';
const SINGLEQUOTEDVALUE = "'[^']*'";
const DOUBLEQUOTEDVALUE = '"[^"]*"';
const ATTRIBUTEVALUE = `(?:${UNQUOTEDVALUE}|${SINGLEQUOTEDVALUE}|${DOUBLEQUOTEDVALUE})`;
const ATTRIBUTEVALUESPEC = `${'(?:' + '\\s*=' + '\\s*'}${ATTRIBUTEVALUE})`;
const ATTRIBUTE = `${'(?:' + '\\s+'}${ATTRIBUTENAME}${ATTRIBUTEVALUESPEC}?)`;
export const OPENTAG = `<${TAGNAME}${ATTRIBUTE}*` + `\\s*/?>`;
export const CLOSETAG = `</${TAGNAME}\\s*[>]`;
const HTMLCOMMENT = '<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->';
const PROCESSINGINSTRUCTION = '[<][?].*?[?][>]';
const DECLARATION = '<![A-Z]+' + '\\s+[^>]*>';
const CDATA = '<!\\[CDATA\\[[\\s\\S]*?\\]\\]>';
const HTMLTAG = `(?:${OPENTAG}|${CLOSETAG}|${HTMLCOMMENT}|${PROCESSINGINSTRUCTION}|${DECLARATION}|${CDATA})`;
export const reHtmlTag = new RegExp(`^${HTMLTAG}`, 'i');

const reBackslashOrAmp = /[\\&]/;

export const ESCAPABLE = '[!"#$%&\'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]';

const reEntityOrEscapedChar = new RegExp(`\\\\${ESCAPABLE}|${ENTITY}`, 'gi');

const XMLSPECIAL = '[&<>"]';

const reXmlSpecial = new RegExp(XMLSPECIAL, 'g');

const unescapeChar = function(s: string) {
  if (s.charCodeAt(0) === C_BACKSLASH) {
    return s.charAt(1);
  }
  return decodeHTML(s);
};

// Replace entities and backslash escapes with literal characters.
export const unescapeString = function(s: string) {
  if (reBackslashOrAmp.test(s)) {
    return s.replace(reEntityOrEscapedChar, unescapeChar);
  }
  return s;
};

export const normalizeURI = function(uri: string) {
  try {
    return encode(decode(uri));
  } catch (err) {
    return uri;
  }
};

const replaceUnsafeChar = function(s: string) {
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
};

export const escapeXml = function(s: string) {
  if (reXmlSpecial.test(s)) {
    return s.replace(reXmlSpecial, replaceUnsafeChar);
  }
  return s;
};

export function repeat(str: string, count: number): string {
  const arr = [];
  for (let i = 0; i < count; i++) {
    arr.push(str);
  }
  return arr.join('');
}

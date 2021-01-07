import { sanitizeXSSAttributeValue } from '@/sanitizer/htmlSanitizer';

import { HTMLToWwConvertorMap, FlattenHTMLToWwConvertorMap } from '@t/convertor';

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

function getMatchedAttributeValue(rawHTML: string, attrName: string) {
  const wrapper = document.createElement('div');

  wrapper.innerHTML = rawHTML;

  const el = wrapper.firstChild as HTMLElement;

  return el.getAttribute(attrName) || '';
}

function createConvertors(convertors: HTMLToWwConvertorMap) {
  const convertorMap: FlattenHTMLToWwConvertorMap = {};

  Object.keys(convertors).forEach(key => {
    const tagNames = key.split(', ');

    tagNames.forEach(tagName => {
      const name = tagName.toLowerCase();

      convertorMap[name] = convertors[key]!;
    });
  });

  return convertorMap;
}

const convertors: HTMLToWwConvertorMap = {
  'b, strong': (state, _, openTagName) => {
    const { strong } = state.schema.marks;

    if (openTagName) {
      state.openMark(strong.create({ rawHTML: openTagName }));
    } else {
      state.closeMark(strong);
    }
  },

  'i, em': (state, _, openTagName) => {
    const { emph } = state.schema.marks;

    if (openTagName) {
      state.openMark(emph.create({ rawHTML: openTagName }));
    } else {
      state.closeMark(emph);
    }
  },

  's, del': (state, _, openTagName) => {
    const { strike } = state.schema.marks;

    if (openTagName) {
      state.openMark(strike.create({ rawHTML: openTagName }));
    } else {
      state.closeMark(strike);
    }
  },

  code: (state, _, openTagName) => {
    const { code } = state.schema.marks;

    if (openTagName) {
      state.openMark(code.create({ rawHTML: openTagName }));
    } else {
      state.closeMark(code);
    }
  },

  a: (state, node, openTagName) => {
    const tag = node.literal!;
    const { link } = state.schema.marks;

    if (openTagName) {
      const linkUrl = getMatchedAttributeValue(tag, 'href');

      state.openMark(
        link.create({
          linkUrl: sanitizeXSSAttributeValue(linkUrl),
          rawHTML: openTagName
        })
      );
    } else {
      state.closeMark(link);
    }
  },

  img: (state, node, openTagName) => {
    const tag = node.literal!;
    const imageUrl = getMatchedAttributeValue(tag, 'src');

    if (imageUrl) {
      const altText = getMatchedAttributeValue(tag, 'alt');
      const { image } = state.schema.nodes;

      state.addNode(image, {
        rawHTML: openTagName,
        imageUrl: sanitizeXSSAttributeValue(imageUrl),
        ...(altText && { altText })
      });
    }
  },

  hr: (state, _, openTagName) => {
    state.addNode(state.schema.nodes.thematicBreak, { rawHTML: openTagName });
  },

  br: (state, _, openTagName) => {
    state.addNode(state.schema.nodes.lineBreak, { rawHTML: openTagName });
  }
};

export const htmlToWwConvertors = createConvertors(convertors);

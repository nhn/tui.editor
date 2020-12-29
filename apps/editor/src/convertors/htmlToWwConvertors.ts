import { sanitizeXssAttributeValue } from '@/sanitizer/htmlSanitizer';

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

const reHTMLTag = new RegExp(`^${HTML_TAG}`, 'i');

const FOUND_ATTRIBUTE_VALUE = `\\s*=\\s*(?:[""']([^""']*)[""']|(\\S+))`;

function getMatchedAttributeValue(tag: string, attrName: string) {
  const reAttrValue = new RegExp(`${attrName}${FOUND_ATTRIBUTE_VALUE}`, 'i');
  const matched = tag.match(reAttrValue);

  if (matched) {
    return matched[1];
  }

  return null;
}

function createConvertors(convertors: HTMLToWwConvertorMap) {
  const convertorMap: FlattenHTMLToWwConvertorMap = {};

  Object.keys(convertors).forEach(key => {
    const tagNames = key.split(', ');

    tagNames.forEach(tagName => {
      convertorMap[tagName] = convertors[key]!;
    });
  });

  return convertorMap;
}

const htmlConvertors: HTMLToWwConvertorMap = {
  'b, strong': (state, node, { entering }) => {
    const tag = node.literal!;
    const matched = tag.match(reHTMLTag);

    if (matched) {
      const [, tagName] = matched;
      const { strong } = state.schema.marks;

      if (entering) {
        state.openMark(strong.create({ htmlToken: tagName }));
      } else {
        state.closeMark(strong);
      }
    }
  },

  'i, em': (state, node, { entering }) => {
    const tag = node.literal!;
    const matched = tag.match(reHTMLTag);

    if (matched) {
      const [, tagName] = matched;
      const { emph } = state.schema.marks;

      if (entering) {
        state.openMark(emph.create({ htmlToken: tagName }));
      } else {
        state.closeMark(emph);
      }
    }
  },

  's, del': (state, node, { entering }) => {
    const tag = node.literal!;
    const matched = tag.match(reHTMLTag);

    if (matched) {
      const [, tagName] = matched;
      const { strike } = state.schema.marks;

      if (entering) {
        state.openMark(strike.create({ htmlToken: tagName }));
      } else {
        state.closeMark(strike);
      }
    }
  },

  code: (state, node, { entering }) => {
    const tag = node.literal!;
    const matched = tag.match(reHTMLTag);

    if (matched) {
      const [, tagName] = matched;
      const { code } = state.schema.marks;

      if (entering) {
        state.openMark(code.create({ htmlToken: tagName }));
      } else {
        state.closeMark(code);
      }
    }
  },

  a: (state, node, { entering }) => {
    const tag = node.literal!;
    const linkUrl = getMatchedAttributeValue(tag, 'href');

    if (linkUrl) {
      const { link } = state.schema.marks;

      if (entering) {
        state.openMark(
          link.create({
            linkUrl: sanitizeXssAttributeValue(linkUrl),
            htmlToken: true
          })
        );
      } else {
        state.closeMark(link);
      }
    }
  },

  img: (state, node) => {
    const tag = node.literal!;
    const imageUrl = getMatchedAttributeValue(tag, 'src');

    if (imageUrl) {
      const altText = getMatchedAttributeValue(tag, 'alt');
      const { image } = state.schema.nodes;

      state.addNode(image, {
        htmlToken: true,
        imageUrl: sanitizeXssAttributeValue(imageUrl),
        ...(altText && { altText })
      });
    }
  },

  hr: state => {
    state.addNode(state.schema.nodes.thematicBreak);
  },

  br: (state, node, { entering }) => {
    if (entering) {
      const { lineBreak } = state.schema.nodes;
      const inCell = node.parent!.type === 'tableCell';

      state.addNode(lineBreak, { htmlToken: true, inCell });
    }
  }
};

const htmlToWwConvertors = createConvertors(htmlConvertors);

export function getHTMLToWwConvertor(tag: string) {
  const matched = tag.match(reHTMLTag);

  if (matched) {
    const [, tagName] = matched;

    return htmlToWwConvertors[tagName];
  }

  return null;
}

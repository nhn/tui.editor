import { getMatchedAttributeValue } from './utils';
import { sanitizeXSSAttributeValue } from '@/sanitizer/htmlSanitizer';

import { HTMLToWwConvertorMap, FlattenHTMLToWwConvertorMap } from '@t/convertor';

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

const convertors: HTMLToWwConvertorMap = {
  'b, strong': (state, _, openTagName) => {
    const { strong } = state.schema.marks;

    if (openTagName) {
      state.openMark(strong.create({ htmlToken: openTagName }));
    } else {
      state.closeMark(strong);
    }
  },

  'i, em': (state, _, openTagName) => {
    const { emph } = state.schema.marks;

    if (openTagName) {
      state.openMark(emph.create({ htmlToken: openTagName }));
    } else {
      state.closeMark(emph);
    }
  },

  's, del': (state, _, openTagName) => {
    const { strike } = state.schema.marks;

    if (openTagName) {
      state.openMark(strike.create({ htmlToken: openTagName }));
    } else {
      state.closeMark(strike);
    }
  },

  code: (state, _, openTagName) => {
    const { code } = state.schema.marks;

    if (openTagName) {
      state.openMark(code.create({ htmlToken: openTagName }));
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
          htmlToken: true
        })
      );
    } else {
      state.closeMark(link);
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
        imageUrl: sanitizeXSSAttributeValue(imageUrl),
        ...(altText && { altText })
      });
    }
  },

  hr: state => {
    state.addNode(state.schema.nodes.thematicBreak, { htmlToken: true });
  },

  br: state => {
    state.addNode(state.schema.nodes.lineBreak, { htmlToken: true });
  }
};

export const htmlToWwConvertors = createConvertors(convertors);

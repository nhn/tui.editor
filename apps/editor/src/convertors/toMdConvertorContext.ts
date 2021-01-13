import { ProsemirrorNode } from 'prosemirror-model';

import { repeat, escape } from './toMdConvertorHelper';

import { ToMdOriginConvertorContextMap } from '@t/convertor';
import { WwNodeType } from '@t/wysiwyg';

const toMdConvertorContextMap: ToMdOriginConvertorContextMap = {
  heading: ({ attrs }: ProsemirrorNode) => {
    const { level } = attrs;
    let delim = repeat('#', level);

    if (attrs.headingType === 'setext') {
      delim = level === 1 ? '===' : '---';
    }

    return {
      delim
    };
  },

  codeBlock: ({ attrs, textContent }: ProsemirrorNode) => {
    const { rawHTML } = attrs;

    return {
      delim: [`\`\`\`${attrs.language || ''}`, '```'],
      text: textContent,
      rawHTML: rawHTML ? [`<${rawHTML}>`, `</${rawHTML}>`] : false
    };
  },

  bulletList: ({ attrs }: ProsemirrorNode) => {
    const { rawHTML } = attrs;

    return {
      delim: '*',
      rawHTML: rawHTML ? [`<${rawHTML}>`, `</${rawHTML}>`] : false
    };
  },

  orderedList: ({ attrs }: ProsemirrorNode) => {
    const { rawHTML } = attrs;

    return {
      rawHTML: rawHTML ? [`<${rawHTML}>`, `</${rawHTML}>`] : false
    };
  },

  listItem: ({ attrs }: ProsemirrorNode) => {
    const { task, checked, rawHTML } = attrs;

    const className = task ? ` class="task-list-item${checked ? ' checked' : ''}"` : '';
    const dataset = task ? ` data-task${checked ? ` data-task-checked` : ''}` : '';

    return {
      rawHTML: rawHTML ? [`<${rawHTML}${className}${dataset}>`, `</${rawHTML}>`] : false
    };
  },

  image: ({ attrs }: ProsemirrorNode) => {
    const altText = escape(attrs.altText || '');
    const imageUrl = escape(attrs.imageUrl);
    const altAttr = altText ? ` alt="${altText}"` : '';

    return {
      rawHTML: attrs.rawHTML ? `<${attrs.rawHTML} src="${imageUrl}"${altAttr}>` : false,
      attrs: {
        altText,
        imageUrl
      }
    };
  },

  thematicBreak: ({ attrs }: ProsemirrorNode) => {
    return {
      delim: '***',
      rawHTML: attrs.rawHTML ? `<${attrs.rawHTML}>` : false
    };
  },

  customBlock: ({ attrs, textContent }: ProsemirrorNode) => {
    return {
      delim: [`{{${attrs.info}`, '}}'],
      text: textContent
    };
  }
};

export function getOriginContext(type: WwNodeType) {
  const originContext = toMdConvertorContextMap[type];

  if (originContext) {
    return () => originContext;
  }

  return () => () => {
    return {};
  };
}

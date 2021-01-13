import { ProsemirrorNode } from 'prosemirror-model';

import { repeat, escape, quote } from './toMdConvertorHelper';

import { ToMdOriginConvertorContextMap } from '@t/convertor';
import { WwNodeType } from '@t/wysiwyg';
import { MdNodeType } from '@t/markdown';

function addBackticks(node: ProsemirrorNode, side: number) {
  const { text } = node;
  const ticks = /`+/g;
  let len = 0;

  if (node.isText && text) {
    let matched = ticks.exec(text);

    while (matched) {
      len = Math.max(len, matched[0].length);
      matched = ticks.exec(text);
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

const toMdConvertorContextMap: ToMdOriginConvertorContextMap = {
  heading({ attrs }) {
    const { level } = attrs;
    let delim = repeat('#', level);

    if (attrs.headingType === 'setext') {
      delim = level === 1 ? '===' : '---';
    }

    return {
      delim
    };
  },

  codeBlock(node) {
    const { attrs, textContent } = node as ProsemirrorNode;
    const { rawHTML } = attrs;

    return {
      delim: [`\`\`\`${attrs.language || ''}`, '```'],
      text: textContent,
      rawHTML: rawHTML ? [`<${rawHTML}>`, `</${rawHTML}>`] : false
    };
  },

  bulletList({ attrs }) {
    const { rawHTML } = attrs;

    return {
      delim: '*',
      rawHTML: rawHTML ? [`<${rawHTML}>`, `</${rawHTML}>`] : false
    };
  },

  orderedList({ attrs }) {
    const { rawHTML } = attrs;

    return {
      rawHTML: rawHTML ? [`<${rawHTML}>`, `</${rawHTML}>`] : false
    };
  },

  listItem({ attrs }) {
    const { task, checked, rawHTML } = attrs;

    const className = task ? ` class="task-list-item${checked ? ' checked' : ''}"` : '';
    const dataset = task ? ` data-task${checked ? ` data-task-checked` : ''}` : '';

    return {
      rawHTML: rawHTML ? [`<${rawHTML}${className}${dataset}>`, `</${rawHTML}>`] : false
    };
  },

  image({ attrs }) {
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

  thematicBreak({ attrs }) {
    return {
      delim: '***',
      rawHTML: attrs.rawHTML ? `<${attrs.rawHTML}>` : false
    };
  },

  customBlock(node) {
    const { attrs, textContent } = node as ProsemirrorNode;

    return {
      delim: [`{{${attrs.info}`, '}}'],
      text: textContent
    };
  },

  strong({ attrs }, entering) {
    const { rawHTML } = attrs;

    if (entering) {
      return {
        delim: '**',
        rawHTML: rawHTML ? `<${rawHTML}>` : false
      };
    }

    return {
      delim: '**',
      rawHTML: rawHTML ? `</${rawHTML}>` : false
    };
  },

  emph({ attrs }, entering) {
    const { rawHTML } = attrs;

    if (entering) {
      return {
        delim: '*',
        rawHTML: rawHTML ? `<${rawHTML}>` : false
      };
    }

    return {
      delim: '*',
      rawHTML: rawHTML ? `</${rawHTML}>` : false
    };
  },

  strike({ attrs }, entering) {
    const { rawHTML } = attrs;

    if (entering) {
      return {
        delim: '~~',
        rawHTML: rawHTML ? `<${rawHTML}>` : false
      };
    }

    return {
      delim: '~~',
      rawHTML: rawHTML ? `</${rawHTML}>` : false
    };
  },

  link({ attrs }, entering) {
    const { rawHTML } = attrs;
    const linkUrl = escape(attrs.linkUrl);

    if (entering) {
      return {
        delim: '[',
        rawHTML: rawHTML ? `<${rawHTML} href="${linkUrl}">` : false
      };
    }

    const linkText = attrs.title ? ` ${quote(attrs.linkText)}` : '';

    return {
      delim: `](${linkText}${linkUrl})`,
      rawHTML: rawHTML ? `</${rawHTML}>` : false
    };
  },

  code({ attrs }, entering, parent, index = 0) {
    const { rawHTML } = attrs;

    if (entering) {
      const delim = addBackticks(parent!.child(index), -1);

      return {
        delim,
        rawHTML: rawHTML ? `<${rawHTML}>` : false
      };
    }

    const delim = addBackticks(parent!.child(index - 1), 1);

    return {
      delim,
      rawHTML: rawHTML ? `</${rawHTML}>` : false
    };
  }
};

export function getOriginContext(type: WwNodeType | MdNodeType) {
  const originContext = toMdConvertorContextMap[type];

  if (originContext) {
    return () => originContext;
  }

  return () => () => {
    return {};
  };
}

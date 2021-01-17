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

function getPairRawHTML(rawHTML?: string[]) {
  return rawHTML ? [`<${rawHTML}>`, `</${rawHTML}>`] : false;
}

function getOpenRawHTML(rawHTML?: string) {
  return rawHTML ? `<${rawHTML}>` : false;
}

function getCloseRawHTML(rawHTML?: string) {
  return rawHTML ? `</${rawHTML}>` : false;
}

const toMdConvertorContextMap: ToMdOriginConvertorContextMap = {
  heading({ attrs }) {
    const { level } = attrs;
    let delim = repeat('#', level);

    if (attrs.headingType === 'setext') {
      delim = level === 1 ? '===' : '---';
    }

    return {
      delim,
      rawHTML: getPairRawHTML(attrs.rawHTML)
    };
  },

  codeBlock(node) {
    const { attrs, textContent } = node as ProsemirrorNode;

    return {
      delim: [`\`\`\`${attrs.language || ''}`, '```'],
      rawHTML: getPairRawHTML(attrs.rawHTML),
      text: textContent
    };
  },

  blockQuote({ attrs }) {
    return {
      delim: '> ',
      rawHTML: getPairRawHTML(attrs.rawHTML)
    };
  },

  bulletList({ attrs }) {
    return {
      delim: '*',
      rawHTML: getPairRawHTML(attrs.rawHTML)
    };
  },

  orderedList({ attrs }) {
    return {
      rawHTML: getPairRawHTML(attrs.rawHTML)
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

  table({ attrs }) {
    return {
      rawHTML: getPairRawHTML(attrs.rawHTML)
    };
  },

  tableHead({ attrs }) {
    return {
      rawHTML: getPairRawHTML(attrs.rawHTML)
    };
  },

  tableBody({ attrs }) {
    return {
      rawHTML: getPairRawHTML(attrs.rawHTML)
    };
  },

  tableRow({ attrs }) {
    return {
      rawHTML: getPairRawHTML(attrs.rawHTML)
    };
  },

  tableHeadCell({ attrs }) {
    return {
      rawHTML: getPairRawHTML(attrs.rawHTML)
    };
  },

  tableBodyCell({ attrs }) {
    return {
      rawHTML: getPairRawHTML(attrs.rawHTML)
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
      rawHTML: getOpenRawHTML(attrs.rawHTML)
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
    if (entering) {
      return {
        delim: '**',
        rawHTML: getOpenRawHTML(attrs.rawHTML)
      };
    }

    return {
      delim: '**',
      rawHTML: getCloseRawHTML(attrs.rawHTML)
    };
  },

  emph({ attrs }, entering) {
    if (entering) {
      return {
        delim: '*',
        rawHTML: getOpenRawHTML(attrs.rawHTML)
      };
    }

    return {
      delim: '*',
      rawHTML: getCloseRawHTML(attrs.rawHTML)
    };
  },

  strike({ attrs }, entering) {
    if (entering) {
      return {
        delim: '~~',
        rawHTML: getOpenRawHTML(attrs.rawHTML)
      };
    }

    return {
      delim: '~~',
      rawHTML: getCloseRawHTML(attrs.rawHTML)
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
      rawHTML: getCloseRawHTML(attrs.rawHTML)
    };
  },

  code({ attrs }, entering, parent, index = 0) {
    if (entering) {
      const delim = addBackticks(parent!.child(index), -1);

      return {
        delim,
        rawHTML: getOpenRawHTML(attrs.rawHTML)
      };
    }

    const delim = addBackticks(parent!.child(index - 1), 1);

    return {
      delim,
      rawHTML: getCloseRawHTML(attrs.rawHTML)
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

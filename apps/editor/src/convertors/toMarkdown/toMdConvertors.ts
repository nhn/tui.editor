import { ProsemirrorNode } from 'prosemirror-model';

import { nodeTypeWriters } from './toMdNodeTypeWriters';

import { repeat, escape, quote } from '@/utils/common';

import {
  ToMdParamConvertorMap,
  ToMdMarkConvertorMap,
  ToMdNodeTypeConvertorMap,
  NodeInfo
} from '@t/convertor';
import { WwNodeType, WwMarkType } from '@t/wysiwyg';

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
  return rawHTML ? [`<${rawHTML}>`, `</${rawHTML}>`] : '';
}

function getOpenRawHTML(rawHTML?: string) {
  return rawHTML ? `<${rawHTML}>` : '';
}

function getCloseRawHTML(rawHTML?: string) {
  return rawHTML ? `</${rawHTML}>` : '';
}

export const toMdConvertors: ToMdParamConvertorMap = {
  heading({ node }) {
    const { attrs } = node;
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

  codeBlock({ node }) {
    const { attrs, textContent } = node as ProsemirrorNode;

    return {
      delim: [`\`\`\`${attrs.language || ''}`, '```'],
      rawHTML: getPairRawHTML(attrs.rawHTML),
      text: textContent
    };
  },

  blockQuote({ node }) {
    return {
      delim: '> ',
      rawHTML: getPairRawHTML(node.attrs.rawHTML)
    };
  },

  bulletList({ node }) {
    return {
      delim: '*',
      rawHTML: getPairRawHTML(node.attrs.rawHTML)
    };
  },

  orderedList({ node }) {
    return {
      rawHTML: getPairRawHTML(node.attrs.rawHTML)
    };
  },

  listItem({ node }) {
    const { task, checked, rawHTML } = node.attrs;

    const className = task ? ` class="task-list-item${checked ? ' checked' : ''}"` : '';
    const dataset = task ? ` data-task${checked ? ` data-task-checked` : ''}` : '';

    return {
      rawHTML: rawHTML ? [`<${rawHTML}${className}${dataset}>`, `</${rawHTML}>`] : ''
    };
  },

  table({ node }) {
    return {
      rawHTML: getPairRawHTML(node.attrs.rawHTML)
    };
  },

  tableHead({ node }) {
    return {
      rawHTML: getPairRawHTML(node.attrs.rawHTML)
    };
  },

  tableBody({ node }) {
    return {
      rawHTML: getPairRawHTML(node.attrs.rawHTML)
    };
  },

  tableRow({ node }) {
    return {
      rawHTML: getPairRawHTML(node.attrs.rawHTML)
    };
  },

  tableHeadCell({ node }) {
    return {
      rawHTML: getPairRawHTML(node.attrs.rawHTML)
    };
  },

  tableBodyCell({ node }) {
    return {
      rawHTML: getPairRawHTML(node.attrs.rawHTML)
    };
  },

  image({ node }) {
    const { attrs } = node;
    const altText = escape(attrs.altText || '');
    const imageUrl = escape(attrs.imageUrl);
    const altAttr = altText ? ` alt="${altText}"` : '';

    return {
      rawHTML: attrs.rawHTML ? `<${attrs.rawHTML} src="${imageUrl}"${altAttr}>` : '',
      attrs: {
        altText,
        imageUrl
      }
    };
  },

  thematicBreak({ node }) {
    return {
      delim: '***',
      rawHTML: getOpenRawHTML(node.attrs.rawHTML)
    };
  },

  customBlock({ node }) {
    const { attrs, textContent } = node as ProsemirrorNode;

    return {
      delim: [`{{${attrs.info}`, '}}'],
      text: textContent
    };
  },

  strong({ node }, { entering }) {
    const { rawHTML } = node.attrs;

    return {
      delim: '**',
      rawHTML: entering ? getOpenRawHTML(rawHTML) : getCloseRawHTML(rawHTML)
    };
  },

  emph({ node }, { entering }) {
    const { rawHTML } = node.attrs;

    return {
      delim: '*',
      rawHTML: entering ? getOpenRawHTML(rawHTML) : getCloseRawHTML(rawHTML)
    };
  },

  strike({ node }, { entering }) {
    const { rawHTML } = node.attrs;

    return {
      delim: '~~',
      rawHTML: entering ? getOpenRawHTML(rawHTML) : getCloseRawHTML(rawHTML)
    };
  },

  link({ node }, { entering }) {
    const { attrs } = node;
    const linkUrl = escape(attrs.linkUrl);
    const { rawHTML } = attrs;

    if (entering) {
      return {
        delim: '[',
        rawHTML: rawHTML ? `<${rawHTML} href="${linkUrl}">` : ''
      };
    }

    const linkText = attrs.title ? ` ${quote(attrs.linkText)}` : '';

    return {
      delim: `](${linkText}${linkUrl})`,
      rawHTML: getCloseRawHTML(rawHTML)
    };
  },

  code({ node, parent, index = 0 }, { entering }) {
    const delim = entering
      ? addBackticks(parent!.child(index), -1)
      : addBackticks(parent!.child(index - 1), 1);
    const rawHTML = entering
      ? getOpenRawHTML(node.attrs.rawHTML)
      : getCloseRawHTML(node.attrs.rawHTML);

    return {
      delim,
      rawHTML
    };
  }
};

const marks: ToMdMarkConvertorMap = {
  strong: {
    mixable: true,
    removedEnclosingWhitespace: true
  },

  emph: {
    mixable: true,
    removedEnclosingWhitespace: true
  },

  strike: {
    mixable: true,
    removedEnclosingWhitespace: true
  },

  link: {},

  code: {
    escape: false
  }
};

function createNodeTypeConvertors(paramConvertors: ToMdParamConvertorMap) {
  const convertors: ToMdNodeTypeConvertorMap = {};
  const nodeTypes = Object.keys(nodeTypeWriters) as WwNodeType[];

  nodeTypes.forEach(type => {
    convertors[type] = (state, nodeInfo, entering) => {
      const renderers = nodeTypeWriters[type];

      if (renderers) {
        const context = { entering };
        const paramConvertor = paramConvertors[type];
        const params = paramConvertor ? paramConvertor(nodeInfo as NodeInfo, context) : {};

        renderers(state, nodeInfo, params);
      }
    };
  });

  return convertors;
}

export function createConvertors(customConvertors: ToMdParamConvertorMap) {
  const customConvertorTypes = Object.keys(customConvertors) as (WwNodeType | WwMarkType)[];

  customConvertorTypes.forEach(type => {
    const orgConvertor = toMdConvertors[type];
    const extConvertor = customConvertors[type]!;

    if (orgConvertor) {
      toMdConvertors[type] = (nodeInfo, context) => {
        context.origin = () => orgConvertor(nodeInfo, context);

        return extConvertor(nodeInfo, context);
      };
    } else {
      toMdConvertors[type] = extConvertor;
    }
  });

  const nodeTypeConvertors = createNodeTypeConvertors(toMdConvertors);

  return {
    marks,
    nodeTypeConvertors
  };
}

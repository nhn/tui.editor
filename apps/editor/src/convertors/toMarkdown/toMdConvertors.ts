import { ProsemirrorNode } from 'prosemirror-model';

import isUndefined from 'tui-code-snippet/type/isUndefined';

import { nodeTypeWriters, write } from './toMdNodeTypeWriters';

import { repeat, quote, escapeXml, escapeTextForLink } from '@/utils/common';

import {
  ToMdConvertorMap,
  ToMdNodeTypeConvertorMap,
  ToMdMarkTypeConvertorMap,
  ToMdMarkTypeOptions,
  NodeInfo,
  MarkInfo,
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
  return rawHTML ? [`<${rawHTML}>`, `</${rawHTML}>`] : null;
}

function getOpenRawHTML(rawHTML?: string) {
  return rawHTML ? `<${rawHTML}>` : null;
}

function getCloseRawHTML(rawHTML?: string) {
  return rawHTML ? `</${rawHTML}>` : null;
}

export const toMdConvertors: ToMdConvertorMap = {
  heading({ node }) {
    const { attrs } = node;
    const { level } = attrs;
    let delim = repeat('#', level);

    if (attrs.headingType === 'setext') {
      delim = level === 1 ? '===' : '---';
    }

    return {
      delim,
      rawHTML: getPairRawHTML(attrs.rawHTML),
    };
  },

  codeBlock({ node }) {
    const { attrs, textContent } = node as ProsemirrorNode;

    return {
      delim: [`\`\`\`${attrs.language || ''}`, '```'],
      rawHTML: getPairRawHTML(attrs.rawHTML),
      text: textContent,
    };
  },

  blockQuote({ node }) {
    return {
      delim: '> ',
      rawHTML: getPairRawHTML(node.attrs.rawHTML),
    };
  },

  bulletList({ node }, { inTable }) {
    let { rawHTML } = node.attrs;

    if (inTable) {
      rawHTML = rawHTML || 'ul';
    }

    return {
      delim: '*',
      rawHTML: getPairRawHTML(rawHTML),
    };
  },

  orderedList({ node }, { inTable }) {
    let { rawHTML } = node.attrs;

    if (inTable) {
      rawHTML = rawHTML || 'ol';
    }

    return {
      rawHTML: getPairRawHTML(rawHTML),
    };
  },

  listItem({ node }, { inTable }) {
    const { task, checked } = node.attrs;
    let { rawHTML } = node.attrs;

    if (inTable) {
      rawHTML = rawHTML || 'li';
    }

    const className = task ? ` class="task-list-item${checked ? ' checked' : ''}"` : '';
    const dataset = task ? ` data-task${checked ? ` data-task-checked` : ''}` : '';

    return {
      rawHTML: rawHTML ? [`<${rawHTML}${className}${dataset}>`, `</${rawHTML}>`] : null,
    };
  },

  table({ node }) {
    return {
      rawHTML: getPairRawHTML(node.attrs.rawHTML),
    };
  },

  tableHead({ node }) {
    return {
      rawHTML: getPairRawHTML(node.attrs.rawHTML),
    };
  },

  tableBody({ node }) {
    return {
      rawHTML: getPairRawHTML(node.attrs.rawHTML),
    };
  },

  tableRow({ node }) {
    return {
      rawHTML: getPairRawHTML(node.attrs.rawHTML),
    };
  },

  tableHeadCell({ node }) {
    return {
      rawHTML: getPairRawHTML(node.attrs.rawHTML),
    };
  },

  tableBodyCell({ node }) {
    return {
      rawHTML: getPairRawHTML(node.attrs.rawHTML),
    };
  },

  image({ node }) {
    const { attrs } = node;
    const { rawHTML, altText } = attrs;
    const imageUrl = attrs.imageUrl.replace(/&amp;/g, '&');
    const altAttr = altText ? ` alt="${escapeXml(altText)}"` : '';

    return {
      rawHTML: rawHTML ? `<${rawHTML} src="${escapeXml(imageUrl)}"${altAttr}>` : null,
      attrs: {
        altText: escapeTextForLink(altText || ''),
        imageUrl,
      },
    };
  },

  thematicBreak({ node }) {
    return {
      delim: '***',
      rawHTML: getOpenRawHTML(node.attrs.rawHTML),
    };
  },

  customBlock({ node }) {
    const { attrs, textContent } = node as ProsemirrorNode;

    return {
      delim: [`$$${attrs.info}`, '$$'],
      text: textContent,
    };
  },

  frontMatter({ node }) {
    return {
      text: (node as ProsemirrorNode).textContent,
    };
  },

  widget({ node }) {
    return {
      text: (node as ProsemirrorNode).textContent,
    };
  },

  strong({ node }, { entering }) {
    const { rawHTML } = node.attrs;

    return {
      delim: '**',
      rawHTML: entering ? getOpenRawHTML(rawHTML) : getCloseRawHTML(rawHTML),
    };
  },

  emph({ node }, { entering }) {
    const { rawHTML } = node.attrs;

    return {
      delim: '*',
      rawHTML: entering ? getOpenRawHTML(rawHTML) : getCloseRawHTML(rawHTML),
    };
  },

  strike({ node }, { entering }) {
    const { rawHTML } = node.attrs;

    return {
      delim: '~~',
      rawHTML: entering ? getOpenRawHTML(rawHTML) : getCloseRawHTML(rawHTML),
    };
  },

  link({ node }, { entering }) {
    const { attrs } = node;
    const { title, rawHTML } = attrs;
    const linkUrl = attrs.linkUrl.replace(/&amp;/g, '&');
    const titleAttr = title ? ` title="${escapeXml(title)}"` : '';

    if (entering) {
      return {
        delim: '[',
        rawHTML: rawHTML ? `<${rawHTML} href="${escapeXml(linkUrl)}"${titleAttr}>` : null,
      };
    }

    return {
      delim: `](${linkUrl}${title ? ` ${quote(escapeTextForLink(title))}` : ''})`,
      rawHTML: getCloseRawHTML(rawHTML),
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
      rawHTML,
    };
  },

  htmlComment({ node }) {
    return {
      text: (node as ProsemirrorNode).textContent,
    };
  },

  // html inline node, html block node
  html({ node }, { entering }) {
    const tagName = node.type.name;
    const attrs = node.attrs.htmlAttrs;
    let openTag = `<${tagName}`;
    const closeTag = `</${tagName}>`;

    Object.keys(attrs).forEach((attrName) => {
      // To prevent broken converting when attributes has double quote string
      openTag += ` ${attrName}="${attrs[attrName].replace(/"/g, "'")}"`;
    });
    openTag += '>';

    if (node.attrs.htmlInline) {
      return {
        rawHTML: entering ? openTag : closeTag,
      };
    }

    return {
      text: `${openTag}${node.attrs.childrenHTML}${closeTag}`,
    };
  },
};

const markTypeOptions: ToMdMarkTypeOptions = {
  strong: {
    mixable: true,
    removedEnclosingWhitespace: true,
  },

  emph: {
    mixable: true,
    removedEnclosingWhitespace: true,
  },

  strike: {
    mixable: true,
    removedEnclosingWhitespace: true,
  },

  code: {
    escape: false,
  },

  link: null,

  html: null,
};

function createNodeTypeConvertors(convertors: ToMdConvertorMap) {
  const nodeTypeConvertors: ToMdNodeTypeConvertorMap = {};
  const nodeTypes = Object.keys(nodeTypeWriters) as WwNodeType[];

  nodeTypes.forEach((type) => {
    nodeTypeConvertors[type] = (state, nodeInfo) => {
      const writer = nodeTypeWriters[type];

      if (writer) {
        const convertor = convertors[type];
        const params = convertor
          ? convertor(nodeInfo as NodeInfo, {
              inTable: state.inTable,
            })
          : {};

        write(type, { state, nodeInfo, params });
      }
    };
  });

  return nodeTypeConvertors;
}

function createMarkTypeConvertors(convertors: ToMdConvertorMap) {
  const markTypeConvertors: ToMdMarkTypeConvertorMap = {};
  const markTypes = Object.keys(markTypeOptions) as WwMarkType[];

  markTypes.forEach((type) => {
    markTypeConvertors[type] = (nodeInfo, entering) => {
      const markOption = markTypeOptions[type];
      const convertor = convertors[type];

      // There are two ways to call the mark type converter
      // in the `toMdConvertorState` module.
      // When calling the converter without using `delim` and `rawHTML` values,
      // the converter is called without parameters.
      const runConvertor = convertor && nodeInfo && !isUndefined(entering);
      const params = runConvertor ? convertor!(nodeInfo as MarkInfo, { entering }) : {};

      return { ...params, ...markOption };
    };
  });

  return markTypeConvertors;
}

// Step 1: Create the converter by overriding the custom converter
//         to the original converter defined in the `toMdConvertors` module.
//         If the node type is defined in the original converter,
//         the `origin()` function is exported to the paramter of the converter.
// Step 2: Create a converter for the node type of ProseMirror by combining the converter
//         created in Step 1 with the writers defined in the`toMdNodeTypeWriters` module.
//         Each writer converts the ProseMirror's node to a string with the value returned
//         by the converter, and then stores the state in the`toMdConverterState` class.
// Step 3: Create a converter for the mark type of ProseMirror by combining the converter
//         created in Step 1 with `markTypeOptions`.
// Step 4: The created node type converter and mark type converter are injected
//         when creating an instance of the`toMdConverterState` class.
export function createMdConvertors(customConvertors: ToMdConvertorMap) {
  const customConvertorTypes = Object.keys(customConvertors) as (WwNodeType | WwMarkType)[];

  customConvertorTypes.forEach((type) => {
    const baseConvertor = toMdConvertors[type];
    const customConvertor = customConvertors[type]!;

    if (baseConvertor) {
      toMdConvertors[type] = (nodeInfo, context) => {
        context.origin = () => baseConvertor(nodeInfo, context);

        return customConvertor(nodeInfo, context);
      };
    } else {
      toMdConvertors[type] = customConvertor;
    }

    delete customConvertors[type];
  });

  const nodeTypeConvertors = createNodeTypeConvertors(toMdConvertors);
  const markTypeConvertors = createMarkTypeConvertors(toMdConvertors);

  return {
    nodeTypeConvertors,
    markTypeConvertors,
  };
}

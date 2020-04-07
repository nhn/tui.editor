import { Node, NodeType, HeadingNode, CodeBlockNode, ListNode, LinkNode } from './commonmark/node';
import { escapeXml } from './commonmark/common';

interface HTMLNode {
  nodeName: string;
  classNames?: string[];
  attributes?: Record<string, string>;
  selfClose?: boolean;
  separateLine?: boolean;
  textContent?: string;
  childNodeTextAttrName?: string;
  children?: HTMLNode[];
}

interface Options {
  softbreak: string;
  sourcepos: boolean;
  nodeId: boolean;
}

type HTMLConvertor = (node: Node) => HTMLNode | string;

type HTMLConvertorMap = Partial<Record<NodeType, HTMLConvertor>>;

const convertorMap: HTMLConvertorMap = {
  heading(node: Node) {
    return { nodeName: `H${(node as HeadingNode).level}` };
  },

  text(node: Node) {
    return {
      nodeName: '#text',
      textContent: node.literal!
    };
  },

  softbreak() {
    return {
      nodeName: '#text',
      textContent: '\n'
    };
  },

  linebreak() {
    return {
      nodeName: 'BR',
      selfClose: true
    };
  },

  emph() {
    return { nodeName: 'EM' };
  },

  strong() {
    return { nodeName: 'STRONG' };
  },

  paragraph() {
    return {
      nodeName: 'P',
      separateLine: true
    };
  },

  thematicBreak() {
    return {
      nodeName: 'HR',
      selfClose: true
    };
  },

  blockQuote() {
    return { nodeName: 'blockquote' };
  },

  list(node: Node) {
    const { type, start } = (node as ListNode).listData!;
    const nodeName = type === 'bullet' ? 'UL' : 'OL';
    const attributes: Record<string, string> = {};
    if (nodeName === 'OL' && start !== null && start !== 1) {
      attributes.start = start.toString();
    }

    return {
      nodeName,
      attributes,
      separateLine: true
    };
  },

  item() {
    return {
      nodeName: 'LI',
      separateLine: true
    };
  },

  htmlInline(node: Node) {
    return node.literal!;
  },

  htmlBlock(node: Node) {
    return node.literal!;
  },

  code(node: Node) {
    return {
      nodeName: 'CODE',
      children: [
        {
          nodeName: '#text',
          textContent: node.literal!
        }
      ]
    };
  },

  codeBlock(node: Node) {
    const infoStr = (node as CodeBlockNode).info;
    const infoWords = infoStr ? infoStr.split(/\s+/) : [];
    const codeClassNames = [];
    if (infoWords.length > 0 && infoWords[0].length > 0) {
      codeClassNames.push(`language-${escapeXml(infoWords[0])}`);
    }

    return {
      nodeName: 'PRE',
      children: [
        {
          nodeName: 'CODE',
          classNames: codeClassNames,
          children: [
            {
              nodeName: '#text',
              textContent: node.literal!
            }
          ]
        }
      ]
    };
  },

  link(node: Node) {
    const { title, destination } = node as LinkNode;

    return {
      nodeName: 'A',
      attributes: {
        href: escapeXml(destination!),
        ...(title && { title: escapeXml(title) })
      }
    };
  },

  image(node: Node) {
    const { title, destination } = node as LinkNode;

    return {
      nodeName: 'IMG',
      selfClose: true,
      attributes: {
        src: escapeXml(destination!),
        ...(title && { title: escapeXml(title) })
      },
      childNodeTextAttrName: 'alt'
    };
  }
};

export function createHTMLRender() {
  return (node: Node) => render(node, convertorMap);
}

function generateTagString(htmlNode: HTMLNode, openerOnly: boolean): string {
  if (htmlNode.nodeName === '#text') {
    return htmlNode.textContent!;
  }

  const buffer = [];
  const tagName = htmlNode.nodeName.toLowerCase();
  const { classNames, children, attributes } = htmlNode;

  buffer.push(`<${tagName}`);

  if (classNames && classNames.length > 0) {
    buffer.push(` class="${classNames.join(' ')}"`);
  }

  if (attributes) {
    Object.keys(attributes).forEach(attrName => {
      buffer.push(` ${attrName}="${attributes[attrName]}"`);
    });
  }

  buffer.push(`${htmlNode.selfClose ? ' /' : ''}>`);

  if (children) {
    for (const child of children) {
      buffer.push(generateTagString(child, false));
    }
  }

  if (!openerOnly) {
    buffer.push(generateClosingTagString(htmlNode));
  }

  return buffer.join('');
}

function generateClosingTagString(htmlNode: HTMLNode) {
  return `</${htmlNode.nodeName.toLowerCase()}>`;
}

function render(rootNode: Node, htmlConvertorMap: HTMLConvertorMap): string {
  const htmlNodeMap: Record<number, HTMLNode> = {};
  const buffer: string[] = [];

  const walker = rootNode.walker();
  let event: ReturnType<typeof walker.next> = null;
  let blockingNodeId = -1;
  while ((event = walker.next())) {
    const { node, entering } = event;
    const convertor = htmlConvertorMap[node.type];
    if (!convertor) {
      continue;
    }

    if (blockingNodeId > 0) {
      const htmlNode = htmlNodeMap[blockingNodeId];
      if (blockingNodeId === node.id) {
        buffer.push(generateTagString(htmlNode, true));
        blockingNodeId = -1;
      } else if (node.type === 'text') {
        const attrName = htmlNode.childNodeTextAttrName!;
        htmlNode.attributes![attrName] += node.literal;
      }
      continue;
    }

    let converted: HTMLNode | string;
    if (entering) {
      converted = convertor(node);
      if (typeof converted === 'string') {
        buffer.push(converted);
      } else {
        if (converted.separateLine && buffer.length && buffer[buffer.length - 1] !== '\n') {
          buffer.push('\n');
        }
        htmlNodeMap[node.id] = converted;
        if (converted.childNodeTextAttrName) {
          blockingNodeId = node.id;
          if (!converted.attributes) {
            converted.attributes = {};
          }
          converted.attributes[converted.childNodeTextAttrName] = '';
        } else {
          buffer.push(generateTagString(converted, !!node.firstChild));
        }
      }
    } else {
      const htmlNode: HTMLNode = htmlNodeMap[node.id];
      if (htmlNode) {
        buffer.push(generateClosingTagString(htmlNode));
        if (htmlNode.separateLine) {
          buffer.push('\n');
        }
      }
    }
  }

  if (buffer[buffer.length - 1] !== '\n') {
    buffer.push('\n');
  }

  return buffer.join('');
}

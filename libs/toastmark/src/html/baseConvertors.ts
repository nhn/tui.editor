import { Node, HeadingNode, CodeBlockNode, ListNode, LinkNode } from '../commonmark/node';
import { escapeXml } from '../commonmark/common';
import { HTMLConvertorMap } from './render';

export const baseConvertors: HTMLConvertorMap = {
  heading(node: Node, { entering }) {
    return {
      type: entering ? 'openTag' : 'closeTag',
      tagName: `h${(node as HeadingNode).level}`,
      outerNewLine: true
    };
  },

  text(node: Node) {
    return {
      type: 'text',
      content: node.literal!
    };
  },

  softbreak() {
    return {
      type: 'html',
      content: '\n'
    };
  },

  linebreak() {
    return {
      type: 'html',
      content: '<br />\n'
    };
  },

  emph(_, { entering }) {
    return {
      type: entering ? 'openTag' : 'closeTag',
      tagName: 'em'
    };
  },

  strong(_, { entering }) {
    return {
      type: entering ? 'openTag' : 'closeTag',
      tagName: 'strong'
    };
  },

  paragraph(node, { entering }) {
    const grandparent = node.parent?.parent;
    if (grandparent && grandparent.type === 'list') {
      if ((grandparent as ListNode).listData!.tight) {
        return {
          type: 'text',
          content: ''
        };
      }
    }

    return {
      type: entering ? 'openTag' : 'closeTag',
      tagName: 'p',
      outerNewLine: true
    };
  },

  thematicBreak() {
    return {
      type: 'openTag',
      tagName: 'hr',
      outerNewLine: true,
      selfClose: true
    };
  },

  blockQuote(_, { entering }) {
    return {
      type: entering ? 'openTag' : 'closeTag',
      tagName: 'blockquote',
      outerNewLine: true,
      innerNewLine: true
    };
  },

  list(node: Node, { entering }) {
    const { type, start } = (node as ListNode).listData!;
    const tagName = type === 'bullet' ? 'ul' : 'ol';
    const attributes: Record<string, string> = {};
    if (tagName === 'ol' && start !== null && start !== 1) {
      attributes.start = start.toString();
    }

    return {
      type: entering ? 'openTag' : 'closeTag',
      tagName,
      attributes,
      outerNewLine: true
    };
  },

  item(_, { entering }) {
    return {
      type: entering ? 'openTag' : 'closeTag',
      tagName: 'li',
      outerNewLine: true
    };
  },

  htmlInline(node: Node) {
    return {
      type: 'html',
      content: node.literal!
    };
  },

  htmlBlock(node: Node) {
    return {
      type: 'html',
      content: `${node.literal!}`,
      outerNewLine: true
    };
  },

  code(node: Node) {
    return [
      {
        type: 'openTag',
        tagName: 'code'
      },
      {
        type: 'text',
        content: node.literal!
      },
      {
        type: 'closeTag',
        tagName: 'code'
      }
    ];
  },

  codeBlock(node: Node) {
    const infoStr = (node as CodeBlockNode).info;
    const infoWords = infoStr ? infoStr.split(/\s+/) : [];
    const codeClassNames = [];
    if (infoWords.length > 0 && infoWords[0].length > 0) {
      codeClassNames.push(`language-${escapeXml(infoWords[0])}`);
    }

    return [
      {
        type: 'openTag',
        tagName: 'pre',
        outerNewLine: true
      },
      {
        type: 'openTag',
        tagName: 'code',
        classNames: codeClassNames
      },
      {
        type: 'text',
        content: node.literal!
      },
      {
        type: 'closeTag',
        tagName: 'code'
      },
      {
        type: 'closeTag',
        tagName: 'pre',
        outerNewLine: true
      }
    ];
  },

  link(node: Node, { entering }) {
    if (entering) {
      const { title, destination } = node as LinkNode;

      return {
        type: 'openTag',
        tagName: 'a',
        attributes: {
          href: escapeXml(destination!),
          ...(title && { title: escapeXml(title) })
        }
      };
    }
    return {
      type: 'closeTag',
      tagName: 'a'
    };
  },

  image(node: Node, { childText }) {
    const { title, destination } = node as LinkNode;

    return {
      type: 'openTag',
      tagName: 'img',
      selfClose: true,
      attributes: {
        src: escapeXml(destination!),
        alt: childText!,
        ...(title && { title: escapeXml(title) })
      }
    };
  }
};

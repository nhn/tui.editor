import { Node, HeadingNode, CodeBlockNode, ListNode, LinkNode } from '../commonmark/node';
import { escapeXml } from '../commonmark/common';
import { HTMLConvertorMap } from './render';

export const baseConvertors: HTMLConvertorMap = {
  heading(node: Node) {
    return {
      type: 'tag',
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

  emph() {
    return {
      type: 'tag',
      tagName: 'em'
    };
  },

  strong() {
    return {
      type: 'tag',
      tagName: 'strong'
    };
  },

  paragraph(node: Node) {
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
      type: 'tag',
      tagName: 'p',
      outerNewLine: true
    };
  },

  thematicBreak() {
    return {
      type: 'tag',
      tagName: 'hr',
      outerNewLine: true,
      selfClose: true
    };
  },

  blockQuote() {
    return {
      type: 'tag',
      tagName: 'blockquote',
      outerNewLine: true,
      innerNewLine: true
    };
  },

  list(node: Node) {
    const { type, start } = (node as ListNode).listData!;
    const tagName = type === 'bullet' ? 'ul' : 'ol';
    const attributes: Record<string, string> = {};
    if (tagName === 'ol' && start !== null && start !== 1) {
      attributes.start = start.toString();
    }

    return {
      type: 'tag',
      tagName,
      attributes,
      outerNewLine: true
    };
  },

  item() {
    return {
      type: 'tag',
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
    return {
      type: 'tag',
      tagName: 'code',
      children: [
        {
          type: 'text',
          content: node.literal!
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
      type: 'tag',
      tagName: 'pre',
      outerNewLine: true,
      children: [
        {
          type: 'tag',
          tagName: 'code',
          classNames: codeClassNames,
          children: [
            {
              type: 'text',
              content: node.literal!
            }
          ]
        }
      ]
    };
  },

  link(node: Node) {
    const { title, destination } = node as LinkNode;

    return {
      type: 'tag',
      tagName: 'a',
      attributes: {
        href: escapeXml(destination!),
        ...(title && { title: escapeXml(title) })
      }
    };
  },

  image(node: Node, { childText }) {
    const { title, destination } = node as LinkNode;

    return {
      type: 'tag',
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

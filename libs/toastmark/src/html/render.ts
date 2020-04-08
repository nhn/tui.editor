import { Node, NodeType, isContainer } from '../commonmark/node';
import { escapeXml } from '../commonmark/common';
import { convertors } from './convertors';

export type HTMLConvertor = (node: Node) => HTMLNode;

export type HTMLConvertorMap = Partial<Record<NodeType, HTMLConvertor>>;

interface TagNode {
  type: 'tag';
  tagName: string;
  classNames?: string[];
  attributes?: Record<string, string>;
  attributeOrders?: string[];
  outerNewLine?: boolean;
  innerNewLine?: boolean;
  selfClose?: boolean;
  childNodeTextAttrName?: string;
  children?: HTMLNode[];
}

interface TextNode {
  type: 'text';
  content: string;
}

interface RawHTMLNode {
  type: 'html';
  content: string;
  outerNewLine?: boolean;
}

export type HTMLNode = TagNode | TextNode | RawHTMLNode;

interface Options {
  softbreak: string;
  sourcepos: boolean;
  nodeId: boolean;
}

export function createHTMLRender() {
  return (node: Node) => render(node, convertors);
}

function generateOpenTagString(node: TagNode): string {
  const buffer = [];
  const { tagName, classNames, attributes, attributeOrders } = node;

  buffer.push(`<${tagName}`);

  if (classNames && classNames.length > 0) {
    buffer.push(` class="${classNames.join(' ')}"`);
  }

  if (attributes) {
    const attrNames = attributeOrders || Object.keys(attributes);
    attrNames.forEach(attrName => {
      const attrValue = attributes[attrName];
      if (attrValue !== undefined) {
        buffer.push(` ${attrName}="${attrValue}"`);
      }
    });
  }

  if (node.selfClose) {
    buffer.push(' /');
  }
  buffer.push('>');

  return buffer.join('');
}

function generateCloseTagString({ selfClose, tagName }: TagNode) {
  if (selfClose) {
    return '';
  }
  return `</${tagName}>`;
}

function addNewLine(buffer: string[]) {
  if (buffer.length && buffer[buffer.length - 1] !== '\n') {
    buffer.push('\n');
  }
}

function addOuterNewLine(node: TagNode | RawHTMLNode, buffer: string[]) {
  if (node.outerNewLine) {
    addNewLine(buffer);
  }
}

function addInnerNewLine(node: TagNode, buffer: string[]) {
  if (node.innerNewLine) {
    addNewLine(buffer);
  }
}

function render(rootNode: Node, convertors: HTMLConvertorMap): string {
  const htmlNodeMap: Record<number, HTMLNode> = {};
  const buffer: string[] = [];

  const walker = rootNode.walker();
  let event: ReturnType<typeof walker.next> = null;
  let blockingNodeId = -1;
  while ((event = walker.next())) {
    const { node, entering } = event;
    const convertor = convertors[node.type];
    if (!convertor) {
      continue;
    }

    if (blockingNodeId > 0) {
      const htmlNode = htmlNodeMap[blockingNodeId] as TagNode;
      if (blockingNodeId === node.id) {
        buffer.push(generateOpenTagString(htmlNode));
        blockingNodeId = -1;
      } else if (node.type === 'text') {
        const attrName = htmlNode.childNodeTextAttrName!;
        htmlNode.attributes![attrName] += node.literal;
      }
      continue;
    }

    let htmlNode: HTMLNode;
    if (entering) {
      htmlNode = convertor(node);
      htmlNodeMap[node.id] = htmlNode;
      if (htmlNode.type === 'tag' && htmlNode.childNodeTextAttrName) {
        blockingNodeId = node.id;
        if (!htmlNode.attributes) {
          htmlNode.attributes = {};
        }
        htmlNode.attributes[htmlNode.childNodeTextAttrName] = '';
      } else {
        renderHTMLNode(htmlNode, buffer, !isContainer(node));
      }
    } else {
      const htmlNode = htmlNodeMap[node.id];
      if (htmlNode.type === 'tag') {
        buffer.push(generateCloseTagString(htmlNode));
        addOuterNewLine(htmlNode, buffer);
      }
    }
  }
  addNewLine(buffer);

  return buffer.join('');
}

function renderHTMLNode(node: HTMLNode, buffer: string[], close: boolean) {
  switch (node.type) {
    case 'tag':
      renderElementNode(node, buffer, close);
      break;
    case 'text':
      renderTextNode(node, buffer);
      break;
    case 'html':
      renderRawHtmlNode(node, buffer);
      break;
  }
}

function renderTextNode(node: TextNode, buffer: string[]) {
  buffer.push(escapeXml(node.content));
}

function renderRawHtmlNode(node: RawHTMLNode, buffer: string[]) {
  addOuterNewLine(node, buffer);
  buffer.push(node.content);
  addOuterNewLine(node, buffer);
}

function renderElementNode(node: TagNode, buffer: string[], close: boolean) {
  addOuterNewLine(node, buffer);
  buffer.push(generateOpenTagString(node));
  addInnerNewLine(node, buffer);
  if (node.children) {
    for (const childNode of node.children) {
      renderHTMLNode(childNode, buffer, true);
    }
  }
  if (close) {
    addInnerNewLine(node, buffer);
    buffer.push(generateCloseTagString(node));
    addOuterNewLine(node, buffer);
  }
}

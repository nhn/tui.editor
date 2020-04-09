import { Node, NodeType, isContainer } from '../commonmark/node';
import { escapeXml } from '../commonmark/common';
import { baseConvertors } from './baseConvertors';
import { gfmConvertors } from './gfmConvertors';

interface Context {
  entering: boolean;
  leaf: boolean;
  origin?: HTMLConvertor;
  childText?: string;
}

export type HTMLConvertor = (node: Node, context: Context) => HTMLNode | HTMLNode[];

export type HTMLConvertorMap = Partial<Record<NodeType, HTMLConvertor>>;

interface TagNode {
  tagName: string;
  outerNewLine?: boolean;
  innerNewLine?: boolean;
}

export interface OpenTagNode extends TagNode {
  type: 'openTag';
  tagName: string;
  classNames?: string[];
  attributes?: Record<string, string>;
  outerNewLine?: boolean;
  innerNewLine?: boolean;
  selfClose?: boolean;
}

export interface CloseTagNode extends TagNode {
  type: 'closeTag';
  tagName: string;
  outerNewLine?: boolean;
  innerNewLine?: boolean;
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

export type HTMLNode = OpenTagNode | CloseTagNode | TextNode | RawHTMLNode;

interface Options {
  softbreak: string;
  sourcepos: boolean;
  nodeId: boolean;
  gfm: boolean;
}

export function createHTMLRender(options?: Partial<Options>) {
  const convertors = { ...baseConvertors };

  if (options && options.gfm) {
    const nodeTypes = Object.keys(gfmConvertors) as NodeType[];
    nodeTypes.forEach(nodeType => {
      const orgConvertor = convertors[nodeType];
      const extConvertor = gfmConvertors[nodeType]!;
      if (orgConvertor) {
        convertors[nodeType] = (node, context) => {
          context.origin = orgConvertor;
          return extConvertor(node, context);
        };
      } else {
        convertors[nodeType] = gfmConvertors[nodeType];
      }
    });
  }

  return (node: Node) => render(node, convertors);
}

function generateOpenTagString(node: OpenTagNode): string {
  const buffer = [];
  const { tagName, classNames, attributes } = node;

  buffer.push(`<${tagName}`);

  if (classNames && classNames.length > 0) {
    buffer.push(` class="${classNames.join(' ')}"`);
  }

  if (attributes) {
    Object.keys(attributes).forEach(attrName => {
      const attrValue = attributes[attrName];
      buffer.push(` ${attrName}="${attrValue}"`);
    });
  }

  if (node.selfClose) {
    buffer.push(' /');
  }
  buffer.push('>');

  return buffer.join('');
}

function generateCloseTagString({ tagName }: CloseTagNode) {
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
  const buffer: string[] = [];

  const walker = rootNode.walker();
  let event: ReturnType<typeof walker.next> = null;
  let blockingNodeId = -1;
  let childText = '';
  while ((event = walker.next())) {
    const { node, entering } = event;
    const convertor = convertors[node.type];
    if (!convertor) {
      continue;
    }

    const context: Context = {
      entering,
      leaf: isContainer(node)
    };

    if (blockingNodeId > 0) {
      if (blockingNodeId === node.id) {
        context.childText = childText;
        const htmlNode = convertor(node, context) as OpenTagNode;
        buffer.push(generateOpenTagString(htmlNode));
        blockingNodeId = -1;
      } else if (node.type === 'text') {
        childText += node.literal;
      }
      continue;
    }

    if (node.type === 'image') {
      blockingNodeId = node.id;
      childText = '';
      continue;
    }

    const converted = convertor(node, context);
    const htmlNodes = Array.isArray(converted) ? converted : [converted];

    htmlNodes.forEach(htmlNode => renderHTMLNode(htmlNode, buffer));
  }
  addNewLine(buffer);

  return buffer.join('');
}

function renderHTMLNode(node: HTMLNode, buffer: string[]) {
  switch (node.type) {
    case 'openTag':
    case 'closeTag':
      renderElementNode(node, buffer);
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

function renderElementNode(node: OpenTagNode | CloseTagNode, buffer: string[]) {
  if (node.type === 'openTag') {
    addOuterNewLine(node, buffer);
    buffer.push(generateOpenTagString(node));
    if (node.selfClose) {
      addOuterNewLine(node, buffer);
    } else {
      addInnerNewLine(node, buffer);
    }
  } else {
    addInnerNewLine(node, buffer);
    buffer.push(generateCloseTagString(node));
    addOuterNewLine(node, buffer);
  }
}

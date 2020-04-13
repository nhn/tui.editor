import { Node, NodeType, isContainer } from '../commonmark/node';
import { escapeXml } from '../commonmark/common';
import { last } from '../helper';
import { baseConvertors } from './baseConvertors';
import { gfmConvertors } from './gfmConvertors';

interface Options {
  gfm: boolean;
  softbreak: string;
  nodeId: boolean;
  tagFilter: boolean;
  convertors?: HTMLConvertorMap;
}

interface Context {
  entering: boolean;
  leaf: boolean;
  options: Omit<Options, 'gfm'>;
  origin?: () => ReturnType<HTMLConvertor>;
  childText?: string;
}

export type HTMLConvertor = (node: Node, context: Context) => HTMLNode | HTMLNode[] | null;

export type HTMLConvertorMap = Partial<Record<NodeType, HTMLConvertor>>;

interface TagNode {
  tagName: string;
  outerNewLine?: boolean;
  innerNewLine?: boolean;
}

export interface OpenTagNode extends TagNode {
  type: 'openTag';
  classNames?: string[];
  attributes?: Record<string, string>;
  selfClose?: boolean;
}

export interface CloseTagNode extends TagNode {
  type: 'closeTag';
}

interface TextNode {
  type: 'text';
  content: string;
}

export interface RawHTMLNode {
  type: 'html';
  content: string;
  outerNewLine?: boolean;
}

export type HTMLNode = OpenTagNode | CloseTagNode | TextNode | RawHTMLNode;

const defaultOptions: Options = {
  softbreak: '\n',
  gfm: false,
  tagFilter: false,
  nodeId: false
};

export function createRenderHTML(customOptions?: Partial<Options>) {
  const options = { ...defaultOptions, ...customOptions };
  const convertors = { ...baseConvertors };

  if (options.gfm) {
    Object.assign(convertors, gfmConvertors);
  }

  if (options.convertors) {
    const customConvertors = options.convertors;
    const nodeTypes = Object.keys(customConvertors) as NodeType[];
    nodeTypes.forEach(nodeType => {
      const orgConvertor = convertors[nodeType];
      const extConvertor = customConvertors[nodeType]!;
      if (orgConvertor) {
        convertors[nodeType] = (node, context) => {
          context.origin = () => orgConvertor(node, context);
          return extConvertor(node, context);
        };
      } else {
        convertors[nodeType] = extConvertor;
      }
    });
    delete options.convertors;
  }

  return (node: Node) => render(node, convertors, options);
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
  if (buffer.length && last(last(buffer)) !== '\n') {
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

function render(rootNode: Node, convertors: HTMLConvertorMap, options: Options): string {
  const buffer: string[] = [];
  const walker = rootNode.walker();
  let event: ReturnType<typeof walker.next> = null;
  let currImageNodeId = -1;
  let childText = '';

  while ((event = walker.next())) {
    const { node, entering } = event;
    const convertor = convertors[node.type];
    if (!convertor) {
      continue;
    }

    const context: Context = {
      entering,
      leaf: isContainer(node),
      options
    };

    if (currImageNodeId > 0) {
      if (currImageNodeId === node.id) {
        context.childText = childText;
        const htmlNode = convertor(node, context) as OpenTagNode;
        buffer.push(generateOpenTagString(htmlNode));
        currImageNodeId = -1;
      } else if (node.type === 'text') {
        childText += node.literal;
      }
      continue;
    }

    if (node.type === 'image') {
      currImageNodeId = node.id;
      childText = '';
      continue;
    }

    const converted = convertor(node, context);
    if (converted) {
      const htmlNodes = Array.isArray(converted) ? converted : [converted];
      htmlNodes.forEach((htmlNode, index) => {
        if (htmlNode.type === 'openTag' && options.nodeId && index === 0) {
          if (!htmlNode.attributes) {
            htmlNode.attributes = {};
          }
          htmlNode.attributes['data-nodeid'] = String(node.id);
        }
        renderHTMLNode(htmlNode, buffer);
      });
    }
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

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
  options: Omit<Options, 'gfm' | 'convertors'>;
  getChildrenText: (node: Node) => string;
  skipChildren: () => void;
  origin?: () => ReturnType<HTMLConvertor>;
}

export type HTMLConvertor = (node: Node, context: Context) => HTMLToken | HTMLToken[] | null;

export type HTMLConvertorMap = Partial<Record<NodeType, HTMLConvertor>>;

interface TagToken {
  tagName: string;
  outerNewLine?: boolean;
  innerNewLine?: boolean;
}

export interface OpenTagToken extends TagToken {
  type: 'openTag';
  classNames?: string[];
  attributes?: Record<string, string>;
  selfClose?: boolean;
}

export interface CloseTagToken extends TagToken {
  type: 'closeTag';
}

interface TextToken {
  type: 'text';
  content: string;
}

export interface RawHTMLToken {
  type: 'html';
  content: string;
  outerNewLine?: boolean;
}

export type HTMLToken = OpenTagToken | CloseTagToken | TextToken | RawHTMLToken;

const defaultOptions: Options = {
  softbreak: '\n',
  gfm: false,
  tagFilter: false,
  nodeId: false
};

export function createRenderHTML(customOptions?: Partial<Options>) {
  const options = { ...defaultOptions, ...customOptions };
  let convertors = { ...baseConvertors };

  if (options.gfm) {
    convertors = { ...convertors, ...gfmConvertors };
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

function generateOpenTagString(node: OpenTagToken): string {
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

function generateCloseTagString({ tagName }: CloseTagToken) {
  return `</${tagName}>`;
}

function addNewLine(buffer: string[]) {
  if (buffer.length && last(last(buffer)) !== '\n') {
    buffer.push('\n');
  }
}

function addOuterNewLine(node: TagToken | RawHTMLToken, buffer: string[]) {
  if (node.outerNewLine) {
    addNewLine(buffer);
  }
}

function addInnerNewLine(node: TagToken, buffer: string[]) {
  if (node.innerNewLine) {
    addNewLine(buffer);
  }
}

function getChildrenText(node: Node) {
  const buffer: string[] = [];
  const walker = node.walker();
  let event: ReturnType<typeof walker.next> = null;

  while ((event = walker.next())) {
    const { node } = event;
    if (node.type === 'text') {
      buffer.push(node.literal!);
    }
  }
  return buffer.join('');
}

function render(rootNode: Node, convertors: HTMLConvertorMap, options: Options): string {
  const buffer: string[] = [];
  const walker = rootNode.walker();
  let event: ReturnType<typeof walker.next> = null;

  while ((event = walker.next())) {
    const { node, entering } = event;
    const convertor = convertors[node.type];
    if (!convertor) {
      continue;
    }

    let skipped = false;
    const context: Context = {
      entering,
      leaf: !isContainer(node),
      options,
      getChildrenText,
      skipChildren: () => {
        skipped = true;
      }
    };

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

      if (skipped) {
        walker.resumeAt(node, false);
        walker.next();
      }
    }
  }
  addNewLine(buffer);

  return buffer.join('');
}

function renderHTMLNode(node: HTMLToken, buffer: string[]) {
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
    default:
    // no-defualt-case
  }
}

function renderTextNode(node: TextToken, buffer: string[]) {
  buffer.push(escapeXml(node.content));
}

function renderRawHtmlNode(node: RawHTMLToken, buffer: string[]) {
  addOuterNewLine(node, buffer);
  buffer.push(node.content);
  addOuterNewLine(node, buffer);
}

function renderElementNode(node: OpenTagToken | CloseTagToken, buffer: string[]) {
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

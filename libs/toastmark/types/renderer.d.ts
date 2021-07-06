import { MdNode, MdNodeType } from './node';

export type HTMLConvertor = (
  node: MdNode,
  context: Context,
  convertors?: HTMLConvertorMap
) => HTMLToken | HTMLToken[] | null;

export type HTMLConvertorMap = Partial<Record<MdNodeType | string, HTMLConvertor>>;

interface RendererOptions {
  gfm: boolean;
  softbreak: string;
  nodeId: boolean;
  tagFilter: boolean;
  convertors?: HTMLConvertorMap;
}

interface Context {
  entering: boolean;
  leaf: boolean;
  options: Omit<RendererOptions, 'convertors'>;
  getChildrenText: (node: MdNode) => string;
  skipChildren: () => void;
  origin?: () => ReturnType<HTMLConvertor>;
}

interface TagToken {
  tagName: string;
  outerNewLine?: boolean;
  innerNewLine?: boolean;
}

export interface OpenTagToken extends TagToken {
  type: 'openTag';
  classNames?: string[];
  attributes?: Record<string, any>;
  selfClose?: boolean;
}

export interface CloseTagToken extends TagToken {
  type: 'closeTag';
}

export interface TextToken {
  type: 'text';
  content: string;
}

export interface RawHTMLToken {
  type: 'html';
  content: string;
  outerNewLine?: boolean;
}

export type HTMLToken = OpenTagToken | CloseTagToken | TextToken | RawHTMLToken;

export class HTMLRenderer {
  constructor(customOptions?: Partial<RendererOptions>);

  getConvertors(): HTMLConvertorMap;

  getOptions(): RendererOptions;

  render(rootNode: MdNode): string;

  renderHTMLNode(node: HTMLToken): void;
}

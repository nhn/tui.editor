import {
  NodeType,
  MarkType,
  Mark,
  Schema,
  ProsemirrorNode,
  DOMOutputSpecArray
} from 'prosemirror-model';

import { MdNode, MdNodeType } from './markdown';
import { WwNodeType, WwMarkType } from './wysiwyg';

export type Attrs = { [name: string]: any } | null;

export interface StackItem {
  type: NodeType;
  attrs: Attrs | null;
  content: ProsemirrorNode[];
}

export interface ToWwConvertorStateType {
  schema: Schema;
  top(): StackItem;
  push(node: ProsemirrorNode): void;
  addText(text: string): void;
  openMark(mark: Mark): void;
  closeMark(mark: MarkType): void;
  addNode(type: NodeType, attrs?: Attrs, content?: ProsemirrorNode[]): ProsemirrorNode | null;
  openNode(type: NodeType, attrs?: Attrs): void;
  closeNode(): ProsemirrorNode | null;
  convertNode(mdNode: MdNode): ProsemirrorNode | null;
  convertByDOMParser(html: string, hasContainer?: boolean): void;
}

type ToWwConvertor = (
  state: ToWwConvertorStateType,
  node: MdNode,
  context: {
    entering: boolean;
    skipChildren: () => void;
  }
) => void;

export type ToWwConvertorMap = Partial<Record<MdNodeType, ToWwConvertor>>;

export type FirstDelimFn = (index: number) => string;

export interface ToMdConvertorStateType {
  inCell: boolean;
  flushClose(size?: number): void;
  wrapBlock(delim: string, firstDelim: string | null, node: ProsemirrorNode, fn: () => void): void;
  ensureNewLine(): void;
  write(content?: string): void;
  closeBlock(node: ProsemirrorNode): void;
  text(text: string, escaped?: boolean): void;
  convertBlock(node: ProsemirrorNode, parent: ProsemirrorNode, index: number): void;
  convertInline(parent: ProsemirrorNode): void;
  convertList(node: ProsemirrorNode, delim: string, firstDelimFn: FirstDelimFn): void;
  convertTableCell(node: ProsemirrorNode): void;
  convertNode(parent: ProsemirrorNode): string;
}

// @TODO
export interface ToMdConvertorContext {
  delim?: string | string[];
  rawHTML?: boolean | string | string[];
  text?: string;
  attrs?: {
    [key: string]: any;
  };
}

type ToMdOriginConvertorContext = (
  node: ProsemirrorNode | Mark,
  entering?: boolean,
  parent?: ProsemirrorNode,
  index?: number
) => ToMdConvertorContext;

export type ToMdOriginConvertorContextMap = Partial<
  Record<WwNodeType | MdNodeType, ToMdOriginConvertorContext>
>;

export type OriginContext = (() => ToMdOriginConvertorContext) | (() => () => {});

interface ToMdCustomConvertorContext {
  node: ProsemirrorNode | Mark;
  parent?: ProsemirrorNode;
  index?: number;
  origin: OriginContext;
  entering?: boolean;
}

type ToMdCustomConvertor = (
  state: ToMdConvertorStateType,
  context: ToMdCustomConvertorContext
) => ToMdConvertorContext | ToMdOriginConvertorContext | void;

export type ToMdCustomConvertorMap = Partial<Record<WwNodeType | MdNodeType, ToMdCustomConvertor>>;

export interface NodeInfo {
  node: ProsemirrorNode;
  parent?: ProsemirrorNode;
  index?: number;
}

export interface MarkInfo {
  node: Mark;
  parent?: ProsemirrorNode;
  index?: number;
  entering?: boolean;
}

type ToMdConvertorForNodes = (
  state: ToMdConvertorStateType,
  nodeInfo: NodeInfo,
  context: ToMdConvertorContext
) => void;

type MarkConvertor = (
  state: ToMdConvertorStateType,
  mark: Mark,
  parent: ProsemirrorNode,
  index: number
) => string;

interface ToMdConvertorForMarks {
  mixable?: boolean;
  removedEnclosingWhitespace?: boolean;
  escape?: boolean;
}

export type ToMdNodeConvertorMap = Partial<Record<WwNodeType, ToMdConvertorForNodes>>;

export type ToMdMarkConvertorMap = Partial<Record<WwMarkType, ToMdConvertorForMarks>>;

export interface ToMdConvertorMap {
  nodes: ToMdNodeConvertorMap;
  marks: ToMdMarkConvertorMap;
}

export interface ToDOMAdaptor {
  getToDOM(type: string): ((node: ProsemirrorNode | Mark) => DOMOutputSpecArray) | null;
  getToDOMNode(type: string): ((node: ProsemirrorNode | Mark) => Node) | null;
}

type HTMLToWwConvertor = (state: ToWwConvertorStateType, node: MdNode, openTagName: string) => void;

export type HTMLToWwConvertorMap = Partial<Record<string, HTMLToWwConvertor>>;

export interface FlattenHTMLToWwConvertorMap {
  [k: string]: HTMLToWwConvertor;
}

export interface ToMdMarkConvertors {
  nodes: ToMdNodeConvertorMap;
  marks: ToMdMarkConvertorMap;
}

import { NodeType, Node, MarkType, Mark, Schema } from 'prosemirror-model';

import { MdNode, MdNodeType } from './markdown';
import { WwNodeType, WwMarkType } from './wysiwyg';

export type Attrs = { [name: string]: any } | null;

export interface StackItem {
  type: NodeType;
  attrs: Attrs | null;
  content: Node[];
}

export interface ToWwConvertorStateType {
  schema: Schema;
  top(): StackItem;
  push(node: Node): void;
  addText(text: string): void;
  openMark(mark: Mark): void;
  closeMark(mark: MarkType): void;
  addNode(type: NodeType, attrs?: Attrs, content?: Node[]): Node | null;
  openNode(type: NodeType, attrs?: Attrs): void;
  closeNode(): Node | null;
  convertNode(mdNode: MdNode): Node | null;
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
  flushClose(size?: number): void;
  wrapBlock(delim: string, firstDelim: string | null, node: Node, fn: () => void): void;
  ensureNewLine(): void;
  write(content?: string): void;
  closeBlock(node: Node): void;
  text(text: string, escape?: boolean): void;
  convertBlock(node: Node, parent: Node, index: number): void;
  convertInline(parent: Node): void;
  convertList(node: Node, delim: string, firstDelimFn: FirstDelimFn): void;
  convertNode(parent: Node): string;
  escape(str: string, startOfLine?: boolean): string;
  quote(str: string): string;
  repeat(str: string, count: number): string;
  getEnclosingWhitespace(
    text: string
  ): {
    leading?: string;
    trailing?: string;
  };
}

type ToMdConvertorForNodes = (
  state: ToMdConvertorStateType,
  node: Node,
  parent?: Node,
  index?: number
) => void;

type MarkConvertor = (
  state: ToMdConvertorStateType,
  mark: Mark,
  parent: Node,
  index: number
) => string;

interface ToMdConvertorForMarks {
  open: string | MarkConvertor;
  close: string | MarkConvertor;
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

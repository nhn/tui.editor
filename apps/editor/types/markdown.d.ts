import { MdNode, TableMdNode, Sourcepos, NodeWalker } from './toastmark';

export interface TableRowMdNode extends MdNode {
  parent: TableBodyMdNode | TableHeadMdNode;
}

export interface TableBodyMdNode extends MdNode {
  parent: TableMdNode;
}

export interface TableHeadMdNode extends MdNode {
  parent: TableMdNode;
  firstChild: TableRowMdNode;
  lastChild: TableRowMdNode;
  next: TableBodyMdNode;
}

export interface MdLikeNode {
  type: string;
  literal: string | null;
  wysiwygNode?: boolean;
  level?: number;
  destination?: string;
  title?: string;
  info?: string;
  cellType?: 'head' | 'body';
  align?: 'left' | 'center' | 'right';
  listData?: {
    type?: 'bullet' | 'ordered';
    start?: number;
    task?: boolean;
    checked?: boolean;
  };
  attrs?: Record<string, string | null>;
  childrenHTML?: string;
}

export interface HTMLMdNode {
  type: string;
  id: number;
  parent: MdNode | null;
  prev: MdNode | null;
  next: MdNode | null;
  sourcepos?: Sourcepos;
  firstChild: MdNode | null;
  lastChild: MdNode | null;
  literal: string | null;

  isContainer(): boolean;
  unlink(): void;
  replaceWith(node: MdNode): void;
  insertAfter(node: MdNode): void;
  insertBefore(node: MdNode): void;
  appendChild(child: MdNode): void;
  prependChild(child: MdNode): void;
  walker(): NodeWalker;

  attrs?: Record<string, string | null>;
  childrenHTML?: string;
}

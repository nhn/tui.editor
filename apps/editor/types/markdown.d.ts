import { MdNode, TableMdNode } from './toastmark';

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

export interface HTMLMdNode extends MdNode {
  literal: string | null;
  attrs?: Record<string, string | null>;
  childrenHTML?: string;
}

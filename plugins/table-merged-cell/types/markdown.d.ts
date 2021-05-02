import type { TableCellMdNode, TableMdNode } from '@toast-ui/toastmark';

interface TableBodyMdNode extends MdNode {
  parent: TableMdNode;
}

interface TableHeadMdNode extends MdNode {
  parent: TableMdNode;
  firstChild: MergedTableRowMdNode;
  lastChild: MergedTableRowMdNode;
  next: TableBodyMdNode;
}

type SpanType = '@cols' | '@rows';
type SpanInfo = [spanCount: number, content: string];

export interface MergedTableRowMdNode extends MdNode {
  firstChild: MergedTableCell | null;
  lastChild: MergedTableCell | null;
  parent: TableBodyMdNode | TableHeadMdNode;
  prev: MergedTableRow | null;
  next: MergedTableRow | null;
  rowspanMap: { [key: string]: number };
}

export interface MergedTableCellMdNode extends TableCellMdNode {
  prev: MergedTableCell | null;
  next: MergedTableCell | null;
  parent: MergedTableRow;
}

import type { TableCellMdNode, TableMdNode } from '@toast-ui/toastmark';

interface TableRowMdNode extends MdNode {
  firstChild: MergedTableCell | null;
  lastChild: MergedTableCell | null;
  parent: TableBodyMdNode | TableHeadMdNode;
}

interface TableBodyMdNode extends MdNode {
  parent: TableMdNode;
}

interface TableHeadMdNode extends MdNode {
  parent: TableMdNode;
  firstChild: TableRowMdNode;
  lastChild: TableRowMdNode;
  next: TableBodyMdNode;
}

type SpanType = '@cols' | '@rows';
type SpanInfo = [spanCount: number, content: string];
export type MergedTableRow = TableRowMdNode & {
  prev: MergedTableRow | null;
  next: MergedTableRow | null;
  rowspanMap: { [key: string]: number };
};
export type MergedTableCell = TableCellMdNode & {
  prev: MergedTableCell | null;
  next: MergedTableCell | null;
  parent: MergedTableRow;
  colspan: number;
  rowspan: number;
};

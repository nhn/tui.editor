import type { PluginCommandMap } from '@toast-ui/editor';
import type { TableCellMdNode, TableMdNode } from '@toast-ui/toastmark';
import type { Selection } from 'prosemirror-state';
import type { Node, ResolvedPos } from 'prosemirror-model';

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

export interface CellSelection extends Selection {
  startCell: ResolvedPos;
  endCell: ResolvedPos;
  isCellSelection: boolean;
}

interface CellInfo {
  offset: number;
  nodeSize: number;
  extended?: boolean;
}

interface SelectionInfo {
  startRowIdx: number;
  startColIdx: number;
  endRowIdx: number;
  endColIdx: number;
}

interface SpanMap {
  [key: number]: { count: number; startSpanIdx: number };
}

export interface RowInfo {
  [key: number]: CellInfo;
  length: number;
  rowspanMap: SpanMap;
  colspanMap: SpanMap;
}

interface SpanInfo {
  node: Node;
  pos: number;
  count: number;
  startSpanIdx: number;
}

export interface TableOffsetMapFactory {
  create(pos: ResolvedPos): TableOffsetMap;
}

export interface TableOffsetMap {
  rowInfo: RowInfo[];
  table: Node;
  totalRowCount: number;
  totalColumnCount: number;
  tableStartOffset: number;
  tableEndOffset: number;
  getCellInfo(rowIdx: number, colIdx: number): CellInfo;
  posAt(rowIdx: number, colIdx: number): number;
  getNodeAndPos(rowIdx: number, colIdx: number): { node: Node; pos: number };
  extendedRowspan(rowIdx: number, colIdx: number): boolean;
  extendedColspan(rowIdx: number, colIdx: number): boolean;
  getRowspanCount(rowIdx: number, colIdx: number): number;
  getColspanCount(rowIdx: number, colIdx: number): number;
  decreaseColspanCount(rowIdx: number, colIdx: number): number;
  decreaseRowspanCount(rowIdx: number, colIdx: number): number;
  getColspanStartInfo(rowIdx: number, colIdx: number): SpanInfo | null;
  getRowspanStartInfo(rowIdx: number, colIdx: number): SpanInfo | null;
  getRectOffsets(startCellPos: ResolvedPos, endCellPos?: ResolvedPos): SelectionInfo;
  getSpannedOffsets(selectionInfo: SelectionInfo): SelectionInfo;
}

export type CommandFn = PluginCommandMap[keyof PluginCommandMap];

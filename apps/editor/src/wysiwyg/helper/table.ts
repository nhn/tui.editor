import { Node, Schema, ResolvedPos, Slice, ProsemirrorNode } from 'prosemirror-model';
import { Selection, TextSelection } from 'prosemirror-state';

import { findNodeBy } from '@/wysiwyg/helper/node';

import { CellSelection } from '@t/wysiwyg';
import type { SelectionInfo } from './tableOffsetMap';

export function createTableHeadRow(columnCount: number, schema: Schema, data?: string[]) {
  const { tableRow, tableHeadCell, paragraph } = schema.nodes;
  const cells = [];

  for (let index = 0; index < columnCount; index += 1) {
    const text = data && data[index];
    const para = paragraph.create(null, text ? schema.text(text) : []);

    cells.push(tableHeadCell.create(null, para));
  }

  return [tableRow.create(null, cells)];
}

export function createTableBodyRows(
  rowCount: number,
  columnCount: number,
  schema: Schema,
  data?: string[]
) {
  const { tableRow, tableBodyCell, paragraph } = schema.nodes;
  const tableRows = [];

  for (let rowIdx = 0; rowIdx < rowCount; rowIdx += 1) {
    const cells = [];

    for (let colIdx = 0; colIdx < columnCount; colIdx += 1) {
      const text = data && data[rowIdx * columnCount + colIdx];
      const para = paragraph.create(null, text ? schema.text(text) : []);

      cells.push(tableBodyCell.create(null, para));
    }

    tableRows.push(tableRow.create(null, cells));
  }

  return tableRows;
}

export function createDummyCells(
  columnCount: number,
  rowIdx: number,
  schema: Schema,
  attrs: Record<string, any> | null = null
) {
  const { tableHeadCell, tableBodyCell, paragraph } = schema.nodes;
  const cell = rowIdx === 0 ? tableHeadCell : tableBodyCell;
  const cells = [];

  for (let index = 0; index < columnCount; index += 1) {
    cells.push(cell.create(attrs, paragraph.create()));
  }

  return cells;
}

export function findCellElement(node: HTMLElement, root: Element) {
  while (node && node !== root) {
    if (node.nodeName === 'TD' || node.nodeName === 'TH') {
      return node;
    }

    node = node.parentNode as HTMLElement;
  }

  return null;
}

export function findCell(pos: ResolvedPos) {
  return findNodeBy(
    pos,
    ({ type }: Node) => type.name === 'tableHeadCell' || type.name === 'tableBodyCell'
  );
}

export function getResolvedSelection(selection: Selection | CellSelection) {
  if (selection instanceof TextSelection) {
    const { $anchor } = selection;
    const foundCell = findCell($anchor);

    if (foundCell) {
      const anchor = $anchor.node(0).resolve($anchor.before(foundCell.depth));

      return { anchor, head: anchor };
    }
  }

  const { startCell, endCell } = selection as CellSelection;

  return { anchor: startCell, head: endCell };
}

export function getTableContentFromSlice(slice: Slice) {
  if (slice.size) {
    let { content, openStart, openEnd } = slice;

    if (content.childCount !== 1) {
      return null;
    }

    while (
      content.childCount === 1 &&
      ((openStart > 0 && openEnd > 0) || content.firstChild?.type.name === 'table')
    ) {
      openStart -= 1;
      openEnd -= 1;
      content = content.firstChild!.content;
    }

    if (
      content.firstChild!.type.name === 'tableHead' ||
      content.firstChild!.type.name === 'tableBody'
    ) {
      return content;
    }
  }

  return null;
}

export function getRowAndColumnCount({
  startRowIdx,
  startColIdx,
  endRowIdx,
  endColIdx,
}: SelectionInfo) {
  const rowCount = endRowIdx - startRowIdx + 1;
  const columnCount = endColIdx - startColIdx + 1;

  return { rowCount, columnCount };
}

export function setAttrs(cell: ProsemirrorNode, attrs: Record<string, any>) {
  return { ...cell.attrs, ...attrs };
}

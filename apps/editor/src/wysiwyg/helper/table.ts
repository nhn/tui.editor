import { Node, Schema, ResolvedPos } from 'prosemirror-model';
import { Selection, TextSelection } from 'prosemirror-state';

import { findNodeBy } from '@/wysiwyg/helper/node';

export interface CellPosInfo {
  offset: number;
  nodeSize: number;
}

export interface SelectionInfo {
  rowIndex: number;
  rowCount: number;
  columnIndex: number;
  columnCount: number;
}

export function createTableRows(
  columnCount: number,
  rowCount: number,
  schema: Schema,
  isTableBody: boolean,
  data?: string[] | null
) {
  const { tableRow, tableHeadCell, tableBodyCell } = schema.nodes;
  const tableRows = [];
  const cell = isTableBody ? tableBodyCell : tableHeadCell;

  let index = isTableBody ? columnCount : 0;

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const cells = [];

    for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
      const text = data && data[index];

      if (text) {
        index += 1;
      }

      cells.push(cell.create(null, text ? schema.text(text) : []));
    }

    tableRows.push(tableRow.create(null, cells));
  }

  return tableRows;
}

export function createCellsToAdd(count: number, offset: number, doc: Node) {
  const { type } = doc
    .resolve(offset + 1)
    .node()
    .copy();
  const cells = [];

  for (let index = 0; index < count; index += 1) {
    cells.push(type.create());
  }

  return cells;
}

export function findCell(pos: ResolvedPos) {
  return findNodeBy(
    pos,
    ({ type }: Node) => type.name === 'tableHeadCell' || type.name === 'tableBodyCell'
  );
}

export function findPrevCell([rowIndex, columnIndex]: number[], cellsPosInfo: CellPosInfo[][]) {
  const allColumnCount = cellsPosInfo[0].length;

  const firstCellInRow = columnIndex === 0;
  const firstCellInTable = rowIndex === 0 && firstCellInRow;

  if (!firstCellInTable) {
    columnIndex -= 1;

    if (firstCellInRow) {
      rowIndex -= 1;
      columnIndex = allColumnCount - 1;
    }

    return cellsPosInfo[rowIndex][columnIndex];
  }

  return null;
}

export function findNextCell([rowIndex, columnIndex]: number[], cellsPosInfo: CellPosInfo[][]) {
  const allRowCount = cellsPosInfo.length;
  const allColumnCount = cellsPosInfo[0].length;

  const lastCellInRow = columnIndex === allColumnCount - 1;
  const lastCellInTable = rowIndex === allRowCount - 1 && lastCellInRow;

  if (!lastCellInTable) {
    columnIndex += 1;

    if (lastCellInRow) {
      rowIndex += 1;
      columnIndex = 0;
    }

    return cellsPosInfo[rowIndex][columnIndex];
  }

  return null;
}

export function isInCellElement(node: HTMLElement, root: Element) {
  while (node && node !== root) {
    if (node.nodeName === 'TD' || node.nodeName === 'TH') {
      return true;
    }

    node = node.parentNode as HTMLElement;
  }

  return false;
}

export function getResolvedSelection(selection: Selection) {
  const { $anchor, $head } = selection;
  let anchor = $anchor;
  let head = $head;

  if (selection instanceof TextSelection) {
    const foundCell = findCell($anchor);

    if (foundCell) {
      anchor = $anchor.node(0).resolve($anchor.before(foundCell.depth));
      head = anchor;
    }
  }

  return { anchor, head };
}

function getCellsPosInfo(headOrBody: Node, startOffset: number) {
  const infoList: CellPosInfo[][] = [];

  headOrBody.forEach((row: Node, rowOffset: number) => {
    const cellInfoList: CellPosInfo[] = [];

    row.forEach(({ nodeSize }: Node, cellOffset: number) => {
      cellInfoList.push({
        // 2 is the sum of the front and back positions of the closing tag
        offset: startOffset + rowOffset + cellOffset + 2,
        nodeSize
      });
    });

    infoList.push(cellInfoList);
  });

  return infoList;
}

export function getTableCellsInfo(cellPos: ResolvedPos) {
  const foundTable = findNodeBy(cellPos, ({ type }: Node) => type.name === 'table');

  if (foundTable) {
    const { node, depth } = foundTable;
    const tablePos = cellPos.start(depth);

    const thead = node.child(0);
    const tbody = node.child(1);

    const theadCellsPos = getCellsPosInfo(thead, tablePos);
    const tbodyCellsPos = getCellsPosInfo(tbody, tablePos + thead.nodeSize);

    return theadCellsPos.concat(tbodyCellsPos);
  }

  return [];
}

function getIndexByRange(startIndex: number, endIndex: number) {
  return Math.min(startIndex, endIndex);
}

function getCountByRange(startIndex: number, endIndex: number) {
  return Math.abs(startIndex - endIndex) + 1;
}

export function getCellIndexInfo(cellPos: ResolvedPos) {
  const { pos, parentOffset } = cellPos;

  let rowIndex = cellPos
    .node(0)
    .resolve(pos - parentOffset - 1)
    .index();

  if (cellPos.nodeAfter && cellPos.nodeAfter.type.name !== 'tableHeadCell') {
    rowIndex += 1;
  }

  const columnIndex = cellPos.index();

  return [rowIndex, columnIndex];
}

export function getSelectionInfo(startCellPos: ResolvedPos, endCellPos = startCellPos) {
  const [startRowIndex, startColumnIndex] = getCellIndexInfo(startCellPos);
  const [endRowIndex, endColumnIndex] = getCellIndexInfo(endCellPos);

  const rowIndex = getIndexByRange(startRowIndex, endRowIndex);
  const rowCount = getCountByRange(startRowIndex, endRowIndex);

  const columnIndex = getIndexByRange(startColumnIndex, endColumnIndex);
  const columnCount = getCountByRange(startColumnIndex, endColumnIndex);

  return { rowIndex, rowCount, columnIndex, columnCount };
}

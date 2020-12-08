import { Node, Schema, ResolvedPos } from 'prosemirror-model';
import { Selection, TextSelection } from 'prosemirror-state';

import { findNodeBy } from '@/wysiwyg/helper/node';

export interface CellInfo {
  offset: number;
  nodeSize: number;
}

export interface SelectionInfo {
  startRowIndex: number;
  startColumnIndex: number;
  rowCount: number;
  columnCount: number;
}

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

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const cells = [];

    for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
      const text = data && data[rowIndex * columnCount + columnIndex];
      const para = paragraph.create(null, text ? schema.text(text) : []);

      cells.push(tableBodyCell.create(null, para));
    }

    tableRows.push(tableRow.create(null, cells));
  }

  return tableRows;
}

export function createCellsToAdd(columnCount: number, rowIndex: number, schema: Schema) {
  const { tableHeadCell, tableBodyCell } = schema.nodes;
  const cells = [];

  for (let index = 0; index < columnCount; index += 1) {
    const cell = rowIndex === 0 ? tableHeadCell : tableBodyCell;

    cells.push(cell.create());
  }

  return cells;
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

export function findCell(pos: ResolvedPos) {
  return findNodeBy(
    pos,
    ({ type }: Node) => type.name === 'tableHeadCell' || type.name === 'tableBodyCell'
  );
}

export function findNextCell([rowIndex, columnIndex]: number[], cellsInfo: CellInfo[][]) {
  const allRowCount = cellsInfo.length;
  const allColumnCount = cellsInfo[0].length;

  const lastCellInRow = columnIndex === allColumnCount - 1;
  const lastCellInTable = rowIndex === allRowCount - 1 && lastCellInRow;

  if (!lastCellInTable) {
    columnIndex += 1;

    if (lastCellInRow) {
      rowIndex += 1;
      columnIndex = 0;
    }

    return cellsInfo[rowIndex][columnIndex];
  }

  return null;
}

export function findPrevCell([rowIndex, columnIndex]: number[], cellsInfo: CellInfo[][]) {
  const allColumnCount = cellsInfo[0].length;

  const firstCellInRow = columnIndex === 0;
  const firstCellInTable = rowIndex === 0 && firstCellInRow;

  if (!firstCellInTable) {
    columnIndex -= 1;

    if (firstCellInRow) {
      rowIndex -= 1;
      columnIndex = allColumnCount - 1;
    }

    return cellsInfo[rowIndex][columnIndex];
  }

  return null;
}

function getMinimumIndex(startIndex: number, endIndex: number) {
  return Math.min(startIndex, endIndex);
}

function getCountByRange(startIndex: number, endIndex: number) {
  return Math.abs(startIndex - endIndex) + 1;
}

export function getNextRowOffset(
  { startRowIndex, rowCount }: SelectionInfo,
  cellsInfo: CellInfo[][]
) {
  const allColumnCount = cellsInfo[0].length;
  const selectedOnlyThead = startRowIndex === 0 && rowCount === 1;

  if (!selectedOnlyThead) {
    const rowIdx = startRowIndex + rowCount - 1;
    const colIdx = allColumnCount - 1;
    const { offset, nodeSize } = cellsInfo[rowIdx][colIdx];

    return offset + nodeSize + 1;
  }

  return -1;
}

export function getPrevRowOffset({ startRowIndex }: SelectionInfo, cellsInfo: CellInfo[][]) {
  const selectedThead = startRowIndex === 0;

  if (!selectedThead) {
    const [{ offset }] = cellsInfo[startRowIndex];

    return offset - 1;
  }

  return -1;
}

export function getNextColumnOffsets(
  rowIndex: number,
  { startColumnIndex, columnCount }: SelectionInfo,
  cellsInfo: CellInfo[][]
) {
  const { offset, nodeSize } = cellsInfo[rowIndex][startColumnIndex + columnCount - 1];
  const mapOffset = offset + nodeSize;

  return { offset, mapOffset };
}

export function getPrevColumnOffsets(
  rowIndex: number,
  { startColumnIndex }: SelectionInfo,
  cellsInfo: CellInfo[][]
) {
  const { offset } = cellsInfo[rowIndex][startColumnIndex];
  const mapOffset = offset;

  return { offset, mapOffset };
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

function getCellInfoMatrix(headOrBody: Node, startOffset: number) {
  const cellInfoMatrix: CellInfo[][] = [];

  headOrBody.forEach((row: Node, rowOffset: number) => {
    const cellInfoList: CellInfo[] = [];

    row.forEach(({ nodeSize }: Node, cellOffset: number) => {
      cellInfoList.push({
        // 2 is the sum of the front and back positions of the closing tag
        offset: startOffset + rowOffset + cellOffset + 2,
        nodeSize
      });
    });

    cellInfoMatrix.push(cellInfoList);
  });

  return cellInfoMatrix;
}

export function getTableCellsInfo(cellPos: ResolvedPos) {
  const foundTable = findNodeBy(cellPos, ({ type }: Node) => type.name === 'table');

  if (foundTable) {
    const { node, depth } = foundTable;
    const tablePos = cellPos.start(depth);

    const thead = node.child(0);
    const tbody = node.child(1);

    const theadCellsPos = getCellInfoMatrix(thead, tablePos);
    const tbodyCellsPos = getCellInfoMatrix(tbody, tablePos + thead.nodeSize);

    return theadCellsPos.concat(tbodyCellsPos);
  }

  return [];
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

  const rowIndex = getMinimumIndex(startRowIndex, endRowIndex);
  const columnIndex = getMinimumIndex(startColumnIndex, endColumnIndex);

  const columnCount = getCountByRange(startColumnIndex, endColumnIndex);
  const rowCount = getCountByRange(startRowIndex, endRowIndex);

  return {
    startRowIndex: rowIndex,
    startColumnIndex: columnIndex,
    rowCount,
    columnCount
  };
}

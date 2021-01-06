import { Node, ResolvedPos, Slice, Fragment } from 'prosemirror-model';
import { Selection, SelectionRange, TextSelection } from 'prosemirror-state';
import { Mappable } from 'prosemirror-transform';

import {
  getSelectionInfo,
  getTableCellsInfo,
  CellInfo,
  SelectionInfo
} from '@/wysiwyg/helper/table';

function getSelectionRanges(
  doc: Node,
  cellsPos: CellInfo[][],
  { startRowIndex, startColumnIndex, rowCount, columnCount }: SelectionInfo
) {
  const ranges = [];

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
      const rowIdx = rowIndex + startRowIndex;
      const columnIdx = columnIndex + startColumnIndex;
      const { offset, nodeSize } = cellsPos[rowIdx][columnIdx];

      ranges.push(new SelectionRange(doc.resolve(offset), doc.resolve(offset + nodeSize)));
    }
  }

  return ranges;
}

export default class CellSelection extends Selection {
  public startCell: ResolvedPos;

  public endCell: ResolvedPos;

  constructor(startCellPos: ResolvedPos, endCellPos = startCellPos) {
    const doc = startCellPos.node(0);

    const cellsPos = getTableCellsInfo(startCellPos);
    const selectionInfo = getSelectionInfo(startCellPos, endCellPos);
    const ranges = getSelectionRanges(doc, cellsPos, selectionInfo);

    super(ranges[0].$from, ranges[0].$to, ranges);

    this.startCell = startCellPos;
    this.endCell = endCellPos;

    // this property is the api of the 'Selection' in prosemirror,
    // and is used to disable the text selection
    this.visible = false;
  }

  map(doc: Node, mapping: Mappable) {
    const startCell = doc.resolve(mapping.map(this.startCell.pos));
    let endCell = doc.resolve(mapping.map(this.endCell.pos));

    const originCellCount = this.startCell.parent.childCount;
    const changedCellCount = startCell.parent.childCount;

    const removed = changedCellCount < originCellCount;

    if (removed) {
      const from = doc.resolve(startCell.pos + 1);

      return TextSelection.between(from, from);
    }

    const changed =
      changedCellCount === originCellCount &&
      startCell.pos === this.startCell.pos &&
      endCell.pos !== this.endCell.pos;

    if (changed) {
      endCell = doc.resolve(endCell.pos - endCell.nodeBefore!.nodeSize);
    }

    return new CellSelection(startCell, endCell);
  }

  eq(cell: CellSelection) {
    return (
      cell instanceof CellSelection &&
      cell.startCell.pos === this.startCell.pos &&
      cell.endCell.pos === this.endCell.pos
    );
  }

  content() {
    const table = this.startCell.node(-2);
    const tableOffset = this.startCell.start(-2);
    const row = table.child(1).firstChild!;

    const cellsPos = getTableCellsInfo(this.startCell);
    const selectionInfo = getSelectionInfo(this.startCell, this.endCell);
    const { startRowIndex, startColumnIndex, rowCount, columnCount } = selectionInfo;

    const rows = [];

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      const cells = [];

      for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
        const { offset } = cellsPos[rowIndex + startRowIndex][columnIndex + startColumnIndex];
        const cell = table.nodeAt(offset - tableOffset);

        if (cell) {
          cells.push(cell.copy(cell.content));
        }
      }

      rows.push(row.copy(Fragment.from(cells)));
    }

    return new Slice(Fragment.from(rows), 1, 1);
  }
}

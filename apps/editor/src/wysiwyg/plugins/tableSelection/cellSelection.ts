import { Node, ResolvedPos, Slice, Fragment } from 'prosemirror-model';
import { Selection, SelectionRange, TextSelection } from 'prosemirror-state';
import { Mappable } from 'prosemirror-transform';

import {
  getSelectionInfo,
  getTableCellsInfo,
  CellInfo,
  SelectionInfo
} from '@/wysiwyg/helper/table';
import { Console } from 'console';

function getSelectionRanges(
  doc: Node,
  cellsPos: CellInfo[][],
  { startRowIndex, startColumnIndex, rowCount, columnCount }: SelectionInfo
) {
  const ranges = [];

  for (let i = 0; i < rowCount; i += 1) {
    for (let j = 0; j < columnCount; j += 1) {
      const { offset, nodeSize } = cellsPos[i + startRowIndex][j + startColumnIndex];

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
  }

  map(doc: Node, mapping: Mappable) {
    const startCell = doc.resolve(mapping.map(this.startCell.pos));
    const endCell = doc.resolve(mapping.map(this.endCell.pos));
    const originChildCount = this.startCell.parent.childCount;
    const changedChildCount = startCell.parent.childCount;

    // @TODO change condition
    if (originChildCount <= changedChildCount) {
      const from = doc.resolve(startCell.pos - 1);

      return TextSelection.between(from, from);
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
    const row = table.child(1).child(0);

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
          cells.push(cell.type.create(cell.attrs, cell.content));
        }
      }

      rows.push(row.copy(Fragment.from(cells)));
    }

    return new Slice(Fragment.from(rows), 1, 1);
  }
}

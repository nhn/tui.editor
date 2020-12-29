import { Node, ResolvedPos } from 'prosemirror-model';
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
}

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
    const removed = startCell.parent.childCount < this.startCell.parent.childCount;

    if (removed) {
      const from = doc.resolve(startCell.pos + 1);

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
}

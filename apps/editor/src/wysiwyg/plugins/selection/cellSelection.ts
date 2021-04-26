import { Node, ResolvedPos, Slice, Fragment } from 'prosemirror-model';
import { Selection, SelectionRange, TextSelection } from 'prosemirror-state';
import { Mappable } from 'prosemirror-transform';

import {
  getSelectionInfo,
  getTableCellsInfo,
  RowInfo,
  SelectionInfo,
} from '@/wysiwyg/helper/table';

function getSelectionRanges(
  doc: Node,
  cellsInfo: RowInfo[],
  { startRowIdx, startColIdx, endRowIdx, endColIdx }: SelectionInfo
) {
  const ranges = [];

  for (let rowIdx = startRowIdx; rowIdx <= endRowIdx; rowIdx += 1) {
    for (let colIdx = startColIdx; colIdx <= endColIdx; colIdx += 1) {
      const { offset, nodeSize } = cellsInfo[rowIdx][colIdx];

      ranges.push(new SelectionRange(doc.resolve(offset + 1), doc.resolve(offset + nodeSize - 1)));
    }
  }
  return ranges;
}

export default class CellSelection extends Selection {
  startCell: ResolvedPos;

  endCell: ResolvedPos;

  constructor(startCellPos: ResolvedPos, endCellPos = startCellPos) {
    const doc = startCellPos.node(0);

    const cellsInfo = getTableCellsInfo(startCellPos);
    const selectionInfo = getSelectionInfo(cellsInfo, startCellPos, endCellPos);
    const ranges = getSelectionRanges(doc, cellsInfo, selectionInfo);

    super(ranges[0].$from, ranges[0].$to, ranges);

    this.startCell = startCellPos;
    this.endCell = endCellPos;

    // This property is the api of the 'Selection' in prosemirror,
    // and is used to disable the text selection.
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

    const cellsInfo = getTableCellsInfo(this.startCell);
    const selectionInfo = getSelectionInfo(cellsInfo, this.startCell, this.endCell);
    const { startRowIdx, startColIdx, endRowIdx, endColIdx } = selectionInfo;

    const rows = [];

    for (let rowIdx = startRowIdx; rowIdx <= endRowIdx; rowIdx += 1) {
      const cells = [];
      const rowInfo = cellsInfo[rowIdx];

      for (let colIdx = startColIdx; colIdx <= endColIdx; colIdx += 1) {
        const { offset } = cellsInfo[rowIdx][colIdx];
        const cell = table.nodeAt(offset - tableOffset);
        const { rowspanMap, colspanMap } = rowInfo;
        const colspan = colspanMap[colIdx];
        const rowspan = rowspanMap[colIdx];

        if (cell) {
          // mark the extended cell for pasting
          if (
            (colspan && colIdx !== colspan.startSpanIdx) ||
            (rowspan && rowIdx !== rowspan.startSpanIdx)
          ) {
            cells.push(cell.type.create({ extended: true }));
          } else {
            cells.push(cell.copy(cell.content));
          }
        }
      }
      rows.push(row.copy(Fragment.from(cells)));
    }

    return new Slice(Fragment.from(rows), 1, 1);
  }
}

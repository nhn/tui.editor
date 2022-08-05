import { Node, ResolvedPos, Slice, Fragment } from 'prosemirror-model';
import { Selection, SelectionRange, TextSelection } from 'prosemirror-state';
import { Mappable } from 'prosemirror-transform';

import { TableOffsetMap, SelectionInfo } from '@/wysiwyg/helper/tableOffsetMap';

function getSelectionRanges(
  doc: Node,
  map: TableOffsetMap,
  { startRowIdx, startColIdx, endRowIdx, endColIdx }: SelectionInfo
) {
  const ranges = [];

  for (let rowIdx = startRowIdx; rowIdx <= endRowIdx; rowIdx += 1) {
    for (let colIdx = startColIdx; colIdx <= endColIdx; colIdx += 1) {
      const { offset, nodeSize } = map.getCellInfo(rowIdx, colIdx);

      ranges.push(new SelectionRange(doc.resolve(offset + 1), doc.resolve(offset + nodeSize - 1)));
    }
  }
  return ranges;
}

function createTableFragment(tableHead: Node, tableBody: Node) {
  const fragment: Node[] = [];

  if (tableHead.childCount) {
    fragment.push(tableHead);
  }
  if (tableBody.childCount) {
    fragment.push(tableBody);
  }
  return Fragment.from(fragment);
}

export default class CellSelection extends Selection {
  private offsetMap: TableOffsetMap;

  startCell: ResolvedPos;

  endCell: ResolvedPos;

  isCellSelection: boolean;

  constructor(startCellPos: ResolvedPos, endCellPos = startCellPos) {
    const doc = startCellPos.node(0);

    const map = TableOffsetMap.create(startCellPos)!;
    const selectionInfo = map.getRectOffsets(startCellPos, endCellPos);
    const ranges = getSelectionRanges(doc, map, selectionInfo);

    super(ranges[0].$from, ranges[0].$to, ranges);

    this.startCell = startCellPos;
    this.endCell = endCellPos;
    this.offsetMap = map;
    this.isCellSelection = true;

    // This property is the api of the 'Selection' in prosemirror,
    // and is used to disable the text selection.
    this.visible = false;
  }

  map(doc: Node, mapping: Mappable) {
    const startPos = this.startCell.pos;
    const endPos = this.endCell.pos;
    const startCell = doc.resolve(mapping.map(startPos));
    const endCell = doc.resolve(mapping.map(endPos));
    const map = TableOffsetMap.create(startCell)!;

    // text selection when rows or columns are deleted
    if (
      this.offsetMap.totalColumnCount > map.totalColumnCount ||
      this.offsetMap.totalRowCount > map.totalRowCount
    ) {
      const depthMap = { tableBody: 1, tableRow: 2, tableCell: 3, paragraph: 4 };
      const depthFromTable = depthMap[endCell.parent.type.name as keyof typeof depthMap];
      const tableEndPos = endCell.end(endCell.depth - depthFromTable);
      // subtract 4(</td></tr></tbody></table> tag length)
      const from = Math.min(tableEndPos - 4, endCell.pos);

      return TextSelection.create(doc, from);
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
    const tableHead = table.child(0).type.create()!;
    const tableBody = table.child(1).type.create()!;

    const map = TableOffsetMap.create(this.startCell)!;
    const selectionInfo = map.getRectOffsets(this.startCell, this.endCell);
    const { startRowIdx, startColIdx, endRowIdx, endColIdx } = selectionInfo;

    let isTableHeadCell = false;

    for (let rowIdx = startRowIdx; rowIdx <= endRowIdx; rowIdx += 1) {
      const cells = [];

      for (let colIdx = startColIdx; colIdx <= endColIdx; colIdx += 1) {
        const { offset } = map.getCellInfo(rowIdx, colIdx);
        const cell = table.nodeAt(offset - tableOffset);

        if (cell) {
          isTableHeadCell = cell.type.name === 'tableHeadCell';
          // mark the extended cell for pasting
          if (map.extendedRowspan(rowIdx, colIdx) || map.extendedColspan(rowIdx, colIdx)) {
            cells.push(cell.type.create({ extended: true }));
          } else {
            cells.push(cell.copy(cell.content));
          }
        }
      }

      const copiedRow = row.copy(Fragment.from(cells));
      const targetNode = isTableHeadCell ? tableHead : tableBody;

      // @ts-ignore
      targetNode.content = targetNode.content.append(Fragment.from(copiedRow));
    }
    return new Slice(createTableFragment(tableHead, tableBody), 1, 1);
  }

  toJSON() {
    return JSON.stringify(this);
  }
}

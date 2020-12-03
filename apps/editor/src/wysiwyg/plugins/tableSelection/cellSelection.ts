import { Node, ResolvedPos } from 'prosemirror-model';
import { Selection, SelectionRange, TextSelection } from 'prosemirror-state';
import { Mappable } from 'prosemirror-transform';

import { CellInfo, getAllCellPosInfoList, getSelectedCellRange } from '@/wysiwyg/helper/table';

export default class CellSelection extends Selection {
  constructor(startCellPos: ResolvedPos, endCellPos = startCellPos) {
    const doc = startCellPos.node(0);

    const [startIndex, endIndex] = getSelectedCellRange(startCellPos, endCellPos);
    const positions = getAllCellPosInfoList(startCellPos).slice(startIndex, endIndex + 1);

    const ranges = positions.map(
      ({ offset, nodeSize }: CellInfo) =>
        new SelectionRange(doc.resolve(offset), doc.resolve(offset + nodeSize))
    );

    super(ranges[0].$from, ranges[0].$to, ranges);

    this.$anchor = startCellPos;
    this.$head = endCellPos;
  }

  map(doc: Node, mapping: Mappable) {
    const startCell = doc.resolve(mapping.map(this.$anchor.pos));
    const endCell = doc.resolve(mapping.map(this.$head.pos));
    const removed = startCell === endCell;

    if (removed) {
      const from = doc.resolve(startCell.pos + 1);

      return TextSelection.between(from, from);
    }

    return new CellSelection(startCell, endCell);
  }

  eq(cell: CellSelection) {
    return (
      cell instanceof CellSelection &&
      cell.$anchor.pos === this.$anchor.pos &&
      cell.$head.pos === this.$head.pos
    );
  }
}

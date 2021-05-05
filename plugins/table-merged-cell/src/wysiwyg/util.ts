import type { ResolvedPos, Node } from 'prosemirror-model';
import type { Selection, TextSelection } from 'prosemirror-state';
import type { CellSelection, SelectionInfo } from '@t/index';

type TextSelectionClass = typeof TextSelection;

export function findNodeBy(pos: ResolvedPos, condition: (node: Node, depth: number) => boolean) {
  let { depth } = pos;

  while (depth >= 0) {
    const node = pos.node(depth);

    if (condition(node, depth)) {
      return {
        node,
        depth,
        offset: depth > 0 ? pos.before(depth) : 0,
      };
    }

    depth -= 1;
  }

  return null;
}

export function findCell(pos: ResolvedPos) {
  return findNodeBy(
    pos,
    ({ type }: Node) => type.name === 'tableHeadCell' || type.name === 'tableBodyCell'
  );
}

export function getResolvedSelection(selection: Selection, SelectionClass: TextSelectionClass) {
  if (selection instanceof SelectionClass) {
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

export function getRowAndColumnCount({
  startRowIdx,
  startColIdx,
  endRowIdx,
  endColIdx,
}: SelectionInfo) {
  return { rowCount: endRowIdx - startRowIdx + 1, columnCount: endColIdx - startColIdx + 1 };
}

export function setAttrs(cell: Node, attrs: Record<string, any>) {
  return { ...cell.attrs, ...attrs };
}

export function getCellSelectionClass(selection: Selection) {
  const proto = Object.getPrototypeOf(selection);

  return proto.constructor;
}

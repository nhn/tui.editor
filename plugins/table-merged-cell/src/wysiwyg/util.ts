import type { ResolvedPos, Node, Schema } from 'prosemirror-model';
import type { Selection } from 'prosemirror-state';
import type { PluginContext } from '@toast-ui/editor';
import type { CellSelection, SelectionInfo } from '@t/index';

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

export function getResolvedSelection(selection: Selection, context: PluginContext) {
  if (selection instanceof context.pmState.TextSelection) {
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

export function createDummyCells(
  columnCount: number,
  rowIdx: number,
  schema: Schema,
  attrs: Record<string, any> | null = null
) {
  const { tableHeadCell, tableBodyCell, paragraph } = schema.nodes;
  const cell = rowIdx === 0 ? tableHeadCell : tableBodyCell;
  const cells = [];

  for (let index = 0; index < columnCount; index += 1) {
    cells.push(cell.create(attrs, paragraph.create()));
  }

  return cells;
}

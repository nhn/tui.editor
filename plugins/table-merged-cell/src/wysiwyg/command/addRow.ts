import type { PluginContext } from '@toast-ui/editor';
import type { TableOffsetMapFactory, TableOffsetMap, CommandFn, SelectionInfo } from '@t/index';
import type { Node } from 'prosemirror-model';
import { createDummyCells, getResolvedSelection, getRowAndColumnCount, setAttrs } from '../util';
import { Direction } from './direction';

type RowDirection = Direction.UP | Direction.DOWN;

function getTargetRowInfo(
  direction: RowDirection,
  map: TableOffsetMap,
  selectionInfo: SelectionInfo
) {
  let targetRowIdx: number;
  let judgeToExtendRowspan: (rowIdx: number) => boolean;
  let insertColIdx: number;
  let nodeSize: number;

  if (direction === Direction.UP) {
    targetRowIdx = selectionInfo.startRowIdx;
    judgeToExtendRowspan = (colIdx: number) => map.extendedRowspan(targetRowIdx, colIdx);
    insertColIdx = 0;
    nodeSize = -1;
  } else {
    targetRowIdx = selectionInfo.endRowIdx;
    judgeToExtendRowspan = (colIdx: number) => map.getRowspanCount(targetRowIdx, colIdx) > 1;
    insertColIdx = map.totalColumnCount - 1;
    nodeSize = !map.extendedRowspan(targetRowIdx, insertColIdx)
      ? map.getCellInfo(targetRowIdx, insertColIdx).nodeSize + 1
      : 2;
  }
  return { targetRowIdx, judgeToExtendRowspan, insertColIdx, nodeSize };
}

export function createAddRowCommand(
  context: PluginContext,
  OffsetMap: TableOffsetMapFactory,
  direction: RowDirection
) {
  const addRow: CommandFn = (_, state, dispatch) => {
    const { selection, schema, tr } = state;
    const { anchor, head } = getResolvedSelection(selection, context);

    if (!anchor || !head) {
      return false;
    }

    const map = OffsetMap.create(anchor)!;
    const { totalColumnCount } = map;
    const selectionInfo = map.getRectOffsets(anchor, head);
    const { rowCount } = getRowAndColumnCount(selectionInfo);
    const { targetRowIdx, judgeToExtendRowspan, insertColIdx, nodeSize } = getTargetRowInfo(
      direction,
      map,
      selectionInfo
    );
    const selectedThead = targetRowIdx === 0;

    if (selectedThead) {
      return false;
    }

    const rows: Node[] = [];

    const from = tr.mapping.map(map.posAt(targetRowIdx, insertColIdx)) + nodeSize;
    let cells: Node[] = [];

    for (let colIdx = 0; colIdx < totalColumnCount; colIdx += 1) {
      // increase rowspan count inside the row-spanning cell
      if (judgeToExtendRowspan(colIdx)) {
        const { node, pos } = map.getRowspanStartInfo(targetRowIdx, colIdx)!;
        const attrs = setAttrs(node, { rowspan: node.attrs.rowspan + rowCount });

        tr.setNodeMarkup(tr.mapping.map(pos), null, attrs);
      } else {
        cells = cells.concat(createDummyCells(1, targetRowIdx, schema));
      }
    }

    for (let i = 0; i < rowCount; i += 1) {
      rows.push(schema.nodes.tableRow.create(null, cells));
    }
    dispatch!(tr.insert(from, rows));
    return true;
  };

  return addRow;
}

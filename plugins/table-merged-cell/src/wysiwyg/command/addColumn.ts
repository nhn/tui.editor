import type { PluginContext } from '@toast-ui/editor';
import type { TableOffsetMapFactory, TableOffsetMap, CommandFn, SelectionInfo } from '@t/index';
import { createDummyCells, getResolvedSelection, getRowAndColumnCount, setAttrs } from '../util';
import { Direction } from './direction';

type ColDirection = Direction.LEFT | Direction.RIGHT;

function getTargetColInfo(
  direction: ColDirection,
  map: TableOffsetMap,
  selectionInfo: SelectionInfo
) {
  let targetColIdx: number;
  let judgeToExtendColspan: (rowIdx: number) => boolean;
  let insertColIdx: number;

  if (direction === Direction.LEFT) {
    targetColIdx = selectionInfo.startColIdx;
    judgeToExtendColspan = (rowIdx: number) => map.extendedColspan(rowIdx, targetColIdx);
    insertColIdx = targetColIdx;
  } else {
    targetColIdx = selectionInfo.endColIdx;
    judgeToExtendColspan = (rowIdx: number) => map.getColspanCount(rowIdx, targetColIdx) > 1;
    insertColIdx = targetColIdx + 1;
  }

  return { targetColIdx, judgeToExtendColspan, insertColIdx };
}

export function createAddColumnCommand(
  context: PluginContext,
  OffsetMap: TableOffsetMapFactory,
  direction: ColDirection
) {
  const addColumn: CommandFn = (_, state, dispatch) => {
    const { selection, tr, schema } = state;
    const { anchor, head } = getResolvedSelection(selection, context);

    if (!anchor || !head) {
      return false;
    }

    const map = OffsetMap.create(anchor)!;
    const selectionInfo = map.getRectOffsets(anchor, head);

    const { targetColIdx, judgeToExtendColspan, insertColIdx } = getTargetColInfo(
      direction,
      map,
      selectionInfo
    );

    const { columnCount } = getRowAndColumnCount(selectionInfo);
    const { totalRowCount } = map;

    for (let rowIdx = 0; rowIdx < totalRowCount; rowIdx += 1) {
      // increase colspan count inside the col-spanning cell
      if (judgeToExtendColspan(rowIdx)) {
        const { node, pos } = map.getColspanStartInfo(rowIdx, targetColIdx)!;
        const attrs = setAttrs(node, { colspan: node.attrs.colspan + columnCount });

        tr.setNodeMarkup(tr.mapping.map(pos), null, attrs);
      } else {
        const cells = createDummyCells(columnCount, rowIdx, schema);

        tr.insert(tr.mapping.map(map.posAt(rowIdx, insertColIdx)), cells);
      }
    }
    dispatch!(tr);
    return true;
  };

  return addColumn;
}

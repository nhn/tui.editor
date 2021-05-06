import type { PluginContext } from '@toast-ui/editor';
import type { TableOffsetMapFactory, CommandFn } from '@t/index';
import { getResolvedSelection, getRowAndColumnCount, setAttrs } from '../util';

export function createRemoveColumnCommand(
  context: PluginContext,
  OffsetMap: TableOffsetMapFactory
) {
  const removeColumn: CommandFn = (_, state, dispatch) => {
    const { selection, tr } = state;
    const { anchor, head } = getResolvedSelection(selection, context);

    if (!anchor || !head) {
      return false;
    }

    const map = OffsetMap.create(anchor)!;
    const selectionInfo = map.getRectOffsets(anchor, head);

    const { totalColumnCount, totalRowCount } = map;
    const { columnCount } = getRowAndColumnCount(selectionInfo);
    const selectedAllColumn = columnCount === totalColumnCount;

    if (selectedAllColumn) {
      return false;
    }

    const { startColIdx, endColIdx } = selectionInfo;
    const mapStart = tr.mapping.maps.length;

    for (let rowIdx = 0; rowIdx < totalRowCount; rowIdx += 1) {
      for (let colIdx = endColIdx; colIdx >= startColIdx; colIdx -= 1) {
        const { offset, nodeSize } = map.getCellInfo(rowIdx, colIdx);
        const colspanInfo = map.getColspanStartInfo(rowIdx, colIdx)!;

        if (!map.extendedRowspan(rowIdx, colIdx)) {
          // decrease colspan count inside the col-spanning cell
          if (colspanInfo?.count > 1) {
            const { node, pos } = map.getColspanStartInfo(rowIdx, colIdx)!;
            const colspan = map.decreaseColspanCount(rowIdx, colIdx);
            const attrs = setAttrs(node, { colspan: colspan > 1 ? colspan : null });

            tr.setNodeMarkup(tr.mapping.slice(mapStart).map(pos), null, attrs);
          } else {
            const from = tr.mapping.slice(mapStart).map(offset);
            const to = from + nodeSize;

            tr.delete(from, to);
          }
        }
      }
    }
    dispatch!(tr);
    return true;
  };

  return removeColumn;
}

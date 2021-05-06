import type { PluginContext } from '@toast-ui/editor';
import type { TableOffsetMapFactory, TableOffsetMap, CommandFn } from '@t/index';
import { getResolvedSelection, getRowAndColumnCount, setAttrs } from '../util';

function getRowRanges(map: TableOffsetMap, rowIdx: number) {
  const { totalColumnCount } = map;
  let from = Number.MAX_VALUE;
  let to = 0;

  for (let colIdx = 0; colIdx < totalColumnCount; colIdx += 1) {
    if (!map.extendedRowspan(rowIdx, colIdx)) {
      const { offset, nodeSize } = map.getCellInfo(rowIdx, colIdx);

      from = Math.min(from, offset);
      to = Math.max(to, offset + nodeSize);
    }
  }
  return { from, to };
}

export function createRemoveRowCommand(context: PluginContext, OffsetMap: TableOffsetMapFactory) {
  const removeRow: CommandFn = (_, state, dispatch) => {
    const { selection, tr } = state;
    const { anchor, head } = getResolvedSelection(selection, context);

    if (anchor && head) {
      let map = OffsetMap.create(anchor)!;
      const { totalRowCount, totalColumnCount } = map;
      const selectionInfo = map.getRectOffsets(anchor, head);
      const { rowCount } = getRowAndColumnCount(selectionInfo);
      const { startRowIdx, endRowIdx } = selectionInfo;

      const selectedThead = startRowIdx === 0;
      const selectedAllTbodyRow = rowCount === totalRowCount - 1;

      if (selectedAllTbodyRow || selectedThead) {
        return false;
      }

      for (let rowIdx = endRowIdx; rowIdx >= startRowIdx; rowIdx -= 1) {
        const mapStart = tr.mapping.maps.length;
        const { from, to } = getRowRanges(map, rowIdx);

        // delete table row
        tr.delete(from - 1, to + 1);

        for (let colIdx = 0; colIdx < totalColumnCount; colIdx += 1) {
          const rowspanInfo = map.getRowspanStartInfo(rowIdx, colIdx)!;

          if (rowspanInfo?.count > 1 && !map.extendedColspan(rowIdx, colIdx)) {
            // decrease rowspan count inside the row-spanning cell
            // eslint-disable-next-line max-depth
            if (map.extendedRowspan(rowIdx, colIdx)) {
              const { node, pos } = map.getRowspanStartInfo(rowIdx, colIdx)!;
              const rowspan = map.decreaseRowspanCount(rowIdx, colIdx);
              const attrs = setAttrs(node, { rowspan: rowspan > 1 ? rowspan : null });

              tr.setNodeMarkup(tr.mapping.slice(mapStart).map(pos), null, attrs);
              // the row-spanning cell should be moved down
            } else if (!map.extendedRowspan(rowIdx, colIdx)) {
              const { node, count } = map.getRowspanStartInfo(rowIdx, colIdx)!;
              const attrs = setAttrs(node, { rowspan: count > 2 ? count - 1 : null });
              const copiedCell = node.type.create(attrs, node.content);

              tr.insert(tr.mapping.slice(mapStart).map(map.posAt(rowIdx + 1, colIdx)), copiedCell);
            }
          }
        }
        map = OffsetMap.create(tr.doc.resolve(map.tableStartOffset))!;
      }
      dispatch!(tr);
      return true;
    }

    return false;
  };

  return removeRow;
}

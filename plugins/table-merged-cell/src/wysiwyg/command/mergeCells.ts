import type { PluginContext } from '@toast-ui/editor';
import type { TableOffsetMapFactory, TableOffsetMap, CommandFn } from '@t/index';
import type { Fragment } from 'prosemirror-model';
import {
  getCellSelectionClass,
  getResolvedSelection,
  getRowAndColumnCount,
  setAttrs,
} from '../util';

export function createMergeCellsCommand(context: PluginContext, OffsetMap: TableOffsetMapFactory) {
  const { Fragment: FragmentClass } = context.pmModel;

  const mergeCells: CommandFn = (_, state, dispatch) => {
    const { selection, tr } = state;
    const { anchor, head } = getResolvedSelection(selection, context);

    // @ts-ignore
    // judge cell selection
    if (!anchor || !head || !selection.isCellSelection) {
      return false;
    }

    const map = OffsetMap.create(anchor)!;
    const CellSelection = getCellSelectionClass(selection);

    const { totalRowCount, totalColumnCount } = map;
    const selectionInfo = map.getRectOffsets(anchor, head);
    const { rowCount, columnCount } = getRowAndColumnCount(selectionInfo);

    const { startRowIdx, startColIdx, endRowIdx, endColIdx } = selectionInfo;

    const allSelected = rowCount >= totalRowCount - 1 && columnCount === totalColumnCount;
    const hasTableHead = startRowIdx === 0 && endRowIdx > startRowIdx;

    if (!allSelected && !hasTableHead) {
      let fragment = FragmentClass.empty;

      for (let rowIdx = startRowIdx; rowIdx <= endRowIdx; rowIdx += 1) {
        for (let colIdx = startColIdx; colIdx <= endColIdx; colIdx += 1) {
          // set first cell content
          if (rowIdx === startRowIdx && colIdx === startColIdx) {
            fragment = appendFragment(rowIdx, colIdx, fragment, map);
            // set each cell content and delete the cell for spanning
          } else if (!map.extendedRowspan(rowIdx, colIdx) && !map.extendedColspan(rowIdx, colIdx)) {
            const { offset, nodeSize } = map.getCellInfo(rowIdx, colIdx);
            const from = tr.mapping.map(offset);
            const to = from + nodeSize;

            fragment = appendFragment(rowIdx, colIdx, fragment, map);

            tr.delete(from, to);
          }
        }
      }

      // set first cell span
      const { node, pos } = map.getNodeAndPos(startRowIdx, startColIdx);

      tr.setNodeMarkup(pos, null, setAttrs(node, { colspan: columnCount, rowspan: rowCount }));

      if (fragment.size) {
        // add 1 for text start offset(not node start offset)
        tr.replaceWith(pos + 1, pos + node.content.size, fragment);
      }

      tr.setSelection(new CellSelection(tr.doc.resolve(pos)));

      dispatch!(tr);
      return true;
    }

    return false;
  };

  return mergeCells;
}

function appendFragment(rowIdx: number, colIdx: number, fragment: Fragment, map: TableOffsetMap) {
  return fragment.append(map.getNodeAndPos(rowIdx, colIdx).node.content);
}

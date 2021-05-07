import type { Transaction } from 'prosemirror-state';
import type { PluginContext } from '@toast-ui/editor';
import type { TableOffsetMapFactory, TableOffsetMap, CommandFn } from '@t/index';
import type { Fragment, Node } from 'prosemirror-model';
import {
  getCellSelectionClass,
  getResolvedSelection,
  getRowAndColumnCount,
  setAttrs,
} from '../util';

interface RangeInfo {
  startNode: Node;
  startPos: number;
  rowCount: number;
  columnCount: number;
}

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

    if (allSelected || hasTableHead) {
      return false;
    }

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

    const { node, pos } = map.getNodeAndPos(startRowIdx, startColIdx);

    // set rowspan, colspan to first root cell
    setSpanToRootCell(tr, fragment, {
      startNode: node,
      startPos: pos,
      rowCount,
      columnCount,
    });

    tr.setSelection(new CellSelection(tr.doc.resolve(pos)));

    dispatch!(tr);
    return true;
  };

  return mergeCells;
}

function setSpanToRootCell(tr: Transaction, fragment: Fragment, rangeInfo: RangeInfo) {
  const { startNode, startPos, rowCount, columnCount } = rangeInfo;

  tr.setNodeMarkup(
    startPos,
    null,
    setAttrs(startNode, { colspan: columnCount, rowspan: rowCount })
  );

  if (fragment.size) {
    // add 1 for text start offset(not node start offset)
    tr.replaceWith(startPos + 1, startPos + startNode.content.size, fragment);
  }
}

function appendFragment(rowIdx: number, colIdx: number, fragment: Fragment, map: TableOffsetMap) {
  const targetFragment = map.getNodeAndPos(rowIdx, colIdx).node.content;

  // prevent to add empty string
  return targetFragment.size > 2 ? fragment.append(targetFragment) : fragment;
}

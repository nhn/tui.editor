import type { PluginContext } from '@toast-ui/editor';
import type { TableOffsetMapFactory, TableOffsetMap, CommandFn, SelectionInfo } from '@t/index';
import type { EditorView } from 'prosemirror-view';
import type { Selection } from 'prosemirror-state';
import { getCellSelectionClass, getResolvedSelection, setAttrs } from '../util';

function getColspanEndIdx(rowIdx: number, colIdx: number, map: TableOffsetMap) {
  let endColIdx = colIdx;

  if (!map.extendedRowspan(rowIdx, colIdx) && map.extendedColspan(rowIdx, colIdx)) {
    const { startSpanIdx, count } = map.getColspanStartInfo(rowIdx, colIdx)!;

    endColIdx = startSpanIdx + count;
  }
  return endColIdx;
}

export function createSplitCellsCommand(context: PluginContext, OffsetMap: TableOffsetMapFactory) {
  const splitCells: CommandFn = (_, state, dispatch, view) => {
    const { selection, tr } = state;
    const { anchor, head } = getResolvedSelection(selection, context);

    if (!anchor || !head) {
      return false;
    }

    const map = OffsetMap.create(anchor)!;
    const selectionInfo = map.getRectOffsets(anchor, head);
    const { startRowIdx, startColIdx, endRowIdx, endColIdx } = selectionInfo;

    let lastCellPos = -1;

    for (let rowIdx = startRowIdx; rowIdx <= endRowIdx; rowIdx += 1) {
      for (let colIdx = startColIdx; colIdx <= endColIdx; colIdx += 1) {
        // insert empty cell in spanning cell position
        if (map.extendedRowspan(rowIdx, colIdx) || map.extendedColspan(rowIdx, colIdx)) {
          const { node } = map.getNodeAndPos(rowIdx, colIdx);
          const colspanEndIdx = getColspanEndIdx(rowIdx, colIdx, map);
          const mappedPos = map.posAt(rowIdx, colspanEndIdx);

          let pos = tr.mapping.map(mappedPos);

          // add 2(tr end, open tag length) in case of all cells are spanning on the current row
          if (
            map.extendedRowspan(rowIdx, colspanEndIdx) &&
            mappedPos === map.posAt(rowIdx, map.totalColumnCount - 1)
          ) {
            pos += 2;
          }

          lastCellPos = Math.max(pos, lastCellPos);

          tr.insert(
            pos,
            node.type.createAndFill(setAttrs(node, { colspan: null, rowspan: null }))!
          );
          // remove colspan, rowspan of the root spanning cell
        } else {
          const { node, pos } = map.getNodeAndPos(rowIdx, colIdx);

          lastCellPos = Math.max(tr.mapping.map(pos), lastCellPos);

          tr.setNodeMarkup(
            tr.mapping.map(pos),
            null,
            setAttrs(node, { colspan: null, rowspan: null })
          );
        }
      }
    }
    dispatch!(tr);
    setCellSelection(view, selection, OffsetMap, map.tableStartOffset, selectionInfo);

    return true;
  };

  return splitCells;
}

function setCellSelection(
  view: EditorView,
  selection: Selection,
  OffsetMap: TableOffsetMapFactory,
  tableStartPos: number,
  selectionInfo: SelectionInfo
) {
  // @ts-ignore
  // judge cell selection
  if (selection.isCellSelection) {
    const { tr } = view.state;
    const CellSelection = getCellSelectionClass(selection);
    const { startRowIdx, startColIdx, endRowIdx, endColIdx } = selectionInfo;

    // get changed cell offsets
    const map = OffsetMap.create(tr.doc.resolve(tableStartPos))!;
    const { offset: startOffset } = map.getCellInfo(startRowIdx, startColIdx);
    const { offset: endOffset } = map.getCellInfo(endRowIdx, endColIdx);

    tr.setSelection(new CellSelection(tr.doc.resolve(startOffset), tr.doc.resolve(endOffset)));
    view.dispatch(tr);
  }
}

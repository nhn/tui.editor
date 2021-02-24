import { EditorState, Plugin, SelectionRange } from 'prosemirror-state';
import { EditorView, Decoration, DecorationSet } from 'prosemirror-view';

import isNull from 'tui-code-snippet/type/isNull';

import { cls } from '@/utils/dom';
import CellSelection from './cellSelection';
import TableSelection, { pluginKey } from './tableSelectionView';

const SELECTED_CELL_CLASS_NAME = cls('cell-selected');

function drawCellSelection({ selection, doc }: EditorState) {
  if (selection instanceof CellSelection) {
    const cells: Decoration[] = [];
    const { ranges } = selection;

    ranges.forEach(({ $from, $to }: SelectionRange) => {
      cells.push(Decoration.node($from.pos - 1, $to.pos + 1, { class: SELECTED_CELL_CLASS_NAME }));
    });

    return DecorationSet.create(doc, cells);
  }

  return null;
}

export function tableSelection() {
  return new Plugin({
    key: pluginKey,
    state: {
      init() {
        return null;
      },
      apply(tr, value) {
        const cellOffset = tr.getMeta(pluginKey);

        if (cellOffset) {
          return cellOffset === -1 ? null : cellOffset;
        }

        if (isNull(value) || !tr.docChanged) {
          return value;
        }

        const { deleted, pos } = tr.mapping.mapResult(value);

        return deleted ? null : pos;
      },
    },
    props: {
      decorations: drawCellSelection,
      createSelectionBetween({ state }) {
        if (!isNull(pluginKey.getState(state))) {
          return state.selection;
        }

        return null;
      },
    },
    view(editorView: EditorView) {
      return new TableSelection(editorView);
    },
  });
}

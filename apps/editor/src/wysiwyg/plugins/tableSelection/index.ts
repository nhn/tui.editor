import { EditorState, Plugin, SelectionRange } from 'prosemirror-state';
import { EditorView, Decoration, DecorationSet } from 'prosemirror-view';

import CellSelection from './cellSelection';
import TableSelection from './tableSelectionView';

import { pluginKey } from './util';

const SELECTED_CELL_CLASS_NAME = 'te-cell-selected';

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

export function tableSelectionPlugin() {
  return new Plugin({
    key: pluginKey,

    state: {
      init() {
        return null;
      },
      apply(tr, value) {
        const set = tr.getMeta(pluginKey);

        if (set) {
          return set === -1 ? null : set;
        }

        if (value === null || !tr.docChanged) {
          return value;
        }

        const { deleted, pos } = tr.mapping.mapResult(value);

        return deleted ? null : pos;
      }
    },

    props: {
      decorations: drawCellSelection,
      createSelectionBetween(view) {
        if (pluginKey.getState(view.state) !== null) {
          return view.state.selection;
        }

        return null;
      }
    },
    view(editorView: EditorView) {
      return new TableSelection(editorView);
    }
  });
}

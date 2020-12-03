import { EditorState, Plugin, SelectionRange } from 'prosemirror-state';
import { EditorView, Decoration, DecorationSet } from 'prosemirror-view';

import CellSelection from './cellSelection';
import TableSelection from './tableSelectionView';

const SELECTED_CELL_CLASS_NAME = 'te-cell-selected';

function drawCellSelection({ selection, doc }: EditorState) {
  if (selection instanceof CellSelection) {
    const cells: Decoration[] = [];
    const { ranges } = selection;

    ranges.forEach(({ $from, $to }: SelectionRange) => {
      cells.push(Decoration.node($from.pos, $to.pos, { class: SELECTED_CELL_CLASS_NAME }));
    });

    return DecorationSet.create(doc, cells);
  }

  return null;
}

export function tableSelectionPlugin() {
  return new Plugin({
    props: {
      decorations: drawCellSelection
    },
    view(editorView: EditorView) {
      return new TableSelection(editorView);
    }
  });
}

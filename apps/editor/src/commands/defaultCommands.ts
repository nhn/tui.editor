import { deleteSelection, selectAll } from 'prosemirror-commands';
import { undo, redo } from 'prosemirror-history';

import { EditorCommand } from '@t/spec';
import { EditorState, Transaction } from 'prosemirror-state';

export let undoExcuted = false;

export function getDefaultCommands(): Record<string, EditorCommand> {
  return {
    deleteSelection: () => deleteSelection,
    selectAll: () => selectAll,
    undo: () => (state: EditorState, dispatch?: ((tr: Transaction) => void) | undefined) => {
      undoExcuted = true;

      const result = undo(state, dispatch);

      undoExcuted = false;

      return result;
    },
    redo: () => redo,
  };
}

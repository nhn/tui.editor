import { deleteSelection, selectAll } from 'prosemirror-commands';
import { EditorCommand } from '@t/spec';

export function getDefaultCommands(): Record<string, EditorCommand> {
  return { deleteSelection: () => deleteSelection, selectAll: () => selectAll };
}

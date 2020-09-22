import { deleteSelection, selectAll } from 'prosemirror-commands';

export function getDefaultCommands() {
  return { deleteSelection, selectAll };
}

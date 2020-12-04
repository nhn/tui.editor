import { sinkListItem, liftListItem } from 'prosemirror-schema-list';

import { EditorCommand } from '@t/spec';
import { isInListNode } from '@/wysiwyg/helper/node';

function indent(): EditorCommand {
  return () => (state, dispatch) => {
    const { selection, schema } = state;
    const { $from, $to } = selection;
    const range = $from.blockRange($to);

    if (range && isInListNode($from)) {
      return sinkListItem(schema.nodes.listItem)(state, dispatch);
    }

    return false;
  };
}

function outdent(): EditorCommand {
  return () => (state, dispatch) => {
    const { selection, schema } = state;
    const { $from, $to } = selection;
    const range = $from.blockRange($to);

    if (range && isInListNode($from)) {
      return liftListItem(schema.nodes.listItem)(state, dispatch);
    }

    return false;
  };
}

export function getWwCommands(): Record<string, EditorCommand> {
  return {
    indent: indent(),
    outdent: outdent()
  };
}

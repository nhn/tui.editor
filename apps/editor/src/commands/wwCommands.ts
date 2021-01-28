import { isInListNode } from '@/wysiwyg/helper/node';
import { sinkListItem, liftListItem } from '@/wysiwyg/command/list';

import { EditorCommand } from '@t/spec';

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
    outdent: outdent(),
  };
}

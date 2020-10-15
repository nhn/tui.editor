import { Node, Schema, ResolvedPos } from 'prosemirror-model';
import { sinkListItem, liftListItem } from 'prosemirror-schema-list';

import { EditorCommand } from '@t/spec';

function isListNode({ type }: Node, schema: Schema) {
  const { listItem, bulletList, orderedList } = schema.nodes;

  return type === listItem || type === bulletList || type === orderedList;
}

function isInListNode(schema: Schema, pos: ResolvedPos): boolean {
  for (let index = pos.depth; index > 0; index -= 1) {
    const node = pos.node(index);

    if (isListNode(node, schema)) {
      return true;
    }
  }

  return false;
}

function indent(): EditorCommand {
  return () => (state, dispatch) => {
    const { selection, tr } = state;
    const { $from, $to } = selection;
    const range = $from.blockRange($to);

    if (!range) {
      return false;
    }

    if (isInListNode(state.schema, $from)) {
      return sinkListItem(state.schema.nodes.listItem)(state, dispatch);
    }

    if (dispatch) {
      dispatch(tr.insertText('    ', $from.pos, $to.pos));

      return true;
    }

    return false;
  };
}

function outdent(): EditorCommand {
  return () => (state, dispatch) => {
    const { $from, $to } = state.selection;
    const range = $from.blockRange($to);

    if (!range) {
      return false;
    }

    if (isInListNode(state.schema, $from)) {
      return liftListItem(state.schema.nodes.listItem)(state, dispatch);
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

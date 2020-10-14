import { Schema, NodeType } from 'prosemirror-model';
import { Command } from 'prosemirror-commands';
import { sinkListItem, liftListItem } from 'prosemirror-schema-list';

function isInList(nodeType: NodeType, schema: Schema) {
  const { nodes } = schema;

  return (
    nodeType === nodes.listItem || nodeType === nodes.bulletList || nodeType === nodes.orderedList
  );
}

export function indent(): Command {
  return (state, dispatch) => {
    const { selection, tr } = state;
    const { $from, $to } = selection;
    const range = $from.blockRange($to);

    if (!range) {
      return false;
    }

    if (isInList($from.node(range.depth).type, state.schema)) {
      return sinkListItem(state.schema.nodes.listItem)(state, dispatch);
    }

    dispatch!(tr.insertText('    ', $from.pos, $to.pos));

    return true;
  };
}

export function outdent(): Command {
  return (state, dispatch) => {
    const { $from, $to } = state.selection;
    const range = $from.blockRange($to);

    if (!range) {
      return false;
    }

    if (isInList($from.node(range.depth).type, state.schema)) {
      return liftListItem(state.schema.nodes.listItem)(state, dispatch);
    }

    return false;
  };
}

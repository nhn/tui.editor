import { Node, Schema, ResolvedPos } from 'prosemirror-model';
import { Command } from 'prosemirror-commands';
import { sinkListItem, liftListItem } from 'prosemirror-schema-list';

function isListNode(node: Node, schema: Schema) {
  const { listItem, bulletList, orderedList } = schema.nodes;
  const { type } = node;

  return type === listItem || type === bulletList || type === orderedList;
}

function isInListNode(schema: Schema, $from: ResolvedPos): boolean {
  for (let index = $from.depth; index > 0; index -= 1) {
    const node = $from.node(index);

    if (isListNode(node, schema)) {
      return true;
    }
  }

  return false;
}

export function indent(): Command {
  return (state, dispatch) => {
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

export function outdent(): Command {
  return (state, dispatch) => {
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

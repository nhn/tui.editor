import { Node, ResolvedPos, Schema } from 'prosemirror-model';
import { Selection } from 'prosemirror-state';

import { includes } from '@/utils/common';

import { ToolbarState, ToolbarStateKeys } from '@t/ui';

const LIST_TYPES = ['bulletList', 'orderedList', 'taskList'];

function getToolbarStateType(node: Node, parentNode: Node) {
  const type = node.type.name;

  if (type === 'listItem') {
    return node.attrs.task ? 'taskList' : parentNode.type.name;
  }

  if (type.indexOf('table') !== -1) {
    return 'table';
  }

  return type;
}

function setListNodeToolbarState(type: ToolbarStateKeys, nodeTypeState: ToolbarState) {
  nodeTypeState[type] = true;

  LIST_TYPES.filter((listName) => listName !== type).forEach((listType) => {
    if (nodeTypeState[listType as ToolbarStateKeys]) {
      delete nodeTypeState[listType as ToolbarStateKeys];
    }
  });
}

function getMarkTypeStates(from: ResolvedPos, schema: Schema) {
  const markTypeState = {} as ToolbarState;

  ['strong', 'strike', 'emph', 'code'].forEach((type) => {
    const mark = schema.marks[type];
    const foundMark = mark.isInSet(from.marks());

    if (foundMark) {
      markTypeState[type as ToolbarStateKeys] = true;
    }
  });

  return markTypeState;
}

export function getToolbarState(selection: Selection, doc: Node, schema: Schema) {
  const { $from, from, to } = selection;
  const nodeTypeState = {} as ToolbarState;
  let markTypeState = {} as ToolbarState;

  doc.nodesBetween(from, to, (node, _, parentNode) => {
    const type = getToolbarStateType(node, parentNode);

    if (includes(['image', 'link', 'customBlock', 'frontMatter'], type)) {
      return;
    }

    if (includes(LIST_TYPES, type)) {
      setListNodeToolbarState(type as ToolbarStateKeys, nodeTypeState);
    } else if (type === 'paragraph' || type === 'text') {
      markTypeState = getMarkTypeStates($from, schema);
    } else {
      nodeTypeState[type as ToolbarStateKeys] = true;
    }
  });

  return { ...nodeTypeState, ...markTypeState };
}

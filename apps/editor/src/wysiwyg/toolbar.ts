import { Node, Schema } from 'prosemirror-model';
import { Selection } from 'prosemirror-state';

import { includes } from '@/utils/common';

import { ToolbarState, ToolbarStateKeys } from '@t/ui';

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

  ['bulletList', 'orderedList', 'taskList']
    .filter((listName) => listName !== type)
    .forEach((listType) => {
      if (nodeTypeState[listType as ToolbarStateKeys]) {
        delete nodeTypeState[listType as ToolbarStateKeys];
      }
    });
}

function getMarkTypeStates({ empty, $from, from, to }: Selection, doc: Node, schema: Schema) {
  const markTypeState = {} as ToolbarState;

  ['strong', 'strike', 'emph', 'code'].forEach((type) => {
    const mark = schema.marks[type];
    const foundMark = empty ? mark.isInSet($from.marks()) : doc.rangeHasMark(from, to, mark);

    if (foundMark) {
      markTypeState[type as ToolbarStateKeys] = true;
    }
  });

  return markTypeState;
}

export function getToolbarState(selection: Selection, doc: Node, schema: Schema) {
  const { from, to } = selection;
  const nodeTypeState = {} as ToolbarState;
  let markTypeState = {} as ToolbarState;

  doc.nodesBetween(from, to, (node, _, parentNode) => {
    const type = getToolbarStateType(node, parentNode);

    if (includes(['image', 'link', 'customBlock', 'frontMatter'], type)) {
      return;
    }

    if (type === 'listItem') {
      setListNodeToolbarState(type as ToolbarStateKeys, nodeTypeState);
    } else if (type === 'paragraph' || type === 'text') {
      markTypeState = getMarkTypeStates(selection, doc, schema);
    } else {
      nodeTypeState[type as ToolbarStateKeys] = true;
    }
  });

  return { ...nodeTypeState, ...markTypeState };
}

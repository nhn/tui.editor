import { Node, ResolvedPos, Schema } from 'prosemirror-model';
import { Plugin, Selection } from 'prosemirror-state';

import { includes } from '@/utils/common';

import { ToolbarState, ToolbarStateKeys } from '@t/ui';
import { Emitter } from '@t/event';

type ListType = 'bulletList' | 'orderedList' | 'taskList';

const EXCEPT_TYPES = ['image', 'link', 'customBlock', 'frontMatter'];
const MARK_TYPES = ['strong', 'strike', 'emph', 'code'];
const LIST_TYPES: ListType[] = ['bulletList', 'orderedList', 'taskList'];

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
    if (nodeTypeState[listType]) {
      delete nodeTypeState[listType];
    }
  });
}

function getMarkTypeStates(from: ResolvedPos, schema: Schema) {
  const markTypeState = {} as ToolbarState;

  MARK_TYPES.forEach((type) => {
    const mark = schema.marks[type];
    const foundMark = mark.isInSet(from.marks());

    if (foundMark) {
      markTypeState[type as ToolbarStateKeys] = true;
    }
  });

  return markTypeState;
}

function getToolbarState(selection: Selection, doc: Node, schema: Schema) {
  const { $from, from, to } = selection;
  const nodeTypeState = {} as ToolbarState;
  let markTypeState = {} as ToolbarState;

  doc.nodesBetween(from, to, (node, _, parentNode) => {
    const type = getToolbarStateType(node, parentNode);

    if (includes(EXCEPT_TYPES, type)) {
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

export function toolbarState(eventEmitter: Emitter) {
  return new Plugin({
    view() {
      return {
        update(view) {
          const { selection, doc, schema } = view.state;

          eventEmitter.emit('changeToolbarState', {
            toolbarState: getToolbarState(selection, doc, schema),
          });
        },
      };
    },
  });
}

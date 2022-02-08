import { Node, ResolvedPos, Schema } from 'prosemirror-model';
import { Plugin, Selection } from 'prosemirror-state';

import { includes } from '@/utils/common';

import { ToolbarStateMap, ToolbarStateKeys } from '@t/ui';
import { Emitter } from '@t/event';

type ListType = 'bulletList' | 'orderedList' | 'taskList';

const EXCEPT_TYPES = ['image', 'link', 'customBlock', 'frontMatter'];
const MARK_TYPES = ['strong', 'strike', 'emph', 'code'];
const LIST_TYPES: ListType[] = ['bulletList', 'orderedList', 'taskList'];
const defaultToolbarStateKeys: ToolbarStateKeys[] = [
  'taskList',
  'orderedList',
  'bulletList',
  'table',
  'strong',
  'emph',
  'strike',
  'heading',
  'thematicBreak',
  'blockQuote',
  'code',
  'codeBlock',
  'indent',
  'outdent',
];

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

function setListNodeToolbarState(type: ToolbarStateKeys, nodeTypeState: ToolbarStateMap) {
  nodeTypeState[type] = { active: true };

  LIST_TYPES.filter((listName) => listName !== type).forEach((listType) => {
    if (nodeTypeState[listType]) {
      delete nodeTypeState[listType];
    }
  });
}

function setMarkTypeStates(
  from: ResolvedPos,
  to: ResolvedPos,
  schema: Schema,
  toolbarState: ToolbarStateMap
) {
  MARK_TYPES.forEach((type) => {
    const mark = schema.marks[type];
    const marksAtPos = from.marksAcross(to) || [];
    const foundMark = !!mark.isInSet(marksAtPos);

    if (foundMark) {
      toolbarState[type as ToolbarStateKeys] = { active: true };
    }
  });
}

function getToolbarState(selection: Selection, doc: Node, schema: Schema) {
  const { $from, $to, from, to } = selection;
  const toolbarState = {} as ToolbarStateMap;

  // 이 아래를 수정해주세요.
  doc.nodesBetween(from, to, (node, _, parentNode) => {
    const type = getToolbarStateType(node, parentNode);

    if (includes(EXCEPT_TYPES, type)) {
      return;
    }

    if (includes(LIST_TYPES, type)) {
      setListNodeToolbarState(type as ToolbarStateKeys, toolbarState);
    } else if (type === 'paragraph' || type === 'text') {
      setMarkTypeStates($from, $to, schema, toolbarState);
    } else {
      toolbarState[type as ToolbarStateKeys] = { active: true };
    }
  });
  return toolbarState;
}

export function toolbarStateHighlight(eventEmitter: Emitter) {
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

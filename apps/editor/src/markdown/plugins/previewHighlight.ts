import { Plugin } from 'prosemirror-state';
import { MdNode } from '@t/markdown';
import { Context } from '@t/spec';
import { ToolbarState, ToolbarStateKeys } from '@t/ui';
import { traverseParentNodes, isListNode } from '@/utils/markdown';

function getToolbarStateType(mdNode: MdNode) {
  if (isListNode(mdNode)) {
    if (mdNode.listData.task) {
      return 'taskList';
    }
    return mdNode.listData.type === 'ordered' ? 'orderedList' : 'bulletList';
  }
  if (mdNode.type.indexOf('table') !== -1) {
    return 'table';
  }
  return mdNode.type;
}

function getToolbarState(targetNode: MdNode) {
  const toolbarState = {} as ToolbarState;
  let listEnabled = true;

  traverseParentNodes(targetNode, (mdNode) => {
    const type = getToolbarStateType(mdNode);

    if (type === 'customBlock' || type === 'image' || type === 'link') {
      return;
    }

    if (type === 'bulletList' || type === 'orderedList') {
      if (listEnabled) {
        toolbarState[type] = true;
        listEnabled = false;
      }
    } else {
      toolbarState[type as ToolbarStateKeys] = true;
    }
  });

  return toolbarState;
}

export function previewHighlight({ toastMark, eventEmitter }: Context) {
  return new Plugin({
    view() {
      return {
        update(view, prevState) {
          const { state } = view;
          const { doc, selection } = state;

          if (prevState && prevState.doc.eq(doc) && prevState.selection.eq(selection)) {
            return;
          }
          const { from } = selection;
          const startChOffset = state.doc.resolve(from).start();
          const line = state.doc.content.findIndex(from).index + 1;
          let ch = from - startChOffset;

          if (from === startChOffset) {
            ch += 1;
          }
          const cursorPos = [line, ch];
          const mdNode = toastMark.findNodeAtPosition(cursorPos);
          const toolbarState = getToolbarState(mdNode);

          eventEmitter.emit('changeToolbarState', {
            cursorPos,
            mdNode,
            toolbarState,
          });
        },
      };
    },
  });
}

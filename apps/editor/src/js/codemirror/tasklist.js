import { findClosestNode, addChPos } from '../utils/markdown';

const TASK_MARKER_RX = /^\[(\s*)(x?)(\s*)\](?:\s+)/i;

function getParentListItemNode(mdNode) {
  return findClosestNode(
    mdNode,
    node =>
      (node.type === 'paragraph' || node.type === 'codeBlock') &&
      node.parent &&
      node.parent.type === 'item'
  );
}

function changeTaskState(mdNode, line, cm) {
  const { listData, sourcepos } = mdNode;
  const { task, checked, padding } = listData;

  if (task) {
    const stateChar = checked ? ' ' : 'x';
    const [[, startCh]] = sourcepos;
    const startPos = { line, ch: startCh + padding };

    cm.replaceRange(stateChar, startPos, addChPos(startPos, 1));
  }
}

/**
 * Toggle the state of task by cursor or selection.
 * @param {CodeMirror} cm - CodeMirror instance
 * @param {ToastMark} toastMark - ToastMark instance
 */
export function toggleTaskStates(cm, toastMark) {
  const ranges = cm.listSelections();

  ranges.forEach(range => {
    const { anchor, head } = range;
    const startLine = anchor.line;
    const endLine = head.line;
    let mdNode;

    for (let index = startLine, len = endLine; index <= len; index += 1) {
      mdNode = toastMark.findFirstNodeAtLine(index + 1);

      const { type } = mdNode;

      if (type === 'list' || type === 'item') {
        changeTaskState(mdNode, index, cm);
      }
    }
  });
}

/**
 * Change the plain text to the task marker by adjusting spaces.
 * @param {CodeMirror} cm - CodeMirror instance
 * @param {ToastMark} toastMark - ToastMark instance
 */
export function changeTextToTaskMarker(cm, toastMark) {
  const { line, ch } = cm.getCursor();
  const mdCh = cm.getLine(line).length === ch ? ch : ch + 1;
  const cursorNode = toastMark.findNodeAtPosition([line + 1, mdCh]);
  const foundNode = getParentListItemNode(cursorNode);

  if (foundNode && foundNode.firstChild) {
    const { literal, sourcepos } = foundNode.firstChild;
    const matched = literal && literal.match(TASK_MARKER_RX);

    if (matched) {
      const [, beforeSpaces, stateChar, afterSpaces] = matched;
      const spaces = beforeSpaces.length + afterSpaces.length;
      const taskMarkerLen = spaces + stateChar.length;
      const hasOnlySpaces = taskMarkerLen > 1 && !stateChar;

      if (!hasOnlySpaces) {
        const [[, startCh]] = sourcepos;
        const startPos = { line, ch: startCh };

        cm.replaceRange(
          taskMarkerLen ? stateChar : ' ',
          startPos,
          addChPos(startPos, spaces ? spaces + 1 : 0)
        );
      }
    }
  }
}

/**
 * @fileoverview Implements ChangeTaskMarker markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';
import { findClosestNode, addChPos } from '../utils/markdown';

const TASK_MARKER_RX = /^\[(\s*)(x?)(\s*)\](?:\s+)/i;

/**
 * Add ChangeTaskMarker command
 * @extends Command
 * @module markdownCommands/ToggleTaskMarker
 * @ignore
 */
const ChangeTaskMarker = CommandManager.command(
  'markdown',
  /** @lends ChangeTaskMarker */ {
    name: 'ChangeTaskMarker',
    exec(mde) {
      const cm = mde.getEditor();
      const { line, ch } = cm.getCursor();
      const mdCh = cm.getLine(line).length === ch ? ch : ch + 1;
      const mdNode = mde.getToastMark().findNodeAtPosition([line + 1, mdCh]);
      const paraNode = findClosestNode(
        mdNode,
        node => node.type === 'paragraph' && node.parent && node.parent.type === 'item'
      );

      if (paraNode && paraNode.firstChild) {
        const { literal, sourcepos } = paraNode.firstChild;
        const [[startLine, startCh]] = sourcepos;
        const matched = literal.match(TASK_MARKER_RX);

        if (matched) {
          const [, startSpaces, stateChar, lastSpaces] = matched;
          const spaces = startSpaces.length + lastSpaces.length;
          const startPos = { line: startLine - 1, ch: startCh };

          if (stateChar) {
            cm.replaceRange(stateChar, startPos, addChPos(startPos, spaces ? spaces + 1 : 0));
          } else if (!spaces) {
            cm.replaceRange(' ', startPos, startPos);
          }
        }
      }
    }
  }
);

export default ChangeTaskMarker;

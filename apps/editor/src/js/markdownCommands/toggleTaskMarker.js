/**
 * @fileoverview Implements ToggleTaskMarker markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';
import { addChPos } from '../utils/markdown';

/**
 * Add ToggleTaskMarker command
 * @extends Command
 * @module markdownCommands/ToggleTaskMarker
 * @ignore
 */
const ToggleTaskMarker = CommandManager.command(
  'markdown',
  /** @lends ToggleTaskMarker */ {
    name: 'ToggleTaskMarker',
    exec(mde) {
      const cm = mde.getEditor();
      const ranges = cm.listSelections();

      ranges.forEach(range => {
        const { anchor, head } = range;
        const startLine = Math.min(anchor.line, head.line);
        const endLine = Math.max(anchor.line, head.line);
        let mdNode;

        for (let index = startLine, len = endLine; index <= len; index += 1) {
          mdNode = mde.getToastMark().findFirstNodeAtLine(index + 1);

          if (mdNode.type === 'list' || mdNode.type === 'item') {
            this._changeTaskState(mdNode, index, cm);
          }
        }
      });
    },
    _changeTaskState(list, line, cm) {
      const { listData, sourcepos } = list;
      const { task, checked, padding } = listData;

      if (task) {
        const stateChar = checked ? ' ' : 'x';
        const [[, startCh]] = sourcepos;
        const startPos = { line, ch: startCh + padding };

        cm.replaceRange(stateChar, startPos, addChPos(startPos, 1));
      }
    }
  }
);

export default ToggleTaskMarker;

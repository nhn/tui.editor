/**
 * @fileoverview Implements Task WysiwygCommand
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import CommandManager from '../commandManager';

/**
 * Task
 * Add Task to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Task
 * @ignore
 */
const Task = CommandManager.command('wysiwyg', /** @lends Task */{
  name: 'Task',
  keyMap: ['CTRL+T', 'META+T'],
  /**
   * Command Handler
   * @param {WysiwygEditor} wwe WYSIWYGEditor instance
   */
  exec(wwe) {
    const sq = wwe.getEditor();
    let range = sq.getSelection();
    const listManager = wwe.componentManager.getManager('list');
    const {
      startContainer,
      endContainer,
      startOffset,
      endOffset
    } = range;

    wwe.focus();

    sq.saveUndoState(range);

    const lines = listManager.getLinesOfSelection(startContainer, endContainer);

    const newLIs = [];
    for (let i = 0; i < lines.length; i += 1) {
      const newLI = this._changeFormatToTaskIfNeed(wwe, lines[i]);
      newLIs.push(newLI);
    }

    range = sq.getSelection();
    range.setStart(newLIs[0].firstChild, startOffset);
    range.setEnd(newLIs[newLIs.length - 1].firstChild, endOffset);
    sq.setSelection(range);
    sq.saveUndoState(range);
  },

  /**
   * Change format to unordered list and return current li element if need
   * @param {WysiwygEditor} wwe Wysiwyg editor instance
   * @param {HTMLElement} target Element target for change
   * @returns {HTMLElement} newly created list
   * @private
   */
  _changeFormatToTaskIfNeed(wwe, target) {
    const sq = wwe.getEditor();
    const range = sq.getSelection();
    const taskManager = wwe.componentManager.getManager('task');
    let newLI = range.startContainer;

    if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
      range.setStart(target, 0);
      range.collapse(true);
      sq.setSelection(range);

      if (!sq.hasFormat('li')) {
        sq.makeUnorderedList();
        target = sq.getSelection().startContainer;
      }

      if ($(target).hasClass('task-list-item')) {
        taskManager.unformatTask(target);
      } else {
        taskManager.formatTask(target);
      }

      newLI = sq.getSelection().startContainer;
    }

    return newLI;
  }
});

export default Task;

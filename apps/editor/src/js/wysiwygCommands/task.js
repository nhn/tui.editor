/**
 * @fileoverview Implements Task WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import hasClass from 'tui-code-snippet/domUtil/hasClass';

import CommandManager from '../commandManager';

/**
 * Task
 * Add Task to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/Task
 * @ignore
 */
const Task = CommandManager.command(
  'wysiwyg',
  /** @lends Task */ {
    name: 'Task',
    keyMap: ['ALT+T', 'ALT+T'],
    /**
     * Command Handler
     * @param {WysiwygEditor} wwe WYSIWYGEditor instance
     */
    exec(wwe) {
      const sq = wwe.getEditor();
      const range = sq.getSelection();
      const listManager = wwe.componentManager.getManager('list');
      const { startContainer, endContainer, startOffset, endOffset } = range;
      let newLIs = [];

      wwe.focus();

      sq.saveUndoState(range);

      if (listManager.isAvailableMakeListInTable()) {
        newLIs = listManager.createListInTable(range, 'TASK');
      } else {
        const lines = listManager.getLinesOfSelection(startContainer, endContainer);

        for (let i = 0; i < lines.length; i += 1) {
          const newLI = this._changeFormatToTaskIfNeed(wwe, lines[i]);

          if (newLI) {
            newLIs.push(newLI);
          }
        }
      }

      if (newLIs.length) {
        listManager.adjustRange(startContainer, endContainer, startOffset, endOffset, newLIs);
      }
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
      let newLI;

      if (!sq.hasFormat('PRE')) {
        range.setStart(target, 0);
        range.collapse(true);
        sq.setSelection(range);

        if (!sq.hasFormat('li')) {
          sq.makeUnorderedList();
          target = sq.getSelection().startContainer;
        }

        if (hasClass(target, 'task-list-item')) {
          taskManager.unformatTask(target);
        } else {
          taskManager.formatTask(target);
        }

        newLI = sq.getSelection().startContainer;
      }

      return newLI;
    }
  }
);

export default Task;

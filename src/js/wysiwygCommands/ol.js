/**
 * @fileoverview Implements ol WysiwygCommand
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */

import CommandManager from '../commandManager';
import domUtil from '../domUtils';

/**
 * OL
 * Add OL to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/OL
 * @ignore
 */
const OL = CommandManager.command('wysiwyg', /** @lends OL */{
  name: 'OL',
  keyMap: ['CTRL+O', 'META+O'],
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
      startOffset,
      endContainer,
      endOffset
    } = range;

    wwe.focus();
    sq.saveUndoState(range);

    const lines = listManager.getLinesOfSelection(startContainer, endContainer);

    const newLIs = [];
    for (let i = 0; i < lines.length; i += 1) {
      const newLI = this._changeFormatToOrderedListIfNeed(wwe, lines[i]);
      if (newLI) {
        newLIs.push(newLI);
      }
    }

    if (newLIs.length) {
      const newStartContainer = domUtil.containsNode(newLIs[0], startContainer)
        ? startContainer : newLIs[0];
      const newEndContainer = domUtil.containsNode(newLIs[newLIs.length - 1], endContainer)
        ? endContainer : newLIs[newLIs.length - 1];

      wwe.setSelectionByContainerAndOffset(newStartContainer, startOffset, newEndContainer, endOffset);
    }
  },

  /**
   * Change format to unordered list if need
   * @param {WysiwygEditor} wwe Wysiwyg editor instance
   * @param {HTMLElement} target Element target for change
   * @returns {HTMLElement} newly created list item
   * @private
   */
  _changeFormatToOrderedListIfNeed(wwe, target) {
    const sq = wwe.getEditor();
    const range = sq.getSelection();
    const taskManager = wwe.componentManager.getManager('task');
    let newLI;

    if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
      range.setStart(target, 0);
      range.collapse(true);
      sq.setSelection(range);

      if (sq.hasFormat('LI')) {
        wwe.saveSelection(range);
        taskManager.unformatTask(range.startContainer);
        sq.replaceParent(range.startContainer, 'ul', 'ol');
        wwe.restoreSavedSelection();
      } else {
        wwe.unwrapBlockTag();
        sq.makeOrderedList();
      }

      newLI = sq.getSelection().startContainer;
    }

    return newLI;
  }
});

export default OL;

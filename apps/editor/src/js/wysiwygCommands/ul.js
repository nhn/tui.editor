/**
 * @fileoverview Implements ul WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';

/**
 * UL
 * Add UL to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/UL
 * @ignore
 */
const UL = CommandManager.command(
  'wysiwyg',
  /** @lends UL */ {
    name: 'UL',
    keyMap: ['CTRL+U', 'META+U'],
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
        newLIs = listManager.createListInTable(range, 'UL');
      } else {
        const lines = listManager.getLinesOfSelection(startContainer, endContainer);

        for (let i = 0; i < lines.length; i += 1) {
          const newLI = this._changeFormatToUnorderedListIfNeed(wwe, lines[i]);

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
     * Change format to unordered list if need
     * @param {WysiwygEditor} wwe Wysiwyg editor instance
     * @param {HTMLElement} target Element target for change
     * @returns {HTMLElement} newly created list
     * @private
     */
    _changeFormatToUnorderedListIfNeed(wwe, target) {
      const sq = wwe.getEditor();
      const range = sq.getSelection();
      const taskManager = wwe.componentManager.getManager('task');
      let newLI;

      if (!sq.hasFormat('PRE')) {
        range.setStart(target, 0);
        range.collapse(true);
        sq.setSelection(range);

        if (sq.hasFormat('LI')) {
          wwe.saveSelection(range);
          taskManager.unformatTask(range.startContainer);
          sq.replaceParent(range.startContainer, 'ol', 'ul');
          wwe.restoreSavedSelection();
        } else {
          wwe.unwrapBlockTag();
          sq.makeUnorderedList();
        }

        newLI = sq.getSelection().startContainer;
      }

      return newLI;
    }
  }
);

export default UL;

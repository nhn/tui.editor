/**
 * @fileoverview Implements ul WysiwygCommand
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import CommandManager from '../commandManager';

/**
 * UL
 * Add UL to selected wysiwyg editor content
 * @extends Command
 * @module wysiwygCommands/UL
 * @ignore
 */
const UL = CommandManager.command('wysiwyg', /** @lends UL */{
  name: 'UL',
  keyMap: ['CTRL+U', 'META+U'],
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
      const newLI = this._changeFormatToUnorderedListIfNeed(wwe, lines[i]);
      newLIs.push(newLI);
    }

    range = sq.getSelection();
    range.setStart(newLIs[0].firstChild, startOffset);
    range.setEnd(newLIs[newLIs.length - 1].firstChild, endOffset);
    sq.setSelection(range);
    sq.saveUndoState(range);
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
    let newLI = range.startContainer;

    if (!sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
      range.setStart(target, 0);
      range.collapse(true);
      sq.setSelection(range);

      if (sq.hasFormat('LI')) {
        wwe.saveSelection(range);
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
});

export default UL;


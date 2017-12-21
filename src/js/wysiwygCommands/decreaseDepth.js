/**
 * @fileoverview Implements decrease depth wysiwyg command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import $ from 'jquery';

import CommandManager from '../commandManager';

/**
 * DecreaseDepth
 * decrease depth of list or task to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/DecreaseDepth
 * @ignore
 */
const DecreaseDepth = CommandManager.command('wysiwyg', /** @lends HR */{
  name: 'DecreaseDepth',

  /**
   * Command Handler
   * @param {WysiwygEditor} wwe WysiwygEditor instance
   */
  exec(wwe) {
    let $node = getCurrent$Li(wwe);

    if ($node.length && isExecutable($node)) {
      wwe.getEditor().saveUndoState();

      const nodeClasses = $node.attr('class');
      wwe.getEditor().decreaseListLevel();

      $node = getCurrent$Li(wwe);
      $node.attr('class', nodeClasses);
    }
  }
});

/**
 * test if decrease the depth of given list item
 * arbitrary list allows list item to be in any position
 * while markdown spec does not
 * @param {jQuery} $currentLiNode - jQuery list item element
 * @returns {boolean} - true to executable
 * @ignore
 */
function isExecutable($currentLiNode) {
  return !($currentLiNode.next().is('OL,UL'));
}

/**
 * Get list item element of current selection
 * @param {object} wwe Wysiwyg editor instance
 * @returns {jQuery}
 * @ignore
 */
function getCurrent$Li(wwe) {
  const range = wwe.getEditor().getSelection();

  return $(range.startContainer).closest('li');
}

export default DecreaseDepth;

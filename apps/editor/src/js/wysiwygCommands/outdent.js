/**
 * @fileoverview Implements Outdent wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';
import domUtils from '../utils/dom';

/**
 * Outdent
 * Outdent list or task to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/Outdent
 * @ignore
 */
const Outdent = CommandManager.command(
  'wysiwyg',
  /** @lends Outdent */ {
    name: 'Outdent',

    /**
     * Command Handler
     * @param {WysiwygEditor} wwe WysiwygEditor instance
     */
    exec(wwe) {
      let node = getCurrentLi(wwe);

      if (node && isExecutable(node)) {
        wwe.getEditor().saveUndoState();

        const nodeClasses = node.className;

        wwe.getEditor().decreaseListLevel();

        node = getCurrentLi(wwe);

        if (node && nodeClasses) {
          node.className = nodeClasses;
        }
      }
    }
  }
);

/**
 * test if outdent the given list item
 * arbitrary list allows list item to be in any position
 * while markdown spec does not
 * @param {HTMLElement} currentLiNode - list item element
 * @returns {boolean} - true to executable
 * @ignore
 */
function isExecutable(currentLiNode) {
  const nodeName = domUtils.getNodeName(currentLiNode.nextSibling);

  return nodeName !== 'OL' && nodeName !== 'UL';
}

/**
 * Get list item element of current selection
 * @param {object} wwe Wysiwyg editor instance
 * @returns {HTMLElement}
 * @ignore
 */
function getCurrentLi(wwe) {
  const range = wwe.getEditor().getSelection();

  return domUtils.closest(range.startContainer, 'li');
}

export default Outdent;

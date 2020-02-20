/**
 * @fileoverview Implements Indent wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';
import matches from 'tui-code-snippet/domUtil/matches';

import CommandManager from '../commandManager';
import domUtils from '../domUtils';

/**
 * Indent
 * Indent list or task to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/indent
 * @ignore
 */
const Indent = CommandManager.command(
  'wysiwyg',
  /** @lends Indent */ {
    name: 'Indent',
    /**
     * Command Handler
     * @param {WysiwygEditor} wwe wysiwygEditor instance
     */
    exec(wwe) {
      const listManager = wwe.componentManager.getManager('list');
      const range = wwe.getEditor().getSelection();
      const node = domUtils.closest(range.startContainer, 'li');
      let prevClasses, nodeClasses, nextClasses;

      const prev = node.previousSibling;

      if (prev && node) {
        const next = node.querySelector('li');

        wwe.getEditor().saveUndoState();

        nodeClasses = node.getAttribute('class');
        prevClasses = prev.getAttribute('class');

        node.class = false;
        prev.class = false;

        if (next) {
          nextClasses = next.getAttribute('class');

          const divElements = toArray(next.childNodes).filter(childNode =>
            matches(childNode, 'div')
          );

          if (!divElements.length) {
            next.class = false;
          }
        }

        wwe.getEditor().increaseListLevel();
        listManager.mergeList(node);

        if (nodeClasses) {
          node.setAttribute('class', nodeClasses);
        }

        if (prevClasses) {
          prev.setAttribute('class', prevClasses);
        }

        if (nextClasses) {
          next.setAttribute('class', nextClasses);
        }
      }
    }
  }
);

export default Indent;

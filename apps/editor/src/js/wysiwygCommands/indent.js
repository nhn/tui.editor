/**
 * @fileoverview Implements Indent wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';
import matches from 'tui-code-snippet/domUtil/matches';

import CommandManager from '../commandManager';
import domUtils from '../utils/dom';

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

      const prev = node && node.previousSibling;

      if (prev) {
        const next = node.querySelector('li');

        wwe.getEditor().saveUndoState();

        nodeClasses = node.className;
        prevClasses = prev.className;

        node.className = '';
        prev.className = '';

        if (next) {
          nextClasses = next.className;

          const divElements = toArray(next.children).filter(child => matches(child, 'div'));

          if (!divElements.length) {
            next.className = '';
          }
        }

        wwe.getEditor().increaseListLevel();
        listManager.mergeList(node);

        node.className = nodeClasses;
        prev.className = prevClasses;

        if (next) {
          next.className = nextClasses;
        }
      }
    }
  }
);

export default Indent;

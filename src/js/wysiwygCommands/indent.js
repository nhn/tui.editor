/**
 * @fileoverview Implements Indent wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import CommandManager from '../commandManager';

/**
 * Indent
 * Indent list or task to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/indent
 * @ignore
 */
const Indent = CommandManager.command('wysiwyg', /** @lends Indent */{
  name: 'Indent',
  /**
   * Command Handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec(wwe) {
    const listManager = wwe.componentManager.getManager('list');
    const range = wwe.getEditor().getSelection();
    const $node = $(range.startContainer).closest('li');
    let prevClasses, nodeClasses, nextClasses;

    const $prev = $node.prev();

    if ($prev.length && $node.length) {
      const $next = $node.find('li').eq(0);

      wwe.getEditor().saveUndoState();

      nodeClasses = $node.attr('class');
      prevClasses = $prev.attr('class');
      nextClasses = $next.attr('class');

      $node.removeAttr('class');
      $prev.removeAttr('class');

      if ($next.length && !$next.children('div').length) {
        $next.removeAttr('class');
      }

      wwe.getEditor().increaseListLevel();
      listManager.mergeList($node.get(0));

      $node.attr('class', nodeClasses);
      $prev.attr('class', prevClasses);
      $next.attr('class', nextClasses);
    }
  }
});

export default Indent;

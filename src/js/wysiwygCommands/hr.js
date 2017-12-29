/**
 * @fileoverview Implements HR wysiwyg command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import CommandManager from '../commandManager';
import domUtils from '../domUtils';

/**
 * HR
 * Add horizontal line markdown syntax to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/HR
 * @ignore
 */
const HR = CommandManager.command('wysiwyg', /** @lends HR */{
  name: 'HR',
  keyMap: ['CTRL+L', 'META+L'],
  /**
   * command handler
   * @param {WysiwygEditor} wwe wysiwygEditor instance
   */
  exec(wwe) {
    const sq = wwe.getEditor();
    const range = sq.getSelection();
    let currentNode, nextBlockNode, previousSibling;

    if (range.collapsed && !sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
      currentNode = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset);
      nextBlockNode = domUtils.getTopNextNodeUnder(currentNode, wwe.get$Body()[0]);

      if (!nextBlockNode) {
        nextBlockNode = sq.createDefaultBlock();
        wwe.get$Body().append(nextBlockNode);
      }

      const hr = sq.createElement('HR');

      sq.modifyBlocks(frag => {
        frag.appendChild(hr);

        return frag;
      });

      ({previousSibling} = hr);
      if (previousSibling
                && domUtils.isTextNode(previousSibling)
                && domUtils.getTextLength(previousSibling) === 0
      ) {
        hr.parentNode.removeChild(previousSibling);
      }

      range.selectNodeContents(nextBlockNode);
      range.collapse(true);

      sq.setSelection(range);
    }

    wwe.focus();
  }
});

export default HR;

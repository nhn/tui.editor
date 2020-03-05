/**
 * @fileoverview Implements HR wysiwyg command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';
import domUtils from '../utils/dom';

/**
 * HR
 * Add horizontal line markdown syntax to wysiwyg Editor
 * @extends Command
 * @module wysiwygCommands/HR
 * @ignore
 */
const HR = CommandManager.command(
  'wysiwyg',
  /** @lends HR */ {
    name: 'HR',
    keyMap: ['CTRL+L', 'META+L'],
    /**
     * command handler
     * @param {WysiwygEditor} wwe wysiwygEditor instance
     */
    exec(wwe) {
      const sq = wwe.getEditor();
      const range = sq.getSelection();

      if (range.collapsed && !sq.hasFormat('TABLE') && !sq.hasFormat('PRE')) {
        const hr = document.createElement('hr');
        const currentNode = domUtils.getChildNodeByOffset(range.startContainer, range.startOffset);
        let nextBlockNode = domUtils.getTopNextNodeUnder(currentNode, wwe.getBody());

        // If nextBlockNode is div that has hr and has contenteditable as false,
        // nextBlockNode should be set as nextSibling that is normal block.
        if (nextBlockNode && !domUtils.isTextNode(nextBlockNode)) {
          while (nextBlockNode && nextBlockNode.getAttribute('contenteditable') === 'false') {
            nextBlockNode = nextBlockNode.nextSibling;
          }
        }

        if (!nextBlockNode) {
          nextBlockNode = domUtils.createEmptyLine();
          domUtils.append(wwe.getBody(), nextBlockNode);
        }

        sq.modifyBlocks(frag => {
          frag.appendChild(hr);

          return frag;
        });

        const { previousSibling } = hr;

        if (
          previousSibling &&
          domUtils.isTextNode(previousSibling) &&
          domUtils.getTextLength(previousSibling) === 0
        ) {
          hr.parentNode.removeChild(previousSibling);
        }

        hr.parentNode.replaceChild(domUtils.createHorizontalRule(), hr);

        range.selectNodeContents(nextBlockNode);
        range.collapse(true);

        sq.setSelection(range);
        sq.saveUndoState(range);
      }

      wwe.focus();
    }
  }
);

export default HR;

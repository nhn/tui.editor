/**
 * @fileoverview Implements code block WysiwygCommand
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import toArray from 'tui-code-snippet/collection/toArray';
import removeClass from 'tui-code-snippet/domUtil/removeClass';

import CommandManager from '../commandManager';

const CODEBLOCK_CLASS_TEMP = 'te-content-codeblock-temp';
const CODEBLOCK_ATTR_NAME = 'data-te-codeblock';

/**
 * CodeBlock
 * Add CodeBlock to wysiwygEditor
 * @extends Command
 * @module wysiwygCommands/Codeblock
 * @ignore
 */
const CodeBlock = CommandManager.command(
  'wysiwyg',
  /** @lends CodeBlock */ {
    name: 'CodeBlock',
    keyMap: ['SHIFT+CTRL+P', 'SHIFT+META+P'],
    /**
     * Command handler
     * @param {WysiwygEditor} wwe wysiwygEditor instance
     * @param {string} type of language
     */
    exec(wwe, type) {
      const sq = wwe.getEditor();
      const range = sq.getSelection().cloneRange();

      if (!sq.hasFormat('PRE') && !sq.hasFormat('TABLE')) {
        let attr = `${CODEBLOCK_ATTR_NAME} class = "${CODEBLOCK_CLASS_TEMP}"`;

        if (type) {
          attr += ` data-language="${type}"`;
        }

        const codeBlockBody = getCodeBlockBody(range, wwe);

        sq.insertHTML(`<pre ${attr}>${codeBlockBody}</pre>`);

        focusToFirstCode(wwe.getBody().querySelector(`.${CODEBLOCK_CLASS_TEMP}`), wwe);
      }

      wwe.focus();
    }
  }
);

/**
 * focusToFirstCode
 * Focus to first code tag content of pre tag
 * @param {HTMLElement} pre pre tag
 * @param {WysiwygEditor} wwe wysiwygEditor
 */
function focusToFirstCode(pre, wwe) {
  const range = wwe
    .getEditor()
    .getSelection()
    .cloneRange();

  removeClass(pre, CODEBLOCK_CLASS_TEMP);

  range.setStartBefore(pre.firstChild);
  range.collapse(true);

  wwe.getEditor().setSelection(range);
}
/**
 * getCodeBlockBody
 * get text wrapped by code
 * @param {object} range range object
 * @param {object} wwe wysiwyg editor
 * @returns {string}
 */
function getCodeBlockBody(range, wwe) {
  const mgr = wwe.componentManager.getManager('codeblock');
  let codeBlock;

  if (range.collapsed) {
    codeBlock = '<br>';
  } else {
    const contents = range.extractContents();
    const nodes = toArray(contents.childNodes);
    const tempDiv = document.createElement('div');

    tempDiv.appendChild(mgr.prepareToPasteOnCodeblock(nodes));

    codeBlock = tempDiv.innerHTML;
  }

  return codeBlock;
}

export default CodeBlock;

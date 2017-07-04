/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 * @author Junghwan Park(junghwan.park@nhnent.com) FE Development Team/NHN Ent.
 */

const CommandManager = require('../commandManager');

const CODEBLOCK_CLASS_PREFIX = 'te-content-codeblock-';
const CODEBLOCK_ATTR_NAME = 'data-te-codeblock';
let codeBlockID = 0;

/**
 * CodeBlock
 * Add CodeBlock to wysiwygEditor
 * @exports CodeBlock
 * @augments Command
 * @augments WysiwygCommand
 * @ignore
 */
const CodeBlock = CommandManager.command('wysiwyg', /** @lends CodeBlock */{
    name: 'CodeBlock',
    keyMap: ['SHIFT+CTRL+P', 'SHIFT+META+P'],
    /**
     * Command handler
     * @param {WysiwygEditor} wwe WYsiwygEditor instance
     * @param {string} type of language
     */
    exec(wwe, type) {
        const sq = wwe.getEditor();
        const range = sq.getSelection().cloneRange();
        if (!sq.hasFormat('PRE') && !sq.hasFormat('TABLE')) {
            let attr = `${CODEBLOCK_ATTR_NAME} class = "${CODEBLOCK_CLASS_PREFIX}${codeBlockID}"`;

            if (type) {
                attr += ` data-language="${type}"`;
            }

            const codeBlockBody = getCodeBlockBody(range, wwe);
            sq.insertHTML(`<pre ${attr}>${codeBlockBody}</pre>`);

            focusToFirstCode(wwe.get$Body().find(`.${CODEBLOCK_CLASS_PREFIX}${codeBlockID}`), wwe);

            codeBlockID += 1;
        }

        wwe.focus();
    }
});

/**
 * focusToFirstCode
 * Focus to first code tag content of pre tag
 * @param {jQuery} $pre pre tag
 * @param {WysiwygEditor} wwe wysiwygEditor
 */
function focusToFirstCode($pre, wwe) {
    const range = wwe.getEditor().getSelection().cloneRange();

    range.setStartBefore($pre.find('div')[0].firstChild);
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
    let contents, nodes;

    if (range.collapsed) {
        nodes = [$('<div><br></div>')[0]];
    } else {
        contents = range.extractContents();
        nodes = tui.util.toArray(contents.childNodes);
    }

    const codeBlock = mgr.convertToCodeblock(nodes).innerHTML;

    return codeBlock;
}

module.exports = CodeBlock;

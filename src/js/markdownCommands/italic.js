/**
 * @fileoverview Implements Italic markdown command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import CommandManager from '../commandManager';

const boldItalicRegex = /^[*_]{3,}[^*_]*[*_]{3,}$/;
const italicRegex = /^[*_][^*_]*[*_]$/;

/**
 * Italic
 * Add italic markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Italic
 * @ignore
 */
const Italic = CommandManager.command('markdown', /** @lends Italic */{
  name: 'Italic',
  keyMap: ['CTRL+I', 'META+I'],
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec(mde) {
    const cm = mde.getEditor();
    const doc = cm.getDoc();

    const cursor = doc.getCursor();
    let selection = doc.getSelection();
    const isEmpty = !selection;
    let isWithBold = false;
    let tmpSelection;

    // if selection is empty, expend selection to detect a syntax
    if (isEmpty) {
      if (cursor.ch > 2) {
        tmpSelection = this.expendWithBoldSelection(doc, cursor);

        if (tmpSelection) {
          isWithBold = 'with';
        }
      }

      if (isWithBold !== 'with' && cursor.ch > 1) {
        isWithBold = this.expendOnlyBoldSelection(doc, cursor);
      }

      if (!isWithBold && cursor.ch > 0) {
        this.expendSelection(doc, cursor);
        selection = tmpSelection || selection;
      }
    }

    const isRemoved = this.isNeedRemove(selection);
    const result = isRemoved ? this.remove(selection) : this.append(selection);

    doc.replaceSelection(result, 'around');

    if (isEmpty) {
      this.setCursorToCenter(doc, cursor, isRemoved);
    }

    cm.focus();
  },

  /**
   * isNeedRemove
   * test given text has italic or bold
   * @param {string} text - text to test
   * @returns {boolean} - true if it has italic or bold
   */
  isNeedRemove(text) {
    return italicRegex.test(text) || boldItalicRegex.test(text);
  },

  /**
   * apply italic
   * @param {string} text - text to apply
   * @returns {string} - italic text
   */
  append(text) {
    return `_${text}_`;
  },

  /**
   * remove italic
   * @param {string} text - text to remove italic syntax
   * @returns {string} - italic syntax revmoed text
   */
  remove(text) {
    return text.substr(1, text.length - 2);
  },

  /**
   * expand selected area
   * @param {CodeMirror.doc} doc - codemirror document
   * @param {object} cursor - codemirror cursor
   * @returns {string} - text in range after it has been expaneded
   */
  expendWithBoldSelection(doc, cursor) {
    const tmpSelection = doc.getSelection();
    let result;
    const start = {
      line: cursor.line,
      ch: cursor.ch - 3
    };
    const end = {
      line: cursor.line,
      ch: cursor.ch + 3
    };

    doc.setSelection(start, end);

    if (tmpSelection === '******' || tmpSelection === '______') {
      result = tmpSelection;
    } else {
      doc.setSelection(cursor);
    }

    return result;
  },

  /**
   * expand only bold selection
   * @param {CodeMirror.doc} doc - codemirror document
   * @param {object} cursor - codemirror cursor
   * @returns {string} - text in area after it has been expaneded
   */
  expendOnlyBoldSelection(doc, cursor) {
    const tmpSelection = doc.getSelection();
    let result = false;
    const start = {
      line: cursor.line,
      ch: cursor.ch - 2
    };
    const end = {
      line: cursor.line,
      ch: cursor.ch + 2
    };

    doc.setSelection(start, end);

    if (tmpSelection === '****' || tmpSelection === '____') {
      doc.setSelection(cursor);
      result = 'only';
    }

    return result;
  },

  /**
   * expand only italic selection
   * @param {CodeMirror.doc} doc - codemirror document
   * @param {object} cursor - codemirror cursor
   * @returns {string} - text in area after it has been expaneded
   */
  expendSelection(doc, cursor) {
    const tmpSelection = doc.getSelection();
    let result;
    const start = {
      line: cursor.line,
      ch: cursor.ch - 2
    };
    const end = {
      line: cursor.line,
      ch: cursor.ch + 2
    };

    doc.setSelection(start, end);

    if (tmpSelection === '****' || tmpSelection === '____') {
      result = tmpSelection;
    } else {
      doc.setSelection(cursor);
    }

    return result;
  },
  /**
   * move cursor to center
   * @param {CodeMirror.doc} doc - codemirror document
   * @param {object} cursor - codemirror cursor
   * @param {boolean} isRemoved - whether it involes deletion
   */
  setCursorToCenter(doc, cursor, isRemoved) {
    const pos = isRemoved ? -1 : 1;
    doc.setCursor(cursor.line, cursor.ch + pos);
  }
});

export default Italic;

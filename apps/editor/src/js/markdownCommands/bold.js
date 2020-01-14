/**
 * @fileoverview Implements Bold markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';
import { changeSyntax } from './emphasisCommon';

const boldRangeRegex = /^(\*{2}|_{2}).*\1$/;
const boldContentRegex = /[*_]{2,}([^*_]*)[*_]{2,}/g;
const boldSymbol = '**';

/**
 * Bold
 * Add bold markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Bold
 * @ignore
 */
const Bold = CommandManager.command(
  'markdown',
  /** @lends Bold */ {
    name: 'Bold',
    keyMap: ['CTRL+B', 'META+B'],
    /**
     * Command Handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec(mde) {
      const cm = mde.getEditor();
      const doc = cm.getDoc();
      const originRange = mde.getRange();

      changeSyntax(doc, originRange, boldSymbol, boldRangeRegex, boldContentRegex);

      cm.focus();
    }
  }
);

export default Bold;

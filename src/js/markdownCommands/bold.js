/**
* @fileoverview Implements Bold markdown command
* @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
*/
import CommandManager from '../commandManager';
import common from './empahsisCommon';

const boldRangeRegex = /^(\*|_){2}.*\1{2}$/;
const boldContentRegex = /[*_]{2,}([^*_]*)[*_]{2,}/g;
const boldSymbol = '**';

/**
 * Bold
 * Add bold markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Bold
 * @ignore
 */
const Bold = CommandManager.command('markdown', /** @lends Bold */{
  name: 'Bold',
  keyMap: ['CTRL+B', 'META+B'],
  /**
   * Command Handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec(mde) {
    common.changeSyntax(mde, boldSymbol, boldRangeRegex, boldContentRegex);
  }
});

export default Bold;

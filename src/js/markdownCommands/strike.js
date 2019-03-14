/**
 * @fileoverview Implements StrikeThrough markdown command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import CommandManager from '../commandManager';
import common from './empahsisCommon';

const strikeRangeRegex = /^~~.*~~$/;
const strikeContentRegex = /~~([^~]*)~~/g;
const strikeSymbol = '~~';

/**
 * Strike
 * Add strike markdown syntax to markdown editor
 * @extends Command
 * @module markdownCommands/Strike
 * @ignore
 */
const Strike = CommandManager.command('markdown', /** @lends Strike */{
  name: 'Strike',
  keyMap: ['CTRL+S', 'META+S'],
  /**
   * Command handler
   * @param {MarkdownEditor} mde MarkdownEditor instance
   */
  exec(mde) {
    common.changeSyntax(mde, strikeSymbol, strikeRangeRegex, strikeContentRegex);
  }
});

export default Strike;

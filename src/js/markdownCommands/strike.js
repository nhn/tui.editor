/**
 * @fileoverview Implements StrikeThrough markdown command
 * @author NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import CommandManager from '../commandManager';
import {changeSyntax} from './empahsisCommon';

const strikeRangeRegex = /^~~.*~~$/;
const strikeContentRegex = /~~([^~]*)~~/g;
const symbol = '~~';

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
    const cm = mde.getEditor();
    const doc = cm.getDoc();
    const originRange = mde.getRange();

    changeSyntax(doc, originRange, symbol, strikeRangeRegex, strikeContentRegex);

    cm.focus();
  }
});

export default Strike;

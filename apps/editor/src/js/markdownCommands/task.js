/**
 * @fileoverview Implements Task markdown command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import CommandManager from '../commandManager';

/**
 * Task
 * @extends Command
 * @module markdownCommands/Task
 * @ignore
 */
const Task = CommandManager.command(
  'markdown',
  /** @lends Task */ {
    name: 'Task',
    keyMap: ['ALT+T', 'ALT+T'],
    /**
     * Command handler
     * @param {MarkdownEditor} mde MarkdownEditor instance
     */
    exec(mde) {
      const range = mde.getCurrentRange();
      const listManager = mde.componentManager.getManager('list');

      listManager.changeSyntax(range, 'task');
    }
  }
);

export default Task;

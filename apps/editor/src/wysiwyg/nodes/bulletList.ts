import { DOMOutputSpecArray, ProsemirrorNode } from 'prosemirror-model';

import NodeSchema from '@/spec/node';
import { getWwCommands } from '@/commands/wwCommands';
import {
  createDOMInfoParsedRawHTML,
  getCustomAttrs,
  getDefaultCustomAttrs,
} from '@/wysiwyg/helper/node';
import { changeListTo, changeListToTask } from '@/wysiwyg/command/list';

import { Command } from 'prosemirror-commands';

export class BulletList extends NodeSchema {
  get name() {
    return 'bulletList';
  }

  get schema() {
    return {
      content: 'listItem+',
      group: 'block',
      attrs: {
        rawHTML: { default: null },
        ...getDefaultCustomAttrs(),
      },
      parseDOM: [createDOMInfoParsedRawHTML('ul')],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        return ['ul', getCustomAttrs(attrs), 0];
      },
    };
  }

  private toBulletList(): Command {
    return (state, dispatch) => changeListTo(state.schema.nodes.bulletList)(state, dispatch);
  }

  private toTaskList(): Command {
    return changeListToTask();
  }

  commands() {
    return {
      bulletList: this.toBulletList,
      taskList: changeListToTask,
    };
  }

  keymaps() {
    const bulletListCommand = this.toBulletList();
    const taskListCommand = this.toTaskList();
    const { indent, outdent } = getWwCommands();

    return {
      'Mod-u': bulletListCommand,
      'Mod-U': bulletListCommand,
      'alt-t': taskListCommand,
      'alt-T': taskListCommand,
      Tab: indent(),
      'Shift-Tab': outdent(),
    };
  }
}

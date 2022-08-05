import { DOMOutputSpec, ProsemirrorNode } from 'prosemirror-model';

import NodeSchema from '@/spec/node';
import { getWwCommands } from '@/commands/wwCommands';
import {
  createDOMInfoParsedRawHTML,
  getCustomAttrs,
  getDefaultCustomAttrs,
} from '@/wysiwyg/helper/node';
import { changeList, toggleTask } from '@/wysiwyg/command/list';

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
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpec {
        return ['ul', getCustomAttrs(attrs), 0];
      },
    };
  }

  private changeList(): Command {
    return (state, dispatch) => changeList(state.schema.nodes.bulletList)(state, dispatch);
  }

  commands() {
    return {
      bulletList: this.changeList,
      taskList: toggleTask,
    };
  }

  keymaps() {
    const bulletListCommand = this.changeList();
    const { indent, outdent } = getWwCommands();

    return {
      'Mod-u': bulletListCommand,
      'Mod-U': bulletListCommand,
      Tab: indent(),
      'Shift-Tab': outdent(),
    };
  }
}

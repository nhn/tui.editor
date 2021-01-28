import { DOMOutputSpecArray } from 'prosemirror-model';

import NodeSchema from '@/spec/node';
import { getWwCommands } from '@/commands/wwCommands';
import { createDOMInfoParsedRawHTML } from '@/wysiwyg/helper/node';
import { changeList, toggleTask } from '@/wysiwyg/helper/list';

import { EditorCommand } from '@t/spec';

export class BulletList extends NodeSchema {
  get name() {
    return 'bulletList';
  }

  get defaultSchema() {
    return {
      content: 'listItem+',
      group: 'block listGroup',
      attrs: {
        rawHTML: { default: null }
      },
      parseDOM: [createDOMInfoParsedRawHTML('ul')],
      toDOM(): DOMOutputSpecArray {
        return ['ul', 0];
      }
    };
  }

  private changeList(): EditorCommand {
    return () => (state, dispatch) => changeList(state.schema.nodes.bulletList)(state, dispatch);
  }

  commands() {
    return {
      bulletList: this.changeList(),
      task: toggleTask
    };
  }

  keymaps() {
    const bulletListCommand = this.changeList()();
    const { indent, outdent } = getWwCommands();

    return {
      'Mod-u': bulletListCommand,
      'Mod-U': bulletListCommand,
      Tab: indent(),
      'Shift-Tab': outdent()
    };
  }
}

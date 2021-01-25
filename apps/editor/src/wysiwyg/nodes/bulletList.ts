import { DOMOutputSpecArray } from 'prosemirror-model';

import NodeSchema from '@/spec/node';
import { getWwCommands } from '@/commands/wwCommands';
import { createDOMInfoParsedRawHTML, isInListNode } from '@/wysiwyg/helper/node';
import { wrapInList, changeListType, changeTaskListItems } from '@/wysiwyg/helper/list';

import { EditorCommand } from '@t/spec';

export class BulletList extends NodeSchema {
  get name() {
    return 'bulletList';
  }

  get defaultSchema() {
    return {
      content: 'listItem+',
      group: 'block',
      attrs: {
        rawHTML: { default: null }
      },
      parseDOM: [createDOMInfoParsedRawHTML('ul')],
      toDOM(): DOMOutputSpecArray {
        return ['ul', 0];
      }
    };
  }

  private toggleList(): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, tr, doc } = state;
      const { $from, $to } = selection;
      const range = $from.blockRange($to);

      if (!range) {
        return false;
      }

      const { bulletList } = state.schema.nodes;

      if (isInListNode($from)) {
        const newTr = changeListType(tr, doc, $from, $to, bulletList);

        dispatch!(newTr);

        return true;
      }

      return wrapInList('bulletList')(state, dispatch);
    };
  }

  private toggleTask(): EditorCommand {
    return () => (state, dispatch) => {
      const { selection, tr, doc } = state;
      const { $from, $to } = selection;
      const range = $from.blockRange($to);

      if (!range) {
        return false;
      }

      if (isInListNode($from)) {
        const newTr = changeTaskListItems(tr, doc, $from, $to);

        dispatch!(newTr);

        return true;
      }

      return wrapInList('task')(state, dispatch);
    };
  }

  commands() {
    return {
      bulletList: this.toggleList(),
      task: this.toggleTask()
    };
  }

  keymaps() {
    const bulletListCommand = this.toggleList()();
    const { indent, outdent } = getWwCommands();

    return {
      'Mod-u': bulletListCommand,
      'Mod-U': bulletListCommand,
      Tab: indent(),
      'Shift-Tab': outdent()
    };
  }
}

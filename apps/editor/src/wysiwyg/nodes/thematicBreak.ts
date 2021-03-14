import { Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';

import Node from '@/spec/node';

import { EditorCommand } from '@t/spec';

const ROOT_BLOCK_DEPTH = 1;

export class ThematicBreak extends Node {
  get name() {
    return 'thematicBreak';
  }

  get defaultSchema() {
    return {
      attrs: {
        rawHTML: { default: null },
      },
      group: 'block',
      parseDOM: [{ tag: 'hr' }],
      selectable: false,
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        return ['div', [attrs.rawHTML || 'hr']];
      },
    };
  }

  private hr(): EditorCommand {
    return () => (state, dispatch) => {
      const { $from, $to } = state.selection;

      if ($from === $to) {
        const { doc } = state;
        const { thematicBreak, paragraph } = state.schema.nodes;

        const nodes: ProsemirrorNode[] = [thematicBreak.create()];

        const rootBlock = $from.node(ROOT_BLOCK_DEPTH);
        const lastBlock = doc.child(doc.childCount - 1) === rootBlock;
        const blockEnd = doc.resolve($from.after(ROOT_BLOCK_DEPTH));
        const nextHr = blockEnd.nodeAfter?.type.name === this.name;

        if (lastBlock || nextHr) {
          nodes.push(paragraph.create());
        }

        dispatch!(state.tr.insert(blockEnd.pos, nodes).scrollIntoView());

        return true;
      }

      return false;
    };
  }

  commands() {
    return { hr: this.hr() };
  }

  keymaps() {
    const hrCommand = this.hr()();

    return {
      'Mod-l': hrCommand,
      'Mod-L': hrCommand,
    };
  }
}

import { Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';
import { setBlockType } from 'prosemirror-commands';

import Node from '@/spec/node';

import { EditorCommand } from '@t/spec';

export class Heading extends Node {
  get name() {
    return 'heading';
  }

  get levels() {
    return [1, 2, 3, 4, 5, 6];
  }

  get defaultSchema() {
    const parseDOM = this.levels.map(level => {
      return { tag: `h${level}`, attrs: { level } };
    });

    return {
      attrs: { level: { default: 1 } },
      content: 'inline*',
      group: 'block',
      defining: true,
      parseDOM,
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        return [`h${attrs.level}`, 0];
      }
    };
  }

  commands(): EditorCommand {
    return payload => (state, dispatch) =>
      setBlockType(state.schema.nodes.heading, payload)(state, dispatch);
  }
}

import { Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';
import { setBlockType } from 'prosemirror-commands';

import NodeSchema from '@/spec/node';

import { EditorCommand } from '@t/spec';

export class Heading extends NodeSchema {
  get name() {
    return 'heading';
  }

  get levels() {
    return [1, 2, 3, 4, 5, 6];
  }

  get defaultSchema() {
    const parseDOM = this.levels.map(level => {
      return {
        tag: `h${level}`,
        getAttrs(dom: Node | string) {
          const rawHTML = (dom as HTMLElement).getAttribute('data-raw-html');

          return {
            level,
            ...(rawHTML && { rawHTML })
          };
        }
      };
    });

    return {
      attrs: {
        level: { default: 1 },
        headingType: { default: 'atx' },
        rawHTML: { default: null }
      },
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

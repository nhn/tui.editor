import { ProsemirrorNode, DOMOutputSpec } from 'prosemirror-model';
import { setBlockType, Command } from 'prosemirror-commands';

import { addParagraph } from '@/helper/manipulation';
import { between, last } from '@/utils/common';
import NodeSchema from '@/spec/node';
import { getCustomAttrs, getDefaultCustomAttrs } from '@/wysiwyg/helper/node';

import { EditorCommand } from '@t/spec';

export class CodeBlock extends NodeSchema {
  get name() {
    return 'codeBlock';
  }

  get schema() {
    return {
      content: 'text*',
      group: 'block',
      attrs: {
        language: { default: null },
        rawHTML: { default: null },
        ...getDefaultCustomAttrs(),
      },
      code: true,
      defining: true,
      marks: '',
      parseDOM: [
        {
          tag: 'pre',
          preserveWhitespace: 'full' as const,
          getAttrs(dom: Node | string) {
            const rawHTML = (dom as HTMLElement).getAttribute('data-raw-html');
            const child = (dom as HTMLElement).firstElementChild;

            return {
              language: child?.getAttribute('data-language') || null,
              ...(rawHTML && { rawHTML }),
            };
          },
        },
      ],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpec {
        return [
          attrs.rawHTML || 'pre',
          ['code', { 'data-language': attrs.language, ...getCustomAttrs(attrs) }, 0],
        ];
      },
    };
  }

  commands(): EditorCommand {
    return () => (state, dispatch) => setBlockType(state.schema.nodes.codeBlock)(state, dispatch);
  }

  moveCursor(direction: 'up' | 'down'): Command {
    return (state, dispatch) => {
      const { tr, doc, schema } = state;
      const { $from } = state.selection;
      const { view } = this.context;

      if (view!.endOfTextblock(direction) && $from.node().type.name === 'codeBlock') {
        const lines: string[] = $from.parent.textContent.split('\n');

        const offset = direction === 'up' ? $from.start() : $from.end();
        const range =
          direction === 'up'
            ? [offset, lines[0].length + offset]
            : [offset - last(lines).length, offset];
        const pos = doc.resolve(direction === 'up' ? $from.before() : $from.after());
        const node = direction === 'up' ? pos.nodeBefore : pos.nodeAfter;

        if (between($from.pos, range[0], range[1]) && !node) {
          const newTr = addParagraph(tr, pos, schema);

          if (newTr) {
            dispatch!(newTr);
            return true;
          }
        }
      }

      return false;
    };
  }

  keymaps() {
    const codeCommand = this.commands()();

    return {
      'Shift-Mod-p': codeCommand,
      'Shift-Mod-P': codeCommand,
      ArrowUp: this.moveCursor('up'),
      ArrowDown: this.moveCursor('down'),
    };
  }
}

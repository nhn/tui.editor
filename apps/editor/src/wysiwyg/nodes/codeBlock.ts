import { DOMOutputSpec, Node as ProsemirrorNode, DOMOutputSpecArray } from 'prosemirror-model';
import { setBlockType } from 'prosemirror-commands';

import { EditorCommand } from '@t/spec';
import Node from '@/spec/node';

export class CodeBlock extends Node {
  get name() {
    return 'codeBlock';
  }

  get schema() {
    return {
      content: 'text*',
      group: 'block',
      attrs: {
        class: { default: null },
        language: { default: null }
      },
      code: true,
      defining: true,
      marks: '',
      parseDOM: [
        {
          tag: 'pre',
          // preserveWhitespace: 'full',
          getAttrs(dom: DOMOutputSpec) {
            const className = (dom as HTMLElement).getAttribute('class');

            return {
              class: className,
              language: className!.split('lang-')
            };
          }
        }
      ],
      toDOM({ attrs }: ProsemirrorNode): DOMOutputSpecArray {
        return [
          'pre',
          { class: attrs.class || null },
          ['code', { 'data-language': attrs.language || null }, 0]
        ];
      }
    };
  }

  commands(): EditorCommand {
    return () => (state, dispatch) => setBlockType(state.schema.nodes.codeBlock)(state, dispatch);
  }

  keymaps() {
    const codeCommand = this.commands()();

    return {
      'Shift-Mod-p': codeCommand,
      'Shift-Mod-P': codeCommand
    };
  }
}

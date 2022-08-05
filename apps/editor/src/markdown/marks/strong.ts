import { DOMOutputSpec } from 'prosemirror-model';
import { EditorCommand } from '@t/spec';
import { clsWithMdPrefix } from '@/utils/dom';
import Mark from '@/spec/mark';
import { toggleMark } from '../helper/mdCommand';

export const reStrong = /^(\*{2}|_{2}).*([\s\S]*)\1$/m;
const strongSyntax = '**';

export class Strong extends Mark {
  get name() {
    return 'strong';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpec {
        return ['span', { class: clsWithMdPrefix('strong') }, 0];
      },
    };
  }

  private bold(): EditorCommand {
    return toggleMark(reStrong, strongSyntax);
  }

  commands() {
    return { bold: this.bold() };
  }

  keymaps() {
    const boldCommand = this.bold()();

    return { 'Mod-b': boldCommand, 'Mod-B': boldCommand };
  }
}

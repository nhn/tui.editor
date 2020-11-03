import { DOMOutputSpecArray } from 'prosemirror-model';
import { EditorCommand } from '@t/spec';
import { cls } from '@/utils/dom';
import Mark from '@/spec/mark';
import { createMarkCommand } from '../helper/mdCommand';
import { reStrong } from './strong';

const reEmph = /^(\*|_).*([\s\S]*)\1$/m;
const reStrongEmph = /^(\*{3}|_{3}).*([\s\S]*)\1$/m;
const emphSyntax = '*';

export class Emph extends Mark {
  get name() {
    return 'emph';
  }

  get schema() {
    return {
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: cls('emph') }, 0];
      }
    };
  }

  private italic(): EditorCommand {
    const conditionFn = (text: string) =>
      (reEmph.test(text) && !reStrong.test(text)) || reStrongEmph.test(text);

    return createMarkCommand(conditionFn, emphSyntax);
  }

  commands() {
    return { italic: this.italic() };
  }

  keymaps() {
    const italicCommand = this.italic()();

    return { 'Mod-i': italicCommand, 'Mod-I': italicCommand };
  }
}

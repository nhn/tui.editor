import { EditorView } from 'prosemirror-view';
import { keymap } from 'prosemirror-keymap';
import { EditorAllCommandMap, SpecContext, EditorCommand } from '@t/spec';
import isFunction from 'tui-code-snippet/type/isFunction';
import { getDefaultCommands } from '@/commands/defaultCommands';
import { includes } from '@/utils/common';

import Mark from '@/spec/mark';
import Node from '@/spec/node';

type Spec = Node | Mark;

const defaultCommandShortcuts = [
  'Enter',
  'Shift-Enter',
  'Mod-Enter',
  'Tab',
  'Shift-Tab',
  'Delete',
  'Backspace',
  'Mod-Delete',
  'Mod-Backspace',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Mod-d',
  'Mod-D',
  'Alt-ArrowUp',
  'Alt-ArrowDown',
];

export function execCommand(
  view: EditorView,
  command: EditorCommand,
  payload?: Record<string, any>
) {
  view.focus();
  return command(payload)(view.state, view.dispatch, view);
}

export default class SpecManager {
  private specs: Spec[];

  constructor(specs: Spec[]) {
    this.specs = specs;
  }

  get nodes() {
    return this.specs
      .filter((spec) => spec.type === 'node')
      .reduce((nodes, { name, schema }) => {
        return {
          ...nodes,
          [name]: schema,
        };
      }, {});
  }

  get marks() {
    return this.specs
      .filter((spec) => spec.type === 'mark')
      .reduce((marks, { name, schema }) => {
        return {
          ...marks,
          [name]: schema,
        };
      }, {});
  }

  commands(view: EditorView, addedCommands?: Record<string, EditorCommand>) {
    const specCommands: EditorAllCommandMap = this.specs
      .filter(({ commands }) => commands)
      .reduce((allCommands, spec) => {
        const commands: EditorAllCommandMap = {};
        const specCommand = spec.commands!();

        if (isFunction(specCommand)) {
          commands[spec.name] = (payload) => execCommand(view, specCommand, payload);
        } else {
          Object.keys(specCommand).forEach((name) => {
            commands[name] = (payload) => execCommand(view, specCommand[name], payload);
          });
        }

        return {
          ...allCommands,
          ...commands,
        };
      }, {});

    const defaultCommands = getDefaultCommands();

    Object.keys(defaultCommands).forEach((name) => {
      specCommands[name] = (payload) => execCommand(view, defaultCommands[name], payload);
    });

    if (addedCommands) {
      Object.keys(addedCommands).forEach((name) => {
        specCommands[name] = (payload) => execCommand(view, addedCommands[name], payload);
      });
    }

    return specCommands;
  }

  keymaps(useCommandShortcut: boolean) {
    const specKeymaps = this.specs.filter((spec) => spec.keymaps).map((spec) => spec.keymaps!());

    return specKeymaps.map((keys) => {
      if (!useCommandShortcut) {
        Object.keys(keys).forEach((key) => {
          if (!includes(defaultCommandShortcuts, key)) {
            delete keys[key];
          }
        });
      }
      return keymap(keys);
    });
  }

  setContext(context: SpecContext) {
    this.specs.forEach((spec) => {
      spec.setContext(context);
    });
  }
}

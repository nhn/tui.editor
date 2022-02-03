import { EditorView } from 'prosemirror-view';
import { keymap } from 'prosemirror-keymap';
import { EditorAllCommandMap, SpecContext, EditorCommand } from '@t/spec';
import isFunction from 'tui-code-snippet/type/isFunction';
import { getDefaultCommands } from '@/commands/defaultCommands';

import Mark from '@/spec/mark';
import Node from '@/spec/node';

type Spec = Node | Mark;

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

  // 1. useCommand~~ 옵션이 false 일 때 등록되면 안되는 단축키들을 분류해야 한다.
  // 2. 분류된 애들을 useCommand~~ 옵션에 따라 단축키 등록 여부를 결정한다.
  // 3. 'Enter', 'Tab', 'Shift-Tab', 'Delete'과 같은 애들은 seCommand~~ 옵션 상관없이 사용성을 위해 무조건 제공한다. 이외에 키들만 옵션을 통해 제어한다.
  // 4. undo, redo는 여기서 제어가 안되므로 별도 로직 처리가 필요하다.
  keymaps(useCommandShortcut: boolean) {
    const defaultShortcuts = ['Enter', 'Tab', 'Shift-Tab', 'Delete'];

    const specKeymaps = this.specs.filter((spec) => spec.keymaps).map((spec) => spec.keymaps!());

    return specKeymaps.map((keys) => {
      if (!useCommandShortcut) {
        Object.keys(keys).forEach((key) => {
          if (!defaultShortcuts.includes(key)) {
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

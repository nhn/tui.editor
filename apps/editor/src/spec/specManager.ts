import { EditorView } from 'prosemirror-view';
import { keymap } from 'prosemirror-keymap';
import { EditorAllCommandMap, Context, EditorCommand } from '@t/spec';
import isFunction from 'tui-code-snippet/type/isFunction';
import { getDefaultCommands } from '@/commands/defaultCommands';
import Mark from '@/spec/mark';
import Node from '@/spec/node';

type Spec = Node | Mark;

function execCommand(view: EditorView, command: EditorCommand, payload?: Record<string, any>) {
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
      .filter(spec => spec.type === 'node')
      .reduce((nodes, { name, schema }) => {
        return {
          ...nodes,
          [name]: schema
        };
      }, {});
  }

  get marks() {
    return this.specs
      .filter(spec => spec.type === 'mark')
      .reduce((marks, { name, schema }) => {
        return {
          ...marks,
          [name]: schema
        };
      }, {});
  }

  commands(context: Context) {
    const specCommands: EditorAllCommandMap = this.specs
      .filter(({ commands }) => commands)
      .reduce((allCommands, spec) => {
        const commands: EditorAllCommandMap = {};
        const specCommand = spec.commands!(context);

        if (isFunction(specCommand)) {
          commands[spec.name] = payload => execCommand(context.view!, specCommand, payload);
        } else {
          Object.keys(specCommand).forEach(name => {
            commands[name] = payload => execCommand(context.view!, specCommand[name], payload);
          });
        }

        return {
          ...allCommands,
          ...commands
        };
      }, {});

    const defaultCommands = getDefaultCommands();

    Object.keys(defaultCommands).forEach(name => {
      specCommands[name] = payload => execCommand(context.view!, defaultCommands[name], payload);
    });

    return specCommands;
  }

  keymaps(context: Context) {
    const specKeymaps = this.specs.filter(spec => spec.keymaps).map(spec => spec.keymaps!(context));

    return specKeymaps.map(keys => keymap(keys));
  }
}

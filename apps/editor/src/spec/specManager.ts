import { EditorView } from 'prosemirror-view';
import { Command } from 'prosemirror-commands';
import { keymap } from 'prosemirror-keymap';
import { CommandMap, Context } from '@t/spec';
import { getDefaultCommands } from '@/commands/defaultCommands';
import Mark from '@/spec/mark';
import Node from '@/spec/node';

type Spec = Node | Mark;

function execCommand(view: EditorView, command: Command) {
  view.focus();
  return command(view.state, view.dispatch, view);
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
    const specCommands: CommandMap = this.specs
      .filter(({ commands }) => commands)
      .reduce((allCommands, spec) => {
        const { commandName } = spec;
        const commands: CommandMap = {};
        const command = spec.commands!(context);

        commands[commandName] = () => execCommand(context.view!, command);

        return {
          ...allCommands,
          ...commands
        };
      }, {});

    const defaultCommands: CommandMap = getDefaultCommands();

    Object.keys(defaultCommands).forEach(name => {
      specCommands[name] = () => execCommand(context.view!, defaultCommands[name]);
    });

    return specCommands;
  }

  keymaps(context: Context) {
    const specKeymaps = this.specs.filter(spec => spec.keymaps).map(spec => spec.keymaps!(context));

    return specKeymaps.map(keys => keymap(keys));
  }
}

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, Node } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';

import EditorBase, { StateOptions } from '@/base';
import { getDefaultCommands } from '@/commands/defaultCommands';
import { getWwCommands } from '@/commands/wwCommands';

import { tableSelectionPlugin } from '@/wysiwyg/plugins/tableSelection';
import { tableContextMenuPlugin } from '@/wysiwyg/plugins/tableContextMenu';
import { taskPlugin } from '@/wysiwyg/plugins/taskPlugin';

import { createTextSelection } from '@/helper/manipulation';

import { createSpecs } from './specCreator';

import { Emitter } from '@t/event';
import { ToDOMAdaptor } from '@t/convertor';
import { CustomBlockView } from './nodeview/customBlockView';

const CONTENTS_CLASS_NAME = 'tui-editor-contents';

export default class WysiwygEditor extends EditorBase {
  private toDOMAdaptor: ToDOMAdaptor;

  constructor(el: HTMLElement, eventEmitter: Emitter, toDOMAdaptor: ToDOMAdaptor) {
    super(el, eventEmitter);

    this.el = el;
    this.toDOMAdaptor = toDOMAdaptor;
    this.specs = this.createSpecs();
    this.schema = this.createSchema();
    this.context = this.createContext();
    this.keymaps = this.createKeymaps();
    this.view = this.createView();
    this.commands = this.createCommands();
  }

  createSpecs() {
    return createSpecs(this.toDOMAdaptor);
  }

  createKeymaps() {
    return this.specs.keymaps();
  }

  createSchema() {
    return new Schema({
      nodes: this.specs.nodes,
      marks: this.specs.marks
    });
  }

  createContext() {
    return {
      schema: this.schema,
      eventEmitter: this.eventEmitter
    };
  }

  createState(addedStates?: StateOptions) {
    const { undo, redo } = getDefaultCommands();

    return EditorState.create({
      schema: this.schema,
      plugins: [
        ...this.keymaps,
        keymap({
          'Mod-z': undo(),
          'Shift-Mod-z': redo(),
          ...baseKeymap
        }),
        history(),
        tableSelectionPlugin(),
        tableContextMenuPlugin(this.eventEmitter),
        taskPlugin()
      ],
      ...addedStates
    });
  }

  createView() {
    const { toDOMAdaptor } = this;

    return new EditorView(this.el, {
      state: this.createState(),
      attributes: { class: CONTENTS_CLASS_NAME },
      nodeViews: {
        customBlock(node, view, getPos) {
          return new CustomBlockView(node, view, getPos, toDOMAdaptor);
        }
      }
    });
  }

  createCommands() {
    return this.specs.commands(this.view, getWwCommands());
  }

  /* eslint-disable @typescript-eslint/no-empty-function */

  focus() {
    this.view.focus();
  }

  getHTML() {
    return this.view.dom.innerHTML;
  }

  getModel() {
    return this.view.state.doc;
  }

  getRange() {}

  getSchema() {
    return this.view.state.schema;
  }

  insertText(text: string) {}

  moveCursorToEnd() {}

  moveCursorToStart() {}

  replaceRelativeOffset(content: string, offset: number, overwriteLength: number) {}

  replaceSelection(content: string, range: Range) {}

  scrollTop(value: number) {
    return true;
  }

  setMinHeight(minHeight: number) {}

  setHeight(height: number) {}

  setModel(newDoc: Node, cursorToEnd = false) {
    const { state, dispatch } = this.view;
    const { tr, doc } = state;

    dispatch(tr.replaceWith(0, doc.content.size, newDoc));
  }

  setPlaceholder(placeholder: string) {}

  setSelection(from = 0, to = 0) {
    const { state, dispatch } = this.view;
    const { tr } = state;
    const selection = createTextSelection(tr, from, to);

    dispatch(tr.setSelection(selection));
  }

  destroy() {}
}

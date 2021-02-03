import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, Node, Slice, Fragment } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';

import EditorBase, { StateOptions } from '@/base';
import { getDefaultCommands } from '@/commands/defaultCommands';
import { getWwCommands } from '@/commands/wwCommands';

import { placeholder } from '@/plugins/placeholder';
import { tableSelectionPlugin } from '@/wysiwyg/plugins/tableSelection';
import { tableContextMenuPlugin } from '@/wysiwyg/plugins/tableContextMenu';
import { taskPlugin } from '@/wysiwyg/plugins/taskPlugin';

import { createTextSelection } from '@/helper/manipulation';

import { createSpecs } from './specCreator';
import { CustomBlockView } from './nodeview/customBlockView';

import { Emitter } from '@t/event';
import { ToDOMAdaptor } from '@t/convertor';
import { LinkAttributes } from '@t/editor';

import { changePastedHTML, changePastedSlice } from '@/wysiwyg/clipboard/paste';
import { pasteToTable } from '@/wysiwyg/clipboard/pasteToTable';
import { dropImage } from '@/plugins/dropImage';

const CONTENTS_CLASS_NAME = 'tui-editor-contents';

export default class WysiwygEditor extends EditorBase {
  private toDOMAdaptor: ToDOMAdaptor;

  private linkAttributes: LinkAttributes;

  constructor(eventEmitter: Emitter, toDOMAdaptor: ToDOMAdaptor, linkAttributes = {}) {
    super(eventEmitter);

    this.toDOMAdaptor = toDOMAdaptor;
    this.linkAttributes = linkAttributes;
    this.specs = this.createSpecs();
    this.schema = this.createSchema();
    this.context = this.createContext();
    this.keymaps = this.createKeymaps();
    this.view = this.createView();
    this.commands = this.createCommands();
  }

  createSpecs() {
    return createSpecs(this.toDOMAdaptor, this.linkAttributes);
  }

  createKeymaps() {
    return this.specs.keymaps();
  }

  createSchema() {
    return new Schema({
      nodes: this.specs.nodes,
      marks: this.specs.marks,
    });
  }

  createContext() {
    return {
      schema: this.schema,
      eventEmitter: this.eventEmitter,
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
          ...baseKeymap,
        }),
        history(),
        placeholder(this.placeholder),
        tableSelectionPlugin(),
        tableContextMenuPlugin(this.eventEmitter),
        taskPlugin(),
        dropImage(this.context, 'wysiwyg'),
      ],
      ...addedStates,
    });
  }

  createView() {
    const { toDOMAdaptor } = this;

    return new EditorView(this.el, {
      state: this.createState(),
      attributes: {
        class: CONTENTS_CLASS_NAME,
      },
      nodeViews: {
        customBlock(node, view, getPos) {
          return new CustomBlockView(node, view, getPos, toDOMAdaptor);
        },
      },
      transformPastedHTML: changePastedHTML,
      transformPasted: (slice: Slice) => changePastedSlice(slice, this.schema),
      handlePaste: (view: EditorView, _: ClipboardEvent, slice: Slice) => pasteToTable(view, slice),
    });
  }

  createCommands() {
    return this.specs.commands(this.view, getWwCommands());
  }

  getHTML() {
    return this.view.dom.innerHTML;
  }

  getModel() {
    return this.view.state.doc;
  }

  getRange() {
    const { from, to } = this.view.state.selection;

    return [from, to];
  }

  getSchema() {
    return this.view.state.schema;
  }

  replaceSelection(content: string) {
    const { schema, tr } = this.view.state;
    const { paragraph } = schema.nodes;
    const texts = content.split('\n');
    const paras = texts.map((text) => paragraph.create(null, schema.text(text)));

    this.view.dispatch(tr.replaceSelection(new Slice(Fragment.from(paras), 1, 1)));
    this.focus();
  }

  setModel(newDoc: Node, cursorToEnd = false) {
    const { tr, doc } = this.view.state;

    this.view.dispatch(tr.replaceWith(0, doc.content.size, newDoc));

    if (cursorToEnd) {
      this.moveCursorToEnd();
    }
  }

  setSelection(start = 0, end = 0) {
    const { tr } = this.view.state;
    const selection = createTextSelection(tr, start, end);

    this.view.dispatch(tr.setSelection(selection));
  }
}

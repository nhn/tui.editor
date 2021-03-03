import { EditorView } from 'prosemirror-view';
import { Schema, Node as ProsemirrorNode, Slice, Fragment } from 'prosemirror-model';

import EditorBase from '@/base';
import { getWwCommands } from '@/commands/wwCommands';

import { createTextSelection } from '@/helper/manipulation';
import { emitImageBlobHook, pasteImageOnly } from '@/helper/image';

import { placeholder } from '@/plugins/placeholder';

import { tableSelection } from './plugins/tableSelection';
import { tableContextMenu } from './plugins/tableContextMenu';
import { task } from './plugins/task';
import { toolbarState } from './plugins/toolbarState';

import { CustomBlockView } from './nodeview/customBlockView';
import { ImageView } from './nodeview/imageView';
import { CodeBlockView } from './nodeview/codeBlockView';

import { changePastedHTML, changePastedSlice } from './clipboard/paste';
import { pasteToTable } from './clipboard/pasteToTable';
import { createSpecs } from './specCreator';

import { Emitter } from '@t/event';
import { ToDOMAdaptor } from '@t/convertor';
import { LinkAttributes, WidgetStyle } from '@t/editor';
import { createNodesWithWidget } from '@/widget/rules';
import { widgetNodeView } from '@/widget/widgetNode';
import { cls } from '@/utils/dom';

interface WindowWithClipboard extends Window {
  clipboardData?: DataTransfer | null;
}

const CONTENTS_CLASS_NAME = cls('contents');

export default class WysiwygEditor extends EditorBase {
  private toDOMAdaptor: ToDOMAdaptor;

  private linkAttributes: LinkAttributes;

  constructor(eventEmitter: Emitter, toDOMAdaptor: ToDOMAdaptor, linkAttributes = {}) {
    super(eventEmitter);

    this.editorType = 'wysiwyg';
    this.toDOMAdaptor = toDOMAdaptor;
    this.linkAttributes = linkAttributes;
    this.specs = this.createSpecs();
    this.schema = this.createSchema();
    this.context = this.createContext();
    this.keymaps = this.createKeymaps();
    this.view = this.createView();
    this.commands = this.createCommands();
    this.specs.setContext({ ...this.context, view: this.view });
    this.initEvent();
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

  createPlugins() {
    return this.defaultPlugins.concat([
      tableSelection(),
      tableContextMenu(this.eventEmitter),
      task(),
      toolbarState(this.eventEmitter),
    ]);
  }

  createView() {
    const { toDOMAdaptor, eventEmitter } = this;

    return new EditorView(this.el, {
      state: this.createState(),
      attributes: {
        class: CONTENTS_CLASS_NAME,
      },
      nodeViews: {
        customBlock(node, view, getPos) {
          return new CustomBlockView(node, view, getPos, toDOMAdaptor);
        },
        image(node, view, getPos) {
          return new ImageView(node, view, getPos, toDOMAdaptor, eventEmitter);
        },
        codeBlock(node, view, getPos) {
          return new CodeBlockView(node, view, getPos, toDOMAdaptor, eventEmitter);
        },
        widget: widgetNodeView,
      },
      dispatchTransaction: (tr) => {
        const { state } = this.view.state.applyTransaction(tr);

        this.view.updateState(state);
        this.emitChangeEvent(tr);
      },
      transformPastedHTML: changePastedHTML,
      transformPasted: (slice: Slice) => changePastedSlice(slice, this.schema),
      handlePaste: (view: EditorView, _: ClipboardEvent, slice: Slice) => pasteToTable(view, slice),
      handleKeyDown: (_, ev) => {
        this.eventEmitter.emit('keydown', this.editorType, ev);
        return false;
      },
      handleDOMEvents: {
        paste: (_, ev) => {
          const clipboardData =
            (ev as ClipboardEvent).clipboardData || (window as WindowWithClipboard).clipboardData;
          const items = clipboardData && clipboardData.items;

          if (items) {
            const imageBlob = pasteImageOnly(items);

            if (imageBlob) {
              ev.preventDefault();

              emitImageBlobHook(this.eventEmitter, 'wysiwyg', imageBlob, ev.type);
            }
          }
          return false;
        },
        keyup: (_, ev: KeyboardEvent) => {
          this.eventEmitter.emit('keyup', this.editorType, ev);
          return false;
        },
        scroll: () => {
          this.eventEmitter.emit('scroll', 'editor');
          return true;
        },
      },
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

  getRange(): [number, number] {
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

  setModel(newDoc: ProsemirrorNode, cursorToEnd = false) {
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

  addWidget(node: Node, style: WidgetStyle, pos?: number) {
    const { dispatch, state } = this.view;

    dispatch(state.tr.setMeta('widget', { pos: pos ?? state.selection.to, node, style }));
  }

  replaceWithWidget(from: number, to: number, content: string) {
    const { tr, schema } = this.view.state;
    const nodes = createNodesWithWidget(content, schema);

    this.view.dispatch(tr.replaceWith(from, to, nodes));
  }
}

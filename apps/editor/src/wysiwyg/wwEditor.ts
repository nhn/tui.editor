import { EditorView } from 'prosemirror-view';
import { Node as ProsemirrorNode, Slice, Fragment, Mark } from 'prosemirror-model';
import isNumber from 'tui-code-snippet/type/isNumber';
import EditorBase from '@/base';
import { getWwCommands } from '@/commands/wwCommands';

import { createTextSelection } from '@/helper/manipulation';
import { emitImageBlobHook, pasteImageOnly } from '@/helper/image';

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
import { includes } from '@/utils/common';

interface WindowWithClipboard extends Window {
  clipboardData?: DataTransfer | null;
}

const CONTENTS_CLASS_NAME = cls('contents');

export default class WysiwygEditor extends EditorBase {
  private toDOMAdaptor: ToDOMAdaptor;

  private linkAttributes: LinkAttributes;

  constructor(
    eventEmitter: Emitter,
    toDOMAdaptor: ToDOMAdaptor,
    useCommandShortcut: boolean,
    linkAttributes = {}
  ) {
    super(eventEmitter);

    this.editorType = 'wysiwyg';
    this.toDOMAdaptor = toDOMAdaptor;
    this.linkAttributes = linkAttributes;
    this.specs = this.createSpecs();
    this.schema = this.createSchema();
    this.context = this.createContext();
    this.keymaps = this.createKeymaps(useCommandShortcut);
    this.view = this.createView();
    this.commands = this.createCommands();
    this.specs.setContext({ ...this.context, view: this.view });
    this.initEvent();
  }

  createSpecs() {
    return createSpecs(this.toDOMAdaptor, this.linkAttributes);
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

  getSelection(): [number, number] {
    const { from, to } = this.view.state.selection;

    return [from, to];
  }

  getSchema() {
    return this.view.state.schema;
  }

  replaceSelection(text: string, start?: number, end?: number) {
    const { schema, tr } = this.view.state;
    const { paragraph } = schema.nodes;
    const lineTexts = text.split('\n');
    const paras = lineTexts.map((lineText) => paragraph.create(null, schema.text(lineText)));
    const slice = new Slice(Fragment.from(paras), 1, 1);
    const newTr =
      isNumber(start) && isNumber(end)
        ? tr.replaceRange(start, end, slice)
        : tr.replaceSelection(slice);

    this.view.dispatch(newTr);
    this.focus();
  }

  deleteSelection(start?: number, end?: number) {
    const { tr } = this.view.state;
    const newTr =
      isNumber(start) && isNumber(end) ? tr.deleteRange(start, end) : tr.deleteSelection();

    this.view.dispatch(newTr.scrollIntoView());
  }

  getSelectedText(start?: number, end?: number) {
    const { doc, selection } = this.view.state;
    let { from, to } = selection;

    if (isNumber(start) && isNumber(end)) {
      from = start;
      to = end;
    }
    return doc.textBetween(from, to, '\n');
  }

  setModel(newDoc: ProsemirrorNode | [], cursorToEnd = false) {
    const { tr, doc } = this.view.state;

    this.view.dispatch(tr.replaceWith(0, doc.content.size, newDoc));

    if (cursorToEnd) {
      this.moveCursorToEnd();
    }
  }

  setSelection(start: number, end: number) {
    const { tr } = this.view.state;
    const selection = createTextSelection(tr, start, end);

    this.view.dispatch(tr.setSelection(selection));
  }

  addWidget(node: Node, style: WidgetStyle, pos?: number) {
    const { dispatch, state } = this.view;

    dispatch(state.tr.setMeta('widget', { pos: pos ?? state.selection.to, node, style }));
  }

  replaceWithWidget(start: number, end: number, text: string) {
    const { tr, schema } = this.view.state;
    const nodes = createNodesWithWidget(text, schema);

    this.view.dispatch(tr.replaceWith(start, end, nodes));
  }

  getRangeInfoOfNode(pos?: number) {
    const { doc, selection } = this.view.state;
    const $pos = pos ? doc.resolve(pos) : selection.$from;
    const marks = $pos.marks();
    const node = $pos.node();
    let start = $pos.start();
    let end = $pos.end();
    let type = node.type.name;

    if (marks.length || type === 'paragraph') {
      const mark = marks[marks.length - 1];
      const maybeHasMark = (nodeMarks: Mark[]) =>
        nodeMarks.length ? includes(nodeMarks, mark) : true;

      type = mark ? mark.type.name : 'text';

      node.forEach((child, offset) => {
        const { isText, nodeSize, marks: nodeMarks } = child;
        const startOffset = $pos.pos - start;

        if (
          isText &&
          offset <= startOffset &&
          offset + nodeSize >= startOffset &&
          maybeHasMark(nodeMarks)
        ) {
          start = start + offset;
          end = start + nodeSize;
        }
      });
    }
    return { range: [start, end] as [number, number], type };
  }
}

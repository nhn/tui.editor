import { Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Fragment, Schema, Slice } from 'prosemirror-model';
import { Step, ReplaceAroundStep } from 'prosemirror-transform';
// @ts-ignore
import { ToastMark } from '@toast-ui/toastmark';
import { Emitter } from '@t/event';
import { MdPos } from '@t/markdown';
import { WidgetStyle } from '@t/editor';
import EditorBase from '@/base';
import SpecManager from '@/spec/specManager';
import { cls, toggleClass } from '@/utils/dom';
import { emitImageBlobHook, pasteImageOnly } from '@/helper/image';
import { createTextSelection } from '@/helper/manipulation';
import { syntaxHighlight } from './plugins/syntaxHighlight';
import { previewHighlight } from './plugins/previewHighlight';
import { Doc } from './nodes/doc';
import { Paragraph } from './nodes/paragraph';
import { Text } from './nodes/text';
import { Heading } from './marks/heading';
import { BlockQuote } from './marks/blockQuote';
import { CodeBlock } from './marks/codeBlock';
import { Table } from './marks/table';
import { ThematicBreak } from './marks/thematicBreak';
import { ListItem } from './marks/listItem';
import { Strong } from './marks/strong';
import { Strike } from './marks/strike';
import { Emph } from './marks/emph';
import { Code } from './marks/code';
import { Link } from './marks/link';
import { Delimiter, TaskDelimiter, MarkedText, Meta, TableCell } from './marks/simpleMark';
import { Html } from './marks/html';
import { CustomBlock } from './marks/customBlock';
import { getEditorToMdPos, getMdToEditorPos } from './helper/pos';
import { smartTask } from './plugins/smartTask';
import { createNodesWithWidget } from '@/widget/rules';
import { Widget, widgetNodeView } from '@/widget/widgetNode';

interface WindowWithClipboard extends Window {
  clipboardData?: DataTransfer | null;
}

export default class MdEditor extends EditorBase {
  private toastMark: ToastMark;

  private clipboard!: HTMLTextAreaElement;

  constructor(toastMark: ToastMark, eventEmitter: Emitter) {
    super(eventEmitter);

    this.editorType = 'markdown';
    this.toastMark = toastMark;
    this.specs = this.createSpecs();
    this.schema = this.createSchema();
    this.context = this.createContext();
    this.keymaps = this.createKeymaps();
    this.view = this.createView();
    this.commands = this.createCommands();
    this.specs.setContext({ ...this.context, view: this.view });
    this.createClipboard();
    this.eventEmitter.listen('changePreviewTabWrite', () => this.toggleActive(true));
    this.eventEmitter.listen('changePreviewTabPreview', () => this.toggleActive(false));
    this.initEvent();
  }

  private toggleActive(active: boolean) {
    toggleClass(this.el!, 'active', active);
    if (active) {
      this.focus();
    } else {
      this.blur();
    }
  }

  private createClipboard() {
    this.clipboard = document.createElement('textarea');
    this.clipboard.className = cls('pseudo-clipboard');
    this.clipboard.addEventListener('paste', (ev: ClipboardEvent) => {
      ev.preventDefault();
      const clipboardData =
        (ev as ClipboardEvent).clipboardData || (window as WindowWithClipboard).clipboardData;
      const items = clipboardData && clipboardData.items;

      if (items) {
        const imageBlob = pasteImageOnly(items);

        if (imageBlob) {
          emitImageBlobHook(this.eventEmitter, 'markdown', imageBlob, ev.type);

          return;
        }
      }

      const text = clipboardData!.getData('text');

      this.replaceSelection(text);
    });
    this.el.insertBefore(this.clipboard, this.view.dom);
  }

  createContext() {
    return {
      toastMark: this.toastMark,
      schema: this.schema,
      eventEmitter: this.eventEmitter,
    };
  }

  createKeymaps() {
    return this.specs.keymaps();
  }

  createSpecs() {
    return new SpecManager([
      new Doc(),
      new Paragraph(),
      new Widget(),
      new Text(),
      new Heading(),
      new BlockQuote(),
      new CodeBlock(),
      new CustomBlock(),
      new Table(),
      new TableCell(),
      new ThematicBreak(),
      new ListItem(),
      new Strong(),
      new Strike(),
      new Emph(),
      new Code(),
      new Link(),
      new Delimiter(),
      new TaskDelimiter(),
      new MarkedText(),
      new Meta(),
      new Html(),
    ]);
  }

  createSchema() {
    return new Schema({
      nodes: this.specs.nodes,
      marks: this.specs.marks,
    });
  }

  createPlugins() {
    return this.defaultPlugins.concat([
      syntaxHighlight(this.context),
      previewHighlight(this.context),
      smartTask(this.context),
    ]);
  }

  createView() {
    return new EditorView(this.el, {
      state: this.createState(),
      dispatchTransaction: (tr) => {
        this.updateMarkdown(tr);

        const { state } = this.view.state.applyTransaction(tr);

        this.view.updateState(state);
        this.emitChangeEvent(tr);
      },
      clipboardTextSerializer: (slice) => this.getChanged(slice),
      handleKeyDown: (_, ev) => {
        if ((ev.metaKey || ev.ctrlKey) && ev.key.toUpperCase() === 'V') {
          this.clipboard.focus();
        }
        this.eventEmitter.emit('keydown', this.editorType, ev);
        return false;
      },
      handleDOMEvents: {
        scroll: () => {
          this.eventEmitter.emit('scroll', 'editor');
          return true;
        },
        keyup: (_, ev: KeyboardEvent) => {
          this.eventEmitter.emit('keyup', this.editorType, ev);
          return false;
        },
      },
      nodeViews: {
        widget: widgetNodeView,
      },
    });
  }

  createCommands() {
    return this.specs.commands(this.view);
  }

  private updateMarkdown(tr: Transaction) {
    if (tr.docChanged) {
      tr.steps.forEach((step, index) => {
        if (step.slice && !(step instanceof ReplaceAroundStep)) {
          const doc = tr.docs[index];
          const [from, to] = this.getResolvedRange(tr, step);
          const changed = this.getChanged(step.slice);
          const [startPos, endPos] = getEditorToMdPos(doc, from, to);
          const editResult = this.toastMark.editMarkdown(startPos, endPos, changed);

          this.eventEmitter.emit('updatePreview', editResult);

          tr.setMeta('editResult', editResult);
        }
      });
    }
  }

  private getResolvedRange(tr: Transaction, step: Step): [number, number] {
    const resolvedPos = tr.getMeta('resolvedPos');

    return resolvedPos || [step.from, step.to];
  }

  private getChanged(slice: Slice) {
    let changed = '';
    const from = 0;
    const to = slice.content.size;

    slice.content.nodesBetween(from, to, (node, pos) => {
      if (node.isText) {
        changed += node.text!.slice(Math.max(from, pos) - pos, to - pos);
      } else if (node.isBlock && pos > 0) {
        changed += '\n';
      }
    });

    return changed;
  }

  setSelection(start: MdPos, end: MdPos) {
    const { tr } = this.view.state;
    const [from, to] = getMdToEditorPos(tr.doc, this.toastMark, start, end);

    this.view.dispatch(tr.setSelection(createTextSelection(tr, from, to)));
    this.focus();
  }

  replaceSelection(text: string) {
    const { tr, schema } = this.view.state;
    const lineTexts = text.split('\n');
    const nodes = lineTexts.map((lineText) =>
      schema.nodes.paragraph.create(null, createNodesWithWidget(lineText, schema))
    );

    this.focus();
    this.view.dispatch(tr.replaceSelection(new Slice(Fragment.from(nodes), 1, 1)).scrollIntoView());
  }

  getRange() {
    const { from, to } = this.view.state.selection;

    return getEditorToMdPos(this.view.state.tr.doc, from, to);
  }

  setMarkdown(markdown: string, cursorToEnd = true) {
    const contents = markdown.split('\n');
    const { tr, doc, schema } = this.view.state;
    const nodes = contents.map((content) =>
      schema.nodes.paragraph.create(null, createNodesWithWidget(content, schema))
    );

    this.view.dispatch(tr.replaceWith(0, doc.content.size, nodes));

    if (cursorToEnd) {
      this.moveCursorToEnd();
    }
  }

  addWidget(node: Node, style: WidgetStyle, mdPos?: MdPos) {
    const { tr, doc, selection } = this.view.state;
    const pos = mdPos ? getMdToEditorPos(doc, this.toastMark, mdPos, mdPos)[0] : selection.to;

    this.view.dispatch(tr.setMeta('widget', { pos, node, style }));
  }

  replaceWithWidget(from: MdPos, to: MdPos, content: string) {
    const { tr, schema, doc } = this.view.state;
    const pos = getMdToEditorPos(doc, this.toastMark, from, to);
    const nodes = createNodesWithWidget(content, schema);

    this.view.dispatch(tr.replaceWith(pos[0], pos[1], nodes));
  }

  getMarkdown() {
    return this.toastMark.getLineTexts().join('\n');
  }

  getToastMark() {
    return this.toastMark;
  }
}

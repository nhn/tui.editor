import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMParser, Fragment, Schema, Slice } from 'prosemirror-model';
import { Step } from 'prosemirror-transform';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { history } from 'prosemirror-history';
// @ts-ignore
import { ToastMark } from '@toast-ui/toastmark';
import { Emitter } from '@t/event';
import { MdPos } from '@t/markdown';
import EditorBase from '@/base';
import SpecManager from '@/spec/specManager';
import { decodeURL } from '@/utils/encoder';
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
import { getEditorToMdPos, getMdToEditorPos } from './helper/pos';
import { createParagraph, createTextSelection, nbspToSpace } from '@/helper/manipulation';
import { placeholder } from '@/plugins/placeholder';
import { getDefaultCommands } from '@/commands/defaultCommands';

export default class MdEditor extends EditorBase {
  private toastMark: ToastMark;

  constructor(el: HTMLElement, toastMark: ToastMark, eventEmitter: Emitter) {
    super(el, eventEmitter);

    this.toastMark = toastMark;
    this.specs = this.createSpecs();
    this.schema = this.createSchema();
    this.context = this.createContext();
    this.keymaps = this.createKeymaps();
    this.view = this.createView();
    this.commands = this.createCommands();
    this.specs.setContext({ ...this.context, view: this.view });
  }

  createContext() {
    return {
      toastMark: this.toastMark,
      schema: this.schema,
      eventEmitter: this.eventEmitter
    };
  }

  createKeymaps() {
    return this.specs.keymaps();
  }

  createSpecs() {
    return new SpecManager([
      new Doc(),
      new Paragraph(),
      new Text(),
      new Heading(),
      new BlockQuote(),
      new CodeBlock(),
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
      new Html()
    ]);
  }

  createSchema() {
    return new Schema({
      nodes: this.specs.nodes,
      marks: this.specs.marks
    });
  }

  createState() {
    const { undo, redo } = getDefaultCommands();

    return EditorState.create({
      doc: DOMParser.fromSchema(this.schema).parse(this.el),
      plugins: [
        ...this.keymaps,
        keymap({
          'Mod-z': undo(),
          'Shift-Mod-z': redo(),
          ...baseKeymap
        }),
        history(),
        syntaxHighlight(this.context),
        previewHighlight(this.context),
        placeholder(this.placeholder)
      ]
    });
  }

  createView() {
    return new EditorView(this.el, {
      state: this.createState(),
      dispatchTransaction: tr => {
        this.updateMarkdown(tr);

        const { state } = this.view.state.applyTransaction(tr);

        this.view.updateState(state);
      },
      clipboardTextParser: text => {
        const lineTexts = decodeURL(text).split('\n');
        const nodes = lineTexts.map(lineText => createParagraph(this.schema, lineText));

        return new Slice(Fragment.from(nodes), 1, 1);
      },
      clipboardTextSerializer: slice => this.getChanged(slice)
    });
  }

  createCommands() {
    return this.specs.commands(this.view);
  }

  private updateMarkdown(tr: Transaction) {
    if (tr.docChanged) {
      tr.steps.forEach((step, index) => {
        if (step.slice) {
          const doc = tr.docs[index];
          const [from, to] = this.getResolvedRange(tr, step);
          const changed = this.getChanged(step.slice);
          const [startPos, endPos] = getEditorToMdPos(doc, from, to);
          const editResult = this.toastMark.editMarkdown(startPos, endPos, changed);

          this.eventEmitter.emit('contentChangedFromMarkdown', editResult);

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

    return nbspToSpace(changed);
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
    const nodes = lineTexts.map(lineText => createParagraph(schema, lineText));

    this.view.dispatch(tr.replaceSelection(new Slice(Fragment.from(nodes), 1, 1)));
    this.focus();
  }

  getRange() {
    const { from, to } = this.view.state.selection;

    return getEditorToMdPos(this.view.state.tr.doc, from, to);
  }

  setMarkdown(markdown: string, cursorToEnd = true) {
    const contents = markdown.split('\n');
    const { tr, doc } = this.view.state;
    const newNodes = contents.map(content => createParagraph(this.schema, content));

    this.view.dispatch(tr.replaceWith(0, doc.content.size, newNodes));

    if (cursorToEnd) {
      this.moveCursorToEnd();
    }
  }

  getMarkdown() {
    return this.toastMark.getLineTexts().join('\n');
  }

  getToastMark() {
    return this.toastMark;
  }
}

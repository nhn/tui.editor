import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { DOMParser } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import css from 'tui-code-snippet/domUtil/css';
import { schema } from './schema';
import { markNode } from './plugins/mark';
import { highlightPreview } from './plugins/highlight';
import KeyMapper from '../keyMapper';

export default class MdEditor {
  constructor(el, toastMark, eventManager) {
    this.el = el;
    this.toastMark = toastMark;
    this.eventManager = eventManager;
    this.state = this.createState();

    const view = new EditorView(el, {
      state: this.state,
      dispatchTransaction: tr => {
        this._updateMarkdown(tr);

        const { state } = this.view.state.applyTransaction(tr);

        this.view.updateState(state);
      },
      handleKeyDown: (_, event) => {
        this.keyCode = event.keyCode;
      }
    });

    this.view = view;
  }

  createState() {
    return EditorState.create({
      doc: DOMParser.fromSchema(schema).parse(this.el),
      plugins: [
        keymap(baseKeymap),
        markNode(this.toastMark),
        highlightPreview(this.eventManager, this.toastMark)
      ]
    });
  }

  _updateMarkdown(tr) {
    const { state } = this.view;

    if (tr.docChanged) {
      const [step] = tr.steps;
      const { from, to, slice } = step;
      let changed = slice.content.textBetween(0, slice.content.size, '\n');

      if (KeyMapper.keyCode('ENTER') === this.keyCode) {
        changed = '\n';
      }
      if (changed === '\u00a0') {
        changed = ' ';
      }

      const startLine = state.doc.content.findIndex(from).index + 1;
      const endLine = from === to ? startLine : state.doc.content.findIndex(to - 1).index + 1;

      const startChOffset = state.doc.resolve(from).start();
      const endChOffset = from === to ? startChOffset : state.doc.resolve(to).start();

      const startPos = [startLine, from - startChOffset + 1];
      const endPos = [endLine, to - endChOffset + 1];

      const editResult = this.toastMark.editMarkdown(startPos, endPos, changed);

      this.eventManager.emit('contentChangedFromMarkdown', editResult);

      tr.setMeta('editResult', editResult);
    }
  }

  /**
   * Set Editor height
   * @param {number} height - Editor height
   */
  setHeight(height) {
    css(this.el, { height: `${height}px` });
  }

  /**
   * set min height
   * @param {number} minHeight - min height
   */
  setMinHeight(minHeight) {
    css(this.el, { minHeight: `${minHeight}px` });
  }

  /**
   * Set Editor value
   * @param {string} markdown - Markdown syntax text
   * @param {boolean} [cursorToEnd=true] - move cursor to contents end
   * @override
   */
  setValue() {
    // @TODO: write the code
  }
}

import { EditorView, NodeView } from 'prosemirror-view';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { StepMap } from 'prosemirror-transform';
import { EditorState, TextSelection, Transaction } from 'prosemirror-state';
import { newlineInCode } from 'prosemirror-commands';
import { redo, undo, undoDepth, history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import isFunction from 'tui-code-snippet/type/isFunction';
import { ToDOMAdaptor } from '@t/convertor';

type GetPos = (() => number) | boolean;

export class CustomBlockView implements NodeView {
  dom: HTMLElement;

  private node: ProsemirrorNode;

  private toDOMAdaptor: ToDOMAdaptor;

  private outerView: EditorView;

  private innerView: EditorView | null;

  private wrapper: HTMLElement;

  private innerViewContainer!: HTMLElement;

  private getPos: GetPos;

  private isCanceled: boolean;

  constructor(node: ProsemirrorNode, view: EditorView, getPos: GetPos, toDOMAdaptor: ToDOMAdaptor) {
    this.node = node;
    this.outerView = view;
    this.getPos = getPos;
    this.toDOMAdaptor = toDOMAdaptor;
    this.innerView = null;
    this.isCanceled = false;

    this.dom = document.createElement('div');
    this.wrapper = document.createElement('div');

    this.createInnerViewContainer();
    this.renderCustomBlock();

    this.dom.appendChild(this.innerViewContainer);
    this.dom.appendChild(this.wrapper);
    this.dom.addEventListener('dblclick', this.openEditor);
  }

  private renderCustomBlock() {
    const toDOMNode = this.toDOMAdaptor.getToDOMNode(this.node.attrs.info);

    if (toDOMNode) {
      const node = toDOMNode(this.node);

      while (this.wrapper.hasChildNodes()) {
        this.wrapper.removeChild(this.wrapper.lastChild!);
      }

      if (node) {
        this.wrapper.appendChild(node);
      }
    }
  }

  private createInnerViewContainer() {
    this.innerViewContainer = document.createElement('div');
    // @TODO: apply design
    this.innerViewContainer.style.display = 'none';
    this.innerViewContainer.style.background = '#f5f7f8';
  }

  private openEditor = () => {
    if (this.innerView) {
      throw new Error('The editor is already opened.');
    }

    this.wrapper.style.display = 'none';
    this.innerViewContainer.style.display = 'block';

    this.innerView = new EditorView(this.innerViewContainer, {
      state: EditorState.create({
        doc: this.node,
        plugins: [
          keymap({
            'Mod-z': () => undo(this.outerView.state, this.outerView.dispatch),
            'Shift-Mod-z': () => redo(this.outerView.state, this.outerView.dispatch),
            Tab: (state, dispatch) => {
              dispatch!(state.tr.insertText('\t'));
              return true;
            },
            Enter: newlineInCode,
            Escape: () => {
              this.cancelEditing();
              return true;
            },
            'Ctrl-Enter': () => {
              this.saveAndFinishEditing();
              return true;
            }
          }),
          history()
        ]
      }),
      dispatchTransaction: (tr: Transaction) => this.dispatchInner(tr),
      handleDOMEvents: {
        mousedown: () => {
          if (this.outerView.hasFocus()) {
            this.innerView!.focus();
          }
          return true;
        }
      }
    });
    this.innerView!.focus();
  };

  private closeEditor() {
    if (this.innerView) {
      this.innerView.destroy();
      this.innerView = null;
      this.innerViewContainer.style.display = 'none';
    }
    this.wrapper.style.display = 'block';
  }

  private saveAndFinishEditing() {
    const { to } = this.outerView.state.selection;
    const outerState: EditorState = this.outerView.state;

    this.outerView.dispatch(outerState.tr.setSelection(TextSelection.create(outerState.doc, to)));
    this.outerView.focus();

    this.renderCustomBlock();
    this.closeEditor();
  }

  private cancelEditing() {
    let undoableCount = undoDepth(this.innerView!.state);

    this.isCanceled = true;

    // should undo editing result
    // eslint-disable-next-line no-plusplus
    while (undoableCount--) {
      undo(this.innerView!.state, this.innerView!.dispatch);
      undo(this.outerView!.state, this.outerView!.dispatch);
    }
    this.isCanceled = false;

    const { to } = this.outerView.state.selection;
    const outerState: EditorState = this.outerView.state;

    this.outerView.dispatch(outerState.tr.setSelection(TextSelection.create(outerState.doc, to)));
    this.outerView.focus();

    this.closeEditor();
  }

  private dispatchInner(tr: Transaction) {
    const { state, transactions } = this.innerView!.state.applyTransaction(tr);

    this.innerView!.updateState(state);

    if (!tr.getMeta('fromOutside') && !this.isCanceled && isFunction(this.getPos)) {
      const outerTr = this.outerView.state.tr;
      const offsetMap = StepMap.offset(this.getPos() + 1);

      for (let i = 0; i < transactions.length; i += 1) {
        const { steps } = transactions[i];

        for (let j = 0; j < steps.length; j += 1) {
          outerTr.step(steps[j].map(offsetMap)!);
        }
      }
      if (outerTr.docChanged) {
        this.outerView.dispatch(outerTr);
      }
    }
  }

  update(node: ProsemirrorNode) {
    if (!node.sameMarkup(this.node)) {
      return false;
    }

    this.node = node;

    if (!this.innerView) {
      this.renderCustomBlock();
    }

    return true;
  }

  stopEvent(event: Event): boolean {
    return !!this.innerView && !!event.target && this.innerView.dom.contains(event.target as Node);
  }

  ignoreMutation() {
    return true;
  }

  destroy() {
    this.dom.removeEventListener('dblclick', this.openEditor);
    this.closeEditor();
  }
}

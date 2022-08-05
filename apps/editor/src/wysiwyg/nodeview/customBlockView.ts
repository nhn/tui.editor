import { EditorView, NodeView } from 'prosemirror-view';
import { ProsemirrorNode } from 'prosemirror-model';
import { StepMap } from 'prosemirror-transform';
import { EditorState, TextSelection, Transaction } from 'prosemirror-state';
import { newlineInCode } from 'prosemirror-commands';
import { redo, undo, undoDepth, history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import isFunction from 'tui-code-snippet/type/isFunction';
import { ToDOMAdaptor } from '@t/convertor';
import { createTextSelection } from '@/helper/manipulation';
import { cls } from '@/utils/dom';

type GetPos = (() => number) | boolean;

export class CustomBlockView implements NodeView {
  dom: HTMLElement;

  private node: ProsemirrorNode;

  private toDOMAdaptor: ToDOMAdaptor;

  private editorView: EditorView;

  private innerEditorView: EditorView | null;

  private wrapper: HTMLElement;

  private innerViewContainer!: HTMLElement;

  private getPos: GetPos;

  private canceled: boolean;

  constructor(node: ProsemirrorNode, view: EditorView, getPos: GetPos, toDOMAdaptor: ToDOMAdaptor) {
    this.node = node;
    this.editorView = view;
    this.getPos = getPos;
    this.toDOMAdaptor = toDOMAdaptor;
    this.innerEditorView = null;
    this.canceled = false;

    this.dom = document.createElement('div');
    this.dom.className = cls('custom-block');
    this.wrapper = document.createElement('div');
    this.wrapper.className = cls('custom-block-view');

    this.createInnerViewContainer();
    this.renderCustomBlock();

    this.dom.appendChild(this.innerViewContainer);
    this.dom.appendChild(this.wrapper);
  }

  private renderToolArea() {
    const tool = document.createElement('div');
    const span = document.createElement('span');
    const button = document.createElement('button');

    tool.className = 'tool';
    span.textContent = this.node.attrs.info;
    span.className = 'info';
    button.type = 'button';
    button.addEventListener('click', () => this.openEditor());

    tool.appendChild(span);
    tool.appendChild(button);
    this.wrapper.appendChild(tool);
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
      this.renderToolArea();
    }
  }

  private createInnerViewContainer() {
    this.innerViewContainer = document.createElement('div');
    this.innerViewContainer.className = cls('custom-block-editor');
    this.innerViewContainer.style.display = 'none';
  }

  private openEditor = () => {
    if (this.innerEditorView) {
      throw new Error('The editor is already opened.');
    }

    this.dom.draggable = false;
    this.wrapper.style.display = 'none';
    this.innerViewContainer.style.display = 'block';

    this.innerEditorView = new EditorView(this.innerViewContainer, {
      state: EditorState.create({
        doc: this.node,
        plugins: [
          keymap({
            'Mod-z': () => undo(this.innerEditorView!.state, this.innerEditorView!.dispatch),
            'Shift-Mod-z': () => redo(this.innerEditorView!.state, this.innerEditorView!.dispatch),
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
            },
          }),
          history(),
        ],
      }),
      dispatchTransaction: (tr: Transaction) => this.dispatchInner(tr),
      handleDOMEvents: {
        mousedown: () => {
          if (this.editorView.hasFocus()) {
            this.innerEditorView!.focus();
          }
          return true;
        },
        blur: () => {
          this.saveAndFinishEditing();
          return true;
        },
      },
    });
    this.innerEditorView!.focus();
  };

  private closeEditor() {
    if (this.innerEditorView) {
      this.innerEditorView.destroy();
      this.innerEditorView = null;
      this.innerViewContainer.style.display = 'none';
    }
    this.wrapper.style.display = 'block';
  }

  private saveAndFinishEditing() {
    const { to } = this.editorView.state.selection;
    const outerState: EditorState = this.editorView.state;

    this.editorView.dispatch(outerState.tr.setSelection(createTextSelection(outerState.tr, to)));
    this.editorView.focus();

    this.renderCustomBlock();
    this.closeEditor();
  }

  private cancelEditing() {
    let undoableCount = undoDepth(this.innerEditorView!.state);

    this.canceled = true;

    // should undo editing result
    // eslint-disable-next-line no-plusplus
    while (undoableCount--) {
      undo(this.innerEditorView!.state, this.innerEditorView!.dispatch);
      undo(this.editorView.state, this.editorView.dispatch);
    }
    this.canceled = false;

    const { to } = this.editorView.state.selection;
    const outerState: EditorState = this.editorView.state;

    this.editorView.dispatch(outerState.tr.setSelection(TextSelection.create(outerState.doc, to)));
    this.editorView.focus();

    this.closeEditor();
  }

  private dispatchInner(tr: Transaction) {
    const { state, transactions } = this.innerEditorView!.state.applyTransaction(tr);

    this.innerEditorView!.updateState(state);

    if (!this.canceled && isFunction(this.getPos)) {
      const outerTr = this.editorView.state.tr;
      const offsetMap = StepMap.offset(this.getPos() + 1);

      for (let i = 0; i < transactions.length; i += 1) {
        const { steps } = transactions[i];

        for (let j = 0; j < steps.length; j += 1) {
          outerTr.step(steps[j].map(offsetMap)!);
        }
      }
      if (outerTr.docChanged) {
        this.editorView.dispatch(outerTr);
      }
    }
  }

  update(node: ProsemirrorNode) {
    if (!node.sameMarkup(this.node)) {
      return false;
    }

    this.node = node;

    if (!this.innerEditorView) {
      this.renderCustomBlock();
    }

    return true;
  }

  stopEvent(event: Event): boolean {
    return (
      !!this.innerEditorView &&
      !!event.target &&
      this.innerEditorView.dom.contains(event.target as Node)
    );
  }

  ignoreMutation() {
    return true;
  }

  destroy() {
    this.dom.removeEventListener('dblclick', this.openEditor);
    this.closeEditor();
  }
}

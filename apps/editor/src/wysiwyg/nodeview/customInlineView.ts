import { EditorView, NodeView } from 'prosemirror-view';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { ToDOMAdaptor } from '@t/convertor';
import { cls } from '@/utils/dom';

export class CustomInlineView implements NodeView {
  dom: HTMLElement;

  private node: ProsemirrorNode;

  private toDOMAdaptor: ToDOMAdaptor;

  constructor(node: ProsemirrorNode, view: EditorView, toDOMAdaptor: ToDOMAdaptor) {
    this.node = node;
    this.toDOMAdaptor = toDOMAdaptor;

    this.dom = document.createElement('span');
    this.dom.className = cls('custom-inline');

    this.renderCustomInline();
  }

  private renderCustomInline() {
    const toDOMNode = this.toDOMAdaptor.getToDOMNode('customInline');

    if (toDOMNode) {
      const node = toDOMNode(this.node);

      while (this.dom.hasChildNodes()) {
        this.dom.removeChild(this.dom.lastChild!);
      }

      if (node) {
        this.dom.appendChild(node);
      }
    }
  }

  update(node: ProsemirrorNode) {
    if (!node.sameMarkup(this.node)) {
      return false;
    }

    this.node = node;
    this.renderCustomInline();

    return true;
  }
}

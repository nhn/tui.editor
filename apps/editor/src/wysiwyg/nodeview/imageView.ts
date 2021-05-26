import { EditorView, NodeView } from 'prosemirror-view';
import { Node as ProsemirrorNode, Mark } from 'prosemirror-model';

import hasClass from 'tui-code-snippet/domUtil/hasClass';
import isFunction from 'tui-code-snippet/type/isFunction';

import { isPositionInBox, setAttributes } from '@/utils/dom';
import { createTextSelection } from '@/helper/manipulation';
import { getCustomAttrs } from '@/wysiwyg/helper/node';

import { Emitter } from '@t/event';

type GetPos = (() => number) | boolean;

const IMAGE_LINK_CLASS_NAME = 'image-link';

export class ImageView implements NodeView {
  dom: HTMLElement;

  private node: ProsemirrorNode;

  private view: EditorView;

  private getPos: GetPos;

  private eventEmitter: Emitter;

  private imageLink: Mark | null;

  constructor(node: ProsemirrorNode, view: EditorView, getPos: GetPos, eventEmitter: Emitter) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.eventEmitter = eventEmitter;
    this.imageLink = node.marks.filter(({ type }) => type.name === 'link')[0] ?? null;
    this.dom = this.createElement();

    this.bindEvent();
  }

  private createElement() {
    const image = this.createImageElement(this.node);

    if (this.imageLink) {
      const wrapper = document.createElement('span');

      wrapper.className = IMAGE_LINK_CLASS_NAME;
      wrapper.appendChild(image);

      return wrapper;
    }

    return image;
  }

  private createImageElement(node: ProsemirrorNode) {
    const image = document.createElement('img');
    const { imageUrl, altText } = node.attrs;
    const attrs = getCustomAttrs(node.attrs);

    image.src = imageUrl;

    if (altText) {
      image.alt = altText;
    }
    setAttributes(attrs, image);

    return image;
  }

  private bindEvent() {
    if (this.imageLink) {
      this.dom.addEventListener('mousedown', this.handleMousedown);
    }
  }

  private handleMousedown = (ev: MouseEvent) => {
    ev.preventDefault();

    const { target, offsetX, offsetY } = ev;

    if (
      this.imageLink &&
      isFunction(this.getPos) &&
      hasClass(target as HTMLElement, IMAGE_LINK_CLASS_NAME)
    ) {
      const style = getComputedStyle(target as HTMLElement, ':before');

      ev.stopPropagation();

      if (isPositionInBox(style, offsetX, offsetY)) {
        const { tr } = this.view.state;
        const pos = this.getPos();

        tr.setSelection(createTextSelection(tr, pos, pos + 1));
        this.view.dispatch(tr);
        this.eventEmitter.emit('openPopup', 'link', this.imageLink.attrs);
      }
    }
  };

  stopEvent() {
    return true;
  }

  destroy() {
    if (this.imageLink) {
      this.dom.removeEventListener('mousedown', this.handleMousedown);
    }
  }
}

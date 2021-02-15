import { NodeView } from 'prosemirror-view';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import hasClass from 'tui-code-snippet/domUtil/hasClass';

import { isPositionInBox } from '@/utils/dom';

import { ToDOMAdaptor } from '@t/convertor';

const IMAGE_LINK_CLASS_NAME = 'image-link';

function hasLink(node: ProsemirrorNode) {
  return !!node.marks.find(({ type }) => type.name === 'link');
}

export class ImageView implements NodeView {
  dom: HTMLElement;

  private toDOMAdaptor: ToDOMAdaptor;

  private hasLink: boolean;

  constructor(node: ProsemirrorNode, toDOMAdaptor: ToDOMAdaptor) {
    this.toDOMAdaptor = toDOMAdaptor;
    this.hasLink = hasLink(node);
    this.dom = this.createElement(node);

    this.bindEvent();
  }

  private createElement(node: ProsemirrorNode) {
    const image = this.createImageElement(node);

    if (this.hasLink) {
      const wrapper = document.createElement('span');

      wrapper.className = IMAGE_LINK_CLASS_NAME;
      wrapper.appendChild(image);

      return wrapper;
    }

    return image;
  }

  private createImageElement(node: ProsemirrorNode) {
    const toDOMNode = this.toDOMAdaptor.getToDOMNode('image');

    if (toDOMNode) {
      return toDOMNode(node) as HTMLElement;
    }

    const image = document.createElement('img');
    const { imageUrl, altText } = node.attrs;

    image.src = imageUrl;

    if (altText) {
      image.alt = altText;
    }

    return image;
  }

  private bindEvent() {
    if (this.hasLink) {
      this.dom.addEventListener('mousedown', this.handleMousedown);
    }
  }

  private handleMousedown(ev: MouseEvent) {
    ev.preventDefault();

    const { target, offsetX, offsetY } = ev;

    if (hasClass(target as HTMLElement, IMAGE_LINK_CLASS_NAME)) {
      const style = getComputedStyle(target as HTMLElement, ':before');

      if (isPositionInBox(style, offsetX, offsetY)) {
        // @TODO add logic to open link popup layer
        console.log('open popup');
      }
    }
  }

  stopEvent() {
    return true;
  }

  destroy() {
    if (this.hasLink) {
      this.dom.removeEventListener('mousedown', this.handleMousedown);
    }
  }
}

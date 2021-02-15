import { NodeView } from 'prosemirror-view';
import { Node as ProsemirrorNode, Mark } from 'prosemirror-model';
import hasClass from 'tui-code-snippet/domUtil/hasClass';

import { isPositionInBox } from '@/utils/dom';

import { ToDOMAdaptor } from '@t/convertor';
import { Emitter } from '@t/event';

const IMAGE_LINK_CLASS_NAME = 'image-link';

export class ImageView implements NodeView {
  dom: HTMLElement;

  private node: ProsemirrorNode;

  private toDOMAdaptor: ToDOMAdaptor;

  private eventEmitter: Emitter;

  private imageLink: Mark | null;

  constructor(node: ProsemirrorNode, toDOMAdaptor: ToDOMAdaptor, eventEmitter: Emitter) {
    this.node = node;
    this.toDOMAdaptor = toDOMAdaptor;
    this.eventEmitter = eventEmitter;
    this.imageLink = this.findLink();
    this.dom = this.createElement();

    this.bindEvent();
  }

  private findLink() {
    return this.node.marks.find(({ type }) => type.name === 'link') || null;
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
    if (this.imageLink) {
      this.dom.addEventListener('mousedown', this.handleMousedown);
    }
  }

  private handleMousedown = (ev: MouseEvent) => {
    ev.preventDefault();

    const { target, offsetX, offsetY } = ev;

    if (this.imageLink && hasClass(target as HTMLElement, IMAGE_LINK_CLASS_NAME)) {
      const style = getComputedStyle(target as HTMLElement, ':before');

      ev.stopPropagation();

      if (isPositionInBox(style, offsetX, offsetY)) {
        const { linkUrl, linkText } = this.imageLink.attrs;

        this.eventEmitter.emit('openPopup', 'link', {
          linkUrl,
          linkText,
        });
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

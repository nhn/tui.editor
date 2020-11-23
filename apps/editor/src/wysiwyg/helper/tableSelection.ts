import { EditorView } from 'prosemirror-view';

interface EventHandlers {
  move: (ev: Event) => void;
  stop: () => void;
}

function isInCellElement(node: HTMLElement, root: Element) {
  while (node && node !== root) {
    if (node.nodeName === 'TD' || node.nodeName === 'TH') {
      return true;
    }

    node = node.parentNode as HTMLElement;
  }

  return false;
}

class MouseSelection {
  private view: EditorView;

  private handlers: EventHandlers;

  constructor(view: EditorView) {
    this.view = view;

    this.handlers = {
      move: this.move.bind(this),
      stop: this.stop.bind(this)
    };

    this.bindEvent();
  }

  bindEvent() {
    const { root } = this.view;

    root.addEventListener('mousemove', this.handlers.move);
    root.addEventListener('mouseup', this.handlers.stop);
  }

  unbindEvent() {
    const { root } = this.view;

    root.removeEventListener('mousemove', this.handlers.move);
    root.removeEventListener('mouseup', this.handlers.stop);
  }

  stop() {
    this.unbindEvent();
  }

  move(ev: Event) {
    const { selection } = this.view.state;
    const { $anchor } = selection;
    const { target } = ev;

    if (isInCellElement(target as HTMLElement, this.view.dom)) {
      console.log('in cell');
    }

    if ($anchor) {
      console.log($anchor, 'start selection');
    }
  }
}

export function handleMouseDown(view: EditorView) {
  const instance = new MouseSelection(view);

  return true;
}

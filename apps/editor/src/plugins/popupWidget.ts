import { EditorView } from 'prosemirror-view';
import { Plugin, PluginKey } from 'prosemirror-state';
import css from 'tui-code-snippet/domUtil/css';
import { WidgetStyle } from '@t/editor';
import { Emitter } from '@t/event';

interface Widget {
  node: HTMLElement;
  style: WidgetStyle;
  pos: number;
}

const pluginKey = new PluginKey('widget');

class PopupWidget {
  private popup: HTMLElement | null = null;

  private eventEmitter: Emitter;

  constructor(eventEmitter: Emitter) {
    this.eventEmitter = eventEmitter;
    this.eventEmitter.listen('blur', this.removeWidget);
  }

  private removeWidget = () => {
    if (this.popup) {
      document.body.removeChild(this.popup);
      this.popup = null;
    }
  };

  update(view: EditorView) {
    const widget: Widget | null = pluginKey.getState(view.state);

    this.removeWidget();

    if (widget) {
      const { node, style } = widget;
      const { top, left, bottom } = view.coordsAtPos(widget.pos);
      const height = bottom - top;

      css(node, { position: 'absolute', left: `${left}px`, opacity: '0' });
      document.body.appendChild(node);
      css(node, {
        top: `${style === 'bottom' ? top + height : top - node.clientHeight - height}px`,
        opacity: '1',
      });
      this.popup = node;
      view.focus();
    }
  }

  destroy() {
    this.eventEmitter.removeEventHandler('blur', this.removeWidget);
  }
}

export function addWidget(eventEmitter: Emitter) {
  return new Plugin({
    key: pluginKey,
    state: {
      init() {
        return null;
      },
      apply(tr) {
        return tr.getMeta('widget');
      },
    },
    view() {
      return new PopupWidget(eventEmitter);
    },
  });
}

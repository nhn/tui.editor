import { EditorView } from 'prosemirror-view';
import { Plugin, PluginKey } from 'prosemirror-state';
import { WidgetStyle } from '@t/editor';

interface Widget {
  node: HTMLElement;
  style: WidgetStyle;
  pos: number;
}

const pluginKey = new PluginKey('widget');

class WidgetView {
  private widgetNode: HTMLElement | null = null;

  update(view: EditorView) {
    const widget: Widget | null = pluginKey.getState(view.state);

    if (this.widgetNode) {
      document.body.removeChild(this.widgetNode);
      this.widgetNode = null;
    }

    if (widget) {
      const { node, style } = widget;
      const { top, left, bottom } = view.coordsAtPos(widget.pos);
      const height = bottom - top;

      node.style.position = 'absolute';
      node.style.left = `${left}px`;
      node.style.opacity = '0';

      document.body.appendChild(node);

      node.style.top = `${style === 'bottom' ? top + height : top - node.clientHeight - height}px`;
      node.style.opacity = '1';
      this.widgetNode = node;
    }
    view.focus();
  }
}

export function widgetPlugin() {
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
      return new WidgetView();
    },
  });
}

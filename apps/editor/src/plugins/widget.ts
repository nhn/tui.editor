import { EditorView } from 'prosemirror-view';
import { Plugin, PluginKey } from 'prosemirror-state';

interface Widget {
  node: HTMLElement;
  pos: number;
}

const pluginKey = new PluginKey('suggestions');

class WidgetView {
  private widgetNode: HTMLElement | null = null;

  update(view: EditorView) {
    const { state } = view;
    const widget: Widget | null = pluginKey.getState(state);

    if (this.widgetNode) {
      document.body.removeChild(this.widgetNode);
      this.widgetNode = null;
    }

    if (widget) {
      const { node, style } = widget;
      const rect = view.coordsAtPos(widget.pos);
      const a = view.domAtPos(widget.pos);

      const { clientHeight } = a.node;

      this.widgetNode = node;
      node.style.position = 'absolute';
      node.style.left = `${rect.left}px`;

      if (style === 'bottom') {
        node.style.top = `${rect.top + clientHeight / 2}px`;
      }

      document.body.appendChild(node);
      if (style === 'top') {
        node.style.top = `${rect.top - node.clientHeight - clientHeight}px`;
      }
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
        const widget = tr.getMeta('widget');

        return widget ? widget : null;
      },
    },
    view() {
      return new WidgetView();
    },
  });
}

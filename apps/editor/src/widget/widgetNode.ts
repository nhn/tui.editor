import { DOMOutputSpec, ProsemirrorNode } from 'prosemirror-model';
import SpecNode from '@/spec/node';
import { widgetToDOM } from './rules';

export function widgetNodeView(pmNode: ProsemirrorNode) {
  const dom = document.createElement('span');
  const node = widgetToDOM(pmNode.attrs.info, pmNode.textContent);

  dom.className = 'tui-widget';
  dom.appendChild(node);

  return { dom };
}

export function isWidgetNode(pmNode: ProsemirrorNode) {
  return pmNode.type.name === 'widget';
}

export class Widget extends SpecNode {
  get name() {
    return 'widget';
  }

  get schema() {
    return {
      attrs: {
        info: { default: null },
      },
      group: 'inline',
      inline: true,
      content: 'text*',
      selectable: false,
      atom: true,
      toDOM(): DOMOutputSpec {
        return ['span', { class: 'tui-widget' }, 0];
      },
      parseDOM: [
        {
          tag: 'span.tui-widget',
          getAttrs(dom: Node | string) {
            const text = (dom as HTMLElement).textContent!;
            const [, info] = text.match(/\$\$(widget\d+)/)!;

            return { info };
          },
        },
      ],
    };
  }
}

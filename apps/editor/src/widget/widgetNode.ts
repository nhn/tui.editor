import { DOMOutputSpecArray, Schema, Node as ProsemirrorNode } from 'prosemirror-model';
import { WidgetRule, WidgetRuleMap } from '@t/editor';
import { CustomInlineMdNode } from '@t/markdown';
import SpecNode from '@/spec/Node';

export const widgetRuleMap: WidgetRuleMap = {};

export let widgetRules: WidgetRule[];

export function setWidgetRule(rules: WidgetRule[]) {
  widgetRules = rules;
  widgetRules.forEach((rule, index) => {
    widgetRuleMap[`widget${index}`] = rule;
  });
}

export function getWidgetMdContent(node: CustomInlineMdNode) {
  let event;
  let text = '';
  const walker = node.walker();

  while ((event = walker.next())) {
    if (event.entering) {
      if (event.node !== node && event.node.type !== 'text') {
        text += event.node.inlineToMark();
        walker.resumeAt(node, false);
        walker.next();
      } else if (event.node.type === 'text') {
        text += event.node.literal;
      }
    }
  }

  return text;
}

export function getWidgetContent(text: string) {
  return text.replace(/\$\$widget\d{1,}\s|\$\$/g, '');
}

export function extract(content: string, schema: Schema, rules: WidgetRule[]) {
  let nodes: ProsemirrorNode[] = [];

  if (rules.length) {
    rules.forEach((ruleInfo, ruleIndex) => {
      const { rule } = ruleInfo;
      const nextRules = rules.slice(ruleIndex + 1);

      if (rule.test(content)) {
        let index;

        while ((index = content.search(rule)) !== -1) {
          const prev = content.substring(0, index);

          if (prev) {
            nodes = nodes.concat(extract(prev, schema, nextRules));
          }

          content = content.substring(index);
          const [literal] = content.match(rule)!;
          const info = `widget${ruleIndex}`;

          nodes.push(schema.nodes.widget.create({ info }, schema.text(`$$${info} ${literal}$$`)));
          content = content.substring(literal.length);
        }
        if (content) {
          nodes = nodes.concat(extract(content, schema, nextRules));
        }
      } else if (content) {
        nodes = [schema.text(content)];
      }
    });
  } else if (content) {
    return [schema.text(content)];
  }

  return nodes;
}

export const widgetView = (pmNode: ProsemirrorNode) => {
  const dom = document.createElement('span');
  const content = pmNode.textContent;
  const { rule, toHTML } = widgetRuleMap[pmNode.attrs.info];
  const node = toHTML(content.match(rule)![0]);

  dom.className = 'tui-widget';
  dom.appendChild(node);

  return { dom };
};

export class Widget extends SpecNode {
  get name() {
    return 'widget';
  }

  get defaultSchema() {
    return {
      attrs: {
        info: { default: null },
      },
      group: 'inline',
      inline: true,
      content: 'text*',
      selectable: false,
      atom: true,
      toDOM(): DOMOutputSpecArray {
        return ['span', { class: 'tui-widget' }, 0];
      },
      parseDOM: [
        {
          tag: 'span.tui-widget',
          getAttrs(dom: Node | string) {
            const text = (dom as HTMLElement).textContent!;
            const [, info] = text.match(/\$\$(widget\d{1,})/)!;

            return { info };
          },
        },
      ],
    };
  }
}

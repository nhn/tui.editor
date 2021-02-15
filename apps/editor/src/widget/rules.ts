import { Schema, ProsemirrorNode } from 'prosemirror-model';
import { WidgetRule, WidgetRuleMap } from '@t/editor';
import { CustomInlineMdNode } from '@t/markdown';

let widgetRules: WidgetRule[];

const widgetRuleMap: WidgetRuleMap = {};

function trailingWidgetSyntax(text: string) {
  return text.replace(/\$\$widget\d{1,}\s|\$\$/g, '');
}

export function createWidgetContent(info: string, content: string) {
  return `$$${info} ${content}$$`;
}

export function widgetToDOM(info: string, content: string) {
  const { rule, toDOM } = widgetRuleMap[info];

  content = content.match(rule)![0];
  return toDOM(content);
}

export function setWidgetRules(rules: WidgetRule[]) {
  widgetRules = rules;
  widgetRules.forEach((rule, index) => {
    widgetRuleMap[`widget${index}`] = rule;
  });
}

export function createNodesWithWidget(content: string, schema: Schema, ruleIndex = 0) {
  let nodes: ProsemirrorNode[] = [];
  const { rule } = widgetRules[ruleIndex] || {};

  content = trailingWidgetSyntax(content);

  if (rule && rule.test(content)) {
    let index;
    const nextRuleIndex = ruleIndex + 1;

    while ((index = content.search(rule)) !== -1) {
      const prev = content.substring(0, index);

      // get widget node on first splitted node using next widget rule
      if (prev) {
        nodes = nodes.concat(createNodesWithWidget(prev, schema, nextRuleIndex));
      }

      // build widget node using current widget rule
      content = content.substring(index);

      const [literal] = content.match(rule)!;
      const info = `widget${ruleIndex}`;

      nodes.push(
        schema.nodes.widget.create({ info }, schema.text(createWidgetContent(info, literal)))
      );
      content = content.substring(literal.length);
    }
    // get widget node on last splitted node using next widget rule
    if (content) {
      nodes = nodes.concat(createNodesWithWidget(content, schema, nextRuleIndex));
    }
  } else if (content) {
    nodes = [schema.text(content)];
  }

  return nodes;
}

export function getWidgetContent(widgetNode: CustomInlineMdNode) {
  let event;
  let text = '';
  const walker = widgetNode.walker();

  while ((event = walker.next())) {
    const { node, entering } = event;

    if (entering) {
      if (node !== widgetNode && node.type !== 'text') {
        text += node.inlineToMark();
        walker.resumeAt(widgetNode, false);
        walker.next();
      } else if (node.type === 'text') {
        text += node.literal;
      }
    }
  }

  return text;
}

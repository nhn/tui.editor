import { Schema, ProsemirrorNode } from 'prosemirror-model';
import { WidgetRule, WidgetRuleMap } from '@t/editor';
import { CustomInlineMdNode } from '@t/markdown';

let widgetRules: WidgetRule[] = [];

const widgetRuleMap: WidgetRuleMap = {};

const reWidgetPrefix = /\$\$widget\d{1,}\s/;

function trailingWidgetSyntax(text: string) {
  const index = text.search(reWidgetPrefix);

  if (index !== -1) {
    const rest = text.substring(index);
    const replaced = rest.replace(reWidgetPrefix, '').replace('$$', '');

    text = text.substring(0, index);
    text += trailingWidgetSyntax(replaced);
  }
  return text;
}

export function createWidgetContent(info: string, content: string) {
  return `$$${info} ${content}$$`;
}

export function widgetToDOM(info: string, content: string) {
  const { rule, toDOM } = widgetRuleMap[info];

  content = trailingWidgetSyntax(content).match(rule)![0];
  return toDOM(content);
}

export function setWidgetRules(rules: WidgetRule[]) {
  widgetRules = rules;
  widgetRules.forEach((rule, index) => {
    widgetRuleMap[`widget${index}`] = rule;
  });
}

function mergeNodes(nodes: ProsemirrorNode[], content: string, schema: Schema, ruleIndex: number) {
  return nodes.concat(createNodesWithWidget(content, schema, ruleIndex));
}

export function createNodesWithWidget(content: string, schema: Schema, ruleIndex = 0) {
  let nodes: ProsemirrorNode[] = [];
  const { rule } = widgetRules[ruleIndex] || {};
  const nextRuleIndex = ruleIndex + 1;

  content = trailingWidgetSyntax(content);

  if (rule && rule.test(content)) {
    let index;

    while ((index = content.search(rule)) !== -1) {
      const prev = content.substring(0, index);

      // get widget node on first splitted node using next widget rule
      if (prev) {
        nodes = mergeNodes(nodes, prev, schema, nextRuleIndex);
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
      nodes = mergeNodes(nodes, content, schema, nextRuleIndex);
    }
  } else if (content) {
    nodes =
      ruleIndex < widgetRules.length - 1
        ? mergeNodes(nodes, content, schema, nextRuleIndex)
        : [schema.text(content)];
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
        // skip the children
        walker.resumeAt(widgetNode, false);
        walker.next();
      } else if (node.type === 'text') {
        text += node.literal;
      }
    }
  }

  return text;
}

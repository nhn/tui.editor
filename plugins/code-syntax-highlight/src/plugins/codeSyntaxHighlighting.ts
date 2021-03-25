import type { Node as ProsemirrorNode } from 'prosemirror-model';
import type { Decoration } from 'prosemirror-view';

import isString from 'tui-code-snippet/type/isString';

import { flatten } from '@/utils/common';

import type { PluginContext } from '@toast-ui/editor';
import { PrismJs } from '@t/index';

interface ChildNodeInfo {
  node: ProsemirrorNode;
  pos: number;
}

interface HighlightedNodeInfo {
  text: string;
  classes: string[];
}

const NODE_TYPE = 'codeBlock';

function findCodeBlocks(doc: ProsemirrorNode) {
  const descendants: ChildNodeInfo[] = [];

  doc.descendants((node, pos) => {
    if (node.isBlock && node.type.name === NODE_TYPE) {
      descendants.push({ node, pos });
    }
  });

  return descendants;
}

function parseTokens(
  tokens: (string | Prism.Token)[],
  classNames: string[] = []
): HighlightedNodeInfo[] {
  if (isString(tokens)) {
    return [{ text: tokens, classes: classNames }];
  }

  return tokens.map((token) => {
    const { type, alias } = token as Prism.Token;

    let typeClassNames: string[] = [];
    let aliasClassNames: string[] = [];

    if (type) {
      typeClassNames = ['token', type];
    }

    if (alias) {
      aliasClassNames = isString(alias) ? [alias] : alias;
    }

    const classes: string[] = [...classNames, ...typeClassNames, ...aliasClassNames];

    return isString(token)
      ? {
          text: token,
          classes,
        }
      : parseTokens(token.content as Prism.Token[], classes);
  }) as HighlightedNodeInfo[];
}

function getDecorations(doc: ProsemirrorNode, context: PluginContext, prism: PrismJs) {
  const { pmView } = context;
  const decorations: Decoration[] = [];
  const codeBlocks = findCodeBlocks(doc);

  codeBlocks.forEach(({ pos, node }) => {
    const { language } = node.attrs;
    const registeredLang = prism.languages[language];
    const prismTokens = registeredLang ? prism.tokenize(node.textContent, registeredLang) : [];
    const nodeInfos = flatten(parseTokens(prismTokens));

    let startPos = pos + 1;

    nodeInfos.forEach(({ text, classes }) => {
      const from = startPos;
      const to = from + text.length;

      startPos = to;

      const classNames = classes.join(' ');
      const decoration = pmView.Decoration.inline(from, to, {
        class: classNames,
      });

      if (classNames.length) {
        decorations.push(decoration);
      }
    });
  });

  return pmView.DecorationSet.create(doc, decorations);
}

export function codeSyntaxHighlighting(context: PluginContext, prism: PrismJs) {
  return new context.pmState.Plugin({
    state: {
      init(_, { doc }) {
        return getDecorations(doc, context, prism);
      },
      apply(tr, set) {
        if (!tr.docChanged) {
          return set.map(tr.mapping, tr.doc);
        }

        return getDecorations(tr.doc, context, prism);
      },
    },
    props: {
      decorations(state) {
        return this.getState(state);
      },
    },
  });
}

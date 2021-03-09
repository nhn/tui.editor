import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Node as ProsemirrorNode } from 'prosemirror-model';

interface ChildNodeInfo {
  node: ProsemirrorNode;
  pos: number;
}

function findCodeBlocks(doc: ProsemirrorNode) {
  const descendants: ChildNodeInfo[] = [];

  doc.descendants((child, pos) => {
    if (child.isBlock && child.type.name === 'codeBlock') {
      descendants.push({ node: child, pos });
    }
  });

  return descendants;
}

// @ts-ignore
function flatten<T>(arr: T[]) {
  return arr.reduce<T[]>((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
}

function parseNodes(nodes: any, className = []) {
  return nodes.map((node: any) => {
    const classes: any = [...className, ...(node.properties ? node.properties.className : [])];

    if (node.children) {
      return parseNodes(node.children, classes);
    }

    return {
      text: node.value,
      classes,
    };
  });
}

function getDecorations(doc: ProsemirrorNode, hljs: any, low: any) {
  const decorations: Decoration[] = [];
  const codeBlocks = findCodeBlocks(doc);

  codeBlocks.forEach(({ pos, node }) => {
    let startPos = pos + 1;

    const registeredLang = hljs.getLanguage(node.attrs.language);
    const nodes = registeredLang ? low.highlight(node.attrs.language, node.textContent).value : [];

    flatten(parseNodes(nodes))
      .map((nodeInfo: any) => {
        const from = startPos;
        const to = from + nodeInfo.text.length;

        startPos = to;

        return { ...nodeInfo, from, to };
      })
      .forEach(({ classes, from, to }: any) => {
        const classNames = classes.join(' ');
        const decoration = Decoration.inline(from, to, {
          class: classNames,
        });

        if (classNames.length) {
          decorations.push(decoration);
        }
      });
  });

  return DecorationSet.create(doc, decorations);
}

export function codeSyntaxHighlighting(hljs: any, low: any) {
  return new Plugin({
    state: {
      init(_, { doc }) {
        return getDecorations(doc, hljs, low);
      },
      apply(tr, set) {
        if (!tr.docChanged) {
          return set.map(tr.mapping, tr.doc);
        }

        return getDecorations(tr.doc, hljs, low);
      },
    },
    props: {
      decorations(state) {
        return this.getState(state);
      },
    },
  });
}

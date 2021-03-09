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

function getDecorations(doc: ProsemirrorNode, low: any) {
  const decorations: Decoration[] = [];
  const codeBlocks = findCodeBlocks(doc);

  codeBlocks.forEach(({ pos, node }) => {
    let startPos = pos + 1;
    const nodes = low.highlight(node.attrs.language, node.textContent).value;

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

  return decorations;
}

export function codeSyntaxHighlighting(low: any) {
  return new Plugin({
    state: {
      init(_, { doc }) {
        const content = getDecorations(doc, low);

        return DecorationSet.create(doc, content);
      },
      apply(tr, set) {
        if (!tr.docChanged) {
          return set.map(tr.mapping, tr.doc);
        }

        const content = getDecorations(tr.doc, low);

        return DecorationSet.create(tr.doc, content);
      },
    },
    props: {
      decorations(state) {
        return this.getState(state);
      },
    },
  });
}

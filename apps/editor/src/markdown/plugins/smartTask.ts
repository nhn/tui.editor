import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Context } from '@t/spec';
import { findClosestNode } from '@/utils/markdown';
import { getEditorToMdPos, getMdToEditorPos } from '../helper/pos';

const reTaskMarkerKey = /x|backspace/i;
const reTaskMarker = /^\[(\s*)(x?)(\s*)\](?:\s+)/i;

export function smartTask({ schema, toastMark }: Context) {
  return new Plugin({
    props: {
      handleDOMEvents: {
        keyup: (view: EditorView, ev: Event) => {
          const { doc, tr, selection } = view.state;
          const { from, to } = selection;

          if (from === to && reTaskMarkerKey.test((ev as KeyboardEvent).key)) {
            const [pos] = getEditorToMdPos(doc, from);
            const mdNode = toastMark.findNodeAtPosition([pos[0], pos[1]]);
            const paraNode = findClosestNode(
              mdNode,
              (node) => node!.type === 'paragraph' && node.parent?.type === 'item'
            );

            if (paraNode && paraNode.firstChild) {
              const { firstChild } = paraNode;
              const [mdPos] = firstChild.sourcepos!;
              const matched = firstChild.literal!.match(reTaskMarker);

              if (matched) {
                const [, startSpaces, stateChar, lastSpaces] = matched;
                const spaces = startSpaces.length + lastSpaces.length;
                const startPos = getMdToEditorPos(doc, toastMark, mdPos, mdPos)[0] + 1;

                if (stateChar) {
                  const addedPos = spaces ? spaces + 1 : 0;

                  tr.replaceRangeWith(startPos, addedPos + startPos, schema.text(stateChar));
                  view.dispatch(tr);
                } else if (!spaces) {
                  tr.insertText(' ', startPos);
                  view.dispatch(tr);
                }
              }
            }
          }
          return false;
        },
      },
    },
  });
}

import { Plugin } from 'prosemirror-state';

export function highlightPreview(eventManager, toastMark) {
  return new Plugin({
    view() {
      return {
        update(view, prevState) {
          const { state } = view;
          const { doc, selection } = state;

          if (prevState && prevState.doc.eq(doc) && prevState.selection.eq(selection)) {
            return;
          }
          const { from } = selection;
          const startChOffset = state.doc.resolve(from).start();
          const line = state.doc.content.findIndex(from).index + 1;
          let ch = from - startChOffset;

          if (from === startChOffset) {
            ch += 1;
          }
          const cursorPos = [line, ch];
          const mdNode = toastMark.findNodeAtPosition(cursorPos);

          eventManager.emit('cursorActivity', {
            source: 'markdown',
            cursorPos,
            markdownNode: mdNode
          });
        }
      };
    }
  });
}

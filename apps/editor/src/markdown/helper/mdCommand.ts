import { EditorCommand } from '@t/spec';
import { createTextSelection } from './manipulation';
import { resolveSelectionPos } from './pos';

export function createMarkCommand(regExp: RegExp, syntax: string): EditorCommand {
  return () => (state, dispatch) => {
    const syntaxLen = syntax.length;
    const [from, to] = resolveSelectionPos(state.selection);
    let [prevPos, nextPos] = [from, to];

    const { empty } = state.selection;
    const slice = state.selection.content();
    let textContent = slice.content.textBetween(0, slice.content.size, '\n');
    let { tr } = state;

    if (empty) {
      [prevPos, nextPos] = [
        Math.max(from - syntaxLen, 1),
        Math.min(from + syntaxLen, tr.doc.content.size - 1)
      ];
      const prevText = tr.doc.textBetween(prevPos, from, '\n');
      const nextText = tr.doc.textBetween(from, nextPos, '\n');

      textContent = `${prevText}${textContent}${nextText}`;
    }

    if (regExp.test(textContent)) {
      tr = tr.delete(nextPos - syntaxLen, nextPos).delete(prevPos, prevPos + syntaxLen);
    } else {
      tr = tr.insertText(syntax, to).insertText(syntax, from);
      const selection = empty
        ? createTextSelection(tr, from + syntaxLen)
        : createTextSelection(tr, from, to + syntaxLen * 2);

      tr = tr.setSelection(selection);
    }
    dispatch!(tr);

    return true;
  };
}

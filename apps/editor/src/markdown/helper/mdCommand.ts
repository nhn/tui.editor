import isFunction from 'tui-code-snippet/type/isFunction';
import { EditorCommand } from '@t/spec';
import { createTextSelection } from './manipulation';
import { resolveSelectionPos } from './pos';

type ConditionFn = (text: string) => boolean;

export function toggleMark(condition: RegExp | ConditionFn, syntax: string): EditorCommand {
  return () => ({ tr, selection }, dispatch) => {
    const conditionFn: ConditionFn = !isFunction(condition)
      ? (text: string) => condition.test(text)
      : condition;
    const syntaxLen = syntax.length;
    const [from, to] = resolveSelectionPos(selection);
    const [prevPos, nextPos] = [
      Math.max(from - syntaxLen, 1),
      Math.min(to + syntaxLen, tr.doc.content.size - 1)
    ];
    const slice = selection.content();

    let textContent = slice.content.textBetween(0, slice.content.size, '\n');
    const prevText = tr.doc.textBetween(prevPos, from, '\n');
    const nextText = tr.doc.textBetween(to, nextPos, '\n');

    textContent = `${prevText}${textContent}${nextText}`;

    console.log(textContent);

    if (prevText && nextText && conditionFn(textContent)) {
      tr = tr.delete(nextPos - syntaxLen, nextPos).delete(prevPos, prevPos + syntaxLen);
    } else {
      tr = tr.insertText(syntax, to).insertText(syntax, from);
      const newSelection = selection.empty
        ? createTextSelection(tr, from + syntaxLen)
        : createTextSelection(tr, from + syntaxLen, to + syntaxLen);

      tr = tr.setSelection(newSelection);
    }
    dispatch!(tr);

    return true;
  };
}

import isFunction from 'tui-code-snippet/type/isFunction';
import { EditorCommand } from '@t/spec';
import { createTextSelection } from '@/helper/manipulation';
import { resolveSelectionPos } from './pos';

type ConditionFn = (text: string) => boolean;
type Condition = RegExp | ConditionFn;

export function toggleMark(condition: Condition, syntax: string): EditorCommand {
  return () => ({ tr, selection }, dispatch) => {
    const conditionFn: ConditionFn = !isFunction(condition)
      ? (text) => condition.test(text)
      : condition;
    const syntaxLen = syntax.length;
    const { doc } = tr;

    const [from, to] = resolveSelectionPos(selection);
    const prevPos = Math.max(from - syntaxLen, 1);
    const nextPos = Math.min(to + syntaxLen, doc.content.size - 1);
    const slice = selection.content();

    let textContent = slice.content.textBetween(0, slice.content.size, '\n');
    const prevText = doc.textBetween(prevPos, from, '\n');
    const nextText = doc.textBetween(to, nextPos, '\n');

    textContent = `${prevText}${textContent}${nextText}`;

    if (prevText && nextText && conditionFn(textContent)) {
      tr.delete(nextPos - syntaxLen, nextPos).delete(prevPos, prevPos + syntaxLen);
    } else {
      tr.insertText(syntax, to).insertText(syntax, from);
      const newSelection = selection.empty
        ? createTextSelection(tr, from + syntaxLen)
        : createTextSelection(tr, from + syntaxLen, to + syntaxLen);

      tr.setSelection(newSelection);
    }
    dispatch!(tr);

    return true;
  };
}

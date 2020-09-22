import { AllSelection, Selection } from 'prosemirror-state';
import { MdPos } from '@t/markdown';

export function interpolatePos(selection: Selection) {
  let { from, to } = selection;

  if (selection instanceof AllSelection) {
    from += 1;
    to -= 1;
  }
  return [from, to];
}

export function getMdToEditorPos(startPos: MdPos, endPos: MdPos, lineTexts: string[]) {
  let from = 0;
  let to = 0;

  for (let i = 0; i < endPos[0]; i += 1) {
    const len = lineTexts[i].length;

    // should plus 2(end tag, start tag) to consider line breaking
    if (i < startPos[0]) {
      from += len + 2;
    }
    to += len + 2;
  }
  // should plus 1 to position to consider the start tag position
  from += startPos[1] + 1;
  to += endPos[1] + 1;

  return [from, to];
}

import { AllSelection, Selection } from 'prosemirror-state';

export function interpolatePos(selection: Selection) {
  let { from, to } = selection;

  if (selection instanceof AllSelection) {
    from += 1;
    to -= 1;
  }
  return [from, to];
}

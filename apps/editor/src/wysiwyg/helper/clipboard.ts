import { isFromMso, convertMsoParagraphsToList } from '@/wysiwyg/helper/pasteMsoList';
import { changeCopiedTable } from '@/wysiwyg/helper/pasteTable';

const START_FRAGMENT = '<!--StartFragment-->';
const END_FRAGMENT = '<!--EndFragment-->';

export function preprocessPasteData(html: string) {
  const startFragmentIndex = html.indexOf(START_FRAGMENT);
  const endFragmentIndex = html.lastIndexOf(END_FRAGMENT);

  if (startFragmentIndex > -1 && endFragmentIndex > -1) {
    html = html.slice(startFragmentIndex + START_FRAGMENT.length, endFragmentIndex);
  }

  html = changeCopiedTable(html);

  if (isFromMso(html)) {
    html = convertMsoParagraphsToList(html);
  }

  return `<p></p>${html}`;
}

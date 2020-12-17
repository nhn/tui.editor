import { isFromMso, convertMsoParagraphsToList } from '@/wysiwyg/helper/pasteMsoList';

export function preprocessPasteData(html: string) {
  const startFramgmentStr = '<!--StartFragment-->';
  const endFragmentStr = '<!--EndFragment-->';
  const startFragmentIndex = html.indexOf(startFramgmentStr);
  const endFragmentIndex = html.lastIndexOf(endFragmentStr);

  if (startFragmentIndex > -1 && endFragmentIndex > -1) {
    html = html.slice(startFragmentIndex + startFramgmentStr.length, endFragmentIndex);
  }

  if (isFromMso(html)) {
    html = convertMsoParagraphsToList(html);
  }

  return `<p></p>${html}`;
}

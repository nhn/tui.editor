import { markdownParsers } from '@/markdown/parser';
import { toHTMLRenderers } from '@/markdown/renderer';

export default function tableMergedCellPlugin() {
  return {
    toHTMLRenderers,
    markdownParsers,
  };
}

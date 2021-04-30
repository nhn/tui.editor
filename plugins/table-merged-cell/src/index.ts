import { markdownParsers } from '@/markdown/parser';
import { toHTMLRenderers } from '@/markdown/renderer';
import { toMarkdownRenderers } from './wysiwyg/renderer';
import { addLangs } from './i18n/langs';
import type { PluginContext, PluginInfo } from '@toast-ui/editor';

export default function tableMergedCellPlugin({ i18n }: PluginContext): PluginInfo {
  addLangs(i18n);

  return {
    toHTMLRenderers,
    markdownParsers,
    toMarkdownRenderers,
  };
}

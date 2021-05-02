import type { PluginContext, PluginInfo } from '@toast-ui/editor';
import { markdownParsers } from '@/markdown/parser';
import { toHTMLRenderers } from '@/markdown/renderer';
import { toMarkdownRenderers } from './wysiwyg/renderer';
import { addLangs } from './i18n/langs';
import { offsetMapMixin, createOffsetMapMixin } from './wysiwyg/tableOffsetMapMixin';

export default function tableMergedCellPlugin({ i18n, eventEmitter }: PluginContext): PluginInfo {
  addLangs(i18n);
  eventEmitter.emit('mixinTableOffsetMapProto', offsetMapMixin, createOffsetMapMixin);

  return {
    toHTMLRenderers,
    markdownParsers,
    toMarkdownRenderers,
  };
}

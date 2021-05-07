import type { PluginContext, PluginInfo } from '@toast-ui/editor';
import { markdownParsers } from '@/markdown/parser';
import { toHTMLRenderers } from '@/markdown/renderer';
import { toMarkdownRenderers } from '@/wysiwyg/renderer';
import { addLangs } from '@/i18n/langs';
import { offsetMapMixin, createOffsetMapMixin } from '@/wysiwyg/tableOffsetMapMixin';
import { addMergedTableContextMenu } from '@/wysiwyg/contextMenu';
import { createCommands } from '@/wysiwyg/commandFactory';

import './css/plugin.css';

export default function tableMergedCellPlugin(context: PluginContext): PluginInfo {
  const { i18n, eventEmitter } = context;
  const TableOffsetMap = eventEmitter.emitReduce(
    'mixinTableOffsetMapPrototype',
    offsetMapMixin,
    createOffsetMapMixin
  );

  addLangs(i18n);
  addMergedTableContextMenu(context);

  return {
    toHTMLRenderers,
    markdownParsers,
    toMarkdownRenderers,
    wysiwygCommands: createCommands(context, TableOffsetMap),
  };
}

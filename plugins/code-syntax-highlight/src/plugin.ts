import { toHTMLRenderers } from '@/renderers/toHTMLRenderers';
import { codeSyntaxHighlighting } from '@/plugins/codeSyntaxHighlighting';

import { PluginOptions } from '@t/plugin';

export function codeSyntaxHighlightPlugin(eventEmitter: any, options = {}) {
  const { hljs } = options as PluginOptions;
  const plugins = [
    {
      editorType: 'wysiwyg',
      plugin: (evtEmitter: any, toDOMAdaptor: any) =>
        codeSyntaxHighlighting(evtEmitter, toDOMAdaptor, hljs),
    },
  ];

  return { toHTMLRenderers, plugins };
}

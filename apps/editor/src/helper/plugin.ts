import isArray from 'tui-code-snippet/type/isArray';

import { EditorPlugin, ProsemirrorPlugin } from '@t/editor';
import { Emitter } from '@t/event';
import { PluginInfoResult, ExtraPluginInfoResult, ExtraMdPlugin, ExtraWwPlugin } from '@t/plugin';

function execPlugin(plugin: EditorPlugin, eventEmitter: Emitter) {
  if (isArray(plugin)) {
    const [pluginFn, options = {}] = plugin;

    return pluginFn(eventEmitter, options);
  }

  return plugin(eventEmitter);
}

function createEditorPlugins(plugins: ProsemirrorPlugin[]) {
  return plugins.reduce<ExtraPluginInfoResult>(
    (acc, plugin) => {
      const { editorType, plugin: pluginFn } = plugin;

      if (editorType === 'markdown') {
        acc.mdPlugins.push(pluginFn as ExtraMdPlugin);
      } else if (editorType === 'wysiwyg') {
        acc.wwPlugins.push(pluginFn as ExtraWwPlugin);
      } else {
        acc.mdPlugins.push(pluginFn as ExtraMdPlugin);
        acc.wwPlugins.push(pluginFn as ExtraWwPlugin);
      }

      return acc;
    },
    { mdPlugins: [], wwPlugins: [] }
  );
}

export function getPluginInfo(plugins: EditorPlugin[], eventEmitter: Emitter) {
  if (!plugins) {
    return {} as PluginInfoResult;
  }

  return plugins.reduce<PluginInfoResult>(
    (acc, plugin) => {
      const { toHTMLRenderers, plugins: editorPlugins } = execPlugin(plugin, eventEmitter) ?? {};

      if (toHTMLRenderers) {
        acc.toHTMLRenderers = { ...acc.toHTMLRenderers, ...toHTMLRenderers };
      }

      if (editorPlugins) {
        const { mdPlugins, wwPlugins } = createEditorPlugins(editorPlugins);

        acc.mdPlugins = acc.mdPlugins.concat(mdPlugins);
        acc.wwPlugins = acc.wwPlugins.concat(wwPlugins);
      }

      return acc;
    },
    {
      toHTMLRenderers: {},
      mdPlugins: [],
      wwPlugins: [],
    }
  );
}

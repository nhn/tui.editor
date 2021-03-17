import isArray from 'tui-code-snippet/type/isArray';

import { EditorPlugin } from '@t/editor';
import { Emitter } from '@t/event';
import { PluginInfoResult } from '@t/plugin';

function execPlugin(plugin: EditorPlugin, eventEmitter: Emitter) {
  if (isArray(plugin)) {
    const [pluginFn, options = {}] = plugin;

    return pluginFn(eventEmitter, options);
  }

  return plugin(eventEmitter);
}

export function getPluginInfo(plugins: EditorPlugin[], eventEmitter: Emitter) {
  if (plugins) {
    return plugins.reduce<PluginInfoResult>(
      (acc, plugin) => {
        const pluginInfoResult = execPlugin(plugin, eventEmitter);

        if (!pluginInfoResult) {
          throw new Error('The return value of the executed plugin is empty.');
        }

        const {
          toHTMLRenderers,
          toMarkdownRenderers,
          markdownPlugins,
          wysiwygPlugins,
          wysiwygNodeViews,
          markdownCommands,
          wysiwygCommands,
        } = pluginInfoResult;

        if (toHTMLRenderers) {
          acc.toHTMLRenderers = { ...acc.toHTMLRenderers, ...toHTMLRenderers };
        }

        if (toMarkdownRenderers) {
          acc.toMarkdownRenderers = { ...acc.toMarkdownRenderers, ...toMarkdownRenderers };
        }

        if (markdownPlugins) {
          acc.mdPlugins = acc.mdPlugins!.concat(markdownPlugins);
        }

        if (wysiwygPlugins) {
          acc.wwPlugins = acc.wwPlugins!.concat(wysiwygPlugins);
        }

        if (wysiwygNodeViews) {
          acc.wwNodeViews = { ...acc.wwNodeViews, ...wysiwygNodeViews };
        }

        if (markdownCommands) {
          acc.mdCommands = { ...acc.mdCommands, ...markdownCommands };
        }

        if (wysiwygCommands) {
          acc.wwCommands = { ...acc.wwCommands, ...wysiwygCommands };
        }

        return acc;
      },
      {
        toHTMLRenderers: {},
        toMarkdownRenderers: {},
        mdPlugins: [],
        wwPlugins: [],
        wwNodeViews: {},
        mdCommands: {},
        wwCommands: {},
      }
    );
  }

  return null;
}

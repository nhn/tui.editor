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

        const { toHTMLRenderers, mdPlugins, wwPlugins, wwNodeViews } = pluginInfoResult;

        if (toHTMLRenderers) {
          acc.toHTMLRenderers = { ...acc.toHTMLRenderers, ...toHTMLRenderers };
        }

        if (mdPlugins) {
          acc.mdPlugins = acc.mdPlugins.concat(mdPlugins);
        }

        if (wwPlugins) {
          acc.wwPlugins = acc.wwPlugins.concat(wwPlugins);
        }

        if (wwNodeViews) {
          acc.wwNodeViews = { ...acc.wwNodeViews, ...wwNodeViews };
        }

        return acc;
      },
      {
        toHTMLRenderers: {},
        mdPlugins: [],
        wwPlugins: [],
        wwNodeViews: {},
      }
    );
  }

  return {};
}

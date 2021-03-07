import isArray from 'tui-code-snippet/type/isArray';

import { EditorPlugin, ProsemirrorPlugin, ProsemirrorNodeView } from '@t/editor';
import { Emitter } from '@t/event';
import { PluginInfoResult, ExtraPlugin, ExtraNodeViewMap } from '@t/plugin';

function execPlugin(plugin: EditorPlugin, eventEmitter: Emitter) {
  if (isArray(plugin)) {
    const [pluginFn, options = {}] = plugin;

    return pluginFn(eventEmitter, options);
  }

  return plugin(eventEmitter);
}

function createEditorPlugins(plugins: ProsemirrorPlugin[]) {
  return plugins.reduce<{
    mdPlugins: ExtraPlugin[];
    wwPlugins: ExtraPlugin[];
  }>(
    (acc, plugin) => {
      const { editorType, plugin: pluginFn } = plugin;

      if (editorType === 'markdown') {
        acc.mdPlugins.push(pluginFn);
      } else if (editorType === 'wysiwyg') {
        acc.wwPlugins.push(pluginFn);
      } else {
        acc.mdPlugins.push(pluginFn);
        acc.wwPlugins.push(pluginFn);
      }

      return acc;
    },
    { mdPlugins: [], wwPlugins: [] }
  );
}

function createNodeViews(nodeViews: ProsemirrorNodeView[]) {
  return nodeViews.reduce<{ wwNodeViews: ExtraNodeViewMap }>(
    (acc, nodeView) => {
      const { editorType, nodeName, view } = nodeView;

      if (editorType === 'wysiwyg') {
        const nodeViewMap = {
          [nodeName]: view,
        };

        acc.wwNodeViews = { ...acc.wwNodeViews, ...nodeViewMap };
      }

      return acc;
    },
    { wwNodeViews: {} }
  );
}

export function getPluginInfo(plugins: EditorPlugin[], eventEmitter: Emitter) {
  if (!plugins) {
    return {} as PluginInfoResult;
  }

  return plugins.reduce<PluginInfoResult>(
    (acc, plugin) => {
      const { toHTMLRenderers, plugins: editorPlugins, nodeViews } =
        execPlugin(plugin, eventEmitter) ?? {};

      if (toHTMLRenderers) {
        acc.toHTMLRenderers = { ...acc.toHTMLRenderers, ...toHTMLRenderers };
      }

      if (editorPlugins) {
        const { mdPlugins, wwPlugins } = createEditorPlugins(editorPlugins);

        acc.mdPlugins = acc.mdPlugins.concat(mdPlugins);
        acc.wwPlugins = acc.wwPlugins.concat(wwPlugins);
      }

      if (nodeViews) {
        const { wwNodeViews } = createNodeViews(nodeViews);

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

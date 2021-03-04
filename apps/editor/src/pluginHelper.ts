import { Editor, EditorPlugin, EditorPluginInfo, Viewer, NodeViewInfo } from '@t/editor';
import { CustomParserMap, CustomHTMLRendererMap } from '@t/markdown';
import isArray from 'tui-code-snippet/type/isArray';
import isFunction from 'tui-code-snippet/type/isFunction';

interface PluginInfoResult {
  plugins: EditorPlugin[];
  renderer: CustomHTMLRendererMap;
  parser: CustomParserMap;
  nodeViews: NodeViewInfo[];
}

/**
 * Invoke plugins
 * @param {Array.<Function|Array>} plugins - list of plugin function only or
 *                                  plugin function with options
 * @param {Editor|Viewer} editor - editor or viewer instance
 */
export function invokePlugins(plugins: EditorPlugin[], editor: Editor | Viewer) {
  plugins.forEach((plugin) => {
    if (isFunction(plugin)) {
      plugin(editor);
    } else if (isArray(plugin)) {
      const [pluginFn, options = {}] = plugin;

      pluginFn(editor, options);
    }
  });
}

/**
 * Get plugin info
 * @param {Array.<Function|Array>} plugins - list of plugin function only or
 *                                  plugin function with options
 * @returns {Object} - plugin info
 */
export function getPluginInfo(plugins: (EditorPlugin | EditorPluginInfo)[]) {
  if (!plugins) {
    return {} as PluginInfoResult;
  }

  return plugins.reduce<PluginInfoResult>(
    (acc, plugin) => {
      const pluginInfo = isArray(plugin) ? plugin[0] : plugin;

      if (!isFunction(pluginInfo)) {
        const { renderer, parser, pluginFn, nodeViews } = pluginInfo;

        plugin = isArray(plugin) ? [pluginFn, plugin[1]] : pluginFn;

        if (renderer) {
          acc.renderer = { ...acc.renderer, ...renderer };
        }
        if (parser) {
          acc.parser = { ...acc.parser, ...parser };
        }

        if (nodeViews) {
          acc.nodeViews = acc.nodeViews.concat(nodeViews);
        }
      }
      acc.plugins.push(plugin as EditorPlugin);

      return acc;
    },
    { plugins: [], renderer: {}, parser: {}, nodeViews: [] }
  );
}

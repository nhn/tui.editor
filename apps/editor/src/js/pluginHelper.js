import isArray from 'tui-code-snippet/type/isArray';
import isFunction from 'tui-code-snippet/type/isFunction';

/**
 * Invoke plugins
 * @param {Array.<Function|Array>} plugins - list of plugin function only or
 *                                  plugin function with options
 * @param {Editor|Viewer} editor - editor or viewer instance
 */
export function invokePlugins(plugins, editor) {
  plugins.forEach(plugin => {
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
export function getPluginInfo(plugins) {
  if (!plugins) {
    return {};
  }

  return plugins.reduce(
    (acc, plugin) => {
      const pluginInfo = isArray(plugin) ? plugin[0] : plugin;

      if (!isFunction(pluginInfo)) {
        const { renderer, parser, pluginFn } = pluginInfo;

        plugin = isArray(plugin) ? [pluginFn, plugin[1]] : pluginFn;

        if (renderer) {
          acc.renderer = { ...acc.renderer, ...renderer };
        }
        if (parser) {
          acc.parser = { ...acc.parser, ...parser };
        }
      }
      acc.plugins.push(plugin);

      return acc;
    },
    { plugins: [], renderer: {}, parser: {} }
  );
}

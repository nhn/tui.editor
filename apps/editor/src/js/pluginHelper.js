import util from 'tui-code-snippet';

/**
 * Invoke plugins
 * @param {Array.<Function|Array>} plugins - list of plugin function only or
 *                                  plugin function with options
 * @param {Editor|Viewer} editor - editor or viewer instance
 */
export function invokePlugins(plugins, editor) {
  plugins.forEach(plugin => {
    if (util.isFunction(plugin)) {
      plugin(editor);
    } else if (util.isArray(plugin)) {
      const [pluginFn, options = {}] = plugin;

      pluginFn(editor, options);
    }
  });
}

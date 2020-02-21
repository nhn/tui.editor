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

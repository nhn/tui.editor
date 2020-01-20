import util from 'tui-code-snippet';

/**
 * Invoke plugins
 * @param {Array.<Function>} plugins - list of plugin function
 * @param {Editor|Viewer} editor - editor or viewer instance
 */
export function invokePlugins(plugins, editor) {
  plugins.forEach(plugin => {
    if (util.isFunction(plugin)) {
      plugin(editor);
    } else if (util.isObject(plugin)) {
      const { plugin: pluginFunc, options = {} } = plugin;

      pluginFunc(editor, options);
    }
  });
}

/**
 * @fileoverview Implements helper for plugin
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Register highlight.js to instance of Editor or Viewer
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 * @param {Object} [hljs] - object of highlight.js
 */
export function registerHljsToEditor(editor, hljs) {
  const { codeBlockManager } = Object.getPrototypeOf(editor).constructor;
  const languages = hljs.listLanguages();

  editor.setCodeBlockLanguages(languages);

  codeBlockManager.setHighlightJS(hljs);
}

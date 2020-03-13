/**
 * @fileoverview Implements helper for plugin
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */

/**
 * Register highlight.js to instance of Editor or Viewer
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 * @param {Object} [hljs] - object of highlight.js
 */
export function registerCodeBlockReplacer(editor, hljs) {
  const { codeBlockManager } = Object.getPrototypeOf(editor).constructor;
  const languages = hljs.listLanguages();

  editor.setCodeBlockLanguages(languages);
  languages.forEach(type => {
    const convertor = codeText => hljs.highlight(type, codeText).value;
    const aliases = hljs.getLanguage(type).aliases || [];
    const langTypes = [type, ...aliases];

    langTypes.forEach(lang => {
      codeBlockManager.setReplacer(lang, convertor);
    });
  });
}

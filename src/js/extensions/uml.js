/**
* @fileoverview Implements UML extension
* @author NHN FE Development Lab <dl_javascript@nhn.com>
*/
import plantumlEncoder from 'plantuml-encoder';

import Editor from './editorProxy';

const {codeBlockManager} = Editor;
const DEFAULT_RENDERER_URL = 'http://www.plantuml.com/plantuml/png/';
const UML_LANGUAGES = ['uml', 'plantuml'];

/**
 * plant uml plugin
 * @param {Editor} editor - editor
 * @param {object} [options={}] - plugin options
 * @param {string} options.rendererURL - plant uml renderer url
 * @ignore
 */
function umlExtension(editor, options = {}) {
  const {
    rendererURL = DEFAULT_RENDERER_URL
  } = options;

  /**
   * render html from uml
   * @param {string} umlCode - plant uml code text
   * @returns {string} - rendered html
   */
  function plantUMLReplacer(umlCode) {
    let renderedHTML;

    try {
      if (!plantumlEncoder) {
        throw new Error('plantuml-encoder dependency required');
      }
      renderedHTML = `<img src="${rendererURL}${plantumlEncoder.encode(umlCode)}" />`;
    } catch (err) {
      renderedHTML = `Error occurred on encoding uml: ${err.message}`;
    }

    return renderedHTML;
  }

  const {codeBlockLanguages} = editor.options;
  UML_LANGUAGES.forEach(umlLanguage => {
    if (codeBlockLanguages.indexOf(umlLanguage) < 0) {
      codeBlockLanguages.push(umlLanguage);
    }
    codeBlockManager.setReplacer(umlLanguage, plantUMLReplacer);
  });
}

Editor.defineExtension('uml', umlExtension);

export default umlExtension;

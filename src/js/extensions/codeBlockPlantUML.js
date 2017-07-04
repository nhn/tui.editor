/* globals plantumlEncoder */

import extManager from '../extManager';

const DEFAULT_RENDERER_URL = 'http://www.plantuml.com/plantuml/png/';

/**
 * plant uml plugin
 * @param {Editor} editor - editor
 * @param {object} [options={}] - plugin options
 * @param {string} options.rendererURL - plant uml renderer url
 * @param {Array<string>} options.languages - language names to map
 */
function plantUMLPlugin(editor, options = {}) {
    const codeBlockManager = editor.convertor.getCodeBlockManager();
    const {
        rendererURL = DEFAULT_RENDERER_URL,
        languages = ['plantuml', 'uml']
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

    languages.forEach(language => codeBlockManager.setReplacer(language, plantUMLReplacer));
}

extManager.defineExtension('plantUML', plantUMLPlugin);

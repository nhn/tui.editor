/**
 * @fileoverview Implements uml plugin
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import plantumlEncoder from 'plantuml-encoder';
import { UMLPluginOptions } from '../index';

const DEFAULT_RENDERER_URL = '//www.plantuml.com/plantuml/png/';

function createUMLTokens(text: string, rendererURL: string) {
  let renderedHTML;

  try {
    if (!plantumlEncoder) {
      throw new Error('plantuml-encoder dependency required');
    }
    renderedHTML = `<img src="${rendererURL}${plantumlEncoder.encode(text)}" />`;
  } catch (err) {
    renderedHTML = `Error occurred on encoding uml: ${err.message}`;
  }

  return [
    { type: 'openTag', tagName: 'div', outerNewLine: true },
    { type: 'html', content: renderedHTML },
    { type: 'closeTag', tagName: 'div', outerNewLine: true },
  ];
}

/**
 * UML plugin
 * @param {Object} emitter - event emitter for communicating with editor
 * @param {Object} options - options for plugin
 * @param {string} [options.rendererURL] - url of plant uml renderer
 */
export default function umlPlugin(_: any, options: UMLPluginOptions = {}) {
  const { rendererURL = DEFAULT_RENDERER_URL } = options;

  return {
    toHTMLRenderers: {
      uml(node: any) {
        return createUMLTokens(node.literal!, rendererURL);
      },
      plantUml(node: any) {
        return createUMLTokens(node.literal!, rendererURL);
      },
    },
  };
}

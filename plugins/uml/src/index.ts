/**
 * @fileoverview Implements uml plugin
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import plantumlEncoder from 'plantuml-encoder';
import { PluginOptions } from '../index';

import type { MdNode, PluginContext, PluginInfo } from '@toast-ui/editor';
import type { HTMLToken } from '@toast-ui/toastmark';

const DEFAULT_RENDERER_URL = '//www.plantuml.com/plantuml/png/';

function createUMLTokens(text: string, rendererURL: string): HTMLToken[] {
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
 * @param {Object} context - plugin context for communicating with editor
 * @param {Object} options - options for plugin
 * @param {string} [options.rendererURL] - url of plant uml renderer
 */
export default function umlPlugin(_: PluginContext, options: PluginOptions = {}): PluginInfo {
  const { rendererURL = DEFAULT_RENDERER_URL } = options;

  return {
    toHTMLRenderers: {
      uml(node: MdNode) {
        return createUMLTokens(node.literal!, rendererURL);
      },
      plantUml(node: MdNode) {
        return createUMLTokens(node.literal!, rendererURL);
      },
    },
  };
}

/**
 * @fileoverview Implements code syntax highlight plugin
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import hljs from 'highlight.js/lib/highlight';
import { registerCodeBlockReplacer } from './helper';

/**
 * Code syntax highlight plugin to import selected languages
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 * @param {Object} [options] - options for plugin
 * @param {Object} [options.hljs] - object of highlight.js
 */
export default function codeSyntaxHighlightPlugin(editor, options = {}) {
  const editorHljs = options.hljs || hljs;

  if (editorHljs) {
    registerCodeBlockReplacer(editor, editorHljs);
  }
}

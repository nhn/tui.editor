/**
 * @fileoverview Implements code syntax highlight plugin
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import hljs from 'highlight.js/lib/highlight';
import { registerHljsToEditor } from './helper';

/**
 * Plant code-syntax-highlight plugin (import selected languages)
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 * @param {Object} [options={}] - plugin options
 * @param {Object} [options.hljs] - object of highlight.js
 */
export default function codeSyntaxHighlightPlugin(editor, options = {}) {
  const { hljs: externalHljs } = options;
  const editorHljs = externalHljs || hljs;

  if (editorHljs) {
    registerHljsToEditor(editor, editorHljs);
  }
}

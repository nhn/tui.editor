/**
 * @fileoverview Implements code syntax highlight plugin for 'all' bundle file served to CDN
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import hljs from 'highlight.js';
import { registerCodeBlockReplacer } from './helper';

/**
 * Code syntax highlight plugin to import all languages
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 */
export default function codeSyntaxHighlightPlugin(editor) {
  registerCodeBlockReplacer(editor, hljs);
}

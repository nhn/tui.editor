/**
 * @fileoverview Implements code syntax highlight plugin
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import hljs from 'highlight.js/lib/highlight';
import { registerCodeBlockReplacer } from './helper';

// @TODO update to 3.0
import Editor from '@toast-ui/editor';

/**
 * Code syntax highlight plugin to import selected languages
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 * @param {Object} [options] - options for plugin
 * @param {Object} [options.hljs] - object of highlight.js
 */
export default function codeSyntaxHighlightPlugin(editor: Editor, options = {}) {
  console.log('test');
}

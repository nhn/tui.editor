import { renderer } from '@/renderer';
import { CodeBlockHighlightingView } from '@/nodeView';

// @TODO update to 3.0
import Editor from '@toast-ui/editor';

import '@/css/plugin.css';

/**
 * Code syntax highlight plugin to import selected languages
 * @param {Editor|Viewer} editor - instance of Editor or Viewer
 * @param {Object} [options] - options for plugin
 * @param {Object} [options.hljs] - object of highlight.js
 */
function codeSyntaxHighlightPlugin(editor: Editor, options = {}) {
  // @ts-ignore
  const { eventEmitter } = editor;

  eventEmitter.addEventType('showCodeBlockLanguages');
  eventEmitter.addEventType('selectLanguage');
}

export default {
  renderer,
  pluginFn: codeSyntaxHighlightPlugin,
  nodeViews: [
    {
      editorType: 'wysiwyg',
      nodeName: 'codeBlock',
      view: CodeBlockHighlightingView,
    },
  ],
};

import * as Hljs from 'highlight.js';

export interface PluginOptions {
  hljs: typeof Hljs;
}

// @TODO change to import editor's declaration file
interface EditorPluginInfo {
  toHTMLRenderers: any;
  markdownPlugins: any[];
  wysiwygPlugins: any[];
  wysiwygNodeViews: any;
}

export default function codeSyntaxHighlightPlugin(): EditorPluginInfo;

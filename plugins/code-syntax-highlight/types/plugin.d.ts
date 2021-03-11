import * as Hljs from 'highlight.js';
import { EditorPlugin } from '@toast-ui/editor';

export interface PluginOptions {
  hljs: typeof Hljs;
}

export default function codeSyntaxHighlightPlugin(): () => EditorPlugin;

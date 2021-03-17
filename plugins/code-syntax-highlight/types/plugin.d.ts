import * as Prism from 'prismjs';
import { EditorPlugin } from '@toast-ui/editor';

export interface PluginOptions {
  highlighter: typeof Prism;
}

export default function codeSyntaxHighlightPlugin(): () => EditorPlugin;

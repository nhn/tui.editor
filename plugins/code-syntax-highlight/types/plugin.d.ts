import { PrismJs } from 'prismjs';
import { EditorPlugin } from '@toast-ui/editor';

export interface PluginOptions {
  highlighter: PrismJs;
}

export default function codeSyntaxHighlightPlugin(): () => EditorPlugin;

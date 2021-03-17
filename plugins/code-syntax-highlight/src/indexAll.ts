import Prism from 'prismjs';
import { codeSyntaxHighlightPlugin } from '@/plugin';

import { Emitter } from '@toast-ui/editor';

import '@/prismjs-langs';
import '@/css/plugin.css';

declare global {
  interface Window {
    Prism: any;
  }
}

// Prevent to highlight all code elements automatically.
// @link https://prismjs.com/docs/Prism.html#.manual
if (window) {
  window.Prism = window.Prism || {};

  // @ts-ignore
  Prism.manual = true;
}

export default (eventEmitter: Emitter, options = {}) =>
  codeSyntaxHighlightPlugin(eventEmitter, { ...options, ...{ highlighter: Prism } });

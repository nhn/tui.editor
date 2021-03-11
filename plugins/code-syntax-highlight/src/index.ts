import { codeSyntaxHighlightPlugin } from '@/plugin';
import low from 'lowlight/lib/core';

import { Emitter } from '@toast-ui/editor';

import '@/css/plugin.css';

export default (eventEmitter: Emitter, options = {}) =>
  codeSyntaxHighlightPlugin(eventEmitter, low, options);

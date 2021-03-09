import { codeSyntaxHighlightPlugin } from '@/plugin';

import '@/css/plugin.css';

import low from 'lowlight/lib/core';

export default (eventEmitter: any, options = {}) =>
  codeSyntaxHighlightPlugin(eventEmitter, low, options);

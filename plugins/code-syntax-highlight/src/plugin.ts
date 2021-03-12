import { getHTMLRenderers } from '@/renderers/toHTMLRenderers';
import { codeSyntaxHighlighting } from '@/plugins/codeSyntaxHighlighting';
import { createCodeSyntaxHighlightView } from '@/nodeViews/codeSyntaxHighlightView';

import { PluginOptions } from '@t/plugin';

import Hljs from 'highlight.js';
import Low from 'lowlight/lib/core';

import { Emitter } from '@toast-ui/editor';

function registerLanguages(hljs: typeof Hljs, low: typeof Low, languages: any[]) {
  languages.forEach((lang) => {
    const { name } = lang;

    hljs.registerLanguage(name, lang);
    low.registerLanguage(name, lang);
  });
}

export function codeSyntaxHighlightPlugin(eventEmitter: Emitter, low: typeof Low, options = {}) {
  const { hljs, languages } = options as PluginOptions;

  eventEmitter.addEventType('showCodeBlockLanguages');
  eventEmitter.addEventType('selectLanguage');
  eventEmitter.addEventType('finishLanguageEditing');

  registerLanguages(hljs, low, languages);

  return {
    toHTMLRenderers: getHTMLRenderers(hljs),
    wysiwygPlugins: [() => codeSyntaxHighlighting(hljs, low)],
    wysiwygNodeViews: {
      codeBlock: createCodeSyntaxHighlightView(languages),
    },
  };
}

import isFunction from 'tui-code-snippet/type/isFunction';

import { getHTMLRenderers } from '@/renderers/toHTMLRenderers';
import { codeSyntaxHighlighting } from '@/plugins/codeSyntaxHighlighting';
import { createCodeSyntaxHighlightView } from '@/nodeViews/codeSyntaxHighlightView';

import { PluginOptions } from '@t/plugin';

export function codeSyntaxHighlightPlugin(eventEmitter: any, options = {}) {
  const { highlighter: prism } = options as PluginOptions;

  eventEmitter.addEventType('showCodeBlockLanguages');
  eventEmitter.addEventType('selectLanguage');
  eventEmitter.addEventType('finishLanguageEditing');

  const { languages } = prism;
  const registerdlanguages = Object.keys(languages).filter(
    (language) => !isFunction(languages[language])
  );

  return {
    toHTMLRenderers: getHTMLRenderers(prism),
    wysiwygPlugins: [() => codeSyntaxHighlighting(prism)],
    wysiwygNodeViews: {
      codeBlock: createCodeSyntaxHighlightView(registerdlanguages),
    },
  };
}

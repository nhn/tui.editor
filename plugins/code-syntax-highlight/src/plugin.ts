import isFunction from 'tui-code-snippet/type/isFunction';

import { getHTMLRenderers } from '@/renderers/toHTMLRenderers';
import { codeSyntaxHighlighting } from '@/plugins/codeSyntaxHighlighting';
import { createCodeSyntaxHighlightView } from '@/nodeViews/codeSyntaxHighlightView';

import type { Emitter, PluginInfo } from '@toast-ui/editor';
import { PluginOptions } from '@t/index';

export function codeSyntaxHighlightPlugin(
  eventEmitter: Emitter,
  options: PluginOptions
): PluginInfo {
  if (options) {
    const { highlighter: prism } = options;

    eventEmitter.addEventType('showCodeBlockLanguages');
    eventEmitter.addEventType('selectLanguage');
    eventEmitter.addEventType('finishLanguageEditing');

    const { languages } = prism;
    const registerdlanguages = Object.keys(languages).filter(
      (language) => !isFunction(languages[language])
    );

    return {
      toHTMLRenderers: getHTMLRenderers(prism),
      wysiwygPlugins: [() => codeSyntaxHighlighting(options)],
      wysiwygNodeViews: {
        codeBlock: createCodeSyntaxHighlightView(registerdlanguages),
      },
    };
  }
  return {};
}

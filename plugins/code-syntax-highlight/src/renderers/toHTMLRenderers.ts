import { CodeBlockMdNode, MdNode } from '@toast-ui/editor';

import * as Hljs from 'highlight.js';

const BACKTICK_COUNT = 3;

export function getHTMLRenderers(hljs: typeof Hljs) {
  return {
    codeBlock(node: MdNode) {
      const { fenceLength, info } = node as CodeBlockMdNode;
      const infoWords = info ? info.split(/\s+/) : [];
      const preClasses = [];
      const codeAttrs: Record<string, any> = {};

      if (fenceLength > BACKTICK_COUNT) {
        codeAttrs['data-backticks'] = fenceLength;
      }

      let content = '';

      if (infoWords.length && infoWords[0].length) {
        const [lang] = infoWords;

        preClasses.push(`lang-${lang}`);
        codeAttrs['data-language'] = lang;

        const registeredLang = hljs.getLanguage(lang);

        content = registeredLang ? hljs.highlight(lang, node.literal!).value : node.literal!;
      }

      return [
        { type: 'openTag', tagName: 'pre', classNames: preClasses },
        { type: 'openTag', tagName: 'code', attributes: codeAttrs },
        { type: 'html', content },
        { type: 'closeTag', tagName: 'code' },
        { type: 'closeTag', tagName: 'pre' },
      ];
    },
  };
}

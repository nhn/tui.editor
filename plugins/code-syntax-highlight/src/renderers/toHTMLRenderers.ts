import { CodeBlockMdNode, MdNode } from '@t/markdown';

type TokenAttrs = Record<string, any>;

export function getHTMLRenderers(hljs: any) {
  return {
    codeBlock(node: MdNode) {
      const { fenceLength, info } = node as CodeBlockMdNode;
      const infoWords = info ? info.split(/\s+/) : [];
      const preClasses = [];
      const codeAttrs: TokenAttrs = {};

      if (fenceLength > 3) {
        codeAttrs['data-backticks'] = fenceLength;
      }

      let content = '';

      if (infoWords.length > 0 && infoWords[0].length > 0) {
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

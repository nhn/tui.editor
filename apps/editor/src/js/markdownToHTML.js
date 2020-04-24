import { Parser, createRenderHTML } from '@toast-ui/toastmark';
import { getHTMLRenderConvertors } from './htmlRenderConvertors';

export function createMarkdownToHTML(options) {
  const { extendedAutolinks, customHTMLRenderer, useReferenceDefinition } = options;

  const parser = new Parser({
    disallowedHtmlBlockTags: ['br'],
    extendedAutolinks,
    useReferenceDefinition,
    disallowDeepHeading: true
  });

  const renderHTML = createRenderHTML({
    gfm: true,
    convertors: getHTMLRenderConvertors(null, customHTMLRenderer)
  });

  return function markdownToHTML(markdown) {
    return renderHTML(parser.parse(markdown));
  };
}

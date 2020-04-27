import { Parser, createRenderHTML } from '@toast-ui/toastmark';
import { getHTMLRenderConvertors } from './htmlRenderConvertors';

export function createMarkdownToHTML(options) {
  const { extendedAutolinks, customHTMLRenderer, referenceDefinition } = options;

  const parser = new Parser({
    disallowedHtmlBlockTags: ['br'],
    extendedAutolinks,
    referenceDefinition,
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

import { Parser, createRenderHTML } from '@toast-ui/toastmark';
import { getHTMLRenderConvertors } from './htmlRenderConvertors';

const parser = new Parser({ disallowedHtmlBlockTags: ['br'] });

export function createMarkdownToHTML(options) {
  const renderHTML = createRenderHTML({
    gfm: true,
    convertors: getHTMLRenderConvertors(null, options.customHTMLRenderer)
  });

  return function markdownToHTML(markdown) {
    return renderHTML(parser.parse(markdown));
  };
}

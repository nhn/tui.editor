import MarkdownEditor from '@/markdown/mdEditor';
import { CustomHTMLRendererMap } from '@t/markdown';

export function getTextContent(editor: MarkdownEditor) {
  const { doc } = editor.view.state;
  const docSize = doc.content.size;
  let text = '';

  doc.nodesBetween(0, docSize, (node, pos) => {
    if (node.isText) {
      text += node.text!.slice(Math.max(0, pos) - pos, docSize - pos);
    } else if (node.isBlock && pos > 0) {
      text += '\n';
    }
  });

  return text;
}

export function trailingDataAttr(html: string) {
  return html.replace(/\sdata-nodeid="\d{1,}"/g, '').trim();
}

export function createHTMLrenderer() {
  const customHTMLRenderer: CustomHTMLRendererMap = {
    htmlBlock: {
      // @ts-ignore
      iframe(node: MdLikeNode) {
        return [
          { type: 'openTag', tagName: 'iframe', outerNewLine: true, attributes: node.attrs },
          { type: 'html', content: node.childrenHTML },
          { type: 'closeTag', tagName: 'iframe', outerNewLine: true },
        ];
      },
    },
    htmlInline: {
      // @ts-ignore
      big(node: MdLikeNode, { entering }: Context) {
        return entering
          ? { type: 'openTag', tagName: 'big', attributes: node.attrs }
          : { type: 'closeTag', tagName: 'big' };
      },
    },
  };

  return customHTMLRenderer;
}

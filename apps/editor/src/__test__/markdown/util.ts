import MarkdownEditor from '@/markdown/mdEditor';
import { nbspToSpace } from '@/markdown/helper/manipulation';

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

  return nbspToSpace(text);
}

import codemirror from 'codemirror';
import { MarkdownDocument } from '../document';
import { GfmHtmlRenderer } from '../commonmark/render/gfm/html';
import { last } from '../helper';
import 'codemirror/lib/codemirror.css';
import './index.css';

document.body.innerHTML = `
  <section class="container">
    <div class="editor"></div>
    <div class="preview"></div>
    <div class="html"></div>
  </section>
`;

const editorEl = document.querySelector('.editor') as HTMLElement;
const htmlEl = document.querySelector('.html') as HTMLElement;
const previewEl = document.querySelector('.preview') as HTMLElement;

const cm = codemirror(editorEl, { lineNumbers: true });
const doc = new MarkdownDocument();
const writer = new GfmHtmlRenderer({ sourcepos: true });

const tokenTypes = {
  heading: 'header',
  emph: 'em',
  strong: 'strong',
  strike: 'strikethrough',
  item: 'variable-2',
  image: 'variable-3',
  blockQuote: 'quote'
};

type TokenTypes = typeof tokenTypes;

cm.on('change', (editor, changeObj) => {
  const { from, to, text } = changeObj;
  const { nodes } = doc.editMarkdown(
    [from.line + 1, from.ch + 1],
    [to.line + 1, to.ch + 1],
    text.join('\n')
  );

  const html = writer.render(doc.getRootNode());
  previewEl.innerHTML = html;
  htmlEl.innerText = html;

  if (!nodes.length) {
    return;
  }

  const editFromPos = nodes[0].sourcepos![0];
  const editToPos = last(nodes).sourcepos![1];
  const editFrom = { line: editFromPos[0] - 1, ch: editFromPos[1] - 1 };
  const editTo = { line: editToPos[0] - 1, ch: editToPos[1] };
  const marks = cm.findMarks(editFrom, editTo);

  for (const mark of marks) {
    mark.clear();
  }

  for (const parent of nodes) {
    const walker = parent.walker();
    let event;
    while ((event = walker.next())) {
      const { node, entering } = event;
      if (entering) {
        const [startLine, startCh] = node.sourcepos![0];
        const [endLine, endCh] = node.sourcepos![1];
        const start = { line: startLine - 1, ch: startCh - 1 };
        const end = { line: endLine - 1, ch: endCh };
        const token = tokenTypes[node.type as keyof TokenTypes];

        if (token) {
          cm.markText(start, end, { className: `cm-${token}` });
        }
      }
    }
  }
});

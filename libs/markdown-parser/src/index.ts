import codemirror from 'codemirror';
import { MarkdownDocument } from './document';
import 'codemirror/lib/codemirror.css';
import './index.css';

const editorEl = document.createElement('div');
editorEl.className = 'editor-area';
document.body.appendChild(editorEl);

const cm = codemirror(editorEl, { lineNumbers: true });
const mdDoc = new MarkdownDocument();

// @ts-ignore
cm.on('change', ({ doc }, changeObj) => {
  console.log('doc', doc);
  console.log('changeObj', changeObj);
  // refresh(doc);
});

// function refresh(doc) {
//   parse(doc.getValue());

//   const root = getRootNode();
//   highlight(doc, root);
//   treeEl.innerText = xmlWriter.render(root);
//   previewEl.innerHTML = htmlWriter.render(root);
// }

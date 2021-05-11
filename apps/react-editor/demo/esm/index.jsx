import React from 'react';
import ReactDOM from 'react-dom';
import { Editor } from '/dist/index.js';
import '@toast-ui/editor/dist/toastui-editor.css';

ReactDOM.render(
  <>
    <Editor />
  </>,
  document.getElementById('editor')
);

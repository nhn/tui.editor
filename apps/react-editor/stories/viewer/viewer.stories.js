import React from 'react';
import 'codemirror/lib/codemirror.css';
import 'highlight.js/styles/github.css';
import '@toast-ui/editor/dist/tui-editor.css';
import '@toast-ui/editor/dist/tui-editor-contents.min.css';

import '@toast-ui/editor/dist/tui-editor-extScrollSync';
import '@toast-ui/editor/dist/tui-editor-extColorSyntax';
import '@toast-ui/editor/dist/tui-editor-extUML';
import '@toast-ui/editor/dist/tui-editor-extChart';
import '@toast-ui/editor/dist/tui-editor-extTable';

import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { basicViewerDummy } from './dummyData';
import { Viewer } from '../../src/index';

const stories = storiesOf('Viewer', module).addDecorator(withKnobs);

stories.add('basic', () => {
  const { content } = basicViewerDummy;

  return (
    <Viewer
      height="500px"
      initialValue={content}
      exts={[
        {
          name: 'chart',
          minWidth: 100,
          maxWidth: 600,
          minHeight: 100,
          maxHeight: 300
        },
        'scrollSync',
        'colorSyntax',
        'uml',
        'mark',
        'table'
      ]}
    />
  );
});

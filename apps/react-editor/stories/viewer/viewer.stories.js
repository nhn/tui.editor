import React from 'react';
import 'codemirror/lib/codemirror.css';
import 'highlight.js/styles/github.css';
import 'tui-editor/dist/tui-editor.css';
import 'tui-editor/dist/tui-editor-contents.min.css';

import 'tui-editor/dist/tui-editor-extScrollSync'
import 'tui-editor/dist/tui-editor-extColorSyntax'
import 'tui-editor/dist/tui-editor-extUML'
import 'tui-editor/dist/tui-editor-extChart'
import 'tui-editor/dist/tui-editor-extTable'

import {storiesOf} from '@storybook/react';
import {withKnobs} from '@storybook/addon-knobs';
import {basicViewerDummy} from './dummyData';
import {Viewer} from '../../src/index';

const stories = storiesOf('Viewer', module).addDecorator(withKnobs);

stories.add('basic', () => {
  const {content} = basicViewerDummy;

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

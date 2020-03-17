import React from 'react';
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';

import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { basicViewerDummy } from './dummyData';
import { Viewer } from '../../src/index';

const stories = storiesOf('Viewer', module).addDecorator(withKnobs);

stories.add('basic', () => {
  const { content } = basicViewerDummy;

  return <Viewer height="500px" initialValue={content} />;
});

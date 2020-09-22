import React from 'react';
import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';

import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { basicViewerDummy } from '../viewer/dummyData';
import { Editor } from '../../src/index';
import '@toast-ui/editor/dist/i18n/ko-kr';

const stories = storiesOf('Editor', module).addDecorator(withKnobs);

stories.add('demo', () => {
  const { content } = basicViewerDummy;

  return (
    <Editor
      initialValue={content}
      previewStyle="vertical"
      height="600px"
      initialEditType="markdown"
      useCommandShortcut={true}
    />
  );
});

stories.add('customize toolbar', () => (
  <Editor
    previewStyle="vertical"
    height="400px"
    initialEditType="markdown"
    initialValue="hello customize toolbar"
    toolbarItems={['heading', 'bold', 'italic']}
  />
));

stories.add('customize feature', () => {
  class Story extends React.Component {
    ref = React.createRef();

    handleClick = () => {
      this.ref.current.getInstance().exec('Bold');
    };

    render() {
      return (
        <>
          <Editor
            previewStyle="vertical"
            height="400px"
            initialEditType="markdown"
            initialValue="hello customize toolbar"
            ref={this.ref}
          />
          <button onClick={this.handleClick}>make bold</button>
        </>
      );
    }
  }

  return <Story />;
});

stories.add('i18n', () => (
  <Editor
    previewStyle="vertical"
    height="400px"
    initialEditType="markdown"
    initialValue="i18n ko"
    language="ko-KR"
  />
));

stories.add('dynamically change react state', () => {
  class Story extends React.Component {
    ref = React.createRef();

    state = {
      content: '',
      height: 400,
      previewStyle: 'vertical',
      editType: 'markdown'
    };

    togglePreviewStyle = () => {
      this.setState(prevState => ({
        ...prevState,
        previewStyle: prevState.previewStyle === 'vertical' ? 'tab' : 'vertical'
      }));
    };

    changeHeight = () => {
      this.setState(prevState => ({
        ...prevState,
        height: prevState.height + 100
      }));
    };

    render() {
      return (
        <>
          <Editor
            previewStyle={this.state.previewStyle}
            height={`${this.state.height}px`}
            initialEditType={this.state.editType}
            initialContent={this.state.content}
            ref={this.ref}
          />
          <button onClick={this.togglePreviewStyle}>toggle preview style</button>
          <button onClick={this.changeHeight}>change height</button>
        </>
      );
    }
  }

  return <Story />;
});

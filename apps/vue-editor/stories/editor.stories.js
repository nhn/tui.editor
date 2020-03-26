import {storiesOf} from '@storybook/vue';
import {withKnobs} from '@storybook/addon-knobs';
import {html} from 'common-tags';
import * as dummy from './dummyData';

import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';

import Editor from '../src/Editor.vue';

const stories = storiesOf('Editor', module).addDecorator(withKnobs);

stories.add('Demo', () => ({
  components: {
    Editor
  },
  template: `<editor :initialValue="initialValue" previewStyle="tab" height="600px" />`,
  data() {
    return {
      initialValue: dummy.content
    };
  }
}));

stories.add('Event', () => ({
  components: {
    Editor
  },
  template: html`
    <editor
      height="600px"
      @load="onLoad"
      @focus="onFocus"
      @blur="onBlur"
      @change="onChange"
      @stateChange="onStateChange"
    />
  `,
  /* eslint-disable no-console */
  methods: {
    onLoad: () => {
      console.log('onLoad');
    },
    onFocus: () => {
      console.log('onFocus');
    },
    onBlur: () => {
      console.log('onBlur');
    },
    onChange: () => {
      console.log('onChange');
    },
    onStateChange: () => {
      console.log('onStateChange');
    }
  }
}));

stories.add('change props', () => ({
  components: {
    Editor
  },
  template: html`
    <div>
      <editor
        :initialValue="initialValue"
        :initialEditType="initialEditType"
        :previewStyle="previewStyle"
        height="300px"
        ref="editor"
      />
      <button @click="changePreviewStyle">changePreviewStyle</button>
    </div>
  `,
  data() {
    return {
      initialEditType: 'markdown',
      initialValue: dummy.content,
      previewStyle: 'tab'
    };
  },
  methods: {
    changePreviewStyle() {
      this.previewStyle = this.previewStyle === 'tab' ? 'vertical' : 'tab';
    }
  }
}));

stories.add('invoke method', () => ({
  components: {
    Editor
  },
  template: html`
    <div>
      <editor ref="editorRef" :initialValue="initialValue" :initialEditType="initialEditType" height="300px" />
      <button @click="scrollTop">scrollTop(100)</button>
      <button @click="reset">reset</button>
    </div>
  `,
  data() {
    return {
      initialValue: dummy.content,
      initialEditType: 'markdown',
      previewStyle: 'tab'
    };
  },
  methods: {
    scrollTop() {
      this.$refs.editorRef.invoke('scrollTop', 100);
    },
    reset() {
      this.$refs.editorRef.invoke('reset');
    }
  }
}));

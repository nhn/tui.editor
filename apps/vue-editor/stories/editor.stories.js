import { storiesOf } from '@storybook/vue';
import { withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { html } from 'common-tags';
import * as dummy from './dummyData';

import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.min.css';
import '@toast-ui/editor/dist/toastui-editor-contents.min.css';

import Editor from '../src/Editor.vue';

const stories = storiesOf('Editor', module).addDecorator(withKnobs);

stories.add('Demo', () => ({
  components: {
    Editor
  },
  template: `<editor :value="content" :options="editorOptions" previewStyle="tab" height="600px" />`,
  data() {
    return {
      content: dummy.content,
      editorOptions: {}
    };
  }
}));

stories.add('Event', () => ({
  components: {
    Editor
  },
  template: html`
    <editor
      @load="onLoad"
      @focus="onFocus"
      @blur="onBlur"
      @change="onChange"
      @stateChange="onStateChange"
    />
  `,
  methods: {
    onLoad: action('onLoad'),
    onFocus: action('onFocus'),
    onBlur: action('onBlur'),
    onChange: action('onChange'),
    onStateChange: action('onStateChange')
  }
}));

stories.add('change props', () => ({
  components: {
    Editor
  },
  template: html`
    <div>
      <editor
        :value="content"
        :options="editorOptions"
        :previewStyle="previewStyle"
        :mode="mode"
        height="300px"
      />
      <button @click="changeValue">changeValue</button>
      <button @click="changePreviewStyle">changePreviewStyle</button>
      <button @click="changeMode">changeMode</button>
    </div>
  `,
  data() {
    return {
      content: dummy.content,
      editorOptions: {},
      mode: 'markdown',
      previewStyle: 'tab'
    };
  },
  methods: {
    changeValue() {
      this.content = 'TOAST UI Editor';
    },
    changePreviewStyle() {
      this.previewStyle = this.previewStyle === 'tab' ? 'vertical' : 'tab';
    },
    changeMode() {
      this.mode = this.mode === 'markdown' ? 'wysiwyg' : 'markdown';
    }
  }
}));

stories.add('v-model', () => ({
  components: {
    Editor
  },
  template: html`
    <div>
      <editor v-model="content" height="300px" />
      <p style="white-space: pre-line">Editor Input Data {{ content }}</p>
    </div>
  `,
  data() {
    return {
      content: ''
    };
  }
}));

stories.add('invoke method', () => ({
  components: {
    Editor
  },
  template: html`
    <div>
      <editor ref="editorRef" :value="content" height="300px" />
      <button @click="getHtml">getHtml</button>
      <button @click="scrollTop">scrollTop(100)</button>
      <button @click="reset">reset</button>
      <p>getHtml result : {{ html }}</p>
    </div>
  `,
  data() {
    return {
      content: dummy.content,
      editorOptions: {},
      mode: 'markdown',
      previewStyle: 'tab',
      html: ''
    };
  },
  methods: {
    getHtml() {
      this.html = this.$refs.editorRef.invoke('getHtml');
    },
    scrollTop() {
      this.$refs.editorRef.invoke('scrollTop', 100);
    },
    reset() {
      this.$refs.editorRef.invoke('reset');
    }
  }
}));

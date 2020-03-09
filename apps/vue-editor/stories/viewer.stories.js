import { storiesOf } from '@storybook/vue';
import { html } from 'common-tags';
import * as dummy from './dummyData';

import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.min.css';
import '@toast-ui/editor/dist/toastui-editor-contents.min.css';

import Viewer from '../src/Viewer.vue';

const stories = storiesOf('Viewer', module);

stories.add('demo', () => ({
  components: {
    Viewer
  },
  template: `<Viewer :value="content" />`,
  data() {
    return {
      content: dummy.content
    };
  }
}));

stories.add('change value prop', () => ({
  components: {
    Viewer
  },
  template: html`
    <div>
      <button @click="changeValue">changeValue</button>
      <Viewer :value="content" />
    </div>
  `,
  data() {
    return {
      content: dummy.content
    };
  },
  methods: {
    changeValue() {
      this.content = 'TOAST UI Editor';
    }
  }
}));

stories.add('invoke method', () => ({
  components: {
    Viewer
  },
  template: html`
    <div>
      <button @click="setValue">setValue</button>
      <Viewer ref="viewer" :value="content" />
    </div>
  `,
  data() {
    return {
      content: dummy.content
    };
  },
  methods: {
    setValue() {
      this.$refs.viewer.invoke('setValue', 'TOAST UI Editor');
    }
  }
}));

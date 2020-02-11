import { storiesOf } from '@storybook/vue';
import { html } from 'common-tags';
import * as dummy from './dummyData';

import 'codemirror/lib/codemirror.css';
import 'highlight.js/styles/github.css';
import '@toast-ui/editor/dist/tui-editor.min.css';
import '@toast-ui/editor/dist/tui-editor-contents.min.css';

import '@toast-ui/editor/dist/tui-editor-extColorSyntax';
import '@toast-ui/editor/dist/tui-editor-extUML';
import '@toast-ui/editor/dist/tui-editor-extChart';
import '@toast-ui/editor/dist/tui-editor-extTable';

import Viewer from '../src/Viewer.vue';

const stories = storiesOf('Viewer', module);

stories.add('demo', () => ({
  components: {
    Viewer
  },
  template: `<Viewer :value="content" :exts="exts" />`,
  data() {
    return {
      content: dummy.content,
      exts: [
        {
          name: 'chart',
          minWidth: 100,
          maxWidth: 600,
          minHeight: 100,
          maxHeight: 300
        },
        'colorSyntax',
        'uml',
        'mark',
        'table'
      ]
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
      <Viewer :value="content" :exts="exts" />
    </div>
  `,
  data() {
    return {
      content: dummy.content,
      exts: [
        {
          name: 'chart',
          minWidth: 100,
          maxWidth: 600,
          minHeight: 100,
          maxHeight: 300
        },
        'colorSyntax',
        'uml',
        'mark',
        'table'
      ]
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
      <Viewer ref="viewer" :value="content" :exts="exts" />
    </div>
  `,
  data() {
    return {
      content: dummy.content,
      exts: [
        {
          name: 'chart',
          minWidth: 100,
          maxWidth: 600,
          minHeight: 100,
          maxHeight: 300
        },
        'colorSyntax',
        'uml',
        'mark',
        'table'
      ]
    };
  },
  methods: {
    setValue() {
      this.$refs.viewer.invoke('setValue', 'TOAST UI Editor');
    }
  }
}));

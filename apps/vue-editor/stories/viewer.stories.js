import {storiesOf} from '@storybook/vue';
import {html} from 'common-tags';
import * as dummy from './dummyData';

import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';

import Viewer from '../src/Viewer.vue';

const stories = storiesOf('Viewer', module);

stories.add('demo', () => ({
  components: {
    Viewer
  },
  template: `<Viewer :initialValue="initialValue" />`,
  data() {
    return {
      initialValue: dummy.content
    };
  }
}));

stories.add('invoke method', () => ({
  components: {
    Viewer
  },
  template: html`
    <div>
      <button @click="setMarkdown">setMarkdown</button>
      <Viewer ref="viewer" :initialValue="initialValue" />
    </div>
  `,
  data() {
    return {
      initialValue: dummy.content
    };
  },
  methods: {
    setMarkdown() {
      this.$refs.viewer.invoke('setMarkdown', 'TOAST UI Editor');
    }
  }
}));

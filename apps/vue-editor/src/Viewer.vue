<template>
  <div ref="toastuiEditorViewer"></div>
</template>
<script>
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import { optionsMixin } from './mixin/option';

export default {
  name: 'ToastuiEditorViewer',
  mixins: [optionsMixin],
  props: {
    height: {
      type: String
    },
    initialValue: {
      type: String
    },
    options: {
      type: Object
    }
  },
  mounted() {
    const options = { ...this.computedOptions, el: this.$refs.toastuiEditorViewer };
    this.editor = new Viewer(options);
  },
  methods: {
    getRootElement() {
      return this.$refs.toastuiEditorViewer;
    }
  }
};
</script>

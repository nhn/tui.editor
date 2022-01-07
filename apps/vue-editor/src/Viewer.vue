<template>
  <div ref="toastuiEditorViewer"></div>
</template>
<script>
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
import { optionsMixin } from './mixin/option';

export default {
  name: 'ToastuiEditorViewer',
  emits: ['rendered'],
  mixins: [optionsMixin],
  props: {
    height: {
      type: String,
    },
    initialValue: {
      type: String,
    },
    options: {
      type: Object,
    },
  },
  mounted() {
    const options = {
      ...this.computedOptions,
      el: this.$refs.toastuiEditorViewer,
    };

    this.editor = new Viewer(options);
    this.$emit('rendered', { viewer: this.$refs.toastuiEditorViewer });
  },
  updated() {
    const options = {
      ...this.computedOptions,
      el: this.$refs.toastuiEditorViewer,
    };

    options.initialValue = this.initialValue;
    this.editor = new Viewer(options);

    this.$emit('rendered', { viewer: this.$refs.toastuiEditorViewer });
  },
  methods: {
    getRootElement() {
      return this.$refs.toastuiEditorViewer;
    },
  },
};
</script>

<template>
  <div ref="toastuiEditor"></div>
</template>
<script>
import Editor from '@toast-ui/editor';
import { optionsMixin } from './mixin/option';

export default {
  name: 'ToastuiEditor',
  mixins: [optionsMixin],
  props: {
    previewStyle: {
      type: String
    },
    height: {
      type: String
    },
    initialEditType: {
      type: String
    },
    initialValue: {
      type: String
    },
    options: {
      type: Object
    }
  },
  watch: {
    previewStyle(newValue) {
      this.editor.changePreviewStyle(newValue);
    },
    height(newValue) {
      this.editor.height(newValue);
    }
  },
  mounted() {
    const options = { ...this.computedOptions, el: this.$refs.toastuiEditor };
    this.editor = new Editor(options);
  },
  methods: {
    getRootElement() {
      return this.$refs.toastuiEditor;
    }
  }
};
</script>

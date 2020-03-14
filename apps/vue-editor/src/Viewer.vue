<template>
  <div ref="toastuiEditorViewer"></div>
</template>
<script>
import Editor from '@toast-ui/editor';

import editorEvents from './editorEvents';

export default {
  name: 'ToastuiEditorViewer',
  props: {
    height: {
      type: String
    },
    value: {
      type: String
    }
  },
  data() {
    return {
      editor: null
    };
  },
  watch: {
    value(val, preVal) {
      if (val !== preVal) {
        this.editor.setValue(val);
      }
    }
  },
  mounted() {
    const eventOption = {};
    editorEvents.forEach(event => {
      eventOption[event] = (...args) => {
        this.$emit(event, ...args);
      };
    });

    this.editor = Editor.factory({
      el: this.$refs.toastuiEditorViewer,
      events: eventOption,
      initialValue: this.value,
      height: this.height,
      viewer: true
    });
  },
  destroyed() {
    editorEvents.forEach(event => {
      this.editor.off(event);
    });
    this.editor.remove();
  },
  methods: {
    invoke(methodName, ...args) {
      let result = null;
      if (this.editor[methodName]) {
        result = this.editor[methodName](...args);
      }

      return result;
    },
    getRootElement() {
      return this.$refs.toastuiEditorViewer;
    }
  }
};
</script>

<template>
  <div ref="tuiEditorViewer"></div>
</template>
<script>
import Editor from 'tui-editor';

import editorEvents from './editorEvents';

export default {
  name: 'TuiEditorViewer',
  props: {
    height: {
      type: String
    },
    value: {
      type: String
    },
    exts: {
      type: Array
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
      el: this.$refs.tuiEditorViewer,
      exts: this.exts,
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
    }
  }
};
</script>

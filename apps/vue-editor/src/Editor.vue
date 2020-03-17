<template>
  <div ref="toastuiEditor"></div>
</template>
<script>
import Editor from '@toast-ui/editor';
import editorEvents from './editorEvents';
import valueUpdateMethod from './valueUpdateMethod';

export default {
  name: 'ToastuiEditor',
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
  data() {
    return {
      editor: null
    };
  },
  computed: {
    editorOptions() {
      const options = Object.assign({}, this.options);
      options.initialEditType = this.initialEditType || 'markdown';
      options.initialValue = this.initialValue || '';
      options.height = this.height;
      options.previewStyle = this.previewStyle;

      return options;
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
    const eventOption = {};
    editorEvents.forEach(event => {
      eventOption[event] = (...args) => {
        this.$emit(event, ...args);
      };
    });

    const options = Object.assign(this.editorOptions, {
      el: this.$refs.toastuiEditor,
      events: eventOption
    });

    this.editor = new Editor(options);
    if (this.$listeners.input) {
      this.editor.on('change', () => {
        this.$emit('input', this.editor.getValue());
      });
    }
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
        if (valueUpdateMethod.indexOf(methodName) > -1) {
          this.$emit('input', this.editor.getValue());
        }
      }

      return result;
    },
    getRootElement() {
      return this.$refs.toastuiEditor;
    }
  }
};
</script>

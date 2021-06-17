const editorEvents = [
  'load',
  'change',
  'caretChange',
  'focus',
  'blur',
  'keydown',
  'keyup',
  'beforePreviewRender',
  'beforeConvertWysiwygToMarkdown',
];
const defaultValueMap = {
  initialEditType: 'markdown',
  initialValue: '',
  height: '300px',
  previewStyle: 'vertical',
};

export const optionsMixin = {
  data() {
    const eventOptions = {};

    editorEvents.forEach((event) => {
      eventOptions[event] = (...args) => {
        this.$emit(event, ...args);
      };
    });
    const options = {
      ...this.options,
      initialEditType: this.initialEditType,
      initialValue: this.initialValue,
      height: this.height,
      previewStyle: this.previewStyle,
      events: eventOptions,
    };

    Object.keys(defaultValueMap).forEach((key) => {
      if (!options[key]) {
        options[key] = defaultValueMap[key];
      }
    });

    return { editor: null, computedOptions: options };
  },
  methods: {
    invoke(methodName, ...args) {
      let result = null;

      if (this.editor[methodName]) {
        result = this.editor[methodName](...args);
      }

      return result;
    },
  },
  destroyed() {
    editorEvents.forEach((event) => {
      this.editor.off(event);
    });
    this.editor.destroy();
  },
};

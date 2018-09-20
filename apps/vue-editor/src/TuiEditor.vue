<template>
    <div ref="tuiEditor"></div>
</template>

<script>
import 'tui-editor/dist/tui-editor.css';
import 'tui-editor/dist/tui-editor-contents.css';
import 'codemirror/lib/codemirror.css';
import Editor from 'tui-editor';

const editorEvents = [
    'load',
    'change',
    'stateChange',
    'focus',
    'blur'
];

const editorDefaultOptions = {
    minHeight: '200px',
    language: 'en_US',
    useCommandShortcut: true,
    useDefaultHTMLSanitizer: true,
    usageStatistics: true,
    hideModeSwitch: false,
    toolbarItems: [
        'heading',
        'bold',
        'italic',
        'strike',
        'divider',
        'hr',
        'quote',
        'divider',
        'ul',
        'ol',
        'task',
        'indent',
        'outdent',
        'divider',
        'table',
        'image',
        'link',
        'divider',
        'code',
        'codeblock'
    ]
};

const valueUpdateMethod = [
    'insertText',
    'setValue',
    'setMarkdown',
    'setHtml',
    'reset'
];

export default {
    name: 'TuiEditor',
    props: {
        previewStyle: {
            type: String,
            defalut: 'tab'
        },
        height: {
            type: String,
            defalut: '300px'
        },
        value: {
            type: String,
            defalut: ''
        },
        mode: {
            type: String,
            defalut: 'markdown'
        },
        options: {
            tpye: Object,
            default: function() {
                return editorDefaultOptions;
            }
        },
        html: {
            type: String
        },
        visible: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            editor: null
        };
    },
    computed: {
        editorOptions() {
            let options = Object.assign({}, editorDefaultOptions, this.options);
            options.initialValue = this.value;
            options.initialEditType = this.mode;
            options.height = this.height;
            options.previewStyle = this.previewStyle;

            return options;
        }
    },
    watch: {
        previewStyle: function(newValue) {
            this.editor.changePreviewStyle(newValue);
        },
        value: function(newValue, preValue) {
            if (newValue !== preValue && newValue !== this.editor.getValue()) {
                this.editor.setValue(newValue);
            }
        },
        height: function(newValue) {
            this.editor.height(newValue);
        },
        mode: function(newValue) {
            this.editor.changeMode(newValue);
        },
        html: function(newValue) {
            this.editor.setHtml(newValue);
            this.$emit('input', this.editor.getValue());
        },
        visible: function(newValue) {
            if (newValue) {
                this.editor.show();
            } else {
                this.editor.hide();
            }
        }
    },
    mounted() {
        let eventOption = {};
        editorEvents.forEach(event => {
            eventOption[event] = (...args) => {
                this.$emit(event, ...args);
            };
        });

        let options = Object.assign(this.editorOptions, {
            el: this.$refs.tuiEditor,
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
        }
    }
};
</script>

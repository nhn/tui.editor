<template>
    <div ref="tuiEditorViewer"></div>
</template>

<script>
import 'tui-editor/dist/tui-editor.css';
import 'tui-editor/dist/tui-editor-contents.css';
import 'codemirror/lib/codemirror.css';
import Viewer from 'tui-editor/dist/tui-editor-Viewer';

const editorEvents = [
    'load',
    'change',
    'stateChange',
    'focus',
    'blur'
];

export default {
    name: 'TuiEditorViewer',
    props: {
        height: {
            type: String,
            defalut: '300px'
        },
        value: {
            type: String,
            defalut: ''
        }
    },
    data() {
        return {
            editor: null
        };
    },
    watch: {
        value: function(val, preVal) {
            if (val !== preVal) {
                this.editor.setValue(val);
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

        this.editor = new Viewer({
            el: this.$refs.tuiEditorViewer,
            events: eventOption,
            initialValue: this.value,
            height: this.height
        });
    },
    destroyed() {
        editorEvents.forEach(event => {
            this.editor.off(event);
        });
        this.editor.remove();
    }
};
</script>

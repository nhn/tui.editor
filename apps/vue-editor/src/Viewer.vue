<template>
    <div ref="tuiEditorViewer"></div>
</template>
<script>
import Viewer from 'tui-editor/dist/tui-editor-Viewer';

import editorEvents from './editorEvents';

export default {
    name: 'TuiEditorViewer',
    props: {
        height: {
            type: String,
            default: '300px'
        },
        value: {
            type: String,
            default: ''
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

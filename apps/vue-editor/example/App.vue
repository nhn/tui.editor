<template>
  <div class="container">
    <h1>🍞📝Toast UI Markdown Editor + Vue</h1>
    <editor
    ref="tuiEditor"
    v-model="editorText"
    :options="editorOptions"
    :html="editorHtml"
    :mode="editorMode"
    :previewStyle="editorPreviewStyle"
    @load="onEditorLoad"
    @focus="onEditorFocus"
    @blur="onEditorBlur"
    @change="onEditorChange"
    @stateChange="onEditorStateChange"
    />
    <div>
        <h3>Props Test Buttons</h3>
        <button @click="changeText">changeText</button>
        <button @click="changeHtml">changeHtml</button>
        <button @click="changeMode">changeMode</button>
        <button @click="changePreviewStyle">changePreviewStyle</button>
    </div>
    <div>
        <h3>Function Test Buttons</h3>
        <button v-for="method in methodNames" :key="method" @click="methodInvoke(method)">
            {{ method }}
        </button>
        <p>Function Result : {{ message }}</p>
    </div>
    <viewer
    class="viewer"
    :value="viewerText"
    />
  </div>
</template>

<script>
import {Editor, Viewer} from '../src/index.js';

const eventListenr = [
    'onEditorLoad',
    'onEditorFocus',
    'onEditorBlur',
    'onEditorChange',
    'onEditorStateChange'
].reduce((methods, methodName) => {
    methods[methodName] = function() {
        // eslint-disable-next-line no-console
        console.log(`[editor] ${methodName}`);
    };

    return methods;
}, {});

export default {
    components: {
        Editor,
        Viewer
    },
    data() {
        return {
            message: '',
            methodNames: [
                'focus',
                'getValue',
                'getHtml',
                'getSelectedText',
                'moveCursorToStart',
                'moveCursorToEnd',
                'reset'
            ],
            viewerText: '# TOAST UI Markdown Viewer + Vue\n This is Viewer.',
            editorText: 'This is initialValue.',
            editorOptions: {
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
            },
            editorHeight: '200px',
            editorHtml: '',
            editorMode: 'markdown',
            editorVisible: true,
            editorPreviewStyle: 'vertical'
        };
    },
    methods: Object.assign(eventListenr, {
        methodInvoke(methodName) {
            this.message = this.$refs.tuiEditor.invoke(methodName);
        },
        changeText() {
            this.editorText += 'hihi';
        },
        changeHtml() {
            this.editorHtml = '<h1>Hi</h1>';
        },
        changeMode() {
            this.editorMode = this.editorMode === 'wysiwyg' ? 'markdown' : 'wysiwyg';
        },
        changePreviewStyle() {
            this.editorPreviewStyle = this.editorPreviewStyle === 'tab' ? 'vertical' : 'tab';
        }
    })
};
</script>

<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/codemirror.css';
@import 'https://uicdn.toast.com/tui-editor/latest/tui-editor-contents.css';
@import 'https://uicdn.toast.com/tui-editor/latest/tui-editor.css';
@import 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/styles/github.min.css';

.container {
  width: 960px;
}
.viewer {
  background-color: lightpink
}
</style>

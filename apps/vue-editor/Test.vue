<template>
  <div class="container">
    <h1>🍞📝Toast UI Markdown Editor + Vue</h1>
    <editor />
  </div>
</template>

<script>
import {Editor} from './src/index.js';

export default {
    components: {
        Editor
    }
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
</style>

<template>
  <div id="app">
    <editor :initialValue="initialValue" height="1000px" />
  </div>
</template>

<script>
import Editor from '@/Editor.vue';
import '@toast-ui/editor/dist/toastui-editor.css';

export default {
  name: 'App',
  components: {
    Editor,
  },
  data() {
    const content = [
      '![image](https://uicdn.toast.com/toastui/img/tui-editor-bi.png)',
      '',
      '# Awesome Editor!',
      '',
      'It has been _released as opensource in 2018_ and has ~~continually~~ evolved to **receive 10k GitHub ⭐️ Stars**.',
      '',
      '## Create Instance',
      '',
      'You can create an instance with the following code and use `getHtml()` and `getMarkdown()` of the [Editor](https://github.com/nhn/tui.editor).',
      '',
      '```js',
      'const editor = new Editor(options);',
      '```',
      '',
      '> See the table below for default options',
      '> > More API information can be found in the document',
      '',
      '| name | type | description |',
      '| --- | --- | --- |',
      '| el | `HTMLElement` | container element |',
      '',
      '## Features',
      '',
      '* CommonMark + GFM Specifications',
      '   * Live Preview',
      '   * Scroll Sync',
      '   * Auto Indent',
      '   * Syntax Highlight',
      '        1. Markdown',
      '        2. Preview',
      '',
      '## Support Wrappers',
      '',
      '> * Wrappers',
      '>    1. [x] React',
      '>    2. [x] Vue',
      '>    3. [ ] Ember',
    ].join('\n');

    return {
      initialValue: content,
    };
  },
  mounted() {},
};
</script>

<style>

</style>

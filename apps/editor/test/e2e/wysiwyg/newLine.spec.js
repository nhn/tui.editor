import editor from '../editorFixture';

fixture`wysiwyg new line`
  .page`http://localhost:8080/examples/example-e2e.html`;

test('should convert BR after links #200', async t => {
  await editor.showWysiwyg();
  await t
    .click(editor.toolbar.link)
    .typeText(editor.popup.linkText, 'test')
    .typeText(editor.popup.linkURL, 'url')
    .click(editor.popup.linkConfirm)
    .pressKey('enter')
    .pressKey('enter');
  await editor.fixWysiwygCaret();
  await t
    .typeText(editor.wysiwyg.blocks.nth(2), 'text')
    .click(editor.tabbar.markdown)
    .expect(editor.markdown.lines.nth(0).textContent).eql('[test](url)')
    .expect(editor.markdown.lines.nth(1).textContent).eql(editor.ZWS)
    .expect(editor.markdown.lines.nth(2).textContent).eql('text');
});

test('should convert BR after code #200', async t => {
  await editor.showWysiwyg();
  await t
    .click(editor.toolbar.code)
    .typeText(editor.wysiwyg.blocks.nth(0), 'test')
    .click(editor.toolbar.code)
    .pressKey('enter')
    .pressKey('enter');
  await editor.fixWysiwygCaret();
  await t
    .typeText(editor.wysiwyg.blocks.nth(2), 'text')
    .click(editor.tabbar.markdown)
    .expect(editor.markdown.lines.nth(0).textContent).eql('`test`')
    .expect(editor.markdown.lines.nth(1).textContent).eql(editor.ZWS)
    .expect(editor.markdown.lines.nth(2).textContent).eql('text');
});

test('should convert BR after span color #200', async t => {
  await editor.showWysiwyg();
  await t
    .typeText(editor.wysiwyg.blocks.nth(0), 'test')
    .pressKey('enter')
    .pressKey('enter');
  await editor.fixWysiwygCaret();
  await t
    .typeText(editor.wysiwyg.blocks.nth(2), 'text')
    .selectText(editor.wysiwyg.blocks.nth(0))
    .click(editor.toolbar.color)
    .click(editor.popup.colorConfirm)
    .click(editor.tabbar.markdown)
    .expect(editor.markdown.lines.nth(0).textContent).eql('<span style="color:#f8f8f8">test</span>')
    .expect(editor.markdown.lines.nth(1).textContent).eql(editor.ZWS)
    .expect(editor.markdown.lines.nth(2).textContent).eql('text');
});

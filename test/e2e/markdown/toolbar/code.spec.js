import editor from '../../editorFixture';

fixture`markdown toolbar code`
  .page`http://localhost:8080/examples/example-e2e.html`;

test('click code button then type text', async t => {
  await t
    .click(editor.toolbar.code)
    .pressKey('t')
    .pressKey('e')
    .pressKey('s')
    .pressKey('t')
    .expect(editor.markdown.lines.nth(0).textContent).eql('`test`')
    .expect(editor.markdown.preview.innerHTML).contains('</code>');
});

test('type text, select the text then click code button', async t => {
  await t
    .click(editor.markdown.lines.nth(0))
    .pressKey('t')
    .pressKey('e')
    .pressKey('s')
    .pressKey('t')
    .pressKey('home')
    .pressKey('shift+end')
    .click(editor.toolbar.code)
    .expect(editor.markdown.lines.nth(0).textContent).eql('`test`')
    .expect(editor.markdown.preview.innerHTML).contains('</code>');
});

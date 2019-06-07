import editor from '../../editorFixture';

fixture`markdown toolbar strike`
  .page`http://localhost:8080/examples/example-e2e.html`;

test('click strike button then type text', async t => {
  await t
    .click(editor.toolbar.strike)
    .pressKey('t')
    .pressKey('e')
    .pressKey('s')
    .pressKey('t')
    .expect(editor.markdown.lines.nth(0).textContent).eql('~~test~~')
    .expect(editor.markdown.preview.innerHTML).contains('<s>');
});

test('type text, select the text then click strike button', async t => {
  await t
    .click(editor.markdown.lines.nth(0))
    .pressKey('t')
    .pressKey('e')
    .pressKey('s')
    .pressKey('t')
    .pressKey('home')
    .pressKey('shift+end')
    .click(editor.toolbar.strike)
    .expect(editor.markdown.lines.nth(0).textContent).eql('~~test~~')
    .expect(editor.markdown.preview.innerHTML).contains('<s>');
});

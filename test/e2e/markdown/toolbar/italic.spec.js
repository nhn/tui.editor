import { Selector, ClientFunction } from 'testcafe';

import editor from '../../editorFixture';

fixture`markdown toolbar italic`
  .page`http://localhost:8080/examples/example13-all-extension-blank.html`;

test('click italic button then type text', async t => {
  await t
    .click(editor.toolbar.italic)
    .pressKey('t')
    .pressKey('e')
    .pressKey('s')
    .pressKey('t')
    .expect(editor.markdown.lines.nth(0).textContent).eql('_test_')
    .expect(editor.markdown.preview.innerHTML).contains('<em>');
});

test('type text, select the text then click italic button', async t => {
  await t
    .click(editor.markdown.lines.nth(0))
    .pressKey('t')
    .pressKey('e')
    .pressKey('s')
    .pressKey('t')
    .pressKey('home')
    .pressKey('shift+end')
    .click(editor.toolbar.italic)
    .expect(editor.markdown.lines.nth(0).textContent).eql('_test_')
    .expect(editor.markdown.preview.innerHTML).contains('<em>');
});

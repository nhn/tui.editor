import editor from '../editorFixture';

fixture`markdown tooltip`
  .page`http://localhost:8080/examples/example-e2e.html`;

test('should change enabled/disabled text according to the button tatus #153', async t => {
  await t
    .hover(editor.toolbar.scrollsync)
    .expect(editor.tooltipText.textContent).eql('Auto scroll enabled')
    .click(editor.toolbar.scrollsync)
    .expect(editor.tooltipText.textContent).eql('Auto scroll disabled');
});

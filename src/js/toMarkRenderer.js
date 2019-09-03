import toMark from 'to-mark';

export default toMark.Renderer.factory(toMark.basicRenderer, {
  'TEXT_NODE': function(node) {
    let managedText = this.trim(this.getSpaceCollapsedText(node.nodeValue));

    managedText = managedText.replace(/[*_~]/g, matched => `\\${matched}`);

    if (this._isNeedEscapeHtml(managedText)) {
      managedText = this.escapeTextHtml(managedText);
    }
    if (this._isNeedEscape(managedText)) {
      managedText = this.escapeText(managedText);
    }

    return this.getSpaceControlled(managedText, node);
  }
});

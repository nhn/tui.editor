import toMark from 'to-mark';

function isElementNode(node) {
  return node && node.nodeType === Node.ELEMENT_NODE;
}

function isTextNode(node) {
  return node && node.nodeType === Node.TEXT_NODE;
}

function isInvalidEmphasisToken(node) {
  const isInvalidOpener = isTextNode(node.previousSibling) && isElementNode(node.firstChild);
  const isInvalidCloser = isTextNode(node.nextSibling) && isElementNode(node.lastChild);

  return isInvalidOpener || isInvalidCloser;
}

function convertEmphasis(node, subContent, token) {
  if (isInvalidEmphasisToken(node)) {
    const tagName = node.nodeName.toLowerCase();

    return `<${tagName}>${subContent}</${tagName}>`;
  }

  return `${token}${subContent}${token}`;
}

export default toMark.Renderer.factory(toMark.gfmRenderer, {
  'EM, I': function(node, subContent) {
    if (this.isEmptyText(subContent)) {
      return '';
    }

    return convertEmphasis(node, subContent, '*');
  },
  'STRONG, B': function(node, subContent) {
    if (this.isEmptyText(subContent)) {
      return '';
    }

    return convertEmphasis(node, subContent, '**');
  }
});

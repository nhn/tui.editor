import toMark from 'to-mark';

function isElementNode(node) {
  return node && node.nodeType === Node.ELEMENT_NODE;
}

function isTextNode(node) {
  return node && node.nodeType === Node.TEXT_NODE;
}

/**
 * Check if given node is valid delimiter run.
 * According to common-mark spec, following examples are not valid delimiter runs.
 * 1. opening (*|**) preceded by an alphanumeric and followed by a punctuation.
 *    (ex: a**~~c~~b**)
 * 2. closing (*|**) preceded by a punctuation and followed by an alphanumeric.
 *    (ex: **b~~c~~**a)
 * @See {@link https://spec.commonmark.org/0.29/#delimiter-run}
 * @See {@link https://github.com/commonmark/commonmark-spec/issues/611#issuecomment-533578503}
 **/
function isValidDelimiterRun(node) {
  const isInvalidOpener = isTextNode(node.previousSibling) && isElementNode(node.firstChild);
  const isInvalidCloser = isTextNode(node.nextSibling) && isElementNode(node.lastChild);

  return !isInvalidOpener && !isInvalidCloser;
}

function convertEmphasis(node, subContent, token) {
  if (isValidDelimiterRun(node)) {
    return `${token}${subContent}${token}`;
  }

  const tagName = node.nodeName.toLowerCase();

  return `<${tagName}>${subContent}</${tagName}>`;
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

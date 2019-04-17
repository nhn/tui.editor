// Copyright (c) 2014, Vitaly Puzrin.
// Distributed under an MIT license: https://github.com/markdown-it/markdown-it-for-inline
/* eslint-disable */

/**
 * @fileoverview Implements markdownItLinkPlugin
 * @modifier NHN FE Development Lab <dl_javascript@nhn.com>
 */

function for_inline_plugin(md, ruleName, tokenType, iteartor) {

  function scan(state) {
    var i, blkIdx, inlineTokens;

    for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
      if (state.tokens[blkIdx].type !== 'inline') {
        continue;
      }

      inlineTokens = state.tokens[blkIdx].children;

      for (i = inlineTokens.length - 1; i >= 0; i--) {
        if (inlineTokens[i].type !== tokenType) {
          continue;
        }

        iteartor(inlineTokens, i);
      }
    }
  }

  md.core.ruler.push(ruleName, scan);
};

export const linkAttribute = function(markdownit, iteartor) {
  for_inline_plugin(markdownit, 'url_attribute', 'link_open', iteartor);
};

// Copyright (c) 2014 Vitaly Puzrin, Alex Kocharin.
// Distributed under MIT license: https://github.com/markdown-it/markdown-it/
/**
 * @fileoverview Implements markdownitBackticksRenderer
 * @modifier NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
/* eslint-disable */

// Parse backticks
module.exports = function backtick(state, silent) {
  var start, max, marker, matchStart, matchEnd, token,
      pos = state.pos,
      ch = state.src.charCodeAt(pos);

  if (ch !== 0x60/* ` */) { return false; }

  start = pos;
  pos++;
  max = state.posMax;

  while (pos < max && state.src.charCodeAt(pos) === 0x60/* ` */) { pos++; }

  marker = state.src.slice(start, pos);

  matchStart = matchEnd = pos;

  while ((matchStart = state.src.indexOf('`', matchEnd)) !== -1) {
    matchEnd = matchStart + 1;

    while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x60/* ` */) { matchEnd++; }

    if (matchEnd - matchStart === marker.length) {
      if (!silent) {
        token         = state.push('code_inline', 'code', 0);
        token.markup  = marker;
        token.content = state.src.slice(pos, matchStart)
                                 .replace(/[ \n]+/g, ' ')
                                 .trim();
        // TUI.EDITOR MODIFICATION START
        // store number of backtick in data-backtick
        // https://github.nhnent.com/fe/tui.editor/pull/981
        token.attrSet('data-backticks', token.markup.length);
        // TUI.EDITOR MODIFICATION END
      }
      state.pos = matchEnd;
      return true;
    }
  }

  if (!silent) { state.pending += marker; }
  state.pos += marker.length;
  return true;
};

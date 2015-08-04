(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */
'use strict';

var UIController = require('./uicontroller');

var util = ne.util;

/**
 * Button
 * initialize button
 * @exports Button
 * @augments UIController
 * @constructor
 * @class
 * @param {object} options 옵션
 * @param {string} options.className 만들어진 RootElement에 추가할 클래스
 * @param {string} options.command 클릭되면 실행될 커맨드명
 * @param {string} options.text 버튼안에 들어갈 텍스트
 * @param {string} options.style 추가적으로 적용될 CSS스타일
 */
function Button(options) {
    UIController.call(this, {
        tagName: 'button',
        className: options.className
    });

    this.command = options.command;
    this.event = options.event;
    this.text = options.text;
    this.style = options.style;

    this.render();
}

Button.prototype = util.extend(
    {},
    UIController.prototype
);

/**
 * Button의 모습을 그린다
 */
Button.prototype.render = function() {
    this.$el.text(this.text);
    this.$el.attr('type', 'button');

    if (this.style) {
        this.$el.attr('style', this.style);
    }

    this.attachEvents({
        'click': '_onClick'
    });
};

/**
 * _onClick
 * Click event handler
 */
Button.prototype._onClick = function() {
    if (this.command) {
        this.trigger('command', this.command);
    } else {
        this.trigger('event', this.event);
    }
};

module.exports = Button;

},{"./uicontroller":38}],2:[function(require,module,exports){
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
'use strict';

/*eslint-disable */
var listRE = /^(\s*)(>[> ]*|[*+-]\s(?:\[(?:x|\s)\]\s)?|(\d+)([.)]\s(?:\[(?:x|\s)\]\s)?))(\s*)/,
    emptyListRE = /^(\s*)(>[> ]*|[*+-]\s(?:\[(?:x|\s)\]\s)?|(\d+)([.)]\s(?:\[(?:x|\s)\]\s)?))(\s*)$/,
    unorderedListRE = /[*+-]\s/;

CodeMirror.commands.subListIndentTab = function (cm) {
    if (cm.getOption("disableInput")) return CodeMirror.Pass;
    var ranges = cm.listSelections();
    for (var i = 0; i < ranges.length; i++) {
        var pos = ranges[i].head;
        var line = cm.getLine(pos.line);
        if (emptyListRE.test(line)) {
            cm.replaceRange("\t" + line, {
                line: pos.line, ch: 0
            }, {
                line: pos.line, ch: line.length
            });
        } else {
            if (cm.somethingSelected()) cm.indentSelection("add");
            else cm.execCommand("insertTab");
        }
    }
};

CodeMirror.commands.newlineAndIndentContinueMarkdownList = function(cm) {
    if (cm.getOption("disableInput")) return CodeMirror.Pass;
    var ranges = cm.listSelections(), replacements = [];
    for (var i = 0; i < ranges.length; i++) {
        var pos = ranges[i].head;
        var eolState = cm.getStateAfter(pos.line);
        var inList = eolState.list !== false;
        var inQuote = eolState.quote !== 0;

        var line = cm.getLine(pos.line), match = listRE.exec(line);
        if (!ranges[i].empty() || (!inList && !inQuote) || !match) {
            cm.execCommand("newlineAndIndent");
            return;
        }
        if (emptyListRE.test(line)) {
            cm.replaceRange("", {
                line: pos.line, ch: 0
            }, {
                line: pos.line, ch: pos.ch + 1
            });
            replacements[i] = "\n";
        } else {
            var indent = match[1], after = match[5], bullet;
            if (indent.length === pos.ch) {
                bullet = "";
            } else if (unorderedListRE.test(match[2]) || match[2].indexOf(">") >= 0) {
                bullet = match[2];
            } else {
                bullet = (parseInt(match[3], 10) + 1) + match[4];
            }
            replacements[i] = "\n" + indent + bullet + after;
        }
    }

    cm.replaceSelections(replacements);
};
/*eslint-enable */

},{}],3:[function(require,module,exports){
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

'use strict';

/*eslint-disable */
CodeMirror.defineMode("gfm", function(config, modeConfig) {
  var codeDepth = 0;
  function blankLine(state) {
    state.code = false;
    return null;
  }
  var gfmOverlay = {
    startState: function() {
      return {
        code: false,
        codeBlock: false,
        ateSpace: false
      };
    },
    copyState: function(s) {
      return {
        code: s.code,
        codeBlock: s.codeBlock,
        ateSpace: s.ateSpace
      };
    },
    token: function(stream, state) {
      state.combineTokens = null;

      // Hack to prevent formatting override inside code blocks (block and inline)
      if (state.codeBlock) {
        if (stream.match(/^```/)) {
          state.codeBlock = false;
          return null;
        }
        stream.skipToEnd();
        return null;
      }
      if (stream.sol()) {
        state.code = false;
      }
      if (stream.sol() && stream.match(/^```/)) {
        stream.skipToEnd();
        state.codeBlock = true;
        return null;
      }
      // If this block is changed, it may need to be updated in Markdown mode
      if (stream.peek() === '`') {
        stream.next();
        var before = stream.pos;
        stream.eatWhile('`');
        var difference = 1 + stream.pos - before;
        if (!state.code) {
          codeDepth = difference;
          state.code = true;
        } else {
          if (difference === codeDepth) { // Must be exact
            state.code = false;
          }
        }
        return null;
      } else if (state.code) {
        stream.next();
        return null;
      }
      // Check if space. If so, links can be formatted later on
      if (stream.eatSpace()) {
        state.ateSpace = true;
        return null;
      }
      if (stream.sol() || state.ateSpace) {
        state.ateSpace = false;
      }
      stream.next();
      return null;
    },
    blankLine: blankLine
  };

  var markdownConfig = {
    underscoresBreakWords: false,
    taskLists: true,
    fencedCodeBlocks: true,
    strikethrough: true
  };
  for (var attr in modeConfig) {
    markdownConfig[attr] = modeConfig[attr];
  }
  markdownConfig.name = "markdown";
  return CodeMirror.overlayMode(CodeMirror.getMode(config, markdownConfig), gfmOverlay);
}, "markdown");

CodeMirror.defineMIME("text/x-gfm", "gfm");
/*eslint-enable */

},{}],4:[function(require,module,exports){
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
'use strict';

/*eslint-disable */
CodeMirror.defineMode("markdown", function(cmCfg, modeCfg) {

  var htmlFound = CodeMirror.modes.hasOwnProperty("xml");
  var htmlMode = CodeMirror.getMode(cmCfg, htmlFound ? {name: "xml", htmlMode: true} : "text/plain");

  function getMode(name) {
    if (CodeMirror.findModeByName) {
      var found = CodeMirror.findModeByName(name);
      if (found) name = found.mime || found.mimes[0];
    }
    var mode = CodeMirror.getMode(cmCfg, name);
    return mode.name == "null" ? null : mode;
  }

  // Should characters that affect highlighting be highlighted separate?
  // Does not include characters that will be output (such as `1.` and `-` for lists)
  if (modeCfg.highlightFormatting === undefined)
    modeCfg.highlightFormatting = false;

  // Maximum number of nested blockquotes. Set to 0 for infinite nesting.
  // Excess `>` will emit `error` token.
  if (modeCfg.maxBlockquoteDepth === undefined)
    modeCfg.maxBlockquoteDepth = 0;

  // Should underscores in words open/close em/strong?
  if (modeCfg.underscoresBreakWords === undefined)
    modeCfg.underscoresBreakWords = true;

  // Turn on fenced code blocks? ("```" to start/end)
  if (modeCfg.fencedCodeBlocks === undefined) modeCfg.fencedCodeBlocks = false;

  // Turn on task lists? ("- [ ] " and "- [x] ")
  if (modeCfg.taskLists === undefined) modeCfg.taskLists = false;

  // Turn on strikethrough syntax
  if (modeCfg.strikethrough === undefined)
    modeCfg.strikethrough = false;

  var codeDepth = 0;

  var header   = 'header'
  ,   code     = 'comment'
  ,   quote    = 'quote'
  ,   list1    = 'variable-2'
  ,   list2    = 'variable-3'
  ,   list3    = 'keyword'
  ,   hr       = 'hr'
  ,   image    = 'tag'
  ,   formatting = 'formatting'
  ,   linkinline = 'link'
  ,   linkemail = 'link'
  ,   linktext = 'link'
  ,   linkhref = 'string'
  ,   em       = 'em'
  ,   strong   = 'strong'
  ,   strikethrough = 'strikethrough';

  var hrRE = /^([*\-_])(?:\s*\1){2,}\s*$/
  ,   ulRE = /^[*\-+]\s+/
  ,   olRE = /^[0-9]+([.)])\s+/
  ,   taskListRE = /^\[(x| )\](?=\s)/ // Must follow ulRE or olRE
  ,   atxHeaderRE = /^(#+)(?: |$)/
  ,   setextHeaderRE = /^ *(?:\={1,}|-{1,})\s*$/
  ,   textRE = /^[^#!\[\]*_\\<>` "'(~]+/;

  function switchInline(stream, state, f) {
    state.f = state.inline = f;
    return f(stream, state);
  }

  function switchBlock(stream, state, f) {
    state.f = state.block = f;
    return f(stream, state);
  }


  // Blocks

  function blankLine(state) {
    // Reset linkTitle state
    state.linkTitle = false;
    // Reset EM state
    state.em = false;
    // Reset STRONG state
    state.strong = false;
    // Reset strikethrough state
    state.strikethrough = false;
    // Reset state.quote
    state.quote = 0;
    // Reset state.indentedCode
    state.indentedCode = false;
    if (!htmlFound && state.f == htmlBlock) {
      state.f = inlineNormal;
      state.block = blockNormal;
    }
    // Reset state.trailingSpace
    state.trailingSpace = 0;
    state.trailingSpaceNewLine = false;
    // Mark this line as blank
    state.thisLineHasContent = false;
    return null;
  }

  function blockNormal(stream, state) {

    var sol = stream.sol();

    var prevLineIsList = state.list !== false,
        prevLineIsIndentedCode = state.indentedCode;

    state.indentedCode = false;

    if (prevLineIsList) {
      if (state.indentationDiff >= 0) { // Continued list
        if (state.indentationDiff < 4) { // Only adjust indentation if *not* a code block
          state.indentation -= state.indentationDiff;
        }
        state.list = null;
      } else if (state.indentation > 0) {
        state.list = null;
        state.listDepth = Math.floor(state.indentation / 4);
      } else { // No longer a list
        state.list = false;
        state.listDepth = 0;
      }
    }

    var match = null;
    if (state.indentationDiff >= 4) {
      stream.skipToEnd();
      if (prevLineIsIndentedCode || !state.prevLineHasContent) {
        state.indentation -= 4;
        state.indentedCode = true;
        return code;
      } else {
        return null;
      }
    } else if (stream.eatSpace()) {
      return null;
    } else if ((match = stream.match(atxHeaderRE)) && match[1].length <= 6) {
      state.header = match[1].length;
      if (modeCfg.highlightFormatting) state.formatting = "header";
      state.f = state.inline;
      return getType(state);
    } else if (state.prevLineHasContent && !state.quote && !prevLineIsList && !prevLineIsIndentedCode && (match = stream.match(setextHeaderRE))) {
      state.header = match[0].charAt(0) == '=' ? 1 : 2;
      if (modeCfg.highlightFormatting) state.formatting = "header";
      state.f = state.inline;
      return getType(state);
    } else if (stream.eat('>')) {
      state.quote = sol ? 1 : state.quote + 1;
      if (modeCfg.highlightFormatting) state.formatting = "quote";
      stream.eatSpace();
      return getType(state);
    } else if (stream.peek() === '[') {
      return switchInline(stream, state, footnoteLink);
    } else if (stream.match(hrRE, true)) {
      state.hr = true;
      return hr;
    } else if ((!state.prevLineHasContent || prevLineIsList) && (stream.match(ulRE, false) || stream.match(olRE, false))) {
      var listType = null;
      if (stream.match(ulRE, true)) {
        listType = 'ul';
      } else {
        stream.match(olRE, true);
        listType = 'ol';
      }
      state.indentation += 4;
      state.list = true;
      state.listDepth++;
      if (modeCfg.taskLists && stream.match(taskListRE, false)) {
        state.taskList = true;
      }
      state.f = state.inline;
      if (modeCfg.highlightFormatting) state.formatting = ["list", "list-" + listType];
      return getType(state);
    } else if (modeCfg.fencedCodeBlocks && stream.match(/^```[ \t]*([\w+#]*)/, true)) {
      // try switching mode
      state.localMode = getMode(RegExp.$1);
      if (state.localMode) state.localState = state.localMode.startState();
      state.f = state.block = local;
      if (modeCfg.highlightFormatting) state.formatting = "code-block";
      state.code = true;
      return getType(state);
    }

    return switchInline(stream, state, state.inline);
  }

  function htmlBlock(stream, state) {
    var style = htmlMode.token(stream, state.htmlState);
    if ((htmlFound && state.htmlState.tagStart === null &&
         (!state.htmlState.context && state.htmlState.tokenize.isInText)) ||
        (state.md_inside && stream.current().indexOf(">") > -1)) {
      state.f = inlineNormal;
      state.block = blockNormal;
      state.htmlState = null;
    }
    return style;
  }

  function local(stream, state) {
    if (stream.sol() && stream.match("```", false)) {
      state.localMode = state.localState = null;
      state.f = state.block = leavingLocal;
      return null;
    } else if (state.localMode) {
      return state.localMode.token(stream, state.localState);
    } else {
      stream.skipToEnd();
      return code;
    }
  }

  function leavingLocal(stream, state) {
    stream.match("```");
    state.block = blockNormal;
    state.f = inlineNormal;
    if (modeCfg.highlightFormatting) state.formatting = "code-block";
    state.code = true;
    var returnType = getType(state);
    state.code = false;
    return returnType;
  }

  // Inline
  function getType(state) {
    var styles = [];

    if (state.formatting) {
      styles.push(formatting);

      if (typeof state.formatting === "string") state.formatting = [state.formatting];

      for (var i = 0; i < state.formatting.length; i++) {
        styles.push(formatting + "-" + state.formatting[i]);

        if (state.formatting[i] === "header") {
          styles.push(formatting + "-" + state.formatting[i] + "-" + state.header);
        }

        // Add `formatting-quote` and `formatting-quote-#` for blockquotes
        // Add `error` instead if the maximum blockquote nesting depth is passed
        if (state.formatting[i] === "quote") {
          if (!modeCfg.maxBlockquoteDepth || modeCfg.maxBlockquoteDepth >= state.quote) {
            styles.push(formatting + "-" + state.formatting[i] + "-" + state.quote);
          } else {
            styles.push("error");
          }
        }
      }
    }

    if (state.taskOpen) {
      styles.push("meta");
      return styles.length ? styles.join(' ') : null;
    }
    if (state.taskClosed) {
      styles.push("property");
      return styles.length ? styles.join(' ') : null;
    }

    if (state.linkHref) {
      styles.push(linkhref, "url");
    } else { // Only apply inline styles to non-url text
      if (state.strong) { styles.push(strong); }
      if (state.em) { styles.push(em); }
      if (state.strikethrough) { styles.push(strikethrough); }

      if (state.linkText) { styles.push(linktext); }

      if (state.code) { styles.push(code); }
    }

    if (state.header) { styles.push(header); styles.push(header + "-" + state.header); }

    if (state.quote) {
      styles.push(quote);

      // Add `quote-#` where the maximum for `#` is modeCfg.maxBlockquoteDepth
      if (!modeCfg.maxBlockquoteDepth || modeCfg.maxBlockquoteDepth >= state.quote) {
        styles.push(quote + "-" + state.quote);
      } else {
        styles.push(quote + "-" + modeCfg.maxBlockquoteDepth);
      }
    }

    if (state.list !== false) {
      var listMod = (state.listDepth - 1) % 3;
      if (!listMod) {
        styles.push(list1);
      } else if (listMod === 1) {
        styles.push(list2);
      } else {
        styles.push(list3);
      }
    }

    if (state.trailingSpaceNewLine) {
      styles.push("trailing-space-new-line");
    } else if (state.trailingSpace) {
      styles.push("trailing-space-" + (state.trailingSpace % 2 ? "a" : "b"));
    }

    return styles.length ? styles.join(' ') : null;
  }

  function handleText(stream, state) {
    if (stream.match(textRE, true)) {
      return getType(state);
    }
    return undefined;
  }

  function inlineNormal(stream, state) {
    var style = state.text(stream, state);
    if (typeof style !== 'undefined')
      return style;

    if (state.list) { // List marker (*, +, -, 1., etc)
      state.list = null;
      return getType(state);
    }

    if (state.taskList) {
      var taskOpen = stream.match(taskListRE, true)[1] !== "x";
      if (taskOpen) state.taskOpen = true;
      else state.taskClosed = true;
      if (modeCfg.highlightFormatting) state.formatting = "task";
      state.taskList = false;
      return getType(state);
    }

    state.taskOpen = false;
    state.taskClosed = false;

    if (state.header && stream.match(/^#+$/, true)) {
      if (modeCfg.highlightFormatting) state.formatting = "header";
      return getType(state);
    }

    // Get sol() value now, before character is consumed
    var sol = stream.sol();

    var ch = stream.next();

    if (ch === '\\') {
      stream.next();
      if (modeCfg.highlightFormatting) {
        var type = getType(state);
        return type ? type + " formatting-escape" : "formatting-escape";
      }
    }

    // Matches link titles present on next line
    if (state.linkTitle) {
      state.linkTitle = false;
      var matchCh = ch;
      if (ch === '(') {
        matchCh = ')';
      }
      matchCh = (matchCh+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
      var regex = '^\\s*(?:[^' + matchCh + '\\\\]+|\\\\\\\\|\\\\.)' + matchCh;
      if (stream.match(new RegExp(regex), true)) {
        return linkhref;
      }
    }

    // If this block is changed, it may need to be updated in GFM mode
    if (ch === '`') {
      var previousFormatting = state.formatting;
      if (modeCfg.highlightFormatting) state.formatting = "code";
      var t = getType(state);
      var before = stream.pos;
      stream.eatWhile('`');
      var difference = 1 + stream.pos - before;
      if (!state.code) {
        codeDepth = difference;
        state.code = true;
        return getType(state);
      } else {
        if (difference === codeDepth) { // Must be exact
          state.code = false;
          return t;
        }
        state.formatting = previousFormatting;
        return getType(state);
      }
    } else if (state.code) {
      return getType(state);
    }

    if (ch === '!' && stream.match(/\[[^\]]*\] ?(?:\(|\[)/, false)) {
      stream.match(/\[[^\]]*\]/);
      state.inline = state.f = linkHref;
      return image;
    }

    if (ch === '[' && stream.match(/.*\](\(.*\)| ?\[.*\])/, false)) {
      state.linkText = true;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      return getType(state);
    }

    if (ch === ']' && state.linkText && stream.match(/\(.*\)| ?\[.*\]/, false)) {
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var type = getType(state);
      state.linkText = false;
      state.inline = state.f = linkHref;
      return type;
    }

    if (ch === '<' && stream.match(/^(https?|ftps?):\/\/(?:[^\\>]|\\.)+>/, false)) {
      state.f = state.inline = linkInline;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var type = getType(state);
      if (type){
        type += " ";
      } else {
        type = "";
      }
      return type + linkinline;
    }

    if (ch === '<' && stream.match(/^[^> \\]+@(?:[^\\>]|\\.)+>/, false)) {
      state.f = state.inline = linkInline;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var type = getType(state);
      if (type){
        type += " ";
      } else {
        type = "";
      }
      return type + linkemail;
    }

    if (ch === '<' && stream.match(/^(!--|\w)/, false)) {
      var end = stream.string.indexOf(">", stream.pos);
      if (end != -1) {
        var atts = stream.string.substring(stream.start, end);
        if (/markdown\s*=\s*('|"){0,1}1('|"){0,1}/.test(atts)) state.md_inside = true;
      }
      stream.backUp(1);
      state.htmlState = CodeMirror.startState(htmlMode);
      return switchBlock(stream, state, htmlBlock);
    }

    if (ch === '<' && stream.match(/^\/\w*?>/)) {
      state.md_inside = false;
      return "tag";
    }

    var ignoreUnderscore = false;
    if (!modeCfg.underscoresBreakWords) {
      if (ch === '_' && stream.peek() !== '_' && stream.match(/(\w)/, false)) {
        var prevPos = stream.pos - 2;
        if (prevPos >= 0) {
          var prevCh = stream.string.charAt(prevPos);
          if (prevCh !== '_' && prevCh.match(/(\w)/, false)) {
            ignoreUnderscore = true;
          }
        }
      }
    }
    if (ch === '*' || (ch === '_' && !ignoreUnderscore)) {
      if (sol && stream.peek() === ' ') {
        // Do nothing, surrounded by newline and space
      } else if (state.strong === ch && stream.eat(ch)) { // Remove STRONG
        if (modeCfg.highlightFormatting) state.formatting = "strong";
        var t = getType(state);
        state.strong = false;
        return t;
      } else if (!state.strong && stream.eat(ch)) { // Add STRONG
        state.strong = ch;
        if (modeCfg.highlightFormatting) state.formatting = "strong";
        return getType(state);
      } else if (state.em === ch) { // Remove EM
        if (modeCfg.highlightFormatting) state.formatting = "em";
        var t = getType(state);
        state.em = false;
        return t;
      } else if (!state.em) { // Add EM
        state.em = ch;
        if (modeCfg.highlightFormatting) state.formatting = "em";
        return getType(state);
      }
    } else if (ch === ' ') {
      if (stream.eat('*') || stream.eat('_')) { // Probably surrounded by spaces
        if (stream.peek() === ' ') { // Surrounded by spaces, ignore
          return getType(state);
        } else { // Not surrounded by spaces, back up pointer
          stream.backUp(1);
        }
      }
    }

    if (modeCfg.strikethrough) {
      if (ch === '~' && stream.eatWhile(ch)) {
        if (state.strikethrough) {// Remove strikethrough
          if (modeCfg.highlightFormatting) state.formatting = "strikethrough";
          var t = getType(state);
          state.strikethrough = false;
          return t;
        } else if (stream.match(/^[^\s]/, false)) {// Add strikethrough
          state.strikethrough = true;
          if (modeCfg.highlightFormatting) state.formatting = "strikethrough";
          return getType(state);
        }
      } else if (ch === ' ') {
        if (stream.match(/^~~/, true)) { // Probably surrounded by space
          if (stream.peek() === ' ') { // Surrounded by spaces, ignore
            return getType(state);
          } else { // Not surrounded by spaces, back up pointer
            stream.backUp(2);
          }
        }
      }
    }

    if (ch === ' ') {
      if (stream.match(/ +$/, false)) {
        state.trailingSpace++;
      } else if (state.trailingSpace) {
        state.trailingSpaceNewLine = true;
      }
    }

    return getType(state);
  }

  function linkInline(stream, state) {
    var ch = stream.next();

    if (ch === ">") {
      state.f = state.inline = inlineNormal;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var type = getType(state);
      if (type){
        type += " ";
      } else {
        type = "";
      }
      return type + linkinline;
    }

    stream.match(/^[^>]+/, true);

    return linkinline;
  }

  function linkHref(stream, state) {
    // Check if space, and return NULL if so (to avoid marking the space)
    if(stream.eatSpace()){
      return null;
    }
    var ch = stream.next();
    if (ch === '(' || ch === '[') {
      state.f = state.inline = getLinkHrefInside(ch === "(" ? ")" : "]");
      if (modeCfg.highlightFormatting) state.formatting = "link-string";
      state.linkHref = true;
      return getType(state);
    }
    return 'error';
  }

  function getLinkHrefInside(endChar) {
    return function(stream, state) {
      var ch = stream.next();

      if (ch === endChar) {
        state.f = state.inline = inlineNormal;
        if (modeCfg.highlightFormatting) state.formatting = "link-string";
        var returnState = getType(state);
        state.linkHref = false;
        return returnState;
      }

      if (stream.match(inlineRE(endChar), true)) {
        stream.backUp(1);
      }

      state.linkHref = true;
      return getType(state);
    };
  }

  function footnoteLink(stream, state) {
    if (stream.match(/^[^\]]*\]:/, false)) {
      state.f = footnoteLinkInside;
      stream.next(); // Consume [
      if (modeCfg.highlightFormatting) state.formatting = "link";
      state.linkText = true;
      return getType(state);
    }
    return switchInline(stream, state, inlineNormal);
  }

  function footnoteLinkInside(stream, state) {
    if (stream.match(/^\]:/, true)) {
      state.f = state.inline = footnoteUrl;
      if (modeCfg.highlightFormatting) state.formatting = "link";
      var returnType = getType(state);
      state.linkText = false;
      return returnType;
    }

    stream.match(/^[^\]]+/, true);

    return linktext;
  }

  function footnoteUrl(stream, state) {
    // Check if space, and return NULL if so (to avoid marking the space)
    if(stream.eatSpace()){
      return null;
    }
    // Match URL
    stream.match(/^[^\s]+/, true);
    // Check for link title
    if (stream.peek() === undefined) { // End of line, set flag to check next line
      state.linkTitle = true;
    } else { // More content on line, check if link title
      stream.match(/^(?:\s+(?:"(?:[^"\\]|\\\\|\\.)+"|'(?:[^'\\]|\\\\|\\.)+'|\((?:[^)\\]|\\\\|\\.)+\)))?/, true);
    }
    state.f = state.inline = inlineNormal;
    return linkhref + " url";
  }

  var savedInlineRE = [];
  function inlineRE(endChar) {
    if (!savedInlineRE[endChar]) {
      // Escape endChar for RegExp (taken from http://stackoverflow.com/a/494122/526741)
      endChar = (endChar+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
      // Match any non-endChar, escaped character, as well as the closing
      // endChar.
      savedInlineRE[endChar] = new RegExp('^(?:[^\\\\]|\\\\.)*?(' + endChar + ')');
    }
    return savedInlineRE[endChar];
  }

  var mode = {
    startState: function() {
      return {
        f: blockNormal,

        prevLineHasContent: false,
        thisLineHasContent: false,

        block: blockNormal,
        htmlState: null,
        indentation: 0,

        inline: inlineNormal,
        text: handleText,

        formatting: false,
        linkText: false,
        linkHref: false,
        linkTitle: false,
        em: false,
        strong: false,
        header: 0,
        hr: false,
        taskList: false,
        list: false,
        listDepth: 0,
        quote: 0,
        trailingSpace: 0,
        trailingSpaceNewLine: false,
        strikethrough: false
      };
    },

    copyState: function(s) {
      return {
        f: s.f,

        prevLineHasContent: s.prevLineHasContent,
        thisLineHasContent: s.thisLineHasContent,

        block: s.block,
        htmlState: s.htmlState && CodeMirror.copyState(htmlMode, s.htmlState),
        indentation: s.indentation,

        localMode: s.localMode,
        localState: s.localMode ? CodeMirror.copyState(s.localMode, s.localState) : null,

        inline: s.inline,
        text: s.text,
        formatting: false,
        linkTitle: s.linkTitle,
        em: s.em,
        strong: s.strong,
        strikethrough: s.strikethrough,
        header: s.header,
        hr: s.hr,
        taskList: s.taskList,
        list: s.list,
        listDepth: s.listDepth,
        quote: s.quote,
        indentedCode: s.indentedCode,
        trailingSpace: s.trailingSpace,
        trailingSpaceNewLine: s.trailingSpaceNewLine,
        md_inside: s.md_inside
      };
    },

    token: function(stream, state) {

      // Reset state.formatting
      state.formatting = false;

      if (stream.sol()) {
        var forceBlankLine = !!state.header || state.hr;

        // Reset state.header and state.hr
        state.header = 0;
        state.hr = false;

        if (stream.match(/^\s*$/, true) || forceBlankLine) {
          state.prevLineHasContent = false;
          blankLine(state);
          return forceBlankLine ? this.token(stream, state) : null;
        } else {
          state.prevLineHasContent = state.thisLineHasContent;
          state.thisLineHasContent = true;
        }

        // Reset state.taskList
        state.taskList = false;

        // Reset state.code
        state.code = false;

        // Reset state.trailingSpace
        state.trailingSpace = 0;
        state.trailingSpaceNewLine = false;

        state.f = state.block;
        var indentation = stream.match(/^\s*/, true)[0].replace(/\t/g, '    ').length;
        var difference = Math.floor((indentation - state.indentation) / 4) * 4;
        if (difference > 4) difference = 4;
        var adjustedIndentation = state.indentation + difference;
        state.indentationDiff = adjustedIndentation - state.indentation;
        state.indentation = adjustedIndentation;
        if (indentation > 0) return null;
      }
      return state.f(stream, state);
    },

    innerMode: function(state) {
      if (state.block == htmlBlock) return {state: state.htmlState, mode: htmlMode};
      if (state.localState) return {state: state.localState, mode: state.localMode};
      return {state: state, mode: mode};
    },

    blankLine: blankLine,

    getType: getType,

    fold: "markdown"
  };
  return mode;
}, "xml");

CodeMirror.defineMIME("text/x-markdown", "markdown");
/*eslint-enable */

},{}],5:[function(require,module,exports){
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// Utility function that allows modes to be combined. The mode given
// as the base argument takes care of most of the normal mode
// functionality, but a second (typically simple) mode is used, which
// can override the style of text. Both modes get to parse all of the
// text, but when both assign a non-null style to a piece of code, the
// overlay wins, unless the combine argument was true and not overridden,
// or state.overlay.combineTokens was true, in which case the styles are
// combined.
'use strict';

/*eslint-disable */
CodeMirror.overlayMode = function(base, overlay, combine) {
  return {
    startState: function() {
      return {
        base: CodeMirror.startState(base),
        overlay: CodeMirror.startState(overlay),
        basePos: 0, baseCur: null,
        overlayPos: 0, overlayCur: null,
        streamSeen: null
      };
    },
    copyState: function(state) {
      return {
        base: CodeMirror.copyState(base, state.base),
        overlay: CodeMirror.copyState(overlay, state.overlay),
        basePos: state.basePos, baseCur: null,
        overlayPos: state.overlayPos, overlayCur: null
      };
    },

    token: function(stream, state) {
      if (stream != state.streamSeen ||
          Math.min(state.basePos, state.overlayPos) < stream.start) {
        state.streamSeen = stream;
        state.basePos = state.overlayPos = stream.start;
      }

      if (stream.start == state.basePos) {
        state.baseCur = base.token(stream, state.base);
        state.basePos = stream.pos;
      }
      if (stream.start == state.overlayPos) {
        stream.pos = stream.start;
        state.overlayCur = overlay.token(stream, state.overlay);
        state.overlayPos = stream.pos;
      }
      stream.pos = Math.min(state.basePos, state.overlayPos);

      // state.overlay.combineTokens always takes precedence over combine,
      // unless set to null
      if (state.overlayCur == null) return state.baseCur;
      else if (state.baseCur != null &&
               state.overlay.combineTokens ||
               combine && state.overlay.combineTokens == null)
        return state.baseCur + " " + state.overlayCur;
      else return state.overlayCur;
    },

    indent: base.indent && function(state, textAfter) {
      return base.indent(state.base, textAfter);
    },
    electricChars: base.electricChars,

    innerMode: function(state) { return {state: state.base, mode: base}; },

    blankLine: function(state) {
      if (base.blankLine) base.blankLine(state.base);
      if (overlay.blankLine) overlay.blankLine(state.overlay);
    }
  };
};
/*eslint-enable */

},{}],6:[function(require,module,exports){
/**
 * @fileoverview Implements Command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = ne.util;

/**
 * Command
 * It implements command to editors
 * @exports Command
 * @constructor
 * @class
 * @param {string} name Command name
 * @param {number} type Command type (Command.TYPE)
 */
function Command(name, type) {
    this.name = name;
    this.type = type;
}

/**
 * getName
 * returns Name of command
 * @return {string} Command Name
 */
Command.prototype.getName = function() {
    return this.name;
};

/**
 * getType
 * returns Type of command
 * @return {number} Command Type
 */
Command.prototype.getType = function() {
    return this.type;
};

/**
 * isMDType
 * returns whether Command Type is Markdown or not
 * @return {boolean} result
 */
Command.prototype.isMDType = function() {
    return this.type === Command.TYPE.MD;
};

/**
 * isWWType
 * returns whether Command Type is Wysiwyg or not
 * @return {boolean} result
 */
Command.prototype.isWWType = function() {
    return this.type === Command.TYPE.WW;
};

/**
 * isGlobalType
 * returns whether Command Type is Global or not
 * @return {boolean} result
 */
Command.prototype.isGlobalType = function() {
    return this.type === Command.TYPE.GB;
};

/**
 * setKeyMap
 * Set keymap value for each os
 * @param {string} win window Key
 * @param {string} mac mac osx key
 */
Command.prototype.setKeyMap = function(win, mac) {
    this.keyMap = [win, mac];
};

Command.factory = function(typeStr, props) {
    var command, type;

    if (typeStr === 'markdown') {
        type = Command.TYPE.MD;
    } else if (typeStr === 'wysiwyg') {
        type = Command.TYPE.WW;
    } else if (typeStr === 'global') {
        type = Command.TYPE.GB;
    }

    command = new Command(props.name, type);

    util.extend(command, props);

    return command;
};

/**
 * Command Type Constant
 */
Command.TYPE = {
    MD: 0,
    WW: 1,
    GB: 2
};

module.exports = Command;

},{}],7:[function(require,module,exports){
/**
 * @fileoverview Implements CommandManager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = ne.util;

var Command = require('./command');

/**
 * CommandManager
 * @exports CommandManager
 * @constructor
 * @class
 * @param {NEditor} base ned인스턴스
 */
function CommandManager(base) {
    this._command = new util.Map();
    this._mdCommand = new util.Map();
    this._wwCommand = new util.Map();
    this.base = base;

    this._initEvent();
}

/**
 * addCommand
 * 커맨드를 추가한다.
 * @param {Command} command 커맨드객체
 * @return {Command} 커맨드
 */
CommandManager.prototype.addCommand = function(command) {
    var name,
        commandBase;

    if (arguments.length === 2) {
        command = CommandManager.command(arguments[0], arguments[1]);
    }

    name = command.getName();

    if (command.isMDType()) {
        commandBase = this._mdCommand;
    } else if (command.isWWType()) {
        commandBase = this._wwCommand;
    } else if (command.isGlobalType()) {
        commandBase = this._command;
    }

    commandBase.set(name, command);

    return command;
};


/**
 * _initEvent
 * Bind event handler to eventManager
 */
CommandManager.prototype._initEvent = function() {
    var self = this;

    this.base.eventManager.listen('command', function() {
        self.exec.apply(self, arguments);
    });
};

/**
 * 커맨드를 실행한다
 * @param {String} name 커맨드명
 * @returns {*} 커맨드를 수행한후 리턴값
 */
CommandManager.prototype.exec = function(name) {
    var commandToRun,
        context = this.base,
        args = util.toArray(arguments);

    args.shift();

    commandToRun = this._command.get(name);

    if (!commandToRun) {
        if (this.base.isMarkdownMode()) {
            commandToRun = this._mdCommand.get(name);
            context = this.base.mdEditor;
        } else {
            commandToRun = this._wwCommand.get(name);
            context = this.base.wwEditor;
        }
    }

    if (commandToRun) {
        args.unshift(context);
        return commandToRun.exec.apply(commandToRun, args);
    }
};

CommandManager.command = function(type, props) {
    var command;

    command = Command.factory(type, props.name);

    util.extend(command, props);

    return command;
};


module.exports = CommandManager;

},{"./command":6}],8:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var markedCustomRenderer = require('./markedCustomRenderer');

var marked = window.marked,
    toMark = window.toMark,
    hljs = window.hljs;

/**
 * Convertor
 * @exports Convertor
 * @extends {}
 * @constructor
 * @class
 */

function Convertor() {}

Convertor.prototype._markdownToHtmlWithCodeHighlight = function(markdown) {
    return marked(markdown, {
        renderer: markedCustomRenderer,
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false,
        highlight: function(code) {
            return hljs.highlightAuto(code).value;
        }
    });
};

Convertor.prototype._markdownToHtml = function(markdown) {
    return marked(markdown, {
        renderer: markedCustomRenderer,
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false
    });
};

Convertor.prototype.toHTMLWithCodeHightlight = function(markdown) {
    return this._markdownToHtmlWithCodeHighlight(markdown);
};

Convertor.prototype.toHTML = function(markdown) {
    return this._markdownToHtml(markdown);
};

Convertor.prototype.toMarkdown = function(html) {
    return toMark(html);
};

Convertor.factory = function(eventManager) {
    return new Convertor(eventManager);
};

module.exports = Convertor;

},{"./markedCustomRenderer":30}],9:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var MarkdownEditor = require('./markdownEditor'),
    Preview = require('./preview'),
    WysiwygEditor = require('./wysiwygEditor'),
    Layout = require('./layout'),
    EventManager = require('./eventManager'),
    CommandManager = require('./commandManager'),
    extManager = require('./extManager'),
    Converter = require('./converter');

//markdown commands
var mdcBold = require('./markdownCommands/bold'),
    mdcItalic = require('./markdownCommands/italic'),
    mdcBlockquote = require('./markdownCommands/blockquote'),
    mdcHeading = require('./markdownCommands/heading'),
    mdcHR = require('./markdownCommands/hr'),
    mdcAddLink = require('./markdownCommands/addLink'),
    mdcAddImage = require('./markdownCommands/addImage'),
    mdcUL = require('./markdownCommands/ul'),
    mdcOL = require('./markdownCommands/ol'),
    mdcTask = require('./markdownCommands/task');

//wysiwyg Commands
var wwBold = require('./wysiwygCommands/bold'),
    wwItalic = require('./wysiwygCommands/italic'),
    wwBlockquote = require('./wysiwygCommands/blockquote'),
    wwAddImage = require('./wysiwygCommands/addImage'),
    wwAddLink = require('./wysiwygCommands/addLink'),
    wwHR = require('./wysiwygCommands/hr'),
    wwHeading = require('./wysiwygCommands/heading'),
    wwUL = require('./wysiwygCommands/ul'),
    wwOL = require('./wysiwygCommands/ol'),
    wwTask = require('./wysiwygCommands/task');

var util = ne.util;

var __nedInstance = [];

//default extensions
require('./extensions/querySplitter');
require('./extensions/taskCounter');
require('./extensions/textPalette');

/**
 * NeonEditor
 * @exports NeonEditor
 * @constructor
 * @class
 * @param {object} options 옵션
 * @param {number} options.height 에디터 height 픽셀
 * @param {string} options.initialValue 초기 입력 테스트
 * @param {string} options.previewStyle 프리뷰가 출력되는 방식을 정한다(tab, vertical)
 * @param {string} options.initialEditType 시작시 표시될 에디터 타입(markdown, wysiwyg)
 * @param {string} options.contentCSSStyles List of CSS style file path for HTML content.
 * @param {function} options.onload invoke function when editor loaded complete
 * @param {object} options.hooks 외부 연결 훅 목록
 * @param {function} options.hooks.htmlRenderAfterHook DOM으로 그려질 HTML텍스트가 만들어진후 실행되는 훅, 만들어진 HTML텍스트가 인자로 전달되고 리턴값이 HTML텍스트로 대체된다.
 * @param {function} options.hooks.previewBeforeHook 프리뷰 되기 직전 실행되는 훅, 프리뷰에 그려질 DOM객체들이 인자로 전달된다.
 * @param {function} options.hooks.addImageFileHook 이미지 추가 팝업에서 이미지가 선택되면 hook에 이미지정보가 전달되고 hook에서 이미지를 붙인다.
 */
function NeonEditor(options) {
    var self = this;

    this.options = $.extend({
        'previewStyle': 'tab',
        'initialEditType': 'markdown',
        'height': 300
    }, options);

    this.eventManager = new EventManager();

    this._initEvent();

    this.commandManager = new CommandManager(this);
    this.converter = new Converter();
    this.layout = new Layout(options, this.eventManager);
    this.layout.init();

    this.mdEditor = new MarkdownEditor(this.layout.getMdEditorContainerEl(), this.eventManager);
    this.preview = new Preview(this.layout.getPreviewEl(), this.eventManager, this.converter);
    this.wwEditor = new WysiwygEditor(this.layout.getWwEditorContainerEl(), this.options.contentCSSStyles, this.eventManager);

    if (this.options.hooks) {
        util.forEach(this.options.hooks, function(fn, key) {
            self.eventManager.listen(key, fn);
        });
    }

    this.changePreviewStyle(this.options.previewStyle);

    this.mdEditor.init();

    this.wwEditor.init(this.options.height, function() {
        extManager.applyExtension(self, self.options.exts);

        self._initDefaultCommands();

        if (self.options.initialEditType === 'markdown') {
            self.eventManager.emit('changeMode.markdown');
        } else {
            self.eventManager.emit('changeMode.wysiwyg');
        }

        self.eventManager.emit('changeMode', self.options.initialEditType);

        self.setValue(self.options.initialValue);

        if (self.options.onload) {
            self.options.onload(self);
        }
    });

    window.dd = this;

    __nedInstance.push(this);
}

NeonEditor.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('changeMode.wysiwyg', function() {
        self.currentMode = 'wysiwyg';
        self.wwEditor.setValue(self.converter.toHTML(self.mdEditor.getValue()));
    });

    this.eventManager.listen('changeMode.markdown', function() {
        self.currentMode = 'markdown';
        self.mdEditor.setValue(self.converter.toMarkdown(self.wwEditor.getValue()));
    });
};

NeonEditor.prototype._initDefaultCommands = function() {
    this.commandManager.addCommand(mdcBold);
    this.commandManager.addCommand(mdcItalic);
    this.commandManager.addCommand(mdcBlockquote);
    this.commandManager.addCommand(mdcHeading);
    this.commandManager.addCommand(mdcHR);
    this.commandManager.addCommand(mdcAddLink);
    this.commandManager.addCommand(mdcAddImage);
    this.commandManager.addCommand(mdcUL);
    this.commandManager.addCommand(mdcOL);
    this.commandManager.addCommand(mdcTask);

    this.commandManager.addCommand(wwBold);
    this.commandManager.addCommand(wwItalic);
    this.commandManager.addCommand(wwBlockquote);
    this.commandManager.addCommand(wwUL);
    this.commandManager.addCommand(wwOL);
    this.commandManager.addCommand(wwAddImage);
    this.commandManager.addCommand(wwAddLink);
    this.commandManager.addCommand(wwHR);
    this.commandManager.addCommand(wwHeading);
    this.commandManager.addCommand(wwTask);
};

/**
 * 프리뷰가 보여지는 방식을 변경한다
 * @param {string} style 스타일 이름 tab, vertical
 */
NeonEditor.prototype.changePreviewStyle = function(style) {
    this.layout.changePreviewStyle(style);
    this.mdPreviewStyle = style;
};

NeonEditor.prototype.exec = function() {
    this.commandManager.exec.apply(this.commandManager, arguments);
};

NeonEditor.prototype.getCodeMirror = function() {
    return this.mdEditor.getEditor();
};

NeonEditor.prototype.getSquire = function() {
    return this.wwEditor.getEditor();
};

NeonEditor.prototype.focus = function() {
   this.getCurrentModeEditor().focus();
};

NeonEditor.prototype.setValue = function(markdown) {
    markdown = markdown || '';

    if (this.isMarkdownMode()) {
        this.mdEditor.setValue(markdown);
    } else {
        this.wwEditor.setValue(this.converter.toHTML(markdown));
    }
};

NeonEditor.prototype.getValue = function() {
    var markdown;

    if (this.isMarkdownMode()) {
        markdown = this.mdEditor.getValue();
    } else {
        markdown = this.converter.toMarkdown(this.wwEditor.getValue());
    }

    return markdown;
};

NeonEditor.prototype.addWidget = function(selection, node, style, offset) {
    this.getCurrentModeEditor().addWidget(selection, node, style, offset);
};

NeonEditor.prototype.getCurrentModeEditor = function() {
    var editor;

    if (this.isMarkdownMode()) {
        editor = this.mdEditor;
    } else {
        editor = this.wwEditor;
    }

    return editor;
};

NeonEditor.prototype.isMarkdownMode = function() {
    return this.currentMode === 'markdown';
};

NeonEditor.prototype.isWysiwygMode = function() {
    return this.currentMode === 'wysiwyg';
};

NeonEditor.prototype.remove = function() {
    this.wwEditor.remove();
    this.mdEditor.remove();
    this.layout.remove();
};

NeonEditor.prototype.hide = function() {
    this.layout.hide();
};

NeonEditor.prototype.show = function() {
    this.layout.show();
};

NeonEditor.getInstances = function() {
    return __nedInstance;
};

NeonEditor.defineExtension = function(name, ext) {
    extManager.defineExtension(name, ext);
};

module.exports = NeonEditor;

},{"./commandManager":7,"./converter":8,"./eventManager":10,"./extManager":11,"./extensions/querySplitter":12,"./extensions/taskCounter":13,"./extensions/textPalette":14,"./layout":17,"./markdownCommands/addImage":19,"./markdownCommands/addLink":20,"./markdownCommands/blockquote":21,"./markdownCommands/bold":22,"./markdownCommands/heading":23,"./markdownCommands/hr":24,"./markdownCommands/italic":25,"./markdownCommands/ol":26,"./markdownCommands/task":27,"./markdownCommands/ul":28,"./markdownEditor":29,"./preview":34,"./wysiwygCommands/addImage":39,"./wysiwygCommands/addLink":40,"./wysiwygCommands/blockquote":41,"./wysiwygCommands/bold":42,"./wysiwygCommands/heading":43,"./wysiwygCommands/hr":44,"./wysiwygCommands/italic":45,"./wysiwygCommands/ol":46,"./wysiwygCommands/task":47,"./wysiwygCommands/ul":48,"./wysiwygEditor":49}],10:[function(require,module,exports){
/**
 * @fileoverview Implements EventManager
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = ne.util;

var eventList = [
    'htmlRenderAfterHook',
    'previewBeforeHook',
    'addImageFileHook',
    'markdownEditorContentChanged',
    'contentChanged.wysiwygEditor',
    'change.wysiwygEditor',
    'contentChanged.markdownEditor',
    'change.markdownEditor',
    'change',
    'changeMode.wysiwyg',
    'changeMode.markdown',
    'changeMode',
    'openPopupAddLink',
    'openPopupAddImage',
    'closeAllPopup',
    'command',
    'htmlUpdate',
    'markdownUpdate',
    'renderedHtmlUpdated'
];

/**
 * EventManager
 * @exports EventManager
 * @extends {}
 * @constructor
 * @class
 */
function EventManager() {
    this.events = new util.Map();
    this.TYPE = new util.Enum(eventList);
}

EventManager.prototype.listen = function(type, handler) {
    var eventHandlers;

    if (!this._hasEventType(type)) {
        throw new Error('There is no event type ' + type);
    }

    eventHandlers = this.events.get(type) || [];
    eventHandlers.push(handler);

    this.events.set(type, eventHandlers);
};

EventManager.prototype.emit = function() {
    var args = util.toArray(arguments),
        type = args.shift(),
        eventHandlers = this.events.get(type),
        result,
        results;

    if (eventHandlers) {
        results = [];

        util.forEach(eventHandlers, function(handler) {
            result = handler.apply(null, args);

            if (!util.isUndefined(result)) {
                results.push(result);
            }
       });
    }

    if (results && results.length) {
        return results;
    }
};

EventManager.prototype._hasEventType = function(type) {
    return !util.isUndefined(this.TYPE[type]);
};

EventManager.prototype.addEventType = function(type) {
    if (this._hasEventType(type)) {
        throw new Error('There is already have event type ' + type);
    }

    this.TYPE.set(type);
};

module.exports = EventManager;

},{}],11:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = ne.util;

/**
 * ExtManager
 * @exports ExtManager
 * @extends {}
 * @constructor
 * @class
 */
function ExtManager() {
    this.exts = new util.Map();
}

ExtManager.prototype.defineExtension = function(name, ext) {
    this.exts.set(name, ext);
};

ExtManager.prototype.applyExtension = function(context, extNames) {
    var self = this;

    if (extNames) {
        extNames.forEach(function(extName) {
            if (self.exts.has(extName)) {
                self.exts.get(extName)(context);
            }
        });
    }
};

module.exports = new ExtManager();

},{}],12:[function(require,module,exports){
/**
@author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
*/

'use strict';

var extManager = require('../extManager');

var util = ne.util;

extManager.defineExtension('querySplitter', function(editor) {
    var active = false,
        queryRx = util.pick(editor.options, 'querySplitter', 'queryRx') || /@[^@\s]*/;

    editor.eventManager.addEventType('query');

    editor.eventManager.listen('change.wysiwygEditor', function(ev) {
        process(ev);
    });

    editor.eventManager.listen('change.markdownEditor', function(ev) {
        process(ev);
    });

    //todo 클로저 제거하고 객체형태로
    function process(ev) {
        var founded, textBlocks, count, i, eventObject,
            textContent = ev.textContent,
            caretOffset = ev.caretOffset,
            currentBlock;

        //찾는 룰이 있다가 backspace로 모두 지워진 경우를 위해 active가 필요 마지막 한번의 undefined로  query이벤트를 날리기위해
        if (active || (textContent && queryRx.test(textContent))) {
            if (textContent && (textContent === '' || !(/\s/.test(textContent[caretOffset - 1])))) {
                textBlocks = textContent.split(' ');
                count = 0;

                for (i = 0; i < textBlocks.length; i += 1) {
                    count += textBlocks[i].length;

                    if (count + i >= caretOffset) {
                        currentBlock = textBlocks[i];
                        break;
                    }
                }

                founded = queryRx.exec(currentBlock);
            } else {
                active = false;
            }

            if (founded) {
                active = true;
                eventObject = {
                    text: founded[0],
                    currentText: textContent[caretOffset - 1],
                    startOffset: (count - textBlocks[i].length) + founded.index + i,
                    caretOffset: caretOffset,
                    selection: ev.selection
                };
            }

            editor.eventManager.emit('query', eventObject);
        }
    }
});

},{"../extManager":11}],13:[function(require,module,exports){
'use strict';

var extManager = require('../extManager');

var FIND_TASK_RX = /^\s*\* \[[xX ]\] [^\n]*/mg;
var FIND_CHECKED_TASK_RX = /^\s*\* \[[xX]\] [^\n]*/mg;

extManager.defineExtension('taskCounter', function(editor) {
    editor.getTaskCount = function() {
        var found;

        if (editor.isMarkdownMode()) {
            found = editor.mdEditor.getValue().match(FIND_TASK_RX);
            return found ? found.length : 0;
        } else {
            return editor.wwEditor.get$Body().find('input').length;
        }
    }

    editor.getCheckedTaskCount = function() {
        var found;

        if (editor.isMarkdownMode()) {
            found = editor.mdEditor.getValue().match(FIND_CHECKED_TASK_RX);
            return found ? found.length : 0;
        } else {
            return editor.wwEditor.get$Body().find('input:checked').length;
        }
    }
});

},{"../extManager":11}],14:[function(require,module,exports){
'use strict';

var extManager = require('../extManager');

extManager.defineExtension('textPalette', function(editor) {
    var $layer = $('<div style="z-index:9999"><input type="text" style="background:white" /></div>');
    var triggers = editor.options.textPalette.triggers,
        querySender = editor.options.textPalette.querySender;

    $(editor.options.el).append($layer);

    $layer.find('input').on('keyup', function(e) {
        var query = $layer.find('input').val();

        if (e.which === 13) {
            e.stopPropagation();
            //editor.getCurrentModeEditor().replaceSelection(query);
            editor.getCurrentModeEditor().replaceRelativeOffset(query, -1, 1);
            editor.focus();
            hideUI($layer);
        } else {
            querySender(query, function(list) {
                updateUI($layer, list);
            });
        }
    });

    editor.eventManager.listen('change', function(ev) {
        void 0;
        if (triggers.indexOf(ev.textContent[ev.caretOffset - 1]) !== -1) {
            editor.addWidget(ev.selection, $layer[0], 'over');
            showUI($layer);
        }
    });
});

function showUI($layer) {
    $layer.show();
    $layer.find('input').focus();
}

function hideUI($layer) {
    $layer.hide();
    $layer.find('input').val('');
}

function updateUI($layer, list) {
    void 0;
}

},{"../extManager":11}],15:[function(require,module,exports){
/**
 * @fileoverview entry point
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var NeonEditor;

//codemirror modes&addons
require('./codemirror/overlay');
require('./codemirror/markdown');
require('./codemirror/gfm');
require('./codemirror/continuelist');

NeonEditor = require('./editor');

//for jquery
$.fn.neonEditor = function() {
    var args = $.makeArray(arguments),
        options,
        instance,
        el;

    el = this[0];

    if (el) {
        options = args[0] || {};

        instance = $.data(el, 'neonEditor');

        if (instance) {
            if (typeof options === 'string') {
                return instance[options].apply(instance, args.slice(1));
            }
        } else {
            options.el = el;
            instance = new NeonEditor(options);
            $.data(el, 'neonEditor', instance);
        }
    }

    return this;
};

window.ne = window.ne || {};
window.ne.NeonEditor = NeonEditor;

},{"./codemirror/continuelist":2,"./codemirror/gfm":3,"./codemirror/markdown":4,"./codemirror/overlay":5,"./editor":9}],16:[function(require,module,exports){
/**
 * @fileoverview Implements LayerPopup
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var UIController = require('./uicontroller');

var util = ne.util,
    _id = 0,
    CLASS_PREFIX = 'nepopup-',
    LAYOUT_TEMPLATE = [
        '<div class="' + CLASS_PREFIX + 'header">',
        '<span class="' + CLASS_PREFIX + 'title"></span>',
        '<button class="' + CLASS_PREFIX + 'closeButton">x</button>',
        '</div>',
        '<div class="' + CLASS_PREFIX + 'body"></div>'
    ].join('');

/**
 * LayerPopup
 * @exports LayerPopup
 * @augments UIController
 * @constructor
 * @class
 * @param {object} options 옵션
 * @param {string[]} options.openerCssQuery Css Query list to bind clickevent that open popup
 * @param {string[]} options.closerCssQuery Css Query list to bind clickevent that close popup
 * @param {jQuery} options.$el popup root element
 * @param {jQuery|string} options.content popup content that html string or jQuery element
 * @param {string} options.textContent popup text content
 * @param {string} options.title popup title
 * @param {jQuery} options.$target element to append popup
 */
function LayerPopup(options) {
    options = util.extend({}, options);

    UIController.call(this, {
        tagName: 'div',
        className: CLASS_PREFIX + 'wrapper',
        rootElement: options.$el
    });

    options = util.extend({}, options);

    this._setId();
    this._initTarget(options);
    this._initExternalPopupHtmlIfNeed(options);
    this._initCloserOpener(options);
    this._initContent(options);
    this._initTitle(options);
    this._initClassName(options);
}

LayerPopup.prototype = util.extend(
    {},
    UIController.prototype
);

LayerPopup.prototype._initTarget = function(options) {
    this.$target = options.$target || $('body');
};

LayerPopup.prototype._initExternalPopupHtmlIfNeed = function(options) {
    if (options.$el) {
        this.$el = options.$el;
        this._isExternalHtmlUse = true;
    }
};

LayerPopup.prototype._initCloserOpener = function(options) {
    if (options.openerCssQuery) {
        this.openerCssQuery = options.openerCssQuery;
    }

    if (options.closerCssQuery) {
        this.closerCssQuery = options.closerCssQuery;
    }
};

LayerPopup.prototype._initContent = function(options) {
    if (options.content) {
        this.$content = $(options.content);
    } else if (options.textContent) {
        this.$content = options.textContent;
    }
};

LayerPopup.prototype._initTitle = function(options) {
    if (options.title) {
        this.title = options.title;
    }
};

LayerPopup.prototype._initClassName = function(options) {
    if (options.className) {
        this.className = options.className;
    }
};

LayerPopup.prototype.render = function() {
    this._renderLayout();
    this._renderTitle();
    this._renderContent();

    this._attachPopupEvent();
};

LayerPopup.prototype._renderLayout = function() {
    if (!this._isExternalHtmlUse) {
        this.$el.html(LAYOUT_TEMPLATE);
        this.$el.addClass(this.className);
        this.hide();
        this.$target.append(this.$el);
        this.$body = this.$el.find(this._getFullClassName('body'));
    } else {
        this.hide();
    }
};

LayerPopup.prototype._renderContent = function() {
    if (!this._isExternalHtmlUse) {
        this.setContent(this.$content);
    }
};

LayerPopup.prototype._renderTitle = function() {
    if (!this._isExternalHtmlUse) {
        this.setTitle(this.title);
    }
};

LayerPopup.prototype._getFullClassName = function(lastName) {
    return '.' + CLASS_PREFIX + lastName;
};

LayerPopup.prototype._attachOpenerCloserEvent = function() {
    var self = this;

    if (this.openerCssQuery) {
        $(this.openerCssQuery).on('click.' + this._getId(), function() {
            self.show();
        });
    }

    if (this.closerCssQuery) {
        $(this.closerCssQuery).on('click.' + this._getId(), function() {
            self.hide();
        });
    }
};

LayerPopup.prototype._detachOpenerCloserEvent = function() {
    if (this.openerCssQuery) {
        $(this.openerCssQuery).off('.' + this._getId());
    }

    if (this.closerCssQuery) {
        $(this.closerCssQuery).off('.' + this._getId());
    }
};

LayerPopup.prototype._attachPopupControlEvent = function() {
    var self = this;

    this.on('click ' + this._getFullClassName('closeButton'), function() {
        self.hide();
    });
};

LayerPopup.prototype._detachPopupEvent = function() {
    this.off();
    this._detachOpenerCloserEvent();
};

LayerPopup.prototype._attachPopupEvent = function() {
    this._attachPopupControlEvent();
    this._attachOpenerCloserEvent();
};

LayerPopup.prototype._setId = function() {
    this._id = _id;
    _id += 1;
};

LayerPopup.prototype._getId = function() {
    return this._id;
};

LayerPopup.prototype.setContent = function($content) {
    this.$body.empty();
    this.$body.append($content);
};

LayerPopup.prototype.setTitle = function(title) {
    var $title = this.$el.find(this._getFullClassName('title'));

    $title.empty();
    $title.append(title);
};

LayerPopup.prototype.hide = function() {
    this.$el.css('display', 'none');
    this._isShow = false;
    this.trigger('hidden', this);
};

LayerPopup.prototype.show = function() {
    this.$el.css('display', 'block');
    this._isShow = true;
    this.trigger('shown', this);
};

LayerPopup.prototype.isShow = function() {
    return this._isShow;
};

LayerPopup.prototype.remove = function() {
    this.trigger('remove', this);
    this._detachPopupEvent();

    this.$el.empty();
    this.$el.remove();
};

LayerPopup.factory = function(options) {
    var popup = new LayerPopup(options);
    popup.render();
    return popup;
};

LayerPopup.CLASS_PREFIX = CLASS_PREFIX;

module.exports = LayerPopup;

},{"./uicontroller":38}],17:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Toolbar = require('./toolbar'),
    Tab = require('./tab'),
    ModeSwitch = require('./modeSwitch'),
    PopupAddLink = require('./popupAddLink'),
    PopupAddImage = require('./popupAddImage');

var containerTmpl = [
    '<div class="neonEditor">',
        '<div class="toolbarSection" />',
        '<div class="modeSwitchSection" />',
        '<div class="mdContainer">',
            '<div class="tabSection" />',
            '<div class="editor" />',
            '<div class="preview neonEditor-content" />',
        '</div>',
        '<div class="wysiwygContainer">',
            '<div class="editor" />',
        '</div>',
    '</div>'
].join('');

/**
 * Layout
 * @exports Layout
 * @extends {}
 * @constructor
 * @class
 * @param {object} options 옵션
 * @param {EventManager} eventManager 이벤트 매니저
 */
function Layout(options, eventManager) {
    this.$el = $(options.el);
    this.height = options.height;
    this.type = options.initialEditType;
    this.eventManager = eventManager;
}

Layout.prototype.init = function() {
    this._renderLayout();

    this._initToolbar();
    this._initModeSwitch();

    this._initPopupAddLink();
    this._initPopupAddImage();

    this._initMarkdownAndPreviewSection();
    this._initWysiwygSection();

    this._initEvent();
};

Layout.prototype._renderLayout = function() {
    this.$containerEl = $(containerTmpl).appendTo(this.$el);
};

Layout.prototype._initToolbar = function() {
    this.toolbar = new Toolbar(this.eventManager);
    this.$containerEl.find('.toolbarSection').append(this.toolbar.$el);
};

Layout.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('changeMode.wysiwyg', function() {
        self.switchToWYSIWYG();
    });

    this.eventManager.listen('changeMode.markdown', function() {
        self.switchToMarkdown();
    });
};

Layout.prototype._initModeSwitch = function() {
    var self = this;

    this.modeSwitch = new ModeSwitch(this.type === 'markdown' ? ModeSwitch.TYPE.MARKDOWN : ModeSwitch.TYPE.WYSIWYG);
    this.$containerEl.find('.modeSwitchSection').append(this.modeSwitch.$el);

    this.modeSwitch.on('modeSwitched', function(ev, info) {
        var type;

        if (info.type === ModeSwitch.TYPE.WYSIWYG) {
            self.eventManager.emit('changeMode.wysiwyg');
            type = "wysiwyg";
        } else {
            self.eventManager.emit('changeMode.markdown');
            type = "markdown";
        }

        self.eventManager.emit('changeMode', type);
    });
};

Layout.prototype.switchToWYSIWYG = function() {
    this.$containerEl.find('.mdContainer').css('display', 'none');
    this.$containerEl.find('.wysiwygContainer').css('display', 'block');
};

Layout.prototype.switchToMarkdown = function() {
    this.$containerEl.find('.mdContainer').css('display', 'block');
    this.$containerEl.find('.wysiwygContainer').css('display', 'none');
    this.markdownTab.activate('Editor');
};

Layout.prototype._initMarkdownAndPreviewSection = function() {
    this.$mdEditorContainerEl = this.$containerEl.find('.mdContainer .editor');
    this.$previewEl = this.$containerEl.find('.mdContainer .preview');

    this.$mdEditorContainerEl.css('height', this.height);
    this.$previewEl.css('height', this.height);

    this.markdownTab = new Tab({
        items: ['Editor', 'Preview'],
        sections: [this.$mdEditorContainerEl, this.$previewEl]
    });

    this.$containerEl.find('.mdContainer .tabSection').append(this.markdownTab.$el);
};

Layout.prototype._initWysiwygSection = function() {
    this.$wwEditorContainerEl = this.$containerEl.find('.wysiwygContainer .editor');
    this.$wwEditorContainerEl.height(this.height);
};

Layout.prototype._initPopupAddLink = function() {
    this.popupAddLink = new PopupAddLink({
        $target: this.$el.find('.neonEditor'),
        eventManager: this.eventManager
    });
};

Layout.prototype._initPopupAddImage = function() {
    this.popupAddImage = new PopupAddImage({
        $target: this.$el.find('.neonEditor'),
        eventManager: this.eventManager
    });
};

Layout.prototype._verticalSplitStyle = function() {
    this.$containerEl.find('.mdContainer').removeClass('preview-style-tab');
    this.$containerEl.find('.mdContainer').addClass('preview-style-vertical');
};

Layout.prototype._tabStyle = function() {
    this.$containerEl.find('.mdContainer').removeClass('preview-style-vertical');
    this.$containerEl.find('.mdContainer').addClass('preview-style-tab');
};

Layout.prototype.changePreviewStyle = function(style) {
    if (style === 'tab') {
        this._tabStyle();
    } else if (style === 'vertical') {
        this._verticalSplitStyle();
    }
};

Layout.prototype.hide = function() {
    this.$el.find('.neonEditor').css('display', 'none');
};

Layout.prototype.show = function() {
    this.$el.find('.neonEditor').css('display', 'block');
};

Layout.prototype.remove = function() {
    this.$el.find('.neonEditor').remove();
};

Layout.prototype.getEditorEl = function() {
    return this.$containerEl;
};

Layout.prototype.getPreviewEl = function() {
    return this.$previewEl;
};

Layout.prototype.getStatusbarLeftAreaEl = function() {
    return this.$statusbarLeftAreaEl;
};

Layout.prototype.getStatusbarRightAreaEl = function() {
    return this.$statusbarRightAreaEl;
};

Layout.prototype.getMdEditorContainerEl = function() {
    return this.$mdEditorContainerEl;
};

Layout.prototype.getWwEditorContainerEl = function() {
    return this.$wwEditorContainerEl;
};

module.exports = Layout;

},{"./modeSwitch":31,"./popupAddImage":32,"./popupAddLink":33,"./tab":35,"./toolbar":37}],18:[function(require,module,exports){
/**
 * @fileoverview Implements LazyRunner
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = ne.util;

/**
 * LazyRunner
 * @exports LazyRunner
 * @augments
 * @constructor
 * @class
 */
function LazyRunner() {
    this.globalTOID = null;
    this.lazyRunFunctions = {};
}

LazyRunner.prototype.run = function(fn, params, context, delay) {
    var TOID;

    if (util.isString(fn)) {
        TOID = this._runRegisteredRun(fn, params, context, delay);
    } else {
        TOID = this._runSingleRun(fn, params, context, delay, this.globalTOID);
        this.globalTOID = TOID;
    }

    return TOID;
};

LazyRunner.prototype.registerLazyRunFunction = function(name, fn, delay, context) {
    context = context || this;

    this.lazyRunFunctions[name] = {
        fn: fn,
        delay: delay,
        context: context,
        TOID: null
    };
};

LazyRunner.prototype._runSingleRun = function(fn, params, context, delay, TOID) {
    this._clearTOIDIfNeed(TOID);

    TOID = setTimeout(function() {
        fn.call(context, params);
    }, delay);

    return TOID;
};

LazyRunner.prototype._runRegisteredRun = function(lazyRunName, params, context, delay) {
    var TOID, fn;

    fn = this.lazyRunFunctions[lazyRunName].fn;
    TOID = this.lazyRunFunctions[lazyRunName].TOID;
    delay = delay || this.lazyRunFunctions[lazyRunName].delay;
    context = context || this.lazyRunFunctions[lazyRunName].context;

    TOID = this._runSingleRun(fn, params, context, delay, TOID);

    this.lazyRunFunctions[lazyRunName].TOID = TOID;

    return TOID;
};

LazyRunner.prototype._clearTOIDIfNeed = function(TOID) {
    if (TOID) {
        clearTimeout(TOID);
    }
};

module.exports = LazyRunner;

},{}],19:[function(require,module,exports){
/**
 * @fileoverview Implments AddImage markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var CodeMirror = window.CodeMirror;

/**
 * AddImage
 * Add Image markdown syntax to markdown Editor
 * @exports AddImage
 * @augments Command
 * @augments MarkdownCommand
 */
var AddImage = CommandManager.command('markdown',
/** @lends AddImage */
{
    name: 'AddImage',
    /**
     *  커맨드 핸들러
     *  @param {MarkdownEditor} mde MarkdownEditor instance
     *  @param {object} data data for image
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function(mde, data) {
        var replaceText, range, from, to,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: range.from.ch
        };

        to = {
            line: range.to.line,
            ch: range.to.ch
        };

        replaceText = '![' + data.altText + '](' + data.imageUrl + ')';

        doc.replaceRange(replaceText, from, to, '+addImage');

        cm.focus();
    }
});

module.exports = AddImage;

},{"../commandManager":7}],20:[function(require,module,exports){
/**
 * @fileoverview Implements Addlink markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var CodeMirror = window.CodeMirror;

/**
 * AddLink
 * Add link markdown syntax to markdown editor
 * @exports AddLink
 * @augments Command
 * @augments MarkdownCommand
 */
var AddLink = CommandManager.command('markdown',/** @lends AddLink */{
    name: 'AddLink',
    /**
     *  커맨드 핸들러
     *  @param {MarkdownEditor} mde MarkdownEditor instance
     *  @param {object} data data for image
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function(mde, data) {
        var replaceText, range, from, to,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: range.from.ch
        };

        to = {
            line: range.to.line,
            ch: range.to.ch
        };

        replaceText = '[' + data.linkText + '](' + data.url + ')';

        doc.replaceRange(replaceText, from, to);

        cm.focus();
    }
});

module.exports = AddLink;

},{"../commandManager":7}],21:[function(require,module,exports){
/**
 * @fileoverview Implements Blockquote markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var CodeMirror = window.CodeMirror;

/**
 * Blockquote
 * Add blockquote markdown syntax to markdown editor
 * @exports Blockquote
 * @augments Command
 * @augments MarkdownCommand
 */
var Blockquote = CommandManager.command('markdown',/** @lends Blockquote */{
    name: 'Blockquote',
    keyMap: ['Ctrl-Q', 'Ctrl-Q'],
    /**
     *  커맨드 핸들러
     *  @param {MarkdownEditor} mde MarkdownEditor instance
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function(mde) {
        var textToModify, range, from, to, textLinesToModify, lineLength, i,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        //range 을 가공함
        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: 0
        };

        to = {
            line: range.to.line,
            ch: doc.getLineHandle(range.to.line).text.length
        };

        //영역의 텍스트를 가저오고
        textToModify = doc.getRange(from, to);

        //텍스트 컨텐트를 변경 한다
        textLinesToModify = textToModify.split('\n');
        lineLength = textLinesToModify.length;

        for (i = 0; i < lineLength; i += 1) {
            textLinesToModify[i] = '>' + textLinesToModify[i];
        }

        //해당 에디터의 내용을 변경한다
        doc.replaceRange(textLinesToModify.join('\n'), from, to);

        range.to.ch += 1;

        doc.setCursor(range.to);

        cm.focus();
    }
});

module.exports = Blockquote;

},{"../commandManager":7}],22:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var boldRegex = /^[\*_]{2,}[^\*_]*[\*_]{2,}$/;

var CodeMirror = window.CodeMirror;

/**
 * Bold
 * Add bold markdown syntax to markdown editor
 * @exports Bold
 * @augments Command
 * @augments MarkdownCommand
 */
var Bold = CommandManager.command('markdown',/** @lends Bold */{
    name: 'Bold',
    keyMap: ['Ctrl-B', 'Ctrl-B'],
    /**
     *  커맨드 핸들러
     *  @param {MarkdownEditor} mde MarkdownEditor instance
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function(mde) {
        var cursor, selection, tmpSelection, isRemoved, result, isEmpty,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        cursor = doc.getCursor();
        selection = doc.getSelection();
        isEmpty = !selection;

        // if selection is empty, expend selection to detect a syntax
        if (isEmpty && cursor.ch > 1) {
            tmpSelection = this.expendSelection(doc, cursor);
            selection = tmpSelection || selection;
        }

        isRemoved = this.isNeedRemove(selection);
        result = isRemoved ? this.remove(selection) : this.append(selection);

        doc.replaceSelection(result, 'around');

        if (isEmpty && !isRemoved) {
            this.setCursorToCenter(doc, cursor);
        }

        cm.focus();
    },
    /**
     * 이미 Bold가 적용이 되어있는지 확인
     * @param {string} text 셀렉션텍스트
     * @return {boolean} 볼드 적용 여부
     */
    isNeedRemove: function(text) {
        return boldRegex.test(text);
    },
    /**
     * Bold를 적용한다
     * @param {string} text 셀렉션텍스트
     * @return {string} 볼드가 적용된 텍스트
     */
    append: function(text) {
        return '**' + text + '**';
    },
    /**
     * Bold를 제거한다
     * @param {string} text 셀렉션텍스트
     * @return {string} 볼드가 제거된 텍스트
     */
    remove: function(text) {
        return text.substr(2, text.length - 4);
    },
    /**
     * 셀렉션영역을 확장한다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트 객체
     * @param {object} cursor 코드미러 커서 객체
     * @return {string} 셀렉션의 텍스트
     */
    expendSelection: function(doc, cursor) {
        var tmpSelection = doc.getSelection();

        doc.setSelection({line: cursor.line, ch: cursor.ch - 2}, {line: cursor.line, ch: cursor.ch + 2});

        if (tmpSelection === '****' || tmpSelection === '____') {
            return tmpSelection;
        } else {
            doc.setSelection(cursor);
        }
    },
    /**
     * 커서를 센터로 이동시킨다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트 객체
     * @param {object} cursor 코드미러 커서 객체
     */
    setCursorToCenter: function(doc, cursor) {
        doc.setCursor(cursor.line, cursor.ch + 2);
    }
});

module.exports = Bold;

},{"../commandManager":7}],23:[function(require,module,exports){
/**
 * @fileoverview Implements Heading markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var CodeMirror = window.CodeMirror;

/**
 * Heading
 * Add heading markdown syntax to markdown editor
 * @exports Heading
 * @augments Command
 * @augments MarkdownCommand
 */
var Heading = CommandManager.command('markdown',/** @lends Heading */{
    name: 'Heading',
    keyMap: ['Ctrl-H', 'Ctrl-H'],
    /**
     *  커맨드 핸들러
     *  @param {MarkdownEditor} mde MarkdownEditor instance
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function(mde) {
        var textToModify, range, from, to, textLinesToModify, lineLength, i,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        // 선택된 영역을 가공함
        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: 0
        };

        to = {
            line: range.to.line,
            ch: doc.getLineHandle(range.to.line).text.length
        };

        //영역의 텍스트를 가저오고
        textToModify = doc.getRange(from, to);

        //원하는 대로 가공한다
        textLinesToModify = textToModify.split('\n');
        lineLength = textLinesToModify.length;

        for (i = 0; i < lineLength; i += 1) {
            textLinesToModify[i] = '#' + textLinesToModify[i];
        }

        //해당 에디터의 내용을 변경한다
        doc.replaceRange(textLinesToModify.join('\n'), from, to);

        range.to.ch += 1;
        doc.setCursor(range.to);

        cm.focus();
    }
});

module.exports = Heading;

},{"../commandManager":7}],24:[function(require,module,exports){
/**
 * @fileoverview HR markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var CodeMirror = window.CodeMirror;

/**
 * HR
 * Add HR markdown syntax to markdown editor
 * @exports HR
 * @augments Command
 * @augments MarkdownCommand
 */
var HR = CommandManager.command('markdown',/** @lends HR */{
    name: 'HR',
    /**
     *  커맨드 핸들러
     *  @param {MarkdownEditor} mde MarkdownEditor instance
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function(mde) {
        var replaceText, range, from, to,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: range.from.ch
        };

        to = {
            line: range.to.line,
            ch: range.to.ch
        };

        if (range.collapsed) {
            replaceText = doc.getLine(from.line) + '\n***';
            from.ch = 0;
            to.ch = doc.getLineHandle(range.to.line).text.length;
        } else {
            replaceText = '***';
        }

        doc.replaceRange(replaceText, from, to);

        cm.focus();
    }
});

module.exports = HR;

},{"../commandManager":7}],25:[function(require,module,exports){
/**
 * @fileoverview Implements Italic markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var boldItalicRegex = /^[\*_]{3,}[^\*_]*[\*_]{3,}$/;
var italicRegex = /^[\*_][^\*_]*[\*_]$/;

var CodeMirror = window.CodeMirror;

/**
 * Italic
 * Add italic markdown syntax to markdown editor
 * @exports Italic
 * @augments Command
 * @augments MarkdownCommand
 */
var Italic = CommandManager.command('markdown',/** @lends Italic */{
    name: 'Italic',
    keyMap: ['Ctrl-I', 'Ctrl-I'],
    /**
     *  커맨드 핸들러
     *  @param {MarkdownEditor} mde MarkdownEditor instance
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function(mde) {
        var cursor, selection, tmpSelection, isRemoved, result, isEmpty, isWithBold,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        cursor = doc.getCursor();
        selection = doc.getSelection();
        isEmpty = !selection;
        isWithBold = false;

        // if selection is empty, expend selection to detect a syntax
        if (isEmpty) {
            if (cursor.ch > 2) {
                tmpSelection = this.expendWithBoldSelection(doc, cursor);

                if (tmpSelection) {
                    isWithBold = 'with';
                }
            }

            if (isWithBold !== 'with' && cursor.ch > 1) {
                isWithBold = this.expendOnlyBoldSelection(doc, cursor);
            }

            if (!isWithBold && cursor.ch > 0) {
                this.expendSelection(doc, cursor);
                selection = tmpSelection || selection;
            }
        }

        isRemoved = this.isNeedRemove(selection);
        result = isRemoved ? this.remove(selection) : this.append(selection);

        doc.replaceSelection(result, 'around');

        if (isEmpty) {
            this.setCursorToCenter(doc, cursor, isRemoved);
        }

        cm.focus();
    },
    /**
     * isNeedRemove
     * 이미 텍스트에 이탤릭이나 볼드가 적용되어 있는지 판단한다
     * @param {string} text 텍스트
     * @return {boolean} 적용 여부
     */
    isNeedRemove: function(text) {
        return italicRegex.test(text) || boldItalicRegex.test(text);
    },
    /**
     * append
     * 텍스트에 이탤릭을 적용한다
     * @param {string} text 적용할 텍스트
     * @return {string} 이탤릭이 적용된 텍스트
     */
    append: function(text) {
        return '*' + text + '*';
    },
    /**
     * remove
     * 텍스트에서 이탤릭을 제거한다
     * @param {string} text 제거할 텍스트
     * @return {string} 제거된 텍스트
     */
    remove: function(text) {
        return text.substr(1, text.length - 2);
    },
    /**
     * expendWithBoldSelection
     * 볼드와 함께 적용된 셀렉션 영역을 확장한다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
     * @param {object} cursor 커서객체
     * @return {string} 확장된 영역의 텍스트
     */
    expendWithBoldSelection: function(doc, cursor) {
        var tmpSelection = doc.getSelection();

        doc.setSelection({line: cursor.line, ch: cursor.ch - 3}, {line: cursor.line, ch: cursor.ch + 3});

        if (tmpSelection === '******' || tmpSelection === '______') {
            return tmpSelection;
        } else {
            doc.setSelection(cursor);
        }
    },
    /**
     * expendOnlyBoldSelection
     * 볼드만 적용된 셀렉션 영역을 확장한다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
     * @param {object} cursor 커서객체
     * @return {string} 확장된 영역의 텍스트
     */
    expendOnlyBoldSelection: function(doc, cursor) {
        var tmpSelection = doc.getSelection();

        doc.setSelection({line: cursor.line, ch: cursor.ch - 2}, {line: cursor.line, ch: cursor.ch + 2});

        if (tmpSelection === '****' || tmpSelection === '____') {
            doc.setSelection(cursor);
            return 'only';
        }

        return false;
    },
    /**
     * expendSelection
     * 이탤릭이 적용된 셀렉션 영역을 확장한다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
     * @param {object} cursor 커서객체
     * @return {string} 확장된 영역의 텍스트
     */
    expendSelection: function(doc, cursor) {
        var tmpSelection = doc.getSelection();

        doc.setSelection({line: cursor.line, ch: cursor.ch - 1}, {line: cursor.line, ch: cursor.ch + 1});

        if (tmpSelection === '**' || tmpSelection === '__') {
            return tmpSelection;
        } else {
            doc.setSelection(cursor);
        }
    },
    /**
     * setCursorToCenter
     * 커서를 중앙으로 이동시킨다
     * @param {CodeMirror.doc} doc 코드미러 도큐먼트
     * @param {object} cursor 커서객체
     * @param {boolean} isRemoved 변경사항이 지우는 변경이었는지 여부
     */
    setCursorToCenter: function(doc, cursor, isRemoved) {
        var pos = isRemoved ? -1 : 1;
        doc.setCursor(cursor.line, cursor.ch + pos);
    }
});

module.exports = Italic;

},{"../commandManager":7}],26:[function(require,module,exports){
/**
 * @fileoverview Implements OL markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var CodeMirror = window.CodeMirror;

/**
 * OL
 * Add ordered list markdown syntax to markdown editor
 * @exports OL
 * @augments Command
 * @augments MarkdownCommand
 */
var OL = CommandManager.command('markdown',/** @lends OL */{
    name: 'OL',
    /**
     *  커맨드 핸들러
     *  @param {MarkdownEditor} mde MarkdownEditor instance
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function(mde) {
        var replaceText, range, from, to,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: range.from.ch
        };

        to = {
            line: range.to.line,
            ch: range.to.ch
        };

        replaceText = '1. ';

        doc.replaceRange(replaceText, from, to);

        cm.focus();
    }
});

module.exports = OL;

},{"../commandManager":7}],27:[function(require,module,exports){
/**
 * @fileoverview Implements Task markdown command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var CodeMirror = window.CodeMirror;

/**
 * Task
 * @exports Task
 * @augments Command
 * @augments MarkdownCommand
 */

var Task = CommandManager.command('markdown',/** @lends Task */{
    name: 'Task',
    /**
     *  커맨드 핸들러
     *  @param {MarkdownEditor} mde MarkdownEditor instance
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function(mde) {
        var replaceText, range, from, to,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: range.from.ch
        };

        to = {
            line: range.to.line,
            ch: range.to.ch
        };

        replaceText = '* [ ] ';

        doc.replaceRange(replaceText, from, to);

        cm.focus();
    }
});

module.exports = Task;

},{"../commandManager":7}],28:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

var CodeMirror = window.CodeMirror;

/**
 * UL
 * Add unordered list markdown syntax to markdown editor
 * @exports UL
 * @augments Command
 * @augments MarkdownCommand
 */
var UL = CommandManager.command('markdown',/** @lends UL */{
    name: 'UL',
    /**
     *  커맨드 핸들러
     *  @param {MarkdownEditor} mde MarkdownEditor instance
     *  @return {CodeMirror} 코드미러 상수
     */
    exec: function(mde) {
        var replaceText, range, from, to,
            cm = mde.getEditor(),
            doc = cm.getDoc();

        if (cm.getOption('disableInput')) {
            return CodeMirror.Pass;
        }

        range = mde.getCurrentRange();

        from = {
            line: range.from.line,
            ch: range.from.ch
        };

        to = {
            line: range.to.line,
            ch: range.to.ch
        };

        replaceText = '* ';

        doc.replaceRange(replaceText, from, to);

        cm.focus();
    }
});

module.exports = UL;

},{"../commandManager":7}],29:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CodeMirror = window.CodeMirror;

/**
 * MarkdownEditor
 * @exports MarkdownEditor
 * @extends {}
 * @constructor
 * @class
 * @param {jQuery} $el 에디터가 들어갈 엘리먼트
 * @param {EventManager} eventManager 이벤트 매니저
 * @param {commandManager} commandManager 커맨드 매니저
 */
function MarkdownEditor($el, eventManager) {
    this.eventManager = eventManager;
    this.$editorContainerEl = $el;
}

MarkdownEditor.prototype.init = function(initialValue) {
    var cmTextarea = $('<textarea />');

    if (initialValue) {
        cmTextarea.text(initialValue);
        this._emitMarkdownEditorContentChangedEvent(initialValue);
    }

    this.$editorContainerEl.append(cmTextarea);

    this.cm = CodeMirror.fromTextArea(cmTextarea[0], {
        lineWrapping: true,
        mode: 'gfm',
        theme: 'default',
        dragDrop: false,
        extraKeys: {'Enter': 'newlineAndIndentContinueMarkdownList'}
    });

    this._initEvent();
};

MarkdownEditor.prototype._initEvent = function() {
    var self = this;

    this.cm.on('change', function(cm, cmEvent) {
        self._emitMarkdownEditorContentChangedEvent();
        self._emitMarkdownEditorChangeEvent(cmEvent);
    });

    this.eventManager.listen('changeMode.markdown', function() {
        self.cm.refresh();
    });
};

/**
 * getCurrentRange
 * returns current selection's range
 * @param {CodeMirror} cm codemirror instance
 * @return {object} selection range
 */
MarkdownEditor.prototype.getCurrentRange = function() {
    var from = this.cm.getCursor('from'),
    to = this.cm.getCursor('to');

    return {
        from: from,
        to: to,
        collapsed: from === to
    };
};

MarkdownEditor.prototype.focus = function() {
    this.cm.focus();
};

MarkdownEditor.prototype.remove = function() {
    this.cm.toTextArea();
};

MarkdownEditor.prototype.setValue = function(markdown) {
    this.cm.setValue(markdown);
    this._emitMarkdownEditorContentChangedEvent();
};

MarkdownEditor.prototype.getValue = function() {
    return this.cm.getValue('\n');
};

MarkdownEditor.prototype.getEditor = function() {
    return this.cm;
};

MarkdownEditor.prototype._emitMarkdownEditorContentChangedEvent = function(value) {
    this.eventManager.emit('contentChanged.markdownEditor', value || this.getValue());
};

MarkdownEditor.prototype._emitMarkdownEditorChangeEvent = function(e) {
    var eventObj;

    if (e.origin !== 'setValue' && e.origin !== '*compose') {
        e.to.ch += 1;

        eventObj = {
            source: 'markdown',
            selection: {from: e.from, to: e.to},
            textContent: this.cm.getDoc().getLine(e.to.line) || '',
            caretOffset: e.to.ch
        };

        this.eventManager.emit('change.markdownEditor', eventObj);
        this.eventManager.emit('change', eventObj);
    }
};

MarkdownEditor.prototype.getCaretPosition = function() {
    return this.cm.cursorCoords();
};

MarkdownEditor.prototype.addWidget = function(selection, node, style, offset) {
    if (offset) {
        selection.to.ch += offset;
    }

    this.cm.addWidget(selection.to, node, true, style);
};

MarkdownEditor.prototype.replaceSelection = function(content, selection) {
    if (selection) {
        this.cm.setSelection(selection.from, selection.to);
    }

    this.cm.replaceSelection(content);
    this.focus();
};

MarkdownEditor.prototype.replaceRelativeOffset = function(content, offset, overwriteLength) {
    var cursor = this.cm.getCursor(),
        selection = {
            from: {
                line: cursor.line,
                ch: cursor.ch + offset
            },
            to: {
                line: cursor.line,
                ch: (cursor.ch + offset) + overwriteLength
            }
        };

    this.replaceSelection(content, selection);
};

module.exports = MarkdownEditor;

},{}],30:[function(require,module,exports){
/**
 * @fileoverview Implements markedCustomRenderer
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent
 */

'use strict';

/**
 * markedCustomRenderer
 * @exports markedCustomRenderer
 * @augments marked.Renderer
 */
var markedCustomRenderer = new window.marked.Renderer();

var regexTaskList = /^((?:<p>|))\[(?:x| )\] /;

markedCustomRenderer.list = function(body, ordered) {
    var className = '',
    type = ordered ? 'ol' : 'ul';

    if (body.indexOf('<li class="task-list-item">') > -1) {
        className = ' class="task-list"';
    }

    return '<' + type + className + '>\n' + body + '</' + type + '>\n';
};

markedCustomRenderer.listitem = function(text) {
    var cap,
    checked,
    className = '',
        output = '';

    cap = regexTaskList.exec(text);

    if (cap) {
        text = text.substring(cap[0].length);
        className = ' class="task-list-item"';
        checked = cap[0] === '[x] ' ? ' checked' : '';
        output += cap[1] + '<input type="checkbox" class="task-list-item-checkbox"' + checked + '> ';
    }

    return '<li' + className + '>' + output + text + '</li>\n';
};

markedCustomRenderer.code = function(code, lang, escaped) {
    var out;
    if (this.options.highlight) {
        out = this.options.highlight(code, lang);
        if (out !== null && out !== code) {
            escaped = true;
            code = out;
        }
    }

    if (!lang) {
        return '<pre><code>'
        + (escaped ? code : escape(code, true))
        + '\n</code></pre>';
    }

    return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '" data-language="' + escape(lang, true) + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};


//escape code from marekd
function escape(html, encode) {
    return html
        .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

module.exports = markedCustomRenderer;

},{}],31:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var UIController = require('./uicontroller');

var util = ne.util;

var nextTypeString = ['WYSIWYG', 'Markdown'],
    TYPE = {
        'MARKDOWN': 0,
        'WYSIWYG': 1
    };

/**
 * ModeSwitch
 * UI Control for switch between Markdown and WYSIWYG
 * @exports ModeSwitch
 * @augments UIController
 * @constructor
 * @class
 * @param {number} initialType initial type of editor
 */
function ModeSwitch(initialType) {
    UIController.call(this, {
        tagName: 'div',
        className: 'modeSwitch'
    });

    this.type = util.isExisty(initialType) ? initialType : TYPE.MARKDOWN;
    this._render();
}

ModeSwitch.prototype = util.extend(
    {},
    UIController.prototype
);

ModeSwitch.prototype._render = function() {
    this.$button = $('<button class="switchButton" type="button" />');
    this._setButtonTitle();
    this.$el.append(this.$button);

    this.attachEvents({
        'click button': '_buttonClicked'
    });
};

ModeSwitch.prototype._setButtonTitle = function() {
    this.$button.text('to' + this._getNextTypeString());
};

ModeSwitch.prototype._buttonClicked = function() {
    this._switchType();
};

ModeSwitch.prototype._switchType = function() {
    var typeToSwitch = this._getNextTypeString();

    this._toggleType();
    this._setButtonTitle();

    this.trigger('modeSwitched', {
        type: this.type,
        text: typeToSwitch
    });
};

ModeSwitch.prototype._getNextTypeString = function() {
    return nextTypeString[this.type];
};

ModeSwitch.prototype._toggleType = function() {
    this.type = this.type === TYPE.MARKDOWN ? TYPE.WYSIWYG : TYPE.MARKDOWN;
};

ModeSwitch.TYPE = TYPE;

module.exports = ModeSwitch;

},{"./uicontroller":38}],32:[function(require,module,exports){
/**
 * @fileoverview Implements PopupAddImage
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var LayerPopup = require('./layerpopup'),
    Tab = require('./tab');

var util = ne.util;

var POPUP_CONTENT = [
    '<div class="tabSection"></div>',
    '<div class="urlType">',
        '<label for="">Image URL</label>',
        '<input type="text" class="imageUrlInput" />',
    '</div>',
    '<form enctype="multipart/form-data" class="fileType">',
        '<label for="">Image File</label>',
        '<input type="file" class="imageFileInput" accept="image/*" />',
    '</form>',
    '<label for="url">Alt Text</label>',
    '<input type="text" class="altTextInput" />',
    '<div class="buttonSection">',
        '<button type="button" class="okButton">OK</button>',
        '<button type="button" class="closeButton">Cancel</button>',
    '</div>'
].join('');

/**
 * PopupAddImage
 * It implements a Image Add Popup
 * @exports PopupAddImage
 * @augments LayerPopup
 * @constructor
 * @class
 * @param {object} options options
 */
function PopupAddImage(options) {
    options = util.extend({
        title: 'Add Image',
        className: 'popupAddImage neonEditor-popup',
        content: POPUP_CONTENT
    }, options);

    LayerPopup.call(this, options);

    this.eventManager = options.eventManager;

    this.render();

    this._bindContentEvent();
    this._linkWithEventManager();
    this._initApplyImageBindContext();
}

PopupAddImage.prototype = util.extend(
    {},
    LayerPopup.prototype
);

PopupAddImage.prototype._bindContentEvent = function() {
    var self = this;

    this.on('click .okButton', function() {
        self.trigger('okButtonClicked', this);
        self.hide();
    });

    this.on('click .closeButton', function() {
        self.trigger('closeButtonClicked', this);
        self.hide();
    });

    this.on('shown', function() {
        self.$el.find('.imageUrlInput').focus();
    });

    this.on('hidden', function() {
        self.resetInputs();
    });
};

PopupAddImage.prototype._linkWithEventManager = function() {
    var self = this;

    this.eventManager.listen('openPopupAddImage', function() {
        self.eventManager.emit('closeAllPopup');
        self.show();
    });

    this.eventManager.listen('closeAllPopup', function() {
        self.hide();
    });

    this.on('okButtonClicked', function() {
        if (self._isUrlType()) {
            self.applyImage();
        } else {
            self._preAltValue = self.$el.find('.altTextInput').val();
            self.eventManager.emit('addImageFileHook', self._getImageFileForm(), self.applyImage);
        }
    });
};

PopupAddImage.prototype._initApplyImageBindContext = function() {
    var self = this;

    this.applyImage = function(url) {
        var info;

        if (url) {
            info = self._getImageInfoWithGivenUrl(url);
        } else {
            info = self._getImageInfo();
        }

        self.eventManager.emit('command', 'AddImage', info);
        self.hide();
    };
};

PopupAddImage.prototype._isUrlType = function() {
    return !!this.$el.find('.imageUrlInput').val();
};

/**
 * _renderContent
 * @override
 */
PopupAddImage.prototype._renderContent = function() {
    var $popup = this.$el;

    LayerPopup.prototype._renderContent.call(this);

    this.$body.find('.tabSection').append(new Tab({
        initName: 'File',
        items: ['File', 'URL'],
        sections: [$popup.find('.fileType'), $popup.find('.urlType')]
    }).$el);
};

PopupAddImage.prototype._getImageInfoWithGivenUrl = function(imageUrl) {
    var altText = this._preAltValue;
    this._preAltValue = '';
    return this._makeImageInfo(imageUrl, altText);
};

PopupAddImage.prototype._getImageInfo = function() {
    var imageUrl = this.$el.find('.imageUrlInput').val(),
    altText = this.$el.find('.altTextInput').val();

    return this._makeImageInfo(imageUrl, altText);
};

PopupAddImage.prototype._makeImageInfo = function(url, alt) {
    return {
        imageUrl: url,
        altText: alt
    };
};

PopupAddImage.prototype._getImageFileForm = function() {
    return this.$el.find('form');
};

PopupAddImage.prototype.resetInputs = function() {
    this.$el.find('input').val('');
};

module.exports = PopupAddImage;

},{"./layerpopup":16,"./tab":35}],33:[function(require,module,exports){
/**
 * @fileoverview Implements PopupAddLink
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var LayerPopup = require('./layerpopup');

var util = ne.util;

var POPUP_CONTENT = [
    '<label for="linkText">Link Text</label>',
    '<input type="text" class="linkTextInput" />',
    '<label for="url">URL</label>',
    '<input type="text" class="urlInput" />',
    '<div class="buttonSection">',
        '<button type="button" class="okButton">OK</button>',
        '<button type="button" class="closeButton">Cancel</button>',
    '</div>'
].join('');

/**
 * PopupAddLink
 * It implements a link Add Popup
 * @exports PopupAddLink
 * @augments LayerPopup
 * @constructor
 * @class
 * @param {object} options options
 */
function PopupAddLink(options) {
    options = util.extend({
        title: 'Add Link',
        className: 'popupAddLink neonEditor-popup',
        content: POPUP_CONTENT
    }, options);

    LayerPopup.call(this, options);

    this.render();
    this._bindContentEvent();
    this._linkWithEventManager(options.eventManager);
}

PopupAddLink.prototype = util.extend(
    {},
    LayerPopup.prototype
);

PopupAddLink.prototype._bindContentEvent = function() {
    var self = this;

    this.on('click .okButton', function() {
        self.trigger('okButtonClicked', this);
        self.hide();
    });

    this.on('click .closeButton', function() {
        self.trigger('closeButtonClicked', this);
        self.hide();
    });

    this.on('shown', function() {
        self.$el.find('.linkTextInput').focus();
    });

    this.on('hidden', function() {
        self.resetInputs();
    });
};

PopupAddLink.prototype._linkWithEventManager = function(eventManager) {
    var self = this;

    eventManager.listen('openPopupAddLink', function() {
        eventManager.emit('closeAllPopup');
        self.show();
    });

    eventManager.listen('closeAllPopup', function() {
        self.hide();
    });

    this.on('okButtonClicked', function() {
        eventManager.emit('command', 'AddLink', self.getValue());
    });
};

PopupAddLink.prototype.getValue = function() {
    return {
        linkText: this.$el.find('.linkTextInput').val(),
        url: this.$el.find('.urlInput').val()
    };
};

PopupAddLink.prototype.resetInputs = function() {
    this.$el.find('input').val('');
};

module.exports = PopupAddLink;

},{"./layerpopup":16}],34:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var LazyRunner = require('./lazyRunner');

/**
 * Preview
 * @exports Preview
 * @extends {}
 * @constructor
 * @class
 * @param {jQuery} $el 프리뷰가 들어갈 엘리먼트
 * @param {EventManager} eventManager 이벤트 매니저
 * @param {Converter} converter 컨버터
 **/
function Preview($el, eventManager, converter) {
    this.eventManager = eventManager;
    this.converter = converter;
    this.$el = $el;

    this.lazyRunner = new LazyRunner();

    this.lazyRunner.registerLazyRunFunction(
        'refresh',
        this.refresh,
        800,
        this
    );
    this._initEvent();
}

Preview.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('contentChanged.markdownEditor', function(markdown) {
        self.lazyRunner.run('refresh', markdown);
    });
};

Preview.prototype.refresh = function(markdown) {
    this.render(this.converter.toHTMLWithCodeHightlight(markdown));
};

Preview.prototype.render = function(html) {
    var processedDataByHook,
        finalHtml = html;

    processedDataByHook = this.eventManager.emit('previewBeforeHook', html);

    if (processedDataByHook) {
        finalHtml = processedDataByHook[0];
    }

    this.$el.empty();
    this.$el.html(finalHtml);
};

module.exports = Preview;

},{"./lazyRunner":18}],35:[function(require,module,exports){
/**
 * @fileoverview tab버튼 UI를 그리는 객체가 정의되어 있다
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var UIController = require('./uicontroller'),
    templater = require('./templater');

var util = ne.util;

var buttonTmpl = '<button type="button" data-index="${index}">${name}</button>';

/**
 * Tab
 * @exports Tab
 * @augments UIController
 * @constructor
 * @class
 * @param {object} options options
 * @param {string[]} options.items Button names to be created
 * @param {DOMElement[]} options.sections Dom elements for tab
 * @param {function} options.onItemClick when button is clicked pass button name to function
 * @example
 * var tab = new Tab({
 *     items: ['Editor', 'Preview'],
 *     sections: [this.$mdEditorContainerEl, this.$previewEl]
 * });
 */
function Tab(options) {
    UIController.call(this, {
        tagName: 'div',
        className: 'tab'
    });

    options = util.extend({}, options);

    this.items = options.items;
    this.sections = options.sections;

    this._$activeButton = null;

    this.render();
    this._initItemClickEvent(options.onItemClick);

    this._applyInitName(options.initName);
}

Tab.prototype = util.extend(
    {},
    UIController.prototype
);

/**
 * render
 * render UI
 */
Tab.prototype.render = function() {
    var buttonHtml;

    buttonHtml = templater(buttonTmpl, this._getButtonData());

    this.$el.html(buttonHtml);

    this.attachEvents({
        'click button': '_onButtonClick'
    });
};

/**
 * _applyInitName
 * Apply initial section by button item name
 * @param {string} initName Button name to activate
 */
Tab.prototype._applyInitName = function(initName) {
    if (initName) {
        this.activate(initName);
    }
};

/**
 * _getButtonData
 * Make button data by this.items
 * @return {object[]} Button data
 */
Tab.prototype._getButtonData = function() {
    var buttonData = [],
    i,
    len;

    for (i = 0, len = this.items.length; i < len; i += 1) {
        buttonData.push({
            name: this.items[i],
            index: i
        });
    }

    return buttonData;
};

/**
 * _onButtonClick
 * Button click handler
 * @param {event} ev Event object
 */
Tab.prototype._onButtonClick = function(ev) {
    var $button = $(ev.target);
    this._activateTabByButton($button);
};

/**
 * _deactivate
 * Deactive active section and button
 */
Tab.prototype._deactivate = function() {
    if (this._$activeButton) {
        this._$activeButton.removeClass('active');

        if (this.sections) {
            this.sections[this._$activeButton.attr('data-index')].removeClass('active');
        }
    }
};

/**
 * _activateButton
 * Activate button
 * @param {jQuery} $button button to activate
 */
Tab.prototype._activateButton = function($button) {
    this._$activeButton = $button;
    this._$activeButton.addClass('active');
};

/**
 * _activateSection
 * Activate Section
 * @param {number} index Section index to activate
 */
Tab.prototype._activateSection = function(index) {
    if (this.sections) {
        this.sections[index].addClass('active');
    }
};

/**
 * activate
 * Activate Section & Button
 * @param {string} name button name to activate
 */
Tab.prototype.activate = function(name) {
    var $button = this.$el.find('button:contains("' + name + '")');
    this._activateTabByButton($button);
};

/**
 * _activateTabByButton
 * Activate tab section by button
 * @param {jQuery} $button button to activate
 */
Tab.prototype._activateTabByButton = function($button) {
    if (this._isActivatedButton($button)) {
        return;
    }

    this._deactivate();

    this._activateButton($button);
    this._activateSection($button.attr('data-index'));

    this.trigger('itemClick', $button.text());
};

/**
 * _isActivatedButton
 * Check passed button is activated
 * @param {jQuery} $button Button to check
 * @return {boolean} result
 */
Tab.prototype._isActivatedButton = function($button) {
    return this._$activeButton && this._$activeButton.text() === $button.text();
};

/**
 * _initItemClickEvent
 * Initialize itemClick event handler
 * @param {function} handler Function to invoke when button is clicked
 */
Tab.prototype._initItemClickEvent = function(handler) {
    if (handler) {
        this.on('itemClick', handler);
    }
};

module.exports = Tab;

},{"./templater":36,"./uicontroller":38}],36:[function(require,module,exports){
/**
 * @fileoverview Implements templater function
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = ne.util;

/**
 * 템플릿데이터에 객체의 데이터를 삽입해 스트링을 리턴한다.
 * 매핑데이터를 배열로 전달하면 갯수만큼 템플릿을 반복생성한다.
 * @param {string} template 템플릿 텍스트
 * @param {object|object[]} mapper 템플릿과 합성될 데이터
 * @return {array} rendered text
 */
function templater(template, mapper) {
    var totalReplaced = [],
        replaced;

    if (!util.isArray(mapper)) {
        mapper = [mapper];
    }

    util.forEach(mapper, function(mapdata) {
        replaced = template.replace(/\${([\w]+)}/g, function(matchedString, name) {
            return util.isExisty(mapdata, name) ? mapdata[name].toString() : '';
        });

        totalReplaced.push(replaced);
    });

    return totalReplaced;
}

module.exports = templater;


},{}],37:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var UIController = require('./uicontroller'),
    Button = require('./button');

var util = ne.util;

/**
 * Toolbar
 * @exports Toolbar
 * @augments UIController
 * @constructor
 * @class
 * @param {EventManager} eventManager 이벤트 매니저
 */
function Toolbar(eventManager) {
    UIController.call(this, {
        tagName: 'div',
        className: 'toolbar'
    });

    this.buttons = [];

    this.eventManager = eventManager;

    this.render();
    this._initButton();
}

Toolbar.prototype = util.extend(
    {},
    UIController.prototype
);

/**
 * render
 * Render toolbar
 */
Toolbar.prototype.render = function() {
    this.$buttonContainer = this.$el;
};

/**
 * 버튼을 추가한다
 * @param {Button} button 버튼
 */
Toolbar.prototype.addButton = function(button) {
    var ev = this.eventManager;

    button.on('command', function emitCommandEvent($, commandName) {
        ev.emit('command', commandName);
    });

    button.on('event', function emitEventByCommand($, eventName) {
        ev.emit(eventName);
    });

    this.buttons.push(button);
    this.$buttonContainer.append(button.$el);
};

/**
 * 필요한 버튼들을 추가한다.
 */
Toolbar.prototype._initButton = function() {
    this.addButton(new Button({
        className: 'bold',
        command: 'Bold',
        text: 'B'
    }));

    this.addButton(new Button({
        className: 'italic',
        command: 'Italic',
        text: 'I'
    }));

    this.addButton(new Button({
        className: 'quote',
        command: 'Blockquote',
        text: 'Q'
    }));

    this.addButton(new Button({
        className: 'heading',
        command: 'Heading',
        text: 'HH'
    }));

    this.addButton(new Button({
        className: 'hrline',
        command: 'HR',
        text: 'HR'
    }));

    this.addButton(new Button({
        className: 'link',
        event: 'openPopupAddLink',
        text: 'A'
    }));

    this.addButton(new Button({
        className: 'image',
        event: 'openPopupAddImage',
        text: 'IMG'
    }));

    this.addButton(new Button({
        className: 'ul',
        command: 'UL',
        text: 'UL'
    }));

    this.addButton(new Button({
        className: 'ol',
        command: 'OL',
        text: 'OL'
    }));

    this.addButton(new Button({
        className: 'task',
        command: 'Task',
        text: 'TASK'
    }));
};

module.exports = Toolbar;

},{"./button":1,"./uicontroller":38}],38:[function(require,module,exports){
/**
 * @fileoverview HTML UI를 관리하는 컨트롤러
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var util = ne.util,
    _id = 0;
/**
 * UIController 클래스
 * @exports UIController
 * @constructor
 * @class
 * @param {Object} options 옵션
 * @param {jQuery} options.rootElement 이니셜라이즈할때 el에 들어갈 루트 엘리먼트를 셋팅할수있다.
 */
function UIController(options) {
    options = util.extend({
        tagName: 'div'
    }, options || {});

    this.tagName = options.tagName;
    this.className = options.className;

    /**
     * rootElement
     * @type {jQuery}
     */
    this.$el = null;

    this._initID();

    this.setRootElement(options.rootElement);
}


/**********
 * method
 **********/

/**
 * UIC에 custom event을 걸거나 jQuery를 이용해 dom에 이벤트를 건다.
 * @param {string} aType 이벤트명과 셀렉터 스트링
 * @param {function} aFn 이벤트 핸들러
 */
UIController.prototype.on = function(aType, aFn) {
    var self = this;

    if (util.isObject(aType)) {
        util.forEach(aType, function(fn, type) {
            self._addEvent(type, fn);
        });
    } else {
        this._addEvent(aType, aFn);
    }
};

/**
 * 이벤트를 바인드한다.
 * DOM이벤트가 전달되면 jQuery이벤트 처리기를 이용하고
 * DOM이벤트가 아니면 CustomEvent를 이용한다.
 * @param {string} type 이벤트명과 셀렉터 스트링
 * @param {function} fn 이벤트 핸들러
 * @private
 */
UIController.prototype._addEvent = function(type, fn) {
    var parsedType = this._parseEventType(type),
        event = parsedType[0],
        selector = parsedType[1];

    if (selector) {
        this.$el.on(event, selector, fn);
    } else {
        this.$el.on(event, fn);
    }
};

/**
 * 이벤트를 지운다.
 * DOM이벤트가 전달되면 jQuery이벤트 처리기를 이용하고
 * DOM이벤트가 아니면 CustomEvent를 이용한다.
 * @param {string} type 이벤트명과 셀렉터 스트링
 * @param {function} fn 이벤트 핸들러
 */
UIController.prototype.off = function(type, fn) {
    var parsedType,
        event,
        selector;

    if (type) {
        parsedType = this._parseEventType(type);
        event = parsedType[0];
        selector = parsedType[1];

        if (selector) {
            this.$el.off(event, selector, fn);
        } else {
            this.$el.off(event, fn);
        }
    } else {
        this.$el.off();
    }
};

/**
 * 이벤트 바안딩 텍스트를 전달받아 이벤트 명과 셀렉터로 분리해준다.
 * 'click td' => ['click', 'td]
 * @param {string} type 이벤트쿼리 스트링
 * @returns {array} Event, Selector
 */
UIController.prototype._parseEventType = function(type) {
    var splitType = type.split(' '),
        event = splitType.shift(),
        selector = splitType.join(' ');

    return [event, selector];
};

/**
 * 파라메터로 넘어오는 이벤트 리스트 혹은 this.events를 토대로 dom 이벤트를 한꺼번에 바인드한다.
 * @param {object} events 이벤트 목록
 */
UIController.prototype.attachEvents = function(events) {
    var self = this,
        handler,
        eventlist = events || this.events;

    if (eventlist) {
        util.forEach(eventlist, function(handlerName, type) {
            if (self[handlerName]) {
                type = self.getEventNameWithNamespace(type);
                handler = util.bind(self[handlerName], self);
                self.on(type, handler);
            } else {
                throw new Error('UIController#attachEvents: ' + handlerName + '란 메서드가 없습니다.');
            }
        });
    }
};

/**
 * attachEvents로 걸린 이벤트핸들러를 한꺼번에 해제한다.
 */
UIController.prototype.detachEvents = function() {
    this.$el.off('.uicEvent' + this.id);
};

/**
 * UIC의 rootElement인 this.$el을 설정한다 인자가 없으면 생성한다.
 * @param {jQuery} $el 설정할 엘리먼트
 */
UIController.prototype.setRootElement = function($el) {
    var className = this.className,
        tagName = this.tagName;

    if (!$el) {
        className = className || ('uic' + this.id);
        tagName = tagName;
        $el = $('<' + tagName + ' class="' + className + '"/>');
    }
    this.$el = $el;
};

/**
 * 커스텀 이벤트를 발생시킨다.
 */
UIController.prototype.trigger = function() {
    this.$el.trigger.apply(this.$el, arguments);
};

/**
 * id를 생성한다.
 * @private
 */
UIController.prototype._initID = function() {
    this.id = _id;
    _id += 1;
};

/**
 * 이벤트종류에 네임스페이스를 더한다.
 * "click" -> "click.uicEvent23"
 * @param {string} event 이벤트 핸들러, 셀릭터 스트링
 * @returns {string} 네임스페이스가 포함된 이벤트스트링
 */
UIController.prototype.getEventNameWithNamespace = function(event) {
    var eventSplited = event.split(' ');
    eventSplited[0] += ('.uicEvent' + this.id);
    return eventSplited.join(' ');
};

/**
 * uic안에 서브uic를 삽입한다.
 * 두번째 인자로 셀렉터를 넘기면 this.$el이 아닌 셀렉터에 해당하는 엘리먼트를 찾아서 그엘리먼트에 서브 UIC의 엘리먼트를 붙인다.
 * @param {UIController} uic UIController instance
 * @param {string} [targetSEL] 셀렉터
 */
UIController.prototype.addUIC = function(uic, targetSEL) {
    if (targetSEL) {
        this.$el.find(targetSEL).append(uic.$el);
    } else {
        this.$el.append(uic.$el);
    }
};

/**
 * 엘리먼트의 이벤트를 해제 후 제거한다.
 */
UIController.prototype.remove = function() {
    this.detachEvents();
    this.$el.remove();
};

/**
 * 소멸자
 */
UIController.prototype.destroy = function() {
    this.remove();
    this.detachEvents();

    util.forEachOwnProperties(this, function(value, key) {
        this[key] = null;
    }, this);
};

/**
 * UIController를 확장해 새 생성자를 만든다.
 * @param {Object} props properties to extend
 * @returns {UIController} 생성자
 */
UIController.extend = function(props) {
    var newUIC = util.defineClass(this, props);
    newUIC.extend = UIController.extend;
    return newUIC;
};

module.exports = UIController;

},{}],39:[function(require,module,exports){
/**
 * @fileoverview Implements AddImage wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * AddImage
 * Add Image markdown syntax to wysiwyg Editor
 * @exports AddImage
 * @augments Command
 * @augments WysiwygCommand
 */
var AddImage = CommandManager.command('wysiwyg',/** @lends AddImage */{
    name: 'AddImage',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     *  @param {object} data data for image
     */
    exec: function(wwe, data) {
        var sq = wwe.getEditor();

        sq.insertImage(data.imageUrl);
        sq.focus();
    }
});


module.exports = AddImage;

},{"../commandManager":7}],40:[function(require,module,exports){
/**
 * @fileoverview Implements AddLink wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * AddLink
 * Add link markdown syntax to wysiwyg Editor
 * @exports AddLink
 * @augments Command
 * @augments WysiwygCommand
 */
var AddLink = CommandManager.command('wysiwyg',/** @lends AddLink */{
    name: 'AddLink',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     *  @param {object} data data for image
     */
    exec: function(wwe, data) {
        var sq = wwe.getEditor();

        sq.makeLink(data.url);
        sq.focus();
    }
});


module.exports = AddLink;

},{"../commandManager":7}],41:[function(require,module,exports){
/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Blockquote
 * Add Blockquote to selected wysiwyg editor content
 * @exports Blockquote
 * @augments Command
 * @augments WysiwygCommand
 */
var Blockquote = CommandManager.command('wysiwyg',/** @lends Blockquote */{
    name: 'Blockquote',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor();

        sq.increaseQuoteLevel();
        sq.focus();
    }
});

module.exports = Blockquote;

},{"../commandManager":7}],42:[function(require,module,exports){
/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Bold
 * Add bold to selected wysiwyg editor content
 * @exports Bold
 * @augments Command
 * @augments WysiwygCommand
 */
var Bold = CommandManager.command('wysiwyg',/** @lends Bold */{
    name: 'Bold',
    keyMap: ['Ctrl-B', 'Ctrl-B'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor();

        sq.bold();
        sq.focus();
    }
});

module.exports = Bold;

},{"../commandManager":7}],43:[function(require,module,exports){
/**
 * @fileoverview Implements Heading wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Heading
 * Add horizontal line markdown syntax to wysiwyg Editor
 * @exports Heading
 * @augments Command
 * @augments WysiwygCommand
 */
var Heading = CommandManager.command('wysiwyg',/** @lends Heading */{
    name: 'Heading',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor(),
            range = sq.getSelection();

        if (range.collapsed) {
            return;
        }

        sq.changeFormat({tag: 'H3'}, null, range);
        sq.focus();
    }
});

module.exports = Heading;

},{"../commandManager":7}],44:[function(require,module,exports){
/**
 * @fileoverview Implements HR wysiwyg command
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * HR
 * Add horizontal line markdown syntax to wysiwyg Editor
 * @exports HR
 * @augments Command
 * @augments WysiwygCommand
 */
var HR = CommandManager.command('wysiwyg',/** @lends HR */{
    name: 'HR',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor(),
            hr = sq.createElement('HR');

        sq.insertElement(hr);
        sq.focus();
    }
});


module.exports = HR;

},{"../commandManager":7}],45:[function(require,module,exports){
/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Italic
 * Add Italic to selected wysiwyg editor content
 * @exports Italic
 * @augments Command
 * @augments WysiwygCommand
 */
var Italic = CommandManager.command('wysiwyg',/** @lends Italic */{
    name: 'Italic',
    keyMap: ['Ctrl-I', 'Ctrl-I'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor();

        sq.italic();
        sq.focus();
    }
});

module.exports = Italic;

},{"../commandManager":7}],46:[function(require,module,exports){
/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * OL
 * Add OL to selected wysiwyg editor content
 * @exports OL
 * @augments Command
 * @augments WysiwygCommand
 */
var OL = CommandManager.command('wysiwyg',/** @lends OL */{
    name: 'OL',
    keyMap: ['Ctrl-O', 'Ctrl-O'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor();

        sq.makeOrderedList();
        sq.focus();
    }
});

module.exports = OL;

},{"../commandManager":7}],47:[function(require,module,exports){
/**
 * @fileoverview Implements Task WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * Task
 * Add Task to selected wysiwyg editor content
 * @exports Task
 * @augments Command
 * @augments WysiwygCommand
 */
var Task = CommandManager.command('wysiwyg',/** @lends Task */{
    name: 'Task',
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor(),
            path = sq.getPath().split('>');

        if (path[path.length - 1] === 'LI') {
            sq.insertHTML('<input type="checkbox" /> ');
        } else {
            sq.insertHTML('<ul><li><input type="checkbox" /> </li></ul>');
        }

        sq.focus();
    }
});

module.exports = Task;

},{"../commandManager":7}],48:[function(require,module,exports){
/**
 * @fileoverview Implements WysiwygCommand
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var CommandManager = require('../commandManager');

/**
 * UL
 * Add UL to selected wysiwyg editor content
 * @exports UL
 * @augments Command
 * @augments WysiwygCommand
 */
var UL = CommandManager.command('wysiwyg',/** @lends UL */{
    name: 'UL',
    keyMap: ['Ctrl-U', 'Ctrl-U'],
    /**
     *  커맨드 핸들러
     *  @param {WysiwygEditor} wwe WYsiwygEditor instance
     */
    exec: function(wwe) {
        var sq = wwe.getEditor();

        sq.makeUnorderedList();
        sq.focus();
    }
});

module.exports = UL;

},{"../commandManager":7}],49:[function(require,module,exports){
/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Squire = window.Squire,
    util = ne.util;
/**
 * WysiwygEditor
 * @exports WysiwygEditor
 * @constructor
 * @class
 * @param {jQuery} $el 에디터가 들어갈 엘리먼트
 * @param {string[]} contentStyles List of CSS style file path for HTML content
 * @param {EventManager} eventManager 이벤트 매니저
 */
function WysiwygEditor($el, contentStyles, eventManager) {
    this.eventManager = eventManager;
    this.$editorContainerEl = $el;
    this.contentStyles = contentStyles;
}

WysiwygEditor.prototype.init = function(height, callback) {
    var self = this;

    this.$iframe = $('<iframe />');

    this.$iframe.load(function() {
        var doc = self.$iframe[0].contentDocument;

        self._makeSureStandardMode(doc);

        if (self.editor) {
            return;
        }

        self._initStyleSheet(doc);

        self.editor = new Squire(doc, {
            blockTag: 'DIV'
        });

        self.setHeight(height);
        self._initEvent();

        if (callback) {
           callback();
        }
    });

    this.$editorContainerEl.css('position', 'relative');

    this.$editorContainerEl.append(this.$iframe);
};

WysiwygEditor.prototype._makeSureStandardMode = function(doc) {
    //Not in quirks mode
    if (doc.compatMode !== 'CSS1Compat') {
        doc.open();
        doc.write('<!DOCTYPE html><title></title>');
        doc.close();
    }
};

WysiwygEditor.prototype._initStyleSheet = function(doc) {
    var styleLink;

    util.forEach(this.contentStyles, function(stylePath) {
        styleLink = doc.createElement('link');
        styleLink.rel = 'stylesheet';
        styleLink.href = stylePath;

        doc.querySelector('head').appendChild(styleLink);
    });

    doc.querySelector('html').className = 'neonEditor-content';
};


WysiwygEditor.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('htmlUpdate', function(html) {
        self.setValue(html);
    });

    this.editor.addEventListener('input', function() {
        self.eventManager.emit('contentChanged.wysiwygEditor', self.getValue());
    });

    this.editor.addEventListener('input', function() {
        var sel = self.editor.getSelection(),
            eventObj;

        eventObj = {
            source: 'wysiwyg',
            selection: sel,
            textContent: sel.endContainer.textContent,
            caretOffset: sel.endOffset
        };

        self.eventManager.emit('change.wysiwygEditor', eventObj);
        self.eventManager.emit('change', eventObj);
    });
};

//from http://jsfiddle.net/9ThVr/24/
WysiwygEditor.prototype.getCaretPosition = function() {
    var range, sel, rect, range2, rect2,
        offsetx = 0,
        offsety = 0;

    var $node = this.editor.getDocument().body,
        nodeLeft = $node.offsetLeft,
        nodeTop = $node.offsetTop;

    var pos = {left: 0, top: 0};

    sel = this.editor.getSelection();
    range = sel.cloneRange();

    range.setStart(range.startContainer, range.startOffset - 1);
    rect = range.getBoundingClientRect();

    if (range.endOffset === 0 || range.toString() === '') {
        // first char of line
        if (range.startContainer === $node) {
            // empty div
            if (range.endOffset === 0) {
                pos.top = '0';
                pos.left = '0';
            } else {
                // firefox need this
                range2 = range.cloneRange();
                range2.setStart(range2.startContainer, 0);
                rect2 = range2.getBoundingClientRect();
                pos.left = rect2.left + offsetx - nodeLeft;
                pos.top = rect2.top + rect2.height + offsety - nodeTop;
            }
        } else {
            pos.top = range.startContainer.offsetTop;
            pos.left = range.startContainer.offsetLeft;
        }
    } else {
        pos.left = rect.left + rect.width + offsetx - nodeLeft;
        pos.top = rect.top + offsety - nodeTop;
    }
    return pos;
};

WysiwygEditor.prototype.focus = function() {
    this.editor.focus();
};

WysiwygEditor.prototype.remove = function() {
    this.editor = null;
};

WysiwygEditor.prototype.setHeight = function(height) {
    this.$iframe.height(height);
};

WysiwygEditor.prototype.setValue = function(html) {
    this.editor.setHTML(html);
    this.eventManager.emit('contentChanged.wysiwygEditor', this.getValue());
};

WysiwygEditor.prototype.getValue = function() {
    this._prepareGetHTML();
    //remove contenteditable block, in this case div
    return this.editor.getHTML().replace(/<div>|<\/div>/g, '');
};

WysiwygEditor.prototype._prepareGetHTML = function() {
    this.editor._ignoreChange = true;
    this._addCheckedAttrToCheckedInput();
};

WysiwygEditor.prototype._addCheckedAttrToCheckedInput = function() {
    var doc = this.getEditor().getDocument();

    //save input checked state to tag
    $(doc.body).find('input').each(function(index, input) {
        if (input.checked) {
            $(input).attr('checked', 'checked');
        } else {
            $(input).removeAttr('checked');
        }
    });
};

WysiwygEditor.prototype.getEditor = function() {
    return this.editor;
};

WysiwygEditor.prototype.replaceSelection = function(content, selection) {
    if (selection) {
        this.editor.setSelection(selection);
    }

    this.editor._ignoreChange = true;
    this.editor.insertPlainText(content);
};

WysiwygEditor.prototype.replaceRelativeOffset = function(content, offset, overwriteLength) {
    var selection;

    selection = this.editor.getSelection().cloneRange();

    this._replaceRelativeOffsetOfSelection(content, offset, overwriteLength, selection);
};

WysiwygEditor.prototype._replaceRelativeOffsetOfSelection = function(content, offset, overwriteLength, selection) {
    var endSelectionInfo;

    selection.setStart(selection.endContainer, selection.endOffset + offset);
    endSelectionInfo = this.getSelectionInfoByOffset(selection.endContainer, selection.endOffset + (offset + overwriteLength));
    selection.setEnd(endSelectionInfo.element, endSelectionInfo.offset);

    this.replaceSelection(content, selection);
};

function getTextLengthOfElement(element) {
    var textLength;

    if (element.nodeType === 1) {
       textLength = element.textContent.length;
    } else if (element.nodeType === 3) {
       textLength = element.nodeValue.length;
    }

    return textLength;
}

WysiwygEditor.prototype.getSelectionInfoByOffset = function(anchorElement, offset) {
    var traceElement, traceElementLength, traceOffset, stepLength, latestAvailableElement;

    traceElement = anchorElement;
    traceOffset = offset;
    stepLength = 0;

    while (traceElement) {
        traceElementLength = getTextLengthOfElement(traceElement);
        stepLength += traceElementLength;

        if (offset <= stepLength) {
            break;
        }

        traceOffset -= traceElementLength;

        if (getTextLengthOfElement(traceElement) > 0) {
            latestAvailableElement = traceElement;
        }

        traceElement = traceElement.nextSibling;
    }

    if (!traceElement) {
        traceElement = latestAvailableElement;
        traceOffset = getTextLengthOfElement(traceElement);
    }

    return {
        element: traceElement,
        offset: traceOffset
    };
};

WysiwygEditor.prototype.getSelectionOffset = function(selection, style, offset) {
    var pos, range, endSelectionInfo,
        marker = this.editor.createElement('INPUT');

    range = selection.cloneRange();

    range.setStart(range.startContainer, range.startOffset);
    endSelectionInfo = this.getSelectionInfoByOffset(selection.endContainer, selection.endOffset + (offset || 0));
    range.setEnd(endSelectionInfo.element, endSelectionInfo.offset);

    //to prevent squire input event fire
    this.editor._ignoreChange = true;
    this.editor.insertElement(marker, range);
    pos = $(marker).offset();

    if (style !== 'over') {
        pos.top += $(marker).outerHeight();
    }

    marker.parentNode.removeChild(marker);

    this.editor.setSelection(selection);

    pos.top -= $(this.editor.getDocument().body).scrollTop();

    return pos;
};

WysiwygEditor.prototype.addWidget = function(selection, node, style, offset) {
    var pos = this.getSelectionOffset(selection, style, offset);

    if (node.parentNode !== this.$editorContainerEl[0]) {
        this.$editorContainerEl.append(node);
    }

    $(node).css({
        position: 'absolute',
        top: pos.top,
        left: pos.left
    });
};

WysiwygEditor.prototype.get$Body = function() {
    return $(this.getEditor().getDocument().body);
};

module.exports = WysiwygEditor;


},{}]},{},[15]);

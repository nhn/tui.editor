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
        var cursorBeforeTextInline = line.substr(0, pos.ch);
        
        if (emptyListRE.test(cursorBeforeTextInline)) {
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

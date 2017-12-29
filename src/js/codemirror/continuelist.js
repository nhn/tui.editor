// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
/**
 * @modifier NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import CodeMirror from 'codemirror';

/*eslint-disable */
var listRE = /^(\s*)(>[> ]*|[*+-]\s(?:\[(?:x|\s)\]\s)?|(\d+)([.)]\s(?:\[(?:x|\s)\]\s)?))(\s*)/,
    emptyListRE = /^(\s*)(>[> ]*|[*+-]\s(?:\[(?:x|\s)\]\s)?|(\d+)([.)]\s(?:\[(?:x|\s)\]\s)?))(\s*)$/,
    FIND_CODEBLOCK_START_RX = /^ *(`{3,}|~{3,})[ \.]*\S+ */,
    unorderedListRE = /[*+-]\s/;

CodeMirror.commands.subListIndentTab = function (cm) {
    if (cm.getOption("disableInput")) return CodeMirror.Pass;
    var ranges = cm.listSelections();
    for (var i = 0; i < ranges.length; i++) {
        var pos = ranges[i].head;
        var line = cm.getLine(pos.line);
        var cursorBeforeTextInline = line.substr(0, pos.ch);

        if (listRE.test(cursorBeforeTextInline)) {
            cm.replaceRange(Array(cm.getOption("indentUnit") + 1).join(" ") + line, {
                line: pos.line, ch: 0
            }, {
                line: pos.line, ch: line.length
            }, '+input');
            cm.setCursor(pos.line, pos.ch + 4);
        } else {
            if (cm.somethingSelected()) cm.indentSelection("add");
            else cm.execCommand("insertSoftTab");
        }
    }
// TUI.EDITOR MODIFICATION START
// 
// https://github.nhnent.com/fe/tui.editor/commit/f63d6ae79078923d369e6c170d07485f05c42fd7
    cm.execCommand('fixOrderedListNumber');
/// TUI.EDITOR MODIFICATION END
};

CodeMirror.commands.newlineAndIndentContinue = function(cm) {
    if (cm.getOption("disableInput")) return CodeMirror.Pass;
    var ranges = cm.listSelections(), replacements = [];

    for (var i = 0; i < ranges.length; i++) {
        var pos = ranges[i].head;
        var eolState = cm.getStateAfter(pos.line);
        var inList = eolState.base.list !== false;
        var inQuote = eolState.base.quote !== 0;

        var line = cm.getLine(pos.line);
        var isCodeBlockStart = FIND_CODEBLOCK_START_RX.test(line);
        var match = listRE.exec(line);
        var cursor = cm.getCursor();

        if (!ranges[i].empty() || (!inList && !inQuote && !isCodeBlockStart) || (!match && !isCodeBlockStart)) {
            cm.execCommand("newlineAndIndent");
            return;
        }

        if (isCodeBlockStart) {
            cursor = cm.getCursor();

            if (cursor.line !== pos.line || cursor.ch !== line.length) {
                cm.execCommand("newlineAndIndent");
                return;
            }
        }

        if (emptyListRE.test(line) && cursor.ch > 0) {
            cm.replaceRange("", {
                line: pos.line, ch: 0
            }, {
                line: pos.line, ch: line.length
            });
            replacements[i] = "\n";
        } else if(isCodeBlockStart) {
            replacements[i] = '\n\n```';
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

    if (isCodeBlockStart) {
        cm.setCursor(pos.line + 1, 0);
    }
};

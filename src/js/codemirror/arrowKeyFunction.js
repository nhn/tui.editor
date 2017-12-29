// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
/**
 * @modifier NHN Ent. FE Development Lab <dl_javascript@nhnent.com>
 */
import CodeMirror from 'codemirror';

/*eslint-disable */
CodeMirror.commands.replaceLineTextToUpper = cm => {
    if (cm.getOption("disableInput")) {
        return CodeMirror.Pass;
    }

    const ranges = cm.listSelections();
    const lineAdjustment = -1;

    for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        const from = range.anchor;
        const to = range.head;

        if (isSameLineSelection(range) && to.line > 0) {
            replaceSingleLine(cm, from, to, lineAdjustment);
        } else if (!isRangeCollapsed(range)) {
            const topLine = from.line < to.line ? from.line : to.line;

            if (topLine > 0) {
                const upper = from.line === topLine ? from : to;
                const bottom = from.line === topLine ? to : from;
                replaceMultiLine(cm, upper, bottom, lineAdjustment);
            }
        }
    }
};

CodeMirror.commands.replaceLineTextToLower = cm => {
    if (cm.getOption("disableInput")) {
        return CodeMirror.Pass;
    }

    const ranges = cm.listSelections();
    const lineAdjustment = 1;

    for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        const from = range.anchor;
        const to = range.head;
        const isLastLine = to.line === cm.lastLine();

        if (isSameLineSelection(range) && !isLastLine) {
            replaceSingleLine(cm, from, to, lineAdjustment);
        } else if (!isRangeCollapsed(range)) {
            const topLine = from.line < to.line ? from.line : to.line;
            const upper = from.line === topLine ? from : to;
            const bottom = from.line === topLine ? to : from;

            if (bottom.line < cm.lastLine()) {
                replaceMultiLine(cm, upper, bottom, lineAdjustment);
            }
        }
    }
};

function isRangeCollapsed(range) {
    return isSameLineSelection(range)
        && range.anchor.ch === range.head.ch;
}

function isSameLineSelection(range) {
    return range.anchor.line === range.head.line;
}

function replaceSingleLine(cm, from, to, lineAdjustment) {
    const currentLine = cm.getLine(to.line);
    const replacement = cm.getLine(to.line + lineAdjustment);
    const range = {
        anchor: from,
        head: to
    };

    cm.replaceRange(replacement, {
        line: to.line, ch: 0
    }, {
        line: to.line, ch: currentLine.length
    }, '+input');

    cm.replaceRange(currentLine, {
        line: to.line + lineAdjustment, ch: 0
    }, {
        line: to.line + lineAdjustment, ch: replacement.length
    }, '+input');

    if (isRangeCollapsed(range)) {
        cm.setCursor({
            line: to.line + lineAdjustment,
            ch: to.ch
        });
    } else {
        cm.setSelection({
            line: from.line + lineAdjustment,
            ch: from.ch
        }, {
            line: to.line + lineAdjustment,
            ch: to.ch
        });
    }
}

function replaceMultiLine(cm, upper, bottom, lineAdjustment) {
    const rangeContent = cm.getRange({
        line: upper.line, ch: 0
    }, {
        line: bottom.line, ch: cm.getLine(bottom.line).length
    });
    const edgeLineOfConcern = lineAdjustment > 0 ? bottom : upper;
    const replacement = cm.getLine(edgeLineOfConcern.line + lineAdjustment);
    let targetLine;

    if (lineAdjustment > 0) {
        targetLine = upper;
    } else {
        targetLine = bottom;
    }

    cm.replaceRange(replacement, {
        line: targetLine.line, ch: 0
    }, {
        line: targetLine.line, ch: cm.getLine(targetLine.line).length
    }, '+input');

    cm.replaceRange(rangeContent, {
        line: upper.line + lineAdjustment, ch: 0
    }, {
        line: bottom.line + lineAdjustment, ch: cm.getLine(bottom.line + lineAdjustment).length
    }, '+input');

    cm.setSelection({
        line: upper.line + lineAdjustment, ch: upper.ch
    }, {
        line: bottom.line + lineAdjustment, ch: bottom.ch
    });
}

CodeMirror.commands.bold = function bold(cm) {
    console.log('bold');

    if (cm.getOption("disableInput")) {
        return CodeMirror.Pass;
    }

    var doc = cm.getDoc();
    var selection = doc.getSelection();

    var result = '**' + selection + '**';

    doc.replaceSelection(result);
};

CodeMirror.keyMap.macDefault['Cmd-B'] = 'bold';
CodeMirror.keyMap.pcDefault['Ctrl-B'] = 'bold';


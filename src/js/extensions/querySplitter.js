/**
@author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
*/

'use strict';

var extManager = require('../extManager');

extManager.defineExtension('querySplitter', function(editor) {
    var active = false;

    editor.eventManager.addEventType('query');

    editor.eventManager.listen('change.wysiwygEditor', function(ev) {
        var founded, textBlocks, count, i, eventObject,
            sel = ev.selection,
            textContent = sel.commonAncestorContainer.textContent,
            cursor = sel.endOffset,
            currentBlock,
            foundRuleRX = /@[^@\s]*/;

        //찾는 룰이 있다가 backspace로 모두 지워진 경우를 위해 active가 필요 마지막 한번의 undefined로  query이벤트를 날리기위해
        if (active || /@/g.test(textContent)) {
            if (textContent === '' || !(/\s/.test(textContent[cursor - 1]))) {
                textBlocks = textContent.split(' ');
                count = 0;

                for (i = 0; i < textBlocks.length; i += 1) {
                    count += textBlocks[i].length;

                    if (count > cursor - textBlocks.length) {
                        currentBlock = textBlocks[i];
                        break;
                    }
                }

                founded = foundRuleRX.exec(currentBlock);
            } else {
                active = false;
            }

            if (founded) {
                active = true;
                eventObject = {
                    text: founded[0],
                    currentText: textContent[cursor - 1],
                    startOffset: (count - textBlocks[i].length) + founded.index + i,
                    curOffset: cursor,
                    editorData: sel
                };
            }

            editor.eventManager.emit('query', eventObject);
        }
    });
});

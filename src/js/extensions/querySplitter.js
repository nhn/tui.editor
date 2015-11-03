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

    editor.eventManager.listen('changeFromWysiwyg', function(ev) {
        process(ev);
    });

    editor.eventManager.listen('changeFromMarkdown', function(ev) {
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

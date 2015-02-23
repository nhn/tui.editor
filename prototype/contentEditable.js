(function() {
    'use strict';

    var textBuffer = [];
    var TOID;

    $('#content').on('focus', function() {
        console.log('focus', arguments);
    });

    var escape = (function() {
        var entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            "\u00a0": ' '
        };
        return function(str) {
            return str.replace(/[&<\u00a0]/g, function(s) {
                return entityMap[s];
            });
        };
    })();

    $('#content').on('blur', function() {

    });

    $('#content').on('keydown', function() {
        console.log('keydown', arguments);
    });

    $('#content').on('keyup', function() {
        console.log('keyup', arguments);
        var self = this;

        clearTimeout(TOID);

        TOID = setTimeout(function(){
            editUpdate.call(self);
        }, 1000);
    });

    function editUpdate() {
        var currentText = this.innerText;
        var currentTextLine = currentText.split('\n');
        var modifiedContent = [];

        $('#preview').html(marked(currentText, {
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false
        }));

        //변경사항찾고
        for (var i = 0; i < currentTextLine.length; i++) {
            if (currentTextLine[i] !== textBuffer[i]) {
                modifiedContent.push({
                    line: i,
                    text: currentTextLine[i]
                });
            }
        }

        //변경사항이후에 지워라인들이있으면 추가
        if (currentTextLine.length < textBuffer.length) {
            for (i = currentTextLine.length; i < textBuffer.length; i++) {
                modifiedContent.push({
                    line: i,
                    text: null
                });
            }
        }

        var lines = $(this).find('p');
        var modifiedText = "";

        //변경사항으로 텍스트만들고
        for(i=0;i < modifiedContent.length; i++){
            if(modifiedContent[i].text){
                modifiedText += modifiedContent[i].text + '\n';
            }
        }

        console.log(modifiedText);

        //변경사항텍스트로 하이라이트처리하고
        var hlLines = Prism.highlight(modifiedText, Prism.languages.markdown).split('\n');

        //변경된 내용 에디팅영역에 적용
        for(i=0;i < modifiedContent.length; i++){
            if(modifiedContent[i].text && hlLines[i]){
                $(lines[modifiedContent[i].line]).html(hlLines[i] + '\n');
            }
        }

        $('#hl').html(Prism.highlight(currentText, Prism.languages.markdown));

        textBuffer = currentTextLine;
    }

    $('#content').on('paste', function() {
        console.log('paste', arguments);
    });

    $('#content').on('click', function() {
        console.log('click', arguments);
    });

    //체인지 이벤트만들기(MutantObserver를 쓰는게 나을듯 Polymer꺼)
    $('body').on('focus', '[contenteditable]', function() {
        var $this = $(this);
        $this.data('before', $this.html());
        return $this;
    }).on('blur keyup paste input', '[contenteditable]', function() {
        var $this = $(this);
        if ($this.data('before') !== $this.html()) {
            $this.data('before', $this.html());
            $this.trigger('change');
        }
        return $this;
    });

    function cursorTo(el) {
        //create a new range
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(true);

        //make the cursor there
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    function makeNewLine(NBT) {
        var newLineEl = document.createElement('p');
        var def;

        newLineEl.className = 'line';

        if (NBT) {
            def = document.createTextNode(NBT);
        } else {
            def = document.createElement('br');
        }

        newLineEl.appendChild(def);
        return newLineEl;
    }

    function fragmentise(el) {
        var docFragment = document.createDocumentFragment();
        docFragment.appendChild(el);

        return docFragment;
    }

    function newLineAfter(el, LBT) {
        var lineEl = makeNewLine(LBT);
        $(fragmentise(lineEl)).insertAfter(el);
        return lineEl;
    }

    function newLineAppend(LBT) {
        var lineEl = makeNewLine(LBT);
        $(fragmentise(lineEl)).appendTo('#content');
        return lineEl;
    }

    function getCaretCharacterOffsetWithin(element) {
        var caretOffset = 0;
        var doc = element.ownerDocument || element.document;
        var win = doc.defaultView || doc.parentWindow;
        var sel;
        if (typeof win.getSelection != "undefined") {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                var range = win.getSelection().getRangeAt(0);
                var preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        } else if ( (sel = doc.selection) && sel.type != "Control") {
            var textRange = sel.createRange();
            var preCaretTextRange = doc.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        return caretOffset;
    }

    function rangeFromLine() {
        var range = window.getSelection().getRangeAt(0);


    }


    window.dd = function() {
        var win = document.defaultView || document.parentWindow;
        var r1 = win.getSelection().getRangeAt(0);
        var r2 = r1.cloneRange();

        var startLine = getLineNode(r1.startContainer);

        console.log(getCaretCharacterOffsetWithin(startLine));
        r2.selectNodeContents(startLine);

        r2.setEnd(getLineNode(r1.endContainer), r1.endOffset);
        var len = r2.toString().length;

        console.log(r1);
        console.log(r2);
        console.log(len);
    }

    function getLineRange(range) {
        var startLine, endLine;
        var modRange = range.cloneRange();

        modRange.selectNodeContents()

        return modRange;
    }

    function getLineNode(node) {
        var line;

        if (node.nodeName !== 'P') {
            //text노트인경우
            line = $(node).parents('.line');
        } else {
            //빈라인이거나 첫번째 컬럼인경우
            line = $(node);
        }

        return line[0];
    }

    function returnOnLine() {

        var parent;
        var range = window.getSelection().getRangeAt(0);
        var lineBreakText = range.endContainer.data;
        var endOffset = range.endOffset;

        range.deleteContents();

        if (lineBreakText && endOffset < lineBreakText.length) {
            lineBreakText = lineBreakText.slice(endOffset);
            range.endContainer.data = lineBreakText.substr(0, endOffset);
        } else {
            lineBreakText = null;
        }

        console.log(range);

        if (range.startContainer.nodeName !== 'P') {
            //text노트인경우
            parent = $(range.startContainer).parents('.line');
            console.log(parent);
        } else {
            //빈라인이거나 첫번째 컬럼인경우
            parent = $(range.startContainer);
        }

        if (parent && parent.length > 0) {
            cursorTo(newLineAfter(parent, lineBreakText));
        } else {
            cursorTo(newLineAppend(lineBreakText));
        }

    }
/*
    $('#content').on('keydown', function(event) {
        if (event.which === 13) {
            event.preventDefault();
            returnOnLine();
        }

        return true;
    });
*/
    $('#content').append(makeNewLine());

    $('#content').focus();
})();

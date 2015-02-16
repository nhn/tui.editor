(function() {
    'use strict';

    $('#content').on('focus', function() {
        console.log('focus', arguments);
    });

    $('#content').on('blur', function() {
        console.log('blur', arguments);
        console.log($(this).text());
        $('#preview').html(marked($(this).text()));
    });

    $('#content').on('keydown', function() {
        console.log('keydown', arguments);
    });

    $('#content').on('keyup', function() {
        console.log('keyup', arguments);
    });

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

        console.log(range);

        //make the cursor there
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    function makeNewLine() {
        var  newLineEl = document.createElement('p');
        newLineEl.appendChild(document.createElement('br'));
        return newLineEl;
    }

    function fragmentise(el) {
        var docFragment = document.createDocumentFragment();
        docFragment.appendChild(el);

        return docFragment;
    }

    function newLineAfter(el) {
        var lineEl = makeNewLine();
        $(fragmentise(lineEl)).insertAfter(el);
        return lineEl;
    }

    function newLineAppend() {
        var lineEl = makeNewLine();
        $(fragmentise(lineEl)).appendTo('#content');
        return lineEl;
    }

    function returnOnLine() {
        var parent;
        var range = window.getSelection().getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode('\n'));

        if (range.startContainer.nodeName !== 'P') {
            //text노트인경우
            parent = $(range.startContainer).parent('p');
        } else {
            //빈라인이거나 첫번째 컬럼인경우
            parent = $(range.startContainer);
        }

        if (parent && parent.length > 0) {
            cursorTo(newLineAfter(parent));
        } else {
            cursorTo(newLineAppend());
        }
    }

    $('#content').on('keydown', function(event) {
        if (event.which === 13) {
            event.preventDefault();
            returnOnLine();
        } else if (event.keyCode === 9) {
            event.preventDefault();
            document.execCommand('styleWithCSS', true, null);
            document.execCommand('indent', true, null);
        }
        return true;
    });

    $('#content').append(makeNewLine());

    $('#content').focus();
})();

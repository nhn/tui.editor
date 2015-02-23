(function() {
    'use strict';

    function makeNewLine() {
        var  newLineEl = document.createElement('p');
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
/*
    $('textarea').on('keydown', function(event){
        var keyCode = event.which;

        if (keyCode === 37) {

        } else if (keyCode === 38) {

        } else if (keyCode === 38) {

        } else if (keyCode === 40) {

        }
        return true;
    });*/

    function cursorTo(el) {
        //create a new range
        var range = document.createRange();
        range.setStart(el, 0);
        range.collapse(true);

        //make the cursor there
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    function addChar(char) {
        console.log(char);
        if (!char || char.length === 0) {
            return;
        }

        $(defLine).append(char);
    }

    $('textarea').on('keyup', function(event){
        addChar($(this).val());
        $(this).val('');

        return true;
    });

    var defLine = makeNewLine();
    $('#content').append(defLine);
    $('#content').focus();
})();
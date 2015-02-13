(function() {
    'use strict';

    $('#content').on('focus', function() {
        console.log('focus', arguments);
    });

    $('#content').on('blur', function() {
        console.log('blur', arguments);
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


    $('#content').on('keydown', function(event) {
        if (event.which === 13) {
            event.preventDefault();
            var docFragment = document.createDocumentFragment();

            //add a new line
            /*var newEle = document.createTextNode('\n');
            docFragment.appendChild(newEle);*/

            //add the br, or p, or something else
            var newEle = document.createElement('p');
            newEle.appendChild(document.createElement('br'));
            docFragment.appendChild(newEle);

            //make the br replace selection
            var range = window.getSelection().getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode('\n'));

            var parent = $(range.startContainer).parent('p');

            if (parent.length > 0) {
                $(docFragment).insertAfter(parent);
            } else {
                $(this).append(docFragment);
            }
            //create a new range
            range = document.createRange();
            range.setStartAfter(newEle);
            range.collapse(true);

            //make the cursor there
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);

        } else if (event.keyCode === 9) {
            event.preventDefault();
            document.execCommand('styleWithCSS', true, null);
            document.execCommand('indent', true, null);
        }
        return true;
    });
})();

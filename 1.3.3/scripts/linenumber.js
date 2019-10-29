/*global document */
(function() {
    var source = document.getElementsByClassName('prettyprint source linenums');
    var i = 0;
    var lineNumber = 0;
    var lineId;
    var lines;
    var totalLines;
    var anchorHash;
    var lineNumberHTML = '';

    if (source && source[0]) {
        anchorHash = document.location.hash.substring(1);
        lines = source[0].getElementsByTagName('li');
        totalLines = lines.length;

        for (; i < totalLines; i++) {
            lineNumber++;
            lineId = 'line' + lineNumber;
            lines[i].id = lineId;

            lineNumberHTML = '<span class="number">' + (i + 1) + ' : </span>';

            lines[i].insertAdjacentHTML('afterBegin', lineNumberHTML);
            if (lineId === anchorHash) {
                lines[i].className += ' selected';
            }
        }
    }
})();

/**
 * @fileoverview
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var Squire = window.Squire,
    util = ne.util;
/**
 * WysiwygEditor
 * @exports WysiwygEditor
 * @constructor
 * @class
 * @param {jQuery} $el 에디터가 들어갈 엘리먼트
 * @param {string[]} contentStyles List of CSS style file path for HTML content
 * @param {EventManager} eventManager 이벤트 매니저
 */
function WysiwygEditor($el, contentStyles, eventManager) {
    this.eventManager = eventManager;
    this.$editorContainerEl = $el;
    this.contentStyles = contentStyles;
}

WysiwygEditor.prototype.init = function(height, callback) {
    var self = this;

    this.$iframe = $('<iframe />');

    this.$iframe.load(function() {
        var doc = self.$iframe[0].contentDocument;

        self._makeSureStandardMode(doc);

        if (self.editor) {
            return;
        }

        self._initStyleSheet(doc);

        self.editor = new Squire(doc, {
            blockTag: 'DIV'
        });

        self.setHeight(height);
        self._initEvent();

        if (callback) {
           callback();
        }
    });

    this.$editorContainerEl.append(this.$iframe);
};

WysiwygEditor.prototype._makeSureStandardMode = function(doc) {
    //Not in quirks mode
    if (doc.compatMode !== 'CSS1Compat') {
        doc.open();
        doc.write('<!DOCTYPE html><title></title>');
        doc.close();
    }
};

WysiwygEditor.prototype._initStyleSheet = function(doc) {
    var styleLink;

    util.forEach(this.contentStyles, function(stylePath) {
        styleLink = doc.createElement('link');
        styleLink.rel = 'stylesheet';
        styleLink.href = stylePath;

        doc.querySelector('head').appendChild(styleLink);
    });

    doc.querySelector('body').className = '.neditor-content';
    doc.querySelector('html').className = '.neditor-content';
};


WysiwygEditor.prototype._initEvent = function() {
    var self = this;

    this.eventManager.listen('htmlUpdate', function(html) {
        self.setValue(html);
    });

    this.editor.addEventListener('input', function() {
        var sel = self.editor.getSelection(),
            eventObj;

        eventObj = {
            selection: sel,
            textContent: sel.commonAncestorContainer.textContent,
            caretOffset: sel.endOffset
        };

        self.eventManager.emit('change.wysiwygEditor', eventObj);
        self.eventManager.emit('contentChanged.wysiwygEditor', self.getValue());
    });

    //특정 키를 기준으로 가져오기.
    /*this.editor.addEventListener('keyup', function() {
        var sel = self.editor.getSelection();
        var textContent = sel.commonAncestorContainer.textContent;
        var cursor = sel.endOffset;
        var currentBlock;
        var foundRuleRX = /@[^@\s]+/;

        //스페이스가 입력되면 input이벤트가 두번발생한다.
        //어차피 키입력에만 반응해야하니까 keyup으로 가자
        console.log('--------------------');
        console.log('cursor', cursor);
        console.log(/\s/.test(textContent[cursor-1]), textContent[cursor-1]);

        if (!(/\s/.test(textContent[cursor-1])) && /@/g.test(textContent)) {
            var textBlocks = textContent.split(' ');
            var count = 0;

            console.log(textBlocks);

            for(var i = 0; i < textBlocks.length; i+=1) {
                count += textBlocks[i].length;

                if (count > cursor - textBlocks.length) {
                    currentBlock = textBlocks[i];
                    break;
                }
            }

            var founded = foundRuleRX.exec(currentBlock);
            console.log("> ", founded);
        }
    }[);
*/
/*
    //[Ma[변경점을 기준으로 가져오기
    //
    var startOffset = null;
        var co[MaZntainer = null;

    this.editor.addEventListener('input', function() {
        var sel = self.editor.getSelection();
        var textContent = sel.commonAncestorContainer.textContent;
        var cursor = sel.endOffset;
        var currentBlock;
        var foundRuleRX = /@[^@\s]+/;

        if (container !== sel.commonAncestorContainer) {
            startOffset = cursor-1;
            container = sel.commonAncestorContainer;
        }

        if (startOffset > cursor) {
            startOffset = cursor-1;
        }

        console.log('--------------------');
        console.log('cursor', cursor);
        console.log('startOffset', startOffset);
        console.log('textContent.length', textContent.length);
        console.log(textContent[cursor-1]);
        console.log(textContent.slice(startOffset, cursor));
    });
*/
/*
    this.editor.addEventListener('keyup', function() {
        //console.log('keyup', arguments);
    });


    this.editor.addEventListener('pathChange', function() {
        console.log('pathChnage', arguments);
    });

    this.editor.addEventListener('select', function() {
        console.log('select', arguments);
    });*/
};

//from http://jsfiddle.net/9ThVr/24/
WysiwygEditor.prototype.getCaretPosition = function() {
    var range, sel, rect, range2, rect2,
        offsetx = 0,
        offsety = 0;

    var $node = this.editor.getDocument().body,
        nodeLeft = $node.offsetLeft,
        nodeTop = $node.offsetTop;

    var pos = {left: 0, top: 0};

    sel = this.editor.getSelection();
    range = sel.cloneRange();

    range.setStart(range.startContainer, range.startOffset - 1);
    rect = range.getBoundingClientRect();

    if (range.endOffset === 0 || range.toString() === '') {
        // first char of line
        if (range.startContainer === $node) {
            // empty div
            if (range.endOffset === 0) {
                pos.top = '0';
                pos.left = '0';
            } else {
                // firefox need this
                range2 = range.cloneRange();
                range2.setStart(range2.startContainer, 0);
                rect2 = range2.getBoundingClientRect();
                pos.left = rect2.left + offsetx - nodeLeft;
                pos.top = rect2.top + rect2.height + offsety - nodeTop;
            }
        } else {
            pos.top = range.startContainer.offsetTop;
            pos.left = range.startContainer.offsetLeft;
        }
    } else {
        pos.left = rect.left + rect.width + offsetx - nodeLeft;
        pos.top = rect.top + offsety - nodeTop;
    }
    return pos;
};

WysiwygEditor.prototype.focus = function() {
    this.editor.focus();
};

WysiwygEditor.prototype.setHeight = function(height) {
    this.$iframe.height(height);
};

WysiwygEditor.prototype.setValue = function(html) {
    this.editor.setHTML(html);
    this.eventManager.emit('contentChanged.wysiwygEditor', this.getValue());
};

WysiwygEditor.prototype.getValue = function() {
    //remove contenteditable block, in this case div
   return this.editor.getHTML().replace(/<div>|<\/div>/g, '');
};

module.exports = WysiwygEditor;


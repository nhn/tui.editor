/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var Action = require('./action'),
    Session = require('./session'),
    Selection = require('./selection'),
    SectionManager = require('./sectionManager');

var CONTENT_CHANGE_DELAY = 500;

/**
 * MarkdownEditor
 * @exports MarkdownEditor
 * @extends {}
 * @constructor
 * @class
 */
function MarkdownEditor(base, options) {
    this.base = base;
    this.$editorEl = this.base.layout.$editorEl;

    this._contentDelayTOID = null;


    this.action = new Action({
        editor: this
    });

    this.sectionManager = new SectionManager();
    this.selection = new Selection({
        $editorEl: this.$editorEl
    });

    this.session = new Session(this);

    this.sectionManager = new SectionManager(this.$editorEl);

    window.dd = this.selection;
    window.session = this.session;

    this.textContent = '';
    this.isHlCapable = false;

    this.init();
}

MarkdownEditor.prototype.init = function() {
    // See https://gist.github.com/shimondoodkin/1081133
    // contentEditable영역에서 다른인풋으로 포커스이동이 잘되지 않는현상 우회
    if (/AppleWebKit\/([\d.]+)/.exec(navigator.userAgent)) {
        var $editableFix = $('<input style="width:1px;height:1px;border:none;margin:0;padding:0;" tabIndex="-1">').appendTo('html');
        this.$editorEl.blur(function() {
            $editableFix[0].setSelectionRange(0, 0);
            $editableFix.blur();
        });
    }

    //초반 파트 삽입
   // this.contentChanged();

    this.addTrailingLfNode2();
};

MarkdownEditor.prototype.addTrailingLfNode2 = function() {
    this.trailingLfNode = $('<p class="line"><br /></p>')[0];
    this.$editorEl.append(this.trailingLfNode);
};

MarkdownEditor.prototype.contentChanged = function() {
    var changedTextContent = "";
    var lines = this.$editorEl.find('.line');

    $.each(lines, function(index, line) {
        changedTextContent += line.textContent + '\n';
    });

    changedTextContent = changedTextContent.slice(0, -1);
    console.log('contentChanged', this.textContent, changedTextContent);
    this.textContent = changedTextContent;

    if (this.isHlCapable) {
        console.log("하일라이트 돌리기", this.textContent);
        this.isHlCapable = false;
    }
};

MarkdownEditor.prototype.newLine = function() {
    this.isHlCapable = true;
    /*
    var sel = this.selection.getCurrentSelection();
    console.log(sel);
    var newSel = this.session.newLine(sel.start, sel.end);
    this.selection.select(newSel.end, newSel.end);
    */
};

MarkdownEditor.prototype._contentChanged = function() {
    var self = this;
    var changedTextContent = this.$editorEl[0].textContent;

    //trailingLfNode에 있는 개행은 삭제한다.
    if (this.$editorEl[0].lastChild === this.trailingLfNode && this.trailingLfNode.textContent.slice(-1) === '\n') {
        changedTextContent = changedTextContent.slice(0, -1);
    }

    //특정 OS를 위한 개행 전환
    changedTextContent = changedTextContent.replace(/\r\n?/g, '\n');

    console.log('contentChanged:', changedTextContent, this.textContent);

    if (changedTextContent === this.textContent) {
        //유저가 공간을 모두 지움
        if (this.$editorEl.children().length === 0) {
            this.$editorEl.empty();
            //this.renderSection();
            this.addTrailingLfNode();
        }
    } else {
        this.textContent = changedTextContent;
        if (!this.action.isComposing()) {
            //텍스트를 섹션 파서에 넘겨서 각종 섹션 목록을 만든다.
            console.log("컴포징상태가 아니라서 이후 진행됨!");
            this.sectionManager.update(this.textContent);
            //this.renderSection();
        } else {
            console.log("컴포징 상태");
        }
    }
};

MarkdownEditor.prototype.renderSection = function() {
    var newSectionElList = document.createDocumentFragment(),
        self = this;

    this.action.stopObserveContent();
    this.selection.save();

    this.sectionManager.forEachModified(function(section) {
         section.el = $('<span id="section-' + section.id + '" class="section">' + section.text + '</span>')[0];
         section.el.generated = true;
         newSectionElList.appendChild(section.el);
    });


    this.sectionManager.forEachRemoved(function(section) {
        //이미 사용자가 지웠을수 있다.
        section.el.parentNode === self.$editorEl[0] && self.$editorEl[0].removeChild(section.el);
        section.el.generated = false;
    });

    var insertBeforeSection = this.sectionManager.getInsertBefore();

    //추가된 섹션이 중간에 들어가야한다.
    if (insertBeforeSection) {
        this.$editorEl[0].insertBefore(newSectionElList, insertBeforeSection.el);
        //추가된 섹션이 끝에 붙는다.
    } else {
        this.$editorEl[0].appendChild(newSectionElList);
    }

    this.removeUnneccesaryEls();
    this.addTrailingLfNode();

    this.selection.restore();
    this.action.observeContent();
};

MarkdownEditor.prototype.removeUnneccesaryEls = function () {
    //직접 생성한거 외에 브라우저가 생성한것들은 모두 지움(span이 주기적으로 생성됨)
    var childNode = this.$editorEl[0].firstChild,
        nextNode;

    while (childNode) {
        nextNode = childNode.nextSibling;
        if (!childNode.generated) {
            this.$editorEl[0].removeChild(childNode);
        }
        childNode = nextNode;
    }
};

MarkdownEditor.prototype.addTrailingLfNode = function() {
    this.trailingLfNode = $('<span class="line">\n</span>')[0];
    this.$editorEl.append(this.trailingLfNode);
};

MarkdownEditor.prototype.applySyntaxHighlight = function() {
    var $el = this.$editorEl;
    var text = Prism.highlight($el[0].innerText, Prism.languages.markdown);
    //prism의 결과는 개행이 포함되지 않았으므로 삽입
    text = text.replace(/\n/g, '<span class="token lf">\n</span>');
    $el.html(text);
};

MarkdownEditor.prototype.getTextContent = function() {
    return this.textContent;
};

module.exports = MarkdownEditor;

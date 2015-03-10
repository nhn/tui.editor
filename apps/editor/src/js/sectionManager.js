/**
 * @fileoverview
 * @author FE개발팀 김성호 sungho-kim@nhnent.com
 */

'use strict';

var sectionId = 0;

var rxText,
    regexp;

rxText = [
    //텍스트 + 개행 + ==== 해딩 찾는다.
    '^.+[ \\t]*\\n=+[ \\t]*\\n+',

    //텍스트 + 개행 + ---- 해딩 찾는다.
    '^.+[ \\t]*\\n-+[ \\t]*\\n+',

    //#으로 시작하는 해딩을 찾는다.
    '^\\#{1,6}[ \\t]*.+?[ \\t]*\\#*\\n+'

    //unoredered list 섹션 찾는다
    // (^[ \\t]*[*|-]+[ ].*\\n*){1,}'
    //'(^[ \\t]*[\\d]+[.][ ].+\\n*){1,}' //orderedlist 찾는다.
];

regexp = new RegExp(rxText.join('|'), 'gm');

/**
 * SectionManager
 * @exports SectionManager
 * @constructor
 * @class
 */
function SectionManager($editorEl) {
    this.sectionList = [];
    this.$editorEl = $editorEl;


    this.sectionsToRemove = [];
    this.modifiedSections = [];
    this.insertBeforeSections = null;
}

SectionManager.prototype.forEachRemoved = function(iteratee) {
    this.sectionsToRemove.forEach(iteratee);
};

SectionManager.prototype.forEachModified = function(iteratee) {
    this.modifiedSections.forEach(iteratee);
};

SectionManager.prototype.getInsertBefore = function() {
    return this.insertBeforeSections;
};

SectionManager.prototype.forEach = function(iteratee) {
    this.sectionList.forEach(iteratee);
};

SectionManager.prototype.update = function(text) {
    var newSectionList = this._parse(text);

    var insertBeforeSection,
        sectionsToRemove,
        sectionList = this.sectionList,
        editorEl = this.$editorEl[0];

    this.insertBeforeSections = null;

    if (sectionList.length) {
        //위에서부터 변경된 섹션 인덱스 찾기
        var leftIndex = sectionList.length;

        sectionList.some(function(section, index) {
            var newSection = newSectionList[index];

                //추가된 섹션이거나
            if (index >= newSectionList.length ||
                //텍스트 기준 변경점 찾음
                section.text !== newSection.text ||
                //다른곳에 붙었거나
                section.el.parentNode !== editorEl ||
                //copy&paste로 옮겨졌거나
                section.el.textContent !== newSection.text
            ) {
                leftIndex = index;
                return true;
            }
        });


        var rightIndex = -sectionList.length;

        //아래서 부터 변경된 섹션 인덱스 찾기
        sectionList.slice().reverse().some(function(section, index) {
            var newSection = newSectionList[newSectionList.length - index - 1];

                //추가된 섹션이거나
            if (index >= newSectionList.length ||
                //텍스트 기준 변경점 찾음
                section.text !== newSection.text ||
                //다른곳에 붙었거나
                section.el.parentNode !== editorEl ||
                //copy&paste로 옮겨졌거나
                section.el.textContent !== newSection.text
            ) {
                rightIndex = -index;
                return true;
            }
        });

        //서로 크로스되는경우 방지
        if (leftIndex - rightIndex > sectionList.length) {
            rightIndex = leftIndex - sectionList.length;
        }

        var leftSections = sectionList.slice(0, leftIndex);
        var modifiedSections = newSectionList.slice(leftIndex, newSectionList.length + rightIndex);
        var rightSections = sectionList.slice(sectionList.length + rightIndex, sectionList.length);
        insertBeforeSection = rightSections[0];
        sectionsToRemove = sectionList.slice(leftIndex, sectionList.length + rightIndex);

        this.sectionList = leftSections.concat(modifiedSections).concat(rightSections);
        this.modifiedSections = modifiedSections;
        this.insertBeforeSections = insertBeforeSection;
        this.sectionsToRemove = sectionsToRemove;

        /*
        console.log('leftIndex, rightIndex', leftIndex, rightIndex);
        console.log('modifiedSections', modifiedSections);
        console.log('insertBeforeSection', insertBeforeSection);
        console.log('sectionsToRemove', sectionsToRemove);
        */
    } else {
        this.sectionList = newSectionList;
        this.modifiedSections = newSectionList;
    }
};

SectionManager.prototype._parse = function(text) {
    var tmpText = text + '\n\n',
        newSectionList = [],
        offset = 0;

    function addSection(startOffset, endOffset) {
        var sectionText = tmpText.substring(offset, endOffset);
        newSectionList.push({
            id: sectionId++,
            text: sectionText
        });
    }

    // Look for delimiters
    tmpText.replace(regexp, function(match, matchOffset) {
        addSection(offset, matchOffset);
        offset = matchOffset;
    });

    // Last section
    addSection(offset, text.length);

    return newSectionList;
};

module.exports = SectionManager;
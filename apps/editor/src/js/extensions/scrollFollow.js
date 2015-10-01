/**
 * @fileoverview Implements %filltext:name=Name%
 * @author
 */

'use strict';

var extManager = require('../extManager');

var MAX_SECTION_RATIO = 0.9;

/*
 * SectionManager
 * @exports SectionManager
 * @augments
 * @constructor
 * @class
 */
function SectionManager(cm, preview) {
    this.cm = cm;
    this.preview = preview;
    this.$previewContent = preview.$el.find('.previewContent');

    this._sectionList = null;
    this._currentSection = null;
}


/**
 * _addNewSection
 * add new section
 * @param {number} start initial start line number
 * @param {number} end initial end line number
 */
SectionManager.prototype._addNewSection = function(start, end) {
    var newSection = this._makeSectionData(start, end);
    this._sectionList.push(newSection);
    this._currentSection = newSection;
}

/**
 * getSectionList
 * return section list
 * @return {object[]} section object list
 */
SectionManager.prototype.getSectionList = function() {
    return this._sectionList;
};

/**
 * _makeSectionData
 * make default section object
 * @param {number} start initial start line number
 * @param {number} end initial end line number
 * @return {object} section object
 */
SectionManager.prototype._makeSectionData = function(start, end) {
    return {
        start: start,
        end: end,
        $previewSectionEl: null
    };
};

/**
 * _updateCurrentSectionEnd
 * update current section's end line number
 * @param {number} end end value to update
 */
SectionManager.prototype._updateCurrentSectionEnd = function(end) {
    this._currentSection.end = end;
};

/**
 * _eachLineState
 * iterate codemiror lines, callback function parameter pass line type and line number
 * @param {function} iteratee callback function
 */
SectionManager.prototype._eachLineState = function(iteratee) {
    /*this.cm.eachLine(function(line) {
        var type;


        if (line.text && line.stateAfter.base.header) {
            //console.log(line.text, '해더');
            type = 'header';
        } else {
            type = 'etc';
            //console.log(line.text, 'paoin');
        }

        console.log(line.text, line.stateAfter, type);
        iteratee(type, line.lineNo());
    });*/

    var type, state;

    for (var i = 0; i < this.cm.getDoc().lineCount(); i+=1) {
        state = this.cm.getStateAfter(i);

        if (this.cm.getLine(i) && state.base.header) {
            //console.log(line.text, '해더');
            type = 'header';
        } else {
            type = 'etc';
            //console.log(line.text, 'paoin');
        }

        //console.log(this.cm.getLine(i), state, type);
        iteratee(type, i);
    }
};

/**
 * makeSectionList
 * make section list
 */
SectionManager.prototype.makeSectionList = function() {
    var self = this;

    this._sectionList = [];

    this._eachLineState(function(type, lineNumber) {
        if (lineNumber === 0 || type === 'header') {
            self._addNewSection(lineNumber, lineNumber);
        } else {
            self._updateCurrentSectionEnd(lineNumber);
        }
    });
};


/**
 * sectionMatch
 * make preview sections then match section list with preview section element
 */
SectionManager.prototype.sectionMatch = function() {
    var sections;

    if (!this._sectionList) {
        return;
    }

    sections = this._getPreviewSections();
    this._matchPreviewSectionsWithSectionlist(sections);
};

/**
 * _matchPreviewSectionsWithSectionlist
 * match section list with preview section element
 * @param {HTMLNode[]} sections section nodes
 */
SectionManager.prototype._matchPreviewSectionsWithSectionlist = function(sections) {
    var self = this;

    sections.forEach(function(childs, index) {
        var $sectionDiv = $('<div class="content-id-'+ index + '"></div>');

        if (self._sectionList[index]) {
            self._sectionList[index].$previewSectionEl = $(childs).wrapAll($sectionDiv).parent();
        }
    });

    if (this._sectionList.length !== sections.length) {
        console.log('somethings happend');
    }
};

/**
 * _getPreviewSections
 * get preview html section group to make section
 * @return {array[]} element node array
 */
SectionManager.prototype._getPreviewSections = function() {
    var sections = [];

    sections[0] = [];

    this.$previewContent.contents().filter(function() {
        return this.nodeType === Node.ELEMENT_NODE;
    }).each(function(index, el) {
        if (el.tagName.match(/H1|H2|H3|H4|H5|H6/)) {
            if (sections[sections.length - 1].length) {
                sections.push([]);
            }
        }

        sections[sections.length - 1].push(el);
    });

    return sections;
};

/**
 * _sectionByLine
 * get section by markdown line
 * @param {number} line markdown editor line number
 * @return {object} section
 */
SectionManager.prototype.sectionByLine = function(line) {
    var sectionIndex,
        sectionList = this._sectionList,
        sectionLength = sectionList.length;

    for (sectionIndex = 0; sectionIndex < sectionLength; sectionIndex+=1) {
        if (line <= sectionList[sectionIndex].end) {
            break;
        }
    }

    if (sectionIndex === sectionLength) {
        sectionIndex = sectionLength - 1;
    }

    return sectionList[sectionIndex];
};

/**
 * ScrollSync
 * @exports ScrollSync
 * @augments
 * @constructor
 * @class
 */
function ScrollSync(sectionManager, cm, $previewContainerEl) {
    this.sectionManager = sectionManager;
    this.cm = cm;
    this.$previewContainerEl = $previewContainerEl;
}


ScrollSync.prototype._getEditorSectionHeight = function(section) {
    return this.cm.heightAtLine(section.end, 'local') - this.cm.heightAtLine(section.start > 0 ? section.start - 1 : 0, 'local');
};

ScrollSync.prototype._getLineHeightGapInSection = function(section, line) {
    var gap = this.cm.heightAtLine(line, 'local') - this.cm.heightAtLine(section.start > 0 ? section.start - 1 : 0, 'local');
    return Math.max(gap, 0);
};

ScrollSync.prototype._getSectionScrollRatio = function(section, line) {
    var ratio;

    if (section.end !== section.start) {
        ratio = this._getLineHeightGapInSection(section, line) / this._getEditorSectionHeight(section);
    } else if (section.end === section.start) {
        ratio = 0;
    }

    return ratio > 0 ? Math.min(ratio, MAX_SECTION_RATIO) : 0;
};

ScrollSync.prototype._getScrollFactorsOfEditor = function() {
    var topLine, topSection, ratio, isEditorBottom,
        cm = this.cm,
        scrollInfo = cm.getScrollInfo();

    isEditorBottom = scrollInfo.height - scrollInfo.top <= scrollInfo.clientHeight;

    if (!isEditorBottom) {
        topLine = cm.coordsChar({left: scrollInfo.left, top: scrollInfo.top}, 'local').line;

        topSection = this.sectionManager.sectionByLine(topLine);

        ratio = this._getSectionScrollRatio(topSection, topLine);

        return {
            section: topSection,
            sectionRatio: ratio
        };
    } else {
        return {
            isEditorBottom : isEditorBottom
        }
    }
};

ScrollSync.prototype.syncWithEditor = function() {
};

ScrollSync.prototype.syncToPreview = function() {
    var scrollTop, scrollFactors, section, ratio;

    scrollFactors = this._getScrollFactorsOfEditor();
    section = scrollFactors.section,
    ratio = scrollFactors.sectionRatio;

    if (scrollFactors.isEditorBottom) {
        scrollTop = this.$previewContainerEl.find('.previewContent').height()
    } else {
        scrollTop = section.$previewSectionEl[0].offsetTop + (section.$previewSectionEl.height() * ratio);
    }

    this.$previewContainerEl.scrollTop(scrollTop);
};

module.exports = ScrollSync;


//scollFollow Extension
extManager.defineExtension('scrollFollow', function(editor) {
    var cm = editor.getCodeMirror();

    var scrollerable = false;

    editor.scrollFollow = {};

    window.dd = cm;

    var sectionManager = editor.scrollFollow.sectionManager = new SectionManager(cm, editor.preview);
    var scrollSync = editor.scrollFollow.scrollSync = new ScrollSync(sectionManager, cm, editor.preview.$el);

    cm.on('change', function() {
        scrollerable = false;
        sectionManager.makeSectionList();
    });

    editor.on('previewRenderAfter', function() {
        sectionManager.sectionMatch();
        scrollerable = true;
    });

    cm.on('scroll', function() {
        if (scrollerable) {
            scrollSync.syncToPreview();
        }
    });
});

/*
extManager.defineExtension('scrollFollow', function(editor) {
    var cm = editor.getCodeMirror();

    window.d = cm;

    var sectionlist;
    var lastSection;
    var beforeSectionlist;

    cm.on('change', function() {
        beforeSectionlist = sectionlist;
        sectionlist = [];

         for (var i = 0; i < cm.getDoc().lineCount(); i+=1) {
            var state = cm.getStateAfter(i);
            var type;

            if (state.base.header) {
                type = 'header';
            } else {
                type = 'block';
            }

            //헤더영역 다음 빈칸이 헤더로 취급되는부분 해결
            if (type === 'header' && !cm.getLine(i)) {
                type = 'blank';
            }

            if (!lastSection || type === 'header') {
                lastSection = {
                    type: type,
                    content: cm.getLine(i),
                    start: i,
                    end: i,
                    state: state
                }

                sectionlist.push(lastSection);
            } else {
                lastSection.end = i;
                lastSection.content += cm.getLine(i)
            }
        }

        lastSection = null;

        console.log(sectionlist);
    });

    editor.on('previewRenderAfter', function(preview) {
        var sections = [];

        sections[0] = [];

        preview.$el.find('.previewContent').contents().filter(function() {
            return this.nodeType === Node.ELEMENT_NODE;
        }).each(function(index, el) {
            if (el.tagName.match(/H1|H2|H3|H4|H5|H6/)) {
                if (sections[sections.length - 1].length) {
                    sections.push([]);
                }
            }

            sections[sections.length - 1].push(el);
        });

        sections.forEach(function(childs, index) {
            $(childs).wrapAll('<div class="content-id-'+ index + '"></div>');
        });
    });

    //cm.on('cursorActivity', ne.util.throttle(function() {
    cm.on('scroll', ne.util.throttle(function() {
        var cursor;
        var scrollInfo = cm.getScrollInfo();
        var sectionIndex;
        var markdownBottom = scrollInfo.height - scrollInfo.top <= scrollInfo.clientHeight;

        cursor = d.coordsChar({left: scrollInfo.left, top: scrollInfo.top}, 'local');


        for (sectionIndex = 0; sectionIndex < sectionlist.length; sectionIndex+=1) {
            if (cursor.line <= sectionlist[sectionIndex].end) {
                break;
            }
        }

        if (sectionIndex >= sectionlist.length) {
            sectionIndex = sectionlist.length - 1;
        }

        if(!sectionlist[sectionIndex]) {
            return;
        }

        var sectionHeight = cm.heightAtLine(sectionlist[sectionIndex].end, 'local') - cm.heightAtLine(sectionlist[sectionIndex].start, 'local');
        var gap = cm.heightAtLine(cursor.line, 'local') - cm.heightAtLine(sectionlist[sectionIndex].start, 'local');

        gap = gap > 0 ? gap : 0;

        var ratio = gap / sectionHeight;

        ratio = ratio ? ratio : 0;

        var el = editor.preview.$el.find('.previewContent > .content-id-' + sectionIndex);

        console.log('mardown target', sectionlist[sectionIndex].content);

        //프리뷰에 렌더되기 전일경우는 무시
        if (el.length) {
            el = el[0];
            console.log('preview target', el.innerHTML);
            var scrollTop = markdownBottom ? editor.preview.$el.find('.previewContent').height() : el.offsetTop + ($(el).height() * ratio);

            console.log('preview scrolltop', scrollTop);

           animate(editor.preview.$el[0], editor.preview.$el.scrollTop(), scrollTop, function() {}, function() {});
        }
    }, 100));
});

var timeoutId;
var currentEndCb;

function animate(elt, startValue, endValue, stepCb, endCb) {
    if(currentEndCb) {
        clearTimeout(timeoutId);
        currentEndCb();
    }
    currentEndCb = endCb;
    var diff = endValue - startValue;
    var startTime = Date.now();

    function tick() {
        var currentTime = Date.now();
        var progress = (currentTime - startTime) / 200;
        if(progress < 1) {
            var scrollTop = startValue + diff * Math.cos((1 - progress) * Math.PI / 2);
            elt.scrollTop = scrollTop;
            stepCb(scrollTop);
            timeoutId = setTimeout(tick, 1);
        }
        else {
            currentEndCb = undefined;
            elt.scrollTop = endValue;
            setTimeout(endCb, 100);
        }
    }

    tick();
}
*/


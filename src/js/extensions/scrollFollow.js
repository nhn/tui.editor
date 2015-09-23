/**
 * @fileoverview Implements %filltext:name=Name%
 * @author
 */

'use strict';

var extManager = require('../extManager');

extManager.defineExtension('scrollFollow', function(editor) {
    var cm = editor.getCodeMirror();

    window.d = cm;

    var sectionlist;
    var lastSection;
    var beforeSectionlist;

    cm.on('change', function() {
        console.log('markdown----------------');
        beforeSectionlist = sectionlist;
        sectionlist = [];

         for (var i = 0; i < cm.getDoc().lineCount(); i+=1) {
            var state = cm.getStateAfter(i);
            var type;

            if (state.base.header) {
                type = 'header';
            } else if (state.base.hr) {
                type = 'hr';
            } else if (state.base.list) {
                type = 'list';
            } else if (state.overlay.codeBlock) {
                type = 'codeBlock';
            } else if (state.base.quote) {
                type = 'quote';
            } else if (cm.getLine(i)) {
                type = 'paragraph';
            } else {
                type = 'blank';
            }

            //현재라인에 텍스트가 있고 이전라인이 리스트면 지금라인도 리스트
            if (lastSection && type !== 'list' && lastSection.type === 'list' && cm.getLine(i)) {
                type = 'list';
            }

            //헤더영역 다음 빈칸이 헤더로 취급되는부분 해결
            if (type === 'header' && !cm.getLine(i)) {
                type = 'blank';
            }

            //코드블럭을 닫는 라인은 코드블럭으로 인식하지않아처리.
            if (lastSection && type !== 'codeBlock' && lastSection.type === 'codeBlock' && cm.getLine(i).match(/^```/)) {
                type = 'codeBlock';
            }

            if (!lastSection || lastSection.type !== type || lastSection.type === 'header') {
                if (type !== 'blank') {
                    lastSection = {
                        type: type,
                        content: cm.getLine(i),
                        start: i,
                        end: i,
                        state: state
                    }

                    sectionlist.push(lastSection);
                } else {
                    lastSection = null;
                }
            } else {
                lastSection.end = i;
                lastSection.content += cm.getLine(i)
            }
        }

        lastSection = null;
/*
        setTimeout(function() {
            console.log(editor.preview.$el.find('.previewContent').contents());
            editor.preview.$el.find('.previewContent').contents().filter(function() {
                return this.nodeType === Node.ELEMENT_NODE && this.textContent;
            }).each(function(index, el) {
                sectionlist[index].el = el;
            });
        }, 1000);*/

        console.log(sectionlist);
    });

    //cm.on('cursorActivity', ne.util.throttle(function() {
    cm.on('scroll', ne.util.throttle(function() {
        var cursor;
        var scrollInfo = cm.getScrollInfo();
        var markdownBottom = scrollInfo.height - scrollInfo.top <= scrollInfo.clientHeight;

        console.log('scrollInfo', scrollInfo);
        cursor = d.coordsChar({left: scrollInfo.left, top: scrollInfo.top}, 'local');
        //cursor = cm.getCursor();
        console.log('cursor', cursor);

        var sectionIndex;

        for (sectionIndex = 0; sectionIndex < sectionlist.length; sectionIndex+=1) {
            if (cursor.line <= sectionlist[sectionIndex].end) {
                break;
            }
        }

        if (sectionIndex >= sectionlist.length) {
            sectionIndex = sectionlist.length - 1;
        }

        console.log('sectionIndex', sectionIndex);

        if(!sectionlist[sectionIndex]) {
            return;
        }

        var sectionHeight = cm.heightAtLine(sectionlist[sectionIndex].end, 'local') - cm.heightAtLine(sectionlist[sectionIndex].start, 'local');
        console.log('sectionHeight', sectionHeight);

        //var gap = scrollInfo.top - d.heightAtLine(sectionlist[sectionIndex].start, 'local');
        var gap = cm.heightAtLine(cursor.line, 'local') - cm.heightAtLine(sectionlist[sectionIndex].start, 'local');

        console.log('gap', gap);

        gap = gap > 0 ? gap : 0;

        var ratio = gap / sectionHeight;

        ratio = ratio ? ratio : 0;
        console.log('ratio', ratio);

        //console.log(sectionIndex, sectionlist[sectionIndex], sectionlist[sectionIndex].type);

        var el = editor.preview.$el.find('.previewContent').contents().filter(function() {
            return this.nodeType === Node.ELEMENT_NODE && this.textContent;
        })[sectionIndex];

        console.log('mardown target', sectionlist[sectionIndex].content);

        //프리뷰에 렌더되기 전일경우는 무시
        if (el) {
            console.log('preview target', el.innerHTML);
            var scrollTop = markdownBottom ? editor.preview.$el.find('.previewContent').height() : el.offsetTop + ($(el).height() * ratio) - 50;

            console.log('preview scrolltop', scrollTop);
            //editor.preview.$el.scrollTop(el.offsetTop + ($(el).height() * ratio) - 50);
            /*editor.preview.$el.animate({
                scrollTop: el.offsetTop + ($(el).height() * ratio) - 50
            }, 100, 'linear');*/
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
/*
[>*
 * ScrollFollow
 * @exports ScrollFollow
 * @augments
 * @constructor
 * @class
 <]
function ScrollFollow() {
}

ScrollFollow.prototype.ad = function() {
};

module.exports = ScrollFollow;*/

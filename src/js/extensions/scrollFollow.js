/**
 * @fileoverview Implements Scroll Follow Extension
 * @author
 */

'use strict';

var extManager = require('../extManager'),
    ScrollSync = require('./scrollFollow.scrollSync'),
    SectionManager = require('./scrollFollow.sectionManager');

extManager.defineExtension('scrollFollow', function(editor) {
    var cm = editor.getCodeMirror(),
        scrollerable = false,
        sectionManager, scrollSync;

    sectionManager = new SectionManager(cm, editor.preview);
    scrollSync = new ScrollSync(sectionManager, cm, editor.preview.$el);

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

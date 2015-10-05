/**
 * @fileoverview Implements Scroll Follow Extension
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var extManager = require('../extManager'),
    ScrollSync = require('./scrollFollow.scrollSync'),
    SectionManager = require('./scrollFollow.sectionManager');

extManager.defineExtension('scrollFollow', function(editor) {
    var cm = editor.getCodeMirror(),
        scrollable = false,
        active = true,
        sectionManager, scrollSync;

    sectionManager = new SectionManager(cm, editor.preview);
    scrollSync = new ScrollSync(sectionManager, cm, editor.preview.$el);

    //Commands
    editor.addCommand('markdown', {
        name: 'scrollFollow.disable',
        exec: function() {
            active = false;
        }
    });

    editor.addCommand('markdown', {
        name: 'scrollFollow.enable',
        exec: function() {
            active = true;
        }
    });

    //Events
    cm.on('change', function() {
        scrollable = false;
        sectionManager.makeSectionList();
    });

    editor.on('previewRenderAfter', function() {
        sectionManager.sectionMatch();
        scrollable = true;
    });

    cm.on('scroll', function() {
        if (!active || !scrollable) {
            return;
        }

        scrollSync.syncToPreview();
    });

    //UI
    editor.layout.toolbar.addButton({
        className: 'scrollFollowEnable',
        command: 'scrollFollow.enable',
        text: 'SF_ON'
    });

    editor.layout.toolbar.addButton({
        className: 'scrollFollowDisable',
        command: 'scrollFollow.disable',
        text: 'SF_OFF'
    });
});

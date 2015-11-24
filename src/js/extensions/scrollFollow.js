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
        name: 'scrollFollowDisable',
        exec: function() {
            active = false;
        }
    });

    editor.addCommand('markdown', {
        name: 'scrollFollowEnable',
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
        scrollSync.syncToPreview();
        scrollable = true;
    });

    cm.on('scroll', function() {
        if (!active || !scrollable) {
            return;
        }

        scrollSync.syncToPreview();
    });

    //UI
    if (editor.getUI().name === 'default') {
        editor.getUI().toolbar.addButton([{
            classname: 'scrollfollowEnable',
            command: 'scrollFollowDisable',
            text: 'SF',
            style: 'background-color: #fff'
        }, {
            className: 'scrollFollowDisable',
            command: 'scrollFollowEnable',
            text: 'SF',
            style: 'background-color: #ddd'
        }]);
    }
});

/**
 * @fileoverview Implements Scroll Follow Extension
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var extManager = require('../extManager'),
    ScrollSync = require('./scrollFollow.scrollSync'),
    SectionManager = require('./scrollFollow.sectionManager');

extManager.defineExtension('scrollFollow', function(editor) {
    var scrollable = false,
        active = true,
        sectionManager, scrollSync,
        className = 'tui-scrollfollow',
        $button, cm;

    if (editor.isViewOnly()) {
        return;
    }

    cm = editor.getCodeMirror();

    sectionManager = new SectionManager(cm, editor.preview);
    scrollSync = new ScrollSync(sectionManager, cm, editor.preview.$el);

    //UI
    if (editor.getUI().name === 'default') {
        editor.getUI().toolbar.addButton([{
            className: [className, 'active'].join(' '),
            command: 'scrollFollowDisable',
            tooltip: '자동 스크롤 끄기',
            style: 'background-color: #ddedfb'
        }, {
            className: className,
            command: 'scrollFollowEnable',
            tooltip: '자동 스크롤 켜기',
            style: 'background-color: #fff'
        }]);
    }

    $button = editor.getUI().toolbar.$el.find(className);

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

    //위지윅에서는 숨김
    editor.on('changeModeToWysiwyg', function() {
        $button.hide();
    });

    editor.on('changeModeToMarkdown', function() {
        $button.show();
    });
});

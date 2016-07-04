/**
 * @fileoverview Implements Scroll Follow Extension
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var extManager = require('../extManager'),
    ScrollSync = require('./scrollFollow.scrollSync'),
    SectionManager = require('./scrollFollow.sectionManager'),
    Button = require('../ui/button');

extManager.defineExtension('scrollFollow', function(editor) {
    var scrollable = false,
        active = true,
        sectionManager, scrollSync,
        className = 'tui-scrollfollow',
        TOOL_TIP = {
            active: '자동 스크롤 끄기',
            inActive: '자동 스크롤 켜기'
        },
        button,
        cm;

    if (editor.isViewOnly()) {
        return;
    }

    cm = editor.getCodeMirror();

    sectionManager = new SectionManager(cm, editor.preview);
    scrollSync = new ScrollSync(sectionManager, cm, editor.preview.$el);

    //UI
    if (editor.getUI().name === 'default') {
        //init button
        button = new Button({
            className: className,
            command: 'scrollFollowToggle',
            tooltip: TOOL_TIP.active,
            $el: $('<button class="active ' + className + ' tui-toolbar-icons" type="button"></button>')
        });

        editor.getUI().toolbar.addButton(button);

        if (editor.currentMode === 'wysiwyg') {
            button.$el.hide();
        }

        //hide scroll follow button in wysiwyg
        editor.on('changeModeToWysiwyg', function() {
            button.$el.hide();
        });

        editor.on('changeModeToMarkdown', function() {
            button.$el.show();
        });

        //Commands
        editor.addCommand('markdown', {
            name: 'scrollFollowToggle',
            exec: function() {
                active = !active;

                if (active) {
                    button.$el.addClass('active');
                    button.tooltip = TOOL_TIP.active;
                } else {
                    button.$el.removeClass('active');
                    button.tooltip = TOOL_TIP.inActive;
                }
            }
        });
    }

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
});

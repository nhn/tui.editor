/**
 * @fileoverview Implements Color syntax Extension
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

'use strict';

var extManager = require('../extManager');

var colorSyntax = /{color:(.+?)}(.*?){color}/g,
    colorHtml = /<span class="colour" style="color:(.+?)">(.*?)<\/span>/g;

extManager.defineExtension('colorSyntax', function(editor) {
    editor.eventManager.listen('convertorAfterMarkdownToHtmlConverted', function(html) {
        return html.replace(colorSyntax, '<span style="color:$1">$2</span>');
    });
    editor.eventManager.listen('convertorAfterHtmlToMarkdownConverted', function(markdown) {
        return markdown.replace(colorHtml, '{color:$1}$2{color}');
    });
/*
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
    editor.layout.toolbar.addButton([{
        classname: 'scrollfollowEnable',
        command: 'scrollFollow.disable',
        text: 'SF',
        style: 'background-color: #fff'
    }, {
        className: 'scrollFollowDisable',
        command: 'scrollFollow.enable',
        text: 'SF',
        style: 'background-color: #ddd'
    }]);*/
});

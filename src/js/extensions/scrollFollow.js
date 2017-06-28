/**
 * @fileoverview Implements Scroll Follow Extension
 * @author Sungho Kim(sungho-kim@nhnent.com) FE Development Team/NHN Ent.
 */

import extManager from '../extManager';
import ScrollSync from './scrollFollow.scrollSync';
import SectionManager from './scrollFollow.sectionManager';
import Button from '../ui/button';
import i18n from '../i18n';

extManager.defineExtension('scrollFollow', editor => {
    const className = 'tui-scrollfollow';
    const TOOL_TIP = {
        active: i18n.get('Auto scroll enabled'),
        inActive: i18n.get('Auto scroll disabled')
    };

    if (editor.isViewOnly()) {
        return;
    }

    const cm = editor.getCodeMirror();
    const sectionManager = new SectionManager(cm, editor.preview);
    const scrollSync = new ScrollSync(sectionManager, cm, editor.preview.$el);

    let isScrollable = false;
    let isActive = true;
    let button;

    // UI
    if (editor.getUI().name === 'default') {
        // init button
        button = new Button({
            className,
            command: 'scrollFollowToggle',
            tooltip: TOOL_TIP.active,
            $el: $(`<button class="active ${className}" type="button"></button>`)
        });

        editor.getUI().toolbar.addButton(button);

        changeButtonVisiblityStateIfNeed();
        // hide scroll follow button in wysiwyg
        editor.on('changeMode', changeButtonVisiblityStateIfNeed);
        editor.on('changePreviewStyle', changeButtonVisiblityStateIfNeed);

        // Commands
        editor.addCommand('markdown', {
            name: 'scrollFollowToggle',
            exec() {
                isActive = !isActive;
                button._onOut();
                if (isActive) {
                    button.$el.addClass('active');
                    button.tooltip = TOOL_TIP.active;
                } else {
                    button.$el.removeClass('active');
                    button.tooltip = TOOL_TIP.inActive;
                }
                button._onOver();
            }
        });
    }

    // Events
    cm.on('change', () => {
        isScrollable = false;
        sectionManager.makeSectionList();
    });

    /**
     * change button visiblity state
     */
    function changeButtonVisiblityStateIfNeed() {
        if (editor.mdPreviewStyle === 'vertical' && editor.currentMode === 'markdown') {
            button.$el.show();
        } else {
            button.$el.hide();
        }
    }

    editor.on('previewRenderAfter', () => {
        sectionManager.sectionMatch();
        scrollSync.syncPreviewScrollTopToMarkdown();
        isScrollable = true;
    });

    editor.eventManager.listen('scroll', event => {
        if (!isActive) {
            return;
        }

        if (isScrollable && editor.preview.isVisible()) {
            if (event.source === 'markdown' && !scrollSync.isMarkdownScrollEventBlocked) {
                scrollSync.syncPreviewScrollTopToMarkdown();
            } else if (event.source === 'preview' && !scrollSync.isPreviewScrollEventBlocked) {
                scrollSync.syncMarkdownScrollTopToPreview();
            }
        } else {
            scrollSync.saveScrollInfo();
        }
    });
});

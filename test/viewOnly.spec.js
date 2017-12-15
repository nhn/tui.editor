import MarkdownIt from 'markdown-it';

import ToastUIEditorViewOnly from '../src/js/viewOnly';
import {CodeBlockManager} from '../src/js/codeBlockManager';

describe('ViewOnly', () => {
    it('markdownitHighlight should be MarkdownIt instance', () => {
        expect(ToastUIEditorViewOnly.markdownitHighlight instanceof MarkdownIt).toBe(true);
    });
    it('domUtils should have it\' functions', () => {
        expect(typeof ToastUIEditorViewOnly.domUtils.getNodeName).toBe('function');
    });
    it('codeBlockManager should be CodeBlockManager instance', () => {
        expect(ToastUIEditorViewOnly.codeBlockManager instanceof CodeBlockManager).toBe(true);
    });
});

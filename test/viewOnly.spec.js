
import ToastUIEditorViewOnly from '../src/js/viewOnly';
import {CodeBlockManager} from '../src/js/codeBlockManager';

const MarkDownIt = window.markdownit;

describe('ViewOnly', () => {
    it('markdownitHighlight should be MarkDownIt instance', () => {
        expect(ToastUIEditorViewOnly.markdownitHighlight instanceof MarkDownIt).toBe(true);
    });
    it('domUtils should have it\' functions', () => {
        expect(typeof ToastUIEditorViewOnly.domUtils.getNodeName).toBe('function');
    });
    it('codeBlockManager should be CodeBlockManager instance', () => {
        expect(ToastUIEditorViewOnly.codeBlockManager instanceof CodeBlockManager).toBe(true);
    });
});

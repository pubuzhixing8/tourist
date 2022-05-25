import { EDITOR_TO_ELEMENT, IS_FOCUSED } from 'richtext';
import { Editor, Transforms } from 'slate';

export function setFullSelectionAndFocus(editor: Editor) {
    Transforms.select(editor, [0, 0]);
    const isFocused = IS_FOCUSED.get(editor);
    const editable = EDITOR_TO_ELEMENT.get(editor);
    if (!isFocused && editable) {
        editable.focus({ preventScroll: true });
    }
}

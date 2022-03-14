import { Editor } from "slate";
import { EDITOR_TO_ON_CHANGE } from "../utils/weak-maps";

export const withRichtext = <T extends Editor>(editor: T) => {
    const { onChange, insertBreak } = editor;

    editor.onChange = () => {
        const onContextChange = EDITOR_TO_ON_CHANGE.get(editor);

        if (onContextChange) {
            onContextChange();
        }

        onChange();
    }

    editor.insertBreak = () => {
        editor.insertText('\n');
    }
}
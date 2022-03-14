import { Editor } from "slate";
import { EDITOR_TO_WINDOW } from "../utils/weak-maps";

export const RichtextEditor = {
    getWindow(editor: Editor): Window {
        const window = EDITOR_TO_WINDOW.get(editor);
        if (!window) {
            throw new Error('Unable to find a host window element for this editor');
        }
        return window;
    },
};
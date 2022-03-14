import { Editor } from "slate";

export const EDITOR_TO_ON_CHANGE = new WeakMap<Editor, () => void>();

export const EDITOR_TO_WINDOW: WeakMap<Editor, Window> = new WeakMap();

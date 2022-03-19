import { Editor, Node } from "slate";

export const NODE_TO_INDEX: WeakMap<Node, number> = new WeakMap();

export const EDITOR_TO_ELEMENT: WeakMap<Editor, HTMLElement> = new WeakMap();

export const EDITOR_TO_ON_CHANGE = new WeakMap<Editor, () => void>();

export const EDITOR_TO_WINDOW: WeakMap<Editor, Window> = new WeakMap();

export const ELEMENT_TO_NODE: WeakMap<HTMLElement, Node> = new WeakMap();
export const NODE_TO_ELEMENT: WeakMap<Node, HTMLElement> = new WeakMap();

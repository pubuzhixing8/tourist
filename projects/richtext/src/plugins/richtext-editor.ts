import { Editor, Node, Path, Point, Range, Text } from "slate";
import { DOMRange, DOMPoint, DOMStaticRange, DOMSelection, isDOMSelection } from "../utils/dom";
import { EDITOR_TO_ELEMENT, EDITOR_TO_WINDOW, ELEMENT_TO_NODE, NODE_TO_ELEMENT, NODE_TO_INDEX } from "../utils/weak-maps";

export const RichtextEditor = {
    getWindow(editor: Editor): Window {
        const window = EDITOR_TO_WINDOW.get(editor);
        if (!window) {
            throw new Error('Unable to find a host window element for this editor');
        }
        return window;
    },
    toDOMRange(editor: Editor, range: Range): DOMRange {
        const { anchor, focus} = range;
        const isBackward = Range.isBackward(range);
        const isCollapsed = Range.isCollapsed(range);
        const domAnchor = RichtextEditor.toDOMPoint(editor, anchor);
        const domFocus = isCollapsed ? domAnchor : RichtextEditor.toDOMPoint(editor, focus);

        const window = RichtextEditor.getWindow(editor);
        const domRange = window.document.createRange();
        const [startNode, startOffset] = isBackward ? domFocus : domAnchor;
        const [endNode, endOffset] = isBackward ? domAnchor : domFocus;
        domRange.setStart(startNode.childNodes[0], startOffset);
        domRange.setEnd(endNode.childNodes[0], endOffset);
        return domRange;
    },
    toDOMPoint(editor: Editor, point: Point): DOMPoint {
        const [node] = Editor.node(editor, point.path);
        const el = RichtextEditor.toDOMNode(editor, node);
        let domPoint: DOMPoint | undefined;
        
        if (Editor.void(editor, { at: point })) {
            point = { path: point.path, offset: 0 };
        }

        domPoint = [el, point.offset];

        return domPoint;
    },
    toDOMNode(editor: Editor, node: Node): HTMLElement {
        const domNode = Editor.isEditor(node)
            ? EDITOR_TO_ELEMENT.get(editor)
            : NODE_TO_ELEMENT.get(node);
        if (!domNode) {
            throw new Error('');
        }
        return domNode;
    },
    toSlateRange(editor: Editor, domRange: DOMRange | DOMSelection): Range {
        let anchorNode, anchorOffset, focusNode, focusOffset, isCollapsed;
        if (isDOMSelection(domRange)) {
            anchorNode = domRange.anchorNode;
            anchorOffset = domRange.anchorOffset;
            focusNode = domRange.focusNode;
            focusOffset = domRange.focusOffset;
            isCollapsed = domRange.isCollapsed;
        } else {
            anchorNode = domRange.startContainer;
            anchorOffset = domRange.startOffset;
            focusNode = domRange.endContainer;
            focusOffset = domRange.endOffset;
            isCollapsed = domRange.collapsed;
        }

        if (anchorNode == null || focusNode == null || anchorOffset == null || focusOffset == null) {
            throw new Error(`Cannot resolve a Slate range from DOM range: ${domRange}`);
        }

        const anchor = RichtextEditor.toSlatePoint(editor, [anchorNode, anchorOffset]);
        const focus = isCollapsed ? anchor : RichtextEditor.toSlatePoint(editor, [focusNode, focusOffset]);

        return { anchor, focus };
    },
    toSlatePoint(editor: Editor, domPoint: DOMPoint): Point {
        let [node, offset] = domPoint;
        const parentNode = node.parentElement;
        const textNode = parentNode?.closest<HTMLElement>('[data-plait-node="text"]');
        if (textNode) {
            const text = ELEMENT_TO_NODE.get(textNode);
            const index = text && NODE_TO_INDEX.get(text);
            if (index !== undefined) {
                return { path: [0, index], offset: offset }
            }
        }
        throw new Error(`Cannot resolve a Slate point from DOM point: ${domPoint}`);
    }
};
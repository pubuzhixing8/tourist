import { isPlaitMindmap, PlaitMindmap } from "../interfaces/mindmap";
import { PlaitBoard } from "plait/interfaces/board";
import { PlaitElementContext } from "plait/interfaces/element-context";
import { PlaitPlugin } from "plait/interfaces/plugin";
import { PlaitMindmapComponent } from "../mindmap.component";
import { IS_TEXT_EDITABLE } from "plait/utils/weak-maps";
import { toPoint } from "plait/utils/dom";
import { HAS_SELECTED_MINDMAP, HAS_SELECTED_MINDMAP_NODE, MINDMAP_TO_COMPONENT } from "../utils/weak-maps";
import { hitMindmapNode } from "../utils/graph";
import { PlaitElement } from "plait/interfaces/element";
import { MindmapNode } from "../interfaces/node";
import { SimpleChanges } from "@angular/core";

export const withMindmap: PlaitPlugin = (board: PlaitBoard) => {
    const { drawElement, mousedown, mousemove, mouseup, keydown, redrawElement } = board;

    board.drawElement = (context: PlaitElementContext) => {
        const { element, selection, viewContainerRef, host } = context.elementInstance;
        if (isPlaitMindmap(element)) {
            const mindmapComponentRef = viewContainerRef.createComponent(PlaitMindmapComponent);
            const mindmapInstance = mindmapComponentRef.instance;
            mindmapInstance.value = element;
            mindmapInstance.selection = selection;
            mindmapInstance.host = host;
            return [mindmapInstance.mindmapGGroup];
        }
        return drawElement(context);
    }

    board.mouseup = (event: MouseEvent) => {
        if (IS_TEXT_EDITABLE.get(board)) {
            return;
        }
        const point = toPoint(event.x, event.y, board.host);
        let selectedMindmap: PlaitMindmap | null = null;
        board.children.forEach((value: PlaitElement) => {
            if (isPlaitMindmap(value)) {
                const mindmapComponent = MINDMAP_TO_COMPONENT.get(value);
                const root = mindmapComponent?.root;
                (root as any).eachNode((node: MindmapNode) => {
                    if (hitMindmapNode(point, node)) {
                        HAS_SELECTED_MINDMAP_NODE.set(node, true);
                        selectedMindmap = value
                    } else {
                        HAS_SELECTED_MINDMAP_NODE.delete(node);
                    }
                });
            }
            if (selectedMindmap) {
                HAS_SELECTED_MINDMAP.set(board, selectedMindmap);
            } else {
                HAS_SELECTED_MINDMAP.has(board) && HAS_SELECTED_MINDMAP.delete(board);
            }
        });
        mouseup(event);
    }

    board.keydown = (event: KeyboardEvent) => {
        if (IS_TEXT_EDITABLE.get(board)) {
            return;
        }
        if (event.key === 'Tab') {
            event.preventDefault();
            const plaitMindmap = HAS_SELECTED_MINDMAP.get(board);
            if (plaitMindmap) {
                const mindmapComponent = MINDMAP_TO_COMPONENT.get(plaitMindmap);
                const root = mindmapComponent?.root;
                (root as any).eachNode((node: MindmapNode) => {
                    if (HAS_SELECTED_MINDMAP_NODE.get(node)) {
                        
                    }
                });
            }
        }
    }

    board.redrawElement = (context: PlaitElementContext, changes: SimpleChanges) => {
        const { element, selection } = context.elementInstance;
        if (isPlaitMindmap(element)) {
            const mindmapInstance = MINDMAP_TO_COMPONENT.get(element);
            if (!mindmapInstance) {
                throw new Error('undefined mindmap component');
            }
            mindmapInstance.value = element;
            mindmapInstance.selection = selection;
            if (changes['element']) {
                mindmapInstance.updateMindmap();
            } else {
                mindmapInstance.doCheck();
            }
            return [mindmapInstance.mindmapGGroup];
        }
        return drawElement(context);
    }

    return board;
}
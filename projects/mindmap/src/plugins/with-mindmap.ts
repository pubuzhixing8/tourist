import { isPlaitMindmap, PlaitMindmap } from "../interfaces/mindmap";
import { PlaitBoard } from "plait/interfaces/board";
import { PlaitElementContext } from "plait/interfaces/element-context";
import { PlaitPlugin } from "plait/interfaces/plugin";
import { PlaitMindmapComponent } from "../mindmap.component";
import { IS_TEXT_EDITABLE } from "plait/utils/weak-maps";
import { toPoint } from "plait/utils/dom";
import { HAS_SELECTED_MINDMAP, HAS_SELECTED_MINDMAP_ELEMENT, MINDMAP_NODE_TO_COMPONENT, MINDMAP_TO_COMPONENT } from "../utils/weak-maps";
import { hitMindmapNode } from "../utils/graph";
import { PlaitElement } from "plait/interfaces/element";
import { MindmapNode } from "../interfaces/node";
import { SimpleChanges } from "@angular/core";
import { Transforms } from "plait/transfroms";
import { Path } from "plait/interfaces/path";
import { MindmapElement } from "../interfaces/element";

export const withMindmap: PlaitPlugin = (board: PlaitBoard) => {
    const { drawElement, dblclick, mousedown, mousemove, mouseup, keydown, redrawElement } = board;

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
                        HAS_SELECTED_MINDMAP_ELEMENT.set(node.data, true);
                        selectedMindmap = value
                    } else {
                        HAS_SELECTED_MINDMAP_ELEMENT.has(node.data) && HAS_SELECTED_MINDMAP_ELEMENT.delete(node.data);
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
                    if (HAS_SELECTED_MINDMAP_ELEMENT.has(node.data)) {
                        const path = findPath(board, node).concat(node.children.length);
                        const newElement = {
                            id: 'c909a4ed-c9ba-4812-b353-93bf18027f33',
                            value: {
                                children: [{ text: '新节点' }]
                            },
                            children: [],
                            width: 48,
                            height: 22
                        };
                        Transforms.insertNode(board, newElement, path);
                    }
                });
            }
        }
    }

    board.dblclick = (event: MouseEvent) => {
        if (IS_TEXT_EDITABLE.get(board)) {
            return;
        }

        const point = toPoint(event.x, event.y, board.host);

        board.children.forEach((value: PlaitElement) => {
            if (isPlaitMindmap(value)) {
                const mindmapComponent = MINDMAP_TO_COMPONENT.get(value);
                const root = mindmapComponent?.root;
                (root as any).eachNode((node: MindmapNode) => {
                    if (hitMindmapNode(point, node)) {
                        const nodeComponent = MINDMAP_NODE_TO_COMPONENT.get(node);
                        if (nodeComponent) {
                            IS_TEXT_EDITABLE.set(board, true);
                            nodeComponent.startEditText((element: Partial<MindmapElement>) => {
                                const path = findPath(board, nodeComponent.node);
                                Transforms.setNode(board, element, path);
                            }, () => {
                                IS_TEXT_EDITABLE.set(board, false);
                            });
                        }
                    }
                });
            }
        });
    }

    board.redrawElement = (context: PlaitElementContext, changes: SimpleChanges) => {
        console.log('redraw');
        const { element, selection } = context.elementInstance;
        const elementChange = changes['element'];
        if (isPlaitMindmap(element)) {
            const previousElement = (elementChange && elementChange.previousValue) || element;
            const mindmapInstance = MINDMAP_TO_COMPONENT.get(previousElement);
            if (!mindmapInstance) {
                throw new Error('undefined mindmap component');
            }
            mindmapInstance.value = element;
            mindmapInstance.selection = selection;
            if (elementChange) {
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

export function findPath(board: PlaitBoard, node: MindmapNode): Path {
    const path = [];
    let _node = node;
    while (_node.parent) {
        const index = _node.parent.children.indexOf(_node);
        path.push(index);
        _node = _node.parent;
    }
    if (isPlaitMindmap(_node.data)) {
        const index = board.children.indexOf(_node.data);
        path.push(index);
    }
    return path.reverse();
}

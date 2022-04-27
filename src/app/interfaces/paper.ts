import { Element } from './element';
import { AddOperation, Operation, RemoveOperation, SetElementOperation, SetViewportOperation, SetSelectionOperation } from './operation';
import { PointerType } from './pointer';
import { Selection } from './selection';
import Hotkeys from '../utils/hotkeys';

export interface Paper {
    container: SVGElement | null;
    elements: Element[];
    operations: Operation[];
    onChange: () => void;
    apply: (operation: Operation) => void;
    selection: Selection;
    mousedown: (event: MouseEvent) => void;
    mouseup: (event: MouseEvent) => void;
    mousemove: (event: MouseEvent) => void;
    keydown: (event: KeyboardEvent) => void;
    keyup: (event: KeyboardEvent) => void;
    dblclick: (event: MouseEvent) => void;
    pointer: PointerType;
    dragging: boolean;
    viewport: Viewport;
    selectedMap: WeakMap<Element, boolean>;
}

export function createPaper(config: PaperConfig): Paper {
    const paper: Paper = {
        container: null,
        pointer: PointerType.draw,
        elements: [],
        operations: [],
        selection: { anchor: [-1, -1], focus: [-1, -1] },
        selectedMap: new WeakMap(),
        dragging: false,
        viewport: config.viewport,
        onChange: () => {

        },
        apply: (operation: Operation) => {
            if (Operation.isAddOperation(operation)) {
                paper.elements.push(operation.data);
            } else if (Operation.isRemoveOperation(operation)) {
                const index = paper.elements.findIndex((element) => element.key === operation.data.key);
                paper.elements.splice(index, 1);
            } else if (Operation.isSetSelectionOperation(operation)) {
                paper.selection = operation.data;
            } else if (Operation.isSetViewportOperation(operation)) {
                paper.viewport = operation.data;
            }
            else if (Operation.isSetElementOperation(operation)) {
                const index = paper.elements.findIndex((element) => element.key === operation.data.key);
                const newElement = { ...paper.elements[index] } as any;
                const newProperties = operation.newProperties as any;
                for (const key in newProperties) {
                    if (Object.prototype.hasOwnProperty.call(operation.newProperties, key)) {
                        const value = newProperties[key];
                        if (value === null || value === undefined) {
                            if (newElement[key]) {
                                delete newElement[key];
                            }
                        } else {
                            newElement[key] = value;
                        }
                    }
                }
                paper.elements[index] = newElement;
            }
            paper.operations.push(operation);
            Promise.resolve().then(() => {
                if (paper.operations.length === 1) {
                    paper.onChange();
                }
                paper.operations = [];
            });
        },
        mousedown: (event) => { },
        mouseup: (event) => { },
        mousemove: (event) => { },
        keydown: (event) => {
            if (Hotkeys.isDeleteBackward(event) && paper.pointer === PointerType.pointer) {
                const deleteElements = paper.elements.filter((ele) => paper.selectedMap.get(ele));
                deleteElements.forEach((ele) => removeElement(paper, ele));
            }
        },
        keyup: (event) => { },
        dblclick: (event) => { }
    };
    return paper;
}

export function addElement(paper: Paper, element: Element) {
    const operation: AddOperation = { type: 'add', data: element };
    paper.apply(operation);
}

export function removeElement(paper: Paper, element: Element) {
    const operation: RemoveOperation = { type: 'remove', data: element };
    paper.apply(operation);
}

export function setSelection(paper: Paper, selection: Selection) {
    const operation: SetSelectionOperation = { type: 'set_selection', data: selection };
    paper.apply(operation);
}

export function setViewport(paper: Paper, viewport: Viewport) {
    const operation: SetViewportOperation = { type: 'set_viewport', data: viewport };
    paper.apply(operation);
}

export function setElement(paper: Paper, element: Element, newProperties: Partial<Element>) {
    const properties: any = {};
    const currentElement = element as any;
    for (const key in newProperties) {
        if (currentElement[key]) {
            properties[key] = currentElement[key];
        }
    }
    const operation: SetElementOperation = { type: 'set_element', data: element, newProperties, properties };
    paper.apply(operation);
}

export type Viewport = {
    width: number,
    height: number,
    offsetX: number;
    offsetY: number;
    // null indicates transparent bg
    viewBackgroundColor: string | null;
    zoom: number;
};

export type PaperConfig = {
    viewport: Viewport;
}
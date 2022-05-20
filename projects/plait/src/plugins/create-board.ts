import { PlaitElement } from "../interfaces/element";
import { PlaitOperation } from "../interfaces/operation";
import { PlaitBoard } from "../interfaces/board";
import { PlaitElementContext } from "../interfaces/element-context";
import { SimpleChanges } from "@angular/core";

export function createBoard(host: SVGElement, children: PlaitElement[]): PlaitBoard {
    return {
        host,
        viewport: {
            offsetX: 0,
            offsetY: 0,
            zoom: 1,
            viewBackgroundColor: '#000'
        },
        children,
        operations: [],
        selection: { anchor: [0, -1], focus: [-1, -1] },
        apply: (operation: PlaitOperation) => { },
        onChange: () => { },
        mousedown: (event: MouseEvent) => { },
        mouseup: (event: MouseEvent) => { },
        mousemove: (event: MouseEvent) => { },
        keydown: (event: KeyboardEvent) => { },
        keyup: (event: KeyboardEvent) => { },
        dblclick: (event: MouseEvent) => { },
        drawElement: (context: PlaitElementContext) => [],
        redrawElement: (changes: SimpleChanges) => [],
        destroyElement: () => { }
    }
}
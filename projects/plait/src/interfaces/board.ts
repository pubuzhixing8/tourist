import { SimpleChanges } from "@angular/core";
import { PlaitElement } from "./element";
import { PlaitElementContext } from "./element-context";
import { PlaitOperation } from "./operation";
import { Selection } from './selection';
import { Viewport } from "./viewport";

export interface PlaitBoard {
    host: SVGElement;
    viewport: Viewport;
    children: PlaitElement[];
    operations: PlaitOperation[];
    selection: Selection | null;
    apply: (operation: PlaitOperation) => void;
    onChange: () => void;
    mousedown: (event: MouseEvent) => void;
    mouseup: (event: MouseEvent) => void;
    mousemove: (event: MouseEvent) => void;
    keydown: (event: KeyboardEvent) => void;
    keyup: (event: KeyboardEvent) => void;
    dblclick: (event: MouseEvent) => void;
    drawElement: (context: PlaitElementContext) => SVGGElement[];
    redrawElement: (changes: SimpleChanges) => SVGGElement[];
    destroyElement: () => void;
}


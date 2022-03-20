import { ElementType } from "../interfaces/element";
import { addElement, Paper } from "../interfaces/paper";
import { PointerType } from "../interfaces/pointer";
import { generateKey } from "../utils/key";
import { toPoint } from "../utils/position";

export function textPaper<T extends Paper>(paper: T) {
    const { mousedown } = paper;
    paper.mousedown = (event: MouseEvent) => {
        if (paper.pointer === PointerType.text) {
            const start = toPoint(event.x, event.y, paper.container as SVGElement);
            const end = [start[0] + 50, start[1] + 40];
            const element = { type: ElementType.text, points: [start, end], key: generateKey()};
            addElement(paper, element as any);
            paper.pointer = PointerType.pointer;
            return;
        }
        mousedown(event);
    }
    return paper;
}
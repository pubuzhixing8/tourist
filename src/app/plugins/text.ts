import { Point } from "roughjs/bin/geometry";
import { ElementType, Element } from "../interfaces/element";
import { addElement, Paper } from "../interfaces/paper";
import { PointerType } from "../interfaces/pointer";
import { startEditRichtext } from "../utils/foreign-object";
import { generateKey } from "../utils/key";
import { toPoint } from "../utils/position";
import { setFullSelectionAndFocus } from "../utils/richtext";
import { transform } from "../utils/viewport";
import { HOSTSVGG_TO_RICHTEXT_REF, HOSTSVGG_TO_ELEMENT, ELEMENT_TO_COMPONENTS } from "../utils/weak-maps";

export const DEFAULT_LINE_HEIGHT = 22;

export function textPaper<T extends Paper>(paper: T) {
    const { mousedown, dblclick } = paper;
    paper.mousedown = (event: MouseEvent) => {
        if (paper.pointer === PointerType.text) {
            const start = toPoint(event.x, event.y - DEFAULT_LINE_HEIGHT / 2, paper.container as SVGElement);
            const end = [start[0] + 32, start[1] + DEFAULT_LINE_HEIGHT] as Point;
            const text = transform(paper, createText(start, end));
            addElement(paper, text);
            paper.pointer = PointerType.pointer;
            // 直接聚焦
            setTimeout(() => {
                const component = ELEMENT_TO_COMPONENTS.get(text);
                if (component && component.hostSVGG[0]) {
                    const richTextRef = HOSTSVGG_TO_RICHTEXT_REF.get(component.hostSVGG[0]);
                    richTextRef && setFullSelectionAndFocus(richTextRef.instance.editor);
                    startEditRichtext(paper, text, component.hostSVGG[0]);
                }
            }, 200);
            return;
        }
        mousedown(event);
    }
    paper.dblclick = (event: MouseEvent) => {
        if (event.target instanceof HTMLElement) {
            const plaitRichtext = event.target.closest('.plait-richtext-container');
            const g = plaitRichtext?.parentElement?.parentElement;
            const element = g && g instanceof SVGGElement && HOSTSVGG_TO_ELEMENT.get(g);
            const richTextRef = g && g instanceof SVGGElement && HOSTSVGG_TO_RICHTEXT_REF.get(g);
            if (richTextRef && element) {
                setTimeout(() => {
                    setFullSelectionAndFocus(richTextRef.instance.editor);
                    startEditRichtext(paper, element, g as SVGGElement);
                }, 200);
            }
        }
        dblclick(event);
    }
    return paper;
}

export function createText(start: Point, end: Point): Element {
    return {
        type: ElementType.text, points: [start, end], key: generateKey(), richtext: {
            children: [
                { text: '' }
            ]
        }
    };
}
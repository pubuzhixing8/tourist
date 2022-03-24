import { ElementType, Element } from "../interfaces/element";
import { addElement, Paper } from "../interfaces/paper";
import { PointerType } from "../interfaces/pointer";
import { editText, updateForeignObject } from "../utils/foreign-object";
import { generateKey } from "../utils/key";
import { toPoint } from "../utils/position";
import { setFullSelectionAndFocus } from "../utils/richtext";
import { ELEMENT_TO_COMPONENTS, IS_TEXT_EDITABLE } from "../utils/weak-maps";

export function textPaper<T extends Paper>(paper: T) {
    const { mousedown, dblclick } = paper;
    paper.mousedown = (event: MouseEvent) => {
        if (paper.pointer === PointerType.text) {
            const start = toPoint(event.x, event.y, paper.container as SVGElement);
            const end = [start[0] + 32, start[1] + 22];
            const element = { type: ElementType.text, points: [start, end], key: generateKey() };
            addElement(paper, element as any);
            paper.pointer = PointerType.pointer;
            return;
        }
        mousedown(event);
    }
    paper.dblclick = (event: MouseEvent) => {
        // 先通过选区找对应的富文本组件
        const elements = [...paper.elements];
        elements.forEach((value) => {
            const isSelected = Element.isIntersected(value, paper.selection);
            if (isSelected && value.type === ElementType.text) {
                const elementComponent = ELEMENT_TO_COMPONENTS.get(value);
                const editor = elementComponent?.editor;
                if (elementComponent && elementComponent.richtextComponentRef) {
                    elementComponent.richtextComponentRef.instance.readonly = false;
                    elementComponent.richtextComponentRef.changeDetectorRef.markForCheck();
                    // 更新宽度
                    IS_TEXT_EDITABLE.set(paper, true);
                    editText(elementComponent.g);
                }
                setTimeout(() => {
                    if (editor) {
                        setFullSelectionAndFocus(editor);
                    }
                }, 200);
            }
        });
        // if (event.target instanceof HTMLElement && event)
        dblclick(event);
    }
    return paper;
}
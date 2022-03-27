import { ComponentFactoryResolver, ComponentRef, ViewContainerRef } from '@angular/core';
import { PlaitRichtextComponent } from 'richtext';
import { Element } from '../interfaces/element';
import { Editor, Element as SlateElement } from 'slate';
import { Paper, removeElement, setElement } from '../interfaces/paper';
import { HOSTSVGG_TO_RICHTEXT_REF, IS_TEXT_EDITABLE } from './weak-maps';
import { take } from 'rxjs/operators';
import { setFullSelectionAndFocus } from './richtext';

const NS = 'http://www.w3.org/2000/svg';


export function createForeignObject(x: number, y: number, width: number, height: number) {
    var newForeignObject = document.createElementNS(NS, "foreignObject");
    newForeignObject.setAttribute("x", `${x}`);
    newForeignObject.setAttribute("y", `${y}`);
    newForeignObject.setAttribute("width", `${width}`);
    newForeignObject.setAttribute("height", `${height}`);
    return newForeignObject;
}

export function updateForeignObject(g: SVGGElement, width: number, height: number) {
    const foreignObject = g.querySelector('foreignObject');
    if (foreignObject) {
        foreignObject.setAttribute("width", `${width}`);
        foreignObject.setAttribute("height", `${height}`);
    }
}

export function startEditRichtext(paper: Paper, element: Element, g: SVGGElement) {
    const maxSize = 2000;
    IS_TEXT_EDITABLE.set(paper, true);
    updateForeignObject(g, maxSize, maxSize);
    const richTextRef = HOSTSVGG_TO_RICHTEXT_REF.get(g);
    if (richTextRef) {
        if (richTextRef.instance.readonly) {
            richTextRef.instance.readonly = false;
            richTextRef.changeDetectorRef.markForCheck();
            setTimeout(() => {
                setFullSelectionAndFocus(richTextRef.instance.editor);                
            }, 0);
        }
        let richtext = element.richtext;
        const valueChange$ = richTextRef.instance.valueChange.subscribe((value) => {
            richtext = value;
        });
        richTextRef.instance.blur.pipe(take(1)).subscribe(() => {
            richTextRef.instance.readonly = true;
            richTextRef.changeDetectorRef.markForCheck();
            endEditRichtext(paper, g);

            // 空内容是移除富文本
            if (richtext && Editor.isEmpty(richTextRef.instance.editor, richtext)) {
                removeElement(paper, element);
            }
            // 更新富文本内容
            if (richtext !== element.richtext) {
                setElement(paper, element, { richtext });
            }
            // 取消订阅内容变化
            valueChange$.unsubscribe();
        });
    }
}

export function endEditRichtext(paper: Paper, g: SVGGElement) {
    const foreignObject = g.querySelector<HTMLElement>('plait-richtext') as HTMLElement;
    const { width, height } = foreignObject.getBoundingClientRect();
    IS_TEXT_EDITABLE.set(paper, false);
    updateForeignObject(g, width, height);
}

export function createG() {
    const newG = document.createElementNS(NS, "g");
    return newG;
}

export function createRichtext(element: SlateElement, componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, edit: boolean) {
    const componentFactory = componentFactoryResolver.resolveComponentFactory(PlaitRichtextComponent);
    const componentRef = viewContainerRef.createComponent<PlaitRichtextComponent>(
        componentFactory
    );
    componentRef.instance.value = element;
    componentRef.instance.readonly = edit ? false : true;
    return componentRef;
}

export function renderRichtext(element: Element, componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, edit = false) {
    const g = createG();
    const width = element.points[1][0] - element.points[0][0];
    const height = element.points[1][1] - element.points[0][1];
    const foreignObject = createForeignObject(element.points[0][0], element.points[0][1], width, height);
    g.append(foreignObject);
    const richtextComponentRef = createRichtext(element.richtext as SlateElement, componentFactoryResolver, viewContainerRef, edit);
    foreignObject.append(richtextComponentRef.instance.editable);
    return { richtextComponentRef, g };
}

export function updateEditStatus(richtextComponentRef: ComponentRef<PlaitRichtextComponent>, edit: boolean) {
    richtextComponentRef.instance.readonly = edit ? false : true;
    richtextComponentRef.changeDetectorRef.markForCheck();
}


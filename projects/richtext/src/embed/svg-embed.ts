import { ComponentFactoryResolver, ComponentRef, ViewContainerRef } from '@angular/core';
import { createG, NS } from 'plait/utils/dom';
import { PlaitRichtextComponent } from 'richtext';
import { Element as SlateElement } from 'slate';

export function createForeignObject(x: number, y: number, width: number, height: number) {
    var newForeignObject = document.createElementNS(NS, 'foreignObject');
    newForeignObject.setAttribute('x', `${x}`);
    newForeignObject.setAttribute('y', `${y}`);
    newForeignObject.setAttribute('width', `${width}`);
    newForeignObject.setAttribute('height', `${height}`);
    return newForeignObject;
}

export function updateForeignObject(g: SVGGElement, width: number, height: number, x: number, y: number) {
    const foreignObject = g.querySelector('foreignObject');
    if (foreignObject) {
        foreignObject.setAttribute('width', `${width}`);
        foreignObject.setAttribute('height', `${height}`);
        foreignObject.setAttribute('x', `${x}`);
        foreignObject.setAttribute('y', `${y}`);
    }
}

export function createRichtext(
    element: SlateElement,
    componentFactoryResolver: ComponentFactoryResolver,
    viewContainerRef: ViewContainerRef,
    edit: boolean
) {
    const componentFactory = componentFactoryResolver.resolveComponentFactory(PlaitRichtextComponent);
    const componentRef = viewContainerRef.createComponent<PlaitRichtextComponent>(componentFactory);
    componentRef.instance.value = element;
    componentRef.instance.readonly = edit ? false : true;
    return componentRef;
}

export function drawRichtext(
    x: number,
    y: number,
    width: number,
    height: number,
    value: SlateElement,
    componentFactoryResolver: ComponentFactoryResolver,
    viewContainerRef: ViewContainerRef,
    classList: string[] = [],
    edit = false
) {
    const richTextG = createG();
    const foreignObject = createForeignObject(x, y, width, height);
    richTextG.append(foreignObject);
    const richtextComponentRef = createRichtext(value, componentFactoryResolver, viewContainerRef, edit);
    foreignObject.append(richtextComponentRef.instance.editable);
    classList.forEach(name => {
        richtextComponentRef.instance.editable.classList.add(name);
    });
    return { richtextComponentRef, richTextG };
}

export function updateEditStatus(richtextComponentRef: ComponentRef<PlaitRichtextComponent>, edit: boolean) {
    richtextComponentRef.instance.readonly = edit ? false : true;
    richtextComponentRef.changeDetectorRef.markForCheck();
}

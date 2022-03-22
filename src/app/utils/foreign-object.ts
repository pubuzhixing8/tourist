import { ComponentFactoryResolver, ComponentRef, ViewContainerRef } from '@angular/core';
import { PlaitRichtextComponent } from 'richtext';
import { Element } from '../interfaces/element';

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

export function createG() {
    const newG = document.createElementNS(NS, "g") as unknown as SVGGElement;
    return newG;
}

export function createRichtext(componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, edit: boolean) {
    const componentFactory = componentFactoryResolver.resolveComponentFactory(PlaitRichtextComponent);
    const componentRef = viewContainerRef.createComponent<PlaitRichtextComponent>(
        componentFactory
    );
    componentRef.instance.value = {
        children: [{ text: '文本' }]
    };
    componentRef.instance.readonly = edit ? false : true;
    return componentRef;
}

export function renderRichtext(element: Element, componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, edit = false) {
    const g = createG();
    const width = element.points[1][0] - element.points[0][0];
    const height = element.points[1][1] - element.points[0][1];
    const foreignObject = createForeignObject(element.points[0][0], element.points[0][1], width, height);
    g.append(foreignObject);
    const richtextComponentRef = createRichtext(componentFactoryResolver, viewContainerRef, edit);
    foreignObject.append(richtextComponentRef.instance.editable);
    return { richtextComponentRef, g };
}

export function updateEditStatus(richtextComponentRef: ComponentRef<PlaitRichtextComponent>, edit: boolean) {
    richtextComponentRef.instance.readonly = edit ? false : true;
    richtextComponentRef.changeDetectorRef.markForCheck();
}


import { ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
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

export function createG() {
    const newG = document.createElementNS(NS, "g") as unknown as SVGGElement;
    return newG;
}

export function createRichtext(componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef) {
    const componentFactory = componentFactoryResolver.resolveComponentFactory(PlaitRichtextComponent);
    const componentRef = viewContainerRef.createComponent<PlaitRichtextComponent>(
        componentFactory
    );
    componentRef.instance.value = {
        children: [{ text: '文本' }]
    };
    return componentRef;
}

export function renderRichtext(element: Element, componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef) {
    const g = createG();
    const width = element.points[1][0] - element.points[0][0];
    const height = element.points[1][1] - element.points[0][1];
    const foreignObject = createForeignObject(element.points[0][0], element.points[0][1], width, height);
    g.append(foreignObject);
    const richtextComponentRef = createRichtext(componentFactoryResolver, viewContainerRef);
    foreignObject.append(richtextComponentRef.instance.editable);
    return { richtextComponentRef, g };
}


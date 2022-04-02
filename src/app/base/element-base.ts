import { ComponentFactoryResolver, Directive, ElementRef, Input, ViewContainerRef } from "@angular/core";
import { RoughSVG } from "roughjs/bin/svg";
import { Element } from "../interfaces/element";
import { Selection } from "../interfaces/selection";
import { Paper } from "../interfaces/paper";

@Directive()
export class PlaitBaseElement {
    selected = false;

    @Input() rootSVG?: SVGElement | HTMLElement;

    @Input() roughSVG?: RoughSVG;

    @Input() element?: Element;

    @Input() selection?: Selection;

    @Input() paper?: Paper;

    getPaper() {
        if (this.paper) {
            return this.paper;
        }
        throw new Error('undefined paper');
    }

    hostSVGG: SVGGElement[];

    constructor(public elementRef: ElementRef,
        public componentFactoryResolver: ComponentFactoryResolver,
        public viewContainerRef: ViewContainerRef) {
        this.hostSVGG = [];
    }
}
import { ComponentFactoryResolver, Directive, ElementRef, Input, Renderer2, ViewContainerRef } from "@angular/core";
import { RoughSVG } from "roughjs/bin/svg";
import { Element } from "../interfaces/element";
import { Selection } from "../interfaces/selection";
import { Paper, Viewport } from "../interfaces/paper";

@Directive()
export class PlaitBaseElement {
    selected = false;

    @Input() rootSVG?: SVGElement | HTMLElement;

    @Input() roughSVG?: RoughSVG;

    @Input() element?: Element;

    @Input() selection?: Selection;

    @Input() viewport?: Viewport;

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
        public viewContainerRef: ViewContainerRef, public renderer2: Renderer2) {
        this.hostSVGG = [];
    }

    transform() {
        if (this.viewport) {
            const offsetX = this.viewport.offsetX;
            const offsetY = this.viewport.offsetY;
            this.hostSVGG.forEach((g) => {
                this.renderer2.setAttribute(g, 'transform', `translate(${offsetX} ${offsetY})`);
            });
        }
    }
}
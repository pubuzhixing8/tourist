import { AfterViewInit, ChangeDetectionStrategy, Component, ComponentFactoryResolver, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewContainerRef } from "@angular/core";
import { Element } from "../interfaces/element";
import { ELEMENT_TO_COMPONENTS, HOSTSVGG_TO_ELEMENT } from "../utils/weak-maps";
import { PlaitBaseElement } from "../base/element-base";
import { Subject } from "rxjs";
import { roughDrawer } from "../engine";

@Component({
    selector: 'plait-element',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaitElementComponent extends PlaitBaseElement implements OnInit, AfterViewInit, OnDestroy, OnChanges {
    destroy$: Subject<any> = new Subject();

    constructor(public elementRef: ElementRef,
        public componentFactoryResolver: ComponentFactoryResolver,
        public viewContainerRef: ViewContainerRef) {
        super(elementRef, componentFactoryResolver, viewContainerRef);
    }

    ngOnInit(): void {
        if (this.roughSVG && this.element) {
            ELEMENT_TO_COMPONENTS.set(this.element, this);
            const hostSVGG = roughDrawer.draw(this.roughSVG, this.element);
            if (!Array.isArray(hostSVGG)) {
                this.hostSVGG = [hostSVGG];
            } else {
                this.hostSVGG = hostSVGG;
            }
        }
        if (this.rootSVG) {
            const root = this.rootSVG;
            this.hostSVGG.forEach((g) => {
                root.appendChild(g);
                HOSTSVGG_TO_ELEMENT.set(g, this.element as Element);
            });
        }
    }

    ngAfterViewInit(): void {
    }

    // hidden() {
    //     if (this.svgGElement) {
    //         this.svgGElement.classList.add('hidden');
    //     }
    //     if (this.activeElementService) {
    //         this.activeElementService.hiddenActiveRectangle();
    //     }
    // }

    // show() {
    //     if (this.svgGElement) {
    //         this.svgGElement.classList.remove('hidden');
    //     }
    //     this.activeElementService?.showActiveRectangle();
    // }

    ngOnChanges(changes: SimpleChanges): void {
        const elementChange = changes['element'];
        if (elementChange) {
            ELEMENT_TO_COMPONENTS.set(this.element as Element, this);
            this.hostSVGG.forEach((g) => {
                HOSTSVGG_TO_ELEMENT.set(g, this.element as Element);
            });
        }
        const selectionChange = changes['selection'];
        if (selectionChange && this.paper && this.element) {
            const selected = this.paper.selectedMap.get(this.element);
            if (selected !== undefined && selected !== this.selected) {
                this.selected = selected;
                console.log(this.selected, 'selected');
            }
        }
    }

    ngOnDestroy(): void {
        this.element && ELEMENT_TO_COMPONENTS.delete(this.element);
        this.destroy$.next();
        this.destroy$.complete();
        if (this.roughSVG && this.element && this.hostSVGG) {
            this.hostSVGG.forEach((g) => {
                HOSTSVGG_TO_ELEMENT.delete(g);
            });
            roughDrawer.destroy(this.roughSVG, this.element, this.hostSVGG);
        }
    }
}
import { AfterViewInit, ChangeDetectionStrategy, Component, ComponentFactoryResolver, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewContainerRef } from "@angular/core";
import { Element } from "../interfaces/element";
import { ELEMENT_TO_COMPONENTS, HOSTSVGG_TO_ELEMENT } from "../utils/weak-maps";
import { PlaitBaseElement } from "../base/element-base";
import { Subject } from "rxjs";
import { roughDrawer } from "../drawer";

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
        // if (this.element.type === ElementType.text) {
        //     const { richtextComponentRef, g } = renderRichtext(this.element, this.componentFactoryResolver, this.viewContainerRef, false);
        //     this.richtextComponentRef = richtextComponentRef;
        //     this.svgGElement = g;
        //     this.elementRef.nativeElement.parentElement.appendChild(this.svgGElement);
        // }
        // this.activeElementService = new ActiveElementService(this.rs as RoughSVG, this.elementRef.nativeElement.parentElement, this.element, this.selection as Selection);
    }

    ngAfterViewInit(): void {
        // if (this.richtextComponentRef && this.richtextComponentRef.instance) {
        //     this.richtextComponentRef.instance.blur.asObservable().pipe(takeUntil(this.destroy$)).subscribe((event: FocusEvent) => {
        //         if (this.richtextComponentRef && this.richtextComponentRef?.instance) {
        //             this.richtextComponentRef.instance.readonly = true;
        //             this.richtextComponentRef.changeDetectorRef.markForCheck();
        //             IS_TEXT_EDITABLE.set(this.paper as Paper, false);
        //             cancelEditText(this.g);
        //         }
        //     });
        //     this.richtextComponentRef.instance.valueChange.asObservable().pipe(takeUntil(this.destroy$)).subscribe((event: any) => {
        //         if (this.richtextComponentRef && this.richtextComponentRef?.instance) {
        //             // 更新宽度
        //             const foreignObject = this.svgGElement?.querySelector('plait-richtext');
        //             if (foreignObject) {
        //                 const { width, height } = foreignObject.getBoundingClientRect();
        //                 const points = this.element.points;
        //                 points[1] = [points[0][0] + width, points[0][1] + height];
        //                 setElement(this.paper as Paper, this.element, { points: [...points], richtext: event })
        //             }
        //         }
        //     });
        // }
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
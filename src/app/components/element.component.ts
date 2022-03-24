import { AfterViewInit, ChangeDetectionStrategy, Component, ComponentFactoryResolver, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewContainerRef } from "@angular/core";
import { RoughSVG } from "roughjs/bin/svg";
import { Selection } from "../interfaces/selection";
import { Element, ElementType } from "../interfaces/element";
import { ELEMENT_TO_COMPONENTS, IS_TEXT_EDITABLE } from "../utils/weak-maps";
import { ElementBase } from "../base/element-base";
import { ActiveElementService } from "./active-element.service";
import { EdgeMode } from "../interfaces/attributes";
import { arrowPoints } from "../utils/arrow";
import { drawRoundRectangle } from "../utils/rectangle";
import { cancelEditText, renderRichtext } from "../utils/foreign-object";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Paper, setElement } from "../interfaces/paper";

@Component({
    selector: 'pla-element',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElementComponent extends ElementBase implements OnInit, AfterViewInit, OnDestroy, OnChanges {
    @Input() element!: Element;

    @Input() rs: RoughSVG | undefined;

    @Input() selection: Selection | undefined;

    @Input() paper: Paper | undefined;

    arrowDOMElements: SVGElement[] = [];

    activeElementService: ActiveElementService | undefined;

    destroy$: Subject<any> = new Subject();

    constructor(private elementRef: ElementRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef) {
        super();
    }

    ngOnInit(): void {
        if (this.element.type === ElementType.curve) {
            this.svgGElement = this.rs?.curve(this.element.points, { stroke: this.element.color, strokeWidth: this.element.strokeWidth });
            this.elementRef.nativeElement.parentElement.appendChild(this.svgGElement);
        } else if (this.element.type === ElementType.rectangle) {
            const start = this.element.points[0];
            const end = this.element.points[1];
            if (this.element.edgeMode === EdgeMode.round) {
                this.svgGElement = drawRoundRectangle(start, end, this.rs as any, { stroke: this.element.color, strokeWidth: this.element.strokeWidth } as any);
            } else {
                this.svgGElement = this.rs?.rectangle(start[0], start[1], end[0] - start[0], end[1] - start[1], { stroke: this.element.color, strokeWidth: this.element.strokeWidth });
            }
            this.elementRef.nativeElement.parentElement.appendChild(this.svgGElement);
        } else if (this.element.type === ElementType.line) {
            if (this.element.edgeMode === EdgeMode.sharp || !this.element.edgeMode) {
                this.svgGElement = this.rs?.linearPath(this.element.points, { stroke: this.element.color, strokeWidth: this.element.strokeWidth });
            }
            if (this.element.edgeMode === EdgeMode.round) {
                this.svgGElement = this.rs?.curve(this.element.points, { stroke: this.element.color, strokeWidth: this.element.strokeWidth });
            }
            this.elementRef.nativeElement.parentElement.appendChild(this.svgGElement);
        } else if (this.element.type === ElementType.arrow) {
            const { pointLeft, pointRight } = arrowPoints(this.element.points[this.element.points.length - 2], this.element.points[this.element.points.length - 1]);
            if (this.element.edgeMode === EdgeMode.sharp || !this.element.edgeMode) {
                const line = this.rs?.linearPath(this.element.points, { stroke: this.element.color, strokeWidth: this.element.strokeWidth }) as SVGAElement;
                this.arrowDOMElements.push(line);
            } else {
                const curve = this.rs?.curve(this.element.points, { stroke: this.element.color, strokeWidth: this.element.strokeWidth }) as SVGAElement;
                this.arrowDOMElements.push(curve);
            }
            const arrowLineLeft = this.rs?.linearPath([pointLeft, this.element.points[this.element.points.length - 1]], { stroke: this.element.color, strokeWidth: this.element.strokeWidth }) as SVGElement;
            this.arrowDOMElements.push(arrowLineLeft);
            const arrowLineRight = this.rs?.linearPath([pointRight, this.element.points[this.element.points.length - 1]], { stroke: this.element.color, strokeWidth: this.element.strokeWidth }) as SVGElement;
            this.arrowDOMElements.push(arrowLineRight);
            this.arrowDOMElements.forEach((dom) => {
                this.elementRef.nativeElement.parentElement.appendChild(dom);
            });
        } else if (this.element.type === ElementType.text) {
            const { richtextComponentRef, g } = renderRichtext(this.element, this.componentFactoryResolver, this.viewContainerRef, false);
            this.richtextComponentRef = richtextComponentRef;
            this.svgGElement = g;
            this.elementRef.nativeElement.parentElement.appendChild(this.svgGElement);
        }
        else if (this.element.type === ElementType.circle) {
            const [start, realEnd] = this.element.points;
            const width = Math.abs(realEnd[0] - start[0]);
            let height = Math.abs(realEnd[1] - start[1]);
            const centerPoint = [realEnd[0] > start[0] ? realEnd[0] - width / 2 : realEnd[0] + width / 2, realEnd[1] > start[1] ? realEnd[1] - height / 2 : realEnd[1] + height / 2];
            this.svgGElement = this.rs?.ellipse(centerPoint[0], centerPoint[1], width, height, { stroke: this.element.color, strokeWidth: this.element.strokeWidth });
            this.elementRef.nativeElement.parentElement.appendChild(this.svgGElement);
        }
        this.activeElementService = new ActiveElementService(this.rs as RoughSVG, this.elementRef.nativeElement.parentElement, this.element, this.selection as Selection);
    }

    ngAfterViewInit(): void {
        if (this.richtextComponentRef && this.richtextComponentRef.instance) {
            this.richtextComponentRef.instance.blur.asObservable().pipe(takeUntil(this.destroy$)).subscribe((event: FocusEvent) => {
                if (this.richtextComponentRef && this.richtextComponentRef?.instance) {
                    this.richtextComponentRef.instance.readonly = true;
                    this.richtextComponentRef.changeDetectorRef.markForCheck();
                    IS_TEXT_EDITABLE.set(this.paper as Paper, false);
                    cancelEditText(this.g);
                }
            });
            this.richtextComponentRef.instance.valueChange.asObservable().pipe(takeUntil(this.destroy$)).subscribe((event: any) => {
                if (this.richtextComponentRef && this.richtextComponentRef?.instance) {
                    // 更新宽度
                    const foreignObject = this.svgGElement?.querySelector('plait-richtext');
                    if (foreignObject) {
                        const { width, height } = foreignObject.getBoundingClientRect();
                        const points = this.element.points;
                        points[1] = [points[0][0] + width, points[0][1] + height];
                        setElement(this.paper as Paper, this.element, { points: [...points], richtext: event })
                    }
                }
            });
            this.richtextComponentRef.instance.compositionStartHandle.asObservable().pipe(takeUntil(this.destroy$)).subscribe((event: any) => {
                if (this.richtextComponentRef && this.richtextComponentRef?.instance) {
                    // 更新宽度
                    const foreignObject = this.svgGElement?.querySelector('plait-richtext');
                    if (foreignObject) {
                        const { width, height } = foreignObject.getBoundingClientRect();
                        const points = this.element.points;
                        points[1] = [points[0][0] + width + 15, points[0][1] + height];
                        setElement(this.paper as Paper, this.element, { points: [...points] })
                    }
                }
            });
        }
    }

    hidden() {
        if (this.svgGElement) {
            this.svgGElement.classList.add('hidden');
        }
        if (this.activeElementService) {
            this.activeElementService.hiddenActiveRectangle();
        }
    }

    show() {
        if (this.svgGElement) {
            this.svgGElement.classList.remove('hidden');
        }
        this.activeElementService?.showActiveRectangle();
    }

    ngOnChanges(changes: SimpleChanges): void {
        const elementChange = changes['element'];
        if (elementChange) {
            ELEMENT_TO_COMPONENTS.set(this.element, this);
        }
        this.activeElementService?.update(this.element, this.selection as Selection);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.svgGElement?.remove();
        this.activeElementService?.removeActiveRectangle();
        this.arrowDOMElements.forEach((dom) => {
            dom.remove();
        })
    }
}
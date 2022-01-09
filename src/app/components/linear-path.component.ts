import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit } from "@angular/core";
import { Point } from "roughjs/bin/geometry";
import { RoughSVG } from "roughjs/bin/svg";

@Component({
    selector: 'linear-path',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinearPathComponent implements OnInit, OnDestroy {
    @Input() points!: Point[];

    @Input() rc!: RoughSVG;

    svgElement!: SVGGElement;

    constructor(private element: ElementRef) {}

    ngOnInit(): void {
        this.svgElement = this.rc.linearPath(this.points);
        this.element.nativeElement.parentElement.appendChild(this.svgElement);
        this.element.nativeElement.remove();
    }

    ngOnDestroy(): void {
        this.svgElement.remove();
    }
}
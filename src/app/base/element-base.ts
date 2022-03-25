import { Directive, Input } from "@angular/core";
import { RoughSVG } from "roughjs/bin/svg";
import { Element } from "../interfaces/element";
import { Selection } from "../interfaces/selection";
import { Paper } from "../interfaces/paper";

@Directive()
export class PlaitBaseElement {
    @Input() rootSVG?: SVGElement | HTMLElement;

    @Input() roughSVG?: RoughSVG;

    @Input() element?: Element;

    @Input() selection?: Selection;

    @Input() paper?: Paper;

    hostSVGG: SVGGElement[];

    constructor() {
        this.hostSVGG = [];
    }
}
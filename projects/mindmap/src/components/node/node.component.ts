import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { RoughSVG } from "roughjs/bin/svg";
import { MindmapNode } from "../../interface/node";

@Component({
    selector: 'plait-mindmap-node',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MindmapNodeComponent implements OnInit {
    selected = false;

    @Input()
    node?: MindmapNode;

    @Input() rootSVG?: SVGElement;

    @Input() roughSVG?: RoughSVG;

    ngOnInit(): void {
        
    }
}
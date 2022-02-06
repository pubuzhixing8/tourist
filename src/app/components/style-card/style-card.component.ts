import { Attribute, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Paper } from "../../interfaces/paper";
import { Attributes } from "../../interfaces/attributes";
import { PointerType } from "../../interfaces/pointer";

@Component({
    selector: 'style-card',
    templateUrl: 'style-card.component.html'
})
export class StyleCardComponent implements OnInit {
    @Input()
    attributes: Attributes | undefined;

    @Input()
    paper: Paper | undefined;

    pointerType = PointerType;

    @Output()
    attributesChange: EventEmitter<Attributes> = new EventEmitter<Attributes>();

    colorList = ['#000000', '#343a40', '#495057', '#c92a2a', '#862e9c', '#e67700'];

    strokeWidthList = [{
        name: '细',
        value: 2
    }, {
        name: '粗',
        value: 4
    }, {
        name: '特粗',
        value: 6
    }];

    edgeModeList = [{
        name: '尖锐',
        value: 'sharp'
    }, {
        name: '圆润',
        value: 'round'
    }];

    constructor() { }

    ngOnInit(): void {
    }

    colorSelect(event: MouseEvent, color: string) {
        event.preventDefault();
        if (this.attributes) {
            this.attributes.color = color;
        }
        this.attributesChange.emit(this.attributes);
    }

    valueChange(event: any, item: any) {
        if (this.attributes) {
            if (this.strokeWidthList.includes(item)) {
                this.attributes.strokeWidth = item.value;
            }
            if (this.edgeModeList.includes(item)) {
                this.attributes.edgeMode = item.value;
            }
        }
        this.attributesChange.emit(this.attributes);
    }
}
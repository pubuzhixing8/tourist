import { Attribute, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Paper } from "../../interfaces/paper";
import { Attributes } from "../../interfaces/attributes";

@Component({
    selector: 'style-card',
    templateUrl: 'style-card.component.html'
})
export class StyleCardComponent implements OnInit {
    @Input()
    attributes: Attributes | undefined;

    @Input()
    paper: Paper | undefined;

    @Output()
    attributesChange: EventEmitter<Attributes> = new EventEmitter<Attributes>();

    colorList = ['#000000', '#343a40', '#495057', '#c92a2a', '#862e9c', '#e67700'];
    constructor() {}

    ngOnInit(): void {
        
    }

    colorSelect(event: MouseEvent, color: string) {
        event.preventDefault();
        if (this.attributes) {
            this.attributes.color = color;
        }
        this.attributesChange.emit(this.attributes);
    }
}
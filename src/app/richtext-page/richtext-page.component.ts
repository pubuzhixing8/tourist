import { Component, OnInit } from '@angular/core';
import { OnChangeEvent } from 'richtext/interface/event';

@Component({
    selector: 'richtext-page',
    templateUrl: './richtext-page.component.html'
})
export class RichtextPageComponent implements OnInit {
    value = {
        children: [{ text: '富文本' }]
    };
    ngOnInit(): void {}

    onChange(event: OnChangeEvent) {
        console.log(event);
    }
}

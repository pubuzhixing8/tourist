import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'richtext-page',
    templateUrl: './richtext-page.component.html'
})
export class RichtextPageComponent implements OnInit {
    value = {
        children: [
            { text: '富文本' }
        ]
    };
    ngOnInit(): void {

    }
}

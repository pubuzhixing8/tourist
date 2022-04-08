import { Component, OnInit } from '@angular/core';

export const LOCALSTORAGE_PAPER_DATA_KEY = 'paper-data';

@Component({
    selector: 'mindmap-page',
    templateUrl: './page.component.html'
})
export class MindmapPageComponent implements OnInit {

    ngOnInit(): void {
    }

}
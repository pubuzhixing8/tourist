import { Component, OnInit } from '@angular/core';
import { withMindmap } from 'mindmap/plugins/with-mindmap';
import { PlaitElement } from 'plait/interfaces/element';
import { mockMindmapData } from '../mock/mindmap-data';

@Component({
    selector: 'basic-board',
    template: `
        <plait-board [plugins]="plugins" [value]="value"></plait-board>
    `
})
export class BasicBoardComponent implements OnInit {
    plugins = [withMindmap];

    value: PlaitElement[] = [mockMindmapData];

    ngOnInit(): void {}
}

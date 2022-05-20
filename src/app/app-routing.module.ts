import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasicMindmapComponent } from './mindmap/mindmap.component';
import { RichtextPageComponent } from './richtext-page/richtext-page.component';
import { PlaitWhiteBoardComponent } from './white-board/white-board.component';

const routes: Routes = [
    {
        path: '',
        component: PlaitWhiteBoardComponent
    },
    {
        path: 'white-board',
        component: PlaitWhiteBoardComponent
    },
    {
        path: 'mindmap',
        component: BasicMindmapComponent
    },
    {
        path: 'richtext',
        component: RichtextPageComponent
    }
];
@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: false,
            relativeLinkResolution: 'legacy'
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}

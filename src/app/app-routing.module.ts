import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MindmapPageComponent } from './mindmap-page/page.component';
import { PlaitWhiteBoardComponent } from './white-board/white-board.component';

const routes: Routes = [
    {
        path: '',
        component: PlaitWhiteBoardComponent
    },
    {
        path: 'mindmap',
        component: MindmapPageComponent
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

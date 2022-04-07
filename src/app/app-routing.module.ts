import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlaitMinMapComponent } from './mind-map/mind-map.component';
import { PlaitWhiteBoardComponent } from './white-board/white-board.component';

const routes: Routes = [
    {
        path: '',
        component: PlaitWhiteBoardComponent
    },
    {
        path: 'mind-map',
        component: PlaitMinMapComponent
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

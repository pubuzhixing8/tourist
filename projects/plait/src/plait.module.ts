import { NgModule } from '@angular/core';
import { PlaitBoardComponent } from './board/board.component';
import { PlaitElementComponent } from './core/element/element.component';

@NgModule({
  declarations: [
    PlaitBoardComponent,
    PlaitElementComponent
  ],
  imports: [
  ],
  exports: [
    PlaitBoardComponent,
    PlaitElementComponent
  ]
})
export class PlaitModule { }

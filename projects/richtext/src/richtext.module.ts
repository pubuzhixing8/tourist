import { NgModule } from '@angular/core';
import { PlaitRichtextComponent } from './richtext/richtext.component';
import { PlaitTextComponent } from './text/text.component';



@NgModule({
  declarations: [
    PlaitRichtextComponent,
    PlaitTextComponent
  ],
  imports: [
  ],
  exports: [
    PlaitRichtextComponent,
    PlaitTextComponent
  ]
})
export class RichtextModule { }

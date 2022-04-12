import { NgModule } from '@angular/core';
import { RichtextModule } from 'richtext';
import { PlaitMindmapComponent } from './mindmap.component';



@NgModule({
  declarations: [
    PlaitMindmapComponent
  ],
  imports: [
    RichtextModule
  ],
  exports: [
    PlaitMindmapComponent
  ]
})
export class MindmapModule { }

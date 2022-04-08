import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MindmapModule } from 'mindmap';
import { RichtextModule } from 'richtext/richtext.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlaitElementComponent } from './components/element.component';
import { StyleCardComponent } from './components/style-card/style-card.component';
import { MindmapPageComponent } from './mindmap-page/page.component';
import { PlaitWhiteBoardComponent } from './white-board/white-board.component';

@NgModule({
  declarations: [
    AppComponent,
    PlaitElementComponent,
    PlaitWhiteBoardComponent,
    MindmapPageComponent,
    StyleCardComponent
  ],
  imports: [
    BrowserModule,
    RichtextModule,
    AppRoutingModule,
    MindmapModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RichtextModule } from 'richtext/richtext.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlaitElementComponent } from './components/element.component';
import { StyleCardComponent } from './components/style-card/style-card.component';
import { PlaitMinMapComponent } from './mind-map/mind-map.component';
import { PlaitWhiteBoardComponent } from './white-board/white-board.component';

@NgModule({
  declarations: [
    AppComponent,
    PlaitElementComponent,
    PlaitWhiteBoardComponent,
    PlaitMinMapComponent,
    StyleCardComponent
  ],
  imports: [
    BrowserModule,
    RichtextModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RichtextModule } from 'richtext/richtext.module';
import { AppComponent } from './app.component';
import { PlaitElementComponent } from './components/element.component';
import { StyleCardComponent } from './components/style-card/style-card.component';

@NgModule({
  declarations: [
    AppComponent,
    PlaitElementComponent,
    StyleCardComponent
  ],
  imports: [
    BrowserModule,
    RichtextModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

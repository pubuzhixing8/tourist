import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LinearPathComponent } from './components/linear-path.component';
import { StyleCardComponent } from './components/style-card/style-card.component';

@NgModule({
  declarations: [
    AppComponent,
    LinearPathComponent,
    StyleCardComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

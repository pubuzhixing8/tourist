import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CurveComponent } from './components/curve.component';
import { StyleCardComponent } from './components/style-card/style-card.component';

@NgModule({
  declarations: [
    AppComponent,
    CurveComponent,
    StyleCardComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MindmapModule } from 'mindmap';
import { PlaitModule } from 'plait';
import { RichtextModule } from 'richtext/richtext.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlaitElementComponent } from './components/element.component';
import { StyleCardComponent } from './components/style-card/style-card.component';
import { BasicBoardComponent } from './board/board.component';
import { RichtextPageComponent } from './richtext-page/richtext-page.component';
import { PlaitWhiteBoardComponent } from './white-board/white-board.component';

@NgModule({
    declarations: [
        AppComponent,
        PlaitElementComponent,
        PlaitWhiteBoardComponent,
        StyleCardComponent,
        RichtextPageComponent,
        BasicBoardComponent
    ],
    imports: [BrowserModule, RichtextModule, AppRoutingModule, MindmapModule, PlaitModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}

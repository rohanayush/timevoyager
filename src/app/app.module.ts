import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { TimelineComponent } from './timeline/timeline.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { EventDetailsComponent } from './event-details/event-details.component';
import { EventCardComponent } from './event-card/event-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchFilterComponent } from './search-filter/search-filter.component';
import {MatButtonModule} from '@angular/material/button';
@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    EventDetailsComponent,
    EventCardComponent,
    SearchFilterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    MatButtonModule
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}

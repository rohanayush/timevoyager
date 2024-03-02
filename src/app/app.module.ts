import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { TimelineComponent } from './timeline/timeline.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SliderComponent } from './slider/slider.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { EventCardComponent } from './event-card/event-card.component';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent,
    TimelineComponent,
    SliderComponent,
    EventDetailsComponent,
    EventCardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    MatSliderModule,
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}

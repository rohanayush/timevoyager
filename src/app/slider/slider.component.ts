import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
})
export class SliderComponent {
  @Input() events: string[] | undefined;
  event:any;
  constructor() {}

  
 ngOnInit(){
  console.log("got milestone events as:",this.events)
  this.event = ['14th Century', '1776', '1989']

 }
  
 onSliderChange(event: any, events: any): void {
  const sliderValue = event.value;
  const selectedEvent = events[sliderValue];
  console.log(selectedEvent);
  // You can use selectedEvent to perform any actions based on the selected event
}
}

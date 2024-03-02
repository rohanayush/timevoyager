import { Component } from '@angular/core';
import { EventDataService } from '../event-data.service';
import { EventsStruc } from '../model/events';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent {
  // events: any[] = []; // Assuming events data is fetched and stored here
  selectedEvent: number | undefined;
  events: EventsStruc[] = [];
  lenEvents: number = 0;
  counter: number = 0;
  timer: any;
  lineColor: string = 'grey'; 
  blueDotIndex: number | null = null;

  formatLabel(value: number): string {
    console.log('values', value);
    const storedEvents = JSON.parse(
      localStorage.getItem('events') || '[]'
    ) as EventsStruc[];

    console.log(storedEvents);
    // const result = this.alternateMethod();
    if (value > 0) {
      localStorage.setItem(
        'selectedEvent',
        JSON.stringify(storedEvents[value - 1].id)
      );
      localStorage.setItem('counter', JSON.stringify(value));

      return storedEvents[value - 1].date;
    }
    return `Start`;
  }

  alternateMethod() {
    console.log('events', this.events);
  }

  constructor(private eventService: EventDataService) {
    this.eventService.watchLocalStorage().subscribe((localStorage) => {
      // Handle localStorage changes here
      const selectedEventId = JSON.parse(localStorage.getItem('selectedEvent'));
      console.log('selectedEvent changed:', selectedEventId);
      // You can perform further actions based on the selectedEventId
    });
  }
 
  ngOnDestroy() {
    clearInterval(this.timer);
  }

  highlightLine(index: number): void {
    // Set the index of the first dot clicked
    this.blueDotIndex = this.blueDotIndex !== index ? index : null;
  }

  isBlueDot(index: number): boolean {
    // Determine if a dot should be blue
    return this.blueDotIndex !== null && index <= this.blueDotIndex;
  }
  
}

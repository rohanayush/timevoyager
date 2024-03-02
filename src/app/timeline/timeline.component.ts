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

  ngOnInit(): void {
    this.counter = Number(localStorage.getItem('counter'));

    this.eventService.getEvents().subscribe((data: any) => {
      this.events = data;
    });
    this.timer = setInterval(() => {
      this.checkForChanges
      console.log(this.counter)
    }, 1000);

    localStorage.setItem('events', JSON.stringify(this.events));
    this.lenEvents = this.events.length;
    this.selectedEvent = Number(localStorage.getItem('selectedEvent'));
  }
  checkForChanges(): void {
    // Retrieve the current value of counter from localStorage
    const storedCounter = parseInt(localStorage.getItem('counter') || '0', 10);

    // Compare the current value with the stored value
    if (this.counter !== storedCounter) {
      // Update the local variable if there's a change
      this.counter = storedCounter;
      console.log('Counter changed:', this.counter);
      // You can perform further actions based on the changed value here
    }
  }
  ngOnDestroy() {
    clearInterval(this.timer);
  }
}

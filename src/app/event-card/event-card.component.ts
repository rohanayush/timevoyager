import { Component, Input } from '@angular/core';
import { EventDataService } from '../event-data.service';
import { EventsStruc } from '../model/events';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
})
export class EventCardComponent {
  constructor(private eventsService: EventDataService) {}
  event: EventsStruc | undefined;
  @Input() eventId: number | undefined;

  ngOnInit() {
    if (this.eventId) {
      this.eventsService.getEventById(this.eventId).subscribe((data: any) => {
        this.event = data;
        console.log(`got event for ${this.eventId}:`,this.event)
      });
    }
  }
}

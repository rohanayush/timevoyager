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
  @Input()  event: any| undefined;

  ngOnInit() {
    
  }
}

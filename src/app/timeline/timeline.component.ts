import { Component } from '@angular/core';
import { EventDataService } from '../event-data.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent {
  events: any[] = []; // Assuming events data is fetched and stored here
  timelineWidth: number | undefined; // Width of the timeline
  milestone:string[] =[];
 
  constructor(private eventService:EventDataService) {}

  ngOnInit(): void {
    this.timelineWidth = this.events.length * 150; // Adjust width as needed
    this.events = this.eventService.getEvents();
    console.log("events:",this.events);
    this.events.forEach(
      (data:any)=>{
        this.milestone.push(data.date)
      }
    );
    
    
  }
}

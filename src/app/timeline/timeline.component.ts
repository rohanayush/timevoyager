import { Component, OnInit, HostListener } from '@angular/core';
import { EventDataService } from '../event-data.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {
  events: any[] | undefined;
  timelineWidth: number = 0;
  zoomLevel: number = 1;

  constructor(private eventService: EventDataService) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe((events) => {
      this.events = events;
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.calculateTimelineWidth();
  }

  calculateTimelineWidth() {
    if (this.events && this.events.length > 0) {
      // Calculate timeline width based on the number of events
      // This can be adjusted based on your design requirements
      const eventCardWidth = 300; // Adjust this value according to your design
      this.timelineWidth = this.events.length * eventCardWidth;
    } else {
      this.timelineWidth = 0;
    }
  }

  onTimelineScroll(event: any) {
    if (event) {
      // Handle horizontal scrolling of the timeline
      // You can adjust the scrolling speed according to your design
      const scrollSpeed = 30;
      const delta = Math.max(-1, Math.min(1, event.deltaY || -event.detail));
      const timelineElement = document.querySelector('.timeline');
      if (timelineElement) {
        timelineElement.scrollLeft += delta * scrollSpeed;
      }
    }
  }

  showEventDetails(event: any) {
    // Implement this method to show event details popup

    // Center the clicked card within the timeline
    if (this.events) {
      var cardIndex = this.events.findIndex((e) => e.id === event.id);

      if (cardIndex !== -1) {
        const cardWidth = 300; // Adjust this value according to your design
        const timelineElement = document.querySelector('.timeline');
        if (timelineElement) {
          const timelineWidth = timelineElement.clientWidth;
          const scrollLeft =
            cardIndex * cardWidth - timelineWidth / 2 + cardWidth / 2;
          timelineElement.scrollLeft = scrollLeft;
        }
      }
    }
  }
  zoomIn() {
    // Increase zoom level and recalculate timeline width
    this.zoomLevel += 0.1;
    this.calculateTimelineWidth();
  }

  zoomOut() {
    // Decrease zoom level and recalculate timeline width
    if (this.zoomLevel > 0.1) {
      this.zoomLevel -= 0.1;
      this.calculateTimelineWidth();
    }
  }
}

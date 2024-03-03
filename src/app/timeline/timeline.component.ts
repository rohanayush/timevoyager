import { Component, OnInit, HostListener, Input } from '@angular/core';
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
  timelineData: any[] = [];
  @Input() value: any[] = [];
  constructor(private eventService: EventDataService) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe((events) => {
      this.events = events;
      this.timelineData = this.events.map((event, index) => {
        return {
          date: event.date, // Set content as date for first event, otherwise use title
          dot: index === 0 ? 'Y' : 'N', // Set dot as 'Y' for first event, 'N' for others
          line: 'N', // Set line as 'N' for all events
        };
      });
      console.log('timeline', this.timelineData);
    });
    this.events = [
      { content: 'Ordered', dot: 'Y', line: 'N' },
      { content: 'Processing' },
      { content: 'Shipped' },
      { content: 'Delivered' },
    ];
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

  toggleStatus(index: any): void {
    console.log('event', index);
    if (this.timelineData) {
      // const index = this.timelineData?.findIndex(
      //   (item) => item.content === event.content
      // );
      console.log('Got index:', index);
      if (index !== -1 && index > 0) {
        this.timelineData[0]['dot'] = 'N';

        this.timelineData[index - 1].line = 'Y';
        this.timelineData[index].dot = 'Y';

        // make every index behind it to have dots be 'N'
        for (let i = 1; i < this.timelineData.length; i++) {
          if (i < index) {
            this.timelineData[i]['dot'] = 'N';
            this.timelineData[i - 1]['line'] = 'Y';
          } else if (i > index) {
            this.timelineData[i]['dot'] = 'N';
            this.timelineData[i - 1]['line'] = 'N';
          }
        }
      } else if (index == 0) {
        this.timelineData[0]['dot'] = 'Y';
        this.timelineData[0]['line'] = 'N';
        for (let i = 1; i < this.timelineData.length; i++) {
          this.timelineData[i]['dot'] = 'N';
          this.timelineData[i]['line'] = 'N';
        }
      }
      const a = this.timelineData;
      console.log(a);
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

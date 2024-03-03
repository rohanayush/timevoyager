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
  @Input() value: any[] = [];
  constructor(private eventService: EventDataService) {}

  ngOnInit(): void {
    // this.eventService.getEvents().subscribe((events) => {
    //   this.events = events;
    // });
    this.events = [
      { content: 'Ordered', date: '15/02/201 10:30', dot:'Y',line:'N' },
      { content: 'Processing', date: '15/02/201 14:00', },
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

  toggleStatus(event: any): void {
    console.log("event",event)
    if (this.events) {
      const index = this.events?.findIndex(
        (item) => item.content === event.content
      );
      console.log("Got index:",index)
      if (index !== -1 && index > 0) {
        this.events[0]['dot']= 'N';
        this.events[index-1].line='Y';
        this.events[index].dot='Y';
        // make every index behind it to have dots be 'N'
        for(let i = 1; i < this.events.length; i++){
          
          if(i < index){
            this.events[i]['dot']= 'N';
            this.events[i-1]['line']= 'Y';

          }
          else if(i > index){
            this.events[i]['dot']= 'N';
            this.events[i-1]['line']= 'N';
          }
          
        }
        const a= this.events;
          console.log(a)
      }
      else if(index == 0){
        this.events[0]['dot']= 'Y';
        this.events[0]['line']= 'N';
          for(let i = 1; i < this.events.length; i++){
            this.events[i]['dot']= 'N';
            this.events[i]['line']= 'N';
          }
      }
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

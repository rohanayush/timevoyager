import { Component, OnInit, HostListener, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { EventDataService } from '../event-data.service';
import { fromEvent, filter, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit{
  events: any[] | undefined;
  timelineWidth: number = 0;
  zoomLevel: number = 1;
  timelineData: any[] = [];
  @Input() value: any[] = [];

  @ViewChild('scrollable') scrollable!: ElementRef<HTMLDivElement>;
  @ViewChild('zoomable') zoomable!: ElementRef<HTMLElement>;


  scale = 1;
  mouseHasMoved = true;
  mousePositionRelative: any;
  elementUnderMouse: any;



 
  
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
    document.addEventListener('DOMContentLoaded', () => {
      this.initZoomable();
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
 
  // scrolling
  mouseDown = false;
  initialGrabPosition = 0;
  initialScrollPosition = 0;

  onMouseDown(event: MouseEvent) {
    this.mouseDown = true;
    this.scrollable.nativeElement.style.cursor = 'grabbing';
    this.initialGrabPosition = event.clientX;
    this.initialScrollPosition = this.scrollable.nativeElement.scrollLeft;
  }

  onMouseUp() {
    this.mouseDown = false;
    this.scrollable.nativeElement.style.cursor = 'grab';
  }

  onMouseMove(event: MouseEvent) {
    if (this.mouseDown) {
      const mouseMovementDistance = event.clientX - this.initialGrabPosition;
      this.scrollable.nativeElement.scrollLeft = this.initialScrollPosition - mouseMovementDistance;
    }
  }
  



  //zooming
 

  initZoomable(): void {
    const zoomable = this.zoomable.nativeElement;
    const containerElement = this.scrollable.nativeElement;

    zoomable.addEventListener('mousemove', () => {
      this.mouseHasMoved = true;
    });

    zoomable.addEventListener('wheel', (wheelEvent) => {
      if (this.isVerticalScrolling(wheelEvent)) {
        wheelEvent.preventDefault();

        this.scale = this.computeScale(this.scale, wheelEvent.deltaY);
        zoomable.style.width = this.scale * 100 + '%';

        if (this.mouseHasMoved) {
          this.elementUnderMouse = this.findElementUnderMouse(wheelEvent.clientX);
          this.mousePositionRelative = (wheelEvent.clientX - this.getLeft(this.elementUnderMouse)) / this.getWidth(this.elementUnderMouse);
          this.mouseHasMoved = false;
        }

        const mousePosition = wheelEvent.clientX;
        const elementUnderMouseLeft = this.getLeft(this.elementUnderMouse);
        const zoomableLeft = this.getLeft(zoomable);
        const containerLeft = this.getLeft(containerElement);
        const moveAfterZoom = this.getWidth(this.elementUnderMouse) * this.mousePositionRelative;

        containerElement.scrollLeft = Math.round(elementUnderMouseLeft - zoomableLeft - mousePosition + containerLeft + moveAfterZoom);
      }
    });
  }

  isVerticalScrolling(wheelEvent: WheelEvent): boolean {
    const deltaX = Math.abs(wheelEvent.deltaX);
    const deltaY = Math.abs(wheelEvent.deltaY);
    return deltaY > deltaX;
  }

  computeScale(currentScale: number, wheelDelta: number): number {
    const newScale = currentScale - wheelDelta * 0.005;
    return Math.max(1, newScale);
  }

  findElementUnderMouse(mousePosition: number): HTMLElement {
    const zoomable = this.zoomable.nativeElement;
    const children = Array.from(zoomable.children) as HTMLElement[];
  
    for (const childElement of children) {
      const childRect = childElement.getBoundingClientRect();
  
      if (childRect.left <= mousePosition && childRect.right >= mousePosition) {
        return childElement;
      }
    }
  
    return zoomable;
  }
  

  getLeft(element: HTMLElement): number {
    return (element as HTMLElement).getBoundingClientRect().left;
  }

  getWidth(element: HTMLElement): number {
    return (element as HTMLElement).getBoundingClientRect().width;
  }

  
}

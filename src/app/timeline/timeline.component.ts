import {
  Component,
  OnInit,
  HostListener,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Renderer2,
} from '@angular/core';
import { EventDataService } from '../event-data.service';
import { fromEvent, filter, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, AfterViewInit {
  events: any[] | undefined;
  timelineWidth: number = 0;
  zoomLevel: number = 1;
  timelineData: any[] = [];
  @Input() value: any[] = [];

  @ViewChild('scrollable') scrollable!: ElementRef<HTMLDivElement>;
  @ViewChild('zoomable') zoomable!: ElementRef<HTMLElement>;
  @ViewChild('cardsZoom') cardsZoom!: ElementRef<HTMLElement>;

  mouseMoveListener: Function | undefined;
  mouseUpListener: Function | undefined;

  scale = 1;
  mouseHasMoved = true;
  mousePositionRelative: any;
  elementUnderMouse: any;
  selectedEvent: any;
  isPopupOpen: boolean | undefined;

  constructor(
    private eventService: EventDataService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe((events) => {
      this.events = events;
    });
    document.addEventListener('DOMContentLoaded', () => {
      this.initZoomable();
    });
  }

  ngAfterViewInit(): void {
    this.initScrollable();
  }

  // toggleStatus(index: any): void {
  //   console.log('event', index);
  //   if (this.timelineData) {
  //     console.log('Got index:', index);
  //     if (index !== -1 && index > 0) {
  //       this.timelineData[0]['dot'] = 'N';

  //       this.timelineData[index - 1].line = 'Y';
  //       this.timelineData[index].dot = 'Y';

  //       // make every index behind it to have dots be 'N'
  //       for (let i = 1; i < this.timelineData.length; i++) {
  //         if (i < index) {
  //           this.timelineData[i]['dot'] = 'N';
  //           this.timelineData[i - 1]['line'] = 'Y';
  //         } else if (i > index) {
  //           this.timelineData[i]['dot'] = 'N';
  //           this.timelineData[i - 1]['line'] = 'N';
  //         }
  //       }
  //     } else if (index == 0) {
  //       this.timelineData[0]['dot'] = 'Y';
  //       this.timelineData[0]['line'] = 'N';
  //       for (let i = 1; i < this.timelineData.length; i++) {
  //         this.timelineData[i]['dot'] = 'N';
  //         this.timelineData[i]['line'] = 'N';
  //       }
  //     }
  //     const a = this.timelineData;
  //     console.log(a);
  //   }
  // }
  toggleStatus(index: number): void {
    // Open the popup modal

    this.isPopupOpen = true;
    // Set the selected event
    if (this.events) {
      this.selectedEvent = this.events[index];
      console.log("selectedEvent",this.selectedEvent)
    }
  }

  closePopup(): void {
    // Close the popup modal
    this.isPopupOpen = false;
  }

  mouseDown = false;
  initialGrabPosition = 0;
  initialScrollPosition = 0;

  // new scrolling
  initScrollable(): void {
    const scrollableElement = this.scrollable.nativeElement;
  
    this.renderer.listen(scrollableElement, 'mousedown', (mouseEvent) => {
      // Check if left mouse button is pressed
      if (mouseEvent.button === 0) {
        this.onMouseDown(mouseEvent);
      }
    });
  }
  
  onMouseDown(event: MouseEvent): void {
    const scrollableElement = this.scrollable.nativeElement;
    this.renderer.setStyle(scrollableElement, 'cursor', 'grabbing');
  
    const initialGrabPosition = event.clientX;
    const initialScrollPosition = scrollableElement.scrollLeft;
  
    // Attach mousemove event listener only when left mouse button is pressed
    const mouseMoveListener = this.renderer.listen(scrollableElement, 'mousemove', (mouseMoveEvent) => {
      const mouseMovementDistance = mouseMoveEvent.clientX - initialGrabPosition;
      scrollableElement.scrollLeft = initialScrollPosition - mouseMovementDistance;
    });
  
    // Detach mousemove event listener when mouse button is released
    const mouseUpListener = this.renderer.listen(document, 'mouseup', () => {
      this.onMouseUp(mouseMoveListener, mouseUpListener);
    });
  }
  
  onMouseUp(mouseMoveListener: Function, mouseUpListener: Function): void {
    const scrollableElement = this.scrollable.nativeElement;
    this.renderer.setStyle(scrollableElement, 'cursor', 'grab');
  
    // Remove mousemove listener
    if (mouseMoveListener) {
      mouseMoveListener();
    }
  
    // Remove mouseup listener
    if (mouseUpListener) {
      mouseUpListener();
    }
  }
  

  //zooming

  initZoomable(): void {
    const zoomable = this.zoomable.nativeElement;
    const containerElement = this.scrollable.nativeElement;
    const cardsZoom = this.cardsZoom.nativeElement;

    zoomable.addEventListener('mousemove', () => {
      this.mouseHasMoved = true;
    });

    zoomable.addEventListener('wheel', (wheelEvent) => {
      if (this.isVerticalScrolling(wheelEvent)) {
        wheelEvent.preventDefault();

        this.scale = this.computeScale(this.scale, wheelEvent.deltaY);
        zoomable.style.width = this.scale * 100 + '%';

        if (this.mouseHasMoved) {
          this.elementUnderMouse = this.findElementUnderMouse(
            wheelEvent.clientX
          );
          this.mousePositionRelative =
            (wheelEvent.clientX - this.getLeft(this.elementUnderMouse)) /
            this.getWidth(this.elementUnderMouse);
          this.mouseHasMoved = false;
        }

        const mousePosition = wheelEvent.clientX;
        const elementUnderMouseLeft = this.getLeft(this.elementUnderMouse);
        const zoomableLeft = this.getLeft(zoomable);
        const containerLeft = this.getLeft(containerElement);
        const moveAfterZoom =
          this.getWidth(this.elementUnderMouse) * this.mousePositionRelative;

        containerElement.scrollLeft = Math.round(
          elementUnderMouseLeft -
            zoomableLeft -
            mousePosition +
            containerLeft +
            moveAfterZoom
        );
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

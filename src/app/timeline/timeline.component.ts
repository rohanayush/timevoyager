import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Renderer2,
} from '@angular/core';
import { EventDataService } from '../event-data.service';

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

  mouseDown = false;
  initialGrabPosition = 0;
  initialScrollPosition = 0;

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

  toggleStatus(index: number): void {
    this.isPopupOpen = true;
    if (this.events) {
      this.selectedEvent = this.events[index];
    }
  }

  closePopup(): void {
    this.isPopupOpen = false;
  }

  

  // scrolling
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
  
    const mouseMoveListener = this.renderer.listen(scrollableElement, 'mousemove', (mouseMoveEvent) => {
      const mouseMovementDistance = mouseMoveEvent.clientX - initialGrabPosition;
      scrollableElement.scrollLeft = initialScrollPosition - mouseMovementDistance;
    });
  
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

  // search
  onSearch(searchTerm: string) {
    this.eventService.searchEvents(searchTerm).subscribe(
      (results:any)=>{
        this.events = results;
      }
    )
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

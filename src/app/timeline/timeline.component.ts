import { Component, ElementRef, Renderer2 } from '@angular/core';
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
  lineColor: string = 'grey';
  blueDotIndex: number | null = null;

  years = [
    { date: '01/01/2005', label: '2005', selected: true },
    { date: '01/01/2007', label: '2007', selected: false },
    { date: '01/01/2011', label: '2011', selected: false },
    { date: '01/01/2012', label: '2012', selected: false },
    { date: '01/01/2013', label: '2013', selected: false },
    { date: '01/01/2014', label: '2014', selected: false },
    { date: '01/01/2015', label: '2015', selected: false },
    { date: '01/01/2016', label: '2016', selected: false },
  ];

  eventsMinDistance = 60;

  constructor(
    private eventService: EventDataService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnDestroy() {
    clearInterval(this.timer);
  }
  ngOnInit() {
    this.eventService.getEvents().subscribe(
      (data:any)=>{
        this.events = data;
      }
    );

    const timelines = document.querySelectorAll('.cd-horizontal-timeline');

    if (timelines.length > 0) {
      this.initTimeline(timelines);
    }
  }

  initTimeline(timelines: NodeListOf<Element>) {
    timelines.forEach(timeline => {
      const timelineComponents: any = {};
  
      timelineComponents.timelineWrapper = timeline.querySelector('.events-wrapper');
      if (!timelineComponents.timelineWrapper) return; // Add defensive check
  
      timelineComponents.eventsWrapper = timelineComponents.timelineWrapper.querySelector('.events');
      if (!timelineComponents.eventsWrapper) return; // Add defensive check
  
      timelineComponents.fillingLine = timelineComponents.eventsWrapper.querySelector('.filling-line');
      if (!timelineComponents.fillingLine) return; // Add defensive check
      timelineComponents.timelineEvents = timelineComponents.eventsWrapper.querySelectorAll('a');
      // timelineComponents.timelineDates = this.parseDate(timelineComponents.timelineEvents);
      timelineComponents.eventsMinLapse = this.minLapse(timelineComponents.timelineDates);
      timelineComponents.timelineNavigation = timeline.querySelector('.cd-timeline-navigation');
      timelineComponents.eventsContent = timeline.querySelector('.events-content');

      // Assign left position to the single events along the timeline
      this.setDatePosition(timelineComponents, 60);

      // Assign width to the timeline
      const timelineTotWidth = this.setTimelineWidth(timelineComponents, 60);

      // The timeline has been initialized - show it
      this.renderer.addClass(timeline, 'loaded');

      // Detect click on the next arrow
      if (timelineComponents.timelineNavigation) {
        timelineComponents.timelineNavigation.addEventListener('click', (event: Event) => {
          event.preventDefault();
          this.updateSlide(timelineComponents, timelineTotWidth, 'next');
        });
      }
      
      // Detect click on the prev arrow
      if (timelineComponents.timelineNavigation) {
        timelineComponents.timelineNavigation.addEventListener('click', (event: Event) => {
          event.preventDefault();
          this.updateSlide(timelineComponents, timelineTotWidth, 'prev');
        });
      }
      

      // Detect click on a single event - show new event content
      timelineComponents.eventsWrapper.addEventListener('click', (event: Event) => {
        event.preventDefault();
        const target = event.target as HTMLElement;
        if (target.tagName === 'A') {
          timelineComponents.timelineEvents.forEach((eventItem: HTMLElement) => {
            eventItem.classList.remove('selected');
          });
          target.classList.add('selected');
          // this.updateOlderEvents(target); commented
          this.updateFilling(target, timelineComponents.fillingLine, timelineTotWidth);
          this.updateVisibleContent(target, timelineComponents.eventsContent);
        }
      });

      // On swipe, show next/prev event content
      // timelineComponents.eventsContent.addEventListener('swipeleft', () => {
      //   const mq = this.checkMQ();
      //   if (mq === 'mobile') {
      //     this.showNewContent(timelineComponents, timelineTotWidth, 'next');
      //   }
      // });

      // timelineComponents.eventsContent.addEventListener('swiperight', () => {
      //   const mq = this.checkMQ();
      //   if (mq === 'mobile') {
      //     this.showNewContent(timelineComponents, timelineTotWidth, 'prev');
      //   }
      // });

      // Keyboard navigation
      document.addEventListener('keyup', (event: KeyboardEvent) => {
        if (event.which === 37 && this.elementInViewport(timeline)) {
          this.showNewContent(timelineComponents, timelineTotWidth, 'prev');
        } else if (event.which === 39 && this.elementInViewport(timeline)) {
          this.showNewContent(timelineComponents, timelineTotWidth, 'next');
        }
      });
    });
  }

  updateSlide(timelineComponents: any, timelineTotWidth: number, string: string) {
    // Retrieve translateX value of timelineComponents['eventsWrapper']
    const translateValue = this.getTranslateValue(timelineComponents.eventsWrapper);
    const wrapperWidth = parseInt(window.getComputedStyle(timelineComponents.timelineWrapper).getPropertyValue('width'));
    // Translate the timeline to the left('next')/right('prev') 
    if (string === 'next') {
      this.translateTimeline(timelineComponents, translateValue - wrapperWidth + 60, wrapperWidth - timelineTotWidth);
    } else {
      this.translateTimeline(timelineComponents, translateValue + wrapperWidth - 60);
    }
  }

  showNewContent(timelineComponents: any, timelineTotWidth: number, string: string) {
    // Go from one event to the next/previous one
    const visibleContent = timelineComponents.eventsContent.querySelector('.selected');
    const newContent = (string === 'next') ? visibleContent.nextElementSibling : visibleContent.previousElementSibling;

    if (newContent) { // If there's a next/prev event - show it
      const selectedDate = timelineComponents.eventsWrapper.querySelector('.selected');
      const newEvent = (string === 'next') ? selectedDate.parentElement.nextElementSibling.querySelector('a') : selectedDate.parentElement.previousElementSibling.querySelector('a');

      this.updateFilling(newEvent, timelineComponents.fillingLine, timelineTotWidth);
      this.updateVisibleContent(newEvent, timelineComponents.eventsContent);
      newEvent.classList.add('selected');
      selectedDate.classList.remove('selected');
      // this.updateOlderEvents(newEvent);
      this.updateTimelinePosition(string, newEvent, timelineComponents, timelineTotWidth);
    }
  }

  updateTimelinePosition(string: string, event: HTMLElement, timelineComponents: any, timelineTotWidth: number) {
    // Translate timeline to the left/right according to the position of the selected event
    const eventStyle = window.getComputedStyle(event);
    const eventLeft = parseInt(eventStyle.getPropertyValue('left'));
    const timelineWidth = parseInt(window.getComputedStyle(timelineComponents.timelineWrapper).getPropertyValue('width'));
    const timelineTranslate = this.getTranslateValue(timelineComponents.eventsWrapper);

    if ((string === 'next' && eventLeft > timelineWidth - timelineTranslate) || (string === 'prev' && eventLeft < -timelineTranslate)) {
      this.translateTimeline(timelineComponents, -eventLeft + timelineWidth / 2, timelineWidth - timelineTotWidth);
    }
  }

  translateTimeline(timelineComponents: any, value: number, totWidth?: number) {
    const eventsWrapper = timelineComponents.eventsWrapper;
    value = (value > 0) ? 0 : value; // Only negative translate value
    value = (!(typeof totWidth === 'undefined') && value < totWidth) ? totWidth : value; // Do not translate more than timeline width
    this.setTransformValue(eventsWrapper, 'translateX', value + 'px');
    // Update navigation arrows visibility
    this.renderer.setStyle(timelineComponents.timelineNavigation.querySelector('.prev'), 'display', (value === 0) ? 'none' : 'block');
    this.renderer.setStyle(timelineComponents.timelineNavigation.querySelector('.next'), 'display', (value === totWidth) ? 'none' : 'block');
  }

  updateFilling(selectedEvent: HTMLElement, filling: HTMLElement, totWidth: number) {
    // Change .filling-line length according to the selected event
    const eventStyle = window.getComputedStyle(selectedEvent);
    const eventLeft = parseInt(eventStyle.getPropertyValue('left'));
    const eventWidth = parseInt(eventStyle.getPropertyValue('width'));
    const scaleValue = eventLeft / totWidth;
    this.setTransformValue(filling, 'scaleX', scaleValue.toString());
  }

  setDatePosition(timelineComponents: any, min: number) {
    timelineComponents.timelineEvents.forEach((eventItem: HTMLElement, index: number) => {
      const distance = this.daydiff(timelineComponents.timelineDates[0], timelineComponents.timelineDates[index]);
      const distanceNorm = Math.round(distance / timelineComponents.eventsMinLapse) + 2;
      eventItem.style.left = (distanceNorm * min) + 'px';
    });
  }

  setTimelineWidth(timelineComponents: any, width: number) {
    if (!timelineComponents.timelineDates || timelineComponents.timelineDates.length === 0) {
      return 0; // or handle this case according to your requirement
    }
  
    const timeSpan = this.daydiff(timelineComponents.timelineDates[0], timelineComponents.timelineDates[timelineComponents?.timelineDates?.length - 1]);
    const timeSpanNorm = Math.round(timeSpan / timelineComponents.eventsMinLapse) + 4;
    const totalWidth = timeSpanNorm * width;
  
    if (timelineComponents.eventsWrapper) {
      timelineComponents.eventsWrapper.style.width = totalWidth + 'px';
    }
  
    if (timelineComponents.timelineEvents && timelineComponents.timelineEvents.length > 0) {
      this.updateFilling(timelineComponents.timelineEvents[0], timelineComponents.fillingLine, totalWidth);
    }
  
    return totalWidth;
  }
  

  updateVisibleContent(event: HTMLElement, eventsContent: HTMLElement) {
    const eventDate = event.dataset['date'];
    const visibleContent = eventsContent.querySelector('.selected') as HTMLElement;
    const selectedContent = eventsContent.querySelector(`[data-date="${eventDate}"]`) as HTMLElement;
    const selectedContentHeight = selectedContent ? selectedContent.offsetHeight : 0;
  
    if (selectedContent && visibleContent) {
      if (selectedContent.compareDocumentPosition(visibleContent) & Node.DOCUMENT_POSITION_PRECEDING) {
        selectedContent.classList.add('selected', 'enter-right');
        visibleContent.classList.add('leave-left');
      } else {
        selectedContent.classList.add('selected', 'enter-left');
        visibleContent.classList.add('leave-right');
      }
  
      setTimeout(() => {
        visibleContent.classList.remove('selected', 'leave-left', 'leave-right');
        selectedContent.classList.remove('enter-left', 'enter-right');
      }, 300);
  
      eventsContent.style.height = selectedContentHeight + 'px';
    }
  }
  

  // updateOlderEvents(event: HTMLElement) {
  //   const allEvents = event.parentElement.parentElement.querySelectorAll('a');
  //   allEvents.forEach((eventItem: HTMLElement) => {
  //     if (eventItem === event) {
  //       eventItem.classList.remove('older-event');
  //     } else {
  //       eventItem.classList.add('older-event');
  //     }
  //   });
  // }

  getTranslateValue(timeline: HTMLElement) {
    const timelineStyle = window.getComputedStyle(timeline);
    let timelineTranslate = timelineStyle.transform;

    if (!timelineTranslate) {
      return 0;
    }

    timelineTranslate = timelineTranslate.split('(')[1];
    timelineTranslate = timelineTranslate.split(')')[0];
    // timelineTranslate = timelineTranslate.split(',');
    return parseInt(timelineTranslate[4]);
  }

  setTransformValue(element: HTMLElement, property: string, value: string) {
    this.renderer.setStyle(element, 'transform', `${property}(${value})`);
    this.renderer.setStyle(element, '-webkit-transform', `${property}(${value})`);
    this.renderer.setStyle(element, '-moz-transform', `${property}(${value})`);
    this.renderer.setStyle(element, '-ms-transform', `${property}(${value})`);
    this.renderer.setStyle(element, '-o-transform', `${property}(${value})`);
  }

  // parseDate(events: NodeListOf<Element> | undefined) {
  //   const dateArrays: Date[] = [];
  //   if (events) {
  //     events.forEach(event => {
  //       const dateComp = (event as HTMLElement).dataset.date.split('/');
  //       const newDate = new Date(parseInt(dateComp[2]), parseInt(dateComp[1]) - 1, parseInt(dateComp[0]));
  //       dateArrays.push(newDate);
  //     });
  //   }
  //   return dateArrays;
  // }
  

  daydiff(first: Date, second: Date) {
    return Math.round((second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
  }

  minLapse(dates: Date[]) {
    // Determine the minimum distance among events
    const dateDistances: number[] = [];
    if (dates){
      for (let i = 1; i < dates.length; i++) {
        const distance = this.daydiff(dates[i - 1], dates[i]);
        dateDistances.push(distance);
      }
    }
    
    return Math.min(...dateDistances);
  }

  elementInViewport(el: any) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // checkMQ() {
  //   // Check if mobile or desktop device
  //   const content = window.getComputedStyle(document.querySelector('.cd-horizontal-timeline'), '::before').getPropertyValue('content');
  //   return content.replace(/"/g, '').replace(/'/g, '');
  // }
}

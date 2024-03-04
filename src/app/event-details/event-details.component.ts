import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
})
export class EventDetailsComponent {
  @Input() event: any;
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit(){
  }

  onClose(): void {
    this.close.emit();
  }
}

import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.scss'
})
export class SearchFilterComponent {
  searchTerm: string = '';
  @Output() searchEvent: EventEmitter<string> = new EventEmitter<string>();

  onSearch() {
    this.searchEvent.emit(this.searchTerm);
  }
}

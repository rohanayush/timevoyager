import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'timevoyager';
  events:any[]=[];
  ngOnInit(){
    localStorage.clear();
    this.events = [
      { content:'Ordered', date:'15/02/201 10:30', status:'R' },
      { content:'Processing', date:'15/02/201 14:00', status:'R' },
      { content:'Shipped',  },
      { content:'Delivered',  },
    ]
  }

  ngOnDestroy(): void {
    // Clear localStorage and sessionStorage
    localStorage.clear();
  }
}

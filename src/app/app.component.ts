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
  ngOnInit(){
    localStorage.clear();
  }

  ngOnDestroy(): void {
    // Clear localStorage and sessionStorage
    localStorage.clear();
  }
}

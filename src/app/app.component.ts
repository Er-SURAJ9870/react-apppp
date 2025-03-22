import { Component ,ElementRef, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { PopoverService } from './popover.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'admindashboard';
  constructor(
    private elementRef: ElementRef,  public  _router: Router,
    private popoverService: PopoverService
  ) { }

  ngOnInit() {

    var s = document.createElement("script");
    s.type = "text/javascript";
    s.src = "../assets/js/main.js";
    this.elementRef.nativeElement.appendChild(s);
  }
  ngAfterViewInit(): void {
    this.popoverService.enableGlobalPopovers();
  }
  
}


import { Injectable, Renderer2, ElementRef } from '@angular/core';
declare var bootstrap: any;

@Injectable({
  providedIn: 'root',
})
export class PopoverService {
  constructor() {}

  enableGlobalPopovers() {
    const popoverTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="popover"]')
    );

    popoverTriggerList.map((popoverTriggerEl: any) => {
      return new bootstrap.Popover(popoverTriggerEl);
    });
  }
}


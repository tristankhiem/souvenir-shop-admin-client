import {AfterViewInit, Component} from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
})
export class LayoutComponent implements AfterViewInit {
  constructor() {
    $('body').removeClass('login-page adi-background-guest');
  }

  ngAfterViewInit(): void {
    $('body').Layout('fixLayoutHeight');
  }
}

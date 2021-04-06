import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html'
})
export class DropdownMenuComponent {
  @Input() title;

  public menuId = 'dropdown_menu_' + Math.floor(new Date().getTime() * Math.random());
}

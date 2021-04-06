import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {EmployeeModel} from '../../data-services/employee-model';
import {CurrentUserService} from '../../services/district/current-user.service';
import {Router} from '@angular/router';
import {Component} from '@angular/core';
import {AUTH_CONSTANT} from '../../constants/auth.constant';

@Component({
  selector: 'app-user-profile',
  templateUrl: './app-user-profile.component.html'
})
export class AppUserProfileComponent {
  public fullName: string;

  constructor(
    private router: Router,
    private currentUserService: CurrentUserService,
  ) {
    this.fullName = currentUserService.getFullName();
  }
  public search: BaseSearchModel<EmployeeModel[]> = new BaseSearchModel<EmployeeModel[]>();

  public logout(): void {
    localStorage.removeItem(AUTH_CONSTANT.AUTH_KEY);
    this.router.navigateByUrl('/dang-nhap');
  }

  public changePassword(event: Event): void {
    event.preventDefault();
    this.router.navigateByUrl('/thay-doi-mat-khau');
  }
}

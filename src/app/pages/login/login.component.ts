import {AppAlert, AppLoading} from '../../utils';
import {Router} from '@angular/router';
import {AfterViewInit, Component} from '@angular/core';
import {AUTH_CONSTANT} from '../../constants/auth.constant';
import {LoginModel} from '../../data-services/login.model';
import {ResponseModel} from '../../data-services/response.model';
import {JwtResponseModel} from '../../data-services/jwt-response.model';
import {HTTP_CODE_CONSTANT} from '../../constants/http-code.constant';
import {EmployeeAuthService} from '../../services/store/employee-auth.service';
import {CurrentUserService} from '../../services/store/current-user.service';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements AfterViewInit {
  public loginModel: LoginModel = new LoginModel();

  constructor(
    private loading: AppLoading,
    private alert: AppAlert,
    private employeeAuthService: EmployeeAuthService,
    private router: Router,
    private currentUserService: CurrentUserService
  ) {
    $('body').addClass('login-page adi-background-guest');
  }

  ngAfterViewInit(): void {
  }

  public enterEvent($keyBoard: KeyboardEvent = null): void {
    if ($keyBoard != null && $keyBoard.key === 'Enter') {
      this.login();
    }
  }

  public login(): void {
    this.loading.show();
    this.employeeAuthService.login(this.loginModel).subscribe(res => this.loginCompleted(res));
  }

  private loginCompleted(res: ResponseModel<JwtResponseModel>): void {
    this.loading.hide();
    if (res.status !== HTTP_CODE_CONSTANT.OK) {
      res.message.forEach(value => {
        this.alert.error(value);
      });
      return;
    }

    const user = res.result.user;
    this.currentUserService.setUser(user);
    localStorage.setItem(AUTH_CONSTANT.USER_DATA, JSON.stringify(user));

    this.router.navigateByUrl('/trang-chu');
  }
}

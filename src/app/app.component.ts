import {Component, OnInit} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {CurrentUserService} from './services/store/current-user.service';
import {AUTH_CONSTANT} from './constants/auth.constant';
import {RouterPermissionMappingModel} from './data-components/router-permission-mapping.model';
import {ROUTER_USER_PERMISSION_MAPPER} from './constants/user-permission.constant';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Quản lý đô thị';

  private anonymousUrls = [
    '/dang-nhap',
    '/404',
    '/403'
  ];

  constructor(
    private router: Router,
    private currentUserService: CurrentUserService
  ) {
  }

  ngOnInit(): void {
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.handleNavigation(event);
        }
      });
  }

  private handleNavigation(event: NavigationStart): void {
    const auth = localStorage.getItem(AUTH_CONSTANT.AUTH_KEY);
    const notAuth = !auth || auth === 'undefined';
    const isIgnoreAuth = this.isIgnoreAuth(event.url);
    if (notAuth) {
      this.handleNotAuth(isIgnoreAuth);
    } else {
      this.handleAuth(event.url, isIgnoreAuth);
    }
  }

  private handleNotAuth(isIgnoreAuth: boolean): void {
    if (!isIgnoreAuth) {
      this.router.navigateByUrl('/dang-nhap');
    }
  }

  private handleAuth(url: string, isIgnoreAuth: boolean): void {
    // Navigate after signin
    if (url === '/dang-nhap') {
      this.router.navigateByUrl('/trang-chu');
      return;
    }
    if (!isIgnoreAuth) {
      if (!this.hasPermission(url)) {
        this.router.navigateByUrl('/403');
      }
    }
  }

  private hasPermission(url: string): boolean {
    const permissionMapping = this.getByRouterLink(url);

    if (permissionMapping === null) {
      return false;
    }
    return this.currentUserService.hasPermissionList(permissionMapping.permissions);
  }

  private getByRouterLink(routerLink: string): RouterPermissionMappingModel {
    const index = ROUTER_USER_PERMISSION_MAPPER.findIndex(value => {
      let result = false;
      if (value.matchUrl) {
        const pattern = `^${value.matchUrl}`;
        const reg = new RegExp(pattern);
        result = reg.test(routerLink);
      }
      return value.routerLink === routerLink || result;
    });

    return index !== -1 ? new RouterPermissionMappingModel(ROUTER_USER_PERMISSION_MAPPER[index]) : null;
  }

  private isIgnoreAuth(url: string): boolean {
    return  this.anonymousUrls.indexOf(url) !== -1;
  }
}

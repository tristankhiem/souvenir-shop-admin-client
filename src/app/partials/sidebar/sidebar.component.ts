import {Component, AfterContentChecked, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CurrentUserService} from '../../services/store/current-user.service';
import {ROUTER_USER_PERMISSION_MAPPER, USER_PERMISSION_CODE} from '../../constants/user-permission.constant';
import {RouterPermissionMappingModel} from '../../data-components/router-permission-mapping.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements AfterContentChecked, OnInit {
  constructor(
    private router: Router,
    private currentUserService: CurrentUserService
  ) {
  }

  public employeeGroups: RouterPermissionMappingModel[] = [];
  public customerGroups: RouterPermissionMappingModel[] = [];
  public productGroups: RouterPermissionMappingModel[] = [];
  public supplierGroups: RouterPermissionMappingModel[] = [];
  public transactionGroups: RouterPermissionMappingModel[] = [];
  ngOnInit(): void {
    this.collectData();
  }

  ngAfterContentChecked(): void {}

  public isActive(): boolean {
    return this.router.url === '/' || this.router.url === '/trang-chu';
  }

  private collectData(): void {
    const permissions = this.currentUserService.getPermissions();
    for (const item of permissions) {
      const mapper = this.getPermissionMapping(item);
      switch (item) {
        case USER_PERMISSION_CODE.EMPLOYEE_MANAGEMENT:
          this.employeeGroups = this.employeeGroups.concat(mapper);
          break;
        case USER_PERMISSION_CODE.CUSTOMER_MANAGEMENT:
          this.customerGroups = this.customerGroups.concat(mapper);
          break;
        case USER_PERMISSION_CODE.PRODUCT_MANAGEMENT:
          this.productGroups = this.productGroups.concat(mapper);
          break;
        case USER_PERMISSION_CODE.SUPPLIER_MANAGEMENT:
          this.supplierGroups = this.supplierGroups.concat(mapper);
          break;
        case USER_PERMISSION_CODE.TRANSACTION_MANAGEMENT:
          this.transactionGroups = this.transactionGroups.concat(mapper);
          break;
      }
    }

    this.employeeGroups.sort(this.sortItems);
    this.customerGroups.sort(this.sortItems);
    this.productGroups.sort(this.sortItems);
    this.supplierGroups.sort(this.sortItems);
    this.transactionGroups.sort(this.sortItems);
  }

  private getPermissionMapping(permissionCode: string): RouterPermissionMappingModel[] {
    const result: RouterPermissionMappingModel[] = [];
    for (const item of ROUTER_USER_PERMISSION_MAPPER) {
      // find routes which match PermissionCode
      const ind = item.permissions.findIndex(value => {
        return value === permissionCode;
      });

      // add to array if valid conditions
      if (item.isMenu && ind !== -1) {
        result.push(new RouterPermissionMappingModel(item));
      }
    }

    return result;
  }

  private sortItems(a: RouterPermissionMappingModel, b: RouterPermissionMappingModel): number {
    if ( a.sort < b.sort ){
      return -1;
    }
    if ( a.sort > b.sort ){
      return 1;
    }
    return 0;
  }
}


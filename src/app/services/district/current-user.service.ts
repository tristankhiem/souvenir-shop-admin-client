import {Injectable} from '@angular/core';
import {UserModel} from '../../data-services/user.model';
import {AUTH_CONSTANT} from '../../constants/auth.constant';
import {WardModel} from '../../data-services/ward.model';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private user: UserModel;

  constructor() {
    if (!this.user) {
      if (localStorage.getItem(AUTH_CONSTANT.USER_DATA)) {
        this.user = new UserModel(JSON.parse(localStorage.getItem(AUTH_CONSTANT.USER_DATA)));
      } else {
        this.user = new UserModel();
      }
    }
  }

  public getId(): string {
    return this.user.id;
  }

  public getEmail(): string {
    return this.user.email;
  }

  public getFullName(): string {
    return this.user.fullName;
  }

  public getEmployeeGroupName(): string {
    return this.user.employeeGroup.name;
  }

  public getPermissions(): string[] {
    return this.user.permissions;
  }

  public getWards(): WardModel[] {
    return this.user.wards;
  }

  public setUser(userModel: UserModel): void {
    this.user = new UserModel(userModel);
  }

  public hasPermissionList(permissionCode: string[]): boolean {
    if (permissionCode.length === 0) {
      return true;
    }

    for (const item of permissionCode) {
      if (this.hasPermission(item)) {
        return true;
      }
    }

    return false;
  }

  public hasPermission(permissionCode: string): boolean {
    const index = this.user.permissions.findIndex(value => {
      return value === permissionCode;
    });

    if (index !== -1) {
      return true;
    }

    return false;
  }
}

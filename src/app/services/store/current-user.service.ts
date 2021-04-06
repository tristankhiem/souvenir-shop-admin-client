import {Injectable} from '@angular/core';
import {AUTH_CONSTANT} from '../../constants/auth.constant';
import {UserModel} from '../../data-services/schema/user.model';

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

  public getId(): number {
    return this.user.id;
  }

  public getUsername(): string {
    return this.user.username;
  }

  public getName(): string {
    return this.user.name;
  }

  public getPermissions(): string[] {
    return this.user.permissions;
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

import {PermissionModel} from './permission.model';

export class GrantPermissionModel {
  public id = 0;
  public roleId = 0;
  public permission: PermissionModel;

  constructor(data?: GrantPermissionModel) {
    const grantPermission = data == null ? this : data;
    this.id = grantPermission.id;
    this.roleId = grantPermission.roleId;
    this.permission = new PermissionModel(grantPermission.permission);
  }
}

import {GrantPermissionModel} from './grant-permission.model';
import {RoleModel} from './role.model';

export class RoleFullModel extends RoleModel {
  public grantPermissions: GrantPermissionModel[];

  public constructor(
    data?: RoleFullModel
  ) {
    super(data);
    const roleFull = data == null ? this : data;

    const grantPermissions = roleFull.grantPermissions || [];
    this.grantPermissions = [];
    for (const grantPermission of grantPermissions) {
      this.grantPermissions.push(new GrantPermissionModel(grantPermission));
    }
  }
}

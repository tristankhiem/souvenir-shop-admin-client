import {CustomerGroupModel} from './customer-group.model';
import {CustomerGrantPermissionModel} from './customer-grant-permission.model';

export class CustomerGroupFullModel extends CustomerGroupModel{
  public customerGrantPermissions: CustomerGrantPermissionModel[];

  constructor(data?: CustomerGroupFullModel) {
    super(data);
    const customerGroupFull = data == null ? this : data;

    const customerGrantPermissions = customerGroupFull.customerGrantPermissions || [];
    this.customerGrantPermissions = [];
    for (const grantPermission of customerGrantPermissions) {
      this.customerGrantPermissions.push(new CustomerGrantPermissionModel(grantPermission));
    }
  }
}

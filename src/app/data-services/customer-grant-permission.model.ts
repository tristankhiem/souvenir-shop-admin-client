import {CustomerPermissionModel} from './customer-permission.model';

export class CustomerGrantPermissionModel {
  public id = 0;
  public customerGroupId = 0;
  public customerPermission: CustomerPermissionModel;

  constructor(data?: CustomerGrantPermissionModel) {
    const customerGrantPermission = data == null ? this : data;
    this.id = customerGrantPermission.id;
    this.customerGroupId = customerGrantPermission.customerGroupId;
    this.customerPermission = new CustomerPermissionModel(customerGrantPermission.customerPermission);
  }
}

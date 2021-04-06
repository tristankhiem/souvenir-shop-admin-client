import {WardModel} from './ward.model';

export class WardPermissionModel {
  public id: number;
  public ward: WardModel;

  constructor(data?: WardPermissionModel) {
    const wardPermissions = data == null ? this : data;

    this.id = wardPermissions.id;
    this.ward = new WardModel(wardPermissions.ward);
  }
}

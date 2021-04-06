import {WardModel} from './ward.model';
import {EmployeeGroupModel} from './employee-group.model';

export class UserModel {
  public id: string;
  public fullName: string;
  public email: string;
  public employeeGroup: EmployeeGroupModel;
  public permissions: string[];
  public wards: WardModel[];

  public constructor(
    data?: UserModel
  ) {
    const user = data == null ? this : data;

    this.id = user.id;
    this.fullName = user.fullName || 'Guest';
    this.email = user.email;
    this.employeeGroup = new EmployeeGroupModel(user.employeeGroup);
    this.permissions = user.permissions || [];
    this.wards = user.wards || [];
  }
}

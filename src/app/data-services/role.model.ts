import {EmployeeGroupModel} from './employee-group.model';

export class RoleModel {
  public id: number;
  public name: string;
  public employeeGroup: EmployeeGroupModel;
  public createdDate: string;
  public updatedDate: string;

  public constructor(
    data?: RoleModel
  ) {
    const role = data == null ? this : data;

    this.id = role.id;
    this.name = role.name;
    this.employeeGroup = new EmployeeGroupModel(role.employeeGroup);
    this.createdDate = role.createdDate;
    this.updatedDate = role.updatedDate;
  }
}

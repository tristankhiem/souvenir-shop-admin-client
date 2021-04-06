import {EmployeeGroupModel} from './employee-group.model';

export class PermissionModel {
  public code: string;
  public name: string;
  public employeeGroup: EmployeeGroupModel;
  public description: string;
  public createdDate: string;
  public updatedDate: string;

  constructor(data?: PermissionModel) {
    const permission = data == null ? this : data;
    this.code = permission.code;
    this.name = permission.name;
    this.employeeGroup = new EmployeeGroupModel(permission.employeeGroup);
    this.description = permission.description;
    this.createdDate = permission.createdDate;
    this.updatedDate = permission.updatedDate;
  }
}

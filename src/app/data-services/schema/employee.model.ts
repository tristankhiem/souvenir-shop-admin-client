import {RoleModel} from './role.model';
export class EmployeeModel {
  public id: number;
  public name: string;
  public email: string;
  public password: string;
  public birthDate: number;
  public role: RoleModel = new RoleModel();

  public constructor(
    data?: EmployeeModel
  ) {
    const employee = data == null ? this : data;

    this.id = employee.id;
    this.name = employee.name;
    this.email = employee.email;
    this.password = employee.password;
    this.birthDate = employee.birthDate;
    this.role = new RoleModel(employee.role);
  }
}

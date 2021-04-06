import {EmployeeGroupModel} from './employee-group.model';
import {RoleModel} from './role.model';
import {WardPermissionModel} from './ward-permission.model';

export class EmployeeModel {
  public id: string;
  public fullName: string;
  public fullNameSlug: string;
  public cardId: string;
  public email: string;
  public password: string;
  public phone: string;
  public birthDate: number;
  public employeeGroup: EmployeeGroupModel = new EmployeeGroupModel();
  public wardPermissions: WardPermissionModel[] = [];
  public role: RoleModel = new RoleModel();
  public createdDate: string;
  public updatedDate: string;

  public constructor(
    data?: EmployeeModel
  ) {
    const employee = data == null ? this : data;

    this.id = employee.id;
    this.fullName = employee.fullName;
    this.fullNameSlug = employee.fullNameSlug;
    this.cardId = employee.cardId;
    this.email = employee.email;
    this.password = employee.password;
    this.phone = employee.phone;
    this.birthDate = employee.birthDate;
    this.employeeGroup = new EmployeeGroupModel(employee.employeeGroup);
    this.role = new RoleModel(employee.role);
    this.createdDate = employee.createdDate;
    this.updatedDate = employee.updatedDate;

    const tempWardPermission = employee.wardPermissions || [];
    this.wardPermissions = [];
    for (const ward of tempWardPermission) {
      this.wardPermissions.push(new WardPermissionModel(ward));
    }
  }
}

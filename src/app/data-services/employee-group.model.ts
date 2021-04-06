export class EmployeeGroupModel {
  public id: number;
  public name: string;
  public constructor(
    data?: EmployeeGroupModel
  ) {
    const employeeGroup = data == null ? this : data;

    this.id = employeeGroup.id;
    this.name = employeeGroup.name;
  }
}

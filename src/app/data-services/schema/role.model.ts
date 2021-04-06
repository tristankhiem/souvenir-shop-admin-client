export class RoleModel {
  public id: number;
  public name: string;

  public constructor(
    data?: RoleModel
  ) {
    const role = data == null ? this : data;

    this.id = role.id;
    this.name = role.name;
  }
}


export class PermissionModel {
  public code: string;
  public name: string;

  constructor(data?: PermissionModel) {
    const permission = data == null ? this : data;
    this.code = permission.code;
    this.name = permission.name;
  }
}


export class PermissionModel {
  public id: string;
  public code: string;
  public description: string;

  constructor(data?: PermissionModel) {
    const permission = data == null ? this : data;
    this.id = permission.id;
    this.code = permission.code;
    this.description = permission.description;
  }
}

export class CustomerPermissionModel {
  public code: string;
  public name: string;
  public description: string;
  public createdDate: string;
  public updatedDate: string;

  constructor(data?: CustomerPermissionModel) {
    const customerPermission = data == null ? this : data;
    this.code = customerPermission.code;
    this.name = customerPermission.name;
    this.description = customerPermission.description;
    this.createdDate = customerPermission.createdDate;
    this.updatedDate = customerPermission.updatedDate;
  }
}

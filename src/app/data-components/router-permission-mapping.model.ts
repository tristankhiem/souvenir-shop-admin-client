export class RouterPermissionMappingModel {
  public routerLink: string;
  public matchUrl: string;
  public name: string;
  public icon: string;
  public permissions: string[];
  public sort: number;
  public isMenu: boolean;

  constructor(data?: RouterPermissionMappingModel) {
    const mapping = data == null ? this : data;
    this.routerLink = mapping.routerLink;
    this.matchUrl = mapping.matchUrl;
    this.name = mapping.name;
    this.icon = mapping.icon;
    this.sort = mapping.sort;
    this.isMenu = mapping.isMenu;

    this.permissions = [];
    const permissions = mapping.permissions || [];
    for (const item of permissions) {
      this.permissions.push(item);
    }
  }

}

export class ZoningTypeModel {
  public id: number;
  public name: string;
  public nameSlug: string;

  public constructor(
    data?: ZoningTypeModel
  ) {
    const zoningType = data == null ? this : data;

    this.id = zoningType.id;
    this.name = zoningType.name;
    this.nameSlug = zoningType.nameSlug;
  }
}

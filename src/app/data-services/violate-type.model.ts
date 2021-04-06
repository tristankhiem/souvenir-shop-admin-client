export class ViolateTypeModel {
  public id: number;
  public name: string;

  public constructor(
    data?: ViolateTypeModel
  ) {
    const violateType = data == null ? this : data;

    this.id = violateType.id;
    this.name = violateType.name;
  }
}

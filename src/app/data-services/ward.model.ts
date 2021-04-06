export class WardModel {
  public id: number;
  public name: string;

  public constructor(
    data?: WardModel
  ) {
    const ward = data == null ? this : data;

    this.id = ward.id;
    this.name = ward.name;
  }
}

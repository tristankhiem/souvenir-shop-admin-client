export class ColorModel {
  public id: number;
  public name: string;

  public constructor(
    data?: ColorModel
  ) {
    const color = data == null ? this : data;

    this.id = color.id;
    this.name = color.name;
  }
}

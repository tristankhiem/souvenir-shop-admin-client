export class DrawingTypeModel {
  public id: number;
  public name: string;

  constructor(data?: DrawingTypeModel) {
    const drawingType = data == null ? this : data;

    this.id = drawingType.id;
    this.name = drawingType.name;
  }
}

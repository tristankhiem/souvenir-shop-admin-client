import {ZoningBaseModel} from './zoning-base.model';

export class BaseCoordinateModel {
  public id: number;
  public zoningBase: ZoningBaseModel;
  public xcoordinate: number;
  public ycoordinate: number;

  constructor(
    data?: BaseCoordinateModel
  ) {
    const baseCoordinate = data == null ? this : data;

    this.id = baseCoordinate.id;
    this.zoningBase = new ZoningBaseModel(baseCoordinate.zoningBase);
    this.xcoordinate = baseCoordinate.xcoordinate;
    this.ycoordinate = baseCoordinate.ycoordinate;
  }
}

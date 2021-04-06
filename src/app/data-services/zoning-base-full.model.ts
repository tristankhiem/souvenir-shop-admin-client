import {ZoningBaseModel} from './zoning-base.model';
import {BaseCoordinateModel} from './base-coordinate.model';

export class ZoningBaseFullModel extends ZoningBaseModel {
  public baseCoordinates: BaseCoordinateModel[] = [];

  constructor(data?: ZoningBaseFullModel) {
    super(data);
    const zoningBaseFull = data == null ? this : data;

    this.baseCoordinates = [];
    const tempCoordinates = zoningBaseFull.baseCoordinates || [];
    for (const coordinate of tempCoordinates) {
      this.baseCoordinates.push(new BaseCoordinateModel(coordinate));
    }
  }
}

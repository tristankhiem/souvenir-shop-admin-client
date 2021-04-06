import {ZoningTypeModel} from './zoning-type.model';
import {WardModel} from './ward.model';

export class ZoningBaseModel {
  public id: number;
  public zoningType: ZoningTypeModel;
  public ward: WardModel;
  public area: number;
  public description: string;

  constructor(
    data?: ZoningBaseModel
  ) {
    const zoningBase = data == null ? this : data;

    this.id = zoningBase.id;
    this.zoningType = new ZoningTypeModel(zoningBase.zoningType);
    this.ward = new WardModel(zoningBase.ward);
    this.area = zoningBase.area;
    this.description = zoningBase.description;
  }
}

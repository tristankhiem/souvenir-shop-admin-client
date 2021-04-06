import {ZoningSearchModel} from './zoning-search.model';
import {ZoningBaseModel} from './zoning-base.model';
import {ZoningTypeModel} from './zoning-type.model';

export class ZoningSearchDetailModel {
  public id: number;
  public zoningSearch: ZoningSearchModel;
  public zoningBase: ZoningBaseModel;
  public zoningType: ZoningTypeModel;
  public area: number;

  constructor(data?: ZoningSearchDetailModel) {
    const zoningSearchDetail = data == null ? this : data;

    this.id = zoningSearchDetail.id;
    this.zoningSearch = new ZoningSearchModel(zoningSearchDetail.zoningSearch);
    this.zoningBase = new ZoningBaseModel(zoningSearchDetail.zoningBase);
    this.zoningType = new ZoningTypeModel(zoningSearchDetail.zoningType);
    this.area = zoningSearchDetail.area;
  }
}

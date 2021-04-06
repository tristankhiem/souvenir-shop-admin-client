import {ZoningInformationModel} from './zoning-information.model';
import {ZoningBaseModel} from './zoning-base.model';
import {ZoningTypeModel} from './zoning-type.model';

export class ZoningInformationDetailModel {
  public zoningInformation: ZoningInformationModel;
  public zoningBase: ZoningBaseModel;
  public zoningType: ZoningTypeModel;
  public area: number;

  constructor(data?: ZoningInformationDetailModel) {
    const zoningInformationDetail = data == null ? this : data;

    this.zoningInformation = new ZoningInformationModel(zoningInformationDetail.zoningInformation);
    this.zoningBase = new ZoningBaseModel(zoningInformationDetail.zoningBase);
    this.zoningType = new ZoningTypeModel(zoningInformationDetail.zoningType);
    this.area = zoningInformationDetail.area;
  }
}

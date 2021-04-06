import {WardModel} from './ward.model';

export class ZoningSearchModel {
  public id: number;
  public ward: WardModel;
  public address: string;
  public sheet: number;
  public parcel: number;
  public area: number;
  public createdDate: string;
  public updatedDate: string;

  constructor(data?: ZoningSearchModel) {
    const zoningSearch = data == null ? this : data;

    this.id = zoningSearch.id;
    this.ward = new WardModel(zoningSearch.ward);
    this.address = zoningSearch.address;
    this.sheet = zoningSearch.sheet;
    this.parcel = zoningSearch.parcel;
    this.area = zoningSearch.area;
    this.createdDate = zoningSearch.createdDate;
    this.updatedDate = zoningSearch.updatedDate;
  }
}

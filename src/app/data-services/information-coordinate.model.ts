import {ZoningInformationModel} from './zoning-information.model';

export class InformationCoordinateModel {
  public id: number;
  public zoningInformation: ZoningInformationModel;
  public xcoordinate: number;
  public ycoordinate: number;

  constructor(
    data?: InformationCoordinateModel
  ) {
    const informationCoordinate = data == null ? this : data;

    this.id = informationCoordinate.id;
    this.zoningInformation = new ZoningInformationModel(informationCoordinate.zoningInformation);
    this.xcoordinate = informationCoordinate.xcoordinate;
    this.ycoordinate = informationCoordinate.ycoordinate;
  }
}

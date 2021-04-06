import {ZoningInformationModel} from './zoning-information.model';
import {InformationCoordinateModel} from './information-coordinate.model';
import {ZoningInformationDetailModel} from './zoning-information-detail.model';

export class ZoningInformationFullModel extends ZoningInformationModel {
  public informationCoordinates: InformationCoordinateModel[] = [];
  public zoningInformationDetails: ZoningInformationDetailModel[] = [];

  constructor(data?: ZoningInformationFullModel) {
    super(data);
    const zoningInformationFull = data == null ? this : data;

    this.informationCoordinates = [];
    const tempInformationCoordinates = zoningInformationFull.informationCoordinates || [];
    for (const coordinate of tempInformationCoordinates) {
      this.informationCoordinates.push(new InformationCoordinateModel(coordinate));
    }

    this.zoningInformationDetails = [];
    const tempZoningInformationDetails = zoningInformationFull.zoningInformationDetails || [];
    for (const detail of tempZoningInformationDetails) {
      this.zoningInformationDetails.push(new ZoningInformationDetailModel(detail));
    }
  }
}

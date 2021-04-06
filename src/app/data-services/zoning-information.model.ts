import {WardModel} from './ward.model';
import {CertificateModel} from './certificate.model';
import {DrawingTypeModel} from './drawing-type.model';

export class ZoningInformationModel {
  public id: number;
  public ownerName: string;
  public ownerBirthDate: string;
  public ownerCardId: string;
  public ownerAddress: string;
  public phoneNumber: string;
  public ward: WardModel;
  public address: string;
  public certificate: CertificateModel;
  public certificateNumber: string;
  public certificateDate: string;
  public certificateProvider: string;
  public drawingType: DrawingTypeModel;
  public drawingNumber: string;
  public drawingDate: string;
  public drawingUnit: string;
  public sheet: number;
  public parcel: number;
  public area: number;
  public createdDate: string;
  public updatedDate: string;

  constructor(data?: ZoningInformationModel) {
    const zoningInfomation = data == null ? this : data;

    this.id = zoningInfomation.id;
    this.ownerName = zoningInfomation.ownerName;
    this.ownerBirthDate = zoningInfomation.ownerBirthDate;
    this.ownerCardId = zoningInfomation.ownerCardId;
    this.ownerAddress = zoningInfomation.ownerAddress;
    this.phoneNumber = zoningInfomation.phoneNumber;
    this.ward = new WardModel(zoningInfomation.ward);
    this.address = zoningInfomation.address;
    this.certificate = new CertificateModel(zoningInfomation.certificate);
    this.certificateNumber = zoningInfomation.certificateNumber;
    this.certificateDate = zoningInfomation.certificateDate;
    this.certificateProvider = zoningInfomation.certificateProvider;
    this.drawingType = new DrawingTypeModel(zoningInfomation.drawingType);
    this.drawingNumber = zoningInfomation.drawingNumber;
    this.drawingDate = zoningInfomation.drawingDate;
    this.drawingUnit = zoningInfomation.drawingUnit;
    this.sheet = zoningInfomation.sheet;
    this.parcel = zoningInfomation.parcel;
    this.area = zoningInfomation.area;
    this.createdDate = zoningInfomation.createdDate;
    this.updatedDate = zoningInfomation.updatedDate;
  }

}

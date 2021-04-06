import {ZoningSearchModel} from './zoning-search.model';
import {CertificateModel} from './certificate.model';
import {DrawingTypeModel} from './drawing-type.model';

export class ZoningSearchHistoryModel {
  public id: number;
  public zoningSearch: ZoningSearchModel;
  public customerId: string;
  public certificate: CertificateModel;
  public certificateNumber: string;
  public certificateDate: string;
  public certificateProvider: string;
  public drawingType: DrawingTypeModel;
  public drawingNumber: string;
  public drawingDate: string;
  public drawingUnit: string;
  public searchDate: string;

  constructor(data?: ZoningSearchHistoryModel) {
    const zoningSearchHistory = data == null ? this : data;

    this.id = zoningSearchHistory.id;
    this.zoningSearch = new ZoningSearchModel(zoningSearchHistory.zoningSearch);
    this.customerId = zoningSearchHistory.customerId;
    this.certificate = new CertificateModel(zoningSearchHistory.certificate);
    this.certificateNumber = zoningSearchHistory.certificateNumber;
    this.certificateDate = zoningSearchHistory.certificateDate;
    this.certificateProvider = zoningSearchHistory.certificateProvider;
    this.drawingType = new DrawingTypeModel(zoningSearchHistory.drawingType);
    this.drawingNumber = zoningSearchHistory.drawingNumber;
    this.drawingDate = zoningSearchHistory.drawingDate;
    this.drawingUnit = zoningSearchHistory.drawingUnit;
    this.searchDate = zoningSearchHistory.searchDate;
  }
}

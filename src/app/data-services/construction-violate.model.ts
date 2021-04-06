import {CertificateModel} from './certificate.model';
import {ViolateTypeModel} from './violate-type.model';
import {EmployeeModel} from './employee-model';
import {WardModel} from './ward.model';

export class ConstructionViolateModel {
  public id: number;
  public investorName: string;
  public investorBirthDate: number;
  public investorCardId: string;
  public investorCardDate: number;
  public cardIdProvider: string;
  public permanentAddress: string;
  public violateAddress: string;
  public ward: WardModel = new WardModel();
  public certificate: CertificateModel = new CertificateModel();
  public certificateNumber: string;
  public certificateDate: number;
  public certificateProvider: string;
  public reportNumber: string;
  public reportCreatedDate: number;
  public violateDate: number;
  public wardDocumentNumber: string;
  public wardDocumentCreatedDate: number;
  public violateDetail: string;
  public structure: string;
  public currentStatus: string;
  public violateArea: number;
  public fine: number;
  public solveProblem: string;
  public violateReceiptId: string;
  public violateReceiptDate: number;
  public violateType: ViolateTypeModel = new ViolateTypeModel();
  public employeeRequest: EmployeeModel = new EmployeeModel();
  public employeeHandle: EmployeeModel = new EmployeeModel();
  public status: string;
  public createdDate: number;
  public updatedDate: number;

  public constructor(
    data?: ConstructionViolateModel
  ) {
    const constructionViolate = data == null ? this : data;

    this.id = constructionViolate.id;
    this.investorName = constructionViolate.investorName;
    this.investorBirthDate = constructionViolate.investorBirthDate;
    this.investorCardId = constructionViolate.investorCardId;
    this.investorCardDate = constructionViolate.investorCardDate;
    this.cardIdProvider = constructionViolate.cardIdProvider;
    this.permanentAddress = constructionViolate.permanentAddress;
    this.violateAddress = constructionViolate.violateAddress;
    this.ward = new WardModel(constructionViolate.ward);
    this.certificate = new CertificateModel(constructionViolate.certificate);
    this.certificateNumber = constructionViolate.certificateNumber;
    this.certificateDate = constructionViolate.certificateDate;
    this.certificateProvider = constructionViolate.certificateProvider;
    this.reportNumber = constructionViolate.reportNumber;
    this.reportCreatedDate = constructionViolate.reportCreatedDate;
    this.violateDate = constructionViolate.violateDate;
    this.wardDocumentNumber = constructionViolate.wardDocumentNumber;
    this.wardDocumentCreatedDate = constructionViolate.wardDocumentCreatedDate;
    this.violateDetail = constructionViolate.violateDetail;
    this.structure = constructionViolate.structure;
    this.currentStatus = constructionViolate.currentStatus;
    this.violateArea = constructionViolate.violateArea;
    this.fine = constructionViolate.fine;
    this.solveProblem = constructionViolate.solveProblem;
    this.violateType = new ViolateTypeModel(constructionViolate.violateType);
    this.violateReceiptId = constructionViolate.violateReceiptId;
    this.violateReceiptDate = constructionViolate.violateReceiptDate;
    this.employeeRequest = new EmployeeModel(constructionViolate.employeeRequest);
    this.employeeHandle = new EmployeeModel(constructionViolate.employeeHandle);
    this.status = constructionViolate.status;
    this.createdDate = constructionViolate.createdDate;
    this.updatedDate = constructionViolate.updatedDate;
  }
}

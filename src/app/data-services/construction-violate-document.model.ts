import {ConstructionViolateModel} from './construction-violate.model';

export class ConstructionViolateDocumentModel {
  public id: number;
  public constructionViolate: ConstructionViolateModel;
  public documentReportId: number;
  public documentReportDate: number;
  public documentDecisionId: number;
  public documentDecisionDate: number;
  public documentReviewId: number;
  public documentReviewDate: number;
  public times: number;

  public constructor(
    data?: ConstructionViolateDocumentModel
  ) {
    const constructionViolateDocument = data == null ? this : data;

    this.id = constructionViolateDocument.id;
    this.constructionViolate = new ConstructionViolateModel(constructionViolateDocument.constructionViolate);
    this.documentReportId = constructionViolateDocument.documentReportId;
    this.documentReportDate = constructionViolateDocument.documentReportDate;
    this.documentDecisionId = constructionViolateDocument.documentDecisionId;
    this.documentDecisionDate = constructionViolateDocument.documentDecisionDate;
    this.documentReviewId = constructionViolateDocument.documentReviewId;
    this.documentReviewDate = constructionViolateDocument.documentReviewDate;
  }
}

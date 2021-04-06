import {ConstructionViolateModel} from './construction-violate.model';
import {EmployeeModel} from './employee-model';

export class FeedbackViolateModel {
  public id: number;
  public constructionViolate: ConstructionViolateModel = new ConstructionViolateModel();
  public comment: string;
  public employeeFeedback: EmployeeModel = new EmployeeModel();
  public createdDate: string;

  constructor(data?: FeedbackViolateModel) {
    const feedbackViolate = data == null ? this : data;

    this.id = feedbackViolate.id;
    this.constructionViolate = new ConstructionViolateModel(feedbackViolate.constructionViolate);
    this.comment = feedbackViolate.comment;
    this.employeeFeedback = new EmployeeModel(feedbackViolate.employeeFeedback);
    this.createdDate = feedbackViolate.createdDate;
  }
}

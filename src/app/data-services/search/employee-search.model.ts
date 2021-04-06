import {BaseSearchModel} from './base-search.model';
import {EmployeeModel} from '../employee-model';

export class EmployeeSearchModel extends BaseSearchModel<EmployeeModel[]> {
  public email: string;
  public phone: string;
  public fullName: string;
}

import {Injectable} from '@angular/core';
import {DistrictBaseService} from '../generic/district-base.service';
import {Observable} from 'rxjs';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {EmployeeGroupModel} from '../../data-services/employee-group.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeGroupService extends DistrictBaseService {
  public findAll(): Observable<any> {
    return this.get('/api/v1/employee-group/findAll', {});
  }

  public find(search: BaseSearchModel<EmployeeGroupModel[]>): Observable<any> {
    return this.post('/api/v1/employee-group/findAll', search);
  }

  public getEmployeeGroup(employeeGroupId: number): Observable<any> {
    return this.get('/api/v1/employee-group/' + employeeGroupId);
  }
}

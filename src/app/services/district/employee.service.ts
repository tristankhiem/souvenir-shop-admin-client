import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {EmployeeModel} from '../../data-services/employee-model';
import {DistrictBaseService} from '../generic/district-base.service';
import {ChangePasswordModel} from '../../data-services/change-password.model';
import {EmployeeSearchModel} from '../../data-services/search/employee-search.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends DistrictBaseService {
  public findAll(): Observable<any> {
    return this.get('/api/v1/employee/findAll', {});
  }

  public find(search: BaseSearchModel<EmployeeModel[]>): Observable<any> {
    return this.post('/api/v1/employee/findAll', search);
  }

  public getEmployee(employeeId: string): Observable<any> {
    return this.get('/api/v1/employee/' + employeeId);
  }

  public search(search: EmployeeSearchModel): Observable<any> {
    return this.post('/api/v1/employee/search', search);
  }

  public save(employee: EmployeeModel): Observable<any> {
    return this.post('/api/v1/employee/insert', employee);
  }

  public update(employee: EmployeeModel): Observable<any> {
    return this.put('/api/v1/employee/update', employee);
  }

  public deleteEmployee(employeeId: string): Observable<any> {
    return this.delete('/api/v1/employee/delete/' + employeeId);
  }

  public changePassword(changePassword: ChangePasswordModel): Observable<any> {
    return this.put('/api/v1/employee/change-password', changePassword);
  }
}

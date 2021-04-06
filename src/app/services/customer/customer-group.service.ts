import {Injectable} from '@angular/core';
import {CustomerBaseService} from '../generic/customer-base.service';
import {Observable} from 'rxjs';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {CustomerGroupModel} from '../../data-services/customer-group.model';
import {CustomerGroupFullModel} from '../../data-services/customer-group-full.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerGroupService extends CustomerBaseService{
  public findAll(): Observable<any> {
    return this.get('/api/v1/customer-group/findAll', {});
  }

  public find(search: BaseSearchModel<CustomerGroupModel[]>): Observable<any> {
    return this.post('/api/v1/customer-group/findAll', search);
  }

  public deleteCustomerGroup(customerGroupId: number): Observable<any> {
    return this.delete('/api/v1/customer-group/delete/' + customerGroupId);
  }

  public findAllCustomerPermission(): Observable<any> {
    return this.get('/api/v1/customer-group/findAllCustomerPermission', {});
  }

  public save(customerGroup: CustomerGroupFullModel): Observable<any> {
    return this.post('/api/v1/customer-group/insert', customerGroup);
  }

  public update(customerGroup: CustomerGroupFullModel): Observable<any> {
    return this.put('/api/v1/customer-group/update', customerGroup);
  }

  public getCustomerGroupFull(customerGroupId: number): Observable<any> {
    return this.get('/api/v1/customer-group/' + customerGroupId);
  }
}

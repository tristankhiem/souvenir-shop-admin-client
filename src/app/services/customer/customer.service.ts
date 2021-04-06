import {Injectable} from '@angular/core';
import {CustomerBaseService} from '../generic/customer-base.service';
import {Observable} from 'rxjs';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {CustomerModel} from '../../data-services/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends CustomerBaseService {
  public find(search: BaseSearchModel<CustomerModel[]>): Observable<any> {
    return this.post('/api/v1/customer/findAll', search);
  }

  public getCustomer(customerId: string): Observable<any> {
    return this.get('/api/v1/customer/' + customerId);
  }

  public deleteCustomer(customerId: string): Observable<any> {
    return this.delete('/api/v1/customer/delete', {id: customerId});
  }

  public lockCustomer(customerId: string): Observable<any> {
    return this.put('/api/v1/customer/lock/' + customerId);
  }

  public unlockCustomer(customerId: string): Observable<any> {
    return this.put('/api/v1/customer/unlock/' + customerId);
  }
}

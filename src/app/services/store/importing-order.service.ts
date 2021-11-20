import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {StoreBaseService} from '../generic/store-base.service';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {ImportingOrderModel} from '../../data-services/schema/importing-order.model';
import {ImportingOrderFullModel} from '../../data-services/schema/importing-order-full.model';

@Injectable({
  providedIn: 'root'
})
export class ImportingOrderService extends StoreBaseService {
  public search(search: BaseSearchModel<ImportingOrderModel[]>): Observable<any> {
    return this.post('/api/v1/importing-controller/search', search);
  }

  public getById(id: string): Observable<any> {
    return this.get('/api/v1/importing-controller/' + id);
  }

  public save(importingOrder: ImportingOrderFullModel): Observable<any> {
    return this.post('/api/v1/importing-controller/insert', importingOrder);
  }

  public update(importingOrder: ImportingOrderFullModel): Observable<any> {
    return this.put('/api/v1/importing-controller/update', importingOrder);
  }

  public deleteImportingOrder(id: number): Observable<any> {
    return this.delete('/api/v1/importing-controller/delete/' + id);
  }
}

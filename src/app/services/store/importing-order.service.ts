import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {StoreBaseService} from '../generic/store-base.service';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {ImportingOrderModel} from '../../data-services/schema/importing-order.model';

@Injectable({
  providedIn: 'root'
})
export class ImportingOrderService extends StoreBaseService {
  public search(search: BaseSearchModel<ImportingOrderModel[]>): Observable<any> {
    return this.post('/api/importingorder/search', search);
  }

  public getById(id: number): Observable<any> {
    return this.get('/api/importingorder/' + id);
  }

  public save(importingOrder: ImportingOrderModel): Observable<any> {
    return this.post('/api/importingorder/insert', importingOrder);
  }

  public update(importingOrder: ImportingOrderModel): Observable<any> {
    return this.put('/api/importingorder/update', importingOrder);
  }

  public deleteImportingOrder(id: number): Observable<any> {
    return this.delete('/api/importingorder/delete/' + id);
  }
}

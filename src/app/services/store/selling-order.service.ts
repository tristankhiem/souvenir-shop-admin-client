import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {StoreBaseService} from '../generic/store-base.service';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {SellingOrderModel} from '../../data-services/schema/selling-order.model';
import {SellingOrderFullModel} from '../../data-services/schema/selling-order-full.model';
import {RangeDateModel} from '../../data-services/schema/range-date.model';

@Injectable({
  providedIn: 'root'
})
export class SellingOrderService extends StoreBaseService {
  public search(search: BaseSearchModel<SellingOrderModel[]>): Observable<any> {
    return this.post('/api/sellingorder/search', search);
  }

  public getById(id: number): Observable<any> {
    return this.get('/api/sellingorder/' + id);
  }

  public save(sellingOrder: SellingOrderModel): Observable<any> {
    return this.post('/api/sellingorder/insert', sellingOrder);
  }

  public update(sellingOrder: SellingOrderFullModel): Observable<any> {
    return this.put('/api/sellingorder/update', sellingOrder);
  }

  public deleteSellingOrder(id: number): Observable<any> {
    return this.delete('/api/sellingorder/delete/' + id);
  }

  // tslint:disable-next-line:typedef
  public getMonthCost(rangeDate: RangeDateModel){
    return this.post('/api/sellingorder/get-month-cost', rangeDate);
  }
}

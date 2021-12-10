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
    return this.post('/api/v1/selling-order/search', search);
  }

  public getById(id: number): Observable<any> {
    return this.get('/api/v1/selling-order/get-by-id/' + id);
  }

  public save(sellingOrder: SellingOrderModel): Observable<any> {
    return this.post('/api/v1/selling-order/insert', sellingOrder);
  }

  public update(sellingOrder: SellingOrderFullModel): Observable<any> {
    return this.put('/api/v1/selling-order/update', sellingOrder);
  }

  public deleteSellingOrder(id: number): Observable<any> {
    return this.delete('/api/v1/selling-order/delete/' + id);
  }

  // tslint:disable-next-line:typedef
  public getMonthCost(rangeDate: RangeDateModel){
    return this.post('/api/v1/selling-order/get-month-cost', rangeDate);
  }

  public getDateRevenue(rangeDate: RangeDateModel){
    return this.post(`/api/v1/selling-order/getDateRevenue`, rangeDate);
  }

  public getMonthRevenue(rangeDate: RangeDateModel){
    return this.post(`/api/v1/selling-order/getMonthRevenue`, rangeDate);
  }

  public getYearRevenue(rangeDate: RangeDateModel){
    return this.post(`/api/v1/selling-order/getYearRevenue`, rangeDate);
  }
}

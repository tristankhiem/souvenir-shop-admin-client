import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {StoreBaseService} from '../generic/store-base.service';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {ProductDetailModel} from '../../data-services/schema/product-detail.model';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailService extends StoreBaseService {
  public search(search: BaseSearchModel<ProductDetailModel[]>): Observable<any> {
    return this.post('/api/productdetail/search', search);
  }

  public getById(id: number): Observable<any> {
    return this.get('/api/productdetail/' + id);
  }

  public save(productdetail: ProductDetailModel): Observable<any> {
    return this.post('/api/productdetail/insert', productdetail);
  }

  public update(productdetail: ProductDetailModel): Observable<any> {
    return this.put('/api/productdetail/update', productdetail);
  }

  public deleteProductDetail(id: number): Observable<any> {
    return this.delete('/api/productdetail/delete/' + id);
  }
}

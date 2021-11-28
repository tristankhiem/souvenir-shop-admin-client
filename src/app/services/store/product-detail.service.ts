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
    return this.post('/api/v1/product-detail/findAll', search);
  }

  public getLikeName(name: string): Observable<any> {
   // return this.get('/api/v1/product-detail/get-like-name/' + name);
   return this.get('/api/v1/product-detail/get-like-name/' , {name});
  }
  

  public getById(id: string): Observable<any> {
    return this.get('/api/v1/product-detail/' + id);
  }

  public save(productDetail: ProductDetailModel): Observable<any> {
    return this.post('/api/v1/product-detail/insert', productDetail);
  }

  public update(productDetail: ProductDetailModel): Observable<any> {
    return this.put('/api/v1/product-detail/update', productDetail);
  }

  public deleteProductDetail(id: string): Observable<any> {
    return this.delete('/api/v1/product-detail/delete/' + id);
  }

  public saveImage(productId: string, formData: FormData): Observable<any> {
    return this.post('/api/v1/product-detail/upload-image/' + productId, formData);
  }

  public deleteImage(productId: string): Observable<any> {
    return this.post('/api/v1/product-detail/delete-image/' + productId, null);
  }
}

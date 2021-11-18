import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {StoreBaseService} from '../generic/store-base.service';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {ProductModel} from '../../data-services/schema/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends StoreBaseService {
  public search(search: BaseSearchModel<ProductModel[]>): Observable<any> {
    return this.post('/api/v1/product/findAll', search);
  }

  public getById(id: number): Observable<any> {
    return this.get('/api/v1/product/' + id);
  }

  public getLikeName(name: string): Observable<any> {
    return this.get('/api/v1/product/get-like-name', {name});
  }

  public save(product: ProductModel): Observable<any> {
    return this.post('/api/v1/product/insert', product);
  }

  public update(product: ProductModel): Observable<any> {
    return this.put('/api/v1/product/update', product);
  }

  public deleteProduct(id: string): Observable<any> {
    return this.delete('/api/v1/product/delete/' + id);
  }

  public saveImage(productId: string, formData: FormData): Observable<any> {
    return this.post('/api/v1/product/upload-image/' + productId, formData);
  }

  public deleteImage(productId: string): Observable<any> {
    return this.post('/api/v1/product/delete-image/' + productId, null);
  }
}

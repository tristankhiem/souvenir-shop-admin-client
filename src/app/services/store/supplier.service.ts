import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {LoginModel} from '../../data-services/login.model';
import {StoreBaseService} from '../generic/store-base.service';
import {BaseSearchModel} from '../../data-services/search/base-search.model';
import {SupplierModel} from "../../data-services/schema/supplier.model";

@Injectable({
  providedIn: 'root'
})
export class SupplierService extends StoreBaseService {
  public search(search: BaseSearchModel<SupplierModel[]>): Observable<any> {
    return this.post('/api/supplier/search', search);
  }

  public getLikeName(name: string): Observable<any> {
    return this.get('/api/supplier/get-like-name/' + name);
  }

  public getById(id: number): Observable<any> {
    return this.get('/api/supplier/' + id);
  }

  public save(supplier: SupplierModel): Observable<any> {
    return this.post('/api/supplier/insert', supplier);
  }

  public update(supplier: SupplierModel): Observable<any> {
    return this.put('/api/supplier/update', supplier);
  }

  public deleteSupplier(id: number): Observable<any> {
    return this.delete('/api/supplier/delete/' + id);
  }
}
